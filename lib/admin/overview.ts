import { createAdminClient } from "@/lib/supabase/admin";
import type { Lesson, Module } from "@/lib/types";
import { getExamResultSummariesForStudent, type ExamResultSummary } from "@/lib/admin/exams";

export type LessonProgressRow = {
  lesson: Lesson;
  watched: boolean;
  watchedAt: string | null;
};

export type ModuleProgressBlock = {
  module: Module;
  lessons: LessonProgressRow[];
  completedLessonCount: number;
  totalLessonCount: number;
  exam: ExamResultSummary | null;
};

/**
 * Full program view for one student: modules → lessons + completion + exam summary.
 */
export async function getStudentProgramOverview(
  studentId: string
): Promise<ModuleProgressBlock[]> {
  const admin = createAdminClient();

  const { data: modules, error: modError } = await admin
    .from("modules")
    .select("*")
    .eq("is_published", true)
    .order("order_index", { ascending: true });

  if (modError || !modules?.length) return [];

  const examSummaries = await getExamResultSummariesForStudent(studentId);

  const blocks: ModuleProgressBlock[] = [];

  for (const mod of modules as Module[]) {
    const { data: lessons, error: lesError } = await admin
      .from("lessons")
      .select("*")
      .eq("module_id", mod.id)
      .eq("is_published", true)
      .order("order_index", { ascending: true });

    if (lesError) continue;

    const lessonList = (lessons ?? []) as Lesson[];
    const lessonIds = lessonList.map((l) => l.id);

    let progressMap = new Map<number, { watched: boolean; watched_at: string | null }>();
    if (lessonIds.length > 0) {
      const { data: prog } = await admin
        .from("progress")
        .select("lesson_id, watched, watched_at")
        .eq("student_id", studentId)
        .in("lesson_id", lessonIds);

      progressMap = new Map(
        (prog ?? []).map((p: { lesson_id: number; watched: boolean; watched_at: string | null }) => [
          p.lesson_id,
          { watched: p.watched, watched_at: p.watched_at },
        ])
      );
    }

    const lessonRows: LessonProgressRow[] = lessonList.map((lesson) => {
      const p = progressMap.get(lesson.id);
      return {
        lesson,
        watched: p?.watched === true,
        watchedAt: p?.watched_at ?? null,
      };
    });

    const completedLessonCount = lessonRows.filter((r) => r.watched).length;

    const examForModule = [...examSummaries.values()].find((s) => s.moduleId === mod.id) ?? null;

    blocks.push({
      module: mod,
      lessons: lessonRows,
      completedLessonCount,
      totalLessonCount: lessonRows.length,
      exam: examForModule,
    });
  }

  return blocks;
}
