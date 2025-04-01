"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getQuizById } from "@/lib/data-service"
import { Quiz, QuizResult } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, ChevronLeft, AlertCircle, FileText } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ResultsPageProps {
  params: {
    quizId: string
  }
}

export default function QuizResultsPage({ params }: ResultsPageProps) {
  const router = useRouter()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // For now, we'll mock a quiz result
  // In a real implementation, you would fetch the actual result from the database
  const mockResult = {
    score: 85,
    correctAnswers: 17,
    totalQuestions: 20,
    timeSpent: "13:45",
    completedAt: new Date().toISOString()
  }
  
  useEffect(() => {
    async function loadQuiz() {
      try {
        const quizData = await getQuizById(params.quizId)
        if (quizData) {
          setQuiz(quizData)
        } else {
          setError("Quiz not found")
        }
      } catch (error) {
        console.error("Error loading quiz:", error)
        setError("Failed to load quiz")
      } finally {
        setLoading(false)
      }
    }
    
    loadQuiz()
  }, [params.quizId])
  
  if (loading) {
    return (
      <div className="container mx-auto py-10 flex justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading quiz results...</h2>
          <p className="text-muted-foreground">Please wait</p>
        </div>
      </div>
    )
  }
  
  if (error || !quiz) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p className="text-muted-foreground">{error || "Failed to load quiz results"}</p>
          <Button className="mt-4" onClick={() => router.push('/practice/quizzes')}>
            Back to Quizzes
          </Button>
        </div>
      </div>
    )
  }
  
  const passStatus = mockResult.score >= quiz.passing_score
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" onClick={() => router.push('/practice/quizzes')} className="mr-2">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Quiz Results</h1>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{quiz.title}</CardTitle>
              <CardDescription>Your quiz results</CardDescription>
            </div>
            {passStatus ? (
              <div className="flex items-center text-green-500">
                <CheckCircle className="h-5 w-5 mr-1" />
                <span className="font-medium">Passed</span>
              </div>
            ) : (
              <div className="flex items-center text-destructive">
                <XCircle className="h-5 w-5 mr-1" />
                <span className="font-medium">Failed</span>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Score overview */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <h3 className="text-lg font-medium">Score</h3>
              <span className="text-2xl font-bold">{mockResult.score}%</span>
            </div>
            
            <Progress value={mockResult.score} className="h-2" />
            
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Passing score: {quiz.passing_score}%</span>
              <span>{mockResult.correctAnswers} of {mockResult.totalQuestions} correct</span>
            </div>
          </div>
          
          <Separator />
          
          {/* Details */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium mb-2">Quiz Details</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time spent:</span>
                  <span>{mockResult.timeSpent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completed:</span>
                  <span>{new Date(mockResult.completedAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Questions:</span>
                  <span>{mockResult.totalQuestions}</span>
                </div>
              </div>
            </div>
            
            {quiz.attachment && (
              <div>
                <h3 className="text-sm font-medium mb-2">Attachment</h3>
                <div className="border rounded-md p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{quiz.attachment.file_name}</span>
                  </div>
                  <a 
                    href={quiz.attachment.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full inline-block"
                  >
                    <Button variant="outline" className="w-full">
                      View Attachment
                    </Button>
                  </a>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="bg-muted/50 flex justify-end pt-4">
          <Button onClick={() => router.push('/practice/quizzes')}>
            Back to Quizzes
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 