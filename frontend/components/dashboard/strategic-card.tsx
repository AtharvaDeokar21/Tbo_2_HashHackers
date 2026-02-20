'use client'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts'
import { Info, AlertCircle } from 'lucide-react'

interface StrategicCardProps {
  destination: string
  tradeoffExplanation: string
  riskLevel: 'low' | 'medium' | 'high'
  confidence: number
  chartData: Array<{ month: string; value: number }>
  reasoning: string
  comparisonSummary?: string
  marginPotential?: number
  volatility?: number
  campaignTimingWindow?: string
  decisionReasoning?: string
  confidenceBasis?: string
}

const RISK_COLORS = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

export function StrategicCard({
  destination,
  tradeoffExplanation,
  riskLevel,
  confidence,
  chartData,
  reasoning,
  comparisonSummary,
  marginPotential = 28,
  volatility = 12,
  campaignTimingWindow = '3-5 weeks',
  decisionReasoning,
  confidenceBasis = 'Demand signals (booking surge, search trends) + inventory constraints + margin potential',
}: StrategicCardProps) {
  return (
    <Card className="p-8 bg-card border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="grid grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3">{destination}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{tradeoffExplanation}</p>
          </div>

          {/* Comparison Summary */}
          {comparisonSummary && (
            <div className="bg-secondary/50 border border-border rounded-lg p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Why this over others?</p>
              <p className="text-sm text-foreground leading-relaxed">{comparisonSummary}</p>
            </div>
          )}

          {/* Margin vs Volatility Mini Comparison */}
          <div className="grid grid-cols-2 gap-3 bg-secondary/30 rounded-lg p-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">Margin Potential</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">{marginPotential}%</span>
                <span className="text-xs text-green-600 dark:text-green-400">↑ High</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">Volatility Risk</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">{volatility}%</span>
              </div>
            </div>
          </div>

          {/* Campaign Timing Window */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-1 uppercase tracking-wide">Campaign Timing Window</p>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-200">{campaignTimingWindow}</p>
          </div>

          {/* Risk and Confidence */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary rounded-lg p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Risk Level</p>
              <Badge className={`${RISK_COLORS[riskLevel]} font-medium`}>
                {riskLevel === 'low' && '✓ Low Risk'}
                {riskLevel === 'medium' && '⚠ Medium Risk'}
                {riskLevel === 'high' && '⚠️ High Risk'}
              </Badge>
            </div>
            <div className="bg-secondary rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Confidence</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={14} className="text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p className="text-xs">{confidenceBasis}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="text-3xl font-bold text-primary">{confidence}%</div>
            </div>
          </div>

          {/* Decision Reasoning Accordion */}
          <Accordion type="single" collapsible className="border border-border rounded-lg overflow-hidden">
            <AccordionItem value="decision" className="border-0">
              <AccordionTrigger className="px-4 py-3 hover:no-underline text-sm font-semibold hover:bg-secondary">
                Decision Reasoning →
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed bg-secondary/30">
                {decisionReasoning || reasoning}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Right Column - Intelligence Visuals */}
        <div className="flex flex-col gap-6">
          {/* Confidence Trend Chart */}
          <div className="bg-secondary rounded-lg p-6">
            <div className="mb-4">
              <p className="text-sm font-semibold text-foreground">Confidence Trend</p>
              <p className="text-xs text-muted-foreground mt-1">Last 6 weeks performance</p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" style={{ fontSize: '12px', fill: 'var(--color-muted-foreground)' }} />
              <YAxis style={{ fontSize: '12px', fill: 'var(--color-muted-foreground)' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: `1px solid var(--color-border)`,
                  borderRadius: '6px',
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--color-primary)"
                strokeWidth={3}
                dot={{ fill: 'var(--color-primary)', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Margin vs Volatility Comparison */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-5">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-4">Upside vs Risk</p>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-blue-800 dark:text-blue-400">Margin Potential</span>
                  <span className="text-sm font-bold text-blue-900 dark:text-blue-300">{marginPotential}%</span>
                </div>
                <div className="h-2 bg-blue-200 dark:bg-blue-900/40 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600 dark:bg-green-400 rounded-full" style={{ width: `${marginPotential}%` }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-blue-800 dark:text-blue-400">Volatility Risk</span>
                  <span className="text-sm font-bold text-blue-900 dark:text-blue-300">{volatility}%</span>
                </div>
                <div className="h-2 bg-blue-200 dark:bg-blue-900/40 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-600 dark:bg-amber-400 rounded-full" style={{ width: `${volatility}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
