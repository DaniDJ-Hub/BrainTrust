import { AlertOctagon, BookOpen, ClipboardCheck, Clock, Plus, RefreshCw, Users } from "lucide-react"
import { EmptyState, PageHeader, STATUS_MAP, StatCard, StatusBadge, type StatusKind } from "@/components/common"
import { ShowcaseGroup, ShowcaseSection } from "./showcase-section"

const KIND_LABEL: Record<StatusKind, string> = {
  submission: "Entregas (submission)",
  course: "Cursos (course)",
  user: "Usuarios (user)",
  enrollment: "Inscripciones (enrollment)",
  analysis: "Análisis IA (analysis)",
}

const KINDS = Object.keys(STATUS_MAP) as StatusKind[]

export function GalleryCommonDisplay() {
  return (
    <ShowcaseSection
      id="common-display"
      title="Componentes base · presentación"
      description="components/common: PageHeader, StatusBadge, StatCard y EmptyState. Aún no se usan en las pantallas."
    >
      <ShowcaseGroup label="PageHeader · con ruta, eyebrow y acciones">
        <PageHeader
          eyebrow="Programación Web · Grupo A"
          title="Entregas de la unidad 2"
          description="Revisa y califica las entregas. Las tardías se marcan automáticamente."
          breadcrumbs={[
            { label: "Cursos", href: "/courses" },
            { label: "Programación Web", href: "/courses" },
            { label: "Entregas" },
          ]}
          actions={
            <>
              <button type="button" className="btn-secondary">Exportar</button>
              <button type="button" className="btn-primary">
                <Plus className="size-4" aria-hidden="true" /> Nueva tarea
              </button>
            </>
          }
        />
      </ShowcaseGroup>

      <ShowcaseGroup label="PageHeader · mínimo">
        <PageHeader title="Calendario" description="Tus próximas entregas y evaluaciones." />
      </ShowcaseGroup>

      <ShowcaseGroup label="StatusBadge · mapeo único (mismo tono = mismo significado en toda la app)">
        <div className="space-y-4">
          {KINDS.map((kind) => (
            <div key={kind} className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <span className="w-52 shrink-0 text-caption text-muted-foreground font-mono">{KIND_LABEL[kind]}</span>
              <ul className="flex flex-wrap gap-2">
                {Object.keys(STATUS_MAP[kind]).map((status) => (
                  <li key={status} className="flex flex-col items-start gap-0.5">
                    <StatusBadge kind={kind} status={status} />
                    <span className="text-caption font-normal text-muted-foreground font-mono">{status}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-center">
            <span className="w-52 shrink-0 text-caption text-muted-foreground font-mono">Valor inesperado de la API</span>
            <StatusBadge kind="submission" status="IN_REVIEW" />
          </div>
        </div>
      </ShowcaseGroup>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Alumnos inscritos"
          value="128"
          icon={Users}
          trend={{ value: "+12", direction: "up", label: "vs. semestre pasado" }}
        />
        <StatCard
          label="Entregas tardías"
          value="9"
          icon={Clock}
          trend={{ value: "+3", direction: "up", upIsGood: false, label: "esta semana" }}
        />
        <StatCard
          label="Promedio del grupo"
          value="87.4"
          icon={ClipboardCheck}
          tone="highlight"
          description="Máximo uno destacado por vista"
        />
        <StatCard label="Cargando…" value="0" icon={BookOpen} isLoading />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ShowcaseGroup label="EmptyState · vacío">
          <EmptyState
            icon={BookOpen}
            title="Aún no hay tareas"
            description="Crea la primera tarea de la unidad para que tus alumnos puedan entregar."
            action={
              <button type="button" className="btn-primary">
                <Plus className="size-4" aria-hidden="true" /> Crear tarea
              </button>
            }
          />
        </ShowcaseGroup>
        <ShowcaseGroup label="EmptyState · error de carga">
          <EmptyState
            icon={AlertOctagon}
            tone="error"
            title="No pudimos cargar las entregas"
            description="Revisa tu conexión e inténtalo de nuevo."
            action={
              <button type="button" className="btn-secondary">
                <RefreshCw className="size-4" aria-hidden="true" /> Reintentar
              </button>
            }
          />
        </ShowcaseGroup>
        <ShowcaseGroup label="EmptyState · compacto (dentro de cards)">
          <EmptyState icon={ClipboardCheck} size="compact" title="Sin pendientes" description="Estás al día." />
        </ShowcaseGroup>
      </div>
    </ShowcaseSection>
  )
}
