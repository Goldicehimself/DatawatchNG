import { Router } from "express";

import { getChatHistory, sendMessage, sendVoiceTranscript } from "../controllers/assistant.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/messages", getChatHistory);
router.post("/messages", sendMessage);
router.post("/voice", sendVoiceTranscript);

export default router;
