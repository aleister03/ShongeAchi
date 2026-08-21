// backend/lib/concernScore.js
//
// AI-Powered Concern Metrics — scoring engine.
//
// IMPORTANT (per project rules): this is a RULE-BASED calculator, not a
// trained AI/ML model. It turns an elder's recent Visit documents into:
//   - a 0-100 "concern score"
//   - a Critical / Elevated / Stable category
//   - a 6-week trend (is it getting worse, and how fast)
//   - a short list of "contributing factors" explaining the score
//
// It is intentionally just weighted arithmetic over fields checkers already
// fill in on every visit (status, appetiteLevel, mobilityLevel, moodLevel,
// medicationTaken). Nothing here is a neural network or an external AI call.
// If real AI/ML is added later (e.g. an LLM writing the plain-English
// summary), that would live in a separate, clearly-labelled module.
//
// This file has no dependency on Next.js or Mongoose — it's a pure function
// of "an array of visit-like objects" to "a metrics object". That's what
// makes it reusable by both the per-elder endpoint and the dashboard
// endpoint, and easy to unit test.

const WINDOW_DAYS = 42; // 6 weeks — matches the "6-week trend" shown in the UI

// Points added per visit for each concerning observation. These weights are
// the same ones the original single-visit calculator used, so a single bad
// visit still means the same thing it always did — we're only changing HOW
// MANY visits we look at and HOW we combine them.
const POINTS = {
  statusConcerned: 15,
  statusNoAnswer: 20,
  appetitePoor: 10,
  appetiteFair: 5,
  mobilityPoor: 10,
  mobilityFair: 5,
  moodPoor: 10,
  medicationMissed: 10,
};

const LEVEL_SCORE = { Good: 0, Fair: 1, Poor: 2 };

/** Raw concern points contributed by a single visit (0-70ish, uncapped). */
function pointsForVisit(visit) {
  let pts = 0;
  if (visit.status === "Concerned") pts += POINTS.statusConcerned;
  if (visit.status === "No Answer") pts += POINTS.statusNoAnswer;
  if (visit.appetiteLevel === "Poor") pts += POINTS.appetitePoor;
  else if (visit.appetiteLevel === "Fair") pts += POINTS.appetiteFair;
  if (visit.mobilityLevel === "Poor") pts += POINTS.mobilityPoor;
  else if (visit.mobilityLevel === "Fair") pts += POINTS.mobilityFair;
  if (visit.moodLevel === "Poor") pts += POINTS.moodPoor;
  if (!visit.medicationTaken) pts += POINTS.medicationMissed;
  return pts;
}

/** Longest run of `visits[i][field] === value`, counted from the most recent visit backwards. */
function trailingStreak(visitsDesc, field, value) {
  let streak = 0;
  for (const v of visitsDesc) {
    if (v[field] === value) streak += 1;
    else break;
  }
  return streak;
}

function daysBetween(a, b) {
  return Math.abs(new Date(a) - new Date(b)) / (1000 * 60 * 60 * 24);
}

/**
 * Compute the concern score + explanation for ONE elder from THEIR visits.
 *
 * @param {Array} allVisits - every Visit document for this elder (any order).
 * @param {Date} [now] - "current time", overridable for tests.
 * @returns {object} metrics — see fields below.
 */
function computeConcernMetrics(allVisits, now = new Date()) {
  if (!allVisits || allVisits.length === 0) {
    return {
      concernScore: 0,
      category: "Stable",
      trend: { direction: "stable", label: "No data", pointsChange: 0, weeks: 0 },
      contributingFactors: ["No visits recorded yet"],
      totalVisits: 0,
      windowVisits: 0,
    };
  }

  // 1. Narrow down to the 6-week window the dashboard advertises. Visits
  //    older than that still exist in Mongo, we just don't let them affect
  //    "current" concern — a bad visit two months ago shouldn't keep an
  //    elder flagged as Critical forever.
  const windowStart = new Date(now.getTime() - WINDOW_DAYS * 24 * 60 * 60 * 1000);
  const windowVisits = allVisits
    .filter((v) => new Date(v.visitDate) >= windowStart)
    .sort((a, b) => new Date(a.visitDate) - new Date(b.visitDate)); // oldest -> newest

  // Fall back to the elder's most recent visits if none fall inside the
  // window (e.g. a checker hasn't visited in 7+ weeks — still worth scoring).
  const scoredVisits = windowVisits.length > 0
    ? windowVisits
    : [...allVisits].sort((a, b) => new Date(a.visitDate) - new Date(b.visitDate)).slice(-3);

  // 2. Recency-weighted average, not a flat average. Visit 1 of 6 gets
  //    weight 1, visit 6 gets weight 6 — so three straight recent bad visits
  //    move the score much more than one bad visit from a month ago.
  let weightedSum = 0;
  let weightTotal = 0;
  scoredVisits.forEach((visit, i) => {
    const weight = i + 1;
    weightedSum += pointsForVisit(visit) * weight;
    weightTotal += weight;
  });
  const baseScore = weightTotal > 0 ? weightedSum / weightTotal : 0;

  // 3. Streak/pattern bonuses — these are the parts a plain average misses
  //    entirely, and they're exactly the pattern described in the spec
  //    ("three consecutive poor-appetite reports").
  const mostRecentFirst = [...scoredVisits].reverse();
  const appetiteStreak = trailingStreak(mostRecentFirst, "appetiteLevel", "Poor");
  const mobilityStreak = trailingStreak(mostRecentFirst, "mobilityLevel", "Poor");
  const missedMedCount = scoredVisits.filter((v) => !v.medicationTaken).length;

  const appetiteBonus = appetiteStreak >= 2 ? Math.min(appetiteStreak * 7, 21) : 0;
  const mobilityStreakBonus = mobilityStreak >= 2 ? Math.min(mobilityStreak * 6, 18) : 0;
  const medicationBonus = missedMedCount >= 2 ? Math.min(missedMedCount * 5, 20) : 0;

  // Declining mobility trend: compare the average mobility "badness" in the
  // first half of the window against the second half. A rising average
  // means mobility is getting worse over time, independent of streaks.
  let mobilityTrendBonus = 0;
  if (scoredVisits.length >= 4) {
    const mid = Math.floor(scoredVisits.length / 2);
    const firstHalfAvg =
      scoredVisits.slice(0, mid).reduce((s, v) => s + (LEVEL_SCORE[v.mobilityLevel] ?? 0), 0) / mid;
    const secondHalfAvg =
      scoredVisits.slice(mid).reduce((s, v) => s + (LEVEL_SCORE[v.mobilityLevel] ?? 0), 0) /
      (scoredVisits.length - mid);
    const delta = secondHalfAvg - firstHalfAvg;
    if (delta > 0) mobilityTrendBonus = Math.min(Math.round(delta * 15), 20);
  }

  const concernScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(baseScore + appetiteBonus + mobilityStreakBonus + medicationBonus + mobilityTrendBonus)
    )
  );

  // 4. Category — thresholds match the dashboard's own legend.
  let category = "Stable";
  if (concernScore > 70) category = "Critical";
  else if (concernScore >= 40) category = "Elevated";

  // 5. 6-week trend: how much has the score moved since the start of the
  //    window, and over how many weeks.
  let trend = { direction: "stable", label: "stable", pointsChange: 0, weeks: 0 };
  if (scoredVisits.length >= 2) {
    const earliestScore = pointsForVisit(scoredVisits[0]);
    const pointsChange = concernScore - earliestScore;
    const spanDays = daysBetween(scoredVisits[0].visitDate, scoredVisits[scoredVisits.length - 1].visitDate);
    const weeks = Math.max(1, Math.round(spanDays / 7));
    if (pointsChange > 5) {
      trend = { direction: "up", label: `↑ ${pointsChange}pts / ${weeks}wk`, pointsChange, weeks };
    } else if (pointsChange < -5) {
      trend = { direction: "down", label: `↓ ${Math.abs(pointsChange)}pts / ${weeks}wk`, pointsChange, weeks };
    } else {
      trend = { direction: "stable", label: "stable", pointsChange, weeks };
    }
  }

  // 6. Contributing factors — plain-English, built only from real fields
  //    (no invented statuses like "unwell").
  const contributingFactors = [];
  if (appetiteStreak >= 2) contributingFactors.push(`Poor appetite ×${appetiteStreak}`);
  if (missedMedCount >= 1) contributingFactors.push(`missed meds ×${missedMedCount}`);
  if (mobilityStreak >= 2) contributingFactors.push(`Poor mobility ×${mobilityStreak}`);
  else if (mobilityTrendBonus > 0) contributingFactors.push("Declining mobility trend");
  const concernedCount = scoredVisits.filter((v) => v.status === "Concerned").length;
  if (concernedCount >= 1) contributingFactors.push(`Checker flagged concern ×${concernedCount}`);
  const noAnswerCount = scoredVisits.filter((v) => v.status === "No Answer").length;
  if (noAnswerCount >= 1) contributingFactors.push(`No answer ×${noAnswerCount}`);

  return {
    concernScore,
    category,
    trend,
    contributingFactors: contributingFactors.length > 0 ? contributingFactors.slice(0, 2) : ["No concerns flagged"],
    totalVisits: allVisits.length,
    windowVisits: scoredVisits.length,
  };
}

/**
 * Layer a checker's manual override (Elder.concernOverride, see Elder model)
 * on top of a computed metrics object, if one is present. Centralised here
 * so every endpoint that returns a concern score (single-elder, dashboard,
 * checker list) shows the same effective number instead of drifting apart.
 *
 * Does not mutate `metrics` — returns a new object.
 */
function applyOverride(metrics, elder) {
  const override = elder?.concernOverride;
  if (!override || override.score === null || override.score === undefined) {
    return { ...metrics, override: null };
  }

  const concernScore = override.score;
  let category = "Stable";
  if (concernScore > 70) category = "Critical";
  else if (concernScore >= 40) category = "Elevated";

  return {
    ...metrics,
    concernScore,
    category,
    override: {
      score: override.score,
      note: override.note || "",
      setByCheckerId: override.setByCheckerId || null,
      setAt: override.setAt || null,
    },
  };
}

export { computeConcernMetrics, applyOverride, WINDOW_DAYS };
