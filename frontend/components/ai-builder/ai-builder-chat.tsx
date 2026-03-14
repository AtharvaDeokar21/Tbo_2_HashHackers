'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Sparkles, MessageCircle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
}

interface AIBuilderChatProps {
  onGenerateItineraries: (conversationContext: string) => void
  isLoadingItineraries: boolean
}

export function AIBuilderChat({ onGenerateItineraries, isLoadingItineraries }: AIBuilderChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: `Hello! 👋 I'm your AI travel assistant. I'll help you plan the perfect trip! 

Let me start by understanding your needs. Could you tell me:
- **Who's traveling?** (number of adults, children, etc.)
- **Where do you want to go?** (destination)
- **When are you planning to travel?** (dates)

Feel free to describe your trip in as much detail as you'd like, and I'll ask follow-up questions to refine your preferences!`,
    },
  ])
  const [input, setInput] = useState('')
  const [isLoadingBotResponse, setIsLoadingBotResponse] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<string>('')
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoadingBotResponse])

  // Dummy bot responses for demo - replaces real API if not available
  const getDummyBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    // If user mentions generating/proceeding
    if (
      lowerMessage.includes('proceed') ||
      lowerMessage.includes('generate') ||
      lowerMessage.includes('ready') ||
      lowerMessage.includes('final') ||
      lowerMessage.includes('yes') ||
      lowerMessage.includes('confirm')
    ) {
      return `Perfect! 🎉 I've collected all the information I need. Let me generate 3 personalized itineraries for you based on our conversation:

1. **Best Match** - Balanced experience tailored to your preferences
2. **Best Budget** - Cost-effective option without compromising experiences  
3. **Best Comfort** - Premium experience with luxury accommodations

Generating your itineraries now...`
    }

    // Ask about budget if not mentioned
    if (!conversationHistory.toLowerCase().includes('budget')) {
      return `Great! That sounds exciting! 🌍 

A few more details to perfect your itinerary:
- **What's your budget range?** (Economy, Medium, or Luxury)
- **Any specific activities or experiences?** (e.g., beaches, culture, adventure, food)
- **Flight preferences?** (Direct flights, any number of stops, cabin class?)

Tell me more about these, or let me know if you're ready to proceed!`
    }

    // Ask about preferences if not mentioned
    if (!conversationHistory.toLowerCase().includes('activity') && !conversationHistory.toLowerCase().includes('interest')) {
      return `Excellent! 💡 Now let's talk about what you'd like to do:
- **What activities interest you?** (beaches, museums, hiking, shopping, etc.)
- **Any dietary restrictions or special accommodations?**
- **Hotel preferences?** (star rating, location type)

Feel free to share as much as you want, and when you're ready, just say "proceed" or "generate itineraries"!`
    }

    // Default response
    return `That's great information! 📝 

Based on what you've told me so far, I'm building a clear picture of your ideal trip. 

Do you have any other preferences or requirements? Or if you're happy with all the details we've discussed, feel free to say **"proceed for generating the itinerary"** and I'll create 3 amazing options for you!`
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setConversationHistory((prev) => prev + '\nUser: ' + input)

    const userInput = input
    setInput('')
    setIsLoadingBotResponse(true)

    // Check if user is ready to proceed
    const isProceedingMessage = userInput.toLowerCase().includes('proceed') ||
      userInput.toLowerCase().includes('generate') ||
      userInput.toLowerCase().includes('ready') ||
      userInput.toLowerCase().includes('final') ||
      (userInput.toLowerCase().includes('yes') && messages.length > 3)

    if (isProceedingMessage) {
      // Wait a moment for UX
      await new Promise((resolve) => setTimeout(resolve, 500))

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: getDummyBotResponse(userInput),
      }
      setMessages((prev) => [...prev, botMessage])
      setConversationHistory((prev) => prev + '\nBot: ' + botMessage.content)
      setIsLoadingBotResponse(false)

      // Trigger itinerary generation
      await new Promise((resolve) => setTimeout(resolve, 2000))
      onGenerateItineraries(conversationHistory + '\nUser: ' + userInput)
      return
    }

    // Simulate bot response delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Try to call backend API, fall back to dummy response
    let botResponse = getDummyBotResponse(userInput)

    try {
      // Try backend chat endpoint if available
      const res = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userInput,
          conversation_history: conversationHistory,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        botResponse = data.response || botResponse
      }
    } catch (error) {
      // Silently fall back to dummy response
    }

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: botResponse,
    }

    setMessages((prev) => [...prev, botMessage])
    setConversationHistory((prev) => prev + '\nBot: ' + botResponse)
    setIsLoadingBotResponse(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoadingBotResponse && !isLoadingItineraries) {
      handleSendMessage()
    }
  }

  return (
    <section className="space-y-6">
      <Card className="overflow-hidden flex flex-col max-h-175 bg-card border-border shadow-sm">
        {/* Header */}
        <div className="bg-primary/5 border-b border-border p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkles size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">AI Trip Planner</h2>
              <p className="text-sm text-muted-foreground">
                Chat with our AI to design your perfect itinerary
              </p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-background">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-sm px-4 py-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground border border-border'
                }`}
              >
                <div className="text-sm leading-relaxed prose prose-sm max-w-none space-y-0">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {isLoadingBotResponse && (
            <div className="flex justify-start">
              <div className="bg-muted border border-border px-4 py-3 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  />
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4 bg-muted/30">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="flex gap-2"
          >
            <Input
              placeholder={
                isLoadingBotResponse || isLoadingItineraries
                  ? 'Please wait...'
                  : 'Tell me about your trip or say "proceed to generate itineraries"...'
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoadingBotResponse || isLoadingItineraries}
              className="flex-1 text-base bg-background"
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoadingBotResponse || isLoadingItineraries}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <Send size={18} />
              {isLoadingItineraries ? 'Generating...' : 'Send'}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2">
            💡 Tip: When you're ready, say "proceed for generating the itinerary" and I'll create 3 personalized options for you!
          </p>
        </div>
      </Card>
    </section>
  )
}
