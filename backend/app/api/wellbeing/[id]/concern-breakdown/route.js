import connectDB from "@/lib/mongodb";
import Visit from "@/models/Visit";
import { ApiError, assertObjectId, failure, success } from "@/lib/api";
import Elder from "@/models/Elder";

function getLevelLabel(visits, field) {
  const poor = visits.filter(v => v[field] === "Poor").length;
  const fair = visits.filter(v => v[field] === "Fair").length;
  const ratio = (poor * 2 + fair) / (visits.length * 2);
  if (ratio > 0.6) return "High";
  if (ratio > 0.3) return "Medium";
  return "Low";
}

export async function GET(_request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    assertObjectId(id, "elder id");
    if (!await Elder.exists({ _id: id })) throw new ApiError(404, "Elder not found");
    const visits = await Visit.find({ elderId: id });
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
