import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { getStudentByIdForAdmin } from "@/lib/admin/students";
import { getStudentProgramOverview } from "@/lib/admin/overview";
import { resetStudentAllProgressAction } from "@/lib/admin/actions";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { AccessLevelForm } from "@/components/admin/AccessLevelForm";
import { StudentModuleSection } from "@/components/admin/StudentModuleSection";

type Props = { params: Promise<{ id: string }> };

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

export default async function AdminStudentDetailPage({ params }: Props) {
  const { id } = await params;
  const student = await getStudentByIdForAdmin(id);
  if (!student) notFound();

  const overview = await getStudentProgramOverview(student.id);

  const totalLessons = overview.reduce((sum, b) => sum + b.totalLessonCount, 0);
  const completedLessons = overview.reduce(
    (sum, b) => sum + b.completedLessonCount,
    0
  );
  const pct =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const resetAll = resetStudentAllProgressAction.bind(null, student.id);

  return (
    <div className="space-y-12">
      <PageHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Students", href: "/admin/students" },
          { label: student.name?.trim() || student.email },
        ]}
        eyebrow="Student"
        title={student.name?.trim() || student.email}
        description={student.email}
        actions={
          <Link href="/admin/students" className="cb-btn cb-btn-secondary">
            Back to list
          </Link>
        }
      />

      <section className="border border-[color-mix(in_oklab,var(--border)_85%,transparent)] bg-[var(--surface-raised)] p-6 sm:p-8">
        <div className="cb-eyebrow">Identity</div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="cb-caption">Name</dt>
              <dd className="mt-1 text-[var(--foreground)]">
                {student.name?.trim() || "—"}
              </dd>
            </div>
            <div>
              <dt className="cb-caption">Email</dt>
              <dd className="mt-1 text-[var(--foreground)]">{student.email}</dd>
            </div>
            <div>
              <dt className="cb-caption">Phone</dt>
              <dd className="mt-1 text-[var(--foreground)]">
                {student.phone?.trim() || "—"}
              </dd>
            </div>
            <div>
              <dt className="cb-caption">Joined</dt>
              <dd className="mt-1 cb-caption">{formatDate(student.created_at)}</dd>
            </div>
            <div>
              <dt className="cb-caption">Last seen</dt>
              <dd className="mt-1 cb-caption">{formatDate(student.last_seen)}</dd>
            </div>
          </dl>

          <div className="space-y-3 border border-[color-mix(in_oklab,var(--border)_55%,transparent)] bg-black/30 p-4">
            <div className="cb-eyebrow">Access</div>
            <AccessLevelForm
              studentId={student.id}
              currentLevel={student.access_level}
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <div className="cb-eyebrow">Program progress</div>
          <h2 className="mt-4 text-xl font-light text-[var(--foreground)]">
            Overview
          </h2>
          <p className="mt-2 max-w-2xl cb-body">
            {completedLessons} of {totalLessons} lessons completed across{" "}
            {overview.length} modules ({pct}%). Exams are listed per module;
            module actions only affect lessons.
          </p>
          <div className="mt-4 h-1.5 w-full max-w-md bg-white/[0.08]">
            <div
              className="h-full bg-white/[0.35]"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border border-[color-mix(in_oklab,var(--border)_55%,transparent)] bg-black/30 px-4 py-4">
          <div className="cb-caption max-w-xl">
            Reset all lesson progress for this student. This does not delete exam
            attempts.
          </div>
          <ConfirmSubmit
            action={resetAll}
            message="Reset ALL lesson progress for this student? Exam results are not deleted."
            className="inline"
          >
            <button type="submit" className="cb-btn cb-btn-secondary">
              Reset full progress
            </button>
          </ConfirmSubmit>
        </div>

        <div className="space-y-8">
          {overview.map((block) => (
            <StudentModuleSection
              key={block.module.id}
              block={block}
              studentId={student.id}
            />
          ))}
        </div>
      </section>

      <section className="border border-[color-mix(in_oklab,var(--border)_45%,transparent)] bg-black/25 px-5 py-6">
        <div className="cb-eyebrow">Later</div>
        <p className="mt-3 max-w-2xl cb-caption">
          This screen is structured so we can attach per-question answers,
          failure heatmaps, and cohort analytics without rewriting routing.
        </p>
      </section>
    </div>
  );
}
