import { Router } from "express";

import { receiveWebhook } from "../controllers/whatsapp.controller.js";

const router = Router();

router.post("/webhook", receiveWebhook);

export default router;
