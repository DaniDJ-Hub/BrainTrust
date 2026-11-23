import { CalendarX, Clock, Eye, Pencil, Play, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Assignment, Quiz, UnitResource } from "@/app/domain/entities/CourseEntities"
import {
  TIPO_LABEL,
  estaQuizDisponible,
  obtenerDetallesRecurso,
  obtenerIconoRecurso,
  obtenerResumenRecurso,
  obtenerTipoRecurso,
} from "./unit-resource-utils"

interface ResourceCardProps {
  recurso: UnitResource
  isStudent: boolean
  onStart: (recurso: UnitResource) => void
  onView: (recurso: UnitResource) => void
  onDelete: (recurso: UnitResource) => void
}

export function ResourceCard({ recurso, isStudent, onStart, onView, onDelete }: ResourceCardProps) {
  const tipo = obtenerTipoRecurso(recurso)
  const Icono = obtenerIconoRecurso(recurso)
  const resumen = obtenerResumenRecurso(recurso)
  const detalles = obtenerDetallesRecurso(recurso)
  const disponibilidad = tipo === "QUIZ" && isStudent ? estaQuizDisponible(recurso as Quiz) : { available: true }
  const esGrupal = tipo === "ASSIGNMENT" && (recurso as Assignment).deliveryMode === "TEAM"

  const etiquetaInicio = tipo === "PAGE" ? "Ver contenido" : !disponibilidad.available ? "No disponible" : "Comenzar"

  return (
    <article className="card-base flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:p-5">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-control bg-secondary text-secondary-foreground">
        <Icono className="size-5" aria-hidden="true" />
      </span>

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="badge-muted">{TIPO_LABEL[tipo]}</span>
          {esGrupal && <span className="badge-primary">Grupal</span>}
          {!disponibilidad.available && (
            <span className={disponibilidad.label === "Próximamente" ? "badge-info" : "badge-destructive"}>
              {disponibilidad.label === "Próximamente" ? (
                <Clock className="size-3.5" aria-hidden="true" />
              ) : (
                <CalendarX className="size-3.5" aria-hidden="true" />
              )}
              {disponibilidad.label}
            </span>
          )}
        </div>
        <h3 className="text-subheading text-foreground">{recurso.title}</h3>
        {resumen && <p className="line-clamp-2 text-body text-muted-foreground">{resumen}</p>}
        {detalles.length > 0 && (
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-caption font-normal text-muted-foreground">
            {detalles.map((detalle) => (
              <li key={detalle}>{detalle}</li>
            ))}
          </ul>
        )}
      </div>

      <div className={cn("flex shrink-0 items-center gap-2", "sm:flex-col sm:items-stretch")}>
        {isStudent ? (
          <button
            type="button"
            className="btn-primary flex-1 sm:flex-none"
            onClick={() => onStart(recurso)}
            disabled={!disponibilidad.available}
          >
            {tipo === "PAGE" ? <Eye className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
            {etiquetaInicio}
          </button>
        ) : (
          <>
            <button type="button" className="btn-secondary flex-1 sm:flex-none" onClick={() => onView(recurso)}>
              <Pencil className="size-4" aria-hidden="true" /> Ver y editar
            </button>
            <button
              type="button"
              className="icon-btn-destructive sm:self-end"
              onClick={() => onDelete(recurso)}
              aria-label={`Eliminar ${recurso.title}`}
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    </article>
  )
}
