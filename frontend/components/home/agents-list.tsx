'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Users, ChevronRight } from 'lucide-react'

interface Agent {
  id: string
  name: string
  email: string
  title: string
  customersCount: number
  image?: string
}

interface AgentsListProps {
  onSelectAgent: (agentId: string) => void
}

export function AgentsList({ onSelectAgent }: AgentsListProps) {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch('http://localhost:5000/agents')
        const data = await res.json()

        // Map backend → frontend fields
        const mapped = data.map((a: any) => ({
          id: a.agent_id,
          name: a.name,
          email: a.email,
          title: a.agency_name ?? "Travel Agent",
          customersCount: 0,   // backend does not send this → set default
          image: null,         // backend does not send image → optional
        }))

        setAgents(mapped)
      } catch (err) {
        console.error('Failed to fetch agents:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAgents()
  }, [])

  if (loading) return <p>Loading agents…</p>

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <h2 className="text-3xl font-bold">Select a Travel Agent</h2>
        <p className="text-muted-foreground text-sm">
          Choose your preferred agent to view their clients and create personalized travel packages
        </p>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <Card
            key={agent.id}
            onClick={() => onSelectAgent(agent.id)}
            className="overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer group border-border/50"
          >
            <div className="h-32 bg-muted flex items-center justify-center">
              <User size={40} className="text-muted-foreground/30" />
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-semibold">{agent.name}</h3>
                <p className="text-xs text-muted-foreground">{agent.title}</p>
              </div>

              <div className="inline-flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1.5">
                <Users size={14} className="text-muted-foreground" />
                <span className="text-sm font-medium">{agent.customersCount} clients</span>
              </div>

              <Button className="w-full">
                View Clients
                <ChevronRight size={16} className="ml-auto" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}