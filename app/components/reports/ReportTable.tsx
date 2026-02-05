"use client";

import React, { useMemo, useState } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { ROUND_TIMES, RoundTime } from "./roundtime"; // Import your round times

// Interface for Scan Logs
export interface ScanLog {
  id: string | number;
  scan_time: string;
  factory_code: string;
  guard_name: string;
  qr_name: string;
  round: number;
  lat?: string;
  lon?: string;
  status: "SUCCESS" | "MISSED" | string;
  [key: string]: any;
}

interface Column {
  key: keyof ScanLog;
  label: string;
}

interface ReportTableProps {
  logs: ScanLog[];
  loading: boolean;
}

const ReportTable: React.FC<ReportTableProps> = ({ logs, loading }) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ScanLog;
    direction: "asc" | "desc";
  }>({
    key: "scan_time",
    direction: "desc",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Columns including lat/lon
  const columns: Column[] = [
    { key: "scan_time", label: "Scan Time" },
    { key: "factory_code", label: "Factory" },
    { key: "guard_name", label: "Guard" },
    { key: "qr_name", label: "Scan Point" },
    { key: "lat", label: "Latitude" },
    { key: "lon", label: "Longitude" },
    { key: "status", label: "Status" },
  ];

  const handleSort = (key: keyof ScanLog) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    } else {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Filter out Round 35 before any processing
  const validLogs = logs.filter((log) => log.round !== 35);

  const sortedData = useMemo(() => {
    if (!sortConfig) return validLogs;

    return [...validLogs].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (sortConfig.key === "scan_time") {
        const dateA = new Date(aValue as string).getTime();
        const dateB = new Date(bValue as string).getTime();
        return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
      }

      if (!aValue || !bValue) return 0;
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [validLogs, sortConfig]);

  // Group logs by round
  const logsByRound = useMemo(() => {
    const grouped: Record<number, ScanLog[]> = {};
    sortedData.forEach((log) => {
      const r = log.round || 1;
      if (!grouped[r]) grouped[r] = [];
      grouped[r].push(log);
    });
    return grouped;
  }, [sortedData]);

  // Render cell values
  const renderCell = (row: ScanLog, key: keyof ScanLog) => {
    const value = row[key];

    if (key === "scan_time" && value) return new Date(value as string).toLocaleString();

    if (key === "status") {
      const color =
        value === "SUCCESS"
          ? "bg-green-100 text-green-800"
          : value === "MISSED"
          ? "bg-red-100 text-red-800"
          : "bg-gray-100 text-gray-800";
      return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{value ?? "UNKNOWN"}</span>;
    }

    return value ?? "—";
  };

  if (loading) return <div className="text-center py-6 text-slate-500">Loading scan logs...</div>;
  if (!validLogs.length) return <div className="text-center py-6 text-slate-500">No scan records found</div>;

  return (
    <div className="space-y-8">
      {Object.keys(logsByRound)
        .sort((a, b) => Number(a) - Number(b))
        .map((roundKey) => {
          const roundNumber = Number(roundKey);
          const roundLogs = logsByRound[roundNumber];
          const totalPages = Math.ceil(roundLogs.length / rowsPerPage);
          const indexOfLastRow = currentPage * rowsPerPage;
          const indexOfFirstRow = indexOfLastRow - rowsPerPage;
          const currentRows = roundLogs.slice(indexOfFirstRow, indexOfLastRow);

          // Get start & end time from ROUND_TIMES
          const roundTime: RoundTime | undefined = ROUND_TIMES[roundNumber];
          const startTime = roundTime?.start ?? "-";
          const endTime = roundTime?.end ?? "-";

          return (
            <div key={roundKey} className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm p-4">
              <h2 className="text-lg font-semibold mb-2">
                Round {roundNumber} — Start: {startTime}, End: {endTime}
              </h2>
              <table className="min-w-full divide-y divide-slate-200 bg-white">
                <thead className="bg-slate-50">
                  <tr>
                    {columns.map((col) => {
                      const isActive = sortConfig?.key === col.key;
                      return (
                        <th
                          key={String(col.key)}
                          onClick={() => handleSort(col.key)}
                          className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer select-none transition-colors
                            ${isActive ? "bg-blue-100 text-blue-700" : "text-slate-500 hover:bg-slate-100"}`}
                        >
                          <div className="flex items-center gap-1">
                            {col.label}
                            {isActive ? (
                              sortConfig.direction === "asc" ? (
                                <ArrowUp className="w-3 h-3" />
                              ) : (
                                <ArrowDown className="w-3 h-3" />
                              )
                            ) : (
                              <ArrowUpDown className="w-3 h-3 opacity-30" />
                            )}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {/* FIX: Added 'index' to map args and created a composite key */}
                  {currentRows.map((row, index) => (
                    <tr 
                      key={row.id ? `${row.id}-${index}` : `fallback-${index}`} 
                      className="hover:bg-slate-50 transition-colors"
                    >
                      {columns.map((col) => (
                        <td key={String(col.key)} className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          {renderCell(row, col.key)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination per round */}
              {totalPages > 1 && (
                <div className="mt-2 flex justify-between items-center px-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-1 border rounded shadow-sm text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm font-medium text-slate-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-1 border rounded shadow-sm text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default ReportTable;
