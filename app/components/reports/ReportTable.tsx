'use client'

import React, { useMemo, useState } from 'react'
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react' // Added icons for sort indication
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
  
  // CHANGED: Initial state now defaults to Scan Time Descending (Newest First)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ScanLog
    direction: 'asc' | 'desc'
  }>({
    key: 'scan_time',
    direction: 'desc'
  })

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
    
    // If clicking the same key, toggle direction
    if (sortConfig?.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc'
      } else {
        direction = 'asc'
      }
    } else {
      // If clicking a new key, default to Descending (Newest first) usually preferred
      direction = 'desc' 
    }
    
    setSortConfig({ key, direction })
  }

  const sortedData = useMemo(() => {
    if (!sortConfig) return logs

    return [...logs].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      // Handle Date Sorting specifically
      if (sortConfig.key === 'scan_time') {
        const dateA = new Date(aValue as string).getTime()
        const dateB = new Date(bValue as string).getTime()
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA
      }

      // Handle String Sorting
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
    return <div className="text-center py-6 text-slate-500">Loading scan logs...</div>
  }

  if (!logs.length) {
    return <div className="text-center py-6 text-slate-500">No scan records found</div>
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 bg-white">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((col) => {
              const isActive = sortConfig?.key === col.key
              return (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer select-none transition-colors
                    ${isActive ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-100'}
                  `}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {/* Sort Icons */}
                    {isActive ? (
                      sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 opacity-30" />
                    )}
                  </div>
                </th>
              )
            })}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200">
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

      {/* Pagination */}
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

export default ReportTable