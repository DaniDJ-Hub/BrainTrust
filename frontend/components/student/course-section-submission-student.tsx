"use client"

import { useState } from "react"
import { AlertTriangle, ArrowLeft, ClipboardList, FileText, Search } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/app/context/AuthContext"
import { useStudentTaskOverview } from "@/components/student/hooks/student-task-hooks"
import { useCourseAllUnits } from "@/components/teacher/hooks/courses-hooks"
import { FormField, PageHeader } from "@/components/common"
import { StudentTaskSubmissionView } from "./StudentTaskSubmissionView"
import { StudentQuizView } from "./StudentQuizViewSubmission"
import { UnitPicker } from "./submissions/unit-picker"
import { AssignmentsTable, QuizzesTable } from "./submissions/submission-tables"

interface StudentCourseTaskOverviewProps {
  courseId: string
}

const TAB_TRIGGER =
  "flex h-10 items-center gap-2 rounded-control text-body font-semibold text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs"

export function StudentCourseTaskOverview({ courseId }: StudentCourseTaskOverviewProps) {
  const { user } = useAuth()
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("assignments")
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const { units: courseUnits, isLoading: isLoadingUnits, error: unitsError } = useCourseAllUnits(courseId)

  const {
    assignments,
    quizzes,
    stats,
    isLoading: isLoadingTasks,
    error: tasksError,
    refetchAssignments,
    refetchQuizzes,
  } = useStudentTaskOverview(courseId, user?.id || null, selectedUnitId)

  const handleSelectUnit = (unitId: string) => {
    setSelectedUnitId(unitId)
    setActiveTab("assignments")
    setSelectedTask(null)
    setSelectedQuiz(null)
    setSearchTerm("")
  }

  const handleBackToUnits = () => {
    setSelectedUnitId(null)
    setSelectedTask(null)
    setSelectedQuiz(null)
    setSearchTerm("")
  }

  const handleBackFromTask = () => {
    setSelectedTask(null)
    refetchAssignments()
  }

  const handleBackFromQuiz = () => {
    setSelectedQuiz(null)
    refetchQuizzes()
  }

  if (selectedTask) {
    const assignment = assignments.find((a) => a.id === selectedTask)
    return assignment ? <StudentTaskSubmissionView assignment={assignment} onExit={handleBackFromTask} /> : null
  }

  if (selectedQuiz) {
    const quiz = quizzes.find((q) => q.id === selectedQuiz)
    return quiz ? <StudentQuizView quiz={quiz} onExit={handleBackFromQuiz} /> : null
  }

  if (!selectedUnitId) {
    return (
      <div className="space-y-6">
        <PageHeader title="Tareas y cuestionarios" description="Elige una unidad para ver tus entregas y calificaciones." />
        <UnitPicker units={courseUnits} isLoading={isLoadingUnits} error={unitsError} onSelect={handleSelectUnit} />
      </div>
    )
  }

  const selectedUnit = courseUnits.find((unit) => unit.id === selectedUnitId)
  const term = searchTerm.toLowerCase()
  const filteredAssignments = assignments.filter(
    (a) => a.name.toLowerCase().includes(term) || a.unit.toLowerCase().includes(term)
  )
  const filteredQuizzes = quizzes.filter((q) => q.title.toLowerCase().includes(term))

  return (
    <div className="space-y-6">
      <button type="button" onClick={handleBackToUnits} className="btn-quiet btn-sm -ml-2">
        <ArrowLeft className="size-4" aria-hidden="true" /> Todas las unidades
      </button>

      <PageHeader
        eyebrow={selectedUnit ? `Unidad ${selectedUnit.numUnity}` : undefined}
        title={selectedUnit?.name || "Tareas y cuestionarios de la unidad"}
      />

      {stats && (
        <ul className="flex flex-wrap gap-2" aria-label="Resumen de la unidad">
          <li className="badge-muted">{stats.totalTasks} actividades</li>
          <li className="badge-success">{stats.completedTasks} calificadas</li>
          <li className="badge-muted">{stats.pendingTasks} pendientes</li>
          {stats.overdueTasks > 0 && <li className="badge-destructive">{stats.overdueTasks} sin entregar</li>}
          {stats.averageGrade > 0 && <li className="badge-info">Promedio: {stats.averageGrade}%</li>}
        </ul>
      )}

      <FormField label="Buscar tareas o cuestionarios" hideLabel>
        {(field) => (
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              {...field}
              type="search"
              placeholder="Buscar tareas o cuestionarios…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-9"
            />
          </div>
        )}
      </FormField>

      {tasksError && (
        <div role="alert" className="flex items-start gap-3 rounded-control border border-destructive/30 bg-destructive-soft p-4 text-destructive-soft-foreground">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <div>
            <p className="text-body font-semibold">No pudimos cargar tus actividades</p>
            <p className="text-caption font-normal">{tasksError}</p>
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid h-auto w-full grid-cols-2 rounded-surface bg-muted p-1">
          <TabsTrigger value="assignments" className={TAB_TRIGGER}>
            <FileText className="size-4" aria-hidden="true" />
            Tareas
            <span className="badge-primary">{assignments.length}</span>
          </TabsTrigger>
          <TabsTrigger value="quizzes" className={TAB_TRIGGER}>
            <ClipboardList className="size-4" aria-hidden="true" />
            Cuestionarios
            <span className="badge-primary">{quizzes.length}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assignments">
          <AssignmentsTable rows={filteredAssignments} isLoading={isLoadingTasks} searching={!!searchTerm} onOpen={setSelectedTask} />
        </TabsContent>
        <TabsContent value="quizzes">
          <QuizzesTable rows={filteredQuizzes} isLoading={isLoadingTasks} searching={!!searchTerm} onOpen={setSelectedQuiz} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
