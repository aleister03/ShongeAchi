import connectDB from "@/lib/mongodb.js";
import Visit from "@/models/Visit.js";
import { ApiError, assertObjectId, failure, success } from "@/lib/api.js";
import Elder from "@/models/Elder.js";
import { requireAuth, assertElderAccess } from "@/lib/auth.js";
import { assertPremium } from "@/lib/subscription.js";
import { deriveLevels } from "@/lib/deriveLevels.js";
import { calculateConcernScore } from "@/lib/concernScore.js";

export async function GET(_request, context) {
  try {
    const auth = requireAuth(_request, ["admin", "checker", "family"]); // was `request` — fixed
    await connectDB();
    const { id } = await context.params;
    assertObjectId(id, "elder id");
    const elder = await Elder.findById(id);
    if (!elder) throw new ApiError(404, "Elder not found");
    assertElderAccess(auth, elder);
    assertPremium(auth, elder, "Concern trends");
    const rawVisits = await Visit.find({ elderId: id }).sort({ visitDate: 1 });
    const visits = rawVisits.map((v) => ({ ...v.toObject(), ...deriveLevels(v.responses) }));
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
