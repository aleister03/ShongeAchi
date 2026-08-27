// Subscription plans and Premium access control.
//
// Premium is priced per elder per month, so the subscription lives on the Elder
// document rather than on User: one family member may have several elders and can
// upgrade them independently. `Elder.familyMemberId` already holds the family user's
// id string, so ownership is established by the existing assertElderAccess() rules
// and no new relationship is introduced.
//
// Nothing about the free tier changes. Everything here either reads existing fields
// or gates access to features that are new to Premium.

import { ApiError } from "./api.js";

export const PLANS = ["free", "premium"];

// Advertised on frontend/app/pricing/page.js. Kept here so the API is the single
// source of truth and the UI can render the same lists without hardcoding them.
export const PLAN_FEATURES = {
  free: [
    "Scheduled check-ins",
    "Visit history & reports",
    "Standard escalation chain",
    "Email & in-app notifications",
    "Emergency contact management"
  ],
  // Live: each of these is a real endpoint that assertPremium() now guards.
  premium: [
    "Everything in Free",
    "AI concern metrics & scoring",
    "Concern trends over time",
    "AI-generated wellbeing summaries",
    "Customized visit frequency"
  ]
};

// Advertised on the pricing page but NOT yet built, so nothing gates them and the
// checkout must not imply they are available today. Exposed separately from
// PLAN_FEATURES so the UI can show them as upcoming rather than unlocked.
export const PREMIUM_COMING_SOON = [
  "Direct family-checker messaging",
  "AI-generated weekly summary digests",
  "Priority escalation response"
];

const DEFAULT_PRICE_BDT = 800;
// The product spec puts Premium between ৳800 and ৳1000 per elder per month. The band
// is enforced so a typo in the environment (8000, or 80) cannot charge a real card
// the wrong amount — it falls back to the default and says so loudly.
const MIN_PRICE_BDT = 800;
const MAX_PRICE_BDT = 1000;

export function monthlyPriceBDT() {
  const configured = Number(process.env.PREMIUM_PRICE_BDT);
  if (!Number.isFinite(configured)) return DEFAULT_PRICE_BDT;
  if (configured < MIN_PRICE_BDT || configured > MAX_PRICE_BDT) {
    console.warn(
      `PREMIUM_PRICE_BDT=${process.env.PREMIUM_PRICE_BDT} is outside the allowed ${MIN_PRICE_BDT}-${MAX_PRICE_BDT} BDT range; using ${DEFAULT_PRICE_BDT}.`
    );
    return DEFAULT_PRICE_BDT;
  }
  return Math.round(configured);
}

export function priceFor(months = 1) {
  return monthlyPriceBDT() * months;
}

// How many months a single checkout may buy. Keeps a tampered request from creating
// a ৳9,600,000 session.
export const MAX_MONTHS = 12;

export function normalizeMonths(value) {
  const months = value === undefined || value === null ? 1 : Number(value);
  if (!Number.isInteger(months) || months < 1 || months > MAX_MONTHS) {
    throw new ApiError(400, `months must be a whole number between 1 and ${MAX_MONTHS}`);
  }
  return months;
}

// ---------------------------------------------------------------------------
// Premium state
// ---------------------------------------------------------------------------

// Derived on read rather than stored as a flag, so an expired subscription stops
// granting access the moment it lapses without needing a scheduled job.
export function isPremium(elder, now = new Date()) {
  const subscription = elder?.subscription;
  if (!subscription || subscription.plan !== "premium") return false;
  if (subscription.status !== "active") return false;
  if (!subscription.currentPeriodEnd) return false;
  return new Date(subscription.currentPeriodEnd).getTime() > now.getTime();
}

export function daysRemaining(elder, now = new Date()) {
  if (!isPremium(elder, now)) return 0;
  const end = new Date(elder.subscription.currentPeriodEnd).getTime();
  return Math.ceil((end - now.getTime()) / 86400000);
}

/**
 * Gate for Premium-only endpoints.
 *
 * Admins are exempt — they operate the platform and already have access to every
 * elder for support purposes, and locking staff out of a paid feature would make
 * support impossible. Family and checker roles are gated.
 *
 * Throws 402 Payment Required rather than 403 so the frontend can tell "you need to
 * upgrade" apart from "this isn't your elder" and show an upgrade prompt instead of
 * an error.
 */
export function assertPremium(auth, elder, feature = "This feature") {
  if (auth?.role === "admin") return;
  if (isPremium(elder)) return;
  throw new ApiError(402, `${feature} is available on the Premium plan. Upgrade this elder to continue.`);
}

// Public shape of an elder's subscription, safe to return to a family member.
export function serializeSubscription(elder, now = new Date()) {
  const subscription = elder?.subscription ?? {};
  const premium = isPremium(elder, now);

  return {
    plan: premium ? "premium" : "free",
    status: subscription.status ?? "inactive",
    isPremium: premium,
    currentPeriodEnd: subscription.currentPeriodEnd ?? null,
    activatedAt: subscription.activatedAt ?? null,
    daysRemaining: daysRemaining(elder, now),
    // True when a subscription was once active but has lapsed — the UI uses this to
    // say "renew" rather than "upgrade".
    expired: subscription.plan === "premium" && !premium && Boolean(subscription.currentPeriodEnd),
    monthlyPriceBDT: monthlyPriceBDT()
  };
}

/**
 * The new period end after paying for `months`.
 *
 * A renewal made while still subscribed extends from the existing end date, so the
 * family never loses days they already paid for. A lapsed one starts from now.
 */
export function extendPeriod(elder, months, now = new Date()) {
  const existingEnd = elder?.subscription?.currentPeriodEnd
    ? new Date(elder.subscription.currentPeriodEnd)
    : null;
  const base = existingEnd && existingEnd.getTime() > now.getTime() ? existingEnd : now;
  const end = new Date(base);
  end.setMonth(end.getMonth() + months);
  return { periodStart: new Date(base), periodEnd: end };
}
