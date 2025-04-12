"use client"

import { Sidebar } from "@/components/sidebar"
import { ProtectedRoute } from "@/components/protected-route"

interface DashboardLayoutProps {
  children: React.ReactNode
  requireAdmin?: boolean
  requireStudent?: boolean
}

export function DashboardLayout({ 
  children, 
  requireAdmin = false,
  requireStudent = false 
}: DashboardLayoutProps) {
  return (
    <ProtectedRoute requireAdmin={requireAdmin} requireStudent={requireStudent}>
      <div className="flex h-screen bg-background">
        <Sidebar className="w-64 hidden md:flex" />
        <main className="flex-1 overflow-auto p-6 relative">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
} 