import connectDB from "@/lib/mongodb";
import Elder from "@/models/Elder";
import Checker from "@/models/Checker";
import Visit from "@/models/Visit";
import { computeConcernMetrics, applyOverride } from "@/lib/concernScore";
import { getPlatformConfig } from "@/lib/platformConfig";
import { NextResponse } from "next/server";

export async function GET(request, context) {
  try {
    await connectDB();
    const { checkerId } = await context.params;

    const checker = await Checker.findById(checkerId);
    if (!checker) return NextResponse.json({ error: "Checker not found" }, { status: 404 });

    const platformConfig = await getPlatformConfig();
    const thresholds = platformConfig.concernScoreThresholds;

    const assignedElders = await Elder.find({ assignedCheckerId: checkerId }).sort({ name: 1 });

    const elders = await Promise.all(
      assignedElders.map(async (elder) => {
        const visits = await Visit.find({ elderId: elder._id }).sort({ visitDate: 1 });
        const metrics = applyOverride(computeConcernMetrics(visits, new Date(), thresholds), elder, thresholds);
        return {
          elderId: elder._id,
          name: elder.name,
          concernScore: metrics.concernScore,
          category: metrics.category,
          trend: metrics.trend,
          contributingFactors: metrics.contributingFactors,
          override: metrics.override,
          totalVisits: visits.length,
        };
      })
    );

    return NextResponse.json({ success: true, data: elders }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}