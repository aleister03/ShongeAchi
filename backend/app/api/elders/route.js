import connectDB from "@/lib/mongodb.js";
import { ApiError, failure, pick, requireFields, success } from "@/lib/api.js";
import Elder from "@/models/Elder.js";
import { requireAuth } from "@/lib/auth.js";
import { serializeSubscription } from "@/lib/subscription.js";
import { formatAddress } from "@/lib/address.js";

const ELDER_FIELDS = ["name", "age", "gender", "phone", "address", "bio", "medicalConditions", "mobilityNotes", "emergencyContact", "secondaryContact", "familyMemberId", "visitSchedule"];

export async function GET(request) {
  try {
    const auth = requireAuth(request, ["admin", "family"]);
    await connectDB();
    const { searchParams } = new URL(request.url);
    const unassigned = searchParams.get("unassigned") === "true";

    if (unassigned) {
      if (auth.role !== "admin") throw new ApiError(403, "Admin only");
      const elders = await Elder.find({ checkerId: null }).lean();
      return success(elders.map((elder) => ({ ...elder, address: formatAddress(elder.address) })));
    }

    const familyMemberId = auth.role === "admin"
      ? new URL(request.url).searchParams.get("familyMemberId")
      : auth.familyMemberId;
    // An admin with no familyMemberId filter gets the whole roster — this is what
    // backs /admin/elders. A family member always gets only their own elders.
    if (!familyMemberId && auth.role !== "admin") throw new ApiError(400, "familyMemberId is required");
    const filter = familyMemberId ? { familyMemberId } : {};
    const elders = await Elder.find(filter).lean();
    // Derived, not stored: serializeSubscription() resolves plan + expiry so a lapsed
    // Premium elder shows as free without any scheduled job.
    return success(elders.map((elder) => ({
      ...elder,
      address: formatAddress(elder.address),
      subscription: serializeSubscription(elder)
    })));
  } catch (error) {
    return failure(error);
  }
}

export async function POST(request) {
  try {
    const auth = requireAuth(request, ["admin", "family"]);
    await connectDB();
    const body = await request.json();
    requireFields(body, ["name", "age", "gender", "phone", "address", "emergencyContact"]);
    const payload = pick(body, ELDER_FIELDS);
    payload.familyMemberId = auth.role === "family" ? auth.familyMemberId : body.familyMemberId;
    if (!payload.familyMemberId) throw new ApiError(400, "familyMemberId is required");
    const elder = await Elder.create(payload);
    return success(elder, 201);
  } catch (error) {
    return failure(error);
  }
}
