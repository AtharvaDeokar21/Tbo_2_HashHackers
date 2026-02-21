'use client'

import { Card } from '@/components/ui/card'
import { Star } from 'lucide-react'

interface Testimonial {
  name: string
  review: string
  rating: number
}

interface SocialProofSectionProps {
  testimonials: Testimonial[]
}

export function SocialProofSection({ testimonials }: SocialProofSectionProps) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-foreground mb-6">Traveler Feedback</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial, idx) => (
          <Card key={idx} className="p-6 bg-card border-border shadow-sm hover:shadow-md transition-shadow">
            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
              ))}
            </div>

            {/* Review */}
            <p className="text-foreground mb-4 leading-relaxed">"{testimonial.review}"</p>

            {/* Name */}
            <p className="text-sm font-medium text-muted-foreground">— {testimonial.name}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}
