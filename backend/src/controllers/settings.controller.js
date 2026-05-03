import { asyncHandler } from "../utils/asyncHandler.js";
import { assertValidPin, hashPin, verifyPin } from "../utils/pin.js";
import { httpError } from "../utils/httpError.js";

export const updateSettings = asyncHandler(async (req, res) => {
  const allowed = ["trackingEnabled", "aiLanguage", "aiTone"];

  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      req.user.settings[key] = req.body[key];
    }
  }

  if (req.body.notifications !== undefined) {
    req.user.settings.notifications = {
      ...req.user.settings.notifications.toObject?.(),
      ...req.body.notifications
    };
  }

  await req.user.save();
  res.json({ success: true, user: req.user });
});

export const changePin = asyncHandler(async (req, res) => {
  const { currentPin, newPin } = req.body;

  assertValidPin(currentPin, "Current PIN");
  assertValidPin(newPin, "New PIN");

  const currentPinValid = await verifyPin(currentPin, req.user.pinHash, req.user.pinSalt);

  if (!currentPinValid) {
    throw httpError(401, "Current PIN is incorrect");
  }

  const nextCredential = await hashPin(newPin);
  req.user.pinHash = nextCredential.pinHash;
  req.user.pinSalt = nextCredential.pinSalt;
  await req.user.save();

  res.json({ success: true, user: req.user });
});
