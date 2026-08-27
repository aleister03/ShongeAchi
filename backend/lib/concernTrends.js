// Historical trend analysis for the AI-Powered Concern Metrics feature.
//
// Everything here is a pure function over already-loaded visit/report arrays, so it
// runs without a database and is unit-testable (see scripts/check-concern-trends.mjs).
// Two jobs:
//
//   1. Turn an elder's visit history into explicit trend signals, which are fed to
//      Gemini as evidence *and* stored on the AiAssessment so a reviewer can see what
//      the judgement was based on.
//   2. Provide `deterministicTrendAssessment()` — a rules-based assessment used as a
//      fallback whenever the AI is unavailable, misconfigured, returns something
//      invalid, or there simply isn't enough history to be worth asking about. The
//      card is never left empty just because the model was unreachable.
//
// It deliberately reuses `calculateConcernScore` from lib/concernScore.js as the
// scoring primitive rather than inventing a second scale, so a window score and the
// headline deterministic score are always directly comparable.

import { calculateConcernScore } from "./concernScore.js";

const DAY_MS = 86400000;

// How many of the most recent visits count as "now" when comparing against the
// earlier baseline. Small enough to react to a real change, large enough that one
// bad afternoon does not read as a decline.
export const RECENT_WINDOW = 3;

// Minimum |delta| on the 0-100 concern scale before a window comparison is called a
// trend rather than noise.
const TREND_DELTA_THRESHOLD = 8;

export function concernLevelFromScore(score) {
  if (score >= 75) return "Critical";
  if (score >= 50) return "High";
  if (score >= 25) return "Moderate";
  return "Low";
}

function plural(count, word) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

function round(value, digits = 1) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function rate(count, total) {
  return total > 0 ? round((count / total) * 100, 1) : null;
}

// Compares the most recent `windowSize` visits against everything before them using
// the existing deterministic concern score. A positive delta means concern rose.
// Returns nulls when there isn't a distinct before-and-after to compare.
export function compareWindows(visits, windowSize = RECENT_WINDOW) {
  if (visits.length < 2) {
    return { earlierScore: null, recentScore: null, delta: null, earlierCount: 0, recentCount: visits.length };
  }

  // Never let the recent window swallow the whole history — always keep at least one
  // earlier visit to compare against.
  const size = Math.min(windowSize, visits.length - 1);
  const splitAt = visits.length - size;
  const earlier = visits.slice(0, splitAt);
  const recent = visits.slice(splitAt);

  const earlierScore = calculateConcernScore(earlier);
  const recentScore = calculateConcernScore(recent);

  return {
    earlierScore,
    recentScore,
    delta: recentScore - earlierScore,
    earlierCount: earlier.length,
    recentCount: recent.length
  };
}

// Medication adherence over the whole history and over the recent window, using the
// three-way `medicationAdherence` from deriveLevels rather than the flattened boolean.
export function computeAdherenceStats(visits, windowSize = RECENT_WINDOW) {
  const missed = (v) => v.medicationAdherence === "None";
  const partial = (v) => v.medicationAdherence === "Partial";
  const recent = visits.slice(-windowSize);

  return {
    fullAdherenceRate: rate(visits.filter((v) => !missed(v) && !partial(v)).length, visits.length),
    missedDoseVisits: visits.filter(missed).length,
    partialDoseVisits: visits.filter(partial).length,
    recentMissedDoseVisits: recent.filter(missed).length,
    recentPartialDoseVisits: recent.filter(partial).length
  };
}

// Missed visits ("No Answer"), visit cadence and the largest gap in coverage.
export function computeAttendanceStats(visits, now = Date.now()) {
  const noAnswer = visits.filter((v) => v.status === "No Answer");
  const dates = visits.map((v) => new Date(v.visitDate ?? v.date).getTime()).filter(Number.isFinite);

  let longestGapDays = null;
  for (let i = 1; i < dates.length; i += 1) {
    const gap = Math.round((dates[i] - dates[i - 1]) / DAY_MS);
    if (longestGapDays === null || gap > longestGapDays) longestGapDays = gap;
  }

  const lastNoAnswer = noAnswer.length
    ? Math.max(...noAnswer.map((v) => new Date(v.visitDate ?? v.date).getTime()))
    : null;

  return {
    missedVisits: noAnswer.length,
    missedVisitRate: rate(noAnswer.length, visits.length),
    daysSinceLastVisit: dates.length ? Math.floor((now - Math.max(...dates)) / DAY_MS) : null,
    daysSinceLastNoAnswer: lastNoAnswer === null ? null : Math.floor((now - lastNoAnswer) / DAY_MS),
    longestGapDays
  };
}

// Longest run of consecutive "Concerned" visits, and whether the streak is live
// (i.e. the run extends to the most recent visit) — an ongoing run matters far more
// than an equally long one that resolved months ago.
export function computeConcernStreaks(visits) {
  let current = 0;
  let longest = 0;

  for (const visit of visits) {
    current = visit.status === "Concerned" ? current + 1 : 0;
    if (current > longest) longest = current;
  }

  return { longestConcernStreak: longest, currentConcernStreak: current, streakIsOngoing: current > 0 };
}

// Shift in the share of visits where a given level field was Fair or Poor. Used for
// mood, mobility, appetite and engagement — "mood changes over time" in signal form.
export function computeLevelShift(visits, field, windowSize = RECENT_WINDOW) {
  const degraded = (v) => v[field] === "Poor" || v[field] === "Fair";
  if (visits.length < 2) {
    return { field, earlierRate: null, recentRate: null, delta: null, direction: "Unknown" };
  }

  const size = Math.min(windowSize, visits.length - 1);
  const splitAt = visits.length - size;
  const earlierRate = rate(visits.slice(0, splitAt).filter(degraded).length, splitAt);
  const recentRate = rate(visits.slice(splitAt).filter(degraded).length, size);
  const delta = round(recentRate - earlierRate, 1);

  return {
    field,
    earlierRate,
    recentRate,
    delta,
    direction: delta > 10 ? "Worsening" : delta < -10 ? "Improving" : "Stable"
  };
}

// Trend in the per-visit AI wellbeing score (VisitReport.wellbeingScore, 0-100 where
// higher is better — the inverse direction of the concern scale). This is the existing
// wellbeing metric the previous implementation never looked at. Rows with
// `generationFailed` are excluded because their score is a placeholder 0.
export function computeWellbeingSlope(reports, windowSize = RECENT_WINDOW) {
  const usable = reports.filter((r) => !r.generationFailed && Number.isFinite(r.wellbeingScore));

  if (usable.length < 2) {
    return { earlierAverage: null, recentAverage: null, delta: null, direction: "Unknown", pointsUsed: usable.length };
  }

  const size = Math.min(windowSize, usable.length - 1);
  const splitAt = usable.length - size;
  const mean = (rows) => round(rows.reduce((sum, r) => sum + r.wellbeingScore, 0) / rows.length, 1);

  const earlierAverage = mean(usable.slice(0, splitAt));
  const recentAverage = mean(usable.slice(splitAt));
  const delta = round(recentAverage - earlierAverage, 1);

  return {
    earlierAverage,
    recentAverage,
    delta,
    // Higher wellbeing is better, so a rising average is an improving trend.
    direction: delta >= TREND_DELTA_THRESHOLD ? "Improving" : delta <= -TREND_DELTA_THRESHOLD ? "Declining" : "Stable",
    pointsUsed: usable.length
  };
}

// Distinct concerns the checkers wrote down in the recent window. Free-text detail is
// the one signal no rules engine can score, so it is surfaced verbatim for the model.
export function collectRecentObservations(visits, windowSize = RECENT_WINDOW, limit = 12) {
  const recent = visits.slice(-windowSize);
  const collected = [];

  for (const visit of recent) {
    for (const observation of visit.observations || []) {
      const text = observation.detail
        ? `${observation.label}: ${observation.answer} — ${observation.detail}`
        : `${observation.label}: ${observation.answer}`;
      if (!collected.includes(text)) collected.push(text);
    }
  }

  return collected.slice(0, limit);
}

// State of the single most recent visit. A window average can be dragged upward by one
// bad visit that has since resolved, so the trend logic checks whether the situation is
// still live before calling a decline.
export function describeLatestVisit(visits) {
  const latest = visits[visits.length - 1];
  if (!latest) return { present: false, concerning: false, status: null, degradedFactors: [] };

  const degradedFactors = ["moodLevel", "mobilityLevel", "appetiteLevel", "engagementLevel"]
    .filter((field) => latest[field] === "Poor" || latest[field] === "Fair");

  return {
    present: true,
    status: latest.status,
    degradedFactors,
    medicationAdherence: latest.medicationAdherence ?? null,
    concerning:
      latest.status === "Concerned"
      || latest.status === "No Answer"
      || latest.medicationAdherence === "None"
      || degradedFactors.length > 0
  };
}

// Aggregates every signal above into the object handed to Gemini and stored on the
// AiAssessment record.
export function buildTrendSignals(visits, reports = [], now = Date.now()) {
  return {
    visitsAnalyzed: visits.length,
    latestVisit: describeLatestVisit(visits),
    reportsAnalyzed: reports.filter((r) => !r.generationFailed).length,
    recentWindowSize: Math.min(RECENT_WINDOW, visits.length),
    windowComparison: compareWindows(visits),
    attendance: computeAttendanceStats(visits, now),
    adherence: computeAdherenceStats(visits),
    streaks: computeConcernStreaks(visits),
    moodShift: computeLevelShift(visits, "moodLevel"),
    mobilityShift: computeLevelShift(visits, "mobilityLevel"),
    appetiteShift: computeLevelShift(visits, "appetiteLevel"),
    engagementShift: computeLevelShift(visits, "engagementLevel"),
    wellbeingSlope: computeWellbeingSlope(reports),
    followUpsRequested: visits.filter((v) => v.needsFollowUp).length,
    recentObservations: collectRecentObservations(visits)
  };
}

// ---------------------------------------------------------------------------
// Deterministic fallback assessment
// ---------------------------------------------------------------------------

// Combines the window comparison with the wellbeing-score slope to decide a trend
// without asking a model. Concern delta is the primary signal; the wellbeing slope
// (which comes from a different source — the per-visit reports) breaks ties and can
// confirm a borderline call.
function deterministicTrend(signals) {
  const concernDelta = signals.windowComparison.delta;
  const wellbeing = signals.wellbeingSlope.direction;

  if (concernDelta === null) {
    if (wellbeing === "Improving" || wellbeing === "Declining") return wellbeing;
    return "Stable";
  }

  if (concernDelta >= TREND_DELTA_THRESHOLD) {
    // The recent window is worse on average — but a mean is easily dragged up by a
    // single rough visit the elder has since recovered from. Only call it a decline if
    // the situation is still live: an unresolved concern streak, a latest visit that is
    // itself concerning, or a corroborating drop in the wellbeing series.
    const stillLive = signals.streaks.streakIsOngoing
      || signals.latestVisit?.concerning
      || wellbeing === "Declining";
    return stillLive ? "Declining" : "Stable";
  }
  if (concernDelta <= -TREND_DELTA_THRESHOLD) return "Improving";

  // Concern score is flat — let the independent wellbeing series decide.
  if (wellbeing === "Declining") return "Declining";
  if (wellbeing === "Improving") return "Improving";
  return "Stable";
}

// Nudges the flat deterministic score by the direction and strength of the trend, so
// a rising trajectory reads as more concerning than the same score holding steady.
// Capped at ±12 so the result stays anchored to and explainable from the base score.
function trendAdjustment(signals) {
  let adjustment = 0;
  const delta = signals.windowComparison.delta;

  if (delta !== null) adjustment += Math.max(Math.min(delta / 2, 8), -8);
  if (signals.streaks.streakIsOngoing && signals.streaks.currentConcernStreak >= 2) adjustment += 4;
  if (signals.adherence.recentMissedDoseVisits > 0) adjustment += 3;
  if (signals.moodShift.direction === "Worsening") adjustment += 2;
  if (signals.moodShift.direction === "Improving") adjustment -= 2;
  if (signals.wellbeingSlope.direction === "Declining") adjustment += 3;
  if (signals.wellbeingSlope.direction === "Improving") adjustment -= 3;

  return Math.max(Math.min(Math.round(adjustment), 12), -12);
}

// Human-readable patterns, derived from the same signals. These mirror the shape of
// the AI's `flaggedPatterns` so the UI renders both identically.
function deterministicPatterns(signals) {
  const patterns = [];
  const { windowComparison: window, streaks, adherence, attendance, moodShift, mobilityShift, appetiteShift, wellbeingSlope } = signals;

  if (window.delta !== null && Math.abs(window.delta) >= TREND_DELTA_THRESHOLD) {
    const direction = window.delta > 0 ? "rose" : "fell";
    patterns.push(`Concern score ${direction} ${Math.abs(window.delta)} points across the last ${plural(window.recentCount, "visit")} versus the ${plural(window.earlierCount, "visit")} before`);
  }
  if (streaks.streakIsOngoing && streaks.currentConcernStreak >= 2) {
    patterns.push(`${streaks.currentConcernStreak} consecutive visits currently flagged as Concerned`);
  }
  if (adherence.recentMissedDoseVisits > 0) {
    patterns.push(`Medication missed on ${adherence.recentMissedDoseVisits} of the last ${plural(signals.recentWindowSize, "visit")}`);
  } else if (adherence.recentPartialDoseVisits > 0) {
    patterns.push(`Partial medication adherence on ${adherence.recentPartialDoseVisits} of the last ${plural(signals.recentWindowSize, "visit")}`);
  }
  if (attendance.missedVisits > 0) {
    patterns.push(`${plural(attendance.missedVisits, "unanswered visit")} on record (${attendance.missedVisitRate}% of all visits)`);
  }
  for (const [label, shift] of [["Mood", moodShift], ["Mobility", mobilityShift], ["Appetite", appetiteShift]]) {
    if (shift.direction === "Worsening") patterns.push(`${label} worsening — degraded on ${shift.recentRate}% of recent visits versus ${shift.earlierRate}% earlier`);
    if (shift.direction === "Improving") patterns.push(`${label} improving — degraded on ${shift.recentRate}% of recent visits versus ${shift.earlierRate}% earlier`);
  }
  if (wellbeingSlope.direction === "Declining") {
    patterns.push(`Per-visit wellbeing score down ${Math.abs(wellbeingSlope.delta)} points on average`);
  }
  if (wellbeingSlope.direction === "Improving") {
    patterns.push(`Per-visit wellbeing score up ${wellbeingSlope.delta} points on average`);
  }

  return patterns.slice(0, 10);
}

const ACTION_BY_LEVEL = {
  Critical: "Contact the emergency contact and arrange an in-person welfare check.",
  High: "Increase visit frequency and notify the family member.",
  Moderate: "Keep the current schedule but review again after the next visit.",
  Low: "Continue the current visit schedule."
};

/**
 * Rules-based stand-in for the AI assessment. Returns exactly the shape
 * `generateConcernAssessment` returns, so callers can use either interchangeably.
 *
 * @param {object}  signals             from buildTrendSignals()
 * @param {number}  deterministicScore  headline calculateConcernScore() result
 * @param {string}  reason              why the fallback is being used (surfaced in the UI)
 */
export function deterministicTrendAssessment(signals, deterministicScore, reason = "") {
  const aiTrend = deterministicTrend(signals);
  const aiConcernScore = Math.max(Math.min(deterministicScore + trendAdjustment(signals), 100), 0);
  const concernLevel = concernLevelFromScore(aiConcernScore);
  const patterns = deterministicPatterns(signals);

  const basis = signals.visitsAnalyzed === 1
    ? "a single logged visit"
    : `${signals.visitsAnalyzed} logged visits`;
  const evidence = patterns.length
    ? ` Strongest signals: ${patterns.slice(0, 3).join("; ")}.`
    : " No individual factor stood out across the history.";

  return {
    aiConcernScore,
    aiTrend,
    concernLevel,
    flaggedPatterns: patterns,
    recommendedAction: ACTION_BY_LEVEL[concernLevel],
    reasoning: `Rules-based assessment from ${basis}${reason ? ` (${reason})` : ""}. `
      + `Trend read as ${aiTrend} against a baseline concern score of ${deterministicScore}/100.${evidence}`
  };
}
