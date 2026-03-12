'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CampaignFlowTabs } from './campaign-flow-tabs'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Loader, MapPin, Lightbulb, Users, Target, Star, Rocket, AlertCircle, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function CampaignFlowWithInput() {
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(false)

  // 7-day plan for CampaignFlowTabs
  const [campaignDays, setCampaignDays] = useState<any[]>([])

  // full metadata to display above tabs
  const [campaignBlueprint, setCampaignBlueprint] = useState<any>(null)

  const [showFullCampaign, setShowFullCampaign] = useState(false)

  const launchCampaign = async () => {
    const agent = localStorage.getItem("selectedAgent")
    if (!agent) {
      toast.error("No agent selected. Please select an agent first.")
      return
    }

    if (!city.trim()) {
      toast.error("Please enter a destination city")
      return
    }

    const agent_id = agent
    setLoading(true)

    try {
      const res = await fetch("http://localhost:5001/api/campaign/launch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent_id,
          destination: city
        })
      })

      const data = await res.json()
      console.log("BACKEND RESPONSE:", data)

      const blueprint = data?.campaign_blueprint
      if (!blueprint) {
        toast.error("Failed to generate campaign. Please try again.")
        console.error("Missing campaign_blueprint in response")
        setCampaignDays([])
        return
      }

      // ⭐ Store ALL metadata (to show in UI)
      setCampaignBlueprint({
        image_url: data?.image_url,
        campaign_identity: blueprint.campaign_identity,
        simple_agent_playbook: blueprint.simple_agent_playbook,
        agent_notes: blueprint.agent_notes,
        content_themes: blueprint.content_themes,
        conversion_triggers: blueprint.conversion_triggers,
        customer_psychology_insight: blueprint.customer_psychology_insight,
        emotional_hook: blueprint.emotional_hook,
        offer_structure: blueprint.offer_structure,
        positioning_angle: blueprint.positioning_angle,
        recommended_channels: blueprint.recommended_channels,
        retargeting_strategy: blueprint.retargeting_strategy,
        tone_guidelines: blueprint.tone_guidelines,
        urgency_message: blueprint.urgency_message,
        value_proposition_stack: blueprint.value_proposition_stack
      })

      // ⭐ Transform 7-day plan for CampaignFlowTabs
      const plan = blueprint["7_day_plan"] || []

      const transformed = plan.map((item: any) => ({
        day: item.day,
        hook: item.format || "—",
        caption: item.caption,
        cta: item.cta,
        hashtags: [],
        suggestedTime: "Best Time"
      }))

      setCampaignDays(transformed)
      toast.success("Campaign generated successfully!")

    } catch (err) {
      console.error("Launch campaign error:", err)
      toast.error("Error launching campaign. Please try again.")
    }

    setLoading(false)
    localStorage.setItem("city", city)
  }

  return (
    <div className="space-y-6">
      {/* Input Section - Modern Enhanced */}
      <Card className="overflow-hidden border border-border/60 bg-gradient-to-br from-card via-card to-muted/5 shadow-sm">
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Destination City
            </label>
            <div className="flex gap-3">
              <Input
                placeholder="Enter destination (e.g., Bali, Paris, Tokyo)..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && launchCampaign()}
                className="flex-1 py-2.5 px-4 text-sm font-medium"
              />
              <Button
                onClick={launchCampaign}
                disabled={loading || !city.trim()}
                className="gap-2 px-8 py-2.5 font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 disabled:opacity-50 transition-all flex items-center"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4" />
                    <span>Launch Campaign</span>
                  </>
                )}
              </Button>
            </div>
            {/* {!localStorage.getItem("selectedAgent") && (
              <div className="flex items-start gap-3 mt-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">Select an agent from the dashboard to create campaigns</p>
              </div>
            )} */}
          </div>
        </div>
      </Card>

      {/* ---- METADATA SECTION (MODERN DESIGN) ---- */}
      {campaignBlueprint && (
        <Card className="overflow-hidden border border-border/60 bg-card shadow-sm">
          {/* Header Image Section */}
          {campaignBlueprint.image_url && (
            <div className="relative w-full bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
              <Image
                src={campaignBlueprint.image_url}
                alt="Campaign Image"
                width={1200}
                height={800}
                className="w-full h-auto hover:scale-105 transition-transform duration-300"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            </div>
          )}

          {/* Campaign Details */}
          <div className="p-6 space-y-6">
            {/* Campaign Identity Section */}
            <div className="space-y-3">

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  {campaignBlueprint.campaign_identity}
                </h2>

              </div>


              <p className="text-sm text-muted-foreground leading-relaxed">
                {campaignBlueprint.campaign_identity?.objective}
              </p>
            </div>

            <Separator />

            {campaignBlueprint.simple_agent_playbook && (
              <div className="space-y-4">

                <Separator />

                <div>
                  <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                    <Rocket className="w-4 h-4 text-primary" />
                    Campaign Playbook
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {campaignBlueprint.simple_agent_playbook.campaign_summary}
                  </p>
                </div>

                {/* Who to Target */}
                <div className="p-3 rounded-lg bg-muted/40 border border-border/40">
                  <h4 className="text-xs font-bold uppercase text-primary mb-1">
                    Target Audience
                  </h4>
                  <p className="text-sm text-foreground">
                    {campaignBlueprint.simple_agent_playbook.who_to_target}
                  </p>
                </div>

                {/* Daily Actions */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Daily Actions</h4>
                  <ul className="space-y-1">
                    {campaignBlueprint.simple_agent_playbook.daily_actions?.map((action: any, i: number) => (
                      <li key={i} className="text-sm text-muted-foreground">
                        • {action}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pitch */}
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <h4 className="text-sm font-semibold mb-1">How to Pitch</h4>
                  <p className="text-sm text-muted-foreground">
                    {campaignBlueprint.simple_agent_playbook.how_to_pitch}
                  </p>
                </div>

                {/* Quick Tips */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Sales Tips</h4>
                  <ul className="space-y-1">
                    {campaignBlueprint.simple_agent_playbook.quick_sales_tips?.map((tip: any, i: number) => (
                      <li key={i} className="text-sm text-muted-foreground">
                        ✓ {tip}
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            )}

            {!showFullCampaign && (
              <div className="pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFullCampaign(true)}
                  className="w-full"
                >
                  View Full Campaign Strategy
                </Button>
              </div>
            )}

            {showFullCampaign && (
              <>
                {/* Key Insights Grid - Enhanced */}
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-primary" />
                    Campaign Insights
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Emotional Hook */}
                    <div className="p-4 rounded-xl border border-border/60 bg-gradient-to-br from-primary/5 to-muted/5 hover:border-primary/40 transition-all">
                      <div className="flex items-start gap-3">
                        <span className="text-xl">💭</span>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-sm text-foreground mb-1">Emotional Hook</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                            {campaignBlueprint.emotional_hook}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Positioning Angle */}
                    <div className="p-4 rounded-xl border border-border/60 bg-gradient-to-br from-primary/5 to-muted/5 hover:border-primary/40 transition-all">
                      <div className="flex items-start gap-3">
                        <span className="text-xl">🎯</span>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-sm text-foreground mb-1">Positioning</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                            {campaignBlueprint.positioning_angle}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Themes */}
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary" />
                    Content Themes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {campaignBlueprint.content_themes?.map((theme: any, idx: number) => (
                      <Badge key={idx} variant="secondary" className="font-medium border border-border/60 bg-muted/50 hover:bg-muted transition-colors">
                        {theme}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Agent Strategy Notes - Highlighted */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-primary/8 via-primary/4 to-transparent border border-primary/20">
                  <h4 className="font-bold text-sm text-foreground mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-primary" />
                    AI Strategy Notes
                  </h4>
                  <p className="text-sm text-foreground leading-relaxed">{campaignBlueprint.agent_notes}</p>
                </div>

                {/* Value Propositions */}
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Value Propositions
                  </h3>
                  <div className="space-y-2">
                    {campaignBlueprint.value_proposition_stack?.map((item: any, i: number) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border/40 hover:border-primary/30 transition-colors">
                        <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-primary/20 text-primary text-xs font-bold rounded-md">
                          {i + 1}
                        </span>
                        <p className="text-sm text-foreground leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Metadata */}
                {campaignBlueprint.offer_structure && (
                  <>
                    <Separator />

                    <div>
                      <h4 className="font-bold text-sm text-foreground mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        Offer Structure
                      </h4>

                      <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-muted/5 border border-border/50 space-y-2">
                        {Object.entries(campaignBlueprint.offer_structure).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex items-start gap-2"
                          >
                            <span className="text-xs font-bold uppercase text-primary tracking-wide min-w-[120px]">
                              {key.replace(/_/g, " ")}
                            </span>
                            <p className="text-sm text-foreground leading-relaxed">
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {campaignBlueprint.urgency_message && (
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                    <h4 className="font-bold text-sm text-amber-900 dark:text-amber-400 mb-2">⏰ Urgency Message</h4>
                    <p className="text-sm text-amber-800 dark:text-amber-300 italic font-medium">
                      "{campaignBlueprint.urgency_message}"
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>
      )}

      {/* ---- 7-DAY PLAN SECTION ---- */}
      {campaignDays.length > 0 && showFullCampaign && (
        <>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Rocket className="w-5 h-5 text-primary" />
              7-Day Campaign Timeline
            </h2>
            <p className="text-sm text-muted-foreground">Optimized content sequence designed to maximize engagement and conversions</p>
          </div>
          <Card className="p-6 border border-border/60 bg-gradient-to-br from-card to-muted/5 shadow-sm">
            <CampaignFlowTabs campaignDays={campaignDays} />
          </Card>
        </>
      )}
      {showFullCampaign && (
        <div className="pt-4">
          <Button
            variant="outline"
            onClick={() => setShowFullCampaign(false)}
            className="w-full"
          >
            View Less
          </Button>
        </div>
      )}


    </div>
  )
}