'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { User, Users, ChevronRight, Plus } from 'lucide-react'

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
  const [open, setOpen] = useState(false)

  // Form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    agency_name: '',
    city: '',
  })

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      const res = await fetch('http://localhost:5000/agents')
      const data = await res.json()

      const mapped = data.map((a: any) => ({
        id: a.agent_id,
        name: a.name,
        email: a.email,
        title: a.agency_name ?? 'Travel Agent',
        customersCount: a.customer_count ?? 0,
      }))

      setAgents(mapped)
    } catch (err) {
      console.error('Failed to fetch agents:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAgent = async () => {
    try {
      const res = await fetch('http://localhost:5000/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        alert('Failed to create agent')
        return
      }

      setOpen(false)
      setForm({ name: '', email: '', phone: '', agency_name: '', city: '' })
      fetchAgents()
    } catch (err) {
      console.error('Error creating agent:', err)
    }
  }

  if (loading) return <p>Loading agents…</p>

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Select a Travel Agent</h2>
          <p className="text-muted-foreground text-sm">
            Choose your preferred agent to view their clients and create personalized travel packages
          </p>
        </div>

        {/* ➕ Add Agent Button */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={18} />
              Add Agent
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Agent</DialogTitle>
            </DialogHeader>

            {/* FORM */}
            <div className="space-y-4 py-3">
              <div>
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Agent Name"
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Email Address"
                />
              </div>

              <div>
                <Label>Phone Number</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="Phone Number"
                />
              </div>

              <div>
                <Label>Agency Name</Label>
                <Input
                  value={form.agency_name}
                  onChange={(e) => handleChange('agency_name', e.target.value)}
                  placeholder="Agency Name"
                />
              </div>

              <div>
                <Label>City</Label>
                <Input
                  value={form.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="City"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateAgent}>Create Agent</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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