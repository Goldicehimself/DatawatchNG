"use client";

import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { ButtonLink } from "@/components/ui/button";
import { ChartSkeleton, RowsSkeleton, Skeleton, TextSkeleton } from "@/components/ui/skeleton";
import { demoApps, demoUsage } from "@/data/product";
import { formatNaira, getDashboard, toProgressRows, toUsageBars } from "@/lib/api";
import { useAppStore } from "@/lib/app-store";

const fallbackSpend = [
  { label: "Data", amount: "N12,500", color: "#008751" },
  { label: "Subscriptions", amount: "N3,575", color: "#2EC48D" },
  { label: "Airtime", amount: "N2,000", color: "#FFB000" },
  { label: "VAS", amount: "N575", color: "#EF233C" },
];

const colors = ["#008751", "#2EC48D", "#FFB000", "#EF233C"];

function InsightBars({
  data,
}: {
  data: Array<{ day: string; value: number }>;
}) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="mt-8 flex h-40 gap-3">
      {data.map((item, index) => (
        <div
          key={`${item.day}-${index}`}
          className="flex h-full flex-1 flex-col items-center gap-3"
        >
          <div className="flex min-h-0 flex-1 items-end self-stretch">
            <div
              className="w-full rounded-t-[12px] bg-[#008751]"
              style={{ height: `${Math.max(24, (item.value / maxValue) * 100)}%` }}
            />
          </div>
          <span className="text-sm font-medium text-[#6B7280]">{item.day}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart() {
  return (
    <div className="h-28 w-28 shrink-0 rounded-full bg-[conic-gradient(#008751_0_62%,#2EC48D_62%_82%,#FFB000_82%_94%,#EF233C_94%_100%)] p-5">
      <div className="h-full w-full rounded-full bg-white" />
    </div>
  );
}

export default function InsightsPage() {
  const token = useAppStore((state) => state.token);
  const demoMode = useAppStore((state) => state.demoMode);
  const dashboardQuery = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
    enabled: Boolean(token) && !demoMode,
  });
  const dashboard = dashboardQuery.data;
  const dailyUsage = demoMode ? undefined : dashboard ? toUsageBars(dashboard.dailyUsage) : [];
  const appRows = demoMode
    ? demoApps
    : dashboard
      ? toProgressRows(dashboard.appBreakdown, dashboard.summary.totalMb)
      : [];
  const spend = demoMode
    ? fallbackSpend
    : dashboard?.subscriptionSpend.length
      ? dashboard.subscriptionSpend.map((item, index) => ({
        label: item._id,
        amount: formatNaira(item.amount),
        color: colors[index % colors.length],
      }))
      : [];
  const bars = demoMode
    ? demoUsage
    : dailyUsage?.length
    ? dailyUsage
    : [];
  const loadingRealInsights = Boolean(token) && !demoMode && dashboardQuery.isLoading;

  return (
    <AppShell>
      <div>
        <h1 className="text-4xl font-bold">Insights</h1>
        <p className="mt-2 text-sm text-[#6B7280]">
          {demoMode
            ? "Demo analytics are currently shown."
            : dashboard
              ? "Live backend analytics for your current line."
              : "No usage data has been recorded yet."}
        </p>
      </div>

      {!token && !demoMode ? (
        <div className="mt-6 rounded-[24px] bg-white p-6 text-center shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-[#6B7280]">
            No backend session is active on this device.
          </p>
          <ButtonLink href="/demo" className="mt-4">
            Start demo
          </ButtonLink>
        </div>
      ) : null}

      {dashboardQuery.isError && !demoMode ? (
        <div className="mt-8 rounded-[28px] bg-red-50 p-6 text-sm font-semibold text-red-700">
          Could not load backend insights. Confirm the backend URL is reachable.
        </div>
      ) : null}

      <div className="mt-8 rounded-[28px] bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
        <h2 className="text-xl font-black tracking-[0.12em] text-[#6B7280] uppercase">
          Daily data use
        </h2>
        {loadingRealInsights ? (
          <div className="mt-8">
            <ChartSkeleton />
          </div>
        ) : bars.length ? (
          <InsightBars data={bars} />
        ) : (
          <div className="mt-8 flex h-40 items-center justify-center rounded-[16px] bg-black/[0.03] text-sm font-semibold text-[#6B7280]">
            No usage data yet
          </div>
        )}
      </div>

      <div className="mt-8 rounded-[28px] bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
        <h2 className="text-xl font-black tracking-[0.12em] text-[#6B7280] uppercase">
          Spend breakdown (N)
        </h2>
        <div className="mt-8 grid grid-cols-[auto_1fr] items-center gap-4">
          <DonutChart />
          <div className="min-w-0 space-y-4">
            {loadingRealInsights ? (
              <>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <span className="flex min-w-0 items-center gap-2 text-sm">
                    <Skeleton className="h-3 w-3 shrink-0 rounded-full" />
                    <TextSkeleton className="w-20" />
                  </span>
                  <TextSkeleton className="w-16" />
                </div>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <span className="flex min-w-0 items-center gap-2 text-sm">
                    <Skeleton className="h-3 w-3 shrink-0 rounded-full" />
                    <TextSkeleton className="w-24" />
                  </span>
                  <TextSkeleton className="w-14" />
                </div>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <span className="flex min-w-0 items-center gap-2 text-sm">
                    <Skeleton className="h-3 w-3 shrink-0 rounded-full" />
                    <TextSkeleton className="w-16" />
                  </span>
                  <TextSkeleton className="w-12" />
                </div>
              </>
            ) : spend.map((item) => (
              <div
                key={item.label}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3"
              >
                <span className="flex min-w-0 items-center gap-2 text-sm">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate">{item.label}</span>
                </span>
                <span className="shrink-0 text-sm font-black tabular-nums">
                  {item.amount}
                </span>
              </div>
            ))}
            {!loadingRealInsights && !spend.length ? (
              <p className="text-sm font-semibold text-[#6B7280]">
                No spend data yet
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-[28px] bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
        <h2 className="text-xl font-black tracking-[0.12em] text-[#6B7280] uppercase">
          App breakdown
        </h2>
        <div className="mt-7 space-y-7">
          {loadingRealInsights ? (
            <RowsSkeleton rows={4} />
          ) : appRows.map((app) => (
            <div key={app.name}>
              <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <span className="truncate text-lg font-black">
                  {app.name}
                </span>
                <span className="shrink-0 text-base font-medium text-[#6B7280] tabular-nums">
                  {app.value.replace("GB", " GB").replace("MB", " MB")}
                </span>
              </div>
              <div className="h-3 rounded-full bg-black/[0.04]">
                <div
                  className="h-3 rounded-full bg-[#2EC48D]"
                  style={{ width: `${app.percent}%` }}
                />
              </div>
            </div>
          ))}
          {!loadingRealInsights && !appRows.length ? (
            <p className="text-sm font-semibold text-[#6B7280]">
              No app usage has been recorded yet.
            </p>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
