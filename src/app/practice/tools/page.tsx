"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { PlayIcon, PauseIcon, MinusIcon, PlusIcon, ChevronLeftIcon, ChevronRightIcon, VolumeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { startPracticeSession, updatePracticeSession, completePracticeSession, getActivePracticeSession } from "@/lib/data-service"
import { useToast } from "@/components/ui/use-toast"
import { getCurrentUser } from "@/lib/auth"
import { getStudentProfileByUserId } from "@/lib/data-service"

const notes = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"]

export default function PracticeToolsPage() {
  const [bpm, setBpm] = useState(100)
  const [currentNote, setCurrentNote] = useState("A")
  const [isPlaying, setIsPlaying] = useState(false)
  const [volumes, setVolumes] = useState({
    lehra: 50,
    tanpura: 50,
    tabla: 50,
  })
  
  // Practice session state
  const [practiceTime, setPracticeTime] = useState(0) // time in seconds
  const [practicePoints, setPracticePoints] = useState(0)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [practiceCompleted, setPracticeCompleted] = useState(false)
  const [completionData, setCompletionData] = useState<{
    duration: string;
    points: string;
    durationMinutes: number;
  } | null>(null)
  
  // Timer ref to store interval ID
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  
  const { toast } = useToast()
  
  // Format practice time as HH:MM:SS
  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600)
    const minutes = Math.floor((timeInSeconds % 3600) / 60)
    const seconds = timeInSeconds % 60
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  
  // Calculate points from practice time (2 points per hour)
  const calculatePoints = useCallback((timeInSeconds: number) => {
    return (timeInSeconds / 3600) * 2
  }, [])

  // Start the timer for practice session
  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    
    timerRef.current = setInterval(() => {
      setPracticeTime(prev => {
        const newTime = prev + 1
        // Update points (2 points per hour)
        setPracticePoints(calculatePoints(newTime))
        
        // Update session in database every minute
        if (newTime % 60 === 0 && sessionId) {
          updatePracticeSession(sessionId, Math.floor(newTime / 60))
            .catch(err => console.error('Error updating session:', err))
        }
        
        return newTime
      })
    }, 1000)
  }, [sessionId, calculatePoints])
  
  // Stop the timer
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  // Check for existing practice session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const user = await getCurrentUser()
        if (user && user.role === 'student') {
          // Get student profile to get student_id
          const studentProfile = await getStudentProfileByUserId(user.id)
          if (studentProfile?.id) {
            const session = await getActivePracticeSession(studentProfile.id as string)
            if (session) {
              setSessionId(session.id as string)
              // Calculate elapsed time from started_at to now
              const startedAt = new Date(session.started_at as string)
              const now = new Date()
              const elapsedSeconds = Math.floor((now.getTime() - startedAt.getTime()) / 1000)
              setPracticeTime(elapsedSeconds)
              setPracticePoints(calculatePoints(elapsedSeconds))
              setIsPlaying(true)
              startTimer()
            }
          }
        }
      } catch (error) {
        console.error('Error checking for existing session:', error)
      }
    }
    
    checkExistingSession()
    
    // Cleanup timer on component unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [startTimer, calculatePoints])
  
  // Start practice session
  const handleStartPractice = async () => {
    try {
      const user = await getCurrentUser()
      if (!user || user.role !== 'student') {
        toast({
          title: "Authentication Error",
          description: "You must be logged in as a student to practice.",
          variant: "destructive",
        })
        return
      }
      
      // Get student profile to get student_id
      const studentProfile = await getStudentProfileByUserId(user.id)
      if (!studentProfile?.id) {
        toast({
          title: "Profile Error",
          description: "Could not find your student profile. Please contact support.",
          variant: "destructive",
        })
        return
      }
      
      const id = await startPracticeSession(studentProfile.id as string)
      if (id) {
        setSessionId(id)
        setPracticeTime(0)
        setPracticePoints(0)
        setIsPlaying(true)
        startTimer()
        
        toast({
          title: "Practice Started",
          description: "Your practice session has started. The timer is now running.",
        })
      }
    } catch (error) {
      console.error('Error starting practice:', error)
      toast({
        title: "Error",
        description: "Failed to start practice. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  // Stop practice session
  const handleStopPractice = async () => {
    try {
      if (!sessionId) return
      
      stopTimer()
      setIsPlaying(false)
      
      // Convert seconds to minutes (rounding up to nearest 0.01)
      const durationMinutes = Math.ceil(practiceTime / 60 * 100) / 100
      
      const result = await completePracticeSession(sessionId, durationMinutes)
      if (result.success) {
        setCompletionData({
          duration: formatTime(practiceTime),
          points: practicePoints.toFixed(2),
          durationMinutes,
        })
        setPracticeCompleted(true)
        setSessionId(null)
      }
    } catch (error) {
      console.error('Error stopping practice:', error)
      toast({
        title: "Error",
        description: "Failed to complete practice. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  // Close the completion dialog
  const handleCloseCompletion = () => {
    setPracticeCompleted(false)
    setCompletionData(null)
    setPracticeTime(0)
    setPracticePoints(0)
  }

  // Function to handle volume change
  const handleVolumeChange = (type: keyof typeof volumes, value: number[]) => {
    setVolumes((prev) => ({
      ...prev,
      [type]: value[0],
    }))
  }

  // Function to handle BPM change
  const handleBpmChange = (value: number[]) => {
    setBpm(value[0])
  }

  // Function to increment/decrement BPM
  const adjustBpm = (amount: number) => {
    const newBpm = Math.max(30, Math.min(300, bpm + amount))
    setBpm(newBpm)
  }

  // Function to navigate through notes
  const changeNote = (direction: "prev" | "next") => {
    const currentIndex = notes.indexOf(currentNote)
    if (direction === "prev") {
      const prevIndex = (currentIndex - 1 + notes.length) % notes.length
      setCurrentNote(notes[prevIndex])
    } else {
      const nextIndex = (currentIndex + 1) % notes.length
      setCurrentNote(notes[nextIndex])
    }
  }

  // Function to toggle play/pause
  const togglePlay = () => {
    if (isPlaying) {
      handleStopPractice()
    } else {
      handleStartPractice()
    }
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex flex-col items-center space-y-8">
          {/* Practice Timer Display */}
          {isPlaying && (
            <div className="inline-flex items-center gap-2 bg-card/80 border shadow-sm rounded-full px-4 py-1.5 mx-auto">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Session:</span>
                <span className="text-base font-medium">{formatTime(practiceTime)}</span>
              </div>
              <div className="h-4 w-px bg-border/50"></div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Points:</span>
                <span className="text-xs font-medium bg-muted px-2 py-0.5 rounded-full">
                  {practicePoints.toFixed(2)}
                </span>
              </div>
            </div>
          )}
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={isPlaying ? "secondary" : "default"}
                size="lg" 
                className="rounded-full px-8 py-6 text-base font-medium"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <><PauseIcon className="mr-2 h-5 w-5" /> Stop Practice</>
                ) : (
                  <><PlayIcon className="mr-2 h-5 w-5" /> Start Practice</>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isPlaying ? "Stop the practice session" : "Begin your practice session"}</p>
            </TooltipContent>
          </Tooltip>

          {/* Note Selection */}
          <div className="flex flex-col items-center gap-2">
            <Label className="text-xs text-muted-foreground">CURRENT NOTE</Label>
            <div className="flex items-center justify-center gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full h-12 w-12" 
                    onClick={() => changeNote("prev")}
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Previous note</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="flex items-center justify-center h-28 w-28 rounded-full border-2">
                    <CardContent className="flex items-center justify-center p-0 h-full w-full">
                      <span className="text-5xl font-bold">{currentNote}</span>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Current note</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full h-12 w-12" 
                    onClick={() => changeNote("next")}
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Next note</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* BPM Controls */}
          <div className="flex items-center w-full gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full h-12 w-12"
                  onClick={() => adjustBpm(-5)}
                >
                  <MinusIcon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Decrease BPM by 5</p>
              </TooltipContent>
            </Tooltip>
            
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <Label className="text-base">BPM</Label>
                <Badge variant="outline">{bpm}</Badge>
              </div>
              <Slider 
                value={[bpm]} 
                min={30} 
                max={300} 
                step={1} 
                onValueChange={handleBpmChange} 
                className="my-2" 
              />
            </div>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full h-12 w-12"
                  onClick={() => adjustBpm(5)}
                >
                  <PlusIcon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Increase BPM by 5</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* BPM and Matra Display */}
          <div className="flex items-center justify-center gap-4 max-w-[220px] mx-auto">
            <div className="text-center py-2 px-5 rounded-full bg-background/5 border border-border/50 shadow-sm">
              <div className="text-3xl font-medium tracking-tight">{bpm}</div>
              <div className="text-xs uppercase tracking-widest mt-0.5 text-muted-foreground">BPM</div>
            </div>
          </div>

          {/* Instrument Selection */}
          <div className="flex flex-row gap-2 overflow-x-auto pb-1 w-full sm:grid sm:grid-cols-3 sm:gap-3 md:gap-4">
            <Select defaultValue="sarangi">
              <SelectTrigger className="rounded-lg min-w-[120px] sm:min-w-0">
                <SelectValue placeholder="Sarangi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sarangi">Sarangi</SelectItem>
                <SelectItem value="violin">Violin</SelectItem>
                <SelectItem value="sitar">Sitar</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="roopak">
              <SelectTrigger className="rounded-lg min-w-[120px] sm:min-w-0">
                <SelectValue placeholder="Roopak (7)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="roopak">Roopak (7)</SelectItem>
                <SelectItem value="teental">Teental (16)</SelectItem>
                <SelectItem value="dadra">Dadra (6)</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="charukeshi">
              <SelectTrigger className="rounded-lg min-w-[120px] sm:min-w-0">
                <SelectValue placeholder="Charukeshi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="charukeshi">Charukeshi</SelectItem>
                <SelectItem value="bhairav">Bhairav</SelectItem>
                <SelectItem value="yaman">Yaman</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Volume Controls */}
          <div className="w-full space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Label className="w-24 text-sm">LEHRA</Label>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Adjust Lehra volume</p>
                  </TooltipContent>
                </Tooltip>
                <div className="flex-1 flex items-center gap-3">
                  <VolumeIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Slider 
                    value={[volumes.lehra]} 
                    min={0} 
                    max={100} 
                    step={1} 
                    onValueChange={(value) => handleVolumeChange("lehra", value)} 
                  />
                  <span className="text-sm text-muted-foreground w-8">{volumes.lehra}%</span>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Label className="w-24 text-sm">TANPURA</Label>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Adjust Tanpura volume</p>
                  </TooltipContent>
                </Tooltip>
                <div className="flex-1 flex items-center gap-3">
                  <VolumeIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Slider 
                    value={[volumes.tanpura]} 
                    min={0} 
                    max={100} 
                    step={1} 
                    onValueChange={(value) => handleVolumeChange("tanpura", value)} 
                  />
                  <span className="text-sm text-muted-foreground w-8">{volumes.tanpura}%</span>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Label className="w-24 text-sm">TABLA</Label>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Adjust Tabla volume</p>
                  </TooltipContent>
                </Tooltip>
                <div className="flex-1 flex items-center gap-3">
                  <VolumeIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Slider 
                    value={[volumes.tabla]} 
                    min={0} 
                    max={100} 
                    step={1} 
                    onValueChange={(value) => handleVolumeChange("tabla", value)} 
                  />
                  <span className="text-sm text-muted-foreground w-8">{volumes.tabla}%</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Play Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={isPlaying ? "secondary" : "default"}
                size="icon" 
                className="rounded-full h-16 w-16 mt-4"
                onClick={togglePlay}
              >
                {isPlaying ? <PauseIcon className="h-8 w-8" /> : <PlayIcon className="h-8 w-8" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isPlaying ? "Pause" : "Play"}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      
      {/* Practice Completion Dialog */}
      <Dialog open={practiceCompleted} onOpenChange={setPracticeCompleted}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Practice Session Completed</DialogTitle>
            <DialogDescription>
              Great job! Here&apos;s a summary of your practice session.
            </DialogDescription>
          </DialogHeader>
          
          {completionData && (
            <div className="flex flex-col items-center space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 w-full">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm text-center">Practice Time</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-2xl font-bold text-center">{completionData.duration}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm text-center">Points Earned</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-2xl font-bold text-center">{completionData.points}</p>
                  </CardContent>
                </Card>
              </div>
              
              <p className="text-center text-muted-foreground text-sm">
                Your progress has been saved and added to the leaderboard.
              </p>
            </div>
          )}
          
          <DialogFooter className="flex justify-center sm:justify-center">
            <Button 
              type="button" 
              onClick={handleCloseCompletion}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
} 