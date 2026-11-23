import { Award, CalendarCheck, CheckCircle2, TrendingUp } from "lucide-react"
import { StatCard } from "@/components/common"

export interface PerformanceLevel {
  label: string
  badge: string
}

export function getPerformanceLevel(pct: number): PerformanceLevel {
  if (pct >= 90) return { label: "Excelente", badge: "badge-success" }
  if (pct >= 80) return { label: "Bueno", badge: "badge-info" }
  if (pct >= 70) return { label: "Satisfactorio", badge: "badge-warning" }
  return { label: "Necesita mejorar", badge: "badge-destructive" }
}

interface GradeSummaryProps {
  grade: string
  maxPoints: number
  percentage: number
  performance: PerformanceLevel
  isLate: boolean
}

export function GradeSummary({ grade, maxPoints, percentage, performance, isLate }: GradeSummaryProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Tu puntaje" value={`${grade}/${maxPoints}`} icon={Award} tone="highlight" />
      <StatCard label="Porcentaje" value={`${percentage.toFixed(1)}%`} icon={TrendingUp} />
      <StatCard label="Rendimiento" value={<span className={performance.badge}>{performance.label}</span>} icon={CheckCircle2} />
      <StatCard
        label="Entrega"
        value={<span className={isLate ? "badge-warning" : "badge-success"}>{isLate ? "Fuera de plazo" : "A tiempo"}</span>}
        icon={CalendarCheck}
      />
    </div>
  )
}
