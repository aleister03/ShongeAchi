// frontend/lib/address.js
// Mirrors backend/lib/address.js — same reasoning as visitQuestions.js
// being duplicated frontend/backend rather than round-tripped through an
// API call for something this small and static.
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
