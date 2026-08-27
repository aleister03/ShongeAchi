import mongoose from "mongoose";

const VisitSchema = new mongoose.Schema({
  elderId: { type: mongoose.Schema.Types.ObjectId, ref: "Elder", required: true },
  checkerId: { type: String, required: true },
  checkerName: { type: String, required: true },
  status: { type: String, enum: ["Fine", "Concerned", "No Answer"], required: true },
  responses: [{
    questionId: { type: String, required: true },
    answer: { type: String, required: true },
    detail: { type: String, default: "" }
  }],
  visitDate: { type: Date, default: Date.now },
});

export default mongoose.models.Visit || mongoose.model("Visit", VisitSchema);