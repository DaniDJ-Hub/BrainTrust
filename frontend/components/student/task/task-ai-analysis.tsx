import React from 'react';
import { Brain, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Submission } from '@/app/shared/models/assignment.model';
import { formatDate } from './task-utils';

interface TaskAIAnalysisProps {
  aiResult: NonNullable<Submission['aiAnalysis']>;
}

const CONFIDENCE: Record<string, { label: string; className: string }> = {
  HIGH: { label: 'Alta', className: 'badge-destructive' },
  MEDIUM: { label: 'Media', className: 'badge-warning' },
  LOW: { label: 'Baja', className: 'badge-info' },
};

export const TaskAIAnalysis: React.FC<TaskAIAnalysisProps> = ({ aiResult }) => {
  const probability = parseFloat(aiResult.probability);
  const percentage = parseFloat(aiResult.percentage);
  const isLikelyAI = aiResult.isLikelyAI;
  const confidence = CONFIDENCE[aiResult.confidenceLevel] ?? CONFIDENCE.LOW;
  const barTone = percentage < 30 ? 'bg-success' : percentage < 70 ? 'bg-warning' : 'bg-destructive';

  return (
    <section aria-labelledby="task-ai-title" className="card-base overflow-hidden">
      <header className="flex flex-wrap items-center gap-2 border-b border-border px-5 py-4 sm:px-6">
        <span className="icon-badge"><Brain className="size-4" aria-hidden="true" /></span>
        <h2 id="task-ai-title" className="text-subheading text-foreground">Análisis de detección de IA</h2>
        <span className={isLikelyAI ? 'badge-destructive' : 'badge-success'}>
          {isLikelyAI ? 'Contenido de IA detectado' : 'Contenido humano'}
        </span>
      </header>

      <div className="space-y-5 px-5 py-5 sm:px-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="section-label">Probabilidad de IA</span>
            <span className="text-body font-semibold text-foreground tabular-nums">{percentage}%</span>
          </div>
          <div
            className="h-2 w-full rounded-full bg-muted"
            role="meter"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percentage}
            aria-label="Probabilidad de contenido generado por IA"
          >
            <div className={cn('h-2 rounded-full transition-[width]', barTone)} style={{ width: `${percentage}%` }} />
          </div>
          <div className="flex justify-between text-caption font-normal text-muted-foreground">
            <span>0% (humano)</span>
            <span>50%</span>
            <span>100% (IA)</span>
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-control border border-border bg-muted/50 px-4 py-3">
            <dt className="text-caption text-muted-foreground">Nivel de confianza</dt>
            <dd><span className={confidence.className}>{confidence.label}</span></dd>
          </div>
          <div className="flex items-center justify-between rounded-control border border-border bg-muted/50 px-4 py-3">
            <dt className="text-caption text-muted-foreground">Probabilidad</dt>
            <dd className="text-body font-semibold text-foreground tabular-nums">{probability.toFixed(4)}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-control border border-border bg-muted/50 px-4 py-3">
            <dt className="text-caption text-muted-foreground">Modelo</dt>
            <dd className="truncate text-body font-medium text-foreground">{aiResult.modelUsed}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-control border border-border bg-muted/50 px-4 py-3">
            <dt className="text-caption text-muted-foreground">Fecha</dt>
            <dd className="text-caption font-normal text-foreground">{formatDate(aiResult.analyzedAt)}</dd>
          </div>
        </dl>

        <p className="flex flex-wrap items-center gap-2 text-caption font-normal text-muted-foreground">
          ID de análisis:
          <code className="rounded-tag bg-muted px-2 py-0.5 font-mono text-foreground">{aiResult.analysisId}</code>
        </p>

        <div className="flex items-start gap-3 rounded-control border border-info/30 bg-info-soft p-4 text-info-soft-foreground">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <div className="space-y-2">
            <p className="text-body font-semibold">Cómo interpretar el resultado</p>
            <ul className="space-y-1 text-caption font-normal">
              <li><strong>0–30%:</strong> probablemente escrito por una persona</li>
              <li><strong>30–70%:</strong> origen mixto o incierto</li>
              <li><strong>70–100%:</strong> alta probabilidad de contenido generado por IA</li>
            </ul>
            <p className="text-caption font-normal">La detección de IA no es 100% precisa; úsala solo como referencia.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
