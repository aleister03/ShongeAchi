// backend/lib/ai.js
//
// AI integration for two distinct features, now backed by Grok (xAI):
//   1. generateVisitReport()        — a per-visit wellbeing report
//   2. generateConcernAssessment()  — the historical, multi-visit trend
//                                      assessment (AI-Powered Concern
//                                      Metrics), backed by AiAssessment
//
// xAI exposes an OpenAI-compatible Chat Completions endpoint
// (https://api.x.ai/v1/chat/completions), so this talks to it with plain
// fetch and the standard OpenAI request/response shape — no SDK
// dependency needed (same approach as the Kimi integration this replaced;
// Grok, Kimi, and Gemini have each been swapped in as the provider behind
// this exact same interface without touching any of the calling code in
// lib/concernAi.js or the visits route).
//
// Both features degrade to a deterministic fallback elsewhere
// (lib/concernAi.js, lib/concernTrends.js) if this module isn't
// configured or a call fails — nothing here throws in a way that should
// ever surface to a checker or family member as a hard error.
import { VISIT_QUESTIONS } from "./visitQuestions.js";
import { concernLevelFromScore } from "./concernTrends.js";

const apiKey = process.env.XAI_API_KEY;
const BASE_URL = (process.env.XAI_BASE_URL || "https://api.x.ai/v1").replace(/\/$/, "");

// grok-4.5 is xAI's current documented flagship as of testing.
// Configurable via .env.local — xAI's lineup moves fast (multiple point
// releases in 2026 alone), so pin whatever's confirmed working for your
// account rather than assuming this default stays accurate indefinitely;
// call GET https://api.x.ai/v1/models with your key to see the live set.
const MODEL = (process.env.GROK_MODEL || "grok-4.5").trim();


export function isAiConfigured() {
  return Boolean(apiKey);
}

// Models sometimes wrap JSON in a markdown fence despite response_format.
// Strip it before parsing rather than failing an otherwise-valid response.
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

function normalizeTrend(value) {
  if (typeof value !== "string") return null;
  const match = TRENDS.find((t) => t.toLowerCase() === value.trim().toLowerCase());
  return match || null;
}

function toStringList(value, limit) {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim()).slice(0, limit);
}

// Upper bound on a single Grok call. Both call sites run in the
// background via after() (see app/api/wellbeing/[id]/visits/route.js), so
// nobody is waiting on the HTTP response — a longer budget costs nothing
// and avoids throwing away a slow-but-working response.
const GROK_TIMEOUT_MS = Number(process.env.GROK_TIMEOUT_MS) > 0
  ? Number(process.env.GROK_TIMEOUT_MS)
  : 90000;

function isTransientError(status, message) {
  return status === 503 || status === 429 || status === 500 || status === 502 || status === 504
    || /rate.?limit|overloaded|try again|unavailable/i.test(String(message ?? ""));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// A model name xAI doesn't recognise comes back as a 404 with a message
// naming the model — same diagnostic value as the equivalent checks in
// the Gemini and Kimi integrations this replaced, kept because model
// deprecation/renaming is exactly the kind of failure that's easy to miss
// under the fallback (this project has hit it before, with Gemini).
let loggedModelNotFoundWarning = false;
function checkForModelNotFound(status, message) {
  if (status === 404 && !loggedModelNotFoundWarning) {
    loggedModelNotFoundWarning = true;
    console.error(
      `\n[ai] Grok returned 404 for model "${MODEL}" — check that this model id is current for ` +
      `your xAI account (call GET ${BASE_URL}/models with your key to see what's actually ` +
      `available), and update GROK_MODEL in .env.local to match.\n`
    );
  }
}

let loggedAuthWarning = false;
function checkForAuthFailure(status, message) {
  if ((status === 401 || status === 403) && !loggedAuthWarning) {
    loggedAuthWarning = true;
    console.error(
      `\n[ai] Grok returned ${status} — check XAI_API_KEY is set correctly and the xAI account ` +
      `has billing/credits set up. Response: ${String(message ?? "").slice(0, 300)}\n`
    );
  }
}

// Both callers run in the background via after(), so a few retries on a
// transient error cost nothing and turn a purely temporary "rate limited"
// or "overloaded" response into a successful call instead of an
// unnecessary fallback.
const MAX_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [1000, 3000];

async function callGrok(prompt, label) {
  if (!apiKey) throw new Error("XAI_API_KEY is not configured");

  let lastError;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    let timer;
    const controller = new AbortController();
    try {
      timer = setTimeout(() => controller.abort(), GROK_TIMEOUT_MS);

      const res = await fetch(`${BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: "user", content: prompt }],
          // xAI's OpenAI-compatible endpoint supports json_object mode,
          // but (like OpenAI's own) reliably honors it only when the
          // prompt itself also asks for JSON — every prompt below already
          // does ("Respond with ONLY valid JSON...").
          response_format: { type: "json_object" },
          temperature: 0.4,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message = body?.error?.message || `HTTP ${res.status}`;
        const error = new Error(message);
        error.status = res.status;
        throw error;
      }

      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content;
      if (!text) throw new Error("Grok response had no message content");
      return text;
    } catch (error) {
      lastError = error;
      const status = error.status;
      const transient = error.name === "AbortError"
        ? true
        : isTransientError(status, error.message);
      console.error(
        `[ai] ${label} attempt ${attempt}/${MAX_ATTEMPTS} failed` +
        `${transient ? " (transient, will retry)" : " (not transient, giving up)"}: ${error.message}`
      );
      if (!transient || attempt === MAX_ATTEMPTS) break;
      await sleep(RETRY_DELAYS_MS[attempt - 1]);
    } finally {
      clearTimeout(timer);
    }
  }

  checkForModelNotFound(lastError.status, lastError.message);
  checkForAuthFailure(lastError.status, lastError.message);
  throw new Error(`Grok request failed: ${lastError.message}`);
}

// ---------------------------------------------------------------------------
// Historical, multi-visit concern trend assessment (AI-Powered Concern Metrics)
// ---------------------------------------------------------------------------

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
level at ${deterministicScore}/100 (higher means more concerning). Use it as a sanity check, not
as ground truth — you may disagree with it, but say why.

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

  const concernLevel = LEVELS.includes(parsed.concernLevel) ? parsed.concernLevel : concernLevelFromScore(aiConcernScore);
  const recommendedAction = typeof parsed.recommendedAction === "string" ? parsed.recommendedAction.trim() : "";

  return {
    aiConcernScore,
    aiTrend,
    concernLevel,
    flaggedPatterns: toStringList(parsed.flaggedPatterns, 10),
    recommendedAction,
    reasoning: parsed.reasoning.trim(),
  };
}

export async function generateConcernAssessment(elder, normalizedVisits, reportHistory, trendSignals, deterministicScore) {
  const raw = await callGrok(
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
    sleepDisrupted: formResponses.sleepDisrupted,
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
    summary: parsed.summary.trim(),
  };
}

export async function generateVisitReport(elder, formResponses, recentReports) {
  const raw = await callGrok(buildPrompt(elder, formResponses, recentReports), "Visit report");
  return validateReport(raw);
}
