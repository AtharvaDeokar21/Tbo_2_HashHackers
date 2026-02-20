'use client'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { TrendingUp } from 'lucide-react'

interface OpportunityCardProps {
  destination: string
  imageUrl: string
  trend: 'rising' | 'stable' | 'peaking'
  confidence: number
  reasoning: string
  marginPotential: number
  volatility: number
  bookingSurge?: number
  searchSpike?: number
  priceMovement?: number
  inventoryStatus?: 'tightening' | 'stable' | 'loosening'
  marginWindow?: 'closing' | 'optimal' | 'opening'
}

const TREND_COLORS = {
  rising: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  stable: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  peaking: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
}

export function OpportunityCard({
  destination,
  imageUrl,
  trend,
  confidence,
  reasoning,
  marginPotential,
  volatility,
  bookingSurge = 0,
  searchSpike = 0,
  priceMovement = 0,
  inventoryStatus = 'stable',
  marginWindow = 'optimal',
}: OpportunityCardProps) {
  const getInventoryColor = (status: string) => {
    switch (status) {
      case 'tightening': return 'text-amber-600 dark:text-amber-400'
      case 'loosening': return 'text-green-600 dark:text-green-400'
      default: return 'text-blue-600 dark:text-blue-400'
    }
  }

  const getWindowColor = (window: string) => {
    switch (window) {
      case 'closing': return 'text-red-600 dark:text-red-400'
      case 'opening': return 'text-green-600 dark:text-green-400'
      default: return 'text-orange-600 dark:text-orange-400'
    }
  }

  return (
    <Card className="overflow-hidden bg-card border-border shadow-sm hover:shadow-lg transition-shadow group flex flex-col">
      {/* Image Background - Reduced Height */}
      <div className="relative h-32 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
        <img
          src={imageUrl}
          alt={destination}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 right-4 flex gap-2">
          <Badge className={`${TREND_COLORS[trend]} font-medium`}>
            {trend === 'rising' && '↗ Rising'}
            {trend === 'stable' && '→ Stable'}
            {trend === 'peaking' && '↗ Peaking'}
          </Badge>
          <div className="ml-auto flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
            <TrendingUp size={14} className="text-primary" />
            <span className="font-semibold text-sm text-primary">{confidence}%</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-semibold text-foreground text-base mb-1">{destination}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed flex-shrink-0">{reasoning}</p>

        {/* Metrics - Visually Dominant */}
        <div className="space-y-4 mb-6 mt-auto">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-muted-foreground">Margin Potential</span>
              <span className="font-semibold text-sm text-foreground">{marginPotential}%</span>
            </div>
            <Progress value={marginPotential} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-muted-foreground">Volatility</span>
              <span className="font-semibold text-sm text-foreground">{volatility}%</span>
            </div>
            <Progress value={volatility} className="h-2" />
          </div>
        </div>

        {/* Why This Opportunity Accordion */}
        <Accordion type="single" collapsible className="w-full border-t border-border pt-4">
          <AccordionItem value="intelligence" className="border-0">
            <AccordionTrigger className="py-1 px-0 hover:no-underline text-xs font-medium text-primary hover:text-primary/80">
              Why this opportunity?
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-0 px-0 space-y-3">
              <div className="space-y-3">
                {bookingSurge > 0 && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Booking Surge</span>
                    <span className="font-semibold text-foreground">+{bookingSurge}%</span>
                  </div>
                )}
                {searchSpike > 0 && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Search Spike</span>
                    <span className="font-semibold text-foreground">+{searchSpike}%</span>
                  </div>
                )}
                {priceMovement !== 0 && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Price Movement</span>
                    <span className={`font-semibold ${priceMovement > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {priceMovement > 0 ? '+' : ''}{priceMovement}%
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Inventory</span>
                  <span className={`font-semibold ${getInventoryColor(inventoryStatus)}`}>
                    {inventoryStatus.charAt(0).toUpperCase() + inventoryStatus.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Margin Window</span>
                  <span className={`font-semibold ${getWindowColor(marginWindow)}`}>
                    {marginWindow.charAt(0).toUpperCase() + marginWindow.slice(1)}
                  </span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Card>
  )
}
