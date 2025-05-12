"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"

export default function PracticeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobile, setIsMobile] = useState(false)
  
  // Check for mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Set initial value
    checkIfMobile()
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile)
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile)
    }
  }, [])

  return (
    <div className="flex h-screen bg-background">
      <Sidebar className="w-64 hidden md:flex" />
      <main className={`flex-1 overflow-auto p-6 relative ${isMobile ? 'pt-20' : ''}`}>
        {children}
      </main>
    </div>
  )
} 