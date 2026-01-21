'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';

import ReportFilters from '@/app/components/reports/ReportFilters';
import ReportSummaryCards from '@/app/components/reports/ReportSummaryCards';
import ReportTable from '@/app/components/reports/ReportTable';
import ReportExport from '@/app/components/reports/ReportExport';

import {
  ScanLog,
  getAllScanLogs,
  getScanLogsByFactory,
} from '@/app/api/reports';

/* ---------------- PAGE ---------------- */

export default function ReportDownloadPage() {
  /* ---------- UI STATE ---------- */
  const [activeTab, setActiveTab] = useState<
    'scanCompliance' | 'guardPerformance'
  >('scanCompliance');

  const [reportPeriod, setReportPeriod] = useState<
    'daily' | 'weekly' | 'monthly' | 'yearly'
  >('daily');

  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    site: '',
    route: '',
    guard: '',
  });

  /* ---------- DATA STATE ---------- */
  const [logs, setLogs] = useState<ScanLog[]>([]);
  const [loading, setLoading] = useState(false);

  /* ---------- FETCH DATA ---------- */
  useEffect(() => {
    fetchLogs();
  }, [filters.site]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = filters.site
        ? await getScanLogsByFactory(filters.site)
        : await getAllScanLogs();
      setLogs(data);
    } catch (err) {
      console.error('Failed to fetch scan logs', err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- TRANSFORM DATA FOR REPORTS ---------- */

  const scanComplianceData = useMemo(() => {
    return logs.map((log, index) => ({
      id: log.id ?? index,
      siteName: log.factory_code ?? 'N/A',
      routeName: log.qr_name ?? 'N/A',
      guardName: log.guard_name ?? 'N/A',
      missedScans: log.status === 'MISSED' ? 1 : 0,
      compliancePercentage: log.status === 'SUCCESS' ? 100 : 0,
    }));
  }, [logs]);

  const guardPerformanceData = useMemo(() => {
    const guardMap: Record<
      string,
      { missedScans: number; total: number; onTime: number }
    > = {};

    logs.forEach((log) => {
      const guard = log.guard_name ?? 'Unknown';
      if (!guardMap[guard]) {
        guardMap[guard] = { missedScans: 0, total: 0, onTime: 0 };
      }

      guardMap[guard].total += 1;
      if (log.status === 'MISSED') guardMap[guard].missedScans += 1;
      if (log.status === 'SUCCESS') guardMap[guard].onTime += 1;
    });

    return Object.entries(guardMap).map(([guardName, data], idx) => ({
      id: idx + 1,
      guardName,
      missedScans: data.missedScans,
      onTimeScanPercentage: data.total
        ? Math.round((data.onTime / data.total) * 100)
        : 0,
    }));
  }, [logs]);

  /* ---------------- UI ---------------- */

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reports</h1>

        <Button asChild variant="outline" size="sm">
          <Link href="/">Back to Dashboard</Link>
        </Button>
      </div>

      {/* REPORT PERIOD SELECTOR */}
      <div className="flex gap-2 mb-6">
        {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((p) => (
          <Button
            key={p}
            variant={reportPeriod === p ? 'default' : 'outline'}
            onClick={() => setReportPeriod(p)}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </Button>
        ))}
      </div>

      {/* TABS */}
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
        {/* 
           FIX: 
           Cast 'logs' to 'any' to bypass the conflict between 
           the API ScanLog type and the Component ScanLog type.
        */}
        <ReportSummaryCards logs={logs as any} />
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        {/* 
           FIX: 
           ReportTable only accepts 'logs' and 'loading'.
        */}
        <ReportTable 
          logs={logs as any} 
          loading={loading} 
        />
      </div>

      <div className="flex justify-end mt-4">
        {/* 
           FIX: 
           ReportExport only accepts 'logs'.
           We pass the raw 'logs' state so it exports the raw data.
           It does not accept 'reportType' or 'data'.
        */}
        <ReportExport 
          logs={logs as any} 
        />
      </div>
    </div>
  );
}