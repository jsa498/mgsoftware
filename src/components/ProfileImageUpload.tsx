"use client"

import { useState, useRef } from "react"
import { Pencil, LoaderCircle } from "lucide-react"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserCircle2 } from "lucide-react"

interface ProfileImageUploadProps {
  imageUrl: string | null;
  fullName?: string;
  onImageSelect: (file: File) => Promise<void>;
}

export function ProfileImageUpload({ imageUrl, fullName, onImageSelect }: ProfileImageUploadProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleMouseEnter = () => setIsHovering(true)
  const handleMouseLeave = () => setIsHovering(false)
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setSelectedFile(file)
      
      // Create a preview
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
    }
  }

  const handleTriggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleSaveImage = async () => {
    if (!selectedFile) return
    
    try {
      setIsUploading(true)
      await onImageSelect(selectedFile)
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving profile image:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  return (
    <div className="relative">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div 
            className="relative inline-block cursor-pointer" 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => setIsDialogOpen(true)}
          >
            <Avatar className="h-32 w-32">
              {imageUrl ? (
                <AvatarImage src={imageUrl} alt={fullName || "Profile"} />
              ) : (
                <AvatarFallback className="text-4xl">
                  <UserCircle2 className="h-16 w-16" />
                </AvatarFallback>
              )}
            </Avatar>
            
            {isHovering && (
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                <Pencil className="h-8 w-8 text-white" />
              </div>
            )}
          </div>
        </DialogTrigger>
        
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Profile Picture</DialogTitle>
            <DialogDescription>
              Upload a new profile picture. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center gap-4 py-4">
            <Avatar className="h-40 w-40">
              {previewUrl ? (
                <AvatarImage src={previewUrl} alt="Preview" />
              ) : imageUrl ? (
                <AvatarImage src={imageUrl} alt={fullName || "Profile"} />
              ) : (
                <AvatarFallback className="text-4xl">
                  <UserCircle2 className="h-20 w-20" />
                </AvatarFallback>
              )}
            </Avatar>
            
            <Button 
              variant="outline" 
              onClick={handleTriggerFileSelect}
              className="mt-2"
            >
              Choose Image
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleDialogClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveImage} 
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 