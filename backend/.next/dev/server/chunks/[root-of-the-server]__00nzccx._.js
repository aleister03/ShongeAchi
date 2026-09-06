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
"[project]/app/api/subscriptions/plans/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$subscription$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/subscription.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
;
async function GET() {
    try {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: {
                currency: "BDT",
                monthlyPriceBDT: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$subscription$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["monthlyPriceBDT"])(),
                maxMonths: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$subscription$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MAX_MONTHS"],
                plans: [
                    {
                        id: "free",
                        name: "Free",
                        priceBDT: 0,
                        features: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$subscription$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PLAN_FEATURES"].free
                    },
                    {
                        id: "premium",
                        name: "Premium",
                        priceBDT: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$subscription$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["monthlyPriceBDT"])(),
                        features: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$subscription$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PLAN_FEATURES"].premium
                    }
                ],
                // CHANGED: the payment gateway is now a local sandbox simulator
                // (bKash/Nagad/Card) with no external credentials to configure —
                // it's always available, unlike SSLCommerz which could be
                // unconfigured.
                paymentsAvailable: true,
                gatewayMode: "sandbox"
            }
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
"[project]/lib/subscription.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// backend/lib/subscription.js
//
// Subscription plans and Premium access control.
//
// Premium is priced per elder per month, so the subscription lives on the
// Elder document rather than on the family account: one family member may
// have several elders and can upgrade them independently.
//
// Nothing about the free tier changes. Everything here either reads
// existing fields or gates access to features that are new to Premium.
__turbopack_context__.s([
    "MAX_MONTHS",
    ()=>MAX_MONTHS,
    "PLANS",
    ()=>PLANS,
    "PLAN_FEATURES",
    ()=>PLAN_FEATURES,
    "assertPremium",
    ()=>assertPremium,
    "daysRemaining",
    ()=>daysRemaining,
    "extendPeriod",
    ()=>extendPeriod,
    "isPremium",
    ()=>isPremium,
    "monthlyPriceBDT",
    ()=>monthlyPriceBDT,
    "normalizeMonths",
    ()=>normalizeMonths,
    "priceFor",
    ()=>priceFor,
    "serializeSubscription",
    ()=>serializeSubscription
]);
const PLANS = [
    "free",
    "premium"
];
const PLAN_FEATURES = {
    free: [
        "Scheduled check-ins",
        "Visit history & reports",
        "Standard escalation chain",
        "Email & in-app notifications",
        "Emergency contact management"
    ],
    premium: [
        "Everything in Free",
        "AI concern metrics & scoring",
        "Concern trends over time",
        "AI-generated wellbeing summaries",
        "Direct family-checker messaging",
        "Customized visit frequency"
    ]
};
const DEFAULT_PRICE_BDT = 800;
// A typo in the environment (8000, or 80) must not charge a real card the
// wrong amount — it falls back to the default and says so loudly.
const MIN_PRICE_BDT = 800;
const MAX_PRICE_BDT = 1000;
function monthlyPriceBDT() {
    const configured = Number(process.env.PREMIUM_PRICE_BDT);
    if (!Number.isFinite(configured)) return DEFAULT_PRICE_BDT;
    if (configured < MIN_PRICE_BDT || configured > MAX_PRICE_BDT) {
        console.warn(`PREMIUM_PRICE_BDT=${process.env.PREMIUM_PRICE_BDT} is outside the allowed ${MIN_PRICE_BDT}-${MAX_PRICE_BDT} BDT range; using ${DEFAULT_PRICE_BDT}.`);
        return DEFAULT_PRICE_BDT;
    }
    return Math.round(configured);
}
function priceFor(months = 1) {
    return monthlyPriceBDT() * months;
}
const MAX_MONTHS = 12;
function normalizeMonths(value) {
    const months = value === undefined || value === null ? 1 : Number(value);
    if (!Number.isInteger(months) || months < 1 || months > MAX_MONTHS) {
        const err = new Error(`months must be a whole number between 1 and ${MAX_MONTHS}`);
        err.status = 400;
        throw err;
    }
    return months;
}
function isPremium(elder, now = new Date()) {
    const subscription = elder?.subscription;
    if (!subscription || subscription.plan !== "premium") return false;
    if (subscription.status !== "active") return false;
    if (!subscription.currentPeriodEnd) return false;
    return new Date(subscription.currentPeriodEnd).getTime() > now.getTime();
}
function daysRemaining(elder, now = new Date()) {
    if (!isPremium(elder, now)) return 0;
    const end = new Date(elder.subscription.currentPeriodEnd).getTime();
    return Math.ceil((end - now.getTime()) / 86400000);
}
function assertPremium(elder, feature = "This feature") {
    if (isPremium(elder)) return;
    const err = new Error(`${feature} is available on the Premium plan. Upgrade this elder to continue.`);
    err.status = 402;
    throw err;
}
function serializeSubscription(elder, now = new Date()) {
    const subscription = elder?.subscription ?? {};
    const premium = isPremium(elder, now);
    return {
        plan: premium ? "premium" : "free",
        status: subscription.status ?? "inactive",
        isPremium: premium,
        currentPeriodEnd: subscription.currentPeriodEnd ?? null,
        activatedAt: subscription.activatedAt ?? null,
        daysRemaining: daysRemaining(elder, now),
        // True when a subscription was once active but has lapsed — the UI
        // uses this to say "renew" rather than "upgrade".
        expired: subscription.plan === "premium" && !premium && Boolean(subscription.currentPeriodEnd),
        monthlyPriceBDT: monthlyPriceBDT()
    };
}
function extendPeriod(elder, months, now = new Date()) {
    const existingEnd = elder?.subscription?.currentPeriodEnd ? new Date(elder.subscription.currentPeriodEnd) : null;
    const base = existingEnd && existingEnd.getTime() > now.getTime() ? existingEnd : now;
    const end = new Date(base);
    end.setMonth(end.getMonth() + months);
    return {
        periodStart: new Date(base),
        periodEnd: end
    };
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__00nzccx._.js.map