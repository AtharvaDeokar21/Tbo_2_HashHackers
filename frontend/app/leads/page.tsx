'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { DashboardWrapper } from '@/components/layout/dashboard-wrapper'
import { LeadsTable, Lead } from '@/components/leads/leads-table'
import { LeadDetailSheet } from '@/components/leads/lead-detail-sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Download, Filter } from 'lucide-react'

const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    destination: 'Bali',
    intentScore: 92,
    stage: 'decision',
    lastActivity: '2 hours ago',
    suggestedAction: 'Send booking confirmation',
    packagesViewed: ['7-day Bali Paradise', '5-day Beach Escape', '10-day Cultural Tour'],
    scrollDepth: 94,
    timeSpent: 47,
    whatsappStatus: 'active',
    callBotSummary:
      'Spoke with bot about flight options. Asked about child seat availability. Interested in May departure dates.',
    riskProbability: 8,
    dropOffRisk: 'low',
    behaviorSummary: 'Viewed 3 times, 94% scroll depth',
    triggerReason: 'High engagement + recent activity → near-term booking probability',
    urgencyWindow: 'Next 48h',
  },
  {
    id: '2',
    name: 'Michael Chen',
    destination: 'Iceland',
    intentScore: 78,
    stage: 'consideration',
    lastActivity: '5 hours ago',
    suggestedAction: 'Share itinerary options',
    packagesViewed: ['Northern Lights Package', 'Reykjavik City Tour'],
    scrollDepth: 72,
    timeSpent: 28,
    whatsappStatus: 'active',
    callBotSummary: 'Inquired about group discounts. Mentioned traveling with 4 friends. Budget-conscious.',
    riskProbability: 35,
    dropOffRisk: 'medium',
    behaviorSummary: 'Viewed 2 times, 72% scroll depth',
    triggerReason: 'Group booking signal → personalize group rates',
    urgencyWindow: '3-7 days',
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    destination: 'Portugal',
    intentScore: 65,
    stage: 'consideration',
    lastActivity: '1 day ago',
    suggestedAction: 'Schedule consultation call',
    packagesViewed: ['Lisbon Explorer', 'Porto Wine Country'],
    scrollDepth: 58,
    timeSpent: 18,
    whatsappStatus: 'inactive',
    callBotSummary: 'No bot interaction yet. Initial web inquiry about Portugal packages.',
    riskProbability: 52,
    dropOffRisk: 'medium',
    behaviorSummary: 'Viewed 2 times, 58% scroll depth',
    triggerReason: 'Low engagement + inactive WhatsApp → reactivation campaign',
    urgencyWindow: '7-14 days',
  },
  {
    id: '4',
    name: 'James Wilson',
    destination: 'Japan',
    intentScore: 55,
    stage: 'awareness',
    lastActivity: '2 days ago',
    suggestedAction: 'Send travel guide',
    packagesViewed: ['Tokyo Highlights'],
    scrollDepth: 34,
    timeSpent: 8,
    whatsappStatus: 'unsubscribed',
    callBotSummary: 'Unsubscribed from communications after initial bot contact.',
    riskProbability: 78,
    dropOffRisk: 'high',
    behaviorSummary: 'Viewed 1 time, 34% scroll depth',
    triggerReason: 'Unsubscribed → requires explicit re-engagement consent',
    urgencyWindow: 'Beyond 14 days',
  },
  {
    id: '5',
    name: 'Olivia Martinez',
    destination: 'Bali',
    intentScore: 88,
    stage: 'decision',
    lastActivity: '30 minutes ago',
    suggestedAction: 'Process payment for booking',
    packagesViewed: ['7-day Bali Paradise', '14-day Extended Bali Adventure', 'Bali Spa Retreat'],
    scrollDepth: 89,
    timeSpent: 62,
    whatsappStatus: 'active',
    callBotSummary: 'Confirmed booking details. Needs travel insurance information. Processing final payment.',
    riskProbability: 12,
    dropOffRisk: 'low',
    behaviorSummary: 'Viewed 3 times, 89% scroll depth',
    triggerReason: 'Payment stage activation → insurance/add-ons optimization',
    urgencyWindow: 'Next 24h',
  },
  {
    id: '6',
    name: 'David Kim',
    destination: 'Iceland',
    intentScore: 42,
    stage: 'awareness',
    lastActivity: '3 days ago',
    suggestedAction: 'Nurture with email sequence',
    packagesViewed: ['Golden Circle Tour'],
    scrollDepth: 28,
    timeSpent: 5,
    whatsappStatus: 'inactive',
    callBotSummary: 'Minimal interaction. Browsed landing page only.',
    riskProbability: 68,
    dropOffRisk: 'high',
    behaviorSummary: 'Viewed 1 time, 28% scroll depth',
    triggerReason: 'Low engagement + inactivity → educational nurture series',
    urgencyWindow: 'Beyond 14 days',
  },
  {
    id: '7',
    name: 'Jessica Park',
    destination: 'Portugal',
    intentScore: 71,
    stage: 'consideration',
    lastActivity: '4 hours ago',
    suggestedAction: 'Compare package options',
    packagesViewed: ['Algarve Beach Resort', 'Porto & Douro Valley', 'Sintra Day Trip'],
    scrollDepth: 81,
    timeSpent: 35,
    whatsappStatus: 'active',
    callBotSummary: 'Comparing prices with competitors. Asked about payment plans and cancellation policy.',
    riskProbability: 41,
  },
  {
    id: '8',
    name: 'Robert Thompson',
    destination: 'Japan',
    intentScore: 84,
    stage: 'decision',
    lastActivity: '1 hour ago',
    suggestedAction: 'Confirm booking window',
    packagesViewed: ['Tokyo & Mount Fuji', '10-day Japan Circuit', 'Tokyo Luxury Stay'],
    scrollDepth: 91,
    timeSpent: 54,
    whatsappStatus: 'active',
    callBotSummary: 'Ready to book. Requested custom dates and hotel upgrades. High-value prospect.',
    riskProbability: 6,
  },
]

export default function LeadsPage() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead)
    setIsSheetOpen(true)
  }

  const filteredLeads = mockLeads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.destination.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <DashboardWrapper>
          {/* Page Header */}
          <div>
            <h1 className="text-5xl font-bold text-foreground tracking-tight">Leads Intelligence</h1>
            <p className="text-muted-foreground mt-2 text-base leading-relaxed">
              Real-time lead scoring, engagement tracking, and conversion optimization
            </p>
          </div>

          {/* Filters and Actions */}
          <div className="flex gap-3 flex-wrap items-center">
            <div className="flex-1 min-w-64 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search by name or destination..."
                className="pl-10 bg-secondary border-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" gap="2" className="gap-2">
              <Filter size={18} />
              Filter
            </Button>
            <Button variant="outline" gap="2" className="gap-2">
              <Download size={18} />
              Export
            </Button>
          </div>

          {/* Leads Table */}
          <section className="pt-0">
            <LeadsTable leads={filteredLeads} onSelectLead={handleSelectLead} />
          </section>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 text-sm">
            <div className="bg-secondary rounded-lg p-4">
              <p className="text-muted-foreground mb-1">Total Leads</p>
              <p className="text-2xl font-bold text-foreground">{mockLeads.length}</p>
            </div>
            <div className="bg-secondary rounded-lg p-4">
              <p className="text-muted-foreground mb-1">High Intent (75+)</p>
              <p className="text-2xl font-bold text-primary">
                {mockLeads.filter((l) => l.intentScore >= 75).length}
              </p>
            </div>
            <div className="bg-secondary rounded-lg p-4">
              <p className="text-muted-foreground mb-1">In Decision Stage</p>
              <p className="text-2xl font-bold text-green-600">
                {mockLeads.filter((l) => l.stage === 'decision').length}
              </p>
            </div>
            <div className="bg-secondary rounded-lg p-4">
              <p className="text-muted-foreground mb-1">High Risk</p>
              <p className="text-2xl font-bold text-red-600">
                {mockLeads.filter((l) => l.riskProbability > 60).length}
              </p>
            </div>
          </div>
        </DashboardWrapper>
      </div>

      {/* Lead Detail Sheet */}
      <LeadDetailSheet lead={selectedLead} isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
    </div>
  )
}
