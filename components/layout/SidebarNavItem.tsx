"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export function SidebarNavItem({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "group relative flex items-center gap-3 px-3 py-2.5 text-[11px] font-light tracking-[0.16em] uppercase transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/20",
        active
          ? "bg-white/[0.07] text-[var(--foreground)]"
          : "text-[var(--muted)] hover:bg-white/[0.04] hover:text-[var(--foreground)]",
      ].join(" ")}
    >
      <span
        className={[
          "absolute left-0 top-2 bottom-2 w-px bg-white transition-opacity",
          active ? "opacity-100" : "opacity-0 group-hover:opacity-40",
        ].join(" ")}
        aria-hidden
      />
      <span
        className={[
          "shrink-0 transition-colors",
          active
            ? "text-[var(--foreground)]"
            : "text-[var(--muted)] group-hover:text-[var(--foreground)]",
        ].join(" ")}
      >
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </Link>
  );
}
