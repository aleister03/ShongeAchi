import connectDB from "@/lib/mongodb.js";

import {
  ApiError,
  failure,
  pick,
  requireFields,
  success,
} from "@/lib/api.js";

import Elder from "@/models/Elder.js";

import { requireAuth } from "@/lib/auth.js";
import { serializeSubscription } from "@/lib/subscription.js";
import { formatAddress } from "@/lib/address.js";
import { sendEmail } from "@/lib/mailer.js";

const ELDER_FIELDS = [
  "name",
  "age",
  "gender",
  "phone",
  "address",
  "bio",
  "medicalConditions",
  "mobilityNotes",
  "emergencyContact",
  "secondaryContact",
  "familyMemberId",
  "visitSchedule",
];

export async function GET(request) {
  try {
    const auth = requireAuth(request, ["admin", "family"]);

    await connectDB();

    const { searchParams } = new URL(request.url);

    const unassigned = searchParams.get("unassigned") === "true";

    if (unassigned) {
      if (auth.role !== "admin") {
        throw new ApiError(403, "Admin only");
      }

      const elders = await Elder.find({
        checkerId: null,
      }).lean();

      return success(
        elders.map((elder) => ({
          ...elder,
          address: formatAddress(elder.address),
        }))
      );
    }

    const familyMemberId =
      auth.role === "admin"
        ? searchParams.get("familyMemberId")
        : auth.familyMemberId;

    if (!familyMemberId && auth.role !== "admin") {
      throw new ApiError(
        400,
        "familyMemberId is required"
      );
    }

    const filter = familyMemberId
      ? { familyMemberId }
      : {};

    const elders = await Elder.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return success(
      elders.map((elder) => ({
        ...elder,
        address: formatAddress(elder.address),
        subscription: serializeSubscription(elder),
      }))
    );
  } catch (error) {
    return failure(error);
  }
}

export async function POST(request) {
  try {
    const auth = requireAuth(request, ["admin", "family"]);

    await connectDB();

    const body = await request.json();

    requireFields(body, [
      "name",
      "age",
      "gender",
      "phone",
      "address",
      "emergencyContact",
    ]);

    const payload = pick(body, ELDER_FIELDS);

    payload.familyMemberId =
      auth.role === "family"
        ? auth.familyMemberId
        : body.familyMemberId;

    if (!payload.familyMemberId) {
      throw new ApiError(
        400,
        "familyMemberId is required"
      );
    }

    const elder = await Elder.create(payload);

    // Best-effort email notification.
    // An email failure should not prevent elder creation.
    if (elder.familyMemberEmail) {
      try {
        await sendEmail({
          to: elder.familyMemberEmail,
          subject: `Shonge Achi: Profile created for ${elder.name}`,
          body:
            `A new elder profile for ${elder.name} has been created on Shonge Achi.\n\n` +
            `You'll receive an alert here whenever a scheduled check-in is missed or a checker ` +
            `flags a concern.\n\n` +
            `— Shonge Achi`,
        });
      } catch (emailError) {
        console.error(
          "[elders] Failed to send registration email:",
          emailError
        );
      }
    }

    return success(elder, 201);
  } catch (error) {
    return failure(error);
  }
}