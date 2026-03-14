'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { DashboardWrapper } from '@/components/layout/dashboard-wrapper'
import { TravelNewsCard } from '@/components/dashboard/travel-news-card'
import { TrendingDestinationCard } from '@/components/dashboard/trending-destination-card'

type TravelNews = {
  link: string
  source: string
  title: string
}

type Destination = {
  destination: string
  description: string
  image: string | null
}

type DashboardResponse = {
  travel_news: TravelNews[]
  trending_destinations: Destination[]
}

export default function Dashboard() {

  const [data, setData] = useState<DashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/dashboard/travel-intelligence")

        if (!res.ok) throw new Error("Failed to fetch dashboard data")

        const json = await res.json()
        setData(json)
      } catch (err) {
        console.error("Dashboard fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  return (
    <div>
      <Sidebar />
      <Header />

      <DashboardWrapper>

        {/* Welcome Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-foreground tracking-tight">Travel Dashboard</h1>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            Discover trending destinations and stay updated with the latest travel insights
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <p className="text-muted-foreground">Loading dashboard...</p>
        )}

        {!loading && data && (
          <>
            {/* Trending Destinations Section */}
            <section className="mb-16">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-400 dark:from-orange-400 dark:to-orange-500 rounded-full"></div>
                <h2 className="text-xl font-semibold text-foreground tracking-wide">
                  Trending Destinations
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {data.trending_destinations.map((destination, index) => (
                  <TrendingDestinationCard key={index} destination={destination} />
                ))}
              </div>
            </section>

            {/* Travel News Section */}
            <section>
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-400 dark:from-blue-400 dark:to-blue-500 rounded-full"></div>
                <h2 className="text-xl font-semibold text-foreground tracking-wide">
                  Travel News & Trends
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.travel_news.map((news, index) => (
                  <TravelNewsCard key={index} news={news} />
                ))}
              </div>
            </section>
          </>
        )}

      </DashboardWrapper>
    </div>
  )
}