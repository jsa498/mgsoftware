"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
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
import { InstrumentVerificationDialog } from "@/components/InstrumentVerificationDialog"
import { supabase } from "@/lib/supabase"
import { Howl } from "howler"

const notes = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"]

const noteFileMap: { [key: string]: string } = {
  "A": "A.mp3",
  "A#": "A_sharp.mp3",
  "B": "B.mp3",
  "C": "C.mp3",
  "C#": "C_sharp.mp3",
  "D": "D.mp3",
  "D#": "D_sharp.mp3",
  "E": "E.mp3",
  "F": "F.mp3",
  "F#": "F_sharp.mp3",
  "G": "G.mp3",
  "G#": "G_sharp.mp3",
};

// Extend Window interface to include prefixed AudioContext
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

export default function PracticeToolsPage() {
  const [bpm, setBpm] = useState(100)
  const [currentNote, setCurrentNote] = useState("A")
  const [isPlaying, setIsPlaying] = useState(false)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
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
  
  // Track session start time for accurate timing even when tab is not active
  const sessionStartTimeRef = useRef<Date | null>(null)
  const lastUpdateTimeRef = useRef<Date | null>(null)
  
  // Instrument verification state
  const [verificationOpen, setVerificationOpen] = useState(false)
  
  // Timer ref to store interval ID
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  // Ref to hold each note's HTMLAudioElement and associated WebAudio gain node
  const noteAudioRefs = useRef<Record<string, { element: HTMLAudioElement; gainNode: GainNode }>>({});
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  // Single AudioContext for WebAudio control (Tanpura & Howler)
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Add instrument, taal, and raag state with dynamic raag options
  const [instrument, setInstrument] = useState("sitar")
  const [taal, setTaal] = useState("teental")
  const matraCountMap = useMemo<Record<string, number>>(() => ({ roopak: 7, teental: 16, dadra: 6 }), [])
  const matraCount = matraCountMap[taal] || 16
  const [currentMatra, setCurrentMatra] = useState(1)
  const raagOptions: string[] = useMemo<string[]>(() => {
    if (instrument === "sitar" && taal === "teental") {
      return ["bhimpalasi"]
    }
    return ["charukeshi", "bhairav", "yaman"]
  }, [instrument, taal])
  const [raag, setRaag] = useState<string>(raagOptions[0])
  const lehraHowlRef = useRef<Howl | null>(null)
  
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
    
    // Store the current time as last update time
    lastUpdateTimeRef.current = new Date()
    
    timerRef.current = setInterval(() => {
      // Calculate elapsed time since last update
      const now = new Date()
      const elapsed = lastUpdateTimeRef.current 
        ? Math.floor((now.getTime() - lastUpdateTimeRef.current.getTime()) / 1000)
        : 1 // Default to 1 second if no last update time
      
      lastUpdateTimeRef.current = now
      
      setPracticeTime(prev => {
        const newTime = prev + elapsed
        // Update points (2 points per hour)
        setPracticePoints(calculatePoints(newTime))
        
        // Update session in database every minute
        if (Math.floor(newTime / 60) > Math.floor(prev / 60) && sessionId) {
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
              sessionStartTimeRef.current = startedAt
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
  
  // Initialize AudioContext once for WebAudio operations
  useEffect(() => {
    // Choose the available AudioContext constructor
    const ContextCtor: typeof AudioContext = window.AudioContext ?? window.webkitAudioContext!;
    audioContextRef.current = new ContextCtor();
  }, []);

  // Preload all Tanpura audio files with WebAudio gain nodes on mount
  useEffect(() => {
    const context = audioContextRef.current;
    if (!context) return;
    Object.entries(noteFileMap).forEach(([note, fileName]) => {
      const { data } = supabase.storage.from('instrument-audio').getPublicUrl(fileName);
      const url = data?.publicUrl;
      if (url) {
        // Create HTMLAudioElement with CORS to allow WebAudio source
        const element = new Audio();
        element.crossOrigin = 'anonymous';
        element.src = url;
        element.loop = true;
        element.preload = 'auto';
        element.load();
        // Create WebAudio nodes
        const srcNode = context.createMediaElementSource(element);
        const gainNode = context.createGain();
        srcNode.connect(gainNode).connect(context.destination);
        noteAudioRefs.current[note] = { element, gainNode };
      } else {
        console.error(`Could not preload audio for note ${note}`);
      }
    });
  }, []);

  // Refs to hold latest audio play state & volumes for preload effect
  const isAudioPlayingRef = useRef(isAudioPlaying)
  useEffect(() => {
    isAudioPlayingRef.current = isAudioPlaying
  }, [isAudioPlaying])
  const volumesRef = useRef(volumes)
  useEffect(() => {
    volumesRef.current = volumes
  }, [volumes])
  
  // Preload Lehra audio via Howler when instrument, taal, raag, or tonic note changes
  // We manage volume and play-state via refs to avoid reloading the Howl on every slider change.
  useEffect(() => {
    // Preserve previous playback position
    const prevHowl = lehraHowlRef.current
    const prevPos = prevHowl ? (prevHowl.seek() as number) : 0
    const taalSpelling = taal === "teental" ? "teentaal" : taal
    const instrumentFolder = `lehra_${instrument}`
    // Normalize sharp notes to match file naming (_sharp)
    const normalizedNote = currentNote.includes('#') ? currentNote.replace('#', '_sharp') : currentNote
    const fileName = `${raag}_${normalizedNote}.wav`
    const filePath = `${instrumentFolder}/${taalSpelling}/${fileName}`
    const { data } = supabase.storage.from('instrument-audio').getPublicUrl(filePath)
    const url = data?.publicUrl
    if (url) {
      if (prevHowl) {
        prevHowl.unload()
      }
      // Use the latest volume from ref (fallback to full volume)
      const initialVol = volumesRef.current.lehra / 100 || 1
      const newHowl = new Howl({
        src: [url],
        loop: true,
        volume: initialVol,
      })
      lehraHowlRef.current = newHowl
      // Seamlessly resume playback if the user was already playing
      if (isAudioPlayingRef.current) {
        newHowl.once('load', () => {
          const duration = newHowl.duration()
          const seekPos = prevPos % duration
          newHowl.seek(seekPos)
          if (!newHowl.playing()) {
            newHowl.play()
          }
        })
      }
    } else {
      console.error(`Could not preload Lehra audio for ${filePath}`)
    }
  }, [instrument, taal, raag, currentNote])

  // Update Lehra volume without restarting playback
  useEffect(() => {
    const howl = lehraHowlRef.current
    if (!howl) return
    howl.volume(volumes.lehra / 100)
  }, [volumes.lehra])

  // Play or pause Lehra without overlap
  useEffect(() => {
    const howl = lehraHowlRef.current
    if (!howl) return
    if (isAudioPlaying) {
      // Avoid overlapping plays
      if (!howl.playing()) {
        howl.play()
      }
    } else {
      howl.pause()
    }
  }, [isAudioPlaying])

  // Track and display current matra (beat) within the cycle
  useEffect(() => {
    let rafId: number
    const updateBeat = () => {
      const howl = lehraHowlRef.current
      if (howl && isAudioPlaying) {
        const pos = howl.seek() as number
        const cycleSec = (matraCount / bpm) * 60
        const posInCycle = pos % cycleSec
        const beat = Math.floor((posInCycle / cycleSec) * matraCount) + 1
        setCurrentMatra(beat)
        rafId = requestAnimationFrame(updateBeat)
      }
    }
    if (isAudioPlaying) {
      rafId = requestAnimationFrame(updateBeat)
    }
    return () => {
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [isAudioPlaying, bpm, matraCount])

  // Control Tanpura audio playback when note, play state, or volume changes
  useEffect(() => {
    // Manage playback & gain for current note
    const prevEl = currentAudioRef.current;
    const refObj = noteAudioRefs.current[currentNote];
    if (!refObj) return;
    const { element, gainNode } = refObj;
    // Pause any previous note
    if (prevEl && prevEl !== element) {
      prevEl.pause();
    }
    // Update gain value (WebAudio)
    gainNode.gain.value = volumes.tanpura / 100;
    if (isAudioPlaying) {
      // Ensure AudioContext is resumed on user interaction
      audioContextRef.current?.resume().catch(err => console.error('AudioContext resume error:', err));
      element.play().catch(e => console.error('Error playing tanpura:', e));
    } else {
      element.pause();
    }
    currentAudioRef.current = element;
  }, [currentNote, isAudioPlaying, volumes.tanpura]);

  // Handle visibility changes
  useEffect(() => {
    if (!isPlaying) return
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Tab is visible again, update the timer
        if (sessionId && lastUpdateTimeRef.current) {
          const now = new Date()
          const elapsed = Math.floor((now.getTime() - lastUpdateTimeRef.current.getTime()) / 1000)
          
          // Only update if significant time has passed (more than 2 seconds)
          if (elapsed > 2) {
            setPracticeTime(prev => {
              const newTime = prev + elapsed
              setPracticePoints(calculatePoints(newTime))
              
              // Update session in database if minutes changed
              if (Math.floor(newTime / 60) > Math.floor(prev / 60)) {
                updatePracticeSession(sessionId, Math.floor(newTime / 60))
                  .catch(err => console.error('Error updating session:', err))
              }
              
              return newTime
            })
          }
          
          lastUpdateTimeRef.current = now
        }
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isPlaying, sessionId, calculatePoints])
  
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
        sessionStartTimeRef.current = new Date()
        lastUpdateTimeRef.current = new Date()
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
      // Show verification dialog instead of starting practice immediately
      setVerificationOpen(true)
    }
  }

  // Handle the bottom play button separately from practice session
  const handleBottomPlayButton = () => {
    // Resume AudioContext on user gesture and toggle audio playback
    audioContextRef.current?.resume().catch(err => console.error('AudioContext resume error:', err));
    setIsAudioPlaying(prev => !prev);
  }

  // Handle continue after verification
  const handleContinueAfterVerification = () => {
    setVerificationOpen(false)
    handleStartPractice()
  }

  // Ensure raag state stays in sync when options change
  useEffect(() => {
    if (!raagOptions.includes(raag)) {
      setRaag(raagOptions[0])
    }
  }, [raagOptions, raag])

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex flex-col items-center space-y-8">
          {/* Instrument Verification Dialog */}
          <InstrumentVerificationDialog
            open={verificationOpen}
            onOpenChange={setVerificationOpen}
            onContinue={handleContinueAfterVerification}
          />

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
          <div className="flex items-center justify-center gap-4 max-w-[340px] mx-auto">
            {/* BPM */}
            <div className="text-center py-2 px-5 rounded-full bg-background/5 border border-border/50 shadow-sm">
              <div className="text-3xl font-medium tracking-tight">{bpm}</div>
              <div className="text-xs uppercase tracking-widest mt-0.5 text-muted-foreground">BPM</div>
            </div>
            {/* Matra */}
            <div className="text-center py-2 px-5 rounded-full bg-background/5 border border-border/50 shadow-sm">
              <div className="text-3xl font-medium tracking-tight">{currentMatra}</div>
              <div className="text-xs uppercase tracking-widest mt-0.5 text-muted-foreground">Matra</div>
            </div>
          </div>

          {/* Instrument Selection */}
          <div className="flex flex-row gap-2 overflow-x-auto pb-1 w-full sm:grid sm:grid-cols-3 sm:gap-3 md:gap-4">
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">INSTRUMENT</Label>
              <Select value={instrument} onValueChange={setInstrument}>
                <SelectTrigger className="rounded-lg min-w-[120px] sm:min-w-0">
                  <SelectValue placeholder="Instrument" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sarangi">Sarangi</SelectItem>
                  <SelectItem value="violin">Violin</SelectItem>
                  <SelectItem value="sitar">Sitar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">TAAL</Label>
              <Select value={taal} onValueChange={setTaal}>
                <SelectTrigger className="rounded-lg min-w-[120px] sm:min-w-0">
                  <SelectValue placeholder="Taal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="roopak">Roopak (7)</SelectItem>
                  <SelectItem value="teental">Teental (16)</SelectItem>
                  <SelectItem value="dadra">Dadra (6)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">RAAG</Label>
              <Select value={raag} onValueChange={setRaag}>
                <SelectTrigger className="rounded-lg min-w-[120px] sm:min-w-0">
                  <SelectValue placeholder="Raag" />
                </SelectTrigger>
                <SelectContent>
                  {raagOptions.map((r: string) => (
                    <SelectItem key={r} value={r}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                variant={isAudioPlaying ? "secondary" : "default"}
                size="icon" 
                className="rounded-full h-16 w-16 mt-4"
                onClick={handleBottomPlayButton}
              >
                {isAudioPlaying ? <PauseIcon className="h-8 w-8" /> : <PlayIcon className="h-8 w-8" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isAudioPlaying ? "Pause Audio" : "Play Audio"}</p>
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