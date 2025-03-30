"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { FileUpload } from "@/components/FileUpload"
import { GroupSelect } from "@/components/GroupSelect"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { uploadFileToStorage, createPracticeMaterial } from "@/lib/data-service"

export default function UploadPracticePage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [titleError, setTitleError] = useState("")

  const handleFileChange = (newFile: File | null) => {
    setFile(newFile)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setTitleError("")

    // Validate title is required
    if (!title.trim()) {
      setTitleError("Title is required")
      return
    }

    // Validate at least one group is selected
    if (selectedGroups.length === 0) {
      toast({
        title: "No groups selected",
        description: "Please select at least one group to share with",
        variant: "destructive"
      })
      return
    }

    try {
      setIsSubmitting(true)

      let fileData = null
      
      // Upload file if one is selected
      if (file) {
        fileData = await uploadFileToStorage(file)
      }

      // Create practice material and associate with groups
      await createPracticeMaterial({
        title,
        description: description || undefined,
        file_url: fileData?.url,
        file_type: fileData?.fileType,
        file_name: fileData?.fileName,
        file_size: fileData?.fileSize,
        group_ids: selectedGroups
      })

      toast({
        title: "Success!",
        description: "Practice material has been uploaded and shared with selected groups",
      })

      // Clear form
      setFile(null)
      setTitle("")
      setDescription("")
      setSelectedGroups([])

      // Redirect to practice page
      router.push("/practice")
      
    } catch (error) {
      console.error("Error uploading practice material:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your practice material. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Upload Practice Content</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload File</CardTitle>
              <CardDescription>
                Upload any file type for student practice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload
                onFileChange={handleFileChange}
                file={file}
              />
            </CardContent>
            <CardFooter>
              <div className="text-sm text-gray-500">
                No size restrictions. Supports all file types: audio, video, documents, images, etc.
              </div>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Practice Details</CardTitle>
              <CardDescription>
                Add information about this practice content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                <Input 
                  id="title" 
                  placeholder="Practice title" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                {titleError && (
                  <p className="text-sm text-red-500">{titleError}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Brief description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <GroupSelect 
                  selectedGroups={selectedGroups}
                  onGroupChange={setSelectedGroups}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="ml-auto" 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Uploading..." : "Upload & Share"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
} 