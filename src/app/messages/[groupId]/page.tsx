"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { format } from "date-fns"
import { ArrowLeft, Send, Loader2 } from "lucide-react"

import { getGroupMessages, sendGroupMessage, markMessagesAsRead, getAllGroups } from "@/lib/data-service"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

interface Message {
  id: string
  sender_id: string
  body: string
  created_at: string
  is_read: boolean
  sender?: {
    id: string
    first_name: string
    last_name: string
  }
}

interface Group {
  id: string
  name: string
  description?: string
}

export default function GroupChatPage() {
  const router = useRouter()
  const { groupId } = useParams() as { groupId: string }
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [group, setGroup] = useState<Group | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [error, setError] = useState<string | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Mock user id - in a real app, you would get this from authentication
  const currentUserId = "current-user-id"

  useEffect(() => {
    async function loadGroupInfo() {
      try {
        // Load group info
        const groups = await getAllGroups()
        const foundGroup = groups.find(g => g.id === groupId)
        if (foundGroup) {
          setGroup(foundGroup)
        }
      } catch (err) {
        console.error("Error loading group info:", err)
      }
    }

    async function loadMessages() {
      try {
        setLoading(true)
        
        // Load messages
        const msgs = await getGroupMessages(groupId)
        setMessages(msgs)
        
        // Mark messages as read
        await markMessagesAsRead(groupId)
        
        setError(null)
      } catch (err) {
        console.error("Error loading messages:", err)
        setError("Failed to load messages. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadGroupInfo()
    loadMessages()
  }, [groupId])

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim()) return
    
    try {
      setSending(true)
      const sentMessage = await sendGroupMessage(groupId, currentUserId, newMessage)
      
      if (sentMessage) {
        setMessages(prev => [...prev, sentMessage])
        setNewMessage("")
      }
    } catch (err) {
      console.error("Error sending message:", err)
      setError("Failed to send message. Please try again.")
    } finally {
      setSending(false)
    }
  }

  const formatMessageTime = (dateString: string) => {
    return format(new Date(dateString), "h:mm a")
  }

  // Group messages by date
  const groupedMessages: { [date: string]: Message[] } = {}
  messages.forEach(message => {
    const date = format(new Date(message.created_at), "MMMM d, yyyy")
    if (!groupedMessages[date]) {
      groupedMessages[date] = []
    }
    groupedMessages[date].push(message)
  })

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => router.back()}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold">{group?.name || "Loading..."}</h1>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {loading ? (
          // Loading skeletons
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className={`flex max-w-[70%] ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  {i % 2 === 0 && (
                    <div className="mr-3 mt-1">
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  )}
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-16 w-60 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Actual messages
          <div className="space-y-6">
            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <div key={date} className="space-y-4">
                <div className="flex justify-center">
                  <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                    {date}
                  </div>
                </div>
                {dateMessages.map(message => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex max-w-[70%] ${message.sender_id === currentUserId ? 'flex-row-reverse' : 'flex-row'}`}>
                      {message.sender_id !== currentUserId && (
                        <div className="mr-3 mt-1">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="" />
                            <AvatarFallback>
                              {message.sender ? message.sender.first_name.charAt(0) + message.sender.last_name.charAt(0) : "UN"}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                      <div>
                        <div className="flex items-end gap-2 mb-1">
                          {message.sender_id !== currentUserId && (
                            <span className="text-sm font-medium">
                              {message.sender ? `${message.sender.first_name} ${message.sender.last_name}` : "Unknown"}
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {formatMessageTime(message.created_at)}
                          </span>
                        </div>
                        <div 
                          className={`p-3 rounded-lg ${
                            message.sender_id === currentUserId 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}
                        >
                          {message.body}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
            disabled={sending}
          />
          <Button type="submit" size="icon" disabled={sending || !newMessage.trim()}>
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
        {error && (
          <p className="text-destructive text-xs mt-2">{error}</p>
        )}
      </div>
    </div>
  )
} 