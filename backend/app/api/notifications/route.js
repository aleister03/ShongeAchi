import connectDB from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { NextResponse } from "next/server";

// GET /api/notifications?familyMemberId=...
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const familyMemberId = searchParams.get("familyMemberId");
    if (!familyMemberId) {
      return NextResponse.json({ error: "familyMemberId is required" }, { status: 400 });
    }

    const notifications = await Notification.find({ familyMemberId }).sort({ createdAt: -1 }).limit(50);
    const unreadCount = await Notification.countDocuments({ familyMemberId, read: false });

    return NextResponse.json({ success: true, data: { notifications, unreadCount } }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/notifications?familyMemberId=...   body: { markAllRead: true }
export async function PATCH(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const familyMemberId = searchParams.get("familyMemberId");
    const { markAllRead } = await request.json().catch(() => ({}));

    if (!familyMemberId || !markAllRead) {
      return NextResponse.json({ error: "familyMemberId and markAllRead are required" }, { status: 400 });
    }

    await Notification.updateMany({ familyMemberId, read: false }, { read: true });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}