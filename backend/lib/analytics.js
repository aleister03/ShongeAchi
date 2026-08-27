// Platform-wide analytics for the admin dashboard.
//
// Everything here is a pure function over already-loaded documents, so the arithmetic
// is unit-testable without a database (see scripts/check-analytics.mjs). Nothing is
// persisted: every figure is derived on read from Elder / Visit / Checker /
// AiAssessment / Payment, which already hold all the underlying facts.
//
// Where a number also appears elsewhere in the app it is computed the same way here,
// so the dashboard can't contradict another screen:
//   - checker workload      -> lib/checkers.js serializeChecker()
//   - "same area"           -> lib/checkers.js sameServiceArea() / matchesServiceArea()
//   - the monthly window    -> the monthStart pattern from GET /api/checkers/[id]
//   - concern level         -> AiAssessment.concernLevel, set by lib/concernAi.js

import { sameServiceArea, matchesServiceArea, isAssignable } from "./checkers.js";
import { isPremium } from "./subscription.js";
import { formatAddress } from "./address.js";

// Visit.status values that mean the checker reached the elder. "No Answer" is the
// missed-visit case.
const COMPLETED_STATUSES = ["Fine", "Concerned"];
const MISSED_STATUS = "No Answer";

// Concern levels that warrant admin attention, highest first.
const ESCALATED_LEVELS = ["Critical", "High"];

function rate(part, whole) {
  return whole > 0 ? Math.round((part / whole) * 1000) / 10 : null;
}

// First moment of the current month — same boundary GET /api/checkers/[id] uses for
// its monthly performance figures.
export function monthStart(now = new Date()) {
  const start = new Date(now);
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  return start;
}

// ---------------------------------------------------------------------------
// Elders
// ---------------------------------------------------------------------------

// "Active" means the elder is actually being served: they have a checker assigned.
// Unassigned elders are counted separately because they are the admin's action queue.
export function summarizeElders(elders) {
  const assigned = elders.filter((elder) => elder.checkerId);
  const flagged = elders.filter((elder) => elder.concernStatus === "Concern flagged");

  return {
    total: elders.length,
    active: assigned.length,
    unassigned: elders.length - assigned.length,
    concernFlagged: flagged.length,
    assignedRate: rate(assigned.length, elders.length)
  };
}

// ---------------------------------------------------------------------------
// Visits
// ---------------------------------------------------------------------------

export function summarizeVisits(visits) {
  const completed = visits.filter((visit) => COMPLETED_STATUSES.includes(visit.status));
  const missed = visits.filter((visit) => visit.status === MISSED_STATUS);
  const concerned = visits.filter((visit) => visit.status === "Concerned");

  return {
    total: visits.length,
    completed: completed.length,
    missed: missed.length,
    concerned: concerned.length,
    completionRate: rate(completed.length, visits.length),
    missedRate: rate(missed.length, visits.length)
  };
}

// ---------------------------------------------------------------------------
// Checkers: workload and capacity
// ---------------------------------------------------------------------------

// Mirrors the summary block on GET /api/checkers so the dashboard and the checker
// list can never disagree, then adds the platform-level capacity totals the
// dashboard needs.
export function summarizeCheckers(checkers) {
  const active = checkers.filter((checker) => checker.active);
  const atFullCapacity = active.filter((checker) => checker.currentWorkload >= checker.maxWorkload);
  const totalCapacity = active.reduce((sum, checker) => sum + checker.maxWorkload, 0);
  const usedCapacity = active.reduce((sum, checker) => sum + checker.currentWorkload, 0);

  return {
    total: checkers.length,
    activeCheckers: active.length,
    atFullCapacity: atFullCapacity.length,
    pendingVerification: checkers.filter((checker) => checker.verificationStatus === "pending").length,
    averageWorkload: active.length ? Math.round((usedCapacity / active.length) * 10) / 10 : 0,
    averageMaxWorkload: active.length ? Math.round((totalCapacity / active.length) * 10) / 10 : 0,
    totalCapacity,
    usedCapacity,
    availableCapacity: Math.max(totalCapacity - usedCapacity, 0),
    utilizationRate: rate(usedCapacity, totalCapacity)
  };
}

// ---------------------------------------------------------------------------
// Capacity alerts — the reassignment case
// ---------------------------------------------------------------------------

/**
 * Finds checkers at or over their maximum workload and, for each, the assignable
 * colleagues in the same service area who still have free slots.
 *
 * This is the dashboard's headline signal: "this checker is full while a nearby one
 * has room, so move someone." It is a lookup over existing fields, not a scheduling
 * algorithm — the admin still decides, and the existing
 * /api/elders/[id]/recommended-checkers flow still does the ranked matching.
 */
export function findCapacityAlerts(checkers) {
  const assignable = checkers.filter(isAssignable);

  return checkers
    .filter((checker) => checker.active && checker.currentWorkload >= checker.maxWorkload)
    .map((checker) => {
      const alternatives = assignable
        .filter((other) => String(other._id) !== String(checker._id))
        .filter((other) => other.availableCapacity > 0)
        .filter((other) => sameServiceArea(other, checker))
        .sort((a, b) => b.availableCapacity - a.availableCapacity)
        .map((other) => ({
          _id: other._id,
          name: other.name,
          serviceArea: other.serviceArea,
          currentWorkload: other.currentWorkload,
          maxWorkload: other.maxWorkload,
          availableCapacity: other.availableCapacity,
          experienceYears: other.experienceYears
        }));

      return {
        checker: {
          _id: checker._id,
          name: checker.name,
          serviceArea: checker.serviceArea,
          currentWorkload: checker.currentWorkload,
          maxWorkload: checker.maxWorkload,
          overBy: Math.max(checker.currentWorkload - checker.maxWorkload, 0)
        },
        alternatives,
        // Split so the UI can distinguish "reassign now" from "no local cover —
        // needs another checker in this area".
        actionable: alternatives.length > 0
      };
    })
    .sort((a, b) => Number(b.actionable) - Number(a.actionable));
}

/**
 * Unassigned elders paired with assignable checkers whose service area covers the
 * elder's address, using the same matching rule as the recommendation endpoint.
 * `limit` keeps the dashboard payload small — the full workflow lives on
 * /admin/assignments.
 */
export function findUnassignedMatches(elders, checkers, limit = 5) {
  const assignable = checkers.filter((checker) => isAssignable(checker) && checker.availableCapacity > 0);

  return elders
    .filter((elder) => !elder.checkerId)
    .slice(0, limit)
    .map((elder) => {
      const matches = assignable
        .filter((checker) => matchesServiceArea(checker, elder))
        .sort((a, b) => b.availableCapacity - a.availableCapacity);

      return {
        elder: {
          _id: elder._id,
          name: elder.name,
          address: formatAddress(elder.address),
          medicalConditions: elder.medicalConditions ?? []
        },
        // Only ever a count plus the best option: the ranked list is the
        // assignments page's job, not the dashboard's.
        availableInArea: matches.length,
        bestMatch: matches.length
          ? {
              _id: matches[0]._id,
              name: matches[0].name,
              serviceArea: matches[0].serviceArea,
              availableCapacity: matches[0].availableCapacity
            }
          : null
      };
    });
}

// ---------------------------------------------------------------------------
// Critical / high-concern elders
// ---------------------------------------------------------------------------

/**
 * Builds the escalation list from the latest AiAssessment per elder (already computed
 * and stored by the concern-metrics pipeline — nothing is recalculated here).
 *
 * @param latestAssessments one assessment per elder, the most recent
 * @param eldersById        Map of elder id -> elder, for names and checker links
 */
export function summarizeCriticalCases(latestAssessments, eldersById, limit = 8) {
  const escalated = latestAssessments.filter((assessment) =>
    ESCALATED_LEVELS.includes(assessment.concernLevel)
  );

  const byLevel = { Critical: 0, High: 0, Moderate: 0, Low: 0 };
  for (const assessment of latestAssessments) {
    if (assessment.concernLevel in byLevel) byLevel[assessment.concernLevel] += 1;
  }

  const cases = escalated
    .map((assessment) => {
      const elder = eldersById.get(String(assessment.elderId));
      return {
        elderId: assessment.elderId,
        elderName: elder?.name ?? "Unknown elder",
        address: formatAddress(elder?.address),
        checkerId: elder?.checkerId ?? null,
        concernLevel: assessment.concernLevel,
        concernScore: assessment.aiConcernScore,
        trend: assessment.aiTrend,
        assessedAt: assessment.createdAt,
        // Surfaced so an admin isn't shown a rules-based fallback as if a model had
        // reviewed the case.
        source: assessment.source ?? "ai"
      };
    })
    .sort((a, b) => {
      const levelDelta = ESCALATED_LEVELS.indexOf(a.concernLevel) - ESCALATED_LEVELS.indexOf(b.concernLevel);
      return levelDelta !== 0 ? levelDelta : b.concernScore - a.concernScore;
    });

  return {
    critical: byLevel.Critical,
    high: byLevel.High,
    escalated: escalated.length,
    assessedElders: latestAssessments.length,
    byLevel,
    cases: cases.slice(0, limit)
  };
}

// ---------------------------------------------------------------------------
// Money
// ---------------------------------------------------------------------------

/**
 * Checker payouts inside the given window, from the Payment collection.
 *
 * Named for what the data actually is. Payment is `{ checkerId, amount, status,
 * paidAt }` — money paid TO checkers, which is what backs the `earnings` figure on
 * the checker detail page. It is an outgoing payout ledger, so it must not be
 * presented as platform revenue.
 */
export function summarizePayouts(payments) {
  const paid = payments.filter((payment) => payment.status === "paid");
  const pending = payments.filter((payment) => payment.status === "pending");
  const total = (rows) => rows.reduce((sum, payment) => sum + (payment.amount || 0), 0);

  return {
    paidThisMonth: total(paid),
    pendingThisMonth: total(pending),
    paymentCount: paid.length,
    currency: "BDT"
  };
}

/**
 * Premium subscribers and subscription revenue.
 *
 * This was the integration point left open when the dashboard was built, before a
 * subscription model existed. It is now backed by real data:
 *   - premiumSubscribers: elders whose subscription is currently active and unexpired,
 *     counted with the same isPremium() rule the paywall enforces, so the dashboard
 *     can't claim someone is Premium when the API would refuse them.
 *   - monthlyRevenue: subscription payments actually marked `paid` in the window.
 *     Incoming money, and distinct from summarizePayouts() which is money paid OUT
 *     to checkers.
 */
export function subscriptionStats(elders = [], subscriptionPayments = [], now = new Date()) {
  const premiumElders = elders.filter((elder) => isPremium(elder, now));
  const paid = subscriptionPayments.filter((payment) => payment.status === "paid");

  return {
    available: true,
    premiumSubscribers: premiumElders.length,
    freeElders: elders.length - premiumElders.length,
    conversionRate: rate(premiumElders.length, elders.length),
    monthlyRevenue: paid.reduce((sum, payment) => sum + (payment.amount || 0), 0),
    paidSubscriptions: paid.length,
    currency: "BDT"
  };
}

// ---------------------------------------------------------------------------

/** Assembles the dashboard payload from pre-fetched collections. */
export function buildOverview({ elders, visits, checkers, latestAssessments, payments, subscriptionPayments = [], now = new Date() }) {
  const eldersById = new Map(elders.map((elder) => [String(elder._id), elder]));
  const periodStart = monthStart(now);

  return {
    generatedAt: now,
    period: { start: periodStart, end: now, label: "This month" },
    elders: summarizeElders(elders),
    visits: summarizeVisits(visits),
    checkers: summarizeCheckers(checkers),
    concern: summarizeCriticalCases(latestAssessments, eldersById),
    capacityAlerts: findCapacityAlerts(checkers),
    unassignedMatches: findUnassignedMatches(elders, checkers),
    payouts: summarizePayouts(payments),
    subscriptions: subscriptionStats(elders, subscriptionPayments, now)
  };
}
