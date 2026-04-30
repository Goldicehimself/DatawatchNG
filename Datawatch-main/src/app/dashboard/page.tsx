"use client";

import { Activity, Database, Shield, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { ProgressRow, UsageBars } from "@/components/product/mini-charts";
import { ProductCard } from "@/components/product/product-card";
import { ButtonLink } from "@/components/ui/button";
import { demoAlerts, demoApps, demoSubscriptions } from "@/data/product";
import { formatDataAmount, getDashboard, toProgressRows, toUsageBars } from "@/lib/api";
import { useAppStore } from "@/lib/app-store";

function maskPhone(phone: string) {
  if (!phone) {
    return "+234 ... ... ....";
  }

  const digits = phone.replace(/\D/g, "");
  return `+${digits.slice(0, 3)} ... ... ${digits.slice(-4)}`;
}

export default function DashboardPage() {
  const token = useAppStore((state) => state.token);
  const phoneNumber = useAppStore((state) => state.phoneNumber);
  const isActivated = useAppStore((state) => state.isActivated);
  const demoMode = useAppStore((state) => state.demoMode);
  const active = isActivated || demoMode;

  const dashboardQuery = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
    enabled: Boolean(token),
  });

  const dashboard = dashboardQuery.data;
  const topApps =
    dashboard ? toProgressRows(dashboard.appBreakdown, dashboard.summary.totalMb) : demoApps;
  const dailyUsage = dashboard ? toUsageBars(dashboard.dailyUsage) : undefined;

  return (
    <AppShell>
      <section className="rounded-[32px] bg-gradient-to-br from-[#008751] to-[#005C35] p-8 text-white shadow-[0_24px_60px_rgba(0,92,53,0.22)]">
        <p className="text-sm font-bold tracking-[0.24em] text-white/70 uppercase">
          Active line
        </p>
        <h1 className="mt-3 text-2xl font-bold">{maskPhone(phoneNumber)}</h1>

        <div className="mt-9 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold tracking-wide text-white/70 uppercase">
              Data used
            </p>
            <p className="mt-5 text-3xl font-bold">
              {dashboard ? formatDataAmount(dashboard.summary.totalMb) : active ? "Loading" : "- GB"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold tracking-wide text-white/70 uppercase">
              Airtime
            </p>
            <p className="mt-5 text-3xl font-bold">{active ? "N1,250" : "N0"}</p>
          </div>
        </div>

        <div className="mt-8 h-2 rounded-full bg-white/20">
          <div
            className="h-2 rounded-full bg-white/55 transition-all"
            style={{ width: active ? "63%" : "8%" }}
          />
        </div>
        <p className="mt-5 text-base font-medium text-white/82">
          {active ? "Monitoring usage with backend analytics" : "Verify to begin tracking"}
        </p>
      </section>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {[
          { label: "Insights", href: "/insights", icon: Activity },
          { label: "Ask AI", href: "/watcher", icon: Sparkles },
          { label: "Alerts", href: "/alerts", icon: Shield },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <ButtonLink
              key={item.label}
              href={item.href}
              variant="secondary"
              className="h-[104px] flex-col rounded-[24px] bg-white text-base font-bold shadow-[0_14px_32px_rgba(15,23,42,0.08)]"
            >
              <Icon size={28} strokeWidth={1.5} className="text-[#008751]" />
              {item.label}
            </ButtonLink>
          );
        })}
      </div>

      {!token ? (
        <section className="mt-7">
          <h2 className="text-xl font-bold">Top apps this week</h2>
          <ProductCard className="mt-4 flex min-h-[230px] flex-col items-center justify-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-[22px] bg-[#008751]/10 text-[#008751]">
              <Database size={36} strokeWidth={1.5} />
            </div>
            <h3 className="mt-6 text-2xl font-bold">No backend session</h3>
            <p className="mt-3 max-w-xs text-base leading-7 text-[#6B7280]">
              Verify your phone number or start demo mode to load backend
              analytics.
            </p>
            <ButtonLink href="/auth" className="mt-6">
              Verify phone
            </ButtonLink>
          </ProductCard>
        </section>
      ) : (
        <section className="mt-7 space-y-5">
          <div>
            <h2 className="text-xl font-bold">Top apps this week</h2>
            <ProductCard className="mt-4">
              <div className="space-y-5">
                {topApps.slice(0, 3).map((app) => (
                  <ProgressRow key={app.name} {...app} />
                ))}
              </div>
            </ProductCard>
          </div>

          <ProductCard>
            <h2 className="mb-5 text-lg font-bold">Daily usage</h2>
            <UsageBars compact data={dailyUsage} />
          </ProductCard>

          <div className="grid grid-cols-2 gap-4">
            <ProductCard>
              <p className="text-sm text-[#6B7280]">Alerts</p>
              <p className="mt-2 text-3xl font-bold">
                {dashboard?.fraudTimeline.length ?? demoAlerts.length}
              </p>
            </ProductCard>
            <ProductCard>
              <p className="text-sm text-[#6B7280]">Subscriptions</p>
              <p className="mt-2 text-3xl font-bold">
                {dashboard?.subscriptionSpend.reduce((sum, item) => sum + item.count, 0) ?? demoSubscriptions.length}
              </p>
            </ProductCard>
          </div>
        </section>
      )}

      {dashboardQuery.isError ? (
        <ProductCard className="mt-5 text-sm font-semibold text-red-600">
          Could not load backend dashboard. Confirm the backend is running on
          port 5000.
        </ProductCard>
      ) : null}
    </AppShell>
  );
}
