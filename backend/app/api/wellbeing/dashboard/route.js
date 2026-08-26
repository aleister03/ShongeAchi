import connectDB from "@/lib/mongodb";
import Elder from "@/models/Elder";
import Checker from "@/models/Checker";
import Visit from "@/models/Visit";
import { computeConcernMetrics, applyOverride } from "@/lib/concernScore";
import { NextResponse } from "next/server";

// GET /api/wellbeing/dashboard
//
// Powers the admin "AI concern metrics" dashboard: every elder, scored, in
// one response. This is the aggregate sibling of
// /api/wellbeing/[id]/concern-score, which scores a single elder.
//
// Query params (all optional):
//   category=Critical|Elevated|Stable   filter the elders list server-side
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const categoryFilter = searchParams.get("category");

    // Pull everything we need in three flat queries instead of one query
    // per elder (an "N+1" query pattern), which would get slow as the
    // number of elders grows.
    const [elders, checkers, visits] = await Promise.all([
      Elder.find().sort({ name: 1 }),
      Checker.find().select("name"),
      Visit.find().sort({ visitDate: 1 }),
    ]);

    // Build lookup maps so we can match visits/checkers to each elder in
    // memory (O(1) lookup) instead of re-querying the database per elder.
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
      const metrics = applyOverride(computeConcernMetrics(elderVisits, now), elder);
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

    // "Trending upward this week" — elders whose score is rising AND who
    // had at least one visit in the last 7 days (so the trend is current,
    // not something that happened a month ago and hasn't moved since).
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

    // Sort highest concern first — that's what an admin scanning the table wants to see.
    let result = scoredElders.sort((a, b) => b.concernScore - a.concernScore);
    if (categoryFilter && ["Critical", "Elevated", "Stable"].includes(categoryFilter)) {
      result = result.filter((e) => e.category === categoryFilter);
    }

    return NextResponse.json({ success: true, data: { summary, elders: result } }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
