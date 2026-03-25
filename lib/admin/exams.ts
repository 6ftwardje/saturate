import { createAdminClient } from "@/lib/supabase/admin";

export type ExamResultSummary = {
  examId: number;
  moduleId: number;
  examTitle: string;
  attemptCount: number;
  latestScore: number | null;
  latestPassed: boolean | null;
  latestSubmittedAt: string | null;
  hasPassedEver: boolean;
};

/**
 * Aggregated exam_results per exam for a student (read-only insights).
 * Extensible later for per-question / failure analysis.
 */
export async function getExamResultSummariesForStudent(
  studentId: string
): Promise<Map<number, ExamResultSummary>> {
  const admin = createAdminClient();

  const { data: exams, error: examsError } = await admin
    .from("exams")
    .select("id, module_id, title")
    .eq("is_published", true);

  if (examsError || !exams?.length) return new Map();

  const examIds = exams.map((e: { id: number }) => e.id);

  const { data: results, error: resError } = await admin
    .from("exam_results")
    .select("exam_id, score, passed, submitted_at")
    .eq("student_id", studentId)
    .in("exam_id", examIds);

  if (resError) return new Map();

  const byExam = new Map<
    number,
    {
      attempts: number;
      latest: { score: number; passed: boolean; submitted_at: string } | null;
      hasPassedEver: boolean;
    }
  >();

  for (const e of exams as { id: number; module_id: number; title: string }[]) {
    byExam.set(e.id, { attempts: 0, latest: null, hasPassedEver: false });
  }

  const rows = (results ?? []) as {
    exam_id: number;
    score: number;
    passed: boolean;
    submitted_at: string;
  }[];

  for (const r of rows) {
    const agg = byExam.get(r.exam_id);
    if (!agg) continue;
    agg.attempts += 1;
    if (r.passed) agg.hasPassedEver = true;
  }

  const byExamId = new Map<number, typeof rows>();
  for (const r of rows) {
    const list = byExamId.get(r.exam_id) ?? [];
    list.push(r);
    byExamId.set(r.exam_id, list);
  }
  for (const [examId, list] of byExamId) {
    const agg = byExam.get(examId);
    if (!agg || list.length === 0) continue;
    const sorted = [...list].sort(
      (a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
    );
    const top = sorted[0];
    agg.latest = {
      score: top.score,
      passed: top.passed,
      submitted_at: top.submitted_at,
    };
  }

  const out = new Map<number, ExamResultSummary>();
  for (const e of exams as { id: number; module_id: number; title: string }[]) {
    const agg = byExam.get(e.id);
    if (!agg) continue;
    out.set(e.id, {
      examId: e.id,
      moduleId: e.module_id,
      examTitle: e.title,
      attemptCount: agg.attempts,
      latestScore: agg.latest?.score ?? null,
      latestPassed: agg.latest ? agg.latest.passed : null,
      latestSubmittedAt: agg.latest?.submitted_at ?? null,
      hasPassedEver: agg.hasPassedEver,
    });
  }

  return out;
}
