import twilio from "twilio";

let client;

export function getTwilioClient() {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    throw new Error("Twilio credentials are not configured");
  }

  if (!client) {
    client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }

  return client;
}

export function getTwilioVerifyServiceSid() {
  if (!process.env.TWILIO_VERIFY_SERVICE_SID) {
    throw new Error("TWILIO_VERIFY_SERVICE_SID is not configured");
  }

  return process.env.TWILIO_VERIFY_SERVICE_SID;
}
