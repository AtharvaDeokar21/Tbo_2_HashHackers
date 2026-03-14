'use client'

import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { DashboardWrapper } from '@/components/layout/dashboard-wrapper'
import { TravelNewsCard } from '@/components/dashboard/travel-news-card'
import { TrendingDestinationCard } from '@/components/dashboard/trending-destination-card'

// Mock data in backend response format
const dashboardData = {
  travel_news: [
    {
      link: "https://www.travelandtourworld.com/news/article/vietnam-leads-the-way-in-travel-trends-for-2026-as-french-tourists-seek-authentic-cultural-and-nature-based-journeys/",
      source: "Travel And Tour World",
      title: "Vietnam Leads the Way in Travel Trends for 2026 as French Tourists Seek Authentic Cultural and Nature-Based Journeys"
    },
    {
      link: "https://ftnnews.com/travel-news/tours/tourism-in-new-zealand-trends-impact-and-the-path-to-sustainability/",
      source: "FTN news",
      title: "Tourism in New Zealand: Trends, Impact, and the Path to Sustainability"
    },
    {
      link: "https://www.cnbc.com/2025/12/25/5-major-trends-set-to-shape-travel-in-2026.html",
      source: "CNBC",
      title: "5 major trends set to shape travel in 2026"
    }
  ],
  trending_destinations: [
    {
      description: "Trending international travel destination with high tourism demand.",
      destination: "Dubai",
      image: null
    },
    {
      description: "Trending international travel destination with high tourism demand.",
      destination: "Bali",
      image: "https://www.outlooktravelmag.com/media/bali-1-1679062958.profileImage.2x-1536x884.webp"
    },
    {
      description: "Trending international travel destination with high tourism demand.",
      destination: "Thailand",
      image: "https://www.travelandleisure.com/thmb/nDDNqO2EctQhiIfZrxeXTF47zhE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/TAL-koh-phi-phi-PLACESTHAILAND1023-09b9d347b3cd4844b4ae19e4e06a9a6d.jpg"
    },
    {
      description: "Trending international travel destination with high tourism demand.",
      destination: "Japan",
      image: null
    },
    {
      description: "Trending international travel destination with high tourism demand.",
      destination: "Switzerland",
      image: "https://www.travelandleisure.com/thmb/JnzsGGLOaWD626-DtH-m14byvFE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/TAL-oeschinensee-PLACESSWITZERLAND1023-e079f30e7792483aa5d7865fad1369b3.jpg"
    },
    {
      description: "Trending international travel destination with high tourism demand.",
      destination: "Maldives",
      image: "https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/blogZp3--N45Ws9JaPzIibmVYDBMV5j_2Zpx.png"
    },
    {
      description: "Trending international travel destination with high tourism demand.",
      destination: "Vietnam",
      image: "https://cdn.tourradar.com/s3/serp/original/5032_Gia44gKW.jpg"
    },
    {
      description: "Trending international travel destination with high tourism demand.",
      destination: "Turkey",
      image: "https://media.cntraveller.com/photos/611befd2ae2ff768cb25326d/16:9/w_3200,h_1800,c_limit/turkey.jpg"
    }
  ]
}

export default function Dashboard() {
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

        {/* Trending Destinations Section */}
        <section className="mb-16">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-400 dark:from-orange-400 dark:to-orange-500 rounded-full"></div>
            <h2 className="text-xl font-semibold text-foreground tracking-wide">Trending Destinations</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {dashboardData.trending_destinations.map((destination, index) => (
              <TrendingDestinationCard key={index} destination={destination} />
            ))}
          </div>
        </section>

        {/* Travel News Section */}
        <section>
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-400 dark:from-blue-400 dark:to-blue-500 rounded-full"></div>
            <h2 className="text-xl font-semibold text-foreground tracking-wide">Travel News & Trends</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardData.travel_news.map((news, index) => (
              <TravelNewsCard key={index} news={news} />
            ))}
          </div>
        </section>
      </DashboardWrapper>
    </div>
  )
}
