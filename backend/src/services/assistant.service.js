import Alert from "../models/Alert.js";
import Subscription from "../models/Subscription.js";
import UsageRecord from "../models/UsageRecord.js";

function formatMb(amountMb) {
  if (amountMb >= 1024) {
    return `${(amountMb / 1024).toFixed(1)}GB`;
  }

  return `${Math.round(amountMb)}MB`;
}

function containsAny(text, words) {
  return words.some((word) => text.includes(word));
}

async function getTopUsage(user) {
  return UsageRecord.aggregate([
    { $match: { user: user._id } },
    {
      $group: {
        _id: "$appName",
        amountMb: { $sum: "$amountMb" },
        backgroundMb: { $sum: { $cond: ["$isBackground", "$amountMb", 0] } }
      }
    },
    { $sort: { amountMb: -1 } },
    { $limit: 5 }
  ]);
}

function getTips(language) {
  if (language === "pidgin") {
    return [
      "Off autoplay for TikTok, Instagram and YouTube.",
      "Restrict background data for apps wey no need am.",
      "Download videos/music on Wi-Fi before you go out.",
      "Set data warning for your phone settings.",
      "Cancel any VAS subscription wey you no recognize."
    ].join(" ");
  }

  return [
    "Turn off autoplay on TikTok, Instagram and YouTube.",
    "Restrict background data for apps that do not need it.",
    "Download videos and music on Wi-Fi before leaving home.",
    "Set a data warning in phone settings.",
    "Cancel any VAS subscription you do not recognize."
  ].join(" ");
}

async function simulateCancellation(user, text, language) {
  const subscriptions = await Subscription.find({ user: user._id, status: { $ne: "cancelled" } });
  const target =
    subscriptions.find((subscription) => text.includes(subscription.serviceName.toLowerCase())) ||
    subscriptions.find((subscription) => subscription.status === "flagged" || subscription.isHidden) ||
    subscriptions[0];

  if (!target) {
    return language === "pidgin"
      ? "I no find any active subscription to cancel."
      : "I did not find any active subscription to cancel.";
  }

  target.status = "cancelled";
  target.cancelledAt = new Date();
  await target.save();

  await Alert.create({
    user: user._id,
    type: "subscription_charge",
    severity: "low",
    title: "Subscription cancellation simulated",
    message: `${target.serviceName} has been marked as cancelled in DataWatch NG.`,
    metadata: { subscription: target._id }
  });

  return language === "pidgin"
    ? `I don simulate cancellation for ${target.serviceName}. For production, DataWatch go send this request through telecom API or official USSD flow.`
    : `I have simulated cancellation for ${target.serviceName}. In production, DataWatch will send this through a telecom API or official USSD flow.`;
}

export async function buildAssistantReply(user, message, language = "english") {
  const text = String(message || "").toLowerCase();
  const isPidgin = language === "pidgin";
  const topUsage = await getTopUsage(user);
  const flaggedSubscriptions = await Subscription.find({ user: user._id, status: "flagged" }).limit(3);
  const highAlerts = await Alert.find({ user: user._id, severity: { $in: ["medium", "high"] } }).sort({ createdAt: -1 }).limit(3);
  const top = topUsage[0];

  if (containsAny(text, ["cancel", "stop", "unsubscribe", "remove"])) {
    return simulateCancellation(user, text, language);
  }

  if (containsAny(text, ["tip", "save", "last longer", "reduce", "manage data"])) {
    return isPidgin
      ? `To make your data last: ${getTips(language)}`
      : `To make your data last longer: ${getTips(language)}`;
  }

  if (containsAny(text, ["background", "midnight", "spike"])) {
    const background = topUsage.filter((item) => item.backgroundMb > 0).sort((a, b) => b.backgroundMb - a.backgroundMb)[0];

    if (!background) {
      return isPidgin ? "I no see heavy background data right now." : "I do not see heavy background data right now.";
    }

    return isPidgin
      ? `${background._id} dey use background data pass: about ${formatMb(background.backgroundMb)}. Restrict background data for am.`
      : `${background._id} is using the most background data: about ${formatMb(background.backgroundMb)}. Restrict its background data first.`;
  }

  if (containsAny(text, ["subscription", "charge", "vas", "billing"])) {
    const services = flaggedSubscriptions.map((service) => `${service.serviceName} - NGN ${service.amount} ${service.billingCycle}`);

    if (isPidgin) {
      return services.length
        ? `I find suspicious subscription: ${services.join("; ")}. Type "cancel subscription" make I simulate cancellation.`
        : "I no see any suspicious subscription for now.";
    }

    return services.length
      ? `I found suspicious subscriptions: ${services.join("; ")}. Type "cancel subscription" and I will simulate the cancellation flow.`
      : "I do not see any suspicious subscription right now.";
  }

  if (containsAny(text, ["fraud", "alert", "security", "risk", "suspicious"])) {
    const alert = highAlerts[0];

    if (isPidgin) {
      return alert
        ? `${alert.title}: ${alert.message} Risk level na ${alert.severity}.`
        : "I no see high-risk fraud alert right now.";
    }

    return alert ? `${alert.title}: ${alert.message} Risk level: ${alert.severity}.` : "No high-risk fraud alerts are active right now.";
  }

  if (containsAny(text, ["data", "usage", "app", "using"])) {
    const breakdown = topUsage.map((item) => `${item._id}: ${formatMb(item.amountMb)}`).join("; ");

    if (isPidgin) {
      return breakdown
        ? `Your top data apps na ${breakdown}. ${top?._id} dey consume pass.`
        : "I never get enough usage data yet. Turn on tracking or use demo mode.";
    }

    return breakdown
      ? `Your top data apps are ${breakdown}. ${top?._id} is currently the highest consumer.`
      : "I do not have enough usage data yet. Enable tracking or start demo mode.";
  }

  if (isPidgin) {
    return top
      ? `${top._id} dey chop your data pass: about ${formatMb(top.amountMb)}. Ask me about subscriptions, fraud, background data, or tips.`
      : "I never get enough usage data yet. Turn on tracking or use demo mode.";
  }

  return top
    ? `${top._id} is your highest data consumer at about ${formatMb(top.amountMb)}. Ask me about subscriptions, fraud, background data, or tips.`
    : "I do not have enough usage data yet. Enable tracking or start demo mode.";
}
