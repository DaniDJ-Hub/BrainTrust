"use client"

import { useEffect, useState } from "react"

export interface ContrastPair {
  fg: string
  bg: string
}

type Rgb = [number, number, number]

function resolveToken(token: string, probe: HTMLElement, ctx: CanvasRenderingContext2D): Rgb | null {
  probe.style.color = `var(${token})`
  const computed = getComputedStyle(probe).color
  if (!computed) return null

  ctx.clearRect(0, 0, 1, 1)
  ctx.fillStyle = "#000"
  ctx.fillStyle = computed
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return [r, g, b]
}

function relativeLuminance([r, g, b]: Rgb): number {
  const channel = (value: number) => {
    const c = value / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

function contrastRatio(a: Rgb, b: Rgb): number {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

export function toHex([r, g, b]: Rgb): string {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`.toUpperCase()
}

export interface ResolvedTokens {
  hex: Record<string, string>
  ratio: (pair: ContrastPair) => number | null
}

/**
 * Resolves CSS custom properties to sRGB in the browser so the showcase
 * always reports the contrast of the tokens actually shipped, in the active theme.
 */
export function useTokenContrast(tokens: string[], themeKey: string | undefined): ResolvedTokens {
  const [rgb, setRgb] = useState<Record<string, Rgb>>({})
  const tokensKey = tokens.join("|")

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const canvas = document.createElement("canvas")
      canvas.width = 1
      canvas.height = 1
      const ctx = canvas.getContext("2d", { willReadFrequently: true })
      if (!ctx) return

      const probe = document.createElement("span")
      probe.style.display = "none"
      document.body.appendChild(probe)

      const next: Record<string, Rgb> = {}
      for (const token of tokensKey.split("|")) {
        const value = resolveToken(token, probe, ctx)
        if (value) next[token] = value
      }
      probe.remove()
      setRgb(next)
    })
    return () => cancelAnimationFrame(frame)
  }, [tokensKey, themeKey])

  const hex = Object.fromEntries(Object.entries(rgb).map(([k, v]) => [k, toHex(v)]))
  const ratio = ({ fg, bg }: ContrastPair) =>
    rgb[fg] && rgb[bg] ? contrastRatio(rgb[fg], rgb[bg]) : null

  return { hex, ratio }
}
