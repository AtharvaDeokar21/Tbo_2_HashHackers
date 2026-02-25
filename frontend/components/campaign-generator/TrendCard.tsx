'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Loader, Flame, TrendingUp, MapPin, ArrowUpRight, Target, Zap } from 'lucide-react'

export default function TrendCard() {
  const [city, setCity] = useState('')
  const [trend, setTrend] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchTrend = async () => {
    if (!city.trim()) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`http://localhost:5001/api/trend/${city}`)
      const data = await res.json()
      setTrend(data)
    } catch (err) {
      console.error('Trend fetch error:', err)
      setError('Failed to fetch trend data. Please try again.')
    }

    setLoading(false)
  }

  const getTrendBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-100 text-emerald-700 border-emerald-300'
    if (score >= 60) return 'bg-blue-100 text-blue-700 border-blue-300'
    if (score >= 40) return 'bg-amber-100 text-amber-700 border-amber-300'
    return 'bg-orange-100 text-orange-700 border-orange-300'
  }

  const getTrendIcon = () => {
    if (!trend) return null
    if (trend.trend_score >= 80) return '🔥'
    if (trend.trend_score >= 60) return '📈'
    if (trend.trend_score >= 40) return '💡'
    return '⚠️'
  }

  const renderTrendSignal = (key: string, value: any, idx: number) => {
    const icons: Record<string, string> = {
      'search_volume': '🔍',
      'popularity': '⭐',
      'trend_direction': '📊',
      'seasonal_peak': '📅',
      'competitor_count': '🎯',
      'avg_price_trend': '💰'
    }
    
    const icon = icons[key] || '📌'
    
    return (
      <div 
        key={key}
        className="group p-4 bg-gradient-to-br from-card to-muted/30 rounded-xl border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300 cursor-default"
      >
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors text-lg">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
              {key.replace(/_/g, ' ')}
            </p>
            <p className="text-sm font-semibold text-foreground leading-snug">{value}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Input Section - Modern Design */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <Card className="relative p-5 border border-border bg-gradient-to-br from-card via-card to-muted/5 backdrop-blur-sm">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <MapPin className="w-5 h-5" />
              </div>
              <Input
                placeholder="Enter destination city (e.g., Bali, Paris, Dubai)..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchTrend()}
                className="pl-12 pr-4 py-2.5 text-sm font-medium border-border/60 focus:border-primary/40"
              />
            </div>
            <Button 
              onClick={fetchTrend} 
              disabled={loading || !city.trim()}
              className="gap-2 px-6 py-2.5 font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 disabled:opacity-50 transition-all"
            >
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              {loading ? 'Analyzing...' : 'Analyze'}
            </Button>
          </div>
        </Card>
      </div>

      {/* Error State */}
      {error && (
        <Card className="p-4 border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20">
          <p className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>
        </Card>
      )}

      {/* Result - Modern Card Design */}
      {trend && (
        <Card className="overflow-hidden border border-border/60 bg-gradient-to-br from-card to-muted/5 shadow-sm hover:shadow-md transition-shadow">
          {/* Header Section */}
          <div className="p-6 bg-gradient-to-r from-primary/8 via-primary/4 to-transparent border-b border-border/40">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{getTrendIcon()}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground flex items-baseline gap-2">
                      {trend.destination}
                      <ArrowUpRight className="w-5 h-5 text-primary" />
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">Real-time trend analysis</p>
                  </div>
                </div>
              </div>
              <Badge className={`px-4 py-2 text-base font-bold border rounded-xl ${getTrendBadgeColor(trend.trend_score)}`}>
                {trend.trend_score}/100
              </Badge>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-500"
                  style={{ width: `${trend.trend_score}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {trend.trend_score >= 80 && 'Trending strongly - High market interest'}
                {trend.trend_score < 80 && trend.trend_score >= 60 && 'Moderate trend - Growing interest'}
                {trend.trend_score < 60 && trend.trend_score >= 40 && 'Emerging trend - Market potential'}
                {trend.trend_score < 40 && 'Niche market - Targeted approach needed'}
              </p>
            </div>
          </div>

          {/* Trend Signals Grid */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                <Zap className="w-4 h-4 text-primary" />
                Market Signals
              </h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(trend.raw_data).map(([key, value], idx) => (
                key !== 'destination' && key !== 'final_score' && renderTrendSignal(key, value, idx)
              ))}
            </div>
          </div>

          {/* Footer - Quick Stats */}
          <div className="px-6 py-4 bg-muted/30 border-t border-border/40 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground font-semibold mb-1">CONFIDENCE</p>
              <p className="text-lg font-bold text-primary">{trend.trend_score}%</p>
            </div>
            <Separator orientation="vertical" />
            <div className="text-center">
              <p className="text-xs text-muted-foreground font-semibold mb-1">STATUS</p>
              <p className="text-sm font-bold text-emerald-600">Active Trend</p>
            </div>
            <Separator orientation="vertical" />
            <div className="text-center">
              <p className="text-xs text-muted-foreground font-semibold mb-1">OPPORTUNITIES</p>
              <p className="text-sm font-bold text-blue-600">High Potential</p>
            </div>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {!trend && city && !loading && (
        <Card className="p-12 text-center border border-dashed border-border/40 bg-muted/20">
          <div className="flex justify-center mb-3">
            <Target className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <p className="text-muted-foreground font-medium">Ready to analyze <span className="font-bold text-foreground">{city}</span>?</p>
          <p className="text-xs text-muted-foreground mt-1">Click "Analyze" to fetch real-time trend data</p>
        </Card>
      )}

      {/* Initial State */}
      {!trend && !city && !loading && (
        <Card className="p-8 text-center border border-border/40 bg-gradient-to-br from-primary/5 to-muted/5">
          <div className="flex justify-center mb-3">
            <TrendingUp className="w-8 h-8 text-primary/60" />
          </div>
          <p className="text-muted-foreground font-medium">Enter a destination to get started</p>
          <p className="text-xs text-muted-foreground mt-1">We'll analyze market trends and provide insights</p>
        </Card>
      )}
    </div>
  )
}