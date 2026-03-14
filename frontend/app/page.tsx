'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, BarChart3, Globe, Zap, Users, TrendingUp, Shield, ChevronRight, Sparkles, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const destinationsRef = useRef<HTMLDivElement>(null)
  const benefitsRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Hero animation - fade in and slight slide up
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.querySelectorAll('.animate-hero'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' }
      )
    }

    // Features section - stagger animation on scroll
    if (featuresRef.current) {
      const featureCards = featuresRef.current.querySelectorAll('.feature-card')
      gsap.fromTo(
        featureCards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 70%',
            end: 'top 20%',
            toggleActions: 'play none none reverse',
          },
          ease: 'power2.out',
        }
      )
    }

    // Stats counter animation
    if (statsRef.current) {
      const statNumbers = statsRef.current.querySelectorAll('.stat-number')
      statNumbers.forEach((element) => {
        const finalValue = parseInt(element.getAttribute('data-value') || '0')
        gsap.fromTo(
          { value: 0 },
          { value: finalValue, duration: 2.5, ease: 'power2.out' },
          {
            onUpdate: function() {
              element.textContent = Math.floor(this.targets()[0].value).toString()
            },
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reset',
            },
          }
        )
      })
    }

    // Destinations grid animation
    if (destinationsRef.current) {
      const destCards = destinationsRef.current.querySelectorAll('.destination-card')
      gsap.fromTo(
        destCards,
        { opacity: 0, scale: 0.9, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          scrollTrigger: {
            trigger: destinationsRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
          ease: 'back.out',
        }
      )
    }

    // Benefits animation
    if (benefitsRef.current) {
      const benefitCards = benefitsRef.current.querySelectorAll('.benefit-card')
      gsap.fromTo(
        benefitCards,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.12,
          scrollTrigger: {
            trigger: benefitsRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
          ease: 'power2.out',
        }
      )
    }

    // CTA section fade in
    if (ctaRef.current) {
      gsap.fromTo(
        ctaRef.current.querySelectorAll('.cta-element'),
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          ease: 'power2.out',
        }
      )
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-xl font-semibold text-neutral-900 dark:text-white">TBOAnalytica</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/agent-list">
              <Button variant="outline" className="border-neutral-300 dark:border-neutral-700">
                Dashboard
              </Button>
            </Link>
            <Link href="/agent-list">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 px-6 overflow-hidden bg-white dark:bg-neutral-950">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <div className="animate-hero inline-flex items-center gap-2 mb-6 px-4 py-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-full w-fit">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Powered by AI Intelligence</span>
            </div>
            
            <h1 className="animate-hero text-6xl lg:text-7xl font-bold text-neutral-900 dark:text-white mb-6 tracking-tight leading-tight">
              Travel Intelligence for Modern Agencies
            </h1>
            
            <p className="animate-hero text-lg text-neutral-600 dark:text-neutral-400 mb-10 leading-relaxed max-w-xl">
              Unlock real-time destination insights, track industry trends, and identify growth opportunities. Transform your travel agency with AI-powered analytics.
            </p>
            
            <div className="animate-hero flex flex-col sm:flex-row gap-4 mb-10">
              <Link href="/agent-list">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white h-14 px-10 text-base font-semibold gap-2">
                  Explore Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-10 text-base border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-900 font-semibold">
                Watch Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="animate-hero pt-8 border-t border-neutral-200 dark:border-neutral-800">
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4 font-medium">Trusted by leading travel agencies</p>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-blue-500 border-2 border-white dark:border-neutral-950 flex items-center justify-center text-white font-bold text-sm">
                      {i}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">100+ agencies worldwide</span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="animate-hero relative hidden lg:block h-[500px]">
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=700&fit=crop"
                alt="Travel destinations - beach and mountain scenery"
                fill
                sizes="(max-width: 1024px) 0px, 600px"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/20"></div>
              
              {/* Card overlay */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur rounded-xl p-4 shadow-xl">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">Top Destination This Month</p>
                    <p className="text-xs text-neutral-600 mt-1">Greek Islands growing +45% YoY</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="bg-neutral-50 dark:bg-neutral-900 py-20 px-6 border-y border-neutral-200 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="text-5xl lg:text-6xl font-bold text-blue-600 mb-4">
                <span className="stat-number" data-value="50">0</span>+
              </div>
              <p className="text-neutral-900 dark:text-white text-lg font-semibold">Global Destinations</p>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-2">Real-time tracking and monitoring</p>
            </div>
            <div className="text-center border-l border-r border-neutral-300 dark:border-neutral-700 px-6">
              <div className="text-5xl lg:text-6xl font-bold text-blue-600 mb-4">24/7</div>
              <p className="text-neutral-900 dark:text-white text-lg font-semibold">Live Updates</p>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-2">Always up-to-date intelligence</p>
            </div>
            <div className="text-center">
              <div className="text-5xl lg:text-6xl font-bold text-blue-600 mb-4">
                <span className="stat-number" data-value="100">0</span>K+
              </div>
              <p className="text-neutral-900 dark:text-white text-lg font-semibold">Data Points</p>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-2">Comprehensive analytics</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 px-6 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white mb-6">Everything You Need</h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto font-medium">
              Powerful tools designed to help you make smarter decisions and grow your travel agency
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: BarChart3, title: 'Live Analytics', desc: 'Track real-time destination trends, customer behavior, and booking patterns.', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/40' },
              { icon: Globe, title: 'Global Insights', desc: 'Access comprehensive travel intelligence from 50+ destinations worldwide.', color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/40' },
              { icon: TrendingUp, title: 'Growth Ops', desc: 'Identify emerging markets and untapped opportunities for revenue growth.', color: 'text-emerald-600', bgColor: 'bg-emerald-100 dark:bg-emerald-900/40' },
              { icon: Users, title: 'Customer Hub', desc: 'Manage and track customer interactions and booking history in one platform.', color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/40' },
              { icon: Shield, title: 'Enterprise Security', desc: 'Bank-level encryption with secure data transmission and regular backups.', color: 'text-cyan-600', bgColor: 'bg-cyan-100 dark:bg-cyan-900/40' },
              { icon: Zap, title: 'AI Insights', desc: 'Leverage machine learning for personalized recommendations and predictions.', color: 'text-pink-600', bgColor: 'bg-pink-100 dark:bg-pink-900/40' }
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div key={idx} className="feature-card group p-8 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900/50 hover:shadow-lg hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-lg mb-6 flex items-center justify-center ${feature.bgColor}`}>
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed mb-5">
                    {feature.desc}
                  </p>
                  <div className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm hover:translate-x-0.5 transition-transform">
                    Learn more
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section ref={benefitsRef} className="py-24 px-6 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white mb-6">Why Choose TBOAnalytica</h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 font-medium">
              Let your data work harder for your business
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              { icon: TrendingUp, title: 'Competitive Edge', desc: 'Stay ahead with real-time market intelligence and trend analysis.' },
              { icon: BarChart3, title: 'Increased Revenue', desc: 'Identify opportunities and optimize packages for profitability.' },
              { icon: Zap, title: 'Time Savings', desc: 'Automate reporting and free up your team for strategy.' },
              { icon: Users, title: 'Better Decisions', desc: 'Data-driven insights backed by comprehensive AI analysis.' }
            ].map((benefit, idx) => {
              const Icon = benefit.icon
              return (
                <div key={idx} className="benefit-card flex gap-6 p-8 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-shadow duration-300">
                  <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                    <Icon className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">{benefit.title}</h3>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section ref={destinationsRef} className="py-24 px-6 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white mb-6">Destinations We Track</h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 font-medium">
              Real-time intelligence from the world's top travel destinations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Greece Islands', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop' },
              { name: 'Bali Beach', image: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
              { name: 'Swiss Alps', image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=300&fit=crop' },
              { name: 'Tokyo City', image: 'https://plus.unsplash.com/premium_photo-1749732110343-3e049cb4d59f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
              { name: 'Paris Romance', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop' },
              { name: 'Dubai Luxury', image: 'https://images.unsplash.com/photo-1703866367063-71eae5acbf5d?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
            ].map((destination, idx) => (
              <div key={idx} className="destination-card group relative h-80 rounded-xl overflow-hidden cursor-pointer w-full">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white font-bold text-xl">{destination.name}</h3>
                  <p className="text-gray-200 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Growing market opportunity</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-24 px-6 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-12 md:p-16 border border-neutral-200 dark:border-neutral-800 text-center">
            <h2 className="cta-element text-5xl md:text-6xl font-bold text-neutral-900 dark:text-white mb-6">
              Ready to Transform Your Agency?
            </h2>
            <p className="cta-element text-xl text-neutral-600 dark:text-neutral-400 mb-12 max-w-2xl mx-auto font-medium">
              Join hundreds of travel agencies that are already using TBOAnalytica to grow their business and increase revenue.
            </p>
            <div className="cta-element flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/agent-list">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white h-14 px-10 text-base font-semibold gap-2">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-neutral-300 dark:border-neutral-700 h-14 px-10 text-base font-semibold">
                Schedule a Demo
              </Button>
            </div>
            <p className="cta-element text-neutral-600 dark:text-neutral-400 text-sm">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-16 px-6 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <span className="text-white font-bold text-lg">TBOAnalytica</span>
              </div>
              <p className="text-sm leading-relaxed">
                Travel intelligence platform for modern travel agencies.
              </p>
              <div className="flex gap-4 mt-6">
                <a href="#" className="text-neutral-500 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20v-7.21H5.33V9.25h2.96V7.02c0-2.92 1.78-4.51 4.37-4.51 1.24 0 2.31.09 2.62.13v3.03h-1.8c-1.41 0-1.68.67-1.68 1.66v2.17h3.35l-.44 3.54h-2.91V20z"/></svg>
                </a>
                <a href="#" className="text-neutral-500 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7z"/></svg>
                </a>
                <a href="#" className="text-neutral-500 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/></svg>
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Resources</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-neutral-500">© 2026 TBOAnalytica. All rights reserved.</p>
              <div className="flex gap-6 mt-4 md:mt-0 text-sm">
                <a href="#" className="text-neutral-500 hover:text-white transition-colors">Made with ❤️ by HashHackers</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
