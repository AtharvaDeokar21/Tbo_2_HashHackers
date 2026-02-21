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
      return <TrendingUp size={24} className="text-primary" />
    case 'best-budget':
      return <DollarSign size={24} className="text-primary/70" />
    case 'best-comfort':
      return <Crown size={24} className="text-primary/60" />
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

const getTypeColor = (type: string) => {
  switch (type) {
    case 'best-match':
      return 'bg-sidebar-primary/10 border-sidebar-primary/20'
    case 'best-budget':
      return 'bg-green-50 border-green-200'
    case 'best-comfort':
      return 'bg-amber-50 border-amber-200'
    default:
      return 'bg-gray-50 border-gray-200'
  }
}

export function ItineraryComparison({ itineraries, onSelectItinerary }: ItineraryComparisonProps) {
  return (
    <section className="space-y-8">
      {/* Section Title */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-3">Your Personalized Itineraries</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Three options tailored to different preferences. Click on any itinerary to explore detailed day-by-day plans, flights, hotels, and chat with our AI assistant.
        </p>
      </div>

      {/* Itineraries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {itineraries.map((itinerary) => (
          <Card
            key={itinerary.id}
            onClick={() => onSelectItinerary(itinerary)}
            className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group border-border"
          >
            {/* Type Header Bar */}
            <div className={`h-1 ${
              itinerary.type === 'best-match' ? 'bg-primary' :
              itinerary.type === 'best-budget' ? 'bg-primary/60' :
              'bg-primary/40'
            }`} />

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Badge and Title */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {getTypeIcon(itinerary.type)}
                  <Badge className={`text-xs font-semibold border-0 ${
                    itinerary.type === 'best-match' ? 'bg-primary/8 text-primary' :
                    itinerary.type === 'best-budget' ? 'bg-primary/6 text-primary/80' :
                    'bg-primary/5 text-primary/70'
                  }`}>
                    {getTypeLabel(itinerary.type)}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{itinerary.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{itinerary.description}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.floor(itinerary.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-foreground">{itinerary.rating.toFixed(1)}</span>
              </div>

              {/* Price and Duration Section */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-muted-foreground font-semibold mb-1">DURATION</p>
                  <p className="text-lg font-bold text-foreground">{itinerary.duration}</p>
                  <p className="text-xs text-muted-foreground">days</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-muted-foreground font-semibold mb-1">PRICE</p>
                  <p className="text-lg font-bold text-primary">${(itinerary.price / 1000).toFixed(1)}k</p>
                  <p className="text-xs text-muted-foreground">total</p>
                </div>
              </div>

              {/* Highlights as Pills */}
              <div className="space-y-2 pt-2">
                <p className="text-xs text-muted-foreground font-semibold uppercase">Highlights</p>
                <div className="flex flex-wrap gap-2">
                  {itinerary.highlights.slice(0, 3).map((highlight, index) => (
                    <Badge key={index} variant="secondary" className="text-xs font-normal">
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Flights & Hotels Quick Stats */}
              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <div className="flex-1 text-center border-r border-border/50">
                  <p className="text-sm font-bold text-foreground">{itinerary.flights.length}</p>
                  <p className="text-xs text-muted-foreground">Flight{itinerary.flights.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex-1 text-center">
                  <p className="text-sm font-bold text-foreground">{itinerary.hotels.length}</p>
                  <p className="text-xs text-muted-foreground">Hotel{itinerary.hotels.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="px-6 pb-6">
              <Button className="w-full group-hover:bg-primary/90 transition-colors">
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
