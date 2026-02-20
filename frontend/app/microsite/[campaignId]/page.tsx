'use client'

import { HeroSection } from '@/components/microsite/hero-section'
import { WhyPackageSection } from '@/components/microsite/why-package-section'
import { HighlightsSection } from '@/components/microsite/highlights-section'
import { ItinerarySection } from '@/components/microsite/itinerary-section'
import { PriceBreakdownSection } from '@/components/microsite/price-breakdown-section'
import { SocialProofSection } from '@/components/microsite/social-proof-section'
import { UrgencyCtaSection } from '@/components/microsite/urgency-cta-section'
import { MicrositeFooter } from '@/components/microsite/microsite-footer'

// Mock campaign data - in production, fetch from database using [campaignId]
const mockCampaignData = {
  id: 'japan-spring-festival',
  destination: 'Japan - Spring Festival Experience',
  agentName: 'Sarah Chen',
  agentEmail: 'sarah.chen@travelexperts.com',
  agentPhone: '+1-555-0123',
  whatsappNumber: '15550123456',
  imageUrl: '/destinations/japan.jpg',
  startingPrice: 2499,
  ratingScore: 4.8,
  inventoryWindow: 'Inventory tightening – 3-5 week window',
  seasonalAlignment: 'Peak cherry blossom season (April) with stable temperatures and ideal climate conditions',
  pricingWindow: 'Prices locked in for 30 days with no dynamic increases during booking window',
  marginSustainability: '32% potential margin with minimal volatility and strong demand signals',
  confidence: 92,
  riskLevel: 'low' as const,
  campaignWindow: '3-5 weeks',
  basePrice: 2499,
  taxes: 350,
  addOns: [
    { name: 'Travel Insurance (Comprehensive)', price: 125 },
    { name: 'Airport Transfers (Both Ways)', price: 150 },
    { name: 'Spa & Wellness Package', price: 300 },
    { name: 'Photography Tour Enhancement', price: 200 },
  ],
  slotsRemaining: 4,
  volatilityRisk: 'medium' as const,
  testimonials: [
    {
      name: 'Jessica Martinez',
      review: 'Absolutely incredible experience. Sarah created a perfect itinerary that balanced cultural immersion with comfort. Would book again in a heartbeat.',
      rating: 5,
    },
    {
      name: 'Michael Wong',
      review: 'Professional service from start to finish. The accommodations were premium, guides were knowledgeable, and every detail was thoughtfully planned.',
      rating: 5,
    },
  ],
  itineraryDays: [
    {
      day: 1,
      title: 'Arrival in Tokyo',
      description: 'Welcome to Japan. Settle into your luxury accommodation with city views.',
      hotel: 'The Ritz-Carlton Tokyo, Roppongi',
      activities: ['Airport Transfer', 'Hotel Check-in', 'Welcome Dinner'],
    },
    {
      day: 2,
      title: 'Cherry Blossoms & Temples',
      description: 'Experience iconic Tokyo with cherry blossoms at peak bloom.',
      hotel: 'The Ritz-Carlton Tokyo, Roppongi',
      activities: ['Senso-ji Temple', 'Yoyogi Park', 'Traditional Tea Ceremony'],
    },
    {
      day: 3,
      title: 'Modern & Traditional Tokyo',
      description: 'Contrast traditional temples with modern Tokyo innovations.',
      hotel: 'The Ritz-Carlton Tokyo, Roppongi',
      activities: ['Shibuya Crossing', 'Harajuku', 'Meiji Shrine', 'Sunset from Tokyo Tower'],
    },
    {
      day: 4,
      title: 'Bullet Train to Kyoto',
      description: 'Journey on the iconic Shinkansen to Kyoto, Japan\'s ancient capital.',
      hotel: 'Four Seasons Hotel Kyoto',
      activities: ['Shinkansen Experience', 'Traditional Welcome', 'Gion District Walk'],
    },
    {
      day: 5,
      title: 'Kyoto Temple Circuit',
      description: 'Explore hundreds of temples with peak cherry blossoms.',
      hotel: 'Four Seasons Hotel Kyoto',
      activities: ['Fushimi Inari Shrine', 'Kinkaku-ji', 'Ryoan-ji Temple', 'Philosopher Path'],
    },
    {
      day: 6,
      title: 'Arashiyama & Bamboo Grove',
      description: 'Serene bamboo forests and scenic mountain views.',
      hotel: 'Four Seasons Hotel Kyoto',
      activities: ['Bamboo Grove', 'Tenryu-ji Temple', 'Togetsukyo Bridge', 'Local Market Visit'],
    },
    {
      day: 7,
      title: 'Osaka Day Trip',
      description: 'Dynamic modern city with historic castle and vibrant food scene.',
      hotel: 'Four Seasons Hotel Kyoto',
      activities: ['Osaka Castle', 'Dotonbori District', 'Street Food Experience', 'Return to Kyoto'],
    },
    {
      day: 8,
      title: 'Departure',
      description: 'Depart Japan with unforgettable memories of spring in paradise.',
      hotel: 'Four Seasons Hotel Kyoto',
      activities: ['Final Breakfast', 'Airport Transfer', 'Departure'],
    },
  ],
}

export default function CampaignMicrosite({ params }: { params: { campaignId: string } }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Main Container */}
      <main className="pt-0 transition-all duration-300">
        <div className="px-8 lg:px-10 py-12 lg:py-16">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Hero Section */}
            <HeroSection
              destination={mockCampaignData.destination}
              agentName={mockCampaignData.agentName}
              imageUrl={mockCampaignData.imageUrl}
              startingPrice={mockCampaignData.startingPrice}
              ratingScore={mockCampaignData.ratingScore}
              inventoryWindow={mockCampaignData.inventoryWindow}
            />

            {/* Why This Package Section */}
            <WhyPackageSection
              seasonalAlignment={mockCampaignData.seasonalAlignment}
              pricingWindow={mockCampaignData.pricingWindow}
              marginSustainability={mockCampaignData.marginSustainability}
              confidence={mockCampaignData.confidence}
              riskLevel={mockCampaignData.riskLevel}
              campaignWindow={mockCampaignData.campaignWindow}
            />

            {/* Highlights Section */}
            <HighlightsSection />

            {/* Itinerary Section */}
            <ItinerarySection days={mockCampaignData.itineraryDays} />

            {/* Price Breakdown Section */}
            <PriceBreakdownSection
              basePrice={mockCampaignData.basePrice}
              taxes={mockCampaignData.taxes}
              addOns={mockCampaignData.addOns}
            />

            {/* Social Proof Section */}
            <SocialProofSection testimonials={mockCampaignData.testimonials} />

            {/* Urgency & CTA Section */}
            <UrgencyCtaSection
              slotsRemaining={mockCampaignData.slotsRemaining}
              volatilityRisk={mockCampaignData.volatilityRisk}
            />

            {/* Footer */}
            <MicrositeFooter
              agentName={mockCampaignData.agentName}
              agentEmail={mockCampaignData.agentEmail}
              agentPhone={mockCampaignData.agentPhone}
              whatsappNumber={mockCampaignData.whatsappNumber}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
