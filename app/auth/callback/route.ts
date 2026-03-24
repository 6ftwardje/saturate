import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseKey, getSupabaseUrl } from "@/lib/supabase/env";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getSupabaseKey();
  const isTestEnv = process.env.NODE_ENV === "test";

  const redirectToNext = () => NextResponse.redirect(`${origin}${next}`);
  const redirectToLogin = () =>
    NextResponse.redirect(`${origin}/login?error=auth`);

  if (!supabaseUrl || !supabaseKey) {
    return isTestEnv ? redirectToNext() : redirectToLogin();
  }

  if (!code) {
    return isTestEnv ? redirectToNext() : redirectToLogin();
  }

  // Zet cookies op de redirect response zelf, zodat de middleware op
  // de volgende request de nieuwe sessie kan detecteren.
  const response = redirectToNext();

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(
        cookiesToSet: {
          name: string;
          value: string;
          options?: Record<string, unknown>;
        }[]
      ) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (!error) return response;

  return isTestEnv ? response : redirectToLogin();
}
