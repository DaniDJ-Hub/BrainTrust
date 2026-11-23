import { ArrowRight, BookOpen, GraduationCap, Pencil, Trash2 } from "lucide-react"
import type { Course } from "@/app/domain/entities/CourseEntities"
import type { CourseId } from "@/app/domain/valueObjects"

interface CourseCardProps {
  course: Course
  isStudent: boolean
  onEnter: (courseId: CourseId) => void
  onEdit: (courseId: CourseId) => void
  onDelete: (course: Course) => void
}

export function CourseCard({ course, isStudent, onEnter, onEdit, onDelete }: CourseCardProps) {
  return (
    <article className="card-base flex flex-col overflow-hidden">
      <div className="relative h-32 w-full bg-secondary">
        {course.urlImage ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote course images (Cloudinary) without next/image config
          <img src={course.urlImage} alt="" className="absolute inset-0 size-full object-cover" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-secondary-foreground/60" aria-hidden="true">
            <BookOpen className="size-10" />
          </span>
        )}
        <span className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-neutral-900/60 to-transparent" aria-hidden="true" />
        {(course.grade || course.group) && (
          <span className="badge-highlight absolute right-3 top-3">
            <GraduationCap className="size-3.5" aria-hidden="true" />
            {[course.grade, course.group].filter(Boolean).join(" · ")}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-1">
          <p className="text-overline uppercase text-muted-foreground">
            {course.code}
            {course.group ? ` · Grupo ${course.group}` : ""}
          </p>
          <h2 className="text-subheading text-foreground">{course.name}</h2>
          {course.description && <p className="line-clamp-2 text-body text-muted-foreground">{course.description}</p>}
        </div>

        <div className="mt-auto flex items-center gap-2 border-t border-border pt-4">
          <button type="button" className="btn-primary flex-1" onClick={() => onEnter(course.id)}>
            Ingresar al curso <ArrowRight className="size-4" aria-hidden="true" />
          </button>
          {!isStudent && (
            <>
              <button
                type="button"
                className="icon-btn-primary"
                onClick={() => onEdit(course.id)}
                aria-label={`Editar ${course.name}`}
              >
                <Pencil className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="icon-btn-destructive"
                onClick={() => onDelete(course)}
                aria-label={`Eliminar ${course.name}`}
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  )
}
