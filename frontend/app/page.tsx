"use client";

import { useEffect } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { TimelineSection } from "@/components/teacher-student/timeline-section-student-teacher"
import { CoursesSectionTeacher } from "@/components/teacher/courses-section-teacher"
import { CoursesSectionStudent } from "@/components/student/courses-section-student"
import { useAuth } from "./context/AuthContext"

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/auth/login'
    }
  }, [isAuthenticated, isLoading])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const isTeacher = user?.role === 'teacher'
  const firstName = user?.name?.split(' ')[0] || 'Usuario'

  return (
    <AppShell
      title="Tablero"
      description={`Hola, ${firstName}. ${isTeacher ? "Gestiona tus cursos y estudiantes." : "Este es tu progreso de aprendizaje."}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TimelineSection
            userId={user?.id || "user-001"}
            userType={isTeacher ? 'teacher' : 'student'}
          />
        </div>
        <div className="lg:col-span-1">
          {isTeacher ? (
            <CoursesSectionTeacher teacherId={user.id} key={user.id} />
          ) : (
            <CoursesSectionStudent studentId={user?.id || "user-001"} />
          )}
        </div>
      </div>
    </AppShell>
  )
}
