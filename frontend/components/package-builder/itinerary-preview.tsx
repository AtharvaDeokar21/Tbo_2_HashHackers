'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Progress } from '@/components/ui/progress'
import { PackageConfig } from './config-panel'
import { AlertCircle, TrendingUp } from 'lucide-react'

interface ItineraryPreviewProps {
  config: PackageConfig
}

const DESTINATION_DATA: Record<string, { name: string; basePrice: number; image: string }> = {
  bali: { name: 'Bali, Indonesia', basePrice: 1800, image: '/destinations/bali.jpg' },
  iceland: { name: 'Iceland', basePrice: 2400, image: '/destinations/iceland.jpg' },
  portugal: { name: 'Portugal', basePrice: 1600, image: '/destinations/portugal.jpg' },
  japan: { name: 'Japan', basePrice: 2200, image: '/destinations/japan.jpg' },
}

export function ItineraryPreview({ config }: ItineraryPreviewProps) {
  const dest = DESTINATION_DATA[config.destination]
  
  // Calculate package price
  const nights = Math.floor(
    (new Date(config.checkOut).getTime() - new Date(config.checkIn).getTime()) / (1000 * 60 * 60 * 24)
  )
  const basePackagePrice = dest.basePrice * nights
  const flightCost = config.includeFlight ? 500 : 0
  const hotelMultiplier = { luxury: 1.5, upscale: 1.2, comfort: 0.9, budget: 0.6 }[config.hotel] || 1
  const hotelCost = (dest.basePrice * 0.5 * nights * hotelMultiplier)
  const activitiesCost = config.activities.length * 150
  const riskPremium = config.includeRisk ? basePackagePrice * 0.08 : 0
  
  const subtotal = flightCost + hotelCost + activitiesCost + riskPremium
  const marginAmount = subtotal * (config.marginPercent / 100)
  const totalPrice = subtotal + marginAmount

  // Calculate confidence score based on configuration completeness
  let confidenceScore = 70
  if (config.activities.length >= 2) confidenceScore += 10
  if (config.includeFlight) confidenceScore += 5
  if (config.marginPercent >= 20) confidenceScore += 10
  if (config.dynamicRepricing) confidenceScore += 5

  const journeyScore = Math.min(95, confidenceScore)

  const ITINERARY_DAYS = [
    {
      day: 1,
      title: 'Arrival & Beach Exploration',
      activities: 'Arrive at destination, transfer to hotel, sunset beach walk',
    },
    {
      day: 2,
      title: 'Adventure Activity Day',
      activities: 'Full day adventure activity, meals included, evening relaxation',
    },
    {
      day: 3,
      title: 'Cultural Immersion',
      activities: 'Guided cultural tour, local market visit, traditional dinner',
    },
  ]

  return (
    <Card className="p-8 bg-card border-border shadow-sm sticky top-24">
      {/* Destination Header */}
      <div className="mb-6 pb-6 border-b border-border">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-foreground">{dest.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{nights} nights • {config.activities.length} activities</p>
          </div>
          <Badge className="bg-primary text-primary-foreground font-semibold">
            ✓ Ready to Deploy
          </Badge>
        </div>
      </div>

      {/* Price Summary */}
      <div className="space-y-4 mb-6 pb-6 border-b border-border">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground font-medium">${subtotal.toFixed(0)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Margin ({config.marginPercent}%)</span>
            <span className="text-primary font-semibold">${marginAmount.toFixed(0)}</span>
          </div>
          <div className="h-px bg-border my-2" />
          <div className="flex justify-between items-center">
            <span className="font-semibold text-foreground">Package Total</span>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">${totalPrice.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">per person</p>
            </div>
          </div>
        </div>
      </div>

      {/* Margin & Risk Indicator */}
      <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-border">
        <div className="bg-secondary rounded-lg p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Margin %</p>
          <p className="text-2xl font-bold text-primary">{config.marginPercent}%</p>
        </div>
        <div className="bg-secondary rounded-lg p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Risk Level</p>
          <Badge className={config.includeRisk ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'}>
            {config.includeRisk ? '⚠ Premium' : '✓ Standard'}
          </Badge>
        </div>
      </div>

      {/* Journey Score Progress */}
      <div className="mb-6 pb-6 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-primary" />
            <span className="text-sm font-semibold text-foreground">Journey Score</span>
          </div>
          <span className="text-xl font-bold text-primary">{journeyScore}%</span>
        </div>
        <Progress value={journeyScore} className="h-3" />
        <p className="text-xs text-muted-foreground mt-2">
          {journeyScore >= 90 ? 'Excellent package configuration' : journeyScore >= 75 ? 'Strong package composition' : 'Add more details to improve'}
        </p>
      </div>

      {/* Itinerary Accordion */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-foreground mb-4">Detailed Itinerary</h4>
        <Accordion type="single" collapsible defaultValue="day-1" className="border border-border rounded-lg overflow-hidden">
          {ITINERARY_DAYS.map((item) => (
            <AccordionItem key={item.day} value={`day-${item.day}`} className="border-0 border-b last:border-0">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-secondary text-sm font-semibold">
                Day {item.day}: {item.title}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-sm text-muted-foreground bg-secondary/30">
                {item.activities}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Repricing Alert */}
      {config.dynamicRepricing && (
        <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <AlertCircle size={16} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-blue-700 dark:text-blue-300">
            <p className="font-semibold mb-1">Dynamic repricing enabled</p>
            <p>Prices will automatically adjust based on market demand and availability</p>
          </div>
        </div>
      )}
    </Card>
  )
}
