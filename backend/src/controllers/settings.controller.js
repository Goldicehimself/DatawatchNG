import { asyncHandler } from "../utils/asyncHandler.js";

export const updateSettings = asyncHandler(async (req, res) => {
  const allowed = ["notifications", "trackingEnabled", "aiLanguage", "aiTone"];

  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      req.user.settings[key] = req.body[key];
    }
  }

  await req.user.save();
  res.json({ success: true, user: req.user });
});
