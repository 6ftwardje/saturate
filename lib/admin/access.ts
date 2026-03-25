import { redirect } from "next/navigation";
import { getCurrentStudent } from "@/lib/students";
import type { Student } from "@/lib/types";
import { ADMIN_ACCESS_LEVEL } from "@/lib/admin/constants";

export {
  ADMIN_ACCESS_LEVEL,
  VALID_ACCESS_LEVELS,
  isValidAccessLevel,
  type ValidAccessLevel,
} from "@/lib/admin/constants";

/**
 * Resolves the signed-in user → students row → access_level.
 * Returns null if not authenticated or not an admin.
 */
export async function getAdminStudent(): Promise<Student | null> {
  const { student, error } = await getCurrentStudent();
  if (error || !student) return null;
  if (student.access_level !== ADMIN_ACCESS_LEVEL) return null;
  return student;
}

/**
 * Server-only gate for admin routes. Never trust the client.
 * Non-admins are sent away without exposing admin data.
 */
export async function requireAdmin(): Promise<{ admin: Student }> {
  const admin = await getAdminStudent();
  if (!admin) {
    redirect("/dashboard");
  }
  return { admin };
}

/** For server actions: return an error instead of redirecting. */
export async function assertAdminForAction(): Promise<
  { ok: true; admin: Student } | { ok: false; error: string }
> {
  const admin = await getAdminStudent();
  if (!admin) return { ok: false, error: "Forbidden" };
  return { ok: true, admin };
}
