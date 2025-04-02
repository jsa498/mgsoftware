"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface WebcamProps {
  onPhotoTaken?: () => void
}

export function Webcam({ onPhotoTaken }: WebcamProps) {
  const [isActive, setIsActive] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Start webcam when component mounts
  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true,
          audio: false
        })
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          streamRef.current = stream
          setIsActive(true)
        }
      } catch (error) {
        console.error("Error accessing webcam:", error)
      }
    }

    startWebcam()

    // Cleanup function to stop webcam when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const takePhoto = () => {
    if (onPhotoTaken) {
      onPhotoTaken()
    }
  }

  return (
    <div className="relative w-full aspect-video bg-muted rounded-md overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      
      {isActive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button onClick={takePhoto} className="bg-primary/90 hover:bg-primary">
            Take a Photo
          </Button>
        </div>
      )}
    </div>
  )
}

// We don't need this now as the animation is in globals.css
// if (typeof document !== "undefined") {
//   const style = document.createElement("style")
//   style.textContent = `
//     @keyframes progress {
//       0% { width: 0; }
//       100% { width: 100%; }
//     }
//   `
//   document.head.appendChild(style)
// } 