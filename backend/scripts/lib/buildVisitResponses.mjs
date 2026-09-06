// backend/scripts/lib/buildVisitResponses.mjs
//
// Seed scripts want to express a visit scenario simply ("poor appetite,
// fair mobility, medication missed"), but Visit documents now store a
// 14-question structured interview (see lib/visitQuestions.js) rather than
// flat level fields. This picks question answers that reverse-map through
// lib/deriveLevels.js to the requested levels, filling in reasonable
// defaults for every other question so seeded visits look like real
// check-ins rather than sparse test fixtures.
const APPETITE_ANSWER = { Good: "Yes, normally", Fair: "Somewhat reduced", Poor: "Poor intake" };
const MOOD_ANSWER = { Good: "Neutral / calm", Fair: "Withdrawn", Poor: "Distressed / anxious" };
// q3 sets the mobility baseline directly; q4="No" means no escalation, so
// this alone reproduces Good/Fair/Poor without needing the escalation path.
const MOBILITY_ANSWER = { Good: "Fully", Fair: "Partially", Poor: "Not able to" };
const MEDICATION_ANSWER = { true: "Yes", false: "No" };

export function buildVisitResponses({
  appetite = "Good",
  mobility = "Good",
  mood = "Good",
  medicationTaken = true,
  notes = "",
} = {}) {
  return [
    { questionId: "q1", answer: "About the same" },
    { questionId: "q2", answer: "No" },
    { questionId: "q3", answer: MOBILITY_ANSWER[mobility] },
    { questionId: "q4", answer: "No" },
    { questionId: "q4b", answer: MEDICATION_ANSWER[String(medicationTaken)] },
    { questionId: "q5", answer: APPETITE_ANSWER[appetite] },
    { questionId: "q6", answer: "No change" },
    { questionId: "q7", answer: MOOD_ANSWER[mood] },
    { questionId: "q8", answer: "No" },
    { questionId: "q9", answer: "Yes" },
    { questionId: "q10", answer: "Yes, as usual" },
    { questionId: "q11", answer: "Yes" },
    { questionId: "q12", answer: "Yes" },
    { questionId: "q13", answer: notes || "" },
    { questionId: "q14", answer: "No" },
  ];
}
