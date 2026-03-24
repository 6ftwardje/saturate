import Link from "next/link";
import { notFound } from "next/navigation";
import { ensureCurrentStudent } from "@/lib/students";
import { getLessonBySlug, getPublishedLessonsByModuleId } from "@/lib/lessons";
import { getModuleById } from "@/lib/modules";
import { getLessonStatuses, lessonsWithStatus } from "@/lib/lesson-gate";
import { getProgressByLessonIds } from "@/lib/progress";
import { getExamByModuleId } from "@/lib/exams";
import { VimeoPlayer } from "@/components/VimeoPlayer";
import { LessonAutoCompleteVideo } from "./LessonAutoCompleteVideo";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppPageColumns } from "@/components/layout/AppPageColumns";
import { ModuleLessonRail } from "@/components/lessons/ModuleLessonRail";
import { RightRailCard } from "@/components/layout/RightRailCard";

type Props = { params: Promise<{ slug: string }> };

export default async function LessonPage({ params }: Props) {
  const { slug } = await params;
  const lesson = await getLessonBySlug(slug);
  if (!lesson) notFound();

  const { student } = await ensureCurrentStudent();
  if (!student) notFound();

  const allLessons = await getPublishedLessonsByModuleId(lesson.module_id);
  const [moduleData, statusMap, progressMap, exam] = await Promise.all([
    getModuleById(lesson.module_id),
    getLessonStatuses(student.id, allLessons),
    getProgressByLessonIds(student.id, allLessons.map((l) => l.id)),
    getExamByModuleId(lesson.module_id),
  ]);

  if (!moduleData) notFound();

  const lessonsForRail = lessonsWithStatus(allLessons, statusMap);

  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
  const status = statusMap.get(lesson.id) ?? "locked";
  const isCompleted = progressMap.get(lesson.id)?.watched === true;
  const canAccess = status === "available" || status === "completed";

  const prevLesson =
    currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1]
      : null;
  const isLastLesson = nextLesson === null && allLessons.length > 0;
  const allLessonsCompleted = allLessons.every(
    (l) => progressMap.get(l.id)?.watched === true
  );
  const examAvailable = !!exam && allLessonsCompleted;

  if (!canAccess) {
    return (
      <div className="space-y-8 max-w-2xl">
        <PageHeader
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Academy", href: "/modules" },
            { label: moduleData.title, href: `/modules/${moduleData.slug}` },
            { label: "Locked lesson" },
          ]}
          eyebrow="Access"
          title="This lesson is locked"
          description="Complete the previous lesson in this module to unlock this session."
          actions={
            <Link
              href={`/modules/${moduleData.slug}`}
              className="cb-btn cb-btn-primary"
            >
              Back to module
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <AppPageColumns
      main={
        <div className="space-y-8 lg:space-y-10">
          <PageHeader
            breadcrumbs={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Academy", href: "/modules" },
              { label: moduleData.title, href: `/modules/${moduleData.slug}` },
              { label: lesson.title },
            ]}
            eyebrow={`Module ${moduleData.order_index} · Lesson ${lesson.order_index}`}
            title={lesson.title}
            titleClassName="text-[clamp(1.35rem,2.8vw,2.25rem)] font-light tracking-tight uppercase leading-[1.12]"
            description={lesson.description ?? undefined}
            meta={
              <span>
                Lesson {lesson.order_index} of {allLessons.length}
              </span>
            }
          />

          <section className="cb-panel border border-[color-mix(in_oklab,var(--border)_85%,transparent)] bg-black/40 p-3 sm:p-4">
            {isCompleted ? (
              <VimeoPlayer
                videoUrl={lesson.video_url}
                videoProvider={lesson.video_provider}
                title={lesson.title}
              />
            ) : (
              <LessonAutoCompleteVideo
                lessonId={lesson.id}
                videoUrl={lesson.video_url}
                videoProvider={lesson.video_provider}
                title={lesson.title}
                isCompleted={isCompleted}
              />
            )}
          </section>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-h-[42px]">
              {isCompleted ? (
                <span className="cb-badge cb-badge-completed">Completed</span>
              ) : (
                <span className="cb-caption">
                  Progress updates automatically when the lesson is finished.
                </span>
              )}
            </div>
          </div>

          <nav
            className="flex flex-col gap-6 border-t border-[color-mix(in_oklab,var(--border)_80%,transparent)] pt-8 sm:flex-row sm:items-center sm:justify-between"
            aria-label="Lesson navigation"
          >
            <div>
              {prevLesson ? (
                <Link
                  href={`/lessons/${prevLesson.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-light text-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  Previous: {prevLesson.title}
                </Link>
              ) : (
                <span className="text-sm text-[var(--muted)]">
                  No previous lesson
                </span>
              )}
            </div>
            <div className="text-left sm:text-right">
              {nextLesson ? (
                <Link
                  href={`/lessons/${nextLesson.slug}`}
                  className="cb-btn cb-btn-primary inline-flex"
                >
                  Next: {nextLesson.title}
                </Link>
              ) : isLastLesson && examAvailable ? (
                <Link
                  href={`/modules/${moduleData.slug}/exam`}
                  className="cb-btn cb-btn-primary inline-flex"
                >
                  Take module exam
                </Link>
              ) : isLastLesson ? (
                <p className="text-sm text-[var(--muted)]">
                  Complete this lesson to unlock the module exam.
                </p>
              ) : (
                <span className="text-sm text-[var(--muted)]">
                  No next lesson
                </span>
              )}
            </div>
          </nav>
        </div>
      }
      rail={
        <div className="space-y-6">
          <ModuleLessonRail
            moduleTitle={moduleData.title}
            moduleSlug={moduleData.slug}
            moduleOrderIndex={moduleData.order_index}
            lessons={lessonsForRail}
            currentLessonId={lesson.id}
          />
          {exam && (
            <RightRailCard title="Certification" eyebrow="After lessons">
              {examAvailable ? (
                <p className="cb-body">
                  All lessons complete. The module exam is the milestone that
                  unlocks the next block.
                </p>
              ) : (
                <p className="cb-body">
                  Finish every lesson in this module to unlock the exam.
                </p>
              )}
              <div className="mt-5">
                {examAvailable ? (
                  <Link
                    href={`/modules/${moduleData.slug}/exam`}
                    className="cb-btn cb-btn-primary w-full justify-center"
                  >
                    Open exam
                  </Link>
                ) : (
                  <div className="cb-btn cb-btn-secondary w-full justify-center opacity-60 cursor-not-allowed">
                    Exam locked
                  </div>
                )}
              </div>
            </RightRailCard>
          )}
        </div>
      }
    />
  );
}
