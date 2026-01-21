'use client'

import React, { useMemo, useState } from 'react'
import { ScanLog } from '@/app/api/reports'

interface Column {
  key: keyof ScanLog
  label: string
}

interface ReportTableProps {
  logs: ScanLog[]
  loading: boolean
}

const ReportTable: React.FC<ReportTableProps> = ({ logs, loading }) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ScanLog
    direction: 'asc' | 'desc'
  } | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  /* ================= COLUMNS (DB ONLY) ================= */

  const columns: Column[] = [
    { key: 'scan_time', label: 'Scan Time' },
    { key: 'factory_code', label: 'Factory' },
    { key: 'guard_name', label: 'Guard' },
    { key: 'qr_name', label: 'Scan Point' },
    { key: 'status', label: 'Status' },
  ]

  /* ================= SORTING ================= */

  const handleSort = (key: keyof ScanLog) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedData = useMemo(() => {
    if (!sortConfig) return logs

    return [...logs].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (!aValue || !bValue) return 0

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [logs, sortConfig])

  /* ================= PAGINATION ================= */

  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = sortedData.slice(indexOfFirstRow, indexOfLastRow)
  const totalPages = Math.ceil(sortedData.length / rowsPerPage)

  /* ================= CELL RENDER ================= */

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

  /* ================= UI ================= */

  if (loading) {
    return <div className="text-center py-6">Loading scan logs...</div>
  }

  if (!logs.length) {
    return <div className="text-center py-6">No scan records found</div>
  }

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
            <tr key={row.id} className="hover:bg-gray-50">
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
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default ReportTable
