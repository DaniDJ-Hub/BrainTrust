"use client"

import { cn } from "@/lib/utils"
import { ShowcaseGroup, ShowcaseSection } from "./showcase-section"
import { useTokenContrast, type ContrastPair } from "./use-token-contrast"

interface SwatchGroup {
  label: string
  tokens: string[]
}

const SWATCH_GROUPS: SwatchGroup[] = [
  { label: "Superficies", tokens: ["--background", "--card", "--popover", "--muted", "--secondary"] },
  { label: "Texto", tokens: ["--foreground", "--muted-foreground", "--secondary-foreground"] },
  { label: "Marca y acento", tokens: ["--primary", "--primary-foreground", "--accent", "--accent-foreground", "--ring"] },
  { label: "Estado", tokens: ["--destructive", "--destructive-foreground"] },
  { label: "Bordes", tokens: ["--border", "--input"] },
  { label: "Sidebar", tokens: ["--sidebar", "--sidebar-foreground", "--sidebar-primary", "--sidebar-primary-foreground", "--sidebar-accent", "--sidebar-border"] },
  { label: "Gráficas", tokens: ["--chart-1", "--chart-2", "--chart-3", "--chart-4", "--chart-5"] },
]

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
  { label: "Acento (texto sobre acento)", fg: "--accent-foreground", bg: "--accent", min: 4.5 },
  { label: "Botón destructivo", fg: "--destructive-foreground", bg: "--destructive", min: 4.5 },
  { label: "Texto destructivo en card", fg: "--destructive", bg: "--card", min: 4.5 },
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
