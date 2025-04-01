"use client"

import { useState } from "react"
import { LockKeyhole, RefreshCcw, BookOpen, FileEdit, Bug, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

// Types
interface Request {
  id: string
  studentId: string
  studentName: string
  requestType: 'pin' | 'quiz' | 'practice' | 'general'
  title: string
  details: string
  status: 'pending' | 'approved' | 'rejected'
  timestamp: Date
}

// Mock data
const mockRequests: Request[] = [
  /* Empty for now - will show the "no pending requests" state */
]

export default function RequestsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [requests, setRequests] = useState<Request[]>(mockRequests)

  // Filter requests by type
  const pinChangeRequests = requests.filter(req => req.requestType === 'pin')
  const quizRetryRequests = requests.filter(req => req.requestType === 'quiz')
  const practiceRetryRequests = requests.filter(req => req.requestType === 'practice')
  const featureAndBugRequests = requests.filter(req => req.requestType === 'general')

  // Refresh requests from server (simulated)
  const refreshRequests = () => {
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      // For demo purposes, we'll just keep the same empty state
      setIsLoading(false)
    }, 1500)
  }

  // Render request card or empty state
  const renderRequestsOrEmpty = (requests: Request[], emptyMessage: string) => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )
    }
    
    if (requests.length === 0) {
      return (
        <div className="py-6 text-center text-muted-foreground">
          {emptyMessage}
        </div>
      )
    }
    
    return (
      <div className="space-y-3">
        {requests.map(request => (
          <div key={request.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
            <div>
              <p className="font-medium">{request.studentName}</p>
              <p className="text-sm text-muted-foreground">{request.title}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-green-500 hover:text-green-600 hover:bg-green-100/10">
                Approve
              </Button>
              <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-100/10">
                Reject
              </Button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Student Requests</h1>
        <Button 
          onClick={refreshRequests}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCcw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          Refresh Requests
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PIN Change Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <LockKeyhole className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-lg">PIN Change Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {renderRequestsOrEmpty(pinChangeRequests, "No pending PIN change requests")}
          </CardContent>
        </Card>

        {/* Quiz Retry Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <FileEdit className="h-5 w-5 text-purple-500" />
            <CardTitle className="text-lg">Quiz Retry Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {renderRequestsOrEmpty(quizRetryRequests, "No pending quiz retry requests")}
          </CardContent>
        </Card>

        {/* Practice Retry Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <BookOpen className="h-5 w-5 text-green-500" />
            <CardTitle className="text-lg">Practice Retry Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {renderRequestsOrEmpty(practiceRetryRequests, "No pending practice retry requests")}
          </CardContent>
        </Card>

        {/* Feature Requests & Bug Reports */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Bug className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-lg">Feature Requests & Bug Reports</CardTitle>
          </CardHeader>
          <CardContent>
            {renderRequestsOrEmpty(featureAndBugRequests, "No pending feature requests or bug reports")}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 