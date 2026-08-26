import connectDB from "@/lib/mongodb";
import Elder from "@/models/Elder";
import Checker from "@/models/Checker";
import CheckerRequest from "@/models/CheckerRequest";
import { NextResponse } from "next/server";

// GET /api/checker-requests?status=Pending   (admin queue)
// GET /api/checker-requests?elderId=...       (family: check for an existing request)
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const elderId = searchParams.get("elderId");

    const filter = {};
    if (status && ["Pending", "Approved", "Rejected"].includes(status)) filter.status = status;
    if (elderId) filter.elderId = elderId;

    const requests = await CheckerRequest.find(filter).sort({ requestedAt: -1 });
    return NextResponse.json({ success: true, data: requests }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//POST---------------
export async function POST(request) {
  try {
    await connectDB();
    const { elderId, familyMemberId, type, reason } = await request.json();
    if (!elderId || !familyMemberId || !["Assign", "Remove"].includes(type)) {
      return NextResponse.json({ error: "elderId, familyMemberId, and a valid type are required" }, { status: 400 });
    }

    const elder = await Elder.findById(elderId);
    if (!elder) return NextResponse.json({ error: "Elder not found" }, { status: 404 });
    if (elder.familyMemberId !== familyMemberId) {
      return NextResponse.json({ error: "You do not have access to this elder" }, { status: 403 });
    }

    if (type === "Remove" && !elder.assignedCheckerId) {
      return NextResponse.json({ error: "This elder has no checker assigned to remove" }, { status: 409 });
    }
    if (type === "Assign" && elder.assignedCheckerId) {
      return NextResponse.json({ error: "This elder already has a checker assigned" }, { status: 409 });
    }

    const existingPending = await CheckerRequest.findOne({ elderId, status: "Pending" });
    if (existingPending) {
      return NextResponse.json({ error: "A request is already pending for this elder" }, { status: 409 });
    }

    let previousChecker = null;
    if (type === "Remove") {
      previousChecker = await Checker.findById(elder.assignedCheckerId).select("name");
    }

    const checkerRequest = await CheckerRequest.create({
      elderId,
      elderName: elder.name,
      familyMemberId,
      type,
      reason: reason || "",
      previousCheckerId: type === "Remove" ? elder.assignedCheckerId : null,
      previousCheckerName: previousChecker?.name || "",
    });

    return NextResponse.json({ success: true, data: checkerRequest }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}