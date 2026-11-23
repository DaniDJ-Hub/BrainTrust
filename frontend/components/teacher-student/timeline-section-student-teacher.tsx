"use client";

import * as React from "react";
import { AlertTriangle, ArrowRight, CalendarDays, CheckCircle2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Assignment } from "@/app/domain/entities/CourseEntities";
import { useAuth } from "@/app/context/AuthContext";
import { EmptyState } from "@/components/common";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuizSubmission, useTaskSubmission } from "@/components/teacher-student/hooks/submission-hooks";
import { useQuizDetail, useThisWeekQuizzes } from "@/app/presentation/hooks/calendar/quiz-hooks";
import { useThisWeekTasks } from "@/app/presentation/hooks/calendar/task-hooks";
import { useUserTeam } from "./hooks/team-hooks";
import { TimelineItem } from "./timeline/timeline-item";
import { TimelineDetail } from "./timeline/timeline-detail";
import {
  formatearParaAPI,
  obtenerInicioSemana,
  ordenarPorUrgencia,
  type DatosRecursoLineaTiempo,
} from "./timeline/timeline-utils";

export type { DatosRecursoLineaTiempo } from "./timeline/timeline-utils";

type QuizSubmitHandler = React.ComponentProps<typeof TimelineDetail>["onSubmitQuiz"];

interface PropsSeccionLineaTiempo {
  userId: string;
  userType: "teacher" | "student";
}

const ELEMENTOS_INICIALES = 4;

export function TimelineSection({ userId, userType }: PropsSeccionLineaTiempo) {
  const [mostrarTodo, setMostrarTodo] = React.useState(false);
  const [recursoActivo, setRecursoActivo] = React.useState<DatosRecursoLineaTiempo | null>(null);
  const [idRecursoSeleccionado, setIdRecursoSeleccionado] = React.useState<string | null>(null);
  const { user } = useAuth();
  const titleId = React.useId();

  const inicioSemana = React.useMemo(() => formatearParaAPI(obtenerInicioSemana()), []);

  const {
    data: tareas = [],
    isLoading: cargandoTareas,
    error: errorTareas,
    refetch: recargarTareas,
  } = useThisWeekTasks(userId, inicioSemana, userType);

  const {
    data: quizzes = [],
    isLoading: cargandoQuizzes,
    error: errorQuizzes,
    refetch: recargarQuizzes,
  } = useThisWeekQuizzes(userId, inicioSemana, userType);

  const { data: equipoUsuario } = useUserTeam(userId);

  const { data: detalleQuiz, isLoading: cargandoQuiz } = useQuizDetail(
    idRecursoSeleccionado && recursoActivo && "questions" in recursoActivo ? idRecursoSeleccionado : null,
    userType
  );

  const recursosOrdenados = React.useMemo(() => ordenarPorUrgencia([...tareas, ...quizzes]), [tareas, quizzes]);

  const handleVerDetalles = (item: DatosRecursoLineaTiempo) => {
    setRecursoActivo(item);
    setIdRecursoSeleccionado(item.id);
  };

  const handleCerrarModal = React.useCallback(() => {
    setRecursoActivo(null);
    setIdRecursoSeleccionado(null);
  }, []);

  const { submitTask: mutacionEnviarTarea, isSubmitting: enviandoTarea } = useTaskSubmission();
  const { submitQuiz: mutacionEnviarQuiz, isSubmitting: enviandoQuiz } = useQuizSubmission();

  const handleEnvioTarea = async (datosEnvio: { content: string; attachments: File[] }) => {
    if (!recursoActivo || !user?.id) return;

    try {
      const tarea = recursoActivo as Assignment;
      const tipoEnvio = tarea.deliveryMode === "TEAM" ? "TEAM" : "INDIVIDUAL";

      let idGrupo: string | undefined;
      if (tipoEnvio === "TEAM" && equipoUsuario) {
        idGrupo = equipoUsuario.teamId.id;
      }

      const parametrosEnvio = {
        assignmentId: recursoActivo.id,
        studentId: user.id,
        content: datosEnvio.content,
        attachments: datosEnvio.attachments,
        submissionType: tipoEnvio as "INDIVIDUAL" | "TEAM",
        ...(idGrupo && { groupId: idGrupo }),
      };

      await mutacionEnviarTarea.mutate(parametrosEnvio);
      handleCerrarModal();
    } catch (error) {
      console.error("Error al enviar la tarea:", error);
    }
  };

  const handleEnvioQuiz: QuizSubmitHandler = async (respuestas) => {
    if (!recursoActivo || !user?.id) return;

    try {
      await mutacionEnviarQuiz.mutateAsync({
        quizId: recursoActivo.id,
        studentId: user.id,
        answers: respuestas,
      });
      handleCerrarModal();
    } catch (error) {
      console.error("Error al enviar el quiz:", error);
    }
  };

  const recursosMostrados = mostrarTodo ? recursosOrdenados : recursosOrdenados.slice(0, ELEMENTOS_INICIALES);

  const rangoSemana = React.useMemo(() => {
    const inicio = obtenerInicioSemana();
    const fin = new Date(inicio);
    fin.setDate(inicio.getDate() + 6);
    const formato: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    return { inicio: inicio.toLocaleDateString("es-ES", formato), fin: fin.toLocaleDateString("es-ES", formato) };
  }, []);

  const cargando = cargandoTareas || cargandoQuizzes;
  const hayError = errorTareas || errorQuizzes;
  const hayMas = recursosOrdenados.length > ELEMENTOS_INICIALES;

  return (
    <>
      <section aria-labelledby={titleId} className="card-padded space-y-5">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <h2 id={titleId} className="flex items-center gap-2 text-heading text-foreground">
              <CalendarDays className="size-5 text-primary" aria-hidden="true" />
              {userType === "teacher" ? "Línea de tiempo docente" : "Mi línea de tiempo"}
            </h2>
            <p className="text-body text-muted-foreground">
              {rangoSemana.inicio} – {rangoSemana.fin}
              {!cargando && !hayError && (
                <> · {recursosOrdenados.length} {recursosOrdenados.length === 1 ? "actividad" : "actividades"}</>
              )}
            </p>
          </div>
          {hayMas && (
            <button
              type="button"
              className="btn-quiet btn-sm"
              onClick={() => setMostrarTodo(!mostrarTodo)}
              aria-expanded={mostrarTodo}
            >
              {mostrarTodo ? "Mostrar menos" : `Ver todo (${recursosOrdenados.length})`}
              <ArrowRight className={cn("size-4 transition-transform", mostrarTodo && "-rotate-90")} aria-hidden="true" />
            </button>
          )}
        </header>

        {cargando ? (
          <ul className="space-y-3" aria-label="Cargando actividades">
            {Array.from({ length: 3 }, (_, i) => (
              <li key={i} className="flex items-start gap-4 rounded-control border border-border p-4" aria-hidden="true">
                <Skeleton className="size-10 rounded-control" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </li>
            ))}
          </ul>
        ) : hayError ? (
          <EmptyState
            icon={AlertTriangle}
            tone="error"
            size="compact"
            title="No pudimos cargar tu línea de tiempo"
            description="Revisa tu conexión e inténtalo de nuevo."
            action={
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => {
                  recargarTareas();
                  recargarQuizzes();
                }}
              >
                <RefreshCw className="size-4" aria-hidden="true" /> Reintentar
              </button>
            }
          />
        ) : recursosOrdenados.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            size="compact"
            title="¡Todo al día esta semana!"
            description="No hay actividades pendientes para esta semana."
          />
        ) : (
          <ul className="space-y-3">
            {recursosMostrados.map((item) => (
              <li key={item.id}>
                <TimelineItem item={item} userType={userType} onOpen={handleVerDetalles} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {recursoActivo && (
        <TimelineDetail
          recurso={recursoActivo}
          userType={userType}
          userId={userId}
          detalleQuiz={detalleQuiz}
          cargandoQuiz={cargandoQuiz}
          onClose={handleCerrarModal}
          onSubmitTask={handleEnvioTarea}
          onSubmitQuiz={handleEnvioQuiz}
          enviandoTarea={enviandoTarea}
          enviandoQuiz={enviandoQuiz}
        />
      )}
    </>
  );
}
