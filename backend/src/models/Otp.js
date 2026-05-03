import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, index: true },
    authMode: { type: String, enum: ["create", "signin", "setup-pin"], default: "create" },
    provider: { type: String, enum: ["local", "twilio", "sendchamp"], default: "local" },
    codeHash: String,
    providerReference: String,
    expiresAt: { type: Date, required: true },
    verifiedAt: Date,
    attempts: { type: Number, default: 0 }
  },
  { timestamps: true }
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Otp", otpSchema);
