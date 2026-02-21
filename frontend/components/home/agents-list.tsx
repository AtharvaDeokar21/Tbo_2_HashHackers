'use client'

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

const MOCK_AGENTS: Agent[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@growth.com',
    title: 'Senior Travel Agent',
    customersCount: 45,
    image: '/agents/sarah.jpg',
  },
  {
    id: '2',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@growth.com',
    title: 'Premium Package Specialist',
    customersCount: 38,
    image: '/agents/rajesh.jpg',
  },
  {
    id: '3',
    name: 'Emma Wilson',
    email: 'emma.wilson@growth.com',
    title: 'Adventure Tours Expert',
    customersCount: 52,
    image: '/agents/emma.jpg',
  },
  {
    id: '4',
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@growth.com',
    title: 'Luxury Travel Consultant',
    customersCount: 31,
    image: '/agents/ahmed.jpg',
  },
  {
    id: '5',
    name: 'Priya Sharma',
    email: 'priya.sharma@growth.com',
    title: 'Honeymoon Package Manager',
    customersCount: 28,
    image: '/agents/priya.jpg',
  },
  {
    id: '6',
    name: 'Marco Rossi',
    email: 'marco.rossi@growth.com',
    title: 'Group Tours Coordinator',
    customersCount: 64,
    image: '/agents/marco.jpg',
  },
]

interface AgentsListProps {
  onSelectAgent: (agentId: string) => void
}

export function AgentsList({ onSelectAgent }: AgentsListProps) {
  return (
    <section className="space-y-8">
      {/* Section Header */}
      <div className="space-y-3">
        <h2 className="text-3xl font-bold text-foreground">Select a Travel Agent</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">Choose your preferred agent to view their clients and create personalized travel packages</p>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_AGENTS.map((agent) => (
          <Card
            key={agent.id}
            onClick={() => onSelectAgent(agent.id)}
            className="overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer group border-border/50"
          >
            {/* Agent Image */}
            <div className="h-32 bg-muted overflow-hidden relative">
              {agent.image && (
                <img
                  src={agent.image}
                  alt={agent.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              )}
              {!agent.image && (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                  <User size={40} className="text-muted-foreground/30" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {/* Name and Title */}
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">{agent.name}</h3>
                <p className="text-xs text-muted-foreground">{agent.title}</p>
              </div>

              {/* Customers Badge */}
              <div className="inline-flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1.5">
                <Users size={14} className="text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{agent.customersCount} clients</span>
              </div>

              {/* CTA Button */}
              <Button className="w-full group-hover:bg-primary/90 transition-colors">
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
