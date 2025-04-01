"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { format } from "date-fns"
import { ArrowLeft, Send, Loader2 } from "lucide-react"

import { getGroupMessages, sendGroupMessage, markMessagesAsRead, getAllGroups } from "@/lib/data-service"
import { getCurrentUser } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
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
  subject?: string
  isAdminMessage?: boolean
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
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Get authenticated user's info
  useEffect(() => {
    async function fetchCurrentUserInfo() {
      const user = getCurrentUser()
      if (user) {
        setIsAdmin(user.role === 'admin')
        
        try {
          const { data, error } = await supabase
            .from('users')
            .select('student_id')
            .eq('id', user.id)
            .single()
          
          if (error) {
            console.error("Error fetching student ID:", error)
            return
          }
          
          if (data && data.student_id) {
            setCurrentStudentId(data.student_id)
          }
        } catch (err) {
          console.error("Error fetching student ID:", err)
        }
      }
    }
    
    fetchCurrentUserInfo()
  }, [])

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
    
    if (!newMessage.trim() || (!currentStudentId && !isAdmin)) return
    
    try {
      setSending(true)
      
      // If admin user, use the admin mode of message sending
      if (isAdmin && !currentStudentId) {
        const sentMessage = await sendGroupMessage(groupId, "", newMessage, true)
        
        if (sentMessage) {
          // Add admin identifier to the message for UI display purposes
          const messageWithAdminInfo = {
            ...sentMessage,
            isAdminMessage: true
          }
          setMessages(prev => [...prev, messageWithAdminInfo])
          setNewMessage("")
        }
      } else {
        // Regular student message
        const sentMessage = await sendGroupMessage(groupId, currentStudentId!, newMessage)
        
        if (sentMessage) {
          setMessages(prev => [...prev, sentMessage])
          setNewMessage("")
        }
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
                {dateMessages.map(message => {
                  // Handle admin messages (null sender_id with subject 'Admin Message')
                  const isAdminMessage = message.subject === 'Admin Message' || message.isAdminMessage;
                  
                  const isCurrentUserMessage = 
                    (currentStudentId && message.sender_id === currentStudentId) || 
                    (isAdmin && !currentStudentId && isAdminMessage);
                    
                  return (
                    <div 
                      key={message.id} 
                      className={`flex ${isCurrentUserMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex max-w-[70%] ${isCurrentUserMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                        {!isCurrentUserMessage && (
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
                            {!isCurrentUserMessage && (
                              <span className="text-sm font-medium">
                                {message.sender ? `${message.sender.first_name} ${message.sender.last_name}` : 
                                  isAdminMessage ? 'Admin' : 'Unknown'}
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {formatMessageTime(message.created_at)}
                            </span>
                          </div>
                          <div 
                            className={`p-3 rounded-lg ${
                              isCurrentUserMessage 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted'
                            }`}
                          >
                            {message.body}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
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
            disabled={sending || (!currentStudentId && !isAdmin)}
          />
          <Button type="submit" size="icon" disabled={sending || !newMessage.trim() || (!currentStudentId && !isAdmin)}>
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
        {error && (
          <p className="text-destructive text-xs mt-2">{error}</p>
        )}
        {!currentStudentId && !isAdmin && !loading && (
          <p className="text-amber-500 text-xs mt-2">You need to be logged in as a student or admin to send messages</p>
        )}
      </div>
    </div>
  )
} 