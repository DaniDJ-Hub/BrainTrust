"use client"

import { useCallback, useState } from "react"
import { cn } from "@/lib/utils"
import { PageHeader, type BreadcrumbEntry } from "@/components/common"
import { DashboardSidebar } from "./dashboard-sidebar"
import { DashboardHeader } from "./dashboard-header"

interface AppShellProps {
  children: React.ReactNode
  /** Renders a PageHeader (h1). Omit it when the view already renders its own h1. */
  title?: string
  description?: string
  breadcrumbs?: BreadcrumbEntry[]
  actions?: React.ReactNode
  /**
   * "default": standard page padding.
   * "none": the view brings its own padding or full-bleed content (e.g. sticky tabs).
   */
  padding?: "default" | "none"
}

export const MAIN_CONTENT_ID = "contenido"

export function AppShell({ children, title, description, breadcrumbs, actions, padding = "default" }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

  const header = title ? (
    <PageHeader title={title} description={description} breadcrumbs={breadcrumbs} actions={actions} />
  ) : null

  return (
    <div className="min-h-screen bg-background">
      <a
        href={`#${MAIN_CONTENT_ID}`}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-control focus:bg-card focus:px-4 focus:py-2 focus:text-body focus:font-semibold focus:text-foreground focus:shadow-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Saltar al contenido
      </a>

      <DashboardSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className="flex min-h-screen flex-col lg:pl-64">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} menuOpen={sidebarOpen} />

        <main
          id={MAIN_CONTENT_ID}
          tabIndex={-1}
          className={cn("flex-1 focus:outline-none", padding === "default" && "space-y-6 p-4 sm:p-6 lg:p-8")}
        >
          {padding === "default" ? header : header && <div className="px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">{header}</div>}
          {children}
        </main>
      </div>
    </div>
  )
}
