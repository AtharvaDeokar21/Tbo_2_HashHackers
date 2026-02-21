'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Star, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'
import type { HotelInfo } from '@/app/ai-builder/page'
import { LeafletMap } from "./LeafletMap"


export function HotelInfoCard({ hotel }: { hotel: HotelInfo }) {
  const [showAllAmenities, setShowAllAmenities] = useState(false)

  const stars = hotel.hotel_class
    ? parseInt(hotel.hotel_class[0]) // "4-star hotel" → 4
    : Math.round(hotel.rating)

  const displayedAmenities = showAllAmenities
    ? hotel.amenities
    : hotel.amenities.slice(0, 6)

  const hasMap = hotel.latitude && hotel.longitude

  return (
    <Card className="overflow-hidden border-l-4 border-l-amber-500 shadow-sm hover:shadow-lg transition-all duration-300">

      {/* Image */}
      <div className="h-48 bg-muted relative">
        {hotel.image ? (
          <img
            src={hotel.image}
            className="w-full h-full object-cover"
            alt={hotel.name}
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-amber-700 bg-amber-100">
            No Image
          </div>
        )}

        {/* Hotel class pill */}
        <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
          {Array.from({ length: stars }).map((_, i) => (
            <Star key={i} size={10} className="fill-yellow-300 text-yellow-300" />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-5">

        {/* Title */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold">{hotel.name}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <MapPin size={16} className="text-muted-foreground" />
            {hotel.location}
          </p>
        </div>

        {/* Rating + Reviews + Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < Math.round(hotel.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground/30'
                  }
                />
              ))}
            </div>
            <span className="text-sm font-semibold">{hotel.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">
              ({hotel.reviews?.toLocaleString() || '—'} reviews)
            </span>
          </div>

          <Badge
            className={
              hotel.inventory_status === 'Available'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }
          >
            <CheckCircle2 size={14} className="mr-1" />
            {hotel.inventory_status}
          </Badge>
        </div>

        {/* Amenities Section */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">Amenities</p>
          <div className="flex flex-wrap gap-2">
            {displayedAmenities.map((a, i) => (
              <Badge key={i} variant="secondary" className="rounded-full text-xs px-2 py-1">
                {a}
              </Badge>
            ))}
          </div>

          {/* Toggle */}
          {hotel.amenities.length > 6 && (
            <button
              onClick={() => setShowAllAmenities(!showAllAmenities)}
              className="text-primary text-xs flex items-center gap-1 mt-1"
            >
              {showAllAmenities ? 'Show Less' : 'Show More'}
              {showAllAmenities ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          )}
        </div>

        {/* Check-in / Check-out */}
        <div className="grid grid-cols-2 gap-3 bg-muted/40 p-4 rounded-lg">
          <div>
            <p className="text-xs text-muted-foreground">Check-in</p>
            <p className="font-semibold">{hotel.check_in || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Check-out</p>
            <p className="font-semibold">{hotel.check_out || '—'}</p>
          </div>
        </div>

        {/* Map */}
        {hotel.latitude && hotel.longitude && (
          <LeafletMap lat={hotel.latitude} lng={hotel.longitude} />
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Price for stay</p>
            <p className="text-3xl font-bold text-amber-600">
              ₹{hotel.price.toLocaleString('en-IN')}
            </p>
          </div>
          <Button className="bg-amber-600 hover:bg-amber-700">Book Now</Button>
        </div>

      </div>
    </Card>
  )
}