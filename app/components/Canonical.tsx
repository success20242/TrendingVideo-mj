'use client';

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function CanonicalTag() {
  const pathname = usePathname();

  useEffect(() => {
    const canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    canonical.setAttribute("href", `https://trendifyhub.vercel.app${pathname === "/" ? "" : pathname}`);
    document.head.appendChild(canonical);

    return () => {
      document.head.removeChild(canonical);
    };
  }, [pathname]);

  return null;
}
