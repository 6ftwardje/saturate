"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SaturateHueLine } from "@/components/SaturateHueLine";
import { SaturateLogo } from "@/components/SaturateLogo";
import { SidebarNavItem } from "@/components/layout/SidebarNavItem";
import {
  IconClose,
  IconDashboard,
  IconLifeBuoy,
  IconMenu,
  IconModules,
  IconSignOut,
  IconUser,
} from "@/components/icons/NavIcons";

const primaryNav = [
  { href: "/dashboard", label: "Dashboard", icon: IconDashboard },
  { href: "/modules", label: "Academy", icon: IconModules },
  { href: "/account", label: "Account", icon: IconUser },
] as const;

function SidebarContents({
  studentName,
  pathname,
  onNavigate,
}: {
  studentName: string | null;
  pathname: string;
  onNavigate?: () => void;
}) {
  const initials = studentName
    ? studentName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join("")
    : "";

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 px-4 pt-6 pb-5">
        <SaturateLogo href="/dashboard" priority />
        <div className="mt-4">
          <SaturateHueLine width={88} />
        </div>

        {studentName && (
          <Link
            href="/account"
            onClick={onNavigate}
            className="mt-6 flex items-center gap-3 border border-[color-mix(in_oklab,var(--border)_70%,transparent)] bg-[var(--surface-raised)] px-3 py-3 transition-colors hover:bg-white/[0.05]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--border)] bg-black text-[11px] font-light tracking-wide text-[var(--foreground)]">
              {initials || studentName[0]?.toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12px] font-light text-[var(--foreground)]">
                {studentName}
              </div>
              <div className="mt-0.5 text-[10px] font-light tracking-[0.14em] uppercase text-[var(--muted)]">
                Member
              </div>
            </div>
            <span className="text-[var(--muted)]" aria-hidden>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </Link>
        )}
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-2 pb-4" aria-label="Main">
        <div className="space-y-0.5">
          {primaryNav.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <SidebarNavItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={<Icon />}
                active={isActive}
              />
            );
          })}
        </div>
      </nav>

      <div className="shrink-0 border-t border-[color-mix(in_oklab,var(--border)_80%,transparent)] px-2 py-4">
        <div className="space-y-0.5">
          <a
            href="mailto:support@saturate.com"
            className="group flex items-center gap-3 px-3 py-2.5 text-[11px] font-light tracking-[0.16em] uppercase text-[var(--muted)] transition-colors hover:bg-white/[0.04] hover:text-[var(--foreground)]"
          >
            <span className="text-[var(--muted)] group-hover:text-[var(--foreground)]">
              <IconLifeBuoy />
            </span>
            Support
          </a>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="group flex w-full items-center gap-3 px-3 py-2.5 text-left text-[11px] font-light tracking-[0.16em] uppercase text-[var(--muted)] transition-colors hover:bg-white/[0.04] hover:text-[var(--foreground)]"
            >
              <span className="text-[var(--muted)] group-hover:text-[var(--foreground)]">
                <IconSignOut />
              </span>
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function AppShell({
  children,
  studentName,
}: {
  children: React.ReactNode;
  studentName: string | null;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
    document.body.style.overflow = "";
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  return (
    <div className="flex h-dvh min-h-0 max-h-dvh overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <aside className="relative z-30 hidden h-dvh min-h-0 shrink-0 flex-col overflow-hidden border-r border-[color-mix(in_oklab,var(--border)_85%,transparent)] bg-[var(--surface-sidebar)] lg:flex">
        <SidebarContents studentName={studentName} pathname={pathname} />
      </aside>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-[2px] lg:hidden"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={[
          "fixed inset-y-0 left-0 z-50 w-[min(300px,88vw)] border-r border-[color-mix(in_oklab,var(--border)_85%,transparent)] bg-[var(--surface-sidebar)] shadow-[8px_0_40px_rgba(0,0,0,0.65)] transition-transform duration-200 ease-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full pointer-events-none",
        ].join(" ")}
      >
        <div className="flex h-14 items-center justify-between border-b border-[color-mix(in_oklab,var(--border)_85%,transparent)] px-4">
          <SaturateLogo href="/dashboard" className="scale-95 origin-left" />
          <button
            type="button"
            className="p-2 text-[var(--muted)] hover:text-[var(--foreground)]"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <IconClose />
          </button>
        </div>
        <div className="h-[calc(100dvh-3.5rem)] overflow-hidden">
          <SidebarContents
            studentName={studentName}
            pathname={pathname}
            onNavigate={() => setMobileOpen(false)}
          />
        </div>
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-[color-mix(in_oklab,var(--border)_70%,transparent)] bg-[#000000]/88 px-4 backdrop-blur-md lg:hidden">
          <button
            type="button"
            className="inline-flex items-center gap-2 p-2 text-[var(--foreground)]"
            onClick={() => setMobileOpen(true)}
            aria-expanded={mobileOpen}
            aria-label="Open navigation"
          >
            <IconMenu />
          </button>
          <SaturateLogo href="/dashboard" className="scale-90" />
          <span className="w-10" aria-hidden />
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-gutter:stable]">
          <div className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
