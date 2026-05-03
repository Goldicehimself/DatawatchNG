import User from "../models/User.js";
import { createOtp, verifyOtp } from "../services/otp.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { httpError } from "../utils/httpError.js";
import { assertValidPin, hashPin, verifyPin } from "../utils/pin.js";
import { detectNetwork, normalizeNigerianPhone } from "../utils/phone.js";
import { signSession } from "../utils/token.js";

export const requestOtp = asyncHandler(async (req, res) => {
  const phone = normalizeNigerianPhone(req.body.phone);
  const mode =
    req.body.mode === "setup-pin"
      ? "setup-pin"
      : req.body.mode === "signin"
        ? "signin"
        : "create";

  if (!phone) {
    throw httpError(400, "Enter a valid Nigerian phone number");
  }

  if (mode === "signin") {
    throw httpError(400, "Sign in with your phone number and PIN.");
  }

  if (mode === "create") {
    assertValidPin(req.body.pin);

    const existingUser = await User.findOne({ phone });

    if (existingUser) {
      throw httpError(409, "An account already exists for this phone number. Sign in instead.");
    }
  }

  if (mode === "setup-pin") {
    assertValidPin(req.body.pin);

    const existingUser = await User.findOne({ phone });

    if (!existingUser) {
      throw httpError(404, "No account found for this phone number. Create an account first.");
    }

    if (existingUser.pinHash && existingUser.pinSalt) {
      throw httpError(409, "This account already has a PIN. Sign in instead.");
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
  const mode =
    req.body.mode === "setup-pin"
      ? "setup-pin"
      : req.body.mode === "signin"
        ? "signin"
        : "create";

  if (!phone || !code) {
    throw httpError(400, "Phone and OTP code are required");
  }

  if (mode === "signin") {
    throw httpError(400, "Sign in with your phone number and PIN.");
  }

  const existingUser = await User.findOne({ phone });

  if (mode === "create") {
    assertValidPin(req.body.pin);

    if (String(req.body.fullName || "").trim().length < 2) {
      throw httpError(400, "Full name is required");
    }

    if (existingUser) {
      throw httpError(409, "An account already exists for this phone number. Sign in instead.");
    }
  }

  if (mode === "setup-pin") {
    assertValidPin(req.body.pin);

    if (!existingUser) {
      throw httpError(404, "No account found for this phone number. Create an account first.");
    }

    if (existingUser.pinHash && existingUser.pinSalt) {
      throw httpError(409, "This account already has a PIN. Sign in instead.");
    }
  }

  const valid = await verifyOtp(phone, code, mode);

  if (!valid) {
    throw httpError(401, "Invalid or expired OTP");
  }

  const detectedNetwork = network || detectNetwork(phone) || "unknown";
  const pinCredential = mode === "create" ? await hashPin(req.body.pin) : {};
  const user =
    existingUser ||
    (await User.findOneAndUpdate(
      { phone },
      {
        phone,
        fullName: String(req.body.fullName || "").trim(),
        network: detectedNetwork,
        ...pinCredential,
        isVerified: true,
        onboardingCompletedAt: new Date()
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ));

  if (existingUser) {
    existingUser.network = network || existingUser.network || detectedNetwork;
    existingUser.isVerified = true;
    if (mode === "setup-pin") {
      const setupCredential = await hashPin(req.body.pin);
      existingUser.pinHash = setupCredential.pinHash;
      existingUser.pinSalt = setupCredential.pinSalt;
    }
    await existingUser.save();
  }

  res.json({
    success: true,
    token: signSession({ userId: user._id.toString() }),
    user
  });
});

export const loginWithPin = asyncHandler(async (req, res) => {
  const phone = normalizeNigerianPhone(req.body.phone);
  const { pin } = req.body;

  if (!phone) {
    throw httpError(400, "Enter a valid Nigerian phone number");
  }

  assertValidPin(pin);

  const user = await User.findOne({ phone });

  if (!user) {
    throw httpError(404, "No account found for this phone number. Create an account first.");
  }

  if (!user.pinHash || !user.pinSalt) {
    throw httpError(409, "This account needs a PIN. Create one to continue.");
  }

  const valid = await verifyPin(pin, user.pinHash, user.pinSalt);

  if (!valid) {
    throw httpError(401, "Invalid phone number or PIN");
  }

  user.isVerified = true;
  await user.save();

  res.json({
    success: true,
    token: signSession({ userId: user._id.toString() }),
    user
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});
