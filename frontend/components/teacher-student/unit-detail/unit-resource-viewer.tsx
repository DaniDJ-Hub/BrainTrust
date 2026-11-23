"use client"

import type { Assignment, Page, Quiz, UnitResource } from "@/app/domain/entities/CourseEntities"
import { VistaQuiz } from "../../teacher/quiz-view-information-teacher"
import { VistaInfoTarea } from "../../teacher/task-view-information-teacher"
import { VistaPagina } from "../page-view-student-teacher"
import { VistaTareaEstudiante } from "../../student/tasks-transactional-view-student"
import { VistaQuizEstudiante } from "../../student/quiz-transactional-view-student"
import { obtenerTipoRecurso } from "./unit-resource-utils"

type VistaTareaProps = React.ComponentProps<typeof VistaTareaEstudiante>
type VistaQuizProps = React.ComponentProps<typeof VistaQuizEstudiante>

interface UnitResourceViewerProps {
  mode: "detail" | "student"
  recurso: UnitResource
  /** Full assignment for the teacher detail view (fetched by the parent). */
  tareaDetalle?: Assignment
  studentId: string
  onClose: () => void
  onSubmitTask: VistaTareaProps["onSubmit"]
  onSubmitQuiz: VistaQuizProps["onSubmit"]
  enviandoTarea: boolean
  enviandoQuiz: boolean
}

/** Renders a single unit resource: teacher detail/edit views or the student task/quiz/page views. */
export function UnitResourceViewer({
  mode,
  recurso,
  tareaDetalle,
  studentId,
  onClose,
  onSubmitTask,
  onSubmitQuiz,
  enviandoTarea,
  enviandoQuiz,
}: UnitResourceViewerProps) {
  const tipo = obtenerTipoRecurso(recurso)

  if (mode === "detail") {
    return (
      <div className="mx-auto max-w-4xl">
        {tipo === "ASSIGNMENT" && tareaDetalle && <VistaInfoTarea assignment={tareaDetalle} onClose={onClose} />}
        {tipo === "QUIZ" && <VistaQuiz quiz={recurso as Quiz} onClose={onClose} />}
        {tipo === "PAGE" && <VistaPagina page={recurso as Page} onClose={onClose} />}
      </div>
    )
  }

  if (tipo === "ASSIGNMENT") {
    return (
      <VistaTareaEstudiante
        assignment={recurso as Assignment}
        studentId={studentId}
        onSubmit={onSubmitTask}
        onExit={onClose}
        isSubmitting={enviandoTarea}
      />
    )
  }
  if (tipo === "QUIZ") {
    return (
      <VistaQuizEstudiante
        quizData={recurso as Quiz}
        studentId={studentId}
        onSubmit={onSubmitQuiz}
        onExit={onClose}
        isSubmitting={enviandoQuiz}
      />
    )
  }
  return <VistaPagina page={recurso as Page} onClose={onClose} />
}
