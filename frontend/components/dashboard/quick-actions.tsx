import { Button } from '@/components/ui/button'
import { Wand2, Package, Copy, Globe } from 'lucide-react'

export function QuickActions() {
  return (
    <div className="flex gap-3 flex-wrap">
      <Button size="lg" className="gap-2 font-semibold shadow-sm hover:shadow-md transition-shadow">
        <Wand2 size={20} />
        Auto Generate Campaign
      </Button>
      <Button size="lg" variant="secondary" className="gap-2 font-semibold shadow-sm hover:shadow-md transition-shadow">
        <Package size={20} />
        Build Package
      </Button>
      <Button size="lg" variant="outline" className="gap-2 font-semibold shadow-sm hover:shadow-md transition-shadow">
        <Copy size={20} />
        Clone Template
      </Button>
      <Button size="lg" variant="secondary" className="gap-2 font-semibold shadow-sm hover:shadow-md transition-shadow">
        <Globe size={20} />
        View Microsite
      </Button>
    </div>
  )
}
