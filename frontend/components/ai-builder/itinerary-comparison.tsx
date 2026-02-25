'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, DollarSign, TrendingUp, Crown } from 'lucide-react'
import type { Itinerary } from '@/app/ai-builder/page'

interface ItineraryComparisonProps {
  itineraries: Itinerary[]
  onSelectItinerary: (itinerary: Itinerary) => void
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'best-match':
      return <TrendingUp size={22} className="text-primary" />
    case 'best-budget':
      return <DollarSign size={22} className="text-emerald-600" />
    case 'best-comfort':
      return <Crown size={22} className="text-amber-600" />
    default:
      return null
  }
}

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'best-match':
      return 'Best Match'
    case 'best-budget':
      return 'Best Budget'
    case 'best-comfort':
      return 'Best Comfort'
    default:
      return type
  }
}

export function ItineraryComparison({ itineraries, onSelectItinerary }: ItineraryComparisonProps) {
  return (
    <section className="space-y-8">
      {/* Section Title */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2 tracking-tight">
          Your Personalized Itineraries
        </h2>
        <p className="text-muted-foreground text-sm">
          Three options tailored to different preferences. Select one to view the full breakdown.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {itineraries.map((itinerary) => (
          <Card
            key={itinerary.id}
            onClick={() => onSelectItinerary(itinerary)}
            className="
    overflow-hidden 
    cursor-pointer 
    transition-all 
    duration-500 
    group 
    border border-white/20
    hover:border-primary/40 
    rounded-2xl 
    bg-white/40 
    backdrop-blur-xl 
    shadow-[0_8px_30px_rgb(0,0,0,0.08)]
    hover:shadow-[0_12px_40px_rgb(0,0,0,0.15)]
    hover:-translate-y-1
  "
          >
            {itinerary === itineraries[0] && (
              <div className="
      absolute 
      top-3 right-3 
      bg-primary/90 
      text-white 
      text-xs 
      font-semibold 
      px-3 py-1.5 
      rounded-full 
      shadow-lg 
      backdrop-blur-sm
    ">
                Best Match
              </div>
            )}
            {/* Top Luxury Accent Bar */}
            <div
              className="
      h-1.5 
      bg-gradient-to-r 
      from-primary 
      via-primary/60 
      to-primary/30
    "
            />

            <div className="p-7 space-y-6">

              {/* Title */}
              <div>
                <h3 className="
        text-xl 
        font-semibold 
        tracking-tight 
        text-foreground 
        group-hover:text-primary 
        transition-colors
        text-center
      ">
                  {itinerary.title}
                </h3>

                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {itinerary.description}
                </p>
              </div>

              {/* Score */}
              <div className="flex flex-col gap-1 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground tracking-wide">
                    Trip fit score
                  </span>

                  <span className="text-sm font-bold text-foreground">
                    {(itinerary.final_score * 100).toFixed(0)}%
                  </span>
                </div>

                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="
        h-full 
        bg-gradient-to-r 
        from-primary 
        to-primary/70 
        transition-all 
        duration-700 
        ease-out
      "
                    style={{ width: `${(itinerary.final_score ?? 0) * 100}%` }}
                  />
                </div>
              </div>

              {/* Duration + Price Block */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="
        rounded-xl 
        p-4 
        text-center 
        bg-white/50 
        shadow-inner 
        border border-white/30
      ">
                  <p className="text-[10px] tracking-wide text-muted-foreground font-medium">
                    DURATION
                  </p>
                  <p className="text-2xl font-bold text-foreground">{itinerary.duration}</p>
                  <p className="text-[11px] text-muted-foreground">days</p>
                </div>

                <div className="
        rounded-xl 
        p-4 
        text-center 
        bg-white/50 
        shadow-inner 
        border border-white/30
      ">
                  <p className="text-[10px] tracking-wide text-muted-foreground font-medium">
                    PRICE
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    ₹{itinerary.price?.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] text-muted-foreground">total</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="px-7 pb-6">
              <Button
                className="
        w-full 
        rounded-xl 
        py-5 
        text-base 
        font-medium 
        bg-primary/90 
        hover:bg-primary 
        transition-all 
        duration-300 
        shadow-md 
        hover:shadow-lg
      "
              >
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}