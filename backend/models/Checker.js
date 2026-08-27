import mongoose from "mongoose";

const CheckerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, default: "" },
  passwordHash: { type: String, required: true },
  serviceArea: { type: String, required: true },
  workingHours: {
    start: { type: String, default: "08:00" },
    end: { type: String, default: "18:00" },
  },
  experienceYears: { type: Number, default: 0 },
  maxCapacity: { type: Number, default: 20 },
  ratePerVisit: { type: Number, default: 60 }, // BDT — used for the earnings calc on the detail page

  // --- NEW: identity verification, added for the public checker signup flow ---
  // Stored as base64 data URLs directly on the document. That's fine at capstone scale
  // (a handful of applicants, small JPG/PNGs) but isn't how you'd do it in production —
  // swap for real object storage (S3/Cloudinary/etc.) + a URL field if this ever needs to scale.
  nidPhoto: { type: String, default: "" },
  profilePhoto: { type: String, default: "" },
  applicationStatus: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  // ------------------------------------------------------------------------------

  verified: { type: Boolean, default: false }, // kept for the existing admin UI; mirrors applicationStatus === "Approved"
  status: { type: String, enum: ["Active", "Inactive"], default: "Inactive" }, // CHANGED: was "Active" by default — a brand-new signup must not be assignable until an admin approves it
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Checker || mongoose.model("Checker", CheckerSchema);
