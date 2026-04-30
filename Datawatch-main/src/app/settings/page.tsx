"use client";

import { Camera, ChevronRight, Shield, User, Wifi } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { updateSettings } from "@/lib/api";
import { useAppStore } from "@/lib/app-store";
import { cn } from "@/lib/utils";

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={enabled}
      onClick={() => onChange(!enabled)}
      className={cn(
        "flex h-9 w-16 items-center rounded-full p-1 transition",
        enabled ? "bg-[#008751]" : "bg-black/[0.06]",
      )}
    >
      <span
        className={cn(
          "h-7 w-7 rounded-full bg-white shadow-[0_4px_12px_rgba(15,23,42,0.16)] transition",
          enabled && "translate-x-7",
        )}
      />
    </button>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const phoneNumber = useAppStore((state) => state.phoneNumber);
  const isActivated = useAppStore((state) => state.isActivated);
  const demoMode = useAppStore((state) => state.demoMode);
  const fraudProtection = useAppStore((state) => state.fraudProtection);
  const pidginResponses = useAppStore((state) => state.pidginResponses);
  const toggleDemoMode = useAppStore((state) => state.toggleDemoMode);
  const setFraudProtection = useAppStore((state) => state.setFraudProtection);
  const setPidginResponses = useAppStore((state) => state.setPidginResponses);
  const logout = useAppStore((state) => state.logout);
  const settingsMutation = useMutation({
    mutationFn: updateSettings,
  });

  function updateFraudProtection(enabled: boolean) {
    setFraudProtection(enabled);
    settingsMutation.mutate({
      notifications: {
        fraudAlerts: enabled,
      },
    });
  }

  function updatePidginResponses(enabled: boolean) {
    setPidginResponses(enabled);
    settingsMutation.mutate({
      aiLanguage: enabled ? "pidgin" : "english",
    });
  }

  function signOut() {
    logout();
    router.push("/auth");
  }

  return (
    <AppShell>
      <h1 className="text-4xl font-bold">Settings</h1>

      <ProductCard className="mt-8 flex items-center gap-5">
        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-[22px] bg-[#008751]/10 text-3xl font-bold text-white">
          <Image
            src="/datawatchimg-removebg-preview.png"
            alt="DataWatch NG"
            width={70}
            height={70}
            className="h-16 w-16 object-contain"
          />
          <span className="absolute right-[-8px] bottom-2 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-[#0A0A0A]">
            <Camera size={17} strokeWidth={1.5} />
          </span>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Your account</h2>
          <p className="mt-1 text-xl font-medium text-[#6B7280]">
            {phoneNumber || "+234 ... ... ...."}
          </p>
        </div>
      </ProductCard>

      <h2 className="mt-7 text-base font-bold tracking-[0.14em] text-[#6B7280] uppercase">
        Network
      </h2>
      <ProductCard className="mt-4 divide-y divide-black/[0.06] p-0">
        <div className="flex items-center gap-4 p-5">
          <span className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-black/[0.04]">
            <Wifi size={24} strokeWidth={1.5} />
          </span>
          <div className="flex-1">
            <p className="text-xl font-semibold">Active line</p>
            <p className="text-lg text-[#6B7280]">
              {isActivated ? "Activated" : "Not activated"}
            </p>
          </div>
          <ChevronRight
            size={22}
            strokeWidth={1.5}
            className="text-[#6B7280]"
          />
        </div>
        <div className="flex items-center gap-4 p-5">
          <span className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-black/[0.04]">
            <Shield size={24} strokeWidth={1.5} />
          </span>
          <p className="flex-1 text-xl font-semibold">Fraud protection</p>
          <Toggle enabled={fraudProtection} onChange={updateFraudProtection} />
        </div>
      </ProductCard>

      <h2 className="mt-7 text-base font-bold tracking-[0.14em] text-[#6B7280] uppercase">
        App
      </h2>
      <ProductCard className="mt-4 divide-y divide-black/[0.06] p-0">
        <div className="flex items-center gap-4 p-5">
          <span className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-black/[0.04]">
            <User size={24} strokeWidth={1.5} />
          </span>
          <p className="flex-1 text-xl font-semibold">Demo mode</p>
          <Toggle enabled={demoMode} onChange={toggleDemoMode} />
        </div>
        <div className="flex items-center gap-4 p-5">
          <span className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-black/[0.04]">
            <User size={24} strokeWidth={1.5} />
          </span>
          <p className="flex-1 text-xl font-semibold">Biometric lock</p>
          <Toggle enabled={false} onChange={() => undefined} />
        </div>
        <div className="flex items-center gap-4 p-5">
          <span className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-black/[0.04]">
            <User size={24} strokeWidth={1.5} />
          </span>
          <p className="flex-1 text-xl font-semibold">Pidgin responses</p>
          <Toggle enabled={pidginResponses} onChange={updatePidginResponses} />
        </div>
      </ProductCard>

      <Button
        variant="secondary"
        className="mt-7 h-12 w-full border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
        onClick={signOut}
      >
        Sign out
      </Button>
    </AppShell>
  );
}
