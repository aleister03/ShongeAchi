import connectDB from "@/lib/mongodb";
import Elder from "@/models/Elder";
import PaymentRecord from "@/models/PaymentRecord";
import { normalizeMonths, priceFor, extendPeriod } from "@/lib/subscription";
import { generateId, maskDetails } from "@/lib/payments";
import { NextResponse } from "next/server";

const METHODS = ["bkash", "nagad", "card"];

// POST /api/payments/record
// Body: { elderId, familyMemberId, months, invoiceNumber, sessionId, method, details, user, plan }
//
// Ported from the payment sandbox's own record route
// (paymentSandbox-master/app/api/payments/record/route.ts), which stored
// records in a local JSON file and left a comment saying exactly this:
// "Persist these documents to MongoDB in production... use
// mongodbDocument for MongoDB insertOne()". This does that, and — since
// this app has a real subscription to activate, unlike the standalone
// sandbox — also extends the elder's Premium period on success.
//
// This is a sandbox/demo payment flow: no real gateway is called, no real
// money moves, and (matching the original sandbox's own behavior) a
// submission with valid-shaped details always succeeds. The amount is
// still always recomputed server-side from lib/subscription.js rather
// than trusted from the request body, so a tampered client can't buy
// Premium for ৳1.
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { elderId, familyMemberId, invoiceNumber, sessionId, method, details, user, plan } = body;

    if (!elderId || !familyMemberId) {
      return NextResponse.json({ error: "elderId and familyMemberId are required" }, { status: 400 });
    }
    if (!METHODS.includes(method)) {
      return NextResponse.json({ error: `method must be one of: ${METHODS.join(", ")}` }, { status: 400 });
    }
    if (!invoiceNumber) {
      return NextResponse.json({ error: "invoiceNumber is required" }, { status: 400 });
    }

    let months;
    try {
      months = normalizeMonths(body.months);
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: err.status || 400 });
    }

    const elder = await Elder.findById(elderId);
    if (!elder) return NextResponse.json({ error: "Elder not found" }, { status: 404 });
    if (elder.familyMemberId !== familyMemberId) {
      return NextResponse.json({ error: "You do not have access to this elder" }, { status: 403 });
    }

    // Same sandbox-only method-specific validation the original pages did
    // client-side, repeated here since the server never trusts client
    // validation alone.
    if (method === "bkash" || method === "nagad") {
      if (!/^01[0-9]{9}$/.test(String(details?.walletNumber || details?.accountNumber || ""))) {
        return NextResponse.json({ error: "A valid 11-digit wallet number is required" }, { status: 400 });
      }
      if (!/^[0-9]{4,6}$/.test(String(details?.pin || ""))) {
        return NextResponse.json({ error: "A valid 4-6 digit PIN is required" }, { status: 400 });
      }
    } else if (method === "card") {
      const digits = String(details?.cardNumber || "").replace(/\s/g, "");
      if (digits.length < 13) return NextResponse.json({ error: "A valid card number is required" }, { status: 400 });
      if (String(details?.expiryDate || "").length !== 5) {
        return NextResponse.json({ error: "A valid expiry date (MM/YY) is required" }, { status: 400 });
      }
      if (String(details?.cvv || "").length < 3) {
        return NextResponse.json({ error: "A valid CVV is required" }, { status: 400 });
      }
      if (!String(details?.cardHolderName || "").trim()) {
        return NextResponse.json({ error: "A cardholder name is required" }, { status: 400 });
      }
    }

    // Server-computed, never trusted from the client.
    const amount = priceFor(months);
    const processingFee = 0;
    const totalAmount = amount + processingFee;
    const now = new Date();

    const record = await PaymentRecord.create({
      paymentId: generateId("pay"),
      sessionId: sessionId || generateId("ses"),
      invoiceNumber,
      elderId: elder._id,
      familyMemberId,
      months,
      amount,
      currency: "BDT",
      method,
      user: user || { id: familyMemberId, name: "", email: elder.familyMemberEmail || "", phone: elder.phone || "" },
      plan: plan || { id: "premium", name: `Premium — ${months} month${months === 1 ? "" : "s"}` },
      status: "success",
      details: maskDetails(method, details),
      processingFee,
      totalAmount,
      gatewayResponse: {
        sandbox: true,
        transactionRef: generateId("txn"),
        processedAt: now.toISOString(),
      },
      isSandbox: true,
      completedAt: now,
    });

    // Activate Premium. updateOne, not elder.save(): save() revalidates
    // the entire document, so an elder with any pre-existing unrelated
    // validation issue would throw here and the family could be left
    // thinking they paid for nothing.
    const { periodEnd } = extendPeriod(elder, months, now);
    await Elder.updateOne({ _id: elder._id }, {
      $set: {
        subscription: {
          plan: "premium",
          status: "active",
          currentPeriodEnd: periodEnd,
          activatedAt: elder.subscription?.activatedAt ?? now,
          lastPaymentId: record._id,
        },
      },
    });

    return NextResponse.json({ success: true, data: record }, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "This payment was already recorded" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
