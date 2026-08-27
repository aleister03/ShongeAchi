// SSLCommerz payment gateway client, built on the official `sslcommerz-lts` SDK
// (the SSLCommerz-NodeJS integration documented by SSLCommerz).
//
// The SDK wraps the four documented endpoints on the same store credentials:
//   init(...)                          -> /gwprocess/v4/api.php          (open a session)
//   validate({ val_id })               -> /validator/api/validationserverAPI.php
//   transactionQueryByTransactionId    -> /validator/api/merchantTransIDvalidationAPI.php
//   transactionQueryBySessionId        -> same endpoint, keyed by session
//   initiateRefund / refundQuery       -> same endpoint, refund operations
//
// Credentials never leave the server; the browser only ever receives GatewayPageURL.
//
// Environment:
//   SSLCOMMERZ_STORE_ID
//   SSLCOMMERZ_STORE_PASSWORD
//   SSLCOMMERZ_SANDBOX      "true" (default) | "false"
//   BACKEND_URL             where SSLCommerz posts callbacks, e.g. http://localhost:3001
//   FRONTEND_URL            where the payer is redirected afterwards

import SSLCommerzPayment from "sslcommerz-lts";
import { ApiError } from "./api.js";

function config() {
  const storeId = process.env.SSLCOMMERZ_STORE_ID;
  const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;
  // Sandbox unless explicitly disabled, so a missing variable can never
  // accidentally point at the live gateway.
  const sandbox = process.env.SSLCOMMERZ_SANDBOX !== "false";
  return {
    storeId,
    storePassword,
    sandbox,
    backendUrl: (process.env.BACKEND_URL || "http://localhost:3001").replace(/\/$/, ""),
    frontendUrl: (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/$/, "")
  };
}

export function isGatewayConfigured() {
  const { storeId, storePassword } = config();
  return Boolean(storeId && storePassword);
}

export function gatewayMode() {
  return config().sandbox ? "sandbox" : "live";
}

export function frontendUrl() {
  return config().frontendUrl;
}

function client() {
  const { storeId, storePassword, sandbox } = config();
  if (!storeId || !storePassword) {
    throw new ApiError(503, "Payments are not configured. Set SSLCOMMERZ_STORE_ID and SSLCOMMERZ_STORE_PASSWORD.");
  }
  // The SDK's third argument is `live`, the inverse of our sandbox flag.
  return new SSLCommerzPayment(storeId, storePassword, !sandbox);
}

// Unguessable, unique, and recognisable in the SSLCommerz dashboard. Unguessability
// matters because the callback endpoints are necessarily public.
export function generateTransactionId() {
  const random = globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID().replace(/-/g, "").slice(0, 20)
    : Math.random().toString(36).slice(2).padEnd(20, "0").slice(0, 20);
  return `SA-${Date.now().toString(36).toUpperCase()}-${random.toUpperCase()}`;
}

// The SDK is a thin wrapper over these two form-POST endpoints. Calling them
// directly is the fallback when the SDK cannot run — see call() below.
function apiBase() {
  return config().sandbox ? "https://sandbox.sslcommerz.com" : "https://securepay.sslcommerz.com";
}

async function directPost(path, fields) {
  const { storeId, storePassword } = config();
  const body = new URLSearchParams({ store_id: storeId, store_passwd: storePassword });
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined && value !== null) body.append(key, String(value));
  }
  const response = await fetch(`${apiBase()}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString()
  });
  return response.json();
}

// Direct equivalents of the SDK methods, keyed by the operation name used below.
const DIRECT = {
  init: (payload) => directPost("/gwprocess/v4/api.php", payload),
  validate: ({ val_id }) => directPost("/validator/api/validationserverAPI.php", { val_id, format: "json" }),
  transactionQueryByTransactionId: ({ tran_id }) => directPost("/validator/api/merchantTransIDvalidationAPI.php", { tran_id, format: "json" }),
  transactionQueryBySessionId: ({ sessionkey }) => directPost("/validator/api/merchantTransIDvalidationAPI.php", { sessionkey, format: "json" }),
  initiateRefund: (payload) => directPost("/validator/api/merchantTransIDvalidationAPI.php", payload),
  refundQuery: (payload) => directPost("/validator/api/merchantTransIDvalidationAPI.php", payload)
};

// A dependency-resolution problem inside the SDK must not take payments down.
// sslcommerz-lts requires node-fetch@2 but can end up bound to node-fetch@3 (ESM,
// not callable) depending on how the tree is hoisted or bundled, which surfaces as
// "fetch is not a function". When that happens, fall back to calling the same
// documented HTTP endpoints directly with the platform fetch.
function isUnusableSdkError(error) {
  return /is not a function|Cannot read propert|ERR_REQUIRE_ESM|Cannot find module/i.test(String(error?.message ?? ""));
}

async function call(operation, run, directKey, directArgs) {
  try {
    const result = await run(client());
    // The SDK swallows transport errors and returns the Error object instead of
    // throwing, so an Error coming back means the call did not actually succeed.
    if (result instanceof Error) throw result;
    return result;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (directKey && isUnusableSdkError(error)) {
      console.warn(`SSLCommerz SDK unusable (${error.message}); falling back to a direct API call.`);
      try {
        return await DIRECT[directKey](directArgs);
      } catch (fallbackError) {
        throw new ApiError(502, `${operation} failed: ${fallbackError.message}`);
      }
    }
    throw new ApiError(502, `${operation} failed: ${error.message}`);
  }
}

/**
 * Opens a hosted checkout session.
 * @returns {{ gatewayPageUrl: string, sessionKey: string, raw: object }}
 */
export async function initSession({ tranId, amount, months, elder, customer }) {
  const { backendUrl } = config();

  const payload = {
    total_amount: amount,
    currency: "BDT",
    tran_id: tranId,

    // SSLCommerz posts the result to these. They are backend routes so the payment
    // is validated server-side before anything is activated; each then redirects the
    // browser on to the matching frontend page.
    success_url: `${backendUrl}/api/subscriptions/callback/success`,
    fail_url: `${backendUrl}/api/subscriptions/callback/fail`,
    cancel_url: `${backendUrl}/api/subscriptions/callback/cancel`,
    ipn_url: `${backendUrl}/api/subscriptions/callback/ipn`,

    // Digital subscription: nothing ships, so shipping_method is NO and the ship_*
    // block is omitted per the integration guide.
    // Documented as required on the v4 init. 0 = EMI not offered.
    emi_option: 0,

    shipping_method: "NO",
    product_name: `Shonge Achi Premium — ${elder.name} (${months} month${months === 1 ? "" : "s"})`,
    product_category: "Subscription",
    product_profile: "non-physical-goods",

    cus_name: customer.name,
    cus_email: customer.email,
    cus_add1: customer.address,
    cus_add2: customer.address,
    cus_city: customer.city,
    cus_state: customer.city,
    cus_postcode: customer.postcode,
    cus_country: "Bangladesh",
    cus_phone: customer.phone,
    cus_fax: customer.phone,

    // Echoed back on every callback, so a response can be tied to its record.
    value_a: String(elder._id),
    value_b: String(months)
  };

  const response = await call("Payment session", (sslcz) => sslcz.init(payload), "init", payload);

  // `redirectGatewayURL` is the full hosted gateway, which lists every enabled
  // method as tabs — cards, mobile banking (bKash, Nagad, upay, Rocket) and
  // internet banking. `GatewayPageURL` is the EasyCheckOut page, which leads with
  // the card form and is why customers reported not seeing bKash or bank options.
  // Prefer the full gateway and fall back to EasyCheckOut only if it is absent.
  const gatewayPageUrl = response?.redirectGatewayURL || response?.GatewayPageURL;

  if (response?.status !== "SUCCESS" || !gatewayPageUrl) {
    const reason = response?.failedreason || response?.status || "unknown error";
    throw new ApiError(502, `Payment gateway rejected the session: ${reason}`);
  }

  // What the gateway says it will offer, so the checkout screen can name real
  // methods rather than a hardcoded guess.
  const methods = Array.isArray(response.desc)
    ? [...new Set(response.desc.map((entry) => entry?.type).filter(Boolean))]
    : [];

  return {
    gatewayPageUrl,
    easyCheckoutUrl: response.GatewayPageURL || "",
    sessionKey: response.sessionkey,
    methods,
    raw: response
  };
}

// A gateway response is only treated as paid on these two statuses. VALID means
// settled; VALIDATED means an earlier call already validated it (the IPN may have
// arrived first).
function normalizeResult(payload) {
  const status = payload?.status;
  return {
    valid: status === "VALID" || status === "VALIDATED",
    status: status ?? "UNKNOWN",
    amount: Number(payload?.amount ?? payload?.store_amount ?? 0),
    currency: payload?.currency,
    tranId: payload?.tran_id,
    valId: payload?.val_id ?? "",
    sessionKey: payload?.sessionkey ?? "",
    cardType: payload?.card_type ?? "",
    bankTranId: payload?.bank_tran_id ?? "",
    raw: payload
  };
}

/**
 * Confirms a transaction with SSLCommerz using the val_id from a callback.
 *
 * The callback body is never trusted on its own — it lands on a public endpoint and
 * could be forged. Only this server-to-server response, authenticated with the store
 * credentials, decides whether a payment really happened.
 */
export async function validateTransaction(valId) {
  if (!valId) throw new ApiError(400, "val_id is required to validate a payment");
  const response = await call("Payment validation", (sslcz) => sslcz.validate({ val_id: valId }), "validate", { val_id: valId });
  return normalizeResult(response);
}

/**
 * Asks SSLCommerz about a transaction by OUR tran_id, with no val_id needed.
 *
 * This is the recovery path for when no callback ever arrives — the payer closed the
 * tab, or the gateway could not reach ipn_url (which is always the case when
 * BACKEND_URL is localhost). Without it, a payment where money was taken would sit
 * as "initiated" forever.
 */
export async function queryTransaction(tranId) {
  if (!tranId) throw new ApiError(400, "A transaction id is required");
  const response = await call("Transaction query", (sslcz) => sslcz.transactionQueryByTransactionId({ tran_id: tranId }), "transactionQueryByTransactionId", { tran_id: tranId });

  // This endpoint answers with an element list rather than a single object.
  const rows = Array.isArray(response?.element) ? response.element : [];
  const settled = rows.find((row) => row?.status === "VALID" || row?.status === "VALIDATED");
  if (settled) return normalizeResult(settled);

  if (rows.length) return normalizeResult(rows[0]);
  return { ...normalizeResult(response), raw: response };
}

/** Same lookup, keyed by the session key returned when the session was opened. */
export async function queryBySession(sessionKey) {
  if (!sessionKey) throw new ApiError(400, "A session key is required");
  const response = await call("Session query", (sslcz) => sslcz.transactionQueryBySessionId({ sessionkey: sessionKey }), "transactionQueryBySessionId", { sessionkey: sessionKey });
  const rows = Array.isArray(response?.element) ? response.element : [];
  return rows.length ? normalizeResult(rows[0]) : { ...normalizeResult(response), raw: response };
}

/**
 * Refunds a settled payment. `bankTranId` comes from the validation response and is
 * stored on the payment record when it is marked paid.
 */
export async function initiateRefund({ bankTranId, amount, remarks, referenceId }) {
  if (!bankTranId) throw new ApiError(400, "bank_tran_id is required to refund a payment");
  const response = await call("Refund", (sslcz) => sslcz.initiateRefund({
    bank_tran_id: bankTranId,
    refund_amount: amount,
    refund_remarks: remarks || "Subscription refund",
    refe_id: referenceId || ""
  }));

  const status = response?.APIConnect;
  return {
    accepted: response?.status === "success" || response?.status === "processing",
    status: response?.status ?? status ?? "UNKNOWN",
    refundRefId: response?.refund_ref_id ?? "",
    raw: response
  };
}

/** Checks how a previously requested refund is progressing. */
export async function refundStatus(refundRefId) {
  if (!refundRefId) throw new ApiError(400, "A refund reference id is required");
  const response = await call("Refund query", (sslcz) => sslcz.refundQuery({ refund_ref_id: refundRefId }));
  return { status: response?.status ?? "UNKNOWN", raw: response };
}
