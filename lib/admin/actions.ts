"use server";

import { revalidatePath } from "next/cache";
import { assertAdminForAction } from "@/lib/admin/access";
import { ADMIN_ACCESS_LEVEL, isValidAccessLevel } from "@/lib/admin/constants";
import {
  markStudentModuleComplete,
  resetStudentModuleProgress,
  resetStudentAllProgress,
} from "@/lib/admin/progress";
import { getStudentByIdForAdmin } from "@/lib/admin/students";
import { createAdminClient } from "@/lib/supabase/admin";

function revalidateStudentPaths(studentId: string) {
  revalidatePath("/admin/students");
  revalidatePath(`/admin/students/${studentId}`);
}

export async function updateStudentAccessLevelAction(
  studentId: string,
  accessLevel: number
): Promise<{ ok: true } | { ok: false; error: string }> {
  const gate = await assertAdminForAction();
  if (!gate.ok) return { ok: false, error: gate.error };

  if (!studentId || typeof studentId !== "string") {
    return { ok: false, error: "Invalid student" };
  }
  if (!isValidAccessLevel(accessLevel)) {
    return { ok: false, error: "Access level must be 1, 2, or 3" };
  }

  if (gate.admin.id === studentId && accessLevel < ADMIN_ACCESS_LEVEL) {
    return { ok: false, error: "You cannot remove your own admin access" };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("students")
    .update({ access_level: accessLevel })
    .eq("id", studentId);

  if (error) return { ok: false, error: error.message };

  revalidateStudentPaths(studentId);
  return { ok: true };
}

export type AccessLevelFormState = { error?: string };

export async function updateStudentAccessLevelFormAction(
  _prev: AccessLevelFormState,
  formData: FormData
): Promise<AccessLevelFormState> {
  const studentId = String(formData.get("studentId") ?? "");
  const level = Number(formData.get("level"));
  const result = await updateStudentAccessLevelAction(studentId, level);
  if (!result.ok) return { error: result.error };
  return {};
}

/** Form actions return void so `action={...}` matches Next form types. */
export async function markStudentModuleCompleteAction(
  studentId: string,
  moduleId: number
): Promise<void> {
  const gate = await assertAdminForAction();
  if (!gate.ok) throw new Error(gate.error);

  const target = await getStudentByIdForAdmin(studentId);
  if (!target) throw new Error("Student not found");

  const { error } = await markStudentModuleComplete(studentId, moduleId);
  if (error) throw new Error(error);

  revalidateStudentPaths(studentId);
}

export async function resetStudentModuleProgressAction(
  studentId: string,
  moduleId: number
): Promise<void> {
  const gate = await assertAdminForAction();
  if (!gate.ok) throw new Error(gate.error);

  const target = await getStudentByIdForAdmin(studentId);
  if (!target) throw new Error("Student not found");

  const { error } = await resetStudentModuleProgress(studentId, moduleId);
  if (error) throw new Error(error);

  revalidateStudentPaths(studentId);
}

export async function resetStudentAllProgressAction(studentId: string): Promise<void> {
  const gate = await assertAdminForAction();
  if (!gate.ok) throw new Error(gate.error);

  const target = await getStudentByIdForAdmin(studentId);
  if (!target) throw new Error("Student not found");

  const { error } = await resetStudentAllProgress(studentId);
  if (error) throw new Error(error);

  revalidateStudentPaths(studentId);
}
