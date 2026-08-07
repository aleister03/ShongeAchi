import mongoose from "mongoose";
import { NextResponse } from "next/server";

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function assertObjectId(value, label = "id") {
  if (!mongoose.isValidObjectId(value)) {
    throw new ApiError(400, `Invalid ${label}`);
  }
}

export function success(data, status = 200, extra = {}) {
  return NextResponse.json({ success: true, data, ...extra }, { status });
}

export function failure(error) {
  const status = error.status || (error.name === "ValidationError" || error instanceof SyntaxError ? 400 : 500);
  const message = status === 500 ? "Internal server error" : error.message;
  if (status === 500) console.error(error);
  return NextResponse.json({ success: false, error: { message } }, { status });
}

export function requireFields(body, fields) {
  const missing = fields.filter((field) => body[field] === undefined || body[field] === null || body[field] === "");
  if (missing.length) throw new ApiError(400, `Missing required fields: ${missing.join(", ")}`);
}

export function pick(body, fields) {
  return Object.fromEntries(fields.filter((field) => body[field] !== undefined).map((field) => [field, body[field]]));
}
