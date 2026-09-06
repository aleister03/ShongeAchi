module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[project]/app/api/wellbeing/[id]/visits/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Elder$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Elder.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Checker$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Checker.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Visit$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Visit.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$VisitReport$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/VisitReport.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$deriveLevels$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/deriveLevels.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visitQuestions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/visitQuestions.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ai.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$concernAi$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/concernAi.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
const VISIT_STATUSES = [
    "Fine",
    "Concerned",
    "No Answer"
];
/** Every question must have a valid answer; a "choice" question's answer must be one of its options. */ function validateResponses(responses) {
    if (!Array.isArray(responses)) {
        throw new Error("responses must be an array");
    }
    const byId = Object.fromEntries(responses.map((r)=>[
            r.questionId,
            r
        ]));
    for (const q of __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visitQuestions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VISIT_QUESTIONS"]){
        const r = byId[q.id];
        // BUG FIX: `!r.answer` rejects an empty string, but q13 ("most
        // noticeable change") is a free-text question the UI explicitly
        // invites the checker to leave blank ("Optional — leave blank if
        // nothing notable"). Only choice-type questions require a genuine
        // answer; a text-type question just needs the entry to be present
        // (so it made it through the form), not non-empty.
        if (!r) throw new Error(`Missing answer for: ${q.prompt}`);
        if (q.type === "choice") {
            if (!r.answer) throw new Error(`Missing answer for: ${q.prompt}`);
            if (!q.options.includes(r.answer)) throw new Error(`Invalid answer for: ${q.prompt}`);
        }
    }
    return responses;
}
async function GET(request, context) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const { id } = await context.params;
        const rawVisits = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Visit$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
            elderId: id
        }).sort({
            visitDate: -1
        });
        // Normalized so existing consumers reading v.notes/v.appetiteLevel/etc.
        // (derived from the structured responses) keep working unchanged.
        const visits = rawVisits.map((v)=>({
                ...v.toObject(),
                ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$deriveLevels$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deriveLevels"])(v.responses)
            }));
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: visits
        }, {
            status: 200
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
}
async function POST(request, context) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const { id } = await context.params;
        const body = await request.json();
        const { checkerId, status, responses, scheduledAt } = body;
        if (!checkerId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "checkerId is required"
            }, {
                status: 400
            });
        }
        if (!VISIT_STATUSES.includes(status)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: `status must be one of: ${VISIT_STATUSES.join(", ")}`
            }, {
                status: 400
            });
        }
        let validatedResponses;
        try {
            validatedResponses = validateResponses(responses);
        } catch (validationError) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: validationError.message
            }, {
                status: 400
            });
        }
        const elder = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Elder$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findById(id);
        if (!elder) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Elder not found"
        }, {
            status: 404
        });
        if (!elder.assignedCheckerId || String(elder.assignedCheckerId) !== String(checkerId)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "This elder is not assigned to you"
            }, {
                status: 403
            });
        }
        const checker = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Checker$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findById(checkerId);
        if (!checker || checker.applicationStatus !== "Approved") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Only approved checkers can log visits"
            }, {
                status: 403
            });
        }
        const visit = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Visit$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create({
            elderId: id,
            checkerId: String(checker._id),
            checkerName: checker.name,
            status,
            responses: validatedResponses,
            visitDate: new Date(),
            ...scheduledAt ? {
                scheduledAt: new Date(scheduledAt)
            } : {},
            completedAt: new Date()
        });
        const report = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$VisitReport$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create({
            visitId: visit._id,
            elderId: id,
            wellbeingScore: 0,
            moodAssessment: "pending",
            trendDirection: "Stable",
            flags: [],
            summary: "Generating this visit's report…",
            pending: true
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["after"])(async ()=>{
            try {
                const recentReports = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$VisitReport$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
                    elderId: id,
                    pending: false,
                    generationFailed: false
                }).sort({
                    createdAt: -1
                }).limit(5).lean();
                const levels = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$deriveLevels$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deriveLevels"])(visit.responses);
                const generated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateVisitReport"])(elder, {
                    status: visit.status,
                    responses: visit.responses,
                    appetite: levels.appetiteLevel,
                    mobility: levels.mobilityLevel,
                    mood: levels.moodLevel,
                    engagement: levels.engagementLevel,
                    medicationAdherence: levels.medicationAdherence,
                    sleepDisrupted: levels.sleepDisrupted
                }, recentReports.reverse());
                await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$VisitReport$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findByIdAndUpdate(report._id, {
                    ...generated,
                    pending: false,
                    generationFailed: false
                });
            } catch (aiError) {
                console.error("[visits] Visit report generation failed:", aiError.message);
                await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$VisitReport$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findByIdAndUpdate(report._id, {
                    wellbeingScore: 0,
                    moodAssessment: "unavailable",
                    trendDirection: "Stable",
                    flags: [],
                    summary: "Report generation failed for this visit.",
                    pending: false,
                    generationFailed: true
                });
            }
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$concernAi$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runAiAssessment"])(id);
            } catch (assessmentError) {
                console.error("[visits] AI concern assessment failed:", assessmentError.message);
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: {
                visit,
                report,
                pending: true
            }
        }, {
            status: 201
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
}
}),
"[project]/lib/ai.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateConcernAssessment",
    ()=>generateConcernAssessment,
    "generateVisitReport",
    ()=>generateVisitReport,
    "isAiConfigured",
    ()=>isAiConfigured,
    "validateAiAssessment",
    ()=>validateAiAssessment,
    "validateReport",
    ()=>validateReport
]);
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visitQuestions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/visitQuestions.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$concernTrends$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/concernTrends.js [app-route] (ecmascript)");
;
;
const apiKey = process.env.XAI_API_KEY;
const BASE_URL = (process.env.XAI_BASE_URL || "https://api.x.ai/v1").replace(/\/$/, "");
// grok-4.5 is xAI's current documented flagship as of testing.
// Configurable via .env.local — xAI's lineup moves fast (multiple point
// releases in 2026 alone), so pin whatever's confirmed working for your
// account rather than assuming this default stays accurate indefinitely;
// call GET https://api.x.ai/v1/models with your key to see the live set.
const MODEL = (process.env.GROK_MODEL || "grok-4.5").trim();
function isAiConfigured() {
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
    } catch  {
        throw new Error(`${label} response was not valid JSON`);
    }
}
function clampScore(value) {
    return Math.min(Math.max(Math.round(value), 0), 100);
}
const TRENDS = [
    "Improving",
    "Stable",
    "Declining"
];
function normalizeTrend(value) {
    if (typeof value !== "string") return null;
    const match = TRENDS.find((t)=>t.toLowerCase() === value.trim().toLowerCase());
    return match || null;
}
function toStringList(value, limit) {
    if (!Array.isArray(value)) return [];
    return value.filter((item)=>typeof item === "string" && item.trim()).map((item)=>item.trim()).slice(0, limit);
}
// Upper bound on a single Grok call. Both call sites run in the
// background via after() (see app/api/wellbeing/[id]/visits/route.js), so
// nobody is waiting on the HTTP response — a longer budget costs nothing
// and avoids throwing away a slow-but-working response.
const GROK_TIMEOUT_MS = Number(process.env.GROK_TIMEOUT_MS) > 0 ? Number(process.env.GROK_TIMEOUT_MS) : 90000;
function isTransientError(status, message) {
    return status === 503 || status === 429 || status === 500 || status === 502 || status === 504 || /rate.?limit|overloaded|try again|unavailable/i.test(String(message ?? ""));
}
function sleep(ms) {
    return new Promise((resolve)=>setTimeout(resolve, ms));
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
        console.error(`\n[ai] Grok returned 404 for model "${MODEL}" — check that this model id is current for ` + `your xAI account (call GET ${BASE_URL}/models with your key to see what's actually ` + `available), and update GROK_MODEL in .env.local to match.\n`);
    }
}
let loggedAuthWarning = false;
function checkForAuthFailure(status, message) {
    if ((status === 401 || status === 403) && !loggedAuthWarning) {
        loggedAuthWarning = true;
        console.error(`\n[ai] Grok returned ${status} — check XAI_API_KEY is set correctly and the xAI account ` + `has billing/credits set up. Response: ${String(message ?? "").slice(0, 300)}\n`);
    }
}
// Both callers run in the background via after(), so a few retries on a
// transient error cost nothing and turn a purely temporary "rate limited"
// or "overloaded" response into a successful call instead of an
// unnecessary fallback.
const MAX_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [
    1000,
    3000
];
async function callGrok(prompt, label) {
    if (!apiKey) throw new Error("XAI_API_KEY is not configured");
    let lastError;
    for(let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1){
        let timer;
        const controller = new AbortController();
        try {
            timer = setTimeout(()=>controller.abort(), GROK_TIMEOUT_MS);
            const res = await fetch(`${BASE_URL}/chat/completions`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: MODEL,
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    // xAI's OpenAI-compatible endpoint supports json_object mode,
                    // but (like OpenAI's own) reliably honors it only when the
                    // prompt itself also asks for JSON — every prompt below already
                    // does ("Respond with ONLY valid JSON...").
                    response_format: {
                        type: "json_object"
                    },
                    temperature: 0.4
                }),
                signal: controller.signal
            });
            if (!res.ok) {
                const body = await res.json().catch(()=>null);
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
            const transient = error.name === "AbortError" ? true : isTransientError(status, error.message);
            console.error(`[ai] ${label} attempt ${attempt}/${MAX_ATTEMPTS} failed` + `${transient ? " (transient, will retry)" : " (not transient, giving up)"}: ${error.message}`);
            if (!transient || attempt === MAX_ATTEMPTS) break;
            await sleep(RETRY_DELAYS_MS[attempt - 1]);
        } finally{
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
const LEVELS = [
    "Low",
    "Moderate",
    "High",
    "Critical"
];
function validateAiAssessment(raw) {
    const parsed = parseJsonResponse(raw, "AI assessment");
    const score = Number(parsed.aiConcernScore);
    if (!Number.isFinite(score)) throw new Error("AI assessment missing a numeric aiConcernScore");
    const aiConcernScore = clampScore(score);
    const aiTrend = normalizeTrend(parsed.aiTrend);
    if (!aiTrend) throw new Error("AI assessment returned an invalid aiTrend");
    if (typeof parsed.reasoning !== "string" || !parsed.reasoning.trim()) {
        throw new Error("AI assessment missing reasoning");
    }
    const concernLevel = LEVELS.includes(parsed.concernLevel) ? parsed.concernLevel : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$concernTrends$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["concernLevelFromScore"])(aiConcernScore);
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
async function generateConcernAssessment(elder, normalizedVisits, reportHistory, trendSignals, deterministicScore) {
    const raw = await callGrok(buildAssessmentPrompt(elder, normalizedVisits, reportHistory, trendSignals, deterministicScore), "AI assessment");
    return validateAiAssessment(raw);
}
// ---------------------------------------------------------------------------
// Per-visit wellbeing report
// ---------------------------------------------------------------------------
function buildPrompt(elder, formResponses, recentReports) {
    const qa = (formResponses.responses || []).map((r)=>{
        const question = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visitQuestions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VISIT_QUESTIONS"].find((q)=>q.id === r.questionId);
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
function validateReport(raw) {
    const parsed = parseJsonResponse(raw, "Visit report");
    const score = Number(parsed.wellbeingScore);
    if (!Number.isFinite(score)) throw new Error("Visit report missing a numeric wellbeingScore");
    const trendDirection = normalizeTrend(parsed.trendDirection);
    if (!trendDirection) throw new Error("Visit report returned an invalid trendDirection");
    if (typeof parsed.summary !== "string" || !parsed.summary.trim()) {
        throw new Error("Visit report missing summary");
    }
    const moodAssessment = typeof parsed.moodAssessment === "string" && parsed.moodAssessment.trim() ? parsed.moodAssessment.trim() : "not assessed";
    return {
        wellbeingScore: clampScore(score),
        moodAssessment,
        trendDirection,
        flags: toStringList(parsed.flags, 10),
        summary: parsed.summary.trim()
    };
}
async function generateVisitReport(elder, formResponses, recentReports) {
    const raw = await callGrok(buildPrompt(elder, formResponses, recentReports), "Visit report");
    return validateReport(raw);
}
}),
"[project]/lib/concernAi.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MIN_VISITS_FOR_AI_ASSESSMENT",
    ()=>MIN_VISITS_FOR_AI_ASSESSMENT,
    "computeScoresDiverge",
    ()=>computeScoresDiverge,
    "deriveConcernStatus",
    ()=>deriveConcernStatus,
    "normalizeReports",
    ()=>normalizeReports,
    "normalizeVisits",
    ()=>normalizeVisits,
    "prepareTrendSignals",
    ()=>prepareTrendSignals,
    "runAiAssessment",
    ()=>runAiAssessment
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Visit$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Visit.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Elder$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Elder.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$VisitReport$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/VisitReport.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$AiAssessment$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/AiAssessment.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$deriveLevels$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/deriveLevels.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$concernScore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/concernScore.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$concernTrends$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/concernTrends.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ai.js [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
function normalizeVisits(visits) {
    return visits.map((v)=>({
            date: v.visitDate,
            status: v.status,
            appetite: v.appetiteLevel,
            mobility: v.mobilityLevel,
            mood: v.moodLevel,
            engagement: v.engagementLevel,
            medicationAdherence: v.medicationAdherence,
            sleepDisrupted: v.sleepDisrupted,
            observations: (v.observations || []).map((o)=>o.detail ? `${o.label}: ${o.answer} — ${o.detail}` : `${o.label}: ${o.answer}`)
        }));
}
function normalizeReports(reports) {
    return reports.filter((r)=>!r.generationFailed).map((r)=>({
            date: r.createdAt,
            wellbeingScore: r.wellbeingScore,
            mood: r.moodAssessment,
            trend: r.trendDirection,
            flags: r.flags,
            summary: r.summary
        }));
}
function prepareTrendSignals(visits, reports = []) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$concernTrends$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildTrendSignals"])(visits, reports);
}
const MIN_VISITS_FOR_AI_ASSESSMENT = 3;
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
function deriveConcernStatus({ aiConcernScore, aiTrend }) {
    return aiTrend === "Declining" || aiConcernScore >= CONCERN_FLAG_SCORE_THRESHOLD ? "Concern flagged" : "Fine";
}
function computeScoresDiverge(aiConcernScore, deterministicScore) {
    return Math.abs(aiConcernScore - deterministicScore) >= DIVERGENCE_THRESHOLD;
}
async function runAiAssessment(elderId) {
    const elder = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Elder$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findById(elderId);
    if (!elder) return {
        skipped: true,
        reason: "Elder not found"
    };
    const rawVisits = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Visit$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
        elderId
    }).sort({
        visitDate: 1
    });
    const visits = rawVisits.map((v)=>({
            ...v.toObject(),
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$deriveLevels$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deriveLevels"])(v.responses)
        }));
    if (visits.length === 0) {
        return {
            skipped: true,
            reason: "No visits logged for this elder yet"
        };
    }
    const rawReports = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$VisitReport$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
        elderId
    }).sort({
        createdAt: 1
    }).lean();
    // The one "official" concern score used everywhere else in the app.
    const deterministicScore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$concernScore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["computeConcernMetrics"])(visits).concernScore;
    const normalizedVisits = normalizeVisits(visits);
    const reportHistory = normalizeReports(rawReports);
    const trendSignals = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$concernTrends$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildTrendSignals"])(visits, rawReports);
    const hasEnoughHistory = visits.length >= MIN_VISITS_FOR_AI_ASSESSMENT;
    let result;
    let source = "ai";
    let fallbackReason = "";
    if (!hasEnoughHistory) {
        fallbackReason = `only ${visits.length} of ${MIN_VISITS_FOR_AI_ASSESSMENT} visits needed for an AI trend assessment`;
        result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$concernTrends$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deterministicTrendAssessment"])(trendSignals, deterministicScore, fallbackReason);
        source = "fallback";
    } else if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isAiConfigured"])()) {
        fallbackReason = "AI assessment is not configured (XAI_API_KEY missing)";
        result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$concernTrends$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deterministicTrendAssessment"])(trendSignals, deterministicScore, fallbackReason);
        source = "fallback";
    } else {
        try {
            result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateConcernAssessment"])(elder, normalizedVisits, reportHistory, trendSignals, deterministicScore);
        } catch (error) {
            console.error("AI concern assessment failed, using deterministic fallback:", error.message);
            fallbackReason = `AI assessment unavailable (${summarizeAiError(error)})`;
            result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$concernTrends$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deterministicTrendAssessment"])(trendSignals, deterministicScore, fallbackReason);
            source = "fallback";
        }
    }
    const assessment = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$AiAssessment$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create({
        elderId,
        aiConcernScore: result.aiConcernScore,
        aiTrend: result.aiTrend,
        concernLevel: result.concernLevel || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$concernTrends$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["concernLevelFromScore"])(result.aiConcernScore),
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
    // With only one or two visits there is no trajectory yet, so a single
    // rough visit can't flip the elder's status on the dashboards. The
    // assessment is still saved and shown — it just doesn't drive
    // escalation.
    if (hasEnoughHistory) {
        // updateOne, not elder.save(): save() revalidates the ENTIRE document,
        // so an elder with any pre-existing unrelated validation issue would
        // throw here and the concern flag would silently fail to update.
        await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Elder$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].updateOne({
            _id: elderId
        }, {
            $set: {
                concernStatus: deriveConcernStatus(result)
            }
        });
    }
    return {
        skipped: false,
        assessment,
        source,
        usedFallback: source === "fallback"
    };
}
}),
"[project]/lib/concernScore.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_THRESHOLDS",
    ()=>DEFAULT_THRESHOLDS,
    "WINDOW_DAYS",
    ()=>WINDOW_DAYS,
    "applyOverride",
    ()=>applyOverride,
    "computeConcernMetrics",
    ()=>computeConcernMetrics
]);
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
// CHANGED: Visit documents now store a structured questionnaire
// (`responses: [{questionId, answer, detail}]`, see lib/visitQuestions.js)
// instead of flat appetiteLevel/mobilityLevel/moodLevel/medicationTaken
// fields directly. lib/deriveLevels.js is the single place that knows how
// to turn those responses back into the level fields this scoring engine
// was built around — so normalizing here means every formula below (the
// weights, the streak bonuses, the trend math, all already tested) stays
// completely unchanged. A visit that still has the old flat fields
// directly (from data seeded before this migration) passes through
// untouched, since deriveLevels only overrides fields it can actually
// derive from `responses`.
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$deriveLevels$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/deriveLevels.js [app-route] (ecmascript)");
;
function normalizeVisit(visit) {
    if (!visit) return visit;
    if (!visit.responses || visit.responses.length === 0) return visit;
    return {
        ...visit,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$deriveLevels$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deriveLevels"])(visit.responses)
    };
}
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
    medicationMissed: 10
};
const LEVEL_SCORE = {
    Good: 0,
    Fair: 1,
    Poor: 2
};
/** Raw concern points contributed by a single visit (0-70ish, uncapped). */ function pointsForVisit(visit) {
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
/** Longest run of `visits[i][field] === value`, counted from the most recent visit backwards. */ function trailingStreak(visitsDesc, field, value) {
    let streak = 0;
    for (const v of visitsDesc){
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
 */ // Default category thresholds — unchanged from the original hardcoded
// values. Callers may override via the `thresholds` param (see Platform
// Configuration, lib/platformConfig.js) without any change in behavior
// for callers that don't pass one.
const DEFAULT_THRESHOLDS = {
    critical: 70,
    elevated: 40
};
function computeConcernMetrics(allVisits, now = new Date(), thresholds = DEFAULT_THRESHOLDS) {
    if (!allVisits || allVisits.length === 0) {
        return {
            concernScore: 0,
            category: "Stable",
            trend: {
                direction: "stable",
                label: "No data",
                pointsChange: 0,
                weeks: 0
            },
            contributingFactors: [
                "No visits recorded yet"
            ],
            totalVisits: 0,
            windowVisits: 0
        };
    }
    // 1. Narrow down to the 6-week window the dashboard advertises. Visits
    //    older than that still exist in Mongo, we just don't let them affect
    //    "current" concern — a bad visit two months ago shouldn't keep an
    //    elder flagged as Critical forever.
    const normalizedVisits = allVisits.map(normalizeVisit);
    const windowStart = new Date(now.getTime() - WINDOW_DAYS * 24 * 60 * 60 * 1000);
    const windowVisits = normalizedVisits.filter((v)=>new Date(v.visitDate) >= windowStart).sort((a, b)=>new Date(a.visitDate) - new Date(b.visitDate)); // oldest -> newest
    // Fall back to the elder's most recent visits if none fall inside the
    // window (e.g. a checker hasn't visited in 7+ weeks — still worth scoring).
    const scoredVisits = windowVisits.length > 0 ? windowVisits : [
        ...normalizedVisits
    ].sort((a, b)=>new Date(a.visitDate) - new Date(b.visitDate)).slice(-3);
    // 2. Recency-weighted average, not a flat average. Visit 1 of 6 gets
    //    weight 1, visit 6 gets weight 6 — so three straight recent bad visits
    //    move the score much more than one bad visit from a month ago.
    let weightedSum = 0;
    let weightTotal = 0;
    scoredVisits.forEach((visit, i)=>{
        const weight = i + 1;
        weightedSum += pointsForVisit(visit) * weight;
        weightTotal += weight;
    });
    const baseScore = weightTotal > 0 ? weightedSum / weightTotal : 0;
    // 3. Streak/pattern bonuses — these are the parts a plain average misses
    //    entirely, and they're exactly the pattern described in the spec
    //    ("three consecutive poor-appetite reports").
    const mostRecentFirst = [
        ...scoredVisits
    ].reverse();
    const appetiteStreak = trailingStreak(mostRecentFirst, "appetiteLevel", "Poor");
    const mobilityStreak = trailingStreak(mostRecentFirst, "mobilityLevel", "Poor");
    const missedMedCount = scoredVisits.filter((v)=>!v.medicationTaken).length;
    const appetiteBonus = appetiteStreak >= 2 ? Math.min(appetiteStreak * 7, 21) : 0;
    const mobilityStreakBonus = mobilityStreak >= 2 ? Math.min(mobilityStreak * 6, 18) : 0;
    const medicationBonus = missedMedCount >= 2 ? Math.min(missedMedCount * 5, 20) : 0;
    // Declining mobility trend: compare the average mobility "badness" in the
    // first half of the window against the second half. A rising average
    // means mobility is getting worse over time, independent of streaks.
    let mobilityTrendBonus = 0;
    if (scoredVisits.length >= 4) {
        const mid = Math.floor(scoredVisits.length / 2);
        const firstHalfAvg = scoredVisits.slice(0, mid).reduce((s, v)=>s + (LEVEL_SCORE[v.mobilityLevel] ?? 0), 0) / mid;
        const secondHalfAvg = scoredVisits.slice(mid).reduce((s, v)=>s + (LEVEL_SCORE[v.mobilityLevel] ?? 0), 0) / (scoredVisits.length - mid);
        const delta = secondHalfAvg - firstHalfAvg;
        if (delta > 0) mobilityTrendBonus = Math.min(Math.round(delta * 15), 20);
    }
    const concernScore = Math.max(0, Math.min(100, Math.round(baseScore + appetiteBonus + mobilityStreakBonus + medicationBonus + mobilityTrendBonus)));
    // 4. Category — thresholds match the dashboard's own legend (configurable
    //    via Platform Configuration; defaults unchanged if not provided).
    let category = "Stable";
    if (concernScore > thresholds.critical) category = "Critical";
    else if (concernScore >= thresholds.elevated) category = "Elevated";
    // 5. 6-week trend: how much has the score moved since the start of the
    //    window, and over how many weeks.
    let trend = {
        direction: "stable",
        label: "stable",
        pointsChange: 0,
        weeks: 0
    };
    if (scoredVisits.length >= 2) {
        const earliestScore = pointsForVisit(scoredVisits[0]);
        const pointsChange = concernScore - earliestScore;
        const spanDays = daysBetween(scoredVisits[0].visitDate, scoredVisits[scoredVisits.length - 1].visitDate);
        const weeks = Math.max(1, Math.round(spanDays / 7));
        if (pointsChange > 5) {
            trend = {
                direction: "up",
                label: `↑ ${pointsChange}pts / ${weeks}wk`,
                pointsChange,
                weeks
            };
        } else if (pointsChange < -5) {
            trend = {
                direction: "down",
                label: `↓ ${Math.abs(pointsChange)}pts / ${weeks}wk`,
                pointsChange,
                weeks
            };
        } else {
            trend = {
                direction: "stable",
                label: "stable",
                pointsChange,
                weeks
            };
        }
    }
    // 6. Contributing factors — plain-English, built only from real fields
    //    (no invented statuses like "unwell").
    const contributingFactors = [];
    if (appetiteStreak >= 2) contributingFactors.push(`Poor appetite ×${appetiteStreak}`);
    if (missedMedCount >= 1) contributingFactors.push(`missed meds ×${missedMedCount}`);
    if (mobilityStreak >= 2) contributingFactors.push(`Poor mobility ×${mobilityStreak}`);
    else if (mobilityTrendBonus > 0) contributingFactors.push("Declining mobility trend");
    const concernedCount = scoredVisits.filter((v)=>v.status === "Concerned").length;
    if (concernedCount >= 1) contributingFactors.push(`Checker flagged concern ×${concernedCount}`);
    const noAnswerCount = scoredVisits.filter((v)=>v.status === "No Answer").length;
    if (noAnswerCount >= 1) contributingFactors.push(`No answer ×${noAnswerCount}`);
    return {
        concernScore,
        category,
        trend,
        contributingFactors: contributingFactors.length > 0 ? contributingFactors.slice(0, 2) : [
            "No concerns flagged"
        ],
        totalVisits: allVisits.length,
        windowVisits: scoredVisits.length
    };
}
/**
 * Layer a checker's manual override (Elder.concernOverride, see Elder model)
 * on top of a computed metrics object, if one is present. Centralised here
 * so every endpoint that returns a concern score (single-elder, dashboard,
 * checker list) shows the same effective number instead of drifting apart.
 *
 * Does not mutate `metrics` — returns a new object.
 */ function applyOverride(metrics, elder, thresholds = DEFAULT_THRESHOLDS) {
    const override = elder?.concernOverride;
    if (!override || override.score === null || override.score === undefined) {
        return {
            ...metrics,
            override: null
        };
    }
    const concernScore = override.score;
    let category = "Stable";
    if (concernScore > thresholds.critical) category = "Critical";
    else if (concernScore >= thresholds.elevated) category = "Elevated";
    return {
        ...metrics,
        concernScore,
        category,
        override: {
            score: override.score,
            note: override.note || "",
            setByCheckerId: override.setByCheckerId || null,
            setAt: override.setAt || null
        }
    };
}
;
}),
"[project]/lib/concernTrends.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RECENT_WINDOW",
    ()=>RECENT_WINDOW,
    "buildTrendSignals",
    ()=>buildTrendSignals,
    "collectRecentObservations",
    ()=>collectRecentObservations,
    "compareWindows",
    ()=>compareWindows,
    "computeAdherenceStats",
    ()=>computeAdherenceStats,
    "computeAttendanceStats",
    ()=>computeAttendanceStats,
    "computeConcernStreaks",
    ()=>computeConcernStreaks,
    "computeLevelShift",
    ()=>computeLevelShift,
    "computeWellbeingSlope",
    ()=>computeWellbeingSlope,
    "concernLevelFromScore",
    ()=>concernLevelFromScore,
    "describeLatestVisit",
    ()=>describeLatestVisit,
    "deterministicTrendAssessment",
    ()=>deterministicTrendAssessment
]);
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$deriveLevels$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/deriveLevels.js [app-route] (ecmascript)");
;
const DAY_MS = 86400000;
/** Flat average concern points per visit — a plain, symmetric yardstick for comparing two windows against each other. Not used anywhere outside this module. */ function _windowAverageScore(visits) {
    if (!visits.length) return 0;
    let total = 0;
    for (const v of visits){
        const levels = v.responses ? {
            ...v,
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$deriveLevels$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deriveLevels"])(v.responses)
        } : v;
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
const RECENT_WINDOW = 3;
// Minimum |delta| on the 0-100 concern scale before a window comparison is
// called a trend rather than noise.
const TREND_DELTA_THRESHOLD = 8;
function concernLevelFromScore(score) {
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
    return total > 0 ? round(count / total * 100, 1) : null;
}
function compareWindows(visits, windowSize = RECENT_WINDOW) {
    if (visits.length < 2) {
        return {
            earlierScore: null,
            recentScore: null,
            delta: null,
            earlierCount: 0,
            recentCount: visits.length
        };
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
        recentCount: recent.length
    };
}
function computeAdherenceStats(visits, windowSize = RECENT_WINDOW) {
    const missed = (v)=>v.medicationAdherence === "None";
    const partial = (v)=>v.medicationAdherence === "Partial";
    const recent = visits.slice(-windowSize);
    return {
        fullAdherenceRate: rate(visits.filter((v)=>!missed(v) && !partial(v)).length, visits.length),
        missedDoseVisits: visits.filter(missed).length,
        partialDoseVisits: visits.filter(partial).length,
        recentMissedDoseVisits: recent.filter(missed).length,
        recentPartialDoseVisits: recent.filter(partial).length
    };
}
function computeAttendanceStats(visits, now = Date.now()) {
    const noAnswer = visits.filter((v)=>v.status === "No Answer");
    const dates = visits.map((v)=>new Date(v.visitDate ?? v.date).getTime()).filter(Number.isFinite);
    let longestGapDays = null;
    for(let i = 1; i < dates.length; i += 1){
        const gap = Math.round((dates[i] - dates[i - 1]) / DAY_MS);
        if (longestGapDays === null || gap > longestGapDays) longestGapDays = gap;
    }
    const lastNoAnswer = noAnswer.length ? Math.max(...noAnswer.map((v)=>new Date(v.visitDate ?? v.date).getTime())) : null;
    return {
        missedVisits: noAnswer.length,
        missedVisitRate: rate(noAnswer.length, visits.length),
        daysSinceLastVisit: dates.length ? Math.floor((now - Math.max(...dates)) / DAY_MS) : null,
        daysSinceLastNoAnswer: lastNoAnswer === null ? null : Math.floor((now - lastNoAnswer) / DAY_MS),
        longestGapDays
    };
}
function computeConcernStreaks(visits) {
    let current = 0;
    let longest = 0;
    for (const visit of visits){
        current = visit.status === "Concerned" ? current + 1 : 0;
        if (current > longest) longest = current;
    }
    return {
        longestConcernStreak: longest,
        currentConcernStreak: current,
        streakIsOngoing: current > 0
    };
}
function computeLevelShift(visits, field, windowSize = RECENT_WINDOW) {
    const degraded = (v)=>v[field] === "Poor" || v[field] === "Fair";
    if (visits.length < 2) {
        return {
            field,
            earlierRate: null,
            recentRate: null,
            delta: null,
            direction: "Unknown"
        };
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
function computeWellbeingSlope(reports, windowSize = RECENT_WINDOW) {
    const usable = reports.filter((r)=>!r.generationFailed && Number.isFinite(r.wellbeingScore));
    if (usable.length < 2) {
        return {
            earlierAverage: null,
            recentAverage: null,
            delta: null,
            direction: "Unknown",
            pointsUsed: usable.length
        };
    }
    const size = Math.min(windowSize, usable.length - 1);
    const splitAt = usable.length - size;
    const mean = (rows)=>round(rows.reduce((sum, r)=>sum + r.wellbeingScore, 0) / rows.length, 1);
    const earlierAverage = mean(usable.slice(0, splitAt));
    const recentAverage = mean(usable.slice(splitAt));
    const delta = round(recentAverage - earlierAverage, 1);
    return {
        earlierAverage,
        recentAverage,
        delta,
        direction: delta >= TREND_DELTA_THRESHOLD ? "Improving" : delta <= -TREND_DELTA_THRESHOLD ? "Declining" : "Stable",
        pointsUsed: usable.length
    };
}
function collectRecentObservations(visits, windowSize = RECENT_WINDOW, limit = 12) {
    const recent = visits.slice(-windowSize);
    const collected = [];
    for (const visit of recent){
        for (const observation of visit.observations || []){
            const text = observation.detail ? `${observation.label}: ${observation.answer} — ${observation.detail}` : `${observation.label}: ${observation.answer}`;
            if (!collected.includes(text)) collected.push(text);
        }
    }
    return collected.slice(0, limit);
}
function describeLatestVisit(visits) {
    const latest = visits[visits.length - 1];
    if (!latest) return {
        present: false,
        concerning: false,
        status: null,
        degradedFactors: []
    };
    const degradedFactors = [
        "moodLevel",
        "mobilityLevel",
        "appetiteLevel",
        "engagementLevel"
    ].filter((field)=>latest[field] === "Poor" || latest[field] === "Fair");
    return {
        present: true,
        status: latest.status,
        degradedFactors,
        medicationAdherence: latest.medicationAdherence ?? null,
        concerning: latest.status === "Concerned" || latest.status === "No Answer" || latest.medicationAdherence === "None" || degradedFactors.length > 0
    };
}
function buildTrendSignals(visits, reports = [], now = Date.now()) {
    return {
        visitsAnalyzed: visits.length,
        latestVisit: describeLatestVisit(visits),
        reportsAnalyzed: reports.filter((r)=>!r.generationFailed).length,
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
        followUpsRequested: visits.filter((v)=>v.needsFollowUp).length,
        recentObservations: collectRecentObservations(visits)
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
        const stillLive = signals.streaks.streakIsOngoing || signals.latestVisit?.concerning || wellbeing === "Declining";
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
    for (const [label, shift] of [
        [
            "Mood",
            moodShift
        ],
        [
            "Mobility",
            mobilityShift
        ],
        [
            "Appetite",
            appetiteShift
        ]
    ]){
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
function recommendAction(level, aiTrend, signals) {
    const declining = aiTrend === "Declining";
    const ongoingStreak = signals.streaks?.streakIsOngoing && signals.streaks.currentConcernStreak >= 2;
    const missedMeds = (signals.adherence?.recentMissedDoseVisits ?? 0) > 0;
    const partialMeds = (signals.adherence?.recentPartialDoseVisits ?? 0) > 0;
    const unanswered = (signals.attendance?.missedVisits ?? 0) > 0 && (signals.attendance?.daysSinceLastNoAnswer ?? 999) <= 14;
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
    const order = [
        "Low",
        "Moderate",
        "High",
        "Critical"
    ];
    const atLeast = (floor)=>order.indexOf(level) >= order.indexOf(floor) ? level : floor;
    const ongoingStreak = signals.streaks?.streakIsOngoing && signals.streaks.currentConcernStreak >= 2;
    const missedMeds = (signals.adherence?.recentMissedDoseVisits ?? 0) > 0;
    if (aiTrend === "Declining" && (ongoingStreak || missedMeds)) return atLeast("High");
    if (aiTrend === "Declining") return atLeast("Moderate");
    if (ongoingStreak) return atLeast("Moderate");
    return level;
}
function deterministicTrendAssessment(signals, deterministicScore, reason = "") {
    const aiTrend = deterministicTrend(signals);
    const aiConcernScore = Math.max(Math.min(deterministicScore + trendAdjustment(signals), 100), 0);
    const concernLevel = escalateLevel(concernLevelFromScore(aiConcernScore), aiTrend, signals);
    const patterns = deterministicPatterns(signals);
    const basis = signals.visitsAnalyzed === 1 ? "a single logged visit" : `${signals.visitsAnalyzed} logged visits`;
    const evidence = patterns.length ? ` Strongest signals: ${patterns.slice(0, 3).join("; ")}.` : " No individual factor stood out across the history.";
    return {
        aiConcernScore,
        aiTrend,
        concernLevel,
        flaggedPatterns: patterns,
        recommendedAction: recommendAction(concernLevel, aiTrend, signals),
        reasoning: `Rules-based assessment from ${basis}${reason ? ` (${reason})` : ""}. ` + `Trend read as ${aiTrend} against a baseline concern score of ${deterministicScore}/100.${evidence}`
    };
}
}),
"[project]/lib/deriveLevels.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deriveLevels",
    ()=>deriveLevels
]);
// backend/lib/deriveLevels.js
//
// Derives per-visit wellbeing levels from the raw questionnaire responses
// stored on a Visit (see lib/visitQuestions.js). The Visit schema
// deliberately keeps only `status` + `responses`, so every consumer
// (concern score, concern breakdown, summary, AI assessment) funnels
// through here — this is the single place that knows how a questionnaire
// answer maps to a level.
//
// `appetiteLevel`, `moodLevel` and `medicationTaken` keep the exact same
// mappings/semantics the old flat-field form used, so lib/concernScore.js's
// scoring (already weighted, streak-tested, and unchanged) keeps producing
// the same kind of numbers it always has. The remaining fields are
// additive, used by the new AI assessment / trend analysis.
//
// Ported from the feature branch as-is.
const STEP_DOWN = {
    Good: "Fair",
    Fair: "Poor",
    Poor: "Poor"
};
// q3 = "able to carry out usual daily activities", q4 = "difficulty with
// movement or independence". q3 sets the baseline and a "Yes" on q4
// escalates it one step, so an elder who manages activities "Fully" but was
// observed struggling to move still registers as "Fair" rather than being
// scored as fully mobile.
function deriveMobility(byId) {
    const base = {
        Fully: "Good",
        Partially: "Fair",
        "Not able to": "Poor"
    }[byId.q3?.answer] || "Good";
    return byId.q4?.answer === "Yes" ? STEP_DOWN[base] : base;
}
// Free-text and follow-up detail written by the checker. These are the
// "checker observations" — the richest signal in the questionnaire and the
// part a rules-based score cannot read at all, so they are collected here
// for the AI prompt.
const OBSERVATION_QUESTIONS = [
    {
        id: "q2",
        label: "New physical discomfort",
        flagOn: "Yes"
    },
    {
        id: "q4",
        label: "Difficulty with movement",
        flagOn: "Yes"
    },
    {
        id: "q6",
        label: "Sleep / routine change",
        flagOn: "Yes"
    },
    {
        id: "q8",
        label: "Mood or behaviour change",
        flagOn: "Yes"
    },
    {
        id: "q9",
        label: "No social contact since last visit",
        flagOn: "No"
    },
    {
        id: "q11",
        label: "Living environment concern",
        flagOn: "Some concerns"
    },
    {
        id: "q12",
        label: "Support / necessities gap",
        flagOn: "Some gaps"
    },
    {
        id: "q14",
        label: "Needs follow-up",
        flagOn: "Yes"
    }
];
function deriveObservations(byId) {
    const observations = [];
    for (const { id, label, flagOn } of OBSERVATION_QUESTIONS){
        const response = byId[id];
        if (!response) continue;
        const raised = response.answer === flagOn;
        const detail = (response.detail || "").trim();
        if (raised || detail) {
            observations.push({
                label,
                answer: response.answer,
                detail
            });
        }
    }
    // q13 is a free-text "most noticeable change since the previous visit" field.
    const change = (byId.q13?.answer || "").trim();
    if (change) observations.push({
        label: "Most noticeable change",
        answer: change,
        detail: ""
    });
    return observations;
}
function deriveLevels(responses) {
    const byId = Object.fromEntries((responses || []).map((r)=>[
            r.questionId,
            r
        ]));
    const observations = deriveObservations(byId);
    return {
        appetiteLevel: ({
            "Yes, normally": "Good",
            "Somewhat reduced": "Fair",
            "Poor intake": "Poor"
        })[byId.q5?.answer] || "Good",
        moodLevel: ({
            "Cheerful / positive": "Good",
            "Neutral / calm": "Good",
            "Withdrawn": "Fair",
            "Distressed / anxious": "Poor"
        })[byId.q7?.answer] || "Good",
        // Unchanged semantics: "Partially" still counts as taken, so the
        // deterministic concern score keeps scoring exactly as before.
        // `medicationAdherence` below carries the finer distinction for trend
        // analysis.
        medicationTaken: byId.q4b?.answer !== "No",
        // --- additive, used by the new AI assessment / trend analysis ---
        mobilityLevel: deriveMobility(byId),
        medicationAdherence: ({
            Yes: "Full",
            Partially: "Partial",
            No: "None"
        })[byId.q4b?.answer] || "Full",
        engagementLevel: ({
            "Yes, as usual": "Good",
            "Less than usual": "Fair",
            "Not at all": "Poor"
        })[byId.q10?.answer] || "Good",
        sleepDisrupted: byId.q6?.answer === "Yes",
        needsFollowUp: byId.q14?.answer === "Yes",
        observations,
        // Convenience flat string for anywhere a single "notes" string is expected.
        notes: observations.map((o)=>o.detail ? `${o.label}: ${o.answer} — ${o.detail}` : `${o.label}: ${o.answer}`).join("; ")
    };
}
}),
"[project]/lib/mongodb.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}
let cached = /*TURBOPACK member replacement*/ __turbopack_context__.g.mongoose;
if (!cached) {
    cached = /*TURBOPACK member replacement*/ __turbopack_context__.g.mongoose = {
        conn: null,
        promise: null
    };
}
async function connectDB() {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        cached.promise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].connect(MONGODB_URI).then((mongoose)=>mongoose);
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
const __TURBOPACK__default__export__ = connectDB;
}),
"[project]/lib/visitQuestions.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// backend/lib/visitQuestions.js
//
// The structured check-in interview a checker fills out during a visit
// (replacing the old 4-dropdown appetite/mobility/mood/medication form).
// Ported from the feature branch as-is — see lib/deriveLevels.js for how
// these responses map back to the wellbeing "levels" the concern-scoring
// engine and UI display expect.
__turbopack_context__.s([
    "VISIT_QUESTIONS",
    ()=>VISIT_QUESTIONS
]);
const VISIT_QUESTIONS = [
    {
        id: "q1",
        category: "Overall condition",
        prompt: "How does the elder appear to be feeling today compared with their usual condition?",
        type: "choice",
        options: [
            "Better than usual",
            "About the same",
            "Worse than usual"
        ]
    },
    {
        id: "q2",
        category: "Overall condition",
        prompt: "Has the elder reported or shown any new physical discomfort or difficulty?",
        type: "choice",
        options: [
            "No",
            "Yes"
        ],
        detail: true
    },
    {
        id: "q3",
        category: "Daily functioning",
        prompt: "Has the elder been able to carry out their usual daily activities?",
        type: "choice",
        options: [
            "Fully",
            "Partially",
            "Not able to"
        ]
    },
    {
        id: "q4",
        category: "Daily functioning",
        prompt: "Has the elder experienced any noticeable difficulty with movement or independence?",
        type: "choice",
        options: [
            "No",
            "Yes"
        ],
        detail: true
    },
    {
        id: "q4b",
        category: "Daily functioning",
        prompt: "Has the elder taken their medication as prescribed?",
        type: "choice",
        options: [
            "Yes",
            "Partially",
            "No"
        ]
    },
    {
        id: "q5",
        category: "Food, sleep, and routine",
        prompt: "Has the elder been eating and drinking normally?",
        type: "choice",
        options: [
            "Yes, normally",
            "Somewhat reduced",
            "Poor intake"
        ]
    },
    {
        id: "q6",
        category: "Food, sleep, and routine",
        prompt: "Has the elder's sleep or daily routine changed noticeably?",
        type: "choice",
        options: [
            "No change",
            "Yes"
        ],
        detail: true
    },
    {
        id: "q7",
        category: "Emotional wellbeing",
        prompt: "How does the elder appear emotionally during the visit?",
        type: "choice",
        options: [
            "Cheerful / positive",
            "Neutral / calm",
            "Withdrawn",
            "Distressed / anxious"
        ]
    },
    {
        id: "q8",
        category: "Emotional wellbeing",
        prompt: "Has the elder shown any noticeable change in mood, behavior, communication, or engagement?",
        type: "choice",
        options: [
            "No",
            "Yes"
        ],
        detail: true
    },
    {
        id: "q9",
        category: "Social and lifestyle",
        prompt: "Has the elder interacted with family, friends, caregivers, or others since the previous visit?",
        type: "choice",
        options: [
            "Yes",
            "No",
            "Unknown"
        ],
        detail: true
    },
    {
        id: "q10",
        category: "Social and lifestyle",
        prompt: "Has the elder participated in their usual activities or interests?",
        type: "choice",
        options: [
            "Yes, as usual",
            "Less than usual",
            "Not at all"
        ]
    },
    {
        id: "q11",
        category: "Environment and support",
        prompt: "Does the elder's living environment appear safe and suitable for their current needs?",
        type: "choice",
        options: [
            "Yes",
            "Some concerns",
            "No"
        ],
        detail: true
    },
    {
        id: "q12",
        category: "Environment and support",
        prompt: "Does the elder appear to have the necessary support and basic necessities?",
        type: "choice",
        options: [
            "Yes",
            "Some gaps",
            "No"
        ],
        detail: true
    },
    {
        id: "q13",
        category: "Change detection",
        prompt: "What is the most noticeable change, if any, since the previous visit?",
        type: "text"
    },
    {
        id: "q14",
        category: "Change detection",
        prompt: "Did the checker observe anything that may require follow-up or attention?",
        type: "choice",
        options: [
            "No",
            "Yes"
        ],
        detail: true
    }
];
}),
"[project]/models/AiAssessment.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
// One row per assessment run, so the history doubles as the trend graph
// the frontend plots.
const AiAssessmentSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema({
    elderId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema.Types.ObjectId,
        ref: "Elder",
        required: true
    },
    aiConcernScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    aiTrend: {
        type: String,
        enum: [
            "Improving",
            "Stable",
            "Declining"
        ],
        required: true
    },
    concernLevel: {
        type: String,
        enum: [
            "Low",
            "Moderate",
            "High",
            "Critical"
        ],
        default: "Low"
    },
    flaggedPatterns: {
        type: [
            String
        ],
        default: []
    },
    recommendedAction: {
        type: String,
        default: ""
    },
    reasoning: {
        type: String,
        required: true
    },
    // The headline score from lib/concernScore.js (main's tested,
    // recency-weighted engine) at the time this assessment ran, so a
    // reviewer can see whether the AI agreed with it.
    deterministicScoreAtRun: {
        type: Number,
        required: true
    },
    scoresDiverge: {
        type: Boolean,
        default: false
    },
    visitsAnalyzed: {
        type: Number,
        required: true
    },
    reportsAnalyzed: {
        type: Number,
        default: 0
    },
    // Snapshot of the trend signals the judgement was based on. Stored so a
    // reviewer can audit an assessment after the fact, and so the UI can
    // show the breakdown without recomputing. Mixed because the signal set
    // is expected to grow.
    signals: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema.Types.Mixed,
        default: {}
    },
    // "ai" when the AI model produced this, "fallback" when the deterministic
    // rules did. The UI labels fallbacks explicitly rather than presenting
    // them as model output.
    source: {
        type: String,
        enum: [
            "ai",
            "fallback"
        ],
        default: "ai"
    },
    fallbackReason: {
        type: String,
        default: ""
    },
    dataSufficiency: {
        type: String,
        enum: [
            "sufficient",
            "limited"
        ],
        default: "sufficient"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
AiAssessmentSchema.index({
    elderId: 1,
    createdAt: -1
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.AiAssessment || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model("AiAssessment", AiAssessmentSchema);
}),
"[project]/models/Checker.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const CheckerSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        default: ""
    },
    passwordHash: {
        type: String,
        required: true
    },
    serviceArea: {
        type: String,
        required: true
    },
    // --- NEW: geocoded from serviceArea at creation time (see
    // backend/lib/geo.js), used by Intelligent Checker Assignment for real
    // distance-based scoring. Null until successfully geocoded.
    serviceLocation: {
        lat: {
            type: Number,
            default: null
        },
        lng: {
            type: Number,
            default: null
        }
    },
    // ---------------------------------------------------------------------
    workingHours: {
        start: {
            type: String,
            default: "08:00"
        },
        end: {
            type: String,
            default: "18:00"
        }
    },
    experienceYears: {
        type: Number,
        default: 0
    },
    maxCapacity: {
        type: Number,
        default: 20
    },
    ratePerVisit: {
        type: Number,
        default: 60
    },
    // --- NEW: identity verification, added for the public checker signup flow ---
    // Stored as base64 data URLs directly on the document. That's fine at capstone scale
    // (a handful of applicants, small JPG/PNGs) but isn't how you'd do it in production —
    // swap for real object storage (S3/Cloudinary/etc.) + a URL field if this ever needs to scale.
    nidPhoto: {
        type: String,
        default: ""
    },
    profilePhoto: {
        type: String,
        default: ""
    },
    applicationStatus: {
        type: String,
        enum: [
            "Pending",
            "Approved",
            "Rejected"
        ],
        default: "Pending"
    },
    // ------------------------------------------------------------------------------
    verified: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: [
            "Active",
            "Inactive"
        ],
        default: "Inactive"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.Checker || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model("Checker", CheckerSchema);
}),
"[project]/models/Elder.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const AddressSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema({
    flatFloor: {
        type: String,
        default: ""
    },
    houseNo: {
        type: String,
        default: ""
    },
    road: {
        type: String,
        default: ""
    },
    areaTahna: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    postalCode: {
        type: String,
        default: ""
    },
    country: {
        type: String,
        default: "Bangladesh"
    },
    // --- NEW: geocoded from the fields above at creation time (see
    // backend/lib/geo.js), used by Intelligent Checker Assignment for real
    // distance-based scoring instead of area/city string matching. Null
    // until successfully geocoded — every consumer must handle that case.
    coordinates: {
        lat: {
            type: Number,
            default: null
        },
        lng: {
            type: Number,
            default: null
        }
    }
});
// Bangladeshi mobile numbers: 11 digits, starting with one of the listed operator prefixes.
const BD_PHONE_REGEX = /^(017|013|018|019|014)\d{8}$/;
const ElderSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
        min: 30,
        max: 120
    },
    gender: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        match: [
            BD_PHONE_REGEX,
            "Phone must be an 11-digit number starting with 017, 013, 018, 019, or 014"
        ]
    },
    address: {
        type: AddressSchema,
        required: true
    },
    bio: {
        type: String,
        default: ""
    },
    medicalConditions: {
        type: [
            String
        ],
        default: []
    },
    mobilityNotes: {
        type: String,
        default: ""
    },
    emergencyContact: {
        name: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true,
            match: [
                BD_PHONE_REGEX,
                "Phone must be an 11-digit number starting with 017, 013, 018, 019, or 014"
            ]
        },
        email: {
            type: String,
            required: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Please provide a valid email"
            ]
        },
        relationship: {
            type: String,
            required: true
        },
        note: {
            type: String,
            default: ""
        }
    },
    secondaryContact: {
        name: {
            type: String,
            default: ""
        },
        // optional field, so only validate the format when something was actually entered
        phone: {
            type: String,
            default: "",
            validate: {
                validator: (v)=>!v || BD_PHONE_REGEX.test(v),
                message: "Phone must be an 11-digit number starting with 017, 013, 018, 019, or 014"
            }
        },
        email: {
            type: String,
            default: ""
        },
        relationship: {
            type: String,
            default: ""
        },
        note: {
            type: String,
            default: ""
        }
    },
    familyMemberId: {
        type: String,
        required: true
    },
    familyMemberEmail: {
        type: String,
        default: ""
    },
    visitSchedule: {
        days: {
            type: [
                String
            ],
            default: []
        },
        scheduledTime: {
            type: String,
            default: "10:00"
        },
        escalateAfterHours: {
            type: Number,
            default: 4
        }
    },
    // --- NEW: added for Checker Management & Intelligent Checker Assignment ---
    assignedCheckerId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema.Types.ObjectId,
        ref: "Checker",
        default: null
    },
    status: {
        type: String,
        enum: [
            "Waiting",
            "Assigned"
        ],
        default: "Waiting"
    },
    // ---------------------------------------------------------------------------
    concernOverride: {
        score: {
            type: Number,
            min: 0,
            max: 100,
            default: null
        },
        note: {
            type: String,
            default: ""
        },
        setByCheckerId: {
            type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema.Types.ObjectId,
            ref: "Checker",
            default: null
        },
        setAt: {
            type: Date,
            default: null
        }
    },
    // ---------------------------------------------------------------------------
    // CHANGED: replaced the isPremium boolean bridge field with a real
    // subscription object, now that Premium is backed by an actual payment
    // gateway (a local bKash/Nagad/Card sandbox simulator — see
    // lib/payments.js, models/PaymentRecord.js, app/api/payments/*) instead
    // of being manually flipped. Whether an elder currently has Premium
    // access is DERIVED on read from this (see lib/subscription.js's
    // isPremium()) rather than trusted as a flag directly, so an expired
    // period stops granting access the moment it lapses without needing a
    // scheduled job.
    subscription: {
        plan: {
            type: String,
            enum: [
                "free",
                "premium"
            ],
            default: "free"
        },
        status: {
            type: String,
            enum: [
                "inactive",
                "active",
                "expired",
                "cancelled"
            ],
            default: "inactive"
        },
        currentPeriodEnd: {
            type: Date,
            default: null
        },
        activatedAt: {
            type: Date,
            default: null
        },
        lastPaymentId: {
            type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema.Types.ObjectId,
            ref: "SubscriptionPayment",
            default: null
        }
    },
    // ---------------------------------------------------------------------------
    // --- NEW: set automatically by the AI concern assessment (see
    // lib/concernAi.js) whenever it finds a declining trend or a high
    // absolute AI concern score. A simple boolean summary of "does this
    // elder currently need attention" for admin/checker dashboards, distinct
    // from the numeric concernScore/category the wellbeing endpoints compute.
    concernStatus: {
        type: String,
        enum: [
            "Fine",
            "Concern flagged"
        ],
        default: "Fine"
    },
    // ---------------------------------------------------------------------------
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.Elder || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model("Elder", ElderSchema);
}),
"[project]/models/Visit.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
// CHANGED: replaced the flat appetiteLevel/mobilityLevel/moodLevel/medicationTaken
// fields with a structured questionnaire response array (see
// lib/visitQuestions.js for the question set, lib/deriveLevels.js for how a
// response array is turned back into the level fields the scoring engine and
// UI expect). This is a genuinely richer check-in — a fixed 14-question
// interview covering overall condition, daily functioning, food/sleep, mood,
// social contact, environment, and open-ended change detection — instead of
// four dropdowns.
const VisitSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema({
    elderId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema.Types.ObjectId,
        ref: "Elder",
        required: true
    },
    checkerId: {
        type: String,
        required: true
    },
    checkerName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: [
            "Fine",
            "Concerned",
            "No Answer"
        ],
        required: true
    },
    responses: [
        {
            questionId: {
                type: String,
                required: true
            },
            answer: {
                type: String,
                required: true
            },
            detail: {
                type: String,
                default: ""
            }
        }
    ],
    visitDate: {
        type: Date,
        default: Date.now
    },
    // Only set when the visit was logged against a scheduled slot — an ad-hoc
    // visit leaves these unset, which keeps the on-time-rate calculation on
    // the checker detail page meaningful (it should only count visits that had
    // a target time to be measured against).
    scheduledAt: {
        type: Date,
        default: null
    },
    completedAt: {
        type: Date,
        default: null
    }
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.Visit || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model("Visit", VisitSchema);
}),
"[project]/models/VisitReport.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
// One AI-generated wellbeing report per visit. Created as a pending
// placeholder the moment a visit is logged, then filled in by a background
// job (see the after() call in app/api/wellbeing/[id]/visits/route.js) once
// the AI responds — so the checker gets an immediate response instead of
// waiting 10-40s for the AI call.
const VisitReportSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema({
    visitId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema.Types.ObjectId,
        ref: "Visit",
        required: true,
        unique: true
    },
    elderId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema.Types.ObjectId,
        ref: "Elder",
        required: true
    },
    wellbeingScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    moodAssessment: {
        type: String,
        required: true
    },
    trendDirection: {
        type: String,
        enum: [
            "Improving",
            "Stable",
            "Declining"
        ],
        required: true
    },
    flags: {
        type: [
            String
        ],
        default: []
    },
    summary: {
        type: String,
        required: true
    },
    generationFailed: {
        type: Boolean,
        default: false
    },
    // True between saving a visit and the AI finishing.
    pending: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
VisitReportSchema.index({
    elderId: 1,
    createdAt: 1
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.VisitReport || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model("VisitReport", VisitReportSchema);
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__05evzom._.js.map