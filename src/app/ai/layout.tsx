"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"

export default function AILayout({
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
    <div className="flex h-screen overflow-hidden">
      <Sidebar className="hidden md:flex w-64" />
      <main className={`flex-1 overflow-y-auto ${isMobile ? 'pt-20' : ''}`}>
        {children}
      </main>
    </div>
  )
} 