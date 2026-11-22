import { ShowcaseGroup, ShowcaseSection } from "./showcase-section"

const TYPE_SCALE = [
  { className: "text-kpi tabular-nums", label: "text-kpi · 30/36 · 700", sample: "128" },
  { className: "text-title", label: "text-title · 24/32 · 600", sample: "Calificaciones de la unidad 3" },
  { className: "text-heading", label: "text-heading · 18/28 · 600", sample: "Entregas pendientes" },
  { className: "text-subheading", label: "text-subheading · 16/24 · 600", sample: "Ensayo de la unidad 2" },
  { className: "text-reading", label: "text-reading · 16/24", sample: "Lee el capítulo 4 y responde las preguntas." },
  { className: "text-body", label: "text-body · 14/20", sample: "Entregado el 12 mar a las 18:40" },
  { className: "text-caption", label: "text-caption · 12/16 · 500", sample: "Última edición hace 2 h" },
  { className: "text-overline uppercase", label: "text-overline · 12/16 · +6%", sample: "Actividades" },
]

const WEIGHTS = [
  { className: "font-normal", label: "400 normal" },
  { className: "font-medium", label: "500 medium" },
  { className: "font-semibold", label: "600 semibold" },
  { className: "font-bold", label: "700 bold" },
]

const RADII = [
  { className: "rounded-tag", label: "rounded-tag · 6" },
  { className: "rounded-control", label: "rounded-control · 10" },
  { className: "rounded-surface", label: "rounded-surface · 16" },
  { className: "rounded-full", label: "rounded-full" },
]

const SHADOWS = [
  { className: "shadow-xs", label: "shadow-xs · card" },
  { className: "shadow-sm", label: "shadow-sm · hover" },
  { className: "shadow-md", label: "shadow-md · menú" },
  { className: "shadow-lg", label: "shadow-lg · modal" },
]

const SPACING = [1, 2, 3, 4, 5, 6, 8, 10, 12]

export function FoundationTokens() {
  return (
    <>
      <ShowcaseSection
        id="tipografia"
        title="Tipografía"
        description="Inter (next/font, servida desde el propio dominio). Escala semántica: nada pasa de 24px salvo los KPIs."
      >
        <ShowcaseGroup label="Escala semántica">
          <ul className="space-y-3">
            {TYPE_SCALE.map((item) => (
              <li key={item.label} className="flex flex-col gap-1 border-b border-border pb-3 last:border-0 sm:flex-row sm:items-baseline sm:gap-4">
                <span className="w-52 shrink-0 text-caption text-muted-foreground font-mono">{item.label}</span>
                <span className={`${item.className} text-foreground truncate`}>{item.sample}</span>
              </li>
            ))}
          </ul>
        </ShowcaseGroup>

        <div className="grid gap-4 md:grid-cols-2">
          <ShowcaseGroup label="Pesos">
            <ul className="space-y-2">
              {WEIGHTS.map((w) => (
                <li key={w.label} className={`${w.className} text-base text-foreground`}>
                  {w.label} — Entregar tarea
                </li>
              ))}
            </ul>
          </ShowcaseGroup>
          <ShowcaseGroup label="Cuerpo y números">
            <p className="text-base leading-6 text-foreground max-w-prose">
              El cuerpo de lectura va a 16/24 con un ancho máximo de ~70 caracteres. Así se leen
              cómodamente los enunciados de quiz y las páginas de contenido.
            </p>
            <p className="text-sm text-muted-foreground">
              Números tabulares: <span className="tabular-nums font-semibold text-foreground">98.50 · 100.00 · 7.25</span>
            </p>
            <p className="section-label">Label de sección (overline)</p>
          </ShowcaseGroup>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="forma"
        title="Espaciado, radios y sombras"
        description="Retícula de 4px. Tres radios semánticos (los rounded-* heredados se acercan a ellos). Sombras teñidas de navy; en oscuro la elevación sale de la superficie."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <ShowcaseGroup label="Espaciado (múltiplos de 4px)">
            <ul className="space-y-2">
              {SPACING.map((step) => (
                <li key={step} className="flex items-center gap-3">
                  <span className="w-14 text-caption text-muted-foreground font-mono">{step * 4}px</span>
                  <span className="h-3 rounded-tag bg-primary" style={{ width: `${step * 4}px` }} aria-hidden="true" />
                </li>
              ))}
            </ul>
          </ShowcaseGroup>
          <ShowcaseGroup label="Radios">
            <ul className="grid grid-cols-2 gap-3">
              {RADII.map((r) => (
                <li key={r.label} className="space-y-1.5">
                  <div className={`h-12 border-2 border-primary/40 bg-muted ${r.className}`} aria-hidden="true" />
                  <p className="text-caption text-muted-foreground font-mono">{r.label}</p>
                </li>
              ))}
            </ul>
          </ShowcaseGroup>
          <ShowcaseGroup label="Sombras">
            <ul className="grid grid-cols-2 gap-4">
              {SHADOWS.map((s) => (
                <li key={s.label} className="space-y-1.5">
                  <div className={`h-12 rounded-control bg-card border border-border ${s.className}`} aria-hidden="true" />
                  <p className="text-caption text-muted-foreground font-mono">{s.label}</p>
                </li>
              ))}
            </ul>
          </ShowcaseGroup>
        </div>
      </ShowcaseSection>
    </>
  )
}
