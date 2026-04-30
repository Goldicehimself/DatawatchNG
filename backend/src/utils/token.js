import crypto from "crypto";

function getSecret() {
  return process.env.SESSION_SECRET || "watcher-dev-secret";
}

function toBase64Url(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

export function signSession(payload) {
  const body = {
    ...payload,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 30
  };
  const encoded = toBase64Url(body);
  const signature = crypto.createHmac("sha256", getSecret()).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

export function verifySession(token) {
  if (!token || !token.includes(".")) {
    return null;
  }

  const [encoded, signature] = token.split(".");
  const expected = crypto.createHmac("sha256", getSecret()).update(encoded).digest("base64url");

  if (!signature || signature.length !== expected.length) {
    return null;
  }

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }

  const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  return payload.exp > Date.now() ? payload : null;
}
