// backend/lib/geo.js
//
// Geocoding + distance helpers for Intelligent Checker Assignment
// (spec item: "OpenStreet API/Leaflet — for location-based checker
// assignment and route planning"). Uses OpenStreetMap's free Nominatim
// geocoding API rather than a paid service, matching the project's
// declared tech stack.
//
// Nominatim's usage policy (https://operations.osmfoundation.org/policies/nominatim/)
// requires a descriptive User-Agent and caps usage at ~1 request/second.
// That's fine here — geocoding only happens once, at elder/checker
// creation time, not on every page load or every assignment lookup.

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "ShongeAchi-CSE471-Capstone/1.0 (BRAC University, Group 07)";

/** Great-circle distance between two lat/lng points, in kilometers. */
function haversineDistanceKm(lat1, lng1, lat2, lng2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // Earth's radius, km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Geocode a free-text address to { lat, lng } using Nominatim.
 * Returns null (never throws) on any failure — geocoding is a
 * best-effort enhancement, not a hard requirement for creating an
 * elder or checker record. Callers should always handle a null result.
 *
 * Has a hard timeout: without one, an unresponsive Nominatim would hang
 * the entire signup/registration request indefinitely (fetch() has no
 * default timeout), which defeats "never blocks creation" — a slow
 * external API would silently freeze the page instead of just skipping
 * the coordinates.
 */
async function geocodeAddress(query, timeoutMs = 5000) {
  if (!query || !query.trim()) return null;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const url = `${NOMINATIM_URL}?format=json&limit=1&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT }, signal: controller.signal });
    if (!res.ok) return null;
    const results = await res.json();
    if (!results?.length) return null;
    const { lat, lon } = results[0];
    return { lat: parseFloat(lat), lng: parseFloat(lon) };
  } catch (err) {
    console.error("Geocoding failed:", err.name === "AbortError" ? `timed out after ${timeoutMs}ms` : err.message);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Geocode an address built from progressively broader parts, falling back
 * to a coarser query if the most specific one doesn't resolve. Many minor
 * residential roads simply aren't in OpenStreetMap's data even when the
 * surrounding area/city are — without this, a single unmapped road name
 * means the elder gets no coordinates at all. This way they still get an
 * area-level pin, which is good enough for assignment-distance purposes
 * (checkers are matched at a neighborhood/walkable-radius granularity
 * anyway, not house-by-house).
 *
 * @param {string[]} parts - address parts from most specific to least,
 *   e.g. [road, areaTahna, city, country]. Falsy/empty parts are skipped.
 * @param {number} [respectRateLimit=0] - ms to wait between attempts, so a
 *   multi-step fallback still honors Nominatim's ~1 req/sec policy.
 */
async function geocodeAddressWithFallback(parts, respectRateLimit = 0) {
  const clean = parts.filter(Boolean);
  for (let dropFromFront = 0; dropFromFront < clean.length; dropFromFront++) {
    const attempt = clean.slice(dropFromFront).join(", ");
    if (!attempt) break;
    const coords = await geocodeAddress(attempt);
    if (coords) return coords;
    if (respectRateLimit) await new Promise((r) => setTimeout(r, respectRateLimit));
  }
  return null;
}

export { haversineDistanceKm, geocodeAddress, geocodeAddressWithFallback };