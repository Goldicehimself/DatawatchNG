import { http } from "@/lib/http";

export type BackendUser = {
  _id: string;
  phone: string;
  fullName?: string;
  network: string;
  isDemo: boolean;
  settings?: {
    aiLanguage?: "english" | "pidgin";
    trackingEnabled?: boolean;
    notifications?: Record<string, unknown>;
  };
};

export type UsageRecord = {
  _id: string;
  appName: string;
  category: string;
  amountMb: number;
  isBackground: boolean;
  recordedAt: string;
};

export type DashboardData = {
  summary: {
    totalMb: number;
    backgroundMb: number;
    records: number;
  };
  appBreakdown: Array<{ _id: string; amountMb: number }>;
  dailyUsage: Array<{ _id: string; amountMb: number }>;
  hourlyHeatmap: Array<{ _id: number; amountMb: number }>;
  subscriptionSpend: Array<{ _id: string; amount: number; count: number }>;
  fraudTimeline: BackendAlert[];
};

export type BackendAlert = {
  _id: string;
  type: string;
  severity: "low" | "medium" | "high";
  title: string;
  message: string;
  createdAt: string;
  flaggedAt?: string;
  readAt?: string;
};

export type BackendSubscription = {
  _id: string;
  provider: string;
  serviceName: string;
  amount: number;
  billingCycle: string;
  status: "active" | "flagged" | "cancelled";
  isHidden: boolean;
  riskSeverity: "low" | "medium" | "high";
};

export type BackendChatMessage = {
  _id: string;
  role: "assistant" | "user";
  content: string;
  language: "english" | "pidgin";
  channel: "app" | "whatsapp" | "voice";
};

export async function requestOtp(phone: string, mode: "create" | "signin" = "create", pin?: string) {
  const { data } = await http.post<{
    success: boolean;
    phone: string;
    mode: "create" | "signin";
    network: string;
    provider: string;
    demoCode?: string;
    resendAfterSeconds: number;
  }>("/auth/request-otp", { phone, mode, pin });
  return data;
}

export async function verifyOtp(
  phone: string,
  code: string,
  network?: string,
  mode: "create" | "signin" = "create",
  pin?: string,
  fullName?: string,
) {
  const { data } = await http.post<{
    success: boolean;
    token: string;
    user: BackendUser;
  }>("/auth/verify-otp", { phone, code, network, mode, pin, fullName });
  return data;
}

export async function loginWithPin(phone: string, pin: string) {
  const { data } = await http.post<{
    success: boolean;
    token: string;
    user: BackendUser;
  }>("/auth/login-pin", { phone, pin });
  return data;
}

export async function changePin(currentPin: string, newPin: string) {
  const { data } = await http.patch<{ success: boolean; user: BackendUser }>("/settings/pin", {
    currentPin,
    newPin,
  });
  return data;
}

export async function startDemo(network = "MTN") {
  const { data } = await http.post<{
    success: boolean;
    token: string;
    user: BackendUser;
  }>("/demo/start", { network });
  return data;
}

export async function getDashboard() {
  const { data } = await http.get<DashboardData & { success: boolean }>("/analytics/dashboard");
  return data;
}

export async function getUsageRecords() {
  const { data } = await http.get<{ success: boolean; records: UsageRecord[] }>("/tracking/usage");
  return data.records;
}

export async function getAlerts() {
  const { data } = await http.get<{ success: boolean; alerts: BackendAlert[] }>("/alerts");
  return data.alerts;
}

export async function markAlertRead(id: string) {
  const { data } = await http.patch<{ success: boolean; alert: BackendAlert }>(`/alerts/${id}/read`);
  return data.alert;
}

export async function flagAlert(id: string) {
  const { data } = await http.patch<{ success: boolean; alert: BackendAlert }>(`/alerts/${id}/flag`);
  return data.alert;
}

export async function scanAlerts() {
  const { data } = await http.post<{ success: boolean; alerts: BackendAlert[] }>("/alerts/scan");
  return data.alerts;
}

export async function getSubscriptions() {
  const { data } = await http.get<{ success: boolean; subscriptions: BackendSubscription[] }>("/subscriptions");
  return data.subscriptions;
}

export async function cancelSubscription(id: string) {
  const { data } = await http.post<{ success: boolean; subscription: BackendSubscription }>(`/subscriptions/${id}/cancel`);
  return data.subscription;
}

export async function getChatHistory() {
  const { data } = await http.get<{ success: boolean; messages: BackendChatMessage[] }>("/assistant/messages");
  return data.messages;
}

export async function sendAssistantMessage(message: string, language: "english" | "pidgin") {
  const { data } = await http.post<{ success: boolean; messages: BackendChatMessage[] }>("/assistant/messages", {
    message,
    language,
  });
  return data.messages;
}

export async function updateSettings(settings: Record<string, unknown>) {
  const { data } = await http.patch<{ success: boolean; user: BackendUser }>("/settings", settings);
  return data.user;
}

export function formatDataAmount(amountMb = 0) {
  return amountMb >= 1024 ? `${(amountMb / 1024).toFixed(1)}GB` : `${Math.round(amountMb)}MB`;
}

export function formatNaira(amount = 0) {
  return `N${Number(amount).toLocaleString()}`;
}

export function toUsageBars(dailyUsage: DashboardData["dailyUsage"] = []) {
  const dayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const totals = Object.fromEntries(dayOrder.map((day) => [day, 0])) as Record<string, number>;

  for (const item of dailyUsage) {
    const day = new Date(item._id).toLocaleDateString("en", { weekday: "short" });

    if (day in totals) {
      totals[day] += item.amountMb;
    }
  }

  return dayOrder.map((day) => ({
    day,
    value: totals[day],
  }));
}

export function toProgressRows(appBreakdown: DashboardData["appBreakdown"] = [], totalMb = 0) {
  return appBreakdown.map((app) => ({
    name: app._id,
    value: formatDataAmount(app.amountMb),
    percent: totalMb ? Math.max(8, Math.round((app.amountMb / totalMb) * 100)) : 0,
  }));
}
