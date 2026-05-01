"use client";

import {
  Activity,
  Bell,
  Check,
  ChevronRight,
  Database,
  Eye,
  EyeOff,
  Shield,
  Sparkles,
  User,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ProgressRow, UsageBars } from "@/components/product/mini-charts";
import { ProductCard } from "@/components/product/product-card";
import { ButtonLink } from "@/components/ui/button";
import { ChartSkeleton, RowsSkeleton, Skeleton } from "@/components/ui/skeleton";
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

function formatPhone(phone: string) {
  if (!phone) {
    return "+234 ... ... ....";
  }

  const digits = phone.replace(/\D/g, "");

  if (!digits) {
    return phone;
  }

  return `+${digits}`;
}

export default function DashboardPage() {
  const [showPhone, setShowPhone] = useState(false);
  const [showSetup, setShowSetup] = useState(true);
  const token = useAppStore((state) => state.token);
  const phoneNumber = useAppStore((state) => state.phoneNumber);
  const networkProvider = useAppStore((state) => state.networkProvider);
  const isActivated = useAppStore((state) => state.isActivated);
  const demoMode = useAppStore((state) => state.demoMode);
  const fraudProtection = useAppStore((state) => state.fraudProtection);
  const active = isActivated || demoMode;

  const dashboardQuery = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
    enabled: Boolean(token),
  });

  const dashboard = dashboardQuery.data;
  const topApps = demoMode
    ? demoApps
    : dashboard
      ? toProgressRows(dashboard.appBreakdown, dashboard.summary.totalMb)
      : [];
  const dailyUsage = demoMode ? undefined : dashboard ? toUsageBars(dashboard.dailyUsage) : [];
  const alertCount = demoMode ? demoAlerts.length : dashboard?.fraudTimeline.length ?? 0;
  const subscriptionCount = demoMode
    ? demoSubscriptions.length
    : dashboard?.subscriptionSpend.reduce((sum, item) => sum + item.count, 0) ?? 0;
  const loadingRealDashboard = Boolean(token) && !demoMode && dashboardQuery.isLoading;
  const setupItems = [
    {
      title: "Complete your profile",
      body: "Add a photo so your account feels personal.",
      action: "Add photo",
      href: "/settings",
      icon: User,
      complete: false,
    },
    {
      title: "Turn on fraud protection",
      body: "Auto-flag silent charges on your line.",
      action: "Enable",
      href: "/settings",
      icon: Shield,
      complete: fraudProtection,
    },
    {
      title: "Allow alerts",
      body: "Get instant pings when something changes.",
      action: "Allow",
      href: "/alerts",
      icon: Bell,
      complete: false,
    },
    {
      title: "Meet Watcher AI",
      body: "Ask your assistant about data and charges.",
      action: "Open",
      href: "/watcher",
      icon: Sparkles,
      complete: active,
    },
  ];
  const completedSetupItems = setupItems.filter((item) => item.complete).length;
  const setupProgress = Math.max(8, (completedSetupItems / setupItems.length) * 100);

  return (
    <AppShell>
      <section className="mb-7">
        <h1 className="text-3xl font-black tracking-[-0.04em]">
          Hi Beauty <span aria-hidden="true">👋</span>
        </h1>
        <p className="mt-2 text-base font-medium text-[#6B7280]">
          {formatPhone(phoneNumber)}
          {phoneNumber ? " · " : ""}
          {networkProvider || "Network pending"}
        </p>
      </section>

      {showSetup ? (
        <ProductCard className="mb-7 rounded-[28px] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black tracking-[0.28em] text-[#008751] uppercase">
                Get set up
              </p>
              <h2 className="mt-2 text-xl font-black">
                Finish setting up your line
              </h2>
              <p className="mt-2 text-sm font-medium text-[#6B7280]">
                {completedSetupItems} of {setupItems.length} complete
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowSetup(false)}
              className="shrink-0 rounded-full px-2 py-1 text-sm font-semibold text-[#6B7280] transition hover:bg-black/[0.04] focus-visible:ring-4 focus-visible:ring-[#008751]/20 focus-visible:outline-none"
            >
              Hide
            </button>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-black/[0.05]">
            <div
              className="h-full rounded-full bg-[#008751] transition-all"
              style={{ width: `${setupProgress}%` }}
            />
          </div>

          <div className="mt-6 divide-y divide-black/[0.06]">
            {setupItems.map((item) => {
              const Icon = item.icon;

              return (
                <ButtonLink
                  key={item.title}
                  href={item.href}
                  variant="ghost"
                  className="h-auto w-full justify-start rounded-none px-0 py-4 text-left shadow-none hover:bg-transparent"
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] ${
                      item.complete
                        ? "bg-[#008751] text-white"
                        : "bg-black/[0.04] text-[#6B7280]"
                    }`}
                  >
                    {item.complete ? (
                      <Check size={21} strokeWidth={1.7} />
                    ) : (
                      <Icon size={21} strokeWidth={1.5} />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block truncate text-base font-black ${
                        item.complete ? "text-[#6B7280] line-through" : "text-[#0A0A0A]"
                      }`}
                    >
                      {item.title}
                    </span>
                    <span className="mt-1 block truncate text-sm font-medium text-[#6B7280]">
                      {item.body}
                    </span>
                  </span>
                  {!item.complete ? (
                    <span className="flex shrink-0 items-center gap-1 text-sm font-black text-[#008751]">
                      {item.action}
                      <ChevronRight size={16} strokeWidth={1.8} />
                    </span>
                  ) : null}
                </ButtonLink>
              );
            })}
          </div>
        </ProductCard>
      ) : (
        <button
          type="button"
          onClick={() => setShowSetup(true)}
          className="mb-7 inline-flex h-11 items-center gap-2 rounded-full border border-black/10 bg-white px-4 text-sm font-bold text-[#008751] shadow-sm transition hover:bg-black/[0.03] focus-visible:ring-4 focus-visible:ring-[#008751]/20 focus-visible:outline-none"
        >
          Show setup
          <ChevronRight size={16} strokeWidth={1.8} />
        </button>
      )}

      <section className="rounded-[32px] bg-gradient-to-br from-[#008751] to-[#005C35] p-8 text-white shadow-[0_24px_60px_rgba(0,92,53,0.22)]">
        <p className="text-sm font-bold tracking-[0.24em] text-white/70 uppercase">
          Active line
        </p>
        <div className="mt-3 flex items-center gap-3">
          <h1 className="min-w-0 flex-1 break-all text-2xl font-bold">
            {showPhone ? formatPhone(phoneNumber) : maskPhone(phoneNumber)}
          </h1>
          <button
            type="button"
            aria-label={showPhone ? "Hide phone number" : "Show phone number"}
            aria-pressed={showPhone}
            onClick={() => setShowPhone((value) => !value)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 focus-visible:ring-4 focus-visible:ring-white/25 focus-visible:outline-none"
          >
            {showPhone ? (
              <EyeOff size={19} strokeWidth={1.8} />
            ) : (
              <Eye size={19} strokeWidth={1.8} />
            )}
          </button>
        </div>

        <div className="mt-9 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold tracking-wide text-white/70 uppercase">
              Data used
            </p>
            <div className="mt-5 text-3xl font-bold">
              {loadingRealDashboard ? (
                <Skeleton className="h-9 w-24 bg-white/20" />
              ) : demoMode
                ? "4.3GB"
                : dashboard
                  ? formatDataAmount(dashboard.summary.totalMb)
                  : "0MB"}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold tracking-wide text-white/70 uppercase">
              Airtime
            </p>
            <p className="mt-5 text-3xl font-bold">{demoMode ? "N1,250" : "N0"}</p>
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

      {!token && !demoMode ? (
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
              {loadingRealDashboard ? (
                <RowsSkeleton rows={3} />
              ) : topApps.length ? (
                <div className="space-y-5">
                  {topApps.slice(0, 3).map((app) => (
                    <ProgressRow key={app.name} {...app} />
                  ))}
                </div>
              ) : (
                <p className="text-sm font-semibold text-[#6B7280]">
                  No app usage has been recorded yet.
                </p>
              )}
            </ProductCard>
          </div>

          <ProductCard>
            <h2 className="mb-5 text-lg font-bold">Daily usage</h2>
            {loadingRealDashboard ? (
              <ChartSkeleton compact />
            ) : (
              <UsageBars compact data={dailyUsage} />
            )}
          </ProductCard>

          <div className="grid grid-cols-2 gap-4">
            <ProductCard>
              <p className="text-sm text-[#6B7280]">Alerts</p>
              <div className="mt-2 text-3xl font-bold">
                {loadingRealDashboard ? <Skeleton className="h-9 w-14" /> : alertCount}
              </div>
            </ProductCard>
            <ProductCard>
              <p className="text-sm text-[#6B7280]">Subscriptions</p>
              <div className="mt-2 text-3xl font-bold">
                {loadingRealDashboard ? (
                  <Skeleton className="h-9 w-14" />
                ) : (
                  subscriptionCount
                )}
              </div>
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
