import { Router } from "express";

import { changePin, updateSettings } from "../controllers/settings.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.patch("/", requireAuth, updateSettings);
router.patch("/pin", requireAuth, changePin);

export default router;
