import { DashboardLayout } from "@/components/dashboard-layout";

export default function GroupsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardLayout>{children}</DashboardLayout>;
} 