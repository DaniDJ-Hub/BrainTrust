"use client"

import { toast } from "sonner"
import type { UnitResource } from "@/app/domain/entities/CourseEntities"
import type { CourseId, UnitId } from "@/app/domain/valueObjects/CourseValues"
import { useAssignmentMutations } from "../hooks/assignment-hooks"
import { useQuizMutations } from "../hooks/quiz-hooks"
import { usePageMutations } from "../hooks/page-hooks"
import { obtenerTipoRecurso, type TipoRecurso } from "./unit-resource-utils"

type AssignmentInput = Parameters<ReturnType<typeof useAssignmentMutations>["createAssignment"]["mutate"]>[0]["assignmentData"]
type QuizInput = Parameters<ReturnType<typeof useQuizMutations>["createQuiz"]["mutate"]>[0]["quizData"]
type PageInput = Parameters<ReturnType<typeof usePageMutations>["createPage"]["mutate"]>[0]["pageData"]

interface UseUnitResourceCrudOptions {
  idCourse: CourseId
  idUnit: UnitId
  /** Called after any successful create or delete. */
  onChanged: () => void
}

/** Teacher create/delete for unit resources (assignments, quizzes, pages). */
export function useUnitResourceCrud({ idCourse, idUnit, onChanged }: UseUnitResourceCrudOptions) {
  const mutacionesTarea = useAssignmentMutations()
  const mutacionesQuiz = useQuizMutations()
  const mutacionesPagina = usePageMutations()

  const creando =
    mutacionesTarea.createAssignment.isPending || mutacionesQuiz.createQuiz.isPending || mutacionesPagina.createPage.isPending

  const crearRecurso = (tipo: TipoRecurso, datosRecurso: unknown, archivos: File[] | undefined, onCreated: () => void) => {
    const configComun = {
      courseId: idCourse,
      unitId: idUnit,
      onSuccess: () => {
        onCreated()
        onChanged()
      },
    }

    switch (tipo) {
      case "ASSIGNMENT":
        mutacionesTarea.createAssignment.mutate({ ...configComun, assignmentData: datosRecurso as AssignmentInput, files: archivos })
        break
      case "QUIZ":
        mutacionesQuiz.createQuiz.mutate({ ...configComun, quizData: datosRecurso as QuizInput })
        break
      case "PAGE":
        mutacionesPagina.createPage.mutate({ ...configComun, pageData: datosRecurso as PageInput, attachments: archivos })
        break
    }
  }

  const eliminarRecurso = async (recurso: UnitResource) => {
    try {
      switch (obtenerTipoRecurso(recurso)) {
        case "ASSIGNMENT":
          await mutacionesTarea.deleteAssignment.mutateAsync(recurso.id)
          break
        case "QUIZ":
          await mutacionesQuiz.deleteQuiz.mutateAsync(recurso.id)
          break
        case "PAGE":
          await mutacionesPagina.deletePage.mutateAsync(recurso.id)
          break
      }
      onChanged()
      toast.success("Recurso eliminado")
    } catch (error) {
      toast.error("No se pudo eliminar el recurso. Inténtalo de nuevo.")
      throw error
    }
  }

  return { creando, crearRecurso, eliminarRecurso }
}
