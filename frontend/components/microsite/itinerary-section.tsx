'use client'

import { Card } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'

interface ItineraryDay {
  day: number
  title: string
  description: string
  hotel: string
  activities: string[]
}

interface ItinerarySectionProps {
  days: ItineraryDay[]
}

export function ItinerarySection({ days }: ItinerarySectionProps) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-foreground mb-6">Detailed Itinerary</h2>

      <Card className="p-6 bg-card border-border shadow-sm">
        <Accordion type="single" collapsible className="w-full">
          {days.map((day) => (
            <AccordionItem key={day.day} value={`day-${day.day}`} className="border-border">
              <AccordionTrigger className="py-4 px-0 hover:no-underline">
                <div className="flex items-center gap-4 text-left">
                  <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full flex-shrink-0">
                    <span className="font-semibold text-primary text-sm">Day {day.day}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{day.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{day.description}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-0 pt-4 pb-4">
                <div className="space-y-4">
                  {/* Hotel Info */}
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">Hotel</p>
                    <p className="text-sm font-medium text-foreground">{day.hotel}</p>
                  </div>

                  {/* Activities */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">Activities</p>
                    <div className="flex flex-wrap gap-2">
                      {day.activities.map((activity) => (
                        <Badge key={activity} variant="secondary" className="text-xs">
                          {activity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </section>
  )
}
