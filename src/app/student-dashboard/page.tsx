import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, BarChart2, MessageSquare, FileMusic } from "lucide-react"
import { 
  getStudentPracticeSessions, 
  getStudentPracticeStats, 
  getStudentUnreadMessages, 
  getStudentFeeStatus,
  getStudentRecentActivity
} from "@/lib/data-service"
import { RecentActivity } from "@/lib/types"
import { cookies } from "next/headers"

// Client component that fetches the user ID
// Since we can't directly use getCurrentUser in a server component,
// we'll need to get the user ID from cookies or session on the server side
async function getStudentId() {
  // In a real application, you would decode a JWT token or 
  // fetch the user ID from the database using session ID
  // For now, we'll return a placeholder ID
  return "example-student-id"
}

export default async function StudentDashboard() {
  // Get current student ID
  const studentId = await getStudentId()
  
  // Fetch data for student dashboard using student ID
  const practiceSessions = await getStudentPracticeSessions(studentId, "month")
  const practiceStats = await getStudentPracticeStats(studentId)
  const unreadMessages = await getStudentUnreadMessages(studentId)
  const feeStatus = await getStudentFeeStatus(studentId)
  const recentActivity = await getStudentRecentActivity(studentId)
  
  // Calculate practice time in hours and minutes
  const totalMinutes = practiceStats?.total_minutes || 0
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  
  return (
    <DashboardLayout requireStudent={true}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Practice Sessions</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{practiceSessions?.count || 0}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Practice Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {hours}h {minutes}m
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadMessages?.count || 0}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Practice Materials</CardTitle>
              <FileMusic className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadMessages?.new_materials_count || 0}</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Activity and Fee Status */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity && recentActivity.length > 0 ? (
                <div className="space-y-2">
                  {recentActivity.map((activity: RecentActivity) => (
                    <div key={activity.id}>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <BarChart2 className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            You {activity.status} practice session
                          </p>
                          {activity.duration_minutes && activity.points && (
                            <p className="text-xs text-muted-foreground">
                              {activity.duration_minutes} minutes, {activity.points} points
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.started_at).toLocaleString()}
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
          
          {/* Fee Status */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Fee Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {feeStatus ? (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Your Fee Status</p>
                        <p className="text-xs text-muted-foreground">
                          Fees paid until {new Date(feeStatus.paid_until).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      <Badge 
                        variant={
                          feeStatus.status === 'past_due' ? 'destructive' : 
                          feeStatus.status === 'due' ? 'default' : 
                          'secondary'
                        }
                      >
                        {feeStatus.status === 'past_due' ? 'Past Due' : 
                         feeStatus.status === 'due' ? 'Due This Month' : 
                         'Paid'}
                      </Badge>
                    </div>
                    <Separator className="my-2" />
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No fee information available.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
} 