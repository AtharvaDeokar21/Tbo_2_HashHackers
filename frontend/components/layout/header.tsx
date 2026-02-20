'use client'

import { Search, Bell, Settings } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="fixed top-0 left-56 right-0 h-16 bg-background border-b border-border flex items-center px-8 lg:px-10 gap-4 z-40 transition-all duration-300">
      {/* Search Bar */}
      <div className="flex-1 max-w-md relative hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          placeholder="Search destinations, campaigns..."
          className="pl-10 bg-secondary text-foreground placeholder:text-muted-foreground border-0 focus-visible:ring-1"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 ml-auto">
        <Button variant="ghost" size="icon" className="hover:bg-secondary">
          <Bell size={20} className="text-foreground" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-secondary">
          <Settings size={20} className="text-foreground" />
        </Button>
        <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0">
          <span className="text-primary-foreground font-semibold text-sm">JD</span>
        </button>
      </div>
    </header>
  )
}
