import connectDB from "@/lib/mongodb";
import Escalation from "@/models/Escalation";
import { NextResponse } from "next/server";

// PATCH /api/escalations/[id]
// Body: { note?: string }
// Marks an open escalation as Cleared.
export async function PATCH(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const { note } = await request.json().catch(() => ({}));

    const escalation = await Escalation.findById(id);
    if (!escalation) return NextResponse.json({ error: "Escalation not found" }, { status: 404 });
    if (escalation.status === "Cleared") {
      return NextResponse.json({ error: "This escalation is already cleared" }, { status: 409 });
    }

    escalation.status = "Cleared";
    escalation.clearedAt = new Date();
    escalation.clearedNote = typeof note === "string" ? note.slice(0, 500) : "";
    escalation.escalationSteps.push({
      stage: "Cleared",
      note: escalation.clearedNote || "Marked resolved.",
      at: escalation.clearedAt,
    });
    await escalation.save();

    return NextResponse.json({ success: true, data: escalation }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}