import User from "../models/User.js";
import { ensureDemoData } from "../services/demoData.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signSession } from "../utils/token.js";

export const startDemo = asyncHandler(async (req, res) => {
  const phone = `demo-${Date.now()}@datawatch.ng`;
  const user = await User.create({
    phone,
    country: "NG",
    network: req.body.network || "MTN",
    isVerified: true,
    isDemo: true,
    onboardingCompletedAt: new Date()
  });

  await ensureDemoData(user);

  res.status(201).json({
    success: true,
    token: signSession({ userId: user._id.toString(), demo: true }),
    user
  });
});
