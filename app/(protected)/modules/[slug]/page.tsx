import Link from "next/link";
import { notFound } from "next/navigation";
import { ensureCurrentStudent } from "@/lib/students";
import { getModuleBySlug } from "@/lib/modules";
import { getPublishedLessonsByModuleId } from "@/lib/lessons";
import { getLessonStatuses, lessonsWithStatus } from "@/lib/lesson-gate";
import { getModuleAccessMap } from "@/lib/module-gate";
import { getExamByModuleId } from "@/lib/exams";
import { hasPassedExam } from "@/lib/exams";
import { getPublishedModules } from "@/lib/modules";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppPageColumns } from "@/components/layout/AppPageColumns";
import { RightRailCard } from "@/components/layout/RightRailCard";
import { ContentSection } from "@/components/layout/ContentSection";
import { LessonStatusBadge } from "@/components/StatusBadge";

type Props = { params: Promise<{ slug: string }> };

export default async function ModuleDetailPage({ params }: Props) {
  const { slug } = await params;
  const moduleData = await getModuleBySlug(slug);
  if (!moduleData) notFound();

  const { student } = await ensureCurrentStudent();
  if (!student) notFound();

  const [lessons, allModules, exam] = await Promise.all([
    getPublishedLessonsByModuleId(moduleData.id),
    getPublishedModules(),
    getExamByModuleId(moduleData.id),
  ]);

  const statusMap = await getLessonStatuses(student.id, lessons);
  const lessonsWithStatusList = lessonsWithStatus(lessons, statusMap);
  const moduleAccessMap = await getModuleAccessMap(student.id, allModules);
  const canAccessModule = moduleAccessMap.get(moduleData.id) === true;
  const hasPassedThisExam = exam
    ? await hasPassedExam(student.id, exam.id)
    : false;
  const allLessonsCompleted = lessons.every(
    (l) => statusMap.get(l.id) === "completed"
  );
  const examUnlocked = !!exam && allLessonsCompleted;
  const completedLessonCount = lessons.filter(
    (l) => statusMap.get(l.id) === "completed"
  ).length;
  const progressPct =
    lessons.length > 0
      ? Math.round((completedLessonCount / lessons.length) * 100)
      : 0;

  if (!canAccessModule) {
    return (
      <div className="space-y-8 max-w-2xl">
        <PageHeader
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Academy", href: "/modules" },
            { label: "Locked module" },
          ]}
          eyebrow="Access"
          title="This module is locked"
          description="Pass the previous module's exam to unlock the next block in your training path."
          actions={
            <Link href="/modules" className="cb-btn cb-btn-primary">
              Back to academy
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <AppPageColumns
      main={
        <div className="space-y-10 lg:space-y-12">
          <PageHeader
            breadcrumbs={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Academy", href: "/modules" },
              { label: moduleData.title },
            ]}
            eyebrow={`Module ${moduleData.order_index}`}
            title={moduleData.title}
            description={moduleData.description ?? undefined}
            meta={
              <span>
                {lessons.length} lesson{lessons.length !== 1 ? "s" : ""} ·{" "}
                {completedLessonCount} complete
              </span>
            }
          />

          <ContentSection
            eyebrow="Sessions"
            title="Lesson sequence"
            description="Work in order. Status updates automatically when a lesson is completed."
          >
            {lessons.length === 0 ? (
              <div className="cb-panel border border-[color-mix(in_oklab,var(--border)_85%,transparent)] bg-[var(--surface-raised)] p-6">
                <div className="cb-caption">No lessons in this module yet.</div>
              </div>
            ) : (
              <ul className="space-y-3">
                {lessonsWithStatusList.map((lesson) => {
                  const isLocked = lesson.status === "locked";
                  return (
                    <li key={lesson.id} className={isLocked ? "opacity-50" : ""}>
                      {isLocked ? (
                        <div className="cb-panel border border-[color-mix(in_oklab,var(--border)_85%,transparent)] bg-[var(--surface-raised)] p-4 sm:p-5 cursor-not-allowed">
                          <div className="flex items-start justify-between gap-6">
                            <div className="flex items-start gap-4 min-w-0">
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-[var(--border)] bg-black text-sm font-light text-[var(--muted)]">
                                {lesson.order_index}
                              </span>
                              <div className="min-w-0">
                                <h3 className="font-light leading-snug text-[var(--muted)]">
                                  {lesson.title}
                                </h3>
                                {lesson.description && (
                                  <p className="cb-caption mt-1 line-clamp-2 text-[var(--muted)]">
                                    {lesson.description}
                                  </p>
                                )}
                                <div className="mt-3">
                                  <LessonStatusBadge status={lesson.status} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Link
                          href={`/lessons/${lesson.slug}`}
                          className={[
                            "group cb-panel block border border-[color-mix(in_oklab,var(--border)_85%,transparent)] bg-[var(--surface-raised)] p-4 sm:p-5 transition-colors",
                            "hover:bg-white/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20",
                          ].join(" ")}
                        >
                          <div className="flex items-start justify-between gap-6">
                            <div className="flex items-start gap-4 min-w-0">
                              <span
                                className={[
                                  "flex h-9 w-9 shrink-0 items-center justify-center border text-sm font-light bg-black",
                                  "border-[var(--border)] text-[var(--muted)]",
                                  "group-hover:border-white/35 group-hover:text-[var(--foreground)]",
                                ].join(" ")}
                              >
                                {lesson.order_index}
                              </span>
                              <div className="min-w-0">
                                <h3 className="font-light leading-snug text-[var(--foreground)]">
                                  {lesson.title}
                                </h3>
                                {lesson.description && (
                                  <p className="cb-caption mt-1 line-clamp-2 text-[var(--muted)]">
                                    {lesson.description}
                                  </p>
                                )}
                                <div className="mt-3">
                                  <LessonStatusBadge status={lesson.status} />
                                </div>
                              </div>
                            </div>
                            <div className="text-[11px] font-light tracking-[0.16em] uppercase text-[var(--muted)] group-hover:text-[var(--foreground)] pt-1">
                              Open
                            </div>
                          </div>
                        </Link>
                      )}
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
          <RightRailCard title="Module brief" eyebrow="Overview">
            <dl className="space-y-4">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="cb-caption">Order</dt>
                <dd className="text-sm font-light text-[var(--foreground)]">
                  {moduleData.order_index}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="cb-caption">Lessons</dt>
                <dd className="text-sm font-light text-[var(--foreground)]">
                  {lessons.length}
                </dd>
              </div>
              <div>
                <dt className="cb-caption">Progress</dt>
                <dd className="mt-2">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-2xl font-extralight text-[var(--foreground)]">
                      {progressPct}%
                    </span>
                    <span className="cb-caption">
                      {completedLessonCount}/{lessons.length || 0}
                    </span>
                  </div>
                  <div className="mt-2 h-px w-full bg-white/10">
                    <div
                      className="h-px bg-white/55"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </dd>
              </div>
            </dl>
          </RightRailCard>

          {exam && (
            <RightRailCard title="Certification" eyebrow="Milestone">
              {hasPassedThisExam ? (
                <p className="cb-body">
                  Exam cleared. Retake anytime to reinforce the standard.
                </p>
              ) : !examUnlocked ? (
                <p className="cb-body">
                  Complete every lesson in this module to unlock the exam.
                </p>
              ) : (
                <p className="cb-body">
                  All lessons complete. Submit the module exam to unlock what
                  comes next.
                </p>
              )}

              <div className="mt-6">
                {examUnlocked ? (
                  <Link
                    href={`/modules/${moduleData.slug}/exam`}
                    className="cb-btn cb-btn-primary w-full justify-center"
                  >
                    {hasPassedThisExam ? "Retake exam" : "Take exam"}
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="cb-btn cb-btn-secondary w-full justify-center opacity-60 cursor-not-allowed"
                  >
                    Exam locked
                  </button>
                )}
              </div>
            </RightRailCard>
          )}
        </div>
      }
    />
  );
}
