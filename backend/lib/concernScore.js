// Deterministic concern score, extracted from wellbeing/[id]/concern-score/route.js
// so it can be reused wherever a non-AI baseline score is needed (e.g. the AI
// concern assessment uses it as `deterministicScoreAtRun` for comparison).
export function calculateConcernScore(visits) {
  if (visits.length === 0) return 0;
  let score = 0;
  visits.forEach(visit => {
    if (visit.status === "Concerned") score += 15;
    if (visit.status === "No Answer") score += 20;
    if (visit.appetiteLevel === "Poor") score += 10;
    if (visit.appetiteLevel === "Fair") score += 5;
    if (visit.mobilityLevel === "Poor") score += 10;
    if (visit.mobilityLevel === "Fair") score += 5;
    if (visit.moodLevel === "Poor") score += 10;
    if (!visit.medicationTaken) score += 10;
  });
  return Math.min(Math.round(score / visits.length), 100);
}

// ---------------------------------------------------------------------------
// Restored after the merge
// ---------------------------------------------------------------------------
// The merge kept this file but dropped the teammate's version of it, which exported
// computeConcernMetrics() and applyOverride(). Four routes still import them and the
// backend would not build:
//
//   app/api/wellbeing/dashboard
//   app/api/wellbeing/checker/[checkerId]
//   app/api/wellbeing/[id]/trend
//   app/api/elders/[id]/summary
//
// Rebuilt from their call sites (concernScore, category, trend, contributingFactors,
// totalVisits, override) on top of calculateConcernScore above, so there is one
// scoring scale in the codebase rather than two that can disagree.

import { deriveLevels } from "./deriveLevels.js";

// Category thresholds. Deliberately aligned with concernLevelFromScore() in
// lib/concernTrends.js: Stable < 25, Elevated < 50, Critical >= 50. That collapses
// concernTrends' High/Critical into the single "Critical" bucket the dashboard filters
// on, so the two systems can never label the same elder differently.
export function categoryForScore(score) {
  if (score >= 50) return "Critical";
  if (score >= 25) return "Elevated";
  return "Stable";
}

// Visits may arrive as raw documents (status + responses only), so the per-visit
// levels the score depends on are derived here if they are not already present.
function withLevels(visits) {
  return (visits ?? []).map((visit) => {
    const value = visit?.toObject ? visit.toObject() : visit;
    if (value?.moodLevel !== undefined) return value;
    return { ...value, ...deriveLevels(value?.responses) };
  });
}

const RECENT_WINDOW = 3;

/**
 * Deterministic concern metrics for one elder's visit history.
 *
 * @param visits  the elder's visits, oldest first
 * @param now     evaluation time (the trend endpoint replays history, so this matters)
 * @returns {{ concernScore, category, trend, contributingFactors, totalVisits, override }}
 */
export function computeConcernMetrics(visits, now = new Date()) {
  const all = withLevels(visits).filter((visit) => {
    const date = new Date(visit.visitDate ?? visit.date ?? now);
    return !Number.isFinite(date.getTime()) || date.getTime() <= new Date(now).getTime();
  });

  const concernScore = calculateConcernScore(all);

  // Trend: the recent window against everything before it, on the same scale.
  let trend = "Stable";
  if (all.length >= 2) {
    const size = Math.min(RECENT_WINDOW, all.length - 1);
    const splitAt = all.length - size;
    const delta = calculateConcernScore(all.slice(splitAt)) - calculateConcernScore(all.slice(0, splitAt));
    if (delta >= 8) trend = "Declining";
    else if (delta <= -8) trend = "Improving";
  }

  // Named reasons the score is what it is, newest visits weighted by inclusion in the
  // recent window. Ordered most to least severe.
  const recent = all.slice(-RECENT_WINDOW);
  const factors = [];
  const count = (predicate) => recent.filter(predicate).length;

  const noAnswer = count((v) => v.status === "No Answer");
  const concerned = count((v) => v.status === "Concerned");
  const missedMeds = count((v) => v.medicationTaken === false);
  const poorMobility = count((v) => v.mobilityLevel === "Poor");
  const poorAppetite = count((v) => v.appetiteLevel === "Poor");
  const poorMood = count((v) => v.moodLevel === "Poor");

  if (noAnswer) factors.push(`${noAnswer} unanswered visit${noAnswer === 1 ? "" : "s"} recently`);
  if (concerned) factors.push(`${concerned} visit${concerned === 1 ? "" : "s"} flagged as concerning`);
  if (missedMeds) factors.push(`Medication missed on ${missedMeds} recent visit${missedMeds === 1 ? "" : "s"}`);
  if (poorMobility) factors.push("Poor mobility observed");
  if (poorAppetite) factors.push("Poor appetite observed");
  if (poorMood) factors.push("Low mood observed");

  return {
    concernScore,
    category: categoryForScore(concernScore),
    trend,
    contributingFactors: factors,
    totalVisits: all.length,
    override: null
  };
}

/**
 * Applies an elder's manual concern override, if one is set.
 *
 * Elder.concernOverride is `{ score, note, setByCheckerId, ... }` with score defaulting
 * to null. A set score replaces the computed one and the category is recomputed from
 * it; the computed value is preserved as `calculatedScore` so a reviewer can see what
 * was overridden. `trend` and `contributingFactors` are left untouched — they describe
 * the visit history, which an override does not change.
 */
export function applyOverride(metrics, elder) {
  const override = elder?.concernOverride;
  const score = override?.score;
  if (score === null || score === undefined || !Number.isFinite(Number(score))) return metrics;

  const overridden = Math.min(Math.max(Math.round(Number(score)), 0), 100);
  return {
    ...metrics,
    concernScore: overridden,
    category: categoryForScore(overridden),
    calculatedScore: metrics.concernScore,
    override: {
      score: overridden,
      note: override.note ?? "",
      setByCheckerId: override.setByCheckerId ?? null,
      setAt: override.setAt ?? null
    }
  };
}
