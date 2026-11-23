import React from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  CalendarClock,
  Download,
  File,
  FileText,
  Info,
  Link as LinkIcon,
  MessageSquare,
  Paperclip,
  User,
  Users,
} from "lucide-react";
import { Assignment } from '@/app/domain/entities';
import { Document } from '@/app/domain/valueObjects';
import { formatDate, formatDateRelative, type TimeRemaining } from './task-utils';

interface TaskSummaryCardProps {
  assignment: Assignment;
  timeRemaining: TimeRemaining | null;
}

export const TaskSummaryCard: React.FC<TaskSummaryCardProps> = ({ assignment, timeRemaining }) => (
            <div className="bg-card rounded-2xl border-l-4 border-l-primary border-t border-r border-b border-border shadow-sm overflow-hidden">
              <div className="px-5 py-4 sm:px-6 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-4 h-4 text-primary" />
                  </span>
                  <h2 className="text-base font-bold text-foreground">Resumen de la Tarea</h2>
                </div>
              </div>
              <div className="px-5 py-5 sm:px-6 space-y-5">

                <div className="space-y-1.5">
                  <p className="section-label flex items-center gap-2">
                    <Info className="w-3.5 h-3.5" />Descripción
                  </p>
                  <p className="text-sm text-foreground">{assignment.description}</p>
                </div>

                <div className="space-y-1.5">
                  <p className="section-label flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5" />Instrucciones
                  </p>
                  <div className="p-4 bg-muted/30 rounded-xl border border-border">
                    <p className="text-sm text-foreground whitespace-pre-wrap">{assignment.instructions}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-5 border-t border-border">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />Creada
                    </p>
                    <p className="text-sm font-medium text-foreground">{formatDate(assignment.createdAt)}</p>
                    <p className="text-xs text-muted-foreground">({formatDateRelative(assignment.createdAt)})</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                      <CalendarClock className="w-3.5 h-3.5" />Fecha Límite
                    </p>
                    {assignment.dueDate ? (
                      <>
                        <p className="text-sm font-medium text-foreground">{formatDate(assignment.dueDate)}</p>
                        {timeRemaining && (
                          <p className={`text-xs ${timeRemaining.overdue ? 'text-destructive' : 'text-muted-foreground'}`}>
                            {timeRemaining.text}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">Sin fecha límite</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" />Puntaje Máx.
                    </p>
                    <p className="text-lg font-bold text-primary">{assignment.maxScore.value} pts</p>
                    {assignment.maxScore.maxPoints && (
                      <p className="text-xs text-muted-foreground">de {assignment.maxScore.maxPoints}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                      {assignment.deliveryMode === 'TEAM'
                        ? <Users className="w-3.5 h-3.5" />
                        : <User className="w-3.5 h-3.5" />}
                      Modo de Entrega
                    </p>
                    <span className="inline-flex px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-semibold">
                      {assignment.deliveryMode === 'TEAM' ? 'Equipo' : 'Individual'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
);

interface TaskResourcesCardProps {
  assignment: Assignment;
  displayedLinks: string[];
  displayedAttachments: Document[];
  showAllLinks: boolean;
  onToggleLinks: () => void;
  showAllAttachments: boolean;
  onToggleAttachments: () => void;
  onDownloadAttachment: (attachment: Document) => void;
}

export const TaskResourcesCard: React.FC<TaskResourcesCardProps> = ({
  assignment,
  displayedLinks,
  displayedAttachments,
  showAllLinks,
  onToggleLinks,
  showAllAttachments,
  onToggleAttachments,
  onDownloadAttachment,
}) => (
              <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="px-5 py-4 sm:px-6 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-primary" />
                    </span>
                    <h2 className="text-base font-bold text-foreground">Recursos de Aprendizaje</h2>
                  </div>
                </div>
                <div className="px-5 py-5 sm:px-6 space-y-5">

                  {assignment.links.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <p className="section-label flex items-center gap-1.5">
                          <LinkIcon className="w-3.5 h-3.5" />
                          Enlaces de Referencia ({assignment.links.length})
                        </p>
                        {assignment.links.length > 3 && (
                          <button
                            onClick={onToggleLinks}
                            className="ml-auto text-xs font-semibold text-primary hover:opacity-80 transition-all"
                          >
                            {showAllLinks ? 'Mostrar Menos' : `Mostrar ${assignment.links.length - 3} Más`}
                          </button>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        {displayedLinks.map((link, index) => (
                          <div key={index} className="p-3 bg-muted/30 rounded-xl border border-border">
                            <p className="text-xs font-medium text-foreground truncate">{link}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {assignment.attachments.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <p className="section-label flex items-center gap-1.5">
                          <Paperclip className="w-3.5 h-3.5" />
                          Adjuntos ({assignment.attachments.length})
                        </p>
                        {assignment.attachments.length > 3 && (
                          <button
                            onClick={onToggleAttachments}
                            className="ml-auto text-xs font-semibold text-primary hover:opacity-80 transition-all"
                          >
                            {showAllAttachments ? 'Mostrar Menos' : `Mostrar ${assignment.attachments.length - 3} Más`}
                          </button>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        {displayedAttachments.map((attachment, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-card rounded-xl border border-border hover:bg-muted/20 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <File className="w-4 h-4 text-primary flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-foreground truncate">{attachment.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  Subido: {formatDateRelative(attachment.createdAt)}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => onDownloadAttachment(attachment)}
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
                </div>
              </div>
);
