"use client";

import { AppShell } from "@/components/layout/app-shell";
import { CourseDashboard } from "@/components/teacher-student/courses-dashboard-main-student-teacher";

export default function CoursesPage() {
  return (
    <AppShell padding="none">
      <CourseDashboard />
    </AppShell>
  );
}
