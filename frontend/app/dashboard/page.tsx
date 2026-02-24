'use client'

import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { DashboardWrapper } from '@/components/layout/dashboard-wrapper'
import { MetricCard } from '@/components/dashboard/metric-card'
import { OpportunityCard } from '@/components/dashboard/opportunity-card'
import { StrategicCard } from '@/components/dashboard/strategic-card'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { TrendingUp, Users, Percent, DollarSign } from 'lucide-react'

const mockChartData = [
  { month: 'Jan', value: 65 },
  { month: 'Feb', value: 72 },
  { month: 'Mar', value: 78 },
  { month: 'Apr', value: 85 },
  { month: 'May', value: 88 },
  { month: 'Jun', value: 92 },
]

export default function Dashboard() {
  return (
    <div>
      <Sidebar />
      <Header />

      <DashboardWrapper>
        {/* Welcome Section */}
        <div>
          <h1 className="text-5xl font-bold text-foreground tracking-tight">TBOAnalytica Dashboard</h1>
          <p className="text-muted-foreground mt-2 text-base leading-relaxed">
            Discover emerging travel trends and growth opportunities in real-time
          </p>
        </div>

        {/* Top 3 Opportunities */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-6">Top Opportunities</h2>
          <div className="grid grid-cols-3 gap-6">
            <OpportunityCard
              destination="Bali, Indonesia"
              imageUrl="https://imgs.search.brave.com/K_Lva_qENAVM9rbvRlNTBFh1qd9KXs5Y42DWqFmEMGE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dHJhdmVsYW5kbGVp/c3VyZS5jb20vdGht/Yi9KYWpodU5wZHRJ/ZURjc01ZTGxuRmpT/MWVsUjA9LzE1MDB4/MC9maWx0ZXJzOm5v/X3Vwc2NhbGUoKTpt/YXhfYnl0ZXMoMTUw/MDAwKTpzdHJpcF9p/Y2MoKS9UQUwtYmFs/aS1pbmRvbmVzaWEt/Y29hc3QtdWx1d2F0/dS10ZW1wbGUtQkFM/SVRPUElTTEFORDA1/MjUtYTVlODMzODU3/ZGQxNDA0YzlkNzE2/NjdmZDUwODgzY2Qu/anBn"
              trend="rising"
              confidence={89}
              reasoning="Strong domestic travel recovery with 34% increase in bookings over last month"
              marginPotential={28}
              volatility={12}
              bookingSurge={34}
              searchSpike={28}
              priceMovement={12}
              inventoryStatus="tightening"
              marginWindow="optimal"
            />
            <OpportunityCard
              destination="Iceland"
              imageUrl="https://imgs.search.brave.com/dr2T4oMYgMl8YTqfXcgE7exeLYtwhZwuPKmgK5wldqc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aW50cmVwaWR0cmF2/ZWwuY29tL2FkdmVu/dHVyZXMvd3AtY29u/dGVudC91cGxvYWRz/LzIwMTgvMTIvSW50/cmVwaWQtVHJhdmVs/LUljZWxhbmRfSm9r/dWxhcnNvbi1HbGFj/aWVyX0dsYWNpZXIt/SGlrZS1XYXRlcmZh/bGxfUnlhbi1Cb2x0/b243NDcxLmpwZw"
              trend="peaking"
              confidence={76}
              reasoning="Peak summer season approaching with limited availability and premium pricing potential"
              marginPotential={18}
              volatility={22}
              bookingSurge={18}
              searchSpike={42}
              priceMovement={16}
              inventoryStatus="tightening"
              marginWindow="closing"
            />
            <OpportunityCard
              destination="Portugal"
              imageUrl="https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=500&h=300&fit=crop"
              trend="stable"
              confidence={81}
              reasoning="Consistent mid-tier demand with excellent value proposition for budget-conscious travelers"
              marginPotential={24}
              volatility={8}
              bookingSurge={12}
              searchSpike={15}
              priceMovement={-5}
              inventoryStatus="stable"
              marginWindow="optimal"
            />
          </div>
        </section>

        {/* Strategic Recommendation */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-6">Strategic Recommendation</h2>
          <StrategicCard
            destination="Japan - Spring Festival Package"
            tradeoffExplanation="High-growth emerging market with premium positioning. Moderate booking window requires immediate action but provides 8-12 week lead time for package development."
            riskLevel="low"
            confidence={92}
            chartData={mockChartData}
            reasoning="Japan represents the highest confidence opportunity in our dataset with strong fundamentals: (1) 47% YoY growth in searches; (2) Premium pricing potential with 32-38% margins; (3) Proven market demand with repeat travel patterns; (4) Limited competitive pressure in the luxury segment. Recommend immediate campaign launch targeting affluent travelers with Japan travel experience. Expected ROI: 280% with 12-week campaign window."
            comparisonSummary="Japan outperforms Bali on margin potential (32% vs 28%), volatility predictability (8% vs 12%), and luxury market positioning. Iceland shows higher booking urgency but faces inventory constraints and higher acquisition costs. Japan balances growth trajectory with margin sustainability."
            marginPotential={32}
            volatility={8}
            campaignTimingWindow="3-5 weeks (optimal window before inventory tightens)"
            decisionReasoning="Search trend acceleration (47% YoY) + inventory availability (ample stock) + margin potential (32-38% range) + seasonal alignment (spring travel peak) = high-confidence execution window. Current search-to-booking conversion: 12.4% (above market average of 8.2%). Competitive positioning: minimal luxury-focused competitors in travel agent space."
            confidenceBasis="Composite score: Demand signals (47% search growth, +28% booking trend) + Inventory constraints (stable, 4+ week window) + Margin dynamics (32% potential, 8% volatility) + Historical conversion (12.4% baseline)"
          />
        </section>
      </DashboardWrapper>
    </div>
  )
}
