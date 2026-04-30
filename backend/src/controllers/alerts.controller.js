import Alert from "../models/Alert.js";
import { runFraudScan } from "../services/fraud.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listAlerts = asyncHandler(async (req, res) => {
  const alerts = await Alert.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(100);
  res.json({ success: true, alerts });
});

export const markAlertRead = asyncHandler(async (req, res) => {
  const alert = await Alert.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { readAt: new Date() },
    { new: true }
  );
  res.json({ success: true, alert });
});

export const scanForFraud = asyncHandler(async (req, res) => {
  const alerts = await runFraudScan(req.user);
  res.status(201).json({ success: true, alerts });
});
