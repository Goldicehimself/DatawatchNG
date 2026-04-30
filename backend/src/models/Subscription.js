import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    provider: { type: String, default: "Telecom" },
    serviceName: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    billingCycle: { type: String, enum: ["daily", "weekly", "monthly", "unknown"], default: "unknown" },
    status: { type: String, enum: ["active", "flagged", "cancelled"], default: "active" },
    isHidden: { type: Boolean, default: false },
    riskSeverity: { type: String, enum: ["low", "medium", "high"], default: "low" },
    nextChargeAt: Date,
    cancelledAt: Date
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);
