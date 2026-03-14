'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { DashboardWrapper } from '@/components/layout/dashboard-wrapper'
import { AIBuilderChat } from '@/components/ai-builder/ai-builder-chat'
import { ItineraryComparison } from '@/components/ai-builder/itinerary-comparison'
import { ItineraryDetail } from '@/components/ai-builder/itinerary-detail'
import { CustomItineraryBuilder } from '@/components/ai-builder/custom-itinerary-builder'
import { fi } from 'date-fns/locale'

export interface DayPlan {
  day: number
  title: string
  notes: string
  activities: string[]
}

export interface Itinerary {
  id: string
  type: 'best-match' | 'best-budget' | 'best-comfort'
  title: string
  description: string
  duration: number
  price: number
  rating: number
  highlights: string[]
  flights: FlightInfo[]
  hotels: HotelInfo[]
  dayByDay: DayPlan[]
  destination?: string
  image?: string
  final_score?: number
}

export interface FlightInfo {
  id: string
  airline: string
  flightNumber?: string
  departure: string
  arrival: string
  departureTime: string
  arrivalTime: string
  duration: string
  stops: number
  price: number
  cabin?: string
  aircraft?: string
}

export interface HotelInfo {
  id: string
  name: string
  location: string
  rating: number
  price: number
  nights: number
  amenities: string[]
  image?: string

  // 🔥 NEW FIELDS FROM BACKEND
  reviews?: number
  hotel_class?: string
  inventory_status?: string
  check_in?: string
  check_out?: string
  latitude?: number
  longitude?: number
}

export default function AIBuilder() {
  const toRoman = (num: number) => {
    const map: [number, string][] = [
      [5, "V"], [4, "IV"], [1, "I"]
    ];
    let result = "";
    for (const [value, numeral] of map) {
      while (num >= value) {
        result += numeral;
        num -= value;
      }
    }
    return result;
  };
  const [conversationContext, setConversationContext] = useState('')
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null)
  const [customItinerary, setCustomItinerary] = useState<Itinerary | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [useDummyData, setUseDummyData] = useState(false)

  const generateDummyItineraries = (destination: string = "Your Dream Destination") => {
    const dummyItineraries: Itinerary[] = [
      {
        id: "dummy-1-best-match",
        type: "best-match",
        title: `Itinerary I`,
        description: "AI-generated personalized itinerary",
        duration: 5,
        price: 95000,
        rating: 4.5,
        destination,
        highlights: ["Perfect Balance", "Local Experiences", "Comfortable Stay"],
        flights: [],
        hotels: [],
        dayByDay: [
          { day: 1, title: "Arrival & Exploration", notes: "Arrive and settle in. Evening city walk.", activities: ["Check-in", "Local market visit", "Dinner at local restaurant"] },
          { day: 2, title: "Cultural Experience", notes: "Explore historical sites.", activities: ["Museum visit", "Heritage walk", "Local cuisine tasting"] },
          { day: 3, title: "Adventure Day", notes: "Outdoor activities.", activities: ["Water sports", "Nature hike", "Sunset view"] },
          { day: 4, title: "Leisure & Shopping", notes: "Relax and explore local markets.", activities: ["Shopping", "Spa session", "Night market"] },
          { day: 5, title: "Departure", notes: "Final moments and departure.", activities: ["Last-minute shopping", "Departure"] },
        ],
        final_score: 0.85,
      },
      {
        id: "dummy-2-budget",
        type: "best-budget",
        title: `Itinerary II`,
        description: "Cost-effective option without compromising experiences",
        duration: 5,
        price: 55000,
        rating: 4.2,
        destination,
        highlights: ["Budget-Friendly", "Value for Money", "Essential Experiences"],
        flights: [],
        hotels: [],
        dayByDay: [
          { day: 1, title: "Arrival & Orientation", notes: "Arrive and get familiar.", activities: ["Budget accommodation check-in", "Local street food", "Evening walk"] },
          { day: 2, title: "Public Attractions", notes: "Free and low-cost attractions.", activities: ["Public parks", "Free temple/church visit", "Street food tour"] },
          { day: 3, title: "Budget Activities", notes: "Cost-effective experiences.", activities: ["Local bus tour", "Beach/park", "Night market"] },
          { day: 4, title: "Shopping & Culture", notes: "Budget shopping and local culture.", activities: ["Local bazaar", "Traditional craft workshops", "Budget dining"] },
          { day: 5, title: "Departure", notes: "Final walk and departure.", activities: ["Morning walk", "Departure"] },
        ],
        final_score: 0.75,
      },
      {
        id: "dummy-3-comfort",
        type: "best-comfort",
        title: `Itinerary III`,
        description: "Premium experience with luxury accommodations",
        duration: 5,
        price: 180000,
        rating: 4.9,
        destination,
        highlights: ["Luxury Hotels", "Premium Services", "VIP Experiences"],
        flights: [],
        hotels: [],
        dayByDay: [
          { day: 1, title: "Luxury Arrival", notes: "Premium check-in and welcome.", activities: ["5-star hotel check-in", "Welcome spa", "Fine dining"] },
          { day: 2, title: "Premium Culture", notes: "VIP guided tours.", activities: ["Private museum tour", "Premium restaurant", "Luxury shopping"] },
          { day: 3, title: "Exclusive Experience", notes: "VIP activities.", activities: ["Private yacht/safari", "Celebrity chef dining", "Luxury spa"] },
          { day: 4, title: "Relaxation & Indulgence", notes: "Spa and leisure.", activities: ["Full-day spa", "Michelin-star dining", "Exclusive night out"] },
          { day: 5, title: "Premium Departure", notes: "VIP departure experience.", activities: ["Breakfast at hotel", "Luxury transfer", "Departure"] },
        ],
        final_score: 0.95,
      },
    ]
    return dummyItineraries
  }

  const handleGenerateItineraries = async (conversationContextText: string) => {
    setIsLoading(true);
    setConversationContext(conversationContextText);

    let customerId = localStorage.getItem("selectedCustomer");
    
    // Fallback to dummy customer ID for testing
    if (!customerId) {
      console.warn("⚠️ No selectedCustomer found, using default for testing");
      customerId = "test-customer-001";
    }

    try {
      const res = await fetch("http://localhost:5000/generate-itinerary-from-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: conversationContextText,
          customer_id: customerId,
          conversationContext: conversationContextText,
        }),
      });

      // Check if response is OK before parsing
      if (!res.ok) {
        throw new Error(`Backend returned ${res.status}: ${res.statusText}`);
      }

      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        // Response is not JSON (probably error HTML)
        throw new Error("Backend returned invalid response - using demo data");
      }

      // Store complete backend response in localStorage
      localStorage.setItem("latestItineraryResponse", JSON.stringify(data));

      // Convert backend itineraries → frontend Itinerary[]
      const mappedItineraries = data.itineraries.map((it: any, index: number) => ({
        id: it.itinerary_id,
        type: index === 0 ? "best-match" : index === 1 ? "best-budget" : "best-comfort",
        title: `Itinerary ${toRoman(index + 1)}`,
        description: "AI-generated personalized itinerary",
        duration: data.day_wise_plan?.days?.length || 0,
        price: it.total_price,
        rating: it.final_score * 5, // scale 0-1 → 0-5
        destination: data.structured_intent.destination_city,
        highlights: ["AI Generated"],

        // For now flights/hotels empty since backend does not send them
        flights: [],
        hotels: [],

        // Convert daywise plan to your DayPlan[]
        dayByDay: data.day_wise_plan?.days?.map((d: any) => ({
          day: d.day,
          title: d.title,
          notes: d.notes,
          activities: d.activities,
        })) || [],
        final_score: it.final_score,
      }));

      setItineraries(mappedItineraries);
      setUseDummyData(false);
    } catch (error) {
      // Silently fallback to demo data
      const dummyItineraries = generateDummyItineraries("Your selected destination");
      setItineraries(dummyItineraries);
      setUseDummyData(true);
    }

    setIsLoading(false);
  };

  return (
    <div>
      <Sidebar />
      <Header />

      <DashboardWrapper>
        {/* Title Section */}
        <div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight">AI Package Builder</h1>
          <p className="text-muted-foreground mt-2 text-base leading-relaxed">
            Describe your perfect trip and let our AI create personalized itineraries tailored to your preferences
          </p>
        </div>

        {/* Chat Interface */}
        {!itineraries.length && (
          <AIBuilderChat onGenerateItineraries={handleGenerateItineraries} isLoadingItineraries={isLoading} />
        )}

        {/* Demo Data Banner */}
        {useDummyData && itineraries.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
            <div className="text-amber-600 font-semibold mt-1">ℹ️</div>
            <div>
              <h3 className="font-semibold text-amber-900">Demo Itineraries</h3>
              <p className="text-sm text-amber-800 mt-1">
                These are sample itineraries. Please configure your backend API key to generate AI-powered personalized itineraries. Once your backend is ready, try again for real itineraries tailored to your specific preferences.
              </p>
            </div>
          </div>
        )}

        {/* Itineraries Section */}
        {itineraries.length > 0 && !selectedItinerary && !customItinerary && (
          <div className="space-y-6">
            <button
              onClick={() => {
                setItineraries([])
                setUseDummyData(false)
              }}
              className="text-sm text-primary hover:underline font-medium"
            >
              ← Start new conversation
            </button>
            <ItineraryComparison
              itineraries={itineraries}
              onSelectItinerary={setSelectedItinerary}
            />

            {/* Custom Itinerary Builder */}
            <CustomItineraryBuilder
              itineraries={itineraries}
              onCustomItineraryGenerated={setCustomItinerary}
            />
          </div>
        )}

        {/* Detail Section */}
        {selectedItinerary && (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedItinerary(null)}
              className="text-sm text-primary hover:underline font-medium"
            >
              ← Back to comparison
            </button>
            <ItineraryDetail itinerary={selectedItinerary} onBack={() => setSelectedItinerary(null)} />
          </div>
        )}

        {/* Custom Itinerary Detail */}
        {customItinerary && !selectedItinerary && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCustomItinerary(null)}
                className="text-sm text-primary hover:underline font-medium"
              >
                ← Back to compare
              </button>
              <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full font-medium">
                ✨ Custom Itinerary
              </span>
            </div>
            <ItineraryDetail itinerary={customItinerary} onBack={() => setCustomItinerary(null)} />
          </div>
        )}
      </DashboardWrapper>
    </div>
  )
}
