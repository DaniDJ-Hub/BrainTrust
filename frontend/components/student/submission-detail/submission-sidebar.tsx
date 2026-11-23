import { Info } from "lucide-react"
import { StatusBadge } from "@/components/common"
import type { SubmissionTask } from "@/app/shared/models/assignment.model"
import type { PerformanceLevel } from "./grade-summary"

interface SubmissionSidebarProps {
  assignment: SubmissionTask
  submission: NonNullable<SubmissionTask["submission"]>
  isLate: boolean
  percentage: number
  performance: PerformanceLevel
}

export function SubmissionSidebar({ assignment, submission, isLate, percentage, performance }: SubmissionSidebarProps) {
  const isGraded = submission.status === "GRADED"

  return (
    <aside className="space-y-4" aria-label="Detalles de la entrega">
      <section aria-labelledby="submission-details-title" className="card-base overflow-hidden">
        <header className="border-b border-border px-4 py-3">
          <h2 id="submission-details-title" className="text-body font-semibold text-foreground">Detalles de la entrega</h2>
        </header>
        <dl className="space-y-4 px-4 py-4">
          <div className="space-y-1">
            <dt className="text-caption font-normal text-muted-foreground">Estado</dt>
            <dd><StatusBadge kind="submission" status={submission.status} /></dd>
          </div>
          <div className="space-y-0.5">
            <dt className="text-caption font-normal text-muted-foreground">Estudiante</dt>
            <dd className="text-body font-semibold text-foreground">{assignment.studentName}</dd>
          </div>
          <div className="space-y-0.5">
            <dt className="text-caption font-normal text-muted-foreground">Fecha de entrega</dt>
            <dd className="text-body text-foreground">{new Date(submission.submittedAt).toLocaleString()}</dd>
          </div>
          <div className="space-y-0.5">
            <dt className="text-caption font-normal text-muted-foreground">Fecha límite</dt>
            <dd className="text-body text-foreground">{assignment.deadline}</dd>
            {isLate && <dd className="text-caption text-warning">Entregada fuera de plazo</dd>}
          </div>
          <div className="space-y-0.5">
            <dt className="text-caption font-normal text-muted-foreground">Modo de entrega</dt>
            <dd className="text-body text-foreground">{assignment.deliveryMode === "TEAM" ? "Equipo" : "Individual"}</dd>
          </div>
          <div className="space-y-0.5">
            <dt className="text-caption font-normal text-muted-foreground">Puntos máximos</dt>
            <dd className="text-body text-foreground tabular-nums">{assignment.maxPoints} puntos</dd>
          </div>

          {isGraded && submission.grade && (
            <>
              <div className="space-y-1 border-t border-border pt-4">
                <dt className="text-caption font-normal text-muted-foreground">Tu calificación</dt>
                <dd className="text-title text-foreground tabular-nums">
                  {submission.grade.value}/{assignment.maxPoints}
                </dd>
                <dd className="flex items-center gap-2 text-caption font-normal text-muted-foreground">
                  <span className="tabular-nums">{percentage.toFixed(1)}%</span>
                  <span className={performance.badge}>{performance.label}</span>
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-caption font-normal text-muted-foreground">ID de la entrega</dt>
                <dd>
                  <code className="block break-all rounded-control bg-muted px-3 py-2 font-mono text-caption font-normal text-foreground">
                    {submission.id}
                  </code>
                </dd>
              </div>
            </>
          )}
        </dl>
      </section>

      <section aria-labelledby="assignment-info-title" className="card-base overflow-hidden">
        <header className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span className="icon-badge"><Info className="size-4" aria-hidden="true" /></span>
          <h2 id="assignment-info-title" className="text-body font-semibold text-foreground">Información de la tarea</h2>
        </header>
        <dl className="space-y-3 px-4 py-4">
          <div className="space-y-0.5">
            <dt className="text-caption font-normal text-muted-foreground">Título</dt>
            <dd className="text-body font-semibold text-foreground">{assignment.name}</dd>
          </div>
          <div className="space-y-0.5">
            <dt className="text-caption font-normal text-muted-foreground">Unidad</dt>
            <dd className="text-body text-foreground">{assignment.unit}</dd>
          </div>
          <div className="space-y-0.5">
            <dt className="text-caption font-normal text-muted-foreground">Instrucciones</dt>
            <dd className="line-clamp-4 text-body text-foreground">{assignment.instructions}</dd>
          </div>
        </dl>
      </section>
    </aside>
  )
}
