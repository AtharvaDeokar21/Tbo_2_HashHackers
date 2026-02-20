import { ReactNode } from 'react'

interface DashboardWrapperProps {
  children: ReactNode
}

export function DashboardWrapper({ children }: DashboardWrapperProps) {
  return (
    <main className="pt-20 pl-56 transition-all duration-300">
      <div className="px-8 lg:px-10 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {children}
        </div>
      </div>
    </main>
  )
}
