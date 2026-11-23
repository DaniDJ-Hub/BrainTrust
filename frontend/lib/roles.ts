export type AppRole = "admin" | "teacher" | "student"

const ROLE_ALIASES: Record<string, AppRole> = {
  admin: "admin",
  administrator: "admin",
  administrador: "admin",
  teacher: "teacher",
  profesor: "teacher",
  student: "student",
  estudiante: "student",
  alumno: "student",
}

/** Maps any backend/legacy role string to one of the three app roles. Unknown → student. */
export function normalizeRole(role: string | null | undefined): AppRole {
  if (!role) return "student"
  return ROLE_ALIASES[String(role).toLowerCase().trim()] ?? "student"
}

const HOME_ROUTE: Record<AppRole, string> = {
  admin: "/admin/users",
  teacher: "/",
  student: "/",
}

/** Landing route for a role. Admin cannot access "/" (see proxy.ts). */
export function getHomeRoute(role: string | null | undefined): string {
  return HOME_ROUTE[normalizeRole(role)]
}

const ROLE_LABEL: Record<AppRole, string> = {
  admin: "Administrador",
  teacher: "Profesor",
  student: "Estudiante",
}

export function getRoleLabel(role: string | null | undefined): string {
  return ROLE_LABEL[normalizeRole(role)]
}
