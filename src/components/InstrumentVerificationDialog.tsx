"use client"

import { useState } from "react"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Webcam } from "@/components/ui/webcam"

interface InstrumentVerificationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onContinue: () => void
}

export function InstrumentVerificationDialog({
  open,
  onOpenChange,
  onContinue
}: InstrumentVerificationDialogProps) {
  const [photoTaken, setPhotoTaken] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  
  const handlePhotoTaken = () => {
    setAnalyzing(true)
    
    // Simulate AI analysis with a timeout
    setTimeout(() => {
      setAnalyzing(false)
      setPhotoTaken(true)
    }, 2000)
  }
  
  const handleContinue = () => {
    onContinue()
    // Reset state for next time
    setPhotoTaken(false)
    setAnalyzing(false)
  }
  
  const handleCancel = () => {
    onOpenChange(false)
    // Reset state for next time
    setPhotoTaken(false)
    setAnalyzing(false)
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Instrument Verification</DialogTitle>
          <DialogDescription>
            Please take a picture of your instrument for our AI analysis.
            This helps us verify you have your instrument ready for practice.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4 py-4">
          {photoTaken ? (
            <div className="text-center text-sm py-6">
              <div className="text-base font-medium mb-1">Verification Complete</div>
              <div className="text-muted-foreground">Your instrument has been verified</div>
            </div>
          ) : analyzing ? (
            <div className="relative w-full aspect-video bg-muted rounded-md overflow-hidden">
              <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center">
                <div className="text-white font-medium mb-2">Analyzing instrument...</div>
                <div className="w-48 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white animate-[progress_2s_ease-in-out]"></div>
                </div>
              </div>
            </div>
          ) : (
            <Webcam onPhotoTaken={handlePhotoTaken} />
          )}
          
          <div className="text-center text-muted-foreground text-sm max-w-xs mx-auto mt-4">
            <p className="font-medium">Don&apos;t worry!</p>
            <p>These images are only used to verify you&apos;re practicing with your instrument. They are not stored - your privacy matters to us.</p>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          {analyzing ? (
            <Button disabled>
              Analyzing...
            </Button>
          ) : (
            <Button 
              onClick={handleContinue}
              disabled={!photoTaken}
            >
              {photoTaken ? 'Continue to Practice' : 'Take a Photo'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 