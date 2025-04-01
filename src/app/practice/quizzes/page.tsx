"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getStudentQuizzes, getQuizById } from "@/lib/data-service"
import { getCurrentUser } from "@/lib/auth"
import { Quiz, QuizResult } from "@/lib/types"
import { Clock, FileText, CheckCircle, AlertCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Separator } from "@/components/ui/separator"

export default function StudentQuizzesPage() {
  const router = useRouter()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [completedQuizzes, setCompletedQuizzes] = useState<Quiz[]>([])
  const [newQuizzes, setNewQuizzes] = useState<Quiz[]>([])
  
  useEffect(() => {
    async function loadQuizzes() {
      try {
        const user = getCurrentUser()
        
        if (!user) {
          router.push('/auth/login')
          return
        }
        
        // Get all quizzes assigned to the student's groups
        const studentQuizzes = await getStudentQuizzes(user.id.toString())
        
        // TODO: Add API call to get quiz results for this student
        // For now, let's simulate having some completed quizzes
        // In a real implementation, you would fetch the actual quiz results
        
        // Mock completed quizzes (first 30% of quizzes)
        const mockCompletedQuizIds = studentQuizzes
          .slice(0, Math.ceil(studentQuizzes.length * 0.3))
          .map(q => q.id)
        
        // Split quizzes into completed and new
        const completed = studentQuizzes.filter(quiz => mockCompletedQuizIds.includes(quiz.id))
        const newOnes = studentQuizzes.filter(quiz => !mockCompletedQuizIds.includes(quiz.id))
        
        setQuizzes(studentQuizzes)
        setCompletedQuizzes(completed)
        setNewQuizzes(newOnes)
      } catch (error) {
        console.error("Error loading quizzes:", error)
      } finally {
        setLoading(false)
      }
    }
    
    loadQuizzes()
  }, [router])
  
  const handleStartQuiz = (quizId: string) => {
    // Navigate to a page to take the quiz
    router.push(`/practice/quizzes/${quizId}`)
  }
  
  const handleViewResults = (quizId: string) => {
    // Navigate to a page to view the results
    router.push(`/practice/quizzes/${quizId}/results`)
  }
  
  if (loading) {
    return (
      <div className="container mx-auto py-10 flex justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading your quizzes...</h2>
          <p className="text-muted-foreground">Please wait</p>
        </div>
      </div>
    )
  }
  
  if (quizzes.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Quizzes</h1>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Quizzes Available</h2>
              <p className="text-muted-foreground">
                You don't have any quizzes assigned to you at the moment.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Quizzes</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* New Assignments */}
        <div>
          <h2 className="text-xl font-semibold mb-4">New Assignments</h2>
          
          {newQuizzes.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No new assignments</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {newQuizzes.map((quiz) => (
                <Card key={quiz.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle>{quiz.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{quiz.time_limit} minutes</span>
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    {quiz.attachment && (
                      <div className="mb-4">
                        <h3 className="text-sm font-medium mb-2">Attachment</h3>
                        <div className="flex items-center gap-2 p-3 border rounded-md">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <a 
                            href={quiz.attachment.file_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:underline"
                          >
                            {quiz.attachment.file_name}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Questions:</span>
                        <span>{quiz.content.length}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Assigned to:</span>
                        <span>{quiz.groups?.map(g => g.name).join(', ')}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Added:</span>
                        <span>{formatDistanceToNow(new Date(quiz.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="bg-muted/50 flex justify-end pt-4">
                    <Button onClick={() => handleStartQuiz(quiz.id)}>
                      Start Quiz
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        {/* Completed Assignments */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Completed Assignments</h2>
          
          {completedQuizzes.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No completed assignments</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {completedQuizzes.map((quiz) => (
                <Card key={quiz.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle>{quiz.title}</CardTitle>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <CardDescription className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{quiz.time_limit} minutes</span>
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Score:</span>
                        <span>85%</span> {/* This would be dynamic in a real implementation */}
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Completed:</span>
                        <span>2 days ago</span> {/* This would be dynamic in a real implementation */}
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Questions:</span>
                        <span>{quiz.content.length}</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="bg-muted/50 flex justify-end pt-4">
                    <Button variant="outline" onClick={() => handleViewResults(quiz.id)}>
                      View Results
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 