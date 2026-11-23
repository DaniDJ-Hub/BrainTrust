import React from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  CalendarClock,
  Download,
  File,
  FileText,
  Link as LinkIcon,
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
  <section aria-labelledby="task-summary-title" className="card-base overflow-hidden">
    <header className="flex items-center gap-2 border-b border-border px-5 py-4 sm:px-6">
      <span className="icon-badge"><BookOpen className="size-4" aria-hidden="true" /></span>
      <h2 id="task-summary-title" className="text-subheading text-foreground">Resumen de la tarea</h2>
    </header>
    <div className="space-y-5 px-5 py-5 sm:px-6">
      {assignment.description && (
        <div className="space-y-1.5">
          <h3 className="section-label">Descripción</h3>
          <p className="text-reading text-foreground max-w-prose">{assignment.description}</p>
        </div>
      )}

      <div className="space-y-1.5">
        <h3 className="section-label">Instrucciones</h3>
        <div className="rounded-control border border-border bg-muted/50 p-4">
          <p className="whitespace-pre-wrap text-reading text-foreground max-w-prose">{assignment.instructions}</p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-4 border-t border-border pt-5 lg:grid-cols-4">
        <div className="space-y-1">
          <dt className="flex items-center gap-1.5 text-caption text-muted-foreground">
            <Calendar className="size-3.5" aria-hidden="true" />Creada
          </dt>
          <dd className="text-body font-medium text-foreground">{formatDate(assignment.createdAt)}</dd>
          <dd className="text-caption font-normal text-muted-foreground">{formatDateRelative(assignment.createdAt)}</dd>
        </div>

        <div className="space-y-1">
          <dt className="flex items-center gap-1.5 text-caption text-muted-foreground">
            <CalendarClock className="size-3.5" aria-hidden="true" />Fecha límite
          </dt>
          {assignment.dueDate ? (
            <>
              <dd className="text-body font-medium text-foreground">{formatDate(assignment.dueDate)}</dd>
              {timeRemaining && (
                <dd className={timeRemaining.overdue ? 'text-caption text-destructive' : 'text-caption font-normal text-muted-foreground'}>
                  {timeRemaining.text}
                </dd>
              )}
            </>
          ) : (
            <dd className="text-body text-muted-foreground">Sin fecha límite</dd>
          )}
        </div>

        <div className="space-y-1">
          <dt className="flex items-center gap-1.5 text-caption text-muted-foreground">
            <Award className="size-3.5" aria-hidden="true" />Puntaje máx.
          </dt>
          <dd className="text-heading text-foreground tabular-nums">{assignment.maxScore.value} pts</dd>
          {assignment.maxScore.maxPoints && (
            <dd className="text-caption font-normal text-muted-foreground">de {assignment.maxScore.maxPoints}</dd>
          )}
        </div>

        <div className="space-y-1">
          <dt className="flex items-center gap-1.5 text-caption text-muted-foreground">
            {assignment.deliveryMode === 'TEAM' ? <Users className="size-3.5" aria-hidden="true" /> : <User className="size-3.5" aria-hidden="true" />}
            Modo de entrega
          </dt>
          <dd><span className="badge-primary">{assignment.deliveryMode === 'TEAM' ? 'Equipo' : 'Individual'}</span></dd>
        </div>
      </dl>
    </div>
  </section>
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

const isUrl = (value: string) => /^https?:\/\//i.test(value);

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
  <section aria-labelledby="task-resources-title" className="card-base overflow-hidden">
    <header className="flex items-center gap-2 border-b border-border px-5 py-4 sm:px-6">
      <span className="icon-badge"><FileText className="size-4" aria-hidden="true" /></span>
      <h2 id="task-resources-title" className="text-subheading text-foreground">Recursos de aprendizaje</h2>
    </header>
    <div className="space-y-5 px-5 py-5 sm:px-6">
      {assignment.links.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="section-label flex items-center gap-1.5">
              <LinkIcon className="size-3.5" aria-hidden="true" />
              Enlaces de referencia ({assignment.links.length})
            </h3>
            {assignment.links.length > 3 && (
              <button type="button" onClick={onToggleLinks} className="btn-quiet btn-sm ml-auto" aria-expanded={showAllLinks}>
                {showAllLinks ? 'Mostrar menos' : `Mostrar ${assignment.links.length - 3} más`}
              </button>
            )}
          </div>
          <ul className="space-y-1.5">
            {displayedLinks.map((link, index) => (
              <li key={index} className="rounded-control border border-border bg-muted/50 px-3 py-2.5">
                {isUrl(link) ? (
                  <a href={link} target="_blank" rel="noopener noreferrer" className="block truncate text-body font-medium text-primary underline-offset-4 hover:underline">
                    {link}
                  </a>
                ) : (
                  <p className="truncate text-body text-foreground">{link}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {assignment.attachments.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="section-label flex items-center gap-1.5">
              <Paperclip className="size-3.5" aria-hidden="true" />
              Adjuntos ({assignment.attachments.length})
            </h3>
            {assignment.attachments.length > 3 && (
              <button type="button" onClick={onToggleAttachments} className="btn-quiet btn-sm ml-auto" aria-expanded={showAllAttachments}>
                {showAllAttachments ? 'Mostrar menos' : `Mostrar ${assignment.attachments.length - 3} más`}
              </button>
            )}
          </div>
          <ul className="space-y-1.5">
            {displayedAttachments.map((attachment, index) => (
              <li key={index} className="flex items-center justify-between gap-3 rounded-control border border-border bg-card p-3">
                <div className="flex min-w-0 items-center gap-3">
                  <File className="size-4 shrink-0 text-primary" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="truncate text-body font-semibold text-foreground">{attachment.name}</p>
                    <p className="text-caption font-normal text-muted-foreground">Subido {formatDateRelative(attachment.createdAt)}</p>
                  </div>
                </div>
                <button type="button" onClick={() => onDownloadAttachment(attachment)} className="btn-secondary btn-sm shrink-0">
                  <Download className="size-4" aria-hidden="true" />
                  Descargar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </section>
);
