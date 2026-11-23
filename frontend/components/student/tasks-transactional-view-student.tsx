"use client";
import React, { useState } from "react";
import { BookOpen, CheckCircle2, Monitor } from "lucide-react";
import { getCloudinaryDownloadUrl } from "@/app/utils/cloudinary/cloudinary-pdf";
import { TaskSubmissionView } from "@/components/student/quiz-view-tasks-student";
import { useStudentTaskSubmission } from "@/components/teacher-student/hooks/submission-hooks";
import { Assignment } from "@/app/domain/entities";
import { ConfirmDialog } from "@/components/common";
import { Skeleton } from "@/components/ui/skeleton";

interface StudentTaskViewProps {
  assignment: Assignment;
  studentId: string;
  onSubmit: (submission: {
    content: string;
    attachments: File[];
  }) => Promise<void>;
  onExit: () => void;
  isSubmitting: boolean;
  /** "h2" when rendered inside an overlay. */
  headingLevel?: "h1" | "h2";
}

const NOTEBOOK_CHECKLIST = [
  "Completaste todo el trabajo en tu cuaderno",
  "Tu cuaderno está listo para que lo revise el profesor",
  "Revisaste tu trabajo una vez más",
];

export function VistaTareaEstudiante({
  assignment,
  studentId,
  onSubmit,
  onExit,
  isSubmitting,
  headingLevel = "h1",
}: StudentTaskViewProps) {
  const { data: existingSubmission, isLoading } = useStudentTaskSubmission(
    assignment.id,
    studentId,
  );

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingSubmission, setPendingSubmission] = useState<{
    content: string;
    attachments: File[];
  } | null>(null);

  const isNotebookSubmission = assignment.submissionFormat === "NOTEBOOK";

  const handleSubmitAttempt = async (submission: {
    content: string;
    attachments: File[];
  }) => {
    if (isNotebookSubmission) {
      setPendingSubmission(submission);
      setShowConfirmModal(true);
    } else {
      await onSubmit(submission);
    }
  };

  const handleConfirmSubmission = async () => {
    if (pendingSubmission) {
      await onSubmit(pendingSubmission);
      setPendingSubmission(null);
    }
  };

  const handleConfirmOpenChange = (open: boolean) => {
    setShowConfirmModal(open);
    if (!open) setPendingSubmission(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-4 sm:p-6" aria-busy="true" aria-label="Cargando tarea">
        <Skeleton className="h-16 w-full rounded-control" />
        <Skeleton className="h-10 w-2/3" />
        <div className="grid gap-6 lg:grid-cols-4">
          <Skeleton className="h-96 rounded-surface lg:col-span-3" />
          <Skeleton className="h-64 rounded-surface" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="px-4 pt-4 sm:px-6 sm:pt-6">
          {isNotebookSubmission ? (
            <div className="flex items-start gap-3 rounded-control border border-warning/30 bg-warning-soft p-4 text-warning-soft-foreground">
              <BookOpen className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <div className="space-y-1">
                <p className="text-body font-semibold">Entrega en cuaderno</p>
                <p className="text-caption font-normal">
                  Esta tarea se entrega en tu cuaderno físico. Termina el trabajo en tu cuaderno antes de
                  marcarla como entregada; tu profesor lo revisará en clase.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 rounded-control border border-info/30 bg-info-soft p-4 text-info-soft-foreground">
              <Monitor className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <div className="space-y-1">
                <p className="text-body font-semibold">Entrega digital</p>
                <p className="text-caption font-normal">Escribe tu respuesta o sube archivos a continuación.</p>
              </div>
            </div>
          )}
        </div>

        <TaskSubmissionView
          assignment={assignment}
          existingSubmission={existingSubmission || undefined}
          onSubmit={handleSubmitAttempt}
          onDownloadAttachment={(attachment) => {
            if (attachment.storagePath) window.open(getCloudinaryDownloadUrl(attachment.storagePath), "_blank");
          }}
          isSubmitting={isSubmitting}
          onExit={onExit}
          headingLevel={headingLevel}
        />
      </div>

      <ConfirmDialog
        open={showConfirmModal}
        onOpenChange={handleConfirmOpenChange}
        title="¿Confirmas la entrega en cuaderno?"
        description={
          <>
            <span className="block">Antes de continuar, confirma que:</span>
            {NOTEBOOK_CHECKLIST.map((item) => (
              <span key={item} className="mt-1.5 flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                {item}
              </span>
            ))}
            <span className="mt-3 block">Tu profesor recibirá un aviso para revisar tu cuaderno en clase.</span>
          </>
        }
        confirmLabel="Sí, entregar"
        cancelLabel="Revisar de nuevo"
        onConfirm={handleConfirmSubmission}
      />
    </>
  );
}
