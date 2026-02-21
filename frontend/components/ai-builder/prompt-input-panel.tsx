'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Send, Zap } from 'lucide-react'

interface PromptInputPanelProps {
  onGenerate: (prompt: string) => void
  isLoading: boolean
}

const EXAMPLE_PROMPTS = [
  {
    title: 'Maldives Getaway',
    text: 'Create a ready-to-book travel package for a family of 4 (2 adults, 2 children), traveling to Maldives from July 1–8, 2024, with a mid-range budget, focus on beach relaxation and water activities.',
  },
  {
    title: 'Luxury Honeymoon',
    text: 'Design a luxury honeymoon package for a couple to Bali from September 15-22, 2024, with premium budget, 5-star accommodations, fine dining, and romantic experiences.',
  },
  {
    title: 'Cultural Adventure',
    text: 'Create a cultural tour for 2 adults exploring Japan for 10 days (June 20-30, 2024), with focus on temples, local experiences, traditional cuisine, and budget-conscious hotels.',
  },
]

export function PromptInputPanel({ onGenerate, isLoading }: PromptInputPanelProps) {
  const [prompt, setPrompt] = useState('')

  const handleSubmit = () => {
    if (prompt.trim()) {
      onGenerate(prompt)
      setPrompt('')
    }
  }

  const handleExampleClick = (example: string) => {
    setPrompt(example)
  }

  return (
    <section className="space-y-6">
      <Card className="p-8 bg-card border-border shadow-sm space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles size={24} className="text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Describe Your Perfect Trip</h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Tell our AI agent about your travelers, destination, travel dates, budget, and preferences. We'll generate 3 personalized itineraries for you.
          </p>
        </div>

        {/* Input Area */}
        <div className="space-y-4">
          <Textarea
            placeholder="Example: Create a travel package for 2 adults and 1 child traveling to Maldives from July 1-8, 2024, with a medium budget, business class flights, and focus on beach relaxation and water sports..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
            className="min-h-[120px] text-base resize-none p-4"
          />

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium">{prompt.length} characters</p>
            <Button
              onClick={handleSubmit}
              disabled={!prompt.trim() || isLoading}
              size="lg"
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin">
                    <Zap size={18} />
                  </div>
                  Generating...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Generate Itineraries
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 bg-card text-xs text-muted-foreground font-semibold uppercase tracking-wide">Try These Examples</span>
          </div>
        </div>

        {/* Example Prompts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {EXAMPLE_PROMPTS.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example.text)}
              disabled={isLoading}
              className="text-left p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/60 hover:border-border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="space-y-2">
                <Badge variant="outline" className="text-xs">{example.title}</Badge>
                <p className="text-sm text-foreground leading-snug line-clamp-3 group-hover:text-foreground/90">
                  {example.text}
                </p>
              </div>
            </button>
          ))}
        </div>
      </Card>
    </section>
  )
}
