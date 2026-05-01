import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: {
      type: String,
      enum: ["usage_threshold", "fraud", "subscription_charge", "background_usage", "abnormal_spike"],
      required: true
    },
    severity: { type: String, enum: ["low", "medium", "high"], default: "low" },
    title: { type: String, required: true },
    message: { type: String, required: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    flaggedAt: Date,
    readAt: Date
  },
  { timestamps: true }
);

export default mongoose.model("Alert", alertSchema);
