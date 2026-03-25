import { createAdminClient } from "@/lib/supabase/admin";
import type { Student } from "@/lib/types";

export type AdminStudentListSort = "created_at" | "email" | "access_level";

export type ListStudentsAdminParams = {
  search?: string;
  sort: AdminStudentListSort;
  sortDir: "asc" | "desc";
  page: number;
  pageSize: number;
};

export type ListStudentsAdminResult = {
  rows: Student[];
  total: number;
  page: number;
  pageSize: number;
};

const DEFAULT_PAGE_SIZE = 25;

export function normalizeListParams(
  raw: Record<string, string | string[] | undefined>
): ListStudentsAdminParams {
  const q = typeof raw.q === "string" ? raw.q.trim() : "";
  const sortRaw = typeof raw.sort === "string" ? raw.sort : "";
  const sort: AdminStudentListSort =
    sortRaw === "email" || sortRaw === "access_level" ? sortRaw : "created_at";
  const dirRaw = typeof raw.dir === "string" ? raw.dir : "";
  const sortDir: "asc" | "desc" = dirRaw === "asc" ? "asc" : "desc";
  const pageRaw = typeof raw.page === "string" ? parseInt(raw.page, 10) : 1;
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  return {
    search: q.length > 0 ? q : undefined,
    sort,
    sortDir,
    page,
    pageSize: DEFAULT_PAGE_SIZE,
  };
}

/**
 * Paginated student list for admin table (service role).
 */
export async function listStudentsAdmin(
  params: ListStudentsAdminParams
): Promise<ListStudentsAdminResult> {
  const supabase = createAdminClient();
  const from = (params.page - 1) * params.pageSize;
  const to = from + params.pageSize - 1;

  let query = supabase
    .from("students")
    .select("*", { count: "exact" });

  if (params.search) {
    // Avoid breaking PostgREST `or()` / ilike patterns
    const raw = params.search.trim();
    const safe = raw.replace(/[%*,()]/g, "").trim();
    if (safe.length > 0) {
      const pattern = `%${safe}%`;
      query = query.or(`name.ilike.${pattern},email.ilike.${pattern}`);
    }
  }

  const ascending = params.sortDir === "asc";
  query = query.order(params.sort, { ascending, nullsFirst: false });

  const { data, error, count } = await query.range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  return {
    rows: (data ?? []) as Student[],
    total: count ?? 0,
    page: params.page,
    pageSize: params.pageSize,
  };
}

export async function getStudentByIdForAdmin(id: string): Promise<Student | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) return null;
  return (data ?? null) as Student | null;
}
