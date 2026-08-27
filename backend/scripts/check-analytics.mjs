// Offline checks for the admin analytics aggregations. No database and no API key
// required — every function under test is pure. Run with: npm run test:analytics
import assert from "node:assert/strict";
import { serializeChecker, normalizeChecker, matchesServiceArea, sameServiceArea, isAssignable } from "../lib/checkers.js";
import { formatAddress } from "../lib/address.js";
import {
  buildOverview,
  findCapacityAlerts,
  findUnassignedMatches,
  monthStart,
  subscriptionStats,
  summarizeCheckers,
  summarizeCriticalCases,
  summarizeElders,
  summarizePayouts,
  summarizeVisits
} from "../lib/analytics.js";

let passed = 0;
function check(label, fn) {
  try {
    fn();
    passed += 1;
    console.log(`  ok   ${label}`);
  } catch (error) {
    console.error(`  FAIL ${label}\n       ${error.message}`);
    process.exitCode = 1;
  }
}

const checker = (over = {}) => serializeChecker({
  _id: over._id ?? "c1",
  name: "Checker",
  serviceArea: "Dhanmondi",
  active: true,
  verificationStatus: "verified",
  experienceYears: 3,
  maxWorkload: 5,
  assignedElders: [],
  ...over
});
const slots = (n) => Array.from({ length: n }, (_, i) => `e${i}`);

console.log("\nserializeChecker / area helpers");
check("derives workload and available capacity", () => {
  const c = checker({ assignedElders: slots(3), maxWorkload: 5 });
  assert.equal(c.currentWorkload, 3);
  assert.equal(c.availableCapacity, 2);
});
check("never reports negative available capacity when over-assigned", () => {
  assert.equal(checker({ assignedElders: slots(7), maxWorkload: 5 }).availableCapacity, 0);
});
check("matches a service area against an elder address, both directions", () => {
  assert.equal(matchesServiceArea({ serviceArea: "Dhanmondi" }, { address: "12 Dhanmondi Road 8" }), true);
  assert.equal(matchesServiceArea({ serviceArea: "Mirpur" }, { address: "12 Dhanmondi Road 8" }), false);
});
check("area matching tolerates missing fields", () => {
  assert.equal(matchesServiceArea({}, { address: "x" }), false);
  assert.equal(matchesServiceArea({ serviceArea: "x" }, {}), false);
  assert.equal(matchesServiceArea(null, null), false);
});
check("compares two checkers' areas case- and whitespace-insensitively", () => {
  assert.equal(sameServiceArea({ serviceArea: "Dhanmondi" }, { serviceArea: " dhanmondi " }), true);
  assert.equal(sameServiceArea({ serviceArea: "Dhanmondi" }, { serviceArea: "Mirpur" }), false);
  assert.equal(sameServiceArea({ serviceArea: "" }, { serviceArea: "" }), false);
});
check("only verified, active checkers are assignable", () => {
  assert.equal(isAssignable(checker()), true);
  assert.equal(isAssignable(checker({ active: false })), false);
  assert.equal(isAssignable(checker({ verificationStatus: "pending" })), false);
});

console.log("\nstructured addresses (regression: 500 on /api/analytics/overview)");
// Live databases hold address as an object even though the schema declares String,
// and .lean() passes it through raw. This crashed matchesServiceArea on
// .toLowerCase() and crashed React on render.
const structured = { houseNo: "12", road: "Road 8", areaTahna: "Dhanmondi", city: "Dhaka",
  _id: "x", coordinates: { lat: 1, lng: 2 }, country: "Bangladesh", flatFloor: "Flat 3B", postalCode: "1209" };

check("formats a structured address into one readable line", () => {
  const out = formatAddress(structured);
  assert.equal(typeof out, "string");
  assert.ok(out.includes("Dhanmondi") && out.includes("Dhaka"));
  assert.ok(!out.includes("[object"), "must never stringify as [object Object]");
  // Checked structurally: a naive substring test for "lat" false-positives on "Flat 3B".
  assert.ok(!/\d+\.\d{3,}/.test(out), "raw coordinates must not leak into the display string");
  assert.ok(!out.includes("[object"), "nested objects must not be stringified in");
});
check("always returns a string, never an object React could choke on", () => {
  for (const value of [null, undefined, {}, 12345, "plain string", { city: "Dhaka" }]) {
    assert.equal(typeof formatAddress(value), "string", `failed for ${JSON.stringify(value)}`);
  }
});
check("matchesServiceArea no longer throws on a structured address", () => {
  assert.equal(matchesServiceArea({ serviceArea: "Dhanmondi" }, { address: structured }), true);
  assert.equal(matchesServiceArea({ serviceArea: "Mirpur" }, { address: structured }), false);
});
check("matchesServiceArea survives null, empty and non-string addresses", () => {
  for (const value of [null, undefined, {}, 42]) {
    assert.equal(matchesServiceArea({ serviceArea: "Dhanmondi" }, { address: value }), false);
  }
});
check("string addresses still behave exactly as before", () => {
  assert.equal(matchesServiceArea({ serviceArea: "Dhanmondi" }, { address: "12 Dhanmondi Road 8" }), true);
  assert.equal(matchesServiceArea({ serviceArea: "Mirpur" }, { address: "12 Dhanmondi Road 8" }), false);
});
check("findUnassignedMatches emits a renderable address", () => {
  const matches = findUnassignedMatches(
    [{ _id: "e", name: "E", address: structured, checkerId: null }],
    [checker({ serviceArea: "Dhanmondi", assignedElders: slots(1) })]
  );
  assert.equal(typeof matches[0].elder.address, "string");
  assert.equal(matches[0].availableInArea, 1);
});
check("summarizeCriticalCases emits a renderable address", () => {
  const map = new Map([["e1", { _id: "e1", name: "Critical", address: structured, checkerId: "c" }]]);
  const out = summarizeCriticalCases([{ elderId: "e1", concernLevel: "Critical", aiConcernScore: 90 }], map);
  assert.equal(typeof out.cases[0].address, "string");
});

console.log("\nmerged Checker schema (regression: silent zeros on the admin dashboard)");
// The merge replaced models/Checker.js with a version using different field names.
// The mismatch read as `undefined` rather than throwing, so the dashboard reported
// 0 active checkers and the reassignment feature found nothing, with no error.
const newShape = {
  _id: "n1", name: "Mehedi", serviceArea: "Dhanmondi",
  maxCapacity: 5, status: "Active", verified: true,
  workingHours: { start: "08:00", end: "18:00" }, assignedElders: ["a", "b", "c", "d", "e"]
};
const oldShape = {
  _id: "o1", name: "Legacy", serviceArea: "Dhanmondi",
  maxWorkload: 6, active: true, verificationStatus: "verified", shift: "Morning",
  assignedElders: ["x"]
};

check("maps the new field names onto the old vocabulary", () => {
  const c = normalizeChecker(newShape);
  assert.equal(c.maxWorkload, 5, "maxCapacity -> maxWorkload");
  assert.equal(c.active, true, "status Active -> active true");
  assert.equal(c.verificationStatus, "verified", "verified true -> verificationStatus");
});
check("maps the old field names onto the new vocabulary", () => {
  const c = normalizeChecker(oldShape);
  assert.equal(c.maxCapacity, 6);
  assert.equal(c.status, "Active");
  assert.equal(c.verified, true);
});
check("availableCapacity is a number, never NaN, for the new shape", () => {
  const c = serializeChecker(newShape);
  assert.equal(c.availableCapacity, 0);
  assert.ok(Number.isFinite(c.availableCapacity), "was NaN before the fix");
});
check("a new-shape checker is assignable when Active and verified", () => {
  assert.equal(isAssignable(serializeChecker(newShape)), true, "was false before the fix");
});
check("applicationStatus is honoured when `verified` is absent", () => {
  assert.equal(normalizeChecker({ applicationStatus: "Approved", status: "Active" }).verificationStatus, "verified");
  assert.equal(normalizeChecker({ applicationStatus: "Pending", status: "Active" }).verificationStatus, "pending");
  assert.equal(normalizeChecker({ applicationStatus: "Rejected", status: "Active" }).verificationStatus, "rejected");
});
check("an Inactive checker is not treated as active", () => {
  assert.equal(normalizeChecker({ status: "Inactive", maxCapacity: 5 }).active, false);
  assert.equal(isAssignable(serializeChecker({ status: "Inactive", verified: true, maxCapacity: 5, assignedElders: [] })), false);
});
check("summarizeCheckers counts new-shape checkers (reported 0 before the fix)", () => {
  const s = summarizeCheckers([serializeChecker(newShape), serializeChecker(oldShape)]);
  assert.equal(s.activeCheckers, 2, "both are Active");
  assert.equal(s.atFullCapacity, 1);
  assert.equal(s.totalCapacity, 11, "5 + 6");
  assert.ok(Number.isFinite(s.utilizationRate));
});
check("findCapacityAlerts pairs a full new-shape checker with a nearby colleague", () => {
  const alerts = findCapacityAlerts([serializeChecker(newShape), serializeChecker(oldShape)]);
  assert.equal(alerts.length, 1, "found none before the fix");
  assert.equal(alerts[0].actionable, true);
  assert.equal(alerts[0].alternatives[0].name, "Legacy");
});
check("tolerates a checker missing every capacity field", () => {
  const c = serializeChecker({ _id: "x", name: "Bare", assignedElders: [] });
  assert.equal(c.maxWorkload, 0);
  assert.equal(c.availableCapacity, 0);
  assert.equal(isAssignable(c), false);
});

console.log("\nsummarizeElders");
check("counts active (assigned), unassigned and flagged elders", () => {
  const s = summarizeElders([
    { _id: "1", checkerId: "c1", concernStatus: "Fine" },
    { _id: "2", checkerId: "c1", concernStatus: "Concern flagged" },
    { _id: "3", checkerId: null, concernStatus: "Fine" },
    { _id: "4", concernStatus: "Concern flagged" }
  ]);
  assert.equal(s.total, 4);
  assert.equal(s.active, 2);
  assert.equal(s.unassigned, 2);
  assert.equal(s.concernFlagged, 2);
  assert.equal(s.assignedRate, 50);
});
check("handles no elders without dividing by zero", () => {
  const s = summarizeElders([]);
  assert.equal(s.total, 0);
  assert.equal(s.assignedRate, null);
});

console.log("\nsummarizeVisits");
check("separates completed from missed visits", () => {
  const s = summarizeVisits([
    { status: "Fine" }, { status: "Fine" }, { status: "Concerned" },
    { status: "No Answer" }
  ]);
  assert.equal(s.total, 4);
  assert.equal(s.completed, 3, "Fine and Concerned both mean the checker reached the elder");
  assert.equal(s.missed, 1);
  assert.equal(s.concerned, 1);
  assert.equal(s.completionRate, 75);
  assert.equal(s.missedRate, 25);
});
check("handles an empty month", () => {
  const s = summarizeVisits([]);
  assert.equal(s.total, 0);
  assert.equal(s.completionRate, null);
});

console.log("\nsummarizeCheckers");
const fleet = [
  checker({ _id: "a", assignedElders: slots(5), maxWorkload: 5 }),
  checker({ _id: "b", assignedElders: slots(2), maxWorkload: 6 }),
  checker({ _id: "c", assignedElders: slots(0), maxWorkload: 4, verificationStatus: "pending" }),
  checker({ _id: "d", assignedElders: slots(1), maxWorkload: 3, active: false })
];
check("mirrors the GET /api/checkers summary fields", () => {
  const s = summarizeCheckers(fleet);
  assert.equal(s.activeCheckers, 3, "the inactive checker is excluded");
  assert.equal(s.atFullCapacity, 1);
  assert.equal(s.pendingVerification, 1);
});
check("totals capacity across active checkers only", () => {
  const s = summarizeCheckers(fleet);
  assert.equal(s.totalCapacity, 15, "5 + 6 + 4");
  assert.equal(s.usedCapacity, 7, "5 + 2 + 0");
  assert.equal(s.availableCapacity, 8);
  assert.ok(Math.abs(s.utilizationRate - 46.7) < 0.2);
});
check("handles a platform with no checkers", () => {
  const s = summarizeCheckers([]);
  assert.equal(s.availableCapacity, 0);
  assert.equal(s.utilizationRate, null);
  assert.equal(s.averageWorkload, 0);
});

console.log("\nfindCapacityAlerts — the reassignment signal");
check("pairs a full checker with a colleague in the same area who has room", () => {
  const alerts = findCapacityAlerts([
    checker({ _id: "full", name: "Full", serviceArea: "Dhanmondi", assignedElders: slots(5), maxWorkload: 5 }),
    checker({ _id: "free", name: "Free", serviceArea: "Dhanmondi", assignedElders: slots(1), maxWorkload: 6 })
  ]);
  assert.equal(alerts.length, 1);
  assert.equal(alerts[0].checker.name, "Full");
  assert.equal(alerts[0].actionable, true);
  assert.equal(alerts[0].alternatives.length, 1);
  assert.equal(alerts[0].alternatives[0].name, "Free");
  assert.equal(alerts[0].alternatives[0].availableCapacity, 5);
});
check("does not suggest a checker from a different area", () => {
  const alerts = findCapacityAlerts([
    checker({ _id: "full", serviceArea: "Dhanmondi", assignedElders: slots(5), maxWorkload: 5 }),
    checker({ _id: "far", serviceArea: "Mirpur", assignedElders: slots(0), maxWorkload: 6 })
  ]);
  assert.equal(alerts[0].actionable, false, "no local cover");
  assert.deepEqual(alerts[0].alternatives, []);
});
check("does not suggest an unverified or inactive colleague", () => {
  const alerts = findCapacityAlerts([
    checker({ _id: "full", assignedElders: slots(5), maxWorkload: 5 }),
    checker({ _id: "pending", assignedElders: slots(0), maxWorkload: 6, verificationStatus: "pending" }),
    checker({ _id: "off", assignedElders: slots(0), maxWorkload: 6, active: false })
  ]);
  assert.equal(alerts[0].alternatives.length, 0);
});
check("does not suggest another full checker", () => {
  const alerts = findCapacityAlerts([
    checker({ _id: "f1", assignedElders: slots(5), maxWorkload: 5 }),
    checker({ _id: "f2", assignedElders: slots(6), maxWorkload: 6 })
  ]);
  assert.equal(alerts.length, 2, "both are over capacity");
  assert.ok(alerts.every((alert) => alert.alternatives.length === 0));
});
check("never suggests the full checker to itself", () => {
  const alerts = findCapacityAlerts([checker({ _id: "solo", assignedElders: slots(5), maxWorkload: 5 })]);
  assert.equal(alerts[0].alternatives.length, 0);
});
check("reports how far over capacity a checker is", () => {
  const alerts = findCapacityAlerts([checker({ _id: "over", assignedElders: slots(8), maxWorkload: 5 })]);
  assert.equal(alerts[0].checker.overBy, 3);
});
check("orders actionable alerts first", () => {
  const alerts = findCapacityAlerts([
    checker({ _id: "stuck", serviceArea: "Mirpur", assignedElders: slots(5), maxWorkload: 5 }),
    checker({ _id: "full", serviceArea: "Dhanmondi", assignedElders: slots(5), maxWorkload: 5 }),
    checker({ _id: "free", serviceArea: "Dhanmondi", assignedElders: slots(1), maxWorkload: 6 })
  ]);
  assert.equal(alerts[0].actionable, true);
  assert.equal(alerts[1].actionable, false);
});
check("ignores checkers who still have room", () => {
  assert.deepEqual(findCapacityAlerts([checker({ assignedElders: slots(2), maxWorkload: 5 })]), []);
});
check("ignores an inactive checker even if over capacity", () => {
  assert.deepEqual(findCapacityAlerts([checker({ active: false, assignedElders: slots(9), maxWorkload: 5 })]), []);
});
check("handles an empty fleet", () => {
  assert.deepEqual(findCapacityAlerts([]), []);
});

console.log("\nfindUnassignedMatches");
const waiting = [
  { _id: "e1", name: "Nurul", address: "House 4, Dhanmondi", checkerId: null, medicalConditions: ["Diabetes"] },
  { _id: "e2", name: "Amina", address: "Flat 2, Uttara", checkerId: null },
  { _id: "e3", name: "Served", address: "Dhanmondi", checkerId: "c1" }
];
check("only considers elders without a checker", () => {
  const matches = findUnassignedMatches(waiting, [checker({ _id: "free", assignedElders: slots(1) })]);
  assert.equal(matches.length, 2);
  assert.ok(!matches.some((m) => m.elder.name === "Served"));
});
check("finds the best-capacity checker covering the elder's address", () => {
  const matches = findUnassignedMatches(waiting, [
    checker({ _id: "small", name: "Small", serviceArea: "Dhanmondi", assignedElders: slots(4), maxWorkload: 5 }),
    checker({ _id: "big", name: "Big", serviceArea: "Dhanmondi", assignedElders: slots(1), maxWorkload: 6 })
  ]);
  const nurul = matches.find((m) => m.elder.name === "Nurul");
  assert.equal(nurul.availableInArea, 2);
  assert.equal(nurul.bestMatch.name, "Big", "highest available capacity wins");
});
check("reports no match when nobody covers the area", () => {
  const matches = findUnassignedMatches(waiting, [checker({ serviceArea: "Dhanmondi", assignedElders: slots(1) })]);
  const amina = matches.find((m) => m.elder.name === "Amina");
  assert.equal(amina.availableInArea, 0);
  assert.equal(amina.bestMatch, null);
});
check("excludes full and unverified checkers from matches", () => {
  const matches = findUnassignedMatches(waiting, [
    checker({ serviceArea: "Dhanmondi", assignedElders: slots(5), maxWorkload: 5 }),
    checker({ _id: "p", serviceArea: "Dhanmondi", assignedElders: slots(0), verificationStatus: "pending" })
  ]);
  assert.equal(matches.find((m) => m.elder.name === "Nurul").availableInArea, 0);
});
check("caps the list so the dashboard payload stays small", () => {
  const many = Array.from({ length: 30 }, (_, i) => ({ _id: `x${i}`, name: `E${i}`, address: "Dhanmondi", checkerId: null }));
  assert.equal(findUnassignedMatches(many, [checker()], 5).length, 5);
});

console.log("\nsummarizeCriticalCases");
const elderMap = new Map([
  ["e1", { _id: "e1", name: "Critical Elder", address: "A", checkerId: "c1" }],
  ["e2", { _id: "e2", name: "High Elder", address: "B", checkerId: "c2" }],
  ["e3", { _id: "e3", name: "Calm Elder", address: "C", checkerId: "c1" }]
]);
const assessments = [
  { elderId: "e1", concernLevel: "Critical", aiConcernScore: 88, aiTrend: "Declining", source: "ai", createdAt: new Date() },
  { elderId: "e2", concernLevel: "High", aiConcernScore: 61, aiTrend: "Declining", source: "fallback", createdAt: new Date() },
  { elderId: "e3", concernLevel: "Low", aiConcernScore: 10, aiTrend: "Stable", source: "ai", createdAt: new Date() }
];
check("counts escalated levels and tallies the whole distribution", () => {
  const s = summarizeCriticalCases(assessments, elderMap);
  assert.equal(s.critical, 1);
  assert.equal(s.high, 1);
  assert.equal(s.escalated, 2);
  assert.equal(s.assessedElders, 3);
  assert.deepEqual(s.byLevel, { Critical: 1, High: 1, Moderate: 0, Low: 1 });
});
check("lists only escalated elders, Critical before High", () => {
  const s = summarizeCriticalCases(assessments, elderMap);
  assert.equal(s.cases.length, 2);
  assert.equal(s.cases[0].concernLevel, "Critical");
  assert.equal(s.cases[0].elderName, "Critical Elder");
  assert.equal(s.cases[1].concernLevel, "High");
});
check("carries the assessment source so fallbacks aren't shown as model output", () => {
  const s = summarizeCriticalCases(assessments, elderMap);
  assert.equal(s.cases[1].source, "fallback");
});
check("sorts equal levels by score, highest first", () => {
  const s = summarizeCriticalCases([
    { elderId: "e1", concernLevel: "High", aiConcernScore: 55, aiTrend: "Stable" },
    { elderId: "e2", concernLevel: "High", aiConcernScore: 72, aiTrend: "Stable" }
  ], elderMap);
  assert.equal(s.cases[0].concernScore, 72);
});
check("survives an assessment whose elder has been deleted", () => {
  const s = summarizeCriticalCases([{ elderId: "gone", concernLevel: "Critical", aiConcernScore: 90 }], elderMap);
  assert.equal(s.cases[0].elderName, "Unknown elder");
  assert.equal(s.cases[0].checkerId, null);
});
check("handles no assessments at all", () => {
  const s = summarizeCriticalCases([], elderMap);
  assert.equal(s.escalated, 0);
  assert.deepEqual(s.cases, []);
});
check("tolerates a legacy assessment with no concernLevel", () => {
  const s = summarizeCriticalCases([{ elderId: "e1", aiConcernScore: 50 }], elderMap);
  assert.equal(s.escalated, 0);
  assert.equal(s.assessedElders, 1);
});

console.log("\nsummarizePayouts");
check("totals paid and pending separately", () => {
  const s = summarizePayouts([
    { amount: 1000, status: "paid" },
    { amount: 500, status: "paid" },
    { amount: 250, status: "pending" }
  ]);
  assert.equal(s.paidThisMonth, 1500);
  assert.equal(s.pendingThisMonth, 250);
  assert.equal(s.paymentCount, 2);
});
check("handles no payments and missing amounts", () => {
  assert.equal(summarizePayouts([]).paidThisMonth, 0);
  assert.equal(summarizePayouts([{ status: "paid" }]).paidThisMonth, 0);
});

console.log("\nsubscriptionStats");
const premiumElder = (endOffsetDays) => ({
  _id: "p", subscription: {
    plan: "premium", status: "active",
    currentPeriodEnd: new Date(Date.now() + endOffsetDays * 86400000)
  }
});
check("counts only elders whose subscription is currently active", () => {
  const s = subscriptionStats([
    premiumElder(10),
    premiumElder(-1),                       // lapsed
    { _id: "f", subscription: { plan: "free", status: "inactive" } },
    { _id: "legacy" }                       // predates the feature
  ], []);
  assert.equal(s.available, true);
  assert.equal(s.premiumSubscribers, 1, "a lapsed subscription is not a subscriber");
  assert.equal(s.freeElders, 3);
  assert.equal(s.conversionRate, 25);
});
check("sums revenue from paid subscription payments only", () => {
  const s = subscriptionStats([premiumElder(5)], [
    { amount: 800, status: "paid" },
    { amount: 1600, status: "paid" },
    { amount: 800, status: "failed" },
    { amount: 800, status: "initiated" }
  ]);
  assert.equal(s.monthlyRevenue, 2400, "unpaid attempts are not revenue");
  assert.equal(s.paidSubscriptions, 2);
  assert.equal(s.currency, "BDT");
});
check("uses the same premium rule the paywall enforces", () => {
  // An elder the API would refuse must not be counted as a paying subscriber.
  const cancelled = { _id: "c", subscription: { plan: "premium", status: "cancelled", currentPeriodEnd: new Date(Date.now() + 86400000) } };
  assert.equal(subscriptionStats([cancelled], []).premiumSubscribers, 0);
});
check("handles a platform with no elders or payments", () => {
  const s = subscriptionStats([], []);
  assert.equal(s.premiumSubscribers, 0);
  assert.equal(s.monthlyRevenue, 0);
  assert.equal(s.conversionRate, null);
});

console.log("\nmonthStart");
check("returns midnight on the first of the month", () => {
  const start = monthStart(new Date("2026-08-27T15:30:00Z"));
  assert.equal(start.getDate(), 1);
  assert.equal(start.getHours(), 0);
  assert.equal(start.getMinutes(), 0);
  assert.equal(start.getMonth(), new Date("2026-08-27T15:30:00Z").getMonth());
});
check("does not mutate the date it is given", () => {
  const now = new Date("2026-08-27T15:30:00Z");
  monthStart(now);
  assert.equal(now.getDate(), 27);
});

console.log("\nbuildOverview");
check("assembles every section", () => {
  const overview = buildOverview({
    elders: [...elderMap.values()].map((e) => ({ ...e, concernStatus: "Fine" })),
    visits: [{ status: "Fine" }, { status: "No Answer" }],
    checkers: [
      checker({ _id: "full", serviceArea: "Dhanmondi", assignedElders: slots(5), maxWorkload: 5 }),
      checker({ _id: "free", serviceArea: "Dhanmondi", assignedElders: slots(1), maxWorkload: 6 })
    ],
    latestAssessments: assessments,
    payments: [{ amount: 900, status: "paid" }]
  });
  for (const key of ["generatedAt", "period", "elders", "visits", "checkers", "concern", "capacityAlerts", "unassignedMatches", "payouts", "subscriptions"]) {
    assert.ok(key in overview, `missing ${key}`);
  }
  assert.equal(overview.visits.missed, 1);
  assert.equal(overview.concern.escalated, 2);
  assert.equal(overview.capacityAlerts[0].actionable, true);
  assert.equal(overview.payouts.paidThisMonth, 900);
  assert.equal(overview.subscriptions.available, true);
  assert.equal(overview.subscriptions.premiumSubscribers, 0, "no elder in this fixture is subscribed");
});
check("produces a usable payload on a completely empty platform", () => {
  const overview = buildOverview({ elders: [], visits: [], checkers: [], latestAssessments: [], payments: [] });
  assert.equal(overview.elders.total, 0);
  assert.equal(overview.visits.total, 0);
  assert.equal(overview.checkers.availableCapacity, 0);
  assert.deepEqual(overview.capacityAlerts, []);
  assert.deepEqual(overview.unassignedMatches, []);
  assert.equal(overview.concern.escalated, 0);
});

console.log(`\n${passed} analytics checks passed${process.exitCode ? " (with failures above)" : ""}\n`);
