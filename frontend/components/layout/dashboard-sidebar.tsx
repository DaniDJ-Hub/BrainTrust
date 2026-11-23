"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { GraduationCap, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/app/context/AuthContext"
import { getHomeRoute, getRoleLabel, normalizeRole } from "@/lib/roles"
import { getNavItems, isNavItemActive } from "./nav-config"

export const MOBILE_SIDEBAR_ID = "sidebar-movil"

interface DashboardSidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface SidebarContentProps {
  onNavigate: () => void
  closeButton?: React.ReactNode
}

function SidebarContent({ onNavigate, closeButton }: SidebarContentProps) {
  const pathname = usePathname()
  const { hasPermission, user } = useAuth()

  const role = normalizeRole(user?.role)
  const navigation = getNavItems(role).filter((item) => !item.permission || hasPermission(item.permission))
  const initials = user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "U"

  return (
    <div className="flex h-full flex-col bg-sidebar border-r border-sidebar-border">
      <div className="flex h-16 items-center justify-between gap-2 px-4 border-b border-sidebar-border">
        <Link
          href={getHomeRoute(user?.role)}
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-control px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
        >
          <span className="flex size-9 items-center justify-center rounded-control bg-sidebar-primary">
            <GraduationCap className="size-5 text-sidebar-primary-foreground" aria-hidden="true" />
          </span>
          <span className="flex flex-col">
            <span className="text-subheading text-sidebar-foreground">BrainTrust</span>
            <span className="text-overline uppercase text-sidebar-foreground/70">LMS</span>
          </span>
        </Link>
        {closeButton}
      </div>

      <nav aria-label="Navegación principal" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const active = isNavItemActive(item.href, pathname)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex h-10 items-center gap-3 rounded-control pl-4 pr-3 text-body transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                    active
                      ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
                      : "font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                  )}
                >
                  {active && (
                    <span className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-sidebar-primary" aria-hidden="true" />
                  )}
                  <item.icon
                    className={cn(
                      "size-4 shrink-0 transition-colors",
                      active ? "text-sidebar-primary" : "text-sidebar-foreground/70 group-hover:text-sidebar-foreground",
                    )}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-control bg-sidebar-accent/50 px-3 py-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-caption font-bold text-sidebar-primary-foreground">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-body font-semibold text-sidebar-foreground">{user?.name || "Usuario"}</p>
            <p className="truncate text-caption text-sidebar-foreground/70">{getRoleLabel(user?.role)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [isOpen, onClose])

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-neutral-900/60 backdrop-blur-sm lg:hidden" onClick={onClose} aria-hidden="true" />
      )}

      <aside
        id={MOBILE_SIDEBAR_ID}
        aria-label="Menú"
        inert={!isOpen}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarContent
          onNavigate={onClose}
          closeButton={
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Cerrar menú"
              className="inline-flex size-10 items-center justify-center rounded-control text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          }
        />
      </aside>

      <aside aria-label="Menú" className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col">
        <SidebarContent onNavigate={() => {}} />
      </aside>
    </>
  )
}
