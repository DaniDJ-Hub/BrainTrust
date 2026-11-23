"use client"

import { useState } from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
import { AlertTriangle, HelpCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export type ConfirmTone = "default" | "destructive"

export interface ConfirmOptions {
  title: string
  description?: React.ReactNode
  /** Specific verb: "Eliminar unidad", not "Aceptar". */
  confirmLabel?: string
  cancelLabel?: string
  tone?: ConfirmTone
}

interface ConfirmDialogProps extends ConfirmOptions {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** If it returns a promise the dialog shows a spinner and stays open until it settles; it closes only on success. */
  onConfirm: () => void | Promise<void>
}

const TONE = {
  default: { icon: HelpCircle, iconClass: "bg-secondary text-secondary-foreground", button: "btn-primary" },
  destructive: { icon: AlertTriangle, iconClass: "bg-destructive-soft text-destructive-soft-foreground", button: "btn-destructive" },
} as const

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  tone = "default",
}: ConfirmDialogProps) {
  const [isPending, setIsPending] = useState(false)
  const { icon: Icon, iconClass, button } = TONE[tone]

  const handleOpenChange = (next: boolean) => {
    if (isPending) return
    onOpenChange(next)
  }

  const handleConfirm = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    try {
      setIsPending(true)
      await onConfirm()
      onOpenChange(false)
    } catch {
      // The caller reports the error (toast/inline); keep the dialog open so the user can retry.
    } finally {
      setIsPending(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent
        className="bg-popover text-popover-foreground rounded-surface border-border shadow-lg sm:max-w-md"
        onEscapeKeyDown={(event) => isPending && event.preventDefault()}
      >
        <AlertDialogHeader className="flex-row items-start gap-4 text-left">
          <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-control", iconClass)}>
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <div className="space-y-1.5 pt-0.5">
            <AlertDialogTitle className="text-heading">{title}</AlertDialogTitle>
            {description && (
              <AlertDialogDescription className="text-body text-muted-foreground">{description}</AlertDialogDescription>
            )}
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3">
          <AlertDialogPrimitive.Cancel asChild>
            <button type="button" className="btn-secondary" disabled={isPending}>
              {cancelLabel}
            </button>
          </AlertDialogPrimitive.Cancel>
          <AlertDialogPrimitive.Action asChild>
            <button type="button" className={button} onClick={handleConfirm} aria-busy={isPending || undefined}>
              {isPending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
              {confirmLabel}
            </button>
          </AlertDialogPrimitive.Action>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
