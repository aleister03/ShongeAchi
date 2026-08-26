import connectDB from "@/lib/mongodb";
import Elder from "@/models/Elder";
import CheckerRequest from "@/models/CheckerRequest";
import { NextResponse } from "next/server";

// POST /api/checker-requests/[id]/resolve   body: { approve: true|false, note }
export async function POST(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const { approve, note } = await request.json();

    const checkerRequest = await CheckerRequest.findById(id);
    if (!checkerRequest) return NextResponse.json({ error: "Request not found" }, { status: 404 });
    if (checkerRequest.status !== "Pending") {
      return NextResponse.json({ error: "This request has already been resolved" }, { status: 409 });
    }

    
    if (approve && checkerRequest.type === "Remove") {
      await Elder.findByIdAndUpdate(checkerRequest.elderId, {
        assignedCheckerId: null,
        status: "Waiting",
      });
    }

    checkerRequest.status = approve ? "Approved" : "Rejected";
    checkerRequest.resolvedAt = new Date();
    checkerRequest.resolvedNote = note || "";
    await checkerRequest.save();

    return NextResponse.json({ success: true, data: checkerRequest }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}