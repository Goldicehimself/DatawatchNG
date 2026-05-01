"use client";

import { Bot, CreditCard, ShieldAlert, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ProductCard } from "@/components/product/product-card";
import { ProgressRow, UsageBars } from "@/components/product/mini-charts";
import { Button, ButtonLink } from "@/components/ui/button";
import { demoAlerts, demoApps, demoSubscriptions, demoUsage } from "@/data/product";
import { startDemo } from "@/lib/api";
import { useAppStore } from "@/lib/app-store";

export default function DemoPage() {
  const router = useRouter();
  const setSession = useAppStore((state) => state.setSession);
  const [loading, setLoading] = useState(false);

  async function startBackendDemo() {
    setLoading(true);

    try {
      const response = await startDemo("MTN");
      setSession(
        response.token,
        response.user.phone,
        response.user.network,
        response.user.settings,
        response.user.isDemo,
      );
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="rounded-[20px] bg-[#0A0A0A] p-6 text-white">
        <p className="text-sm font-semibold text-[#FFCC00]">Demo mode</p>
        <h1 className="mt-2 max-w-2xl text-3xl leading-tight font-semibold">
          Explore a full simulated DataWatch NG experience
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
          Demo mode uses realistic sample scenarios for product exploration. The
          real dashboard starts with no fake first-time data.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button className="bg-[#008751]" onClick={startBackendDemo} disabled={loading}>
            {loading ? "Starting..." : "Start demo"}
          </Button>
          <ButtonLink href="/auth" className="bg-white text-[#0A0A0A]">
            Create Account
          </ButtonLink>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {[
          { label: "Plan used", value: "4.3GB", icon: Smartphone },
          { label: "Open alerts", value: "3", icon: ShieldAlert },
          { label: "Active subs", value: "3", icon: CreditCard },
          { label: "AI checks", value: "12", icon: Bot },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <ProductCard key={metric.label}>
              <Icon size={22} strokeWidth={1.5} className="text-[#008751]" />
              <p className="mt-4 text-sm text-[#6B7280]">{metric.label}</p>
              <p className="mt-1 text-3xl font-semibold">{metric.value}</p>
            </ProductCard>
          );
        })}
      </div>

      <div className="mt-6 grid gap-5">
        <ProductCard>
          <h2 className="mb-5 font-semibold">Daily data use</h2>
          <UsageBars data={demoUsage} />
        </ProductCard>
        <ProductCard>
          <h2 className="mb-5 font-semibold">App breakdown</h2>
          <div className="space-y-4">
            {demoApps.map((app) => (
              <ProgressRow key={app.name} {...app} />
            ))}
          </div>
        </ProductCard>
      </div>

      <div className="mt-6 grid gap-5">
        <ProductCard>
          <h2 className="mb-4 font-semibold">Demo alerts</h2>
          {demoAlerts.map((alert) => (
            <div
              key={alert.title}
              className="border-b border-black/[0.06] py-4"
            >
              <div className="flex justify-between gap-3">
                <p className="text-sm font-semibold">{alert.title}</p>
                <p className="text-sm font-semibold">{alert.impact}</p>
              </div>
              <p className="mt-2 text-xs leading-5 text-[#6B7280]">
                {alert.description}
              </p>
            </div>
          ))}
        </ProductCard>
        <ProductCard>
          <h2 className="mb-4 font-semibold">Demo subscriptions</h2>
          {demoSubscriptions.map((sub) => (
            <div key={sub.name} className="border-b border-black/[0.06] py-4">
              <div className="flex justify-between gap-3">
                <p className="text-sm font-semibold">{sub.name}</p>
                <p className="text-sm font-semibold">{sub.charge}</p>
              </div>
              <p className="mt-2 text-xs text-[#6B7280]">
                {sub.status} · {sub.provider}
              </p>
            </div>
          ))}
        </ProductCard>
      </div>
    </AppShell>
  );
}
