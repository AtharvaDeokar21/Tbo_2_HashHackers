'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, MessageCircle, TrendingDown } from 'lucide-react'

interface UrgencyCtaSectionProps {
  slotsRemaining: number
  volatilityRisk: 'low' | 'medium' | 'high'
}

const VOLATILITY_COLORS = {
  low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

export function UrgencyCtaSection({ slotsRemaining, volatilityRisk }: UrgencyCtaSectionProps) {
  return (
    <section className="mb-12">
      <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/2 border-border shadow-md">
        <div className="space-y-6">
          {/* Alert Section */}
          <div className="space-y-4">
            <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
              <AlertCircle size={16} className="text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-800 dark:text-amber-300">
                Only {slotsRemaining} slots remaining at current pricing. Inventory tightening – secure your spot within 5 days.
              </AlertDescription>
            </Alert>

            {/* Risk Indicator */}
            <div className="flex items-center gap-3 bg-white/50 dark:bg-white/5 rounded-lg p-4">
              <TrendingDown size={18} className="text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-1">Volatility Risk Increasing</p>
                <p className="text-xs text-muted-foreground">
                  Prices may increase as inventory decreases. Lock in your price today.
                </p>
              </div>
              <Badge className={VOLATILITY_COLORS[volatilityRisk]}>
                {volatilityRisk === 'low' && 'Low'}
                {volatilityRisk === 'medium' && 'Medium'}
                {volatilityRisk === 'high' && 'High'}
              </Badge>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button className="flex-1 h-12 font-semibold text-base shadow-md hover:shadow-lg transition-shadow">
              Secure Consultation
            </Button>
            <Button variant="secondary" className="flex-1 h-12 font-semibold text-base shadow-sm hover:shadow-md transition-shadow gap-2">
              <MessageCircle size={18} />
              Talk on WhatsApp
            </Button>
          </div>

          {/* Trust Line */}
          <p className="text-center text-xs text-muted-foreground pt-2">
            No commitments required. One-on-one consultation with your travel expert.
          </p>
        </div>
      </Card>
    </section>
  )
}
