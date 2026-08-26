import mongoose from "mongoose";

const CheckerRequestSchema = new mongoose.Schema({
  elderId: { type: mongoose.Schema.Types.ObjectId, ref: "Elder", required: true },
  elderName: { type: String, required: true },
  familyMemberId: { type: String, required: true },
  type: { type: String, enum: ["Assign", "Remove"], required: true },
  reason: { type: String, default: "" },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  previousCheckerId: { type: mongoose.Schema.Types.ObjectId, ref: "Checker", default: null },
  previousCheckerName: { type: String, default: "" },
  requestedAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date, default: null },
  resolvedNote: { type: String, default: "" },
});

export default mongoose.models.CheckerRequest || mongoose.model("CheckerRequest", CheckerRequestSchema);