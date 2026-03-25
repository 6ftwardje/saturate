import Link from "next/link";
import { SaturateHueLine } from "@/components/SaturateHueLine";
import { ensureCurrentStudent } from "@/lib/students";
import { getDashboardStats } from "@/lib/dashboard";
import { getPublishedModules } from "@/lib/modules";
import { getModuleAccessMap } from "@/lib/module-gate";
import { getLessonCountByModuleId } from "@/lib/lessons";
import { getExamByModuleId, hasPassedExam } from "@/lib/exams";
import type { Module } from "@/lib/types";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppPageColumns } from "@/components/layout/AppPageColumns";
import { RightRailCard } from "@/components/layout/RightRailCard";
import { ContentSection } from "@/components/layout/ContentSection";
import { ModuleStateBadge } from "@/components/StatusBadge";

export default async function DashboardPage() {
  const { student } = await ensureCurrentStudent();
  const [stats, modules] = await Promise.all([
    getDashboardStats(),
    getPublishedModules(),
  ]);

  const moduleAccessMap = student
    ? await getModuleAccessMap(student.id, modules)
    : new Map<number, boolean>();

  const orderedModules = [...modules].sort(
    (a, b) => a.order_index - b.order_index
  );

  const moduleStateMap = new Map<
    number,
    "locked" | "available" | "completed"
  >();

  if (student) {
    await Promise.all(
      orderedModules.map(async (mod) => {
        const canAccess = moduleAccessMap.get(mod.id) === true;
        if (!canAccess) {
          moduleStateMap.set(mod.id, "locked");
          return;
        }

        const exam = await getExamByModuleId(mod.id);
        if (!exam) {
          moduleStateMap.set(mod.id, "available");
          return;
        }

        const passed = await hasPassedExam(student.id, exam.id);
        moduleStateMap.set(mod.id, passed ? "completed" : "available");
      })
    );
  } else {
    for (const mod of orderedModules) {
      moduleStateMap.set(
        mod.id,
        moduleAccessMap.get(mod.id) === true ? "available" : "locked"
      );
    }
  }

  const featuredModule =
    orderedModules.find((m) => moduleStateMap.get(m.id) !== "locked") ??
    orderedModules[0] ??
    null;

  const featuredLessonCount = featuredModule
    ? await getLessonCountByModuleId(featuredModule.id)
    : 0;

  const completedModules = orderedModules.filter(
    (m) => moduleStateMap.get(m.id) === "completed"
  ).length;
  const publishedTotal = orderedModules.length;
  const pathPct =
    publishedTotal > 0
      ? Math.round((completedModules / publishedTotal) * 100)
      : 0;

  function moduleLockedCopy(mod: Module) {
    if (mod.order_index === 1) return "Available";
    return "Unlock after previous exam";
  }

  return (
    <AppPageColumns
      main={
        <div className="space-y-12 lg:space-y-14">
          <PageHeader
            breadcrumbs={[{ label: "Dashboard" }]}
            eyebrow="Saturate Academy"
            title={
              student?.name
                ? `Welcome back, ${student.name.split(" ")[0] ?? student.name}`
                : "Your workspace"
            }
            description="A calm training path. Complete lessons in order, pass each module exam, and unlock the next block."
            actions={
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {featuredModule ? (
                  <Link
                    href={`/modules/${featuredModule.slug}`}
                    className="cb-btn cb-btn-primary"
                  >
                    Continue
                  </Link>
                ) : null}
                <Link
                  href="/modules"
                  className="cb-btn cb-btn-secondary"
                >
                  Academy overview
                </Link>
              </div>
            }
          />

          <div className="cb-panel border border-[color-mix(in_oklab,var(--border)_85%,transparent)] bg-[var(--surface-raised)] p-8 sm:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-4 max-w-xl">
                <div className="cb-eyebrow">Current focus</div>
                <div className="mt-2">
                  <SaturateHueLine width={120} />
                </div>
                <p className="cb-body">
                  Pick up where you left off. One module at a time keeps the
                  standard high.
                </p>
              </div>
              {featuredModule ? (
                <Link
                  href={`/modules/${featuredModule.slug}`}
                  className="group block border border-[color-mix(in_oklab,var(--border)_85%,transparent)] bg-black/40 p-6 transition-colors hover:bg-white/[0.04] sm:min-w-[280px]"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="min-w-0 space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[10px] font-light tracking-[0.2em] uppercase text-[var(--muted)]">
                          Module {featuredModule.order_index}
                        </span>
                        <ModuleStateBadge
                          state={
                            moduleStateMap.get(featuredModule.id) ?? "locked"
                          }
                        />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-light leading-tight text-[var(--foreground)]">
                        {featuredModule.title}
                      </h2>
                      {featuredModule.short_description && (
                        <p className="cb-caption line-clamp-2">
                          {featuredModule.short_description}
                        </p>
                      )}
                      <p className="cb-caption">{featuredLessonCount} lessons</p>
                    </div>
                    <span className="text-[var(--muted)]" aria-hidden>
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.25"
                      >
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ) : (
                <div className="cb-caption">No published modules yet.</div>
              )}
            </div>
          </div>

          <ContentSection
            eyebrow="Training path"
            title="Modules in sequence"
            description="Work through the academy in order. Locked modules open after you pass the prior exam."
          >
            {orderedModules.length === 0 ? (
              <div className="cb-panel p-8">
                <div className="cb-caption">No published modules yet.</div>
              </div>
            ) : (
              <ul className="space-y-3">
                {orderedModules.map((mod) => {
                  const state = moduleStateMap.get(mod.id) ?? "locked";
                  const canOpen = state === "available" || state === "completed";
                  if (canOpen) {
                    return (
                      <li key={mod.id}>
                        <Link
                          href={`/modules/${mod.slug}`}
                          className="group cb-panel block border border-[color-mix(in_oklab,var(--border)_85%,transparent)] bg-[var(--surface-raised)] p-5 sm:p-6 transition-colors hover:bg-white/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
                        >
                          <div className="flex items-start justify-between gap-8">
                            <div className="min-w-0 space-y-3">
                              <div className="flex flex-wrap items-center gap-3">
                                <span className="text-[10px] font-light tracking-[0.2em] uppercase text-[var(--muted)] group-hover:text-[var(--foreground)]">
                                  Module {mod.order_index}
                                </span>
                                <ModuleStateBadge state={state} />
                              </div>
                              <h3 className="text-lg sm:text-xl font-light leading-snug text-[var(--foreground)]">
                                {mod.title}
                              </h3>
                              {mod.short_description && (
                                <p className="cb-caption line-clamp-2">
                                  {mod.short_description}
                                </p>
                              )}
                            </div>
                            <div className="pt-1 text-[11px] font-light tracking-[0.16em] uppercase text-[var(--muted)] group-hover:text-[var(--foreground)]">
                              Open
                            </div>
                          </div>
                        </Link>
                      </li>
                    );
                  }

                  return (
                    <li key={mod.id}>
                      <div className="cb-panel cb-unavailable border border-[color-mix(in_oklab,var(--border)_90%,transparent)] bg-black/35 p-5 sm:p-6">
                        <div className="flex items-start justify-between gap-8">
                          <div className="min-w-0 space-y-3">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="text-[10px] font-light tracking-[0.2em] uppercase text-[var(--muted)]">
                                Module {mod.order_index}
                              </span>
                              <ModuleStateBadge state={state} />
                            </div>
                            <h3 className="text-lg sm:text-xl font-light leading-snug text-[var(--foreground)]">
                              {mod.title}
                            </h3>
                            {mod.short_description && (
                              <p className="cb-caption line-clamp-2">
                                {mod.short_description}
                              </p>
                            )}
                          </div>
                          <div className="pt-1">
                            <span className="cb-caption">{moduleLockedCopy(mod)}</span>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </ContentSection>
        </div>
      }
      rail={
        <div className="space-y-6">
          <RightRailCard title="Academy snapshot" eyebrow="Orientation">
            <div className="space-y-6">
              <div>
                <div className="text-[11px] font-light tracking-[0.16em] uppercase text-[var(--muted)]">
                  Modules cleared
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extralight text-[var(--foreground)]">
                    {completedModules}
                  </span>
                  <span className="text-sm font-light text-[var(--muted)]">
                    / {publishedTotal}
                  </span>
                </div>
                <div className="mt-2 h-px w-full bg-white/10">
                  <div
                    className="h-px bg-white/60 transition-[width]"
                    style={{ width: `${pathPct}%` }}
                  />
                </div>
              </div>

              <div className="border-t border-[color-mix(in_oklab,var(--border)_80%,transparent)] pt-6">
                <div className="text-[11px] font-light tracking-[0.16em] uppercase text-[var(--muted)]">
                  Library
                </div>
                <dl className="mt-4 space-y-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="cb-caption">Published modules</dt>
                    <dd className="text-sm font-light text-[var(--foreground)]">
                      {stats.publishedModules}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="cb-caption">Lessons</dt>
                    <dd className="text-sm font-light text-[var(--foreground)]">
                      {stats.totalLessons}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="border-t border-[color-mix(in_oklab,var(--border)_80%,transparent)] pt-6">
                <div className="text-[11px] font-light tracking-[0.16em] uppercase text-[var(--muted)]">
                  Next step
                </div>
                <p className="mt-3 cb-body">
                  {featuredModule ? (
                    <>
                      Stay inside{" "}
                      <span className="text-[var(--foreground)]">
                        {featuredModule.title}
                      </span>{" "}
                      until the exam is passed.
                    </>
                  ) : (
                    "Your training path will appear here once modules are published."
                  )}
                </p>
              </div>
            </div>
          </RightRailCard>
        </div>
      }
    />
  );
}
