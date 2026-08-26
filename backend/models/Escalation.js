import mongoose from "mongoose";

// One record per active (or resolved) escalation raised by the Automated
// Escalation Engine (see backend/lib/escalationEngine.js). Elder/checker
// names are denormalized onto the document at creation time so the admin
// escalation list renders without extra joins — same pattern the
// wellbeing dashboard uses for checkerName.
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
  // Simple audit trail of what the automation "did" for this escalation.
  // Real notification dispatch (email/in-app) is a separate feature
  // (Module 3, Multi-channel notification system) — this just records
  // that the step happened, so the timeline is visible either way.
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