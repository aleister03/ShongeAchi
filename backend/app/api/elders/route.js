import connectDB from "@/lib/mongodb";
import Elder from "@/models/Elder";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const familyMemberId = searchParams.get("familyMemberId");
    const status = searchParams.get("status"); // "Waiting" | "Assigned"

    const filter = {};
    if (familyMemberId) filter.familyMemberId = familyMemberId;
    if (status) filter.status = status;

    // NOTE: familyMemberId is now optional (was required before). Admin screens like the
    // Intelligent Checker Assignment queue need every elder across every family, filtered
    // by status instead of by owner.
    const elders = await Elder.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: elders }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const elder = await Elder.create(body);
    return NextResponse.json({ success: true, data: elder }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
