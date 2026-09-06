import connectDB from "@/lib/mongodb";
import Elder from "@/models/Elder";
import PaymentRecord from "@/models/PaymentRecord";
import { isPremium, monthlyPriceBDT } from "@/lib/subscription";
import { NextResponse } from "next/server";

// GET /api/subscriptions/overview — admin view of every elder's plan plus
// recent payment activity. Backs /admin/subscriptions.
//
// Admin-only in intent — same caller-supplied trust model as the rest of
// this backend (see /api/platform-config); the actual gate lives at the
// frontend's admin-passcode proxy, not here.
export async function GET() {
  try {
    await connectDB();

    const [elders, payments] = await Promise.all([
      Elder.find().select("name address subscription familyMemberId").sort({ name: 1 }).lean(),
      PaymentRecord.find().sort({ createdAt: -1 }).limit(25)
        .select("elderId paymentId amount currency months method status completedAt createdAt").lean(),
    ]);

    const now = new Date();
    const premium = elders.filter((elder) => isPremium(elder, now));
    // CHANGED: the sandbox gateway's status enum uses "success", not
    // SSLCommerz's "paid".
    const paid = payments.filter((payment) => payment.status === "success");
    const nameById = new Map(elders.map((elder) => [String(elder._id), elder.name]));

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalElders: elders.length,
          premiumSubscribers: premium.length,
          freeElders: elders.length - premium.length,
          monthlyPriceBDT: monthlyPriceBDT(),
          activeMonthlyValue: premium.length * monthlyPriceBDT(),
          collected: paid.reduce((sum, payment) => sum + (payment.amount || 0), 0),
          currency: "BDT",
        },
        elders: elders.map((elder) => ({
          _id: elder._id,
          name: elder.name,
          isPremium: isPremium(elder, now),
          subscription: elder.subscription,
        })),
        recentPayments: payments.map((p) => ({ ...p, elderName: nameById.get(String(p.elderId)) || "Unknown elder" })),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
