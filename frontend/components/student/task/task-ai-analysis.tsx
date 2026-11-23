import React from 'react';
import { AlertTriangle, Brain, Info } from "lucide-react";
import { Submission } from '@/app/shared/models/assignment.model';
import { formatDate } from './task-utils';

interface TaskAIAnalysisProps {
  aiResult: NonNullable<Submission['aiAnalysis']>;
}

export const TaskAIAnalysis: React.FC<TaskAIAnalysisProps> = ({ aiResult }) => {
  const probability = parseFloat(aiResult.probability);
  const percentage = parseFloat(aiResult.percentage);
  const isLikelyAI = aiResult.isLikelyAI;

  return (
  <div className={`bg-card rounded-2xl border-l-4 border-t border-r border-b border-border shadow-sm overflow-hidden ${
    isLikelyAI ? 'border-l-destructive' : 'border-l-primary'
  }`}>

    <div className="px-5 py-4 sm:px-6 border-b border-border">
      <div className="flex flex-wrap items-center gap-2">
        <span className="w-8 h-8 rounded-xl flex items-center justify-center bg-primary/10 flex-shrink-0">
          <Brain className="w-4 h-4 text-primary" />
        </span>
        <h3 className="text-base font-bold text-foreground tracking-tight">
          Análisis de Detección de IA
        </h3>
        <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
          isLikelyAI
            ? 'bg-destructive/10 text-destructive'
            : 'bg-primary/10 text-primary'
        }`}>
          {isLikelyAI ? 'Contenido de IA Detectado' : 'Contenido Humano'}
        </span>
      </div>
    </div>

    <div className="px-5 py-5 sm:px-6 space-y-5">

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="section-label">
            Puntaje de Probabilidad de IA
          </span>
          <span className="text-sm font-bold text-foreground tabular-nums">{percentage}%</span>
        </div>
        <div className="w-full bg-muted/50 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              percentage < 30 ? 'bg-primary' :
              percentage < 70 ? 'bg-highlight'  :
              'bg-destructive'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0% (Humano)</span>
          <span>50%</span>
          <span>100% (IA)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        <div className="flex items-center justify-between bg-muted/30 rounded-xl px-4 py-3 border border-border">
          <span className="text-xs font-semibold text-muted-foreground">Nivel de Confianza</span>
          <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
            aiResult.confidenceLevel === 'HIGH'   ? 'bg-destructive/10 text-destructive' :
            aiResult.confidenceLevel === 'MEDIUM' ? 'bg-highlight/20 text-highlight-foreground' :
            'bg-primary/10 text-primary'
          }`}>
            {aiResult.confidenceLevel === 'HIGH' ? 'ALTO' : aiResult.confidenceLevel === 'MEDIUM' ? 'MEDIO' : 'BAJO'}
          </span>
        </div>

        <div className="flex items-center justify-between bg-muted/30 rounded-xl px-4 py-3 border border-border">
          <span className="text-xs font-semibold text-muted-foreground">Probabilidad</span>
          <span className="text-sm font-bold text-foreground tabular-nums">
            {probability.toFixed(4)}
          </span>
        </div>

        <div className="flex items-center justify-between bg-muted/30 rounded-xl px-4 py-3 border border-border">
          <span className="text-xs font-semibold text-muted-foreground">Modelo de Detección</span>
          <span className="text-sm font-semibold text-foreground">{aiResult.modelUsed}</span>
        </div>

        <div className="flex items-center justify-between bg-muted/30 rounded-xl px-4 py-3 border border-border">
          <span className="text-xs font-semibold text-muted-foreground">Fecha de Análisis</span>
          <span className="text-xs text-foreground">{formatDate(aiResult.analyzedAt)}</span>
        </div>

      </div>

      <div className="flex items-center gap-2 bg-muted/30 rounded-xl px-4 py-3 border border-border">
        <Info className="w-4 h-4 text-primary flex-shrink-0" />
        <span className="text-xs font-semibold text-muted-foreground">ID de Análisis:</span>
        <code className="text-xs bg-muted px-2 py-0.5 rounded-md text-foreground font-mono">
          {aiResult.analysisId}
        </code>
      </div>

      <div className="p-4 rounded-2xl bg-highlight/10 border border-highlight/30">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-highlight-foreground flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">
              Cómo interpretar los resultados de detección de IA
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li><span className="font-semibold text-foreground">0–30%:</span> Contenido probablemente escrito por humanos</li>
              <li><span className="font-semibold text-foreground">30–70%:</span> Origen mixto o incierto</li>
              <li><span className="font-semibold text-foreground">70–100%:</span> Alta probabilidad de contenido generado por IA</li>
            </ul>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Nota: Las herramientas de detección de IA no son 100% precisas y deben usarse solo como referencia.
            </p>
          </div>
        </div>
      </div>

    </div>
  </div>
  );
};
