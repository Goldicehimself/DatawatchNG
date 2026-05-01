"use client";

import {
  Activity,
  ChartNoAxesCombined,
  CreditCard,
  ShieldAlert,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { ProductCard } from "@/components/product/product-card";
import { ProgressRow, UsageBars } from "@/components/product/mini-charts";
import { ButtonLink } from "@/components/ui/button";
import { ChartSkeleton, RowsSkeleton, TextSkeleton } from "@/components/ui/skeleton";
import { demoAlerts, demoApps, demoSubscriptions } from "@/data/product";
import { formatNaira, getDashboard, toProgressRows, toUsageBars } from "@/lib/api";
import { useAppStore } from "@/lib/app-store";

export default function AnalyticsPage() {
  const token = useAppStore((state) => state.token);
  const demoMode = useAppStore((state) => state.demoMode);
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
  const loadingRealAnalytics = Boolean(token) && !demoMode && dashboardQuery.isLoading;

  return (
    <AppShell>
      <p className="text-sm font-semibold text-[#008751]">Analytics</p>
      <h1 className="mt-2 text-3xl font-semibold">Understand every pattern</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6B7280]">
        Interactive analytics for daily usage, app breakdowns, subscription
        spend, and fraud events.
      </p>

      {!token && !demoMode ? (
        <ProductCard className="mt-6 text-center">
          <h2 className="text-xl font-semibold">No backend session</h2>
          <p className="mt-2 text-sm text-[#6B7280]">
            Start demo mode to load backend analytics.
          </p>
          <ButtonLink href="/demo" className="mt-5">
            Start demo
          </ButtonLink>
        </ProductCard>
      ) : null}

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <ProductCard>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-semibold">Daily usage trend</h2>
            <Activity size={20} strokeWidth={1.5} className="text-[#008751]" />
          </div>
          {loadingRealAnalytics ? <ChartSkeleton /> : <UsageBars data={dailyUsage} />}
        </ProductCard>
        <ProductCard>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-semibold">App usage breakdown</h2>
            <ChartNoAxesCombined
              size={20}
              strokeWidth={1.5}
              className="text-[#008751]"
            />
          </div>
          <div className="space-y-4">
            {loadingRealAnalytics ? (
              <RowsSkeleton rows={4} />
            ) : topApps.map((app) => (
              <ProgressRow key={app.name} {...app} />
            ))}
            {!loadingRealAnalytics && !topApps.length ? (
              <p className="text-sm font-semibold text-[#6B7280]">
                No app usage has been recorded yet.
              </p>
            ) : null}
          </div>
        </ProductCard>
        <ProductCard>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-semibold">Subscription spend</h2>
            <CreditCard
              size={20}
              strokeWidth={1.5}
              className="text-[#008751]"
            />
          </div>
          <div className="space-y-3">
            {loadingRealAnalytics
              ? Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-[16px] bg-black/[0.03] p-4"
                  >
                    <TextSkeleton className="w-28" />
                    <TextSkeleton className="w-16" />
                  </div>
                ))
              : demoMode
              ? demoSubscriptions.map((sub) => (
                  <div
                    key={sub.name}
                    className="flex items-center justify-between rounded-[16px] bg-black/[0.03] p-4"
                  >
                    <span className="text-sm font-medium">{sub.name}</span>
                    <span className="text-sm font-semibold">{sub.charge}</span>
                  </div>
                ))
              : dashboard
              ? dashboard.subscriptionSpend.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between rounded-[16px] bg-black/[0.03] p-4"
                  >
                    <span className="text-sm font-medium">{item._id}</span>
                    <span className="text-sm font-semibold">
                      {formatNaira(item.amount)}
                    </span>
                  </div>
                ))
              : null}
            {!loadingRealAnalytics && !demoMode && !dashboard?.subscriptionSpend.length ? (
              <p className="text-sm font-semibold text-[#6B7280]">
                No subscription spend yet.
              </p>
            ) : null}
          </div>
        </ProductCard>
        <ProductCard>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-semibold">Fraud timeline</h2>
            <ShieldAlert
              size={20}
              strokeWidth={1.5}
              className="text-[#008751]"
            />
          </div>
          <div className="space-y-4">
            {loadingRealAnalytics
              ? Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex gap-3">
                    <TextSkeleton className="mt-2 h-2 w-2 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <TextSkeleton className="w-36" />
                      <TextSkeleton className="w-28" />
                    </div>
                  </div>
                ))
              : demoMode
              ? demoAlerts.map((alert) => (
                  <div key={alert.title} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-[#008751]" />
                    <div>
                      <p className="text-sm font-semibold">{alert.title}</p>
                      <p className="mt-1 text-xs text-[#6B7280]">
                        {alert.time} - {alert.impact}
                      </p>
                    </div>
                  </div>
                ))
              : dashboard
              ? dashboard.fraudTimeline.map((alert) => (
                  <div key={alert._id} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-[#008751]" />
                    <div>
                      <p className="text-sm font-semibold">{alert.title}</p>
                      <p className="mt-1 text-xs text-[#6B7280]">
                        {new Date(alert.createdAt).toLocaleString()} - {alert.severity}
                      </p>
                    </div>
                  </div>
                ))
              : null}
            {!loadingRealAnalytics && !demoMode && !dashboard?.fraudTimeline.length ? (
              <p className="text-sm font-semibold text-[#6B7280]">
                No fraud events yet.
              </p>
            ) : null}
          </div>
        </ProductCard>
      </div>
    </AppShell>
  );
}
