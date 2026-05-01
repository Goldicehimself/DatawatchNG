"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function isInternalNavigationLink(anchor: HTMLAnchorElement) {
  const href = anchor.getAttribute("href");

  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }

  if (anchor.target && anchor.target !== "_self") {
    return false;
  }

  const url = new URL(anchor.href, window.location.href);
  return url.origin === window.location.origin && url.pathname !== window.location.pathname;
}

export function RouteTransitionLoader() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target instanceof Element ? event.target : null;
      const anchor = target?.closest("a");

      if (anchor instanceof HTMLAnchorElement && isInternalNavigationLink(anchor)) {
        setLoading(true);
      }
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      previousPathname.current = pathname;
      setLoading(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (!loading) {
      return;
    }

    const timeout = window.setTimeout(() => setLoading(false), 2500);
    return () => window.clearTimeout(timeout);
  }, [loading]);

  if (!loading) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 top-0 z-[998] mx-auto h-1 max-w-[430px] overflow-hidden bg-[#008751]/10">
      <div className="h-full w-1/2 animate-[loader-slide_1s_ease-in-out_infinite] rounded-full bg-[#008751]" />
    </div>
  );
}
