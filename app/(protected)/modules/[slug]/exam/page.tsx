import Link from "next/link";
import { notFound } from "next/navigation";
import { ensureCurrentStudent } from "@/lib/students";
import { getModuleBySlug } from "@/lib/modules";
import { getPublishedLessonsByModuleId } from "@/lib/lessons";
import { getExamByModuleId, getExamQuestions } from "@/lib/exams";
import { areAllLessonsCompleted } from "@/lib/progress";
import { getModuleAccessMap } from "@/lib/module-gate";
import { getPublishedModules } from "@/lib/modules";
import { ExamForm } from "./ExamForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppPageColumns } from "@/components/layout/AppPageColumns";
import { RightRailCard } from "@/components/layout/RightRailCard";

type Props = { params: Promise<{ slug: string }> };

export default async function ModuleExamPage({ params }: Props) {
  const { slug } = await params;
  const moduleData = await getModuleBySlug(slug);
  if (!moduleData) notFound();

  const { student } = await ensureCurrentStudent();
  if (!student) notFound();

  const [exam, lessons, allModules] = await Promise.all([
    getExamByModuleId(moduleData.id),
    getPublishedLessonsByModuleId(moduleData.id),
    getPublishedModules(),
  ]);

  const moduleAccessMap = await getModuleAccessMap(student.id, allModules);
  const canAccessModule = moduleAccessMap.get(moduleData.id) === true;
  const lessonIds = lessons.map((l) => l.id);
  const allLessonsCompleted = await areAllLessonsCompleted(student.id, lessonIds);
  const examUnlocked = !!exam && allLessonsCompleted;

  if (!canAccessModule) {
    return (
      <div className="space-y-8 max-w-2xl">
        <PageHeader
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Academy", href: "/modules" },
            { label: "Exam locked" },
          ]}
          eyebrow="Access"
          title="Module locked"
          description="Pass the previous module's exam to access this certification."
          actions={
            <Link href="/modules" className="cb-btn cb-btn-primary">
              Back to academy
            </Link>
          }
        />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="space-y-8 max-w-2xl">
        <PageHeader
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Academy", href: "/modules" },
            { label: moduleData.title, href: `/modules/${moduleData.slug}` },
            { label: "Exam" },
          ]}
          eyebrow="Certification"
          title="No exam configured"
          description="This module does not have an exam yet."
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

  if (!examUnlocked) {
    return (
      <div className="space-y-8 max-w-2xl">
        <PageHeader
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Academy", href: "/modules" },
            { label: moduleData.title, href: `/modules/${moduleData.slug}` },
            { label: "Exam" },
          ]}
          eyebrow="Locked"
          title="Finish the lessons first"
          description="Complete every lesson in this module to unlock the exam."
          actions={
            <Link
              href={`/modules/${moduleData.slug}`}
              className="cb-btn cb-btn-primary"
            >
              Return to module
            </Link>
          }
        />
      </div>
    );
  }

  const questions = await getExamQuestions(exam.id);

  return (
    <AppPageColumns
      main={
        <div className="space-y-10 lg:space-y-12">
          <PageHeader
            breadcrumbs={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Academy", href: "/modules" },
              { label: moduleData.title, href: `/modules/${moduleData.slug}` },
              { label: "Exam" },
            ]}
            eyebrow="Module exam"
            title={exam.title}
            titleClassName="text-[clamp(1.35rem,2.8vw,2.25rem)] font-light tracking-tight uppercase leading-[1.12]"
            description={exam.description ?? undefined}
            meta={
              <span>
                Passing score:{" "}
                <span className="text-[var(--foreground)]">{exam.passing_score}%</span>
                {" · "}
                {questions.length} question{questions.length !== 1 ? "s" : ""}
              </span>
            }
            actions={
              <Link
                href={`/modules/${moduleData.slug}`}
                className="cb-btn cb-btn-secondary"
              >
                Back to module
              </Link>
            }
          />

          {questions.length === 0 ? (
            <div className="cb-panel border border-[color-mix(in_oklab,var(--border)_85%,transparent)] bg-[var(--surface-raised)] p-8 text-center">
              <div className="cb-caption">No questions in this exam yet.</div>
              <Link
                href={`/modules/${moduleData.slug}`}
                className="mt-6 inline-flex text-sm font-light text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                Back to module
              </Link>
            </div>
          ) : (
            <ExamForm
              examId={exam.id}
              questions={questions}
              passingScore={exam.passing_score}
              moduleSlug={moduleData.slug}
              moduleTitle={moduleData.title}
            />
          )}
        </div>
      }
      rail={
        <RightRailCard title="Exam protocol" eyebrow="Read first">
          <ul className="space-y-4 cb-body text-[color-mix(in_oklab,var(--foreground)_88%,var(--muted))]">
            <li>Answer every question before submitting.</li>
            <li>There is one best answer per question.</li>
            <li>You need {exam.passing_score}% to pass.</li>
            <li>Take your time—this is a certification checkpoint.</li>
          </ul>
          <div className="mt-6 border-t border-[color-mix(in_oklab,var(--border)_80%,transparent)] pt-6">
            <div className="text-[11px] font-light tracking-[0.16em] uppercase text-[var(--muted)]">
              Module
            </div>
            <p className="mt-2 text-sm font-light text-[var(--foreground)]">
              {moduleData.title}
            </p>
          </div>
        </RightRailCard>
      }
    />
  );
}
