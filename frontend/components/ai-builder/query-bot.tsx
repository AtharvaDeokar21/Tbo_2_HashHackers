'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, MessageCircle } from 'lucide-react'
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
}

interface QueryBotProps {
  itinerary: any
}

const QUICK_QUESTIONS = [
  "What's the highlight of this trip?",
  'What should I pack?',
  'What are the best restaurants?',
  'Are there any visa requirements?',
  "What's the weather like?",
]

export function QueryBot({ itinerary }: QueryBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: `Hi! I'm your AI assistant for the "${itinerary.title}" itinerary. Ask me anything about activities, dining, weather, packing, visa info, or any other travel questions!`,
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // NEW: ref for auto scroll
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Auto scroll to bottom
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
    }
    setMessages(prev => [...prev, userMessage])

    const questionText = input
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch(
        `http://localhost:5000/itinerary/${itinerary.id}/query`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: questionText }),
        }
      )

      const data = await res.json()

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.answer || 'Sorry, I could not fetch the answer.',
      }

      setMessages(prev => [...prev, botMessage])

    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: 'Something went wrong while contacting the server. Try again!',
        },
      ])
    }

    setIsLoading(false)
  }

  const handleQuickQuestion = (question: string) => {
    setInput(question)
  }

  return (
    <Card className="overflow-hidden flex flex-col h-[750px] sticky top-20 border-l-4 border-l-primary">

      {/* Header */}
      <div className="bg-primary/5 border-b border-border p-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <MessageCircle size={18} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">Ask anything about your trip</p>
          </div>
        </div>
      </div>

      {/* ⭐ NEW — Dedicated Scroll Area ONLY for messages */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto px-4 py-4 space-y-4">

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'bg-background border border-border text-foreground'
                }`}
              >
                <div className="text-sm prose prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-background border border-border px-4 py-2 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={scrollRef} /> {/* Auto-scroll anchor */}
        </div>
      </div>

      {/* Quick Questions */}
      {messages.length === 1 && (
        <div className="border-t border-border p-4 space-y-2">
          <p className="text-xs text-muted-foreground font-semibold mb-3">Quick Questions</p>
          <div className="space-y-2">
            {QUICK_QUESTIONS.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                className="w-full text-left text-sm px-3 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border p-4 space-y-2">
        <div className="flex gap-2">
          <Input
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>

    </Card>
  )
}