import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type EmptyStateTone = "neutral" | "error"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  /** Usually one button: the next step the user can take. */
  action?: React.ReactNode
  /** "error" for failed loads; pair it with a retry action. */
  tone?: EmptyStateTone
  /** Compact fits inside cards and table bodies. */
  size?: "default" | "compact"
  className?: string
}

const ICON_TONE: Record<EmptyStateTone, string> = {
  neutral: "bg-muted text-muted-foreground",
  error: "bg-destructive-soft text-destructive-soft-foreground",
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  tone = "neutral",
  size = "default",
  className,
}: EmptyStateProps) {
  const compact = size === "compact"

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "gap-2 px-4 py-8" : "gap-3 px-6 py-12",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-surface",
          compact ? "size-10" : "size-12",
          ICON_TONE[tone],
        )}
      >
        <Icon className={compact ? "size-5" : "size-6"} aria-hidden="true" />
      </div>
      <div className="space-y-1 max-w-sm">
        <p className={cn("text-foreground", compact ? "text-body font-semibold" : "text-subheading")}>{title}</p>
        {description && <p className="text-body text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="mt-1 flex flex-wrap justify-center gap-2">{action}</div>}
    </div>
  )
}
