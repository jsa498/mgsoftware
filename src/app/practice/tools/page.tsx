"use client"

import { useState } from "react"
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
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

const notes = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"]

export default function PracticeToolsPage() {
  const [bpm, setBpm] = useState(100)
  const [matra, setMatra] = useState(1)
  const [currentNote, setCurrentNote] = useState("A")
  const [isPlaying, setIsPlaying] = useState(false)
  const [volumes, setVolumes] = useState({
    lehra: 50,
    tanpura: 50,
    tabla: 50,
  })

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

  // Function to increment/decrement Matra
  const adjustMatra = (amount: number) => {
    const newMatra = Math.max(1, Math.min(16, matra + amount))
    setMatra(newMatra)
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
    setIsPlaying(!isPlaying)
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex flex-col items-center space-y-8">          
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
            <div className="text-center py-2 px-5 rounded-full bg-background/5 border border-border/50 shadow-sm">
              <div className="text-3xl font-medium tracking-tight">{matra}</div>
              <div className="text-xs uppercase tracking-widest mt-0.5 text-muted-foreground">MATRA</div>
            </div>
          </div>

          {/* Instrument Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
            <Select defaultValue="sarangi">
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Sarangi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sarangi">Sarangi</SelectItem>
                <SelectItem value="violin">Violin</SelectItem>
                <SelectItem value="sitar">Sitar</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="roopak">
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Roopak (7)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="roopak">Roopak (7)</SelectItem>
                <SelectItem value="teental">Teental (16)</SelectItem>
                <SelectItem value="dadra">Dadra (6)</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="charukeshi">
              <SelectTrigger className="rounded-lg">
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
    </TooltipProvider>
  )
} 