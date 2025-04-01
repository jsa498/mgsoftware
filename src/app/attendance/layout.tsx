import { Sidebar } from "@/components/sidebar"
import { ProtectedRoute } from "@/components/protected-route"

export default function AttendanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar className="hidden md:flex w-64" />
      <main className="flex-1 overflow-y-auto">
        <ProtectedRoute requireAdmin={true}>
          {children}
        </ProtectedRoute>
      </main>
    </div>
  )
} 
