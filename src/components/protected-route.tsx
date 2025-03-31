"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAdmin, isAuthenticated, isStudent } from '@/lib/auth'
import { Skeleton } from '@/components/ui/skeleton'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
  requireStudent?: boolean
}

export function ProtectedRoute({ 
  children, 
  requireAdmin = false,
  requireStudent = false
}: ProtectedRouteProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication...")
        // Check if user is authenticated
        const authenticated = isAuthenticated()
        console.log("Is authenticated:", authenticated)
        
        // Check authorization based on role requirements
        let authorized = authenticated
        
        if (requireAdmin) {
          authorized = isAdmin()
          console.log("Admin required, is admin:", authorized)
        } else if (requireStudent) {
          authorized = isStudent()
          console.log("Student required, is student:", authorized)
        }
        
        if (!authenticated) {
          console.log("Not authenticated, redirecting to login...")
          router.push('/auth/login')
        } else if (!authorized) {
          // If user is authenticated but not authorized (wrong role)
          console.log("Not authorized, redirecting to appropriate dashboard...")
          if (requireAdmin) {
            // Student trying to access admin page
            router.push('/student-dashboard')
          } else if (requireStudent) {
            // Admin trying to access student page
            router.push('/')
          } else {
            // Default redirect
            router.push('/')
          }
        } else {
          console.log("User is authorized")
          setIsAuthorized(true)
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error("Auth check error:", error)
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [router, requireAdmin, requireStudent])

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-3 p-6">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    )
  }

  return isAuthorized ? <>{children}</> : null
} 