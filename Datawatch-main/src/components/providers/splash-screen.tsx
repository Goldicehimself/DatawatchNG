"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLoader } from "@/components/product/brand-loader";
import { cn } from "@/lib/utils";

export function SplashScreen() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (pathname !== "/" || window.sessionStorage.getItem("datawatch-splash-seen") === "true") {
      setVisible(false);
      return;
    }

    window.sessionStorage.setItem("datawatch-splash-seen", "true");
    setLeaving(false);
    setVisible(true);

    const leaveTimer = window.setTimeout(() => {
      setLeaving(true);
    }, 1300);
    const hideTimer = window.setTimeout(() => {
      setVisible(false);
    }, 1650);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(hideTimer);
    };
  }, [pathname]);

  if (!visible) {
    return null;
  }

  return (
    <div
      className={cn(
        "splash-screen-fallback fixed inset-0 z-[999] transition duration-300 ease-out",
        leaving && "pointer-events-none opacity-0",
      )}
    >
      <BrandLoader />
    </div>
  );
}
