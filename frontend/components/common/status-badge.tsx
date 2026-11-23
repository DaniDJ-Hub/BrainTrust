import { cn } from "@/lib/utils"
import { STATUS_TONE_CLASS, getStatusMeta, type StatusKind, type StatusOf } from "./status-map"

interface StatusBadgeProps<K extends StatusKind> {
  kind: K
  status: StatusOf<K> | string | null | undefined
  /** Icon reinforces the state so it never depends on color alone. */
  showIcon?: boolean
  className?: string
}

export function StatusBadge<K extends StatusKind>({ kind, status, showIcon = true, className }: StatusBadgeProps<K>) {
  const meta = getStatusMeta(kind, status)
  const Icon = meta.icon

  return (
    <span className={cn(STATUS_TONE_CLASS[meta.tone], className)}>
      {showIcon && <Icon className={cn("size-3.5 shrink-0", meta.spin && "animate-spin")} aria-hidden="true" />}
      {meta.label}
    </span>
  )
}
