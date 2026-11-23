"use client"

import { useId, useState } from "react"
import Link from "next/link"
import { AlertTriangle, BookOpen, ChevronDown, Layers, RefreshCw, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { EmptyState } from "@/components/common"
import { Skeleton } from "@/components/ui/skeleton"
import { useStudentCourses } from "@/app/presentation/hooks/course/student/student-hooks"

interface StudentCoursesSectionProps {
  studentId: string;
}

const CURSOS_INICIALES = 3;

export function CoursesSectionStudent({ studentId }: StudentCoursesSectionProps) {
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const titleId = useId();
  const { data: courses = [], isLoading, error, refetch } = useStudentCourses(studentId);

  const activos = courses.filter((course) => course.active).length;
  const visibles = mostrarTodos ? courses : courses.slice(0, CURSOS_INICIALES);
  const hayMas = courses.length > CURSOS_INICIALES;

  return (
    <section aria-labelledby={titleId} className="card-padded space-y-5">
      <header className="space-y-1">
        <h2 id={titleId} className="text-heading text-foreground">Mis cursos</h2>
        {!isLoading && !error && courses.length > 0 && (
          <p className="text-body text-muted-foreground">
            {activos} {activos === 1 ? "activo" : "activos"} · {courses.length}{" "}
            {courses.length === 1 ? "inscripción" : "inscripciones"}
          </p>
        )}
      </header>

      {isLoading ? (
        <ul className="space-y-3" aria-label="Cargando cursos">
          {Array.from({ length: 2 }, (_, i) => (
            <li key={i} className="flex gap-3 rounded-control border border-border p-4" aria-hidden="true">
              <Skeleton className="size-10 rounded-control" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </li>
          ))}
        </ul>
      ) : error ? (
        <EmptyState
          icon={AlertTriangle}
          tone="error"
          size="compact"
          title="No pudimos cargar tus cursos"
          description="Revisa tu conexión e inténtalo de nuevo."
          action={
            <button type="button" className="btn-secondary btn-sm" onClick={() => refetch()}>
              <RefreshCw className="size-4" aria-hidden="true" /> Reintentar
            </button>
          }
        />
      ) : courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          size="compact"
          title="Aún no estás inscrito en ningún curso"
          description="Cuando tu profesor te inscriba, tus cursos aparecerán aquí."
          action={
            <Link href="/courses" className="btn-secondary btn-sm">
              Ir a Cursos
            </Link>
          }
        />
      ) : (
        <>
          <ul className="space-y-3">
            {visibles.map((course) => (
              <li key={course.id}>
                <Link
                  href={`/courses/${course.id}`}
                  className="group flex gap-3 rounded-control border border-border bg-card p-4 transition-[border-color,box-shadow] duration-150 hover:border-border-strong hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-secondary text-secondary-foreground">
                    <BookOpen className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1 space-y-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="badge-muted">
                        {course.code} · {course.grade}
                      </span>
                      {!course.active && <span className="badge-muted">Archivado</span>}
                    </span>
                    <span className="block text-subheading text-foreground group-hover:text-primary">{course.name}</span>
                    {course.description && (
                      <span className="line-clamp-2 block text-body text-muted-foreground">{course.description}</span>
                    )}
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-caption font-normal text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Users className="size-3.5" aria-hidden="true" />
                        {course.enrollments?.length || 0} estudiantes
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Layers className="size-3.5" aria-hidden="true" />
                        {course.units?.length || 0} unidades
                      </span>
                      {course.group && <span>Grupo: {course.group}</span>}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {hayMas && (
            <button
              type="button"
              onClick={() => setMostrarTodos((v) => !v)}
              aria-expanded={mostrarTodos}
              className="btn-quiet btn-sm w-full"
            >
              {mostrarTodos ? "Mostrar menos" : `Ver todos los cursos (${courses.length})`}
              <ChevronDown className={cn("size-4 transition-transform", mostrarTodos && "rotate-180")} aria-hidden="true" />
            </button>
          )}
        </>
      )}
    </section>
  );
}
