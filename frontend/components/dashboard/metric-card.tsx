import { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Progress } from '@/components/ui/progress'
import { Info } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string | number
  icon: ReactNode
  trend?: 'up' | 'down' | 'neutral'
  changePercent?: number
  confidence?: number
  confidenceTooltip?: string
}

export function MetricCard({ 
  label, 
  value, 
  icon, 
  trend = 'neutral', 
  changePercent,
  confidence,
  confidenceTooltip = 'Model confidence based on data quality and prediction certainty',
}: MetricCardProps) {
  return (
    <Card className="p-6 bg-card border-border shadow-sm hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">{label}</p>
          <div className="flex items-baseline gap-3">
            <h3 className="text-4xl font-bold text-foreground">{value}</h3>
            {changePercent !== undefined && (
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                  trend === 'up'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                    : trend === 'down'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                {trend === 'up' ? '↑ ' : trend === 'down' ? '↓ ' : ''}{changePercent}%
              </span>
            )}
          </div>
        </div>
        <div className="text-primary opacity-80 group-hover:opacity-100 transition-opacity">{icon}</div>
      </div>

      {/* Confidence Indicator */}
      {confidence !== undefined && (
        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Model Confidence</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={12} className="text-muted-foreground/50 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-xs">{confidenceTooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-xs font-semibold text-foreground">{confidence}%</span>
          </div>
          <Progress value={confidence} className="h-2" />
        </div>
      )}
    </Card>
  )
}
