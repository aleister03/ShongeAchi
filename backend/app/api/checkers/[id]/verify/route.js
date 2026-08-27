import connectDB from "@/lib/mongodb";
import Checker from "@/models/Checker";
import { NextResponse } from "next/server";

export async function PUT(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const { action } = await request.json(); // "approve" | "reject"

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "action must be 'approve' or 'reject'" }, { status: 400 });
    }

    const update =
      action === "approve"
        ? { applicationStatus: "Approved", verified: true, status: "Active" }
        : { applicationStatus: "Rejected", verified: false, status: "Inactive" };

    const checker = await Checker.findByIdAndUpdate(id, update, { new: true });
    if (!checker) return NextResponse.json({ error: "Checker not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: checker }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
