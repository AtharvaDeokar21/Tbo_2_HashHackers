'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { DashboardWrapper } from '@/components/layout/dashboard-wrapper'
import { PromptInputPanel } from '@/components/ai-builder/prompt-input-panel'
import { ItineraryComparison } from '@/components/ai-builder/itinerary-comparison'
import { ItineraryDetail } from '@/components/ai-builder/itinerary-detail'

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
}

export default function AIBuilder() {
  const [prompt, setPrompt] = useState('')
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerateItineraries = async (promptText: string) => {
    setIsLoading(true)
    setPrompt(promptText)

    // Simulate API call to AI agent
    setTimeout(() => {
      const mockItineraries: Itinerary[] = [
        {
          id: '1',
          type: 'best-match',
          title: 'Best Match - Maldives Paradise',
          description: 'Perfect balance of comfort and value with pristine beaches and luxury resorts',
          duration: 5,
          price: 3299,
          rating: 4.8,
          destination: 'Maldives',
          image: '/destinations/maldives-hero.jpg',
          highlights: ['Overwater bungalows', 'Coral reef snorkeling', 'Water sports', 'Island dining'],
          flights: [
            {
              id: 'f1',
              airline: 'Singapore Airlines',
              flightNumber: 'SQ 402',
              departure: 'Delhi (DEL)',
              arrival: 'Malé (MLE)',
              departureTime: '18:30',
              arrivalTime: '23:45',
              duration: '3h 45m',
              stops: 0,
              price: 450,
              cabin: 'Business Class',
              aircraft: 'Boeing 787',
            },
          ],
          hotels: [
            {
              id: 'h1',
              name: 'Soneva Jani Resort',
              location: 'Noonu Atoll, Maldives',
              rating: 4.9,
              price: 2200,
              nights: 4,
              amenities: ['Overwater villa', 'Private pool', 'Underwater spa', 'Fine dining'],
              image: '/hotels/soneva.jpg',
            },
          ],
          dayByDay: [
            {
              day: 1,
              title: 'Arrival and City Waterfront Stroll',
              notes: 'Familiarize yourself with the city layout on foot. Malé is small enough to explore much of it by walking.',
              activities: [
                'Arrive in Malé, settle in and explore the immediate surroundings of your accommodation',
                'Take a leisurely afternoon walk along the waterfront, observing local life and the bustling harbour',
                'Enjoy dinner at a local Maldivian restaurant, sampling traditional dishes like Garudhiya or Mashuni Roshi',
              ],
            },
            {
              day: 2,
              title: 'Cultural Immersion and Local Markets',
              notes: 'Dress modestly when visiting religious sites. Engage with local vendors at the markets for an authentic experience.',
              activities: [
                'Morning visit to the Islamic Centre, including the Grand Friday Mosque (Masjid-al Sultan Mohamed Thakurufaanu Al Auzam), admiring its architecture',
                'Explore the Malé Fish Market and the Local Market (fruit and vegetable market) to experience the vibrant local trade',
                'Visit Sultan Park and the National Museum (check opening hours) for a glimpse into Maldivian history and culture',
              ],
            },
            {
              day: 3,
              title: 'Island Escape to Villingili',
              notes: 'Villingili offers a glimpse into a less commercialized Maldivian local island life. Ferries run frequently from Malé.',
              activities: [
                'Take a short local ferry ride to Villingili (Vilimalé) Island, a serene escape from the capital hustle',
                'Spend the afternoon exploring Villingili laid-back streets, local cafes, and enjoy swimming or snorkeling at quieter beaches',
                'Return to Malé in the late afternoon. Enjoy a relaxed evening meal at a waterfront café',
              ],
            },
            {
              day: 4,
              title: 'Hulhumalé Exploration and Beach Relaxation',
              notes: 'Hulhumalé offers a different vibe from Malé, with wider streets and more open feel. Taxis or local buses readily available.',
              activities: [
                'Cross the Sinamalé Bridge to Hulhumalé, a reclaimed island with a more modern feel and beautiful beaches',
                'Spend the afternoon relaxing on Hulhumalé Beach, swimming, or trying optional water sports (jet ski, paddleboarding)',
                'Enjoy dinner at one of the many restaurants in Hulhumalé, or head back to Malé for your final evening',
              ],
            },
            {
              day: 5,
              title: 'Last Souvenirs and Departure',
              notes: 'Remember to purchase local crafts, unique Maldivian snacks, or traditional garments as souvenirs. Plan airport transfer in advance.',
              activities: [
                'Enjoy a final Maldivian breakfast. Depending on your departure, do some last-minute souvenir shopping',
                'Revisit a favourite spot in Malé for a final coffee or photo opportunity',
                'Prepare for departure, ensuring you have enough time for transfer to Velana International Airport',
              ],
            },
          ],
        },
        {
          id: '2',
          type: 'best-budget',
          title: 'Best Budget - Maldives Essentials',
          description: 'Experience Maldives beauty without breaking the bank, local island experience',
          duration: 5,
          price: 1599,
          rating: 4.5,
          destination: 'Maldives',
          highlights: ['Local islands', 'Budget resorts', 'Authentic experiences', 'Snorkeling'],
          flights: [
            {
              id: 'f2',
              airline: 'FlyDubai',
              flightNumber: 'FZ 210',
              departure: 'Delhi (DEL)',
              arrival: 'Malé (MLE)',
              departureTime: '08:00',
              arrivalTime: '13:30',
              duration: '4h 30m',
              stops: 0,
              price: 250,
              cabin: 'Economy',
              aircraft: 'Boeing 737',
            },
          ],
          hotels: [
            {
              id: 'h2',
              name: 'Local Island Guesthouse',
              location: 'Maafushi Island, Maldives',
              rating: 4.3,
              price: 600,
              nights: 4,
              amenities: ['Beach access', 'WiFi', 'Local restaurant', 'Snorkel gear'],
            },
          ],
          dayByDay: [],
        },
        {
          id: '3',
          type: 'best-comfort',
          title: 'Best Comfort - Maldives Luxury',
          description: 'Ultimate luxury experience with private villas, world-class dining, and personalized service',
          duration: 5,
          price: 5899,
          rating: 4.9,
          destination: 'Maldives',
          highlights: ['Private villa', 'Michelin dining', 'Water sports', 'Spa treatments'],
          flights: [
            {
              id: 'f3',
              airline: 'Emirates',
              flightNumber: 'EK 507',
              departure: 'Delhi (DEL)',
              arrival: 'Malé (MLE)',
              departureTime: '22:00',
              arrivalTime: '04:30',
              duration: '3h 30m',
              stops: 0,
              price: 800,
              cabin: 'First Class',
              aircraft: 'Boeing 777',
            },
          ],
          hotels: [
            {
              id: 'h3',
              name: 'The Ritz-Carlton Maldives',
              location: 'Fari Islands, Maldives',
              rating: 5.0,
              price: 4200,
              nights: 4,
              amenities: ['Private villa', 'Butler service', 'Michelin chef', 'Submarine tours'],
            },
          ],
          dayByDay: [],
        },
      ]

      setItineraries(mockItineraries)
      setIsLoading(false)
    }, 1500)
  }

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
