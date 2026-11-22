import { ShowcaseGroup, ShowcaseSection } from "./showcase-section"

const TYPE_SCALE = [
  { className: "text-4xl", label: "text-4xl · 36px" },
  { className: "text-3xl", label: "text-3xl · 30px" },
  { className: "text-2xl", label: "text-2xl · 24px" },
  { className: "text-xl", label: "text-xl · 20px" },
  { className: "text-lg", label: "text-lg · 18px" },
  { className: "text-base", label: "text-base · 16px" },
  { className: "text-sm", label: "text-sm · 14px" },
  { className: "text-xs", label: "text-xs · 12px" },
]

const WEIGHTS = [
  { className: "font-normal", label: "400 normal" },
  { className: "font-medium", label: "500 medium" },
  { className: "font-semibold", label: "600 semibold" },
  { className: "font-bold", label: "700 bold" },
]

const RADII = ["rounded-sm", "rounded-md", "rounded-lg", "rounded-xl", "rounded-2xl", "rounded-3xl", "rounded-full"]

const SHADOWS = ["shadow-sm", "shadow-md", "shadow-lg", "shadow-xl", "shadow-2xl"]

const SPACING = [1, 2, 3, 4, 5, 6, 8, 10, 12]

export function FoundationTokens() {
  return (
    <>
      <ShowcaseSection
        id="tipografia"
        title="Tipografía"
        description="Inter (next/font, servida desde el propio dominio). Escala Tailwind en uso actualmente."
      >
        <ShowcaseGroup label="Escala">
          <ul className="space-y-3">
            {TYPE_SCALE.map((item) => (
              <li key={item.label} className="flex items-baseline gap-4 border-b border-border pb-3 last:border-0">
                <span className="w-32 shrink-0 text-xs text-muted-foreground font-mono">{item.label}</span>
                <span className={`${item.className} font-semibold text-foreground tracking-tight truncate`}>
                  Calificaciones de la unidad 3
                </span>
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

      <ShowcaseSection id="forma" title="Espaciado, radios y sombras" description="Valores disponibles hoy (antes de la Fase 1).">
        <div className="grid gap-4 lg:grid-cols-3">
          <ShowcaseGroup label="Espaciado (múltiplos de 4px)">
            <ul className="space-y-2">
              {SPACING.map((step) => (
                <li key={step} className="flex items-center gap-3">
                  <span className="w-14 text-xs text-muted-foreground font-mono">{step * 4}px</span>
                  <span className="h-3 rounded-sm bg-primary" style={{ width: `${step * 4}px` }} aria-hidden="true" />
                </li>
              ))}
            </ul>
          </ShowcaseGroup>
          <ShowcaseGroup label="Radios">
            <ul className="grid grid-cols-3 gap-3">
              {RADII.map((r) => (
                <li key={r} className="space-y-1.5">
                  <div className={`h-12 border-2 border-primary/40 bg-muted ${r}`} aria-hidden="true" />
                  <p className="text-xs text-muted-foreground font-mono">{r}</p>
                </li>
              ))}
            </ul>
          </ShowcaseGroup>
          <ShowcaseGroup label="Sombras">
            <ul className="grid grid-cols-2 gap-4">
              {SHADOWS.map((s) => (
                <li key={s} className="space-y-1.5">
                  <div className={`h-12 rounded-xl bg-card border border-border ${s}`} aria-hidden="true" />
                  <p className="text-xs text-muted-foreground font-mono">{s}</p>
                </li>
              ))}
            </ul>
          </ShowcaseGroup>
        </div>
      </ShowcaseSection>
    </>
  )
}
