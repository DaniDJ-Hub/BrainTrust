import React from 'react';
import { Paperclip } from "lucide-react";
import { ConfirmDialog } from "@/components/common";

interface TaskExitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSubmitted: boolean;
  onConfirm: () => void;
}

export const TaskExitDialog: React.FC<TaskExitDialogProps> = ({ open, onOpenChange, isSubmitted, onConfirm }) => (
  <ConfirmDialog
    open={open}
    onOpenChange={onOpenChange}
    tone={isSubmitted ? 'default' : 'destructive'}
    title="¿Salir de la tarea?"
    description={isSubmitted ? 'Volverás a la vista anterior.' : 'Perderás lo que hayas escrito o adjuntado y no hayas entregado.'}
    confirmLabel="Salir"
    cancelLabel="Seguir aquí"
    onConfirm={onConfirm}
  />
);

interface TaskSubmitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  files: File[];
  onConfirm: () => Promise<void>;
}

export const TaskSubmitDialog: React.FC<TaskSubmitDialogProps> = ({ open, onOpenChange, files, onConfirm }) => (
  <ConfirmDialog
    open={open}
    onOpenChange={onOpenChange}
    title="¿Entregar la tarea?"
    description={
      <>
        <span className="block">No podrás hacer cambios después de entregarla.</span>
        {files.length > 0 && (
          <span className="mt-3 block rounded-control border border-border bg-muted/50 p-3">
            <span className="block text-body font-semibold text-foreground">Archivos a subir:</span>
            {files.map((file, index) => (
              <span key={index} className="mt-1 flex items-center gap-1.5 text-caption font-normal">
                <Paperclip className="size-3.5 shrink-0" aria-hidden="true" />
                {file.name}
              </span>
            ))}
          </span>
        )}
      </>
    }
    confirmLabel="Entregar tarea"
    cancelLabel="Revisar entrega"
    onConfirm={onConfirm}
  />
);

interface TaskEmptyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

/** Safety net: the submit button is disabled when there is no content, so this rarely shows. */
export const TaskEmptyDialog: React.FC<TaskEmptyDialogProps> = ({ open, onOpenChange, onConfirm }) => (
  <ConfirmDialog
    open={open}
    onOpenChange={onOpenChange}
    tone="destructive"
    title="¿Enviar sin contenido?"
    description="No escribiste una respuesta ni adjuntaste archivos."
    confirmLabel="Enviar de todos modos"
    cancelLabel="Volver"
    onConfirm={onConfirm}
  />
);
