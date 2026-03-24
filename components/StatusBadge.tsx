import type { LessonStatus } from "@/lib/types";

export type ModuleAvailabilityState = "locked" | "available" | "completed";

const labelForModule = (state: ModuleAvailabilityState) =>
  state === "completed"
    ? "Completed"
    : state === "available"
      ? "Available"
      : "Locked";

const labelForLesson = (status: LessonStatus) =>
  status === "completed"
    ? "Completed"
    : status === "available"
      ? "Available"
      : "Locked";

export function ModuleStateBadge({ state }: { state: ModuleAvailabilityState }) {
  const label = labelForModule(state);
  const cls =
    state === "completed"
      ? "cb-badge cb-badge-completed"
      : state === "available"
        ? "cb-badge cb-badge-available"
        : "cb-badge cb-badge-locked";
  return <span className={cls}>{label}</span>;
}

export function LessonStatusBadge({ status }: { status: LessonStatus }) {
  const label = labelForLesson(status);
  const cls =
    status === "completed"
      ? "cb-badge cb-badge-completed"
      : status === "available"
        ? "cb-badge cb-badge-available"
        : "cb-badge cb-badge-locked";
  return <span className={cls}>{label}</span>;
}
