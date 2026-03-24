import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseKey, getSupabaseUrl } from "@/lib/supabase/env";

export function createClient() {
  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getSupabaseKey();

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase env ontbreekt of de API key is leeg. Zet in .env.local NEXT_PUBLIC_SUPABASE_URL en NEXT_PUBLIC_SUPABASE_ANON_KEY (of PUBLISHABLE_DEFAULT_KEY), plak de waarden uit het Supabase-dashboard (API), en herstart next dev."
    );
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
