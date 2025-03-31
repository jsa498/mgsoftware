import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the path the user is trying to access
  const path = request.nextUrl.pathname
  
  // Paths that are always accessible
  const publicPaths = ['/auth/login']
  
  // Check if the path is public or not
  const isPublicPath = publicPaths.includes(path)
  
  // Get the session cookie that would contain user info
  const isAuthenticated = request.cookies.has('auth_session')
  
  // Extract user role from cookie if possible (in production, you might use JWT or secure cookies)
  const userRole = request.cookies.get('user_role')?.value || 'student' // default to student
  
  // If user is not authenticated and trying to access a protected route, redirect to login
  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  
  // If user is authenticated and trying to access login page, redirect to dashboard
  if (isAuthenticated && isPublicPath) {
    // Redirect to appropriate dashboard based on role
    const dashboardPath = userRole === 'admin' ? '/' : '/student-dashboard'
    return NextResponse.redirect(new URL(dashboardPath, request.url))
  }
  
  // Role-based routing for authenticated users
  if (isAuthenticated) {
    // Admin tries to access student dashboard
    if (userRole === 'admin' && path === '/student-dashboard') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    // Student tries to access admin dashboard (root path)
    if (userRole === 'student' && path === '/' && !path.startsWith('/student-dashboard')) {
      return NextResponse.redirect(new URL('/student-dashboard', request.url))
    }
  }
  
  return NextResponse.next()
}

// Configure which paths this middleware should run on
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|logonew.ico).*)',
  ],
} 