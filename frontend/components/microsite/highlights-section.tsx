'use client'

import { Card } from '@/components/ui/card'
import { Calendar, Flower2, Building2, MapPin } from 'lucide-react'

const highlights = [
  {
    icon: Calendar,
    title: '7 Nights',
    description: 'April 1-8: Peak cherry blossom season in Kyoto and Tokyo',
  },
  {
    icon: Flower2,
    title: 'Cultural Experiences',
    description: 'Temple visits, traditional tea ceremonies, and seasonal festivals',
  },
  {
    icon: Building2,
    title: 'Premium Hotels',
    description: '4-5 star accommodations in central locations',
  },
  {
    icon: MapPin,
    title: 'Guided Activities',
    description: 'Expert local guides for historical sites and hidden gems',
  },
]

export function HighlightsSection() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-foreground mb-6">Package Highlights</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {highlights.map((highlight) => {
          const Icon = highlight.icon
          return (
            <Card key={highlight.title} className="p-6 bg-card border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                  <Icon size={24} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{highlight.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{highlight.description}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
