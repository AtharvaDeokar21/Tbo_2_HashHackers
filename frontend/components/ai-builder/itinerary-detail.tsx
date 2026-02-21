'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, MapPin, Calendar, DollarSign, Users, Download, Share2, Plane, Hotel, AlertCircle, Star } from 'lucide-react'
import { FlightInfoCard } from './flight-info-card'
import { HotelInfoCard } from './hotel-info-card'
import { QueryBot } from './query-bot'
import type { Itinerary } from '@/app/ai-builder/page'

interface ItineraryDetailProps {
  itinerary: Itinerary
  onBack: () => void
}

export function ItineraryDetail({ itinerary, onBack }: ItineraryDetailProps) {
  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Button variant="outline" size="sm" onClick={onBack} className="flex items-center gap-1 mb-4">
        <ArrowLeft size={16} />
        Back to Itineraries
      </Button>

      {/* Hero Section with Image */}
      <Card className="overflow-hidden border-0 shadow-md">
        {/* Destination Image */}
        {itinerary.image && (
          <div className="h-64 bg-muted overflow-hidden relative">
            <img
              src={itinerary.image}
              alt={itinerary.destination || 'Destination'}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        )}

        {/* Trip Summary Section */}
        <div className="p-8 space-y-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <Badge className="bg-primary/20 text-primary border-0 font-semibold">
                  {itinerary.type === 'best-match' ? '⭐ Best Match' : itinerary.type === 'best-budget' ? '💰 Best Budget' : '👑 Best Comfort'}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold text-foreground">{itinerary.title}</h1>
              <p className="text-foreground/80 leading-relaxed">{itinerary.description}</p>
              
              {/* Key Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Duration</p>
                  <p className="text-lg font-bold text-foreground">{itinerary.duration} days</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Rating</p>
                  <div className="flex items-center gap-1">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-foreground">{itinerary.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Highlights</p>
                  <p className="text-lg font-bold text-foreground">{itinerary.highlights.length}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Package</p>
                  <p className="text-lg font-bold text-primary">${itinerary.price.toLocaleString()}</p>
                </div>
              </div>

              {/* Highlights */}
              <div className="pt-4 flex flex-wrap gap-2">
                {itinerary.highlights.slice(0, 4).map((highlight, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {highlight}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="text-right space-y-4 flex-shrink-0">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-semibold uppercase">Total Price</p>
                <p className="text-4xl font-bold text-primary">${itinerary.price.toLocaleString()}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Button size="sm" className="gap-2">
                  <Download size={16} />
                  Download PDF
                </Button>
                <Button size="sm" variant="outline" className="gap-2">
                  <Share2 size={16} />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Content with QueryBot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Flights, Hotels, Itinerary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Flights and Hotels Summary */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 border-l-4 border-l-blue-500">
              <div className="flex items-center gap-2 mb-2">
                <Plane size={18} className="text-blue-600" />
                <span className="text-sm font-semibold text-foreground">Flights</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{itinerary.flights.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Flight segments included</p>
            </Card>
            
            <Card className="p-4 border-l-4 border-l-amber-500">
              <div className="flex items-center gap-2 mb-2">
                <Hotel size={18} className="text-amber-600" />
                <span className="text-sm font-semibold text-foreground">Hotels</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{itinerary.hotels.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Accommodations booked</p>
            </Card>
          </div>

          {/* Tabs for Flights, Hotels, and Itinerary */}
          <Tabs defaultValue="flights" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 bg-muted">
              <TabsTrigger value="flights" className="flex items-center gap-2">
                <Plane size={16} />
                Flights ({itinerary.flights.length})
              </TabsTrigger>
              <TabsTrigger value="hotels" className="flex items-center gap-2">
                <Hotel size={16} />
                Hotels ({itinerary.hotels.length})
              </TabsTrigger>
              <TabsTrigger value="itinerary">Day by Day</TabsTrigger>
            </TabsList>

            {/* Flights Tab */}
            <TabsContent value="flights" className="space-y-4">
              {itinerary.flights.length > 0 ? (
                itinerary.flights.map((flight) => <FlightInfoCard key={flight.id} flight={flight} />)
              ) : (
                <Card className="p-8 text-center text-muted-foreground border-dashed">
                  <AlertCircle className="mx-auto mb-2 opacity-50" size={32} />
                  <p>No flight information available</p>
                </Card>
              )}
            </TabsContent>

            {/* Hotels Tab */}
            <TabsContent value="hotels" className="space-y-4">
              {itinerary.hotels.length > 0 ? (
                itinerary.hotels.map((hotel) => <HotelInfoCard key={hotel.id} hotel={hotel} />)
              ) : (
                <Card className="p-8 text-center text-muted-foreground border-dashed">
                  <AlertCircle className="mx-auto mb-2 opacity-50" size={32} />
                  <p>No hotel information available</p>
                </Card>
              )}
            </TabsContent>

            {/* Itinerary Tab - Day by Day */}
            <TabsContent value="itinerary" className="space-y-4">
              {itinerary.dayByDay.length > 0 ? (
                <div className="space-y-4">
                  {itinerary.dayByDay.map((day, idx) => (
                    <Card key={day.day} className="p-6 border-l-4 border-l-primary hover:shadow-md transition-shadow">
                      {/* Day header */}
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <span className="font-bold text-primary text-sm">Day {day.day}</span>
                              </div>
                              <h4 className="text-lg font-bold text-foreground">{day.title}</h4>
                            </div>
                            {day.notes && (
                              <p className="text-sm text-muted-foreground ml-13 italic">{day.notes}</p>
                            )}
                          </div>
                        </div>

                        {/* Activities */}
                        <div className="space-y-3 pt-2">
                          <div className="space-y-3">
                            {day.activities.map((activity, actIdx) => (
                              <div key={actIdx} className="flex items-start gap-3 text-sm">
                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <div className="w-2 h-2 rounded-full bg-primary" />
                                </div>
                                <p className="text-foreground leading-relaxed">{activity}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Divider */}
                        {idx !== itinerary.dayByDay.length - 1 && (
                          <div className="pt-2 border-t border-border/50" />
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center text-muted-foreground border-dashed">
                  <AlertCircle className="mx-auto mb-3 opacity-50" size={32} />
                  <p className="font-medium">No itinerary details available</p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - QueryBot */}
        <div className="lg:col-span-1">
          <QueryBot itinerary={itinerary} />
        </div>
      </div>

      {/* Trip Insights Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-foreground">Trip Insights</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Comfort Score */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Comfort</p>
              <span className="text-2xl font-bold text-blue-600">8.5</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }} />
            </div>
          </Card>

          {/* Cost Score */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Cost</p>
              <span className="text-2xl font-bold text-green-600">7.2</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '72%' }} />
            </div>
          </Card>

          {/* Confidence Score */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Confidence</p>
              <span className="text-2xl font-bold text-purple-600">9.1</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '91%' }} />
            </div>
          </Card>

          {/* Risk Score */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Risk</p>
              <span className="text-2xl font-bold text-amber-600">2.3</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-amber-500 h-2 rounded-full" style={{ width: '23%' }} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
