import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BreadcrumbEntry {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string
  description?: string
  /** Small label above the title (e.g. course code or role). */
  eyebrow?: string
  breadcrumbs?: BreadcrumbEntry[]
  /** Primary action last: it renders rightmost on desktop. */
  actions?: React.ReactNode
  /** "h2" when the view is shown inside a dialog/overlay over a page that already has its h1. */
  as?: "h1" | "h2"
  /** id for the heading, so a dialog can reference it with aria-labelledby. */
  titleId?: string
  className?: string
}

export function PageHeader({ title, description, eyebrow, breadcrumbs, actions, as: Heading = "h1", titleId, className }: PageHeaderProps) {
  return (
    <header className={cn("space-y-3", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Ruta de navegación">
          <ol className="flex flex-wrap items-center gap-1 text-caption text-muted-foreground">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1
              return (
                <li key={`${crumb.label}-${index}`} className="flex items-center gap-1">
                  {crumb.href && !isLast ? (
                    <Link
                      href={crumb.href}
                      className="rounded-tag hover:text-foreground hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current={isLast ? "page" : undefined} className={cn(isLast && "text-foreground")}>
                      {crumb.label}
                    </span>
                  )}
                  {!isLast && <ChevronRight className="size-3.5" aria-hidden="true" />}
                </li>
              )
            })}
          </ol>
        </nav>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-1">
          {eyebrow && <p className="section-label">{eyebrow}</p>}
          <Heading id={titleId} className="text-title text-foreground text-balance">{title}</Heading>
          {description && <p className="text-body text-muted-foreground max-w-prose">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">{actions}</div>}
      </div>
    </header>
  )
}
