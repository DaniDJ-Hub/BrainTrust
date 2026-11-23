import { cn } from "@/lib/utils"

/** Status for the shared submission map: no record → "MISSING" when overdue, "PENDING" otherwise. */
export function derivarEstado(status: string | undefined, isOverdue: boolean): string {
  if (status) return status
  return isOverdue ? "MISSING" : "PENDING"
}

interface GradeCellProps {
  value: number
  max: number
}

/** "85/100 · 85.0%" with the percentage tinted (≥70% success, otherwise error). */
export function GradeCell({ value, max }: GradeCellProps) {
  const percentage = max > 0 ? (value / max) * 100 : 0
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <span className="font-semibold text-foreground tabular-nums">
        {value}/{max}
      </span>
      <span className={cn(percentage >= 70 ? "badge-success" : "badge-destructive", "tabular-nums")}>{percentage.toFixed(1)}%</span>
    </span>
  )
}
