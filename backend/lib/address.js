// backend/lib/address.js
//
// A human-readable one-line rendering of an Elder's address, used to
// prefill the payment checkout billing address.
const PARTS = ["flatFloor", "houseNo", "road", "areaTahna", "city", "postalCode", "country"];

export function formatAddress(address) {
  if (!address) return "";
  if (typeof address === "string") return address.trim();
  if (typeof address !== "object") return String(address);

  const seen = new Set();
  const pieces = [];
  for (const key of PARTS) {
    const value = address[key];
    if (value === undefined || value === null) continue;
    const text = String(value).trim();
    if (!text || seen.has(text.toLowerCase())) continue;
    seen.add(text.toLowerCase());
    pieces.push(text);
  }

  return pieces.join(", ");
}
