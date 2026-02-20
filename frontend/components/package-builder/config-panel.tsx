'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'

const DESTINATIONS = [
  { id: 'bali', label: 'Bali, Indonesia' },
  { id: 'iceland', label: 'Iceland' },
  { id: 'portugal', label: 'Portugal' },
  { id: 'japan', label: 'Japan' },
]

const HOTELS = [
  { id: 'luxury', label: 'Luxury 5-Star' },
  { id: 'upscale', label: 'Upscale 4-Star' },
  { id: 'comfort', label: 'Comfort 3-Star' },
  { id: 'budget', label: 'Budget 2-Star' },
]

const ACTIVITIES = [
  { id: 'snorkel', label: 'Snorkeling & Diving' },
  { id: 'hiking', label: 'Hiking & Trekking' },
  { id: 'cultural', label: 'Cultural Tours' },
  { id: 'adventure', label: 'Adventure Sports' },
  { id: 'wellness', label: 'Wellness & Spa' },
  { id: 'nightlife', label: 'Nightlife & Dining' },
]

interface ConfigPanelProps {
  onConfigChange: (config: PackageConfig) => void
}

export interface PackageConfig {
  destination: string
  checkIn: string
  checkOut: string
  includeFlight: boolean
  hotel: string
  activities: string[]
  marginPercent: number
  includeRisk: boolean
  dynamicRepricing: boolean
}

export function ConfigPanel({ onConfigChange }: ConfigPanelProps) {
  const [config, setConfig] = useState<PackageConfig>({
    destination: 'bali',
    checkIn: '2024-03-15',
    checkOut: '2024-03-22',
    includeFlight: true,
    hotel: 'upscale',
    activities: ['snorkel', 'cultural'],
    marginPercent: 25,
    includeRisk: false,
    dynamicRepricing: true,
  })

  const handleConfigUpdate = (updates: Partial<PackageConfig>) => {
    const newConfig = { ...config, ...updates }
    setConfig(newConfig)
    onConfigChange(newConfig)
  }

  return (
    <Card className="p-8 bg-card border-border shadow-sm h-fit sticky top-24">
      <h3 className="text-lg font-semibold text-foreground mb-6">Package Configuration</h3>

      <div className="space-y-6">
        {/* Destination Select */}
        <div className="space-y-2">
          <Label htmlFor="destination" className="text-sm font-semibold">
            Destination
          </Label>
          <Select value={config.destination} onValueChange={(val) => handleConfigUpdate({ destination: val })}>
            <SelectTrigger id="destination">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DESTINATIONS.map((dest) => (
                <SelectItem key={dest.id} value={dest.id}>
                  {dest.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Check-in Date */}
        <div className="space-y-2">
          <Label htmlFor="checkin" className="text-sm font-semibold">
            Check-in Date
          </Label>
          <Input
            id="checkin"
            type="date"
            value={config.checkIn}
            onChange={(e) => handleConfigUpdate({ checkIn: e.target.value })}
            className="bg-secondary"
          />
        </div>

        {/* Check-out Date */}
        <div className="space-y-2">
          <Label htmlFor="checkout" className="text-sm font-semibold">
            Check-out Date
          </Label>
          <Input
            id="checkout"
            type="date"
            value={config.checkOut}
            onChange={(e) => handleConfigUpdate({ checkOut: e.target.value })}
            className="bg-secondary"
          />
        </div>

        {/* Flight Toggle */}
        <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
          <Label htmlFor="flight" className="text-sm font-medium cursor-pointer">
            Include Flight
          </Label>
          <input
            id="flight"
            type="checkbox"
            checked={config.includeFlight}
            onChange={(e) => handleConfigUpdate({ includeFlight: e.target.checked })}
            className="w-5 h-5 cursor-pointer"
          />
        </div>

        {/* Hotel Select */}
        <div className="space-y-2">
          <Label htmlFor="hotel" className="text-sm font-semibold">
            Hotel Category
          </Label>
          <Select value={config.hotel} onValueChange={(val) => handleConfigUpdate({ hotel: val })}>
            <SelectTrigger id="hotel">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {HOTELS.map((h) => (
                <SelectItem key={h.id} value={h.id}>
                  {h.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Activities Multi-select */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Activities</Label>
          <div className="space-y-2">
            {ACTIVITIES.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors">
                <input
                  id={activity.id}
                  type="checkbox"
                  checked={config.activities.includes(activity.id)}
                  onChange={(e) => {
                    const newActivities = e.target.checked
                      ? [...config.activities, activity.id]
                      : config.activities.filter((a) => a !== activity.id)
                    handleConfigUpdate({ activities: newActivities })
                  }}
                  className="w-4 h-4 cursor-pointer"
                />
                <label htmlFor={activity.id} className="text-sm cursor-pointer flex-1">
                  {activity.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Margin Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label htmlFor="margin" className="text-sm font-semibold">
              Margin %
            </Label>
            <span className="text-2xl font-bold text-primary">{config.marginPercent}%</span>
          </div>
          <input
            id="margin"
            type="range"
            min="0"
            max="40"
            step="1"
            value={config.marginPercent}
            onChange={(e) => handleConfigUpdate({ marginPercent: parseInt(e.target.value) })}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>40%</span>
          </div>
        </div>

        {/* Risk Toggle */}
        <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
          <Label htmlFor="risk" className="text-sm font-medium cursor-pointer">
            Include Risk Premium
          </Label>
          <input
            id="risk"
            type="checkbox"
            checked={config.includeRisk}
            onChange={(e) => handleConfigUpdate({ includeRisk: e.target.checked })}
            className="w-5 h-5 cursor-pointer"
          />
        </div>

        {/* Dynamic Repricing Toggle */}
        <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
          <Label htmlFor="repricing" className="text-sm font-medium cursor-pointer">
            Dynamic Repricing
          </Label>
          <input
            id="repricing"
            type="checkbox"
            checked={config.dynamicRepricing}
            onChange={(e) => handleConfigUpdate({ dynamicRepricing: e.target.checked })}
            className="w-5 h-5 cursor-pointer"
          />
        </div>

        {/* Strategic Fit Section */}
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-4 space-y-3">
          <h4 className="text-sm font-semibold text-green-900 dark:text-green-300">Strategic Fit</h4>
          
          <div className="space-y-3">
            {/* Demand Alignment */}
            <div>
              <p className="text-xs font-medium text-green-800 dark:text-green-400 mb-2">Demand Alignment</p>
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                {config.destination === 'bali' || config.destination === 'japan' ? 'High' : 'Medium'}
              </Badge>
            </div>

            {/* Seasonal Fit */}
            <div>
              <p className="text-xs font-medium text-green-800 dark:text-green-400 mb-2">Seasonal Fit</p>
              <Badge variant="outline" className="text-green-700 dark:text-green-300">
                {new Date(config.checkIn).getMonth() >= 2 && new Date(config.checkIn).getMonth() <= 4 ? 'Peak Season' : 'Off-Season'}
              </Badge>
            </div>

            {/* Campaign Readiness */}
            <div>
              <p className="text-xs font-medium text-green-800 dark:text-green-400 mb-2">Campaign Readiness</p>
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                {config.marginPercent >= 20 ? 'Ready' : 'Optimize'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button className="flex-1 font-semibold">Save Package</Button>
          <Button variant="secondary" className="flex-1 font-semibold">
            Reset
          </Button>
        </div>
      </div>
    </Card>
  )
}
