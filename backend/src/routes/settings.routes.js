import { Router } from "express";

import { updateSettings } from "../controllers/settings.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.patch("/", requireAuth, updateSettings);

export default router;
