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
"[project]/app/api/subscriptions/status/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Elder$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Elder.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$PaymentRecord$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/PaymentRecord.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$subscription$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/subscription.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
;
;
;
;
async function GET(request) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const { searchParams } = new URL(request.url);
        const elderId = searchParams.get("elderId");
        const familyMemberId = searchParams.get("familyMemberId");
        const checkerId = searchParams.get("checkerId");
        if (!elderId) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "elderId is required"
        }, {
            status: 400
        });
        const elder = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Elder$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findById(elderId).lean();
        if (!elder) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Elder not found"
        }, {
            status: 404
        });
        if (familyMemberId && elder.familyMemberId !== familyMemberId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "You do not have access to this elder's subscription"
            }, {
                status: 403
            });
        }
        if (checkerId && (!elder.assignedCheckerId || String(elder.assignedCheckerId) !== String(checkerId))) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "This elder is not assigned to you"
            }, {
                status: 403
            });
        }
        const payments = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$PaymentRecord$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
            elderId
        }).sort({
            createdAt: -1
        }).limit(10).select("paymentId amount currency months method status completedAt createdAt invoiceNumber").lean();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: {
                elder: {
                    _id: elder._id,
                    name: elder.name
                },
                subscription: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$subscription$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["serializeSubscription"])(elder),
                payments
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
"[project]/models/PaymentRecord.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
// Ported from the payment sandbox's PaymentRecord shape (see
// paymentSandbox-master/lib/types.ts), persisted to real MongoDB instead
// of the sandbox's local data/payments.json file — the sandbox's own code
// comments say exactly this ("Persist these documents to MongoDB in
// production... use mongodbDocument for MongoDB insertOne()").
//
// This is a demo/sandbox payment flow: no real gateway is called, no real
// money moves. A submission on any of the bKash/Nagad/Card pages is
// always recorded as "success" — see app/api/payments/record/route.js.
const PaymentRecordSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema({
    paymentId: {
        type: String,
        required: true,
        unique: true
    },
    sessionId: {
        type: String,
        required: true
    },
    invoiceNumber: {
        type: String,
        required: true
    },
    // Added on top of the sandbox's own shape, to link a payment back to
    // what it actually paid for within this app.
    elderId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema.Types.ObjectId,
        ref: "Elder",
        required: true
    },
    familyMemberId: {
        type: String,
        required: true
    },
    months: {
        type: Number,
        min: 1,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: "BDT"
    },
    method: {
        type: String,
        enum: [
            "bkash",
            "nagad",
            "card"
        ],
        required: true
    },
    user: {
        id: String,
        name: String,
        email: String,
        phone: String
    },
    plan: {
        id: String,
        name: String,
        description: String
    },
    status: {
        type: String,
        enum: [
            "pending",
            "processing",
            "success",
            "failed"
        ],
        default: "success"
    },
    // bKash/Nagad wallet number and PIN, or card number/expiry/cvv —
    // sensitive fields are masked before being stored (see the route),
    // same as the sandbox's own approach.
    details: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema.Types.Mixed,
        default: {}
    },
    processingFee: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true
    },
    gatewayResponse: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema.Types.Mixed,
        default: {}
    },
    isSandbox: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date,
        default: null
    }
});
PaymentRecordSchema.index({
    elderId: 1,
    createdAt: -1
});
PaymentRecordSchema.index({
    familyMemberId: 1,
    createdAt: -1
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.PaymentRecord || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model("PaymentRecord", PaymentRecordSchema);
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__072r75d._.js.map