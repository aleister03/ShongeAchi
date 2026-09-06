// backend/lib/payments.js
//
// Small helpers for the local payment sandbox (bKash/Nagad/Card
// simulator) — ported from paymentSandbox-master/lib/utils.ts.
export function generateId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function detectCardType(cardNumber) {
  const num = String(cardNumber ?? "").replace(/\s/g, "");
  if (/^4/.test(num)) return "Visa";
  if (/^5[1-5]|^2[2-7]/.test(num)) return "Mastercard";
  return "Unknown";
}

// Sensitive payment details (wallet PIN, card number/CVV) are masked
// before being stored — same approach as the sandbox's own record route,
// just applied before writing to real MongoDB instead of a local file.
export function maskDetails(method, details = {}) {
  const masked = { ...details };

  if (method === "card" && details?.cardNumber) {
    masked.cardType = detectCardType(details.cardNumber);
    const digits = String(details.cardNumber).replace(/\s/g, "");
    masked.cardNumber = `****${digits.slice(-4)}`;
    masked.cvv = "***";
  }
  if ((method === "bkash" || method === "nagad") && details?.pin) {
    masked.pin = "****";
  }

  return masked;
}
