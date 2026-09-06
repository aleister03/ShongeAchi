import connectDB from "@/lib/mongodb";
import PaymentRecord from "@/models/PaymentRecord";
import { NextResponse } from "next/server";

// GET /api/payments/record/[paymentId]?familyMemberId=...
export async function GET(request, context) {
  try {
    await connectDB();
    const { paymentId } = await context.params;
    const { searchParams } = new URL(request.url);
    const familyMemberId = searchParams.get("familyMemberId");

    const record = await PaymentRecord.findOne({ paymentId }).lean();
    if (!record) return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    if (familyMemberId && record.familyMemberId !== familyMemberId) {
      return NextResponse.json({ error: "You do not have access to this payment" }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
