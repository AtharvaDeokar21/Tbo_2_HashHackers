'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { DashboardWrapper } from '@/components/layout/dashboard-wrapper'
import { PromptInputPanel } from '@/components/ai-builder/prompt-input-panel'
import { ItineraryComparison } from '@/components/ai-builder/itinerary-comparison'
import { ItineraryDetail } from '@/components/ai-builder/itinerary-detail'
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
  const [prompt, setPrompt] = useState('')
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerateItineraries = async (promptText: string) => {
    setIsLoading(true);
    setPrompt(promptText);

    const customerId = localStorage.getItem("selectedCustomer");
    if (!customerId) {
      console.error("❌ No selectedCustomer found in localStorage");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/generate-itinerary-from-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          customer_id: customerId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Backend Error:", data);
        setIsLoading(false);
        return;
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
    } catch (error) {
      console.error("❌ Fetch Error:", error);
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

        {/* Prompt Input Panel */}
        <PromptInputPanel onGenerate={handleGenerateItineraries} isLoading={isLoading} />

        {/* Itineraries Section */}
        {itineraries.length > 0 && !selectedItinerary && (
          <ItineraryComparison
            itineraries={itineraries}
            onSelectItinerary={setSelectedItinerary}
          />
        )}

        {/* Detail Section */}
        {selectedItinerary && (
          <ItineraryDetail itinerary={selectedItinerary} onBack={() => setSelectedItinerary(null)} />
        )}
      </DashboardWrapper>
    </div>
  )
}
