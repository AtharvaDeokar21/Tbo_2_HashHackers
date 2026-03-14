'use client'

import { useState, useMemo, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Check, Plane, Building2, DollarSign, Sparkles } from 'lucide-react'
import type { Itinerary } from '@/app/ai-builder/page'

interface MixComponentsSelectorProps {
  itineraries: Itinerary[]
  onCustomItineraryGenerated: (customItinerary: Itinerary) => void
}

export function MixComponentsSelector({
  itineraries,
  onCustomItineraryGenerated,
}: MixComponentsSelectorProps) {
  const [selectedComponents, setSelectedComponents] = useState<{
    flightSource: string | null
    hotelSource: string | null
  }>({
    flightSource: null,
    hotelSource: null,
  })

  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')
  const [detailedItineraries, setDetailedItineraries] = useState<Record<string, any>>({})

  // Calculate custom price
  const customPrice = useMemo(() => {
    const flightItin = itineraries.find((it) => it.id === selectedComponents.flightSource)
    const hotelItin = itineraries.find((it) => it.id === selectedComponents.hotelSource)

    if (!flightItin || !hotelItin) return 0

    const flightPrice = (flightItin.price * 0.2) || 0
    const hotelPrice = (hotelItin.price * 0.3) || 0

    return Math.round(flightPrice + hotelPrice)
  }, [selectedComponents, itineraries])

  const handleSelectFlight = (itineraryId: string) => {
    setSelectedComponents((prev) => ({
      ...prev,
      flightSource: prev.flightSource === itineraryId ? null : itineraryId,
    }))
    setError('')
  }

  const handleSelectHotel = (itineraryId: string) => {
    setSelectedComponents((prev) => ({
      ...prev,
      hotelSource: prev.hotelSource === itineraryId ? null : itineraryId,
    }))
    setError('')
  }

  const handleCreateCustom = async () => {
    if (!selectedComponents.flightSource || !selectedComponents.hotelSource) {
      setError('Please select both a flight and a hotel source')
      return
    }

    setIsCreating(true)
    setError('')

    try {
      const latest = localStorage.getItem('latestItineraryResponse')
      if (!latest) {
        throw new Error('No itinerary response found in localStorage')
      }

      const parsed = JSON.parse(latest)
      const tripId = parsed.trip_id

      const res = await fetch('http://localhost:5000/itinerary/customize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trip_id: tripId,
          flight_source: selectedComponents.flightSource,
          hotel_source: selectedComponents.hotelSource,
        }),
      })

      if (!res.ok) {
        throw new Error(`Server error: ${res.statusText}`)
      }

      const data = await res.json()

      console.log('New Itinerary ID:', data.new_itinerary_id)

      const newItinerary: Itinerary = {
        id: data.new_itinerary_id,
        type: 'best-match',
        title: 'Your Custom Itinerary',
        description: 'Personalized itinerary with your selected components',
        duration: itineraries[0]?.duration || 5,
        price: customPrice,
        rating: 4.5,
        destination: itineraries[0]?.destination || '',
        highlights: ['Custom Mix', 'Personalized Selection'],
        flights: [],
        hotels: [],
        dayByDay: [],
        final_score: 0,
      }

      onCustomItineraryGenerated(newItinerary)
    } catch (err) {
      console.error('Error creating custom itinerary:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to create custom itinerary'
      )
    } finally {
      setIsCreating(false)
    }
  }



  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const latest = localStorage.getItem("latestItineraryResponse")
        if (!latest) return

        const parsed = JSON.parse(latest)

        const ids = parsed.itineraries.map((it: any) => it.itinerary_id)

        const results: Record<string, any> = {}

        await Promise.all(
          ids.map(async (id: string) => {
            const res = await fetch(`http://localhost:5000/itinerary/${id}`)
            if (!res.ok) return

            const data = await res.json()
            results[id] = data
          })
        )

        setDetailedItineraries(results)

      } catch (err) {
        console.error("Failed to fetch itinerary details", err)
      }
    }

    fetchDetails()
  }, [])

  return (
    <Card className="border-primary/20 bg-background overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-primary/10 bg-primary/5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Sparkles size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Mix Components</h3>
              <p className="text-sm text-muted-foreground">
                Select flight & hotel sources
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="p-6 space-y-8">
        {/* Flight Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-primary/20">
            <div className="p-2 bg-sky-500/10 rounded-lg">
              <Plane size={18} className="text-sky-600" />
            </div>
            <h4 className="font-semibold text-foreground">Select Flights</h4>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {itineraries.map((it) => {
              const details = detailedItineraries[it.id]
              const flight = details?.flight
              const isSelected = selectedComponents.flightSource === it.id
              const flightPrice = flight?.price ?? (it.price * 0.2)

              return (
                <Card
                  key={`flight-${it.id}`}
                  className={`p-4 cursor-pointer transition-all duration-200 border-2 ${isSelected
                    ? 'border-sky-500 bg-sky-50 shadow-md'
                    : 'border-border hover:border-sky-300 bg-background hover:bg-sky-50/30'
                    }`}
                  onClick={() => handleSelectFlight(it.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-lg transition-all ${isSelected
                        ? 'bg-sky-500/20'
                        : 'bg-sky-500/10'
                        }`}>
                        <Plane size={16} className="text-sky-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground mb-1">
                          {it.title}
                        </div>
                        <div className="flex flex-col text-xs text-muted-foreground">
                          {flight ? (
                            <>
                              <span className="font-medium text-foreground">
                                {flight.airline} • {flight.flight_number}
                              </span>

                              <span>
                                {flight.departure_airport} → {flight.arrival_airport}
                              </span>

                              <span>
                                {flight.departure_time} → {flight.arrival_time}
                              </span>

                              <span className="font-semibold text-sky-700">
                                ₹{flight.price?.toLocaleString('en-IN')}
                              </span>
                            </>
                          ) : (
                            <span>Loading flight details...</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="ml-2 p-1 bg-sky-500 rounded-full">
                        <Check size={16} className="text-white" />
                      </div>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Hotel Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-primary/20">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Building2 size={18} className="text-amber-600" />
            </div>
            <h4 className="font-semibold text-foreground">Select Hotels</h4>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {itineraries.map((it) => {
              const isSelected = selectedComponents.hotelSource === it.id
              const details = detailedItineraries[it.id]
              const hotel = details?.hotel || details?.hotels?.[0]
              const hotelPrice = (it.price * 0.3)

              return (
                <Card
                  key={`hotel-${it.id}`}
                  className={`p-4 cursor-pointer transition-all duration-200 border-2 ${isSelected
                    ? 'border-amber-500 bg-amber-50 shadow-md'
                    : 'border-border hover:border-amber-300 bg-background hover:bg-amber-50/30'
                    }`}
                  onClick={() => handleSelectHotel(it.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-lg transition-all ${isSelected
                        ? 'bg-amber-500/20'
                        : 'bg-amber-500/10'
                        }`}>
                        <Building2 size={16} className="text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground mb-1">
                          {it.title}
                        </div>
                        <div className="flex flex-col text-xs text-muted-foreground">
                          {hotel ? (
                            <>
                              <span>{hotel.name}</span>
                              <span>⭐ {hotel.rating}</span>
                              <span>₹{hotel.price?.toLocaleString('en-IN')}</span>
                            </>
                          ) : (
                            <span>Loading hotel details...</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="ml-2 p-1 bg-amber-500 rounded-full">
                        <Check size={16} className="text-white" />
                      </div>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertCircle size={18} className="text-destructive mt-0 shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Summary & Button */}
        {selectedComponents.flightSource && selectedComponents.hotelSource ? (
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-primary/10">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Sparkles size={16} className="text-primary" />
                </div>
                <h5 className="font-semibold text-foreground">Your Custom Mix</h5>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-sky-500/10 rounded">
                    <Plane size={14} className="text-sky-600" />
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Flights from </span>
                    <span className="font-semibold text-foreground">
                      {itineraries.find((it) => it.id === selectedComponents.flightSource)?.title}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-amber-500/10 rounded">
                    <Building2 size={14} className="text-amber-600" />
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Hotels from </span>
                    <span className="font-semibold text-foreground">
                      {itineraries.find((it) => it.id === selectedComponents.hotelSource)?.title}
                    </span>
                  </div>
                </div>
              </div>

              
            </div>

            <Button
              onClick={handleCreateCustom}
              disabled={isCreating}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 h-auto"
            >
              {isCreating ? (
                <>
                  <Sparkles size={16} className="mr-2 animate-spin" />
                  Creating Your Itinerary...
                </>
              ) : (
                <>
                  <Sparkles size={16} className="mr-2" />
                  Create Custom Itinerary
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">
            <AlertCircle size={18} className="text-blue-600 mt-0.5 shrink-0" />
            <p className="text-sm text-blue-900">
              Select both a flight source and a hotel source to create your custom itinerary
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
