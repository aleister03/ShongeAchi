import connectDB from "@/lib/mongodb";
import Elder from "@/models/Elder";
import SubscriptionPayment from "@/models/SubscriptionPayment";
import { ApiError, assertObjectId, failure, success } from "@/lib/api";
import { requireAuth, assertElderAccess } from "@/lib/auth";
import { serializeSubscription } from "@/lib/subscription";

// GET /api/subscriptions/status?elderId=...
// Current plan for one elder, plus its recent payment history.
export async function GET(request) {
  try {
    const auth = requireAuth(request, ["admin", "family", "checker"]);
    await connectDB();

    const elderId = new URL(request.url).searchParams.get("elderId");
    if (!elderId) throw new ApiError(400, "elderId is required");
    assertObjectId(elderId, "elder id");

    const elder = await Elder.findById(elderId).lean();
    if (!elder) throw new ApiError(404, "Elder not found");
    assertElderAccess(auth, elder);

    const payments = await SubscriptionPayment.find({ elderId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("amount currency months status tranId paidAt periodEnd failureReason createdAt")
      .lean();

    return success({
      elder: { _id: elder._id, name: elder.name },
      subscription: serializeSubscription(elder),
      payments
    });
  } catch (error) {
    return failure(error);
  }
}
