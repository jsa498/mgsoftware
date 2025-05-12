"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardDescription,
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getCurrentUser } from '@/lib/auth';
import { getStudentProfileByUserId } from '@/lib/data-service';
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Clock, Plus, Search, BrainCircuit, Image as ImageIcon, Mic, SendHorizontal } from 'lucide-react';
import { getAllStudents } from '@/lib/data-service';

// Define a type for the message structure
interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
}

// Types for history
interface AiHistoryMessage {
  id: number;
  session_id: string;
  student_id: string;
  user_id: number;
  sender: 'user' | 'ai';
  message: string;
  inserted_at: string;
}

interface SessionItem {
  sessionId: string;
  studentId: string;
  ownerUserId: number;
  preview: string;
  timestamp: string;
}

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  // Add a loading state for the AI response
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const currentUser = getCurrentUser();
  const currentUserId = currentUser?.id;
  const username = currentUser?.username || '';
  const [fullName, setFullName] = useState<string>('');
  const displayName = fullName || username;
  // Prevent hydration mismatch: only show user-specific content after mount
  const [isMounted, setIsMounted] = useState(false);
  const [sessionId, setSessionId] = useState(() => uuidv4());

  // History state
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyMessages, setHistoryMessages] = useState<AiHistoryMessage[]>([]);
  const [sessionsMine, setSessionsMine] = useState<SessionItem[]>([]);
  const [sessionsAll, setSessionsAll] = useState<SessionItem[]>([]);
  const [studentMap, setStudentMap] = useState<Record<string, string>>({});
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const currentStudentId = currentUser?.student_id ?? '';

  // Derive grouping for My Chats and Student Chats
  const groupedMine: Record<string, SessionItem[]> = {};
  sessionsMine.forEach((s) => {
    const dateKey = new Date(s.timestamp).toLocaleDateString();
    if (!groupedMine[dateKey]) groupedMine[dateKey] = [];
    groupedMine[dateKey].push(s);
  });
  // Only sessions started by students
  const studentSessions = sessionsAll.filter((s) => s.ownerUserId !== currentUserId);
  const groupedStudents: Record<string, SessionItem[]> = {};
  studentSessions.forEach((s) => {
    const dateKey = new Date(s.timestamp).toLocaleDateString();
    if (!groupedStudents[dateKey]) groupedStudents[dateKey] = [];
    groupedStudents[dateKey].push(s);
  });

  // Add auto-scroll to bottom on new messages
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // On mount, fetch the student's full name
  useEffect(() => {
    if (currentUser?.id) {
      getStudentProfileByUserId(currentUser.id)
        .then((profile) => {
          if (profile && profile.first_name && profile.last_name) {
            setFullName(`${profile.first_name} ${profile.last_name}`);
          }
        })
        .catch(console.error);
    }
  }, [currentUser]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Detect admin role
  useEffect(() => {
    setIsAdminUser(currentUser?.role === 'admin');
  }, [currentUser]);

  // Detect mobile for sheet
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Fetch students for admin map
  useEffect(() => {
    if (isAdminUser) {
      getAllStudents().then((students) => {
        const map: Record<string, string> = {};
        students.forEach((s) => { map[s.id] = `${s.first_name} ${s.last_name}`; });
        setStudentMap(map);
      });
    }
  }, [isAdminUser]);

  // Fetch history when opened
  useEffect(() => {
    // Only fetch when history is opened
    if (!historyOpen) return;
    (async () => {
      try {
        const res = await fetch('/api/ai/history', { credentials: 'include' });
        const data = await res.json();
        const msgs: AiHistoryMessage[] = data.messages || [];
        setHistoryMessages(msgs);
        // Group by session
        const grouped: Record<string, AiHistoryMessage[]> = {};
        msgs.forEach((m) => {
          grouped[m.session_id] = grouped[m.session_id] || [];
          grouped[m.session_id].push(m);
        });
        const items: SessionItem[] = Object.entries(grouped).map(([sid, ms]) => {
          ms.sort((a, b) => new Date(a.inserted_at).getTime() - new Date(b.inserted_at).getTime());
          const firstMsg = ms.find((m) => m.sender === 'user') || ms[0];
          return {
            sessionId: sid,
            studentId: firstMsg.student_id,
            ownerUserId: firstMsg.user_id,
            preview: firstMsg.message.slice(0, 50),
            timestamp: ms[0].inserted_at,
          };
        });
        items.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setSessionsAll(items);
        setSessionsMine(
          items.filter((s) =>
            isAdminUser
              ? s.ownerUserId === currentUserId
              : s.studentId === currentStudentId
          )
        );
      } catch (err) {
        console.error('Error fetching AI history:', err);
      }
    })();
  }, [historyOpen, currentStudentId, currentUserId, isAdminUser]);

  // Handlers for new chat and resume
  const resumeSession = (sid: string) => {
    const msgs = historyMessages.filter((m) => m.session_id === sid);
    const mapped: Message[] = msgs.map((m) => ({ id: m.id, sender: m.sender, text: m.message }));
    setMessages(mapped);
    setSessionId(sid);
    setHistoryOpen(false);
  };

  const handleNewChat = () => {
    const newId = uuidv4();
    setSessionId(newId);
    setMessages([]);
    setHistoryOpen(false);
  };

  // When a suggestion is clicked, send it immediately
  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleSendMessage = async (overrideMessage?: string) => {
    const messageText = overrideMessage?.trim() || inputValue.trim();
    if (messageText === '') return;

    // Add user message immediately
    const newUserMessage: Message = {
      id: Date.now(), 
      sender: 'user',
      text: messageText,
    };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    // Clear input only for manual sends
    if (!overrideMessage) {
      setInputValue('');
    }
    setIsLoading(true); // Set loading state

    // Special-case the 'Do you know me?' query
    if (messageText.toLowerCase().startsWith('do you know me')) {
      const responseText = displayName ? `Yes ofc! Your ${displayName}` : 'Yes of course!';
      const aiResponse: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        text: responseText,
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
      return;
    }

    try {
      // Send cookies so server knows which user is sending
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText, sessionId }),
      });

      if (!response.ok) {
        // Handle HTTP errors (e.g., 400, 500)
        console.error("API request failed:", response.statusText);
        const errorResponse: Message = {
          id: Date.now() + 1, 
          sender: 'ai',
          text: "Sorry, I encountered an error trying to respond. Please try again later.",
        };
        setMessages((prevMessages) => [...prevMessages, errorResponse]);
        return; // Exit the function early
      }

      const data = await response.json();

      // Create AI response message object
      const aiResponse: Message = {
        id: Date.now() + 1, // Ensure unique ID
        sender: 'ai',
        text: data.response || "Sorry, I didn't get a valid response.", // Use response from API
      };

      // Add AI response to state
      setMessages((prevMessages) => [...prevMessages, aiResponse]);

    } catch (error) {
      // Handle network errors or JSON parsing errors
      console.error("Error sending message:", error);
      const errorResponse: Message = {
        id: Date.now() + 1, 
        sender: 'ai',
        text: "Sorry, I couldn't connect to the assistant. Please check your connection.",
      };
      setMessages((prevMessages) => [...prevMessages, errorResponse]);
    } finally {
      setIsLoading(false); // Reset loading state regardless of success or error
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading) { // Prevent sending while loading
      handleSendMessage();
    }
  };

  return (
    // Main container takes full height and uses flex column layout
    <div className="flex flex-col h-full p-4 md:p-6">
      {/* Title Area with New Chat & History */}
      <div className="mb-4 flex items-center justify-end md:justify-between">
        <h1 className="hidden md:block text-2xl font-semibold">
          {isMounted && displayName ? `AI Assistant for ${displayName}` : 'AI Assistant'}
        </h1>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" aria-label="New Chat" onClick={handleNewChat}>
            <Plus className="size-4" />
          </Button>
          {isMobile ? (
            <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Chat History">
                  <Clock className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="max-w-full max-h-[80vh] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Chat History</SheetTitle>
                  <SheetDescription>Review past chat sessions</SheetDescription>
                </SheetHeader>
                <Tabs defaultValue="my" className="flex-1">
                  <TabsList>
                    <TabsTrigger value="my">My Chats</TabsTrigger>
                    {isAdminUser && <TabsTrigger value="students">Student Chats</TabsTrigger>}
                  </TabsList>
                  <TabsContent value="my">
                    {Object.keys(groupedMine).length === 0 ? (
                      <p className="text-sm text-muted-foreground">No past chats.</p>
                    ) : (
                      <div className="space-y-4">
                        {Object.entries(groupedMine).map(([date, sessions]) => (
                          <div key={date}>
                            <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">{date}</div>
                            <div className="space-y-2">
                              {sessions.map((s) => (
                                <Button key={s.sessionId} variant="outline" className="w-full text-left" onClick={() => resumeSession(s.sessionId)}>
                                  <div className="flex justify-between">
                                    <span>{new Date(s.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                                    <span className="font-medium">{s.preview}</span>
                                  </div>
                                </Button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  {isAdminUser && (
                    <TabsContent value="students">
                      {Object.keys(groupedStudents).length === 0 ? (
                        <p className="text-sm text-muted-foreground">No chats available.</p>
                      ) : (
                        <div className="space-y-4">
                          {Object.entries(groupedStudents).map(([date, sessions]) => (
                            <div key={date}>
                              <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">{date}</div>
                              <div className="space-y-2">
                                {sessions.map((s) => (
                                  <Button key={s.sessionId} variant="outline" className="w-full text-left" onClick={() => resumeSession(s.sessionId)}>
                                    <div className="flex justify-between">
                                      <span>{studentMap[s.studentId] || s.studentId} – {new Date(s.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                                      <span className="font-medium">{s.preview}</span>
                                    </div>
                                  </Button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  )}
                </Tabs>
                <SheetFooter>
                  <Button variant="outline" onClick={() => setHistoryOpen(false)}>Close</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          ) : (
            <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Chat History">
                  <Clock className="size-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Chat History</DialogTitle>
                  <DialogDescription>Review past chat sessions</DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="my" className="flex-1">
                  <TabsList>
                    <TabsTrigger value="my">My Chats</TabsTrigger>
                    {isAdminUser && <TabsTrigger value="students">Student Chats</TabsTrigger>}
                  </TabsList>
                  <TabsContent value="my">
                    {Object.keys(groupedMine).length === 0 ? (
                      <p className="text-sm text-muted-foreground">No past chats.</p>
                    ) : (
                      <div className="space-y-4">
                        {Object.entries(groupedMine).map(([date, sessions]) => (
                          <div key={date}>
                            <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">{date}</div>
                            <div className="space-y-2">
                              {sessions.map((s) => (
                                <Button key={s.sessionId} variant="outline" className="w-full text-left" onClick={() => resumeSession(s.sessionId)}>
                                  <div className="flex justify-between">
                                    <span>{new Date(s.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                                    <span className="font-medium">{s.preview}</span>
                                  </div>
                                </Button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  {isAdminUser && (
                    <TabsContent value="students">
                      {Object.keys(groupedStudents).length === 0 ? (
                        <p className="text-sm text-muted-foreground">No chats available.</p>
                      ) : (
                        <div className="space-y-4">
                          {Object.entries(groupedStudents).map(([date, sessions]) => (
                            <div key={date}>
                              <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">{date}</div>
                              <div className="space-y-2">
                                {sessions.map((s) => (
                                  <Button key={s.sessionId} variant="outline" className="w-full text-left" onClick={() => resumeSession(s.sessionId)}>
                                    <div className="flex justify-between">
                                      <span>{studentMap[s.studentId] || s.studentId} – {new Date(s.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                                      <span className="font-medium">{s.preview}</span>
                                    </div>
                                  </Button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  )}
                </Tabs>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setHistoryOpen(false)}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Content Area (Initial View or Chat Log) - Takes remaining space and scrolls */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto mb-4 pr-2">
        {messages.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-2xl font-semibold mb-4">
              {isMounted && displayName ? `Hello, ${displayName}!` : 'Hello there!'}
            </h2>
            <p className="text-muted-foreground mb-8">
              {isMounted && displayName
                ? `How can I help you today, ${displayName}?`
                : 'How can I help you today?'}
            </p>
            {/* Suggestion Prompts Grid - updated text */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
               <Card 
                 className="p-4 text-left hover:bg-muted cursor-pointer flex items-center" 
                 onClick={() => handleSuggestionClick("How to report a bug?")}
               >
                 <CardDescription>How to report a bug?</CardDescription>
               </Card>
               <Card 
                 className="p-4 text-left hover:bg-muted cursor-pointer flex items-center" 
                 onClick={() => handleSuggestionClick("Should I change my PIN?")}
               >
                 <CardDescription>Should I change my PIN?</CardDescription>
               </Card>
               <Card 
                 className="p-4 text-left hover:bg-muted cursor-pointer flex items-center"
                 onClick={() => handleSuggestionClick("How smart are you?")}
                >
                 <CardDescription>How smart are you?</CardDescription>
               </Card>
               <Card 
                 className="p-4 text-left hover:bg-muted cursor-pointer flex items-center" 
                 onClick={() => handleSuggestionClick("Do you know me?")}
               >
                 <CardDescription>Do you know me?</CardDescription>
               </Card>
            </div>
          </div>
        ) : (
          // Chat Log View
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.sender === 'user' ? 'justify-end' : ''
                }`}
              >
                {message.sender === 'ai' && (
                  <Avatar className="w-8 h-8 border">
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg px-3 py-2 max-w-[75%] break-words ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
                 {message.sender === 'user' && (
                  <Avatar className="w-8 h-8 border">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {/* Optional: Show typing indicator */} 
            {isLoading && (
              <div className="flex items-start gap-3">
                <Avatar className="w-8 h-8 border">
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="rounded-lg px-3 py-2 bg-muted">
                  <p className="text-sm animate-pulse">Typing...</p> {/* Basic pulse animation */}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area - Fixed at the bottom */}
      <div className="mt-auto pt-4">
        {/* New container div for rounded input bar */}
        <div className="flex items-center p-2 rounded-full bg-muted border border-border">
          {/* Placeholder Buttons - TODO: Add onClick handlers */}
          <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
            <Plus className="size-5" /> {/* Using Plus as placeholder for 'Add' or similar */}
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
            <Search className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
            <BrainCircuit className="size-5" /> {/* Placeholder for 'Deep Research' */}
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
            <ImageIcon className="size-5" />
          </Button>

          {/* Actual Input - takes up remaining space */}
          <Input
            type="text"
            placeholder="Type your message..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading} // Disable input when loading
            className="flex-1 mx-2 px-4 py-2 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground"
          />

          {/* Placeholder Buttons - TODO: Add onClick handlers */}
          <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
            <Mic className="size-5" />
          </Button>

          {/* Send Button */}
          <Button
            onClick={() => handleSendMessage()}
            disabled={isLoading || inputValue.trim() === ''} // Disable when loading or input is empty
            size="icon"
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground"
          >
            <SendHorizontal className="size-5" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
} 