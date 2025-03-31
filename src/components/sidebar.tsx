"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  LayoutDashboard,
  Users, 
  Users2, 
  Trophy, 
  BookOpen, 
  MessageSquare, 
  Calendar, 
  ClipboardList,
  LogOut,
  Upload,
  FileText,
  ChevronDown,
  ChevronRight,
  UserIcon
} from "lucide-react"

import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { clearUserSession, isAdmin } from "@/lib/auth"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [practiceOpen, setPracticeOpen] = useState(false)
  const isUserAdmin = isAdmin()
  
  const practiceSubItems = [
    {
      name: "Practice Tools",
      href: "/practice/tools",
      icon: BookOpen,
    },
    {
      name: "Upload Practice",
      href: "/practice/upload",
      icon: Upload,
    },
    {
      name: "Create Quiz",
      href: "/practice/quiz",
      icon: FileText,
    }
  ]

  // Routes for admin users (unchanged)
  const adminRoutes = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Students",
      href: "/students",
      icon: Users,
    },
    {
      name: "Groups",
      href: "/groups",
      icon: Users2,
    },
    {
      name: "Attendance",
      href: "/attendance",
      icon: Calendar,
    },
    {
      name: "Leaderboard",
      href: "/leaderboard",
      icon: Trophy,
    },
    {
      name: "Messages",
      href: "/messages",
      icon: MessageSquare,
    },
    {
      name: "Requests",
      href: "/requests",
      icon: ClipboardList,
    }
  ]

  // Routes for student users (reordered with profile)
  const studentRoutes = [
    {
      name: "Dashboard",
      href: "/student-dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Leaderboard",
      href: "/leaderboard",
      icon: Trophy,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: UserIcon,
    },
    {
      name: "Messages",
      href: "/messages",
      icon: MessageSquare,
    },
    {
      name: "Requests",
      href: "/requests",
      icon: ClipboardList,
    }
  ]

  // Use appropriate routes based on user role
  const routes = isUserAdmin ? adminRoutes : studentRoutes

  const handleSignOut = () => {
    // Clear user session when signing out
    clearUserSession()
    // Redirect to the login page
    router.push('/auth/login')
  }

  const togglePracticeMenu = () => {
    setPracticeOpen(!practiceOpen)
  }

  const isPracticeActive = pathname.startsWith('/practice')

  return (
    <div className={cn("flex flex-col h-screen bg-background border-r", className)} {...props}>
      <div className="px-3 py-2 flex items-center h-16 border-b">
        <h2 className="text-lg font-semibold flex-1">MGS VIDYALA</h2>
        <ThemeToggle />
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {/* For admin: render first 4 routes, then Practice dropdown, then rest of routes */}
          {/* For student: render first 2 routes (Dashboard, Leaderboard), then Practice dropdown, then rest of routes */}
          {isUserAdmin ? (
            // Admin view
            <>
              {routes.slice(0, 4).map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    pathname === route.href 
                      ? "bg-muted text-primary" 
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <route.icon className="h-4 w-4" />
                  <span>{route.name}</span>
                </Link>
              ))}
              
              {/* Practice Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setPracticeOpen(true)}
                onMouseLeave={() => setPracticeOpen(false)}
              >
                <button
                  onClick={togglePracticeMenu}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    isPracticeActive
                      ? "bg-muted text-primary" 
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-4 w-4" />
                    <span>Practice</span>
                  </div>
                  {practiceOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                
                <div 
                  className={cn(
                    "pl-4 py-1 overflow-hidden transition-all duration-300 ease-in-out",
                    practiceOpen 
                      ? "max-h-[500px] opacity-100" 
                      : "max-h-0 opacity-0"
                  )}
                >
                  {practiceSubItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                        pathname === item.href 
                          ? "bg-muted text-primary" 
                          : "text-muted-foreground hover:bg-muted"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
              
              {routes.slice(4).map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    pathname === route.href 
                      ? "bg-muted text-primary" 
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <route.icon className="h-4 w-4" />
                  <span>{route.name}</span>
                </Link>
              ))}
            </>
          ) : (
            // Student view
            <>
              {routes.slice(0, 2).map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    pathname === route.href 
                      ? "bg-muted text-primary" 
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <route.icon className="h-4 w-4" />
                  <span>{route.name}</span>
                </Link>
              ))}
              
              {/* Practice Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setPracticeOpen(true)}
                onMouseLeave={() => setPracticeOpen(false)}
              >
                <button
                  onClick={togglePracticeMenu}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    isPracticeActive
                      ? "bg-muted text-primary" 
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-4 w-4" />
                    <span>Practice</span>
                  </div>
                  {practiceOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                
                <div 
                  className={cn(
                    "pl-4 py-1 overflow-hidden transition-all duration-300 ease-in-out",
                    practiceOpen 
                      ? "max-h-[500px] opacity-100" 
                      : "max-h-0 opacity-0"
                  )}
                >
                  {practiceSubItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                        pathname === item.href 
                          ? "bg-muted text-primary" 
                          : "text-muted-foreground hover:bg-muted"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
              
              {routes.slice(2).map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    pathname === route.href 
                      ? "bg-muted text-primary" 
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <route.icon className="h-4 w-4" />
                  <span>{route.name}</span>
                </Link>
              ))}
            </>
          )}
        </nav>
      </div>
      <div className="px-3 py-2 border-t mt-auto">
        <Button
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-primary"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="text-sm font-medium">v1.0.0</div>
        </div>
      </div>
    </div>
  )
} 