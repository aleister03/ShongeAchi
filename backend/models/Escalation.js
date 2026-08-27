import mongoose from "mongoose";

const EscalationSchema = new mongoose.Schema({
  elderId: { type: mongoose.Schema.Types.ObjectId, ref: "Elder", required: true },
  elderName: { type: String, required: true },
  checkerId: { type: mongoose.Schema.Types.ObjectId, ref: "Checker", default: null },
  checkerName: { type: String, default: "Unassigned" },

  triggerType: { type: String, enum: ["No Answer", "Concerned", "Missed Visit"], required: true },
  severity: { type: String, enum: ["Critical", "Elevated"], required: true },
  reason: { type: String, required: true },
  relatedVisitId: { type: mongoose.Schema.Types.ObjectId, ref: "Visit", default: null },

  status: { type: String, enum: ["Open", "Cleared"], default: "Open" },
  escalationSteps: [
    {
      stage: { type: String, required: true },
      note: { type: String, default: "" },
      at: { type: Date, default: Date.now },
    },
  ],

  triggeredAt: { type: Date, default: Date.now },
  clearedAt: { type: Date, default: null },
  clearedNote: { type: String, default: "" },
});

export default mongoose.models.Escalation || mongoose.model("Escalation", EscalationSchema);