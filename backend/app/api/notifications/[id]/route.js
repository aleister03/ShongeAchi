import connectDB from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { NextResponse } from "next/server";

// PATCH /api/notifications/[id]   body: { read: true }
export async function PATCH(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const { read } = await request.json().catch(() => ({}));

    const notification = await Notification.findByIdAndUpdate(id, { read: read !== false }, { new: true });
    if (!notification) return NextResponse.json({ error: "Notification not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: notification }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}