// Renders an elder address safely.
//
// models/Elder.js declares `address: String`, but live databases hold a structured
// object ({ houseNo, road, areaThana, city, … }). Rendering that object directly
// crashed React with "Objects are not valid as a React child". API responses are
// normalised server-side (lib/address.js), but this mirror keeps any endpoint that
// returns a raw document from being able to break a page.
const PARTS = ["flatFloor", "houseNo", "road", "areaThana", "areaTahna", "city", "postalCode", "country"];

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
  if (pieces.length) return pieces.join(", ");

  return Object.entries(address)
    .filter(([key, value]) => key !== "_id" && key !== "coordinates" && typeof value === "string" && value.trim())
    .map(([, value]) => value.trim())
    .join(", ");
}
