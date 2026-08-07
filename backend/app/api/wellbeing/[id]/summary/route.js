import connectDB from "@/lib/mongodb";
import Visit from "@/models/Visit";
import Elder from "@/models/Elder";
import { ApiError, assertObjectId, failure, success } from "@/lib/api";

export async function GET(_request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    assertObjectId(id, "elder id");
    const elder = await Elder.findById(id);
    if (!elder) {
      throw new ApiError(404, "Elder not found");
    }
    const visits = await Visit.find({ elderId: id }).sort({ visitDate: -1 }).limit(10);
    const concernedCount = visits.filter(v => v.status === "Concerned").length;
    const noAnswerCount = visits.filter(v => v.status === "No Answer").length;
    const poorAppetiteCount = visits.filter(v => v.appetiteLevel === "Poor").length;
    const poorMobilityCount = visits.filter(v => v.mobilityLevel === "Poor").length;
    const missedMedCount = visits.filter(v => !v.medicationTaken).length;
    const summary = `Wellbeing summary for ${elder.name} based on last ${visits.length} visits: ` +
      `${concernedCount} concerned visit(s), ${noAnswerCount} no-answer visit(s), ` +
      `${poorAppetiteCount} poor appetite report(s), ${poorMobilityCount} poor mobility report(s), ` +
      `${missedMedCount} missed medication(s). ` +
      `${poorMobilityCount >= 2 ? "Mobility is showing a declining trend — consider increasing visit frequency." : "No critical trend detected."}`;
    return success({
        elderName: elder.name,
        totalVisitsAnalyzed: visits.length,
        summary,
        recommendation: poorMobilityCount >= 2 || concernedCount >= 2 ? "Increase visit frequency" : "Continue current schedule"
    });
  } catch (error) {
    return failure(error);
  }
}
