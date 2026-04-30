"use client";

import { AlertTriangle, CheckCircle2, CreditCard, XCircle } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { ProductCard } from "@/components/product/product-card";
import { Button, ButtonLink } from "@/components/ui/button";
import { cancelSubscription, formatNaira, getSubscriptions } from "@/lib/api";
import { useAppStore } from "@/lib/app-store";

export default function SubscriptionsPage() {
  const queryClient = useQueryClient();
  const token = useAppStore((state) => state.token);
  const subscriptionsQuery = useQuery({
    queryKey: ["subscriptions"],
    queryFn: getSubscriptions,
    enabled: Boolean(token),
  });
  const cancelMutation = useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      void queryClient.invalidateQueries({ queryKey: ["alerts"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  return (
    <AppShell>
      <p className="text-sm font-semibold text-[#008751]">
        Subscription manager
      </p>
      <h1 className="mt-2 text-3xl font-semibold">Control recurring charges</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6B7280]">
        Detect active subscriptions, recurring charges, and suspicious services.
        Cancellation is simulated by the backend MVP.
      </p>

      {!token ? (
        <ProductCard className="mt-6 text-center">
          <h2 className="text-xl font-semibold">No backend session</h2>
          <p className="mt-2 text-sm text-[#6B7280]">
            Start demo mode to load seeded subscription data.
          </p>
          <ButtonLink href="/demo" className="mt-5">
            Start demo
          </ButtonLink>
        </ProductCard>
      ) : null}

      <div className="mt-6 grid gap-4">
        {(subscriptionsQuery.data || []).map((sub) => {
          const cancelled = sub.status === "cancelled";
          const suspicious = sub.status === "flagged" || sub.isHidden;

          return (
            <ProductCard key={sub._id} className={cancelled ? "opacity-70" : ""}>
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] ${
                    cancelled
                      ? "bg-black/[0.04] text-[#6B7280]"
                      : suspicious
                        ? "bg-[#FFCC00]/25 text-[#7A5A00]"
                        : "bg-[#008751]/10 text-[#008751]"
                  }`}
                >
                  {suspicious ? (
                    <AlertTriangle size={22} strokeWidth={1.5} />
                  ) : (
                    <CreditCard size={22} strokeWidth={1.5} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold">{sub.serviceName}</h2>
                      <p className="mt-1 text-sm text-[#6B7280]">
                        {sub.provider}
                      </p>
                    </div>
                    <span className="text-right text-sm font-semibold">
                      {formatNaira(sub.amount)} / {sub.billingCycle}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${
                        cancelled
                          ? "bg-black/[0.04] text-[#6B7280]"
                          : suspicious
                            ? "bg-[#FFCC00]/25 text-[#7A5A00]"
                            : "bg-[#008751]/10 text-[#005C35]"
                      }`}
                    >
                      {cancelled ? (
                        <CheckCircle2 size={14} strokeWidth={1.5} />
                      ) : suspicious ? (
                        <XCircle size={14} strokeWidth={1.5} />
                      ) : (
                        <CheckCircle2 size={14} strokeWidth={1.5} />
                      )}
                      {cancelled ? "Cancelled" : sub.status}
                    </span>
                    <Button
                      variant="secondary"
                      className="h-9 text-xs"
                      disabled={cancelled || cancelMutation.isPending}
                      onClick={() => cancelMutation.mutate(sub._id)}
                    >
                      {cancelled ? "Cancelled" : "Cancel service"}
                    </Button>
                  </div>
                </div>
              </div>
            </ProductCard>
          );
        })}

        {token && !subscriptionsQuery.isLoading && !subscriptionsQuery.data?.length ? (
          <ProductCard className="text-center">
            <h2 className="text-xl font-semibold">No subscriptions found</h2>
            <p className="mt-2 text-sm text-[#6B7280]">
              Demo mode seeds active and suspicious services automatically.
            </p>
          </ProductCard>
        ) : null}
      </div>
    </AppShell>
  );
}
