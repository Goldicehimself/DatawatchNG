"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import type { ReactNode } from "react";
import { appNav } from "@/data/product";
import { useAppStore } from "@/lib/app-store";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const demoMode = useAppStore((state) => state.demoMode);
  const toggleDemoMode = useAppStore((state) => state.toggleDemoMode);

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#0A0A0A] dark:bg-[#07110D] dark:text-[#F3F7F4]">
      <div className="mx-auto min-h-screen w-full max-w-[430px] border-x border-black/[0.05] bg-[#FAFAFA] pb-[calc(6rem+env(safe-area-inset-bottom))] shadow-[0_0_40px_rgba(15,23,42,0.04)] dark:border-white/[0.08] dark:bg-[#0B1511] dark:shadow-[0_0_44px_rgba(0,0,0,0.35)]">
        <header className="app-header sticky top-0 z-30 border-b border-black/[0.06] bg-[#FAFAFA]/90 px-6 py-4 shadow-[0_10px_28px_rgba(15,23,42,0.03)] backdrop-blur-xl dark:border-[#2EE68F]/24 dark:bg-[#020805]/96 dark:shadow-[0_12px_34px_rgba(0,0,0,0.55)]">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-[18px] focus-visible:ring-4 focus-visible:ring-[#008751]/20 focus-visible:outline-none"
            >
              <span className="app-header-logo flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)] dark:bg-[#0D1A13] dark:shadow-[0_8px_24px_rgba(0,0,0,0.48)]">
                <Image
                  src="/datawatchimg-removebg-preview.png"
                  alt="DataWatch NG"
                  width={34}
                  height={34}
                  className="h-8 w-8 object-contain"
                  style={{ width: "100%", height: "100%" }}
                />
              </span>
              <span>
                <span className="app-header-eyebrow block text-sm leading-none font-bold tracking-[0.22em] text-[#6B7280] uppercase dark:text-[#D8E2DD]">
                  DataWatch
                </span>
                <span className="app-header-title block text-xl leading-tight font-bold dark:text-[#FFFFFF]">
                  Nigeria
                </span>
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/demo"
                className={cn(
                  "text-sm font-bold",
                  demoMode ? "text-[#008751] dark:text-[#2EE68F]" : "text-[#6B7280] dark:text-[#D8E2DD]",
                )}
              >
                DEMO
              </Link>
              <button
                type="button"
                aria-label="Toggle demo mode"
                aria-pressed={demoMode}
                onClick={toggleDemoMode}
                className={cn(
                  "app-header-toggle flex h-9 w-16 items-center rounded-full p-1 shadow-inner transition hover:bg-black/[0.06] focus-visible:ring-4 focus-visible:ring-[#008751]/20 focus-visible:outline-none dark:hover:bg-white/[0.14]",
                  demoMode ? "bg-[#008751] dark:bg-[#00A866]" : "bg-black/[0.04] dark:bg-white/[0.18]",
                )}
              >
                <span
                  className={cn(
                    "h-7 w-7 rounded-full bg-white shadow-[0_4px_12px_rgba(15,23,42,0.16)] transition dark:bg-[#F4FFF9] dark:shadow-[0_4px_14px_rgba(0,0,0,0.45)]",
                    demoMode && "translate-x-7",
                  )}
                />
              </button>
              <Link
                href="/alerts"
                aria-label="Alerts"
                className="app-header-bell relative flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#0A0A0A] shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-[#008751]/20 focus-visible:outline-none dark:bg-[#0D1A13] dark:text-[#FFFFFF] dark:shadow-[0_8px_24px_rgba(0,0,0,0.48)]"
              >
                <Bell size={22} strokeWidth={1.5} />
                <span className="live-pulse absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-[#DC2626]" />
              </Link>
            </div>
          </div>
        </header>

        <main className="px-6 py-7">{children}</main>

        <nav className="app-bottom-nav fixed right-0 bottom-0 left-0 z-40 mx-auto max-w-[430px] border-t border-black/[0.08] bg-white/95 px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-[#2EE68F]/40 dark:bg-[#020805] dark:shadow-[0_-14px_38px_rgba(0,0,0,0.68)]">
          <div className="grid grid-cols-5 gap-1">
            {appNav.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "app-bottom-nav-item relative flex h-16 flex-col items-center justify-center gap-1 rounded-[14px] text-xs font-bold text-[#6B7280] transition duration-200 hover:bg-black/[0.03] focus-visible:ring-4 focus-visible:ring-[#008751]/20 focus-visible:outline-none dark:text-[#F4FFF9] dark:hover:bg-white/[0.12]",
                    active && "app-bottom-nav-item-active bg-[#008751]/10 text-[#008751] dark:bg-[#00A866] dark:text-[#03100A]",
                  )}
                >
                  <Icon
                    size={25}
                    strokeWidth={active ? 1.9 : 1.65}
                    aria-hidden="true"
                  />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
