import { Router } from "express";

import { createUsageRecord, listUsageRecords } from "../controllers/tracking.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/usage", listUsageRecords);
router.post("/usage", createUsageRecord);

export default router;
