import connectDB from "@/lib/mongodb";
import Elder from "@/models/Elder";
import Checker from "@/models/Checker";
import { haversineDistanceKm } from "@/lib/geo";
import { NextResponse } from "next/server";

// Beyond this distance, proximity contributes nothing to the score — a
// checker 30km away shouldn't outrank one 2km away just because their
// capacity/experience numbers are slightly better. Matches the spec's
// "walkable or short-commute radius" framing for how a checker's route
// stays viable.
const MAX_RELEVANT_RADIUS_KM = 15;

// Scoring: real lat/lng distance (via OpenStreetMap/Leaflet geocoding, see
// lib/geo.js) beats capacity, then experience, then verification. If
// either the elder or the checker doesn't have geocoded coordinates yet
// (e.g. created before this feature existed, or geocoding failed), this
// falls back to the original area/city string-matching heuristic instead
// of breaking or scoring proximity as zero.
function scoreChecker(checker, elder, assignedCount) {
  let score = 0;
  let distanceKm = null;

  const elderCoords = elder.address?.coordinates;
  const checkerCoords = checker.serviceLocation;
  const hasCoords =
    elderCoords?.lat != null && elderCoords?.lng != null && checkerCoords?.lat != null && checkerCoords?.lng != null;

  if (hasCoords) {
    distanceKm = haversineDistanceKm(elderCoords.lat, elderCoords.lng, checkerCoords.lat, checkerCoords.lng);
    const proximityScore = Math.max(0, 1 - distanceKm / MAX_RELEVANT_RADIUS_KM) * 50;
    score += proximityScore;
  } else {
    // Fallback: original string-matching heuristic, unchanged, for
    // records that don't have geocoded coordinates yet.
    const area = elder.address?.areaTahna?.toLowerCase() || "";
    const city = elder.address?.city?.toLowerCase() || "";
    const checkerArea = checker.serviceArea?.toLowerCase() || "";
    if (checkerArea === area) score += 50;
    else if (checkerArea === city) score += 25;
  }

  const capacityRatio = assignedCount / checker.maxCapacity;
  score += (1 - capacityRatio) * 30; // more free capacity = higher score

  score += Math.min(checker.experienceYears, 10) * 2; // up to +20

  if (checker.verified) score += 10;

  return { score: Math.round(score), distanceKm };
}

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const elderId = searchParams.get("elderId");
    if (!elderId) {
      return NextResponse.json({ error: "elderId is required" }, { status: 400 });
    }

    const elder = await Elder.findById(elderId);
    if (!elder) return NextResponse.json({ error: "Elder not found" }, { status: 404 });

    // CHANGED: now also requires verified: true, so a checker whose signup is still
    // "Pending" (or was "Rejected") can never surface as a recommendation, even if
    // their status field were somehow set to Active by mistake.
    const checkers = await Checker.find({ status: "Active", verified: true });

    const scored = await Promise.all(
      checkers.map(async (checker) => {
        const assignedCount = await Elder.countDocuments({ assignedCheckerId: checker._id });
        const { score, distanceKm } = scoreChecker(checker, elder, assignedCount);
        return {
          checker,
          assignedCount,
          atCapacity: assignedCount >= checker.maxCapacity,
          score,
          distanceKm, // null when either party lacks coordinates — frontend should handle that
        };
      })
    );

    const recommendations = scored
      .filter((s) => !s.atCapacity)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    return NextResponse.json({ success: true, data: { elder, recommendations } }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
