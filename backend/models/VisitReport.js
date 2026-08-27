import mongoose from "mongoose";

const VisitReportSchema = new mongoose.Schema({
  visitId: { type: mongoose.Schema.Types.ObjectId, ref: "Visit", required: true, unique: true },
  elderId: { type: mongoose.Schema.Types.ObjectId, ref: "Elder", required: true },
  wellbeingScore: { type: Number, required: true, min: 0, max: 100 },
  moodAssessment: { type: String, required: true },
  trendDirection: { type: String, enum: ["Improving", "Stable", "Declining"], required: true },
  flags: { type: [String], default: [] },
  summary: { type: String, required: true },
  generationFailed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

VisitReportSchema.index({ elderId: 1, createdAt: 1 });

export default mongoose.models.VisitReport || mongoose.model("VisitReport", VisitReportSchema);