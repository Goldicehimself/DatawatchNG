import ChatMessage from "../models/ChatMessage.js";
import User from "../models/User.js";
import { buildAssistantReply } from "../services/assistant.service.js";
import { ensureDemoData } from "../services/demoData.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { detectNetwork, normalizeNigerianPhone } from "../utils/phone.js";

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getWebhookPayload(body) {
  const from = body.From || body.from || body.phone;
  const message = body.Body || body.body || body.message;
  const phone = normalizeNigerianPhone(String(from || "").replace("whatsapp:", ""));

  return {
    phone,
    message,
    language: body.language || "english",
    isTwilio: Boolean(body.From || body.Body)
  };
}

export const receiveWebhook = asyncHandler(async (req, res) => {
  const { phone, message, language, isTwilio } = getWebhookPayload(req.body);

  if (!phone || !message) {
    res.status(400).json({ success: false, message: "Valid phone is required" });
    return;
  }

  const user = await User.findOneAndUpdate(
    { phone },
    {
      $setOnInsert: {
        phone,
        country: "NG",
        network: detectNetwork(phone) || "unknown",
        isVerified: true,
        onboardingCompletedAt: new Date()
      }
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  await ensureDemoData(user);

  await ChatMessage.create({
    user: user._id,
    channel: "whatsapp",
    role: "user",
    language: language || user.settings.aiLanguage,
    content: message
  });

  const reply = await buildAssistantReply(user, message, language || user.settings.aiLanguage);
  await ChatMessage.create({
    user: user._id,
    channel: "whatsapp",
    role: "assistant",
    language: language || user.settings.aiLanguage,
    content: reply
  });

  if (isTwilio) {
    res.type("text/xml").send(`<Response><Message>${escapeXml(reply)}</Message></Response>`);
    return;
  }

  res.json({ success: true, reply });
});
