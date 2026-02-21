'use client'

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Users, MapPin, Calendar, UserCircle } from 'lucide-react'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  destination: string
  dates: string
  travelers: number
  status: 'pending' | 'in-progress' | 'completed'
  image?: string
}

const MOCK_CUSTOMERS: { [key: string]: Customer[] } = {
  '1': [
    {
      id: 'c1',
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+91 98765 43210',
      destination: 'Bali, Indonesia',
      dates: 'July 1-8, 2024',
      travelers: 2,
      status: 'pending',
      image: '/customers/priya-sharma.jpg',
    },
    {
      id: 'c2',
      name: 'Vikram Patel',
      email: 'vikram.patel@email.com',
      phone: '+91 87654 32109',
      destination: 'Tokyo, Japan',
      dates: 'Aug 15-25, 2024',
      travelers: 3,
      status: 'in-progress',
      image: '/customers/vikram-patel.jpg',
    },
    {
      id: 'c3',
      name: 'Neha Singh',
      email: 'neha.singh@email.com',
      phone: '+91 76543 21098',
      destination: 'Paris, France',
      dates: 'Sept 1-10, 2024',
      travelers: 2,
      status: 'completed',
    },
    {
      id: 'c4',
      name: 'Arjun Gupta',
      email: 'arjun.gupta@email.com',
      phone: '+91 65432 10987',
      destination: 'New York, USA',
      dates: 'Oct 5-15, 2024',
      travelers: 4,
      status: 'pending',
    },
    {
      id: 'c5',
      name: 'Divya Nair',
      email: 'divya.nair@email.com',
      phone: '+91 54321 09876',
      destination: 'Dubai, UAE',
      dates: 'Nov 1-7, 2024',
      travelers: 1,
      status: 'in-progress',
    },
  ],
  '2': [
    {
      id: 'c6',
      name: 'Marco Colombo',
      email: 'marco.colombo@email.com',
      phone: '+39 12345 67890',
      destination: 'Greece',
      dates: 'July 10-20, 2024',
      travelers: 5,
      status: 'in-progress',
    },
  ],
  '3': [
    {
      id: 'c7',
      name: 'Sophie Laurent',
      email: 'sophie.laurent@email.com',
      phone: '+33 98765 43210',
      destination: 'Iceland',
      dates: 'Aug 1-10, 2024',
      travelers: 2,
      status: 'pending',
    },
  ],
}

interface CustomersListProps {
  agentId: string
  onBack: () => void
}

const getStatusBadge = (status: string) => {
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
  const customers = MOCK_CUSTOMERS[agentId] || []

  const handleSelectCustomer = (customerId: string) => {
    // Navigate to dashboard with selected customer
    router.push(`/dashboard?customer=${customerId}&agent=${agentId}`)
  }

  return (
    <section className="space-y-8">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack} className="rounded-lg">
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-foreground">Clients</h2>
          <p className="text-muted-foreground text-sm">{customers.length} client{customers.length !== 1 ? 's' : ''} found</p>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer) => (
          <Card
            key={customer.id}
            onClick={() => handleSelectCustomer(customer.id)}
            className="overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer group border-border/50"
          >
            {/* Customer Image */}
            <div className="h-32 bg-muted overflow-hidden relative">
              {customer.image && (
                <img
                  src={customer.image}
                  alt={customer.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              )}
              {!customer.image && (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                  <UserCircle size={40} className="text-muted-foreground/30" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {/* Name and Status */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1 flex-1">
                  <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">{customer.name}</h3>
                  <p className="text-xs text-muted-foreground">{customer.email}</p>
                </div>
                <Badge className={`text-xs font-medium border capitalize flex-shrink-0 ${getStatusBadge(customer.status)}`}>
                  {customer.status}
                </Badge>
              </div>

              {/* Trip Details */}
              <div className="space-y-2.5 pt-2 border-t border-border/50">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={14} className="text-muted-foreground flex-shrink-0" />
                  <span className="text-foreground font-medium">{customer.destination}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={14} className="text-muted-foreground flex-shrink-0" />
                  <span className="text-foreground font-medium">{customer.dates}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users size={14} className="text-muted-foreground flex-shrink-0" />
                  <span className="text-foreground font-medium">{customer.travelers} traveler{customer.travelers !== 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* CTA Button */}
              <Button className="w-full group-hover:bg-primary/90 transition-colors">
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
