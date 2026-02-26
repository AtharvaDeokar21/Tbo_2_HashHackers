'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ChevronRight, LayoutDashboard, Package, Megaphone, Users, BarChart3, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { id: 'builder', label: 'AI Builder', icon: Package, href: '/ai-builder' },
  { id: 'campaigns', label: 'Campaigns', icon: Megaphone, href: '/campaigns' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/analytics' },
]

interface SidebarProps {
  collapsed?: boolean
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(collapsed)
  const [userName, setUserName] = useState('TBOAnalytica')
  const [userInitial, setUserInitial] = useState('T')
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Fetch customer name from database
    const fetchCustomerName = async () => {
      try {
        const customerId = localStorage.getItem('selectedCustomer')
        const agentId = localStorage.getItem('selectedAgent')
        
        if (!customerId || !agentId) {
          return
        }
        
        const res = await fetch(`http://localhost:5000/agents/${agentId}/customers`)
        const customers = await res.json()
        
        const customer = customers.find((c: any) => c.customer_id === customerId)
        if (customer) {
          setUserName(customer.name)
          setUserInitial(customer.name.charAt(0).toUpperCase())
        }
      } catch (err) {
        console.error('Failed to fetch customer name:', err)
      }
    }
    
    fetchCustomerName()
    
    // Also listen for storage changes to update in real-time
    const handleStorageChange = () => {
      fetchCustomerName()
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300',
        isCollapsed ? 'w-20' : 'w-56'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-bold text-sm">{userInitial}</span>
            </div>
            <h1 className="font-bold text-lg text-sidebar-foreground">{userName}</h1>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-sidebar-accent rounded-md transition-colors"
        >
          <ChevronRight
            size={20}
            className={cn(
              'text-sidebar-foreground transition-transform duration-300',
              isCollapsed && 'rotate-180'
            )}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <button
              key={item.id}
              onClick={() => router.push(item.href)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              )}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
