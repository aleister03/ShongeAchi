import connectDB from "@/lib/mongodb";
import Visit from "@/models/Visit";
import { NextResponse } from "next/server";

export async function GET(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const visits = await Visit.find({ elderId: id }).sort({ visitDate: -1 });
    return NextResponse.json({ success: true, data: visits }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await request.json();
    const visit = await Visit.create({ ...body, elderId: id });
    return NextResponse.json({ success: true, data: visit }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
