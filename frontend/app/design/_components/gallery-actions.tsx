import { Loader2, Plus, Trash2, Pencil, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShowcaseGroup, ShowcaseSection } from "./showcase-section"

const BUTTON_VARIANTS = ["default", "secondary", "outline", "ghost", "destructive", "link"] as const
const BUTTON_SIZES = ["sm", "default", "lg"] as const
const BADGE_VARIANTS = ["default", "secondary", "outline", "destructive"] as const

const UTILITY_BUTTONS = ["btn-primary", "btn-secondary", "btn-quiet", "btn-highlight", "btn-destructive"]
const UTILITY_BADGES = [
  { cls: "badge-success", label: "Entregado" },
  { cls: "badge-warning", label: "Tarde" },
  { cls: "badge-destructive", label: "Sin entregar" },
  { cls: "badge-info", label: "Calificado" },
  { cls: "badge-muted", label: "Borrador" },
  { cls: "badge-primary", label: "Obligatorio" },
  { cls: "badge-highlight", label: "Nuevo" },
]

export function GalleryActions() {
  return (
    <ShowcaseSection
      id="acciones"
      title="Botones y badges"
      description="Button de shadcn (sin modificar) y clases btn-* ya alineadas a los tokens. Pasa el cursor y usa Tab para revisar hover y foco."
    >
      <ShowcaseGroup label="Button (shadcn) · variantes × tamaños">
        <div className="space-y-3">
          {BUTTON_SIZES.map((size) => (
            <div key={size} className="flex flex-wrap items-center gap-3">
              <span className="w-16 text-xs text-muted-foreground font-mono">{size}</span>
              {BUTTON_VARIANTS.map((variant) => (
                <Button key={variant} variant={variant} size={size}>
                  {variant}
                </Button>
              ))}
            </div>
          ))}
        </div>
      </ShowcaseGroup>

      <div className="grid gap-4 lg:grid-cols-2">
        <ShowcaseGroup label="Button · estados">
          <div className="flex flex-wrap items-center gap-3">
            <Button>
              <Send /> Entregar tarea
            </Button>
            <Button disabled>Deshabilitado</Button>
            <Button disabled aria-busy="true">
              <Loader2 className="animate-spin" /> Guardando…
            </Button>
            <Button variant="outline" size="icon" aria-label="Editar">
              <Pencil />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Eliminar">
              <Trash2 />
            </Button>
          </div>
        </ShowcaseGroup>

        <ShowcaseGroup label="Clases utilitarias btn-* / icon-btn">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              {UTILITY_BUTTONS.map((cls) => (
                <button key={cls} type="button" className={cls}>
                  {cls}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" className="btn-primary btn-sm">btn-sm</button>
              <button type="button" className="btn-primary">40px</button>
              <button type="button" className="btn-primary btn-lg">btn-lg</button>
              <button type="button" className="btn-primary" disabled>Deshabilitado</button>
              <button type="button" className="btn-primary" aria-busy="true">
                <Loader2 className="h-4 w-4 animate-spin" /> Guardando…
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" className="icon-btn" aria-label="Agregar">
                <Plus className="h-4 w-4" />
              </button>
              <button type="button" className="icon-btn-primary" aria-label="Editar">
                <Pencil className="h-4 w-4" />
              </button>
              <button type="button" className="icon-btn-destructive" aria-label="Eliminar">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </ShowcaseGroup>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ShowcaseGroup label="Badge (shadcn)">
          <div className="flex flex-wrap gap-2">
            {BADGE_VARIANTS.map((variant) => (
              <Badge key={variant} variant={variant}>
                {variant}
              </Badge>
            ))}
          </div>
        </ShowcaseGroup>
        <ShowcaseGroup label="Clases badge-* · estados del LMS">
          <ul className="flex flex-wrap gap-3">
            {UTILITY_BADGES.map((b) => (
              <li key={b.cls} className="flex flex-col items-start gap-1">
                <span className={b.cls}>{b.label}</span>
                <span className="text-caption text-muted-foreground font-mono">{b.cls}</span>
              </li>
            ))}
          </ul>
        </ShowcaseGroup>
      </div>
    </ShowcaseSection>
  )
}
