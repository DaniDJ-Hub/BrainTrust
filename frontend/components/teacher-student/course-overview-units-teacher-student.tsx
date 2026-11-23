"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, BookOpen, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { CourseId } from "@/app/domain/valueObjects/CourseValues";
import type { CourseUnit } from "@/app/domain/entities/CourseEntities";
import { useAuth } from "@/app/context/AuthContext";
import { useCourseAllUnits } from "@/components/teacher/hooks/courses-hooks";
import { useUnitMutations } from "@/app/presentation/hooks/course/unit-hooks";
import { ConfirmDialog, EmptyState } from "@/components/common";
import { Skeleton } from "@/components/ui/skeleton";
import { ModalFormularioUnidad } from "./unit-form-modal-student-teacher";
import { CourseUnitDTO, fetchCourseById } from "../student/api/student-courses";
import { UnitCard } from "./course-overview/unit-card";
import { CourseHero } from "./course-overview/course-hero";

type UnitFormData = Parameters<React.ComponentProps<typeof ModalFormularioUnidad>["onSave"]>[0];

interface PropsVistaGeneralCurso {
  courseId: CourseId;
  onSelectUnit: (unitId: string) => void;
}

export function CourseOverview({ courseId, onSelectUnit }: PropsVistaGeneralCurso) {
  const {
    data: datosCurso,
    isLoading: cargandoCurso,
    error: errorCurso,
    refetch: recargarCurso,
  } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => fetchCourseById(courseId!),
    enabled: !!courseId,
  });

  const {
    units: unidades,
    isLoading: cargandoUnidades,
    error: errorUnidades,
    refetch: recargarUnidades,
  } = useCourseAllUnits(courseId);

  const { user } = useAuth();
  const esEstudiante = user?.role === "student";

  const [modalUnidadAbierto, setModalUnidadAbierto] = React.useState(false);
  const [unidadAEditar, setUnidadAEditar] = React.useState<CourseUnitDTO | undefined>(undefined);
  const [unidadAEliminar, setUnidadAEliminar] = React.useState<CourseUnitDTO | null>(null);

  const { createUnit: crearUnidad, updateUnit: actualizarUnidad, deleteUnit: eliminarUnidad } = useUnitMutations();

  const cargando = cargandoCurso || cargandoUnidades;
  const error = errorCurso || errorUnidades;

  const handleCrearUnidad = () => {
    if (esEstudiante) return;
    setUnidadAEditar(undefined);
    setModalUnidadAbierto(true);
  };

  const handleEditarUnidad = (unidad: CourseUnitDTO) => {
    if (esEstudiante) return;
    setUnidadAEditar(unidad);
    setModalUnidadAbierto(true);
  };

  const handleCerrarModalUnidad = () => {
    setModalUnidadAbierto(false);
    setUnidadAEditar(undefined);
  };

  const handleGuardarUnidad = async (datosUnidad: UnitFormData, unidadId?: string, archivoImagen?: File | null) => {
    if (esEstudiante) return;

    try {
      if (unidadId) {
        const unidadActual = unidades?.find((u) => u.id === unidadId);
        await actualizarUnidad.mutateAsync(
          {
            unitId: unidadId,
            unitData: datosUnidad,
            imageFile: archivoImagen || undefined,
            oldImageUrl: unidadActual?.urlImage || undefined,
          },
          {
            onSuccess: () => {
              handleCerrarModalUnidad();
              recargarUnidades();
            },
          }
        );
      } else {
        await crearUnidad.mutateAsync(
          {
            courseId,
            unitData: { ...datosUnidad, numUnity: (unidades?.length || 0) + 1 },
            imageFile: archivoImagen || undefined,
          },
          {
            onSuccess: () => {
              handleCerrarModalUnidad();
              recargarUnidades();
            },
          }
        );
      }
    } catch (error) {
      console.error("Error al guardar la unidad:", error);
    }
  };

  const handleEliminarUnidad = async () => {
    if (esEstudiante || !unidadAEliminar) return;
    try {
      await eliminarUnidad.mutateAsync(unidadAEliminar.id);
      recargarUnidades();
      toast.success("Unidad eliminada");
    } catch (error) {
      toast.error("No se pudo eliminar la unidad. Inténtalo de nuevo.");
      throw error;
    }
  };

  if (cargando) {
    return (
      <div className="space-y-6" aria-busy="true" aria-label="Cargando curso">
        <Skeleton className="h-40 w-full rounded-surface" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-64 rounded-surface" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !datosCurso) {
    return (
      <div className="card-base">
        <EmptyState
          icon={AlertTriangle}
          tone="error"
          title="No pudimos cargar el curso"
          description={error?.message || "Los datos del curso no están disponibles."}
          action={
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                recargarCurso();
                recargarUnidades();
              }}
            >
              <RefreshCw className="size-4" aria-hidden="true" /> Reintentar
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CourseHero
        code={datosCurso.code}
        name={datosCurso.name}
        description={datosCurso.description}
        imageUrl={datosCurso.urlImage || undefined}
        studentCount={datosCurso.enrollments?.length || 0}
        unitCount={unidades?.length || 0}
      />

      <section aria-labelledby="unidades-curso" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="unidades-curso" className="text-heading text-foreground">Unidades del curso</h2>
          {!esEstudiante && (
            <button type="button" onClick={handleCrearUnidad} className="btn-primary" disabled={crearUnidad.isPending}>
              <Plus className="size-4" aria-hidden="true" />
              {crearUnidad.isPending ? "Creando…" : "Agregar unidad"}
            </button>
          )}
        </div>

        {unidades && unidades.length > 0 ? (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {unidades.map((unidad) => (
              <li key={unidad.id} className="flex">
                <UnitCard
                  unidad={unidad}
                  isStudent={esEstudiante}
                  onSelect={onSelectUnit}
                  onEdit={handleEditarUnidad}
                  onDelete={setUnidadAEliminar}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="card-base">
            <EmptyState
              icon={BookOpen}
              title={esEstudiante ? "Aún no hay unidades disponibles" : "Aún no hay unidades"}
              description={esEstudiante ? "Vuelve más tarde para ver el contenido del curso." : "Crea la primera unidad del curso."}
              action={
                !esEstudiante && (
                  <button type="button" onClick={handleCrearUnidad} className="btn-primary">
                    <Plus className="size-4" aria-hidden="true" /> Crear primera unidad
                  </button>
                )
              }
            />
          </div>
        )}
      </section>

      {!esEstudiante && (
        <>
          <ModalFormularioUnidad
            open={modalUnidadAbierto}
            onClose={handleCerrarModalUnidad}
            initialData={unidadAEditar as CourseUnit | undefined}
            onSave={handleGuardarUnidad}
            isSaving={crearUnidad.isPending || actualizarUnidad.isPending}
          />
          <ConfirmDialog
            open={unidadAEliminar !== null}
            onOpenChange={(open) => !open && setUnidadAEliminar(null)}
            tone="destructive"
            title="¿Eliminar esta unidad?"
            description={unidadAEliminar ? `Se eliminará la unidad "${unidadAEliminar.name}".` : undefined}
            confirmLabel="Eliminar unidad"
            onConfirm={handleEliminarUnidad}
          />
        </>
      )}
    </div>
  );
}
