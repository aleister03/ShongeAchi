import connectDB from "@/lib/mongodb";
import Visit from "@/models/Visit";
import { NextResponse } from "next/server";

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
    await connectDB();
    const { id } = await context.params;
    const visits = await Visit.find({ elderId: id });
    if (visits.length === 0) {
      return NextResponse.json({ success: true, data: { message: "No visits found" } }, { status: 200 });
    }
    const breakdown = {
      appetite: getLevelLabel(visits, "appetiteLevel"),
      mobility: getLevelLabel(visits, "mobilityLevel"),
      mood: getLevelLabel(visits, "moodLevel"),
      missedVisits: visits.filter(v => v.status === "No Answer").length,
      medicationMissed: visits.filter(v => !v.medicationTaken).length,
      totalVisits: visits.length
    };
    return NextResponse.json({ success: true, data: breakdown }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}