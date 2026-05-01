"use client";

import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { ButtonLink } from "@/components/ui/button";
import { demoApps } from "@/data/product";
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
    <div className="mt-8 flex h-40 items-end gap-3">
      {data.map((item, index) => (
        <div
          key={`${item.day}-${index}`}
          className="flex flex-1 flex-col items-center gap-3"
        >
          <div
            className="w-full rounded-t-[12px] bg-[#008751]"
            style={{ height: `${Math.max(24, (item.value / maxValue) * 100)}%` }}
          />
          <span className="text-sm font-medium text-[#6B7280]">{item.day}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart() {
  return (
    <div className="h-36 w-36 shrink-0 rounded-full bg-[conic-gradient(#008751_0_62%,#2EC48D_62%_82%,#FFB000_82%_94%,#EF233C_94%_100%)] p-7">
      <div className="h-full w-full rounded-full bg-white" />
    </div>
  );
}

export default function InsightsPage() {
  const token = useAppStore((state) => state.token);
  const dashboardQuery = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
    enabled: Boolean(token),
  });
  const dashboard = dashboardQuery.data;
  const dailyUsage = dashboard ? toUsageBars(dashboard.dailyUsage) : undefined;
  const appRows = dashboard
    ? toProgressRows(dashboard.appBreakdown, dashboard.summary.totalMb)
    : demoApps;
  const spend = dashboard?.subscriptionSpend.length
    ? dashboard.subscriptionSpend.map((item, index) => ({
        label: item._id,
        amount: formatNaira(item.amount),
        color: colors[index % colors.length],
      }))
    : fallbackSpend;
  const bars = dailyUsage?.length
    ? dailyUsage
    : [
        { day: "Mon", value: 34 },
        { day: "Tue", value: 46 },
        { day: "Wed", value: 40 },
        { day: "Thu", value: 58 },
        { day: "Fri", value: 72 },
        { day: "Sat", value: 98 },
        { day: "Sun", value: 73 },
      ];

  return (
    <AppShell>
      <div>
        <h1 className="text-4xl font-bold">Insights</h1>
        <p className="mt-2 text-sm text-[#6B7280]">
          {dashboard
            ? "Live backend analytics for your current line."
            : "Start demo mode to load backend insights."}
        </p>
      </div>

      {!token ? (
        <div className="mt-6 rounded-[24px] bg-white p-6 text-center shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-[#6B7280]">
            No backend session is active on this device.
          </p>
          <ButtonLink href="/demo" className="mt-4">
            Start demo
          </ButtonLink>
        </div>
      ) : null}

      {dashboardQuery.isLoading ? (
        <div className="mt-8 rounded-[28px] bg-white p-6 text-sm font-semibold text-[#6B7280] shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
          Loading backend insights...
        </div>
      ) : null}

      {dashboardQuery.isError ? (
        <div className="mt-8 rounded-[28px] bg-red-50 p-6 text-sm font-semibold text-red-700">
          Could not load backend insights. Confirm the backend URL is reachable.
        </div>
      ) : null}

      <div className="mt-8 rounded-[28px] bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
        <h2 className="text-xl font-black tracking-[0.12em] text-[#6B7280] uppercase">
          Daily data use
        </h2>
        <InsightBars data={bars} />
      </div>

      <div className="mt-8 rounded-[28px] bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
        <h2 className="text-xl font-black tracking-[0.12em] text-[#6B7280] uppercase">
          Spend breakdown (N)
        </h2>
        <div className="mt-8 flex items-center gap-5">
          <DonutChart />
          <div className="min-w-0 flex-1 space-y-4">
            {spend.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-3 text-base">
                  <span
                    className="h-3.5 w-3.5 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate">{item.label}</span>
                </span>
                <span className="shrink-0 text-base font-black">{item.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-[28px] bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
        <h2 className="text-xl font-black tracking-[0.12em] text-[#6B7280] uppercase">
          App breakdown
        </h2>
        <div className="mt-7 space-y-7">
          {appRows.map((app) => (
            <div key={app.name}>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xl font-black">{app.name}</span>
                <span className="text-lg font-medium text-[#6B7280]">
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
        </div>
      </div>
    </AppShell>
  );
}
