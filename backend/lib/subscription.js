// backend/lib/subscription.js
//
// Subscription plans and Premium access control.
//
// Premium is priced per elder per month, so the subscription lives on the
// Elder document rather than on the family account: one family member may
// have several elders and can upgrade them independently.
//
// Nothing about the free tier changes. Everything here either reads
// existing fields or gates access to features that are new to Premium.

export const PLANS = ["free", "premium"];

// Advertised on frontend/app/pricing/page.js. Kept here so the API is the
// single source of truth.
export const PLAN_FEATURES = {
  free: [
    "Scheduled check-ins",
    "Visit history & reports",
    "Standard escalation chain",
    "Email & in-app notifications",
    "Emergency contact management",
  ],
  premium: [
    "Everything in Free",
    "AI concern metrics & scoring",
    "Concern trends over time",
    "AI-generated wellbeing summaries",
    "Direct family-checker messaging",
    "Customized visit frequency",
  ],
};

const DEFAULT_PRICE_BDT = 800;
// A typo in the environment (8000, or 80) must not charge a real card the
// wrong amount — it falls back to the default and says so loudly.
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

// How many months a single checkout may buy. Keeps a tampered request from
// creating an absurdly large session.
export const MAX_MONTHS = 12;

export function normalizeMonths(value) {
  const months = value === undefined || value === null ? 1 : Number(value);
  if (!Number.isInteger(months) || months < 1 || months > MAX_MONTHS) {
    const err = new Error(`months must be a whole number between 1 and ${MAX_MONTHS}`);
    err.status = 400;
    throw err;
  }
  return months;
}

// ---------------------------------------------------------------------------
// Premium state
// ---------------------------------------------------------------------------

// Derived on read rather than trusted as a stored flag, so an expired
// subscription stops granting access the moment it lapses without needing
// a scheduled job.
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
 * Gate for Premium-only endpoints. Throws a 402-flagged error rather than
 * 403, so the frontend can tell "you need to upgrade" apart from "this
 * isn't your elder" and show an upgrade prompt instead of a plain error.
 *
 * Admin routes in this backend never call this — admins already have
 * blanket access via the passcode gate and aren't subject to the
 * caller-supplied familyMemberId/checkerId trust model this function is
 * part of.
 */
export function assertPremium(elder, feature = "This feature") {
  if (isPremium(elder)) return;
  const err = new Error(`${feature} is available on the Premium plan. Upgrade this elder to continue.`);
  err.status = 402;
  throw err;
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
    // True when a subscription was once active but has lapsed — the UI
    // uses this to say "renew" rather than "upgrade".
    expired: subscription.plan === "premium" && !premium && Boolean(subscription.currentPeriodEnd),
    monthlyPriceBDT: monthlyPriceBDT(),
  };
}

/**
 * The new period end after paying for `months`. A renewal made while
 * still subscribed extends from the existing end date, so the family
 * never loses days they already paid for. A lapsed one starts from now.
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
