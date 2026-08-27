import connectDB from "@/lib/mongodb.js";
import User from "@/models/User.js";
import Checker from "@/models/Checker.js";
import { hashPassword, issueToken } from "@/lib/auth.js";
import { ApiError, failure, requireFields, success } from "@/lib/api.js";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    requireFields(body, ["email", "password", "name", "role"]);
    if (!["checker", "family"].includes(body.role)) {
      throw new ApiError(400, "Invalid role");
    }
    if (await User.findOne({ email: body.email.toLowerCase() })) {
      throw new ApiError(409, "An account with this email already exists");
    }

    let checkerId = null;
    if (body.role === "checker") {
      requireFields(body, ["checkerId"]);
      const checker = await Checker.findById(body.checkerId);
      if (!checker) throw new ApiError(404, "Checker record not found");
      if (await User.findOne({ checkerId: checker._id })) {
        throw new ApiError(409, "This checker record already has an account");
      }
      checkerId = checker._id;
    }

    const user = await User.create({
      email: body.email.toLowerCase(),
      passwordHash: await hashPassword(body.password),
      role: body.role,
      name: body.name,
      checkerId
    });

    if (body.role === "family") {
      user.familyMemberId = user._id.toString();
      await user.save();
    }

    const token = issueToken(user);
    return success({ token, user: { id: user._id, role: user.role, name: user.name, familyMemberId: user.familyMemberId } }, 201);
  } catch (error) {
    return failure(error);
  }
}