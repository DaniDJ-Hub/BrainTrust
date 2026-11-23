"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { ArrowLeft, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/app/context/AuthContext"
import { getHomeRoute } from "@/lib/roles"
import { ColorTokens } from "./color-tokens"
import { FoundationTokens } from "./foundation-tokens"
import { GalleryActions } from "./gallery-actions"
import { GalleryForms } from "./gallery-forms"
import { GalleryData } from "./gallery-data"
import { GalleryCommonDisplay } from "./gallery-common-display"
import { GalleryCommonInteractive } from "./gallery-common-interactive"
import { ConfirmProvider } from "@/components/common"

const SECTIONS = [
  { id: "color", label: "Color" },
  { id: "tipografia", label: "Tipografía" },
  { id: "forma", label: "Espaciado y forma" },
  { id: "acciones", label: "Botones y badges" },
  { id: "formularios", label: "Formularios" },
  { id: "datos", label: "Cards y tablas" },
  { id: "common-display", label: "Base · presentación" },
  { id: "common-interactive", label: "Base · datos y diálogos" },
]

export function DesignShowcase() {
  const { resolvedTheme, setTheme } = useTheme()
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = mounted && resolvedTheme === "dark"

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Button asChild variant="ghost" size="icon" aria-label="Volver al inicio">
            <Link href={getHomeRoute(user?.role)}>
              <ArrowLeft />
            </Link>
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-semibold text-foreground tracking-tight">Design system</h1>
            <p className="text-xs text-muted-foreground">BrainTrust · Navy &amp; Gold · Fase 3 (shell)</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
          >
            {isDark ? <Sun /> : <Moon />}
            <span className="hidden sm:inline">{isDark ? "Tema claro" : "Tema oscuro"}</span>
          </Button>
        </div>
        <nav aria-label="Secciones del design system" className="mx-auto max-w-7xl overflow-x-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex gap-1 pb-2">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="inline-flex whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
        <ColorTokens themeKey={mounted ? resolvedTheme : undefined} />
        <FoundationTokens />
        <GalleryActions />
        <GalleryForms />
        <GalleryData />
        <ConfirmProvider>
          <GalleryCommonDisplay />
          <GalleryCommonInteractive />
        </ConfirmProvider>
      </main>
    </div>
  )
}
