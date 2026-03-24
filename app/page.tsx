import Link from "next/link";
import { SaturateHueLine } from "@/components/SaturateHueLine";
import { SaturateIconMark } from "@/components/SaturateIconMark";
import { SaturateLogo } from "@/components/SaturateLogo";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[var(--border)] bg-black/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <SaturateLogo href="/" priority />
          <Link
            href="/login"
            className="text-[var(--muted)] hover:text-[var(--foreground)] text-xs font-light tracking-[0.14em] uppercase"
          >
            Log in
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <p className="cb-eyebrow mb-4">
          <SaturateIconMark size={14} className="inline opacity-90" />
          <span>Saturate Academy</span>
        </p>
        <h1 className="cb-display text-center max-w-2xl mb-3">
          From videographer to profitable creative partner.
        </h1>
        <SaturateHueLine width={100} className="mx-auto mb-8" />
        <p className="text-[var(--muted)] text-center max-w-xl mb-10 font-light text-sm leading-relaxed">
          Build your skills, sales and systems with Saturate Academy.
          A focused learning environment for serious videographers.
        </p>
        <Link
          href="/login"
          className="cb-btn cb-btn-primary inline-flex items-center gap-2"
        >
          <span>Start vandaag</span>
          <SaturateIconMark size={14} />
        </Link>
      </main>

      <footer className="border-t border-[var(--border)] py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center text-[var(--muted)] text-xs font-light tracking-wide">
          Saturate Academy
        </div>
      </footer>
    </div>
  );
}
