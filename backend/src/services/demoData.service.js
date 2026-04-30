import Alert from "../models/Alert.js";
import ChatMessage from "../models/ChatMessage.js";
import Subscription from "../models/Subscription.js";
import UsageRecord from "../models/UsageRecord.js";

const demoApps = [
  ["WhatsApp", "Social", 280, true],
  ["Instagram", "Social", 650, false],
  ["TikTok", "Video", 920, false],
  ["YouTube", "Video", 780, false],
  ["Chrome", "Browser", 340, false],
  ["System Updates", "System", 430, true],
  ["Spotify", "Audio", 180, true]
];

export async function ensureDemoData(user) {
  const existing = await UsageRecord.countDocuments({ user: user._id });

  if (existing > 0) {
    return;
  }

  const now = new Date();
  const usage = [];

  for (let day = 0; day < 7; day += 1) {
    for (const [appName, category, baseAmount, isBackground] of demoApps) {
      usage.push({
        user: user._id,
        appName,
        category,
        amountMb: Math.round(baseAmount * (0.45 + Math.random())),
        isBackground,
        network: user.network,
        recordedAt: new Date(now.getTime() - day * 24 * 60 * 60 * 1000 - Math.floor(Math.random() * 18) * 60 * 60 * 1000)
      });
    }
  }

  await UsageRecord.insertMany(usage);

  await Subscription.insertMany([
    {
      user: user._id,
      provider: user.network,
      serviceName: "Data Auto Renewal",
      amount: 1000,
      billingCycle: "weekly",
      status: "active",
      nextChargeAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
    },
    {
      user: user._id,
      provider: user.network,
      serviceName: "Caller Tune VAS",
      amount: 100,
      billingCycle: "daily",
      status: "flagged",
      isHidden: true,
      riskSeverity: "high",
      nextChargeAt: new Date(now.getTime() + 24 * 60 * 60 * 1000)
    }
  ]);

  await Alert.insertMany([
    {
      user: user._id,
      type: "abnormal_spike",
      severity: "high",
      title: "Midnight data spike detected",
      message: "System Updates used unusual background data around midnight.",
      metadata: { appName: "System Updates", amountMb: 430 }
    },
    {
      user: user._id,
      type: "subscription_charge",
      severity: "medium",
      title: "Hidden VAS charge found",
      message: "Caller Tune VAS appears to be billing daily.",
      metadata: { serviceName: "Caller Tune VAS", amount: 100 }
    }
  ]);

  await ChatMessage.create({
    user: user._id,
    role: "assistant",
    content: "I am Watcher. Ask me what is using your data or which subscription looks suspicious.",
    language: user.settings.aiLanguage
  });
}
