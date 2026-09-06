import mongoose from "mongoose";

// CHANGED: replaced the flat appetiteLevel/mobilityLevel/moodLevel/medicationTaken
// fields with a structured questionnaire response array (see
// lib/visitQuestions.js for the question set, lib/deriveLevels.js for how a
// response array is turned back into the level fields the scoring engine and
// UI expect). This is a genuinely richer check-in — a fixed 14-question
// interview covering overall condition, daily functioning, food/sleep, mood,
// social contact, environment, and open-ended change detection — instead of
// four dropdowns.
const VisitSchema = new mongoose.Schema({
  elderId: { type: mongoose.Schema.Types.ObjectId, ref: "Elder", required: true },
  checkerId: { type: String, required: true },
  checkerName: { type: String, required: true },
  status: { type: String, enum: ["Fine", "Concerned", "No Answer"], required: true },
  responses: [
    {
      questionId: { type: String, required: true },
      answer: { type: String, required: true },
      detail: { type: String, default: "" },
    },
  ],
  visitDate: { type: Date, default: Date.now },

  // Only set when the visit was logged against a scheduled slot — an ad-hoc
  // visit leaves these unset, which keeps the on-time-rate calculation on
  // the checker detail page meaningful (it should only count visits that had
  // a target time to be measured against).
  scheduledAt: { type: Date, default: null },
  completedAt: { type: Date, default: null },
});

export default mongoose.models.Visit || mongoose.model("Visit", VisitSchema);

