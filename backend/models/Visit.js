import mongoose from "mongoose";

const VisitSchema = new mongoose.Schema({
  elderId: { type: mongoose.Schema.Types.ObjectId, ref: "Elder", required: true },
  checkerId: { type: String, required: true },
  checkerName: { type: String, required: true },
  status: { type: String, enum: ["Fine", "Concerned", "No Answer"], required: true },
  notes: { type: String, default: "" },
  appetiteLevel: { type: String, enum: ["Good", "Fair", "Poor"], default: "Good" },
  mobilityLevel: { type: String, enum: ["Good", "Fair", "Poor"], default: "Good" },
  moodLevel: { type: String, enum: ["Good", "Fair", "Poor"], default: "Good" },
  medicationTaken: { type: Boolean, default: true },
  visitDate: { type: Date, default: Date.now }
});

export default mongoose.models.Visit || mongoose.model("Visit", VisitSchema);