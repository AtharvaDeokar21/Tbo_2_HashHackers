import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Info } from 'lucide-react'

interface CampaignIdentityCardProps {
  campaignName: string
  personaSegment: string
  offerAngle: string
  urgencyWindow: string
  confidenceScore: number
}

export function CampaignIdentityCard({
  campaignName,
  personaSegment,
  offerAngle,
  urgencyWindow,
  confidenceScore,
}: CampaignIdentityCardProps) {
  const confidenceColor =
    confidenceScore >= 85
      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
      : confidenceScore >= 70
        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'

  const personaColors: Record<string, string> = {
    'Luxury Travelers': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    'Budget Conscious': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    'Adventure Seekers': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    'Families': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  }

  return (
    <Card className="h-full p-6 bg-card border-border shadow-sm hover:shadow-md transition-shadow mb-6">
      <div className="space-y-6">
        {/* Campaign Name */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">{campaignName}</h1>
        </div>

        <Separator className="bg-border" />

        {/* Identity Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Persona Segment */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Persona Segment
            </p>
            <Badge className={`${personaColors[personaSegment] || 'bg-secondary text-foreground'} font-medium`}>
              {personaSegment}
            </Badge>
          </div>

          {/* Confidence Score */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Confidence Score
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={14} className="text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">AI-generated confidence based on historical data</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Badge className={`${confidenceColor} font-bold`}>{confidenceScore}%</Badge>
          </div>
        </div>

        <Separator className="bg-border" />

        {/* Offer Angle & Urgency */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Offer Angle
            </p>
            <p className="text-sm text-foreground leading-relaxed">{offerAngle}</p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Urgency Window
            </p>
            <p className="text-sm text-foreground leading-relaxed">{urgencyWindow}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
