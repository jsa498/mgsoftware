import { DashboardLayout } from "@/components/dashboard-layout";

export default function GurbaniLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardLayout>{children}</DashboardLayout>;
} 