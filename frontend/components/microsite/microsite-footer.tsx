'use client'

import { Separator } from '@/components/ui/separator'
import { MessageCircle, Mail, Phone } from 'lucide-react'

interface MicrositeFooterProps {
  agentName: string
  agentEmail: string
  agentPhone: string
  whatsappNumber: string
}

export function MicrositeFooter({
  agentName,
  agentEmail,
  agentPhone,
  whatsappNumber,
}: MicrositeFooterProps) {
  return (
    <footer className="mt-16 pt-12 border-t border-border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
        {/* Agent Info */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">Contact Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">Travel Expert</p>
              <p className="text-sm font-medium text-foreground">{agentName}</p>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-muted-foreground" />
              <a href={`mailto:${agentEmail}`} className="text-sm text-primary hover:underline">
                {agentEmail}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-muted-foreground" />
              <a href={`tel:${agentPhone}`} className="text-sm text-primary hover:underline">
                {agentPhone}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle size={16} className="text-green-600 dark:text-green-400" />
              <a href={`https://wa.me/${whatsappNumber}`} className="text-sm text-green-600 dark:text-green-400 hover:underline">
                Message on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">Information</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Cancellation Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms & Conditions
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </a>
            </li>
          </ul>
        </div>
      </div>

      <Separator className="bg-border mb-6" />

      {/* Bottom Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
        <p>© 2024 Growth Intelligence. All rights reserved.</p>
        <p>Powered by AI-driven travel intelligence</p>
      </div>
    </footer>
  )
}
