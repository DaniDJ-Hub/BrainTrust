import React from 'react';
import { AlertCircle, Loader2, Paperclip, Send } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TaskExitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSubmitted: boolean;
  onConfirm: () => void;
}

export const TaskExitDialog: React.FC<TaskExitDialogProps> = ({ open, onOpenChange, isSubmitted, onConfirm }) => (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-card rounded-3xl border border-border shadow-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-foreground">
            <span className="w-8 h-8 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-4 h-4 text-destructive" />
            </span>
            ¿Salir de la Tarea?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-sm">
            {isSubmitted
              ? '¿Estás seguro de que deseas salir de esta vista de envío?'
              : 'Cualquier cambio no guardado se perderá. ¿Estás seguro de que deseas salir?'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-xl border-border text-muted-foreground hover:text-foreground hover:bg-muted/50">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="rounded-xl bg-destructive text-destructive-foreground hover:opacity-90"
          >
            Salir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
);

interface TaskSubmitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  files: File[];
  isSubmitting: boolean;
  onConfirm: () => void;
}

export const TaskSubmitDialog: React.FC<TaskSubmitDialogProps> = ({ open, onOpenChange, files, isSubmitting, onConfirm }) => (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-card rounded-3xl border border-border shadow-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-foreground">
            <span className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Send className="w-4 h-4 text-primary" />
            </span>
            ¿Enviar Tarea?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-sm">
            ¿Estás seguro de que deseas enviar esta tarea? No podrás hacer cambios después del envío.
          </AlertDialogDescription>
          {files.length > 0 && (
            <div className="mt-3 p-3 bg-muted/30 rounded-xl border border-border text-sm text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">Archivos a subir:</p>
              <ul className="space-y-0.5">
                {files.map((file, index) => (
                  <li key={index} className="flex items-center gap-1.5 text-xs">
                    <Paperclip className="w-3 h-3 flex-shrink-0" />
                    {file.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-xl border-border text-muted-foreground hover:text-foreground hover:bg-muted/50">
            Revisar Envío
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isSubmitting}
            className="rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40"
          >
            {isSubmitting
              ? <><Loader2 className="w-4 h-4 animate-spin mr-1.5" />Enviando...</>
              : 'Enviar Tarea'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
);
