import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Users, UserPlus2, MessageSquare, FileMusic, Clock, LogIn } from "lucide-react"
import { getDashboardStats, getRecentActivity, getFeeAlerts } from "@/lib/data-service"
import { formatDateTimeWithTimezone } from "@/lib/date-utils"

// This forces Next.js to treat this as a dynamic route that won't be cached
export const dynamic = 'force-dynamic';

// Client browser timezone will be used on the client side
const timeZone = 'America/Vancouver'; // Default to Vancouver timezone for server rendering

export default async function Home() {
  // Fetch data for dashboard
  const stats = await getDashboardStats()
  const recentActivity = await getRecentActivity()
  const feeAlerts = await getFeeAlerts()
  
  return (
    <DashboardLayout requireAdmin={true}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeStudentsCount}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
              <UserPlus2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeGroupsCount}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.unreadMessagesCount}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">New Practice Materials</CardTitle>
              <FileMusic className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.newPracticeMaterialsCount}</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Activity */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.length > 0 ? (
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-2">
                  {recentActivity.map((activity) => (
                    <div key={activity.id}>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {activity.activity_type === 'practice' ? (
                            <Clock className="h-4 w-4 text-primary" />
                          ) : (
                            <LogIn className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {activity.student_name} {activity.status}
                            {activity.activity_type === 'practice' && ' practice session'}
                          </p>
                          {activity.duration_minutes && activity.points && activity.activity_type === 'practice' && (
                            <p className="text-xs text-muted-foreground">
                              {activity.duration_minutes} minutes, {activity.points} points
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {formatDateTimeWithTimezone(activity.started_at, timeZone)}
                          </p>
                        </div>
                      </div>
                      <Separator className="my-2" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No recent activity to display.</p>
              )}
            </CardContent>
          </Card>
          
          {/* Fee Alerts */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Fee Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {feeAlerts.length > 0 ? (
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
                  {feeAlerts.map((alert) => (
                    <div key={alert.id}>
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{alert.student_name}</p>
                          <p className="text-xs text-muted-foreground">
                            Fees paid until {formatDateTimeWithTimezone(alert.paid_until, timeZone).split(',')[0]}
                          </p>
                        </div>
                        <Badge 
                          variant={
                            alert.alert_type === 'past_due' 
                              ? 'destructive' 
                              : alert.alert_type === 'due_soon'
                                ? 'warning'
                                : 'default'
                          }
                        >
                          {alert.alert_type === 'past_due' 
                            ? 'Past Due'
                            : alert.alert_type === 'due_soon'
                              ? 'Due Soon'
                              : 'Upcoming'
                          }
                        </Badge>
                      </div>
                      <Separator className="my-2" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No fee alerts to display.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
