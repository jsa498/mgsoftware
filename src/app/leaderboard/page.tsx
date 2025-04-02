"use client";

import { useState, useEffect } from "react";
import {
  Trophy,
  Search,
  RefreshCw,
  Plus,
  Minus,
  MoreVertical,
  BarChart2,
  RotateCcw,
  Clock,
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
import { getPracticeLeaderboard, getQuizLeaderboard, updateQuizPoints } from "@/lib/data-service";
import { toast } from "@/components/ui/use-toast";
import { isAdmin } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";

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

export default function Leaderboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [practiceData, setPracticeData] = useState<PracticeLeaderboardItem[]>([]);
  const [quizData, setQuizData] = useState<QuizLeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [timeDialogOpen, setTimeDialogOpen] = useState(false);
  const [timeAction, setTimeAction] = useState<"add" | "deduct">("add");
  const [timeAmount, setTimeAmount] = useState<string>("15");
  const [timeHours, setTimeHours] = useState<string>("0");
  const [timeMinutes, setTimeMinutes] = useState<string>("15");
  
  // Fetch leaderboard data on component mount
  useEffect(() => {
    fetchLeaderboardData();
    // Check if the current user is an admin
    setIsUserAdmin(isAdmin());
  }, []);
  
  // Function to fetch leaderboard data
  const fetchLeaderboardData = async () => {
    setLoading(true);
    try {
      const practiceLeaderboard = await getPracticeLeaderboard();
      const quizLeaderboard = await getQuizLeaderboard();
      
      setPracticeData(practiceLeaderboard);
      setQuizData(quizLeaderboard);
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
      
      const student = practiceData[studentIndex];
      const currentTime = student.time;
      
      // Parse current time (format: "2h 54m")
      const hourMatch = currentTime.match(/(\d+)h/);
      const minuteMatch = currentTime.match(/(\d+)m/);
      
      const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
      const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;
      
      // Calculate total minutes being added/deducted
      let minuteDelta = minutesToAdd;
      
      // Calculate points (2 points per hour)
      const pointsDelta = (minuteDelta / 60) * 2;
      
      // Instead of updating an existing session, create a new adjustment session
      // This ensures the leaderboard aggregation works correctly
      const { data, error } = await supabase
        .from('practice_sessions')
        .insert({
          student_id: studentId,
          duration_minutes: minuteDelta,
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
  
  // Filter practice data based on search query
  const filteredPracticeData = practiceData.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter quiz data based on search query
  const filteredQuizData = quizData.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
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
                  <TableHead>Practice Time</TableHead>
                  <TableHead>Practice Points</TableHead>
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
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.time}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-medium">
                          {student.points.toFixed(2)}
                        </Badge>
                      </TableCell>
                      {isUserAdmin && (
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openTimeDialog(student.student_id)}
                          >
                            <Clock className="h-4 w-4" />
                          </Button>
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
    </div>
  );
} 