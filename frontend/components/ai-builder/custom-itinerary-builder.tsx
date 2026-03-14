'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Send, Sparkles, Zap } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Itinerary } from '@/app/ai-builder/page'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
}

interface CustomItineraryBuilderProps {
  itineraries: Itinerary[]
  onCustomItineraryGenerated: (customItinerary: Itinerary) => void
}

export function CustomItineraryBuilder({ itineraries, onCustomItineraryGenerated }: CustomItineraryBuilderProps) {
  const [isBuilding, setIsBuilding] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: `🎨 **Create Your Own Custom Itinerary!**

You can now mix and match components from the 3 itineraries above:
- **Hotels from Itinerary I**
- **Flights from Itinerary II**
- **Activities from Itinerary III**
- *Or any other combination you like!*

Just describe what you'd like to customize. For example:
- "I want the luxury hotels from itinerary 3, but the budget flights from itinerary 2"
- "Keep the activities from 1, change hotels to budget option"
- "Combine the best of all three"

What would you like to customize?`,
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const getDummyCustomItinerary = (): Itinerary => {
    return {
      id: `custom-${Date.now()}`,
      type: 'best-match',
      title: 'Your Custom Itinerary',
      description: 'Personalized itinerary crafted just for you',
      duration: 5,
      price: 120000,
      rating: 4.7,
      destination: itineraries[0]?.destination || 'Your Dream Destination',
      highlights: ['Custom Mixed', 'Personalized Selection', 'Perfect Fit'],
      flights: [],
      hotels: [],
      dayByDay: [
        { day: 1, title: 'Arrival & Exploration', notes: 'Arrive and settle in. Evening city walk.', activities: ['Check-in', 'Local market visit', 'Dinner at local restaurant'] },
        { day: 2, title: 'Mixed Experience', notes: 'Combine best of all itineraries.', activities: ['Premium activities', 'Budget-friendly dining', 'Cultural experience'] },
        { day: 3, title: 'Adventure & Relaxation', notes: 'Balance of comfort and adventure.', activities: ['Water sports', 'Spa session', 'Fine dining'] },
        { day: 4, title: 'Leisure & Exploration', notes: 'Enjoy curated selections.', activities: ['Shopping', 'Local experiences', 'Night market'] },
        { day: 5, title: 'Departure', notes: 'Final moments and departure.', activities: ['Last-minute shopping', 'Departure'] },
      ],
      final_score: 0.87,
    }
  }

  const generateBotResponse = (userMessage: string): string => {
    const lower = userMessage.toLowerCase()

    // Check if ready to generate
    if (lower.includes('create') || lower.includes('generate') || lower.includes('make') || lower.includes('done') || lower.includes('ready')) {
      return `Perfect! ✨ I'm creating your custom itinerary based on your preferences...

**Your Custom Itinerary Summary:**
- Mixed components from your selected itineraries
- Personalized pricing and duration adjusted
- All your requested changes incorporated

Generating your itinerary now... This will be your perfect match!`
    }

    // Default response asking for clarification
    return `Great! 🎯 Let me help you customize this further. 

I can adjust:
✈️ **Flights** - Choose from any of the itineraries
🏨 **Hotels** - Pick your preferred level (Budget/Standard/Luxury)
🎭 **Activities** - Mix activities from different options
💰 **Budget** - Adjust overall spending
📅 **Duration** - Change trip length if needed

Just let me know which specific changes you'd like to make, and I'll adjust your itinerary accordingly. Or say "create custom itinerary" when you're satisfied with your choices!`
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])

    const userInput = input
    setInput('')
    setIsLoading(true)

    try {
      const latest = localStorage.getItem("latestItineraryResponse")

      if (!latest) {
        throw new Error("No itinerary response found in localStorage")
      }

      const parsed = JSON.parse(latest)
      const tripId = parsed.trip_id

      const res = await fetch("http://localhost:5000/conversation/itinerary-edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trip_id: tripId,
          message: userInput
        })
      })

      const data = await res.json()

      // ✅ Print the new itinerary ID
      console.log("New Itinerary ID:", data.new_itinerary_id)
      const newItinerary: Itinerary = {
        id: data.new_itinerary_id,
        type: "best-match", // value doesn't matter much for custom
        title: "Custom Itinerary",
        description: "AI-generated itinerary based on your customization",
        duration: itineraries?.[0]?.duration || 5,
        price: itineraries?.[0]?.price || 0,
        rating: 4.5,
        destination: itineraries?.[0]?.destination || "",
        highlights: ["Custom Mix", "AI Optimized"],
        flights: [],
        hotels: [],
        dayByDay: [],
        final_score: 0
      }

      // 🔥 THIS triggers the UI to show ItineraryDetail
      onCustomItineraryGenerated(newItinerary)

    } catch (error) {
      console.error("Error creating custom itinerary:", error)
    }

    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSendMessage()
    }
  }

  return (
    <section className="space-y-6 mt-12 pt-8 border-t border-border">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2 tracking-tight flex items-center gap-2">
          <Sparkles size={24} className="text-primary" />
          Create Your Custom Itinerary
        </h2>
        <p className="text-muted-foreground text-sm">
          Mix and match components from the itineraries above to create your perfect trip
        </p>
      </div>

      {/* Quick Selection Guide */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Zap size={18} className="text-primary" />
          Mix Components From Different Itineraries
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {itineraries.map((it, idx) => (
            <div key={it.id} className="text-sm space-y-2">
              <Badge variant="outline" className="bg-white border-primary/30">
                {it.title}
              </Badge>
              <div className="space-y-1 text-muted-foreground text-xs">
                <p>💰 ₹{it.price?.toLocaleString('en-IN')}</p>
                <p>📅 {it.duration} days</p>
                <p>⭐ {(it.final_score ?? 0) * 100}% fit</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Chat Card */}
      <Card className="overflow-hidden flex flex-col max-h-175 bg-card border-border shadow-sm">
        {/* Header */}
        <div className="bg-primary/5 border-b border-border p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkles size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Customize Your Itinerary</h3>
              <p className="text-sm text-muted-foreground">
                Tell us what you'd like to change
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
                className={`max-w-sm px-4 py-3 rounded-lg ${message.type === 'user'
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

          {isLoading && (
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
                isLoading
                  ? 'Please wait...'
                  : 'Describe your custom preferences or say "create custom itinerary"...'
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1 text-base bg-background"
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <Send size={18} />
              Send
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2">
            💡 You can mix hotels, flights, activities, and more from the itineraries above!
          </p>
        </div>
      </Card>
    </section>
  )
}
