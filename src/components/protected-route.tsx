"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAdmin, isAuthenticated } from '@/lib/auth'
import { Skeleton } from '@/components/ui/skeleton'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
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
        
        // If requireAdmin is true, check if user is an admin
        const authorized = requireAdmin ? isAdmin() : authenticated
        console.log("Is authorized:", authorized)
        
        if (!authenticated) {
          console.log("Not authenticated, redirecting to login...")
          router.push('/auth/login')
        } else if (!authorized) {
          // If user is authenticated but not authorized (not admin when admin is required)
          console.log("Not authorized, redirecting to home...")
          router.push('/')
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
  }, [router, requireAdmin])

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