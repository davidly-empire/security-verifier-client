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

import { mockSiteOptions } from './constants/mockData'
import { DashboardFilters as DashboardFiltersType } from './types/dashboard'

type DashboardAPIResponse = {
  totalGuards: number
  roundsToday: { completed: number; scheduled: number }
  missedRounds: number
  activeAlerts: number
  roundStatusData: any[]
  averageRoundTime: number
  targetRoundTime: number
  attendanceData: any[]
  completionData: any[]
}

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

  // 🔹 Backend fetch with proper token and redirect on auth failure
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      setHasError(false)

      const token = localStorage.getItem('access_token')
      if (!token) {
        alert('You must be logged in to access the dashboard')
        router.push('/login') // redirect to login page
        return
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      if (!apiUrl) throw new Error('API URL not set in .env')

      const res = await fetch(
        `${apiUrl}/admin/dashboard?startDate=${filters.dateRange.start}&endDate=${filters.dateRange.end}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (res.status === 401) {
        alert('Session expired. Please log in again.')
        localStorage.removeItem('access_token')
        router.push('/login')
        return
      }

      if (!res.ok) throw new Error('Failed to fetch dashboard')

      const data: DashboardAPIResponse = await res.json()
      console.log('Dashboard API data:', data)
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

  const handleRetry = () => {
    fetchDashboardData()
  }

  if (isLoading) return <DashboardSkeleton />

  if (hasError || !dashboardData)
    return <DashboardError onRetry={handleRetry} />

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Security Rounds Dashboard
        </h1>
      </div>

      <DashboardFilters
        dateRange={filters.dateRange}
        site={filters.site}
        siteOptions={mockSiteOptions}
        onDateRangeChange={handleDateRangeChange}
        onSiteChange={handleSiteChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <DashboardStatCard
          title="Total Guards"
          value={dashboardData.totalGuards}
          trend={{ value: 0, isPositive: true }}
        />
        <DashboardStatCard
          title="Rounds Today"
          value={`${dashboardData.roundsToday.completed}/${dashboardData.roundsToday.scheduled}`}
          subtitle={`${Math.round(
            (dashboardData.roundsToday.completed /
              dashboardData.roundsToday.scheduled) *
              100
          )}% completed`}
          trend={{ value: 0, isPositive: true }}
        />
        <DashboardStatCard
          title="Missed Rounds"
          value={dashboardData.missedRounds}
          trend={{ value: 0, isPositive: false }}
        />
        <DashboardStatCard
          title="Active Alerts"
          value={dashboardData.activeAlerts}
          trend={{ value: 0, isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <RoundsStatusChart data={dashboardData.roundStatusData} />
        <AverageRoundTimeCard
          averageTime={dashboardData.averageRoundTime}
          targetTime={dashboardData.targetRoundTime}
        />
      </div>

      <div className="mb-6">
        <DashboardPerformanceCharts
          attendanceData={dashboardData.attendanceData}
          completionData={dashboardData.completionData}
        />
      </div>
    </div>
  )
}
