import mongoose from "mongoose";

const ElderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  medicalConditions: { type: [String], default: [] },
  mobilityNotes: { type: String, default: "" },
  bio: { type: String, default: "" },
  emergencyContact: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    relationship: { type: String, required: true },
    note: { type: String, default: "" }
  },
  secondaryContact: {
    name: { type: String, default: "" },
    phone: { type: String, default: "" },
    relationship: { type: String, default: "" },
    note: { type: String, default: "" }
  },
  familyMemberId: { type: String, required: true },
  checkerId: { type: mongoose.Schema.Types.ObjectId, ref: "Checker", default: null },
  concernStatus: { type: String, enum: ["Fine", "Concern flagged"], default: "Fine" },
  // Premium is sold per elder per month, so subscription state lives here rather
  // than on User: one family member may upgrade some of their elders and not others.
  // `plan` records what was bought; whether access is currently granted is derived
  // from status + currentPeriodEnd by lib/subscription.js isPremium(), so a lapsed
  // subscription stops working without needing a scheduled job. Defaults keep every
  // existing elder on the free plan with no migration.
  subscription: {
    plan: { type: String, enum: ["free", "premium"], default: "free" },
    status: { type: String, enum: ["inactive", "active", "expired", "cancelled"], default: "inactive" },
    currentPeriodEnd: { type: Date, default: null },
    activatedAt: { type: Date, default: null },
    lastPaymentId: { type: mongoose.Schema.Types.ObjectId, ref: "SubscriptionPayment", default: null }
  },
  visitSchedule: {
    days: { type: [String], default: [] },
    escalateAfterHours: { type: Number, default: 4 }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Elder || mongoose.model("Elder", ElderSchema);
