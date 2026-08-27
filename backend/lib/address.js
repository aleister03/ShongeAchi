// Elder addresses come in two shapes.
//
// models/Elder.js declares `address: String`, but live databases hold a structured
// object — { houseNo, road, areaThana, city, postalCode, country, flatFloor,
// coordinates }. Because every read path uses .lean() (and .lean() skips mongoose
// casting), that raw object flows straight through to callers. It crashed
// matchesServiceArea() on .toLowerCase() and crashed React with "Objects are not
// valid as a React child".
//
// Rather than pick a winner and migrate data, both shapes are accepted everywhere.
// This is the single place that knows how to read an address.

// Ordered most-specific to least, which is how a Bangladeshi address reads.
const PARTS = ["flatFloor", "houseNo", "road", "areaThana", "areaTahna", "city", "postalCode", "country"];

/**
 * A human-readable one-line address, safe to render.
 * Returns "" for anything unusable, never undefined or an object.
 */
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
    // `areaThana` / `areaTahna` are the same field spelled two ways in the wild;
    // dedupe so a document carrying both doesn't repeat itself.
    if (!text || seen.has(text.toLowerCase())) continue;
    seen.add(text.toLowerCase());
    pieces.push(text);
  }

  if (pieces.length) return pieces.join(", ");

  // Unknown object shape: fall back to its own string values, skipping ids and
  // coordinate blobs so nothing meaningless is shown.
  return Object.entries(address)
    .filter(([key, value]) => key !== "_id" && key !== "coordinates" && typeof value === "string" && value.trim())
    .map(([, value]) => value.trim())
    .join(", ");
}

/** Lowercased address text for matching. Always a string. */
export function addressText(address) {
  return formatAddress(address).toLowerCase();
}
