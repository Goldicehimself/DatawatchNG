import User from "../models/User.js";
import { createOtp, verifyOtp } from "../services/otp.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { httpError } from "../utils/httpError.js";
import { detectNetwork, normalizeNigerianPhone } from "../utils/phone.js";
import { signSession } from "../utils/token.js";

export const requestOtp = asyncHandler(async (req, res) => {
  const phone = normalizeNigerianPhone(req.body.phone);
  const mode = req.body.mode === "signin" ? "signin" : "create";

  if (!phone) {
    throw httpError(400, "Enter a valid Nigerian phone number");
  }

  if (mode === "signin") {
    const existingUser = await User.findOne({ phone });

    if (!existingUser) {
      throw httpError(404, "No account found for this phone number. Create an account first.");
    }
  }

  const otp = await createOtp(phone, mode);

  res.status(201).json({
    success: true,
    message: "OTP sent",
    phone,
    mode,
    network: detectNetwork(phone) || "unknown",
    provider: otp.provider,
    resendAfterSeconds: Number(process.env.OTP_RESEND_SECONDS || 60),
    demoCode: otp.code
  });
});

export const verifyOtpAndLogin = asyncHandler(async (req, res) => {
  const phone = normalizeNigerianPhone(req.body.phone);
  const { code, network } = req.body;
  const mode = req.body.mode === "signin" ? "signin" : "create";

  if (!phone || !code) {
    throw httpError(400, "Phone and OTP code are required");
  }

  const existingUser = await User.findOne({ phone });

  if (mode === "signin" && !existingUser) {
    throw httpError(404, "No account found for this phone number. Create an account first.");
  }

  const valid = await verifyOtp(phone, code, mode);

  if (!valid) {
    throw httpError(401, "Invalid or expired OTP");
  }

  const detectedNetwork = network || detectNetwork(phone) || "unknown";
  const user =
    existingUser ||
    (await User.findOneAndUpdate(
      { phone },
      {
        phone,
        network: detectedNetwork,
        isVerified: true,
        onboardingCompletedAt: new Date()
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ));

  if (existingUser) {
    existingUser.network = network || existingUser.network || detectedNetwork;
    existingUser.isVerified = true;
    await existingUser.save();
  }

  res.json({
    success: true,
    token: signSession({ userId: user._id.toString() }),
    user
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});
