import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={style}
      className={cn(
        "animate-pulse rounded-[12px] bg-[linear-gradient(90deg,rgba(0,0,0,0.04),rgba(0,135,81,0.09),rgba(0,0,0,0.04))] bg-[length:220%_100%]",
        className,
      )}
    />
  );
}

export function TextSkeleton({
  className,
}: {
  className?: string;
}) {
  return <Skeleton className={cn("h-4", className)} />;
}

export function ChartSkeleton({
  compact = false,
}: {
  compact?: boolean;
}) {
  const bars = [34, 52, 42, 68, 78, 100, 72];

  return (
    <div className={cn("flex gap-2", compact ? "h-24" : "h-40")}>
      {bars.map((height, index) => (
        <div
          key={index}
          className="flex h-full flex-1 flex-col items-center gap-2"
        >
          <div className="flex min-h-0 flex-1 items-end self-stretch">
            <Skeleton
              className="w-full rounded-t-[10px]"
              style={{ height: `${height}%` }}
            />
          </div>
          <Skeleton className="h-3 w-7 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function RowsSkeleton({
  rows = 3,
}: {
  rows?: number;
}) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index}>
          <div className="mb-3 flex items-center justify-between gap-4">
            <TextSkeleton className="w-28" />
            <TextSkeleton className="w-16" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      ))}
    </div>
  );
}
