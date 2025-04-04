"use client"

import { useState, useEffect } from "react"
import { LockKeyhole, RefreshCcw, BookOpen, FileEdit, Bug, PlusCircle, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { createClient } from "@supabase/supabase-js"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Separator } from "@/components/ui/separator"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getCurrentUser } from "@/lib/auth"

// Types
interface FeatureRequest {
  id: string
  student_id: string
  type: 'feature' | 'bug' | 'pin'
  title: string
  description: string
  status: 'pending' | 'in_development' | 'completed' | 'rejected'
  created_at: string
  updated_at: string
}

export default function StudentRequestsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [requests, setRequests] = useState<FeatureRequest[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [studentId, setStudentId] = useState<string | null>(null)
  const [currentPin, setCurrentPin] = useState<string>("")
  const [newPin, setNewPin] = useState<string>("")
  const [pinReason, setPinReason] = useState<string>("")
  const [pinDialogOpen, setPinDialogOpen] = useState(false)
  const [showCurrentPin, setShowCurrentPin] = useState(false)
  const [showNewPin, setShowNewPin] = useState(false)
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )
  
  // Filter requests by type
  const featureAndBugRequests = requests.filter(req => req.type === 'feature' || req.type === 'bug')
  const pinChangeRequests = requests.filter(req => req.type === 'pin')

  // Fetch the current user's ID
  const fetchUserData = async () => {
    const user = getCurrentUser();
    
    if (user) {
      // The user table has a student_id column, so we can directly use the student_id
      const { data: userData, error } = await supabase
        .from('users')
        .select('student_id')
        .eq('id', user.id)
        .single();
      
      if (!error && userData && userData.student_id) {
        setStudentId(userData.student_id);
        return userData.student_id;
      } else {
        console.error('Error fetching student ID from user:', error);
      }
    } else {
      console.error('No user found in session');
    }
    
    return null;
  }

  // Fetch requests from server
  const fetchRequests = async (id: string | null) => {
    if (!id) return;
    
    setIsLoading(true)
    
    try {
      const { data, error } = await supabase
        .from('feature_requests')
        .select('*')
        .eq('student_id', id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching feature requests:', error);
    } finally {
      setIsLoading(false);
    }
  }
  
  // Submit a new feature request
  const submitRequest = async (
    type: 'feature' | 'bug', 
    title: string, 
    description: string
  ) => {
    if (!studentId || !title || !description) return;
    
    try {
      const { error } = await supabase
        .from('feature_requests')
        .insert([
          {
            student_id: studentId,
            type,
            title,
            description,
            status: 'pending'
          }
        ]);
      
      if (error) throw error;
      
      setOpenDialog(false);
      fetchRequests(studentId); // Refresh the list
    } catch (error) {
      console.error('Error creating feature request:', error);
    }
  }

  // Submit PIN change request
  const submitPinChangeRequest = async () => {
    if (!studentId || !newPin || !pinReason) return;
    
    try {
      const { error } = await supabase
        .from('feature_requests')
        .insert([
          {
            student_id: studentId,
            type: 'pin',
            title: 'PIN Change Request',
            description: JSON.stringify({
              newPin,
              reason: pinReason
            }),
            status: 'pending'
          }
        ]);
      
      if (error) throw error;
      
      setPinDialogOpen(false);
      setNewPin("");
      setPinReason("");
      fetchRequests(studentId); // Refresh the list
    } catch (error) {
      console.error('Error creating PIN change request:', error);
    }
  }
  
  // Load requests on component mount
  useEffect(() => {
    const initialize = async () => {
      const id = await fetchUserData();
      if (id) {
        fetchRequests(id);
        
        // Get current PIN
        const { data: userData, error } = await supabase
          .from('users')
          .select('pin')
          .eq('student_id', id)
          .single();
        
        if (!error && userData) {
          setCurrentPin(userData.pin);
        }
      }
    };
    
    initialize();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps
  // The dependencies are handled inside the initialize function

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
          
          return (
            <div key={request.id}>
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium">PIN Change Request</p>
                  <p className="text-xs text-muted-foreground">
                    Reason: {details.reason}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Submitted on {new Date(request.created_at).toLocaleDateString()}
                  </p>
                </div>
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
              </div>
              <Separator className="my-2" />
            </div>
          );
        })}
      </div>
    )
  }

  // Render other requests or empty state - used for quiz and practice retry requests
  const renderRequestsOrEmpty = (emptyMessage: string) => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )
    }
    
    return (
      <div className="py-6 text-center text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  return (
    <DashboardLayout requireStudent={true}>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">My Requests</h1>
          <Button 
            onClick={() => fetchRequests(studentId)}
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
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <LockKeyhole className="h-5 w-5 text-blue-500" />
                <CardTitle className="text-lg">Pin Change</CardTitle>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1" 
                onClick={() => setPinDialogOpen(true)}
              >
                <PlusCircle className="h-3.5 w-3.5" />
                New Request
              </Button>
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
              {renderRequestsOrEmpty("No pending quiz retry requests")}
            </CardContent>
          </Card>

          {/* Practice Retry Requests */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <BookOpen className="h-5 w-5 text-green-500" />
              <CardTitle className="text-lg">Practice Retry Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {renderRequestsOrEmpty("No pending practice retry requests")}
            </CardContent>
          </Card>

          {/* Feature Requests & Bug Reports */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <Bug className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-lg">Feature Requests & Bug Reports</CardTitle>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1" 
                onClick={() => setOpenDialog(true)}
              >
                <PlusCircle className="h-3.5 w-3.5" />
                New Request
              </Button>
            </CardHeader>
            <CardContent>
              {renderFeatureRequests()}
            </CardContent>
          </Card>
        </div>
        
        {/* New Request Dialog */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit a Request</DialogTitle>
              <DialogDescription>
                Request a feature or report a bug in the system.
              </DialogDescription>
            </DialogHeader>
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
                    onClick={() => document.getElementById('request-type')?.setAttribute('value', 'feature')}
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
                    onClick={() => document.getElementById('request-type')?.setAttribute('value', 'bug')}
                  />
                  Bug Report
                </Label>
                <input type="hidden" id="request-type" value="feature" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Brief title for your request" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Please describe your feature request or bug report in detail"
                  rows={5} 
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => {
                const typeElement = document.getElementById('request-type') as HTMLInputElement;
                const titleElement = document.getElementById('title') as HTMLInputElement;
                const descriptionElement = document.getElementById('description') as HTMLTextAreaElement;
                
                submitRequest(
                  typeElement.value as 'feature' | 'bug',
                  titleElement.value,
                  descriptionElement.value
                );
              }}>
                Submit Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* PIN Change Request Dialog */}
        <Dialog open={pinDialogOpen} onOpenChange={setPinDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Request PIN Change</DialogTitle>
              <DialogDescription>
                Submit a request to change your PIN. An administrator will need to approve this request.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="current-pin">Current PIN</Label>
                <div className="relative">
                  <Input
                    id="current-pin"
                    type={showCurrentPin ? "text" : "password"}
                    value={currentPin}
                    readOnly
                    className="pr-10"
                  />
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowCurrentPin(!showCurrentPin)}
                  >
                    {showCurrentPin ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-pin">New PIN</Label>
                <div className="relative">
                  <Input
                    id="new-pin"
                    type={showNewPin ? "text" : "password"}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    maxLength={9}
                    className="pr-10"
                    placeholder="Enter new PIN"
                    required
                  />
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowNewPin(!showNewPin)}
                  >
                    {showNewPin ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Change</Label>
                <Textarea
                  id="reason"
                  placeholder="Please explain why you need to change your PIN"
                  rows={3}
                  value={pinReason}
                  onChange={(e) => setPinReason(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={submitPinChangeRequest}>Submit Request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
} 