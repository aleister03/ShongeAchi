import connectDB from "@/lib/mongodb";
import Elder from "@/models/Elder";
import { NextResponse } from "next/server";

export async function PUT(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await request.json();
    const { days, escalateAfterHours } = body;

    const elder = await Elder.findByIdAndUpdate(
      id,
      { visitSchedule: { days, escalateAfterHours } },
      { new: true }
    );

    if (!elder) {
      return NextResponse.json({ error: "Elder not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Schedule updated", data: elder.visitSchedule },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}