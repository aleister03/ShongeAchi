import connectDB from "@/lib/mongodb";
import Elder from "@/models/Elder";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const familyMemberId = searchParams.get("familyMemberId");

    if (!familyMemberId) {
      return NextResponse.json(
        { error: "familyMemberId is required" },
        { status: 400 }
      );
    }

    const elders = await Elder.find({ familyMemberId });
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