'use client'

import { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
}

interface AIBuilderChatProps {
  onGenerateItineraries: (prompt: string) => void
  isLoadingItineraries: boolean
}

export function AIBuilderChat({ onGenerateItineraries, isLoadingItineraries }: AIBuilderChatProps) {

  const [sessionId, setSessionId] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoadingBotResponse, setIsLoadingBotResponse] = useState(false)
  const [intentReady, setIntentReady] = useState(false)
  const [prompt, setPrompt] = useState("")
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setSessionId(uuidv4())

    setMessages([
      {
        id: "1",
        type: "bot",
        content: `Hello! 👋 I'm your AI travel assistant.

Tell me:
- Where do you want to travel?
- Where are you traveling from?
- How long is your trip?`,
      },
    ])
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || intentReady) return

    const userMessage = input

    const userMsgObj: Message = {
      id: Date.now().toString(),
      type: "user",
      content: userMessage,
    }

    setMessages((prev) => [...prev, userMsgObj])
    setInput("")
    setIsLoadingBotResponse(true)

    try {

      const res = await fetch("http://localhost:5000/conversation/intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: userMessage,
        }),
      })

      const data = await res.json()

      if (data.intent_ready) {

        setIntentReady(true)
        setPrompt(data.prompt)

        const botMsg: Message = {
          id: Date.now().toString(),
          type: "bot",
          content: data.prompt,
        }

        setMessages((prev) => [...prev, botMsg])

      } else {

        const botMsg: Message = {
          id: Date.now().toString(),
          type: "bot",
          content: data.reply,
        }

        setMessages((prev) => [...prev, botMsg])
      }

    } catch (error) {
      console.error("Chat error:", error)
    }

    setIsLoadingBotResponse(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSendMessage()
  }

  return (
    <section className="space-y-6">
      <Card className="overflow-hidden flex flex-col max-h-175 bg-card border-border shadow-sm">

        {/* Header */}
        <div className="bg-primary/5 border-b border-border p-6">
          <div className="flex items-center gap-3">
            <Sparkles size={20} className="text-primary" />
            <h2 className="text-xl font-bold">AI Trip Planner</h2>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-sm px-4 py-3 rounded-lg ${
                  message.type === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted border border-border"
                }`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {isLoadingBotResponse && (
            <div className="text-sm text-muted-foreground">Thinking...</div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Generate Itinerary Button */}
        {intentReady && (
          <div className="p-4 border-t border-border flex justify-center">
            <Button
              onClick={() => onGenerateItineraries(prompt)}
              disabled={isLoadingItineraries}
              className="gap-2"
            >
              {isLoadingItineraries ? "Generating..." : "Generate Itineraries"}
            </Button>
          </div>
        )}

        {/* Input */}
        {!intentReady && (
          <div className="border-t border-border p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tell me about your trip..."
              />
              <Button type="submit">
                <Send size={18} />
              </Button>
            </form>
          </div>
        )}

      </Card>
    </section>
  )
}