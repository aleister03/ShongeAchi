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
"[project]/app/api/elders/[id]/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Elder$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Elder.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$geo$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/geo.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
;
;
;
async function GET(request, context) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const { id } = await context.params;
        const { searchParams } = new URL(request.url);
        const familyMemberId = searchParams.get("familyMemberId");
        const elder = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Elder$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findById(id);
        if (!elder) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Elder not found"
        }, {
            status: 404
        });
        // Optional relationship check, same trust model as the wellbeing routes:
        // if a familyMemberId is supplied, it must match the elder's owner.
        // Callers that don't pass one (admin/checker screens) are unaffected.
        if (familyMemberId && elder.familyMemberId !== familyMemberId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "You do not have access to this elder's profile"
            }, {
                status: 403
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: elder
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
        const { searchParams } = new URL(request.url);
        const familyMemberId = searchParams.get("familyMemberId");
        const body = await request.json();
        const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Elder$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findById(id);
        if (!existing) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Elder not found"
        }, {
            status: 404
        });
        if (familyMemberId && existing.familyMemberId !== familyMemberId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "You do not have access to edit this elder's profile"
            }, {
                status: 403
            });
        }
        // CHANGED: the edit form always resends the whole `address` object
        // without `coordinates` (the frontend never sees or edits that field).
        // A plain findByIdAndUpdate($set-ing the whole subdocument) would
        // silently reset coordinates to null on EVERY save — even an edit
        // that only changed the bio — breaking Intelligent Checker
        // Assignment's distance scoring for any elder who was ever edited.
        // Detect whether the address text actually changed: if not, carry the
        // existing coordinates forward; if it did, re-geocode in the
        // background (never block the response on this).
        let addressChanged = false;
        if (body.address) {
            const fields = [
                "flatFloor",
                "houseNo",
                "road",
                "areaTahna",
                "city",
                "postalCode",
                "country"
            ];
            addressChanged = fields.some((f)=>(body.address[f] || "") !== (existing.address?.[f] || ""));
            if (!addressChanged) {
                body.address = {
                    ...body.address,
                    coordinates: existing.address?.coordinates || null
                };
            }
        }
        const elder = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Elder$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findByIdAndUpdate(id, body, {
            new: true
        });
        if (addressChanged && elder?.address) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["after"])(async ()=>{
                try {
                    const coords = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$geo$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["geocodeAddressWithFallback"])([
                        elder.address?.road,
                        elder.address?.areaTahna,
                        elder.address?.city,
                        elder.address?.country || "Bangladesh"
                    ]);
                    if (coords) {
                        await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Elder$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].updateOne({
                            _id: elder._id
                        }, {
                            $set: {
                                "address.coordinates": coords
                            }
                        });
                    }
                } catch (err) {
                    console.error("[elders] Background re-geocoding on edit failed:", err);
                }
            });
        }
        // ---------------------------------------------------------------------
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: elder
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
async function DELETE(request, context) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const { id } = await context.params;
        const elder = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Elder$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findByIdAndDelete(id);
        if (!elder) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Elder not found"
        }, {
            status: 404
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: "Elder deleted successfully"
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
"[project]/lib/geo.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "geocodeAddress",
    ()=>geocodeAddress,
    "geocodeAddressWithFallback",
    ()=>geocodeAddressWithFallback,
    "haversineDistanceKm",
    ()=>haversineDistanceKm
]);
// backend/lib/geo.js
//
// Geocoding + distance helpers for Intelligent Checker Assignment
// (spec item: "OpenStreet API/Leaflet — for location-based checker
// assignment and route planning"). Uses OpenStreetMap's free Nominatim
// geocoding API rather than a paid service, matching the project's
// declared tech stack.
//
// Nominatim's usage policy (https://operations.osmfoundation.org/policies/nominatim/)
// requires a descriptive User-Agent and caps usage at ~1 request/second.
// That's fine here — geocoding only happens once, at elder/checker
// creation time, not on every page load or every assignment lookup.
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "ShongeAchi-CSE471-Capstone/1.0 (BRAC University, Group 07)";
/** Great-circle distance between two lat/lng points, in kilometers. */ function haversineDistanceKm(lat1, lng1, lat2, lng2) {
    const toRad = (deg)=>deg * Math.PI / 180;
    const R = 6371; // Earth's radius, km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
/**
 * Geocode a free-text address to { lat, lng } using Nominatim.
 * Returns null (never throws) on any failure — geocoding is a
 * best-effort enhancement, not a hard requirement for creating an
 * elder or checker record. Callers should always handle a null result.
 *
 * Has a hard timeout: without one, an unresponsive Nominatim would hang
 * the entire signup/registration request indefinitely (fetch() has no
 * default timeout), which defeats "never blocks creation".
 */ async function geocodeAddress(query, timeoutMs = 5000) {
    if (!query || !query.trim()) return null;
    const controller = new AbortController();
    const timeout = setTimeout(()=>controller.abort(), timeoutMs);
    try {
        const url = `${NOMINATIM_URL}?format=json&limit=1&q=${encodeURIComponent(query)}`;
        const res = await fetch(url, {
            headers: {
                "User-Agent": USER_AGENT
            },
            signal: controller.signal
        });
        if (!res.ok) return null;
        const results = await res.json();
        if (!results?.length) return null;
        const { lat, lon } = results[0];
        return {
            lat: parseFloat(lat),
            lng: parseFloat(lon)
        };
    } catch (err) {
        console.error("Geocoding failed:", err.name === "AbortError" ? `timed out after ${timeoutMs}ms` : err.message);
        return null;
    } finally{
        clearTimeout(timeout);
    }
}
/**
 * Geocode an address built from progressively broader parts, falling back
 * to a coarser query if the most specific one doesn't resolve. Many minor
 * residential roads simply aren't in OpenStreetMap's data even when the
 * surrounding area/city are — without this, a single unmapped road name
 * means the elder gets no coordinates at all. This way they still get an
 * area-level pin, which is good enough for assignment-distance purposes
 * (checkers are matched at a neighborhood/walkable-radius granularity
 * anyway, not house-by-house).
 *
 * @param {string[]} parts - address parts from most specific to least,
 *   e.g. [road, areaTahna, city, country]. Falsy/empty parts are skipped.
 * @param {number} [respectRateLimit=0] - ms to wait between attempts, so a
 *   multi-step fallback still honors Nominatim's ~1 req/sec policy.
 */ async function geocodeAddressWithFallback(parts, respectRateLimit = 0) {
    const clean = parts.filter(Boolean);
    for(let dropFromFront = 0; dropFromFront < clean.length; dropFromFront++){
        const attempt = clean.slice(dropFromFront).join(", ");
        if (!attempt) break;
        const coords = await geocodeAddress(attempt);
        if (coords) return coords;
        if (respectRateLimit) await new Promise((r)=>setTimeout(r, respectRateLimit));
    }
    return null;
}
;
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
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0ca06_h._.js.map