import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    channel: { type: String, enum: ["app", "whatsapp", "voice"], default: "app" },
    role: { type: String, enum: ["user", "assistant"], required: true },
    language: { type: String, enum: ["english", "pidgin"], default: "english" },
    content: { type: String, required: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

export default mongoose.model("ChatMessage", chatMessageSchema);
