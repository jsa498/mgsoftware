"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { PlusCircle, Trash2 } from "lucide-react"

export default function CreateQuizPage() {
  const [questions, setQuestions] = useState([
    { 
      question: "", 
      options: ["", "", "", ""], 
      correctAnswer: 0 
    }
  ])

  const addQuestion = () => {
    setQuestions([
      ...questions, 
      { 
        question: "", 
        options: ["", "", "", ""], 
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
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quiz-title">Quiz Title</Label>
            <Input id="quiz-title" placeholder="Enter quiz title" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quiz-description">Description</Label>
            <Input id="quiz-description" placeholder="Brief description of the quiz" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time-limit">Time Limit (minutes)</Label>
              <Input id="time-limit" type="number" placeholder="30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passing-score">Passing Score (%)</Label>
              <Input id="passing-score" type="number" placeholder="70" />
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
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => removeQuestion(qIndex)}
              disabled={questions.length === 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
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
              <Label>Answer Options</Label>
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
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end space-x-4 mt-8">
        <Button variant="outline">Cancel</Button>
        <Button>Save Quiz</Button>
      </div>
    </div>
  )
} 