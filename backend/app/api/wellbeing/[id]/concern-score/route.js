import connectDB from "@/lib/mongodb";
import Visit from "@/models/Visit";
import Elder from "@/models/Elder";
import Checker from "@/models/Checker";
import { computeConcernMetrics, applyOverride } from "@/lib/concernScore";
import { NextResponse } from "next/server";

// -----------------------------------------------------------------------
// AUTHORIZATION NOTE (read this before changing the checks below)
//
// This backend (the separate Next app on port 1078) does not currently
// verify a session or JWT on any route — every existing route (elders,
// checkers, visits, etc.) simply trusts whatever id is passed to it. There
// is no login endpoint for checkers yet, and the frontend's NextAuth
// session is a demo credentials provider that isn't checked against the
// database at all (see frontend/app/api/auth/[...nextauth]/route.js).
//
// Given that, the checks below do the one thing that IS possible today:
// verify the RELATIONSHIP between the caller-supplied id and the elder
// (familyMemberId match, or assignedCheckerId match) before allowing
// access. This follows the same trust model the rest of this backend
// already uses (e.g. GET /api/elders?familyMemberId=...).
//
// If/when real authentication is added (a checker login route, a verified
// session token), swap `familyMemberId`/`checkerId` below for the verified
// identity from that session instead of a client-supplied query
// param/body field. The relationship checks themselves won't need to
// change — only where the id comes from.
// -----------------------------------------------------------------------

// GET /api/wellbeing/[id]/concern-score?familyMemberId=<id>
//   -> Family member views the concern score of their OWN registered elder.
// GET /api/wellbeing/[id]/concern-score?checkerId=<id>
//   -> Checker views the concern score of an elder ASSIGNED to them.
//
// Exactly one of familyMemberId / checkerId must be supplied.
export async function GET(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const familyMemberId = searchParams.get("familyMemberId");
    const checkerId = searchParams.get("checkerId");

    if (!familyMemberId && !checkerId) {
      return NextResponse.json(
        { error: "Provide either familyMemberId or checkerId as a query parameter" },
        { status: 400 }
      );
    }

    const elder = await Elder.findById(id);
    if (!elder) return NextResponse.json({ error: "Elder not found" }, { status: 404 });

    if (familyMemberId) {
      // A family member may only view the elder THEY registered.
      if (elder.familyMemberId !== familyMemberId) {
        return NextResponse.json({ error: "You do not have access to this elder's concern score" }, { status: 403 });
      }
    } else if (checkerId) {
      // A checker may only view an elder currently ASSIGNED to them.
      if (!elder.assignedCheckerId || String(elder.assignedCheckerId) !== String(checkerId)) {
        return NextResponse.json({ error: "This elder is not assigned to you" }, { status: 403 });
      }
    }

    const visits = await Visit.find({ elderId: id }).sort({ visitDate: 1 });
    const metrics = applyOverride(computeConcernMetrics(visits), elder);

    return NextResponse.json(
      {
        success: true,
        data: {
          // Original fields, unchanged, so any existing caller keeps working.
          concernScore: metrics.concernScore,
          trend: metrics.trend.direction === "up" ? "Declining" : metrics.trend.direction === "down" ? "Improving" : "Stable",
          totalVisits: visits.length,
          completedVisits: visits.filter((v) => v.status !== "No Answer").length,
          missedVisits: visits.filter((v) => v.status === "No Answer").length,
          // Fields added for the AI Concern Metrics feature.
          category: metrics.category,
          trendDetail: metrics.trend,
          contributingFactors: metrics.contributingFactors,
          // Present only if a checker has manually overridden the computed score.
          override: metrics.override,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/wellbeing/[id]/concern-score
// Body: { checkerId: string, score: number (0-100), note?: string }
//
// Lets the checker ASSIGNED to this elder manually set/adjust the concern
// score (e.g. a quick flag after an off-schedule phone call), without
// having to log a full visit. Only the assigned checker can do this, and
// only if their application has been approved by an admin.
export async function PATCH(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await request.json();
    const { checkerId, score, note } = body;

    if (!checkerId) {
      return NextResponse.json({ error: "checkerId is required" }, { status: 400 });
    }
    if (score === undefined || score === null || Number.isNaN(Number(score))) {
      return NextResponse.json({ error: "score is required and must be a number" }, { status: 400 });
    }
    const numericScore = Math.round(Number(score));
    if (numericScore < 0 || numericScore > 100) {
      return NextResponse.json({ error: "score must be between 0 and 100" }, { status: 400 });
    }

    const elder = await Elder.findById(id);
    if (!elder) return NextResponse.json({ error: "Elder not found" }, { status: 404 });

    // Relationship check: this elder must actually be assigned to this checker.
    if (!elder.assignedCheckerId || String(elder.assignedCheckerId) !== String(checkerId)) {
      return NextResponse.json({ error: "This elder is not assigned to you" }, { status: 403 });
    }

    // Identity/status check: the checker must exist and be an approved,
    // active checker — not a pending or rejected applicant.
    const checker = await Checker.findById(checkerId);
    if (!checker) return NextResponse.json({ error: "Checker not found" }, { status: 404 });
    if (checker.applicationStatus !== "Approved") {
      return NextResponse.json({ error: "Only approved checkers can update concern scores" }, { status: 403 });
    }

    elder.concernOverride = {
      score: numericScore,
      note: typeof note === "string" ? note.slice(0, 500) : "",
      setByCheckerId: checker._id,
      setAt: new Date(),
    };
    await elder.save();

    const visits = await Visit.find({ elderId: id }).sort({ visitDate: 1 });
    const metrics = applyOverride(computeConcernMetrics(visits), elder);

    return NextResponse.json(
      {
        success: true,
        data: {
          concernScore: metrics.concernScore,
          category: metrics.category,
          contributingFactors: metrics.contributingFactors,
          override: metrics.override,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
