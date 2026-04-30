import { Router } from "express";

import { listAlerts, markAlertRead, scanForFraud } from "../controllers/alerts.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/", listAlerts);
router.post("/scan", scanForFraud);
router.patch("/:id/read", markAlertRead);

export default router;
