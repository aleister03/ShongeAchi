import connectDB from "@/lib/mongodb.js";
import { ApiError, assertObjectId, failure, success } from "@/lib/api.js";
import { serializeCheckersWithWorkload, workloadMapFromAggregate, matchesServiceArea } from "@/lib/checkers.js";
import { formatAddress } from "@/lib/address.js";
import Checker from "@/models/Checker.js";
import Elder from "@/models/Elder.js";
import Visit from "@/models/Visit.js";
import { requireAuth } from "@/lib/auth.js";



const WEIGHTS = { location: 40, workload: 30, experience: 20, conditionMatch: 10 };

// Same rule as before, now shared with the admin analytics dashboard via
// lib/checkers so both screens agree on which checkers count as nearby.
function locationScore(checker, elder) {
  return matchesServiceArea(checker, elder) ? WEIGHTS.location : 0;
}

function workloadScore(checker) {
  if (!checker.maxWorkload) return 0; // normalizeChecker maps maxCapacity -> maxWorkload
  const availableRatio = Math.max(checker.maxWorkload - checker.currentWorkload, 0) / checker.maxWorkload;
  return Math.round(availableRatio * WEIGHTS.workload);
}

function experienceScore(checker) {
  return Math.round((Math.min(checker.experienceYears, 10) / 10) * WEIGHTS.experience);
}

function conditionMatchScore(checker, conditionVisitCounts) {
  const count = conditionVisitCounts.get(String(checker._id)) || 0;
  return Math.round((Math.min(count, 5) / 5) * WEIGHTS.conditionMatch);
}

export async function GET(request, context) {
  try {
    requireAuth(request, ["admin"]);
    await connectDB();
    const { id } = await context.params;
    assertObjectId(id, "elder id");

    const elder = await Elder.findById(id).lean();
    if (!elder) throw new ApiError(404, "Elder not found");

    const eligibleCheckers = await Checker.find({
      // The merged Checker model renamed these: active -> status, verificationStatus
      // -> verified, maxWorkload -> maxCapacity. $or accepts either vocabulary so the
      // query keeps working whichever shape a document was written in.
      $and: [
        { $or: [{ status: "Active" }, { active: true }] },
        { $or: [{ verified: true }, { verificationStatus: "verified" }, { applicationStatus: "Approved" }] },
        // Capacity can no longer be filtered in the query: Checker.assignedElders is
        // gone, so $size had nothing to measure and the command errored with
        // "The argument to $size must be an array". Capacity is applied in JS below
        // using workload counted from Elder.checkerId.
      ],
    }).lean();

    if (!eligibleCheckers.length) {
      return success({ elderId: id, recommendations: [] }, 200, {
        message: "No checkers are currently available for assignment",
      });
    }

    // Proxy for "previous experience assisting [condition] elders":
    // count past visits this checker made to OTHER elders sharing a condition.
    let conditionVisitCounts = new Map();
    if (elder.medicalConditions?.length) {
      const peers = await Elder.find({
        _id: { $ne: elder._id },
        medicalConditions: { $in: elder.medicalConditions },
      }).select("_id").lean();

      const peerIds = peers.map((e) => e._id);
      if (peerIds.length) {
        const visits = await Visit.aggregate([
          { $match: { elderId: { $in: peerIds } } },
          { $group: { _id: "$checkerId", count: { $sum: 1 } } },
        ]);
        conditionVisitCounts = new Map(visits.map((v) => [String(v._id), v.count]));
      }
    }

    // Workload now comes from Elder.checkerId counts, and the capacity filter that
    // used to live in the Mongo query is applied here instead.
    const workloadRows = await Elder.aggregate([
      { $match: { checkerId: { $ne: null } } },
      { $group: { _id: "$checkerId", count: { $sum: 1 } } }
    ]);

    const ranked = serializeCheckersWithWorkload(eligibleCheckers, workloadMapFromAggregate(workloadRows))
      .filter((checker) => checker.availableCapacity > 0)
      .map((checker) => {
        const breakdown = {
          location: locationScore(checker, elder),
          workload: workloadScore(checker),
          experience: experienceScore(checker),
          conditionMatch: conditionMatchScore(checker, conditionVisitCounts),
        };
        const matchScore = Object.values(breakdown).reduce((sum, v) => sum + v, 0);
        return { ...checker, matchScore, matchBreakdown: breakdown };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);

    return success({
      elder: {
        _id: elder._id,
        name: elder.name,
        address: formatAddress(elder.address),
        medicalConditions: elder.medicalConditions,
      },
      recommendations: ranked,
    });
  } catch (error) {
    return failure(error);
  }
}