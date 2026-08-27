import connectDB from "@/lib/mongodb";
import Elder from "@/models/Elder";
import Checker from "@/models/Checker";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();
    const { elderId, checkerId } = await request.json();
    if (!elderId || !checkerId) {
      return NextResponse.json({ error: "elderId and checkerId are required" }, { status: 400 });
    }

    const checker = await Checker.findById(checkerId);
    if (!checker) return NextResponse.json({ error: "Checker not found" }, { status: 404 });

    const assignedCount = await Elder.countDocuments({ assignedCheckerId: checkerId });
    if (assignedCount >= checker.maxCapacity) {
      return NextResponse.json({ error: "Checker is at full capacity" }, { status: 409 });
    }

    const elder = await Elder.findByIdAndUpdate(
      elderId,
      { assignedCheckerId: checkerId, status: "Assigned" },
      { new: true }
    );
    if (!elder) return NextResponse.json({ error: "Elder not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: elder }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
