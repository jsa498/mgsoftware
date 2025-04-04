"use client"

import { useState, useEffect } from "react"
import { LockKeyhole, RefreshCcw, BookOpen, FileEdit, Bug } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { createClient } from "@supabase/supabase-js"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

// Types
interface Student {
  id: string
  first_name: string
  last_name: string
}

interface FeatureRequest {
  id: string
  student_id: string
  type: 'feature' | 'bug' | 'pin'
  title: string
  description: string
  status: 'pending' | 'in_development' | 'completed' | 'rejected'
  created_at: string
  updated_at: string
  students?: Student
}

interface PinRequest {
  id: string
  student_id: string
  studentName: string
  requestType: 'pin'
  title: string
  details: string
  status: 'pending' | 'approved' | 'rejected'
}

interface QuizRequest {
  id: string
  student_id: string
  studentName: string
  requestType: 'quiz'
  title: string
  details: string
  status: 'pending' | 'approved' | 'rejected'
}

interface PracticeRequest {
  id: string
  student_id: string
  studentName: string
  requestType: 'practice'
  title: string
  details: string
  status: 'pending' | 'approved' | 'rejected'
}

type Request = FeatureRequest | PinRequest | QuizRequest | PracticeRequest;

export default function RequestsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [requests, setRequests] = useState<Request[]>([])
  const [selectedRequest, setSelectedRequest] = useState<FeatureRequest | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [newStatus, setNewStatus] = useState<string>('')
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )
  
  // Filter requests by type
  const pinChangeRequests = requests.filter(req => 'type' in req && req.type === 'pin') as FeatureRequest[]
  const quizRetryRequests = requests.filter(req => 'requestType' in req && req.requestType === 'quiz') as QuizRequest[]
  const practiceRetryRequests = requests.filter(req => 'requestType' in req && req.requestType === 'practice') as PracticeRequest[]
  const featureAndBugRequests = requests.filter(req => 'type' in req && (req.type === 'feature' || req.type === 'bug')) as FeatureRequest[]

  // Fetch requests from server
  const fetchRequests = async () => {
    setIsLoading(true)
    
    try {
      const { data, error } = await supabase
        .from('feature_requests')
        .select(`
          *,
          students:student_id (
            id,
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching feature requests:', error);
    } finally {
      setIsLoading(false);
    }
  }
  
  // Update a request status
  const updateRequestStatus = async () => {
    if (!selectedRequest || !newStatus) return;
    
    try {
      const { error } = await supabase
        .from('feature_requests')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedRequest.id);
      
      if (error) throw error;
      
      setOpenDialog(false);
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  }
  
  // Load requests on component mount
  useEffect(() => {
    fetchRequests();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Open the status update dialog
  const openStatusDialog = (request: FeatureRequest) => {
    setSelectedRequest(request);
    setNewStatus(request.status);
    setOpenDialog(true);
  }

  // Approve PIN change request
  const approvePinChange = async (request: FeatureRequest) => {
    if (!request || request.type !== 'pin') return;
    
    try {
      let pinDetails;
      try {
        pinDetails = JSON.parse(request.description);
      } catch (e) {
        console.error('Error parsing PIN request details:', e);
        return;
      }
      
      if (!pinDetails.newPin) {
        console.error('New PIN is missing from request');
        return;
      }
      
      // Update the user's PIN
      const { error: userError } = await supabase
        .from('users')
        .update({ pin: pinDetails.newPin })
        .eq('student_id', request.student_id);
      
      if (userError) throw userError;
      
      // Update request status to completed (approved)
      const { error: requestError } = await supabase
        .from('feature_requests')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', request.id);
      
      if (requestError) throw requestError;
      
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error approving PIN change request:', error);
    }
  }
  
  // Reject PIN change request
  const rejectPinChange = async (request: FeatureRequest) => {
    if (!request || request.type !== 'pin') return;
    
    try {
      // Update request status
      const { error } = await supabase
        .from('feature_requests')
        .update({ 
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', request.id);
      
      if (error) throw error;
      
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting PIN change request:', error);
    }
  }

  // Render feature requests or empty state
  const renderFeatureRequests = () => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )
    }
    
    if (featureAndBugRequests.length === 0) {
      return (
        <div className="py-6 text-center text-muted-foreground">
          No pending feature requests or bug reports
        </div>
      )
    }
    
    return (
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
        {featureAndBugRequests.map(request => (
          <div key={request.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">{request.students?.first_name} {request.students?.last_name}</p>
                <Badge variant={request.type === 'bug' ? 'destructive' : 'default'}>
                  {request.type === 'bug' ? 'Bug' : 'Feature'}
                </Badge>
              </div>
              <p className="text-sm font-medium">{request.title}</p>
              <p className="text-xs text-muted-foreground">
                Submitted on {new Date(request.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
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
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => openStatusDialog(request)}
              >
                Update
              </Button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Render PIN change requests
  const renderPinRequests = () => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )
    }
    
    if (pinChangeRequests.length === 0) {
      return (
        <div className="py-6 text-center text-muted-foreground">
          No pending PIN change requests
        </div>
      )
    }
    
    return (
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
        {pinChangeRequests.map(request => {
          let details;
          try {
            details = JSON.parse(request.description);
          } catch {
            details = { reason: request.description };
          }
          
          const studentName = request.students ? 
            `${request.students.first_name} ${request.students.last_name}` : 
            'Unknown Student';
          
          return (
            <div key={request.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium">{studentName}</p>
                <p className="text-sm font-medium">New PIN: {details.newPin}</p>
                <p className="text-xs text-muted-foreground">
                  Reason: {details.reason}
                </p>
                <p className="text-xs text-muted-foreground">
                  Submitted on {new Date(request.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={
                    request.status === 'rejected' ? 'destructive' : 
                    request.status === 'pending' ? 'outline' : 
                    'secondary'
                  }
                >
                  {request.status === 'pending' ? 'Pending' : 
                   request.status === 'rejected' ? 'Rejected' : 
                   'Approved'}
                </Badge>
                {request.status === 'pending' && (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-green-500 hover:text-green-600 hover:bg-green-100/10"
                      onClick={() => approvePinChange(request)}
                    >
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-500 hover:text-red-600 hover:bg-red-100/10"
                      onClick={() => rejectPinChange(request)}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    )
  }

  // Render other requests or empty state
  const renderRequestsOrEmpty = (requests: PinRequest[] | QuizRequest[] | PracticeRequest[], emptyMessage: string) => {
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
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
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
          onClick={fetchRequests}
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
            {renderPinRequests()}
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
            {renderFeatureRequests()}
          </CardContent>
        </Card>
      </div>
      
      {/* Status Update Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Request Status</DialogTitle>
            <DialogDescription>
              Update the status of this request from {selectedRequest?.students?.first_name} {selectedRequest?.students?.last_name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <p className="font-medium text-sm">{selectedRequest?.title}</p>
              <p className="text-sm text-muted-foreground">{selectedRequest?.description}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={newStatus} 
                onValueChange={setNewStatus}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_development">In Development</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button onClick={updateRequestStatus}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 