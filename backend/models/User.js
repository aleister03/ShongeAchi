import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["admin", "checker", "family"], required: true },
  name: { type: String, required: true },
  checkerId: { type: mongoose.Schema.Types.ObjectId, ref: "Checker", default: null },
  familyMemberId: { type: String, default: null }, // set to this user's own _id string on creation for family role
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model("User", UserSchema);