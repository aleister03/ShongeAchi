(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/components/SearchableCombobox.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SearchableCombobox
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function SearchableCombobox({ value, onChange, onSelect, options, placeholder, className, otherPlaceholder = "Type it in manually...", onKeyDown }) {
    _s();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [manualMode, setManualMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SearchableCombobox.useEffect": ()=>{
            function handleClickOutside(e) {
                if (containerRef.current && !containerRef.current.contains(e.target)) {
                    setOpen(false);
                }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return ({
                "SearchableCombobox.useEffect": ()=>document.removeEventListener("mousedown", handleClickOutside)
            })["SearchableCombobox.useEffect"];
        }
    }["SearchableCombobox.useEffect"], []);
    const query = value || "";
    const filtered = query.trim() ? options.filter((o)=>o.toLowerCase().startsWith(query.trim().toLowerCase())) : options;
    function selectOption(opt) {
        if (opt === "__other__") {
            setManualMode(true);
            onChange("");
            setOpen(false);
            return;
        }
        setManualMode(false);
        onSelect(opt);
        setOpen(false);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        ref: containerRef,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                className: className,
                placeholder: manualMode ? otherPlaceholder : placeholder,
                value: value,
                onChange: (e)=>{
                    onChange(e.target.value);
                    if (!manualMode) setOpen(true);
                },
                onFocus: ()=>!manualMode && setOpen(true),
                onKeyDown: onKeyDown
            }, void 0, false, {
                fileName: "[project]/app/components/SearchableCombobox.js",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            manualMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>{
                    setManualMode(false);
                    onChange("");
                },
                className: "absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-[#2a7a5a]",
                children: "back to list"
            }, void 0, false, {
                fileName: "[project]/app/components/SearchableCombobox.js",
                lineNumber: 63,
                columnNumber: 9
            }, this),
            open && !manualMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute z-20 mt-1 w-full max-h-56 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg",
                children: [
                    filtered.slice(0, 8).map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onMouseDown: (e)=>e.preventDefault(),
                            onClick: ()=>selectOption(opt),
                            className: "w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#e6f2dd] transition",
                            children: opt
                        }, opt, false, {
                            fileName: "[project]/app/components/SearchableCombobox.js",
                            lineNumber: 74,
                            columnNumber: 13
                        }, this)),
                    filtered.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-4 py-2 text-sm text-gray-400",
                        children: "No matches"
                    }, void 0, false, {
                        fileName: "[project]/app/components/SearchableCombobox.js",
                        lineNumber: 85,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onMouseDown: (e)=>e.preventDefault(),
                        onClick: ()=>selectOption("__other__"),
                        className: "w-full text-left px-4 py-2 text-sm text-[#2a7a5a] font-medium border-t border-gray-100 hover:bg-[#e6f2dd] transition",
                        children: "Other (enter manually)"
                    }, void 0, false, {
                        fileName: "[project]/app/components/SearchableCombobox.js",
                        lineNumber: 87,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/SearchableCombobox.js",
                lineNumber: 72,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/SearchableCombobox.js",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}
_s(SearchableCombobox, "5MaKcOtN8t7GWroTBJbHBhc9gm8=");
_c = SearchableCombobox;
var _c;
__turbopack_context__.k.register(_c, "SearchableCombobox");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/register-elder/page.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RegisterElder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$apiClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/apiClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SearchableCombobox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/SearchableCombobox.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$medicalConditionsList$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/medicalConditionsList.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$relationshipsList$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/relationshipsList.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
const WEEK_DAYS = [
    "SAT",
    "SUN",
    "MON",
    "TUE",
    "WED",
    "THU",
    "FRI"
];
// 11-digit BD mobile number starting with one of these operator prefixes.
const PHONE_REGEX = /^(017|013|018|019|014)\d{8}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_HINT = "11 digits, starting with 017, 013, 018, 019, or 014";
const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 text-sm focus:outline-none focus:border-[#2a7a5a] transition";
const labelClass = "block text-sm font-medium text-gray-600 mb-1";
function RegisterElder() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { data: session, status } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSession"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RegisterElder.useEffect": ()=>{
            if (status === "unauthenticated") {
                router.replace("/signin?callbackUrl=/register-elder");
            }
        }
    }["RegisterElder.useEffect"], [
        status,
        router
    ]);
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [submitting, setSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [personal, setPersonal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: "",
        age: "",
        gender: "",
        phone: "",
        bio: ""
    });
    const [address, setAddress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        flatFloor: "",
        houseNo: "",
        road: "",
        areaTahna: "",
        city: "",
        postalCode: "",
        country: "Bangladesh"
    });
    const [emergencyContact, setEmergencyContact] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: "",
        phone: "",
        email: "",
        relationship: "",
        note: ""
    });
    const [secondaryContact, setSecondaryContact] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: "",
        phone: "",
        email: "",
        relationship: "",
        note: ""
    });
    const [medicalConditions, setMedicalConditions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [conditionInput, setConditionInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [mobilityNotes, setMobilityNotes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [days, setDays] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [escalateAfterHours, setEscalateAfterHours] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(4);
    const [scheduledTime, setScheduledTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("10:00");
    function toggleDay(day) {
        setDays((prev)=>prev.includes(day) ? prev.filter((d)=>d !== day) : [
                ...prev,
                day
            ]);
    }
    function addCondition(e) {
        if (e.key === "Enter" && conditionInput.trim()) {
            e.preventDefault();
            setMedicalConditions((prev)=>[
                    ...prev,
                    conditionInput.trim()
                ]);
            setConditionInput("");
        }
    }
    function removeCondition(cond) {
        setMedicalConditions((prev)=>prev.filter((c)=>c !== cond));
    }
    function validateStep() {
        setError("");
        if (step === 0) {
            if (!personal.name || !personal.age || !personal.gender || !personal.phone) {
                setError("Please fill in all required fields.");
                return false;
            }
            const age = Number(personal.age);
            if (age < 30 || age > 120) {
                setError("Age must be between 30 and 120.");
                return false;
            }
            if (!PHONE_REGEX.test(personal.phone)) {
                setError(`Phone number is invalid. It must be ${PHONE_HINT}.`);
                return false;
            }
        }
        if (step === 1 && (!address.areaTahna || !address.city)) {
            setError("Area and city are required.");
            return false;
        }
        if (step === 2) {
            if (!emergencyContact.name || !emergencyContact.phone || !emergencyContact.email || !emergencyContact.relationship) {
                setError("Primary emergency contact is required, including email.");
                return false;
            }
            if (!EMAIL_REGEX.test(emergencyContact.email)) {
                setError("Please enter a valid email for the primary emergency contact.");
                return false;
            }
            if (!PHONE_REGEX.test(emergencyContact.phone)) {
                setError(`Emergency contact phone is invalid. It must be ${PHONE_HINT}.`);
                return false;
            }
            if (secondaryContact.phone && !PHONE_REGEX.test(secondaryContact.phone)) {
                setError(`Secondary contact phone is invalid. It must be ${PHONE_HINT}.`);
                return false;
            }
        }
        return true;
    }
    function next() {
        if (!validateStep()) return;
        setStep((s)=>s + 1);
    }
    function back() {
        setError("");
        setStep((s)=>s - 1);
    }
    async function handleSubmit() {
        if (!validateStep()) return;
        setSubmitting(true);
        setError("");
        try {
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$apiClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post("/api/elders", {
                ...personal,
                age: Number(personal.age),
                address,
                emergencyContact,
                secondaryContact,
                medicalConditions,
                mobilityNotes,
                familyMemberId: session?.user?.id || "demo-family-1",
                familyMemberEmail: session?.user?.email || "",
                visitSchedule: {
                    days,
                    scheduledTime,
                    escalateAfterHours: Number(escalateAfterHours)
                }
            });
            router.push(`/elder/${res.data._id}/profile`);
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally{
            setSubmitting(false);
        }
    }
    const steps = [
        "Personal Info",
        "Address",
        "Emergency Contact",
        "Medical & Schedule"
    ];
    // While NextAuth is resolving the session, or once we know the user isn't
    // signed in and we're about to redirect them, don't flash the form.
    if (status === "loading" || status === "unauthenticated") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "min-h-screen flex items-center justify-center",
            style: {
                background: "linear-gradient(to bottom, #E6F2DD, #C3DCD6)"
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[#2a5a4a] text-sm",
                children: status === "loading" ? "Loading..." : "Redirecting to sign in..."
            }, void 0, false, {
                fileName: "[project]/app/register-elder/page.js",
                lineNumber: 151,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/register-elder/page.js",
            lineNumber: 147,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen flex flex-col items-center px-6 py-12",
        style: {
            background: "linear-gradient(to bottom, #E6F2DD, #C3DCD6)"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3 mb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: "/logo.png",
                        alt: "Shonge Achi Logo",
                        width: 40,
                        height: 40
                    }, void 0, false, {
                        fileName: "[project]/app/register-elder/page.js",
                        lineNumber: 164,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xl font-semibold text-[#2a7a5a]",
                        children: "Shonge Achi"
                    }, void 0, false, {
                        fileName: "[project]/app/register-elder/page.js",
                        lineNumber: 165,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/register-elder/page.js",
                lineNumber: 163,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white/60 border border-[#cfe3c9] rounded-xl px-6 py-3 text-sm text-[#2a5a4a] mb-8 max-w-xl text-center",
                children: "Fill in your elderly relative's details. This helps us assign the right checker and set an appropriate visit schedule."
            }, void 0, false, {
                fileName: "[project]/app/register-elder/page.js",
                lineNumber: 168,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3 mb-8",
                children: steps.map((label, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${i <= step ? "bg-[#2a7a5a] text-white" : "bg-white text-gray-400 border border-gray-300"}`,
                                children: i + 1
                            }, void 0, false, {
                                fileName: "[project]/app/register-elder/page.js",
                                lineNumber: 175,
                                columnNumber: 13
                            }, this),
                            i < steps.length - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `w-10 h-0.5 ${i < step ? "bg-[#2a7a5a]" : "bg-gray-300"}`
                            }, void 0, false, {
                                fileName: "[project]/app/register-elder/page.js",
                                lineNumber: 182,
                                columnNumber: 38
                            }, this)
                        ]
                    }, label, true, {
                        fileName: "[project]/app/register-elder/page.js",
                        lineNumber: 174,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/register-elder/page.js",
                lineNumber: 172,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-2xl shadow-sm p-10 w-full max-w-2xl",
                children: [
                    step === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-2xl font-bold text-[#2a5a4a] mb-2",
                                children: "Personal Information"
                            }, void 0, false, {
                                fileName: "[project]/app/register-elder/page.js",
                                lineNumber: 190,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: labelClass,
                                        children: "Full Name"
                                    }, void 0, false, {
                                        fileName: "[project]/app/register-elder/page.js",
                                        lineNumber: 192,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        className: inputClass,
                                        value: personal.name,
                                        onChange: (e)=>setPersonal({
                                                ...personal,
                                                name: e.target.value
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/app/register-elder/page.js",
                                        lineNumber: 193,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/register-elder/page.js",
                                lineNumber: 191,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: labelClass,
                                                children: "Age"
                                            }, void 0, false, {
                                                fileName: "[project]/app/register-elder/page.js",
                                                lineNumber: 197,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                min: 30,
                                                max: 120,
                                                className: inputClass,
                                                value: personal.age,
                                                onChange: (e)=>setPersonal({
                                                        ...personal,
                                                        age: e.target.value
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/app/register-elder/page.js",
                                                lineNumber: 198,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/register-elder/page.js",
                                        lineNumber: 196,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: labelClass,
                                                children: "Gender"
                                            }, void 0, false, {
                                                fileName: "[project]/app/register-elder/page.js",
                                                lineNumber: 208,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                className: inputClass,
                                                value: personal.gender,
                                                onChange: (e)=>setPersonal({
                                                        ...personal,
                                                        gender: e.target.value
                                                    }),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "",
                                                        children: "Select"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/register-elder/page.js",
                                                        lineNumber: 210,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Male",
                                                        children: "Male"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/register-elder/page.js",
                                                        lineNumber: 211,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Female",
                                                        children: "Female"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/register-elder/page.js",
                                                        lineNumber: 212,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Other",
                                                        children: "Other"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/register-elder/page.js",
                                                        lineNumber: 213,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/register-elder/page.js",
                                                lineNumber: 209,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/register-elder/page.js",
                                        lineNumber: 207,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/register-elder/page.js",
                                lineNumber: 195,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: labelClass,
                                        children: "Phone"
                                    }, void 0, false, {
                                        fileName: "[project]/app/register-elder/page.js",
                                        lineNumber: 218,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        className: inputClass,
                                        placeholder: "017XXXXXXXX",
                                        maxLength: 11,
                                        inputMode: "numeric",
                                        value: personal.phone,
                                        onChange: (e)=>setPersonal({
                                                ...personal,
                                                phone: e.target.value.replace(/\D/g, "").slice(0, 11)
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/app/register-elder/page.js",
                                        lineNumber: 219,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-400 mt-1",
                                        children: PHONE_HINT
                                    }, void 0, false, {
                                        fileName: "[project]/app/register-elder/page.js",
                                        lineNumber: 227,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/register-elder/page.js",
                                lineNumber: 217,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: labelClass,
                                        children: "Short Bio (optional)"
                                    }, void 0, false, {
                                        fileName: "[project]/app/register-elder/page.js",
                                        lineNumber: 230,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        className: inputClass,
                                        rows: 3,
                                        value: personal.bio,
                                        onChange: (e)=>setPersonal({
                                                ...personal,
                                                bio: e.target.value
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/app/register-elder/page.js",
                                        lineNumber: 231,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/register-elder/page.js",
                                lineNumber: 229,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/register-elder/page.js",
                        lineNumber: 189,
                        columnNumber: 11
                    }, this),
                    step === 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-2xl font-bold text-[#2a5a4a] mb-2",
                                children: "Address"
                            }, void 0, false, {
                                fileName: "[project]/app/register-elder/page.js",
                                lineNumber: 238,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: labelClass,
                                                children: "Flat / Floor"
                                            }, void 0, false, {
                                                fileName: "[project]/app/register-elder/page.js",
                                                lineNumber: 241,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                className: inputClass,
                                                value: address.flatFloor,
                                                onChange: (e)=>setAddress({
                                                        ...address,
                                                        flatFloor: e.target.value
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/app/register-elder/page.js",
                                                lineNumber: 242,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/register-elder/page.js",
                                        lineNumber: 240,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: labelClass,
                                                children: "House No."
                                            }, void 0, false, {
                                                fileName: "[project]/app/register-elder/page.js",
                                                lineNumber: 245,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                className: inputClass,
                                                value: address.houseNo,
                                                onChange: (e)=>setAddress({
                                                        ...address,
                                                        houseNo: e.target.value
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/app/register-elder/page.js",
                                                lineNumber: 246,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/register-elder/page.js",
                                        lineNumber: 244,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/register-elder/page.js",
                                lineNumber: 239,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: labelClass,
                                        children: "Road"
                                    }, void 0, false, {
                                        fileName: "[project]/app/register-elder/page.js",
                                        lineNumber: 250,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        className: inputClass,
                                        value: address.road,
                                        onChange: (e)=>setAddress({
                                                ...address,
                                                road: e.target.value
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/app/register-elder/page.js",
                                        lineNumber: 251,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/register-elder/page.js",
                                lineNumber: 249,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: labelClass,
                                                children: "Area / Thana"
                                            }, void 0, false, {
                                                fileName: "[project]/app/register-elder/page.js",
                                                lineNumber: 255,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                className: inputClass,
                                                value: address.areaTahna,
                                                onChange: (e)=>setAddress({
                                                        ...address,
                                                        areaTahna: e.target.value
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/app/register-elder/page.js",
                                                lineNumber: 256,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/register-elder/page.js",
                                        lineNumber: 254,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: labelClass,
                                                children: "City"
                                            }, void 0, false, {
                                                fileName: "[project]/app/register-elder/page.js",
                                                lineNumber: 259,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                className: inputClass,
                                                value: address.city,
                                                onChange: (e)=>setAddress({
                                                        ...address,
                                                        city: e.target.value
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/app/register-elder/page.js",
                                                lineNumber: 260,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/register-elder/page.js",
                                        lineNumber: 258,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/register-elder/page.js",
                                lineNumber: 253,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: labelClass,
                                        children: "Postal Code"
                                    }, void 0, false, {
                                        fileName: "[project]/app/register-elder/page.js",
                                        lineNumber: 264,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        className: inputClass,
                                        value: address.postalCode,
                                        onChange: (e)=>setAddress({
                                                ...address,
                                                postalCode: e.target.value
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/app/register-elder/page.js",
                                        lineNumber: 265,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/register-elder/page.js",
                                lineNumber: 263,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/register-elder/page.js",
                        lineNumber: 237,
                        columnNumber: 11
                    }, this),
                    step === 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xl font-bold text-[#2a5a4a] mb-4",
                                        children: "Primary Emergency Contact*"
                                    }, void 0, false, {
                                        fileName: "[project]/app/register-elder/page.js",
                                        lineNumber: 273,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                placeholder: "Name",
                                                className: inputClass,
                                                value: emergencyContact.name,
                                                onChange: (e)=>setEmergencyContact({
                                                        ...emergencyContact,
                                                        name: e.target.value
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/app/register-elder/page.js",
                                                lineNumber: 275,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "email",
                                                placeholder: "Email",
                                                className: inputClass,
                                                value: emergencyContact.email,
                                                onChange: (e)=>setEmergencyContact({
                                                        ...emergencyContact,
                                                        email: e.target.value
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/app/register-elder/page.js",
                                                lineNumber: 276,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                placeholder: "017XXXXXXXX",
                                                                className: inputClass,
                                                                maxLength: 11,
                                                                inputMode: "numeric",
                                                                value: emergencyContact.phone,
                                                                onChange: (e)=>setEmergencyContact({
                                                                        ...emergencyContact,
                                                                        phone: e.target.value.replace(/\D/g, "").slice(0, 11)
                                                                    })
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/register-elder/page.js",
                                                                lineNumber: 285,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-gray-400 mt-1",
                                                                children: PHONE_HINT
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/register-elder/page.js",
                                                                lineNumber: 293,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/register-elder/page.js",
                                                        lineNumber: 284,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SearchableCombobox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        className: inputClass,
                                                        placeholder: "Relationship",
                                                        options: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$relationshipsList$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
                                                        value: emergencyContact.relationship,
                                                        onChange: (v)=>setEmergencyContact({
                                                                ...emergencyContact,
                                                                relationship: v
                                                            }),
                                                        onSelect: (v)=>setEmergencyContact({
                                                                ...emergencyContact,
                                                                relationship: v
                                                            })
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/register-elder/page.js",
                                                        lineNumber: 295,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/register-elder/page.js",
                                                lineNumber: 283,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/register-elder/page.js",
                                        lineNumber: 274,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/register-elder/page.js",
                                lineNumber: 272,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xl font-bold text-[#2a5a4a] mb-4",
                                        children: "Secondary Contact (optional)"
                                    }, void 0, false, {
                                        fileName: "[project]/app/register-elder/page.js",
                                        lineNumber: 307,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                placeholder: "Name",
                                                className: inputClass,
                                                value: secondaryContact.name,
                                                onChange: (e)=>setSecondaryContact({
                                                        ...secondaryContact,
                                                        name: e.target.value
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/app/register-elder/page.js",
                                                lineNumber: 309,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "email",
                                                placeholder: "Email (optional)",
                                                className: inputClass,
                                                value: secondaryContact.email,
                                                onChange: (e)=>setSecondaryContact({
                                                        ...secondaryContact,
                                                        email: e.target.value
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/app/register-elder/page.js",
                                                lineNumber: 310,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                placeholder: "017XXXXXXXX",
                                                                className: inputClass,
                                                                maxLength: 11,
                                                                inputMode: "numeric",
                                                                value: secondaryContact.phone,
                                                                onChange: (e)=>setSecondaryContact({
                                                                        ...secondaryContact,
                                                                        phone: e.target.value.replace(/\D/g, "").slice(0, 11)
                                                                    })
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/register-elder/page.js",
                                                                lineNumber: 319,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-gray-400 mt-1",
                                                                children: PHONE_HINT
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/register-elder/page.js",
                                                                lineNumber: 327,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/register-elder/page.js",
                                                        lineNumber: 318,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SearchableCombobox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        className: inputClass,
                                                        placeholder: "Relationship",
                                                        options: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$relationshipsList$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
                                                        value: secondaryContact.relationship,
                                                        onChange: (v)=>setSecondaryContact({
                                                                ...secondaryContact,
                                                                relationship: v
                                                            }),
                                                        onSelect: (v)=>setSecondaryContact({
                                                                ...secondaryContact,
                                                                relationship: v
                                                            })
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/register-elder/page.js",
                                                        lineNumber: 329,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/register-elder/page.js",
                                                lineNumber: 317,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/register-elder/page.js",
                                        lineNumber: 308,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/register-elder/page.js",
                                lineNumber: 306,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/register-elder/page.js",
                        lineNumber: 271,
                        columnNumber: 11
                    }, this),
                    step === 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-2xl font-bold text-[#2a5a4a] border-b border-gray-100 pb-3 mb-4",
                                        children: "Medical Condition"
                                    }, void 0, false, {
                                        fileName: "[project]/app/register-elder/page.js",
                                        lineNumber: 346,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap gap-2 mb-3",
                                        children: medicalConditions.map((cond)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "flex items-center gap-2 bg-[#e6f2dd] text-[#2a5a4a] px-3 py-1.5 rounded-full text-sm",
                                                children: [
                                                    cond,
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>removeCondition(cond),
                                                        className: "text-[#2a5a4a]/60 hover:text-[#2a5a4a]",
                                                        children: "×"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/register-elder/page.js",
                                                        lineNumber: 351,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, cond, true, {
                                                fileName: "[project]/app/register-elder/page.js",
                                                lineNumber: 349,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/register-elder/page.js",
                                        lineNumber: 347,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SearchableCombobox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        className: inputClass,
                                        placeholder: "Search for a condition, e.g. 'dia' → Diabetes...",
                                        otherPlaceholder: "Type the condition and press enter...",
                                        options: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$medicalConditionsList$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
                                        value: conditionInput,
                                        onChange: setConditionInput,
                                        onSelect: (opt)=>{
                                            setMedicalConditions((prev)=>prev.includes(opt) ? prev : [
                                                    ...prev,
                                                    opt
                                                ]);
                                            setConditionInput("");
                                        },
                                        onKeyDown: addCondition
                                    }, void 0, false, {
                                        fileName: "[project]/app/register-elder/page.js",
                                        lineNumber: 355,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/register-elder/page.js",
                                lineNumber: 345,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-2xl font-bold text-[#2a5a4a] border-b border-gray-100 pb-3 mb-4",
                                        children: "Mobility Notes"
                                    }, void 0, false, {
                                        fileName: "[project]/app/register-elder/page.js",
                                        lineNumber: 371,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        className: inputClass,
                                        rows: 3,
                                        placeholder: "e.g. Uses a walking stick. Difficulty climbing stairs.",
                                        value: mobilityNotes,
                                        onChange: (e)=>setMobilityNotes(e.target.value)
                                    }, void 0, false, {
                                        fileName: "[project]/app/register-elder/page.js",
                                        lineNumber: 372,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/register-elder/page.js",
                                lineNumber: 370,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-2xl font-bold text-[#2a5a4a] border-b border-gray-100 pb-3 mb-4",
                                        children: "Select which days a checker should visit each week"
                                    }, void 0, false, {
                                        fileName: "[project]/app/register-elder/page.js",
                                        lineNumber: 382,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap gap-2 mb-6",
                                        children: WEEK_DAYS.map((day)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>toggleDay(day),
                                                className: `px-4 py-1.5 rounded-full text-sm font-medium border transition ${days.includes(day) ? "bg-[#2a7a5a] text-white border-[#2a7a5a]" : "bg-white text-gray-600 border-gray-300 hover:border-[#2a7a5a]"}`,
                                                children: day
                                            }, day, false, {
                                                fileName: "[project]/app/register-elder/page.js",
                                                lineNumber: 387,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/register-elder/page.js",
                                        lineNumber: 385,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 text-sm text-gray-600 mb-3",
                                        children: [
                                            "Expected visit time",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "time",
                                                className: "border border-gray-300 rounded-lg px-3 py-1.5",
                                                value: scheduledTime,
                                                onChange: (e)=>setScheduledTime(e.target.value)
                                            }, void 0, false, {
                                                fileName: "[project]/app/register-elder/page.js",
                                                lineNumber: 402,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/register-elder/page.js",
                                        lineNumber: 400,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 text-sm text-gray-600",
                                        children: [
                                            "Escalate if no check-in within",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                min: 1,
                                                className: "w-16 border border-gray-300 rounded-lg px-2 py-1.5 text-center",
                                                value: escalateAfterHours,
                                                onChange: (e)=>setEscalateAfterHours(e.target.value)
                                            }, void 0, false, {
                                                fileName: "[project]/app/register-elder/page.js",
                                                lineNumber: 411,
                                                columnNumber: 17
                                            }, this),
                                            "hours of the expected time"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/register-elder/page.js",
                                        lineNumber: 409,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/register-elder/page.js",
                                lineNumber: 381,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/register-elder/page.js",
                        lineNumber: 344,
                        columnNumber: 11
                    }, this),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-red-500 text-sm mt-4",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/app/register-elder/page.js",
                        lineNumber: 424,
                        columnNumber: 19
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between mt-10",
                        children: [
                            step > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: back,
                                className: "px-6 py-2.5 rounded-full border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition",
                                children: "Back"
                            }, void 0, false, {
                                fileName: "[project]/app/register-elder/page.js",
                                lineNumber: 428,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                fileName: "[project]/app/register-elder/page.js",
                                lineNumber: 432,
                                columnNumber: 13
                            }, this),
                            step < steps.length - 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: next,
                                className: "px-8 py-2.5 rounded-full bg-[#2a7a5a] text-white font-medium hover:bg-[#1f5e44] transition",
                                children: "Next"
                            }, void 0, false, {
                                fileName: "[project]/app/register-elder/page.js",
                                lineNumber: 435,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleSubmit,
                                disabled: submitting,
                                className: "px-8 py-2.5 rounded-full bg-[#2a7a5a] text-white font-medium hover:bg-[#1f5e44] transition disabled:opacity-50",
                                children: submitting ? "Creating..." : "Create Profile"
                            }, void 0, false, {
                                fileName: "[project]/app/register-elder/page.js",
                                lineNumber: 439,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/register-elder/page.js",
                        lineNumber: 426,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/register-elder/page.js",
                lineNumber: 187,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/register-elder/page.js",
        lineNumber: 159,
        columnNumber: 5
    }, this);
}
_s(RegisterElder, "g6YpU68TgvRBxqPdvhuWllZJeg4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSession"]
    ];
});
_c = RegisterElder;
var _c;
__turbopack_context__.k.register(_c, "RegisterElder");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/apiClient.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "api",
    ()=>api
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_URL = ("TURBOPACK compile-time value", "http://localhost:1078") || "http://localhost:1078";
async function request(path, options = {}) {
    const res = await fetch(`${API_URL}${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...options.headers || {}
        },
        ...options
    });
    const json = await res.json().catch(()=>null);
    if (!res.ok) {
        const error = new Error(json?.error || "Request failed");
        // CHANGED: the status code used to be dropped entirely, so callers
        // that need to tell "Premium required" (402) apart from a genuine
        // failure had no way to do it except fragile string-matching on the
        // message. Carrying the real status lets them check err.status
        // directly (see ConcernAssessment.js for the payoff).
        error.status = res.status;
        throw error;
    }
    return json;
}
const api = {
    get: (path)=>request(path),
    post: (path, body)=>request(path, {
            method: "POST",
            body: JSON.stringify(body)
        }),
    put: (path, body)=>request(path, {
            method: "PUT",
            body: JSON.stringify(body)
        }),
    patch: (path, body)=>request(path, {
            method: "PATCH",
            body: JSON.stringify(body)
        }),
    del: (path)=>request(path, {
            method: "DELETE"
        })
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/medicalConditionsList.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// A curated list of medical conditions commonly relevant to elder wellbeing
// monitoring, used to power the disease search bar on the Register Elder
// form. This is not an exhaustive global disease registry (that would need a
// real medical terminology API like ICD-11 or SNOMED CT) — it's a practical
// set covering the conditions most likely to come up for this use case, and
// anything not on the list can still be entered via "Other".
const MEDICAL_CONDITIONS = [
    "Alzheimer's Disease",
    "Anemia",
    "Angina",
    "Anxiety Disorder",
    "Arthritis",
    "Asthma",
    "Atrial Fibrillation",
    "Benign Prostatic Hyperplasia (BPH)",
    "Bronchitis",
    "Cataracts",
    "Chronic Back Pain",
    "Chronic Fatigue Syndrome",
    "Chronic Kidney Disease",
    "Chronic Obstructive Pulmonary Disease (COPD)",
    "Congestive Heart Failure",
    "Constipation (Chronic)",
    "Coronary Artery Disease",
    "Deep Vein Thrombosis",
    "Dementia",
    "Depression",
    "Diabetes Type 1",
    "Diabetes Type 2",
    "Diabetic Neuropathy",
    "Diabetic Retinopathy",
    "Epilepsy",
    "Fibromyalgia",
    "GERD (Acid Reflux)",
    "Glaucoma",
    "Gout",
    "Hearing Loss",
    "Heart Disease",
    "Hepatitis",
    "Hernia",
    "High Cholesterol",
    "Hypertension",
    "Hyperthyroidism",
    "Hypothyroidism",
    "Insomnia",
    "Kidney Stones",
    "Liver Disease",
    "Lupus",
    "Macular Degeneration",
    "Malnutrition",
    "Migraine",
    "Multiple Sclerosis",
    "Obesity",
    "Osteoarthritis",
    "Osteoporosis",
    "Parkinson's Disease",
    "Peptic Ulcer",
    "Peripheral Neuropathy",
    "Pneumonia",
    "Prostate Enlargement",
    "Rheumatoid Arthritis",
    "Sciatica",
    "Skin Condition - Eczema",
    "Skin Condition - Psoriasis",
    "Sleep Apnea",
    "Stroke (History of)",
    "Tuberculosis",
    "Urinary Incontinence",
    "Varicose Veins",
    "Vertigo"
];
const __TURBOPACK__default__export__ = MEDICAL_CONDITIONS;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/relationshipsList.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// Common relationship-to-elder types, used to power the relationship picker
// on the Register Elder form (emergency + secondary contact). Anything not
// on the list can be entered via "Other".
const RELATIONSHIPS = [
    "Son",
    "Daughter",
    "Spouse",
    "Husband",
    "Wife",
    "Father",
    "Mother",
    "Brother",
    "Sister",
    "Grandson",
    "Granddaughter",
    "Son-in-law",
    "Daughter-in-law",
    "Nephew",
    "Niece",
    "Cousin",
    "Uncle",
    "Aunt",
    "Guardian",
    "Caregiver",
    "Neighbor",
    "Friend",
    "Relative"
];
const __TURBOPACK__default__export__ = RELATIONSHIPS;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_0tjh7ot._.js.map