import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, trim: true, maxlength: 120 },
    country: { type: String, default: "NG" },
    network: { type: String, enum: ["MTN", "Airtel", "Glo", "9mobile", "unknown"], default: "unknown" },
    pinHash: String,
    pinSalt: String,
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

function hidePrivateFields(_doc, ret) {
  delete ret.pinHash;
  delete ret.pinSalt;
  return ret;
}

userSchema.set("toJSON", { transform: hidePrivateFields });
userSchema.set("toObject", { transform: hidePrivateFields });

export default mongoose.model("User", userSchema);
