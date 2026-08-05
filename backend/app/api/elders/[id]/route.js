import connectDB from "@/lib/mongodb";
import Elder from "@/models/Elder";
import { NextResponse } from "next/server";

export async function GET(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const elder = await Elder.findById(id);

    if (!elder) {
      return NextResponse.json({ error: "Elder not found" }, { status: 404 });
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
    const body = await request.json();

    const elder = await Elder.findByIdAndUpdate(id, body, { new: true });

    if (!elder) {
      return NextResponse.json({ error: "Elder not found" }, { status: 404 });
    }

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

    if (!elder) {
      return NextResponse.json({ error: "Elder not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Elder deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}