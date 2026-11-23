"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, BookOpen, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Course } from "@/app/domain/entities/CourseEntities";
import { CourseId } from "@/app/domain/valueObjects";
import { CourseFormModal } from "../teacher/course-form-creator-teacher";
import { useCourseMutations, useCoursesByTeacher } from "@/components/teacher/hooks/courses-hooks";
import { useAuth } from "@/app/context/AuthContext";
import { useStudentCourses } from "@/app/presentation/hooks/course/student/student-hooks";
import { ConfirmDialog, EmptyState, PageHeader } from "@/components/common";
import { Skeleton } from "@/components/ui/skeleton";
import { CourseCard } from "./courses/course-card";

export function CourseDashboard() {
  const router = useRouter();
  const { user } = useAuth();

  const tipoUsuario = user?.role === "student" ? "student" : "teacher";
  const esEstudiante = tipoUsuario === "student";
  const usuarioId = user?.id;

  const {
    data: cursos = [],
    isLoading,
    error: errorFetch,
    refetch,
  } = esEstudiante ? useStudentCourses(usuarioId!) : useCoursesByTeacher(usuarioId!);

  const { createCourse: crearCurso, updateCourse: actualizarCurso, deleteCourse: eliminarCurso } = useCourseMutations();

  const [cursoAEliminar, setCursoAEliminar] = React.useState<Course | null>(null);
  const [modalFormularioAbierto, setModalFormularioAbierto] = React.useState(false);
  const [cursoAEditar, setCursoAEditar] = React.useState<Course | undefined>(undefined);

  const handleCrearCurso = () => {
    if (esEstudiante) return;
    setCursoAEditar(undefined);
    setModalFormularioAbierto(true);
  };

  const handleActualizarCurso = (cursoId: CourseId) => {
    if (esEstudiante) return;
    const curso = cursos.find((c) => c.id === cursoId);
    if (curso) {
      setCursoAEditar(curso);
      setModalFormularioAbierto(true);
    }
  };

  const handleCerrarModalFormulario = () => {
    setModalFormularioAbierto(false);
    setCursoAEditar(undefined);
  };

  const handleGuardarCurso = async (
    datosFormulario: Omit<Course, "id" | "teacherId">,
    cursoId?: string,
    archivoImagen?: File | null
  ) => {
    if (esEstudiante) return;

    try {
      if (cursoId) {
        const cursoActual = cursos.find((c) => c.id === cursoId);
        await actualizarCurso.mutateAsync(
          {
            courseId: cursoId,
            courseData: datosFormulario,
            imageFile: archivoImagen || undefined,
            oldImageUrl: cursoActual?.urlImage || undefined,
          },
          { onSuccess: handleCerrarModalFormulario }
        );
      } else {
        const cursoConProfesor = { ...datosFormulario, teacherId: usuarioId || "current-teacher-id" } as Course;
        await crearCurso.mutateAsync(
          { courseData: cursoConProfesor, imageFile: archivoImagen || undefined },
          { onSuccess: handleCerrarModalFormulario }
        );
      }
    } catch (error) {
      console.error("Error al guardar el curso:", error);
    }
  };

  const handleIngresarCurso = (cursoId: CourseId) => {
    router.push(`/courses/${cursoId}`);
  };

  const handleEliminacionConfirmada = async () => {
    if (esEstudiante || !cursoAEliminar) return;
    try {
      await eliminarCurso.mutateAsync(cursoAEliminar.id);
      toast.success("Curso eliminado");
    } catch (error) {
      toast.error("No se pudo eliminar el curso. Inténtalo de nuevo.");
      throw error;
    }
  };

  const error = errorFetch as Error | null;

  return (
    <>
      <PageHeader
        title="Mis cursos"
        description={esEstudiante ? "Cursos en los que estás inscrito." : "Cursos que impartes."}
        actions={
          !esEstudiante && (
            <button type="button" onClick={handleCrearCurso} className="btn-primary" disabled={crearCurso.isPending}>
              <Plus className="size-4" aria-hidden="true" />
              {crearCurso.isPending ? "Creando…" : "Crear curso"}
            </button>
          )
        }
      />

      {isLoading && (
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3" aria-label="Cargando cursos">
          {Array.from({ length: 3 }, (_, i) => (
            <li key={i} className="card-base overflow-hidden" aria-hidden="true">
              <Skeleton className="h-32 w-full rounded-none" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-10 w-full" />
              </div>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <div className="card-base">
          <EmptyState
            icon={AlertTriangle}
            tone="error"
            title="No pudimos cargar los cursos"
            description={error.message || "Revisa tu conexión e inténtalo de nuevo."}
            action={
              <button type="button" className="btn-secondary" onClick={() => refetch()}>
                <RefreshCw className="size-4" aria-hidden="true" /> Reintentar
              </button>
            }
          />
        </div>
      )}

      {!isLoading && !error && cursos.length > 0 && (
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {cursos.map((curso) => (
            <li key={curso.id} className="flex">
              <CourseCard
                course={curso}
                isStudent={esEstudiante}
                onEnter={handleIngresarCurso}
                onEdit={handleActualizarCurso}
                onDelete={setCursoAEliminar}
              />
            </li>
          ))}
        </ul>
      )}

      {!isLoading && !error && cursos.length === 0 && (
        <div className="card-base">
          <EmptyState
            icon={BookOpen}
            title={esEstudiante ? "Aún no estás inscrito en ningún curso" : "Todavía no tienes cursos"}
            description={
              esEstudiante ? "Cuando tu profesor te inscriba, tus cursos aparecerán aquí." : "Crea tu primer curso para empezar."
            }
            action={
              !esEstudiante && (
                <button type="button" onClick={handleCrearCurso} className="btn-primary">
                  <Plus className="size-4" aria-hidden="true" /> Crear tu primer curso
                </button>
              )
            }
          />
        </div>
      )}

      {!esEstudiante && (
        <>
          <CourseFormModal
            open={modalFormularioAbierto}
            onClose={handleCerrarModalFormulario}
            initialData={cursoAEditar}
            onSave={handleGuardarCurso}
            isSaving={crearCurso.isPending || actualizarCurso.isPending}
          />
          <ConfirmDialog
            open={cursoAEliminar !== null}
            onOpenChange={(open) => !open && setCursoAEliminar(null)}
            tone="destructive"
            title="¿Eliminar este curso?"
            description={
              cursoAEliminar ? `Se eliminará el curso "${cursoAEliminar.name}".` : undefined
            }
            confirmLabel="Eliminar curso"
            onConfirm={handleEliminacionConfirmada}
          />
        </>
      )}
    </>
  );
}
