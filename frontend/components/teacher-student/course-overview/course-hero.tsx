import Image from "next/image"
import { Layers, Users } from "lucide-react"
import { PageHeader } from "@/components/common"

interface CourseHeroProps {
  code?: string
  name: string
  description?: string
  imageUrl?: string
  studentCount: number
  unitCount: number
}

export function CourseHero({ code, name, description, imageUrl, studentCount, unitCount }: CourseHeroProps) {
  return (
    <section className="card-base overflow-hidden">
      {imageUrl && (
        <div className="relative h-36 w-full sm:h-48">
          <Image src={imageUrl} alt="" fill className="object-cover" sizes="100vw" priority />
        </div>
      )}
      <div className="space-y-4 p-5 sm:p-6">
        <PageHeader eyebrow={code} title={name} description={description} />
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-body text-muted-foreground">
          <li className="inline-flex items-center gap-2">
            <Users className="size-4 text-primary" aria-hidden="true" />
            {studentCount} {studentCount === 1 ? "estudiante" : "estudiantes"}
          </li>
          <li className="inline-flex items-center gap-2">
            <Layers className="size-4 text-primary" aria-hidden="true" />
            {unitCount} {unitCount === 1 ? "unidad" : "unidades"}
          </li>
        </ul>
      </div>
    </section>
  )
}
