// backend/lib/concernTrends.js
//
// Historical trend analysis for the AI-Powered Concern Metrics feature.
//
// Everything here is a pure function over already-loaded visit/report
// arrays. Two jobs:
//
//   1. Turn an elder's visit history into explicit trend signals, which
//      are fed to the AI as evidence *and* stored on the AiAssessment so a
//      reviewer can see what the judgement was based on.
//   2. Provide `deterministicTrendAssessment()` — a rules-based assessment
//      used as a fallback whenever the AI is unavailable, misconfigured,
//      returns something invalid, or there simply isn't enough history to
//      be worth asking about.
//
// NOTE on scoring: the window comparisons below (compareWindows) need a
// quick, symmetric way to score an arbitrary slice of visits so two
// windows can be compared against each other. That is NOT the same score
// shown anywhere else in the app — the one and only "official" concern
// score is lib/concernScore.js's computeConcernMetrics() (recency-weighted,
// with streak bonuses, already tested and displayed on every dashboard).
// _windowAverageScore() below is a private, unexported helper used only to
// compare one window of visits against another within this module; the
// `deterministicScore` this module receives as a parameter (from
// lib/concernAi.js) is always main's real computeConcernMetrics() result.
import { deriveLevels } from "./deriveLevels.js";

const DAY_MS = 86400000;

/** Flat average concern points per visit — a plain, symmetric yardstick for comparing two windows against each other. Not used anywhere outside this module. */
function _windowAverageScore(visits) {
  if (!visits.length) return 0;
  let total = 0;
  for (const v of visits) {
    const levels = v.responses ? { ...v, ...deriveLevels(v.responses) } : v;
    let pts = 0;
    if (levels.status === "Concerned") pts += 15;
    if (levels.status === "No Answer") pts += 20;
    if (levels.appetiteLevel === "Poor") pts += 10;
    else if (levels.appetiteLevel === "Fair") pts += 5;
    if (levels.mobilityLevel === "Poor") pts += 10;
    else if (levels.mobilityLevel === "Fair") pts += 5;
    if (levels.moodLevel === "Poor") pts += 10;
    if (!levels.medicationTaken) pts += 10;
    total += pts;
  }
  return Math.min(Math.round(total / visits.length), 100);
}

// How many of the most recent visits count as "now" when comparing against
// the earlier baseline.
export const RECENT_WINDOW = 3;

// Minimum |delta| on the 0-100 concern scale before a window comparison is
// called a trend rather than noise.
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

// Compares the most recent `windowSize` visits against everything before
// them. A positive delta means concern rose.
export function compareWindows(visits, windowSize = RECENT_WINDOW) {
  if (visits.length < 2) {
    return { earlierScore: null, recentScore: null, delta: null, earlierCount: 0, recentCount: visits.length };
  }

  const size = Math.min(windowSize, visits.length - 1);
  const splitAt = visits.length - size;
  const earlier = visits.slice(0, splitAt);
  const recent = visits.slice(splitAt);

  const earlierScore = _windowAverageScore(earlier);
  const recentScore = _windowAverageScore(recent);

  return {
    earlierScore,
    recentScore,
    delta: recentScore - earlierScore,
    earlierCount: earlier.length,
    recentCount: recent.length,
  };
}

// Medication adherence over the whole history and over the recent window,
// using the three-way `medicationAdherence` from deriveLevels rather than
// the flattened boolean.
export function computeAdherenceStats(visits, windowSize = RECENT_WINDOW) {
  const missed = (v) => v.medicationAdherence === "None";
  const partial = (v) => v.medicationAdherence === "Partial";
  const recent = visits.slice(-windowSize);

  return {
    fullAdherenceRate: rate(visits.filter((v) => !missed(v) && !partial(v)).length, visits.length),
    missedDoseVisits: visits.filter(missed).length,
    partialDoseVisits: visits.filter(partial).length,
    recentMissedDoseVisits: recent.filter(missed).length,
    recentPartialDoseVisits: recent.filter(partial).length,
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
    longestGapDays,
  };
}

// Longest run of consecutive "Concerned" visits, and whether the streak is
// live (extends to the most recent visit).
export function computeConcernStreaks(visits) {
  let current = 0;
  let longest = 0;

  for (const visit of visits) {
    current = visit.status === "Concerned" ? current + 1 : 0;
    if (current > longest) longest = current;
  }

  return { longestConcernStreak: longest, currentConcernStreak: current, streakIsOngoing: current > 0 };
}

// Shift in the share of visits where a given level field was Fair or Poor.
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
    direction: delta > 10 ? "Worsening" : delta < -10 ? "Improving" : "Stable",
  };
}

// Trend in the per-visit AI wellbeing score (VisitReport.wellbeingScore,
// 0-100 where higher is better).
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
    direction: delta >= TREND_DELTA_THRESHOLD ? "Improving" : delta <= -TREND_DELTA_THRESHOLD ? "Declining" : "Stable",
    pointsUsed: usable.length,
  };
}

// Distinct concerns the checkers wrote down in the recent window.
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

// State of the single most recent visit.
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
      || degradedFactors.length > 0,
  };
}

// Aggregates every signal above into the object handed to the AI and
// stored on the AiAssessment record.
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
    recentObservations: collectRecentObservations(visits),
  };
}

// ---------------------------------------------------------------------------
// Deterministic fallback assessment
// ---------------------------------------------------------------------------

function deterministicTrend(signals) {
  const concernDelta = signals.windowComparison.delta;
  const wellbeing = signals.wellbeingSlope.direction;

  if (concernDelta === null) {
    if (wellbeing === "Improving" || wellbeing === "Declining") return wellbeing;
    return "Stable";
  }

  if (concernDelta >= TREND_DELTA_THRESHOLD) {
    const stillLive = signals.streaks.streakIsOngoing
      || signals.latestVisit?.concerning
      || wellbeing === "Declining";
    return stillLive ? "Declining" : "Stable";
  }
  if (concernDelta <= -TREND_DELTA_THRESHOLD) return "Improving";

  if (wellbeing === "Declining") return "Declining";
  if (wellbeing === "Improving") return "Improving";
  return "Stable";
}

// Nudges the flat deterministic score by the direction and strength of the
// trend. Capped at ±12 so the result stays anchored to and explainable
// from the base score.
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
  Low: "Continue the current visit schedule.",
};

function recommendAction(level, aiTrend, signals) {
  const declining = aiTrend === "Declining";
  const ongoingStreak = signals.streaks?.streakIsOngoing && signals.streaks.currentConcernStreak >= 2;
  const missedMeds = (signals.adherence?.recentMissedDoseVisits ?? 0) > 0;
  const partialMeds = (signals.adherence?.recentPartialDoseVisits ?? 0) > 0;
  const unanswered = (signals.attendance?.missedVisits ?? 0) > 0
    && (signals.attendance?.daysSinceLastNoAnswer ?? 999) <= 14;

  if (declining && (ongoingStreak || missedMeds)) {
    return "Concern is rising: increase visit frequency and notify the family member.";
  }
  if (declining) {
    return "Concern is rising: follow up on the next visit and review sooner than scheduled.";
  }
  if (ongoingStreak) {
    return `${signals.streaks.currentConcernStreak} consecutive visits flagged — check in before the next scheduled visit.`;
  }
  if (missedMeds) return "Medication was missed recently — confirm adherence at the next visit.";
  if (unanswered) return "A recent visit went unanswered — confirm the elder is reachable.";
  if (partialMeds) return "Partial medication adherence — confirm the routine at the next visit.";

  return ACTION_BY_LEVEL[level];
}

function escalateLevel(level, aiTrend, signals) {
  const order = ["Low", "Moderate", "High", "Critical"];
  const atLeast = (floor) => (order.indexOf(level) >= order.indexOf(floor) ? level : floor);

  const ongoingStreak = signals.streaks?.streakIsOngoing && signals.streaks.currentConcernStreak >= 2;
  const missedMeds = (signals.adherence?.recentMissedDoseVisits ?? 0) > 0;

  if (aiTrend === "Declining" && (ongoingStreak || missedMeds)) return atLeast("High");
  if (aiTrend === "Declining") return atLeast("Moderate");
  if (ongoingStreak) return atLeast("Moderate");
  return level;
}

/**
 * Rules-based stand-in for the AI assessment. Returns exactly the shape
 * `generateConcernAssessment` returns, so callers can use either
 * interchangeably.
 *
 * @param {object} signals             from buildTrendSignals()
 * @param {number} deterministicScore  main's computeConcernMetrics() score
 * @param {string} reason              why the fallback is being used
 */
export function deterministicTrendAssessment(signals, deterministicScore, reason = "") {
  const aiTrend = deterministicTrend(signals);
  const aiConcernScore = Math.max(Math.min(deterministicScore + trendAdjustment(signals), 100), 0);
  const concernLevel = escalateLevel(concernLevelFromScore(aiConcernScore), aiTrend, signals);
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
    recommendedAction: recommendAction(concernLevel, aiTrend, signals),
    reasoning: `Rules-based assessment from ${basis}${reason ? ` (${reason})` : ""}. `
      + `Trend read as ${aiTrend} against a baseline concern score of ${deterministicScore}/100.${evidence}`,
  };
}
