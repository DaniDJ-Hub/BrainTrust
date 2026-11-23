import { BarChart3, BookOpen, CalendarDays, IdCard, LayoutDashboard, Library, UserCog, type LucideIcon } from "lucide-react"
import { PERMISSIONS } from "@/app/types/authentication"
import { getHomeRoute, type AppRole } from "@/lib/roles"
import type { BreadcrumbEntry } from "@/components/common"

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  permission: string | null
}

const STANDARD_NAV: NavItem[] = [
  { label: "Tablero", href: "/", icon: LayoutDashboard, permission: null },
  { label: "Calendario", href: "/calendar", icon: CalendarDays, permission: null },
  { label: "Cursos", href: "/courses", icon: BookOpen, permission: null },
]

const ADMIN_NAV: NavItem[] = [
  { label: "Gestión de Usuarios", href: "/admin/users", icon: UserCog, permission: PERMISSIONS.USER_MANAGEMENT },
  { label: "Gestión de Cursos", href: "/admin/courses", icon: Library, permission: PERMISSIONS.COURSE_MANAGEMENT },
  { label: "Datos Personales", href: "/admin/personal", icon: IdCard, permission: PERMISSIONS.PERSONAL_DATA_MANAGEMENT },
  { label: "Gráficos y Estadísticas", href: "/admin/statistics", icon: BarChart3, permission: PERMISSIONS.STADISTICS },
]

export function getNavItems(role: AppRole): NavItem[] {
  return role === "admin" ? ADMIN_NAV : STANDARD_NAV
}

export function isNavItemActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}

const ROUTE_LABELS: Record<string, string> = {
  "/": "Tablero",
  "/calendar": "Calendario",
  "/courses": "Cursos",
  "/admin/users": "Gestión de Usuarios",
  "/admin/courses": "Gestión de Cursos",
  "/admin/personal": "Datos Personales",
  "/admin/statistics": "Gráficos y Estadísticas",
  "/admin/catalogs": "Catálogos",
  "/admin/activities": "Actividades por rol",
}

/** Route-level trail for the top bar. Views inside a page (tabs) keep their own titles. */
export function getBreadcrumbs(pathname: string, role: AppRole): BreadcrumbEntry[] {
  const home: BreadcrumbEntry = role === "admin"
    ? { label: "Administración", href: getHomeRoute(role) }
    : { label: "Inicio", href: getHomeRoute(role) }

  if (pathname === "/") return [{ label: "Tablero" }]
  if (/^\/courses\/[^/]+$/.test(pathname)) {
    return [home, { label: "Cursos", href: "/courses" }, { label: "Detalle del curso" }]
  }

  const label = ROUTE_LABELS[pathname]
  return label ? [home, { label }] : [home]
}
