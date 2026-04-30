import mongoose from "mongoose";

const usageRecordSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    appName: { type: String, required: true },
    category: { type: String, default: "General" },
    amountMb: { type: Number, required: true, min: 0 },
    isBackground: { type: Boolean, default: false },
    network: { type: String, enum: ["MTN", "Airtel", "Glo", "9mobile", "unknown"], default: "unknown" },
    recordedAt: { type: Date, required: true, index: true }
  },
  { timestamps: true }
);

export default mongoose.model("UsageRecord", usageRecordSchema);
