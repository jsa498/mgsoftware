"use client";

import { useState, useEffect } from "react";
import {
  Trophy,
  Search,
  RefreshCw,
  Plus,
  Minus,
  BarChart2,
  RotateCcw,
  Clock,
  Calendar,
  X,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getPracticeLeaderboard, getQuizLeaderboard, updateQuizPoints, getActivePracticingSessions, getStudentPracticeHistory } from "@/lib/data-service";
import { toast } from "@/components/ui/use-toast";
import { isAdmin, getCurrentUser, User } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { formatDateTimeWithTimezone } from "@/lib/date-utils";
import { DatePicker } from "@/components/ui/date-picker";

// Define timezone constant but don't export it
const timeZone = 'America/Vancouver'; // Default to Vancouver timezone

// Define types for our leaderboard data
type PracticeLeaderboardItem = {
  student_id: string;
  name: string;
  time: string;
  points: number;
  rank: number;
};

type QuizLeaderboardItem = {
  student_id: string;
  name: string;
  points: number;
  rank: number;
};

// Add type for practice history
type PracticeHistoryItem = {
  id: string;
  student_id: string;
  duration_minutes: number;
  points: number;
  status: string;
  started_at: string;
  completed_at: string;
  created_at: string;
};

export default function Leaderboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [practiceData, setPracticeData] = useState<PracticeLeaderboardItem[]>([]);
  const [quizData, setQuizData] = useState<QuizLeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedStudentName, setSelectedStudentName] = useState<string>("");
  const [timeDialogOpen, setTimeDialogOpen] = useState(false);
  const [timeAction, setTimeAction] = useState<"add" | "deduct">("add");
  const [timeHours, setTimeHours] = useState<string>("0");
  const [timeMinutes, setTimeMinutes] = useState<string>("15");
  const [activePracticingSessions, setActivePracticingSessions] = useState<string[]>([]);
  
  // New state for practice history
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [practiceHistory, setPracticeHistory] = useState<PracticeHistoryItem[]>([]);
  const [historyPeriod, setHistoryPeriod] = useState<'day' | 'week' | 'month' | 'all'>('all');
  const [loadingHistory, setLoadingHistory] = useState(false);
  
  // --> New state for leaderboard date filter
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  // Fetch leaderboard data on component mount and when selectedDate changes
  useEffect(() => {
    fetchLeaderboardData();
    // Check if the current user is an admin
    setIsUserAdmin(isAdmin());
    // Get the current user
    setCurrentUser(getCurrentUser());
    
    // Set up polling for active practice sessions if user is admin
    if (isAdmin()) {
      fetchActivePracticingSessions();
      
      // Poll for active practice sessions every 10 seconds
      const intervalId = setInterval(() => {
        fetchActivePracticingSessions();
      }, 10000);
      
      return () => clearInterval(intervalId);
    }
  }, [selectedDate]); // <-- Add selectedDate as a dependency
  
  // Function to fetch active practicing sessions
  const fetchActivePracticingSessions = async () => {
    if (!isAdmin()) return;
    
    try {
      const activeSessions = await getActivePracticingSessions();
      setActivePracticingSessions(activeSessions);
    } catch (error) {
      console.error("Error fetching active practice sessions:", error);
    }
  };
  
  // Function to fetch leaderboard data
  const fetchLeaderboardData = async () => {
    setLoading(true);
    try {
      // --- Calculate end date for filtering ---
      let filterEndDate: string | undefined = undefined;
      if (selectedDate) {
        // Get the end of the selected day in UTC
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999); // Set to end of the local day
        filterEndDate = endOfDay.toISOString(); // Convert to UTC ISO string for Supabase
      }
      // --- End Calculate end date ---

      const practiceLeaderboard = await getPracticeLeaderboard(filterEndDate);
      const quizLeaderboard = await getQuizLeaderboard(filterEndDate);
      
      setPracticeData(practiceLeaderboard);
      setQuizData(quizLeaderboard);
      
      // Also update active practice sessions
      if (isAdmin()) {
        fetchActivePracticingSessions();
      }
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch leaderboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // --> New function to handle date reset
  const handleDateReset = () => {
    setSelectedDate(undefined); // Clears the date, useEffect will trigger refetch
  };
  
  // Function to update quiz points
  const handleUpdateQuizPoints = async (studentId: string, increment: number) => {
    try {
      const success = await updateQuizPoints(studentId, increment);
      
      if (success) {
        // Refresh leaderboard data
        fetchLeaderboardData();
        toast({
          title: "Success",
          description: `Quiz points ${increment > 0 ? "increased" : "decreased"} successfully.`,
        });
      } else {
        throw new Error("Failed to update points");
      }
    } catch (error) {
      console.error("Error updating quiz points:", error);
      toast({
        title: "Error",
        description: "Failed to update quiz points. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Function to handle reset all points and time
  const handleResetAll = async () => {
    // This would need to be implemented on the server/database side
    // For now, just show a toast message
    toast({
      title: "Reset not implemented",
      description: "This functionality has not been implemented yet.",
      variant: "destructive",
    });
  };
  
  // Function to handle calibrate points
  const handleCalibratePoints = async () => {
    // This would need to be implemented on the server/database side
    // For now, just show a toast message
    toast({
      title: "Calibration not implemented",
      description: "This functionality has not been implemented yet.",
      variant: "destructive",
    });
  };
  
  // Function to update practice time
  const handleUpdatePracticeTime = async (studentId: string, minutesToAdd: number) => {
    try {
      // Find the student in practice data
      const studentIndex = practiceData.findIndex(s => s.student_id === studentId);
      if (studentIndex === -1) {
        throw new Error("Student not found");
      }
      
      // Calculate points (2 points per hour)
      const pointsDelta = (minutesToAdd / 60) * 2;
      
      // Instead of updating an existing session, create a new adjustment session
      // This ensures the leaderboard aggregation works correctly
      const { error } = await supabase
        .from('practice_sessions')
        .insert({
          student_id: studentId,
          duration_minutes: minutesToAdd,
          points: pointsDelta.toFixed(2),
          status: 'completed',
          started_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      // Refresh leaderboard data
      fetchLeaderboardData();
      
      toast({
        title: "Success",
        description: `Practice time ${minutesToAdd > 0 ? "increased" : "decreased"} successfully.`,
      });
      
      return true;
    } catch (error) {
      console.error("Error updating practice time:", error);
      toast({
        title: "Error",
        description: "Failed to update practice time. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Function to handle time dialog submission
  const handleTimeDialogSubmit = async () => {
    if (!selectedStudent) return;
    
    const hours = parseInt(timeHours) || 0;
    const minutes = parseInt(timeMinutes) || 0;
    const totalMinutes = (hours * 60) + minutes;
    
    if (totalMinutes <= 0) {
      toast({
        title: "Invalid time",
        description: "Please enter a valid time greater than 0.",
        variant: "destructive",
      });
      return;
    }
    
    const minutesToAdd = timeAction === "add" ? totalMinutes : -totalMinutes;
    await handleUpdatePracticeTime(selectedStudent, minutesToAdd);
    
    // Close dialog
    setTimeDialogOpen(false);
  };
  
  // Function to open time dialog
  const openTimeDialog = (studentId: string) => {
    setSelectedStudent(studentId);
    setTimeHours("0");
    setTimeMinutes("15");
    setTimeDialogOpen(true);
  };
  
  // Function to open practice history dialog
  const openHistoryDialog = async (studentId: string, studentName: string) => {
    setSelectedStudent(studentId);
    setSelectedStudentName(studentName);
    setHistoryDialogOpen(true);
    fetchPracticeHistory(studentId, historyPeriod);
  };
  
  // Function to fetch practice history
  const fetchPracticeHistory = async (studentId: string, period: 'day' | 'week' | 'month' | 'all') => {
    if (!studentId) return;
    
    setLoadingHistory(true);
    try {
      const history = await getStudentPracticeHistory(studentId, period);
      setPracticeHistory(history);
    } catch (error) {
      console.error("Error fetching practice history:", error);
      toast({
        title: "Error",
        description: "Failed to fetch practice history. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingHistory(false);
    }
  };
  
  // Handle period change for practice history
  const handleHistoryPeriodChange = (period: 'day' | 'week' | 'month' | 'all') => {
    setHistoryPeriod(period);
    if (selectedStudent) {
      fetchPracticeHistory(selectedStudent, period);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return formatDateTimeWithTimezone(dateString, timeZone);
  };
  
  // Calculate duration between two dates (for display purposes)
  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMs = end.getTime() - start.getTime();
    
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    
    return `${hours}h ${mins}m`;
  };
  
  // Filter practice data based on search query
  const filteredPracticeData = practiceData.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter quiz data based on search query
  const filteredQuizData = quizData.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-2 md:p-6 space-y-4 md:space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center">
          <Trophy className="mr-2 h-8 w-8" /> Leaderboard
        </h1>
      </div>

      <div className="w-full flex justify-between mb-6">
        <div className="max-w-sm w-full relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchLeaderboardData} aria-label="Refresh">
            <RefreshCw className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Refresh</span>
          </Button>
          {isUserAdmin && (
            <>
              <Button onClick={handleCalibratePoints} aria-label="Calibrate Points">
                <span className="hidden md:inline">Calibrate Points</span>
                <BarChart2 className="h-4 w-4 md:hidden" />
              </Button>
              <Button variant="destructive" onClick={handleResetAll} aria-label="Reset All Points & Time">
                <span className="hidden md:inline">Reset All Points & Time</span>
                <RotateCcw className="h-4 w-4 md:hidden" />
              </Button>
            </>
          )}
          {/* Date filter picker */}
          <DatePicker
            date={selectedDate}
            setDate={setSelectedDate}
            placeholder="View Past Leaderboard..."
          />
          {selectedDate && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDateReset}
              title="Reset to All Time"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="practice" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="practice">Practice</TabsTrigger>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
        </TabsList>
        
        <TabsContent value="practice" className="rounded-lg border bg-card">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading practice data...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Rank</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>PT</TableHead>
                  <TableHead>PTP</TableHead>
                  {isUserAdmin && (
                    <TableHead className="w-[50px]"></TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPracticeData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isUserAdmin ? 5 : 4} className="text-center py-8">
                      {practiceData.length === 0
                        ? "No practice data available."
                        : "No students match your search query."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPracticeData.map((student) => (
                    <TableRow key={student.student_id}>
                      <TableCell className="font-medium">
                        {student.rank === 1 ? (
                          <div className="flex items-center justify-center bg-yellow-500 text-white w-8 h-8 rounded-full">
                            <Trophy className="h-4 w-4" />
                          </div>
                        ) : student.rank === 2 ? (
                          <div className="flex items-center justify-center bg-gray-400 text-white w-8 h-8 rounded-full">
                            <Trophy className="h-4 w-4" />
                          </div>
                        ) : student.rank === 3 ? (
                          <div className="flex items-center justify-center bg-amber-700 text-white w-8 h-8 rounded-full">
                            <Trophy className="h-4 w-4" />
                          </div>
                        ) : (
                          <div className="ml-3">#{student.rank}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div 
                          className={`flex items-center gap-2 ${isUserAdmin || (currentUser && currentUser.student_id === student.student_id) ? 'cursor-pointer hover:underline' : 'cursor-default'}`}
                          onClick={() => {
                            if (isUserAdmin || (currentUser && currentUser.student_id === student.student_id)) {
                              openHistoryDialog(student.student_id, student.name);
                            }
                          }}
                        >
                          {isUserAdmin && activePracticingSessions.includes(student.student_id) && (
                            <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" 
                                 title="Currently practicing" />
                          )}
                          {student.name}
                        </div>
                      </TableCell>
                      <TableCell>{student.time}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-medium">
                          {student.points.toFixed(2)}
                        </Badge>
                      </TableCell>
                      {isUserAdmin && (
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openTimeDialog(student.student_id)}
                            >
                              <Clock className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </TabsContent>
        
        <TabsContent value="quiz" className="rounded-lg border bg-card">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading quiz data...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Rank</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Quiz Points</TableHead>
                  {isUserAdmin && (
                    <TableHead className="w-[130px]">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuizData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isUserAdmin ? 4 : 3} className="text-center py-8">
                      {quizData.length === 0
                        ? "No quiz data available."
                        : "No students match your search query."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQuizData.map((student) => (
                    <TableRow key={student.student_id}>
                      <TableCell className="font-medium">
                        {student.rank === 1 ? (
                          <div className="flex items-center justify-center bg-yellow-500 text-white w-8 h-8 rounded-full">
                            <Trophy className="h-4 w-4" />
                          </div>
                        ) : student.rank === 2 ? (
                          <div className="flex items-center justify-center bg-gray-400 text-white w-8 h-8 rounded-full">
                            <Trophy className="h-4 w-4" />
                          </div>
                        ) : student.rank === 3 ? (
                          <div className="flex items-center justify-center bg-amber-700 text-white w-8 h-8 rounded-full">
                            <Trophy className="h-4 w-4" />
                          </div>
                        ) : (
                          <div className="ml-3">#{student.rank}</div>
                        )}
                      </TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.points.toFixed(2)}</TableCell>
                      {isUserAdmin && (
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleUpdateQuizPoints(student.student_id, 0.5)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleUpdateQuizPoints(student.student_id, -0.5)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Time Dialog */}
      <Dialog open={timeDialogOpen} onOpenChange={setTimeDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adjust Practice Time</DialogTitle>
            <DialogDescription>
              Add or deduct practice time for this student. Points will be automatically adjusted based on time.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="flex justify-center space-x-2">
              <div className="inline-flex items-center rounded-md border p-1">
                <Button 
                  variant={timeAction === "add" ? "default" : "outline"} 
                  className="rounded-sm px-3"
                  onClick={() => setTimeAction("add")}
                >
                  Add
                </Button>
                <Button 
                  variant={timeAction === "deduct" ? "default" : "outline"} 
                  className="rounded-sm px-3"
                  onClick={() => setTimeAction("deduct")}
                >
                  Deduct
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 items-center gap-4">
              <div>
                <label htmlFor="hours" className="text-sm font-medium mb-1 block">
                  Hours
                </label>
                <Input
                  id="hours"
                  type="number"
                  min="0"
                  value={timeHours}
                  onChange={(e) => setTimeHours(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <label htmlFor="minutes" className="text-sm font-medium mb-1 block">
                  Minutes
                </label>
                <Input
                  id="minutes"
                  type="number"
                  min="0"
                  max="59"
                  value={timeMinutes}
                  onChange={(e) => setTimeMinutes(e.target.value)}
                  placeholder="15"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTimeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleTimeDialogSubmit}>
              {timeAction === "add" ? "Add Time" : "Deduct Time"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Practice History Dialog */}
      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Practice History - {selectedStudentName}</DialogTitle>
            <DialogDescription>
              View practice sessions completed by this student.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center rounded-md border p-1">
                <Button 
                  variant={historyPeriod === "day" ? "default" : "outline"} 
                  className="rounded-sm px-3"
                  onClick={() => handleHistoryPeriodChange("day")}
                >
                  Today
                </Button>
                <Button 
                  variant={historyPeriod === "week" ? "default" : "outline"} 
                  className="rounded-sm px-3"
                  onClick={() => handleHistoryPeriodChange("week")}
                >
                  Week
                </Button>
                <Button 
                  variant={historyPeriod === "month" ? "default" : "outline"} 
                  className="rounded-sm px-3"
                  onClick={() => handleHistoryPeriodChange("month")}
                >
                  Month
                </Button>
                <Button 
                  variant={historyPeriod === "all" ? "default" : "outline"} 
                  className="rounded-sm px-3"
                  onClick={() => handleHistoryPeriodChange("all")}
                >
                  All Time
                </Button>
              </div>
            </div>
            
            {loadingHistory ? (
              <div className="flex justify-center items-center h-36">
                <p>Loading practice history...</p>
              </div>
            ) : practiceHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No practice sessions found</p>
                <p className="text-sm text-muted-foreground">
                  {historyPeriod === "day" 
                    ? "No practice sessions recorded today." 
                    : historyPeriod === "week"
                    ? "No practice sessions recorded this week."
                    : historyPeriod === "month"
                    ? "No practice sessions recorded this month."
                    : "No practice sessions recorded."}
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Started At</TableHead>
                      <TableHead>Completed At</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Points</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {practiceHistory.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>{formatDate(session.started_at)}</TableCell>
                        <TableCell>{formatDate(session.completed_at || session.started_at)}</TableCell>
                        <TableCell>
                          {session.duration_minutes 
                            ? `${Math.floor(session.duration_minutes / 60)}h ${session.duration_minutes % 60}m` 
                            : calculateDuration(session.started_at, session.completed_at || session.started_at)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {parseFloat(session.points.toString()).toFixed(2)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setHistoryDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 