"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        suppressHydrationWarning
        className={cn(
          "landing-theme-toggle flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/12 text-white shadow-[0_10px_26px_rgba(0,0,0,0.18)] backdrop-blur transition hover:bg-white/20 focus-visible:ring-4 focus-visible:ring-[#2EE68F]/30 focus-visible:outline-none dark:bg-[#0D1A13] dark:text-[#F4FFF9] dark:hover:bg-white/[0.12]",
          className,
        )}
      >
        <Sun size={17} strokeWidth={1.8} />
      </button>
    );
  }

  const activeTheme = theme || "system";
  const Icon =
    activeTheme === "system" ? Monitor : resolvedTheme === "dark" ? Moon : Sun;
  const label =
    activeTheme === "system"
      ? "Use light mode"
      : resolvedTheme === "dark"
        ? "Use light mode"
        : "Use dark mode";

  function toggleTheme() {
    if (activeTheme === "system") {
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
      return;
    }

    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  return (
    <button
      type="button"
      aria-label={label}
      suppressHydrationWarning
      onClick={toggleTheme}
      className={cn(
        "landing-theme-toggle flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/12 text-white shadow-[0_10px_26px_rgba(0,0,0,0.18)] backdrop-blur transition hover:bg-white/20 focus-visible:ring-4 focus-visible:ring-[#2EE68F]/30 focus-visible:outline-none dark:bg-[#0D1A13] dark:text-[#F4FFF9] dark:hover:bg-white/[0.12]",
        className,
      )}
    >
      <Icon size={17} strokeWidth={1.8} />
    </button>
  );
}
