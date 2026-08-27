import connectDB from "@/lib/mongodb.js";
import { failure, success } from "@/lib/api.js";
import { NextResponse } from "next/server.js";
import { verifyAndActivate, markUnsuccessful } from "@/lib/subscriptionService.js";
import { frontendUrl } from "@/lib/sslcommerz.js";

// POST /api/subscriptions/callback/{success|fail|cancel|ipn}
//
// Where SSLCommerz reports the outcome of a checkout. These are deliberately
// unauthenticated: the request comes from SSLCommerz's servers (or is a browser
// redirect carrying a form POST), so no user session exists.
//
// Being public, nothing here is trusted. The body is used only to look up which of
// OUR records this refers to; whether money actually moved is decided solely by the
// server-to-server validation call in verifyAndActivate(). A forged POST claiming
// success gets as far as a transaction lookup and then fails validation.
//
// The success and fail/cancel paths end in a redirect so the person lands back in the
// app. The IPN path is machine-to-machine and returns JSON.

const OUTCOMES = ["success", "fail", "cancel", "ipn"];

async function readParams(request) {
  // SSLCommerz posts application/x-www-form-urlencoded. Query params are also read so
  // the endpoints can be exercised directly during testing.
  const params = Object.fromEntries(new URL(request.url).searchParams.entries());
  try {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      Object.assign(params, await request.json());
    } else {
      const form = await request.formData();
      for (const [key, value] of form.entries()) params[key] = value;
    }
  } catch {
    // No body, or an unreadable one — the query params alone may still identify the
    // transaction.
  }
  return params;
}

function redirectTo(path, tranId) {
  const url = new URL(`${frontendUrl()}${path}`);
  if (tranId) url.searchParams.set("tran", tranId);
  // 303 so the browser follows SSLCommerz's POST with a GET.
  return NextResponse.redirect(url.toString(), 303);
}

export async function POST(request, context) {
  const { outcome } = await context.params;
  if (!OUTCOMES.includes(outcome)) {
    return NextResponse.json({ success: false, error: { message: "Unknown callback" } }, { status: 404 });
  }

  try {
    await connectDB();
    const params = await readParams(request);
    const tranId = params.tran_id;

    if (outcome === "cancel") {
      await markUnsuccessful({ tranId, status: "cancelled", reason: "Cancelled by the payer", raw: params });
      return redirectTo("/family/subscription/cancelled", tranId);
    }

    if (outcome === "fail") {
      await markUnsuccessful({
        tranId,
        status: "failed",
        reason: params.error || params.failedreason || "The payment did not complete",
        raw: params
      });
      return redirectTo("/family/subscription/failed", tranId);
    }

    // success and ipn both mean "SSLCommerz says this was paid" — and both are
    // verified the same way before anything is activated.
    const result = await verifyAndActivate({ tranId, valId: params.val_id });

    if (outcome === "ipn") {
      // Machine endpoint: acknowledge with the outcome, no redirect.
      return success({ outcome: result.outcome, tranId: tranId ?? null, reason: result.reason ?? null });
    }

    if (result.outcome === "activated" || result.outcome === "already-active") {
      return redirectTo("/family/subscription/success", tranId);
    }
    // Claimed success but validation disagreed — treat exactly like a failure.
    return redirectTo("/family/subscription/failed", tranId);
  } catch (error) {
    console.error(`Subscription callback (${outcome}) failed:`, error.message);
    if (outcome === "ipn") return failure(error);
    // Never leave the payer on a raw error page.
    return redirectTo("/family/subscription/failed", null);
  }
}

// SSLCommerz posts, but some configurations issue a GET redirect for success/cancel.
// Handled identically so neither can strand the payer.
export async function GET(request, context) {
  return POST(request, context);
}
