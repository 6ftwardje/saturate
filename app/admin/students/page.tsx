import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  listStudentsAdmin,
  normalizeListParams,
} from "@/lib/admin/students";
import type { AdminStudentListSort } from "@/lib/admin/students";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function SortLink({
  label,
  field,
  current,
  currentDir,
  q,
}: {
  label: string;
  field: AdminStudentListSort;
  current: AdminStudentListSort;
  currentDir: "asc" | "desc";
  q?: string;
}) {
  const active = current === field;
  const nextDir: "asc" | "desc" =
    active && currentDir === "desc" ? "asc" : "desc";
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  params.set("sort", field);
  params.set("dir", active ? nextDir : "desc");
  params.set("page", "1");
  const href = `/admin/students?${params.toString()}`;
  return (
    <Link
      href={href}
      className={[
        "inline-flex items-center gap-1 border-b border-transparent pb-0.5 text-[10px] font-light tracking-[0.14em] uppercase transition-colors",
        active
          ? "border-[var(--foreground)] text-[var(--foreground)]"
          : "text-[var(--muted)] hover:text-[var(--foreground)]",
      ].join(" ")}
    >
      {label}
      {active ? (currentDir === "asc" ? " ↑" : " ↓") : ""}
    </Link>
  );
}

export default async function AdminStudentsPage({ searchParams }: Props) {
  const raw = await searchParams;
  const p = normalizeListParams(raw);
  const { rows, total, page, pageSize } = await listStudentsAdmin(p);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const buildPageHref = (nextPage: number) => {
    const params = new URLSearchParams();
    if (p.search) params.set("q", p.search);
    params.set("sort", p.sort);
    params.set("dir", p.sortDir);
    params.set("page", String(nextPage));
    return `/admin/students?${params.toString()}`;
  };

  return (
    <div className="space-y-10">
      <PageHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Students" },
        ]}
        eyebrow="Directory"
        title="Students"
        description={`${total} total · page ${page} of ${totalPages}`}
      />

      <form
        method="get"
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
        action="/admin/students"
      >
        <input type="hidden" name="sort" value={p.sort} />
        <input type="hidden" name="dir" value={p.sortDir} />
        <div className="min-w-0 flex-1 space-y-1">
          <label htmlFor="q" className="cb-caption">
            Search name or email
          </label>
          <input
            id="q"
            name="q"
            defaultValue={p.search ?? ""}
            placeholder="Type and press Enter"
            className="w-full border border-[color-mix(in_oklab,var(--border)_85%,transparent)] bg-black px-3 py-2 text-sm font-light text-[var(--foreground)] placeholder:text-[var(--muted)]"
          />
        </div>
        <button type="submit" className="cb-btn cb-btn-secondary shrink-0">
          Search
        </button>
      </form>

      <div className="overflow-x-auto border border-[color-mix(in_oklab,var(--border)_85%,transparent)] bg-[var(--surface-raised)]">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[color-mix(in_oklab,var(--border)_80%,transparent)] text-[10px] font-light uppercase tracking-[0.16em] text-[var(--muted)]">
              <th className="px-4 py-3 font-normal">Name</th>
              <th className="px-4 py-3 font-normal">
                <SortLink
                  label="Email"
                  field="email"
                  current={p.sort}
                  currentDir={p.sortDir}
                  q={p.search}
                />
              </th>
              <th className="px-4 py-3 font-normal">Phone</th>
              <th className="px-4 py-3 font-normal">
                <SortLink
                  label="Access"
                  field="access_level"
                  current={p.sort}
                  currentDir={p.sortDir}
                  q={p.search}
                />
              </th>
              <th className="px-4 py-3 font-normal">
                <SortLink
                  label="Joined"
                  field="created_at"
                  current={p.sort}
                  currentDir={p.sortDir}
                  q={p.search}
                />
              </th>
              <th className="px-4 py-3 font-normal">Last seen</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 cb-caption text-center">
                  No students match this search.
                </td>
              </tr>
            ) : (
              rows.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-[color-mix(in_oklab,var(--border)_55%,transparent)] transition-colors hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/students/${s.id}`}
                      className="font-normal text-[var(--foreground)] hover:underline"
                    >
                      {s.name?.trim() || "—"}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/students/${s.id}`}
                      className="text-[var(--foreground)] hover:underline"
                    >
                      {s.email}
                    </Link>
                  </td>
                  <td className="px-4 py-3 cb-caption">
                    {s.phone?.trim() || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="cb-badge cb-badge-available">
                      {s.access_level}
                    </span>
                  </td>
                  <td className="px-4 py-3 cb-caption">
                    {formatDate(s.created_at)}
                  </td>
                  <td className="px-4 py-3 cb-caption">
                    {s.last_seen ? formatDate(s.last_seen) : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <div className="flex flex-wrap items-center justify-between gap-4 border border-[color-mix(in_oklab,var(--border)_55%,transparent)] bg-black/30 px-4 py-3">
          <span className="cb-caption">
            Showing {(page - 1) * pageSize + 1}–
            {Math.min(page * pageSize, total)} of {total}
          </span>
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildPageHref(Math.max(1, page - 1))}
              className={`cb-btn cb-btn-secondary ${page <= 1 ? "pointer-events-none opacity-40" : ""}`}
              aria-disabled={page <= 1}
            >
              Previous
            </Link>
            <Link
              href={buildPageHref(Math.min(totalPages, page + 1))}
              className={`cb-btn cb-btn-secondary ${page >= totalPages ? "pointer-events-none opacity-40" : ""}`}
              aria-disabled={page >= totalPages}
            >
              Next
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
