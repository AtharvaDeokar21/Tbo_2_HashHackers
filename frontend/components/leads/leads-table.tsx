'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ChevronRight, Zap, Users, MapPin, AlertCircle, TrendingDown } from 'lucide-react'

export interface Lead {
  id: string
  name: string
  destination: string
  intentScore: number
  stage: 'awareness' | 'consideration' | 'decision'
  lastActivity: string
  suggestedAction: string
  packagesViewed: string[]
  scrollDepth: number
  timeSpent: number
  whatsappStatus: 'active' | 'inactive' | 'unsubscribed'
  callBotSummary: string
  riskProbability: number
  dropOffRisk?: 'low' | 'medium' | 'high'
  behaviorSummary?: string
  triggerReason?: string
  urgencyWindow?: string
}

const STAGE_COLORS: Record<string, string> = {
  awareness: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  consideration: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  decision: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
}

const STAGE_LABELS: Record<string, string> = {
  awareness: 'Awareness',
  consideration: 'Consideration',
  decision: 'Decision',
}

const RISK_COLORS: Record<string, string> = {
  low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

interface LeadsTableProps {
  leads: Lead[]
  onSelectLead: (lead: Lead) => void
}

export function LeadsTable({ leads, onSelectLead }: LeadsTableProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <Card className="border-border shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="px-6 py-3.5 text-left font-semibold text-foreground text-xs uppercase tracking-wide">Name</th>
              <th className="px-6 py-3.5 text-left font-semibold text-foreground text-xs uppercase tracking-wide">Destination</th>
              <th className="px-6 py-3.5 text-left font-semibold text-foreground text-xs uppercase tracking-wide">Intent Score</th>
              <th className="px-6 py-3.5 text-left font-semibold text-foreground text-xs uppercase tracking-wide">Stage</th>
              <th className="px-6 py-3.5 text-left font-semibold text-foreground text-xs uppercase tracking-wide">Last Activity</th>
              <th className="px-6 py-3.5 text-left font-semibold text-foreground text-xs uppercase tracking-wide">Suggested Action</th>
              <th className="w-12" />
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead.id}
                onMouseEnter={() => setHoveredId(lead.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="border-b border-border hover:bg-secondary/20 transition-colors cursor-pointer"
                onClick={() => onSelectLead(lead)}
              >
                <td className="px-6 py-5">
                  <div className="font-medium text-foreground">{lead.name}</div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin size={16} className="flex-shrink-0" />
                    {lead.destination}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{lead.intentScore}%</span>
                      {lead.intentScore >= 75 && <Zap size={14} className="text-primary" />}
                    </div>
                    <Progress value={lead.intentScore} className="h-1.5 w-24" />
                  </div>
                </td>
                <td className="px-6 py-5">
                  <Badge className={STAGE_COLORS[lead.stage]}>
                    {STAGE_LABELS[lead.stage]}
                  </Badge>
                </td>
                <td className="px-6 py-5">
                  <span className="text-muted-foreground">{lead.lastActivity}</span>
                </td>
                <td className="px-6 py-5">
                  <div className="space-y-2">
                    <span className="text-muted-foreground text-xs block">{lead.suggestedAction}</span>
                    {lead.triggerReason && (
                      <p className="text-xs text-blue-600 dark:text-blue-400">{lead.triggerReason}</p>
                    )}
                    {lead.behaviorSummary && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p className="text-xs text-muted-foreground cursor-help hover:underline">
                              {lead.behaviorSummary}
                            </p>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="text-xs max-w-xs">
                              Scroll depth: {lead.scrollDepth}% | Time spent: {lead.timeSpent}m | Pages: {lead.packagesViewed.length}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3 justify-end">
                    {lead.urgencyWindow && (
                      <Badge variant="outline" className="text-xs whitespace-nowrap">
                        {lead.urgencyWindow}
                      </Badge>
                    )}
                    {lead.dropOffRisk && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className={`flex items-center gap-1 px-2 py-1 rounded ${RISK_COLORS[lead.dropOffRisk]}`}>
                              <TrendingDown size={14} />
                              <span className="text-xs font-medium">{lead.dropOffRisk}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            <p className="text-xs">Drop-off risk based on engagement decline and inactivity patterns</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    <ChevronRight
                      size={20}
                      className={`text-muted-foreground transition-all ${
                        hoveredId === lead.id ? 'translate-x-1' : ''
                      }`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
