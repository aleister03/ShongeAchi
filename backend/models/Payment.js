import mongoose from "mongoose";

// Checker payout ledger — money paid OUT to checkers. Distinct from
// models/SubscriptionPayment.js, which records incoming Premium subscription charges.
//
// Restored: the merge deleted this file while three files still imported it
// (app/api/checkers/[id]/route.js, app/api/analytics/overview/route.js,
// scripts/seed.mjs), so each threw "Cannot find module" at runtime. It backs the
// "earnings" figure on the checker detail page and the "checker payouts" tile on the
// admin dashboard.
const PaymentSchema = new mongoose.Schema({
  checkerId: { type: mongoose.Schema.Types.ObjectId, ref: "Checker", required: true },
  amount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ["pending", "paid"], default: "pending" },
  paidAt: { type: Date, default: Date.now }
});

PaymentSchema.index({ checkerId: 1, paidAt: -1 });

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
