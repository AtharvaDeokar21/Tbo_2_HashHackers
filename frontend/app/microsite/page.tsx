'use client'

import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { DashboardWrapper } from '@/components/layout/dashboard-wrapper'
import { Card } from '@/components/ui/card'
import { Globe } from 'lucide-react'

export default function Microsite() {
  return (
    <div>
      <Sidebar />
      <Header />

      <DashboardWrapper>
        {/* Page Header */}
        <div>
          <h1 className="text-5xl font-bold text-foreground tracking-tight">Microsite</h1>
          <p className="text-muted-foreground mt-2 text-base leading-relaxed">
            Generate and manage campaign microsites for maximum conversion
          </p>
        </div>

        {/* Coming Soon */}
        <Card className="flex flex-col items-center justify-center py-16 bg-secondary border-border">
          <Globe size={48} className="text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Microsite Builder Coming Soon</h3>
          <p className="text-muted-foreground text-center max-w-md">
            AI-powered microsite generation with campaign-specific landing pages and conversion optimization.
          </p>
        </Card>
      </DashboardWrapper>
    </div>
  )
}
