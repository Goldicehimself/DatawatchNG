import crypto from "crypto";
import https from "https";

import { getTwilioClient, getTwilioVerifyServiceSid } from "../config/twilio.js";
import Otp from "../models/Otp.js";

function hashCode(phone, code) {
  return crypto.createHash("sha256").update(`${phone}:${code}:${process.env.SESSION_SECRET || "watcher-dev-secret"}`).digest("hex");
}

function getOtpProvider() {
  return String(process.env.OTP_PROVIDER || "local").trim().toLowerCase();
}

function isDemoOtpEnabled() {
  return String(process.env.ENABLE_DEMO_OTP || "false").trim().toLowerCase() === "true";
}

function shouldUseTwilio() {
  return getOtpProvider() === "twilio" && !isDemoOtpEnabled();
}

function shouldUseSendchamp() {
  return getOtpProvider() === "sendchamp" && !isDemoOtpEnabled();
}

function getSendchampPhone(phone) {
  return phone.replace(/^\+/, "");
}

function getSendchampChannel() {
  const channel = String(process.env.SENDCHAMP_OTP_CHANNEL || "sms").trim().toLowerCase();
  const channels = {
    sms: "sms",
    voice: "voice",
    whatsapp: "whatsapp",
    whats_app: "whatsapp",
    email: "email"
  };

  return channels[channel] || "sms";
}

function getSendchampReference(responseBody) {
  return (
    responseBody?.data?.verification_reference ||
    responseBody?.data?.reference ||
    responseBody?.verification_reference ||
    responseBody?.reference
  );
}

function isSendchampApproved(responseBody) {
  const status = String(responseBody?.data?.status || responseBody?.status || responseBody?.message || "").toLowerCase();
  return Boolean(responseBody?.data?.verified || responseBody?.verified || status.includes("success") || status.includes("verified"));
}

async function callSendchamp(path, payload) {
  if (!process.env.SENDCHAMP_API_KEY) {
    throw new Error("SENDCHAMP_API_KEY is not configured");
  }

  const baseUrl = process.env.SENDCHAMP_BASE_URL || "https://api.sendchamp.com/api/v1";
  const url = new URL(`${baseUrl.replace(/\/$/, "")}${path}`);
  const requestBody = JSON.stringify(payload);

  return new Promise((resolve, reject) => {
    const request = https.request(
      url,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${process.env.SENDCHAMP_API_KEY}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(requestBody)
        },
        timeout: 20000
      },
      (response) => {
        let responseBody = "";

        response.on("data", (chunk) => {
          responseBody += chunk;
        });

        response.on("end", () => {
          const body = responseBody ? JSON.parse(responseBody) : {};

          if (response.statusCode < 200 || response.statusCode >= 300) {
            reject(new Error(body?.message || body?.error || `Sendchamp OTP request failed with HTTP ${response.statusCode}`));
            return;
          }

          resolve(body);
        });
      }
    );

    request.on("timeout", () => {
      request.destroy(new Error("Sendchamp network request timed out"));
    });

    request.on("error", (error) => {
      reject(new Error(`Sendchamp network request failed: ${error.code || ""} ${error.message}`.trim()));
    });

    request.write(requestBody);
    request.end();
  });
}

async function createTwilioOtp(phone) {
  const verification = await getTwilioClient().verify.v2
    .services(getTwilioVerifyServiceSid())
    .verifications.create({
      to: phone,
      channel: process.env.TWILIO_VERIFY_CHANNEL || "sms"
    });

  return {
    provider: "twilio",
    status: verification.status
  };
}

async function verifyTwilioOtp(phone, code) {
  const check = await getTwilioClient().verify.v2
    .services(getTwilioVerifyServiceSid())
    .verificationChecks.create({
      to: phone,
      code
    });

  return check.status === "approved";
}

async function createSendchampOtp(phone, authMode) {
  const ttlMinutes = Number(process.env.OTP_TTL_MINUTES || 10);
  const body = await callSendchamp("/verification/create", {
    channel: getSendchampChannel(),
    sender: process.env.SENDCHAMP_SENDER || "DataWatch",
    token_type: "numeric",
    token_length: Number(process.env.SENDCHAMP_OTP_LENGTH || 6),
    expiration_time: ttlMinutes,
    customer_mobile_number: getSendchampPhone(phone),
    meta_data: {
      app: "DataWatch NG"
    }
  });
  const reference = getSendchampReference(body);

  if (!reference) {
    throw new Error("Sendchamp did not return a verification reference");
  }

  await Otp.deleteMany({ phone, verifiedAt: null });
  await Otp.create({
    phone,
    authMode,
    provider: "sendchamp",
    providerReference: reference,
    expiresAt: new Date(Date.now() + ttlMinutes * 60 * 1000)
  });

  return {
    provider: "sendchamp",
    status: body?.status || "sent",
    expiresInMinutes: ttlMinutes
  };
}

async function verifySendchampOtp(phone, code, authMode) {
  const otp = await Otp.findOne({ phone, authMode, provider: "sendchamp", verifiedAt: null }).sort({ createdAt: -1 });

  if (!otp || otp.expiresAt < new Date()) {
    return false;
  }

  otp.attempts += 1;

  if (otp.attempts > 5) {
    await otp.save();
    return false;
  }

  const body = await callSendchamp("/verification/confirm", {
    verification_code: code,
    verification_reference: otp.providerReference
  });
  const valid = isSendchampApproved(body);

  if (valid) {
    otp.verifiedAt = new Date();
  }

  await otp.save();
  return valid;
}

export async function createOtp(phone, authMode = "create") {
  if (shouldUseTwilio()) {
    return createTwilioOtp(phone);
  }

  if (shouldUseSendchamp()) {
    return createSendchampOtp(phone, authMode);
  }

  const ttlMinutes = Number(process.env.OTP_TTL_MINUTES || 10);
  const demoCode = process.env.OTP_DEMO_CODE || "123456";
  const code = isDemoOtpEnabled() ? demoCode : String(crypto.randomInt(100000, 999999));

  await Otp.deleteMany({ phone, verifiedAt: null });

  await Otp.create({
    phone,
    authMode,
    provider: "local",
    codeHash: hashCode(phone, code),
    expiresAt: new Date(Date.now() + ttlMinutes * 60 * 1000)
  });

  return {
    provider: "local",
    code: isDemoOtpEnabled() ? code : undefined,
    expiresInMinutes: ttlMinutes
  };
}

export function getOtpProviderStatus() {
  if (isDemoOtpEnabled()) {
    return "local-demo";
  }

  return getOtpProvider();
}

export async function verifyOtp(phone, code, authMode = "create") {
  if (shouldUseTwilio()) {
    return verifyTwilioOtp(phone, code);
  }

  if (shouldUseSendchamp()) {
    return verifySendchampOtp(phone, code, authMode);
  }

  const otp = await Otp.findOne({ phone, authMode, verifiedAt: null }).sort({ createdAt: -1 });

  if (!otp || otp.expiresAt < new Date()) {
    return false;
  }

  otp.attempts += 1;

  if (otp.attempts > 5) {
    await otp.save();
    return false;
  }

  const valid = otp.codeHash === hashCode(phone, code);

  if (valid) {
    otp.verifiedAt = new Date();
  }

  await otp.save();
  return valid;
}
