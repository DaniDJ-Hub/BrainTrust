import { AlertTriangle, ArrowRight, BookOpen } from "lucide-react"
import { EmptyState } from "@/components/common"
import { Skeleton } from "@/components/ui/skeleton"
import type { CourseUnitDTO } from "../api/student-courses"

interface UnitPickerProps {
  units: CourseUnitDTO[]
  isLoading: boolean
  error: Error | null
  onSelect: (unitId: string) => void
}

export function UnitPicker({ units, isLoading, error, onSelect }: UnitPickerProps) {
  if (isLoading) {
    return (
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Cargando unidades">
        {Array.from({ length: 3 }, (_, i) => (
          <li key={i} aria-hidden="true">
            <Skeleton className="h-44 rounded-surface" />
          </li>
        ))}
      </ul>
    )
  }

  if (error) {
    return (
      <div className="card-base">
        <EmptyState icon={AlertTriangle} tone="error" title="No pudimos cargar las unidades" description={error.message} />
      </div>
    )
  }

  if (units.length === 0) {
    return (
      <div className="card-base">
        <EmptyState icon={BookOpen} title="Aún no hay unidades" description="Todavía no hay unidades en este curso." />
      </div>
    )
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {units.map((unit) => (
        <li key={unit.id} className="flex">
          <article className="card-base flex w-full flex-col gap-4 p-5">
            <div className="space-y-1">
              <p className="text-overline uppercase text-muted-foreground">Unidad {unit.numUnity}</p>
              <h2 className="text-subheading text-foreground">{unit.name}</h2>
              {unit.description && <p className="line-clamp-2 text-body text-muted-foreground">{unit.description}</p>}
            </div>
            <button type="button" className="btn-secondary mt-auto w-full" onClick={() => onSelect(unit.id)}>
              Ver tareas y cuestionarios <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </article>
        </li>
      ))}
    </ul>
  )
}
