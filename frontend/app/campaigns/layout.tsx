"use client"

import { CityProvider } from "@/components/campaign-generator/cityContext"

export default function CampaignLayout({ children }: { children: React.ReactNode }) {
  return (
    <CityProvider>
      {children}
    </CityProvider>
  )
}