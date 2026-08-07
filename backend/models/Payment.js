import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  checkerId: { type: mongoose.Schema.Types.ObjectId, ref: "Checker", required: true },
  amount: { type: Number, min: 0, required: true },
  status: { type: String, enum: ["pending", "paid"], default: "paid" },
  paidAt: { type: Date, default: Date.now }
});

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
