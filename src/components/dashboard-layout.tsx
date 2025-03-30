"use client"

import { Sidebar } from "@/components/sidebar"
import { ProtectedRoute } from "@/components/protected-route"

interface DashboardLayoutProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function DashboardLayout({ children, requireAdmin = false }: DashboardLayoutProps) {
  return (
    <ProtectedRoute requireAdmin={requireAdmin}>
      <div className="flex h-screen bg-background">
        <Sidebar className="w-64 hidden md:flex" />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
} 