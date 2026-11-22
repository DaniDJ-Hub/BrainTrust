import { AlertCircle, BookOpen, Info, Pencil, Trash2, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { ShowcaseGroup, ShowcaseSection } from "./showcase-section"

const SAMPLE_ROWS = [
  { name: "Ana López Ruiz", task: "Ensayo unidad 2", date: "12 mar", status: "badge-success", label: "Entregado", grade: "95.0" },
  { name: "Carlos Méndez", task: "Ensayo unidad 2", date: "13 mar", status: "badge-accent", label: "Tarde", grade: "80.0" },
  { name: "Lucía Herrera", task: "Ensayo unidad 2", date: "—", status: "badge-destructive", label: "Sin entregar", grade: "—" },
]

export function GalleryData() {
  return (
    <ShowcaseSection id="datos" title="Cards, tablas y feedback" description="Contenedores y estados de carga, vacío y error.">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Card (shadcn)</CardTitle>
            <CardDescription>Programación Web · Grupo A</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={64} aria-label="Avance del curso" />
            <p className="mt-2 text-xs text-muted-foreground">64% completado</p>
          </CardContent>
        </Card>
        <div className="card-padded space-y-2">
          <div className="icon-badge">
            <BookOpen className="h-4 w-4 text-primary" />
          </div>
          <p className="text-base font-semibold text-foreground">.card-padded</p>
          <p className="text-sm text-muted-foreground">Clase utilitaria con icon-badge.</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="text-xs font-medium">Alumnos inscritos</span>
          </div>
          <p className="text-3xl font-bold text-foreground tabular-nums">128</p>
          <p className="text-xs text-muted-foreground">.stat-card</p>
        </div>
      </div>

      <ShowcaseGroup label="Table (shadcn) con datos de ejemplo">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Alumno</TableHead>
              <TableHead>Actividad</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Calificación</TableHead>
              <TableHead className="text-right">
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SAMPLE_ROWS.map((row) => (
              <TableRow key={row.name}>
                <TableCell className="font-semibold">{row.name}</TableCell>
                <TableCell>{row.task}</TableCell>
                <TableCell className="text-muted-foreground">{row.date}</TableCell>
                <TableCell>
                  <span className={row.status}>{row.label}</span>
                </TableCell>
                <TableCell className="text-right tabular-nums">{row.grade}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" aria-label={`Calificar a ${row.name}`}>
                    <Pencil />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label={`Eliminar entrega de ${row.name}`}>
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ShowcaseGroup>

      <div className="grid gap-4 lg:grid-cols-3">
        <ShowcaseGroup label="Alertas">
          <div className="space-y-3">
            <Alert>
              <Info />
              <AlertTitle>Información</AlertTitle>
              <AlertDescription>La tarea cierra el 15 de marzo.</AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>No se pudo guardar la calificación.</AlertDescription>
            </Alert>
          </div>
        </ShowcaseGroup>
        <ShowcaseGroup label="Carga (skeleton)">
          <div className="space-y-3" aria-hidden="true">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-24 w-full" />
          </div>
        </ShowcaseGroup>
        <ShowcaseGroup label="Estado vacío">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <BookOpen />
              </EmptyMedia>
              <EmptyTitle>Sin actividades</EmptyTitle>
              <EmptyDescription>Cuando el profesor publique tareas aparecerán aquí.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </ShowcaseGroup>
      </div>
    </ShowcaseSection>
  )
}
