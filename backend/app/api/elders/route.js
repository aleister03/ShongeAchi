import connectDB from "@/lib/mongodb";
import { ApiError, failure, pick, requireFields, success } from "@/lib/api";
import Elder from "@/models/Elder";

const ELDER_FIELDS = ["name", "age", "gender", "phone", "address", "bio", "medicalConditions", "mobilityNotes", "emergencyContact", "secondaryContact", "familyMemberId", "visitSchedule"];

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const familyMemberId = searchParams.get("familyMemberId");
    const unassigned = searchParams.get("unassigned") === "true";
    if (!familyMemberId && !unassigned) throw new ApiError(400, "familyMemberId is required");
    const elders = await Elder.find(unassigned ? { checkerId: null } : { familyMemberId });
    return success(elders);
  } catch (error) {
    return failure(error);
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    requireFields(body, ["name", "age", "gender", "phone", "address", "emergencyContact", "familyMemberId"]);
    const elder = await Elder.create(pick(body, ELDER_FIELDS));
    return success(elder, 201);
  } catch (error) {
    return failure(error);
  }
}
