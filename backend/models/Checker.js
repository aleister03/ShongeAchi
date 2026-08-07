import mongoose from "mongoose";

const CheckerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    serviceArea: { type: String, required: true, trim: true },
    phone: { type: String, default: "", trim: true },
    shift: { type: String, default: "8am–5pm", trim: true },
    experienceYears: { type: Number, min: 0, default: 0 },
    maxWorkload: { type: Number, min: 1, default: 20 },
    assignedElders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Elder" }],
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending"
    },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

CheckerSchema.pre("validate", function validateCapacity() {
  if (this.assignedElders.length > this.maxWorkload) {
    this.invalidate("assignedElders", "Assigned elders cannot exceed max workload");
  }
});

export default mongoose.models.Checker || mongoose.model("Checker", CheckerSchema);
