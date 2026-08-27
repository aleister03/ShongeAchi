import connectDB from "@/lib/mongodb";
import Visit from "@/models/Visit";
import Elder from "@/models/Elder";
import { computeConcernMetrics } from "@/lib/concernScore";
import { NextResponse } from "next/server";

// GET /api/wellbeing/[id]/trend?weeks=6
//
// AI Wellbeing Trend Analysis — powers the multi-week line chart on the
// family Wellbeing History page. The point of this feature (per the spec)
// is comparing an elder's visits OVER TIME rather than reacting to one
// isolated visit — e.g. every visit individually marked "Fine" while
// mobility has quietly been declining for six weeks straight.
//
// Implementation: re-run the same concern-score calculator
// (lib/concernScore.js) with progressively later "now" cutoffs, one per
// week, so each point is "the concern score AS IT WOULD HAVE APPEARED at
// the end of that week" using only the visits that had happened by then.
// This reuses the exact scoring logic the single-elder concern-score
// endpoint uses, so the most recent point here always matches the number
// shown elsewhere in the app.
const DEFAULT_WEEKS = 6;
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

export async function GET(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const weeks = Math.min(12, Math.max(2, Number(searchParams.get("weeks")) || DEFAULT_WEEKS));

    const elder = await Elder.findById(id);
    if (!elder) return NextResponse.json({ error: "Elder not found" }, { status: 404 });

    const allVisits = await Visit.find({ elderId: id }).sort({ visitDate: 1 });

    const now = new Date();
    const points = [];
    for (let i = weeks - 1; i >= 0; i--) {
      const cutoff = new Date(now.getTime() - i * MS_PER_WEEK);
      const visitsSoFar = allVisits.filter((v) => new Date(v.visitDate) <= cutoff);
      const hasData = visitsSoFar.length > 0;
      const metrics = hasData ? computeConcernMetrics(visitsSoFar, cutoff) : null;
      points.push({
        weekLabel: `Week ${weeks - i}`,
        weekEnding: cutoff,
        concernScore: hasData ? metrics.concernScore : null,
      });
    }

    // A manual checker override reflects "right now", not any past week —
    // only ever apply it to the most recent point.
    const override = elder.concernOverride;
    if (override && override.score !== null && override.score !== undefined && points.length > 0) {
      points[points.length - 1].concernScore = override.score;
      points[points.length - 1].overridden = true;
    }

    const scoredPoints = points.filter((p) => p.concernScore !== null);
    let direction = "stable";
    if (scoredPoints.length >= 2) {
      const delta = scoredPoints[scoredPoints.length - 1].concernScore - scoredPoints[0].concernScore;
      if (delta > 5) direction = "up"; // rising concern score = declining wellbeing
      else if (delta < -5) direction = "down"; // falling concern score = improving wellbeing
    }

    return NextResponse.json(
      { success: true, data: { points, direction, weeks } },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}