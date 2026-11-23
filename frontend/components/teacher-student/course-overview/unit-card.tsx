import Image from "next/image"
import { ArrowRight, Eye, MoreVertical, Pencil, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { CourseUnitDTO } from "../../student/api/student-courses"

interface UnitCardProps {
  unidad: CourseUnitDTO
  isStudent: boolean
  onSelect: (unitId: string) => void
  onEdit: (unidad: CourseUnitDTO) => void
  onDelete: (unidad: CourseUnitDTO) => void
}

export function UnitCard({ unidad, isStudent, onSelect, onEdit, onDelete }: UnitCardProps) {
  return (
    <article className="card-base flex flex-col overflow-hidden">
      <div className="relative flex h-28 items-center justify-center bg-secondary">
        {unidad.urlImage && (
          <Image src={unidad.urlImage} alt="" fill className="object-cover opacity-20" sizes="(min-width: 1024px) 33vw, 100vw" />
        )}
        <span className="relative flex size-14 items-center justify-center rounded-full bg-primary text-heading font-bold text-primary-foreground tabular-nums">
          {unidad.numUnity}
        </span>

        {!isStudent && (
          <div className="absolute right-2 top-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="icon-btn bg-card/90" aria-label={`Opciones de ${unidad.name}`}>
                  <MoreVertical className="size-4" aria-hidden="true" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-surface">
                <DropdownMenuItem onSelect={() => onEdit(unidad)} className="gap-2 rounded-control">
                  <Pencil className="size-4" aria-hidden="true" /> Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => onDelete(unidad)}
                  className="gap-2 rounded-control text-destructive focus:bg-destructive-soft focus:text-destructive-soft-foreground"
                >
                  <Trash2 className="size-4" aria-hidden="true" /> Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-1">
          <p className="text-overline uppercase text-muted-foreground">Unidad {unidad.numUnity}</p>
          <h3 className="text-subheading text-foreground">{unidad.name}</h3>
          {unidad.description && <p className="line-clamp-3 text-body text-muted-foreground">{unidad.description}</p>}
        </div>
        <button type="button" className="btn-primary mt-auto w-full" onClick={() => onSelect(unidad.id)}>
          {isStudent ? (
            <>
              <Eye className="size-4" aria-hidden="true" /> Ver unidad
            </>
          ) : (
            <>
              Entrar a la unidad <ArrowRight className="size-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </article>
  )
}
