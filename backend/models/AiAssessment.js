import mongoose from "mongoose";

// One row per assessment run, so the history doubles as the trend graph the frontend
// plots. Fields added for AI-Powered Concern Metrics are all optional with defaults,
// so AiAssessment documents written by the earlier version still read back cleanly.
const AiAssessmentSchema = new mongoose.Schema({
  elderId: { type: mongoose.Schema.Types.ObjectId, ref: "Elder", required: true },
  aiConcernScore: { type: Number, required: true, min: 0, max: 100 },
  aiTrend: { type: String, enum: ["Improving", "Stable", "Declining"], required: true },
  concernLevel: { type: String, enum: ["Low", "Moderate", "High", "Critical"], default: "Low" },
  flaggedPatterns: { type: [String], default: [] },
  recommendedAction: { type: String, default: "" },
  reasoning: { type: String, required: true },
  deterministicScoreAtRun: { type: Number, required: true },
  scoresDiverge: { type: Boolean, default: false },
  visitsAnalyzed: { type: Number, required: true },
  reportsAnalyzed: { type: Number, default: 0 },

  // Snapshot of the trend signals the judgement was based on. Stored so a reviewer can
  // audit an assessment after the fact, and so the UI can show the breakdown without
  // recomputing. Mixed because the signal set is expected to grow.
  signals: { type: mongoose.Schema.Types.Mixed, default: {} },

  // "ai" when Gemini produced this, "fallback" when the deterministic rules did. The
  // UI labels fallbacks explicitly rather than presenting them as model output.
  source: { type: String, enum: ["ai", "fallback"], default: "ai" },
  fallbackReason: { type: String, default: "" },
  dataSufficiency: { type: String, enum: ["sufficient", "limited"], default: "sufficient" },

  createdAt: { type: Date, default: Date.now }
});

AiAssessmentSchema.index({ elderId: 1, createdAt: -1 });

export default mongoose.models.AiAssessment || mongoose.model("AiAssessment", AiAssessmentSchema);
