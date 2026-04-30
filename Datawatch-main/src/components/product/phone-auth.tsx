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
import { requestOtp, verifyOtp } from "@/lib/api";
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

export function PhoneAuth() {
  const router = useRouter();
  const setSession = useAppStore((state) => state.setSession);
  const logout = useAppStore((state) => state.logout);
  const [fullName, setFullName] = useState("");
  const [localPhone, setLocalPhone] = useState("");
  const [mode, setMode] = useState<"create" | "signin">("create");
  const [step, setStep] = useState<"phone" | "otp" | "success">("phone");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(42);
  const [demoCode, setDemoCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  const phone = useMemo(() => toBackendPhone(localPhone), [localPhone]);
  const network = useMemo(() => detectNetwork(phone), [phone]);
  const otpValue = otp.join("");
  const phoneReady = phone.replace(/\D/g, "").length === 13;

  async function submitPhone() {
    setLoading(true);
    setError("");

    try {
      const response = await requestOtp(phone, mode);
      setDemoCode(response.demoCode || "");
      setSeconds(response.resendAfterSeconds || 60);
      setStep("otp");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to send OTP. Check the backend connection.",
      );
    } finally {
      setLoading(false);
    }
  }

  function changeMode(nextMode: "create" | "signin") {
    logout();
    setMode(nextMode);
    setStep("phone");
    setOtp(["", "", "", "", "", ""]);
    setError("");
  }

  async function submitOtp(code: string) {
    setLoading(true);
    setError("");

    try {
      const response = await verifyOtp(phone, code, network || "MTN", mode);
      setSession(response.token, response.user.phone, response.user.network);
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
    <main className="min-h-screen bg-[#FAFAFA] px-6 py-6 text-[#0A0A0A]">
      <div className="mx-auto min-h-[calc(100vh-48px)] w-full max-w-md">
        <header className="relative flex items-center justify-between">
          <Link
            href="/"
            aria-label="Back"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#0A0A0A] shadow-[0_10px_28px_rgba(15,23,42,0.06)]"
          >
            <ArrowLeft size={22} strokeWidth={1.6} />
          </Link>
          <div className="absolute left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
            <Image
              src="/datawatchimg-removebg-preview.png"
              alt="DataWatch NG"
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
            />
          </div>
          <div className="h-12 w-12" />
        </header>

        <div className="mt-10 rounded-full bg-black/[0.03] p-1">
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => changeMode("create")}
              className={cn(
                "h-12 rounded-full text-sm font-semibold transition",
                mode === "create"
                  ? "bg-black text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)]"
                  : "text-[#6B7280]",
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
                  ? "bg-black text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)]"
                  : "text-[#6B7280]",
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
            <p className="mt-3 text-base text-[#6B7280]">
              {mode === "create"
                ? "Just your name and Nigerian number."
                : "Enter your Nigerian number to continue."}
            </p>

            {mode === "create" ? (
              <div className="mt-8">
              <label
                className="text-xs font-bold tracking-[0.14em] text-[#6B7280] uppercase"
                htmlFor="full-name"
              >
                Full name
              </label>
              <div className="mt-3 flex h-14 items-center gap-3 rounded-[16px] border border-black/10 bg-white px-4 transition focus-within:border-[#008751] focus-within:ring-4 focus-within:ring-[#008751]/10">
                <User size={19} strokeWidth={1.5} className="text-[#8A8F98]" />
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
                className="text-xs font-bold tracking-[0.14em] text-[#6B7280] uppercase"
                htmlFor="phone"
              >
                Phone
              </label>
              <div className="relative mt-3">
                <div
                  className={cn(
                    "flex h-14 items-center gap-3 rounded-[16px] border bg-white px-4 transition focus-within:border-[#008751] focus-within:ring-4 focus-within:ring-[#008751]/10",
                    network
                      ? "border-[#008751] shadow-[0_18px_44px_rgba(0,135,81,0.08)]"
                      : "border-black/10",
                  )}
                >
                  <Phone
                    size={19}
                    strokeWidth={1.5}
                    className="shrink-0 text-[#8A8F98]"
                  />
                  <span className="shrink-0 text-base font-bold">+234</span>
                  <span className="h-7 w-px bg-black/10" />
                  <input
                    id="phone"
                    value={localPhone}
                    onChange={(event) =>
                      setLocalPhone(normalizeLocalPhone(event.target.value))
                    }
                    inputMode="tel"
                    className="min-w-0 flex-1 bg-transparent text-base font-semibold tracking-wide outline-none"
                    placeholder="08025341245"
                  />
                </div>
                {network ? (
                  <span
                    className={cn(
                      "absolute top-1/2 -right-4 -translate-y-1/2 rounded-full px-3 py-1.5 text-xs font-black lowercase shadow-[0_10px_22px_rgba(15,23,42,0.12)]",
                      networkStyles[network],
                    )}
                  >
                    {network}
                  </span>
                ) : null}
              </div>
              {network ? (
                <p className="mt-3 text-sm font-bold text-[#008751]">
                  Detected network: {network}
                </p>
              ) : null}
            </div>

            <Button
              className="mt-9 h-14 w-full rounded-[16px] bg-[#008751] text-base font-bold shadow-[0_18px_34px_rgba(0,135,81,0.18)]"
              onClick={submitPhone}
              disabled={!phoneReady || loading}
            >
              {loading
                ? "Sending..."
                : mode === "create"
                  ? "Send verification code"
                  : "Send sign-in code"}
            </Button>

            {error ? (
              <p className="mt-4 text-center text-sm font-semibold text-red-600">
                {error}
              </p>
            ) : null}

            <p className="mx-auto mt-6 max-w-sm text-center text-xs leading-6 text-[#6B7280]">
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
            <p className="mt-3 text-sm leading-6 text-[#6B7280]">
              We sent a 6-digit code to {phone}.
            </p>
            {demoCode ? (
              <p className="mt-4 rounded-[14px] bg-[#008751]/10 px-4 py-3 text-sm font-semibold text-[#005C35]">
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
                  className="h-12 rounded-[14px] border border-black/10 bg-white text-center text-xl font-semibold"
                  maxLength={1}
                  aria-label={`OTP digit ${index + 1}`}
                  autoFocus={index === 0}
                />
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between text-sm text-[#6B7280]">
              <span>Resend in {seconds}s</span>
              {otpValue.length === 6 || loading ? (
                <span className="inline-flex items-center gap-2 text-[#008751]">
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
            <p className="mt-3 text-sm leading-6 text-[#6B7280]">
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
