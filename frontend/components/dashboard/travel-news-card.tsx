'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, ArrowRight } from 'lucide-react'

interface TravelNewsItem {
  link: string
  source: string
  title: string
}

interface TravelNewsCardProps {
  news: TravelNewsItem
}

export function TravelNewsCard({ news }: TravelNewsCardProps) {
  return (
    <a href={news.link} target="_blank" rel="noopener noreferrer" className="group block h-full">
      <Card className="h-full p-5 hover:shadow-lg transition-shadow duration-300 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 cursor-pointer flex flex-col">
        <div className="flex flex-col h-full">
          {/* Source Badge */}
          <div className="mb-4">
            <Badge 
              variant="secondary" 
              className="bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 font-medium text-xs px-2.5 py-1 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700 transition-colors"
            >
              {news.source}
            </Badge>
          </div>
          
          {/* Title */}
          <h3 className="font-semibold text-foreground line-clamp-4 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors text-sm leading-snug flex-1 mb-4">
            {news.title}
          </h3>
          
          {/* Footer with Icon */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <span className="text-xs text-muted-foreground font-medium">Read more</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground dark:group-hover:text-neutral-200 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </Card>
    </a>
  )
}
