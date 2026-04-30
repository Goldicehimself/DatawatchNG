import Alert from "../models/Alert.js";
import Subscription from "../models/Subscription.js";
import UsageRecord from "../models/UsageRecord.js";

export async function runFraudScan(user) {
  const createdAlerts = [];
  const sinceYesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const heavyBackground = await UsageRecord.findOne({
    user: user._id,
    isBackground: true,
    amountMb: { $gte: 300 },
    recordedAt: { $gte: sinceYesterday }
  }).sort({ amountMb: -1 });

  if (heavyBackground) {
    createdAlerts.push(
      await Alert.create({
        user: user._id,
        type: "background_usage",
        severity: heavyBackground.amountMb >= 700 ? "high" : "medium",
        title: "Background data risk",
        message: `${heavyBackground.appName} used ${Math.round(heavyBackground.amountMb)}MB in the background.`,
        metadata: { usageRecord: heavyBackground._id }
      })
    );
  }

  const hiddenSubscription = await Subscription.findOne({
    user: user._id,
    isHidden: true,
    status: { $ne: "cancelled" }
  }).sort({ riskSeverity: -1 });

  if (hiddenSubscription) {
    createdAlerts.push(
      await Alert.create({
        user: user._id,
        type: "subscription_charge",
        severity: hiddenSubscription.riskSeverity,
        title: "Suspicious subscription detected",
        message: `${hiddenSubscription.serviceName} is hidden and may be charging without clear consent.`,
        metadata: { subscription: hiddenSubscription._id }
      })
    );
  }

  return createdAlerts;
}
