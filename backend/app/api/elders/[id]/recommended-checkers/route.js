import connectDB from "@/lib/mongodb";
import { ApiError, assertObjectId, failure, success } from "@/lib/api";
import { serializeChecker } from "@/lib/checkers";
import Checker from "@/models/Checker";
import Elder from "@/models/Elder";
import Visit from "@/models/Visit";

const WEIGHTS = { location: 40, workload: 30, experience: 20, conditionMatch: 10 };

function locationScore(checker, elder) {
  if (!checker.serviceArea || !elder.address) return 0;
  const area = checker.serviceArea.toLowerCase();
  const address = elder.address.toLowerCase();
  return address.includes(area) || area.includes(address) ? WEIGHTS.location : 0;
}

function workloadScore(checker) {
  if (!checker.maxWorkload) return 0;
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

export async function GET(_request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    assertObjectId(id, "elder id");

    const elder = await Elder.findById(id).lean();
    if (!elder) throw new ApiError(404, "Elder not found");

    const eligibleCheckers = await Checker.find({
      active: true,
      verificationStatus: "verified",
      $expr: { $lt: [{ $size: "$assignedElders" }, "$maxWorkload"] },
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

    const ranked = eligibleCheckers
      .map(serializeChecker)
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
        address: elder.address,
        medicalConditions: elder.medicalConditions,
      },
      recommendations: ranked,
    });
  } catch (error) {
    return failure(error);
  }
}