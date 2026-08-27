import connectDB from "@/lib/mongodb.js";
import Elder from "@/models/Elder.js";
import SubscriptionPayment from "@/models/SubscriptionPayment.js";
import { failure, success } from "@/lib/api.js";
import { requireAuth } from "@/lib/auth.js";
import { serializeSubscription, isPremium, monthlyPriceBDT } from "@/lib/subscription.js";
import { formatAddress } from "@/lib/address.js";

// GET /api/subscriptions/overview — admin view of every elder's plan plus recent
// payment activity. Backs /admin/subscriptions.
//
// Derived on read from the same helpers the paywall uses, so this page can never
// claim someone is Premium when the API would refuse them.
export async function GET(request) {
  try {
    requireAuth(request, ["admin"]);
    await connectDB();

    const [elders, payments] = await Promise.all([
      Elder.find().select("name address subscription familyMemberId").sort({ name: 1 }).lean(),
      SubscriptionPayment.find().sort({ createdAt: -1 }).limit(25)
        .select("elderId amount currency months status tranId paidAt failureReason createdAt").lean()
    ]);

    const now = new Date();
    const premium = elders.filter((elder) => isPremium(elder, now));
    const paid = payments.filter((payment) => payment.status === "paid");
    const byId = new Map(elders.map((elder) => [String(elder._id), elder.name]));

    return success({
      summary: {
        totalElders: elders.length,
        premiumSubscribers: premium.length,
        freeElders: elders.length - premium.length,
        monthlyPriceBDT: monthlyPriceBDT(),
        // Recurring value of the currently-active subscriptions.
        activeMonthlyValue: premium.length * monthlyPriceBDT(),
        collected: paid.reduce((sum, payment) => sum + (payment.amount || 0), 0),
        currency: "BDT"
      },
      elders: elders.map((elder) => ({
        _id: elder._id,
        name: elder.name,
        address: formatAddress(elder.address),
        subscription: serializeSubscription(elder, now)
      })),
      payments: payments.map((payment) => ({ ...payment, elderName: byId.get(String(payment.elderId)) ?? "Unknown elder" }))
    });
  } catch (error) {
    return failure(error);
  }
}
