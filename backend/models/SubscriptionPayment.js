import mongoose from "mongoose";

// One row per Premium checkout attempt.
//
// Deliberately separate from models/Payment.js: that model is the checker payout
// ledger (`checkerId` is required, money flows out to checkers, and it backs the
// "earnings" figure on the checker detail page). Subscription charges are incoming
// money tied to an elder and a family member, so overloading Payment would have meant
// making checkerId optional and adding a direction flag — a worse model than two
// clearly-named ones.
const SubscriptionPaymentSchema = new mongoose.Schema({
  elderId: { type: mongoose.Schema.Types.ObjectId, ref: "Elder", required: true },
  // String, matching Elder.familyMemberId (which holds the family user's id string).
  familyMemberId: { type: String, required: true },

  plan: { type: String, enum: ["premium"], default: "premium" },
  months: { type: Number, min: 1, required: true },
  amount: { type: Number, min: 0, required: true },
  currency: { type: String, default: "BDT" },

  // Our reference, sent to SSLCommerz as tran_id and echoed back on every callback.
  // Unique so a replayed callback cannot create a second record.
  tranId: { type: String, required: true, unique: true },

  status: {
    type: String,
    enum: ["initiated", "paid", "failed", "cancelled"],
    default: "initiated"
  },

  // Returned when the checkout session is opened; lets a payment be reconciled via
  // transactionQueryBySessionId if the tran_id lookup is ever inconclusive.
  sessionKey: { type: String, default: "" },

  // Filled in only after server-side validation succeeds.
  valId: { type: String, default: "" },
  cardType: { type: String, default: "" },
  bankTranId: { type: String, default: "" },
  periodStart: { type: Date, default: null },
  periodEnd: { type: Date, default: null },
  paidAt: { type: Date, default: null },

  // Why a payment did not complete, for support.
  failureReason: { type: String, default: "" },
  // Raw gateway payload, kept for reconciliation and dispute handling.
  gatewayResponse: { type: mongoose.Schema.Types.Mixed, default: {} },

  // Set when a refund is issued through the gateway.
  refundRefId: { type: String, default: "" },
  refundedAt: { type: Date, default: null },

  createdAt: { type: Date, default: Date.now }
});

SubscriptionPaymentSchema.index({ elderId: 1, createdAt: -1 });
SubscriptionPaymentSchema.index({ familyMemberId: 1, createdAt: -1 });

export default mongoose.models.SubscriptionPayment
  || mongoose.model("SubscriptionPayment", SubscriptionPaymentSchema);
