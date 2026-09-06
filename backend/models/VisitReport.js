import mongoose from "mongoose";

// One AI-generated wellbeing report per visit. Created as a pending
// placeholder the moment a visit is logged, then filled in by a background
// job (see the after() call in app/api/wellbeing/[id]/visits/route.js) once
// the AI responds — so the checker gets an immediate response instead of
// waiting 10-40s for the AI call.
const VisitReportSchema = new mongoose.Schema({
  visitId: { type: mongoose.Schema.Types.ObjectId, ref: "Visit", required: true, unique: true },
  elderId: { type: mongoose.Schema.Types.ObjectId, ref: "Elder", required: true },
  wellbeingScore: { type: Number, required: true, min: 0, max: 100 },
  moodAssessment: { type: String, required: true },
  trendDirection: { type: String, enum: ["Improving", "Stable", "Declining"], required: true },
  flags: { type: [String], default: [] },
  summary: { type: String, required: true },
  generationFailed: { type: Boolean, default: false },
  // True between saving a visit and the AI finishing.
  pending: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

VisitReportSchema.index({ elderId: 1, createdAt: 1 });

export default mongoose.models.VisitReport || mongoose.model("VisitReport", VisitReportSchema);
