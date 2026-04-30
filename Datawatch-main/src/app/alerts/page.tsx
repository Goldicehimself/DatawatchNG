"use client";

import { Flag, Search, ShieldAlert, ShieldCheck, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { ProductCard } from "@/components/product/product-card";
import { Button, ButtonLink } from "@/components/ui/button";
import { demoAlerts, type Severity } from "@/data/product";
import { getAlerts, markAlertRead, type BackendAlert } from "@/lib/api";
import { useAppStore } from "@/lib/app-store";

const severityStyle: Record<Severity, string> = {
  Low: "bg-emerald-50 text-emerald-700",
  Medium: "bg-[#FFCC00]/25 text-[#7A5A00]",
  High: "bg-red-50 text-red-700",
};

function toSeverity(severity: BackendAlert["severity"]): Severity {
  return severity === "high" ? "High" : severity === "medium" ? "Medium" : "Low";
}

export default function AlertsPage() {
  const queryClient = useQueryClient();
  const token = useAppStore((state) => state.token);
  const alertsQuery = useQuery({
    queryKey: ["alerts"],
    queryFn: getAlerts,
    enabled: Boolean(token),
  });
  const markReadMutation = useMutation({
    mutationFn: markAlertRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });

  const backendAlerts = alertsQuery.data || [];

  return (
    <AppShell>
      <h1 className="text-4xl font-bold">Fraud Alerts</h1>

      {!token ? (
        <ProductCard className="mt-8 flex min-h-[280px] flex-col items-center justify-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-[22px] bg-[#008751]/10 text-[#008751]">
            <ShieldCheck size={40} strokeWidth={1.5} />
          </div>
          <h2 className="mt-6 text-2xl font-bold">No backend session</h2>
          <p className="mt-4 max-w-xs text-xl leading-8 text-[#6B7280]">
            Start demo mode or verify your phone to load backend alerts.
          </p>
          <ButtonLink href="/demo" variant="secondary" className="mt-7">
            Start demo
          </ButtonLink>
        </ProductCard>
      ) : (
        <div className="mt-8 grid gap-4">
          {backendAlerts.map((alert) => {
            const severity = toSeverity(alert.severity);

            return (
              <ProductCard key={alert._id} className={alert.readAt ? "opacity-70" : ""}>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[#008751]/10 text-[#008751]">
                    <ShieldAlert size={24} strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-bold">{alert.title}</h2>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${severityStyle[severity]}`}
                      >
                        {severity}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                      {alert.message}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="font-bold">{alert.type.replaceAll("_", " ")}</span>
                      <span className="text-[#6B7280]">
                        {new Date(alert.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {alert.readAt ? (
                      <p className="mt-4 rounded-[14px] bg-black/[0.04] px-4 py-3 text-sm font-semibold text-[#005C35]">
                        Status: read
                      </p>
                    ) : null}
                    <div className="mt-5 grid grid-cols-3 gap-2">
                      <Button
                        variant="secondary"
                        className="h-10 px-2 text-xs"
                        onClick={() => markReadMutation.mutate(alert._id)}
                      >
                        <X size={15} strokeWidth={1.5} />
                        Read
                      </Button>
                      <Button variant="secondary" className="h-10 px-2 text-xs">
                        <Flag size={15} strokeWidth={1.5} />
                        Flag
                      </Button>
                      <Button className="h-10 px-2 text-xs">
                        <Search size={15} strokeWidth={1.5} />
                        Check
                      </Button>
                    </div>
                  </div>
                </div>
              </ProductCard>
            );
          })}

          {backendAlerts.length === 0 ? (
            <ProductCard className="text-center">
              <h2 className="text-xl font-bold">No active backend alerts</h2>
              <p className="mt-2 text-sm text-[#6B7280]">
                Ask Watcher about fraud or start demo mode to seed alerts.
              </p>
            </ProductCard>
          ) : null}
        </div>
      )}

      {alertsQuery.isError && !backendAlerts.length ? (
        <div className="mt-8 grid gap-4">
          {demoAlerts.map((alert) => (
            <ProductCard key={alert.title}>
              <h2 className="text-lg font-bold">{alert.title}</h2>
              <p className="mt-2 text-sm text-[#6B7280]">{alert.description}</p>
            </ProductCard>
          ))}
        </div>
      ) : null}
    </AppShell>
  );
}
