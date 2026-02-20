'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Info, TrendingUp, Zap, Calendar } from 'lucide-react'

interface WhyPackageSectionProps {
  seasonalAlignment: string
  pricingWindow: string
  marginSustainability: string
  confidence: number
  riskLevel: 'low' | 'medium' | 'high'
  campaignWindow: string
}

const RISK_COLORS = {
  low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

export function WhyPackageSection({
  seasonalAlignment,
  pricingWindow,
  marginSustainability,
  confidence,
  riskLevel,
  campaignWindow,
}: WhyPackageSectionProps) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-foreground mb-6">Why This Package</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Seasonal Alignment */}
        <Card className="p-6 bg-card border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <Calendar size={20} className="text-primary" />
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs">
              High
            </Badge>
          </div>
          <h3 className="font-semibold text-foreground mb-2">Seasonal Alignment</h3>
          <p className="text-sm text-muted-foreground">{seasonalAlignment}</p>
        </Card>

        {/* Pricing Window */}
        <Card className="p-6 bg-card border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <TrendingUp size={20} className="text-primary" />
            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs">
              Stable
            </Badge>
          </div>
          <h3 className="font-semibold text-foreground mb-2">Pricing Stability</h3>
          <p className="text-sm text-muted-foreground">{pricingWindow}</p>
        </Card>

        {/* Margin Sustainability */}
        <Card className="p-6 bg-card border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <Zap size={20} className="text-primary" />
            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-xs">
              Strong
            </Badge>
          </div>
          <h3 className="font-semibold text-foreground mb-2">Margin Potential</h3>
          <p className="text-sm text-muted-foreground">{marginSustainability}</p>
        </Card>
      </div>

      {/* Intelligence Section */}
      <Card className="p-6 bg-secondary/50 border-border shadow-sm">
        <h3 className="font-semibold text-foreground mb-4">Intelligence & Risk</h3>

        <div className="space-y-4">
          {/* Confidence */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-muted-foreground">Model Confidence</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={14} className="text-muted-foreground/50 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-xs">
                      Confidence based on demand trends, pricing stability, seasonal patterns, and historical conversion data
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${confidence}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-foreground w-12">{confidence}%</span>
            </div>
          </div>

          {/* Risk Level and Campaign Window */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Risk Level</p>
              <Badge className={RISK_COLORS[riskLevel]}>
                {riskLevel === 'low' && '✓ Low Risk'}
                {riskLevel === 'medium' && '⚠ Medium Risk'}
                {riskLevel === 'high' && '⚠️ High Risk'}
              </Badge>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Campaign Window</p>
              <Badge variant="outline" className="text-xs">{campaignWindow}</Badge>
            </div>
          </div>
        </div>
      </Card>
    </section>
  )
}
