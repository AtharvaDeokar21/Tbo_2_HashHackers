'use client'

import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { MapPin, Sparkles } from 'lucide-react'

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
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 group cursor-pointer h-full flex flex-col">
      {/* Image Container */}
      <div className="relative w-full h-64 overflow-hidden bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 flex-shrink-0">
        {destination.image ? (
          <>
            <Image
              src={destination.image}
              alt={destination.destination}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              priority={false}
              quality={75}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            {/* Dark overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-blue-200 dark:from-blue-900 dark:via-purple-900 dark:to-blue-950">
            <MapPin className="w-20 h-20 text-blue-400 dark:text-blue-500 opacity-50 mb-2" />
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium opacity-70">No Image</span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex-1 p-5 flex flex-col">
        {/* Destination Name */}
        <div className="flex items-start gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <h3 className="font-bold text-lg text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
            {destination.destination}
          </h3>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
          {destination.description}
        </p>

        {/* Footer Badge */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/30 rounded-full border border-blue-100 dark:border-blue-900 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
            <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Trending</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
