import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * No marketing landing: send users straight to magic-link login,
 * or to the dashboard when already authenticated.
 */
export default async function HomePage() {
  if (process.env.NODE_ENV === "test") {
    redirect("/dashboard");
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      redirect("/dashboard");
    }
  } catch {
    // Missing Supabase env in local dev — still send to login screen
  }

  redirect("/login");
}
