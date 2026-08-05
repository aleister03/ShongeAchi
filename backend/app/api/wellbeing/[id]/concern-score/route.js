import connectDB from "@/lib/mongodb";
import Visit from "@/models/Visit";
import { NextResponse } from "next/server";

function calculateConcernScore(visits) {
  if (visits.length === 0) return 0;
  let score = 0;
  visits.forEach(visit => {
    if (visit.status === "Concerned") score += 15;
    if (visit.status === "No Answer") score += 20;
    if (visit.appetiteLevel === "Poor") score += 10;
    if (visit.appetiteLevel === "Fair") score += 5;
    if (visit.mobilityLevel === "Poor") score += 10;
    if (visit.mobilityLevel === "Fair") score += 5;
    if (visit.moodLevel === "Poor") score += 10;
    if (!visit.medicationTaken) score += 10;
  });
  return Math.min(Math.round(score / visits.length), 100);
}

export async function GET(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const visits = await Visit.find({ elderId: id }).sort({ visitDate: 1 });
    if (visits.length === 0) {
      return NextResponse.json({ success: true, data: { concernScore: 0, trend: "No data", totalVisits: 0 } }, { status: 200 });
    }
    const concernScore = calculateConcernScore(visits);
    const firstHalf = visits.slice(0, Math.floor(visits.length / 2));
    const secondHalf = visits.slice(Math.floor(visits.length / 2));
    const firstScore = calculateConcernScore(firstHalf);
    const secondScore = calculateConcernScore(secondHalf);
    const trend = secondScore > firstScore ? "Declining" : "Improving";
    return NextResponse.json({
      success: true,
      data: {
        concernScore,
        trend,
        totalVisits: visits.length,
        completedVisits: visits.filter(v => v.status === "Fine" || v.status === "Concerned").length,
        missedVisits: visits.filter(v => v.status === "No Answer").length
      }
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}