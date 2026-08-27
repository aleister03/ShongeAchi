import { GoogleGenAI } from "@google/genai";
import { ApiError } from "./api.js";
import { VISIT_QUESTIONS } from "./visitQuestions.js";
import { concernLevelFromScore } from "./concernTrends.js";

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const MODEL = "gemini-3.7-flash";

export function isAiConfigured() {
  return Boolean(ai);
}

// Models sometimes wrap JSON in a markdown fence despite responseMimeType. Strip it
// before parsing rather than failing an otherwise-valid response.
function parseJsonResponse(raw, label) {
  if (raw && typeof raw === "object") return raw;
  if (typeof raw !== "string" || !raw.trim()) throw new Error(`${label} response was empty`);

  const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error(`${label} response was not valid JSON`);
  }
}

function clampScore(value) {
  return Math.min(Math.max(Math.round(value), 0), 100);
}

const TRENDS = ["Improving", "Stable", "Declining"];

// Accepts "declining", " Declining " etc. — tolerant about formatting, strict about
// substance. Returns null if the value is not one of the three trends.
function normalizeTrend(value) {
  if (typeof value !== "string") return null;
  const match = TRENDS.find((t) => t.toLowerCase() === value.trim().toLowerCase());
  return match || null;
}

function toStringList(value, limit) {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim()).slice(0, limit);
}

async function callGemini(prompt, label) {
  if (!ai) throw new ApiError(500, "GEMINI_API_KEY is not configured");
  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return response.text;
  } catch (error) {
    throw new ApiError(502, `Gemini request failed: ${error.message}`);
  }
}

// ---------------------------------------------------------------------------
// Historical, multi-visit concern trend assessment (AI-Powered Concern Metrics)
// ---------------------------------------------------------------------------
// Kept separate from generateVisitReport below: that judges a single visit, this
// judges the trajectory across an elder's whole history.

function buildAssessmentPrompt(elder, normalizedVisits, reportHistory, trendSignals, deterministicScore) {
  const conditions = elder.medicalConditions?.length ? elder.medicalConditions.join(", ") : "none recorded";

  return `You are reviewing the visit history of an elder in a community elder check-in programme to assess their wellbeing TREND over time — not any single visit.

Elder: ${elder.name}, age ${elder.age}.
Known medical conditions: ${conditions}.
Mobility notes: ${elder.mobilityNotes || "none recorded"}.

Chronological visit history (oldest first). Per-visit levels are already derived from the
checker's questionnaire; "observations" are the checker's own free-text notes:
${JSON.stringify(normalizedVisits, null, 2)}

Previously generated per-visit wellbeing reports (oldest first). Note wellbeingScore here is
0-100 where HIGHER IS BETTER — the opposite direction to the concern score you must output:
${reportHistory.length ? JSON.stringify(reportHistory, null, 2) : "none available"}

Pre-computed trend signals (windowComparison.delta is the change in concern score between the
recent window and the earlier baseline; positive means concern has risen):
${JSON.stringify(trendSignals, null, 2)}

A separate deterministic rules-based system independently scored this elder's current concern
level at ${deterministicScore}/100 (higher means more concerning). That score looks only at
the flat average of all visits and cannot read the checker's free-text observations or weigh
recency. Use it as a sanity check, not as ground truth — you may disagree with it, but say why.

Weigh recent visits more heavily than old ones, and distinguish a genuine trajectory from
normal week-to-week variation. A single bad visit in an otherwise steady history is not a
decline. Sustained movement in the same direction across several visits is.

Respond with ONLY valid JSON in this exact shape:
{
  "aiConcernScore": <number 0-100, higher means more concerning>,
  "aiTrend": "Improving" | "Stable" | "Declining",
  "concernLevel": "Low" | "Moderate" | "High" | "Critical",
  "flaggedPatterns": [<short strings naming specific cross-visit patterns, e.g. "appetite declining over last 3 visits">],
  "recommendedAction": "<one short sentence on what the care team should do next>",
  "reasoning": "<2-4 sentences explaining the trend judgement, referencing specific visits and signals>"
}`;
}

const LEVELS = ["Low", "Moderate", "High", "Critical"];

export function validateAiAssessment(raw) {
  const parsed = parseJsonResponse(raw, "AI assessment");

  const score = Number(parsed.aiConcernScore);
  if (!Number.isFinite(score)) throw new Error("AI assessment missing a numeric aiConcernScore");
  const aiConcernScore = clampScore(score);

  const aiTrend = normalizeTrend(parsed.aiTrend);
  if (!aiTrend) throw new Error("AI assessment returned an invalid aiTrend");

  if (typeof parsed.reasoning !== "string" || !parsed.reasoning.trim()) {
    throw new Error("AI assessment missing reasoning");
  }

  // Non-essential fields degrade instead of failing the whole assessment: an
  // out-of-vocabulary concernLevel is recomputed from the score, and a missing
  // recommendedAction is simply omitted.
  const concernLevel = LEVELS.includes(parsed.concernLevel) ? parsed.concernLevel : concernLevelFromScore(aiConcernScore);
  const recommendedAction = typeof parsed.recommendedAction === "string" ? parsed.recommendedAction.trim() : "";

  return {
    aiConcernScore,
    aiTrend,
    concernLevel,
    flaggedPatterns: toStringList(parsed.flaggedPatterns, 10),
    recommendedAction,
    reasoning: parsed.reasoning.trim()
  };
}

export async function generateConcernAssessment(elder, normalizedVisits, reportHistory, trendSignals, deterministicScore) {
  const raw = await callGemini(
    buildAssessmentPrompt(elder, normalizedVisits, reportHistory, trendSignals, deterministicScore),
    "AI assessment"
  );
  return validateAiAssessment(raw);
}

// ---------------------------------------------------------------------------
// Per-visit wellbeing report
// ---------------------------------------------------------------------------

function buildPrompt(elder, formResponses, recentReports) {
  const qa = (formResponses.responses || []).map((r) => {
    const question = VISIT_QUESTIONS.find((q) => q.id === r.questionId);
    return `Q: ${question ? question.prompt : r.questionId}\nA: ${r.answer}${r.detail ? ` (detail: ${r.detail})` : ""}`;
  }).join("\n\n");

  return `You are generating a wellbeing report from a structured elder check-in form.

Elder: ${elder.name}, age ${elder.age}.
Known medical conditions: ${elder.medicalConditions?.length ? elder.medicalConditions.join(", ") : "none recorded"}.

Overall visit status recorded by the checker: ${formResponses.status}.

Levels derived from this visit's answers:
${JSON.stringify({
    appetite: formResponses.appetite,
    mobility: formResponses.mobility,
    mood: formResponses.mood,
    engagement: formResponses.engagement,
    medicationAdherence: formResponses.medicationAdherence,
    sleepDisrupted: formResponses.sleepDisrupted
  }, null, 2)}

This visit's answers in full:
${qa || "no answers recorded"}

Recent prior reports for context (oldest first, may be empty for a first visit):
${recentReports.length ? JSON.stringify(recentReports, null, 2) : "none — this is the first visit"}

Respond with ONLY valid JSON:
{
  "wellbeingScore": <number 0-100, higher is better>,
  "moodAssessment": "<one short phrase>",
  "trendDirection": "Improving" | "Stable" | "Declining",
  "flags": [<short strings for anything concerning in THIS visit specifically>],
  "summary": "<2-3 sentences a family member could read directly>"
}`;
}

export function validateReport(raw) {
  const parsed = parseJsonResponse(raw, "Visit report");

  const score = Number(parsed.wellbeingScore);
  if (!Number.isFinite(score)) throw new Error("Visit report missing a numeric wellbeingScore");

  const trendDirection = normalizeTrend(parsed.trendDirection);
  if (!trendDirection) throw new Error("Visit report returned an invalid trendDirection");

  if (typeof parsed.summary !== "string" || !parsed.summary.trim()) {
    throw new Error("Visit report missing summary");
  }

  const moodAssessment = typeof parsed.moodAssessment === "string" && parsed.moodAssessment.trim()
    ? parsed.moodAssessment.trim()
    : "not assessed";

  return {
    wellbeingScore: clampScore(score),
    moodAssessment,
    trendDirection,
    flags: toStringList(parsed.flags, 10),
    summary: parsed.summary.trim()
  };
}

export async function generateVisitReport(elder, formResponses, recentReports) {
  const raw = await callGemini(buildPrompt(elder, formResponses, recentReports), "Visit report");
  return validateReport(raw);
}
