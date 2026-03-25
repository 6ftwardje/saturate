import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Mark all published lessons in a module complete (lessons only; does not touch exams).
 */
export async function markStudentModuleComplete(
  studentId: string,
  moduleId: number
): Promise<{ error: string | null }> {
  const admin = createAdminClient();

  const { data: lessons, error: lessonsError } = await admin
    .from("lessons")
    .select("id")
    .eq("module_id", moduleId)
    .eq("is_published", true);

  if (lessonsError) return { error: lessonsError.message };
  const lessonIds = (lessons ?? []).map((l: { id: number }) => l.id);
  if (lessonIds.length === 0) return { error: null };

  const now = new Date().toISOString();
  const rows = lessonIds.map((lesson_id) => ({
    student_id: studentId,
    lesson_id,
    watched: true,
    watched_at: now,
  }));

  const { error } = await admin.from("progress").upsert(rows, {
    onConflict: "student_id,lesson_id",
    ignoreDuplicates: false,
  });

  if (error) return { error: error.message };
  return { error: null };
}

/**
 * Remove lesson progress for this module only (exam_results unchanged).
 */
export async function resetStudentModuleProgress(
  studentId: string,
  moduleId: number
): Promise<{ error: string | null }> {
  const admin = createAdminClient();

  const { data: lessons, error: lessonsError } = await admin
    .from("lessons")
    .select("id")
    .eq("module_id", moduleId);

  if (lessonsError) return { error: lessonsError.message };
  const lessonIds = (lessons ?? []).map((l: { id: number }) => l.id);
  if (lessonIds.length === 0) return { error: null };

  const { error } = await admin
    .from("progress")
    .delete()
    .eq("student_id", studentId)
    .in("lesson_id", lessonIds);

  if (error) return { error: error.message };
  return { error: null };
}

/**
 * Remove all lesson progress for the student (exam_results unchanged).
 */
export async function resetStudentAllProgress(
  studentId: string
): Promise<{ error: string | null }> {
  const admin = createAdminClient();
  const { error } = await admin.from("progress").delete().eq("student_id", studentId);

  if (error) return { error: error.message };
  return { error: null };
}
