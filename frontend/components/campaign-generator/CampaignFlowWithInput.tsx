'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CampaignFlowTabs } from './campaign-flow-tabs'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

export default function CampaignFlowWithInput() {
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(false)

  // 7-day plan for CampaignFlowTabs
  const [campaignDays, setCampaignDays] = useState<any[]>([])

  // full metadata to display above tabs
  const [campaignBlueprint, setCampaignBlueprint] = useState<any>(null)

  const launchCampaign = async () => {
    const agent = localStorage.getItem("selectedAgent")
    if (!agent) {
      console.error("No agent selected in localStorage")
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
        console.error("Missing campaign_blueprint in response")
        setCampaignDays([])
        return
      }

      // ⭐ Store ALL metadata (to show in UI)
      setCampaignBlueprint({
        image_url: data?.image_url,
        campaign_identity: blueprint.campaign_identity,
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

    } catch (err) {
      console.error("Launch campaign error:", err)
    }

    setLoading(false)
  }

  return (
    <div className="space-y-6 p-6">

      {/* Input section */}
      <div className="flex gap-4">
        <Input
          placeholder="Enter City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <Button onClick={launchCampaign} disabled={loading}>
          {loading ? "Launching..." : "Launch Campaign"}
        </Button>
      </div>

      {/* ---- METADATA SECTION (NEW) ---- */}
      {campaignBlueprint && (
        <Card className="p-6 space-y-6 bg-card border-border shadow-sm">

          {/* IMAGE */}
          {campaignBlueprint.image_url && (
            <div className="w-full flex justify-center">
              <Image
                src={campaignBlueprint.image_url}
                alt="Campaign Image"
                width={600}
                height={400}
                className="rounded-lg shadow-md"
              />
            </div>
          )}

          {/* CAMPAIGN IDENTITY */}
          <div>
            <h2 className="text-2xl font-bold">
              {campaignBlueprint.campaign_identity?.name}
            </h2>
            <p className="text-muted-foreground">
              {campaignBlueprint.campaign_identity?.tagline}
            </p>
            <p className="text-sm mt-1">
              Objective: {campaignBlueprint.campaign_identity?.objective}
            </p>
          </div>

          <Separator />

          {/* AGENT NOTES */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Agent Notes</h3>
            <p className="text-sm leading-relaxed">{campaignBlueprint.agent_notes}</p>
          </div>

          <Separator />

          {/* CONTENT THEMES */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Content Themes</h3>
            <div className="flex flex-wrap gap-2">
              {campaignBlueprint.content_themes?.map((theme: any, idx: number) => (
                <Badge key={idx} className="bg-secondary text-secondary-foreground font-medium">
                  {theme}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* EMOTIONAL HOOK */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Emotional Hook</h3>
            <p className="text-sm">{campaignBlueprint.emotional_hook}</p>
          </div>

          <Separator />

          {/* VALUE PROPOSITION */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Value Proposition Stack</h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {campaignBlueprint.value_proposition_stack?.map((item: any, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

        </Card>
      )}

      {/* ---- 7-DAY PLAN SECTION ---- */}
      {campaignDays.length > 0 && (
        <Card className="p-6 mt-4">
          <CampaignFlowTabs campaignDays={campaignDays} />
        </Card>
      )}
    </div>
  )
}