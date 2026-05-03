"use client";

import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { loginWithPin, requestOtp, verifyOtp } from "@/lib/api";
import { useAppStore } from "@/lib/app-store";
import { cn } from "@/lib/utils";

const networkStyles: Record<string, string> = {
  MTN: "bg-[#FFCC00] text-[#111]",
  Airtel: "bg-[#E60012] text-white",
  Glo: "bg-[#008751] text-white",
  "9mobile": "bg-[#87B818] text-white",
};

function detectNetwork(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const local = digits.startsWith("234")
    ? `0${digits.slice(3)}`
    : digits.startsWith("0")
      ? digits
      : `0${digits}`;
  const prefix = local.slice(1, 4);

  if (
    [
      "803",
      "806",
      "703",
      "706",
      "813",
      "816",
      "810",
      "814",
      "903",
      "906",
      "913",
      "916",
    ].includes(prefix)
  ) {
    return "MTN";
  }

  if (
    ["802", "808", "708", "812", "701", "901", "902", "907", "912"].includes(
      prefix,
    )
  ) {
    return "Airtel";
  }

  if (["805", "807", "705", "811", "815", "905", "915"].includes(prefix)) {
    return "Glo";
  }

  if (["809", "817", "818", "908", "909"].includes(prefix)) {
    return "9mobile";
  }

  return "";
}

function normalizeLocalPhone(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("234")) {
    return digits.slice(3, 13);
  }

  if (digits.startsWith("0")) {
    return digits.slice(0, 11);
  }

  return digits.slice(0, 10);
}

function toBackendPhone(localPhone: string) {
  const digits = localPhone.replace(/\D/g, "");

  if (digits.startsWith("0")) {
    return `+234${digits.slice(1)}`;
  }

  return `+234${digits}`;
}

export function PhoneAuth({
  initialMode = "create",
}: {
  initialMode?: "create" | "signin";
}) {
  const router = useRouter();
  const setSession = useAppStore((state) => state.setSession);
  const logout = useAppStore((state) => state.logout);
  const [fullName, setFullName] = useState("");
  const [localPhone, setLocalPhone] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [mode, setMode] = useState<"create" | "signin">(initialMode);
  const [step, setStep] = useState<"phone" | "otp" | "success">("phone");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(42);
  const [demoCode, setDemoCode] = useState("");
  const [error, setError] = useState("");
  const [accountNotFound, setAccountNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  const phone = useMemo(() => toBackendPhone(localPhone), [localPhone]);
  const network = useMemo(() => detectNetwork(phone), [phone]);
  const otpValue = otp.join("");
  const phoneReady = phone.replace(/\D/g, "").length === 13;
  const pinReady = /^\d{4}$/.test(pin);
  const createReady =
    phoneReady && fullName.trim().length >= 2 && pinReady && pin === confirmPin;
  const signinReady = phoneReady && pinReady;

  function normalizePin(value: string) {
    return value.replace(/\D/g, "").slice(0, 4);
  }

  async function submitPhone() {
    setLoading(true);
    setError("");
    setAccountNotFound(false);

    try {
      if (mode === "signin") {
        const response = await loginWithPin(phone, pin);
        setSession(
          response.token,
          response.user.phone,
          response.user.network,
          response.user.settings,
          response.user.isDemo,
          response.user.fullName || "",
        );
        setStep("success");
        setTimeout(() => router.push("/dashboard"), 700);
        return;
      }

      if (pin !== confirmPin) {
        setError("PINs do not match");
        return;
      }

      const response = await requestOtp(phone, mode, pin);
      setDemoCode(response.demoCode || "");
      setSeconds(response.resendAfterSeconds || 60);
      setStep("otp");
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Unable to send OTP. Check the backend connection.";

      setAccountNotFound(
        mode === "signin" &&
          (message.toLowerCase().includes("no account found") ||
            message.toLowerCase().includes("create an account")),
      );
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function changeMode(nextMode: "create" | "signin") {
    logout();
    setMode(nextMode);
    setStep("phone");
    setOtp(["", "", "", "", "", ""]);
    setPin("");
    setConfirmPin("");
    setError("");
    setAccountNotFound(false);
  }

  async function submitOtp(code: string) {
    setLoading(true);
    setError("");

    try {
      const response = await verifyOtp(
        phone,
        code,
        network || "MTN",
        mode,
        pin,
        fullName.trim(),
      );
      setSession(
        response.token,
        response.user.phone,
        response.user.network,
        response.user.settings,
        response.user.isDemo,
        response.user.fullName || fullName.trim(),
      );
      setStep("success");
      setTimeout(() => router.push("/dashboard"), 700);
    } catch (verifyError) {
      setError(
        verifyError instanceof Error
          ? verifyError.message
          : "Invalid OTP. Try again.",
      );
      setOtp(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  function updateOtp(index: number, value: string) {
    const next = [...otp];
    next[index] = value.replace(/\D/g, "").slice(0, 1);
    setOtp(next);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    if (next.join("").length === 6) {
      void submitOtp(next.join(""));
    }
  }

  return (
    <main className="auth-screen min-h-screen bg-[#FAFAFA] px-6 py-6 text-[#0A0A0A] dark:bg-[#020805] dark:text-[#F4FFF9]">
      <div className="mx-auto min-h-[calc(100vh-48px)] w-full max-w-md">
        <header className="relative flex items-center justify-between">
          <Link
            href="/"
            aria-label="Back"
            className="auth-icon-button flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#0A0A0A] shadow-[0_10px_28px_rgba(15,23,42,0.06)] dark:bg-[#0D1A13] dark:text-[#FFFFFF]"
          >
            <ArrowLeft size={22} strokeWidth={1.6} />
          </Link>
          <div className="auth-logo absolute left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-[0_10px_28px_rgba(15,23,42,0.08)] dark:bg-[#0D1A13]">
            <Image
              src="/datawatchimg-removebg-preview.png"
              alt="DataWatch NG"
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div className="h-12 w-12" />
        </header>

        <div className="auth-segment mt-10 rounded-full bg-black/[0.03] p-1 dark:bg-white/[0.10]">
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => changeMode("create")}
              className={cn(
                "h-12 rounded-full text-sm font-semibold transition",
                mode === "create"
                  ? "bg-black text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)] dark:bg-[#00A866] dark:text-[#03100A]"
                  : "text-[#6B7280] dark:text-[#F4FFF9]",
              )}
            >
              Create account
            </button>
            <button
              type="button"
              onClick={() => changeMode("signin")}
              className={cn(
                "h-12 rounded-full text-sm font-semibold transition",
                mode === "signin"
                  ? "bg-black text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)] dark:bg-[#00A866] dark:text-[#03100A]"
                  : "text-[#6B7280] dark:text-[#F4FFF9]",
              )}
            >
              Sign in
            </button>
          </div>
        </div>

        {step === "phone" ? (
          <section className="mt-10">
            <h1 className="text-[28px] leading-tight font-bold tracking-[-0.03em]">
              {mode === "create" ? "Create your account" : "Sign in"}
            </h1>
            <p className="mt-3 text-base text-[#6B7280] dark:text-[#D8E2DD]">
              {mode === "create"
                ? "Add your name, Nigerian number, and a secure 4-digit PIN."
                : "Enter your Nigerian number and PIN to continue."}
            </p>

            {mode === "create" ? (
              <div className="mt-8">
              <label
                className="text-xs font-bold tracking-[0.14em] text-[#6B7280] uppercase dark:text-[#D8E2DD]"
                htmlFor="full-name"
              >
                Full name
              </label>
              <div className="auth-input mt-3 flex h-14 items-center gap-3 rounded-[16px] border border-black/10 bg-white px-4 transition focus-within:border-[#008751] focus-within:ring-4 focus-within:ring-[#008751]/10 dark:border-white/[0.14] dark:bg-[#0D1A13] dark:focus-within:border-[#2EE68F]">
                <User size={19} strokeWidth={1.5} className="text-[#8A8F98] dark:text-[#D8E2DD]" />
                <input
                  id="full-name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-base font-semibold outline-none"
                  placeholder="Beauty Al"
                />
              </div>
            </div>
            ) : null}

            <div className={mode === "create" ? "mt-7" : "mt-8"}>
              <label
                className="text-xs font-bold tracking-[0.14em] text-[#6B7280] uppercase dark:text-[#D8E2DD]"
                htmlFor="phone"
              >
                Phone
              </label>
              <div className="mt-3">
                <div
                  className={cn(
                    "auth-input flex h-14 items-center gap-3 rounded-[16px] border bg-white px-4 transition focus-within:border-[#008751] focus-within:ring-4 focus-within:ring-[#008751]/10 dark:bg-[#0D1A13] dark:focus-within:border-[#2EE68F]",
                    network
                      ? "border-[#008751] shadow-[0_18px_44px_rgba(0,135,81,0.08)] dark:border-[#2EE68F]"
                      : "border-black/10 dark:border-white/[0.14]",
                  )}
                >
                  <Phone
                    size={19}
                    strokeWidth={1.5}
                    className="shrink-0 text-[#8A8F98] dark:text-[#D8E2DD]"
                  />
                  <span className="shrink-0 text-base font-bold">+234</span>
                  <span className="h-7 w-px bg-black/10 dark:bg-white/[0.16]" />
                  <input
                    id="phone"
                    value={localPhone}
                    onChange={(event) => {
                      setLocalPhone(normalizeLocalPhone(event.target.value));
                      setError("");
                      setAccountNotFound(false);
                    }}
                    inputMode="tel"
                    className="min-w-0 flex-1 bg-transparent text-base font-semibold tracking-wide outline-none"
                    placeholder="08025341245"
                  />
                  {network ? (
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-3 py-1.5 text-xs font-black shadow-[0_8px_18px_rgba(15,23,42,0.10)]",
                        networkStyles[network],
                      )}
                    >
                      {network}
                    </span>
                  ) : null}
                </div>
              </div>
              {network ? (
                <p className="mt-3 text-sm font-bold text-[#008751] dark:text-[#2EE68F]">
                  Detected network: {network}
                </p>
              ) : null}
            </div>

            <div className="mt-7">
              <label
                className="text-xs font-bold tracking-[0.14em] text-[#6B7280] uppercase dark:text-[#D8E2DD]"
                htmlFor="pin"
              >
                {mode === "create" ? "Create 4-digit PIN" : "4-digit PIN"}
              </label>
              <div className="auth-input mt-3 flex h-14 items-center gap-3 rounded-[16px] border border-black/10 bg-white px-4 transition focus-within:border-[#008751] focus-within:ring-4 focus-within:ring-[#008751]/10 dark:border-white/[0.14] dark:bg-[#0D1A13] dark:focus-within:border-[#2EE68F]">
                <ShieldCheck
                  size={19}
                  strokeWidth={1.5}
                  className="text-[#8A8F98] dark:text-[#D8E2DD]"
                />
                <input
                  id="pin"
                  value={pin}
                  onChange={(event) => {
                    setPin(normalizePin(event.target.value));
                    setError("");
                  }}
                  inputMode="numeric"
                  type="password"
                  className="min-w-0 flex-1 bg-transparent text-base font-semibold tracking-[0.32em] outline-none"
                  placeholder="0000"
                  maxLength={4}
                />
              </div>
            </div>

            {mode === "create" ? (
              <div className="mt-7">
                <label
                  className="text-xs font-bold tracking-[0.14em] text-[#6B7280] uppercase dark:text-[#D8E2DD]"
                  htmlFor="confirm-pin"
                >
                  Confirm PIN
                </label>
                <div
                  className={cn(
                    "auth-input mt-3 flex h-14 items-center gap-3 rounded-[16px] border bg-white px-4 transition focus-within:border-[#008751] focus-within:ring-4 focus-within:ring-[#008751]/10 dark:bg-[#0D1A13] dark:focus-within:border-[#2EE68F]",
                    confirmPin && pin !== confirmPin
                      ? "border-red-300 dark:border-red-400"
                      : "border-black/10 dark:border-white/[0.14]",
                  )}
                >
                  <ShieldCheck
                    size={19}
                    strokeWidth={1.5}
                    className="text-[#8A8F98] dark:text-[#D8E2DD]"
                  />
                  <input
                    id="confirm-pin"
                    value={confirmPin}
                    onChange={(event) => {
                      setConfirmPin(normalizePin(event.target.value));
                      setError("");
                    }}
                    inputMode="numeric"
                    type="password"
                    className="min-w-0 flex-1 bg-transparent text-base font-semibold tracking-[0.32em] outline-none"
                    placeholder="0000"
                    maxLength={4}
                  />
                </div>
                {confirmPin && pin !== confirmPin ? (
                  <p className="mt-3 text-sm font-semibold text-red-600">
                    PINs do not match.
                  </p>
                ) : null}
              </div>
            ) : null}

            <Button
              className="mt-9 h-14 w-full rounded-[16px] bg-[#008751] text-base font-bold shadow-[0_18px_34px_rgba(0,135,81,0.18)]"
              onClick={submitPhone}
              disabled={(mode === "create" ? !createReady : !signinReady) || loading}
            >
              {loading
                ? mode === "create"
                  ? "Sending..."
                  : "Signing in..."
                : mode === "create"
                  ? "Send verification code"
                  : "Sign in"}
            </Button>

            {error ? (
              <div className="mt-4 rounded-[16px] bg-red-50 p-4 text-center">
                <p className="text-sm font-semibold text-red-600">{error}</p>
                {accountNotFound ? (
                  <Button
                    type="button"
                    variant="secondary"
                    className="mt-3 h-10 rounded-[12px] border-red-100 bg-white text-sm text-[#0A0A0A]"
                    onClick={() => changeMode("create")}
                  >
                    Create account instead
                  </Button>
                ) : null}
              </div>
            ) : null}

            <p className="mx-auto mt-6 max-w-sm text-center text-xs leading-6 text-[#6B7280] dark:text-[#D8E2DD]">
              By continuing you agree to DataWatch NG&apos;s terms & privacy.
              <br />
              We never sell your data.
            </p>
          </section>
        ) : null}

        {step === "otp" ? (
          <section className="mt-10">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#FFCC00]/30 text-[#0A0A0A]">
              <ShieldCheck size={24} strokeWidth={1.5} />
            </div>
            <h1 className="text-[28px] leading-tight font-bold tracking-[-0.03em]">
              Enter verification code
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#6B7280] dark:text-[#D8E2DD]">
              We sent a 6-digit code to {phone}.
            </p>
            {demoCode ? (
              <p className="mt-4 rounded-[14px] bg-[#008751]/10 px-4 py-3 text-sm font-semibold text-[#005C35] dark:bg-[#00A866]/18 dark:text-[#54F2AB]">
                Demo OTP: {demoCode}
              </p>
            ) : null}
            <div className="mt-8 grid grid-cols-6 gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(node) => {
                    inputs.current[index] = node;
                  }}
                  value={digit}
                  onChange={(event) => updateOtp(index, event.target.value)}
                  inputMode="numeric"
                  className="auth-input h-12 rounded-[14px] border border-black/10 bg-white text-center text-xl font-semibold dark:border-white/[0.14] dark:bg-[#0D1A13]"
                  maxLength={1}
                  aria-label={`OTP digit ${index + 1}`}
                  autoFocus={index === 0}
                />
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between text-sm text-[#6B7280] dark:text-[#D8E2DD]">
              <span>Resend in {seconds}s</span>
              {otpValue.length === 6 || loading ? (
                <span className="inline-flex items-center gap-2 text-[#008751] dark:text-[#2EE68F]">
                  <Loader2 size={16} strokeWidth={1.5} className="animate-spin" />
                  Verifying
                </span>
              ) : null}
            </div>
            {error ? (
              <p className="mt-4 text-sm font-semibold text-red-600">{error}</p>
            ) : null}
          </section>
        ) : null}

        {step === "success" ? (
          <section className="mt-20 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#008751]/10 text-[#008751]">
              <CheckCircle2 size={32} strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-black">Verification complete</h1>
            <p className="mt-3 text-sm leading-6 text-[#6B7280] dark:text-[#D8E2DD]">
              Your monitoring session is ready.
            </p>
            <ButtonLink href="/dashboard" className="mt-6 w-full">
              Continue to dashboard
            </ButtonLink>
          </section>
        ) : null}
      </div>
    </main>
  );
}
