import connectDB from "@/lib/mongodb";
import Elder from "@/models/Elder";
import Checker from "@/models/Checker";
import Message from "@/models/Message";
import { NextResponse } from "next/server";

export async function GET(request, context) {
  try {
    await connectDB();
    const { elderId } = await context.params;
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const familyMemberId = searchParams.get("familyMemberId");
    const checkerId = searchParams.get("checkerId");

    const elder = await Elder.findById(elderId);
    if (!elder) return NextResponse.json({ error: "Elder not found" }, { status: 404 });

    if (role === "family") {
      if (elder.familyMemberId !== familyMemberId) {
        return NextResponse.json({ error: "You do not have access to this conversation" }, { status: 403 });
      }
    } else if (role === "checker") {
      if (!elder.assignedCheckerId || String(elder.assignedCheckerId) !== String(checkerId)) {
        return NextResponse.json({ error: "This elder is not assigned to you" }, { status: 403 });
      }
    } else {
      return NextResponse.json({ error: "role must be 'family' or 'checker'" }, { status: 400 });
    }

    const messages = await Message.find({ elderId }).sort({ createdAt: 1 });
    return NextResponse.json(
      { success: true, data: { messages, isPremium: elder.isPremium, hasCheckerAssigned: !!elder.assignedCheckerId } },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; 
const MAX_VIDEO_BYTES = 15 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

function estimateBase64Bytes(dataUrl) {
  const commaIndex = dataUrl.indexOf(",");
  const base64 = commaIndex === -1 ? dataUrl : dataUrl.slice(commaIndex + 1);
  return Math.floor((base64.length * 3) / 4);
}

export async function POST(request, context) {
  try {
    await connectDB();
    const { elderId } = await context.params;
    const body = await request.json();
    const { role, familyMemberId, checkerId, senderName, text, attachment } = body;

    const trimmedText = typeof text === "string" ? text.trim() : "";
    if (!trimmedText && !attachment) {
      return NextResponse.json({ error: "Message text or an attachment is required" }, { status: 400 });
    }
    if (!["family", "checker"].includes(role)) {
      return NextResponse.json({ error: "role must be 'family' or 'checker'" }, { status: 400 });
    }

    let attachmentDoc = null;
    if (attachment) {
      const { kind, data, mimeType } = attachment;
      if (!["image", "video"].includes(kind) || !data || !mimeType) {
        return NextResponse.json({ error: "attachment must include kind, data, and mimeType" }, { status: 400 });
      }
      const allowedTypes = kind === "image" ? ALLOWED_IMAGE_TYPES : ALLOWED_VIDEO_TYPES;
      if (!allowedTypes.includes(mimeType)) {
        return NextResponse.json({ error: `Unsupported ${kind} type: ${mimeType}` }, { status: 400 });
      }
      const maxBytes = kind === "image" ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
      if (estimateBase64Bytes(data) > maxBytes) {
        return NextResponse.json(
          { error: `${kind === "image" ? "Images" : "Videos"} must be ${Math.round(maxBytes / (1024 * 1024))}MB or smaller` },
          { status: 400 }
        );
      }
      attachmentDoc = { kind, data, mimeType };
    }

    const elder = await Elder.findById(elderId);
    if (!elder) return NextResponse.json({ error: "Elder not found" }, { status: 404 });

    if (!elder.assignedCheckerId) {
      return NextResponse.json({ error: "This elder doesn't have an assigned checker yet" }, { status: 409 });
    }
    if (!elder.isPremium) {
      return NextResponse.json({ error: "Direct messaging is a Premium feature for this elder" }, { status: 402 });
    }

    if (role === "family") {
      if (elder.familyMemberId !== familyMemberId) {
        return NextResponse.json({ error: "You do not have access to this conversation" }, { status: 403 });
      }
    } else {
      if (String(elder.assignedCheckerId) !== String(checkerId)) {
        return NextResponse.json({ error: "This elder is not assigned to you" }, { status: 403 });
      }
      const checker = await Checker.findById(checkerId);
      if (!checker || checker.applicationStatus !== "Approved") {
        return NextResponse.json({ error: "Only approved checkers can send messages" }, { status: 403 });
      }
    }

    const message = await Message.create({
      elderId,
      checkerId: elder.assignedCheckerId,
      familyMemberId: elder.familyMemberId,
      senderRole: role,
      senderName: senderName || (role === "family" ? "Family member" : "Checker"),
      text: trimmedText.slice(0, 2000),
      attachment: attachmentDoc,
    });

    return NextResponse.json({ success: true, data: message }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}