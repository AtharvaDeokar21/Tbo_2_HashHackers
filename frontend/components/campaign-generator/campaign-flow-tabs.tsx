import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Edit2, Copy, Info } from 'lucide-react'

interface DayContent {
  day: number
  hook: string
  caption: string
  cta: string
  hashtags: string[]
  suggestedTime: string
  funnelStage?: 'awareness' | 'interest' | 'consideration' | 'action'
  objective?: string
  dayConfidence?: number
  personaAlignment?: string
  expectedEngagement?: number
}

interface CampaignFlowTabsProps {
  campaignDays: DayContent[]
}

const FUNNEL_STAGE_COLORS: Record<string, string> = {
  awareness: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  interest: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  consideration: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  action: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
}

const FUNNEL_STAGE_LABELS: Record<string, string> = {
  awareness: 'Awareness',
  interest: 'Interest',
  consideration: 'Consideration',
  action: 'Action',
}

export function CampaignFlowTabs({ campaignDays }: CampaignFlowTabsProps) {
  return (
    <Card className="h-full p-6 bg-card border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">7-Day Campaign Flow</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Structured acquisition sequence across awareness → interest → consideration → action stages.
          </p>
        </div>

        <Tabs defaultValue="day-1" className="w-full">
          <TabsList className="grid w-full grid-cols-7 gap-1 bg-secondary">
            {campaignDays.map((day) => (
              <TabsTrigger
                key={`day-${day.day}`}
                value={`day-${day.day}`}
                className="text-xs sm:text-sm font-medium"
              >
                Day {day.day}
              </TabsTrigger>
            ))}
          </TabsList>

          {campaignDays.map((day) => (
            <TabsContent key={`content-${day.day}`} value={`day-${day.day}`} className="pt-6 space-y-6">
              {/* Day Header with Intelligence */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Day {day.day} Content</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    {day.funnelStage && (
                      <Badge className={`${FUNNEL_STAGE_COLORS[day.funnelStage]} font-medium`}>
                        {FUNNEL_STAGE_LABELS[day.funnelStage]}
                      </Badge>
                    )}
                    {day.objective && (
                      <span className="text-xs font-medium text-muted-foreground bg-secondary px-3 py-1 rounded">
                        {day.objective}
                      </span>
                    )}
                    {day.dayConfidence && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1 text-xs font-medium bg-green-100/50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-3 py-1 rounded cursor-help">
                              {day.dayConfidence}% confidence
                              <Info size={12} />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <p className="text-xs">
                              {day.personaAlignment || 'High engagement expected based on audience targeting.'}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary text-primary-foreground font-medium">{day.suggestedTime}</Badge>
                </div>
              </div>

              <Separator className="bg-border" />

              {/* Content Sections */}
              <div className="space-y-6">
                {/* Hook */}
                <div className="bg-secondary rounded-lg p-4 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Hook</p>
                  <p className="text-sm text-foreground leading-relaxed">{day.hook}</p>
                </div>

                {/* Caption */}
                <div className="bg-secondary rounded-lg p-4 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Caption</p>
                  <p className="text-sm text-foreground leading-relaxed">{day.caption}</p>
                </div>

                {/* CTA */}
                <div className="bg-secondary rounded-lg p-4 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Call to Action
                  </p>
                  <p className="text-sm font-medium text-primary">{day.cta}</p>
                </div>

                {/* Hashtags */}
                <div className="bg-secondary rounded-lg p-4 space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Hashtags</p>
                  <div className="flex flex-wrap gap-2">
                    {day.hashtags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="font-mono text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Separator className="bg-border" />

              {/* Expected Engagement */}
              {day.expectedEngagement && (
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-900 dark:text-blue-300 uppercase tracking-wide">Expected Engagement</span>
                    <span className="text-sm font-bold text-blue-900 dark:text-blue-300">{day.expectedEngagement}% CTR</span>
                  </div>
                  <div className="mt-2 h-2 bg-blue-200 dark:bg-blue-900/40 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 dark:bg-blue-400 rounded-full" style={{ width: `${day.expectedEngagement}%` }} />
                  </div>
                </div>
              )}

              <Separator className="bg-border" />

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button className="gap-2 font-semibold shadow-sm hover:shadow-md transition-shadow">
                  <Edit2 size={16} />
                  Edit Content
                </Button>
                <Button variant="secondary" className="gap-2 font-semibold shadow-sm hover:shadow-md transition-shadow">
                  <Copy size={16} />
                  Copy All
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Card>
  )
}
