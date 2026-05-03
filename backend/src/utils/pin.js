import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "crypto";
import { promisify } from "util";

import { httpError } from "./httpError.js";

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;

export function assertValidPin(pin, label = "PIN") {
  if (!/^\d{4}$/.test(String(pin || ""))) {
    throw httpError(400, `${label} must be exactly 4 digits`);
  }
}

export async function hashPin(pin) {
  assertValidPin(pin);
  const salt = randomBytes(16).toString("hex");
  const derivedKey = await scrypt(pin, salt, KEY_LENGTH);

  return {
    pinHash: derivedKey.toString("hex"),
    pinSalt: salt
  };
}

export async function verifyPin(pin, pinHash, pinSalt) {
  if (!pinHash || !pinSalt || !/^\d{4}$/.test(String(pin || ""))) {
    return false;
  }

  const derivedKey = await scrypt(pin, pinSalt, KEY_LENGTH);
  const storedKey = Buffer.from(pinHash, "hex");

  if (storedKey.length !== derivedKey.length) {
    return false;
  }

  return timingSafeEqual(storedKey, derivedKey);
}
