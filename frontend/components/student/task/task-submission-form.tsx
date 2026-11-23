import React from 'react';
import { Award, CheckCircle2, Clock, Download, Loader2, Paperclip, Send, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormField, StatusBadge } from "@/components/common";
import { Assignment } from '@/app/domain/entities';
import { Document } from '@/app/domain/valueObjects';
import { Submission } from '@/app/shared/models/assignment.model';
import { formatDate, formatDateRelative } from './task-utils';

interface TaskSubmissionFormProps {
  assignment: Assignment;
  existingSubmission?: Submission;
  content: string;
  onContentChange: (value: string) => void;
  files: File[];
  uploadProgress: number;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  onDownloadAttachment: (attachment: Document) => void;
  onSubmitClick: () => void;
  isSubmitting: boolean;
  isSubmitted: boolean;
  isGraded: boolean;
  isLate: boolean;
  isClosedForLate: boolean;
}

const wordCount = (text: string) => text.split(/\s+/).filter(Boolean).length;

export const TaskSubmissionForm: React.FC<TaskSubmissionFormProps> = ({
  assignment,
  existingSubmission,
  content,
  onContentChange,
  files,
  uploadProgress,
  fileInputRef,
  onFileSelect,
  onRemoveFile,
  onDownloadAttachment,
  onSubmitClick,
  isSubmitting,
  isSubmitted,
  isGraded,
  isLate,
  isClosedForLate,
}) => {
  const uploadHintId = React.useId();

  return (
    <section aria-labelledby="task-submission-title" className="card-base overflow-hidden">
      <header className="flex items-center gap-2 border-b border-border px-5 py-4 sm:px-6">
        <span className="icon-badge"><Send className="size-4" aria-hidden="true" /></span>
        <h2 id="task-submission-title" className="text-subheading text-foreground">Tu entrega</h2>
        {existingSubmission && <StatusBadge kind="submission" status={existingSubmission.status} className="ml-auto" />}
      </header>

      <div className="space-y-5 px-5 py-5 sm:px-6">
        <FormField
          label="Respuesta escrita"
          required={!assignment.attachments.length}
          hint={`${content.length} caracteres · ${wordCount(content)} palabras${content.length > 0 ? ` · ~${Math.ceil(content.split(/\s+/).length / 200)} min de lectura` : ''}`}
        >
          {(field) => (
            <textarea
              {...field}
              placeholder="Escribe tu respuesta aquí. Puedes incluir explicaciones, código, ensayos o cualquier contenido que pida la tarea."
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              rows={12}
              disabled={isSubmitted}
              className="w-full resize-y rounded-control border border-input bg-card px-4 py-3 font-mono text-body text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
            />
          )}
        </FormField>

        <div className="space-y-3">
          <p className="text-body font-medium text-foreground">
            Adjuntos
            {!content.trim() && (
              <>
                <span className="ml-0.5 text-destructive" aria-hidden="true">*</span>
                <span className="sr-only"> (obligatorio si no escribes una respuesta)</span>
              </>
            )}
          </p>

          <input type="file" ref={fileInputRef} onChange={onFileSelect} multiple className="hidden" disabled={isSubmitted} tabIndex={-1} aria-hidden="true" />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSubmitted}
            aria-describedby={uploadHintId}
            className="flex h-24 w-full flex-col items-center justify-center gap-1.5 rounded-control border-2 border-dashed border-input text-muted-foreground transition-colors hover:border-primary hover:bg-secondary hover:text-secondary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Upload className="size-6" aria-hidden="true" />
            <span className="text-body font-semibold">Seleccionar archivos</span>
            <span id={uploadHintId} className="text-caption font-normal">PDF, DOC, imágenes o código (máx. 10 MB cada uno)</span>
          </button>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-1.5" role="status">
              <div className="h-1.5 w-full rounded-full bg-muted">
                <div className="h-1.5 rounded-full bg-primary transition-[width]" style={{ width: `${uploadProgress}%` }} />
              </div>
              <p className="text-center text-caption font-normal text-muted-foreground tabular-nums">Preparando… {uploadProgress}%</p>
            </div>
          )}

          {files.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="section-label">Archivos seleccionados</h3>
              <ul className="space-y-1.5">
                {files.map((file, index) => (
                  <li key={index} className="flex items-center justify-between gap-3 rounded-control border border-border bg-card p-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <Paperclip className="size-4 shrink-0 text-primary" aria-hidden="true" />
                      <div className="min-w-0">
                        <p className="truncate text-body font-semibold text-foreground">{file.name}</p>
                        <p className="text-caption font-normal text-muted-foreground tabular-nums">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveFile(index)}
                      disabled={isSubmitted}
                      className="icon-btn-destructive"
                      aria-label={`Quitar ${file.name}`}
                    >
                      <X className="size-4" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {existingSubmission?.attachments && existingSubmission.attachments.length > 0 && (
          <div className="space-y-2">
            <h3 className="section-label flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-success" aria-hidden="true" />
              Archivos entregados
            </h3>
            <ul className="space-y-1.5">
              {existingSubmission.attachments.map((attachment, index) => (
                <li key={index} className="flex items-center justify-between gap-3 rounded-control border border-border bg-muted/50 p-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Paperclip className="size-4 shrink-0 text-primary" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="truncate text-body font-semibold text-foreground">{attachment.name}</p>
                      <p className="text-caption font-normal text-muted-foreground">Entregado {formatDateRelative(existingSubmission.submittedAt)}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => onDownloadAttachment(attachment as Document)} className="btn-secondary btn-sm shrink-0">
                    <Download className="size-4" aria-hidden="true" />
                    Descargar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {isSubmitted && (
          <div
            className={cn(
              'rounded-control border p-4',
              isGraded ? 'border-info/30 bg-info-soft text-info-soft-foreground'
                : isLate ? 'border-warning/30 bg-warning-soft text-warning-soft-foreground'
                : 'border-success/30 bg-success-soft text-success-soft-foreground',
            )}
          >
            <div className="flex items-start gap-3">
              {isGraded ? <Award className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                : isLate ? <Clock className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                : <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden="true" />}
              <div className="min-w-0 flex-1 space-y-2">
                <p className="text-body font-semibold">
                  {isGraded ? 'Entrega calificada' : isLate ? 'Entrega tardía recibida' : 'Entrega recibida'}
                </p>
                <p className="text-caption font-normal">
                  Entregada el {formatDate(existingSubmission!.submittedAt)}
                  {isLate && ' (fuera de plazo)'}
                </p>
                {isGraded && existingSubmission?.grade && (
                  <p className="flex items-baseline gap-2">
                    <span className="text-heading tabular-nums">
                      {existingSubmission.grade.value}/{assignment.maxScore.value}
                    </span>
                    <span className="text-body font-semibold tabular-nums">
                      {((Number(existingSubmission.grade.value) / Number(assignment.maxScore.value)) * 100).toFixed(1)}%
                    </span>
                  </p>
                )}
                {existingSubmission?.teacherFeedback && (
                  <div className="rounded-control border border-border bg-card p-3 text-foreground">
                    <p className="mb-1 text-caption">Retroalimentación del profesor</p>
                    <p className="whitespace-pre-wrap text-body text-muted-foreground">{existingSubmission.teacherFeedback}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {!isSubmitted && isClosedForLate && (
          <p role="status" className="rounded-control border border-destructive/30 bg-destructive-soft py-3 text-center text-body font-medium text-destructive-soft-foreground">
            La fecha límite pasó y no se aceptan entregas tardías.
          </p>
        )}

        {!isSubmitted && !isClosedForLate && (
          <button
            type="button"
            onClick={onSubmitClick}
            disabled={isSubmitting || (!content.trim() && files.length === 0)}
            aria-busy={isSubmitting || undefined}
            className="btn-primary btn-lg w-full"
          >
            {isSubmitting ? (
              <><Loader2 className="size-5 animate-spin" aria-hidden="true" />Entregando…</>
            ) : (
              <><Send className="size-5" aria-hidden="true" />Entregar tarea</>
            )}
          </button>
        )}
      </div>
    </section>
  );
};
