import connectDB from "@/lib/mongodb";
import Elder from "@/models/Elder";
import Checker from "@/models/Checker";
import { NextResponse } from "next/server";

// MVP scoring: exact service-area match beats city-only match, then free capacity,
// then experience, then verification. Real lat/lng distance via OpenStreetMap/Leaflet
// is the planned upgrade for this — swap the area/city string match below for a
// haversine distance once checker + elder coordinates are captured.
function scoreChecker(checker, elder, assignedCount) {
  let score = 0;
  const area = elder.address?.areaTahna?.toLowerCase() || "";
  const city = elder.address?.city?.toLowerCase() || "";
  const checkerArea = checker.serviceArea?.toLowerCase() || "";

  if (checkerArea === area) score += 50;
  else if (checkerArea === city) score += 25;

  const capacityRatio = assignedCount / checker.maxCapacity;
  score += (1 - capacityRatio) * 30; // more free capacity = higher score

  score += Math.min(checker.experienceYears, 10) * 2; // up to +20

  if (checker.verified) score += 10;

  return Math.round(score);
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
        return {
          checker,
          assignedCount,
          atCapacity: assignedCount >= checker.maxCapacity,
          score: scoreChecker(checker, elder, assignedCount),
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
