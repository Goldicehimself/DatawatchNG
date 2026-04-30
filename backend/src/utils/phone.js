const NETWORK_PREFIXES = {
  MTN: ["0803", "0806", "0703", "0706", "0813", "0816", "0810", "0814", "0903", "0906", "0913", "0916"],
  Airtel: ["0802", "0808", "0708", "0812", "0701", "0902", "0907", "0901", "0912"],
  Glo: ["0805", "0807", "0705", "0811", "0815", "0905", "0915"],
  "9mobile": ["0809", "0817", "0818", "0909", "0908"]
};

export function normalizeNigerianPhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");

  if (digits.startsWith("234") && digits.length === 13) {
    return `+${digits}`;
  }

  if (digits.startsWith("0") && digits.length === 11) {
    return `+234${digits.slice(1)}`;
  }

  if (digits.length === 10) {
    return `+234${digits}`;
  }

  return null;
}

export function detectNetwork(phone) {
  const normalized = normalizeNigerianPhone(phone);

  if (!normalized) {
    return null;
  }

  const localPrefix = `0${normalized.slice(4, 7)}`;
  return Object.entries(NETWORK_PREFIXES).find(([, prefixes]) => prefixes.includes(localPrefix))?.[0] || null;
}
