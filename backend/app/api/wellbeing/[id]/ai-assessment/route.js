import connectDB from "@/lib/mongodb";
import AiAssessment from "@/models/AiAssessment";
import Elder from "@/models/Elder";
import Checker from "@/models/Checker";
import { isPremium, assertPremium } from "@/lib/subscription";
import { runAiAssessment, MIN_VISITS_FOR_AI_ASSESSMENT } from "@/lib/concernAi";
import { NextResponse } from "next/server";

// GET /api/wellbeing/[id]/ai-assessment?familyMemberId=...|checkerId=...
//
// Latest concern assessment for an elder, plus recent history for the
// trend graph — same access rule as the other wellbeing endpoints (the
// elder's assigned checker, or the elder's own family member), gated
// behind Premium (see lib/subscription.js).
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

    if (familyMemberId && elder.familyMemberId !== familyMemberId) {
      return NextResponse.json({ error: "You do not have access to this elder's AI assessment" }, { status: 403 });
    }
    if (checkerId && (!elder.assignedCheckerId || String(elder.assignedCheckerId) !== String(checkerId))) {
      return NextResponse.json({ error: "This elder is not assigned to you" }, { status: 403 });
    }

    try {
      assertPremium(elder, "AI concern metrics");
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: err.status || 402 });
    }

    const history = await AiAssessment.find({ elderId: id }).sort({ createdAt: -1 }).limit(10);
    if (!history.length) {
      return NextResponse.json({
        success: true,
        data: {
          latest: null,
          history: [],
          minVisitsForAi: MIN_VISITS_FOR_AI_ASSESSMENT,
          message: "No concern assessment yet — it is generated automatically when a visit is logged.",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        latest: history[0],
        // Oldest first for plotting.
        history: history.slice().reverse().map((a) => ({
          date: a.createdAt,
          aiConcernScore: a.aiConcernScore,
          aiTrend: a.aiTrend,
          concernLevel: a.concernLevel,
          deterministicScore: a.deterministicScoreAtRun,
          source: a.source,
        })),
        minVisitsForAi: MIN_VISITS_FOR_AI_ASSESSMENT,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/wellbeing/[id]/ai-assessment  { checkerId }
//
// Manually (re)trigger an assessment run. Restricted to the elder's
// assigned checker — mirrors who is allowed to log a visit in the first
// place, since an assessment is only as current as the visit history it
// reads. (Admin can also trigger this from the admin UI without a
// checkerId, matching the no-session admin trust model used elsewhere.)
export async function POST(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));
    const { checkerId, isAdmin } = body;

    const elder = await Elder.findById(id);
    if (!elder) return NextResponse.json({ error: "Elder not found" }, { status: 404 });

    if (!isAdmin) {
      if (!checkerId || !elder.assignedCheckerId || String(elder.assignedCheckerId) !== String(checkerId)) {
        return NextResponse.json({ error: "This elder is not assigned to you" }, { status: 403 });
      }
      const checker = await Checker.findById(checkerId);
      if (!checker || checker.applicationStatus !== "Approved") {
        return NextResponse.json({ error: "Only approved checkers can trigger an assessment" }, { status: 403 });
      }
    }

    try {
      assertPremium(elder, "AI concern metrics");
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: err.status || 402 });
    }

    const result = await runAiAssessment(id);

    // A run is only skipped when there is nothing at all to assess (no
    // visits). AI failures and thin history produce a deterministic
    // assessment instead, so a 409 here genuinely means "no data yet".
    if (result.skipped) return NextResponse.json({ error: result.reason }, { status: 409 });

    return NextResponse.json({ success: true, data: result.assessment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
