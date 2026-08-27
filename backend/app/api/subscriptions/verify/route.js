import connectDB from "@/lib/mongodb.js";
import Elder from "@/models/Elder.js";
import SubscriptionPayment from "@/models/SubscriptionPayment.js";
import { ApiError, failure, requireFields, success } from "@/lib/api.js";
import { requireAuth, assertElderAccess } from "@/lib/auth.js";
import { verifyAndActivate } from "@/lib/subscriptionService.js";
import { serializeSubscription } from "@/lib/subscription.js";

// POST /api/subscriptions/verify  { tranId }
//
// Reconciles a payment straight with SSLCommerz, using the documented
// transactionQueryByTransactionId API when no val_id is available.
//
// This is the recovery path for a callback that never arrived. It always happens
// during local development — SSLCommerz cannot reach a localhost ipn_url — and can
// happen in production if the payer closes the tab at the wrong moment or our server
// is briefly unreachable. Without it, money can be taken while the subscription sits
// as "initiated" forever.
//
// Safe to call repeatedly: verifyAndActivate() short-circuits on an already-paid
// record, so the period is never extended twice. And it is not a way to grant access
// — the gateway still has to confirm the payment, for the right amount, against a
// transaction we created.
export async function POST(request) {
  try {
    const auth = requireAuth(request, ["admin", "family"]);
    await connectDB();

    const body = await request.json();
    requireFields(body, ["tranId"]);

    const payment = await SubscriptionPayment.findOne({ tranId: body.tranId });
    if (!payment) throw new ApiError(404, "No payment found for that transaction");

    // A family member may only reconcile payments for their own elder.
    const elder = await Elder.findById(payment.elderId).lean();
    if (!elder) throw new ApiError(404, "Elder not found");
    assertElderAccess(auth, elder);

    const result = await verifyAndActivate({ tranId: payment.tranId, valId: payment.valId || null });
    const refreshed = await Elder.findById(payment.elderId).lean();

    return success({
      outcome: result.outcome,
      reason: result.reason ?? null,
      status: result.payment?.status ?? payment.status,
      amount: payment.amount,
      months: payment.months,
      elder: { _id: refreshed._id, name: refreshed.name },
      subscription: serializeSubscription(refreshed)
    });
  } catch (error) {
    return failure(error);
  }
}
