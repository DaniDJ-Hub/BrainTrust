import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { StatusBadge } from "@/components/common"
import type { Assignment } from "@/app/domain/entities/CourseEntities"
import {
  esTareaGrupal,
  obtenerEstadoEntregaAlumno,
  obtenerFechaEntrega,
  obtenerIconoRecurso,
  obtenerResumenDocente,
  obtenerTextoPlazoRecurso,
  obtenerTipoRecurso,
  obtenerUrgenciaLineaTiempo,
  type DatosRecursoLineaTiempo,
  type UrgenciaLineaTiempo,
} from "./timeline-utils"

interface TimelineItemProps {
  item: DatosRecursoLineaTiempo
  userType: "teacher" | "student"
  onOpen: (item: DatosRecursoLineaTiempo) => void
}

const SURFACE: Record<UrgenciaLineaTiempo, string> = {
  urgent: "border-destructive/40 bg-destructive-soft/40 hover:border-destructive/60",
  warning: "border-warning/40 bg-warning-soft/40 hover:border-warning/60",
  normal: "border-border bg-card hover:border-border-strong",
}

const ICON: Record<UrgenciaLineaTiempo, string> = {
  urgent: "bg-destructive-soft text-destructive-soft-foreground",
  warning: "bg-warning-soft text-warning-soft-foreground",
  normal: "bg-secondary text-secondary-foreground",
}

const DEADLINE_BADGE: Record<UrgenciaLineaTiempo, string> = {
  urgent: "badge-destructive",
  warning: "badge-warning",
  normal: "badge-muted",
}

const formatearEntrega = (fecha: string) =>
  new Date(fecha).toLocaleDateString("es-ES", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

export function TimelineItem({ item, userType, onOpen }: TimelineItemProps) {
  const fechaEntrega = obtenerFechaEntrega(item)
  const urgencia = obtenerUrgenciaLineaTiempo(fechaEntrega)
  const Icono = obtenerIconoRecurso(item)
  const grupal = esTareaGrupal(item)
  const esTarea = obtenerTipoRecurso(item) === "ASSIGNMENT"

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className={cn(
        "group flex w-full items-start gap-4 rounded-control border p-4 text-left transition-[border-color,box-shadow] duration-150 hover:shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
        SURFACE[urgencia],
      )}
    >
      <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-control", ICON[urgencia])}>
        <Icono className="size-5" aria-hidden="true" />
      </span>

      <span className="min-w-0 flex-1 space-y-1.5">
        <span className="flex flex-wrap items-start justify-between gap-2">
          <span className="text-subheading text-foreground">{item.title}</span>
          <span className={cn(DEADLINE_BADGE[urgencia], "shrink-0")}>{obtenerTextoPlazoRecurso(item)}</span>
        </span>

        <span className="flex flex-wrap items-center gap-2">
          <span className="badge-muted">{esTarea ? "Tarea" : "Quiz"}</span>
          {grupal && <span className="badge-primary">Grupal</span>}
          {userType === "student" ? (
            esTarea ? (
              <StatusBadge kind="submission" status={obtenerEstadoEntregaAlumno(item as Assignment)} />
            ) : (
              <span className="text-caption font-normal text-muted-foreground">No intentado</span>
            )
          ) : (
            <span className="text-body text-muted-foreground">{obtenerResumenDocente(item)}</span>
          )}
        </span>

        {fechaEntrega && (
          <span className="flex items-center gap-1.5 text-caption font-normal text-muted-foreground">
            <Clock className="size-3.5" aria-hidden="true" />
            Entrega: {formatearEntrega(fechaEntrega)}
          </span>
        )}
      </span>
    </button>
  )
}
