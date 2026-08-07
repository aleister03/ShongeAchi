import connectDB from "@/lib/mongodb";
import { ApiError, assertObjectId, failure, success } from "@/lib/api";
import Elder from "@/models/Elder";
import Visit from "@/models/Visit";

export async function GET(_request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    assertObjectId(id, "elder id");
    if (!await Elder.exists({ _id: id })) throw new ApiError(404, "Elder not found");
    return success(await Visit.find({ elderId: id }).sort({ visitDate: -1 }));
  } catch (error) {
    return failure(error);
  }
}

export async function POST(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    assertObjectId(id, "elder id");
    const elder = await Elder.findById(id).lean();
    if (!elder) throw new ApiError(404, "Elder not found");
    if (!elder.checkerId) throw new ApiError(409, "Elder does not have an assigned checker");
    const body = await request.json();
    if (body.checkerId && String(body.checkerId) !== String(elder.checkerId)) throw new ApiError(409, "Checker is not assigned to this elder");
    const visit = await Visit.create({ ...body, elderId: id, checkerId: elder.checkerId });
    return success(visit, 201);
  } catch (error) {
    return failure(error);
  }
}
