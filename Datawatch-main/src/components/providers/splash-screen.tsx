"use client";

import { useEffect, useState } from "react";
import { BrandLoader } from "@/components/product/brand-loader";
import { cn } from "@/lib/utils";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
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
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-[999] transition duration-300 ease-out",
        leaving && "pointer-events-none opacity-0",
      )}
    >
      <BrandLoader />
    </div>
  );
}
