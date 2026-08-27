import connectDB from "@/lib/mongodb.js";

import Visit from "@/models/Visit.js";
import Elder from "@/models/Elder.js";
import Checker from "@/models/Checker.js";

import {
  ApiError,
  assertObjectId,
  failure,
  success,
} from "@/lib/api.js";

import {
  requireAuth,
  assertElderAccess,
} from "@/lib/auth.js";

import { assertPremium } from "@/lib/subscription.js";

import {
  computeConcernMetrics,
  applyOverride,
} from "@/lib/concernScore.js";

export async function GET(request, context) {
  try {
    const auth = requireAuth(request, [
      "admin",
      "checker",
      "family",
    ]);

    await connectDB();

    const { id } = await context.params;

    assertObjectId(id, "elder id");

    const elder = await Elder.findById(id);

    if (!elder) {
      throw new ApiError(404, "Elder not found");
    }

    assertElderAccess(auth, elder);

    assertPremium(
      auth,
      elder,
      "AI Concern Metrics"
    );

    const visits = await Visit.find({
      elderId: id,
    })
      .sort({ visitDate: 1 })
      .lean();

    if (visits.length === 0) {
      return success({
        concernScore: 0,
        trend: "No data",
        totalVisits: 0,
        completedVisits: 0,
        missedVisits: 0,
        category: "Low",
        trendDetail: null,
        contributingFactors: [],
        override: null,
      });
    }

    const metrics = applyOverride(
      computeConcernMetrics(visits),
      elder
    );

    return success({
      concernScore: metrics.concernScore,

      trend:
        metrics.trend.direction === "up"
          ? "Declining"
          : metrics.trend.direction === "down"
            ? "Improving"
            : "Stable",

      totalVisits: visits.length,

      completedVisits: visits.filter(
        (visit) => visit.status !== "No Answer"
      ).length,

      missedVisits: visits.filter(
        (visit) => visit.status === "No Answer"
      ).length,

      category: metrics.category,

      trendDetail: metrics.trend,

      contributingFactors:
        metrics.contributingFactors,

      override: metrics.override,
    });
  } catch (error) {
    return failure(error);
  }
}

export async function PATCH(request, context) {
  try {
    const auth = requireAuth(request, ["checker"]);

    await connectDB();

    const { id } = await context.params;

    assertObjectId(id, "elder id");

    const { score, note } = await request.json();

    if (
      score === undefined ||
      score === null ||
      Number.isNaN(Number(score))
    ) {
      throw new ApiError(
        400,
        "score is required and must be a number"
      );
    }

    const numericScore = Math.round(
      Number(score)
    );

    if (
      numericScore < 0 ||
      numericScore > 100
    ) {
      throw new ApiError(
        400,
        "score must be between 0 and 100"
      );
    }

    const elder = await Elder.findById(id);

    if (!elder) {
      throw new ApiError(404, "Elder not found");
    }

    // Centralized authorization.
    // Ensures this checker can only modify
    // an elder they are allowed to access.
    assertElderAccess(auth, elder);

    const checker = await Checker.findById(
      auth.checkerId
    );

    if (!checker) {
      throw new ApiError(
        404,
        "Checker not found"
      );
    }

    if (
      checker.applicationStatus !== "Approved" ||
      checker.status !== "Active"
    ) {
      throw new ApiError(
        403,
        "Only active approved checkers can update concern scores"
      );
    }

    elder.concernOverride = {
      score: numericScore,
      note:
        typeof note === "string"
          ? note.slice(0, 500)
          : "",
      setByCheckerId: checker._id,
      setAt: new Date(),
    };

    await elder.save();

    const visits = await Visit.find({
      elderId: id,
    })
      .sort({ visitDate: 1 })
      .lean();

    const metrics = applyOverride(
      computeConcernMetrics(visits),
      elder
    );

    return success({
      concernScore: metrics.concernScore,
      category: metrics.category,
      contributingFactors:
        metrics.contributingFactors,
      override: metrics.override,
    });
  } catch (error) {
    return failure(error);
  }
}