"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { PlusCircle, Trash2, Plus, UploadCloud } from "lucide-react"
import { GroupSelect } from "@/components/GroupSelect"
import { createQuiz, uploadFileToStorage } from "@/lib/data-service"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

export default function CreateQuizPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [timeLimit, setTimeLimit] = useState(30)
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null)
  const [fileUploading, setFileUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [questions, setQuestions] = useState([
    { 
      question: "", 
      options: ["", ""], 
      correctAnswer: 0 
    }
  ])

  const addQuestion = () => {
    setQuestions([
      ...questions, 
      { 
        question: "", 
        options: ["", ""], 
        correctAnswer: 0 
      }
    ])
  }

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index))
    }
  }

  const updateQuestion = (index: number, value: string) => {
    const updatedQuestions = [...questions]
    updatedQuestions[index].question = value
    setQuestions(updatedQuestions)
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions]
    updatedQuestions[questionIndex].options[optionIndex] = value
    setQuestions(updatedQuestions)
  }

  const setCorrectAnswer = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions]
    updatedQuestions[questionIndex].correctAnswer = optionIndex
    setQuestions(updatedQuestions)
  }
  
  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...questions]
    updatedQuestions[questionIndex].options.push("")
    setQuestions(updatedQuestions)
  }
  
  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions]
    // Don't remove if there are only 2 options
    if (updatedQuestions[questionIndex].options.length <= 2) return
    
    // Adjust the correct answer if needed
    if (updatedQuestions[questionIndex].correctAnswer === optionIndex) {
      updatedQuestions[questionIndex].correctAnswer = 0
    } else if (updatedQuestions[questionIndex].correctAnswer > optionIndex) {
      updatedQuestions[questionIndex].correctAnswer--
    }
    
    updatedQuestions[questionIndex].options.splice(optionIndex, 1)
    setQuestions(updatedQuestions)
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachmentFile(e.target.files[0])
    }
  }

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setAttachmentFile(e.dataTransfer.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }
  
  const handleSaveQuiz = async () => {
    // Validate the form
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a quiz title",
        variant: "destructive"
      })
      return
    }
    
    // Make sure all questions have content
    const emptyQuestions = questions.some(q => !q.question.trim())
    if (emptyQuestions) {
      toast({
        title: "Error",
        description: "Please fill in all questions",
        variant: "destructive"
      })
      return
    }
    
    // Make sure all options have content and each question has a correct answer
    const invalidOptions = questions.some(q => 
      q.options.some(o => !o.trim()) || 
      q.correctAnswer === undefined
    )
    if (invalidOptions) {
      toast({
        title: "Error",
        description: "Please fill in all answer options and mark the correct answer",
        variant: "destructive"
      })
      return
    }
    
    try {
      setIsSaving(true)
      
      let fileData = null
      
      // Upload file if one is selected
      if (attachmentFile) {
        setFileUploading(true)
        fileData = await uploadFileToStorage(attachmentFile, 'quiz-attachments')
        setFileUploading(false)
      }
      
      await createQuiz({
        title,
        time_limit: timeLimit,
        passing_score: 0, // Default value since we don't need it
        content: questions,
        groupIds: selectedGroups,
        attachment: fileData ? {
          file_url: fileData.url,
          file_name: fileData.fileName,
          file_type: fileData.fileType,
          file_size: fileData.fileSize
        } : undefined
      })
      
      toast({
        title: "Success",
        description: "Quiz created successfully"
      })
      
      // Navigate back or clear form
      router.push("/practice")
    } catch (error) {
      console.error("Error saving quiz:", error)
      toast({
        title: "Error",
        description: "Failed to save quiz. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create Quiz</h1>
        <Button onClick={addQuestion}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Question
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Quiz Details</CardTitle>
          <CardDescription>Set up the basic information for your quiz</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left column - Quiz details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quiz-title">Quiz Title</Label>
                <Input 
                  id="quiz-title" 
                  placeholder="Enter quiz title" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time-limit">Time Limit (minutes)</Label>
                <Input 
                  id="time-limit" 
                  type="number" 
                  placeholder="30" 
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <GroupSelect 
                  selectedGroups={selectedGroups}
                  onGroupChange={setSelectedGroups}
                />
              </div>
            </div>
            
            {/* Right column - File upload */}
            <div className="space-y-2">
              <Label>Attachment</Label>
              <div 
                className={cn(
                  "border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center h-[200px] cursor-pointer transition-colors",
                  isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50 hover:bg-accent/50"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleFileDrop}
                onClick={triggerFileInput}
              >
                <input 
                  ref={fileInputRef}
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange}
                  accept="*/*"
                />
                
                {attachmentFile ? (
                  <div className="flex flex-col items-center text-center">
                    <UploadCloud className="h-10 w-10 mb-2 text-primary" />
                    <p className="font-medium mb-1">{attachmentFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(attachmentFile.size / 1024).toFixed(1)} KB • Click or drag to replace
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <UploadCloud className="h-10 w-10 mb-2 text-muted-foreground" />
                    <p className="font-medium mb-1">Upload a file</p>
                    <p className="text-xs text-muted-foreground">or drag and drop</p>
                    <p className="text-xs text-muted-foreground mt-4">
                      Any file type
                    </p>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                No size restrictions. Supports all file types: audio, video, documents, images, etc.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {questions.map((question, qIndex) => (
        <Card key={qIndex} className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Question {qIndex + 1}</CardTitle>
              <CardDescription>Multiple choice question</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => addQuestion()}
                title="Add another question"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => removeQuestion(qIndex)}
                disabled={questions.length === 1}
                title="Remove this question"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`question-${qIndex}`}>Question</Label>
              <Input 
                id={`question-${qIndex}`} 
                value={question.question}
                onChange={(e) => updateQuestion(qIndex, e.target.value)}
                placeholder="Enter your question here" 
              />
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Answer Options</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addOption(qIndex)}
                >
                  <Plus className="mr-1 h-3 w-3" /> Add Option
                </Button>
              </div>
              
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-center space-x-2">
                  <Input 
                    id={`question-${qIndex}-option-${oIndex}`}
                    value={option}
                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                    placeholder={`Option ${oIndex + 1}`} 
                  />
                  <div className="flex items-center space-x-2 ml-2">
                    <input 
                      type="radio" 
                      id={`correct-${qIndex}-${oIndex}`}
                      name={`correct-answer-${qIndex}`}
                      checked={question.correctAnswer === oIndex}
                      onChange={() => setCorrectAnswer(qIndex, oIndex)}
                      className="h-4 w-4 text-primary" 
                    />
                    <Label htmlFor={`correct-${qIndex}-${oIndex}`} className="text-sm">
                      Correct
                    </Label>
                  </div>
                  {question.options.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeOption(qIndex, oIndex)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end space-x-4 mt-8">
        <Button 
          variant="outline"
          onClick={() => router.push("/practice")}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSaveQuiz}
          disabled={isSaving || fileUploading}
        >
          {isSaving || fileUploading ? "Saving..." : "Save Quiz"}
        </Button>
      </div>
    </div>
  )
} 