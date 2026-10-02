"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // Remount route content so CSS entrances restart before paint. Each section
  // animates when it mounts, including content that arrives after a loading state.
  return <div key={pathname} className="page-transition">{children}</div>;
}
