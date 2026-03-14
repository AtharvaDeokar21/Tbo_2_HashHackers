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
    <a href={news.link} target="_blank" rel="noopener noreferrer" className="group">
      <Card className="h-full p-5 hover:shadow-md transition-all duration-300 border-0 bg-gradient-to-br from-slate-50 to-slate-50 dark:from-slate-900/50 dark:to-slate-900/30 hover:from-blue-50/50 dark:hover:from-blue-950/30 cursor-pointer">
        <div className="flex flex-col h-full">
          {/* Source Badge */}
          <div className="mb-3">
            <Badge 
              variant="secondary" 
              className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-0 font-medium text-xs px-2.5 py-1 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors"
            >
              {news.source}
            </Badge>
          </div>
          
          {/* Title */}
          <h3 className="font-semibold text-foreground line-clamp-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm leading-snug flex-1 mb-3">
            {news.title}
          </h3>
          
          {/* Footer with Icon */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
            <span className="text-xs text-muted-foreground">Read article</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </Card>
    </a>
  )
}
