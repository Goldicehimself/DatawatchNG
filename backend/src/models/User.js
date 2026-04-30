import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true, index: true },
    country: { type: String, default: "NG" },
    network: { type: String, enum: ["MTN", "Airtel", "Glo", "9mobile", "unknown"], default: "unknown" },
    isVerified: { type: Boolean, default: false },
    isDemo: { type: Boolean, default: false },
    onboardingCompletedAt: Date,
    settings: {
      notifications: {
        usageAlerts: { type: Boolean, default: true },
        fraudAlerts: { type: Boolean, default: true },
        subscriptionAlerts: { type: Boolean, default: true },
        thresholdMb: { type: Number, default: 1024 }
      },
      trackingEnabled: { type: Boolean, default: true },
      aiLanguage: { type: String, enum: ["english", "pidgin"], default: "english" },
      aiTone: { type: String, enum: ["simple", "detailed"], default: "simple" }
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
