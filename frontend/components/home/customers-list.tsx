'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import {
  ArrowLeft,
  Users,
  UserCircle,
  Plus,
} from 'lucide-react'

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  risk_preference?: string
  image?: string
}

interface CustomersListProps {
  agentId: string
  onBack: () => void
}

const getRiskBadge = (risk: string = "Medium") => {
  switch (risk.toLowerCase()) {
    case "high":
      return "bg-red-100 text-red-700 border-red-300"
    case "medium":
      return "bg-yellow-100 text-yellow-700 border-yellow-300"
    case "low":
      return "bg-green-100 text-green-700 border-green-300"
    default:
      return "bg-muted text-foreground/70 border-border/50"
  }
}

export function CustomersList({ agentId, onBack }: CustomersListProps) {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  // Form for new client
  const [form, setForm] = useState({
    name: "",
    email: "",
    source_city: "",
    budget_range: "",
    risk_preference: "Medium",
  })

  const updateField = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  useEffect(() => {
    fetchCustomers()
  }, [agentId])

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`http://localhost:5000/agents/${agentId}/customers`)
      const data = await res.json()

      const mapped: Customer[] = data.map((c: any) => ({
        id: c.customer_id,
        name: c.name,
        email: c.email,
        phone: "",
        risk_preference: c.risk_preference,
        image: null,
      }))

      setCustomers(mapped)
    } catch (err) {
      console.error('Failed to fetch customers:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCustomer = async () => {
    try {
      const payload = {
        agent_id: agentId,
        ...form,
      }

      const res = await fetch("http://localhost:5000/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        alert("Failed to create client")
        return
      }

      setOpen(false)
      setForm({
        name: "",
        email: "",
        source_city: "",
        budget_range: "",
        risk_preference: "Medium",
      })

      fetchCustomers()
    } catch (err) {
      console.error("Error creating client:", err)
    }
  }

  const handleSelectCustomer = (customerId: string) => {
    router.push(`/dashboard?customer=${customerId}&agent=${agentId}`)
    localStorage.setItem('selectedCustomer', customerId)
    localStorage.setItem('selectedAgent', agentId)
  }

  if (loading) return <p>Loading clients…</p>

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-foreground">Clients</h2>
            <p className="text-muted-foreground text-sm">
              {customers.length} clients found
            </p>
          </div>
        </div>

        {/* ➕ Add New Client */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={18} /> Add Client
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-3">
              <div>
                <Label>Name</Label>
                <Input
                  placeholder="Client Name"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />
              </div>

              <div>
                <Label>Source City</Label>
                <Input
                  placeholder="City of departure"
                  value={form.source_city}
                  onChange={(e) => updateField("source_city", e.target.value)}
                />
              </div>

              <div>
                <Label>Budget Range</Label>
                <Input
                  placeholder="Ex: 1-2 Lakhs"
                  value={form.budget_range}
                  onChange={(e) => updateField("budget_range", e.target.value)}
                />
              </div>

              <div>
                <Label>Risk Preference</Label>
                <select
                  className="w-full border rounded-md p-2 text-sm"
                  value={form.risk_preference}
                  onChange={(e) => updateField("risk_preference", e.target.value)}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateCustomer}>Create Client</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer) => (
          <Card
            key={customer.id}
            onClick={() => handleSelectCustomer(customer.id)}
            className="overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer group border-border/50"
          >
            <div className="h-32 bg-muted flex items-center justify-center">
              <UserCircle size={40} className="text-muted-foreground/30" />
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1 flex-1">
                  <h3 className="text-base font-semibold group-hover:text-primary">
                    {customer.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{customer.email}</p>
                </div>

                {/* RISK BADGE */}
                <Badge
                  className={`text-xs font-medium border capitalize ${getRiskBadge(customer.risk_preference)}`}
                >
                  {customer.risk_preference}
                </Badge>
              </div>

              <Button className="w-full group-hover:bg-primary/90">
                Create Package
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {customers.length === 0 && (
        <Card className="p-16 text-center border-border/50">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
              <Users size={24} className="text-muted-foreground/50" />
            </div>
          </div>
          <p className="text-muted-foreground text-sm">No customers found for this agent</p>
        </Card>
      )}
    </section>
  )
}