import { demoUsage } from "@/data/product";
import { cn } from "@/lib/utils";

export type UsageBarItem = {
  day: string;
  value: number;
};

const emptyUsage: UsageBarItem[] = [
  { day: "Mon", value: 0 },
  { day: "Tue", value: 0 },
  { day: "Wed", value: 0 },
  { day: "Thu", value: 0 },
  { day: "Fri", value: 0 },
  { day: "Sat", value: 0 },
  { day: "Sun", value: 0 },
];

export function UsageBars({
  compact = false,
  data,
}: {
  compact?: boolean;
  data?: UsageBarItem[];
}) {
  const values = data === undefined ? demoUsage : data.length ? data : emptyUsage;
  const hasRecordedUsage =
    data === undefined || values.some((item) => item.value > 0);
  const maxValue = Math.max(...values.map((item) => item.value), 1);

  return (
    <div>
      <div className={cn("flex gap-2", compact ? "h-24" : "h-40")}>
        {values.map((item, index) => (
          <div
            key={`${item.day}-${index}`}
            className="flex h-full flex-1 flex-col items-center gap-2"
          >
            <div className="flex min-h-0 flex-1 items-end self-stretch">
              <div
                className={cn(
                  "w-full rounded-t-[10px] transition",
                  hasRecordedUsage
                    ? "bg-[#008751]"
                    : "border border-black/[0.08] bg-black/[0.14]",
                )}
                style={{
                  height: hasRecordedUsage
                    ? `${Math.max(10, (item.value / maxValue) * 100)}%`
                    : "18px",
                }}
              />
            </div>
            <span className="text-[11px] text-[#6B7280]">{item.day}</span>
          </div>
        ))}
      </div>
      {!hasRecordedUsage ? (
        <p className="mt-3 text-center text-xs font-semibold text-[#6B7280]">
          0MB recorded this week
        </p>
      ) : null}
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
