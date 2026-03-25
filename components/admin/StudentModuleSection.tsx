import Link from "next/link";
import {
  markStudentModuleCompleteAction,
  resetStudentModuleProgressAction,
} from "@/lib/admin/actions";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import type { ModuleProgressBlock } from "@/lib/admin/overview";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function StudentModuleSection({
  block,
  studentId,
}: {
  block: ModuleProgressBlock;
  studentId: string;
}) {
  const { module, lessons, completedLessonCount, totalLessonCount, exam } =
    block;
  const pct =
    totalLessonCount > 0
      ? Math.round((completedLessonCount / totalLessonCount) * 100)
      : 0;

  const markComplete = markStudentModuleCompleteAction.bind(
    null,
    studentId,
    module.id
  );
  const resetModule = resetStudentModuleProgressAction.bind(
    null,
    studentId,
    module.id
  );

  return (
    <section className="border border-[color-mix(in_oklab,var(--border)_80%,transparent)] bg-[var(--surface-raised)]">
      <div className="flex flex-col gap-4 border-b border-[color-mix(in_oklab,var(--border)_65%,transparent)] px-5 py-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-light tracking-[0.2em] uppercase text-[var(--muted)]">
              Module {module.order_index}
            </span>
            <span className="cb-badge cb-badge-available">
              Lessons {completedLessonCount}/{totalLessonCount}
            </span>
          </div>
          <h2 className="text-lg font-light text-[var(--foreground)]">
            {module.title}
          </h2>
          <div className="h-1 w-full max-w-[240px] bg-white/[0.08]">
            <div
              className="h-full bg-white/[0.35]"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <ConfirmSubmit
            action={markComplete}
            message="Mark all lessons in this module complete? Exam results are not changed."
            className="inline"
          >
            <button type="submit" className="cb-btn cb-btn-secondary">
              Mark module complete
            </button>
          </ConfirmSubmit>
          <ConfirmSubmit
            action={resetModule}
            message="Reset lesson progress for this module only? Exam results stay as-is."
            className="inline"
          >
            <button type="submit" className="cb-btn cb-btn-secondary">
              Reset module progress
            </button>
          </ConfirmSubmit>
        </div>
      </div>

      <div className="grid gap-6 px-5 py-6 lg:grid-cols-[1fr_minmax(0,320px)]">
        <div>
          <div className="cb-eyebrow">Lessons</div>
          <ul className="mt-4 space-y-2">
            {lessons.map(({ lesson, watched }) => (
              <li
                key={lesson.id}
                className="flex flex-wrap items-center justify-between gap-3 border border-[color-mix(in_oklab,var(--border)_45%,transparent)] bg-black/25 px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="text-sm font-light text-[var(--foreground)]">
                    {lesson.title}
                  </div>
                  <div className="mt-0.5 cb-caption">
                    <Link
                      href={`/lessons/${lesson.slug}`}
                      className="hover:underline"
                    >
                      Open in app
                    </Link>
                  </div>
                </div>
                <span
                  className={
                    watched ? "cb-badge cb-badge-completed" : "cb-badge cb-badge-locked"
                  }
                >
                  {watched ? "Completed" : "Not completed"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3 border border-[color-mix(in_oklab,var(--border)_45%,transparent)] bg-black/25 p-4">
          <div className="cb-eyebrow">Exam (read-only)</div>
          {exam ? (
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="cb-caption">Title</dt>
                <dd className="max-w-[200px] text-right text-[var(--foreground)]">
                  {exam.examTitle}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="cb-caption">Latest score</dt>
                <dd className="text-[var(--foreground)]">
                  {exam.latestScore !== null ? `${exam.latestScore}%` : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="cb-caption">Latest outcome</dt>
                <dd>
                  {exam.latestPassed === null ? (
                    <span className="cb-caption">No attempts</span>
                  ) : exam.latestPassed ? (
                    <span className="cb-badge cb-badge-completed">Passed</span>
                  ) : (
                    <span className="cb-badge cb-badge-locked">Failed</span>
                  )}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="cb-caption">Ever passed</dt>
                <dd>
                  {exam.hasPassedEver ? (
                    <span className="cb-badge cb-badge-completed">Yes</span>
                  ) : (
                    <span className="cb-badge cb-badge-locked">No</span>
                  )}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="cb-caption">Attempts</dt>
                <dd className="text-[var(--foreground)]">{exam.attemptCount}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="cb-caption">Latest submitted</dt>
                <dd className="cb-caption text-right">
                  {formatDate(exam.latestSubmittedAt)}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="cb-caption">No published exam for this module.</p>
          )}
        </div>
      </div>
    </section>
  );
}
