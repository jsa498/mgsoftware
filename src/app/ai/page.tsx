"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Define a type for the message structure
interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
}

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  // Add a loading state for the AI response
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Helper function to simulate sending a suggestion
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    // Optionally, immediately send the message
    // handleSendMessage(); // Uncomment if you want suggestions to send immediately
  };

  const handleSendMessage = async () => { // Make the function async
    const messageText = inputValue.trim();
    if (messageText === '') return;

    const newUserMessage: Message = {
      id: Date.now(), 
      sender: 'user',
      text: messageText,
    };

    // Add user message immediately and clear input
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInputValue('');
    setIsLoading(true); // Set loading state

    try {
      // Call the backend API route
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageText }),
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
      {/* Title Area */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">AI Assistant</h1>
      </div>

      {/* Content Area (Initial View or Chat Log) - Takes remaining space and scrolls */}
      <div className="flex-1 overflow-y-auto mb-4 pr-2"> {/* Added pr-2 for scrollbar space */} 
        {messages.length === 0 && !isLoading ? ( // Don't show suggestions if loading initial message
          // Initial View
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-2xl font-semibold mb-4">Hello there!</h2>
            <p className="text-muted-foreground mb-8">How can I help you today?</p>
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

      {/* Input Area - Sticks to the bottom */}
      <div className="pt-4 border-t"> 
        <div className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-1"
            aria-label="Chat message input"
            disabled={isLoading} // Disable input while loading
          />
          <Button type="submit" onClick={handleSendMessage} disabled={inputValue.trim() === '' || isLoading}> 
            {isLoading ? "Sending..." : "Send"} {/* Change button text/state while loading */}
          </Button>
        </div>
      </div>
    </div>
  );
} 