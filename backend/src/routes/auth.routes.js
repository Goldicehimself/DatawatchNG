import { Router } from "express";

import { getMe, requestOtp, verifyOtpAndLogin } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtpAndLogin);
router.get("/me", requireAuth, getMe);

export default router;
