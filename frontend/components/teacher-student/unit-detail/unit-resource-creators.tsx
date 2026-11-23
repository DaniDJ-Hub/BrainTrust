"use client"

import type { CourseId, UnitId } from "@/app/domain/valueObjects/CourseValues"
import { ResourceTypeSelector } from "../../teacher/resource-type-selector-teacher"
import { CreadorTarea } from "../../teacher/task-form-creator-teacher"
import { PageCreator } from "../../teacher/page-form-creator-teacher"
import { CreadorQuiz } from "../../teacher/quiz-form-creator-teacher"
import type { TipoRecurso } from "./unit-resource-utils"

interface UnitResourceCreatorsProps {
  idCourse: CourseId
  idUnit: UnitId
  selectorOpen: boolean
  onCloseSelector: () => void
  tipo: TipoRecurso | null
  onSelectTipo: (tipo: TipoRecurso | null) => void
  onSave: (datos: unknown, archivos?: File[]) => void
}

/** Teacher-only: resource type picker and the three creation forms. */
export function UnitResourceCreators({
  idCourse,
  idUnit,
  selectorOpen,
  onCloseSelector,
  tipo,
  onSelectTipo,
  onSave,
}: UnitResourceCreatorsProps) {
  const close = () => onSelectTipo(null)

  return (
    <>
      <ResourceTypeSelector open={selectorOpen} onClose={onCloseSelector} onSelect={onSelectTipo} />
      {tipo === "ASSIGNMENT" && <CreadorTarea idCourse={idCourse} idUnit={idUnit} open onClose={close} onSave={onSave} />}
      {tipo === "PAGE" && <PageCreator courseId={idCourse} unitId={idUnit} open onClose={close} onSave={onSave} />}
      {tipo === "QUIZ" && <CreadorQuiz courseId={idCourse} unitId={idUnit} open onClose={close} onSave={onSave} />}
    </>
  )
}
