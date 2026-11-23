"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronRight, LogOut, Menu, Moon, Sun, User } from "lucide-react"
import { useTheme } from "next-themes"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useAuth } from "@/app/context/AuthContext"
import { getRoleLabel, normalizeRole } from "@/lib/roles"
import { ProfileModal } from "../auth/profile-modal"
import { getBreadcrumbs } from "./nav-config"
import { MOBILE_SIDEBAR_ID } from "./dashboard-sidebar"

interface DashboardHeaderProps {
  onMenuClick: () => void
  menuOpen: boolean
}

const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"

export function DashboardHeader({ onMenuClick, menuOpen }: DashboardHeaderProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const [showProfileModal, setShowProfileModal] = useState(false)

  const crumbs = getBreadcrumbs(pathname, normalizeRole(user?.role))
  const firstName = user?.name?.split(" ")[0] || "Usuario"
  const initials = user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "U"
  const isDark = resolvedTheme === "dark"

  const handleLogout = async () => {
    try {
      await logout()
      await new Promise((resolve) => setTimeout(resolve, 100))
    } catch {
      // A failed logout call must not keep the user inside the app.
    }
    window.location.href = "/auth/login"
  }

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          className="icon-btn lg:hidden"
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
          aria-controls={MOBILE_SIDEBAR_ID}
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>

        <nav aria-label="Ruta de navegación" className="min-w-0 flex-1">
          <ol className="flex min-w-0 items-center gap-1 text-body">
            {crumbs.map((crumb, index) => {
              const isLast = index === crumbs.length - 1
              return (
                <li key={`${crumb.label}-${index}`} className={cn("flex min-w-0 items-center gap-1", !isLast && "hidden sm:flex")}>
                  {crumb.href && !isLast ? (
                    <Link href={crumb.href} className={cn("truncate rounded-tag text-muted-foreground hover:text-foreground", FOCUS_RING)}>
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current={isLast ? "page" : undefined} className="truncate font-semibold text-foreground">
                      {crumb.label}
                    </span>
                  )}
                  {!isLast && <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />}
                </li>
              )
            })}
          </ol>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="icon-btn relative"
            aria-label={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
            title="Cambiar tema"
          >
            <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" aria-hidden="true" />
            <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" aria-hidden="true" />
          </button>

          <div className="mx-1 hidden h-6 w-px bg-border sm:block" aria-hidden="true" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label={`Menú de cuenta de ${user?.name || "Usuario"}`}
                className={cn("flex items-center gap-2 rounded-control py-1 pl-1 pr-2 transition-colors hover:bg-accent", FOCUS_RING)}
              >
                <Avatar className="size-8 border-2 border-border">
                  <AvatarImage src={user?.avatar} alt="" />
                  <AvatarFallback className="bg-primary text-caption font-bold text-primary-foreground">{initials}</AvatarFallback>
                </Avatar>
                <span className="hidden flex-col items-start sm:flex">
                  <span className="max-w-[120px] truncate text-caption font-semibold text-foreground">{firstName}</span>
                  <span className="text-caption font-normal text-muted-foreground">{getRoleLabel(user?.role)}</span>
                </span>
                <ChevronDown className="hidden size-3.5 text-muted-foreground sm:block" aria-hidden="true" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-60 rounded-surface border-border shadow-md" align="end">
              <DropdownMenuLabel className="px-3 py-2.5 font-normal">
                <div className="flex items-center gap-3">
                  <Avatar className="size-9 border border-border">
                    <AvatarImage src={user?.avatar} alt="" />
                    <AvatarFallback className="bg-primary text-caption font-bold text-primary-foreground">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-body font-semibold text-foreground">{user?.name}</p>
                    <p className="truncate text-caption font-normal text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setShowProfileModal(true)} className="mx-1 cursor-pointer gap-2 rounded-control">
                <User className="size-4" aria-hidden="true" />
                Perfil y configuración
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={handleLogout}
                className="mx-1 mb-1 cursor-pointer gap-2 rounded-control text-destructive focus:bg-destructive-soft focus:text-destructive-soft-foreground"
              >
                <LogOut className="size-4" aria-hidden="true" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {showProfileModal && <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />}
    </>
  )
}
