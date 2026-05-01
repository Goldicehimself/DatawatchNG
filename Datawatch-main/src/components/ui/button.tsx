import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: "primary" | "secondary" | "dark" | "ghost";
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-[14px] px-5 text-sm font-semibold shadow-sm transition duration-200 ease-out focus-visible:ring-4 focus-visible:ring-[#008751]/20 focus-visible:outline-none active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" &&
          "bg-[#008751] text-white shadow-[0_12px_26px_rgba(0,135,81,0.18)] hover:bg-[#005C35] dark:bg-[#00A866] dark:text-white dark:hover:bg-[#008751]",
        variant === "secondary" &&
          "border border-black/10 bg-white text-[#0A0A0A] hover:bg-black/[0.03] dark:border-white/[0.12] dark:bg-[#17231D] dark:text-[#F3F7F4] dark:hover:bg-white/[0.08]",
        variant === "dark" &&
          "bg-[#0A0A0A] text-white shadow-[0_12px_26px_rgba(10,10,10,0.16)] hover:bg-black/80 dark:bg-[#F3F7F4] dark:text-[#07110D] dark:hover:bg-white",
        variant === "ghost" &&
          "bg-transparent text-[#0A0A0A] hover:bg-black/[0.04] dark:text-[#F3F7F4] dark:hover:bg-white/[0.08]",
        className,
      )}
      {...props}
    />
  );
}

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  children: ReactNode;
  variant?: ButtonProps["variant"];
};

export function ButtonLink({
  className,
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-[14px] px-5 text-sm font-semibold shadow-sm transition duration-200 ease-out focus-visible:ring-4 focus-visible:ring-[#008751]/20 focus-visible:outline-none active:scale-[0.97]",
        variant === "primary" &&
          "bg-[#008751] text-white shadow-[0_12px_26px_rgba(0,135,81,0.18)] hover:bg-[#005C35] dark:bg-[#00A866] dark:text-white dark:hover:bg-[#008751]",
        variant === "secondary" &&
          "border border-black/10 bg-white text-[#0A0A0A] hover:bg-black/[0.03] dark:border-white/[0.12] dark:bg-[#17231D] dark:text-[#F3F7F4] dark:hover:bg-white/[0.08]",
        variant === "dark" &&
          "bg-[#0A0A0A] text-white shadow-[0_12px_26px_rgba(10,10,10,0.16)] hover:bg-black/80 dark:bg-[#F3F7F4] dark:text-[#07110D] dark:hover:bg-white",
        variant === "ghost" &&
          "bg-transparent text-[#0A0A0A] hover:bg-black/[0.04] dark:text-[#F3F7F4] dark:hover:bg-white/[0.08]",
        className,
      )}
      {...props}
    />
  );
}
