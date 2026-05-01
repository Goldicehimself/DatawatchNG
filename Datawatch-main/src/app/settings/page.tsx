"use client";

import type { LucideIcon } from "lucide-react";
import { Bell, Camera, ChevronRight, Pencil, Shield, User, Wifi } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
        "flex h-9 w-16 shrink-0 items-center rounded-full p-1 transition focus-visible:ring-4 focus-visible:ring-[#008751]/20 focus-visible:outline-none",
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

function SettingsRow({
  icon: Icon,
  title,
  subtitle,
  trailing,
}: {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 p-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-black/[0.04]">
        <Icon size={20} strokeWidth={1.5} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold">{title}</p>
        {subtitle ? (
          <p className="mt-1 truncate text-sm text-[#6B7280]">
            {subtitle}
          </p>
        ) : null}
      </div>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </div>
  );
}

const networkStyles: Record<string, string> = {
  MTN: "bg-[#FFCC00] text-black",
  Airtel: "bg-[#E60012] text-white",
  Glo: "bg-[#008751] text-white",
  "9mobile": "bg-[#87B818] text-white",
};

function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (!digits) {
    return "+234 ... ... ....";
  }

  return `+${digits}`;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) {
    return "DW";
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function SettingsPage() {
  const router = useRouter();
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const fullName = useAppStore((state) => state.fullName);
  const phoneNumber = useAppStore((state) => state.phoneNumber);
  const networkProvider = useAppStore((state) => state.networkProvider);
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
  const displayName = fullName || "DataWatch User";
  const activeNetwork = networkProvider || "Network";
  const planName = `${activeNetwork}${activeNetwork === "Network" ? "" : " · MyData Plan"}`;

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

  function updateAlerts(enabled: boolean) {
    setAlertsEnabled(enabled);
    settingsMutation.mutate({
      notifications: {
        usageAlerts: enabled,
        subscriptionAlerts: enabled,
      },
    });
  }

  function signOut() {
    logout();
    router.push("/auth");
  }

  return (
    <AppShell>
      <h1 className="text-[30px] leading-tight font-bold">Settings</h1>

      <ProductCard className="mt-6 p-0">
        <div className="flex min-w-0 items-center gap-4 p-5">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-[17px] bg-[#008751] text-xl font-black text-white">
            {getInitials(displayName)}
            <span className="absolute right-[-6px] bottom-[-4px] flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-white bg-[#0A0A0A]">
              <Camera size={14} strokeWidth={1.5} />
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-bold">{displayName}</h2>
            <p className="mt-1 break-all text-sm font-medium text-[#6B7280]">
              {formatPhone(phoneNumber)}
            </p>
          </div>
          <button
            type="button"
            aria-label="Edit profile"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/[0.04] text-[#0A0A0A] transition hover:bg-black/[0.07] focus-visible:ring-4 focus-visible:ring-[#008751]/20 focus-visible:outline-none"
          >
            <Pencil size={16} strokeWidth={1.7} />
          </button>
        </div>
        <div className="flex items-center gap-3 border-t border-black/[0.06] px-5 py-3.5">
          <span
            className={`rounded-full px-4 py-2 text-xs font-black ${
              networkStyles[activeNetwork] || "bg-black/[0.06] text-[#6B7280]"
            }`}
          >
            {activeNetwork}
          </span>
          <span className="text-sm font-medium text-[#6B7280]">
            Active network
          </span>
        </div>
      </ProductCard>

      <h2 className="mt-6 text-sm font-bold tracking-[0.14em] text-[#6B7280] uppercase">
        Network
      </h2>
      <ProductCard className="mt-4 divide-y divide-black/[0.06] p-0">
        <SettingsRow
          icon={Wifi}
          title="Active line"
          subtitle={isActivated ? planName : "Not activated"}
          trailing={
            <ChevronRight
              size={22}
              strokeWidth={1.5}
              className="text-[#6B7280]"
            />
          }
        />
        <SettingsRow
          icon={Shield}
          title="Fraud protection"
          trailing={
            <Toggle enabled={fraudProtection} onChange={updateFraudProtection} />
          }
        />
      </ProductCard>

      <h2 className="mt-6 text-sm font-bold tracking-[0.14em] text-[#6B7280] uppercase">
        App
      </h2>
      <ProductCard className="mt-4 divide-y divide-black/[0.06] p-0">
        <SettingsRow
          icon={User}
          title="Demo mode"
          trailing={<Toggle enabled={demoMode} onChange={toggleDemoMode} />}
        />
        <SettingsRow
          icon={User}
          title="Biometric lock"
          trailing={<Toggle enabled={false} onChange={() => undefined} />}
        />
        <SettingsRow
          icon={Bell}
          title="Allow alerts"
          trailing={<Toggle enabled={alertsEnabled} onChange={updateAlerts} />}
        />
        <SettingsRow
          icon={User}
          title="Pidgin responses"
          trailing={<Toggle enabled={pidginResponses} onChange={updatePidginResponses} />}
        />
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
