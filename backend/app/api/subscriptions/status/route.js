import connectDB from "@/lib/mongodb";
import Elder from "@/models/Elder";
import PaymentRecord from "@/models/PaymentRecord";
import { serializeSubscription } from "@/lib/subscription";
import { NextResponse } from "next/server";

// GET /api/subscriptions/status?elderId=...&familyMemberId=...|checkerId=...
// Current plan for one elder, plus its recent payment history. Same
// relationship-check pattern as the rest of this backend.
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const elderId = searchParams.get("elderId");
    const familyMemberId = searchParams.get("familyMemberId");
    const checkerId = searchParams.get("checkerId");

    if (!elderId) return NextResponse.json({ error: "elderId is required" }, { status: 400 });

    const elder = await Elder.findById(elderId).lean();
    if (!elder) return NextResponse.json({ error: "Elder not found" }, { status: 404 });

    if (familyMemberId && elder.familyMemberId !== familyMemberId) {
      return NextResponse.json({ error: "You do not have access to this elder's subscription" }, { status: 403 });
    }
    if (checkerId && (!elder.assignedCheckerId || String(elder.assignedCheckerId) !== String(checkerId))) {
      return NextResponse.json({ error: "This elder is not assigned to you" }, { status: 403 });
    }

    const payments = await PaymentRecord.find({ elderId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("paymentId amount currency months method status completedAt createdAt invoiceNumber")
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        elder: { _id: elder._id, name: elder.name },
        subscription: serializeSubscription(elder),
        payments,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
