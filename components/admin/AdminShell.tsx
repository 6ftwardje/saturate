"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SaturateHueLine } from "@/components/SaturateHueLine";
import { SaturateLogo } from "@/components/SaturateLogo";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/students", label: "Students" },
] as const;

export function AdminShell({
  children,
  adminLabel,
}: {
  children: React.ReactNode;
  adminLabel: string;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--background)] text-[var(--foreground)]">
      <header className="shrink-0 border-b border-[color-mix(in_oklab,var(--border)_80%,transparent)] bg-[#000000]/92 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
            <div className="min-w-0">
              <SaturateLogo href="/dashboard" priority />
              <div className="mt-3">
                <SaturateHueLine width={88} />
              </div>
              <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="cb-eyebrow">Admin</span>
                <span className="cb-caption truncate">{adminLabel}</span>
              </div>
            </div>
          </div>

          <nav
            className="flex flex-wrap items-center gap-2 border border-[color-mix(in_oklab,var(--border)_70%,transparent)] bg-[var(--surface-raised)] p-1"
            aria-label="Admin"
          >
            {nav.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "px-4 py-2 text-[11px] font-light tracking-[0.18em] uppercase transition-colors",
                    active
                      ? "bg-white/[0.08] text-[var(--foreground)]"
                      : "text-[var(--muted)] hover:bg-white/[0.04] hover:text-[var(--foreground)]",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/dashboard"
              className="px-4 py-2 text-[11px] font-light tracking-[0.18em] uppercase text-[var(--muted)] transition-colors hover:bg-white/[0.04] hover:text-[var(--foreground)]"
            >
              App
            </Link>
            <form action="/auth/signout" method="post" className="inline">
              <button
                type="submit"
                className="px-4 py-2 text-[11px] font-light tracking-[0.18em] uppercase text-[var(--muted)] transition-colors hover:bg-white/[0.04] hover:text-[var(--foreground)]"
              >
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="min-h-0 flex-1">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
