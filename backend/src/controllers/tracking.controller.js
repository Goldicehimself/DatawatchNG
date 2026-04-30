import Alert from "../models/Alert.js";
import UsageRecord from "../models/UsageRecord.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createUsageRecord = asyncHandler(async (req, res) => {
  const record = await UsageRecord.create({
    user: req.user._id,
    appName: req.body.appName,
    category: req.body.category || "General",
    amountMb: req.body.amountMb,
    isBackground: Boolean(req.body.isBackground),
    network: req.body.network || req.user.network,
    recordedAt: req.body.recordedAt ? new Date(req.body.recordedAt) : new Date()
  });

  if (record.isBackground && record.amountMb >= 300) {
    await Alert.create({
      user: req.user._id,
      type: "background_usage",
      severity: record.amountMb >= 700 ? "high" : "medium",
      title: "Heavy background data detected",
      message: `${record.appName} used ${Math.round(record.amountMb)}MB in the background.`,
      metadata: { usageRecord: record._id }
    });
  }

  res.status(201).json({ success: true, record });
});

export const listUsageRecords = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 100), 500);
  const records = await UsageRecord.find({ user: req.user._id }).sort({ recordedAt: -1 }).limit(limit);
  res.json({ success: true, records });
});
