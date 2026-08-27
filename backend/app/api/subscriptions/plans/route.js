import { failure, success } from "@/lib/api";
import { requireAuth } from "@/lib/auth.js";
import { PLAN_FEATURES, PREMIUM_COMING_SOON, monthlyPriceBDT, MAX_MONTHS } from "@/lib/subscription.js";
import { isGatewayConfigured, gatewayMode } from "@/lib/sslcommerz.js";

// Plan catalogue, so the UI renders the same price and feature lists the server
// charges against instead of hardcoding them.
export async function GET(request) {
  try {
    requireAuth(request, ["admin", "family", "checker"]);
    return success({
      currency: "BDT",
      monthlyPriceBDT: monthlyPriceBDT(),
      maxMonths: MAX_MONTHS,
      plans: [
        { id: "free", name: "Free", priceBDT: 0, features: PLAN_FEATURES.free },
        { id: "premium", name: "Premium", priceBDT: monthlyPriceBDT(), features: PLAN_FEATURES.premium, comingSoon: PREMIUM_COMING_SOON }
      ],
      // The UI disables the upgrade button rather than sending the family to a
      // gateway that cannot open a session.
      paymentsAvailable: isGatewayConfigured(),
      gatewayMode: gatewayMode()
    });
  } catch (error) {
    return failure(error);
  }
}
