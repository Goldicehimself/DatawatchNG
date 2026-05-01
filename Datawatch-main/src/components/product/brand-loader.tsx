import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandLoader({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center bg-[#FAFAFA] px-6 text-[#0A0A0A]",
        className,
      )}
    >
      <div className="relative flex flex-col items-center text-center">
        <div className="absolute top-0 h-64 w-64 rounded-full bg-[#008751]/10 blur-3xl" />
        <div
          className={cn(
            "heartbeat-logo relative flex items-center justify-center rounded-[32px] border border-[#008751]/10 bg-white/70 shadow-[0_28px_80px_rgba(0,135,81,0.16)] backdrop-blur",
            compact ? "h-28 w-28" : "h-36 w-36",
          )}
        >
          <Image
            src="/datawatchimg-removebg-preview.png"
            alt="DataWatch NG"
            width={compact ? 72 : 92}
            height={compact ? 72 : 92}
            priority
            className="object-contain"
          />
        </div>

        <h1
          className={cn(
            "relative mt-10 font-black tracking-[-0.04em]",
            compact ? "text-4xl" : "text-5xl",
          )}
        >
          DataWatch <span className="text-[#008751]">NG</span>
        </h1>
        <p className="relative mt-5 text-sm font-black tracking-[0.36em] text-[#6B7280] uppercase">
          Know where your data goes
        </p>

        <div className="relative mt-10 h-1.5 w-44 overflow-hidden rounded-full bg-black/[0.06]">
          <div className="h-full w-1/2 animate-[loader-slide_1.1s_ease-in-out_infinite] rounded-full bg-[#008751]" />
        </div>
      </div>
    </div>
  );
}
