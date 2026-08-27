import connectDB from "@/lib/mongodb.js";
import Visit from "@/models/Visit.js";
import { ApiError, assertObjectId, failure, success } from "@/lib/api.js";
import Elder from "@/models/Elder.js";
import { requireAuth, assertElderAccess } from "@/lib/auth.js";
import { assertPremium } from "@/lib/subscription.js";
import { deriveLevels } from "@/lib/deriveLevels.js";


function getLevelLabel(visits, field) {
  const poor = visits.filter(v => v[field] === "Poor").length;
  const fair = visits.filter(v => v[field] === "Fair").length;
  const ratio = (poor * 2 + fair) / (visits.length * 2);
  if (ratio > 0.6) return "High";
  if (ratio > 0.3) return "Medium";
  return "Low";
}

export async function GET(request, context) {
  try {
    const auth = requireAuth(request, ["admin", "checker", "family"]);
    await connectDB();
    const { id } = await context.params;
    assertObjectId(id, "elder id");
    const elder = await Elder.findById(id); 
    if (!elder) throw new ApiError(404, "Elder not found");
    assertElderAccess(auth, elder);
    assertPremium(auth, elder, "Concern trends");
    const rawVisits = await Visit.find({ elderId: id });
    const visits = rawVisits.map((v) => ({ ...v.toObject(), ...deriveLevels(v.responses) }));
    if (visits.length === 0) {
      return success({ message: "No visits found" });
    }
    const breakdown = {
      appetite: getLevelLabel(visits, "appetiteLevel"),
      mobility: getLevelLabel(visits, "mobilityLevel"),
      mood: getLevelLabel(visits, "moodLevel"),
      missedVisits: visits.filter(v => v.status === "No Answer").length,
      medicationMissed: visits.filter(v => !v.medicationTaken).length,
      totalVisits: visits.length
    };
    return success(breakdown);
  } catch (error) {
    return failure(error);
  }
}
