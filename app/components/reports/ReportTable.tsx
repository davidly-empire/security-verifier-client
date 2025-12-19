'use client'

import React, { useMemo, useState } from 'react'
import { ReportRow, ReportType } from '@/app/types/report'

interface Column {
  key: string
  label: string
}

interface ReportTableProps {
  data: ReportRow[]
  reportType: ReportType
}

const ReportTable: React.FC<ReportTableProps> = ({ data, reportType }) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: 'asc' | 'desc'
  } | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  /* ================= COLUMNS ================= */

  const columns: Column[] = useMemo(() => {
    switch (reportType) {
      case 'scanCompliance':
        return [
          { key: 'siteName', label: 'Site Name' },
          { key: 'routeName', label: 'Route Name' },
          { key: 'guardName', label: 'Guard Name' },
          { key: 'totalScanPoints', label: 'Total Scan Points' },
          { key: 'completedScans', label: 'Completed Scans' },
          { key: 'missedScans', label: 'Missed Scans' },
          { key: 'lateScans', label: 'Late Scans' },
          { key: 'compliancePercentage', label: 'Compliance %' },
        ]

      case 'guardPerformance':
        return [
          { key: 'guardName', label: 'Guard Name' },
          { key: 'assignedRoutes', label: 'Assigned Routes' },
          { key: 'totalScans', label: 'Total Scans' },
          { key: 'missedScans', label: 'Missed Scans' },
          { key: 'issuesReported', label: 'Issues Reported' },
          { key: 'onTimeScanPercentage', label: 'On-Time Scan %' },
        ]

      case 'siteSecurity':
        return [
          { key: 'siteName', label: 'Site Name' },
          { key: 'guardsAssigned', label: 'Guards Assigned' },
          { key: 'patrolsCompleted', label: 'Patrols Completed' },
          { key: 'issuesReported', label: 'Issues Reported' },
          { key: 'emergencyAlerts', label: 'Emergency Alerts' },
          { key: 'missedScans', label: 'Missed Scans' },
        ]

      case 'issuesIncidents':
        return [
          { key: 'issueType', label: 'Issue Type' },
          { key: 'severity', label: 'Severity' },
          { key: 'site', label: 'Site' },
          { key: 'location', label: 'Location' },
          { key: 'reportedBy', label: 'Reported By' },
          { key: 'status', label: 'Status' },
        ]

      default:
        return []
    }
  }, [reportType])

  /* ================= SORTING ================= */

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedData = useMemo(() => {
    if (!sortConfig) return data

    return [...data].sort((a, b) => {
      const aValue = (a as any)[sortConfig.key]
      const bValue = (b as any)[sortConfig.key]

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [data, sortConfig])

  /* ================= PAGINATION ================= */

  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = sortedData.slice(indexOfFirstRow, indexOfLastRow)
  const totalPages = Math.ceil(sortedData.length / rowsPerPage)

  /* ================= CELL RENDER ================= */

  const renderCell = (row: ReportRow, key: string) => {
    const value = (row as any)[key]

    if (key === 'severity') {
      const color =
        value === 'Critical'
          ? 'bg-red-100 text-red-800'
          : value === 'High'
          ? 'bg-orange-100 text-orange-800'
          : value === 'Medium'
          ? 'bg-yellow-100 text-yellow-800'
          : 'bg-blue-100 text-blue-800'

      return <span className={`px-2 py-1 rounded-full text-xs ${color}`}>{value}</span>
    }

    if (key === 'status') {
      const color =
        value === 'Open'
          ? 'bg-red-100 text-red-800'
          : 'bg-green-100 text-green-800'

      return <span className={`px-2 py-1 rounded-full text-xs ${color}`}>{value}</span>
    }

    if (key.toLowerCase().includes('percentage')) {
      return `${value}%`
    }

    return value
  }

  /* ================= UI ================= */

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {currentRows.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 text-sm">
                  {renderCell(row, col.key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default ReportTable
