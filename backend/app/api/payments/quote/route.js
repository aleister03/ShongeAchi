import connectDB from "@/lib/mongodb";
import Elder from "@/models/Elder";
import { normalizeMonths, priceFor } from "@/lib/subscription";
import { generateId } from "@/lib/payments";
import { NextResponse } from "next/server";

// GET /api/payments/quote?elderId=...&familyMemberId=...&months=...
//
// The local sandbox gateway's own default design lets the CALLER dictate
// the amount via a query param — fine for a truly standalone demo, but
// this app already has real elders and a real pricing model, so the
// amount is computed here server-side from lib/subscription.js instead of
// ever being trusted from the client. This is what the payment method
// selection page calls before showing "Pay ৳X", and what each of the
// bKash/Nagad/Card pages calls to render their own summary — same
// caller-supplied-id trust model as the rest of this backend.
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const elderId = searchParams.get("elderId");
    const familyMemberId = searchParams.get("familyMemberId");

    if (!elderId || !familyMemberId) {
      return NextResponse.json({ error: "elderId and familyMemberId are required" }, { status: 400 });
    }

    let months;
    try {
      months = normalizeMonths(searchParams.get("months"));
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: err.status || 400 });
    }

    const elder = await Elder.findById(elderId).lean();
    if (!elder) return NextResponse.json({ error: "Elder not found" }, { status: 404 });
    if (elder.familyMemberId !== familyMemberId) {
      return NextResponse.json({ error: "You do not have access to this elder" }, { status: 403 });
    }

    const amount = priceFor(months);

    return NextResponse.json({
      success: true,
      data: {
        sessionId: generateId("ses"),
        invoiceNumber: generateId("inv").toUpperCase(),
        amount,
        currency: "BDT",
        months,
        elderId: elder._id,
        elderName: elder.name,
        user: {
          id: familyMemberId,
          name: elder.familyMemberEmail?.split("@")[0] || "Shonge Achi Family",
          email: elder.familyMemberEmail || "",
          phone: elder.phone || "",
        },
        plan: {
          id: "premium",
          name: `Premium — ${months} month${months === 1 ? "" : "s"}`,
          description: `Shonge Achi Premium subscription for ${elder.name}`,
        },
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
