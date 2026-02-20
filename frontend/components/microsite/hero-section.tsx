'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Star, Shield, Clock } from 'lucide-react'

interface HeroSectionProps {
  destination: string
  agentName: string
  imageUrl: string
  startingPrice: number
  ratingScore: number
  inventoryWindow: string
}

export function HeroSection({
  destination,
  agentName,
  imageUrl,
  startingPrice,
  ratingScore,
  inventoryWindow,
}: HeroSectionProps) {
  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Image */}
        <div className="relative h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg overflow-hidden shadow-md">
          <img
            src={imageUrl}
            alt={destination}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Curated by {agentName}</p>
            <h1 className="text-4xl font-bold text-foreground mb-3">{destination}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Premium experience combining cultural immersion with comfort
            </p>
          </div>

          {/* Pricing and Badges */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Starting Price Per Person</p>
              <p className="text-4xl font-bold text-foreground">${startingPrice.toLocaleString()}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                <Clock size={14} className="mr-1" />
                {inventoryWindow}
              </Badge>
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                <Star size={14} className="mr-1" />
                {ratingScore} Verified
              </Badge>
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                <Shield size={14} className="mr-1" />
                Agent Verified
              </Badge>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button className="flex-1 font-semibold shadow-md hover:shadow-lg transition-shadow">
              Request Itinerary
            </Button>
            <Button variant="secondary" className="flex-1 font-semibold shadow-sm hover:shadow-md transition-shadow">
              Compare Packages
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="bg-secondary/50 border border-border rounded-lg p-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={16} className="text-primary" />
              <span className="font-medium">Trusted by 500+ travelers</span>
            </div>
            <p className="text-xs">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="underline cursor-help">Free cancellation up to 30 days before departure</span>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs max-w-xs">Full refund if you cancel 30+ days before travel date</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
