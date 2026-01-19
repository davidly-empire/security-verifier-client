'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';

import ReportFilters from '@/app/components/reports/ReportFilters';
import ReportSummaryCards from '@/app/components/reports/ReportSummaryCards';
import ReportTable from '@/app/components/reports/ReportTable';
import ReportExport from '@/app/components/reports/ReportExport';

/* ---------------- MOCK DATA ---------------- */

const scanComplianceData = [
  { id: 1, siteName: 'North Campus', routeName: 'Building A', guardName: 'John', missedScans: 1, compliancePercentage: 93 },
  { id: 2, siteName: 'South Campus', routeName: 'Parking', guardName: 'Sarah', missedScans: 2, compliancePercentage: 80 },
];

const guardPerformanceData = [
  { id: 1, guardName: 'John', missedScans: 3, onTimeScanPercentage: 92 },
  { id: 2, guardName: 'Sarah', missedScans: 5, onTimeScanPercentage: 85 },
];

/* ---------------- PAGE ---------------- */

export default function ReportDownloadPage() {
  const [activeTab, setActiveTab] = useState<'scanCompliance' | 'guardPerformance'>(
    'scanCompliance'
  );

  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    site: '',
    route: '',
    guard: '',
  });

  /* 🆕 REPORT PERIOD STATE (DAILY / WEEKLY / MONTHLY / YEARLY) */
  const [reportPeriod, setReportPeriod] = useState<
    'daily' | 'weekly' | 'monthly' | 'yearly'
  >('daily');

  /* ---------- DATA SWITCH ---------- */
  const getReportData = () => {
    switch (activeTab) {
      case 'scanCompliance':
        return scanComplianceData;
      case 'guardPerformance':
        return guardPerformanceData;
      default:
        return [];
    }
  };

  /* ---------- SUMMARY ---------- */
  const getSummaryData = () => {
    const data: any[] = getReportData();

    if (!data.length) {
      return { totalRecords: 0, compliancePercentage: 0, missedScans: 0, criticalIssues: 0 };
    }

    if (activeTab === 'scanCompliance') {
      return {
        totalRecords: data.length,
        compliancePercentage: Math.round(
          data.reduce((a, b) => a + b.compliancePercentage, 0) / data.length
        ),
        missedScans: data.reduce((a, b) => a + b.missedScans, 0),
        criticalIssues: 0,
      };
    }

    return {
      totalRecords: data.length,
      compliancePercentage: Math.round(
        data.reduce((a, b) => a + b.onTimeScanPercentage, 0) / data.length
      ),
      missedScans: data.reduce((a, b) => a + b.missedScans, 0),
      criticalIssues: 0,
    };
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reports</h1>

        <Button asChild variant="outline" size="sm">
          <Link href="/">Back to Dashboard</Link>
        </Button>
      </div>

      {/* 🆕 REPORT PERIOD SELECTOR */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={reportPeriod === 'daily' ? 'default' : 'outline'}
          onClick={() => setReportPeriod('daily')}
        >
          Daily
        </Button>

        <Button
          variant={reportPeriod === 'weekly' ? 'default' : 'outline'}
          onClick={() => setReportPeriod('weekly')}
        >
          Weekly
        </Button>

        <Button
          variant={reportPeriod === 'monthly' ? 'default' : 'outline'}
          onClick={() => setReportPeriod('monthly')}
        >
          Monthly
        </Button>

        <Button
          variant={reportPeriod === 'yearly' ? 'default' : 'outline'}
          onClick={() => setReportPeriod('yearly')}
        >
          Yearly
        </Button>
      </div>

      {/* ✅ ONLY 2 TABS – HARD LIMITED */}
      <div className="flex gap-2 border-b pb-2 mb-6">
        <Button
          variant={activeTab === 'scanCompliance' ? 'default' : 'outline'}
          onClick={() => setActiveTab('scanCompliance')}
        >
          Scan Compliance Report
        </Button>

        <Button
          variant={activeTab === 'guardPerformance' ? 'default' : 'outline'}
          onClick={() => setActiveTab('guardPerformance')}
        >
          Guard Performance Report
        </Button>
      </div>

      <ReportFilters filters={filters} setFilters={setFilters} />

      <div className="my-6">
        <ReportSummaryCards
          summaryData={getSummaryData()}
          reportType={activeTab}
        />
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <ReportTable
          data={getReportData()}
          reportType={activeTab}
        />
      </div>

      <div className="flex justify-end mt-4">
        <ReportExport reportType={activeTab} />
      </div>
    </div>
  );
}
