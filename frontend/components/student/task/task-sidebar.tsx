import React from 'react';
import { BarChart3, Clock, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/common";
import { Assignment } from '@/app/domain/entities';
import { Submission } from '@/app/shared/models/assignment.model';
import { formatDate, formatDateRelative, type TimeRemaining } from './task-utils';

interface TaskSidebarProps {
  assignment: Assignment;
  existingSubmission?: Submission;
  timeRemaining: TimeRemaining | null;
  isSubmitted: boolean;
  isGraded: boolean;
  isLate: boolean;
  hasAIResult: boolean;
}

const PAUTAS = [
  'Asegura la originalidad y cita tus fuentes',
  'Verifica los formatos de archivo antes de subirlos',
  'Revisa tu entrega antes de enviarla',
  'Las entregas tardías pueden penalizarse',
  'El contenido generado por IA puede detectarse',
];

export const TaskSidebar: React.FC<TaskSidebarProps> = ({
  assignment,
  existingSubmission,
  timeRemaining,
  isSubmitted,
  hasAIResult,
}) => {
  const estado = existingSubmission?.status ?? (isSubmitted ? 'SUBMITTED' : timeRemaining?.overdue ? 'MISSING' : 'PENDING');
  const urgencia = timeRemaining?.overdue ? 'overdue' : timeRemaining && !timeRemaining.text.includes('d') ? 'soon' : 'normal';

  return (
    <aside className="space-y-4" aria-label="Información de la tarea">
      <section aria-labelledby="task-stats-title" className="card-base overflow-hidden">
        <header className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span className="icon-badge"><BarChart3 className="size-4" aria-hidden="true" /></span>
          <h2 id="task-stats-title" className="text-body font-semibold text-foreground">Detalles</h2>
        </header>
        <dl className="space-y-3 px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <dt className="text-caption font-normal text-muted-foreground">Estado</dt>
            <dd><StatusBadge kind="submission" status={estado} /></dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="text-caption font-normal text-muted-foreground">Modo de entrega</dt>
            <dd><span className="badge-primary">{assignment.deliveryMode === 'TEAM' ? 'Equipo' : 'Individual'}</span></dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="text-caption font-normal text-muted-foreground">Puntos máx.</dt>
            <dd className="text-body font-semibold text-foreground tabular-nums">{assignment.maxScore.value}</dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="text-caption font-normal text-muted-foreground">Entregas tardías</dt>
            <dd>
              <span className={assignment.allowLateSubmissions ? 'badge-success' : 'badge-destructive'}>
                {assignment.allowLateSubmissions ? 'Permitidas' : 'No permitidas'}
              </span>
            </dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="text-caption font-normal text-muted-foreground">Creada</dt>
            <dd className="text-caption font-normal text-foreground">{formatDateRelative(assignment.createdAt)}</dd>
          </div>
          {assignment.dueDate && (
            <div className="flex items-center justify-between gap-2">
              <dt className="text-caption font-normal text-muted-foreground">Fecha límite</dt>
              <dd className="text-caption font-normal text-foreground">{formatDateRelative(assignment.dueDate)}</dd>
            </div>
          )}
          {hasAIResult && (
            <div className="flex items-center justify-between gap-2">
              <dt className="text-caption font-normal text-muted-foreground">Análisis de IA</dt>
              <dd>
                <span className={existingSubmission?.aiAnalysis?.isLikelyAI ? 'badge-destructive' : 'badge-success'}>
                  {existingSubmission?.aiAnalysis?.isLikelyAI ? 'Detectado' : 'Sin indicios'}
                </span>
              </dd>
            </div>
          )}
        </dl>
      </section>

      {assignment.dueDate && (
        <section
          aria-labelledby="task-time-title"
          className={cn(
            'card-base overflow-hidden border-l-4',
            urgencia === 'overdue' ? 'border-l-destructive' : urgencia === 'soon' ? 'border-l-warning' : 'border-l-primary',
          )}
        >
          <header className="flex items-center gap-2 border-b border-border px-4 py-3">
            <span className="icon-badge"><Clock className="size-4" aria-hidden="true" /></span>
            <h2 id="task-time-title" className="text-body font-semibold text-foreground">Tiempo restante</h2>
          </header>
          <div className="space-y-1 px-4 py-4 text-center">
            <p className={cn('text-title tabular-nums', timeRemaining?.overdue ? 'text-destructive' : 'text-foreground')}>
              {timeRemaining?.text || 'Sin fecha límite'}
            </p>
            <p className="text-caption font-normal text-muted-foreground">Fecha límite: {formatDate(assignment.dueDate)}</p>
            {timeRemaining?.overdue && <p className="text-caption text-destructive">Esta tarea está fuera de plazo.</p>}
          </div>
        </section>
      )}

      <section aria-labelledby="task-tips-title" className="card-base overflow-hidden">
        <header className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span className="icon-badge"><ListChecks className="size-4" aria-hidden="true" /></span>
          <h2 id="task-tips-title" className="text-body font-semibold text-foreground">Pautas</h2>
        </header>
        <ul className="space-y-2.5 px-4 py-4">
          {PAUTAS.map((tip) => (
            <li key={tip} className="flex items-start gap-2 text-caption font-normal text-muted-foreground">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              {tip}
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
};
