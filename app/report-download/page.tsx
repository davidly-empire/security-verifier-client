'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { FileDown, AlertTriangle, Search, ChevronLeft, ChevronRight } from 'lucide-react';

// Import UI components (Dashboard only)
import ReportFilters from '@/app/components/reports/ReportFilters'; 
import ReportSummaryCards from '@/app/components/reports/ReportSummaryCards';

// IMPORT THE PDF COMPONENT (Hidden logic only)
import PatrolReportPDF from '@/app/components/reports/PatrolReportPDF';

// Import API types and helpers
import {
  ScanLog,
  getAllScanLogs,
  getScanLogsByFactory,
} from '@/app/api/reports';

/* ---------------- TYPES ---------------- */

interface PatrolReportResponse {
  factory_name: string;
  factory_address: string;
  report_date: string;
  generated_by: string;
  generated_at: string;
  rounds: any[];
}

/* ---------------- EMBEDDED REPORT TABLE ---------------- */

interface Column {
  key: keyof ScanLog
  label: string
}

const EmbeddedReportTable = ({ logs, loading }: { logs: ScanLog[], loading: boolean }) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ScanLog
    direction: 'asc' | 'desc'
  }>({
    key: 'scan_time',
    direction: 'desc'
  })

  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  const columns: Column[] = [
    { key: 'scan_time', label: 'Scan Time' },
    { key: 'factory_code', label: 'Factory' },
    { key: 'guard_name', label: 'Guard' },
    { key: 'qr_name', label: 'Scan Point' },
    { key: 'lat', label: 'Lat' }, 
    { key: 'log', label: 'Long' }, 
    { key: 'status', label: 'Status' },
  ]

  const handleSort = (key: keyof ScanLog) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig?.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc'
      } else {
        direction = 'asc'
      }
    } else {
      direction = 'desc' 
    }
    setSortConfig({ key, direction })
  }

  const sortedData = useMemo(() => {
    if (!sortConfig) return logs

    return [...logs].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (sortConfig.key === 'scan_time') {
        const dateA = new Date(aValue as string).getTime()
        const dateB = new Date(bValue as string).getTime()
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA
      }

      if (!aValue || !bValue) return 0

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [logs, sortConfig])

  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = sortedData.slice(indexOfFirstRow, indexOfLastRow)
  const totalPages = Math.ceil(sortedData.length / rowsPerPage)

  const renderCell = (row: ScanLog, key: keyof ScanLog) => {
    const value = row[key]

    if (key === 'scan_time' && value) {
      return new Date(value as string).toLocaleString()
    }

    if (key === 'status') {
      const color =
        value === 'SUCCESS'
          ? 'bg-green-100 text-green-800'
          : value === 'MISSED'
          ? 'bg-red-100 text-red-800'
          : 'bg-gray-100 text-gray-800'

      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
          {value ?? 'UNKNOWN'}
        </span>
      )
    }

    return value ?? '—'
  }

  if (loading) {
    return (
      <div className="text-center py-6 text-slate-500">
        Loading scan logs...
      </div>
    );
  }

  if (!logs.length) {
    return (
      <div className="text-center py-6 text-slate-500">
        No scan records found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((col) => {
              const isActive = sortConfig?.key === col.key
              return (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer select-none transition-colors ${
                    isActive ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {isActive ? (
                      sortConfig.direction === 'asc' ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />
                    ) : (
                      <div className="w-3 h-3 opacity-30 flex flex-col justify-center gap-[1px]">
                         <div className="w-full h-[1px] bg-slate-400"></div>
                         <div className="w-full h-[1px] bg-slate-400"></div>
                      </div>
                    )}
                  </div>
                </th>
              )
            })}
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-slate-200">
          {currentRows.map((row) => (
            <tr key={row.id} className="hover:bg-slate-50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  {renderCell(row, col.key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-between items-center px-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded shadow-sm text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            Previous
          </button>

          <span className="text-sm font-medium text-slate-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded shadow-sm text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

/* ---------------- PAGE COMPONENT ---------------- */

export default function ReportDownloadPage() {
  /* ---------- STATE ---------- */
  const [activeTab, setActiveTab] = useState('scanCompliance');
  const [reportPeriod, setReportPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');

  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    site: '',
    route: '', 
    guard: '',
  });

  const [logs, setLogs] = useState<ScanLog[]>([]);
  const [loading, setLoading] = useState(false);

  // State for Patrol Report Data (Internal logic only, no UI)
  const [patrolReportData, setPatrolReportData] = useState<PatrolReportResponse | null>(null);
  const [downloadingPatrol, setDownloadingPatrol] = useState(false);
  const [patrolError, setPatrolError] = useState<string | null>(null);

  /* ---------- FETCH LOGS ---------- */
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

  /* ---------- PATROL REPORT HANDLER ---------- */

  const handleFetchPatrolReport = async () => {
    if (!filters.site) {
      alert("Please select a Site (Factory) first.");
      return;
    }
    if (!filters.dateRange.start) {
      alert("Please select a Start Date for report.");
      return;
    }

    setDownloadingPatrol(true);
    setPatrolError(null);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"; 
      const params = new URLSearchParams({
        factory_code: filters.site,
        date: filters.dateRange.start,
      });

      const response = await fetch(`${baseUrl}/api/report/patrol?${params.toString()}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to download report: ${response.statusText}. ${errorText}`);
      }

      const reportData: PatrolReportResponse = await response.json();
      
      // Set data to state. This triggers the hidden component to generate PDF.
      setPatrolReportData(reportData);
      
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Unknown error";
      setPatrolError(message);
      alert(`Error: ${message}`);
    } finally {
      setDownloadingPatrol(false);
    }
  };

  /* ---------- TRANSFORM DATA ---------- */
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

  /* ---------------- UI ---------------- */

  return (
    <>
      <style jsx global>{`
        @keyframes fadeInSlide {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-slide {
          animation: fadeInSlide 0.5s ease-out forwards;
        }
      `}</style>

      <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 flex flex-col">
        
        {/* ================= PRO HEADER ================= */}
        <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              
              {/* Breadcrumb / Title Area */}
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="h-8 w-1 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">
                    Scan Compliance
                  </h1>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">
                    Reports Dashboard
                  </p>
                </div>
              </div>

              {/* Actions section removed */}
            </div>
          </div>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="max-w-7xl mx-auto px-6 py-8 flex-grow">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* --- LEFT COLUMN: FILTERS & ACTION --- */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
                
                {/* Filter Section */}
                <div className="p-6 flex-grow">
                  <div className="mb-4 pb-4 border-b border-slate-100">
                      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Report Configuration</h3>
                  </div>
                  <ReportFilters 
                    filters={filters} 
                    setFilters={setFilters}
                  />
                </div>

                {/* Action Section (Download Button) */}
                <div className="p-6 bg-slate-50 border-t border-slate-200 fade-in-slide">
                  <Button 
                    onClick={handleFetchPatrolReport} 
                    disabled={downloadingPatrol}
                    className="w-full group flex items-center justify-center gap-2 shadow-md hover:bg-slate-800 bg-slate-900 text-white px-6 py-3 rounded-xl transition-all duration-300"
                  >
                    {downloadingPatrol ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-transparent rounded-full animate-spin"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileDown className="w-4 h-4" />
                        Download PDF Report
                      </>
                    )}
                  </Button>
                  <p className="text-[10px] text-center text-slate-400 mt-2">
                      Requires Site and Start Date selection
                  </p>
                </div>
              </div>
            </div>

            {/* --- RIGHT COLUMN: DATA --- */}
            <div className="lg:col-span-2 space-y-6 flex flex-col">
              
              {/* Error Alert */}
              {patrolError && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 shadow-sm fade-in-slide">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{patrolError}</span>
                </div>
              )}

              {/* Summary Cards */}
              {!loading && (
                <div className="fade-in-slide">
                  <ReportSummaryCards logs={logs as any} />
                </div>
              )}

              {/* Table Container */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-grow">
                
                {loading ? (
                  <div className="p-12 flex flex-col items-center justify-center space-y-4">
                    <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium">Loading scan logs...</p>
                  </div>
                ) : logs.length === 0 ? (
                  <div className="p-12 text-center flex flex-col items-center justify-center h-64">
                    <div className="bg-slate-50 p-4 rounded-full mb-4">
                      <Search className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No Data Found</h3>
                    <p className="text-slate-500 text-sm mt-2">
                      Adjust your filters or select a different date range.
                    </p>
                  </div>
                ) : (
                  <div className="fade-in-slide">
                    <EmbeddedReportTable logs={logs} loading={loading} />
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* 
           HIDDEN INTEGRATION POINT:
           The component below is rendered with 'display: none'. 
           It handles the PDF generation logic but does not show any UI on the screen.
        */}
        {patrolReportData && (
           <div style={{ display: 'none' }} aria-hidden="true">
             <PatrolReportPDF reportData={patrolReportData} 
        factoryCode={filters.site}  />
           </div>
        )}

      </div>
    </>
  );
}