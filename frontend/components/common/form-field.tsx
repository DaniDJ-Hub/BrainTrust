"use client"

import { useId } from "react"
import { cn } from "@/lib/utils"

/** Props to spread on the control so label, hint and error are announced. */
export interface FormFieldControlProps {
  id: string
  "aria-describedby"?: string
  "aria-invalid"?: true
  "aria-required"?: true
}

interface FormFieldProps {
  label: string
  /** Render prop: `{(field) => <Input {...field} {...register("name")} />}` */
  children: (field: FormFieldControlProps) => React.ReactNode
  hint?: string
  error?: string
  required?: boolean
  /** Use your own id when the control needs a stable one. */
  id?: string
  /** Visually hide the label (it stays for screen readers). */
  hideLabel?: boolean
  className?: string
}

export function FormField({ label, children, hint, error, required, id, hideLabel, className }: FormFieldProps) {
  const generatedId = useId()
  const controlId = id ?? `field-${generatedId}`
  const hintId = hint ? `${controlId}-hint` : undefined
  const errorId = error ? `${controlId}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined

  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={controlId} className={cn("block text-body font-medium text-foreground", hideLabel && "sr-only")}>
        {label}
        {required && (
          <>
            <span className="ml-0.5 text-destructive" aria-hidden="true">*</span>
            <span className="sr-only"> (obligatorio)</span>
          </>
        )}
      </label>

      {children({
        id: controlId,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
        "aria-required": required ? true : undefined,
      })}

      {hint && (
        <p id={hintId} className="text-caption font-normal text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-caption text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
