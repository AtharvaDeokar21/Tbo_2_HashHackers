'use client'

import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { CampaignIdentityCard } from '@/components/campaign-generator/campaign-identity-card'
import { CampaignFlowTabs } from '@/components/campaign-generator/campaign-flow-tabs'
import { CreativePreviewPanel } from '@/components/campaign-generator/creative-preview-panel'

const mockCampaignDays = [
  {
    day: 1,
    hook: 'Dreaming of island life? 🏝️',
    caption:
      'Your ticket to paradise just dropped. Limited-time Bali packages now available with 30% early bird discount.',
    cta: 'Book Your Escape →',
    hashtags: ['#BaliVacation', '#TravelDeal', '#IslandLife', '#EarlyBirdOffer'],
    suggestedTime: '9:00 AM',
    funnelStage: 'awareness',
    objective: 'Brand recall & destination interest',
    dayConfidence: 88,
    personaAlignment: 'Affluent travelers interested in island destinations (age 30-50, household income $100k+)',
    expectedEngagement: 6.2,
  },
  {
    day: 2,
    hook: 'See where others are going ✈️',
    caption:
      'Over 500+ travelers booked their Bali escape this week. Price going up tomorrow. Your perfect trip is waiting.',
    cta: 'Check Availability',
    hashtags: ['#TravelInspo', '#BaliPackage', '#VacationMode', '#LastMinute'],
    suggestedTime: '2:00 PM',
    funnelStage: 'interest',
    objective: 'Social proof & urgency',
    dayConfidence: 91,
    personaAlignment: 'Active travelers responding to FOMO signals and availability messaging',
    expectedEngagement: 7.8,
  },
  {
    day: 3,
    hook: 'Only 2 slots left at this price 🔥',
    caption:
      'The best deals go fast. This premium Bali package was $2,499—now $1,749 for 7 nights all-inclusive. Ends tonight.',
    cta: 'Secure Your Spot Now',
    hashtags: ['#FlashSale', '#TravelOffer', '#BaliGetaway', '#BookNow'],
    suggestedTime: '6:00 PM',
    funnelStage: 'consideration',
    objective: 'Price justification & scarcity',
    dayConfidence: 94,
    personaAlignment: 'Value-conscious decision makers needing final justification trigger',
    expectedEngagement: 12.1,
  },
  {
    day: 4,
    hook: 'Your friends are talking about this 💬',
    caption:
      'Why are travelers loving this Bali package? Luxury beachfront resort, daily activities, AND flights included. See what others are saying.',
    cta: 'Read Reviews & Book',
    hashtags: ['#TravelReviews', '#CustomerLove', '#BaliRecommended', '#TrustUs'],
    suggestedTime: '10:00 AM',
    funnelStage: 'consideration',
    objective: 'Trust building & objection handling',
    dayConfidence: 89,
    personaAlignment: 'Social validators seeking peer approval before commitment',
    expectedEngagement: 8.5,
  },
  {
    day: 5,
    hook: 'Still thinking about it? 🤔',
    caption:
      'Last chance for 30% off + free airport transfers. This deal expires in 48 hours. Make memories, not excuses.',
    cta: 'Don\'t Miss Out',
    hashtags: ['#DealEndssoon', '#LastChance', '#TravelDeals', '#SummerVacation'],
    suggestedTime: '1:00 PM',
    funnelStage: 'consideration',
    objective: 'Retargeting & doubt removal',
    dayConfidence: 87,
    personaAlignment: 'Fence-sitters responding to final scarcity messaging',
    expectedEngagement: 9.3,
  },
  {
    day: 6,
    hook: 'Your vacation starts here 🌴',
    caption:
      'From the moment you land to the moment you leave, we\'ve got you covered. Full itinerary, local guides, and 5-star experiences.',
    cta: 'Explore Full Itinerary',
    hashtags: ['#BaliExperience', '#LuxuryTravel', '#AllInclusive', '#VacationPlanning'],
    suggestedTime: '11:00 AM',
    funnelStage: 'action',
    objective: 'Experience detail & conversion',
    dayConfidence: 92,
    personaAlignment: 'Ready-to-convert users seeking detailed experience confirmation',
    expectedEngagement: 14.2,
  },
  {
    day: 7,
    hook: 'One last thing... 👋',
    caption:
      'Ready to trade your desk for the beach? This is your final reminder. Book now and receive $200 travel credit for your next trip.',
    cta: 'Book + Get Bonus Credit',
    hashtags: ['#FinalCall', '#TravelReward', '#BaliWaitsForYou', '#AdventureAwaits'],
    suggestedTime: '5:00 PM',
    funnelStage: 'action',
    objective: 'Final conversion push & retention',
    dayConfidence: 85,
    personaAlignment: 'Last-minute converters motivated by loyalty rewards and final incentive',
    expectedEngagement: 11.6,
  },
]

export default function CampaignGenerator() {
  return (
    <div>
      <Sidebar />
      <Header />

      <main className="pt-20 pl-56 transition-all duration-300">
        <div className="px-10 py-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h1 className="text-5xl font-bold text-foreground tracking-tight">Campaign Generator</h1>
              <p className="text-muted-foreground mt-2 text-base leading-relaxed">
                Create AI-powered 7-day campaigns optimized for conversion across all channels
              </p>
            </div>

            {/* Campaign Identity */}
            <div className="mb-0">
              <CampaignIdentityCard
                campaignName="Summer Bali Escape"
                personaSegment="Luxury Travelers"
                offerAngle="All-inclusive luxury packages with cultural immersion"
                urgencyWindow="48 hours - Limited inventory"
                confidenceScore={92}
              />
            </div>

            {/* Two Column Layout for Campaign Flow and Preview */}
            <div className="grid grid-cols-5 gap-8 items-start">
              {/* Left: Campaign Flow (3 columns) */}
              <div className="col-span-3 h-full">
                <CampaignFlowTabs campaignDays={mockCampaignDays} />
              </div>

              {/* Right: Creative Preview (2 columns) */}
              <div className="col-span-2 h-full">
                <CreativePreviewPanel
                  campaignName="Summer Bali Escape"
                  instagramPost="Pack your bags and let the adventure begin! 🏝️ Our new Bali packages include 7 nights at a luxury beachfront resort, daily activities, and flights. Limited time offer—book now for 30% off. Link in bio! #BaliVacation #TravelDeal #IslandLife #EarlyBirdOffer"
                  storyHeadline="Bali Escape 48-Hour Flash Sale"
                  whatsappMessage="🌴 Your Bali escape is ready! 7-night all-inclusive package now just $1,749 (was $2,499). Early bird discount expires tonight! Book: link"
                  emailSubject="Your Dream Bali Vacation Just Got Cheaper"
                  emailPreview="We've secured exclusive rates at our partner resorts. Your package includes 7 nights, daily activities, meals, and round-trip flights. This rate is only available until midnight tomorrow."
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
