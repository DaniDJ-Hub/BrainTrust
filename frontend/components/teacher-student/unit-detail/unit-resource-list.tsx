import { CalendarX, Layers, Plus } from "lucide-react"
import type { UnitResource } from "@/app/domain/entities/CourseEntities"
import { EmptyState } from "@/components/common"
import { Skeleton } from "@/components/ui/skeleton"
import { ResourceCard } from "./resource-card"
import { obtenerTipoRecurso } from "./unit-resource-utils"

interface UnitResourceListProps {
  recursos: UnitResource[]
  isStudent: boolean
  availabilityError: string | null
  onAdd: () => void
  onStart: (recurso: UnitResource) => void
  onView: (recurso: UnitResource) => void
  onDelete: (recurso: UnitResource) => void
}

export function UnitResourceList({ recursos, isStudent, availabilityError, onAdd, onStart, onView, onDelete }: UnitResourceListProps) {
  return (
    <>
      {availabilityError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-control border border-destructive/30 bg-destructive-soft p-4 text-body text-destructive-soft-foreground"
        >
          <CalendarX className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>{availabilityError}</p>
        </div>
      )}

      <section aria-labelledby="recursos-unidad" className="space-y-3">
        <h2 id="recursos-unidad" className="flex items-center gap-2 text-heading text-foreground">
          <Layers className="size-5 text-primary" aria-hidden="true" />
          Recursos
          <span className="badge-muted">{recursos.length}</span>
        </h2>

        {recursos.length === 0 ? (
          <div className="card-base">
            <EmptyState
              icon={Layers}
              title={isStudent ? "Aún no hay recursos disponibles" : "Aún no hay recursos"}
              description={isStudent ? "Tu profesor todavía no ha publicado recursos en esta unidad." : "Agrega una tarea, un quiz o una página."}
              action={
                !isStudent && (
                  <button type="button" onClick={onAdd} className="btn-primary">
                    <Plus className="size-4" aria-hidden="true" /> Agregar tu primer recurso
                  </button>
                )
              }
            />
          </div>
        ) : (
          <ul className="space-y-3">
            {recursos.map((recurso) => (
              <li key={`${obtenerTipoRecurso(recurso)}-${recurso.id}`}>
                <ResourceCard recurso={recurso} isStudent={isStudent} onStart={onStart} onView={onView} onDelete={onDelete} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}

export function UnitDetailSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Cargando recursos de la unidad">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-10 w-2/3" />
      {Array.from({ length: 3 }, (_, i) => (
        <Skeleton key={i} className="h-28 w-full rounded-surface" />
      ))}
    </div>
  )
}
