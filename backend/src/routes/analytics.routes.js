import { Router } from "express";

import { getDashboard } from "../controllers/analytics.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/dashboard", requireAuth, getDashboard);

export default router;
