import React from 'react';
import {
  AlertTriangle,
  Award,
  CheckCircle,
  Download,
  Loader2,
  MessageSquare,
  Paperclip,
  Send,
  Upload,
} from "lucide-react";
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
}) => (
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="px-5 py-4 sm:px-6 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Send className="w-4 h-4 text-primary" />
                  </span>
                  <h2 className="text-base font-bold text-foreground">Tu Envío</h2>
                </div>
              </div>
              <div className="px-5 py-5 sm:px-6 space-y-5">

                <div className="space-y-2">
                  <label htmlFor="content" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Respuesta Escrita
                    {!assignment.attachments.length && <span className="text-destructive">*</span>}
                  </label>
                  <textarea
                    id="content"
                    placeholder="Escribe tu respuesta aquí... Puedes incluir explicaciones, código, ensayos o cualquier contenido escrito requerido para esta tarea."
                    value={content}
                    onChange={(e) => onContentChange(e.target.value)}
                    rows={12}
                    disabled={isSubmitted}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none disabled:opacity-30 transition-all"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground tabular-nums">
                      {content.length} caracteres · {content.split(/\s+/).filter(Boolean).length} palabras
                    </p>
                    {content.length > 0 && (
                      <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-semibold">
                        ~{Math.ceil(content.split(/\s+/).length / 200)} min de lectura
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    Adjuntos
                    {!content.trim() && <span className="text-destructive">*</span>}
                  </label>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onFileSelect}
                    multiple
                    className="hidden"
                    disabled={isSubmitted}
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSubmitted}
                    className="w-full h-24 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-primary disabled:opacity-30 transition-all"
                  >
                    <Upload className="w-7 h-7" />
                    <div className="text-center">
                      <p className="text-sm font-semibold">Haz clic para subir archivos</p>
                      <p className="text-xs">PDF, DOC, imágenes, archivos de código (Máx: 10MB cada uno)</p>
                    </div>
                  </button>

                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="space-y-1.5">
                      <div className="w-full bg-muted/50 rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-center text-muted-foreground tabular-nums">
                        Subiendo... {uploadProgress}%
                      </p>
                    </div>
                  )}

                  {files.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="section-label">
                        Archivos Seleccionados
                      </p>
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-card rounded-xl border border-border"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Paperclip className="w-4 h-4 text-primary flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-foreground truncate">{file.name}</p>
                              <p className="text-xs text-muted-foreground tabular-nums">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => onRemoveFile(index)}
                            disabled={isSubmitted}
                            className="text-xs font-semibold text-destructive hover:opacity-80 disabled:opacity-30 transition-all flex-shrink-0 px-2 py-1"
                          >
                            Eliminar
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {existingSubmission?.attachments && existingSubmission.attachments.length > 0 && (
                  <div className="space-y-2">
                    <p className="section-label flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-primary" />
                      Archivos Enviados Anteriormente
                    </p>
                    <div className="space-y-1.5">
                      {existingSubmission.attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-primary/5 rounded-xl border border-primary/20"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Paperclip className="w-4 h-4 text-primary flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-foreground truncate">{attachment.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Enviado: {formatDateRelative(existingSubmission.submittedAt)}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => onDownloadAttachment(attachment as Document)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all flex-shrink-0"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Descargar
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isSubmitted && (
                  <div className={`p-4 rounded-2xl border ${
                    isGraded
                      ? 'bg-primary/5 border-primary/20'
                      : isLate
                      ? 'bg-highlight/10 border-highlight/30'
                      : 'bg-muted/30 border-border'
                  }`}>
                    <div className="flex items-start gap-3">
                      {isGraded
                        ? <Award className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        : isLate
                        ? <AlertTriangle className="w-5 h-5 text-highlight-foreground flex-shrink-0 mt-0.5" />
                        : <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />}
                      <div className="flex-1 min-w-0 space-y-2">
                        <p className="font-semibold text-sm text-foreground">
                          {isGraded ? 'Envío Calificado' :
                           isLate  ? 'Envío Tardío Recibido' :
                           'Envío Recibido'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Enviado el {formatDate(existingSubmission!.submittedAt)}
                          {isLate && ' (Envío tardío)'}
                        </p>
                        {isGraded && existingSubmission?.grade && (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg text-primary">
                              {existingSubmission.grade.value}/{assignment.maxScore.value}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-semibold">
                              {((Number(existingSubmission.grade.value) / Number(assignment.maxScore.value)) * 100).toFixed(1)}%
                            </span>
                          </div>
                        )}
                        {existingSubmission?.teacherFeedback && (
                          <div className="p-3 bg-card rounded-xl border border-border">
                            <p className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-1">
                              <MessageSquare className="w-3.5 h-3.5" />
                              Retroalimentación del Profesor
                            </p>
                            <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                              {existingSubmission.teacherFeedback}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {!isSubmitted && isClosedForLate && (
                  <p className="w-full text-center py-3.5 rounded-xl border border-border text-sm font-medium text-destructive">
                    La fecha límite pasó y no se aceptan entregas tardías.
                  </p>
                )}

                {!isSubmitted && !isClosedForLate && (
                  <button
                    onClick={onSubmitClick}
                    disabled={isSubmitting || (!content.trim() && files.length === 0)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground text-base font-semibold hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-5 h-5 animate-spin" />Enviando...</>
                    ) : (
                      <><Send className="w-5 h-5" />Enviar Tarea</>
                    )}
                  </button>
                )}

              </div>
            </div>
);
