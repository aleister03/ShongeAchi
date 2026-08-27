// Offline checks for subscription pricing, Premium state and period arithmetic.
// No database, no gateway, no credentials — every function under test is pure.
// Run with: npm run test:subscriptions
import assert from "node:assert/strict";
import {
  MAX_MONTHS,
  PLAN_FEATURES,
  PREMIUM_COMING_SOON,
  assertPremium,
  daysRemaining,
  extendPeriod,
  isPremium,
  monthlyPriceBDT,
  normalizeMonths,
  priceFor,
  serializeSubscription
} from "../lib/subscription.js";
import { generateTransactionId } from "../lib/sslcommerz.js";

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

const DAY = 86400000;
const now = new Date("2026-08-27T12:00:00Z");
const inDays = (n) => new Date(now.getTime() + n * DAY);

const elder = (subscription) => ({ _id: "e1", name: "Nurul", subscription });
const premiumUntil = (date) => elder({ plan: "premium", status: "active", currentPeriodEnd: date, activatedAt: inDays(-30) });

function withPrice(value, fn) {
  const previous = process.env.PREMIUM_PRICE_BDT;
  if (value === undefined) delete process.env.PREMIUM_PRICE_BDT;
  else process.env.PREMIUM_PRICE_BDT = value;
  const warn = console.warn;
  console.warn = () => {};
  try { return fn(); } finally {
    console.warn = warn;
    if (previous === undefined) delete process.env.PREMIUM_PRICE_BDT;
    else process.env.PREMIUM_PRICE_BDT = previous;
  }
}

console.log("\npricing");
check("defaults to 800 BDT when unconfigured", () => {
  assert.equal(withPrice(undefined, monthlyPriceBDT), 800);
});
check("accepts a configured price inside the 800-1000 band", () => {
  assert.equal(withPrice("1000", monthlyPriceBDT), 1000);
  assert.equal(withPrice("950", monthlyPriceBDT), 950);
});
check("rejects a price above the band and falls back to the default", () => {
  assert.equal(withPrice("8000", monthlyPriceBDT), 800, "a typo must not charge 10x");
});
check("rejects a price below the band", () => {
  assert.equal(withPrice("80", monthlyPriceBDT), 800);
});
check("ignores a non-numeric price", () => {
  assert.equal(withPrice("free", monthlyPriceBDT), 800);
});
check("multiplies by the number of months", () => {
  withPrice("800", () => {
    assert.equal(priceFor(1), 800);
    assert.equal(priceFor(3), 2400);
    assert.equal(priceFor(12), 9600);
  });
});

console.log("\nmonths validation");
check("defaults to a single month", () => {
  assert.equal(normalizeMonths(undefined), 1);
  assert.equal(normalizeMonths(null), 1);
});
check("accepts whole months up to the cap", () => {
  assert.equal(normalizeMonths(1), 1);
  assert.equal(normalizeMonths(MAX_MONTHS), MAX_MONTHS);
});
for (const [label, value] of [
  ["zero", 0], ["negative", -3], ["fractional", 1.5],
  ["above the cap", MAX_MONTHS + 1], ["a huge number", 100000], ["a string", "many"]
]) {
  check(`rejects ${label}`, () => {
    assert.throws(() => normalizeMonths(value), (error) => error.status === 400);
  });
}

console.log("\nisPremium");
check("an active subscription in its period is premium", () => {
  assert.equal(isPremium(premiumUntil(inDays(10)), now), true);
});
check("an expired period is not premium, without any job running", () => {
  assert.equal(isPremium(premiumUntil(inDays(-1)), now), false);
});
check("a period ending in a moment is still premium", () => {
  assert.equal(isPremium(premiumUntil(new Date(now.getTime() + 1000)), now), true);
});
check("a cancelled subscription is not premium even inside its period", () => {
  assert.equal(isPremium(elder({ plan: "premium", status: "cancelled", currentPeriodEnd: inDays(10) }), now), false);
});
check("plan premium with no period end is not premium", () => {
  assert.equal(isPremium(elder({ plan: "premium", status: "active", currentPeriodEnd: null }), now), false);
});
check("a free elder is not premium", () => {
  assert.equal(isPremium(elder({ plan: "free", status: "inactive" }), now), false);
});
check("an elder predating the feature (no subscription field) is not premium", () => {
  assert.equal(isPremium({ _id: "old", name: "Legacy" }, now), false);
  assert.equal(isPremium(undefined, now), false);
});

console.log("\ndaysRemaining");
check("counts whole days left", () => {
  assert.equal(daysRemaining(premiumUntil(inDays(10)), now), 10);
});
check("is zero once lapsed", () => {
  assert.equal(daysRemaining(premiumUntil(inDays(-5)), now), 0);
  assert.equal(daysRemaining(elder({ plan: "free" }), now), 0);
});

console.log("\nassertPremium");
const family = { role: "family", familyMemberId: "f1" };
const admin = { role: "admin" };
const checker = { role: "checker", checkerId: "c1" };
check("allows a family member with an active subscription", () => {
  assertPremium(family, premiumUntil(inDays(5)));
});
check("blocks a family member on the free plan with 402", () => {
  assert.throws(
    () => assertPremium(family, elder({ plan: "free" }), "AI concern metrics"),
    (error) => error.status === 402 && /Premium/.test(error.message)
  );
});
check("402 is distinguishable from a 403 ownership failure", () => {
  try { assertPremium(family, elder({ plan: "free" })); } catch (error) {
    assert.notEqual(error.status, 403, "the UI must be able to tell upgrade from forbidden");
    assert.equal(error.status, 402);
  }
});
check("blocks a checker on a free elder", () => {
  assert.throws(() => assertPremium(checker, elder({ plan: "free" })), (error) => error.status === 402);
});
check("admins are exempt so support is not locked out", () => {
  assertPremium(admin, elder({ plan: "free" }));
});
check("blocks once the period lapses", () => {
  assert.throws(() => assertPremium(family, premiumUntil(inDays(-1))), (error) => error.status === 402);
});
check("names the feature in the error so the UI can explain the block", () => {
  try { assertPremium(family, elder({ plan: "free" }), "Concern trends"); } catch (error) {
    assert.match(error.message, /Concern trends/);
  }
});

console.log("\nserializeSubscription");
check("reports an active premium elder", () => {
  const view = serializeSubscription(premiumUntil(inDays(20)), now);
  assert.equal(view.plan, "premium");
  assert.equal(view.isPremium, true);
  assert.equal(view.daysRemaining, 20);
  assert.equal(view.expired, false);
  assert.equal(view.monthlyPriceBDT, monthlyPriceBDT());
});
check("reports a lapsed elder as free but flags it expired, so the UI says renew", () => {
  const view = serializeSubscription(premiumUntil(inDays(-2)), now);
  assert.equal(view.plan, "free");
  assert.equal(view.isPremium, false);
  assert.equal(view.expired, true);
});
check("a never-subscribed elder is free and not expired", () => {
  const view = serializeSubscription(elder({ plan: "free", status: "inactive" }), now);
  assert.equal(view.plan, "free");
  assert.equal(view.expired, false);
  assert.equal(view.currentPeriodEnd, null);
});
check("handles an elder with no subscription field at all", () => {
  const view = serializeSubscription({ _id: "old" }, now);
  assert.equal(view.plan, "free");
  assert.equal(view.isPremium, false);
});

console.log("\nextendPeriod");
check("a first purchase runs from now", () => {
  const { periodStart, periodEnd } = extendPeriod(elder({ plan: "free" }), 1, now);
  assert.equal(periodStart.getTime(), now.getTime());
  assert.equal(periodEnd.getMonth(), (now.getMonth() + 1) % 12);
});
check("renewing while still active extends from the existing end, not from now", () => {
  const end = inDays(10);
  const { periodStart, periodEnd } = extendPeriod(premiumUntil(end), 1, now);
  assert.equal(periodStart.getTime(), end.getTime(), "paid-for days must not be lost");
  assert.ok(periodEnd.getTime() > end.getTime());
});
check("renewing after lapsing restarts from now", () => {
  const { periodStart } = extendPeriod(premiumUntil(inDays(-30)), 1, now);
  assert.equal(periodStart.getTime(), now.getTime(), "a lapsed elder does not get backdated credit");
});
check("multi-month purchases add the right number of months", () => {
  const { periodEnd } = extendPeriod(elder({ plan: "free" }), 3, new Date("2026-01-15T00:00:00Z"));
  assert.equal(periodEnd.getMonth(), 3, "January + 3 = April");
});
check("does not mutate the elder it is given", () => {
  const target = premiumUntil(inDays(10));
  const before = target.subscription.currentPeriodEnd.getTime();
  extendPeriod(target, 1, now);
  assert.equal(target.subscription.currentPeriodEnd.getTime(), before);
});

console.log("\ntransaction ids");
check("are unique across many generations", () => {
  const ids = new Set(Array.from({ length: 2000 }, generateTransactionId));
  assert.equal(ids.size, 2000);
});
check("are long enough not to be guessable on a public callback", () => {
  const id = generateTransactionId();
  assert.ok(id.length >= 24, `expected a long id, got ${id.length} chars`);
  assert.match(id, /^SA-/);
});

console.log("\nplan catalogue");
check("free keeps the existing standard features", () => {
  assert.ok(PLAN_FEATURES.free.includes("Visit history & reports"));
  assert.ok(PLAN_FEATURES.free.includes("Scheduled check-ins"));
});
check("premium lists only features that are actually gated today", () => {
  for (const feature of ["AI concern metrics & scoring", "Customized visit frequency", "Concern trends over time"]) {
    assert.ok(PLAN_FEATURES.premium.includes(feature), `missing ${feature}`);
  }
});
check("unbuilt features are listed as coming soon, not as unlocked", () => {
  assert.ok(PREMIUM_COMING_SOON.includes("Direct family-checker messaging"));
  assert.ok(!PLAN_FEATURES.premium.some((f) => /messaging/i.test(f)), "messaging is not built, so it must not be sold as included");
});

console.log(`\n${passed} subscription checks passed${process.exitCode ? " (with failures above)" : ""}\n`);
