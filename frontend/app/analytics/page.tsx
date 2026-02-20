'use client'

import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { DashboardWrapper } from '@/components/layout/dashboard-wrapper'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, TrendingUp, Package, Zap, Users, CheckCircle2, RefreshCw } from 'lucide-react'

export default function Analytics() {
  const steps = [
    { label: 'Trend Detection', icon: TrendingUp, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
    { label: 'Package Build', icon: Package, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
    { label: 'Campaign Launch', icon: Zap, color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
    { label: 'Lead Scoring', icon: Users, color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
    { label: 'Booking', icon: CheckCircle2, color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' },
    { label: 'Learning Update', icon: RefreshCw, color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' },
  ]

  return (
    <div>
      <Sidebar />
      <Header />

      <DashboardWrapper>
        {/* Page Header */}
        <div>
          <h1 className="text-5xl font-bold text-foreground tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-2 text-base leading-relaxed">
            Campaign performance, conversion funnels, and closed-loop acquisition intelligence
          </p>
        </div>

        {/* Closed-Loop Acquisition Flow */}
        <Card className="p-8 bg-card border-border shadow-sm">
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground">Acquisition Loop</h3>
            <p className="text-sm text-muted-foreground mt-1">End-to-end visibility: from demand signals to learning feedback</p>
          </div>

          {/* Step Flow */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {steps.map((step, idx) => {
              const Icon = step.icon
              return (
                <div key={step.label} className="flex items-center gap-3">
                  <div className={`rounded-lg p-3 ${step.color}`}>
                    <Icon size={20} />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Step {idx + 1}</p>
                    <p className="text-sm font-medium text-foreground">{step.label}</p>
                  </div>
                  {idx < steps.length - 1 && (
                    <ArrowRight size={20} className="text-muted-foreground mx-2 hidden md:block" />
                  )}
                </div>
              )
            })}
          </div>

          {/* Stats Row */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-secondary rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-foreground">47%</p>
              <p className="text-xs text-muted-foreground mt-1">Detection Accuracy</p>
            </div>
            <div className="bg-secondary rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-foreground">12</p>
              <p className="text-xs text-muted-foreground mt-1">Active Campaigns</p>
            </div>
            <div className="bg-secondary rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-foreground">248</p>
              <p className="text-xs text-muted-foreground mt-1">Leads This Week</p>
            </div>
            <div className="bg-secondary rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-foreground">3.8%</p>
              <p className="text-xs text-muted-foreground mt-1">Conversion Rate</p>
            </div>
            <div className="bg-secondary rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-foreground">$847K</p>
              <p className="text-xs text-muted-foreground mt-1">Pipeline Value</p>
            </div>
            <div className="bg-secondary rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-foreground">89%</p>
              <p className="text-xs text-muted-foreground mt-1">Loop Efficiency</p>
            </div>
          </div>
        </Card>

        {/* Coming Soon Note */}
        <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
          <div className="flex items-start gap-4">
            <div className="text-blue-600 dark:text-blue-400 mt-1">
              <Zap size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-200">Detailed Analytics Coming</h4>
              <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
                Extended dashboards for campaign performance, granular conversion funnels, and learning loop optimization will be available soon. Current view shows system-level acquisition loop overview.
              </p>
            </div>
          </div>
        </Card>
      </DashboardWrapper>
    </div>
  )
}
