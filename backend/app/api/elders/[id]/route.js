import connectDB from "@/lib/mongodb";
import Elder from "@/models/Elder";
import { NextResponse } from "next/server";

export async function GET(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const familyMemberId = searchParams.get("familyMemberId");

    const elder = await Elder.findById(id);
    if (!elder) return NextResponse.json({ error: "Elder not found" }, { status: 404 });

    // Optional relationship check, same trust model as the wellbeing routes:
    // if a familyMemberId is supplied, it must match the elder's owner.
    // Callers that don't pass one (admin/checker screens) are unaffected.
    if (familyMemberId && elder.familyMemberId !== familyMemberId) {
      return NextResponse.json({ error: "You do not have access to this elder's profile" }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: elder }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const familyMemberId = searchParams.get("familyMemberId");
    const body = await request.json();

    const existing = await Elder.findById(id);
    if (!existing) return NextResponse.json({ error: "Elder not found" }, { status: 404 });
    if (familyMemberId && existing.familyMemberId !== familyMemberId) {
      return NextResponse.json({ error: "You do not have access to edit this elder's profile" }, { status: 403 });
    }

    const elder = await Elder.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json({ success: true, data: elder }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const elder = await Elder.findByIdAndDelete(id);
    if (!elder) return NextResponse.json({ error: "Elder not found" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Elder deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}