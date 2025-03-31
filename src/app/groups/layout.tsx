import { DashboardLayout } from "@/components/dashboard-layout";
import { ProtectedRoute } from "@/components/protected-route";

export default function GroupsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardLayout>
      <ProtectedRoute requireAdmin={true}>
        {children}
      </ProtectedRoute>
    </DashboardLayout>
  );
} 