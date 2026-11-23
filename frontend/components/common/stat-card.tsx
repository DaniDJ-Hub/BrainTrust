import { ArrowDownRight, ArrowUpRight, Minus, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

type TrendDirection = "up" | "down" | "flat"

interface StatTrend {
  /** Already formatted, e.g. "+12%" or "-3 alumnos". */
  value: string
  direction: TrendDirection
  /** Set false when "up" is bad (e.g. late submissions). */
  upIsGood?: boolean
  /** Context for the trend, e.g. "vs. semana pasada". */
  label?: string
}

interface StatCardProps {
  label: string
  value: React.ReactNode
  icon?: LucideIcon
  description?: string
  trend?: StatTrend
  /** "highlight" is the gold 10%: use for at most one KPI per view. */
  tone?: "default" | "highlight"
  isLoading?: boolean
  className?: string
}

const TREND_ICON: Record<TrendDirection, LucideIcon> = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  flat: Minus,
}

function trendClass({ direction, upIsGood = true }: StatTrend): string {
  if (direction === "flat") return "text-muted-foreground"
  const good = direction === "up" ? upIsGood : !upIsGood
  // soft-foreground variants keep ≥4.5:1 on card and on the gold highlight surface
  return good ? "text-success-soft-foreground" : "text-destructive-soft-foreground"
}

export function StatCard({ label, value, icon: Icon, description, trend, tone = "default", isLoading, className }: StatCardProps) {
  const TrendIcon = trend ? TREND_ICON[trend.direction] : null

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-surface border p-4 sm:p-5",
        tone === "highlight" ? "border-highlight-soft bg-highlight-soft" : "border-border bg-card",
        className,
      )}
      aria-busy={isLoading || undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <p className={cn("text-body font-medium", tone === "highlight" ? "text-highlight-soft-foreground" : "text-muted-foreground")}>
          {label}
        </p>
        {Icon && (
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-control",
              tone === "highlight" ? "bg-highlight text-highlight-foreground" : "bg-secondary text-secondary-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
          </span>
        )}
      </div>

      {isLoading ? (
        <Skeleton className="h-9 w-24" />
      ) : (
        <p className="text-kpi text-foreground tabular-nums">{value}</p>
      )}

      {trend && TrendIcon && !isLoading && (
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-caption">
          <span className={cn("inline-flex items-center gap-0.5 font-semibold", trendClass(trend))}>
            <TrendIcon className="size-3.5" aria-hidden="true" />
            {trend.value}
          </span>
          {trend.label && <span className="font-normal text-muted-foreground">{trend.label}</span>}
        </p>
      )}

      {description && !isLoading && <p className="text-caption font-normal text-muted-foreground">{description}</p>}
    </div>
  )
}
