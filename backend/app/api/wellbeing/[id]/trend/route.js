import connectDB from "@/lib/mongodb";
import Visit from "@/models/Visit";
import Elder from "@/models/Elder";
import { computeConcernMetrics } from "@/lib/concernScore";
import { getPlatformConfig } from "@/lib/platformConfig";
import { NextResponse } from "next/server";

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

    const platformConfig = await getPlatformConfig();
    const thresholds = platformConfig.concernScoreThresholds;

    const allVisits = await Visit.find({ elderId: id }).sort({ visitDate: 1 });

    const now = new Date();
    const points = [];
    for (let i = weeks - 1; i >= 0; i--) {
      const cutoff = new Date(now.getTime() - i * MS_PER_WEEK);
      const visitsSoFar = allVisits.filter((v) => new Date(v.visitDate) <= cutoff);
      const hasData = visitsSoFar.length > 0;
      const metrics = hasData ? computeConcernMetrics(visitsSoFar, cutoff, thresholds) : null;
      points.push({
        weekLabel: `Week ${weeks - i}`,
        weekEnding: cutoff,
        concernScore: hasData ? metrics.concernScore : null,
      });
    }

    const override = elder.concernOverride;
    if (override && override.score !== null && override.score !== undefined && points.length > 0) {
      points[points.length - 1].concernScore = override.score;
      points[points.length - 1].overridden = true;
    }

    const scoredPoints = points.filter((p) => p.concernScore !== null);
    let direction = "stable";
    if (scoredPoints.length >= 2) {
      const delta = scoredPoints[scoredPoints.length - 1].concernScore - scoredPoints[0].concernScore;
      if (delta > 5) direction = "up";
      else if (delta < -5) direction = "down";
    }

    return NextResponse.json(
      { success: true, data: { points, direction, weeks } },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}