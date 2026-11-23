import React from 'react';
import { BarChart3, CheckCircle, Clock } from "lucide-react";
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

export const TaskSidebar: React.FC<TaskSidebarProps> = ({
  assignment,
  existingSubmission,
  timeRemaining,
  isSubmitted,
  isGraded,
  isLate,
  hasAIResult,
}) => (
          <div className="space-y-4">

            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-3.5 h-3.5 text-primary" />
                  </span>
                  <h3 className="text-sm font-bold text-foreground">Estadísticas de la Tarea</h3>
                </div>
              </div>
              <div className="px-4 py-4 space-y-3">
                {[
                  {
                    label: 'Estado',
                    value: (
                      <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                        isGraded    ? 'bg-primary/10 text-primary' :
                        isLate      ? 'bg-destructive/10 text-destructive' :
                        isSubmitted ? 'bg-muted text-muted-foreground' :
                        'border border-border text-muted-foreground'
                      }`}>
                        {isGraded ? 'Calificado' : isLate ? 'Enviado Tarde' : isSubmitted ? 'Enviado' : 'No Enviado'}
                      </span>
                    )
                  },
                  {
                    label: 'Modo de Entrega',
                    value: <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-semibold">{assignment.deliveryMode === 'TEAM' ? 'Equipo' : 'Individual'}</span>
                  },
                  {
                    label: 'Puntos Máx.',
                    value: <span className="text-sm font-bold text-foreground">{assignment.maxScore.value}</span>
                  },
                  {
                    label: 'Envíos Tardíos',
                    value: <span className={`text-xs font-semibold ${assignment.allowLateSubmissions ? 'text-primary' : 'text-destructive'}`}>
                      {assignment.allowLateSubmissions ? 'Permitidos' : 'No Permitidos'}
                    </span>
                  },
                  {
                    label: 'Creada',
                    value: <span className="text-xs text-muted-foreground">{formatDateRelative(assignment.createdAt)}</span>
                  },
                  ...(assignment.dueDate ? [{
                    label: 'Fecha Límite',
                    value: <span className="text-xs text-muted-foreground">{formatDateRelative(assignment.dueDate)}</span>
                  }] : []),
                  ...(hasAIResult ? [{
                    label: 'Análisis de IA',
                    value: (
                      <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                        existingSubmission?.aiAnalysis?.isLikelyAI
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-primary/10 text-primary'
                      }`}>
                        {existingSubmission?.aiAnalysis?.isLikelyAI ? 'Detectado' : 'Limpio'}
                      </span>
                    )
                  }] : []),
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground flex-shrink-0">{label}</span>
                    {value}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-3.5 h-3.5 text-primary" />
                  </span>
                  <h3 className="text-sm font-bold text-foreground">Pautas</h3>
                </div>
              </div>
              <ul className="px-4 py-4 space-y-2.5">
                {[
                  'Asegura la originalidad y citas adecuadas',
                  'Verifica los formatos de archivo antes de subir',
                  'Revisa el envío antes de enviarlo',
                  'Los envíos tardíos pueden ser penalizados',
                  'El contenido generado por IA puede ser detectado',
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {assignment.dueDate && (
              <div className={`bg-card rounded-2xl border-l-4 border-t border-r border-b border-border shadow-sm overflow-hidden ${
                timeRemaining?.overdue                              ? 'border-l-destructive' :
                timeRemaining?.text.includes('d')                  ? 'border-l-highlight'      :
                'border-l-primary'
              }`}>
                <div className="px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                    </span>
                    <h3 className="text-sm font-bold text-foreground">Tiempo Restante</h3>
                  </div>
                </div>
                <div className="px-4 py-4 text-center space-y-1">
                  <p className={`text-2xl font-bold ${timeRemaining?.overdue ? 'text-destructive' : 'text-foreground'}`}>
                    {timeRemaining?.text || 'Sin fecha límite'}
                  </p>
                  <p className="text-xs text-muted-foreground">Fecha límite: {formatDate(assignment.dueDate)}</p>
                  {timeRemaining?.overdue && (
                    <p className="text-xs font-semibold text-destructive">¡Esta tarea está retrasada!</p>
                  )}
                </div>
              </div>
            )}

          </div>
);
