'use client'

import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import TrendCard from '@/components/campaign-generator/TrendCard'
import CampaignFlowWithInput from '@/components/campaign-generator/CampaignFlowWithInput'
import { CreativePreviewPanel } from '@/components/campaign-generator/creative-preview-panel'
import { Zap, Lightbulb, ArrowRight, BarChart3 } from 'lucide-react'

export default function CampaignGenerator() {
  return (
    <div>
      <Sidebar />
      <Header />

      <main className="pt-20 pl-56 transition-all duration-300 bg-gradient-to-b from-background via-background to-muted/5 min-h-screen">
        {/* Top Hero Section */}
        <div className="px-10 py-6 border-b border-border/40 bg-gradient-to-r from-primary/5 via-primary/2.5 to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-primary/15 rounded-lg">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <h1 className="text-3xl font-bold text-foreground tracking-tight">Campaign Generator</h1>
                </div>
                <p className="text-muted-foreground flex items-center gap-2 ml-11">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
                  Create AI-powered campaigns optimized for maximum conversion
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-10 py-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Trend Analysis Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    Market Insights
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">Analyze destination trends and generate data-driven campaigns</p>
                </div>
              </div>
              <TrendCard />
            </section>

            {/* Campaign Creation Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Campaign Strategy
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">Build and execute your 7-day conversion funnel</p>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-6 items-start">
                {/* Campaign Builder - Left 65% */}
                <div className="col-span-8">
                  <CampaignFlowWithInput />
                </div>

                {/* Execution Panel - Right 35% */}
                <div className="col-span-4">
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
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
