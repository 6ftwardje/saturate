"use client";

import { useActionState } from "react";
import {
  updateStudentAccessLevelFormAction,
  type AccessLevelFormState,
} from "@/lib/admin/actions";
import { VALID_ACCESS_LEVELS } from "@/lib/admin/constants";

const initial: AccessLevelFormState = {};

export function AccessLevelForm({
  studentId,
  currentLevel,
}: {
  studentId: string;
  currentLevel: number;
}) {
  const [state, formAction] = useActionState(
    updateStudentAccessLevelFormAction,
    initial
  );

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="studentId" value={studentId} />
      <div className="space-y-1">
        <label
          htmlFor="access-level"
          className="block text-[10px] font-light tracking-[0.16em] uppercase text-[var(--muted)]"
        >
          Access level
        </label>
        <select
          id="access-level"
          name="level"
          defaultValue={String(currentLevel)}
          className="min-w-[120px] border border-[color-mix(in_oklab,var(--border)_85%,transparent)] bg-black px-3 py-2 text-sm font-light text-[var(--foreground)]"
        >
          {VALID_ACCESS_LEVELS.map((n) => (
            <option key={n} value={String(n)}>
              {n}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="cb-btn cb-btn-secondary">
        Save
      </button>
      {state.error ? (
        <p className="w-full text-sm text-red-400/95" role="alert">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
