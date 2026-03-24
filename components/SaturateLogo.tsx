import Link from "next/link";
import { SATURATE_ASSETS } from "@/lib/brand";

/**
 * Wordmark for dark backgrounds. Uses a plain <img> so the logo always loads
 * (Next/Image optimizer can fail or cache stale URLs for Supabase Storage).
 */
export function SaturateLogo({
  href = "/dashboard",
  className = "",
  priority = false,
}: {
  href?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center shrink-0 ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={SATURATE_ASSETS.textIconOnDark}
        alt="Saturate"
        width={180}
        height={40}
        className="h-7 w-auto max-w-[200px] sm:h-8 md:h-9 object-left object-contain"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    </Link>
  );
}
