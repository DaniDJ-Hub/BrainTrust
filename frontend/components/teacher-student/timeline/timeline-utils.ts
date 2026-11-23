import { AlertTriangle, ClipboardList, Users, type LucideIcon } from "lucide-react"
import type { Assignment, CourseResourceType, Quiz } from "@/app/domain/entities/CourseEntities"
import { getDaysUntilDue } from "@/app/presentation/hooks/calendar/date-utils"

export type DatosRecursoLineaTiempo = Assignment | Quiz
export type UrgenciaLineaTiempo = "urgent" | "warning" | "normal"

export const obtenerTipoRecurso = (recurso: DatosRecursoLineaTiempo): CourseResourceType => {
  if ("questions" in recurso) return "QUIZ"
  return "ASSIGNMENT"
}

export const esTareaGrupal = (recurso: DatosRecursoLineaTiempo): boolean =>
  obtenerTipoRecurso(recurso) === "ASSIGNMENT" && (recurso as Assignment).deliveryMode === "TEAM"

export const obtenerIconoRecurso = (recurso: DatosRecursoLineaTiempo): LucideIcon => {
  if (obtenerTipoRecurso(recurso) === "ASSIGNMENT") {
    return (recurso as Assignment).deliveryMode === "TEAM" ? Users : AlertTriangle
  }
  return ClipboardList
}

export const obtenerFechaEntrega = (recurso: DatosRecursoLineaTiempo): string | null =>
  "dueDate" in recurso ? recurso.dueDate : null

const obtenerDiasHastaEntrega = (fechaEntrega: string | null): number => getDaysUntilDue(fechaEntrega)

export const obtenerTextoPlazoRecurso = (recurso: DatosRecursoLineaTiempo): string => {
  const fechaEntrega = obtenerFechaEntrega(recurso)
  if (!fechaEntrega) return "Sin fecha límite"

  const dias = obtenerDiasHastaEntrega(fechaEntrega)
  if (dias < 0) return "Vencido"
  if (dias === 0) return "Vence hoy"
  if (dias === 1) return "Vence mañana"
  if (dias <= 2) return `Vence en ${dias} días`
  if (dias <= 7) return "Vence esta semana"
  return "Próximamente"
}

export const obtenerUrgenciaLineaTiempo = (fechaEntrega: string | null): UrgenciaLineaTiempo => {
  const dias = obtenerDiasHastaEntrega(fechaEntrega)
  if (dias < 0) return "urgent"
  if (dias <= 2) return "warning"
  return "normal"
}

/** Teacher-facing summary line (pending grading counts). */
export const obtenerResumenDocente = (recurso: DatosRecursoLineaTiempo): string => {
  const fechaEntrega = obtenerFechaEntrega(recurso)
  if (fechaEntrega && new Date(fechaEntrega) < new Date()) return "Vencido · necesita atención"

  if (obtenerTipoRecurso(recurso) === "ASSIGNMENT") {
    const pendientes =
      (recurso as Assignment).submissions?.filter((s) => s.status === "SUBMITTED" || s.status === "LATE_SUBMITTED").length || 0
    return `${pendientes} ${pendientes === 1 ? "entrega necesita" : "entregas necesitan"} calificación`
  }
  return "Necesita revisión"
}

/** Student state for an assignment, expressed with the shared submission status map. */
export const obtenerEstadoEntregaAlumno = (recurso: Assignment): "SUBMITTED" | "MISSING" | "PENDING" => {
  if ((recurso.submissions?.length ?? 0) > 0) return "SUBMITTED"
  const fechaEntrega = recurso.dueDate
  if (fechaEntrega && new Date(fechaEntrega) < new Date()) return "MISSING"
  return "PENDING"
}

export const obtenerInicioSemana = (fecha: Date = new Date()): Date => {
  const d = new Date(fecha)
  const dia = d.getDay()
  const diff = d.getDate() - dia + (dia === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export const formatearParaAPI = (fecha: Date): string => fecha.toISOString().split("T")[0] + "T00:00:00"

export const ordenarPorUrgencia = (recursos: DatosRecursoLineaTiempo[]): DatosRecursoLineaTiempo[] => {
  const orden: Record<UrgenciaLineaTiempo, number> = { urgent: 0, warning: 1, normal: 2 }
  return [...recursos].sort((a, b) => {
    const aEntrega = obtenerFechaEntrega(a)
    const bEntrega = obtenerFechaEntrega(b)
    const aUrgencia = obtenerUrgenciaLineaTiempo(aEntrega)
    const bUrgencia = obtenerUrgenciaLineaTiempo(bEntrega)
    if (aUrgencia !== bUrgencia) return orden[aUrgencia] - orden[bUrgencia]
    if (aEntrega && bEntrega) return new Date(aEntrega).getTime() - new Date(bEntrega).getTime()
    return 0
  })
}
