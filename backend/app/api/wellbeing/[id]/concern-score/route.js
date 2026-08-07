import connectDB from "@/lib/mongodb";
import Visit from "@/models/Visit";
import { ApiError, assertObjectId, failure, success } from "@/lib/api";
import Elder from "@/models/Elder";

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

export async function GET(_request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    assertObjectId(id, "elder id");
    if (!await Elder.exists({ _id: id })) throw new ApiError(404, "Elder not found");
    const visits = await Visit.find({ elderId: id }).sort({ visitDate: 1 });
    if (visits.length === 0) {
      return success({ concernScore: 0, trend: "No data", totalVisits: 0 });
    }
    const concernScore = calculateConcernScore(visits);
    const firstHalf = visits.slice(0, Math.floor(visits.length / 2));
    const secondHalf = visits.slice(Math.floor(visits.length / 2));
    const firstScore = calculateConcernScore(firstHalf);
    const secondScore = calculateConcernScore(secondHalf);
    const trend = secondScore > firstScore ? "Declining" : "Improving";
    return success({
        concernScore,
        trend,
        totalVisits: visits.length,
        completedVisits: visits.filter(v => v.status === "Fine" || v.status === "Concerned").length,
        missedVisits: visits.filter(v => v.status === "No Answer").length
    });
  } catch (error) {
    return failure(error);
  }
}
