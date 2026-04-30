import Alert from "../models/Alert.js";
import Subscription from "../models/Subscription.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { httpError } from "../utils/httpError.js";

export const listSubscriptions = asyncHandler(async (req, res) => {
  const subscriptions = await Subscription.find({ user: req.user._id }).sort({ riskSeverity: -1, createdAt: -1 });
  res.json({ success: true, subscriptions });
});

export const cancelSubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { status: "cancelled", cancelledAt: new Date() },
    { new: true }
  );

  if (!subscription) {
    throw httpError(404, "Subscription not found");
  }

  await Alert.create({
    user: req.user._id,
    type: "subscription_charge",
    severity: "low",
    title: "Subscription cancellation simulated",
    message: `${subscription.serviceName} has been marked as cancelled in DataWatch NG.`,
    metadata: { subscription: subscription._id }
  });

  res.json({ success: true, subscription });
});
