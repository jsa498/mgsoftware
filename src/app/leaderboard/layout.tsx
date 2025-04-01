import { DashboardLayout } from "@/components/dashboard-layout";

export default function LeaderboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Both admins and students can access the leaderboard
  // The UI will conditionally render admin-only features based on user role
  return <DashboardLayout>{children}</DashboardLayout>;
} 