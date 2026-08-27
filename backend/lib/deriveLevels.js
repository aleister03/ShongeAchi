// Derives per-visit wellbeing levels from the raw questionnaire responses stored
// on a Visit. The Visit schema deliberately keeps only `status` + `responses`, so
// every consumer (concern score, concern breakdown, summary, AI assessment) funnels
// through here — this is the single place that knows how a questionnaire answer maps
// to a level.
//
// `appetiteLevel`, `moodLevel` and `medicationTaken` keep their original mappings
// exactly, because the deterministic concern score and the concern-breakdown labels
// depend on them. The remaining fields are additive.

const STEP_DOWN = { Good: "Fair", Fair: "Poor", Poor: "Poor" };

// q3 = "able to carry out usual daily activities", q4 = "difficulty with movement
// or independence". q3 sets the baseline and a "Yes" on q4 escalates it one step,
// so an elder who manages activities "Fully" but was observed struggling to move
// still registers as "Fair" rather than being scored as fully mobile.
function deriveMobility(byId) {
  const base = { Fully: "Good", Partially: "Fair", "Not able to": "Poor" }[byId.q3?.answer] || "Good";
  return byId.q4?.answer === "Yes" ? STEP_DOWN[base] : base;
}

// Free-text and follow-up detail written by the checker. These are the "checker
// observations" — the richest signal in the questionnaire and the part a rules-based
// score cannot read at all, so they are collected here for the AI prompt.
const OBSERVATION_QUESTIONS = [
  { id: "q2", label: "New physical discomfort", flagOn: "Yes" },
  { id: "q4", label: "Difficulty with movement", flagOn: "Yes" },
  { id: "q6", label: "Sleep / routine change", flagOn: "Yes" },
  { id: "q8", label: "Mood or behaviour change", flagOn: "Yes" },
  { id: "q9", label: "No social contact since last visit", flagOn: "No" },
  { id: "q11", label: "Living environment concern", flagOn: "Some concerns" },
  { id: "q12", label: "Support / necessities gap", flagOn: "Some gaps" },
  { id: "q14", label: "Needs follow-up", flagOn: "Yes" }
];

function deriveObservations(byId) {
  const observations = [];

  for (const { id, label, flagOn } of OBSERVATION_QUESTIONS) {
    const response = byId[id];
    if (!response) continue;
    const raised = response.answer === flagOn;
    const detail = (response.detail || "").trim();
    if (raised || detail) {
      observations.push({ label, answer: response.answer, detail });
    }
  }

  // q13 is a free-text "most noticeable change since the previous visit" field.
  const change = (byId.q13?.answer || "").trim();
  if (change) observations.push({ label: "Most noticeable change", answer: change, detail: "" });

  return observations;
}

export function deriveLevels(responses) {
  const byId = Object.fromEntries((responses || []).map((r) => [r.questionId, r]));
  const observations = deriveObservations(byId);

  return {
    appetiteLevel: { "Yes, normally": "Good", "Somewhat reduced": "Fair", "Poor intake": "Poor" }[byId.q5?.answer] || "Good",
    moodLevel: { "Cheerful / positive": "Good", "Neutral / calm": "Good", "Withdrawn": "Fair", "Distressed / anxious": "Poor" }[byId.q7?.answer] || "Good",
    // Unchanged semantics: "Partially" still counts as taken, so the deterministic
    // concern score keeps scoring exactly as before. `medicationAdherence` below
    // carries the finer distinction for trend analysis.
    medicationTaken: byId.q4b?.answer !== "No",

    // --- additive ---
    // Previously missing entirely, despite six call sites reading it.
    mobilityLevel: deriveMobility(byId),
    medicationAdherence: { Yes: "Full", Partially: "Partial", No: "None" }[byId.q4b?.answer] || "Full",
    engagementLevel: { "Yes, as usual": "Good", "Less than usual": "Fair", "Not at all": "Poor" }[byId.q10?.answer] || "Good",
    sleepDisrupted: byId.q6?.answer === "Yes",
    needsFollowUp: byId.q14?.answer === "Yes",
    observations,
    // Convenience string for prompt building / anywhere a flat note is expected.
    notes: observations
      .map((o) => (o.detail ? `${o.label}: ${o.answer} — ${o.detail}` : `${o.label}: ${o.answer}`))
      .join("; ")
  };
}
