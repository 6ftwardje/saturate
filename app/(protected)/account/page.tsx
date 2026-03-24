import Link from "next/link";
import { ensureCurrentStudent } from "@/lib/students";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppPageColumns } from "@/components/layout/AppPageColumns";
import { RightRailCard } from "@/components/layout/RightRailCard";

export default async function AccountPage() {
  const { student } = await ensureCurrentStudent();

  const initials = student?.name
    ? student.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join("")
    : "";

  return (
    <AppPageColumns
      main={
        <div className="space-y-10">
          <PageHeader
            breadcrumbs={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Account" },
            ]}
            eyebrow="Identity"
            title="Account"
            description="Member profile and access state—minimal, so you can stay focused on the work."
          />

          <section className="cb-panel border border-[color-mix(in_oklab,var(--border)_85%,transparent)] bg-[var(--surface-raised)] p-6 sm:p-8">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-5">
                <div className="h-14 w-14 shrink-0 border border-[var(--border)] bg-black flex items-center justify-center text-sm font-light text-[var(--foreground)]">
                  {initials || "S"}
                </div>
                <div className="min-w-0">
                  <div className="cb-eyebrow">Member</div>
                  <div className="mt-2 text-xl font-light text-[var(--foreground)] truncate">
                    {student?.name ?? "Not set"}
                  </div>
                  <div className="cb-caption mt-1 truncate">
                    {student?.email ?? "—"}
                  </div>
                </div>
              </div>

              <form action="/auth/signout" method="post">
                <button type="submit" className="cb-btn cb-btn-secondary">
                  Sign out
                </button>
              </form>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="border border-[color-mix(in_oklab,var(--border)_85%,transparent)] bg-black/35 p-5 sm:p-6">
                <div className="cb-eyebrow">Access level</div>
                <div className="mt-3 text-2xl font-extralight text-[var(--foreground)]">
                  {student?.access_level ?? 1}
                </div>
                <div className="mt-2 cb-caption">
                  Your membership tier for academy access.
                </div>
              </div>
              <div className="border border-[color-mix(in_oklab,var(--border)_85%,transparent)] bg-black/35 p-5 sm:p-6">
                <div className="cb-eyebrow">Status</div>
                <div className="mt-3 text-2xl font-extralight text-[var(--foreground)]">
                  Active
                </div>
                <div className="mt-2 cb-caption">
                  You currently have access to your training path.
                </div>
              </div>
            </div>
          </section>
        </div>
      }
      rail={
        <RightRailCard title="Workspace" eyebrow="Shortcuts">
          <p className="cb-body">
            Return to training anytime from the academy modules list.
          </p>
          <div className="mt-6 space-y-3">
            <Link
              href="/dashboard"
              className="block border border-[color-mix(in_oklab,var(--border)_85%,transparent)] bg-black/30 px-4 py-3 text-[11px] font-light tracking-[0.16em] uppercase text-[var(--foreground)] transition-colors hover:bg-white/[0.04]"
            >
              Dashboard
            </Link>
            <Link
              href="/modules"
              className="block border border-[color-mix(in_oklab,var(--border)_85%,transparent)] bg-black/30 px-4 py-3 text-[11px] font-light tracking-[0.16em] uppercase text-[var(--foreground)] transition-colors hover:bg-white/[0.04]"
            >
              Academy
            </Link>
          </div>
        </RightRailCard>
      }
    />
  );
}
