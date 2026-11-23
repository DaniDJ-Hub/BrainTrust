"use client";

import * as React from "react";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { UnitResource, CourseUnit, Assignment, Quiz } from "@/app/domain/entities/CourseEntities";
import { CourseId, UnitId } from "@/app/domain/valueObjects/CourseValues";
import { VistaQuizEstudiante } from "../student/quiz-transactional-view-student";
import { useAuth } from "@/app/context/AuthContext";
import { useCourseAllUnits } from "@/components/teacher/hooks/courses-hooks";
import { useAssignmentsByUnit, useAssignment } from "./hooks/assignment-hooks";
import { useQuizzesByUnit } from "./hooks/quiz-hooks";
import { usePagesByUnit } from "./hooks/page-hooks";
import { useUserTeam } from "./hooks/team-hooks";
import { useQuizSubmission, useTaskSubmission } from "./hooks/submission-hooks";
import { ConfirmDialog, PageHeader } from "@/components/common";
import { UnitDetailSkeleton, UnitResourceList } from "./unit-detail/unit-resource-list";
import { UnitResourceViewer } from "./unit-detail/unit-resource-viewer";
import { UnitResourceCreators } from "./unit-detail/unit-resource-creators";
import { useUnitResourceCrud } from "./unit-detail/use-unit-resource-crud";
import { TIPO_LABEL, estaQuizDisponible, obtenerTipoRecurso, type TipoRecurso } from "./unit-detail/unit-resource-utils";

type QuizSubmitHandler = React.ComponentProps<typeof VistaQuizEstudiante>["onSubmit"];

interface PropsDetalleUnidad {
  idUnit: UnitId;
  idCourse: CourseId;
  onBack: () => void;
  unitData?: CourseUnit;
}

export function UnitDetail({ idUnit, idCourse, onBack, unitData }: PropsDetalleUnidad) {
  const { user } = useAuth();
  const esEstudiante = user?.role === "student";

  const { data: tareas = [], isLoading: cargandoTareas, refetch: recargarTareas } = useAssignmentsByUnit(idCourse, idUnit);
  const { data: quizzes = [], isLoading: cargandoQuizzes, refetch: recargarQuizzes } = useQuizzesByUnit(idCourse, idUnit);
  const { data: paginas = [], isLoading: cargandoPaginas, refetch: recargarPaginas } = usePagesByUnit(idCourse, idUnit);
  const { units: unidadesCurso } = useCourseAllUnits(idCourse);
  const { data: equipoUsuario } = useUserTeam(user?.id || "");

  const { submitTask: mutacionEnviarTarea, isSubmitting: enviandoTarea } = useTaskSubmission();
  const { submitQuiz: mutacionEnviarQuiz, isSubmitting: enviandoQuiz } = useQuizSubmission();

  const recursos = React.useMemo(
    (): UnitResource[] => [...tareas, ...quizzes, ...paginas].sort((a, b) => a.title.localeCompare(b.title)),
    [tareas, quizzes, paginas]
  );

  const [modoVista, setModoVista] = React.useState<"list" | "detail" | "student">("list");
  const [recursoActual, setRecursoActual] = React.useState<UnitResource | null>(null);
  const [recursoAEliminar, setRecursoAEliminar] = React.useState<UnitResource | null>(null);
  const [mostrarSelectorRecurso, setMostrarSelectorRecurso] = React.useState(false);
  const [tipoRecursoSeleccionado, setTipoRecursoSeleccionado] = React.useState<TipoRecurso | null>(null);
  const [errorDisponibilidadQuiz, setErrorDisponibilidadQuiz] = React.useState<string | null>(null);

  const { data: tareaVista } = useAssignment(
    modoVista === "detail" && recursoActual && obtenerTipoRecurso(recursoActual) === "ASSIGNMENT" ? recursoActual.id : null
  );

  const cargando = cargandoTareas || cargandoQuizzes || cargandoPaginas;
  const unidad = unitData ?? unidadesCurso?.find((u) => u.id === idUnit);

  const recargarTodo = () => {
    recargarTareas();
    recargarQuizzes();
    recargarPaginas();
  };

  const { creando, crearRecurso, eliminarRecurso } = useUnitResourceCrud({ idCourse, idUnit, onChanged: recargarTodo });

  const handleCrearRecurso = (datosRecurso: unknown, archivos?: File[]) => {
    if (!tipoRecursoSeleccionado) return;
    crearRecurso(tipoRecursoSeleccionado, datosRecurso, archivos, () => setTipoRecursoSeleccionado(null));
  };

  const handleEliminarRecurso = async () => {
    if (recursoAEliminar) await eliminarRecurso(recursoAEliminar);
  };

  const handleVistaEstudiante = (recurso: UnitResource) => {
    if (obtenerTipoRecurso(recurso) === "QUIZ" && esEstudiante) {
      const disponibilidad = estaQuizDisponible(recurso as Quiz);
      if (!disponibilidad.available) {
        setErrorDisponibilidadQuiz(disponibilidad.reason || "Este quiz no está disponible.");
        return;
      }
    }
    setErrorDisponibilidadQuiz(null);
    setRecursoActual(recurso);
    setModoVista("student");
  };

  const handleEnvioTarea = async (datosEnvio: { content: string; attachments: File[] }) => {
    if (!recursoActual || !user?.id) return;

    try {
      const tarea = recursoActual as Assignment;
      const tipoEnvio = tarea.deliveryMode === "TEAM" ? "TEAM" : "INDIVIDUAL";

      let idGrupo: string | undefined;
      if (tipoEnvio === "TEAM" && equipoUsuario) {
        idGrupo = equipoUsuario.teamId.id;
      }

      await mutacionEnviarTarea.mutateAsync({
        assignmentId: recursoActual.id,
        studentId: user.id,
        content: datosEnvio.content,
        attachments: datosEnvio.attachments,
        submissionType: tipoEnvio as "INDIVIDUAL" | "TEAM",
        ...(idGrupo && { groupId: idGrupo }),
      });

      setModoVista("list");
      setRecursoActual(null);
      recargarTareas();
    } catch (error) {
      console.error("Error al enviar la tarea:", error);
    }
  };

  const handleEnvioQuiz: QuizSubmitHandler = async (respuestas) => {
    if (!recursoActual || !user?.id) return;

    try {
      const disponibilidad = estaQuizDisponible(recursoActual as Quiz);
      if (!disponibilidad.available) {
        setErrorDisponibilidadQuiz(disponibilidad.reason || "Este quiz no está disponible.");
        setModoVista("list");
        setRecursoActual(null);
        return;
      }

      await mutacionEnviarQuiz.mutateAsync({ quizId: recursoActual.id, studentId: user.id, answers: respuestas });

      setModoVista("list");
      setRecursoActual(null);
      setErrorDisponibilidadQuiz(null);
      recargarQuizzes();
    } catch (error) {
      console.error("Error al enviar el quiz:", error);
    }
  };

  const handleVer = (recurso: UnitResource) => {
    setRecursoActual(recurso);
    setModoVista("detail");
  };

  const handleVolverDelDetalle = () => {
    setModoVista("list");
    setRecursoActual(null);
    setErrorDisponibilidadQuiz(null);
    recargarTodo();
  };

  if (cargando) return <UnitDetailSkeleton />;

  if ((modoVista === "detail" || modoVista === "student") && recursoActual && user) {
    return (
      <UnitResourceViewer
        mode={modoVista}
        recurso={recursoActual}
        tareaDetalle={tareaVista}
        studentId={user.id}
        onClose={handleVolverDelDetalle}
        onSubmitTask={handleEnvioTarea}
        onSubmitQuiz={handleEnvioQuiz}
        enviandoTarea={enviandoTarea}
        enviandoQuiz={enviandoQuiz}
      />
    );
  }

  return (
    <div className="space-y-6">
      <button type="button" onClick={onBack} className="btn-quiet btn-sm -ml-2">
        <ArrowLeft className="size-4" aria-hidden="true" /> Volver al curso
      </button>

      <PageHeader
        eyebrow={unidad ? `Unidad ${unidad.numUnity}` : undefined}
        title={unidad?.name ?? "Recursos de la unidad"}
        description={
          esEstudiante ? "Consulta y completa los recursos de aprendizaje." : "Gestiona los recursos de aprendizaje de esta unidad."
        }
        actions={
          !esEstudiante && (
            <button type="button" onClick={() => setMostrarSelectorRecurso(true)} className="btn-primary" disabled={creando}>
              {creando ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
              Agregar recurso
            </button>
          )
        }
      />

      <UnitResourceList
        recursos={recursos}
        isStudent={esEstudiante}
        availabilityError={errorDisponibilidadQuiz}
        onAdd={() => setMostrarSelectorRecurso(true)}
        onStart={handleVistaEstudiante}
        onView={handleVer}
        onDelete={setRecursoAEliminar}
      />

      {!esEstudiante && (
        <>
          <UnitResourceCreators
            idCourse={idCourse}
            idUnit={idUnit}
            selectorOpen={mostrarSelectorRecurso}
            onCloseSelector={() => setMostrarSelectorRecurso(false)}
            tipo={tipoRecursoSeleccionado}
            onSelectTipo={setTipoRecursoSeleccionado}
            onSave={handleCrearRecurso}
          />
          <ConfirmDialog
            open={recursoAEliminar !== null}
            onOpenChange={(open) => !open && setRecursoAEliminar(null)}
            tone="destructive"
            title={`¿Eliminar ${recursoAEliminar ? TIPO_LABEL[obtenerTipoRecurso(recursoAEliminar)].toLowerCase() : "recurso"}?`}
            description={recursoAEliminar ? `Se eliminará "${recursoAEliminar.title}".` : undefined}
            confirmLabel="Eliminar"
            onConfirm={handleEliminarRecurso}
          />
        </>
      )}
    </div>
  );
}
