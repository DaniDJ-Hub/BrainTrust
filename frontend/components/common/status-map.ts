import {
  Archive,
  Ban,
  CheckCircle2,
  CircleDashed,
  CircleSlash,
  Clock,
  FileEdit,
  Loader2,
  RotateCcw,
  Send,
  ShieldAlert,
  TriangleAlert,
  XCircle,
  type LucideIcon,
} from "lucide-react"
import type { SubmissionStatus, EnrollmentStatus } from "@/app/domain/valueObjects/CourseValues"
import type { AnalysisStatus } from "@/app/domain/valueObjects/AnalisisValues"
import type { UserStatus } from "@/app/shared/dtos/user.dto"

export type StatusTone = "success" | "warning" | "danger" | "info" | "neutral" | "brand"

export interface StatusMeta {
  label: string
  tone: StatusTone
  icon: LucideIcon
  /** Icon spins (in-progress states). */
  spin?: boolean
}

/** States derived on the client when there is no submission record yet. */
export type DerivedSubmissionStatus = "PENDING" | "MISSING"
export type CourseStatus = "ACTIVE" | "DRAFT" | "ARCHIVED"

/**
 * Single source of truth for how LMS states look and read.
 * Same tone = same meaning across every screen and role.
 */
export const STATUS_MAP = {
  submission: {
    DRAFT: { label: "Borrador", tone: "neutral", icon: FileEdit },
    SUBMITTED: { label: "Entregado", tone: "success", icon: Send },
    LATE_SUBMITTED: { label: "Entregado tarde", tone: "warning", icon: Clock },
    GRADED: { label: "Calificado", tone: "info", icon: CheckCircle2 },
    RETURNED: { label: "Devuelto", tone: "brand", icon: RotateCcw },
    REJECTED: { label: "Rechazado", tone: "danger", icon: XCircle },
    PENDING: { label: "Pendiente", tone: "neutral", icon: CircleDashed },
    MISSING: { label: "Sin entregar", tone: "danger", icon: TriangleAlert },
  },
  course: {
    ACTIVE: { label: "Activo", tone: "success", icon: CheckCircle2 },
    DRAFT: { label: "Borrador", tone: "neutral", icon: FileEdit },
    ARCHIVED: { label: "Archivado", tone: "neutral", icon: Archive },
  },
  user: {
    ACTIVE: { label: "Activo", tone: "success", icon: CheckCircle2 },
    INACTIVE: { label: "Inactivo", tone: "neutral", icon: CircleSlash },
    SUSPENDED: { label: "Suspendido", tone: "danger", icon: ShieldAlert },
  },
  enrollment: {
    ACTIVE: { label: "Inscrito", tone: "success", icon: CheckCircle2 },
    COMPLETED: { label: "Completado", tone: "info", icon: CheckCircle2 },
    CANCELLED: { label: "Cancelado", tone: "danger", icon: Ban },
  },
  analysis: {
    PENDING: { label: "En proceso", tone: "info", icon: Loader2, spin: true },
    COMPLETED: { label: "Completado", tone: "success", icon: CheckCircle2 },
    FAILED: { label: "Fallido", tone: "danger", icon: XCircle },
  },
} as const satisfies {
  submission: Record<SubmissionStatus | DerivedSubmissionStatus, StatusMeta>
  course: Record<CourseStatus, StatusMeta>
  user: Record<UserStatus, StatusMeta>
  enrollment: Record<EnrollmentStatus, StatusMeta>
  analysis: Record<AnalysisStatus, StatusMeta>
}

export type StatusKind = keyof typeof STATUS_MAP
export type StatusOf<K extends StatusKind> = keyof (typeof STATUS_MAP)[K]

const FALLBACK: StatusMeta = { label: "Desconocido", tone: "neutral", icon: CircleDashed }

/** Lookup that tolerates unexpected values coming from the API. */
export function getStatusMeta<K extends StatusKind>(kind: K, status: StatusOf<K> | string | null | undefined): StatusMeta {
  if (!status) return FALLBACK
  const map = STATUS_MAP[kind] as Record<string, StatusMeta>
  return map[String(status).toUpperCase()] ?? { ...FALLBACK, label: String(status) }
}

export const STATUS_TONE_CLASS: Record<StatusTone, string> = {
  success: "badge-success",
  warning: "badge-warning",
  danger: "badge-destructive",
  info: "badge-info",
  neutral: "badge-muted",
  brand: "badge-primary",
}
