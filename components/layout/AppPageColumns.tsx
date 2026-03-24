import type { ReactNode } from "react";

/**
 * Desktop: primary column + right rail. Mobile: stacks (rail below main).
 */
export function AppPageColumns({
  main,
  rail,
  className = "",
}: {
  main: ReactNode;
  rail?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "grid gap-10 lg:gap-12 xl:gap-16",
        rail
          ? "lg:grid-cols-[minmax(0,1fr)_minmax(260px,300px)] xl:grid-cols-[minmax(0,1fr)_minmax(280px,320px)] lg:items-start"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="min-w-0">{main}</div>
      {rail && (
        <aside className="min-w-0 lg:sticky lg:top-6 space-y-6">{rail}</aside>
      )}
    </div>
  );
}
