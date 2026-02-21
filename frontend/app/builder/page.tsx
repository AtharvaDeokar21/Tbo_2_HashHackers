'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { ConfigPanel, PackageConfig } from '@/components/package-builder/config-panel'
import { ItineraryPreview } from '@/components/package-builder/itinerary-preview'

export default function PackageBuilder() {
  const [config, setConfig] = useState<PackageConfig>({
    destination: 'bali',
    checkIn: '2024-03-15',
    checkOut: '2024-03-22',
    includeFlight: true,
    hotel: 'upscale',
    activities: ['snorkel', 'cultural'],
    marginPercent: 25,
    includeRisk: false,
    dynamicRepricing: true,
  })

  return (
    <div>
      <Sidebar />
      <Header />

      <main className="pt-20 pl-56 transition-all duration-300">
        <div className="px-8 lg:px-10 py-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h1 className="text-5xl font-bold text-foreground tracking-tight">Smart Package Builder</h1>
              <p className="text-muted-foreground mt-2 text-base leading-relaxed">
                Configure and preview travel packages with real-time pricing and risk calculations
              </p>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-8">
              {/* Left: Configuration Panel */}
              <ConfigPanel onConfigChange={setConfig} />

              {/* Right: Itinerary Preview */}
              <ItineraryPreview config={config} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
