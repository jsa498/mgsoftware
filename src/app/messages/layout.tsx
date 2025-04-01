import { DashboardLayout } from "@/components/dashboard-layout"

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
} 