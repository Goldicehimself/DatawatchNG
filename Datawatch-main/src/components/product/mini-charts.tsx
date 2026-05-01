import { demoUsage } from "@/data/product";
import { cn } from "@/lib/utils";

export type UsageBarItem = {
  day: string;
  value: number;
};

export function UsageBars({
  compact = false,
  data,
}: {
  compact?: boolean;
  data?: UsageBarItem[];
}) {
  const values = data?.length ? data : demoUsage;
  const maxValue = Math.max(...values.map((item) => item.value), 1);

  return (
    <div className={cn("flex items-end gap-2", compact ? "h-24" : "h-40")}>
      {values.map((item, index) => (
        <div
          key={`${item.day}-${index}`}
          className="flex flex-1 flex-col items-center gap-2"
        >
          <div
            className="w-full rounded-t-[10px] bg-[#008751]"
            style={{ height: `${Math.max(8, (item.value / maxValue) * 100)}%` }}
          />
          <span className="text-[11px] text-[#6B7280]">{item.day}</span>
        </div>
      ))}
    </div>
  );
}

export function ProgressRow({
  name,
  value,
  percent,
}: {
  name: string;
  value: string;
  percent: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium">{name}</span>
        <span className="text-[#6B7280]">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-black/[0.06]">
        <div
          className="h-2 rounded-full bg-[#FFCC00]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
