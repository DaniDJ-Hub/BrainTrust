"use client"

import { ArrowLeft, CalendarDays, Clock, Download, FileQuestion, FileText, MessageSquare, Paperclip, User } from "lucide-react"
import { getCloudinaryDownloadUrl } from "@/app/utils/cloudinary/cloudinary-pdf"
import { SubmissionTask } from "@/app/shared/models/assignment.model"
import { EmptyState, PageHeader, StatusBadge } from "@/components/common"
import { TaskAIAnalysis } from "./task/task-ai-analysis"
import { GradeSummary, getPerformanceLevel } from "./submission-detail/grade-summary"
import { SubmissionSidebar } from "./submission-detail/submission-sidebar"

export interface AttachmentData {
  name: string
  storagePath: string
}

interface StudentTaskSubmissionViewProps {
  assignment: SubmissionTask
  onExit: () => void
}

const handleDownload = (file: AttachmentData) => {
  window.open(getCloudinaryDownloadUrl(file.storagePath), "_blank")
}

export function StudentTaskSubmissionView({ assignment, onExit }: StudentTaskSubmissionViewProps) {
  const backButton = (
    <button type="button" onClick={onExit} className="btn-quiet btn-sm -ml-2">
      <ArrowLeft className="size-4" aria-hidden="true" /> Volver a tareas
    </button>
  )

  if (!assignment.submission) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        {backButton}
        <PageHeader eyebrow={assignment.unit} title={assignment.name} actions={<StatusBadge kind="submission" status={assignment.isOverdue ? "MISSING" : "PENDING"} />} />
        <div className="card-base">
          <EmptyState
            icon={FileQuestion}
            title="Todavía no has entregado esta tarea"
            description="Cuando la entregues, aquí verás tu respuesta, tus archivos y la calificación."
            action={<button type="button" className="btn-secondary" onClick={onExit}>Volver a tareas</button>}
          />
        </div>
      </div>
    )
  }

  const submission = assignment.submission
  const isGraded = submission.status === "GRADED"
  const isLate = submission.status === "LATE_SUBMITTED"
  const percentage = submission.grade ? (parseInt(submission.grade.value) / assignment.maxPoints) * 100 : 0
  const performance = getPerformanceLevel(percentage)
  const submittedAt = new Date(submission.submittedAt)

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {backButton}

      <PageHeader eyebrow={assignment.unit} title={assignment.name} actions={<StatusBadge kind="submission" status={submission.status} />} />

      <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 text-caption font-normal text-muted-foreground">
        <li className="inline-flex items-center gap-1.5"><User className="size-3.5" aria-hidden="true" />{assignment.studentName}</li>
        <li className="inline-flex items-center gap-1.5"><CalendarDays className="size-3.5" aria-hidden="true" />{submittedAt.toLocaleDateString()}</li>
        <li className="inline-flex items-center gap-1.5"><Clock className="size-3.5" aria-hidden="true" />{submittedAt.toLocaleTimeString()}</li>
        <li><span className="badge-muted">{assignment.deliveryMode === "TEAM" ? "Equipo" : "Individual"}</span></li>
      </ul>

      {isGraded && submission.grade && (
        <GradeSummary grade={submission.grade.value} maxPoints={assignment.maxPoints} percentage={percentage} performance={performance} isLate={isLate} />
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <section aria-labelledby="my-submission-title" className="card-base overflow-hidden">
            <header className="flex items-center gap-2 border-b border-border px-5 py-4 sm:px-6">
              <span className="icon-badge"><FileText className="size-4" aria-hidden="true" /></span>
              <h2 id="my-submission-title" className="text-subheading text-foreground">Tu entrega</h2>
            </header>
            <div className="space-y-3 px-5 py-5 sm:px-6">
              {submission.content ? (
                <div className="whitespace-pre-wrap rounded-control border border-border bg-muted/50 p-4 text-reading text-foreground">{submission.content}</div>
              ) : (
                <p className="text-body text-muted-foreground">Sin respuesta escrita.</p>
              )}
              <p className="flex items-center gap-1.5 text-caption font-normal text-muted-foreground">
                <Clock className="size-3.5" aria-hidden="true" />
                Entregada el {submittedAt.toLocaleString()}
              </p>
            </div>
          </section>

          {submission.attachments && submission.attachments.length > 0 && (
            <section aria-labelledby="my-files-title" className="card-base overflow-hidden">
              <header className="flex items-center gap-2 border-b border-border px-5 py-4 sm:px-6">
                <span className="icon-badge"><Paperclip className="size-4" aria-hidden="true" /></span>
                <h2 id="my-files-title" className="text-subheading text-foreground">Archivos adjuntos ({submission.attachments.length})</h2>
              </header>
              <ul className="space-y-2 px-5 py-5 sm:px-6">
                {submission.attachments.map((file, index) => (
                  <li key={index} className="flex items-center gap-3 rounded-control border border-border bg-muted/50 p-3">
                    <Paperclip className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <p className="min-w-0 flex-1 truncate text-body font-semibold text-foreground">{file.name}</p>
                    <button type="button" onClick={() => handleDownload(file)} className="btn-secondary btn-sm shrink-0">
                      <Download className="size-4" aria-hidden="true" />
                      Descargar<span className="sr-only"> {file.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {submission.aiAnalysis && <TaskAIAnalysis aiResult={submission.aiAnalysis} />}

          {submission.teacherFeedback && (
            <section aria-labelledby="feedback-title" className="card-base overflow-hidden border-l-4 border-l-primary">
              <header className="flex items-center gap-2 border-b border-border px-5 py-4 sm:px-6">
                <span className="icon-badge"><MessageSquare className="size-4" aria-hidden="true" /></span>
                <h2 id="feedback-title" className="text-subheading text-foreground">Retroalimentación del profesor</h2>
              </header>
              <div className="space-y-4 px-5 py-5 sm:px-6">
                <p className="whitespace-pre-wrap text-reading text-foreground">{submission.teacherFeedback}</p>
                {submission.grade && (
                  <p className="flex flex-wrap items-center gap-3 rounded-control border border-border bg-muted/50 p-4">
                    <span className="text-caption text-muted-foreground">Calificación</span>
                    <span className="text-heading text-foreground tabular-nums">{submission.grade.value}/{assignment.maxPoints}</span>
                    <span className="text-caption font-normal text-muted-foreground tabular-nums">({percentage.toFixed(1)}%)</span>
                    <span className={performance.badge}>{performance.label}</span>
                  </p>
                )}
              </div>
            </section>
          )}
        </div>

        <SubmissionSidebar assignment={assignment} submission={submission} isLate={isLate} percentage={percentage} performance={performance} />
      </div>
    </div>
  )
}
