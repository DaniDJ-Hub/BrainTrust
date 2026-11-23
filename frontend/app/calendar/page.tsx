"use client";

import { AppShell } from "@/components/layout/app-shell";
import { CalendarView } from "@/components/teacher-student/calendar-teacher-student";
import { RouteGuard } from "../auth/RouteGuard";
import { useAuth } from "../context/AuthContext";

export default function CalendarPage() {
  const { user } = useAuth();

  return (
    <RouteGuard>
      <AppShell title="Calendario" description="Tus próximas entregas y evaluaciones." padding="none">
        <CalendarView
          userId={user?.id || "user-001"}
          userType={user?.role === 'teacher' ? 'teacher' : 'student'}
        />
      </AppShell>
    </RouteGuard>
  );
}
