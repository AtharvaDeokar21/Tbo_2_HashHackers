'use client'

import { useState } from 'react'
import { AgentsList } from '@/components/home/agents-list'
import { CustomersList } from '@/components/home/customers-list'


export default function Home() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border/50">
        <div className="max-w-7xl mx-auto px-8 py-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">T</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">TBOAnalytica</h1>
          </div>
          <p className="text-muted-foreground text-sm">Travel Intelligence Platform for Travel Agents</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        {!selectedAgent ? (
          <AgentsList onSelectAgent={setSelectedAgent} />
        ) : (
          <CustomersList agentId={selectedAgent} onBack={() => setSelectedAgent(null)} />
        )}
      </main>
    </div>
  )
}
