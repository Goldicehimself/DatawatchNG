"use client";

import { ChartNoAxesColumn, CircleDollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { ProductCard } from "@/components/product/product-card";
import { ProgressRow, UsageBars } from "@/components/product/mini-charts";
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

  return (
    <AppShell>
      <h1 className="text-4xl font-bold">Insights</h1>

      {!token ? (
        <ProductCard className="mt-8 text-center">
          <h2 className="text-xl font-semibold">No backend session</h2>
          <p className="mt-2 text-sm text-[#6B7280]">
            Start demo mode to load real backend insights.
          </p>
          <ButtonLink href="/demo" className="mt-5">
            Start demo
          </ButtonLink>
        </ProductCard>
      ) : null}

      <ProductCard className="mt-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-[0.14em] text-[#6B7280] uppercase">
            Daily data use
          </h2>
          <ChartNoAxesColumn
            size={22}
            strokeWidth={1.5}
            className="text-[#008751]"
          />
        </div>
        <UsageBars data={dailyUsage} />
      </ProductCard>

      <ProductCard className="mt-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-[0.14em] text-[#6B7280] uppercase">
            Spend breakdown (N)
          </h2>
          <CircleDollarSign
            size={22}
            strokeWidth={1.5}
            className="text-[#008751]"
          />
        </div>
        <div className="flex items-center gap-6">
          <div className="h-44 w-44 shrink-0 rounded-full bg-[conic-gradient(#008751_0_62%,#2EC48D_62%_82%,#FFB000_82%_94%,#EF233C_94%_100%)] p-10">
            <div className="h-full w-full rounded-full bg-white" />
          </div>
          <div className="min-w-0 flex-1 space-y-4">
            {spend.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-3"
              >
                <span className="flex items-center gap-2 text-base">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.label}
                </span>
                <span className="font-bold">{item.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </ProductCard>

      <ProductCard className="mt-8">
        <h2 className="mb-6 text-lg font-bold tracking-[0.14em] text-[#6B7280] uppercase">
          App breakdown
        </h2>
        <div className="space-y-6">
          {appRows.map((app) => (
            <ProgressRow key={app.name} {...app} />
          ))}
        </div>
      </ProductCard>
    </AppShell>
  );
}
