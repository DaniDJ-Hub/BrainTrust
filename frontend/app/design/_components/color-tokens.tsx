"use client"

import { cn } from "@/lib/utils"
import { ShowcaseGroup, ShowcaseSection } from "./showcase-section"
import { useTokenContrast, type ContrastPair } from "./use-token-contrast"

interface SwatchGroup {
  label: string
  tokens: string[]
}

const SWATCH_GROUPS: SwatchGroup[] = [
  { label: "Superficies (60%)", tokens: ["--background", "--card", "--popover", "--muted", "--accent"] },
  { label: "Texto", tokens: ["--foreground", "--muted-foreground", "--secondary-foreground"] },
  { label: "Marca navy (30%)", tokens: ["--primary", "--primary-hover", "--primary-active", "--secondary", "--ring"] },
  { label: "Highlight dorado (10%)", tokens: ["--highlight", "--highlight-foreground", "--highlight-soft", "--highlight-soft-foreground"] },
  { label: "Semánticos sólidos", tokens: ["--success", "--warning", "--info", "--destructive"] },
  { label: "Semánticos suaves", tokens: ["--success-soft", "--warning-soft", "--info-soft", "--destructive-soft"] },
  { label: "Bordes", tokens: ["--border", "--border-strong", "--input"] },
  { label: "Sidebar", tokens: ["--sidebar", "--sidebar-foreground", "--sidebar-primary", "--sidebar-primary-foreground", "--sidebar-accent", "--sidebar-border"] },
  { label: "Gráficas", tokens: ["--chart-1", "--chart-2", "--chart-3", "--chart-4", "--chart-5"] },
]

const SCALE_STEPS = [100, 200, 300, 400, 500, 600, 700, 800, 900]
const SCALES = ["neutral", "navy", "gold"]

interface ContrastCheck extends ContrastPair {
  label: string
  min: number
}

const CONTRAST_CHECKS: ContrastCheck[] = [
  { label: "Texto principal", fg: "--foreground", bg: "--background", min: 4.5 },
  { label: "Texto en card", fg: "--card-foreground", bg: "--card", min: 4.5 },
  { label: "Texto secundario en card", fg: "--muted-foreground", bg: "--card", min: 4.5 },
  { label: "Texto secundario en muted", fg: "--muted-foreground", bg: "--muted", min: 4.5 },
  { label: "Botón primario", fg: "--primary-foreground", bg: "--primary", min: 4.5 },
  { label: "Botón primario (hover)", fg: "--primary-foreground", bg: "--primary-hover", min: 4.5 },
  { label: "Hover neutro (accent)", fg: "--accent-foreground", bg: "--accent", min: 4.5 },
  { label: "Botón highlight", fg: "--highlight-foreground", bg: "--highlight", min: 4.5 },
  { label: "Badge highlight", fg: "--highlight-soft-foreground", bg: "--highlight-soft", min: 4.5 },
  { label: "Botón destructivo", fg: "--destructive-foreground", bg: "--destructive", min: 4.5 },
  { label: "Texto destructivo en card", fg: "--destructive", bg: "--card", min: 4.5 },
  { label: "Texto éxito en card", fg: "--success", bg: "--card", min: 4.5 },
  { label: "Texto aviso en card", fg: "--warning", bg: "--card", min: 4.5 },
  { label: "Texto info en card", fg: "--info", bg: "--card", min: 4.5 },
  { label: "Badge éxito", fg: "--success-soft-foreground", bg: "--success-soft", min: 4.5 },
  { label: "Badge aviso", fg: "--warning-soft-foreground", bg: "--warning-soft", min: 4.5 },
  { label: "Badge info", fg: "--info-soft-foreground", bg: "--info-soft", min: 4.5 },
  { label: "Badge error", fg: "--destructive-soft-foreground", bg: "--destructive-soft", min: 4.5 },
  { label: "Anillo de foco sobre card", fg: "--ring", bg: "--card", min: 3 },
  { label: "Borde de input sobre card", fg: "--input", bg: "--card", min: 3 },
  { label: "Sidebar: texto", fg: "--sidebar-foreground", bg: "--sidebar", min: 4.5 },
  { label: "Sidebar: ítem activo", fg: "--sidebar-primary-foreground", bg: "--sidebar-primary", min: 4.5 },
]

const ALL_TOKENS = Array.from(
  new Set([...SWATCH_GROUPS.flatMap((g) => g.tokens), ...CONTRAST_CHECKS.flatMap((c) => [c.fg, c.bg])]),
)

interface ColorTokensProps {
  themeKey: string | undefined
}

export function ColorTokens({ themeKey }: ColorTokensProps) {
  const { hex, ratio } = useTokenContrast(ALL_TOKENS, themeKey)

  return (
    <ShowcaseSection
      id="color"
      title="Color"
      description="Valores resueltos en el navegador para el tema activo. Cambia de tema para comparar."
    >
      <ShowcaseGroup label="Escalas 100–900 (misma progresión de luminosidad)">
        <div className="space-y-3">
          {SCALES.map((scale) => (
            <div key={scale} className="flex items-center gap-3">
              <span className="w-16 shrink-0 text-caption text-muted-foreground font-mono">{scale}</span>
              <ul className="grid flex-1 grid-cols-9 gap-1">
                {SCALE_STEPS.map((step) => (
                  <li key={step} className="space-y-1">
                    <div
                      className="h-10 rounded-tag"
                      style={{ background: `var(--${scale}-${step})` }}
                      aria-hidden="true"
                    />
                    <p className="text-center text-caption text-muted-foreground font-mono">{step}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ShowcaseGroup>

      <div className="grid gap-4 md:grid-cols-2">
        {SWATCH_GROUPS.map((group) => (
          <ShowcaseGroup key={group.label} label={group.label}>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {group.tokens.map((token) => (
                <li key={token} className="space-y-1.5">
                  <div
                    className="h-12 rounded-lg border border-border"
                    style={{ background: `var(${token})` }}
                    aria-hidden="true"
                  />
                  <p className="text-xs font-medium text-foreground font-mono">{token}</p>
                  <p className="text-xs text-muted-foreground font-mono">{hex[token] ?? "…"}</p>
                </li>
              ))}
            </ul>
          </ShowcaseGroup>
        ))}
      </div>

      <ShowcaseGroup label="Contraste WCAG">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th scope="col" className="py-2 pr-4 font-semibold">Par</th>
                <th scope="col" className="py-2 pr-4 font-semibold">Muestra</th>
                <th scope="col" className="py-2 pr-4 font-semibold text-right">Ratio</th>
                <th scope="col" className="py-2 font-semibold text-right">Mínimo</th>
              </tr>
            </thead>
            <tbody>
              {CONTRAST_CHECKS.map((check) => {
                const value = ratio(check)
                const passes = value !== null && value >= check.min
                return (
                  <tr key={check.label} className="border-b border-border last:border-0">
                    <td className="py-2.5 pr-4 text-foreground">{check.label}</td>
                    <td className="py-2.5 pr-4">
                      <span
                        className="inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold border border-border"
                        style={{ color: `var(${check.fg})`, background: `var(${check.bg})` }}
                      >
                        Aa 123
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-right tabular-nums">
                      {value === null ? (
                        "…"
                      ) : (
                        <span className={cn("font-semibold", passes ? "text-foreground" : "text-destructive")}>
                          {value.toFixed(2)} {passes ? "✓" : "✗"}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-muted-foreground">{check.min}:1</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </ShowcaseGroup>
    </ShowcaseSection>
  )
}
