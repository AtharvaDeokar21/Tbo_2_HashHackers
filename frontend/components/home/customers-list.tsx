'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Users, MapPin, Calendar, UserCircle } from 'lucide-react'

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  destination?: string
  dates?: string
  travelers?: number
  status?: string
  image?: string
}

interface CustomersListProps {
  agentId: string
  onBack: () => void
}

const getStatusBadge = (status: string = 'pending') => {
  switch (status) {
    case 'pending':
      return 'bg-primary/10 text-primary/80 border-primary/20'
    case 'in-progress':
      return 'bg-primary/8 text-primary/70 border-primary/15'
    case 'completed':
      return 'bg-primary/6 text-primary/60 border-primary/10'
    default:
      return 'bg-muted text-foreground/70 border-border/50'
  }
}

export function CustomersList({ agentId, onBack }: CustomersListProps) {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch(`http://localhost:5000/agents/${agentId}/customers`)
        const data = await res.json()

        const mapped = data.map((c: any) => ({
          id: c.customer_id,
          name: c.name,
          email: c.email,
          // Backend does not provide these -> placeholders for now
          phone: '',
          destination: '',
          dates: '',
          travelers: 1,
          status: 'pending',
          image: null,
        }))

        setCustomers(mapped)
      } catch (err) {
        console.error('Failed to fetch customers:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [agentId])

  const handleSelectCustomer = (customerId: string) => {
    router.push(`/dashboard?customer=${customerId}&agent=${agentId}`)
  }

  if (loading) return <p>Loading clients…</p>

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack} className="rounded-lg">
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-foreground">Clients</h2>
          <p className="text-muted-foreground text-sm">{customers.length} clients found</p>
        </div>
      </div>

      {/* Customers */}
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
                  <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    {customer.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{customer.email}</p>
                </div>

                <Badge className={`text-xs font-medium border capitalize flex-shrink-0 ${getStatusBadge(customer.status)}`}>
                  {customer.status}
                </Badge>
              </div>

              {/* Placeholder trip section */}
              <div className="space-y-2.5 pt-2 border-t border-border/50">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={14} className="text-muted-foreground" />
                  <span className="text-foreground font-medium">{customer.destination || 'No destination assigned'}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={14} className="text-muted-foreground" />
                  <span className="text-foreground font-medium">{customer.dates || 'No dates assigned'}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Users size={14} className="text-muted-foreground" />
                  <span className="text-foreground font-medium">
                    {customer.travelers ?? 1} travelers
                  </span>
                </div>
              </div>

              <Button className="w-full group-hover:bg-primary/90 transition-colors">Create Package</Button>
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