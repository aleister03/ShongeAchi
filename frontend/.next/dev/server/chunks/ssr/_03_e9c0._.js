module.exports = [
"[project]/app/checker/elders/[id]/log-visit/page.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LogVisitPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/apiClient.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$AdminUI$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/ui/AdminUI.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ConcernAssessment$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/ConcernAssessment.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$address$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/address.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visitQuestions$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/visitQuestions.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
// Faithful port of the feature branch's log-visit screen: pill-button
// choices, a category-completion stepper, and — after submitting — an
// inline result screen (no redirect) that polls for the AI-generated
// report and updated concern assessment rather than sending the checker
// away before they see either.
//
// CHANGED from an earlier version of this page: every question is
// required regardless of visit status, matching the feature branch
// exactly (no "No Answer" shortcut) — a checker who couldn't reach the
// elder still answers based on whatever they could observe or knew from
// context, rather than skipping the interview outright.
const STORAGE_KEY = "shongeachi_checker_id";
const CATEGORIES = [
    ...new Set(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visitQuestions$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VISIT_QUESTIONS"].map((q)=>q.category))
];
function LogVisitPage() {
    const { id } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [checkerId, setCheckerId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [elder, setElder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("Fine");
    const [answers, setAnswers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [result, setResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) {
            router.replace("/checker");
            return;
        }
        setCheckerId(saved);
    }, [
        router
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!id) return;
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["api"].get(`/api/elders/${id}`).then((res)=>setElder(res.data)).catch(()=>{});
    }, [
        id
    ]);
    function setAnswer(qid, field, value) {
        setAnswers((prev)=>({
                ...prev,
                [qid]: {
                    ...prev[qid],
                    [field]: value
                }
            }));
    }
    function categoryComplete(category) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visitQuestions$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VISIT_QUESTIONS"].filter((q)=>q.category === category).every((q)=>!!answers[q.id]?.answer);
    }
    async function handleSubmit(e) {
        e.preventDefault();
        const responses = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visitQuestions$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VISIT_QUESTIONS"].map((q)=>({
                questionId: q.id,
                answer: answers[q.id]?.answer || "",
                detail: answers[q.id]?.detail || ""
            }));
        if (responses.some((r)=>!r.answer)) {
            setError("Please answer every question.");
            return;
        }
        setError("");
        setLoading(true);
        try {
            const body = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["api"].post(`/api/wellbeing/${id}/visits`, {
                checkerId,
                status,
                responses
            });
            // The visit is saved and the screen appears straight away; the
            // report and assessment arrive shortly after via the poll below.
            setResult(body.data);
        } catch (err) {
            setError(err.message);
        } finally{
            setLoading(false);
        }
    }
    // POST /visits returns as soon as the visit is stored and generates the
    // report (and refreshes the concern assessment) in the background, so
    // the checker isn't left staring at a spinner for the 10-40s two Gemini
    // calls can take. This polls until the report flips out of `pending`.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!result?.pending || !result?.visit?._id) return undefined;
        let cancelled = false;
        let attempts = 0;
        const timer = setInterval(async ()=>{
            attempts += 1;
            // ~2 minutes at 2s, comfortably past the Gemini timeout plus retries.
            if (attempts > 60) {
                clearInterval(timer);
                return;
            }
            try {
                const body = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["api"].get(`/api/wellbeing/${id}/visits/${result.visit._id}/report?checkerId=${checkerId}`);
                if (cancelled) return;
                if (!body.data.pending) {
                    clearInterval(timer);
                    setResult((current)=>({
                            ...current,
                            ...body.data,
                            pending: false
                        }));
                }
            } catch  {
            // Transient failure (server restarting mid-poll); the next tick retries.
            }
        }, 2000);
        return ()=>{
            cancelled = true;
            clearInterval(timer);
        };
    }, [
        result?.pending,
        result?.visit?._id,
        id,
        checkerId
    ]);
    if (!checkerId) return null;
    if (result) {
        const report = result.report;
        const assessment = result.aiAssessment;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "checkerMain",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "eyebrow",
                    children: [
                        "Log Visit",
                        elder ? ` · ${elder.name}` : ""
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                    lineNumber: 126,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$AdminUI$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                            children: "Visit Logged"
                        }, void 0, false, {
                            fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                            lineNumber: 128,
                            columnNumber: 11
                        }, this),
                        result.pending ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "muted",
                            children: "Visit saved. Generating the wellbeing report…"
                        }, void 0, false, {
                            fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                            lineNumber: 130,
                            columnNumber: 13
                        }, this) : report?.generationFailed || !report ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "muted",
                            children: "Report generation failed for this visit — the visit was still saved."
                        }, void 0, false, {
                            fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                            lineNumber: 132,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "resultHero",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "resultScore",
                                    children: [
                                        report.wellbeingScore,
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                            children: " / 100"
                                        }, void 0, false, {
                                            fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                                            lineNumber: 137,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                                    lineNumber: 135,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$AdminUI$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                            tone: report.trendDirection === "Declining" ? "concern" : "",
                                            children: report.trendDirection
                                        }, void 0, false, {
                                            fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                                            lineNumber: 140,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "muted",
                                            children: report.summary
                                        }, void 0, false, {
                                            fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                                            lineNumber: 141,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                                    lineNumber: 139,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                            lineNumber: 134,
                            columnNumber: 13
                        }, this),
                        report?.flags?.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            children: report.flags.map((f)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    className: "muted",
                                    children: f
                                }, f, false, {
                                    fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                                    lineNumber: 148,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                            lineNumber: 146,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/checker",
                            className: "pillButton",
                            children: "Back to Dashboard"
                        }, void 0, false, {
                            fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                            lineNumber: 152,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                    lineNumber: 127,
                    columnNumber: 9
                }, this),
                assessment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$AdminUI$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                            children: "Concern Assessment (updated)"
                        }, void 0, false, {
                            fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                            lineNumber: 157,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ConcernAssessment$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ConcernHeadline"], {
                            assessment: assessment
                        }, void 0, false, {
                            fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                            lineNumber: 158,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "muted",
                            children: assessment.reasoning
                        }, void 0, false, {
                            fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                            lineNumber: 159,
                            columnNumber: 13
                        }, this),
                        assessment.recommendedAction && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "muted",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "Next step:"
                                }, void 0, false, {
                                    fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                                    lineNumber: 162,
                                    columnNumber: 17
                                }, this),
                                " ",
                                assessment.recommendedAction
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                            lineNumber: 161,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                    lineNumber: 156,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
            lineNumber: 125,
            columnNumber: 7
        }, this);
    }
    const answeredCount = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visitQuestions$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VISIT_QUESTIONS"].filter((q)=>!!answers[q.id]?.answer).length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "checkerMain",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "eyebrow",
                children: [
                    "Log Visit",
                    elder ? ` · ${elder.name}` : ""
                ]
            }, void 0, true, {
                fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                lineNumber: 175,
                columnNumber: 7
            }, this),
            elder && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "muted",
                style: {
                    marginBottom: 20
                },
                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$address$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatAddress"])(elder.address)
            }, void 0, false, {
                fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                lineNumber: 176,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$AdminUI$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ErrorMessage"], {
                message: error
            }, void 0, false, {
                fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                lineNumber: 177,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "formStepper",
                children: CATEGORIES.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `formStep ${categoryComplete(category) ? "active" : ""}`,
                        children: category
                    }, category, false, {
                        fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                        lineNumber: 181,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                lineNumber: 179,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$AdminUI$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "fieldGroup",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: "Overall status"
                                }, void 0, false, {
                                    fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                                    lineNumber: 190,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "pillChoices",
                                    children: [
                                        "Fine",
                                        "Concerned",
                                        "No Answer"
                                    ].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: `pillChoice ${status === s ? "selected" : ""}`,
                                            onClick: ()=>setStatus(s),
                                            children: s
                                        }, s, false, {
                                            fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                                            lineNumber: 193,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                                    lineNumber: 191,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                            lineNumber: 189,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                        lineNumber: 188,
                        columnNumber: 9
                    }, this),
                    CATEGORIES.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$AdminUI$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: category
                                }, void 0, false, {
                                    fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                                    lineNumber: 208,
                                    columnNumber: 13
                                }, this),
                                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visitQuestions$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VISIT_QUESTIONS"].filter((q)=>q.category === category).map((q)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "fieldGroup",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: q.prompt
                                            }, void 0, false, {
                                                fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                                                lineNumber: 211,
                                                columnNumber: 17
                                            }, this),
                                            q.type === "choice" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "pillChoices",
                                                children: q.options.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        className: `pillChoice ${answers[q.id]?.answer === opt ? "selected" : ""}`,
                                                        onClick: ()=>setAnswer(q.id, "answer", opt),
                                                        children: opt
                                                    }, opt, false, {
                                                        fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                                                        lineNumber: 215,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                                                lineNumber: 213,
                                                columnNumber: 19
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                value: answers[q.id]?.answer || "",
                                                onChange: (e)=>setAnswer(q.id, "answer", e.target.value)
                                            }, void 0, false, {
                                                fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                                                lineNumber: 226,
                                                columnNumber: 19
                                            }, this),
                                            q.detail && answers[q.id]?.answer === "Yes" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                placeholder: "Briefly describe…",
                                                value: answers[q.id]?.detail || "",
                                                onChange: (e)=>setAnswer(q.id, "detail", e.target.value)
                                            }, void 0, false, {
                                                fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                                                lineNumber: 232,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, q.id, true, {
                                        fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                                        lineNumber: 210,
                                        columnNumber: 15
                                    }, this))
                            ]
                        }, category, true, {
                            fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                            lineNumber: 207,
                            columnNumber: 11
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "submitBar",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            disabled: loading,
                            className: "submitButton",
                            type: "submit",
                            children: loading ? "Submitting…" : `Submit Visit (${answeredCount}/${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visitQuestions$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VISIT_QUESTIONS"].length} answered)`
                        }, void 0, false, {
                            fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                            lineNumber: 244,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                        lineNumber: 243,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
                lineNumber: 187,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/checker/elders/[id]/log-visit/page.js",
        lineNumber: 174,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/components/ConcernAssessment.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ConcernAssessmentView",
    ()=>ConcernAssessmentView,
    "ConcernHeadline",
    ()=>ConcernHeadline,
    "ConcernSignals",
    ()=>ConcernSignals,
    "PremiumUpsell",
    ()=>PremiumUpsell,
    "concernTone",
    ()=>concernTone,
    "default",
    ()=>ConcernAssessmentCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/apiClient.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$AdminUI$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/ui/AdminUI.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
// AI-Powered Concern Metrics — the historical, multi-visit trend assessment
// backed by the AiAssessment model. Distinct from the per-visit reports:
// this judges the elder's trajectory across their whole visit history.
//
// Lives in its own file so the checker's "visit logged" screen can reuse
// the same headline markup instead of duplicating it. This is a faithful
// port of the feature branch's version of this component, adapted only
// where it depended on the JWT/User auth system (auth.role, Bearer
// tokens) — swapped for this backend's caller-supplied familyMemberId /
// checkerId trust model.
const LEVEL_TONES = {
    Low: "",
    Moderate: "concern",
    High: "warn",
    Critical: "danger"
};
function concernTone(level) {
    return LEVEL_TONES[level] ?? "";
}
const FACTOR_LABELS = {
    moodLevel: "mood",
    mobilityLevel: "mobility",
    appetiteLevel: "appetite",
    engagementLevel: "engagement"
};
function plural(count, word) {
    return `${count} ${word}${count === 1 ? "" : "s"}`;
}
function signed(value) {
    return value > 0 ? `+${value}` : `${value}`;
}
function ConcernHeadline({ assessment }) {
    const { concernLevel, aiConcernScore, aiTrend, visitsAnalyzed, reportsAnalyzed } = assessment;
    const level = concernLevel || "Low";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        style: {
            marginTop: 10
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$AdminUI$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                tone: concernTone(level),
                children: [
                    level,
                    " concern"
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/ConcernAssessment.js",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            " ",
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$AdminUI$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                tone: aiTrend === "Declining" ? "concern" : "",
                children: aiTrend
            }, void 0, false, {
                fileName: "[project]/app/components/ConcernAssessment.js",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            " ",
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                children: aiConcernScore
            }, void 0, false, {
                fileName: "[project]/app/components/ConcernAssessment.js",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            " / 100",
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "muted",
                children: [
                    " · ",
                    "from ",
                    plural(visitsAnalyzed, "visit"),
                    reportsAnalyzed ? ` and ${plural(reportsAnalyzed, "report")}` : ""
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/ConcernAssessment.js",
                lineNumber: 51,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/ConcernAssessment.js",
        lineNumber: 47,
        columnNumber: 5
    }, this);
}
// Explains how the assessment was produced. A deterministic fallback is
// labelled as such rather than presented as model output.
function MethodNote({ assessment }) {
    const { source, dataSufficiency, fallbackReason, visitsAnalyzed } = assessment;
    if (dataSufficiency === "limited") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "muted",
            children: [
                "Based on only ",
                plural(visitsAnalyzed, "visit"),
                " — not yet enough history for a trend. Shown for reference; it does not set this elder's concern flag."
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/ConcernAssessment.js",
            lineNumber: 66,
            columnNumber: 7
        }, this);
    }
    if (source === "fallback") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "muted",
            children: [
                "Rules-based assessment",
                fallbackReason ? ` — ${fallbackReason}` : "",
                ". Trends are computed from the visit history directly rather than by the AI model."
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/ConcernAssessment.js",
            lineNumber: 74,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: "muted",
        children: "AI trend analysis across the full visit history."
    }, void 0, false, {
        fileName: "[project]/app/components/ConcernAssessment.js",
        lineNumber: 80,
        columnNumber: 10
    }, this);
}
function SignalRow({ label, value }) {
    if (value === null || value === undefined || value === "") return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "elderItem",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "muted",
                children: label
            }, void 0, false, {
                fileName: "[project]/app/components/ConcernAssessment.js",
                lineNumber: 87,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: value
            }, void 0, false, {
                fileName: "[project]/app/components/ConcernAssessment.js",
                lineNumber: 88,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/ConcernAssessment.js",
        lineNumber: 86,
        columnNumber: 5
    }, this);
}
// Shift rows read e.g. "Worsening · 0% → 100% of visits". A null rate
// means there wasn't a distinct before-and-after window to compare.
function shiftValue(shift) {
    if (!shift || shift.direction === "Unknown" || shift.recentRate === null) return null;
    return `${shift.direction} · ${shift.earlierRate}% → ${shift.recentRate}% of visits`;
}
function ConcernSignals({ signals }) {
    if (!signals || !signals.windowComparison) return null;
    const { windowComparison: window, attendance, adherence, streaks, wellbeingSlope, moodShift, mobilityShift, appetiteShift, engagementShift, followUpsRequested, latestVisit, recentObservations, visitsAnalyzed } = signals;
    const concernShift = window.delta === null ? null : `${window.earlierScore} → ${window.recentScore} (${signed(window.delta)}) · last ${window.recentCount} vs previous ${window.earlierCount}`;
    const wellbeingShift = wellbeingSlope?.delta === null || !wellbeingSlope ? null : `${wellbeingSlope.earlierAverage} → ${wellbeingSlope.recentAverage} (${signed(wellbeingSlope.delta)})`;
    const medication = adherence?.missedDoseVisits || adherence?.partialDoseVisits ? "Missed on " + [
        adherence.missedDoseVisits ? `${adherence.missedDoseVisits}` : null,
        adherence.partialDoseVisits ? `partial on ${adherence.partialDoseVisits}` : null
    ].filter(Boolean).join(", ") + ` of ${plural(visitsAnalyzed, "visit")}` : "Taken as prescribed at every visit";
    // A run of one isn't a run, so only surface a streak from two consecutive visits.
    const streak = streaks?.longestConcernStreak >= 2 ? `${plural(streaks.longestConcernStreak, "consecutive visit")}${streaks.streakIsOngoing ? " (ongoing)" : " (resolved)"}` : null;
    const lastVisit = latestVisit?.present ? [
        attendance?.daysSinceLastVisit === null ? null : attendance.daysSinceLastVisit === 0 ? "today" : `${plural(attendance.daysSinceLastVisit, "day")} ago`,
        latestVisit.status,
        latestVisit.degradedFactors?.length ? `${latestVisit.degradedFactors.map((f)=>FACTOR_LABELS[f] || f).join(", ")} below normal` : null
    ].filter(Boolean).join(" · ") : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                className: "disclosure",
                children: "Signals behind this score"
            }, void 0, false, {
                fileName: "[project]/app/components/ConcernAssessment.js",
                lineNumber: 143,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SignalRow, {
                label: "Concern score, recent vs earlier",
                value: concernShift
            }, void 0, false, {
                fileName: "[project]/app/components/ConcernAssessment.js",
                lineNumber: 145,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SignalRow, {
                label: "Per-visit wellbeing score",
                value: wellbeingShift
            }, void 0, false, {
                fileName: "[project]/app/components/ConcernAssessment.js",
                lineNumber: 146,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SignalRow, {
                label: "Mood",
                value: shiftValue(moodShift)
            }, void 0, false, {
                fileName: "[project]/app/components/ConcernAssessment.js",
                lineNumber: 147,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SignalRow, {
                label: "Mobility",
                value: shiftValue(mobilityShift)
            }, void 0, false, {
                fileName: "[project]/app/components/ConcernAssessment.js",
                lineNumber: 148,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SignalRow, {
                label: "Appetite",
                value: shiftValue(appetiteShift)
            }, void 0, false, {
                fileName: "[project]/app/components/ConcernAssessment.js",
                lineNumber: 149,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SignalRow, {
                label: "Engagement",
                value: shiftValue(engagementShift)
            }, void 0, false, {
                fileName: "[project]/app/components/ConcernAssessment.js",
                lineNumber: 150,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SignalRow, {
                label: "Medication",
                value: medication
            }, void 0, false, {
                fileName: "[project]/app/components/ConcernAssessment.js",
                lineNumber: 151,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SignalRow, {
                label: "Unanswered visits",
                value: attendance ? `${attendance.missedVisits} of ${visitsAnalyzed}${attendance.missedVisitRate ? ` (${attendance.missedVisitRate}%)` : ""}` : null
            }, void 0, false, {
                fileName: "[project]/app/components/ConcernAssessment.js",
                lineNumber: 152,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SignalRow, {
                label: "Concerned run",
                value: streak
            }, void 0, false, {
                fileName: "[project]/app/components/ConcernAssessment.js",
                lineNumber: 156,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SignalRow, {
                label: "Follow-ups requested",
                value: followUpsRequested || null
            }, void 0, false, {
                fileName: "[project]/app/components/ConcernAssessment.js",
                lineNumber: 157,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SignalRow, {
                label: "Last visit",
                value: lastVisit
            }, void 0, false, {
                fileName: "[project]/app/components/ConcernAssessment.js",
                lineNumber: 158,
                columnNumber: 7
            }, this),
            recentObservations?.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "muted",
                        style: {
                            marginTop: 14
                        },
                        children: "Checker observations from recent visits"
                    }, void 0, false, {
                        fileName: "[project]/app/components/ConcernAssessment.js",
                        lineNumber: 162,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        children: recentObservations.map((observation, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: "muted",
                                children: observation
                            }, i, false, {
                                fileName: "[project]/app/components/ConcernAssessment.js",
                                lineNumber: 165,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/components/ConcernAssessment.js",
                        lineNumber: 163,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/ConcernAssessment.js",
                lineNumber: 161,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/ConcernAssessment.js",
        lineNumber: 142,
        columnNumber: 5
    }, this);
}
function ConcernAssessmentView({ data, error, canRecompute, recomputing, onRecompute }) {
    if (!data) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$AdminUI$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
        children: error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$AdminUI$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ErrorMessage"], {
            message: error
        }, void 0, false, {
            fileName: "[project]/app/components/ConcernAssessment.js",
            lineNumber: 178,
            columnNumber: 36
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            children: "Loading…"
        }, void 0, false, {
            fileName: "[project]/app/components/ConcernAssessment.js",
            lineNumber: 178,
            columnNumber: 71
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/ConcernAssessment.js",
        lineNumber: 178,
        columnNumber: 21
    }, this);
    const { latest, history = [], message } = data;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$AdminUI$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "elderItem",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "Concern Assessment"
                    }, void 0, false, {
                        fileName: "[project]/app/components/ConcernAssessment.js",
                        lineNumber: 185,
                        columnNumber: 9
                    }, this),
                    canRecompute && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "pillButton",
                        onClick: onRecompute,
                        disabled: recomputing,
                        children: recomputing ? "Assessing…" : "Recompute"
                    }, void 0, false, {
                        fileName: "[project]/app/components/ConcernAssessment.js",
                        lineNumber: 187,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/ConcernAssessment.js",
                lineNumber: 184,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$AdminUI$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ErrorMessage"], {
                message: error
            }, void 0, false, {
                fileName: "[project]/app/components/ConcernAssessment.js",
                lineNumber: 192,
                columnNumber: 7
            }, this),
            !latest && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "empty",
                children: message
            }, void 0, false, {
                fileName: "[project]/app/components/ConcernAssessment.js",
                lineNumber: 194,
                columnNumber: 19
            }, this),
            latest && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ConcernHeadline, {
                        assessment: latest
                    }, void 0, false, {
                        fileName: "[project]/app/components/ConcernAssessment.js",
                        lineNumber: 198,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MethodNote, {
                        assessment: latest
                    }, void 0, false, {
                        fileName: "[project]/app/components/ConcernAssessment.js",
                        lineNumber: 199,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: latest.reasoning
                    }, void 0, false, {
                        fileName: "[project]/app/components/ConcernAssessment.js",
                        lineNumber: 201,
                        columnNumber: 11
                    }, this),
                    latest.recommendedAction && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "Next step:"
                            }, void 0, false, {
                                fileName: "[project]/app/components/ConcernAssessment.js",
                                lineNumber: 204,
                                columnNumber: 16
                            }, this),
                            " ",
                            latest.recommendedAction
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/ConcernAssessment.js",
                        lineNumber: 204,
                        columnNumber: 13
                    }, this),
                    latest.flaggedPatterns?.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        children: latest.flaggedPatterns.map((pattern, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: "muted",
                                children: pattern
                            }, i, false, {
                                fileName: "[project]/app/components/ConcernAssessment.js",
                                lineNumber: 209,
                                columnNumber: 59
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/components/ConcernAssessment.js",
                        lineNumber: 208,
                        columnNumber: 13
                    }, this),
                    latest.scoresDiverge && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "muted",
                        children: [
                            "Note: this differs notably from the rules-based score (",
                            latest.deterministicScoreAtRun,
                            "/100) — worth a second look."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/ConcernAssessment.js",
                        lineNumber: 214,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ConcernSignals, {
                        signals: latest.signals
                    }, void 0, false, {
                        fileName: "[project]/app/components/ConcernAssessment.js",
                        lineNumber: 219,
                        columnNumber: 11
                    }, this),
                    history.length >= 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "muted",
                                style: {
                                    marginTop: 14
                                },
                                children: [
                                    "Concern score over the last ",
                                    history.length,
                                    " assessments — higher means more concerning. The dashed line is the rules-based score for comparison."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/ConcernAssessment.js",
                                lineNumber: 223,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$AdminUI$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TrendGraph"], {
                                series: [
                                    {
                                        values: history.map((point)=>point.aiConcernScore)
                                    },
                                    {
                                        values: history.map((point)=>point.deterministicScore),
                                        faint: true
                                    }
                                ]
                            }, void 0, false, {
                                fileName: "[project]/app/components/ConcernAssessment.js",
                                lineNumber: 227,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/ConcernAssessment.js",
                        lineNumber: 222,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/ConcernAssessment.js",
                lineNumber: 197,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/ConcernAssessment.js",
        lineNumber: 183,
        columnNumber: 5
    }, this);
}
function PremiumUpsell({ message, elderId }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$AdminUI$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "elderItem",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "Concern Assessment"
                    }, void 0, false, {
                        fileName: "[project]/app/components/ConcernAssessment.js",
                        lineNumber: 246,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$AdminUI$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                        tone: "concern",
                        children: "Premium"
                    }, void 0, false, {
                        fileName: "[project]/app/components/ConcernAssessment.js",
                        lineNumber: 247,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/ConcernAssessment.js",
                lineNumber: 245,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "muted",
                children: message
            }, void 0, false, {
                fileName: "[project]/app/components/ConcernAssessment.js",
                lineNumber: 249,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                href: `/elder/${elderId}/subscription`,
                className: "pillButton",
                style: {
                    marginTop: 12
                },
                children: "Upgrade this elder"
            }, void 0, false, {
                fileName: "[project]/app/components/ConcernAssessment.js",
                lineNumber: 250,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/ConcernAssessment.js",
        lineNumber: 244,
        columnNumber: 5
    }, this);
}
function ConcernAssessmentCard({ elderId, familyMemberId, checkerId, canRecompute }) {
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    // 402 means the elder is on the Free plan. That isn't a failure, so it
    // gets an upgrade prompt rather than a red error message.
    const [premiumRequired, setPremiumRequired] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [recomputing, setRecomputing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const idParam = familyMemberId ? `familyMemberId=${familyMemberId}` : `checkerId=${checkerId}`;
    const load = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["api"].get(`/api/wellbeing/${elderId}/ai-assessment?${idParam}`).then((body)=>{
            setData(body.data);
            setPremiumRequired("");
        }).catch((err)=>{
            if (err.status === 402) setPremiumRequired(err.message);
            else setError(err.message);
        });
    }, [
        elderId,
        idParam
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        load();
    }, [
        load
    ]);
    const recompute = ()=>{
        setRecomputing(true);
        setError("");
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["api"].post(`/api/wellbeing/${elderId}/ai-assessment`, {
            checkerId
        }).then(load).catch((err)=>setError(err.message)).finally(()=>setRecomputing(false));
    };
    if (premiumRequired) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PremiumUpsell, {
        message: premiumRequired,
        elderId: elderId
    }, void 0, false, {
        fileName: "[project]/app/components/ConcernAssessment.js",
        lineNumber: 292,
        columnNumber: 31
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ConcernAssessmentView, {
        data: data,
        error: error,
        canRecompute: canRecompute,
        recomputing: recomputing,
        onRecompute: recompute
    }, void 0, false, {
        fileName: "[project]/app/components/ConcernAssessment.js",
        lineNumber: 295,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/components/ui/AdminUI.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "CapacityMeter",
    ()=>CapacityMeter,
    "Card",
    ()=>Card,
    "ErrorMessage",
    ()=>ErrorMessage,
    "TrendGraph",
    ()=>TrendGraph
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
function Card({ className = "", children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: `card ${className}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/app/components/ui/AdminUI.js",
        lineNumber: 2,
        columnNumber: 10
    }, this);
}
function Badge({ tone = "", children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `badge ${tone}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/app/components/ui/AdminUI.js",
        lineNumber: 6,
        columnNumber: 10
    }, this);
}
function CapacityMeter({ current, maximum, large = false }) {
    const ratio = maximum ? current / maximum : 0;
    const tone = ratio >= 1 ? "full" : ratio >= 0.75 ? "near" : "";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `meter ${large ? "largeMeter" : ""} ${tone}`,
        "aria-label": `${current} of ${maximum} capacity used`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
            style: {
                width: `${Math.min(ratio * 100, 100)}%`
            }
        }, void 0, false, {
            fileName: "[project]/app/components/ui/AdminUI.js",
            lineNumber: 13,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/ui/AdminUI.js",
        lineNumber: 12,
        columnNumber: 10
    }, this);
}
function ErrorMessage({ message }) {
    return message ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: "error",
        role: "alert",
        children: message
    }, void 0, false, {
        fileName: "[project]/app/components/ui/AdminUI.js",
        lineNumber: 18,
        columnNumber: 20
    }, this) : null;
}
function TrendGraph({ series = [], emptyMessage = "Not enough data yet for a trend." }) {
    const drawable = series.filter((s)=>s.values?.length >= 2);
    if (!drawable.length) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: "empty",
        children: emptyMessage
    }, void 0, false, {
        fileName: "[project]/app/components/ui/AdminUI.js",
        lineNumber: 29,
        columnNumber: 32
    }, this);
    const w = 600, h = 160, pad = 8, max = 100;
    // Pad the vertical range so markers at 0 and 100 aren't clipped by the viewBox.
    const y = (value)=>pad + (1 - Math.min(Math.max(value, 0), max) / max) * (h - pad * 2);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: `0 0 ${w} ${h}`,
        width: "100%",
        height: h,
        role: "img",
        children: drawable.map((s, si)=>{
            const stepX = w / (s.values.length - 1);
            const path = s.values.map((v, i)=>`${i === 0 ? "M" : "L"} ${i * stepX} ${y(v)}`).join(" ");
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                strokeOpacity: s.faint ? 0.3 : 1,
                fillOpacity: s.faint ? 0.3 : 1,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: path,
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        strokeDasharray: s.faint ? "4 4" : undefined
                    }, void 0, false, {
                        fileName: "[project]/app/components/ui/AdminUI.js",
                        lineNumber: 42,
                        columnNumber: 13
                    }, this),
                    !s.faint && s.values.map((v, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: i * stepX,
                            cy: y(v),
                            r: "3"
                        }, i, false, {
                            fileName: "[project]/app/components/ui/AdminUI.js",
                            lineNumber: 44,
                            columnNumber: 49
                        }, this))
                ]
            }, si, true, {
                fileName: "[project]/app/components/ui/AdminUI.js",
                lineNumber: 41,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/app/components/ui/AdminUI.js",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
}),
"[project]/lib/address.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatAddress",
    ()=>formatAddress
]);
// frontend/lib/address.js
// Mirrors backend/lib/address.js — same reasoning as visitQuestions.js
// being duplicated frontend/backend rather than round-tripped through an
// API call for something this small and static.
const PARTS = [
    "flatFloor",
    "houseNo",
    "road",
    "areaTahna",
    "city",
    "postalCode",
    "country"
];
function formatAddress(address) {
    if (!address) return "";
    if (typeof address === "string") return address.trim();
    if (typeof address !== "object") return String(address);
    const seen = new Set();
    const pieces = [];
    for (const key of PARTS){
        const value = address[key];
        if (value === undefined || value === null) continue;
        const text = String(value).trim();
        if (!text || seen.has(text.toLowerCase())) continue;
        seen.add(text.toLowerCase());
        pieces.push(text);
    }
    return pieces.join(", ");
}
}),
"[project]/lib/apiClient.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "api",
    ()=>api
]);
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
}),
"[project]/lib/visitQuestions.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// frontend/lib/visitQuestions.js
// Mirrors backend/lib/visitQuestions.js — kept as a static duplicate the
// same way lib/medicalConditionsList.js and lib/relationshipsList.js
// already are in this project, rather than adding an API round-trip just
// to fetch a static question list.
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
];

//# sourceMappingURL=_03_e9c0._.js.map