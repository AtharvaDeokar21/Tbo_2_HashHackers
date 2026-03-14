'use client'

import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { MapPin } from 'lucide-react'

interface TrendingDestinationItem {
  destination: string
  description: string
  image: string | null
}

interface TrendingDestinationCardProps {
  destination: TrendingDestinationItem
}

export function TrendingDestinationCard({ destination }: TrendingDestinationCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-neutral-200 dark:border-neutral-800 group cursor-pointer h-full flex flex-col bg-white dark:bg-neutral-950">
      {/* Image Container */}
      <div className="relative w-full h-48 overflow-hidden bg-neutral-100 dark:bg-neutral-900 flex-shrink-0">
        {destination.image ? (
          <>
            <Image
              src={destination.image}
              alt={destination.destination}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority={false}
              quality={75}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </>
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center bg-neutral-100 dark:bg-neutral-900">
            <MapPin className="w-10 h-10 text-neutral-400 dark:text-neutral-600 mb-2" />
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">No Image</span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Destination Name */}
        <h3 className="font-semibold text-sm text-foreground group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors leading-tight mb-2">
          {destination.destination}
        </h3>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-3 line-clamp-2">
          {destination.description}
        </p>

        {/* Footer */}
        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
          <div className="text-xs text-muted-foreground font-medium">Featured</div>
        </div>
      </div>
    </Card>
  )
}
