import connectDB from "@/lib/mongodb.js";
import Elder from "@/models/Elder.js";
import User from "@/models/User.js";
import SubscriptionPayment from "@/models/SubscriptionPayment.js";
import { ApiError, assertObjectId, failure, requireFields, success } from "@/lib/api.js";
import { requireAuth, assertElderAccess } from "@/lib/auth.js";
import { normalizeMonths, priceFor } from "@/lib/subscription.js";

function normalizeBilling(input = {}, fallback = {}) {
  const text = (value, fb = "") => String(value ?? fb).trim();

  const name = text(input.name, fallback.name);
  const email = text(input.email, fallback.email);
  // Accept both local (01712345678) and international (+8801712345678) forms, then
  // normalise to the local form the gateway expects. Note the leading 0 is dropped
  // after the country code, so +880 is followed by 1..., not 01...
  const rawPhone = text(input.phone, fallback.phone).replace(/[\s-]/g, "");
  const phone = rawPhone.replace(/^(?:\+?880)/, "0").replace(/^00/, "0");
  const address = text(input.address, fallback.address);
  const city = text(input.city, "Dhaka") || "Dhaka";
  const postcode = text(input.postcode, "1000") || "1000";

  if (name.length < 2) throw new ApiError(400, "A billing name is required");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new ApiError(400, "A valid billing email address is required");
  // Bangladeshi mobile numbers: 11 digits beginning 01, optionally +880-prefixed.
  if (!/^01[3-9]\d{8}$/.test(phone)) {
    throw new ApiError(400, "A valid Bangladeshi mobile number is required (e.g. 01712345678)");
  }
  if (address.length < 4) throw new ApiError(400, "A billing address is required");

  return { name, email, phone, address, city, postcode };
}
import { generateTransactionId, initSession } from "@/lib/sslcommerz";
import { formatAddress } from "@/lib/address";

// POST /api/subscriptions/initiate  { elderId, months }
//
// Opens an SSLCommerz checkout session and returns the hosted payment URL for the
// browser to redirect to. Nothing about the elder's plan changes here — access is
// granted only by the callback, after server-side validation.
export async function POST(request) {
  try {
    // Checkers are excluded: paying is the family's (or an admin's) action.
    const auth = requireAuth(request, ["admin", "family"]);
    await connectDB();

    const body = await request.json();
    requireFields(body, ["elderId"]);
    assertObjectId(body.elderId, "elder id");
    const months = normalizeMonths(body.months);

    const elder = await Elder.findById(body.elderId).lean();
    if (!elder) throw new ApiError(404, "Elder not found");
    // Reuses the existing ownership rule: a family member can only pay for their own
    // elder, and the elder id in the request is never trusted beyond this check.
    assertElderAccess(auth, elder);

    // The amount is computed server-side from configuration. A price sent by the
    // client is ignored entirely.
    const amount = priceFor(months);
    const tranId = generateTransactionId();

    const payer = await User.findById(auth.sub).lean();

    // Prefilled from the account and the elder's record, then overridden by whatever
    // the payer typed on the checkout screen.
    const billing = normalizeBilling(body.billing, {
      name: payer?.name || "Shonge Achi Family",
      email: payer?.email || "",
      phone: elder.phone || "",
      address: formatAddress(elder.address) || "Dhaka"
    });

    // Recorded before contacting the gateway, so a session can never exist without a
    // matching row for the callback to validate against.
    const payment = await SubscriptionPayment.create({
      elderId: elder._id,
      familyMemberId: elder.familyMemberId,
      months,
      amount,
      currency: "BDT",
      tranId,
      status: "initiated"
    });

    let session;
    try {
      session = await initSession({
        tranId,
        amount,
        months,
        elder,
        customer: billing
      });
    } catch (error) {
      // Don't leave an orphaned "initiated" row when the gateway never opened.
      payment.status = "failed";
      payment.failureReason = error.message;
      await payment.save();
      throw error;
    }

    payment.sessionKey = session.sessionKey ?? "";
    await payment.save();

    return success({
      tranId,
      amount,
      months,
      currency: "BDT",
      gatewayPageUrl: session.gatewayPageUrl,
      // Which method families the gateway will present (cards, mobilebanking,
      // internetbanking), straight from its own response.
      methods: session.methods ?? []
    }, 201);
  } catch (error) {
    return failure(error);
  }
}
