"use client"

import { Sidebar } from "@/components/sidebar"
import { ProtectedRoute } from "@/components/protected-route"
import { useEffect, useState } from "react"

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
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    
    return () => {
      window.removeEventListener('resize', checkIfMobile)
    }
  }, [])

  return (
    <ProtectedRoute requireAdmin={requireAdmin} requireStudent={requireStudent}>
      <div className="flex h-screen bg-background">
        <Sidebar className="w-64 hidden md:flex" />
        <main className={`flex-1 overflow-auto p-6 relative ${isMobile ? 'pt-20' : ''}`}>
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
} 