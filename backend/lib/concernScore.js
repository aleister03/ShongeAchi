const WINDOW_DAYS = 42; 
const DEFAULT_THRESHOLDS = { elevated: 40, critical: 70 };
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

function categoryFor(score, thresholds) {
  if (score > thresholds.critical) return "Critical";
  if (score >= thresholds.elevated) return "Elevated";
  return "Stable";
}

/**
 * @param {Array} allVisits
 * @param {Date} [now]
 * @param {object} [thresholds]
 * @returns {object}.
 */
function computeConcernMetrics(allVisits, now = new Date(), thresholds = DEFAULT_THRESHOLDS) {
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

  // 1. Narrow down to the 6-week window
  const windowStart = new Date(now.getTime() - WINDOW_DAYS * 24 * 60 * 60 * 1000);
  const windowVisits = allVisits
    .filter((v) => new Date(v.visitDate) >= windowStart)
    .sort((a, b) => new Date(a.visitDate) - new Date(b.visitDate)); // oldest -> newest

  const scoredVisits = windowVisits.length > 0
    ? windowVisits
    : [...allVisits].sort((a, b) => new Date(a.visitDate) - new Date(b.visitDate)).slice(-3);

  // 2. Recency-weighted average
  let weightedSum = 0;
  let weightTotal = 0;
  scoredVisits.forEach((visit, i) => {
    const weight = i + 1;
    weightedSum += pointsForVisit(visit) * weight;
    weightTotal += weight;
  });
  const baseScore = weightTotal > 0 ? weightedSum / weightTotal : 0;

  // 3. Streak
  const mostRecentFirst = [...scoredVisits].reverse();
  const appetiteStreak = trailingStreak(mostRecentFirst, "appetiteLevel", "Poor");
  const mobilityStreak = trailingStreak(mostRecentFirst, "mobilityLevel", "Poor");
  const missedMedCount = scoredVisits.filter((v) => !v.medicationTaken).length;

  const appetiteBonus = appetiteStreak >= 2 ? Math.min(appetiteStreak * 7, 21) : 0;
  const mobilityStreakBonus = mobilityStreak >= 2 ? Math.min(mobilityStreak * 6, 18) : 0;
  const medicationBonus = missedMedCount >= 2 ? Math.min(missedMedCount * 5, 20) : 0;

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

  // 4. Configurable thresholds
  const category = categoryFor(concernScore, thresholds);

  // 5. 6-week trend
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
 * @param {object} metrics
 * @param {object} elder
 * @param {object} [thresholds]
 */
function applyOverride(metrics, elder, thresholds = DEFAULT_THRESHOLDS) {
  const override = elder?.concernOverride;
  if (!override || override.score === null || override.score === undefined) {
    return { ...metrics, override: null };
  }

  const concernScore = override.score;
  const category = categoryFor(concernScore, thresholds);

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

export { computeConcernMetrics, applyOverride, WINDOW_DAYS, DEFAULT_THRESHOLDS };