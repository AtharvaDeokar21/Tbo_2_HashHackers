'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, MapPin, CheckCircle2 } from 'lucide-react'
import type { HotelInfo } from '@/app/ai-builder/page'

interface HotelInfoCardProps {
  hotel: HotelInfo
}

export function HotelInfoCard({ hotel }: HotelInfoCardProps) {
  return (
    <Card className="overflow-hidden border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="h-48 bg-gradient-to-br from-amber-200 to-amber-300 relative overflow-hidden">
        {hotel.image && (
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        )}
        {!hotel.image && (
          <div className="w-full h-full flex items-center justify-center bg-amber-100">
            <span className="text-amber-600 text-sm font-medium">Hotel Image</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-foreground">{hotel.name}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={16} className="flex-shrink-0" />
            {hotel.location}
          </div>
        </div>

        {/* Rating and Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.floor(hotel.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-foreground">{hotel.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">(163 reviews)</span>
          </div>
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle2 size={14} className="mr-1" />
            Available
          </Badge>
        </div>

        {/* Amenities - Rounded Tags */}
        <div className="flex flex-wrap gap-2">
          {hotel.amenities.slice(0, 4).map((amenity, index) => (
            <Badge key={index} variant="secondary" className="rounded-full">
              {amenity}
            </Badge>
          ))}
        </div>

        {/* Check-in/Check-out and Airport Shuttle */}
        <div className="grid grid-cols-2 gap-3 bg-muted/50 rounded-lg p-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Check-in</p>
            <p className="text-sm font-semibold text-foreground">3:00 PM</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Check-out</p>
            <p className="text-sm font-semibold text-foreground">11:00 AM</p>
          </div>
        </div>

        {/* Airport Shuttle Badge */}
        <Badge variant="outline" className="w-full justify-center py-2">
          ✓ Airport Shuttle Available
        </Badge>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Price per stay</p>
            <p className="text-2xl font-bold text-amber-600">${hotel.price.toLocaleString()}</p>
          </div>
          <Button className="bg-amber-600 hover:bg-amber-700">
            Book Now
          </Button>
        </div>
      </div>
    </Card>
  )
}
