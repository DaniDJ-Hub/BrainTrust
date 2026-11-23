"use client"

import { redirect } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"
import { AppShell } from "@/components/layout/app-shell"
import { normalizeRole } from "@/lib/roles"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (normalizeRole(user?.role) !== 'admin') {
        redirect("/")
    }

    return (
        <AppShell padding="none">
            <div className="py-6">{children}</div>
        </AppShell>
    )
}
