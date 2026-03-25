import { redirect } from "next/navigation";
import { ensureCurrentStudent } from "@/lib/students";
import { requireAdmin } from "@/lib/admin/access";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (process.env.NODE_ENV === "test") {
    return (
      <AdminShell adminLabel="Test">
        {children}
      </AdminShell>
    );
  }

  const { student, error } = await ensureCurrentStudent();
  if (error || !student) {
    redirect("/login?redirectedFrom=" + encodeURIComponent("/admin"));
  }

  await requireAdmin();

  const adminLabel = student.name?.trim() || student.email;

  return <AdminShell adminLabel={adminLabel}>{children}</AdminShell>;
}
