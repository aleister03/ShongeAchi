import { addressText } from "./address.js";

export function serializeChecker(checker) {
  const value = checker.toObject ? checker.toObject() : checker;
  const currentWorkload = value.assignedElders?.length ?? 0;
  return {
    ...value,
    currentWorkload,
    availableCapacity: Math.max(value.maxWorkload - currentWorkload, 0)
  };
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
