import connectDB from "@/lib/mongodb";
import Elder from "@/models/Elder";
import Checker from "@/models/Checker";
import Visit from "@/models/Visit";
import { computeConcernMetrics, applyOverride } from "@/lib/concernScore";
import { NextResponse } from "next/server";

// GET /api/wellbeing/checker/[checkerId]
//
// Checker views the concern scores of every elder currently ASSIGNED to
// them (a "my elders" list, one row per elder). Same relationship rule as
// the single-elder route: only elders where Elder.assignedCheckerId matches
// this checker are returned — a checker can never see another checker's
// elders through this route, because the elder list itself is filtered by
// the assignment, not just the per-elder response.
//
// See the authorization note at the top of
// /api/wellbeing/[id]/concern-score/route.js — the same caveat applies here
// (checkerId is caller-supplied, since there is no verified session yet).
export async function GET(request, context) {
  try {
    await connectDB();
    const { checkerId } = await context.params;

    const checker = await Checker.findById(checkerId);
    if (!checker) return NextResponse.json({ error: "Checker not found" }, { status: 404 });

    const assignedElders = await Elder.find({ assignedCheckerId: checkerId }).sort({ name: 1 });

    const elders = await Promise.all(
      assignedElders.map(async (elder) => {
        const visits = await Visit.find({ elderId: elder._id }).sort({ visitDate: 1 });
        const metrics = applyOverride(computeConcernMetrics(visits), elder);
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
