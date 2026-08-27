import connectDB from "@/lib/mongodb.js";
import User from "@/models/User.js";
import { verifyPassword, issueToken } from "@/lib/auth.js";
import { ApiError, failure, requireFields, success } from "@/lib/api.js";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    requireFields(body, ["email", "password"]);
    const user = await User.findOne({ email: body.email.toLowerCase() });
    if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
      throw new ApiError(401, "Invalid email or password");
    }
    const token = issueToken(user);
    return success({ token, user: { id: user._id, role: user.role, name: user.name, checkerId: user.checkerId, familyMemberId: user.familyMemberId } });
  } catch (error) {
    return failure(error);
  }
}