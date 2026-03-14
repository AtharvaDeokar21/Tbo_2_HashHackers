'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { DashboardWrapper } from '@/components/layout/dashboard-wrapper'
import { TravelNewsCard } from '@/components/dashboard/travel-news-card'
import { TrendingDestinationCard } from '@/components/dashboard/trending-destination-card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'

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
        <div className="mb-12">
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">Travel Dashboard</h1>
          <p className="text-muted-foreground mt-3 text-base leading-relaxed font-light">
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
              <div className="flex items-center gap-3 mb-8">
                <div className="w-0.5 h-5 bg-neutral-300 dark:bg-neutral-700"></div>
                <h2 className="text-lg font-semibold text-foreground tracking-normal">
                  Trending Destinations
                </h2>
              </div>

              <div className="relative group">
                <Carousel className="w-full">
                  <CarouselContent>
                    {data.trending_destinations.map((destination, index) => (
                      <CarouselItem key={index} className="basis-full sm:basis-1/2 md:basis-1/3">
                        <div className="px-2">
                          <TrendingDestinationCard destination={destination} />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors" />
                  <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors" />
                </Carousel>
              </div>
            </section>

            {/* Travel News Section */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-0.5 h-5 bg-neutral-300 dark:bg-neutral-700"></div>
                <h2 className="text-lg font-semibold text-foreground tracking-normal">
                  Travel News & Trends
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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