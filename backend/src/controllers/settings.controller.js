import { asyncHandler } from "../utils/asyncHandler.js";

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
