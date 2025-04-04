import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, BarChart2, MessageSquare, FileMusic, RefreshCw, PlusCircle } from "lucide-react"
import { 
  getStudentPracticeSessions, 
  getStudentPracticeStats, 
  getStudentUnreadMessages, 
  getStudentFeatureRequests,
  getStudentRecentActivity
} from "@/lib/data-service"
import { RecentActivity } from "@/lib/types"
import { getStudentId, getCurrentUserId } from "@/lib/server-auth"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { redirect } from "next/navigation"
import { formatDateTime } from "@/lib/date-utils"

// This forces Next.js to treat this as a dynamic route that won't be cached
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Client component that fetches the user ID
// Since we can't directly use getCurrentUser in a server component,
// we'll need to get the user ID from cookies or session on the server side
// Using the server-auth implementation instead of the placeholder
// async function getStudentId() {
//   // In a real application, you would decode a JWT token or 
//   // fetch the user ID from the database using session ID
//   // For now, we'll return a placeholder ID
//   return "example-student-id"
// }

export default async function StudentDashboard() {
  // Get current user ID and student ID for debugging
  const userId = await getCurrentUserId();
  console.log("Current User ID:", userId);
  
  // Get current student ID using the proper function from server-auth
  const studentId = await getStudentId();
  console.log("Student ID from server-auth:", studentId);
  
  // If we don't have a student ID from auth, show empty dashboard
  if (!studentId) {
    // Return a basic dashboard with 0 values
    return (
      <DashboardLayout requireStudent={true}>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Student Dashboard</h1>
            <form action="/student-dashboard">
              <Button type="submit" variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" /> Refresh
              </Button>
            </form>
          </div>
          
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-card hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Practice Sessions</CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Practice Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0:00m</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">New Practice Materials</CardTitle>
                <FileMusic className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Activity and Feature Requests */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">No recent activity to display.</p>
              </CardContent>
            </Card>
            
            {/* Feature Requests */}
            <Card className="col-span-1">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Feature Requests & Bug Reports</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1">
                      <PlusCircle className="h-4 w-4" />
                      New Request
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Submit a Request</DialogTitle>
                      <DialogDescription>
                        Request a feature or report a bug in the system.
                      </DialogDescription>
                    </DialogHeader>
                    <form action={async (formData: FormData) => {
                      'use server'
                      const title = formData.get('title') as string
                      const description = formData.get('description') as string
                      const type = formData.get('type') as string
                      
                      if (!title || !description || !type) {
                        return
                      }
                      
                      const { createFeatureRequest } = await import('@/lib/data-service')
                      await createFeatureRequest(
                        studentId,
                        type as 'feature' | 'bug',
                        title,
                        description
                      )
                      
                      // Refresh the page
                      redirect('/student-dashboard')
                    }}>
                      <div className="grid gap-4 py-4">
                        <div className="flex items-center gap-4">
                          <Label htmlFor="request-type-feature" className="flex items-center gap-2">
                            <input 
                              type="radio" 
                              id="request-type-feature" 
                              name="type" 
                              value="feature"
                              className="h-4 w-4"
                              defaultChecked
                            />
                            Feature Request
                          </Label>
                          <Label htmlFor="request-type-bug" className="flex items-center gap-2">
                            <input 
                              type="radio" 
                              id="request-type-bug" 
                              name="type" 
                              value="bug"
                              className="h-4 w-4"
                            />
                            Bug Report
                          </Label>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="title">Title</Label>
                          <Input id="title" name="title" placeholder="Brief title for your request" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea 
                            id="description" 
                            name="description"
                            placeholder="Please describe your feature request or bug report in detail"
                            rows={5} 
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Submit Request</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">No requests submitted yet.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  // Fetch data for student dashboard using student ID
  const practiceSessions = await getStudentPracticeSessions(studentId, "month");
  console.log("Practice Sessions:", practiceSessions);
  
  const practiceStats = await getStudentPracticeStats(studentId, "month");
  console.log("Practice Stats:", practiceStats);
  
  const unreadMessages = await getStudentUnreadMessages(studentId);
  const featureRequests = await getStudentFeatureRequests(studentId);
  const recentActivity = await getStudentRecentActivity(studentId);
  
  // The database function returns an array, so we need to get the first element
  const practiceStatsData = Array.isArray(practiceStats) && practiceStats.length > 0 ? practiceStats[0] : { session_count: 0, total_minutes: 0 };
  
  // Calculate practice time in hours and minutes
  // The database function returns session_count and total_minutes
  const totalMinutes = practiceStatsData.total_minutes || 0;
  console.log("Total Minutes:", totalMinutes);
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  // Format time in the same format as leaderboard
  const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}m`;
  
  // Get total completed sessions
  const totalSessions = practiceStatsData.session_count || 0;
  console.log("Total Sessions:", totalSessions);
  
  return (
    <DashboardLayout requireStudent={true}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <form action="/student-dashboard">
            <Button type="submit" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </Button>
          </form>
        </div>
        
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Practice Sessions</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSessions}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Practice Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formattedTime}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">New Practice Materials</CardTitle>
              <FileMusic className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadMessages?.new_materials_count || 0}</div>
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
        </div>
        
        {/* Recent Activity and Feature Requests */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity && recentActivity.length > 0 ? (
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-2">
                  {recentActivity.map((activity: RecentActivity) => (
                    <div key={activity.id}>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <BarChart2 className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {activity.status === 'completed' 
                              ? 'You completed a practice session' 
                              : activity.status === 'started'
                                ? 'You started a practice session'
                                : `You ${activity.status} practice session`
                            }
                          </p>
                          {activity.duration_minutes && (
                            <p className="text-xs text-muted-foreground">
                              <span className="font-medium">Duration:</span> {Math.floor(activity.duration_minutes / 60)}:{(activity.duration_minutes % 60).toString().padStart(2, '0')}m
                              {activity.points && (
                                <span className="ml-2">
                                  <span className="font-medium">Points:</span> {Number(activity.points).toFixed(2)}
                                </span>
                              )}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {formatDateTime(activity.started_at)}
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
          
          {/* Feature Requests */}
          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Feature Requests & Bug Reports</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <PlusCircle className="h-4 w-4" />
                    New Request
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Submit a Request</DialogTitle>
                    <DialogDescription>
                      Request a feature or report a bug in the system.
                    </DialogDescription>
                  </DialogHeader>
                  <form action={async (formData: FormData) => {
                    'use server'
                    const title = formData.get('title') as string
                    const description = formData.get('description') as string
                    const type = formData.get('type') as string
                    
                    if (!title || !description || !type) {
                      return
                    }
                    
                    const { createFeatureRequest } = await import('@/lib/data-service')
                    await createFeatureRequest(
                      studentId,
                      type as 'feature' | 'bug',
                      title,
                      description
                    )
                    
                    // Refresh the page
                    redirect('/student-dashboard')
                  }}>
                    <div className="grid gap-4 py-4">
                      <div className="flex items-center gap-4">
                        <Label htmlFor="request-type-feature" className="flex items-center gap-2">
                          <input 
                            type="radio" 
                            id="request-type-feature" 
                            name="type" 
                            value="feature"
                            className="h-4 w-4"
                            defaultChecked
                          />
                          Feature Request
                        </Label>
                        <Label htmlFor="request-type-bug" className="flex items-center gap-2">
                          <input 
                            type="radio" 
                            id="request-type-bug" 
                            name="type" 
                            value="bug"
                            className="h-4 w-4"
                          />
                          Bug Report
                        </Label>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" placeholder="Brief title for your request" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea 
                          id="description" 
                          name="description"
                          placeholder="Please describe your feature request or bug report in detail"
                          rows={5} 
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Submit Request</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
              {featureRequests && featureRequests.length > 0 ? (
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-2">
                  {featureRequests.map((request) => (
                    <div key={request.id}>
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{request.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {request.type === 'feature' ? 'Feature request' : 'Bug report'} • Submitted on {new Date(request.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge 
                          variant={
                            request.status === 'rejected' ? 'destructive' : 
                            request.status === 'pending' ? 'outline' : 
                            request.status === 'in_development' ? 'default' :
                            'secondary'
                          }
                        >
                          {request.status === 'pending' ? 'Pending' : 
                           request.status === 'rejected' ? 'Rejected' : 
                           request.status === 'in_development' ? 'In Development' :
                           'Completed'}
                        </Badge>
                      </div>
                      <Separator className="my-2" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No requests submitted yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
} 