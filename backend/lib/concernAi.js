import Visit from "@/models/Visit";
import Elder from "@/models/Elder";
import VisitReport from "@/models/VisitReport";
import AiAssessment from "@/models/AiAssessment";
import { deriveLevels } from "@/lib/deriveLevels";
import { computeConcernMetrics } from "@/lib/concernScore";
import { buildTrendSignals, deterministicTrendAssessment, concernLevelFromScore } from "@/lib/concernTrends";
import { generateConcernAssessment, isAiConfigured } from "@/lib/ai";

// Shape handed to the model: one compact object per visit, oldest first.
export function normalizeVisits(visits) {
  return visits.map((v) => ({
    date: v.visitDate,
    status: v.status,
    appetite: v.appetiteLevel,
    mobility: v.mobilityLevel,
    mood: v.moodLevel,
    engagement: v.engagementLevel,
    medicationAdherence: v.medicationAdherence,
    sleepDisrupted: v.sleepDisrupted,
    observations: (v.observations || []).map((o) => (o.detail ? `${o.label}: ${o.answer} — ${o.detail}` : `${o.label}: ${o.answer}`)),
  }));
}

// The per-visit wellbeing reports are the existing wellbeing metric in
// this system. Feeding their history to the assessment lets the AI
// reconcile its own trend call against what was already concluded visit
// by visit.
export function normalizeReports(reports) {
  return reports
    .filter((r) => !r.generationFailed)
    .map((r) => ({
      date: r.createdAt,
      wellbeingScore: r.wellbeingScore,
      mood: r.moodAssessment,
      trend: r.trendDirection,
      flags: r.flags,
      summary: r.summary,
    }));
}

export function prepareTrendSignals(visits, reports = []) {
  return buildTrendSignals(visits, reports);
}

// Below this, a trend judgement from a language model is not meaningful —
// there isn't enough history to have a trajectory. We still produce a
// deterministic assessment so the UI has something honest to show.
export const MIN_VISITS_FOR_AI_ASSESSMENT = 3;

function summarizeAiError(error) {
  const message = String(error?.message ?? "");
  if (/\b(503|UNAVAILABLE|high demand|overloaded)\b/i.test(message)) return "the AI service was temporarily unavailable";
  if (/\b(429|quota|rate limit)\b/i.test(message)) return "the AI service rate limit was reached";
  if (/\b(401|403|API key|permission)\b/i.test(message)) return "the AI service rejected our credentials";
  if (/timed? ?out|ETIMEDOUT|ECONNRESET/i.test(message)) return "the AI service did not respond in time";
  if (/not valid JSON|invalid|missing/i.test(message)) return "the AI service returned an unusable response";
  return "the AI service could not be reached";
}

// Divergence threshold between the AI's score and the deterministic score.
const DIVERGENCE_THRESHOLD = 20;

// Elder.concernStatus threshold — an elder is flagged if the assessment
// finds either a declining trend or a high absolute concern score.
const CONCERN_FLAG_SCORE_THRESHOLD = 60;

export function deriveConcernStatus({ aiConcernScore, aiTrend }) {
  return aiTrend === "Declining" || aiConcernScore >= CONCERN_FLAG_SCORE_THRESHOLD
    ? "Concern flagged"
    : "Fine";
}

export function computeScoresDiverge(aiConcernScore, deterministicScore) {
  return Math.abs(aiConcernScore - deterministicScore) >= DIVERGENCE_THRESHOLD;
}

/**
 * Runs a full concern assessment for one elder.
 *
 * Pipeline: load visit history -> derive per-visit levels (lib/deriveLevels)
 * -> compute the deterministic baseline (lib/concernScore's
 * computeConcernMetrics — the exact same number shown everywhere else in
 * the app) -> build trend signals (lib/concernTrends) -> ask Grok for the
 * trend judgement -> persist an AiAssessment -> update
 * Elder.concernStatus.
 *
 * Degradation, in order:
 *   - no visits at all      -> { skipped: true }, nothing persisted
 *   - fewer than MIN visits -> deterministic assessment, source "fallback",
 *                              dataSufficiency "limited"
 *   - AI unconfigured/failed/invalid -> deterministic assessment, source
 *                              "fallback", with `fallbackReason` recorded
 *
 * Never throws for AI-side problems; callers logging a visit must not be
 * blocked (this is always invoked from a background after() task).
 */
export async function runAiAssessment(elderId) {
  const elder = await Elder.findById(elderId);
  if (!elder) return { skipped: true, reason: "Elder not found" };

  const rawVisits = await Visit.find({ elderId }).sort({ visitDate: 1 });
  const visits = rawVisits.map((v) => ({ ...v.toObject(), ...deriveLevels(v.responses) }));

  if (visits.length === 0) {
    return { skipped: true, reason: "No visits logged for this elder yet" };
  }

  const rawReports = await VisitReport.find({ elderId }).sort({ createdAt: 1 }).lean();

  // The one "official" concern score used everywhere else in the app.
  const deterministicScore = computeConcernMetrics(visits).concernScore;
  const normalizedVisits = normalizeVisits(visits);
  const reportHistory = normalizeReports(rawReports);
  const trendSignals = buildTrendSignals(visits, rawReports);

  const hasEnoughHistory = visits.length >= MIN_VISITS_FOR_AI_ASSESSMENT;

  let result;
  let source = "ai";
  let fallbackReason = "";

  if (!hasEnoughHistory) {
    fallbackReason = `only ${visits.length} of ${MIN_VISITS_FOR_AI_ASSESSMENT} visits needed for an AI trend assessment`;
    result = deterministicTrendAssessment(trendSignals, deterministicScore, fallbackReason);
    source = "fallback";
  } else if (!isAiConfigured()) {
    fallbackReason = "AI assessment is not configured (XAI_API_KEY missing)";
    result = deterministicTrendAssessment(trendSignals, deterministicScore, fallbackReason);
    source = "fallback";
  } else {
    try {
      result = await generateConcernAssessment(elder, normalizedVisits, reportHistory, trendSignals, deterministicScore);
    } catch (error) {
      console.error("AI concern assessment failed, using deterministic fallback:", error.message);
      fallbackReason = `AI assessment unavailable (${summarizeAiError(error)})`;
      result = deterministicTrendAssessment(trendSignals, deterministicScore, fallbackReason);
      source = "fallback";
    }
  }

  const assessment = await AiAssessment.create({
    elderId,
    aiConcernScore: result.aiConcernScore,
    aiTrend: result.aiTrend,
    concernLevel: result.concernLevel || concernLevelFromScore(result.aiConcernScore),
    flaggedPatterns: result.flaggedPatterns,
    recommendedAction: result.recommendedAction || "",
    reasoning: result.reasoning,
    deterministicScoreAtRun: deterministicScore,
    scoresDiverge: computeScoresDiverge(result.aiConcernScore, deterministicScore),
    visitsAnalyzed: visits.length,
    reportsAnalyzed: reportHistory.length,
    signals: trendSignals,
    source,
    fallbackReason,
    dataSufficiency: hasEnoughHistory ? "sufficient" : "limited",
  });

  // With only one or two visits there is no trajectory yet, so a single
  // rough visit can't flip the elder's status on the dashboards. The
  // assessment is still saved and shown — it just doesn't drive
  // escalation.
  if (hasEnoughHistory) {
    // updateOne, not elder.save(): save() revalidates the ENTIRE document,
    // so an elder with any pre-existing unrelated validation issue would
    // throw here and the concern flag would silently fail to update.
    await Elder.updateOne({ _id: elderId }, { $set: { concernStatus: deriveConcernStatus(result) } });
  }

  return { skipped: false, assessment, source, usedFallback: source === "fallback" };
}
