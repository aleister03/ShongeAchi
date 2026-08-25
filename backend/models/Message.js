import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  elderId: { type: mongoose.Schema.Types.ObjectId, ref: "Elder", required: true },
  checkerId: { type: mongoose.Schema.Types.ObjectId, ref: "Checker", required: true },
  familyMemberId: { type: String, required: true },
  senderRole: { type: String, enum: ["family", "checker"], required: true },
  senderName: { type: String, required: true },
  text: { type: String, default: "" },
  attachment: {
    kind: { type: String, enum: ["image", "video", null], default: null },
    data: { type: String, default: "" }, 
    mimeType: { type: String, default: "" },
  },
  createdAt: { type: Date, default: Date.now },
});

MessageSchema.index({ elderId: 1, createdAt: 1 });

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);