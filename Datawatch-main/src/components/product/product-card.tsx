import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  children: ReactNode;
  className?: string;
};

export function ProductCard({ children, className }: ProductCardProps) {
  return (
    <div
      className={cn(
        "animate-fade-up rounded-[20px] border border-black/[0.06] bg-white p-5 text-[#0A0A0A] shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_22px_52px_rgba(15,23,42,0.09)] dark:border-white/[0.10] dark:bg-[#111C17] dark:text-[#F3F7F4] dark:shadow-[0_18px_48px_rgba(0,0,0,0.34)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  body,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="animate-fade-up mx-auto max-w-2xl text-center">
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-[#008751] uppercase dark:text-[#3EE39B]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-2xl leading-tight font-semibold tracking-normal text-[#0A0A0A] sm:text-4xl dark:text-[#F3F7F4]">
        {title}
      </h2>
      {body ? (
        <p className="mt-3 text-sm leading-6 text-[#6B7280] dark:text-[#A8B3AD]">{body}</p>
      ) : null}
    </div>
  );
}
