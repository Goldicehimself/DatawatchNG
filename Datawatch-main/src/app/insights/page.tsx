"use client";

import { Bell } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
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
    <div className="mt-8 flex h-44 items-end gap-4">
      {data.map((item) => (
        <div key={item.day} className="flex flex-1 flex-col items-center gap-3">
          <div
            className="w-full rounded-t-[14px] bg-[#008751]"
            style={{ height: `${Math.max(24, (item.value / maxValue) * 100)}%` }}
          />
          <span className="text-lg font-medium text-[#6B7280]">{item.day}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart() {
  return (
    <div className="h-40 w-40 shrink-0 rounded-full bg-[conic-gradient(#008751_0_62%,#2EC48D_62%_82%,#FFB000_82%_94%,#EF233C_94%_100%)] p-8">
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
    <main className="min-h-screen bg-[#FAFAFA] text-[#0A0A0A]">
      <div className="mx-auto min-h-screen w-full max-w-[430px] overflow-hidden border-x border-black/[0.04] bg-[#FAFAFA] pb-24">
        <header className="sticky top-0 z-20 border-b border-black/[0.06] bg-[#FAFAFA]/95 px-6 py-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
                <Image
                  src="/datawatchimg-removebg-preview.png"
                  alt="DataWatch NG"
                  width={38}
                  height={38}
                  className="h-10 w-10 object-contain"
                />
              </span>
              <div>
                <p className="text-lg font-black tracking-[0.25em] text-[#6B7280]">
                  DATAWATCH
                </p>
                <p className="-mt-1 text-2xl font-black">Nigeria</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg font-black text-[#008751]">DEMO</span>
              <span
                className={`flex h-12 w-20 items-center rounded-full p-1 ${
                  demoMode || token ? "bg-[#008751]" : "bg-black/[0.08]"
                }`}
              >
                <span
                  className={`h-10 w-10 rounded-full bg-white shadow-md transition ${
                    demoMode || token ? "translate-x-8" : ""
                  }`}
                />
              </span>
              <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                <Bell size={25} strokeWidth={1.6} />
                <span className="absolute top-2 right-2 h-3 w-3 rounded-full bg-red-500" />
              </span>
            </div>
          </div>
        </header>

        <section className="px-6 py-8">
          <h1 className="text-4xl font-black tracking-[-0.04em]">Insights</h1>

          {!token ? (
            <div className="mt-6 rounded-[28px] bg-white p-6 text-center shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
              <p className="text-sm text-[#6B7280]">
                Start demo mode to load backend insights.
              </p>
              <ButtonLink href="/demo" className="mt-4">
                Start demo
              </ButtonLink>
            </div>
          ) : null}

          <div className="mt-8 rounded-[30px] bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
            <h2 className="text-2xl font-black tracking-[0.12em] text-[#6B7280] uppercase">
              Daily data use
            </h2>
            <InsightBars data={bars} />
          </div>

          <div className="mt-8 rounded-[30px] bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
            <h2 className="text-2xl font-black tracking-[0.12em] text-[#6B7280] uppercase">
              Spend breakdown (N)
            </h2>
            <div className="mt-10 flex items-center gap-7">
              <DonutChart />
              <div className="min-w-0 flex-1 space-y-5">
                {spend.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="flex min-w-0 items-center gap-3 text-xl">
                      <span
                        className="h-4 w-4 shrink-0 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="truncate">{item.label}</span>
                    </span>
                    <span className="shrink-0 text-xl font-black">
                      {item.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-[30px] bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
            <h2 className="text-2xl font-black tracking-[0.12em] text-[#6B7280] uppercase">
              App breakdown
            </h2>
            <div className="mt-7 space-y-7">
              {appRows.map((app) => (
                <div key={app.name}>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-2xl font-black">{app.name}</span>
                    <span className="text-2xl font-medium text-[#6B7280]">
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
        </section>
      </div>
    </main>
  );
}
