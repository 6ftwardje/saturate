import Link from "next/link";
import { SaturateHueLine } from "@/components/SaturateHueLine";
import { ensureCurrentStudent } from "@/lib/students";
import { getPublishedModules } from "@/lib/modules";
import { getLessonCountByModuleId } from "@/lib/lessons";
import { getModuleAccessMap } from "@/lib/module-gate";
import { getExamByModuleId, hasPassedExam } from "@/lib/exams";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppPageColumns } from "@/components/layout/AppPageColumns";
import { RightRailCard } from "@/components/layout/RightRailCard";
import { ModuleStateBadge } from "@/components/StatusBadge";

export default async function ModulesPage() {
  const { student } = await ensureCurrentStudent();
  const modules = await getPublishedModules();
  const lessonCounts = await Promise.all(
    modules.map((m) => getLessonCountByModuleId(m.id))
  );

  const moduleAccessMap = student
    ? await getModuleAccessMap(student.id, modules)
    : new Map<number, boolean>();

  const orderedModules = [...modules].sort((a, b) => a.order_index - b.order_index);

  const moduleStateMap = new Map<number, "locked" | "available" | "completed">();
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
  }

  const openCount = orderedModules.filter((m) => {
    const s = moduleStateMap.get(m.id) ?? "locked";
    return s === "available" || s === "completed";
  }).length;

  return (
    <AppPageColumns
      main={
        <div className="space-y-10 lg:space-y-12">
          <PageHeader
            breadcrumbs={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Academy" },
            ]}
            eyebrow="Learning path"
            title="Academy modules"
            description="Each module is a complete training block. Finish lessons in order, then pass the module exam to unlock what comes next."
          />

          <div className="cb-panel border border-[color-mix(in_oklab,var(--border)_85%,transparent)] bg-[var(--surface-raised)] p-6 sm:p-8">
            <div className="cb-eyebrow">Sequence</div>
            <div className="mt-3">
              <SaturateHueLine width={110} />
            </div>
            <p className="mt-5 cb-body max-w-2xl">
              The academy is designed as a single coherent arc—tight execution,
              clear milestones, no noise.
            </p>
          </div>

          {orderedModules.length === 0 ? (
            <div className="cb-panel p-8 text-center">
              <div className="cb-caption">No published modules yet.</div>
            </div>
          ) : (
            <ul className="space-y-3">
              {orderedModules.map((mod, i) => {
                const state = moduleStateMap.get(mod.id) ?? "locked";
                const canOpen = state === "available" || state === "completed";
                const lessonCount = lessonCounts[i];
                return (
                  <li key={mod.id}>
                    {canOpen ? (
                      <Link
                        href={`/modules/${mod.slug}`}
                        className="group cb-panel block border border-[color-mix(in_oklab,var(--border)_85%,transparent)] bg-[var(--surface-raised)] p-5 sm:p-6 transition-colors hover:bg-white/[0.04]"
                      >
                        <div className="flex items-start justify-between gap-8">
                          <div className="min-w-0 space-y-3">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="text-[10px] font-light tracking-[0.2em] uppercase text-[var(--muted)] group-hover:text-[var(--foreground)]">
                                Module {mod.order_index}
                              </span>
                              <ModuleStateBadge state={state} />
                            </div>
                            <h2 className="text-lg sm:text-xl font-light leading-snug text-[var(--foreground)]">
                              {mod.title}
                            </h2>
                            {mod.short_description && (
                              <p className="cb-caption line-clamp-2">
                                {mod.short_description}
                              </p>
                            )}
                            <p className="cb-caption">
                              {lessonCount} lesson{lessonCount !== 1 ? "s" : ""}
                            </p>
                          </div>
                          <div className="text-[11px] font-light tracking-[0.16em] uppercase text-[var(--muted)] group-hover:text-[var(--foreground)] pt-1">
                            Open
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <div className="cb-panel border border-[color-mix(in_oklab,var(--border)_85%,transparent)] bg-black/40 p-5 sm:p-6 opacity-60">
                        <div className="flex items-start justify-between gap-8">
                          <div className="min-w-0 space-y-3">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="text-[10px] font-light tracking-[0.2em] uppercase text-[var(--muted)]">
                                Module {mod.order_index}
                              </span>
                              <ModuleStateBadge state={state} />
                            </div>
                            <h2 className="text-lg sm:text-xl font-light leading-snug text-[var(--foreground)]">
                              {mod.title}
                            </h2>
                            {mod.short_description && (
                              <p className="cb-caption line-clamp-2">
                                {mod.short_description}
                              </p>
                            )}
                            <p className="cb-caption">
                              {lessonCount} lesson{lessonCount !== 1 ? "s" : ""}
                            </p>
                          </div>
                          <div className="pt-1">
                            <span className="cb-caption">
                              Unlock after previous exam
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      }
      rail={
        <RightRailCard title="How the path works" eyebrow="Rules">
          <ol className="space-y-4 cb-body text-[color-mix(in_oklab,var(--foreground)_88%,var(--muted))]">
            <li className="flex gap-3">
              <span className="mt-0.5 text-[var(--muted)]">01</span>
              <span>Complete lessons in order inside each module.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 text-[var(--muted)]">02</span>
              <span>Pass the module exam to unlock the next module.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 text-[var(--muted)]">03</span>
              <span>Repeat until the full academy is cleared.</span>
            </li>
          </ol>
          <div className="mt-6 border-t border-[color-mix(in_oklab,var(--border)_80%,transparent)] pt-6">
            <div className="text-[11px] font-light tracking-[0.16em] uppercase text-[var(--muted)]">
              Access window
            </div>
            <p className="mt-3 cb-caption">
              {openCount} of {orderedModules.length || 0} modules are currently
              open for you.
            </p>
          </div>
        </RightRailCard>
      }
    />
  );
}
