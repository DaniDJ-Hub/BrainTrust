"use client"

import type { Assignment } from "@/app/domain/entities/CourseEntities"
import { OverlayPanel } from "@/components/common"
import { VistaTareaEstudiante } from "../../student/tasks-transactional-view-student"
import { VistaQuizEstudiante } from "../../student/quiz-transactional-view-student"
import { VistaQuiz as VistaQuizProfesor } from "../../teacher/quiz-view-information-teacher"
import { VistaInfoTarea } from "../../teacher/task-view-information-teacher"
import { TimelineSectionSkeleton } from "../../sketons/timeline-skeleton"
import { obtenerTipoRecurso, type DatosRecursoLineaTiempo } from "./timeline-utils"

type QuizDetail = Parameters<typeof VistaQuizEstudiante>[0]["quizData"]
type TeacherQuizDetail = Parameters<typeof VistaQuizProfesor>[0]["quiz"]

interface TimelineDetailProps {
  recurso: DatosRecursoLineaTiempo
  userType: "teacher" | "student"
  userId: string
  detalleQuiz: QuizDetail | TeacherQuizDetail | undefined
  cargandoQuiz: boolean
  onClose: () => void
  onSubmitTask: (datos: { content: string; attachments: File[] }) => Promise<void>
  onSubmitQuiz: Parameters<typeof VistaQuizEstudiante>[0]["onSubmit"]
  enviandoTarea: boolean
  enviandoQuiz: boolean
}

/** Opens the selected timeline resource in an accessible overlay. Data and submit logic stay in TimelineSection. */
export function TimelineDetail({
  recurso,
  userType,
  userId,
  detalleQuiz,
  cargandoQuiz,
  onClose,
  onSubmitTask,
  onSubmitQuiz,
  enviandoTarea,
  enviandoQuiz,
}: TimelineDetailProps) {
  const tipo = obtenerTipoRecurso(recurso)

  if (cargandoQuiz && tipo === "QUIZ") return <TimelineSectionSkeleton />

  if (userType === "student") {
    if (tipo === "ASSIGNMENT") {
      return (
        <OverlayPanel label={`Tarea: ${recurso.title}`} onEscape="trigger-close">
          <VistaTareaEstudiante
            onExit={onClose}
            assignment={recurso as Assignment}
            onSubmit={onSubmitTask}
            studentId={userId}
            isSubmitting={enviandoTarea}
            headingLevel="h2"
          />
        </OverlayPanel>
      )
    }
    if (tipo === "QUIZ" && detalleQuiz) {
      return (
        // The quiz has a timer and its own exit confirmation: Escape must not close it.
        <OverlayPanel label={`Quiz: ${recurso.title}`} onEscape="none">
          <VistaQuizEstudiante
            quizData={detalleQuiz as QuizDetail}
            onSubmit={onSubmitQuiz}
            onExit={onClose}
            studentId={userId}
            isSubmitting={enviandoQuiz}
          />
        </OverlayPanel>
      )
    }
    return null
  }

  return (
    <OverlayPanel label={`Detalle: ${recurso.title}`} onEscape={onClose} size="lg">
      <div className="p-4 md:p-6">
        {tipo === "ASSIGNMENT" && <VistaInfoTarea assignment={recurso as Assignment} onClose={onClose} />}
        {tipo === "QUIZ" && detalleQuiz && <VistaQuizProfesor quiz={detalleQuiz as TeacherQuizDetail} onClose={onClose} />}
      </div>
    </OverlayPanel>
  )
}
