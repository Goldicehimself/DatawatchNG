import ChatMessage from "../models/ChatMessage.js";
import { buildAssistantReply } from "../services/assistant.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const sendMessage = asyncHandler(async (req, res) => {
  const language = req.body.language || req.user.settings.aiLanguage || "english";

  const userMessage = await ChatMessage.create({
    user: req.user._id,
    channel: req.body.channel || "app",
    role: "user",
    language,
    content: req.body.message
  });

  const reply = await buildAssistantReply(req.user, req.body.message, language);
  const assistantMessage = await ChatMessage.create({
    user: req.user._id,
    channel: req.body.channel || "app",
    role: "assistant",
    language,
    content: reply
  });

  res.status(201).json({ success: true, messages: [userMessage, assistantMessage] });
});

export const sendVoiceTranscript = asyncHandler(async (req, res) => {
  req.body.channel = "voice";
  req.body.message = req.body.transcript || req.body.message;
  return sendMessage(req, res);
});

export const getChatHistory = asyncHandler(async (req, res) => {
  const messages = await ChatMessage.find({ user: req.user._id }).sort({ createdAt: 1 }).limit(100);
  res.json({ success: true, messages });
});
