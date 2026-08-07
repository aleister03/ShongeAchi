import connectDB from "@/lib/mongodb";
import { ApiError, failure, pick, requireFields, success } from "@/lib/api";
import { serializeChecker } from "@/lib/checkers";
import Checker from "@/models/Checker";

const CREATE_FIELDS = ["name", "serviceArea", "phone", "shift", "experienceYears", "maxWorkload"];

export async function GET() {
  try {
    await connectDB();
    const data = (await Checker.find().sort({ createdAt: -1 }).lean()).map(serializeChecker);
    const active = data.filter((checker) => checker.active);
    return success(data, 200, { summary: {
      activeCheckers: active.length,
      atFullCapacity: active.filter((checker) => checker.currentWorkload >= checker.maxWorkload).length,
      pendingVerification: data.filter((checker) => checker.verificationStatus === "pending").length,
      averageWorkload: active.length ? active.reduce((sum, checker) => sum + checker.currentWorkload, 0) / active.length : 0,
      averageMaxWorkload: active.length ? active.reduce((sum, checker) => sum + checker.maxWorkload, 0) / active.length : 0
    } });
  } catch (error) {
    return failure(error);
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    requireFields(body, ["name", "serviceArea"]);
    if (!body.name.trim() || !body.serviceArea.trim()) throw new ApiError(400, "Name and service area cannot be blank");
    const checker = await Checker.create(pick(body, CREATE_FIELDS));
    return success(serializeChecker(checker), 201);
  } catch (error) {
    return failure(error);
  }
}
