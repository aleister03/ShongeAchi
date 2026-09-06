import { PLAN_FEATURES, monthlyPriceBDT, MAX_MONTHS } from "@/lib/subscription";
import { NextResponse } from "next/server";

// GET /api/subscriptions/plans
// Plan catalogue, so the pricing page and checkout screen render the same
// price and feature lists the server actually charges against, instead of
// hardcoding them in two places. Public — no account needed to see pricing.
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        currency: "BDT",
        monthlyPriceBDT: monthlyPriceBDT(),
        maxMonths: MAX_MONTHS,
        plans: [
          { id: "free", name: "Free", priceBDT: 0, features: PLAN_FEATURES.free },
          { id: "premium", name: "Premium", priceBDT: monthlyPriceBDT(), features: PLAN_FEATURES.premium },
        ],
        // CHANGED: the payment gateway is now a local sandbox simulator
        // (bKash/Nagad/Card) with no external credentials to configure —
        // it's always available, unlike SSLCommerz which could be
        // unconfigured.
        paymentsAvailable: true,
        gatewayMode: "sandbox",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
