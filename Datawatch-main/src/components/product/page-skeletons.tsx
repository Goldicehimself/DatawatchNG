import { AppShell } from "@/components/layout/app-shell";
import { ProductCard } from "@/components/product/product-card";
import { ChartSkeleton, RowsSkeleton, Skeleton, TextSkeleton } from "@/components/ui/skeleton";

function PageTitleSkeleton() {
  return (
    <div>
      <TextSkeleton className="h-9 w-40" />
      <TextSkeleton className="mt-3 w-64" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <AppShell>
      <section className="rounded-[32px] bg-gradient-to-br from-[#008751] to-[#005C35] p-8 shadow-[0_24px_60px_rgba(0,92,53,0.22)]">
        <Skeleton className="h-4 w-28 bg-white/20" />
        <div className="mt-4 flex items-center gap-3">
          <Skeleton className="h-8 flex-1 bg-white/20" />
          <Skeleton className="h-10 w-10 rounded-full bg-white/20" />
        </div>
        <div className="mt-9 flex items-end justify-between gap-6">
          <div className="flex-1">
            <Skeleton className="h-4 w-24 bg-white/20" />
            <Skeleton className="mt-5 h-9 w-28 bg-white/20" />
          </div>
          <div className="flex-1">
            <Skeleton className="ml-auto h-4 w-20 bg-white/20" />
            <Skeleton className="mt-5 ml-auto h-9 w-24 bg-white/20" />
          </div>
        </div>
        <Skeleton className="mt-8 h-2 w-full rounded-full bg-white/20" />
        <Skeleton className="mt-5 h-5 w-64 bg-white/20" />
      </section>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-[104px] rounded-[24px]" />
        ))}
      </div>

      <section className="mt-7 space-y-5">
        <div>
          <TextSkeleton className="h-6 w-40" />
          <ProductCard className="mt-4">
            <RowsSkeleton rows={3} />
          </ProductCard>
        </div>

        <ProductCard>
          <TextSkeleton className="mb-5 h-6 w-28" />
          <ChartSkeleton compact />
        </ProductCard>

        <div className="grid grid-cols-2 gap-4">
          <ProductCard>
            <TextSkeleton className="w-16" />
            <Skeleton className="mt-3 h-9 w-14" />
          </ProductCard>
          <ProductCard>
            <TextSkeleton className="w-24" />
            <Skeleton className="mt-3 h-9 w-14" />
          </ProductCard>
        </div>
      </section>
    </AppShell>
  );
}

export function InsightsSkeleton() {
  return (
    <AppShell>
      <PageTitleSkeleton />
      <ProductCard className="mt-8">
        <TextSkeleton className="h-6 w-44" />
        <ChartSkeleton />
      </ProductCard>
      <ProductCard className="mt-8">
        <TextSkeleton className="h-6 w-48" />
        <div className="mt-8 grid grid-cols-[auto_1fr] items-center gap-4">
          <Skeleton className="h-28 w-28 rounded-full" />
          <RowsSkeleton rows={4} />
        </div>
      </ProductCard>
      <ProductCard className="mt-8">
        <TextSkeleton className="h-6 w-40" />
        <div className="mt-7">
          <RowsSkeleton rows={4} />
        </div>
      </ProductCard>
    </AppShell>
  );
}

export function AnalyticsSkeleton() {
  return (
    <AppShell>
      <TextSkeleton className="w-20" />
      <TextSkeleton className="mt-3 h-8 w-56" />
      <TextSkeleton className="mt-4 w-72" />
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <ProductCard>
          <TextSkeleton className="mb-5 h-5 w-36" />
          <ChartSkeleton />
        </ProductCard>
        <ProductCard>
          <TextSkeleton className="mb-5 h-5 w-40" />
          <RowsSkeleton rows={4} />
        </ProductCard>
        <ProductCard>
          <TextSkeleton className="mb-5 h-5 w-40" />
          <RowsSkeleton rows={3} />
        </ProductCard>
        <ProductCard>
          <TextSkeleton className="mb-5 h-5 w-32" />
          <RowsSkeleton rows={3} />
        </ProductCard>
      </div>
    </AppShell>
  );
}

export function AlertsSkeleton() {
  return (
    <AppShell>
      <TextSkeleton className="h-10 w-44" />
      <div className="mt-8 grid gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <ProductCard key={index}>
            <div className="flex items-start gap-4">
              <Skeleton className="h-12 w-12 shrink-0 rounded-[16px]" />
              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <TextSkeleton className="w-36" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <TextSkeleton className="w-full" />
                <TextSkeleton className="w-4/5" />
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                </div>
              </div>
            </div>
          </ProductCard>
        ))}
      </div>
    </AppShell>
  );
}

export function SubscriptionsSkeleton() {
  return (
    <AppShell>
      <TextSkeleton className="w-36" />
      <TextSkeleton className="mt-3 h-8 w-64" />
      <TextSkeleton className="mt-4 w-72" />
      <div className="mt-6 grid gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <ProductCard key={index}>
            <div className="flex items-start gap-4">
              <Skeleton className="h-11 w-11 shrink-0 rounded-[14px]" />
              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <TextSkeleton className="w-36" />
                    <TextSkeleton className="w-24" />
                  </div>
                  <TextSkeleton className="w-20" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-9 w-24 rounded-full" />
                  <Skeleton className="h-9 w-28" />
                </div>
              </div>
            </div>
          </ProductCard>
        ))}
      </div>
    </AppShell>
  );
}

export function WatcherSkeleton() {
  return (
    <AppShell>
      <TextSkeleton className="w-24" />
      <TextSkeleton className="mt-3 h-8 w-56" />
      <TextSkeleton className="mt-4 w-72" />
      <ProductCard className="mt-6 flex min-h-[620px] flex-col p-0">
        <div className="flex items-center justify-between border-b border-black/[0.06] p-5">
          <div className="flex items-center gap-3">
            <Skeleton className="h-11 w-11 rounded-[14px]" />
            <div className="space-y-2">
              <TextSkeleton className="w-24" />
              <TextSkeleton className="w-36" />
            </div>
          </div>
          <Skeleton className="h-10 w-20" />
        </div>
        <div className="flex-1 space-y-4 p-5">
          <Skeleton className="h-20 max-w-[86%] rounded-[20px]" />
          <Skeleton className="ml-auto h-14 max-w-[70%] rounded-[20px]" />
          <Skeleton className="h-20 max-w-[86%] rounded-[20px]" />
        </div>
        <div className="border-t border-black/[0.06] p-4">
          <div className="flex gap-2">
            <Skeleton className="h-12 flex-1 rounded-[14px]" />
            <Skeleton className="h-12 w-12 rounded-[14px]" />
          </div>
        </div>
      </ProductCard>
    </AppShell>
  );
}

export function SettingsSkeleton() {
  return (
    <AppShell>
      <TextSkeleton className="h-10 w-36" />
      <ProductCard className="mt-8 flex items-center gap-5">
        <Skeleton className="h-24 w-24 shrink-0 rounded-[22px]" />
        <div className="space-y-3">
          <TextSkeleton className="h-7 w-36" />
          <TextSkeleton className="h-6 w-44" />
        </div>
      </ProductCard>
      <TextSkeleton className="mt-7 w-24" />
      <ProductCard className="mt-4 space-y-5">
        <RowsSkeleton rows={2} />
      </ProductCard>
      <TextSkeleton className="mt-7 w-16" />
      <ProductCard className="mt-4 space-y-5">
        <RowsSkeleton rows={3} />
      </ProductCard>
    </AppShell>
  );
}
