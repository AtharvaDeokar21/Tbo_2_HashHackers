import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Instagram, MessageCircle, Mail, Heart, MessageCircle as Comment, Share2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from "sonner"
import Image from 'next/image'
import { set } from 'date-fns'
import { se } from 'date-fns/locale'

interface CreativePreviewPanelProps {
  campaignName: string
  instagramPost: string
  storyHeadline: string
  whatsappMessage: string
  emailSubject: string
  emailPreview: string
}

export function CreativePreviewPanel({
  campaignName,
  instagramPost,
  storyHeadline,
  whatsappMessage,
  emailSubject,
  emailPreview,
}: CreativePreviewPanelProps) {
  const [whatsappResult, setWhatsappResult] = useState<any>(null)
  const [sending, setSending] = useState(false)
  const handleSendWhatsApp = async () => {
    try {
      setSending(true)       // 🔥 show loader / disable button

      const stored = localStorage.getItem("selectedAgent")
      if (!stored) {
        toast.error("No agent selected.")
        setSending(false)
        return
      }

      const agent_id = stored

      // STEP 1 — fetch customers
      const res1 = await fetch(`http://localhost:5000/agents/${agent_id}/customers`)
      const customers = await res1.json()

      if (!customers || customers.length === 0) {
        toast.error("No customers found.")
        setSending(false)
        return
      }

      const customer_ids = customers.map(c => c.customer_id)

      // STEP 2 — send WhatsApp
      const res2 = await fetch("http://localhost:5001/api/execution/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent_id, customer_ids })
      })

      const result = await res2.json()
      console.log("WHATSAPP RESULT:", result)

      if (!result?.results?.length) {
        toast.error("WhatsApp sending failed.")
        setSending(false)
        return
      }

      // Store first one
      setWhatsappResult(result.results[0])

      toast.success(`WhatsApp sent to ${result.processed} client(s)`)

    } catch (err) {
      console.error(err)
      toast.error("Error sending WhatsApp messages.")
    }

    setSending(false)    // 🔥 stop loader
  }
  return (
    <Card className="h-full p-6 bg-card border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Creative Preview</h2>
          <p className="text-sm text-muted-foreground mt-1">See how your campaign appears across channels</p>
        </div>

        <Tabs defaultValue="instagram" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-secondary">
            <TabsTrigger value="instagram" className="flex items-center gap-2">
              <Instagram size={16} />
              <span className="hidden sm:inline">Instagram</span>
            </TabsTrigger>
            <TabsTrigger value="story" className="flex items-center gap-2">
              <MessageCircle size={16} />
              <span className="hidden sm:inline">Story</span>
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="flex items-center gap-2">
              <MessageCircle size={16} />
              <span className="hidden sm:inline">WhatsApp</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail size={16} />
              <span className="hidden sm:inline">Email</span>
            </TabsTrigger>
          </TabsList>

          {/* Instagram Feed Preview */}
          <TabsContent value="instagram" className="pt-6 space-y-4">
            <div className="border border-border rounded-lg overflow-hidden bg-black max-w-sm mx-auto">
              {/* Instagram Header */}
              <div className="bg-secondary border-b border-border px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-foreground">travel_agent_pro</p>
                  <p className="text-xs text-muted-foreground">Jakarta, Indonesia</p>
                </div>
                <span className="text-muted-foreground">•••</span>
              </div>

              {/* Image Placeholder */}
              <div className="w-full aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <span className="text-muted-foreground text-sm">Campaign Image</span>
              </div>

              {/* Instagram Actions */}
              <div className="bg-secondary border-b border-border px-4 py-3 flex gap-4">
                <Heart size={20} className="text-foreground cursor-pointer hover:text-primary transition-colors" />
                <Comment size={20} className="text-foreground cursor-pointer hover:text-primary transition-colors" />
                <Share2 size={20} className="text-foreground cursor-pointer hover:text-primary transition-colors" />
              </div>

              {/* Caption */}
              <div className="bg-secondary px-4 py-3 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">1,234 likes</p>
                <p className="text-sm text-foreground leading-relaxed">{instagramPost}</p>
              </div>
            </div>
          </TabsContent>

          {/* Story Preview */}
          <TabsContent value="story" className="pt-6 space-y-4">
            <div className="border border-border rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 max-w-sm mx-auto aspect-[9/16] flex flex-col items-center justify-center p-6">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-foreground">{storyHeadline}</h3>
                <Badge className="bg-primary text-primary-foreground font-semibold">LIMITED TIME</Badge>
                <p className="text-sm text-muted-foreground">Swipe up to book now</p>
              </div>
            </div>
          </TabsContent>

          {/* WhatsApp Preview */}
          {/* WhatsApp Preview */}
          <TabsContent value="whatsapp" className="pt-6 space-y-4">

            {/* WhatsApp UI Preview */}


            {/* SEND BUTTON */}
            <div className="flex justify-center">
              <button
                onClick={handleSendWhatsApp}
                disabled={sending}
                className={`bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-semibold
                hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2
                ${sending ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {sending && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                {sending ? "Sending..." : "Send WhatsApp to All Clients"}
              </button>
            </div>

            {/* DISPLAY BACKEND RESULT */}
            {whatsappResult && (
              <div className="border border-border rounded-lg bg-secondary p-4 max-w-md mx-auto space-y-4 shadow-sm">

                <h3 className="font-semibold text-lg">WhatsApp Delivery Preview</h3>

                {/* Image Bubble */}
                {whatsappResult.image_url && (
                  <div className="flex justify-end">
                    <div className="rounded-lg overflow-hidden max-w-[70%] shadow bg-[#dcf8c6]">
                      <Image
                        src={whatsappResult.image_url}
                        alt="Sent Media"
                        width={400}
                        height={250}
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                )}

                {/* Message Bubble */}
                <div className="flex justify-end">
                  <div className="bg-[#dcf8c6] text-black dark:text-white rounded-lg rounded-tr-none p-3 shadow max-w-[75%]">
                    <p className="text-sm leading-relaxed">{whatsappResult.message}</p>
                    <p className="text-[10px] text-black/60 mt-1 text-right">
                      Delivered ✓✓
                    </p>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="text-xs text-muted-foreground space-y-1 pl-1">
                  <p><strong>Sent To:</strong> {whatsappResult.customer_name}</p>
                </div>
              </div>
            )}

          </TabsContent>

          {/* Email Preview */}
          <TabsContent value="email" className="pt-6 space-y-4">
            <div className="border border-border rounded-lg bg-white dark:bg-secondary max-w-2xl mx-auto overflow-hidden">
              {/* Email Header */}
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border px-6 py-8 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">From: travel_agent_pro@example.com</p>
                <p className="text-xs font-semibold text-muted-foreground">Subject: {emailSubject}</p>
              </div>

              {/* Email Body */}
              <div className="px-6 py-8 space-y-4">
                <p className="text-sm text-foreground leading-relaxed">Dear Traveler,</p>
                <p className="text-sm text-foreground leading-relaxed">{emailPreview}</p>
                <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                  Book Now
                </button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="bg-border" />


      </div>
    </Card>
  )
}
