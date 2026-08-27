import Visit from "@/models/Visit";
import Elder from "@/models/Elder";
import VisitReport from "@/models/VisitReport";
import AiAssessment from "@/models/AiAssessment";
import { deriveLevels } from "@/lib/deriveLevels";
import { calculateConcernScore } from "@/lib/concernScore";
import { buildTrendSignals, deterministicTrendAssessment, concernLevelFromScore } from "@/lib/concernTrends";
import { generateConcernAssessment, isAiConfigured } from "@/lib/gemini";

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
    // Checker free-text. Previously read `v.notes` off the Visit document, which has
    // no such field, so this was always an empty string.
    observations: (v.observations || []).map((o) => (o.detail ? `${o.label}: ${o.answer} — ${o.detail}` : `${o.label}: ${o.answer}`))
  }));
}

// The per-visit wellbeing reports are the existing wellbeing metric in this system.
// Feeding their history to the assessment lets the AI reconcile its own trend call
// against what was already concluded visit by visit.
export function normalizeReports(reports) {
  return reports
    .filter((r) => !r.generationFailed)
    .map((r) => ({
      date: r.createdAt,
      wellbeingScore: r.wellbeingScore,
      mood: r.moodAssessment,
      trend: r.trendDirection,
      flags: r.flags,
      summary: r.summary
    }));
}

// Retained as the module's public name for signal building (the previous version
// exported it). Takes visits with deriveLevels() already merged on — the same array
// runAiAssessment builds — plus the raw VisitReport rows.
export function prepareTrendSignals(visits, reports = []) {
  return buildTrendSignals(visits, reports);
}

// Below this, a trend judgement from a language model is not meaningful — there isn't
// enough history to have a trajectory. We still produce a deterministic assessment so
// the UI has something honest to show.
export const MIN_VISITS_FOR_AI_ASSESSMENT = 3;

// Turns a provider error into one short human phrase. The full message is still
// logged; only the display copy is condensed.
function summarizeAiError(error) {
  const message = String(error?.message ?? "");
  if (/\b(503|UNAVAILABLE|high demand|overloaded)\b/i.test(message)) return "the AI service was temporarily unavailable";
  if (/\b(429|quota|rate limit)\b/i.test(message)) return "the AI service rate limit was reached";
  if (/\b(401|403|API key|permission)\b/i.test(message)) return "the AI service rejected our credentials";
  if (/timed? ?out|ETIMEDOUT|ECONNRESET/i.test(message)) return "the AI service did not respond in time";
  if (/not valid JSON|invalid|missing/i.test(message)) return "the AI service returned an unusable response";
  return "the AI service could not be reached";
}

// Divergence threshold between the AI's score and the deterministic score. Surfaced
// to reviewers via `scoresDiverge` rather than silently trusting either one.
const DIVERGENCE_THRESHOLD = 20;

// Elder.concernStatus threshold — an elder is flagged if the assessment finds either
// a declining trend or a high absolute concern score.
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
 * Pipeline: load visit history -> derive per-visit levels (lib/deriveLevels, the same
 * mapping the deterministic endpoints use) -> compute the deterministic baseline
 * (lib/concernScore, the same calculation /concern-score returns) -> build trend
 * signals (lib/concernTrends) -> ask Gemini for the trend judgement -> persist an
 * AiAssessment -> update Elder.concernStatus.
 *
 * Degradation, in order:
 *   - no visits at all      -> { skipped: true }, nothing persisted
 *   - fewer than MIN visits -> deterministic assessment, source "fallback",
 *                              dataSufficiency "limited"
 *   - AI unconfigured/failed/invalid -> deterministic assessment, source "fallback",
 *                              with `fallbackReason` recorded and surfaced in the UI
 *
 * Never throws for AI-side problems; callers logging a visit must not be blocked.
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

  const deterministicScore = calculateConcernScore(visits);
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
    fallbackReason = "AI assessment is not configured (GEMINI_API_KEY missing)";
    result = deterministicTrendAssessment(trendSignals, deterministicScore, fallbackReason);
    source = "fallback";
  } else {
    try {
      result = await generateConcernAssessment(elder, normalizedVisits, reportHistory, trendSignals, deterministicScore);
    } catch (error) {
      // Covers transport failures, malformed JSON and responses that fail validation.
      console.error("AI concern assessment failed, using deterministic fallback:", error.message);
      // error.message can contain a raw provider JSON payload (a 503 body, for
      // example). That is useful in the log but must not appear in text a family
      // member reads, so it is summarised here and kept in full in the console.
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
    dataSufficiency: hasEnoughHistory ? "sufficient" : "limited"
  });

  // With only one or two visits there is no trajectory yet, so we don't let a single
  // rough visit flip the elder's status on the dashboards. The assessment is still
  // saved and shown — it just doesn't drive escalation.
  if (hasEnoughHistory) {
    elder.concernStatus = deriveConcernStatus(result);
    await elder.save();
  }

  return { skipped: false, assessment, source, usedFallback: source === "fallback" };
}
