import { ClipboardList, Eye, FileText, Play } from "lucide-react"
import { DataTable, EmptyState, StatusBadge, type DataTableColumn } from "@/components/common"
import type { SubmissionTask } from "@/app/shared/models/assignment.model"
import type { StudentSubmissionQuiz } from "@/app/shared/models/quiz.model"
import { GradeCell, derivarEstado } from "./submission-utils"

interface AssignmentsTableProps {
  rows: SubmissionTask[]
  isLoading: boolean
  searching: boolean
  onOpen: (id: string) => void
}

export function AssignmentsTable({ rows, isLoading, searching, onOpen }: AssignmentsTableProps) {
  const columns: DataTableColumn<SubmissionTask>[] = [
    { id: "name", header: "Tarea", primary: true, cell: (a) => a.name },
    {
      id: "status",
      header: "Estado",
      cell: (a) => <StatusBadge kind="submission" status={derivarEstado(a.submission?.status, a.isOverdue)} />,
    },
    {
      id: "deadline",
      header: "Fecha límite",
      cell: (a) => <span className={a.isOverdue ? "font-semibold text-destructive" : "text-muted-foreground"}>{a.deadline}</span>,
    },
    {
      id: "grade",
      header: "Calificación",
      align: "right",
      cell: (a) =>
        a.submission?.grade ? <GradeCell value={Number(a.submission.grade.value)} max={a.maxPoints} /> : <span className="text-muted-foreground">—</span>,
    },
    {
      id: "actions",
      header: "Acciones",
      actions: true,
      align: "right",
      cell: (a) => (
        <button type="button" className={a.submission ? "btn-secondary btn-sm" : "btn-primary btn-sm"} onClick={() => onOpen(a.id)}>
          {a.submission ? <Eye className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
          {a.submission ? "Ver entrega" : "Comenzar"}
          <span className="sr-only">: {a.name}</span>
        </button>
      ),
    },
  ]

  return (
    <DataTable
      caption="Tareas de la unidad"
      columns={columns}
      rows={rows}
      getRowId={(a) => a.id}
      isLoading={isLoading}
      emptyState={
        <EmptyState
          icon={FileText}
          size="compact"
          title="No hay tareas"
          description={searching ? "Ninguna tarea coincide con tu búsqueda." : "Todavía no tienes tareas en esta unidad."}
        />
      }
    />
  )
}

interface QuizzesTableProps {
  rows: StudentSubmissionQuiz[]
  isLoading: boolean
  searching: boolean
  onOpen: (id: string) => void
}

export function QuizzesTable({ rows, isLoading, searching, onOpen }: QuizzesTableProps) {
  const columns: DataTableColumn<StudentSubmissionQuiz>[] = [
    { id: "title", header: "Cuestionario", primary: true, cell: (q) => q.title },
    {
      id: "status",
      header: "Estado",
      cell: (q) => <StatusBadge kind="submission" status={derivarEstado(q.submission?.status, q.isOverdue)} />,
    },
    { id: "max", header: "Calif. máxima", align: "right", cell: (q) => q.maxGrade },
    {
      id: "grade",
      header: "Calificación",
      align: "right",
      cell: (q) =>
        q.submission?.grade ? (
          <GradeCell value={q.submission.grade.value} max={q.submission.grade.maxScore} />
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      id: "actions",
      header: "Acciones",
      actions: true,
      align: "right",
      cell: (q) => (
        <button type="button" className={q.submission ? "btn-secondary btn-sm" : "btn-primary btn-sm"} onClick={() => onOpen(q.id)}>
          {q.submission ? <Eye className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
          {q.submission ? "Ver resultados" : "Realizar"}
          <span className="sr-only">: {q.title}</span>
        </button>
      ),
    },
  ]

  return (
    <DataTable
      caption="Cuestionarios de la unidad"
      columns={columns}
      rows={rows}
      getRowId={(q) => q.id}
      isLoading={isLoading}
      emptyState={
        <EmptyState
          icon={ClipboardList}
          size="compact"
          title="No hay cuestionarios"
          description={searching ? "Ningún cuestionario coincide con tu búsqueda." : "Todavía no tienes cuestionarios en esta unidad."}
        />
      }
    />
  )
}
