"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getQuizById } from "@/lib/data-service"
import { Quiz } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Clock, FileText, ChevronLeft, AlertCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface QuizPageProps {
  params: {
    quizId: string
  }
}

export default function QuizPage({ params }: QuizPageProps) {
  const router = useRouter()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [startQuiz, setStartQuiz] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  
  useEffect(() => {
    async function loadQuiz() {
      try {
        const quizData = await getQuizById(params.quizId)
        if (quizData) {
          setQuiz(quizData)
          
          if (quizData.time_limit) {
            setTimeRemaining(quizData.time_limit * 60) // Convert minutes to seconds
          }
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
  
  useEffect(() => {
    // Initialize selected answers array when quiz loads
    if (quiz) {
      setSelectedAnswers(new Array(quiz.content.length).fill(-1))
    }
  }, [quiz])
  
  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    
    if (startQuiz && timeRemaining !== null && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 1) {
            if (timer) clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [startQuiz, timeRemaining])
  
  const handleStartQuiz = () => {
    setStartQuiz(true)
  }
  
  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestionIndex] = answerIndex
    setSelectedAnswers(newAnswers)
  }
  
  const goToNextQuestion = () => {
    if (quiz && currentQuestionIndex < quiz.content.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }
  
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }
  
  const handleSubmitQuiz = () => {
    // Submit quiz logic would go here
    // For now, just navigate back to quizzes
    router.push('/practice/quizzes')
  }
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  
  if (loading) {
    return (
      <div className="container mx-auto py-10 flex justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading quiz...</h2>
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
          <p className="text-muted-foreground">{error || "Failed to load quiz"}</p>
          <Button className="mt-4" onClick={() => router.push('/practice/quizzes')}>
            Back to Quizzes
          </Button>
        </div>
      </div>
    )
  }
  
  // Show quiz information and attachment before starting
  if (!startQuiz) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="sm" onClick={() => router.push('/practice/quizzes')} className="mr-2">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">{quiz.title}</h1>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quiz Information</CardTitle>
            <CardDescription>Please review the following information before starting</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium mb-2">Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time Limit:</span>
                    <span>{quiz.time_limit} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Questions:</span>
                    <span>{quiz.content.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Added:</span>
                    <span>{formatDistanceToNow(new Date(quiz.created_at), { addSuffix: true })}</span>
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
            
            <div className="pt-4">
              <h3 className="text-sm font-medium mb-2">Instructions</h3>
              <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                <li>Read the questions carefully before answering.</li>
                <li>You can navigate between questions using the Previous and Next buttons.</li>
                <li>Once you submit the quiz, you cannot return to change your answers.</li>
                <li>The timer will start once you click the "Start Quiz" button.</li>
              </ul>
            </div>
          </CardContent>
          
          <CardFooter className="bg-muted/50 pt-4">
            <Button onClick={handleStartQuiz} className="ml-auto">
              Start Quiz
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }
  
  // Show the quiz itself after starting
  const currentQuestion = quiz.content[currentQuestionIndex]
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          <p className="text-muted-foreground">Question {currentQuestionIndex + 1} of {quiz.content.length}</p>
        </div>
        
        {timeRemaining !== null && (
          <div className="bg-muted px-4 py-2 rounded-md flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className={timeRemaining < 60 ? "text-destructive font-bold" : ""}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        )}
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <div 
                key={index}
                className={`border rounded-md p-3 cursor-pointer transition-colors
                  ${selectedAnswers[currentQuestionIndex] === index 
                  ? 'bg-primary/10 border-primary/50' 
                  : 'hover:bg-muted'}`}
                onClick={() => handleSelectAnswer(index)}
              >
                <div className="flex items-start gap-3">
                  <div className={`h-5 w-5 rounded-full border flex items-center justify-center mt-0.5
                    ${selectedAnswers[currentQuestionIndex] === index 
                      ? 'border-primary bg-primary/10' 
                      : 'border-muted-foreground'}`}
                  >
                    {selectedAnswers[currentQuestionIndex] === index && (
                      <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between bg-muted/50 pt-4">
          <Button 
            variant="outline" 
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          
          {currentQuestionIndex < quiz.content.length - 1 ? (
            <Button 
              onClick={goToNextQuestion}
            >
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleSubmitQuiz}
            >
              Submit Quiz
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <div className="flex justify-center">
        <div className="flex gap-1">
          {quiz.content.map((_, index) => (
            <button
              key={index}
              className={`h-2.5 w-2.5 rounded-full ${
                currentQuestionIndex === index 
                  ? 'bg-primary' 
                  : selectedAnswers[index] >= 0 
                    ? 'bg-primary/50' 
                    : 'bg-muted'
              }`}
              onClick={() => setCurrentQuestionIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  )
} 