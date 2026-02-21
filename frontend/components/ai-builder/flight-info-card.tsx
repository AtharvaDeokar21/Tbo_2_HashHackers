'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plane } from 'lucide-react'
import type { FlightInfo } from '@/app/ai-builder/page'

interface FlightInfoCardProps {
  flight: FlightInfo
}

export function FlightInfoCard({ flight }: FlightInfoCardProps) {
  return (
    <Card className="p-6 space-y-4 border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
      {/* Header with Airline and Non-stop Badge */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Plane size={18} className="text-blue-600" />
            <h4 className="font-bold text-lg text-foreground">{flight.airline}</h4>
          </div>
          <p className="text-sm text-muted-foreground">{flight.flightNumber || 'Flight Details'}</p>
        </div>
        {flight.stops === 0 && (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            Non-stop
          </Badge>
        )}
      </div>

      {/* Flight Timeline Visual */}
      <div className="flex items-center gap-4 py-4">
        {/* Departure */}
        <div className="flex-1">
          <p className="text-xs text-muted-foreground mb-1">Departure</p>
          <p className="text-xl font-bold text-foreground">{flight.departure}</p>
          <p className="text-xs text-muted-foreground mt-1">{flight.departureTime}</p>
        </div>

        {/* Timeline */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <div className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded">
            {flight.duration}
          </div>
          <div className="relative w-16 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600">
            <div className="absolute -right-1.5 -top-1.5 w-3 h-3 rounded-full bg-blue-600" />
          </div>
          {flight.stops > 0 && (
            <p className="text-xs text-muted-foreground">{flight.stops} stop{flight.stops > 1 ? 's' : ''}</p>
          )}
        </div>

        {/* Arrival */}
        <div className="flex-1 text-right">
          <p className="text-xs text-muted-foreground mb-1">Arrival</p>
          <p className="text-xl font-bold text-foreground">{flight.arrival}</p>
          <p className="text-xs text-muted-foreground mt-1">{flight.arrivalTime}</p>
        </div>
      </div>

      {/* Flight Details */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t">
        <div>
          <p className="text-xs text-muted-foreground">Class</p>
          <p className="text-sm font-semibold text-foreground">{flight.cabin || 'Economy'}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Aircraft</p>
          <p className="text-sm font-semibold text-foreground">{flight.aircraft || 'Airbus A320'}</p>
        </div>
      </div>

      {/* Price and CTA */}
      <div className="flex items-center justify-between pt-2 border-t">
        <div>
          <p className="text-xs text-muted-foreground">Price per person</p>
          <p className="text-2xl font-bold text-blue-600">${flight.price.toLocaleString()}</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Book Flight
        </Button>
      </div>
    </Card>
  )
}
