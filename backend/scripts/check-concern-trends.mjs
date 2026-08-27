// Offline checks for the concern-trend analysis. No database and no Gemini key
// required — every function under test is pure. Run with: npm run test:trends
import assert from "node:assert/strict";
import { deriveLevels } from "../lib/deriveLevels.js";
import { calculateConcernScore } from "../lib/concernScore.js";
import {
  buildTrendSignals,
  compareWindows,
  computeAdherenceStats,
  computeAttendanceStats,
  computeConcernStreaks,
  computeLevelShift,
  computeWellbeingSlope,
  concernLevelFromScore,
  deterministicTrendAssessment
} from "../lib/concernTrends.js";

let passed = 0;
function check(label, fn) {
  try {
    fn();
    passed += 1;
    console.log(`  ok   ${label}`);
  } catch (error) {
    console.error(`  FAIL ${label}\n       ${error.message}`);
    process.exitCode = 1;
  }
}

const DAY = 86400000;
const base = Date.now() - 30 * DAY;

// Builds a visit the same way the API does: raw questionnaire responses with
// deriveLevels() merged on top.
function visit({ dayOffset, status = "Fine", activities = "Fully", movement = "No", medication = "Yes", food = "Yes, normally", mood = "Neutral / calm", participation = "Yes, as usual", followUp = "No", change = "" }) {
  const responses = [
    { questionId: "q3", answer: activities },
    { questionId: "q4", answer: movement, detail: movement === "Yes" ? "unsteady on their feet" : "" },
    { questionId: "q4b", answer: medication },
    { questionId: "q5", answer: food },
    { questionId: "q7", answer: mood },
    { questionId: "q10", answer: participation },
    { questionId: "q13", answer: change },
    { questionId: "q14", answer: followUp }
  ];
  return { status, visitDate: new Date(base + dayOffset * DAY), responses, ...deriveLevels(responses) };
}

const good = (dayOffset) => visit({ dayOffset });
const bad = (dayOffset) => visit({
  dayOffset, status: "Concerned", activities: "Partially", movement: "Yes",
  medication: "No", food: "Poor intake", mood: "Distressed / anxious",
  participation: "Not at all", followUp: "Yes", change: "Much frailer than last week."
});

console.log("\nderiveLevels");
check("derives mobilityLevel (previously always undefined)", () => {
  assert.equal(deriveLevels([{ questionId: "q3", answer: "Not able to" }]).mobilityLevel, "Poor");
  assert.equal(deriveLevels([{ questionId: "q3", answer: "Fully" }]).mobilityLevel, "Good");
});
check("a movement difficulty escalates mobility one step", () => {
  const r = [{ questionId: "q3", answer: "Fully" }, { questionId: "q4", answer: "Yes" }];
  assert.equal(deriveLevels(r).mobilityLevel, "Fair");
});
check("keeps original appetite/mood/medication mappings intact", () => {
  const levels = deriveLevels([
    { questionId: "q5", answer: "Somewhat reduced" },
    { questionId: "q7", answer: "Withdrawn" },
    { questionId: "q4b", answer: "Partially" }
  ]);
  assert.equal(levels.appetiteLevel, "Fair");
  assert.equal(levels.moodLevel, "Fair");
  assert.equal(levels.medicationTaken, true, "'Partially' must still count as taken");
});
check("separates partial from full medication adherence", () => {
  assert.equal(deriveLevels([{ questionId: "q4b", answer: "Partially" }]).medicationAdherence, "Partial");
  assert.equal(deriveLevels([{ questionId: "q4b", answer: "No" }]).medicationAdherence, "None");
});
check("captures checker free-text observations", () => {
  const levels = deriveLevels([
    { questionId: "q4", answer: "Yes", detail: "needed help standing" },
    { questionId: "q13", answer: "Quieter than usual." }
  ]);
  assert.equal(levels.observations.length, 2);
  assert.match(levels.notes, /needed help standing/);
});
check("tolerates empty and missing responses", () => {
  assert.equal(deriveLevels([]).mobilityLevel, "Good");
  assert.equal(deriveLevels(undefined).appetiteLevel, "Good");
  assert.deepEqual(deriveLevels(null).observations, []);
});

console.log("\nmobility now reaches the deterministic score");
check("a poor-mobility visit scores higher than before the fix", () => {
  const worst = bad(0);
  // Pre-fix this capped at 45 because mobilityLevel was never populated.
  assert.equal(calculateConcernScore([worst]), 55);
});

console.log("\ncompareWindows");
check("flags a decline when recent visits are worse", () => {
  const history = [good(0), good(3), good(6), bad(9), bad(12), bad(15)];
  const w = compareWindows(history);
  assert.equal(w.earlierCount, 3);
  assert.equal(w.recentCount, 3);
  assert.ok(w.delta > 20, `expected a large positive delta, got ${w.delta}`);
});
check("flags an improvement when recent visits are better", () => {
  const w = compareWindows([bad(0), bad(3), bad(6), good(9), good(12), good(15)]);
  assert.ok(w.delta < -20, `expected a large negative delta, got ${w.delta}`);
});
check("reads flat when nothing changes", () => {
  assert.equal(compareWindows([good(0), good(3), good(6), good(9)]).delta, 0);
});
check("never lets the recent window consume the whole history", () => {
  const w = compareWindows([good(0), good(3)]);
  assert.equal(w.earlierCount, 1);
  assert.equal(w.recentCount, 1);
});
check("returns nulls for a single visit", () => {
  assert.equal(compareWindows([good(0)]).delta, null);
});
check("returns nulls for no visits", () => {
  assert.equal(compareWindows([]).delta, null);
});

console.log("\nattendance, adherence and streaks");
check("counts missed visits and their rate", () => {
  const history = [good(0), visit({ dayOffset: 3, status: "No Answer" }), good(6), good(9)];
  const a = computeAttendanceStats(history);
  assert.equal(a.missedVisits, 1);
  assert.equal(a.missedVisitRate, 25);
});
check("measures the longest gap in coverage", () => {
  assert.equal(computeAttendanceStats([good(0), good(2), good(20)]).longestGapDays, 18);
});
check("distinguishes missed from partial doses", () => {
  const history = [
    visit({ dayOffset: 0, medication: "No" }),
    visit({ dayOffset: 3, medication: "Partially" }),
    visit({ dayOffset: 6, medication: "Yes" })
  ];
  const s = computeAdherenceStats(history);
  assert.equal(s.missedDoseVisits, 1);
  assert.equal(s.partialDoseVisits, 1);
  assert.ok(Math.abs(s.fullAdherenceRate - 33.3) < 0.5);
});
check("identifies an ongoing concern streak", () => {
  const s = computeConcernStreaks([good(0), bad(3), bad(6), bad(9)]);
  assert.equal(s.longestConcernStreak, 3);
  assert.equal(s.currentConcernStreak, 3);
  assert.equal(s.streakIsOngoing, true);
});
check("does not treat a resolved streak as ongoing", () => {
  const s = computeConcernStreaks([bad(0), bad(3), good(6)]);
  assert.equal(s.longestConcernStreak, 2);
  assert.equal(s.streakIsOngoing, false);
});

console.log("\nlevel shifts and wellbeing slope");
check("detects mood worsening across windows", () => {
  const history = [good(0), good(3), good(6), bad(9), bad(12), bad(15)];
  assert.equal(computeLevelShift(history, "moodLevel").direction, "Worsening");
});
check("detects mood improving across windows", () => {
  const history = [bad(0), bad(3), bad(6), good(9), good(12), good(15)];
  assert.equal(computeLevelShift(history, "moodLevel").direction, "Improving");
});
check("reads a falling wellbeing score as declining", () => {
  const reports = [90, 88, 85, 60, 55, 50].map((wellbeingScore, i) => ({ wellbeingScore, createdAt: new Date(base + i * DAY) }));
  const slope = computeWellbeingSlope(reports);
  assert.equal(slope.direction, "Declining");
  assert.ok(slope.delta < 0);
});
check("ignores failed reports whose score is a placeholder zero", () => {
  const reports = [
    { wellbeingScore: 80, generationFailed: false },
    { wellbeingScore: 0, generationFailed: true },
    { wellbeingScore: 78, generationFailed: false }
  ];
  assert.equal(computeWellbeingSlope(reports).pointsUsed, 2);
});
check("handles an empty report history", () => {
  const slope = computeWellbeingSlope([]);
  assert.equal(slope.direction, "Unknown");
  assert.equal(slope.delta, null);
});

console.log("\nconcern levels");
check("maps scores to levels at the documented boundaries", () => {
  assert.equal(concernLevelFromScore(0), "Low");
  assert.equal(concernLevelFromScore(24), "Low");
  assert.equal(concernLevelFromScore(25), "Moderate");
  assert.equal(concernLevelFromScore(49), "Moderate");
  assert.equal(concernLevelFromScore(50), "High");
  assert.equal(concernLevelFromScore(74), "High");
  assert.equal(concernLevelFromScore(75), "Critical");
  assert.equal(concernLevelFromScore(100), "Critical");
});

console.log("\ndeterministic fallback assessment");
const decliningHistory = [good(0), good(3), good(6), bad(9), bad(12), bad(15)];
const improvingHistory = [bad(0), bad(3), bad(6), good(9), good(12), good(15)];
const steadyHistory = [good(0), good(3), good(6), good(9), good(12)];

check("calls a genuine decline Declining", () => {
  const signals = buildTrendSignals(decliningHistory, []);
  const a = deterministicTrendAssessment(signals, calculateConcernScore(decliningHistory));
  assert.equal(a.aiTrend, "Declining");
  assert.ok(a.flaggedPatterns.length > 0, "expected patterns to be flagged");
});
check("calls a genuine recovery Improving", () => {
  const signals = buildTrendSignals(improvingHistory, []);
  assert.equal(deterministicTrendAssessment(signals, calculateConcernScore(improvingHistory)).aiTrend, "Improving");
});
check("calls an unchanging history Stable", () => {
  const signals = buildTrendSignals(steadyHistory, []);
  const a = deterministicTrendAssessment(signals, calculateConcernScore(steadyHistory));
  assert.equal(a.aiTrend, "Stable");
  assert.equal(a.concernLevel, "Low");
});
check("does not call a single bad visit in a long good history a decline", () => {
  const history = [good(0), good(3), good(6), good(9), good(12), bad(15), good(18), good(21)];
  const signals = buildTrendSignals(history, []);
  assert.equal(deterministicTrendAssessment(signals, calculateConcernScore(history)).aiTrend, "Stable");
});
check("lets the wellbeing slope break a tie when concern is flat", () => {
  const reports = [95, 92, 90, 55, 52, 50].map((wellbeingScore) => ({ wellbeingScore, generationFailed: false }));
  const signals = buildTrendSignals(steadyHistory, reports);
  assert.equal(deterministicTrendAssessment(signals, calculateConcernScore(steadyHistory)).aiTrend, "Declining");
});
check("always returns the same shape the AI path returns", () => {
  const signals = buildTrendSignals(decliningHistory, []);
  const a = deterministicTrendAssessment(signals, calculateConcernScore(decliningHistory), "test reason");
  for (const key of ["aiConcernScore", "aiTrend", "concernLevel", "flaggedPatterns", "recommendedAction", "reasoning"]) {
    assert.ok(key in a, `missing ${key}`);
  }
  assert.ok(Number.isInteger(a.aiConcernScore) && a.aiConcernScore >= 0 && a.aiConcernScore <= 100);
  assert.ok(["Improving", "Stable", "Declining"].includes(a.aiTrend));
  assert.ok(["Low", "Moderate", "High", "Critical"].includes(a.concernLevel));
  assert.match(a.reasoning, /test reason/);
});
check("keeps the score in range even with an extreme base", () => {
  const signals = buildTrendSignals(decliningHistory, []);
  assert.equal(deterministicTrendAssessment(signals, 100).aiConcernScore, 100);
  assert.equal(deterministicTrendAssessment(buildTrendSignals(improvingHistory, []), 0).aiConcernScore, 0);
});
check("works from a single visit (limited-history path)", () => {
  const signals = buildTrendSignals([bad(0)], []);
  const a = deterministicTrendAssessment(signals, calculateConcernScore([bad(0)]), "only 1 visit");
  assert.equal(a.aiTrend, "Stable", "one visit is not a trend");
  assert.match(a.reasoning, /a single logged visit/);
});

console.log("\nbuildTrendSignals");
check("produces every signal group without throwing on an empty history", () => {
  const s = buildTrendSignals([], []);
  assert.equal(s.visitsAnalyzed, 0);
  assert.equal(s.windowComparison.delta, null);
  assert.equal(s.attendance.missedVisits, 0);
});
check("surfaces recent checker observations for the prompt", () => {
  const s = buildTrendSignals(decliningHistory, []);
  assert.ok(s.recentObservations.length > 0);
  assert.ok(s.recentObservations.some((o) => /frailer/i.test(o)), "expected the q13 free text to be carried through");
});
check("counts follow-up requests", () => {
  assert.equal(buildTrendSignals(decliningHistory, []).followUpsRequested, 3);
});

// ---------------------------------------------------------------------------
// AI response validation. Imported last because lib/gemini.js constructs the
// Gemini client at module load; no key is needed to exercise the validators.
// ---------------------------------------------------------------------------
const { validateAiAssessment, validateReport } = await import("../lib/gemini.js");

const validAssessment = {
  aiConcernScore: 62,
  aiTrend: "Declining",
  concernLevel: "High",
  flaggedPatterns: ["appetite falling over last 3 visits"],
  recommendedAction: "Increase visit frequency.",
  reasoning: "Appetite and mood both degraded across the last three visits."
};

console.log("\nAI assessment response validation");
check("accepts a well-formed response", () => {
  const a = validateAiAssessment(JSON.stringify(validAssessment));
  assert.equal(a.aiConcernScore, 62);
  assert.equal(a.aiTrend, "Declining");
  assert.equal(a.concernLevel, "High");
});
check("accepts an already-parsed object", () => {
  assert.equal(validateAiAssessment(validAssessment).aiTrend, "Declining");
});
check("strips a markdown code fence", () => {
  const fenced = "```json\n" + JSON.stringify(validAssessment) + "\n```";
  assert.equal(validateAiAssessment(fenced).aiConcernScore, 62);
});
check("normalises trend casing and whitespace", () => {
  assert.equal(validateAiAssessment({ ...validAssessment, aiTrend: "  declining " }).aiTrend, "Declining");
});
check("clamps an out-of-range score", () => {
  assert.equal(validateAiAssessment({ ...validAssessment, aiConcernScore: 480 }).aiConcernScore, 100);
  assert.equal(validateAiAssessment({ ...validAssessment, aiConcernScore: -12 }).aiConcernScore, 0);
});
check("rounds a fractional score", () => {
  assert.equal(validateAiAssessment({ ...validAssessment, aiConcernScore: 61.6 }).aiConcernScore, 62);
});
check("recomputes an out-of-vocabulary concernLevel from the score", () => {
  assert.equal(validateAiAssessment({ ...validAssessment, concernLevel: "Very Bad" }).concernLevel, "High");
});
check("tolerates a missing concernLevel", () => {
  const { concernLevel, ...rest } = validAssessment;
  assert.equal(validateAiAssessment(rest).concernLevel, "High");
});
check("tolerates a missing recommendedAction", () => {
  const { recommendedAction, ...rest } = validAssessment;
  assert.equal(validateAiAssessment(rest).recommendedAction, "");
});
check("drops non-string entries from flaggedPatterns", () => {
  const a = validateAiAssessment({ ...validAssessment, flaggedPatterns: ["real", 42, null, "  ", "also real"] });
  assert.deepEqual(a.flaggedPatterns, ["real", "also real"]);
});
check("tolerates flaggedPatterns not being an array", () => {
  assert.deepEqual(validateAiAssessment({ ...validAssessment, flaggedPatterns: "nope" }).flaggedPatterns, []);
});
check("caps flaggedPatterns at ten entries", () => {
  const many = Array.from({ length: 40 }, (_, i) => `pattern ${i}`);
  assert.equal(validateAiAssessment({ ...validAssessment, flaggedPatterns: many }).flaggedPatterns.length, 10);
});
for (const [label, bad] of [
  ["unparseable JSON", "this is not json at all"],
  ["an empty string", "   "],
  ["a non-numeric score", { ...validAssessment, aiConcernScore: "very high" }],
  ["a missing score", (() => { const { aiConcernScore, ...r } = validAssessment; return r; })()],
  ["an invalid trend", { ...validAssessment, aiTrend: "Catastrophic" }],
  ["a missing trend", (() => { const { aiTrend, ...r } = validAssessment; return r; })()],
  ["empty reasoning", { ...validAssessment, reasoning: "   " }],
  ["missing reasoning", (() => { const { reasoning, ...r } = validAssessment; return r; })()]
]) {
  check(`rejects ${label}`, () => {
    assert.throws(() => validateAiAssessment(bad));
  });
}

console.log("\nvisit report response validation");
const validReport = {
  wellbeingScore: 74,
  moodAssessment: "settled",
  trendDirection: "Stable",
  flags: [],
  summary: "A good visit overall with no new concerns."
};
check("accepts a well-formed report", () => {
  assert.equal(validateReport(JSON.stringify(validReport)).wellbeingScore, 74);
});
check("defaults a missing moodAssessment", () => {
  const { moodAssessment, ...rest } = validReport;
  assert.equal(validateReport(rest).moodAssessment, "not assessed");
});
check("clamps an out-of-range wellbeingScore", () => {
  assert.equal(validateReport({ ...validReport, wellbeingScore: 1000 }).wellbeingScore, 100);
});
check("rejects a report with an invalid trendDirection", () => {
  assert.throws(() => validateReport({ ...validReport, trendDirection: "Sideways" }));
});
check("rejects a report with no summary", () => {
  assert.throws(() => validateReport({ ...validReport, summary: "" }));
});

console.log(`\n${passed} checks passed in total${process.exitCode ? " (with failures above)" : ""}\n`);
