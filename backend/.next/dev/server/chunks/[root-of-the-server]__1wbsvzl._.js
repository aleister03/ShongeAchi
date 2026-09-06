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
"[project]/app/api/wellbeing/dashboard/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Elder$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Elder.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Checker$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Checker.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Visit$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Visit.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$concernScore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/concernScore.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$platformConfig$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/platformConfig.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
;
;
;
;
;
;
async function GET(request) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const { searchParams } = new URL(request.url);
        const categoryFilter = searchParams.get("category");
        // Pull everything we need in three flat queries instead of one query
        // per elder (an "N+1" query pattern), which would get slow as the
        // number of elders grows.
        const [elders, checkers, visits] = await Promise.all([
            __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Elder$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find().sort({
                name: 1
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Checker$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find().select("name"),
            __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Visit$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find().sort({
                visitDate: 1
            })
        ]);
        // Build lookup maps so we can match visits/checkers to each elder in
        // memory (O(1) lookup) instead of re-querying the database per elder.
        const checkerNameById = new Map(checkers.map((c)=>[
                String(c._id),
                c.name
            ]));
        const visitsByElderId = new Map();
        for (const visit of visits){
            const key = String(visit.elderId);
            if (!visitsByElderId.has(key)) visitsByElderId.set(key, []);
            visitsByElderId.get(key).push(visit);
        }
        const now = new Date();
        const platformConfig = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$platformConfig$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPlatformConfig"])();
        const thresholds = platformConfig.concernScoreThresholds;
        const scoredElders = elders.map((elder)=>{
            const elderVisits = visitsByElderId.get(String(elder._id)) || [];
            const metrics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$concernScore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["applyOverride"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$concernScore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["computeConcernMetrics"])(elderVisits, now, thresholds), elder, thresholds);
            const lastVisit = elderVisits[elderVisits.length - 1];
            return {
                elderId: elder._id,
                name: elder.name,
                checkerName: elder.assignedCheckerId ? checkerNameById.get(String(elder.assignedCheckerId)) || "Unassigned" : "Unassigned",
                concernScore: metrics.concernScore,
                category: metrics.category,
                trend: metrics.trend,
                contributingFactors: metrics.contributingFactors,
                totalVisits: metrics.totalVisits,
                lastVisitDate: lastVisit ? lastVisit.visitDate : null
            };
        });
        // "Trending upward this week" — elders whose score is rising AND who
        // had at least one visit in the last 7 days (so the trend is current,
        // not something that happened a month ago and hasn't moved since).
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const trendingUpThisWeek = scoredElders.filter((e)=>e.trend.direction === "up" && e.lastVisitDate && new Date(e.lastVisitDate) >= oneWeekAgo).length;
        const summary = {
            critical: scoredElders.filter((e)=>e.category === "Critical").length,
            elevated: scoredElders.filter((e)=>e.category === "Elevated").length,
            stable: scoredElders.filter((e)=>e.category === "Stable").length,
            trendingUpThisWeek,
            totalElders: scoredElders.length,
            // --- NEW: Platform Configuration — lets the admin dashboard show a
            // "Disaster Mode active" banner without a second request.
            disasterModeActive: !!platformConfig.disasterMode?.enabled,
            disasterModeNote: platformConfig.disasterMode?.note || ""
        };
        // Sort highest concern first — that's what an admin scanning the table wants to see.
        let result = scoredElders.sort((a, b)=>b.concernScore - a.concernScore);
        if (categoryFilter && [
            "Critical",
            "Elevated",
            "Stable"
        ].includes(categoryFilter)) {
            result = result.filter((e)=>e.category === categoryFilter);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: {
                summary,
                elders: result
            }
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
"[project]/lib/platformConfig.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SINGLETON_ID",
    ()=>SINGLETON_ID,
    "getPlatformConfig",
    ()=>getPlatformConfig
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$PlatformConfig$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/PlatformConfig.js [app-route] (ecmascript)");
;
;
const SINGLETON_ID = "platform-config-singleton";
// Platform Configuration is a single settings document. get() fetches it,
// auto-creating the default document the first time it's ever requested,
// so every consumer (escalation engine, concern scoring, pricing page,
// checker signup) can rely on it always existing instead of null-checking
// everywhere it's used.
async function getPlatformConfig() {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
    let config = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$PlatformConfig$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findById(SINGLETON_ID);
    if (!config) {
        config = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$PlatformConfig$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create({
            _id: SINGLETON_ID
        });
    }
    return config;
}
;
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
"[project]/models/PlatformConfig.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
// Platform Configuration — spec: "Admins configure system-wide settings
// such as escalation timing, notification rules, concern score
// thresholds, subscription pricing, disaster mode, and supported service
// areas without modifying application code."
//
// Implemented as a SINGLE document (a fixed, well-known _id) rather than a
// collection — there is exactly one platform configuration, ever. See
// lib/platformConfig.js for the getPlatformConfig() helper that
// auto-creates this document the first time it's needed.
const PlatformConfigSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema({
    _id: {
        type: String,
        default: "platform-config-singleton"
    },
    disasterMode: {
        enabled: {
            type: Boolean,
            default: false
        },
        // Ceiling applied to EVERY elder's escalation window while active —
        // the escalation engine takes whichever is tighter, this or the
        // elder's own setting, so disaster mode can only ever shrink the
        // window, never loosen it.
        reducedEscalateAfterHours: {
            type: Number,
            default: 1
        },
        note: {
            type: String,
            default: ""
        }
    },
    concernScoreThresholds: {
        critical: {
            type: Number,
            default: 70
        },
        elevated: {
            type: Number,
            default: 40
        }
    },
    premiumPricing: {
        monthlyPerElder: {
            type: Number,
            default: 800
        },
        annualPerElder: {
            type: Number,
            default: 8000
        }
    },
    notificationRules: {
        escalationNotificationsEnabled: {
            type: Boolean,
            default: true
        }
    },
    defaultEscalateAfterHours: {
        type: Number,
        default: 4
    },
    supportedServiceAreas: {
        type: [
            String
        ],
        default: [
            "Dhanmondi",
            "Mirpur",
            "Uttara",
            "Gulshan",
            "Mohammadpur",
            "Adabor"
        ]
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.PlatformConfig || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model("PlatformConfig", PlatformConfigSchema);
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
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1wbsvzl._.js.map