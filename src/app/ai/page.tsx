"use client"

import { Sparkles, RocketIcon, Bot } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AIPage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">AI Assistant</h1>
      </div>

      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-2 flex flex-row items-center gap-3">
          <Bot className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-2xl">Coming Soon</CardTitle>
            <CardDescription>
              Our advanced AI assistant is almost ready to help you!
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="rounded-lg bg-muted p-6">
            <div className="flex items-center gap-4 mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-medium">Get ready for an enhanced learning experience</h3>
            </div>
            <p className="text-muted-foreground">
              Our AI assistant will help you navigate learning materials, answer questions, and provide personalized guidance to improve your learning journey.
            </p>
          </div>
          
          <div className="rounded-lg bg-muted p-6">
            <div className="flex items-center gap-4 mb-4">
              <RocketIcon className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-medium">Stay tuned for the launch</h3>
            </div>
            <p className="text-muted-foreground">
              We&apos;re putting the finishing touches on our AI assistant. It will be available very soon with exciting features to enhance your educational experience.
            </p>
          </div>

          <div className="flex justify-center">
            <Button disabled className="gap-2">
              <Sparkles className="h-4 w-4" />
              Coming Soon
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 