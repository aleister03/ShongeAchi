import { addressText } from "./address.js";

// The merge replaced models/Checker.js with a version using different field names.
// Everything downstream (analytics, capacity alerts, recommendations, the admin UI)
// was written against the older names, and because the mismatch reads as `undefined`
// rather than throwing, it failed silently: the dashboard showed 0 active checkers and
// the reassignment feature found nothing.
//
//   maxWorkload        -> maxCapacity
//   active   (Boolean) -> status: "Active" | "Inactive"
//   verificationStatus -> verified (Boolean) / applicationStatus
//   shift              -> workingHours { start, end }
//
// Normalising here — the one place every read path already funnels through — keeps
// both vocabularies working, so neither side's code has to be rewritten. Both the old
// and the new names are present on the result.
export function normalizeChecker(raw) {
  const value = raw?.toObject ? raw.toObject() : { ...raw };

  const maxWorkload = value.maxWorkload ?? value.maxCapacity ?? 0;
  const active = value.active ?? (value.status ? value.status === "Active" : undefined) ?? false;
  const verificationStatus = value.verificationStatus
    ?? (value.verified === true ? "verified"
      : value.applicationStatus === "Approved" ? "verified"
      : value.applicationStatus === "Rejected" ? "rejected"
      : "pending");
  const shift = value.shift
    ?? (value.workingHours?.start ? `${value.workingHours.start}–${value.workingHours.end}` : "");

  return {
    ...value,
    // Old vocabulary, for our analytics/assignment code.
    maxWorkload,
    active,
    verificationStatus,
    shift,
    // New vocabulary, for the teammate's UI. Kept in sync both ways.
    maxCapacity: value.maxCapacity ?? maxWorkload,
    status: value.status ?? (active ? "Active" : "Inactive"),
    verified: value.verified ?? verificationStatus === "verified",
    workingHours: value.workingHours ?? { start: "", end: "" }
  };
}

/**
 * The merged Checker model dropped `assignedElders`; assignment is now recorded only
 * as `Elder.checkerId`. Workload therefore has to be counted from the Elder side, so
 * callers that have those counts pass them in. Without a count, any legacy
 * `assignedElders` array is used, then 0 — which is why every workload read as 0 and
 * the capacity/reassignment features went quiet after the merge.
 *
 * @param checker  raw or normalised checker
 * @param workload optional number of elders assigned to this checker
 */
export function serializeChecker(checker, workload) {
  const value = normalizeChecker(checker);
  const currentWorkload = Number.isFinite(workload) ? workload : (value.assignedElders?.length ?? 0);
  return {
    ...value,
    currentWorkload,
    availableCapacity: Math.max(value.maxWorkload - currentWorkload, 0)
  };
}

/**
 * Serialises a list of checkers using elder counts keyed by checker id.
 * `counts` is a Map or plain object of checkerId -> number.
 */
export function serializeCheckersWithWorkload(checkers, counts) {
  const get = (id) => (counts instanceof Map ? counts.get(String(id)) : counts?.[String(id)]) ?? 0;
  return checkers.map((checker) => serializeChecker(checker, get(checker._id)));
}

/** Counts elders per checker: [{ _id, count }] -> Map<string, number>. */
export function workloadMapFromAggregate(rows) {
  return new Map((rows ?? []).filter((row) => row?._id).map((row) => [String(row._id), row.count]));
}

// Whether a checker's service area covers an elder's address. Extracted from
// recommended-checkers' locationScore() so the admin dashboard's reassignment
// suggestions use exactly the same definition of "same area" — otherwise the two
// screens could disagree about which checkers are nearby.
//
// Deliberately unchanged: a case-insensitive substring test in both directions. The
// data has no structured location field (Elder has a free-text `address`, Checker has
// a free-text `serviceArea`), so this is as precise as the model allows.
export function matchesServiceArea(checker, elder) {
  if (!checker?.serviceArea) return false;
  // addressText() copes with both the declared string shape and the structured
  // object real databases hold; calling .toLowerCase() directly threw a 500 on
  // /api/analytics/overview for every elder with a structured address.
  const address = addressText(elder?.address);
  if (!address) return false;
  const area = String(checker.serviceArea).toLowerCase();
  return address.includes(area) || area.includes(address);
}

// Whether two checkers cover the same area — used to find a nearby colleague who can
// take an elder off an over-capacity checker.
export function sameServiceArea(a, b) {
  if (!a?.serviceArea || !b?.serviceArea) return false;
  return a.serviceArea.trim().toLowerCase() === b.serviceArea.trim().toLowerCase();
}

// A checker who can actually be assigned work right now.
export function isAssignable(checker) {
  return Boolean(checker.active) && checker.verificationStatus === "verified";
}
