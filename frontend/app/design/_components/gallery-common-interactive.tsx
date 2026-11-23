"use client"

import { useState } from "react"
import { Inbox, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  ConfirmDialog,
  DataTable,
  EmptyState,
  FormField,
  StatusBadge,
  useConfirm,
  type DataTableColumn,
} from "@/components/common"
import type { SubmissionStatus } from "@/app/domain/valueObjects/CourseValues"
import { ShowcaseGroup, ShowcaseSection } from "./showcase-section"

interface SampleSubmission {
  id: string
  student: string
  submittedAt: string
  status: SubmissionStatus | "MISSING"
  grade: string
}

const ROWS: SampleSubmission[] = [
  { id: "1", student: "Ana López Ruiz", submittedAt: "12 mar, 18:40", status: "GRADED", grade: "95.0" },
  { id: "2", student: "Carlos Méndez Soto", submittedAt: "13 mar, 09:15", status: "LATE_SUBMITTED", grade: "—" },
  { id: "3", student: "Lucía Herrera", submittedAt: "—", status: "MISSING", grade: "0.0" },
  { id: "4", student: "Diego Ramírez", submittedAt: "11 mar, 22:03", status: "SUBMITTED", grade: "—" },
]

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

type TableMode = "data" | "loading" | "empty"

export function GalleryCommonInteractive() {
  const confirm = useConfirm()
  const [mode, setMode] = useState<TableMode>("data")
  const [asyncOpen, setAsyncOpen] = useState(false)
  const [failNext, setFailNext] = useState(false)
  const [title, setTitle] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const columns: DataTableColumn<SampleSubmission>[] = [
    { id: "student", header: "Alumno", primary: true, cell: (r) => r.student },
    { id: "date", header: "Entregado", cell: (r) => <span className="text-muted-foreground">{r.submittedAt}</span> },
    { id: "status", header: "Estado", cell: (r) => <StatusBadge kind="submission" status={r.status} /> },
    { id: "grade", header: "Calificación", align: "right", cell: (r) => r.grade },
    {
      id: "actions",
      header: "Acciones",
      actions: true,
      align: "right",
      cell: (r) => (
        <>
          <button type="button" className="icon-btn-primary" aria-label={`Calificar a ${r.student}`}>
            <Pencil className="size-4" />
          </button>
          <button
            type="button"
            className="icon-btn-destructive"
            aria-label={`Eliminar entrega de ${r.student}`}
            onClick={async () => {
              const ok = await confirm({
                title: "¿Eliminar esta entrega?",
                description: `Se borrará la entrega de ${r.student} y su archivo. Esta acción no se puede deshacer.`,
                confirmLabel: "Eliminar entrega",
                tone: "destructive",
              })
              if (ok) toast.success("Entrega eliminada (demo)")
            }}
          >
            <Trash2 className="size-4" />
          </button>
        </>
      ),
    },
  ]

  const titleError = submitted && title.trim().length < 3 ? "El título debe tener al menos 3 caracteres." : undefined

  return (
    <ShowcaseSection
      id="common-interactive"
      title="Componentes base · datos y diálogos"
      description="DataTable (tabla en desktop, cards bajo 1024px), FormField y ConfirmDialog / useConfirm. Reduce el ancho de la ventana para ver las cards."
    >
      <ShowcaseGroup label="DataTable · estados">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Estado de la tabla">
          {(["data", "loading", "empty"] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
              className={mode === m ? "btn-primary btn-sm" : "btn-secondary btn-sm"}
            >
              {m === "data" ? "Con datos" : m === "loading" ? "Cargando" : "Vacía"}
            </button>
          ))}
        </div>
        <DataTable
          caption="Entregas de la unidad 2"
          columns={columns}
          rows={mode === "data" ? ROWS : []}
          getRowId={(r) => r.id}
          isLoading={mode === "loading"}
          emptyState={
            <EmptyState icon={Inbox} size="compact" title="Sin entregas todavía" description="Aparecerán aquí cuando los alumnos entreguen." />
          }
        />
      </ShowcaseGroup>

      <div className="grid gap-4 lg:grid-cols-2">
        <ShowcaseGroup label="FormField · etiqueta, ayuda, error y obligatorio">
          <form
            className="space-y-4"
            noValidate
            onSubmit={(e) => {
              e.preventDefault()
              setSubmitted(true)
            }}
          >
            <FormField label="Título de la tarea" required hint="Visible para los alumnos." error={titleError}>
              {(field) => <Input {...field} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej. Ensayo de la unidad 2" />}
            </FormField>
            <FormField label="Instrucciones" hint="Opcional. Máximo 2,000 caracteres.">
              {(field) => <Textarea {...field} rows={3} />}
            </FormField>
            <FormField label="Puntos" error="Los puntos deben ser un número entre 0 y 100.">
              {(field) => <input {...field} className="input-field" defaultValue="120" inputMode="numeric" />}
            </FormField>
            <button type="submit" className="btn-primary">Guardar tarea</button>
          </form>
        </ShowcaseGroup>

        <ShowcaseGroup label="ConfirmDialog · reemplazo de confirm()">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn-secondary"
                onClick={async () => {
                  const ok = await confirm({
                    title: "¿Publicar la unidad?",
                    description: "Los alumnos inscritos podrán ver sus recursos de inmediato.",
                    confirmLabel: "Publicar unidad",
                  })
                  toast(ok ? "Unidad publicada (demo)" : "Cancelado")
                }}
              >
                useConfirm · normal
              </button>
              <button
                type="button"
                className="btn-destructive"
                onClick={async () => {
                  const ok = await confirm({
                    title: "¿Eliminar todos los enlaces?",
                    description: "Se quitarán los 4 enlaces de esta tarea.",
                    confirmLabel: "Eliminar enlaces",
                    tone: "destructive",
                  })
                  toast(ok ? "Enlaces eliminados (demo)" : "Cancelado")
                }}
              >
                useConfirm · destructivo
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-3 border-t border-border pt-3">
              <button type="button" className="btn-secondary" onClick={() => setAsyncOpen(true)}>
                Acción asíncrona
              </button>
              <label className="flex items-center gap-2 text-body text-foreground">
                <input type="checkbox" checked={failNext} onChange={(e) => setFailNext(e.target.checked)} className="size-4 accent-primary" />
                Simular error del servidor
              </label>
            </div>
            <p className="text-caption font-normal text-muted-foreground">
              Con acción asíncrona el diálogo muestra el spinner, no se puede cerrar mientras espera y solo se cierra si todo sale bien.
            </p>
          </div>
          <ConfirmDialog
            open={asyncOpen}
            onOpenChange={setAsyncOpen}
            title="¿Enviar el quiz?"
            description="Ya no podrás cambiar tus respuestas."
            confirmLabel="Enviar quiz"
            onConfirm={async () => {
              await wait(1200)
              if (failNext) {
                toast.error("No se pudo enviar. Inténtalo de nuevo.")
                throw new Error("demo")
              }
              toast.success("Quiz enviado (demo)")
            }}
          />
        </ShowcaseGroup>
      </div>
    </ShowcaseSection>
  )
}
