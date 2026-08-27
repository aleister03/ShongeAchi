// Checks your SSLCommerz credentials without running the app.
//
//   node --env-file=.env.local scripts/check-gateway.mjs
//
// Opens a throwaway session and reports exactly what the gateway said, so a
// "Store Credential Error Or Store is De-active" can be pinned to the real cause:
// wrong credentials, a de-activated store, or — most often — sandbox credentials
// being sent to the live endpoint (or vice versa).
import SSLCommerzPayment from "sslcommerz-lts";

const clean = (v) => String(v ?? "").trim().replace(/^['"]|['"]$/g, "").trim();

const rawId = process.env.SSLCOMMERZ_STORE_ID;
const rawPw = process.env.SSLCOMMERZ_STORE_PASSWORD;
const storeId = clean(rawId);
const storePassword = clean(rawPw);
const sandbox = process.env.SSLCOMMERZ_SANDBOX !== "false";

console.log("\nConfiguration");
console.log(`  SSLCOMMERZ_STORE_ID        ${storeId ? `${storeId.slice(0, 4)}…(${storeId.length} chars)` : "NOT SET"}`);
console.log(`  SSLCOMMERZ_STORE_PASSWORD  ${storePassword ? `set (${storePassword.length} chars)` : "NOT SET"}`);
console.log(`  SSLCOMMERZ_SANDBOX         ${process.env.SSLCOMMERZ_SANDBOX ?? "(unset)"} -> using ${sandbox ? "SANDBOX" : "LIVE"} gateway`);

if (rawId !== storeId || rawPw !== storePassword) {
  console.log("  ! Credentials had surrounding quotes or whitespace; they are trimmed at runtime.");
  console.log("    Write them unquoted in .env.local, e.g.  SSLCOMMERZ_STORE_ID=testbox");
}

if (!storeId || !storePassword) {
  console.log("\nSet both variables in backend/.env.local, then run this again.\n");
  process.exit(1);
}

if (sandbox && !/^testbox$/i.test(storeId) && !/test/i.test(storeId)) {
  console.log("  note: sandbox mode with a store id that doesn't look like a sandbox store.");
}

const payload = {
  total_amount: 800, currency: "BDT", tran_id: `PRECHECK-${Date.now()}`,
  success_url: "http://localhost:3001/s", fail_url: "http://localhost:3001/f",
  cancel_url: "http://localhost:3001/c", ipn_url: "http://localhost:3001/i",
  emi_option: 0, shipping_method: "NO",
  product_name: "Credential check", product_category: "Subscription", product_profile: "non-physical-goods",
  cus_name: "Check", cus_email: "check@example.com", cus_add1: "Dhaka", cus_city: "Dhaka",
  cus_state: "Dhaka", cus_postcode: "1000", cus_country: "Bangladesh", cus_phone: "01711111111"
};

console.log("\nOpening a test session…");
let response;
try {
  response = await new SSLCommerzPayment(storeId, storePassword, !sandbox).init(payload);
} catch (error) {
  console.log(`  request failed: ${error.message}\n`);
  process.exit(1);
}

if (response instanceof Error) {
  console.log(`  request failed: ${response.message}\n`);
  process.exit(1);
}

if (response?.status === "SUCCESS") {
  const methods = Array.isArray(response.desc)
    ? [...new Set(response.desc.map((d) => d?.type).filter(Boolean))]
    : [];
  console.log("  OK — credentials accepted.");
  console.log(`  gateway page: ${(response.redirectGatewayURL || response.GatewayPageURL || "").slice(0, 70)}…`);
  console.log(`  methods offered: ${methods.join(", ") || "none reported"}`);
  console.log(`  ${Array.isArray(response.desc) ? response.desc.length : 0} payment options enabled on this store.\n`);
  process.exit(0);
}

const reason = response?.failedreason || response?.status || "unknown error";
console.log(`  REJECTED: ${reason}\n`);

if (/credential|de-?active/i.test(reason)) {
  console.log("This message covers three different problems:");
  console.log("  1. Mode mismatch — the most common cause.");
  console.log(`     You are using the ${sandbox ? "SANDBOX" : "LIVE"} gateway.`);
  console.log(sandbox
    ? "     If these are LIVE credentials from SSLCommerz, set SSLCOMMERZ_SANDBOX=false."
    : "     If these are SANDBOX credentials, set SSLCOMMERZ_SANDBOX=true (or remove the variable).");
  console.log("  2. Wrong store id or password — re-copy them from the SSLCommerz merchant panel.");
  console.log("  3. The store is not activated yet — check the panel, or contact SSLCommerz.");
  console.log("\nTo confirm your setup works at all, try the public sandbox credentials:");
  console.log("  SSLCOMMERZ_STORE_ID=testbox");
  console.log("  SSLCOMMERZ_STORE_PASSWORD=qwerty");
  console.log("  SSLCOMMERZ_SANDBOX=true\n");
}
process.exit(1);
