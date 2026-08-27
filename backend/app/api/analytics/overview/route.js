import connectDB from "@/lib/mongodb.js";
import Elder from "@/models/Elder.js";
import Visit from "@/models/Visit.js";
import Checker from "@/models/Checker.js";
import Payment from "@/models/Payment.js";
import SubscriptionPayment from "@/models/SubscriptionPayment.js";
import AiAssessment from "@/models/AiAssessment.js";
import { failure, success } from "@/lib/api.js";
import { requireAuth } from "@/lib/auth.js";
import { serializeCheckersWithWorkload, workloadMapFromAggregate } from "@/lib/checkers.js";
import { buildOverview, monthStart } from "@/lib/analytics.js";

export async function GET(request) {
  try {
    requireAuth(request, ["admin"]);
    await connectDB();

    const now = new Date();
    const since = monthStart(now);

    const [elders, visits, rawCheckers, workloadRows, payments, subscriptionPayments, latestAssessments] = await Promise.all([
      Elder.find().select("name address checkerId concernStatus medicalConditions subscription").lean(),
      Visit.find({ visitDate: { $gte: since } }).select("status visitDate checkerId elderId").lean(),
      Checker.find().lean(),
      // Assignment lives on Elder.checkerId now that Checker.assignedElders is gone,
      // so workload is counted from the Elder side.
      Elder.aggregate([{ $match: { checkerId: { $ne: null } } }, { $group: { _id: "$checkerId", count: { $sum: 1 } } }]),
      Payment.find({ paidAt: { $gte: since } }).select("amount status paidAt").lean(),
      // Incoming subscription revenue for the same window.
      SubscriptionPayment.find({ paidAt: { $gte: since } }).select("amount status paidAt").lean(),
      // One row per elder: their most recent assessment. concernLevel is already
      // stored by lib/concernAi.js, so this reads rather than recomputes it.
      AiAssessment.aggregate([
        { $sort: { elderId: 1, createdAt: -1 } },
        {
          $group: {
            _id: "$elderId",
            elderId: { $first: "$elderId" },
            concernLevel: { $first: "$concernLevel" },
            aiConcernScore: { $first: "$aiConcernScore" },
            aiTrend: { $first: "$aiTrend" },
            source: { $first: "$source" },
            createdAt: { $first: "$createdAt" }
          }
        }
      ])
    ]);

    const checkers = serializeCheckersWithWorkload(rawCheckers, workloadMapFromAggregate(workloadRows));

    return success(buildOverview({ elders, visits, checkers, latestAssessments, payments, subscriptionPayments, now }));
  } catch (error) {
    return failure(error);
  }
}
