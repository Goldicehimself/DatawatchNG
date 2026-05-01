"use client";

import { AlertTriangle, ShieldCheck } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { ProductCard } from "@/components/product/product-card";
import { ButtonLink } from "@/components/ui/button";
import { Skeleton, TextSkeleton } from "@/components/ui/skeleton";
import { demoAlerts, type Severity } from "@/data/product";
import { flagAlert, getAlerts, markAlertRead, type BackendAlert } from "@/lib/api";
import { useAppStore } from "@/lib/app-store";

const severityTone: Record<Severity, { text: string; icon: string; rail: string }> = {
  Low: {
    text: "text-[#008751]",
    icon: "bg-[#008751]/10 text-[#008751]",
    rail: "bg-[#008751]",
  },
  Medium: {
    text: "text-[#0A0A0A]",
    icon: "bg-black/[0.03] text-[#0A0A0A]",
    rail: "bg-transparent",
  },
  High: {
    text: "text-red-600",
    icon: "bg-red-50 text-red-600",
    rail: "bg-red-500",
  },
};

function toSeverity(severity: BackendAlert["severity"]): Severity {
  return severity === "high" ? "High" : severity === "medium" ? "Medium" : "Low";
}

function formatAlertTime(value?: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const hourMs = 60 * 60 * 1000;
  const dayMs = 24 * hourMs;

  if (diffMs < dayMs) {
    const hours = Math.max(1, Math.round(diffMs / hourMs));
    return `${hours}h ago`;
  }

  const days = Math.round(diffMs / dayMs);
  return days === 1 ? "Yesterday" : `${days} days ago`;
}

function AlertCard({
  title,
  message,
  time,
  severity,
  resolved,
  disputed,
  resolving,
  disputing,
  onResolve,
  onDispute,
}: {
  title: string;
  message: string;
  time: string;
  severity: Severity;
  resolved?: boolean;
  disputed?: boolean;
  resolving?: boolean;
  disputing?: boolean;
  onResolve?: () => void;
  onDispute?: () => void;
}) {
  const tone = severityTone[severity];

  return (
    <div
      className={`relative overflow-hidden rounded-[26px] border border-black/[0.04] bg-white p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] ${
        resolved ? "opacity-70" : ""
      }`}
    >
      {tone.rail !== "bg-transparent" ? (
        <span className={`absolute top-0 bottom-0 left-0 w-1.5 ${tone.rail}`} />
      ) : null}
      <div className="flex items-start gap-4">
        <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] ${tone.icon}`}>
          <AlertTriangle size={25} strokeWidth={1.6} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
            <h2 className="text-lg leading-6 font-black text-[#0A0A0A]">
              {title}
            </h2>
            <span className={`pt-1 text-xs font-black tracking-[0.1em] uppercase ${tone.text}`}>
              {severity}
            </span>
          </div>
          <p className="mt-2 text-base leading-6 text-[#6B7280]">{message}</p>
          <p className="mt-2 text-sm font-medium text-[#6B7280]">{time}</p>
          {(resolved || disputed) ? (
            <p className="mt-3 text-sm font-semibold text-[#008751]">
              {[resolved ? "resolved" : "", disputed ? "disputed" : ""]
                .filter(Boolean)
                .join(" · ")}
            </p>
          ) : null}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={resolved || resolving || !onResolve}
              onClick={onResolve}
              className="h-14 rounded-[17px] bg-[#008751] text-base font-black text-white transition hover:bg-[#006B3F] disabled:opacity-55"
            >
              {resolving ? "Resolving" : resolved ? "Resolved" : "Resolve"}
            </button>
            <button
              type="button"
              disabled={disputed || disputing || !onDispute}
              onClick={onDispute}
              className="h-14 rounded-[17px] bg-black/[0.04] text-base font-black text-[#0A0A0A] transition hover:bg-black/[0.07] disabled:opacity-55"
            >
              {disputing ? "Disputing" : disputed ? "Disputed" : "Dispute"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AlertsPage() {
  const queryClient = useQueryClient();
  const token = useAppStore((state) => state.token);
  const demoMode = useAppStore((state) => state.demoMode);
  const alertsQuery = useQuery({
    queryKey: ["alerts"],
    queryFn: getAlerts,
    enabled: Boolean(token),
  });
  const markReadMutation = useMutation({
    mutationFn: markAlertRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["alerts"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
  const flagMutation = useMutation({
    mutationFn: flagAlert,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["alerts"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const backendAlerts = demoMode ? [] : alertsQuery.data || [];
  const loadingRealAlerts = Boolean(token) && !demoMode && alertsQuery.isLoading;

  return (
    <AppShell>
      <h1 className="text-[32px] leading-tight font-black">Fraud Alerts</h1>

      {!token && !demoMode ? (
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
        <div className="mt-7 grid gap-5">
          {loadingRealAlerts
            ? Array.from({ length: 3 }).map((_, index) => (
                <ProductCard key={index} className="rounded-[26px]">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-14 w-14 shrink-0 rounded-[16px]" />
                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <TextSkeleton className="w-36" />
                        <Skeleton className="ml-auto h-4 w-14 rounded-full" />
                      </div>
                      <TextSkeleton className="w-full" />
                      <TextSkeleton className="w-4/5" />
                      <TextSkeleton className="w-16" />
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <Skeleton className="h-14 rounded-[17px]" />
                        <Skeleton className="h-14 rounded-[17px]" />
                      </div>
                    </div>
                  </div>
                </ProductCard>
              ))
            : demoMode
              ? demoAlerts.map((alert) => (
                  <AlertCard
                    key={alert.title}
                    title={alert.title}
                    message={alert.description}
                    time={alert.time}
                    severity={alert.severity}
                  />
                ))
              : backendAlerts.map((alert) => {
                  const severity = toSeverity(alert.severity);

                  return (
                    <AlertCard
                      key={alert._id}
                      title={alert.title}
                      message={alert.message}
                      time={formatAlertTime(alert.createdAt)}
                      severity={severity}
                      resolved={Boolean(alert.readAt)}
                      disputed={Boolean(alert.flaggedAt)}
                      resolving={markReadMutation.isPending}
                      disputing={flagMutation.isPending}
                      onResolve={() => markReadMutation.mutate(alert._id)}
                      onDispute={() => flagMutation.mutate(alert._id)}
                    />
                  );
                })}

          {!loadingRealAlerts && !demoMode && backendAlerts.length === 0 ? (
            <ProductCard className="text-center">
              <h2 className="text-xl font-bold">No active backend alerts</h2>
              <p className="mt-2 text-sm text-[#6B7280]">
                Ask Watcher about fraud or start demo mode to seed alerts.
              </p>
            </ProductCard>
          ) : null}
        </div>
      )}

      {alertsQuery.isError && !demoMode ? (
        <ProductCard className="mt-8 text-sm font-semibold text-red-600">
          Could not load backend alerts. Confirm the backend URL is reachable.
        </ProductCard>
      ) : null}
    </AppShell>
  );
}
