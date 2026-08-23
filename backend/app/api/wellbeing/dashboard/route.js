import connectDB from "@/lib/mongodb";
import Elder from "@/models/Elder";
import Checker from "@/models/Checker";
import Visit from "@/models/Visit";
import { computeConcernMetrics, applyOverride } from "@/lib/concernScore";
import { getPlatformConfig } from "@/lib/platformConfig";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const categoryFilter = searchParams.get("category");
    const platformConfig = await getPlatformConfig();
    const thresholds = platformConfig.concernScoreThresholds;
    const [elders, checkers, visits] = await Promise.all([
      Elder.find().sort({ name: 1 }),
      Checker.find().select("name"),
      Visit.find().sort({ visitDate: 1 }),
    ]);

    const checkerNameById = new Map(checkers.map((c) => [String(c._id), c.name]));
    const visitsByElderId = new Map();
    for (const visit of visits) {
      const key = String(visit.elderId);
      if (!visitsByElderId.has(key)) visitsByElderId.set(key, []);
      visitsByElderId.get(key).push(visit);
    }

    const now = new Date();
    const scoredElders = elders.map((elder) => {
      const elderVisits = visitsByElderId.get(String(elder._id)) || [];
      const metrics = applyOverride(computeConcernMetrics(elderVisits, now, thresholds), elder, thresholds);
      const lastVisit = elderVisits[elderVisits.length - 1];
      return {
        elderId: elder._id,
        name: elder.name,
        checkerName: elder.assignedCheckerId
          ? checkerNameById.get(String(elder.assignedCheckerId)) || "Unassigned"
          : "Unassigned",
        concernScore: metrics.concernScore,
        category: metrics.category,
        trend: metrics.trend,
        contributingFactors: metrics.contributingFactors,
        totalVisits: metrics.totalVisits,
        lastVisitDate: lastVisit ? lastVisit.visitDate : null,
      };
    });

    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const trendingUpThisWeek = scoredElders.filter(
      (e) => e.trend.direction === "up" && e.lastVisitDate && new Date(e.lastVisitDate) >= oneWeekAgo
    ).length;

    const summary = {
      critical: scoredElders.filter((e) => e.category === "Critical").length,
      elevated: scoredElders.filter((e) => e.category === "Elevated").length,
      stable: scoredElders.filter((e) => e.category === "Stable").length,
      trendingUpThisWeek,
      totalElders: scoredElders.length,
    };

    let result = scoredElders.sort((a, b) => b.concernScore - a.concernScore);
    if (categoryFilter && ["Critical", "Elevated", "Stable"].includes(categoryFilter)) {
      result = result.filter((e) => e.category === categoryFilter);
    }

    return NextResponse.json({ success: true, data: { summary, elders: result } }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}