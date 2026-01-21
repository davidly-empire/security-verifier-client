"use client";

import SecurityAnalyticsOverview from "@/app/components/analytics/security/overview";
import ScansByGuard from "@/app/components/analytics/security/scans_by_guard";
import MissedScans from "@/app/components/analytics/security/missed_scans";
import DashboardCharts from "@/app/components/analytics/security/dashboard_charts";

export default function SecurityAnalyticsPage() {
  const factoryCode = "F001";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Security Analytics
            </h1>
            <p className="text-gray-500 mt-1">Real-time security monitoring dashboard</p>
          </div>
        </div>

        {/* 🆕 CHARTS SECTION (PARALLEL) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT: ACTIVITY CHART */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 
                      transition-all duration-300 hover:shadow-lg">
            <div className="h-[400px] w-full">
              <DashboardCharts type="activity" />
            </div>
          </div>

          {/* RIGHT: GUARD PERFORMANCE CHART */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 
                      transition-all duration-300 hover:shadow-lg">
            <div className="h-[400px] w-full">
              <DashboardCharts type="guard" />
            </div>
          </div>

        </div>

        {/* KPI OVERVIEW SECTION (MOVED DOWN) */}
        <div className="transform transition-all duration-500 hover:scale-[1.01]">
          <SecurityAnalyticsOverview />
        </div>

        {/* BOTTOM GRID (DETAILS) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* GUARD ACTIVITY CARD */}
          <div className="bg-white rounded-2xl p-1 shadow-sm border border-gray-100 
                      transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="bg-gray-50/50 rounded-xl p-6 h-full">
              <ScansByGuard />
            </div>
          </div>

          {/* MISSED SCANS CARD */}
          <div className="bg-white rounded-2xl p-1 shadow-sm border border-gray-100 
                      transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="bg-gray-50/50 rounded-xl p-6 h-full">
              <MissedScans factoryCode={factoryCode} />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}