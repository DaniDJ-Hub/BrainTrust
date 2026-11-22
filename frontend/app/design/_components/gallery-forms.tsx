"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShowcaseGroup, ShowcaseSection } from "./showcase-section"

export function GalleryForms() {
  return (
    <ShowcaseSection id="formularios" title="Formularios" description="Primitivas de shadcn frente a las clases input-field / select-field.">
      <div className="grid gap-4 lg:grid-cols-2">
        <ShowcaseGroup label="shadcn">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="ds-title">Título de la tarea</Label>
              <Input id="ds-title" placeholder="Ej. Ensayo de la unidad 2" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ds-error">Puntos</Label>
              <Input id="ds-error" defaultValue="-5" aria-invalid="true" aria-describedby="ds-error-msg" />
              <p id="ds-error-msg" role="alert" className="text-xs text-destructive">
                Los puntos deben ser un número positivo.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ds-disabled">Campo deshabilitado</Label>
              <Input id="ds-disabled" disabled defaultValue="No editable" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ds-select">Unidad</Label>
              <Select>
                <SelectTrigger id="ds-select" className="w-full">
                  <SelectValue placeholder="Selecciona una unidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Unidad 1</SelectItem>
                  <SelectItem value="2">Unidad 2</SelectItem>
                  <SelectItem value="3">Unidad 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ds-desc">Instrucciones</Label>
              <Textarea id="ds-desc" placeholder="Describe lo que deben entregar…" />
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Checkbox id="ds-late" defaultChecked />
                <Label htmlFor="ds-late">Permitir entregas tardías</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="ds-visible" />
                <Label htmlFor="ds-visible">Visible para alumnos</Label>
              </div>
            </div>
          </div>
        </ShowcaseGroup>

        <ShowcaseGroup label="Clases utilitarias">
          <div className="space-y-4">
            <div>
              <label htmlFor="ds-u-email" className="form-label">Correo electrónico</label>
              <input id="ds-u-email" type="email" className="input-field" placeholder="tu@correo.com" />
            </div>
            <div>
              <label htmlFor="ds-u-disabled" className="form-label">Deshabilitado</label>
              <input id="ds-u-disabled" className="input-field" disabled defaultValue="No editable" />
            </div>
            <div>
              <label htmlFor="ds-u-role" className="form-label">Rol</label>
              <select id="ds-u-role" className="select-field" defaultValue="student">
                <option value="student">Estudiante</option>
                <option value="teacher">Profesor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>
        </ShowcaseGroup>
      </div>
    </ShowcaseSection>
  )
}
