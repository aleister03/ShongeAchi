import mongoose from "mongoose";

// Ported from the payment sandbox's PaymentRecord shape (see
// paymentSandbox-master/lib/types.ts), persisted to real MongoDB instead
// of the sandbox's local data/payments.json file — the sandbox's own code
// comments say exactly this ("Persist these documents to MongoDB in
// production... use mongodbDocument for MongoDB insertOne()").
//
// This is a demo/sandbox payment flow: no real gateway is called, no real
// money moves. A submission on any of the bKash/Nagad/Card pages is
// always recorded as "success" — see app/api/payments/record/route.js.
const PaymentRecordSchema = new mongoose.Schema({
  paymentId: { type: String, required: true, unique: true },
  sessionId: { type: String, required: true },
  invoiceNumber: { type: String, required: true },

  // Added on top of the sandbox's own shape, to link a payment back to
  // what it actually paid for within this app.
  elderId: { type: mongoose.Schema.Types.ObjectId, ref: "Elder", required: true },
  familyMemberId: { type: String, required: true },
  months: { type: Number, min: 1, required: true },

  amount: { type: Number, required: true },
  currency: { type: String, default: "BDT" },
  method: { type: String, enum: ["bkash", "nagad", "card"], required: true },

  user: {
    id: String,
    name: String,
    email: String,
    phone: String,
  },
  plan: {
    id: String,
    name: String,
    description: String,
  },

  status: { type: String, enum: ["pending", "processing", "success", "failed"], default: "success" },

  // bKash/Nagad wallet number and PIN, or card number/expiry/cvv —
  // sensitive fields are masked before being stored (see the route),
  // same as the sandbox's own approach.
  details: { type: mongoose.Schema.Types.Mixed, default: {} },

  processingFee: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  gatewayResponse: { type: mongoose.Schema.Types.Mixed, default: {} },

  isSandbox: { type: Boolean, default: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null },
});

PaymentRecordSchema.index({ elderId: 1, createdAt: -1 });
PaymentRecordSchema.index({ familyMemberId: 1, createdAt: -1 });

export default mongoose.models.PaymentRecord || mongoose.model("PaymentRecord", PaymentRecordSchema);
