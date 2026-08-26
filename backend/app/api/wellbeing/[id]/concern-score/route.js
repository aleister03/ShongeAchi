import connectDB from "@/lib/mongodb";
import Visit from "@/models/Visit";
import Elder from "@/models/Elder";
import Checker from "@/models/Checker";
import { computeConcernMetrics, applyOverride } from "@/lib/concernScore";
import { getPlatformConfig } from "@/lib/platformConfig";
import { NextResponse } from "next/server";

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
      if (elder.familyMemberId !== familyMemberId) {
        return NextResponse.json({ error: "You do not have access to this elder's concern score" }, { status: 403 });
      }
    } else if (checkerId) {
      if (!elder.assignedCheckerId || String(elder.assignedCheckerId) !== String(checkerId)) {
        return NextResponse.json({ error: "This elder is not assigned to you" }, { status: 403 });
      }
    }
    const platformConfig = await getPlatformConfig();
    const thresholds = platformConfig.concernScoreThresholds;

    const visits = await Visit.find({ elderId: id }).sort({ visitDate: 1 });
    const metrics = applyOverride(computeConcernMetrics(visits, new Date(), thresholds), elder, thresholds);

    return NextResponse.json(
      {
        success: true,
        data: {
          concernScore: metrics.concernScore,
          trend: metrics.trend.direction === "up" ? "Declining" : metrics.trend.direction === "down" ? "Improving" : "Stable",
          totalVisits: visits.length,
          completedVisits: visits.filter((v) => v.status !== "No Answer").length,
          missedVisits: visits.filter((v) => v.status === "No Answer").length,
          category: metrics.category,
          trendDetail: metrics.trend,
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

    if (!elder.assignedCheckerId || String(elder.assignedCheckerId) !== String(checkerId)) {
      return NextResponse.json({ error: "This elder is not assigned to you" }, { status: 403 });
    }

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

    const platformConfig = await getPlatformConfig();
    const thresholds = platformConfig.concernScoreThresholds;

    const visits = await Visit.find({ elderId: id }).sort({ visitDate: 1 });
    const metrics = applyOverride(computeConcernMetrics(visits, new Date(), thresholds), elder, thresholds);

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