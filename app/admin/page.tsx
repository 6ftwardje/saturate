import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";

export default function AdminHomePage() {
  return (
    <div className="space-y-10">
      <PageHeader
        breadcrumbs={[{ label: "Admin", href: "/admin" }]}
        eyebrow="Operator"
        title="Control room"
        description="Structured access to people and progress. Analytics will land here next."
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <Link
          href="/admin/students"
          className="group block border border-[color-mix(in_oklab,var(--border)_85%,transparent)] bg-[var(--surface-raised)] p-8 transition-colors hover:bg-white/[0.04]"
        >
          <div className="cb-eyebrow">Directory</div>
          <h2 className="mt-4 text-xl font-light text-[var(--foreground)]">
            Students
          </h2>
          <p className="mt-3 cb-caption max-w-md">
            Search, sort, and open a student to see program position and take
            controlled actions.
          </p>
          <p className="mt-6 text-[11px] font-light tracking-[0.2em] uppercase text-[var(--muted)] group-hover:text-[var(--foreground)]">
            Open →
          </p>
        </Link>

        <div className="border border-[color-mix(in_oklab,var(--border)_55%,transparent)] bg-black/30 p-8">
          <div className="cb-eyebrow">Analytics</div>
          <h2 className="mt-4 text-xl font-light text-[var(--muted)]">
            Coming later
          </h2>
          <p className="mt-3 cb-caption max-w-md">
            Drop-off, question-level failure patterns, and cohort views will plug
            into this layer without reshaping routing.
          </p>
        </div>
      </div>
    </div>
  );
}
