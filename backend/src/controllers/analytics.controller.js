import Alert from "../models/Alert.js";
import Subscription from "../models/Subscription.js";
import UsageRecord from "../models/UsageRecord.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const match = { user: req.user._id, recordedAt: { $gte: since } };

  const [summary] = await UsageRecord.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalMb: { $sum: "$amountMb" },
        backgroundMb: { $sum: { $cond: ["$isBackground", "$amountMb", 0] } },
        records: { $sum: 1 }
      }
    }
  ]);

  const appBreakdown = await UsageRecord.aggregate([
    { $match: match },
    { $group: { _id: "$appName", amountMb: { $sum: "$amountMb" } } },
    { $sort: { amountMb: -1 } },
    { $limit: 8 }
  ]);

  const dailyUsage = await UsageRecord.aggregate([
    { $match: match },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$recordedAt" } }, amountMb: { $sum: "$amountMb" } } },
    { $sort: { _id: 1 } }
  ]);

  const hourlyHeatmap = await UsageRecord.aggregate([
    { $match: match },
    { $group: { _id: { $hour: "$recordedAt" }, amountMb: { $sum: "$amountMb" } } },
    { $sort: { _id: 1 } }
  ]);

  const subscriptionSpend = await Subscription.aggregate([
    { $match: { user: req.user._id } },
    { $group: { _id: "$status", amount: { $sum: "$amount" }, count: { $sum: 1 } } }
  ]);

  const fraudTimeline = await Alert.find({ user: req.user._id, type: { $in: ["fraud", "abnormal_spike", "subscription_charge"] } })
    .sort({ createdAt: -1 })
    .limit(10);

  res.json({
    success: true,
    summary: summary || { totalMb: 0, backgroundMb: 0, records: 0 },
    appBreakdown,
    dailyUsage,
    hourlyHeatmap,
    subscriptionSpend,
    fraudTimeline
  });
});
