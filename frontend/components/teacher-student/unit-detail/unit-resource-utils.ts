import { BookOpen, ClipboardList, FileText, NotebookPen, Users, type LucideIcon } from "lucide-react"
import type { Assignment, Page, Quiz, UnitResource } from "@/app/domain/entities/CourseEntities"

export type TipoRecurso = "ASSIGNMENT" | "QUIZ" | "PAGE"

export function obtenerTipoRecurso(recurso: UnitResource): TipoRecurso {
  if ("questions" in recurso) return "QUIZ"
  if ("submissions" in recurso) return "ASSIGNMENT"
  return "PAGE"
}

export interface DisponibilidadQuiz {
  available: boolean
  reason?: string
  /** Short label for the badge. */
  label?: "Próximamente" | "Cerrado" | "Vencido"
}

export function estaQuizDisponible(quiz: Quiz): DisponibilidadQuiz {
  const ahora = new Date()

  if (quiz.availableFrom) {
    const desde = new Date(quiz.availableFrom)
    if (ahora < desde) {
      return {
        available: false,
        label: "Próximamente",
        reason: `Este quiz no está disponible aún. Estará disponible desde el ${desde.toLocaleDateString()} a las ${desde.toLocaleTimeString()}.`,
      }
    }
  }

  if (quiz.availableUntil) {
    const hasta = new Date(quiz.availableUntil)
    if (ahora > hasta) {
      return {
        available: false,
        label: "Cerrado",
        reason: `Este quiz ya no está disponible. Estuvo disponible hasta el ${hasta.toLocaleDateString()} a las ${hasta.toLocaleTimeString()}.`,
      }
    }
  }

  if (!quiz.availableUntil && quiz.dueDate && !quiz.acceptLateSubmissions) {
    const entrega = new Date(quiz.dueDate)
    if (ahora > entrega) {
      return {
        available: false,
        label: "Vencido",
        reason: `Este quiz ha pasado su fecha de entrega (${entrega.toLocaleDateString()}) y no se aceptan entregas tardías.`,
      }
    }
  }

  return { available: true }
}

export const TIPO_LABEL: Record<TipoRecurso, string> = {
  ASSIGNMENT: "Tarea",
  QUIZ: "Quiz",
  PAGE: "Página",
}

export function obtenerIconoRecurso(recurso: UnitResource): LucideIcon {
  const tipo = obtenerTipoRecurso(recurso)
  if (tipo === "ASSIGNMENT") {
    const tarea = recurso as Assignment
    if (tarea.submissionFormat === "NOTEBOOK") return NotebookPen
    return tarea.deliveryMode === "TEAM" ? Users : FileText
  }
  if (tipo === "QUIZ") return ClipboardList
  return BookOpen
}

/** Metadata chips shown under the title (dates, points, time limit). */
export function obtenerDetallesRecurso(recurso: UnitResource): string[] {
  const tipo = obtenerTipoRecurso(recurso)
  if (tipo === "ASSIGNMENT") {
    const tarea = recurso as Assignment
    return [
      tarea.deliveryMode === "TEAM" ? "Grupal" : "Individual",
      tarea.submissionFormat === "NOTEBOOK" ? "Entrega en cuaderno" : "Entrega digital",
      `Puntuación máx.: ${tarea.maxScore.maxPoints}`,
      ...(tarea.dueDate ? [`Entrega: ${new Date(tarea.dueDate).toLocaleDateString()}`] : []),
    ]
  }
  if (tipo === "QUIZ") {
    const quiz = recurso as Quiz
    return [`Calificación máx.: ${quiz.maxGrade}`, `Tiempo: ${quiz.timeLimit} min`]
  }
  return []
}

export function obtenerResumenRecurso(recurso: UnitResource): string {
  if ("sectionContent" in recurso) {
    const contenido = (recurso as Page).sectionContent
    return contenido.length > 160 ? `${contenido.substring(0, 160)}…` : contenido
  }
  if ("description" in recurso) return (recurso as Assignment).description
  return ""
}
