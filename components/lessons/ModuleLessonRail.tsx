import Link from "next/link";
import { RightRailCard } from "@/components/layout/RightRailCard";
import { LessonStatusBadge } from "@/components/StatusBadge";
import type { Lesson, LessonStatus } from "@/lib/types";

export type LessonWithStatus = Lesson & { status: LessonStatus };

export function ModuleLessonRail({
  moduleTitle,
  moduleSlug,
  moduleOrderIndex,
  lessons,
  currentLessonId,
}: {
  moduleTitle: string;
  moduleSlug: string;
  moduleOrderIndex: number;
  lessons: LessonWithStatus[];
  currentLessonId: number;
}) {
  const completed = lessons.filter((l) => l.status === "completed").length;

  return (
    <RightRailCard
      eyebrow={`Module ${moduleOrderIndex}`}
      title={moduleTitle}
    >
      <p className="cb-caption">
        {completed} of {lessons.length} lessons complete
      </p>

      <ol className="mt-5 space-y-0 border-t border-[color-mix(in_oklab,var(--border)_80%,transparent)] pt-4">
        {lessons.map((lesson) => {
          const isCurrent = lesson.id === currentLessonId;
          const isLocked = lesson.status === "locked";
          const row = (
            <div
              className={[
                "flex gap-3 py-3 border-b border-[color-mix(in_oklab,var(--border)_55%,transparent)] last:border-b-0",
                isLocked ? "cb-unavailable-lesson" : "",
                isCurrent ? "bg-white/[0.04] -mx-3 px-3" : "",
              ].join(" ")}
            >
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border border-[var(--border)] bg-black text-[11px] font-light text-[var(--muted)]">
                {lesson.order_index}
              </span>
              <div className="min-w-0 flex-1">
                <div
                  className={[
                    "text-[13px] font-light leading-snug",
                    isCurrent
                      ? "text-[var(--foreground)]"
                      : "text-[color-mix(in_oklab,var(--foreground)_93%,var(--muted))]",
                  ].join(" ")}
                >
                  {lesson.title}
                </div>
                <div className="mt-2">
                  <LessonStatusBadge status={lesson.status} />
                </div>
              </div>
            </div>
          );

          if (isLocked) {
            return <li key={lesson.id}>{row}</li>;
          }

          return (
            <li key={lesson.id}>
              <Link
                href={`/lessons/${lesson.slug}`}
                className={[
                  "block rounded-none outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/20",
                  !isCurrent ? "hover:bg-white/[0.03]" : "",
                ].join(" ")}
              >
                {row}
              </Link>
            </li>
          );
        })}
      </ol>

      <div className="mt-5">
        <Link
          href={`/modules/${moduleSlug}`}
          className="cb-btn cb-btn-secondary w-full justify-center text-[11px] tracking-[0.14em] uppercase"
        >
          Module overview
        </Link>
      </div>
    </RightRailCard>
  );
}
