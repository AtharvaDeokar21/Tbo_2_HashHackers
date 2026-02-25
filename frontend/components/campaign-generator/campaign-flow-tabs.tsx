import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Copy, Info, Check, Users, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'

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

const FUNNEL_STAGE_COLORS: Record<string, { label: string; emoji: string; bgColor: string; badgeColor: string }> = {
  awareness: { label: 'Awareness', emoji: '🎯', bgColor: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800', badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200' },
  interest: { label: 'Interest', emoji: '✨', bgColor: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800', badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-200' },
  consideration: { label: 'Consideration', emoji: '💭', bgColor: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800', badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-800 dark:text-amber-200' },
  action: { label: 'Action', emoji: '🚀', bgColor: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800', badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-200' },
}

export function CampaignFlowTabs({ campaignDays }: CampaignFlowTabsProps) {
  const [copiedDay, setCopiedDay] = useState<number | null>(null)

  const copyToClipboard = (text: string, day: number) => {
    navigator.clipboard.writeText(text)
    setCopiedDay(day)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopiedDay(null), 2000)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="day-1" className="w-full">
        {/* Enhanced Tab Navigation */}
        <TabsList className="bg-gradient-to-r from-muted/50 to-muted/20 p-4 rounded-xl border border-border/60 mb-6 overflow-x-auto flex gap-2 scrollbar-hide">
          {campaignDays.map((day) => {
            return (
              <TabsTrigger
                key={`day-${day.day}`}
                value={`day-${day.day}`}
                className="flex-shrink-0 px-4 py-2.5 rounded-lg border border-border/40 bg-background 
                   hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground 
                   data-[state=active]:border-primary transition-all font-semibold"
              >
                <div className="text-center">
                  <div className="text-sm font-bold">Day {day.day}</div>
                </div>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {/* Tab Contents */}
        {campaignDays.map((day) => {
          const stageInfo = FUNNEL_STAGE_COLORS[day.funnelStage || 'awareness']
          return (
            <TabsContent
              key={`content-${day.day}`}
              value={`day-${day.day}`}
              className="space-y-5 animate-in fade-in-50 duration-300"
            >
              {/* Day Header Card */}
              <Card className={`border-2 p-6 ${stageInfo.bgColor} shadow-sm hover:shadow-md transition-all`}>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl font-bold font-mono">Day {day.day}</span>
                      
                    </div>
                    {day.objective && (
                      <p className="text-sm font-medium text-foreground">{day.objective}</p>
                    )}
                  </div>
                  {/* {day.suggestedTime && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="bg-primary/15 rounded-lg px-4 py-2.5 text-center cursor-help">
                            <div className="text-xs font-bold text-primary mb-0.5">📅 POST TIME</div>
                            <div className="text-sm font-bold text-primary">{day.suggestedTime}</div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Optimal time for maximum engagement</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )} */}
                </div>

                {/* Metrics Row */}
                {/* <Separator className="my-4" /> */}
                <div className="grid grid-cols-2 gap-3">
                  {day.dayConfidence && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="cursor-help p-3 bg-white/60 dark:bg-black/20 rounded-lg border border-border/40 flex items-center justify-between hover:border-primary/40 transition-colors">
                            <span className="text-xs font-bold text-muted-foreground">CONFIDENCE</span>
                            <span className="text-lg font-bold font-mono text-primary">{day.dayConfidence}%</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-xs">
                          <p className="text-xs">{day.personaAlignment || 'Predicted performance based on audience data'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  {day.expectedEngagement && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="p-3 bg-white/60 dark:bg-black/20 rounded-lg border border-border/40 flex items-center justify-between hover:border-emerald-400/40 transition-colors">
                            <span className="text-xs font-bold text-muted-foreground">EST. CTR</span>
                            <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">{day.expectedEngagement}%</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p className="text-xs">Expected click-through rate</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </Card>

              {/* Content Sections */}
              <div className="space-y-4">
                {/* Hook Card */}
                <Card className="p-5 border border-border/60 bg-gradient-to-br from-card to-muted/5 hover:border-primary/40 hover:shadow-md transition-all group">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <span className="text-lg">🎣</span>
                        Hook
                      </h4>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(day.hook, day.day)}
                        className="h-8 w-8 p-0 opacity-50 group-hover:opacity-100 transition-opacity"
                      >
                        {copiedDay === day.day ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground font-semibold">{day.hook}</p>
                  </div>
                </Card>

                {/* Caption Card */}
                <Card className="p-5 border border-border/60 bg-gradient-to-br from-card to-muted/5 hover:border-primary/40 hover:shadow-md transition-all group">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <span className="text-lg">✍️</span>
                        Caption
                      </h4>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(day.caption, day.day)}
                        className="h-8 w-8 p-0 opacity-50 group-hover:opacity-100 transition-opacity"
                      >
                        {copiedDay === day.day ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground">{day.caption}</p>
                  </div>
                </Card>

                {/* CTA Card - Highlighted */}
                <Card className="p-5 border-2 border-primary/50 bg-gradient-to-br from-primary/8 via-primary/5 to-transparent shadow-sm hover:shadow-md transition-all group">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Call to Action
                      </h4>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(day.cta, day.day)}
                        className="h-8 w-8 p-0 opacity-50 group-hover:opacity-100 transition-opacity"
                      >
                        {copiedDay === day.day ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm font-bold text-primary">{day.cta}</p>
                  </div>
                </Card>

                {/* Engagement Forecast */}
                {day.expectedEngagement && (
                  <Card className="p-5 border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20 shadow-sm">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                          <span className="text-lg">📊</span>
                          Engagement Forecast
                        </h4>
                        <span className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400">{day.expectedEngagement}%</span>
                      </div>
                      <div className="w-full h-2 bg-emerald-200 dark:bg-emerald-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
                          style={{ width: `${day.expectedEngagement}%` }}
                        />
                      </div>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Expected click-through rate based on targeting and content quality</p>
                    </div>
                  </Card>
                )}
              </div>

              <Separator />

              {/* Persona Alignment */}
              {day.personaAlignment && (
                <Card className="p-4 bg-muted/40 border border-border/60 hover:border-primary/40 transition-colors">
                  <div className="flex gap-3">
                    <Users className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">🎯 Target Persona</p>
                      <p className="text-sm text-foreground leading-relaxed">{day.personaAlignment}</p>
                    </div>
                  </div>
                </Card>
              )}
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
