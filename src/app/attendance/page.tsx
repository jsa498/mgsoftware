"use client"

import { useState, useEffect } from "react"
import { format, startOfMonth, eachDayOfInterval, isSameMonth, 
  isToday, startOfWeek, endOfWeek, addWeeks, subWeeks, getWeek, getWeeksInMonth } from "date-fns"
import { Users } from "lucide-react"
import { ChevronLeft, ChevronRight, Check, X, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Progress } from "@/components/ui/progress"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { cn } from "@/lib/utils"
import { getAllGroups, getGroupStudents, getGroupAttendance, updateAttendance, clearGroupAttendance } from "@/lib/data-service"
import { Group, StudentAttendance } from "@/lib/types"
import { toast } from "@/components/ui/use-toast"

export default function AttendancePage() {
  const [currentDate] = useState(new Date())
  const [groups, setGroups] = useState<Group[]>([])
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [students, setStudents] = useState<StudentAttendance[]>([])
  const [selectedMonth, setSelectedMonth] = useState(currentDate)
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(currentDate, { weekStartsOn: 6 })) // Start on Saturday
  const [groupDialogOpen, setGroupDialogOpen] = useState(false)
  const [monthPickerOpen, setMonthPickerOpen] = useState(false)
  const [attendanceData, setAttendanceData] = useState<Record<string, Record<number, boolean | null>>>({})
  const [loading, setLoading] = useState(true)

  // Calculate current week
  const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 6 })
  const visibleDays = eachDayOfInterval({ start: currentWeekStart, end: weekEnd })
  
  // Calculate week number and total weeks in month
  const currentWeekNumber = getWeek(currentWeekStart) - getWeek(startOfMonth(selectedMonth)) + 1
  const totalWeeksInMonth = getWeeksInMonth(selectedMonth, { weekStartsOn: 6 })

  // Load groups on component mount
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const allGroups = await getAllGroups();
        setGroups(allGroups);
        
        if (allGroups.length > 0) {
          setSelectedGroup(allGroups[0]);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
        toast({
          title: "Error",
          description: "Failed to load groups. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    fetchGroups();
  }, []);

  // Load students and attendance data when group or month changes
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedGroup) return;
      
      setLoading(true);
      try {
        // Get students in the selected group
        const groupStudents = await getGroupStudents(selectedGroup.id);
        
        // Format students into the expected format
        const formattedStudents: StudentAttendance[] = groupStudents.map(student => ({
          id: student.id,
          name: `${student.first_name} ${student.last_name}`,
          contact: student.phone || '',
          attendance: {}
        }));
        
        setStudents(formattedStudents);
        
        // Get attendance records for this group in the selected month
        const attendanceRecords = await getGroupAttendance(selectedGroup.id, selectedMonth);
        setAttendanceData(attendanceRecords);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        toast({
          title: "Error",
          description: "Failed to load attendance data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedGroup, selectedMonth]);

  // Function to toggle attendance
  const toggleAttendance = async (studentId: string, day: number) => {
    if (!selectedGroup) return;
    
    const date = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day);
    const currentStatus = attendanceData[studentId]?.[day];
    
    let newStatus: boolean | null;
    
    if (currentStatus === undefined || currentStatus === null) {
      newStatus = true;
    } else if (currentStatus === true) {
      newStatus = false;
    } else {
      newStatus = null;
    }
    
    // Update local state immediately for responsiveness
    setAttendanceData(prev => {
      const studentAttendance = { ...(prev[studentId] || {}) };
      
      if (newStatus === null) {
        delete studentAttendance[day];
      } else {
        studentAttendance[day] = newStatus;
      }
      
      return {
        ...prev,
        [studentId]: studentAttendance
      };
    });
    
    // Update database
    try {
      await updateAttendance(studentId, selectedGroup.id, date, newStatus);
    } catch (error) {
      console.error("Error updating attendance:", error);
      toast({
        title: "Error",
        description: "Failed to update attendance. Please try again.",
        variant: "destructive",
      });
      
      // Revert local state if update failed
      setAttendanceData(prev => {
        const studentAttendance = { ...(prev[studentId] || {}) };
        
        if (currentStatus === undefined) {
          delete studentAttendance[day];
        } else {
          studentAttendance[day] = currentStatus;
        }
        
        return {
          ...prev,
          [studentId]: studentAttendance
        };
      });
    }
  };

  const handlePreviousWeek = () => {
    setCurrentWeekStart(prev => subWeeks(prev, 1))
  }

  const handleNextWeek = () => {
    setCurrentWeekStart(prev => addWeeks(prev, 1))
  }

  // These functions are currently unused but may be needed in the future
  /* 
  const handlePreviousMonth = () => {
    setSelectedMonth(prev => {
      const newMonth = subMonths(prev, 1)
      // Also update the current week to the first week of the new month
      setCurrentWeekStart(startOfWeek(startOfMonth(newMonth), { weekStartsOn: 6 }))
      return newMonth
    })
  }

  const handleNextMonth = () => {
    setSelectedMonth(prev => {
      const newMonth = addMonths(prev, 1)
      // Also update the current week to the first week of the new month
      setCurrentWeekStart(startOfWeek(startOfMonth(newMonth), { weekStartsOn: 6 }))
      return newMonth
    })
  }
  */

  const handleClearAllAttendance = async () => {
    if (!selectedGroup) return;
    
    if (!confirm("Are you sure you want to clear all attendance records for this group in the current month?")) {
      return;
    }
    
    try {
      await clearGroupAttendance(selectedGroup.id, selectedMonth);
      
      // Clear local state
      const emptyAttendance: Record<string, Record<number, boolean | null>> = {};
      students.forEach(student => {
        emptyAttendance[student.id] = {};
      });
      
      setAttendanceData(emptyAttendance);
      
      toast({
        title: "Success",
        description: "Attendance records cleared successfully.",
      });
    } catch (error) {
      console.error("Error clearing attendance:", error);
      toast({
        title: "Error",
        description: "Failed to clear attendance records. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Calculate attendance statistics for a student
  const getStudentStats = (studentId: string) => {
    const studentAttendance = attendanceData[studentId] || {}
    const presentDays = Object.values(studentAttendance).filter(value => value === true).length
    const absentDays = Object.values(studentAttendance).filter(value => value === false).length
    const totalDays = Object.values(studentAttendance).length
    const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0

    return {
      presentDays,
      absentDays,
      totalDays,
      attendanceRate
    }
  }

  // Ensure the current week aligns with the selected month when month changes
  useEffect(() => {
    // If the current week is not in the selected month, reset to the first week of the month
    if (!isSameMonth(currentWeekStart, selectedMonth) && !isSameMonth(weekEnd, selectedMonth)) {
      setCurrentWeekStart(startOfWeek(startOfMonth(selectedMonth), { weekStartsOn: 6 }))
    }
  }, [selectedMonth, currentWeekStart, weekEnd])

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Attendance Manager</h1>
          <p className="text-muted-foreground">Mark and manage student attendance</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Group Selector */}
          <Dialog open={groupDialogOpen} onOpenChange={setGroupDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto justify-start md:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{selectedGroup?.name || "Select Group"}</span>
                </div>
                <span className="text-blue-500">Change →</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Select Group</DialogTitle>
              </DialogHeader>
              <Command>
                <CommandInput placeholder="Search groups..." />
                <CommandList>
                  <CommandEmpty>No group found.</CommandEmpty>
                  <CommandGroup>
                    {groups.map((group) => (
                      <CommandItem
                        key={group.id}
                        onSelect={() => {
                          setSelectedGroup(group)
                          setGroupDialogOpen(false)
                        }}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <div className={`h-2 w-2 rounded-full ${group.status === 'active' ? "bg-green-500" : "bg-gray-300"}`} />
                        <span>{group.name}</span>
                        {group.id === selectedGroup?.id && <Check className="h-4 w-4 ml-auto" />}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
                <div className="border-t px-2 py-2 text-xs flex items-center">
                  <Users className="h-3 w-3 mr-1" /> {groups.length} groups available
                </div>
              </Command>
            </DialogContent>
          </Dialog>

          {/* Month Selector */}
          <div className="flex items-center gap-4">
            <Popover open={monthPickerOpen} onOpenChange={setMonthPickerOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-between gap-2">
                  <span>{format(selectedMonth, "MMMM yyyy")}</span>
                  <span className="text-blue-500">Change →</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={selectedMonth}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedMonth(date)
                      setMonthPickerOpen(false)
                    }
                  }}
                  initialFocus
                  month={selectedMonth}
                  onMonthChange={setSelectedMonth}
                  captionLayout="dropdown-buttons"
                  fromMonth={new Date(2020, 0)}
                  toMonth={new Date(2030, 11)}
                  classNames={{
                    caption_dropdowns: "flex justify-center gap-1",
                    dropdown_month: "w-full",
                    dropdown_year: "w-full",
                    nav: "hidden",
                  }}
                  showOutsideDays={false}
                />
                <div className="p-3 border-t flex justify-between">
                  <Button variant="outline" onClick={() => setMonthPickerOpen(false)}>Cancel</Button>
                  <Button onClick={() => {
                    setSelectedMonth(new Date())
                    setMonthPickerOpen(false)
                  }}>This month</Button>
                </div>
              </PopoverContent>
            </Popover>

            <Button 
              variant="destructive" 
              onClick={handleClearAllAttendance} 
              disabled={!selectedGroup || loading}
            >
              Clear All Attendance
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between py-2 border-b">
        <Button variant="ghost" size="icon" onClick={handlePreviousWeek}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm font-medium">Week {currentWeekNumber} of {totalWeeksInMonth}</div>
        <Button variant="ghost" size="icon" onClick={handleNextWeek}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p>Loading attendance data...</p>
        </div>
      ) : students.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-lg text-muted-foreground">No students in this group.</p>
          <p className="mt-2">Go to the Students page to add students to this group.</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left py-3 px-4 font-medium">NAME</th>
                <th className="text-left py-3 px-4 font-medium">CONTACT</th>
                {visibleDays.map((day) => (
                  <th key={day.getTime()} className="text-center py-3 px-2 font-medium w-16">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "rounded-full w-8 h-8 flex items-center justify-center",
                        isToday(day) && "bg-primary text-primary-foreground"
                      )}>
                        {day.getDate()}
                      </div>
                      <div className="text-xs uppercase">
                        {format(day, "EEE").substring(0, 3)}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const stats = getStudentStats(student.id)
                
                return (
                  <tr key={student.id} className="border-t hover:bg-muted/30">
                    <td className="py-4 px-4">
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <div className="flex items-center gap-2 cursor-help">
                            {student.name}
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">{student.name}</h4>
                            <div className="text-sm">
                              <div className="flex justify-between mb-1">
                                <span>Attendance Rate</span>
                                <span>{stats.attendanceRate.toFixed(0)}%</span>
                              </div>
                              <Progress value={stats.attendanceRate} className="h-2" />
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-green-500" />
                                <span>Present: {stats.presentDays}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-red-500" />
                                <span>Absent: {stats.absentDays}</span>
                              </div>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </td>
                    <td className="py-4 px-4">{student.contact}</td>
                    {visibleDays.map((day) => {
                      const dayNum = day.getDate()
                      const status = attendanceData[student.id]?.[dayNum]
                      return (
                        <td key={day.getTime()} className="text-center">
                          <button
                            onClick={() => toggleAttendance(student.id, dayNum)}
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                              status === undefined || status === null
                                ? "bg-gray-700 hover:bg-gray-600" 
                                : status 
                                  ? "bg-green-500/80 hover:bg-green-500" 
                                  : "bg-red-500/80 hover:bg-red-500"
                            )}
                            aria-label={status === undefined || status === null
                              ? "Mark attendance" 
                              : status 
                                ? "Present" 
                                : "Absent"}
                            disabled={loading}
                          >
                            {status === true && <Check className="h-5 w-5" />}
                            {status === false && <X className="h-5 w-5" />}
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {!loading && students.length > 0 && (
        <div className="bg-muted/30 rounded-lg p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-medium">Total Students</h3>
            <p className="text-2xl font-semibold">{students.length}</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium">Average Attendance Rate</h3>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-semibold">
                {(students.reduce((sum, student) => sum + getStudentStats(student.id).attendanceRate, 0) / students.length || 0).toFixed(0)}%
              </p>
              <div className="flex-1">
                <Progress 
                  value={students.reduce((sum, student) => sum + getStudentStats(student.id).attendanceRate, 0) / students.length || 0} 
                  className="h-2" 
                />
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium">Present Today</h3>
            <p className="text-2xl font-semibold text-green-500">
              {students.filter(student => {
                const today = new Date().getDate()
                return attendanceData[student.id]?.[today] === true
              }).length} / {students.length}
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium">Week {currentWeekNumber} Attendance</h3>
            <p className="text-2xl font-semibold">
              {(students.reduce((sum, student) => {
                let presentCount = 0
                let totalDays = 0
                
                visibleDays.forEach(day => {
                  const dayNum = day.getDate()
                  if (attendanceData[student.id]?.[dayNum] !== undefined) {
                    totalDays++
                    if (attendanceData[student.id]?.[dayNum] === true) {
                      presentCount++
                    }
                  }
                })
                
                return sum + (totalDays > 0 ? (presentCount / totalDays) * 100 : 0)
              }, 0) / students.length || 0).toFixed(0)}%
            </p>
          </div>
        </div>
      )}
    </div>
  )
} 