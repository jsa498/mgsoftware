"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { format, isToday, isYesterday } from "date-fns"
import { MessageSquare, Info, X } from "lucide-react"

import { getAllChatGroups } from "@/lib/data-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function MessagesPage() {
  const [loading, setLoading] = useState(true)
  const [chatGroups, setChatGroups] = useState<{
    id: string;
    name: string;
    unreadCount: number;
    latestMessage?: {
      body: string;
      created_at: string;
    };
  }[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadChatGroups() {
      try {
        setLoading(true)
        const groups = await getAllChatGroups()
        setChatGroups(groups)
        setError(null)
      } catch (err) {
        console.error("Error loading chat groups:", err)
        setError("Failed to load chat groups. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadChatGroups()
  }, [])

  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString)
    
    if (isToday(date)) {
      return format(date, "h:mm a")
    } else if (isYesterday(date)) {
      return "Yesterday"
    } else {
      return format(date, "MMM d")
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">
            View and manage all your group conversations
          </p>
        </div>
      </div>

      {error && (
        <div className="m-4 p-4 bg-destructive/15 rounded-lg flex items-center gap-2 text-destructive">
          <Info className="h-4 w-4" />
          <span>{error}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-auto h-6 w-6" 
            onClick={() => setError(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <ScrollArea className="flex-1 px-4 py-2">
        <div className="grid gap-4">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="cursor-pointer hover:bg-accent/50 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full max-w-[250px]" />
                </CardContent>
              </Card>
            ))
          ) : chatGroups.length > 0 ? (
            chatGroups.map((group) => (
              <Link href={`/messages/${group.id}`} key={group.id}>
                <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base flex items-center gap-2">
                        {group.name}
                        {group.unreadCount > 0 && (
                          <Badge variant="default" className="rounded-full px-2 py-0 h-5 text-xs">
                            {group.unreadCount}
                          </Badge>
                        )}
                      </CardTitle>
                      {group.latestMessage && (
                        <CardDescription className="text-xs">
                          {formatMessageDate(group.latestMessage.created_at)}
                        </CardDescription>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm truncate text-muted-foreground">
                      {group.latestMessage ? group.latestMessage.body : "No messages yet"}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No chat groups found</h3>
              <p className="text-muted-foreground mt-2">
                Chat groups will appear here when they are created.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
} 