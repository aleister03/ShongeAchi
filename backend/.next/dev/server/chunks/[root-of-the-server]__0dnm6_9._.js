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
"[project]/app/api/checkers/[id]/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Checker$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Checker.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Elder$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Elder.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Visit$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Visit.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
;
;
;
;
async function GET(request, context) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const { id } = await context.params;
        const checker = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Checker$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findById(id);
        if (!checker) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Checker not found"
        }, {
            status: 404
        });
        const assignedElders = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Elder$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
            assignedCheckerId: id
        }).select("name address visitSchedule status concernStatus");
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const visitsThisMonth = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Visit$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
            checkerId: id,
            visitDate: {
                $gte: startOfMonth
            }
        });
        const concernFlags = visitsThisMonth.filter((v)=>v.status === "Concerned").length;
        const completed = visitsThisMonth.filter((v)=>v.status !== "No Answer").length;
        // NOTE: this is an approximation — "on-time" here means "visit was completed at all"
        // (status !== "No Answer"), since scheduled-vs-actual visit timestamps aren't tracked yet.
        // Swap this for a real punctuality calc once visits store a target arrival window.
        const onTimeRate = visitsThisMonth.length ? Math.round(completed / visitsThisMonth.length * 1000) / 10 : 0;
        const earnings = visitsThisMonth.length * (checker.ratePerVisit || 60);
        const eldersWithStatus = await Promise.all(assignedElders.map(async (elder)=>{
            const lastVisit = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Visit$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
                elderId: elder._id
            }).sort({
                visitDate: -1
            });
            return {
                _id: elder._id,
                name: elder.name,
                address: elder.address,
                visitSchedule: elder.visitSchedule,
                lastVisitStatus: lastVisit?.status || "No visits yet",
                // --- NEW: the AI-driven flag (see lib/concernAi.js's
                // deriveConcernStatus) — "Fine" or "Concern flagged", set
                // automatically whenever a visit is logged. Used by the
                // checker's own dashboard so no one has to manually assign a
                // concern level; lastVisitStatus above is kept unchanged for
                // the admin checker-detail page.
                concernStatus: elder.concernStatus || "Fine"
            };
        }));
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: {
                checker,
                capacity: {
                    assigned: assignedElders.length,
                    max: checker.maxCapacity
                },
                performance: {
                    visitsThisMonth: visitsThisMonth.length,
                    onTimeRate,
                    concernFlags,
                    earnings
                },
                assignedElders: eldersWithStatus
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
async function PUT(request, context) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const { id } = await context.params;
        const body = await request.json();
        const checker = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Checker$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findByIdAndUpdate(id, body, {
            new: true
        });
        if (!checker) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Checker not found"
        }, {
            status: 404
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: checker
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
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0dnm6_9._.js.map