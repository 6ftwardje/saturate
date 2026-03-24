import type { ReactNode } from "react";

export function RightRailCard({
  title,
  eyebrow,
  children,
  className = "",
}: {
  title?: ReactNode;
  eyebrow?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={[
        "cb-panel border border-[color-mix(in_oklab,var(--border)_85%,transparent)] bg-[var(--surface-raised)]",
        "p-5 sm:p-6",
        className,
      ].join(" ")}
    >
      {eyebrow && <div className="cb-eyebrow">{eyebrow}</div>}
      {title && (
        <h2 className="mt-2 text-sm font-light tracking-[0.12em] uppercase text-[var(--foreground)]">
          {title}
        </h2>
      )}
      <div className={title || eyebrow ? "mt-4" : ""}>{children}</div>
    </section>
  );
}
