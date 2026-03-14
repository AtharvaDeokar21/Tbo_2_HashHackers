'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft, MapPin, Calendar, DollarSign, Users,
  Download, Share2, Plane, Hotel, AlertCircle, Star
} from 'lucide-react'
import { FlightInfoCard } from './flight-info-card'
import { HotelInfoCard } from './hotel-info-card'
import { QueryBot } from './query-bot'
import type { Itinerary, DayPlan, FlightInfo, HotelInfo } from '@/app/ai-builder/page'

interface ItineraryDetailProps {
  itinerary: Itinerary   // only has basic info
  onBack: () => void
}
function requiresBooking(day: { title?: string; activities?: string[]; notes?: string }) {
  const text = [
    day.title || "",
    ...(day.activities || []),
    day.notes || ""
  ]
    .join(" ")
    .toLowerCase();

  const keywords = [
    "book tickets",
    "book in advance",
    "pre-book",
    "reserve",
    "reservation",
    "tickets",
    "entry fee",
    "ticket required",
    "buy tickets",
    "purchase tickets",
    "advance booking"
  ];

  return keywords.some(k => text.includes(k));
}
export function ItineraryDetail({ itinerary, onBack }: ItineraryDetailProps) {

  const [fullData, setFullData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // For custom/demo itineraries, check if it's a demo ID
        if (itinerary.id.includes('custom') || itinerary.id.includes('dummy')) {
          // Use local itinerary data for custom/demo itineraries
          setFullData({
            flight: {
              airline: "Premier Airlines",
              flight_number: "PA-101",
              departure_airport: "DEL",
              arrival_airport: "BLR",
              departure_time: "10:00 AM",
              arrival_time: "01:30 PM",
              duration_minutes: 180,
              layover_count: 0,
              price: Math.floor(itinerary.price * 0.2),
              travel_class: "Economy",
              aircraft: "Boeing 737"
            },
            hotels: [
              {
                name: "Premium Stay Hotel",
                location: itinerary.destination || "Main City",
                rating: 4.5,
                price: Math.floor(itinerary.price * 0.3),
                amenities: ["WiFi", "AC", "Restaurant", "Gym"],
                reviews: 250,
                check_in: "2:00 PM",
                check_out: "11:00 AM"
              }
            ]
          })
          setLoading(false)
          return
        }

        // For backend itineraries, fetch full details
        const res = await fetch(`http://localhost:5000/itinerary/${itinerary.id}`)
        const data = await res.json()

        if (!res.ok) {
          console.error("Failed to fetch itinerary details:", data)
        } else {
          setFullData(data)
        }

      } catch (err) {
        console.error("Network error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [itinerary.id, itinerary.destination, itinerary.price])

  // Show loading state
  if (loading) {
    return <p className="text-center text-muted-foreground">Loading itinerary details...</p>
  }

  if (!fullData) {
    return (
      <Card className="p-8 text-center text-red-500 border-red-300 border">
        Failed to load itinerary details.
      </Card>
    )
  }

  // -------- MAP BACKEND → FRONTEND UI FORMAT ---------

  const mappedFlights: FlightInfo[] = fullData.flight ? [{
    id: "f1",
    airline: fullData.flight.airline,
    flightNumber: fullData.flight.flight_number,
    departure: fullData.flight.departure_airport,
    arrival: fullData.flight.arrival_airport,
    departureTime: fullData.flight.departure_time,
    arrivalTime: fullData.flight.arrival_time,
    duration: `${Math.floor(fullData.flight.duration_minutes / 60)}h ${fullData.flight.duration_minutes % 60}m`,
    stops: fullData.flight.layover_count,
    price: fullData.flight.price,
    cabin: fullData.flight.travel_class,
    aircraft: fullData.flight.aircraft
  }] : []

  const mappedHotels: HotelInfo[] = (fullData.hotel || fullData.hotels?.[0]) ? [{
    id: "h1",
    name: (fullData.hotel || fullData.hotels?.[0])?.name || "Premium Hotel",
    location: (fullData.trip?.destination || itinerary.destination) || "City",
    rating: (fullData.hotel || fullData.hotels?.[0])?.rating || 4.5,
    price: (fullData.hotel || fullData.hotels?.[0])?.price || itinerary.price * 0.3,
    nights: fullData.day_wise_plan?.days?.length || itinerary.duration || 1,
    amenities: (fullData.hotel || fullData.hotels?.[0])?.amenities || [],
    image: (fullData.hotel || fullData.hotels?.[0])?.image_url,
    latitude: Number((fullData.hotel || fullData.hotels?.[0])?.latitude) || 0,
    longitude: Number((fullData.hotel || fullData.hotels?.[0])?.longitude) || 0,
    check_in: (fullData.hotel || fullData.hotels?.[0])?.check_in || "2:00 PM",
    check_out: (fullData.hotel || fullData.hotels?.[0])?.check_out || "11:00 AM",
    hotel_class: (fullData.hotel || fullData.hotels?.[0])?.hotel_class,
    reviews: (fullData.hotel || fullData.hotels?.[0])?.reviews,
    inventory_status: (fullData.hotel || fullData.hotels?.[0])?.inventory_status
  }] : []

  const dayByDay: DayPlan[] = (fullData.day_wise_plan?.days || itinerary.dayByDay || []).map((d: any) => ({
    day: d.day,
    title: d.title,
    notes: d.notes,
    activities: d.activities
  })) || []

  // Build a final frontend-compatible itinerary object
  const fullItinerary: Itinerary = {
    ...itinerary,
    flights: mappedFlights,
    hotels: mappedHotels,
    dayByDay: dayByDay,
    price: fullData.total_price || itinerary.price,
    rating: fullData.scores?.final_score ? fullData.scores.final_score * 5 : (itinerary.rating || 4.5),
  }

  // -----------------------------------------------

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Button variant="outline" size="sm" onClick={onBack} className="flex items-center gap-1 mb-4">
        <ArrowLeft size={16} />
        Back to Itineraries
      </Button>

      {/* ---- HERO SECTION stays same ---- */}
      <Card className="overflow-hidden border-0 shadow-md">
        {fullItinerary.image && (
          <div className="h-64 bg-muted overflow-hidden relative">
            <img
              src={fullItinerary.image}
              alt={fullItinerary.destination || 'Destination'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        )}

        <div className="p-8 space-y-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">

            {/* LEFT SECTION */}
            <div className="space-y-3 flex-1">
              <Badge className="bg-primary/20 text-primary border-0 font-semibold">
                {fullItinerary.type.replace('-', ' ').toUpperCase()}
              </Badge>

              <h1 className="text-3xl font-bold text-foreground">{fullItinerary.title}</h1>
              <p className="text-foreground/80">{fullItinerary.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Duration</p>
                  <p className="text-lg font-bold">{fullItinerary.duration} days</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Final Score</p>
                  <p className="text-lg font-bold text-primary">
                    {(fullData.scores?.final_score * 100).toFixed(0)}%
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Comfort</p>
                  <p className="text-lg font-bold">
                    {(fullData.scores?.comfort_score * 100).toFixed(0)}%
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Confidence</p>
                  <p className="text-lg font-bold">
                    {(fullData.scores?.confidence_score * 100).toFixed(0)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Margin Score</p>
                  <p className="text-lg font-bold">
                    {(fullData.scores?.margin_score * 100).toFixed(0)}%
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Risk Level</p>
                  <Badge
                    className={
                      fullData.risk_level === 'Low'
                        ? 'bg-green-100 text-green-700'
                        : fullData.risk_level === 'Medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                    }
                  >
                    {fullData.risk_level}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Package</p>
                  <p className="text-lg font-bold text-primary">₹{fullItinerary.price.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-2">
                {fullItinerary.highlights.slice(0, 4).map((highlight, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {highlight}
                  </Badge>
                ))}
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="text-right space-y-4">
              <p className="text-xs text-muted-foreground uppercase">Total Price</p>
              <p className="text-4xl font-bold text-primary">₹{fullItinerary.price.toLocaleString('en-IN')}</p>

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
      </Card>

      {/* ---- REMAINING SECTION (Flights, Hotels, Daywise etc.) ---- */}
      {/* Re-use your existing UI but with fullItinerary instead of itinerary */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">

          {/* Tabs */}
          <Tabs defaultValue="flights" className="space-y-4">

            <TabsList className="grid grid-cols-3 bg-muted">
              <TabsTrigger value="flights">Flights ({fullItinerary.flights.length})</TabsTrigger>
              <TabsTrigger value="hotels">Hotels ({fullItinerary.hotels.length})</TabsTrigger>
              <TabsTrigger value="itinerary">Day by Day</TabsTrigger>
            </TabsList>

            {/* Flights tab */}
            <TabsContent value="flights" className="space-y-4">
              {fullItinerary.flights.length > 0 ? (
                fullItinerary.flights.map(f => <FlightInfoCard key={f.id} flight={f} />)
              ) : (
                <Card className="p-8 text-center text-muted-foreground border-dashed">
                  <AlertCircle className="mx-auto mb-2 opacity-50" size={32} />
                  <p>No flight details available</p>
                </Card>
              )}
            </TabsContent>

            {/* Hotels tab */}
            <TabsContent value="hotels" className="space-y-4">
              {fullItinerary.hotels.length > 0 ? (
                fullItinerary.hotels.map(h => <HotelInfoCard key={h.id} hotel={h} />)
              ) : (
                <Card className="p-8 text-center text-muted-foreground border-dashed">
                  <AlertCircle className="mx-auto mb-2 opacity-50" size={32} />
                  <p>No hotel details available</p>
                </Card>
              )}
            </TabsContent>

            {/* Daywise plan */}
            <TabsContent value="itinerary" className="space-y-4">
              {fullItinerary.dayByDay.length > 0 ? (
                fullItinerary.dayByDay.map((day, idx) => {
                  const needsBooking = requiresBooking(day)
                  return (
                    <Card key={day.day} className={`p-6 border-l-4 ${needsBooking ? "border-l-orange-500 bg-orange-50/40" : "border-l-primary"
                      }`}>
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-bold">
                          Day {day.day}: {day.title}
                        </h4>

                        {needsBooking && (
                          <Badge className="bg-orange-100 text-orange-700 border-orange-300">
                            🎟 Booking Required
                          </Badge>
                        )}
                      </div>
                      {day.notes && <p className="text-sm italic text-muted-foreground pt-1">{day.notes}</p>}
                      <div className="pt-3 space-y-2">
                        {day.activities.map((a, i) => (
                          <p key={i} className="text-sm">{a}</p>
                        ))}
                      </div>
                    </Card>
                  )
                })
              ) : (
                <Card className="p-12 text-center text-muted-foreground border-dashed">
                  <AlertCircle className="mx-auto mb-3 opacity-50" size={32} />
                  <p>No itinerary details available</p>
                </Card>
              )}
            </TabsContent>

          </Tabs>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-1">
          <QueryBot itinerary={fullItinerary} />
        </div>

      </div>
    </div>
  )
}