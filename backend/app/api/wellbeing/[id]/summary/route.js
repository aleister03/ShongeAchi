import connectDB from "@/lib/mongodb";
import Visit from "@/models/Visit";
import Elder from "@/models/Elder";
import { NextResponse } from "next/server";

export async function GET(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const elder = await Elder.findById(id);
    if (!elder) return NextResponse.json({ error: "Elder not found" }, { status: 404 });
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
    return NextResponse.json({
      success: true,
      data: {
        elderName: elder.name,
        totalVisitsAnalyzed: visits.length,
        summary,
        recommendation: poorMobilityCount >= 2 || concernedCount >= 2 ? "Increase visit frequency" : "Continue current schedule",
      }
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
