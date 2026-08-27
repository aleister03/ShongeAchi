import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "./api.js";

const JWT_SECRET = process.env.JWT_SECRET;

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function issueToken(user) {
  if (!JWT_SECRET) throw new ApiError(500, "JWT_SECRET is not configured");
  return jwt.sign(
    { sub: user._id.toString(), role: user.role, checkerId: user.checkerId, familyMemberId: user.familyMemberId },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}


export function requireAuth(request, allowedRoles = []) {
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) throw new ApiError(401, "Authentication required");

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }

  if (allowedRoles.length && !allowedRoles.includes(payload.role)) {
    throw new ApiError(403, "Not permitted for this role");
  }
  return payload; // { sub, role, checkerId, familyMemberId }
}

export function assertElderAccess(auth, elder) {
  if (auth.role === "admin") return;
  if (auth.role === "family" && elder.familyMemberId === auth.familyMemberId) return;
  if (auth.role === "checker" && String(elder.checkerId) === String(auth.checkerId)) return;
  throw new ApiError(403, "You do not have access to this elder");
}