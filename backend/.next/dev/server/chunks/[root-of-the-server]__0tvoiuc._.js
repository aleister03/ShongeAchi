module.exports = [
"[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("mongoose-8b99e611e7552af3", () => require("mongoose-8b99e611e7552af3"));

module.exports = mod;
}),
"[project]/lib/escalationEngine.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkElder",
    ()=>checkElder,
    "computeEscalations",
    ()=>computeEscalations
]);
const DAY_NAMES = [
    "SUN",
    "MON",
    "TUE",
    "WED",
    "THU",
    "FRI",
    "SAT"
];
function isSameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function getScheduledDateTime(now, scheduledTime) {
    const [hours, minutes] = (scheduledTime || "10:00").split(":").map(Number);
    const dt = new Date(now);
    dt.setHours(hours, minutes || 0, 0, 0);
    return dt;
}
function checkElder(elder, visits, now, platformConfig = null) {
    const baseEscalateAfterHours = elder.visitSchedule?.escalateAfterHours ?? 4;
    // --- NEW: Platform Configuration — Disaster Mode. While active, the
    // window is capped at platformConfig.disasterMode.reducedEscalateAfterHours,
    // taking whichever is TIGHTER — this can only shrink an elder's window,
    // never loosen it (an elder configured for a stricter window than the
    // disaster-mode ceiling keeps their own, stricter setting).
    const disasterActive = platformConfig?.disasterMode?.enabled;
    const escalateAfterHours = disasterActive ? Math.min(baseEscalateAfterHours, platformConfig.disasterMode.reducedEscalateAfterHours ?? baseEscalateAfterHours) : baseEscalateAfterHours;
    // ---------------------------------------------------------------------
    const scheduledTime = elder.visitSchedule?.scheduledTime || "10:00";
    const todaysVisit = visits.find((v)=>isSameDay(new Date(v.visitDate), now));
    // 1. A visit already happened today and it wasn't fine
    if (todaysVisit && todaysVisit.status === "No Answer") {
        return {
            triggerType: "No Answer",
            severity: "Critical",
            reason: `${elder.name}'s checker got no answer during today's visit.`,
            relatedVisitId: todaysVisit._id
        };
    }
    if (todaysVisit && todaysVisit.status === "Concerned") {
        return {
            triggerType: "Concerned",
            severity: "Elevated",
            reason: `${elder.name}'s checker flagged a concern during today's visit.`,
            relatedVisitId: todaysVisit._id
        };
    }
    // 2. No visit yet today, but one was expected — measured from the elder's
    // scheduled visit TIME (e.g. 10:00), not from midnight. A 2-hour window on
    // a 10:00 schedule means the deadline is 12:00, not 02:00.
    const todayName = DAY_NAMES[now.getDay()];
    const isScheduledToday = elder.visitSchedule?.days?.includes(todayName);
    if (isScheduledToday && !todaysVisit) {
        const scheduledAt = getScheduledDateTime(now, scheduledTime);
        const deadline = new Date(scheduledAt.getTime() + escalateAfterHours * 60 * 60 * 1000);
        if (now >= deadline) {
            return {
                triggerType: "Missed Visit",
                severity: "Elevated",
                reason: `No visit logged for ${elder.name} today (${todayName}) — expected by ${scheduledTime}, and the ${escalateAfterHours}h check-in window has now passed.`,
                relatedVisitId: null
            };
        }
    }
    return null;
}
/**
 *
 * @param {Array} elders - Elder docs (each needs assignedCheckerId, visitSchedule, name).
 * @param {Map<string, Array>} visitsByElderId - elderId (string) -> that elder's visits.
 * @param {Set<string>} openElderIds - elderIds (string) that already have an open escalation.
 * @param {Date} [now]
 * @param {object|null} [platformConfig] - see lib/platformConfig.js; drives Disaster Mode.
 */ function computeEscalations(elders, visitsByElderId, openElderIds, now = new Date(), platformConfig = null) {
    const results = [];
    for (const elder of elders){
        const elderId = String(elder._id);
        if (openElderIds.has(elderId)) continue; // already being handled
        if (!elder.assignedCheckerId) continue; // nothing to escalate against yet
        const visits = visitsByElderId.get(elderId) || [];
        const finding = checkElder(elder, visits, now, platformConfig);
        if (finding) {
            results.push({
                elderId,
                checkerId: elder.assignedCheckerId,
                ...finding
            });
        }
    }
    return results;
}
;
}),
"[project]/lib/escalationSweep.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "runEscalationSweep",
    ()=>runEscalationSweep
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Elder$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Elder.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Checker$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Checker.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Visit$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Visit.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Escalation$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Escalation.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$escalationEngine$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/escalationEngine.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$notifyFamily$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/notifyFamily.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$platformConfig$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/platformConfig.js [instrumentation] (ecmascript)");
;
;
;
;
;
;
;
;
async function runEscalationSweep() {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"])();
    // --- NEW: Platform Configuration — drives Disaster Mode (tighter
    // escalation window platform-wide) and whether notifications fire at
    // all for newly raised escalations.
    const platformConfig = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$platformConfig$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getPlatformConfig"])();
    // ---------------------------------------------------------------------
    const elders = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Elder$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"].find({
        status: "Assigned"
    });
    const openEscalations = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Escalation$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"].find({
        status: "Open"
    }).select("elderId");
    const openElderIds = new Set(openEscalations.map((e)=>String(e.elderId)));
    const checkerIds = elders.map((e)=>e.assignedCheckerId).filter(Boolean);
    const checkers = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Checker$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"].find({
        _id: {
            $in: checkerIds
        }
    }).select("name");
    const checkerNameById = new Map(checkers.map((c)=>[
            String(c._id),
            c.name
        ]));
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    const recentVisits = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Visit$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"].find({
        visitDate: {
            $gte: twoDaysAgo
        }
    }).sort({
        visitDate: -1
    });
    const visitsByElderId = new Map();
    for (const visit of recentVisits){
        const key = String(visit.elderId);
        if (!visitsByElderId.has(key)) visitsByElderId.set(key, []);
        visitsByElderId.get(key).push(visit);
    }
    const now = new Date();
    const findings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$escalationEngine$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["computeEscalations"])(elders, visitsByElderId, openElderIds, now, platformConfig);
    const elderById = new Map(elders.map((e)=>[
            String(e._id),
            e
        ]));
    const created = await Promise.all(findings.map(async (f)=>{
        const elder = elderById.get(f.elderId);
        const escalation = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Escalation$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"].create({
            elderId: f.elderId,
            elderName: elder?.name || "Unknown elder",
            checkerId: f.checkerId,
            checkerName: f.checkerId ? checkerNameById.get(String(f.checkerId)) || "Unknown checker" : "Unassigned",
            triggerType: f.triggerType,
            severity: f.severity,
            reason: f.reason,
            relatedVisitId: f.relatedVisitId,
            escalationSteps: [
                {
                    stage: "Family Notified",
                    note: "Simulated notification sent to the family contact chain.",
                    at: now
                }
            ]
        });
        // Respect the Platform Configuration notification toggle — if an
        // admin has switched escalation notifications off platform-wide,
        // the Escalation record is still raised (so it shows up in the
        // admin queue), it just doesn't fan out to notifyFamily().
        if (elder && platformConfig.notificationRules?.escalationNotificationsEnabled !== false) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$notifyFamily$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["notifyFamily"])(elder, escalation);
        }
        return escalation;
    }));
    return {
        scanned: elders.length,
        newEscalations: created.length,
        escalations: created,
        disasterModeActive: !!platformConfig.disasterMode?.enabled
    };
}
}),
"[project]/lib/mailer.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "sendEmail",
    ()=>sendEmail
]);
// backend/lib/mailer.js
//
// Transactional email via Brevo (formerly Sendinblue) HTTP API.
// Replaces the previous Nodemailer/Gmail SMTP transport. Keeps the exact
// same exported function signature as before — sendEmail({ to, subject, body })
// — so every existing caller (lib/notifyFamily.js's missed-check-in alerts,
// the elder-registration email below, future weekly-summary/receipt emails)
// needs no changes at all.
//
// If BREVO_API_KEY / EMAIL_FROM aren't configured, emails are "simulated"
// (logged, not sent) so the rest of the app keeps working end to end.
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
function getSenderConfig() {
    const apiKey = process.env.BREVO_API_KEY;
    const fromEmail = process.env.EMAIL_FROM;
    const fromName = process.env.EMAIL_FROM_NAME || "Shonge Achi";
    if (!apiKey || !fromEmail) return null;
    return {
        apiKey,
        fromEmail,
        fromName
    };
}
async function sendEmail({ to, subject, body }) {
    if (!to) {
        return {
            status: "failed",
            to: ""
        };
    }
    const config = getSenderConfig();
    if (!config) {
        console.log(`[mailer] Simulated email to ${to}: ${subject}`);
        return {
            status: "simulated",
            to
        };
    }
    try {
        const res = await fetch(BREVO_API_URL, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "api-key": config.apiKey
            },
            body: JSON.stringify({
                sender: {
                    name: config.fromName,
                    email: config.fromEmail
                },
                to: [
                    {
                        email: to
                    }
                ],
                subject,
                textContent: body
            })
        });
        if (!res.ok) {
            const errText = await res.text().catch(()=>"");
            console.error(`[mailer] Brevo failed to send to ${to}: ${res.status} ${errText}`);
            return {
                status: "failed",
                to
            };
        }
        return {
            status: "sent",
            to
        };
    } catch (err) {
        console.error(`[mailer] Failed to send email to ${to}:`, err.message);
        return {
            status: "failed",
            to
        };
    }
}
}),
"[project]/lib/mongodb.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/lib/notifyFamily.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "notifyFamily",
    ()=>notifyFamily
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Notification$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Notification.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mailer$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mailer.js [instrumentation] (ecmascript)");
;
;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
async function notifyFamily(elder, escalation) {
    const message = escalation.reason;
    const subject = `Shonge Achi Alert: ${elder.name} — ${escalation.triggerType}`;
    const body = `${message}\n\n` + `Severity: ${escalation.severity}\n` + `View details: ${FRONTEND_URL}/elder/${elder._id}/wellbeing\n\n` + `— This is an automated notification from Shonge Achi.`;
    const recipients = [
        elder.familyMemberEmail,
        elder.emergencyContact?.email,
        elder.secondaryContact?.email
    ].filter((email, i, arr)=>email && arr.indexOf(email) === i // drop empties and de-dupe
    );
    const emailResults = await Promise.all(recipients.map((to)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mailer$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["sendEmail"])({
            to,
            subject,
            body
        })));
    const emailChannels = emailResults.length ? emailResults.map((r)=>({
            channel: "email",
            status: r.status,
            to: r.to,
            subject,
            body,
            sentAt: new Date()
        })) : [
        {
            channel: "email",
            status: "failed",
            to: "",
            subject,
            body,
            sentAt: new Date()
        }
    ];
    return __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Notification$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"].create({
        familyMemberId: elder.familyMemberId,
        elderId: elder._id,
        elderName: elder.name,
        escalationId: escalation._id,
        triggerType: escalation.triggerType,
        severity: escalation.severity,
        message,
        channels: [
            {
                channel: "in-app",
                status: "sent",
                to: elder.familyMemberId,
                body: message,
                sentAt: new Date()
            },
            ...emailChannels
        ]
    });
}
}),
"[project]/lib/platformConfig.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SINGLETON_ID",
    ()=>SINGLETON_ID,
    "getPlatformConfig",
    ()=>getPlatformConfig
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$PlatformConfig$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/PlatformConfig.js [instrumentation] (ecmascript)");
;
;
const SINGLETON_ID = "platform-config-singleton";
// Platform Configuration is a single settings document. get() fetches it,
// auto-creating the default document the first time it's ever requested,
// so every consumer (escalation engine, concern scoring, pricing page,
// checker signup) can rely on it always existing instead of null-checking
// everywhere it's used.
async function getPlatformConfig() {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"])();
    let config = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$PlatformConfig$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"].findById(SINGLETON_ID);
    if (!config) {
        config = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$PlatformConfig$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"].create({
            _id: SINGLETON_ID
        });
    }
    return config;
}
;
}),
"[project]/models/Checker.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/models/Elder.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/models/Escalation.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const EscalationSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema({
    elderId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema.Types.ObjectId,
        ref: "Elder",
        required: true
    },
    elderName: {
        type: String,
        required: true
    },
    checkerId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema.Types.ObjectId,
        ref: "Checker",
        default: null
    },
    checkerName: {
        type: String,
        default: "Unassigned"
    },
    triggerType: {
        type: String,
        enum: [
            "No Answer",
            "Concerned",
            "Missed Visit"
        ],
        required: true
    },
    severity: {
        type: String,
        enum: [
            "Critical",
            "Elevated"
        ],
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    relatedVisitId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema.Types.ObjectId,
        ref: "Visit",
        default: null
    },
    status: {
        type: String,
        enum: [
            "Open",
            "Cleared"
        ],
        default: "Open"
    },
    escalationSteps: [
        {
            stage: {
                type: String,
                required: true
            },
            note: {
                type: String,
                default: ""
            },
            at: {
                type: Date,
                default: Date.now
            }
        }
    ],
    triggeredAt: {
        type: Date,
        default: Date.now
    },
    clearedAt: {
        type: Date,
        default: null
    },
    clearedNote: {
        type: String,
        default: ""
    }
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.Escalation || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model("Escalation", EscalationSchema);
}),
"[project]/models/Notification.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const NotificationSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema({
    familyMemberId: {
        type: String,
        required: true
    },
    elderId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema.Types.ObjectId,
        ref: "Elder",
        required: true
    },
    elderName: {
        type: String,
        required: true
    },
    escalationId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema.Types.ObjectId,
        ref: "Escalation",
        default: null
    },
    triggerType: {
        type: String,
        default: ""
    },
    severity: {
        type: String,
        default: ""
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    // One notification event, fanned out across channels — the "multi" in
    // multi-channel. Each channel records its own delivery status
    // independently, so an email failure never blocks the in-app alert.
    channels: [
        {
            channel: {
                type: String,
                enum: [
                    "in-app",
                    "email"
                ],
                required: true
            },
            status: {
                type: String,
                enum: [
                    "sent",
                    "simulated",
                    "failed"
                ],
                required: true
            },
            to: {
                type: String,
                default: ""
            },
            subject: {
                type: String,
                default: ""
            },
            body: {
                type: String,
                default: ""
            },
            sentAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.Notification || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model("Notification", NotificationSchema);
}),
"[project]/models/PlatformConfig.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/models/Visit.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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

//# sourceMappingURL=%5Broot-of-the-server%5D__0tvoiuc._.js.map