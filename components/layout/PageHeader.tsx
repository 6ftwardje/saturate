import type { ReactNode } from "react";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/layout/Breadcrumbs";

const defaultTitleClass =
  "cb-display !text-[clamp(1.65rem,3.2vw,2.75rem)] !leading-[1.08] !font-extralight tracking-tight";

export function PageHeader({
  breadcrumbs,
  eyebrow,
  title,
  description,
  meta,
  actions,
  className = "",
  titleClassName,
}: {
  breadcrumbs?: BreadcrumbItem[];
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  className?: string;
  /** Override default display title styling (e.g. lesson/exam headings). */
  titleClassName?: string;
}) {
  return (
    <header className={`space-y-5 ${className}`}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs items={breadcrumbs} />
      )}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-3">
          {eyebrow && (
            <div className="cb-eyebrow">{eyebrow}</div>
          )}
          <div className="space-y-2">
            <h1 className={titleClassName ?? defaultTitleClass}>{title}</h1>
            {description && (
              <p className="cb-body max-w-2xl">{description}</p>
            )}
            {meta && (
              <div className="pt-1 cb-caption">
                {meta}
              </div>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-3 lg:justify-end">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}
