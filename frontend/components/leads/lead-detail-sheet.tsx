'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Bell, Clock, Eye, MessageCircle, Phone, AlertCircle } from 'lucide-react'
import { Lead } from './leads-table'

interface LeadDetailSheetProps {
  lead: Lead | null
  isOpen: boolean
  onClose: () => void
}

const WHATSAPP_STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  unsubscribed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

const WHATSAPP_LABELS: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
  unsubscribed: 'Unsubscribed',
}

export function LeadDetailSheet({ lead, isOpen, onClose }: LeadDetailSheetProps) {
  if (!lead) return null

  const riskLevel = lead.riskProbability > 70 ? 'high' : lead.riskProbability > 40 ? 'medium' : 'low'
  const riskColor =
    riskLevel === 'high'
      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
      : riskLevel === 'medium'
        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:w-[540px] bg-background border-border p-0">
        <SheetHeader className="px-6 pt-6 pb-6">
          <SheetTitle className="text-2xl font-bold">{lead.name}</SheetTitle>
          <p className="text-sm text-muted-foreground mt-1">Lead Intelligence Profile</p>
        </SheetHeader>

        <div className="px-6 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
          {/* Packages Viewed */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Eye size={18} className="text-primary" />
              Packages Viewed
            </h3>
            <div className="space-y-2">
              {lead.packagesViewed.length > 0 ? (
                lead.packagesViewed.map((pkg, idx) => (
                  <div
                    key={idx}
                    className="text-sm px-3 py-2 rounded-lg bg-secondary text-muted-foreground"
                  >
                    {pkg}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No packages viewed yet</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Engagement Metrics */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Engagement Metrics</h3>

            {/* Scroll Depth */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">Scroll Depth</span>
                <span className="text-sm font-semibold text-primary">{lead.scrollDepth}%</span>
              </div>
              <Progress value={lead.scrollDepth} className="h-2" />
            </div>

            {/* Time Spent */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
              <Clock size={18} className="text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Time Spent</p>
                <p className="text-sm font-semibold text-foreground">{lead.timeSpent} minutes</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Communication Status */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Communication Status</h3>

            {/* WhatsApp Status */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
              <div className="flex items-center gap-2">
                <MessageCircle size={18} className="text-muted-foreground flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">WhatsApp</span>
              </div>
              <Badge className={WHATSAPP_STATUS_COLORS[lead.whatsappStatus]}>
                {WHATSAPP_LABELS[lead.whatsappStatus]}
              </Badge>
            </div>

            {/* Call Bot Summary */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Call Bot Summary</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed bg-secondary rounded-lg p-3">
                {lead.callBotSummary}
              </p>
            </div>
          </div>

          <Separator />

          {/* Risk Assessment */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <AlertCircle size={18} className="text-primary" />
              Risk Assessment
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">Churn Risk Probability</span>
                <Badge className={riskColor}>{riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}</Badge>
              </div>
              <Progress value={lead.riskProbability} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {lead.riskProbability}% likelihood of not converting
              </p>
            </div>
          </div>

          <Separator />

          {/* Action Button */}
          <Button className="w-full gap-2 py-6 font-semibold shadow-sm hover:shadow-md">
            <Bell size={18} />
            Notify Agent
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Agent will be alerted to follow up with {lead.name}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
