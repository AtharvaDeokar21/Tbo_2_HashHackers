import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Instagram, MessageCircle, Mail, Heart, MessageCircle as Comment, Share2 } from 'lucide-react'

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
          <TabsContent value="whatsapp" className="pt-6 space-y-4">
            <div className="border border-border rounded-lg bg-secondary max-w-sm mx-auto overflow-hidden">
              {/* WhatsApp Header */}
              <div className="bg-primary px-4 py-2 text-primary-foreground text-xs font-semibold">
                travel_agent_pro
              </div>

              {/* Message */}
              <div className="p-4 space-y-3">
                <div className="bg-primary text-primary-foreground rounded-lg rounded-tr-none p-3 max-w-xs ml-auto">
                  <p className="text-sm">{whatsappMessage}</p>
                  <p className="text-xs opacity-70 mt-1">14:32</p>
                </div>
              </div>
            </div>
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

        <p className="text-xs text-muted-foreground text-center">
          These are previews. Actual rendering may vary based on platform and device.
        </p>
      </div>
    </Card>
  )
}
