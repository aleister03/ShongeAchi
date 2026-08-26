// backend/app/api/elders/route.js
import connectDB from "@/lib/mongodb";
import Elder from "@/models/Elder";
import { sendEmail } from "@/lib/mailer";
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

    // Best-effort — an email failure must never block elder creation, so
    // it's wrapped separately and only logged if it goes wrong.
    if (elder.familyMemberEmail) {
      try {
        await sendEmail({
          to: elder.familyMemberEmail,
          subject: `Shonge Achi: Profile created for ${elder.name}`,
          body:
            `A new elder profile for ${elder.name} has been created on Shonge Achi.\n\n` +
            `You'll receive an alert here whenever a scheduled check-in is missed or a checker ` +
            `flags a concern.\n\n` +
            `— Shonge Achi`,
        });
      } catch (emailErr) {
        console.error("[elders] Failed to send registration email:", emailErr);
      }
    }

    return NextResponse.json({ success: true, data: elder }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}