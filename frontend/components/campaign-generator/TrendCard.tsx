'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function TrendCard() {
  const [city, setCity] = useState('')
  const [trend, setTrend] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fetchTrend = async () => {
    if (!city.trim()) return
    setLoading(true)

    try {
      const res = await fetch(`http://localhost:5001/api/trend/${city}`)
      const data = await res.json()
      setTrend(data)
    } catch (err) {
      console.error('Trend fetch error:', err)
    }

    setLoading(false)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Input Section */}
      <div className="flex gap-4">
        <Input
          placeholder="Enter City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <Button onClick={fetchTrend} disabled={loading}>
          {loading ? 'Loading...' : 'Get Trend'}
        </Button>
      </div>

      {/* Result */}
      {trend && (
        <Card className="p-6 bg-card border-border shadow-sm space-y-6">
          {/* City Name */}
          <div>
            <h1 className="text-3xl font-bold">{trend.destination}</h1>
            <p className="text-muted-foreground text-sm">Trend Analysis</p>
          </div>

          <Separator />

          {/* Trend Score */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Trend Score
            </p>
            <Badge className="bg-blue-100 text-blue-700 font-bold">
              {trend.trend_score}
            </Badge>
          </div>

          <Separator />

          {/* Raw Signals */}
          <div className="grid grid-cols-2 gap-6">
            {Object.entries(trend.raw_data).map(([key, value]) => (
              key !== 'destination' && key !== 'final_score' && (
                <div key={key} className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {key.replace(/_/g, ' ')}
                  </p>
                  <p className="text-sm">{value}</p>
                </div>
              )
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}