'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardStatCard from './components/DashboardStatCard'
import RoundsStatusChart from './components/RoundsStatusChart'
import AverageRoundTimeCard from './components/AverageRoundTimeCard'
import DashboardFilters from './components/DashboardFilters'
import DashboardSkeleton from './components/DashboardSkeleton'
import DashboardError from './components/DashboardError'
import DashboardPerformanceCharts from './components/DashboardPerformanceCharts'
import { 
  ArrowDownTrayIcon 
} from '@heroicons/react/24/outline'

import { mockSiteOptions } from './constants/mockData'
import { DashboardFilters as DashboardFiltersType } from './types/dashboard'

/* -------------------------------------------------------------------------- */
/* TYPES                                    */
/* -------------------------------------------------------------------------- */

type DashboardAPIResponse = {
  totalGuards: number
  roundsToday: { completed: number; scheduled: number }
  missedRounds: number
  activeAlerts: number
  issuesCount: number 
  roundStatusData: any[]
  averageRoundTime: number
  targetRoundTime: number
  attendanceData: any[]
  completionData: any[]
}

/* -------------------------------------------------------------------------- */
/* MAIN DASHBOARD PAGE                              */
/* -------------------------------------------------------------------------- */

export default function Dashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [filters, setFilters] = useState<DashboardFiltersType>({
    dateRange: {
      start: new Date().toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
    },
    site: 'all',
  })

  const [dashboardData, setDashboardData] = useState<DashboardAPIResponse | null>(null)

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      setHasError(false)

      const token = localStorage.getItem('access_token')
      if (!token) {
        router.push('/login')
        return
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      if (!apiUrl) throw new Error('API URL not set in .env')

      const res = await fetch(
        `${apiUrl}/admin/dashboard?startDate=${filters.dateRange.start}&endDate=${filters.dateRange.end}&site=${filters.site}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (res.status === 401) {
        localStorage.removeItem('access_token')
        router.push('/login')
        return
      }

      if (!res.ok) throw new Error('Failed to fetch dashboard')

      const data: DashboardAPIResponse = await res.json()
      setDashboardData(data)
    } catch (error) {
      console.error('Dashboard fetch error:', error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [filters])

  const handleDateRangeChange = (start: string, end: string) => {
    setFilters(prev => ({ ...prev, dateRange: { start, end } }))
  }

  const handleSiteChange = (site: string) => {
    setFilters(prev => ({ ...prev, site }))
  }

  if (isLoading) return <DashboardSkeleton />
  if (hasError || !dashboardData) return <DashboardError onRetry={fetchDashboardData} />

  // Base Glass Classes to reuse
  const glassPanel = "relative bg-white/60 backdrop-blur-xl border border-white/60 shadow-sm rounded-xl overflow-hidden transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 hover:bg-white/80 group"
  
  // The "Liquid Sheen" Effect
  const liquidSheen = "absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full pointer-events-none"

  return (
    // Changed background to a subtle gradient to allow glass to pop
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 relative overflow-hidden">
      
      {/* AMBIENT BACKGROUND BLOBS (Creates depth behind glass) */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* HEADER SECTION */}
        <div className="flex flex-row items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight drop-shadow-sm">
            Security Rounds Dashboard
          </h1>

          <a
            href="https://drive.google.com/file/d/1N68kTGrhKhYIwWLZTX8I0DCDNgVQGuPH"
            target="_blank"
            rel="noopener noreferrer"
            // Added glass effect to button as well, but kept original colors
            className="flex items-center gap-2 bg-white/70 backdrop-blur-md border border-indigo-100/50 px-5 py-2.5 rounded-xl text-sm font-semibold text-indigo-600 shadow-sm hover:shadow-indigo-200 hover:bg-white hover:border-indigo-200 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            <span>Download App</span>
          </a>
        </div>

        {/* FILTERS SECTION */}
        <div className="mb-8">
          <div className={`${glassPanel} p-6`}>
            <DashboardFilters
              dateRange={filters.dateRange}
              site={filters.site}
              siteOptions={mockSiteOptions}
              onDateRangeChange={handleDateRangeChange}
              onSiteChange={handleSiteChange}
            />
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Wrapped each card to apply the glass effect */}
          {[
            { title: "Total Guards", value: dashboardData.totalGuards, trend: { value: 0, isPositive: true } },
            { 
              title: "Rounds Today", 
              value: `${dashboardData.roundsToday.completed}/${dashboardData.roundsToday.scheduled}`,
              subtitle: `${Math.round((dashboardData.roundsToday.completed / (dashboardData.roundsToday.scheduled || 1)) * 100)}% completed`,
              trend: { value: 0, isPositive: true } 
            },
            { title: "Missed Rounds", value: dashboardData.missedRounds, trend: { value: 0, isPositive: false } },
            { title: "Active Alerts", value: dashboardData.activeAlerts, trend: { value: 0, isPositive: false } }
          ].map((card, index) => (
            <div key={index} className={`${glassPanel} h-full flex flex-col justify-center p-1`}>
              <div className={liquidSheen}></div>
              <DashboardStatCard
                title={card.title}
                value={card.value}
                subtitle={card.subtitle}
                trend={card.trend}
                // Assuming component passes className, or we style the wrapper
                className="bg-transparent border-none shadow-none"
              />
            </div>
          ))}
        </div>

        {/* TOP CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className={`${glassPanel} p-6 h-full`}>
            <div className={liquidSheen}></div>
            <RoundsStatusChart data={dashboardData.roundStatusData} />
          </div>
          <div className={`${glassPanel} p-6 h-full`}>
            <div className={liquidSheen}></div>
            <AverageRoundTimeCard
              averageTime={dashboardData.averageRoundTime}
              targetTime={dashboardData.targetRoundTime}
            />
          </div>
        </div>

        {/* PERFORMANCE CHARTS */}
        <div className="mb-12">
          <div className={`${glassPanel} p-6`}>
            <div className={liquidSheen}></div>
            <DashboardPerformanceCharts
              attendanceData={dashboardData.attendanceData}
              completionData={dashboardData.completionData}
            />
          </div>
        </div>
      </div>
    </div>
  )
}