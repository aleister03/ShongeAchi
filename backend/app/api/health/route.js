import connectDB from "@/lib/mongodb.js";
import { failure, success } from "@/lib/api.js";

export async function GET() {
  try {
    const mongoose = await connectDB();
    if (mongoose.connection.readyState !== 1) throw new Error("Database is not connected");
    return success({ status: "ready", database: "connected" });
  } catch (error) {
    return failure(error);
  }
}
