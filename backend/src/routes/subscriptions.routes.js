import { Router } from "express";

import { cancelSubscription, listSubscriptions } from "../controllers/subscriptions.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/", listSubscriptions);
router.post("/:id/cancel", cancelSubscription);

export default router;
