'use client'

import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Zap } from 'lucide-react'

interface PriceBreakdownSectionProps {
  basePrice: number
  taxes: number
  addOns: Array<{ name: string; price: number }>
}

export function PriceBreakdownSection({ basePrice, taxes, addOns }: PriceBreakdownSectionProps) {
  const subtotal = basePrice + taxes
  const totalAddOns = addOns.reduce((sum, addon) => sum + addon.price, 0)
  const total = subtotal + totalAddOns

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-foreground mb-6">Price Breakdown</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Details Card */}
        <Card className="p-8 bg-card border-border shadow-sm">
          <h3 className="font-semibold text-foreground mb-6">Per Person Pricing</h3>

          <div className="space-y-4">
            {/* Base Price */}
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <span className="text-foreground font-medium">Base Package Price</span>
              <span className="font-semibold">${basePrice.toLocaleString()}</span>
            </div>

            {/* Taxes */}
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <span className="text-foreground font-medium">Taxes & Fees</span>
              <span className="font-semibold">${taxes.toLocaleString()}</span>
            </div>

            {/* Subtotal */}
            <div className="flex justify-between items-center pb-4">
              <span className="text-muted-foreground text-sm">Subtotal</span>
              <span className="text-muted-foreground text-sm">${subtotal.toLocaleString()}</span>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-4 bg-primary/5 rounded-lg p-4">
              <span className="text-lg font-bold text-foreground">Total Per Person</span>
              <span className="text-2xl font-bold text-primary">${total.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        {/* Optional Add-ons */}
        <Card className="p-8 bg-secondary/50 border-border shadow-sm">
          <h3 className="font-semibold text-foreground mb-6">Optional Add-Ons</h3>

          <div className="space-y-3 mb-6">
            {addOns.map((addon) => (
              <div key={addon.name} className="flex justify-between items-center pb-3 border-b border-border last:border-0">
                <span className="text-foreground">{addon.name}</span>
                <span className="text-sm font-medium text-muted-foreground">+${addon.price}</span>
              </div>
            ))}
          </div>

          {/* Dynamic Pricing Alert */}
          <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
            <Zap size={16} className="text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-800 dark:text-blue-300 text-xs">
              Dynamic pricing enabled – prices may adjust based on availability and demand
            </AlertDescription>
          </Alert>
        </Card>
      </div>
    </section>
  )
}
