"use client";

import React, { useState } from "react";
import { Download, FileText, FileSpreadsheet, Check } from "lucide-react";

/**
 * ✅ DB-aligned ScanLog
 */
export interface ScanLog {
  id: number;
  guard_name: string | null;
  qr_id: string | null;
  qr_name: string | null;
  lat: number | null;
  log: number | null;
  scan_time: string;
  status: string | null;
  factory_code: string | null;
}

interface ReportExportProps {
  logs: ScanLog[];
}

const ReportExport: React.FC<ReportExportProps> = ({ logs }) => {
  const [exportFormat, setExportFormat] = useState<"csv" | "pdf">("csv");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  /* ---------------- CSV EXPORT ---------------- */
  const exportCSV = () => {
    if (!logs.length) {
      alert("No data available to export");
      return;
    }

    const headers = [
      "ID",
      "Guard Name",
      "QR ID",
      "QR Name",
      "Latitude",
      "Longitude",
      "Scan Time",
      "Status",
      "Factory Code",
    ];

    const rows = logs.map((log) => [
      log.id,
      log.guard_name ?? "",
      log.qr_id ?? "",
      log.qr_name ?? "",
      log.lat ?? "",
      log.log ?? "",
      new Date(log.scan_time).toLocaleString(),
      log.status ?? "",
      log.factory_code ?? "",
    ]);

    const csvContent =
      [headers, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "scan_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* ---------------- PDF EXPORT (STUB) ---------------- */
  const exportPDF = () => {
    alert("PDF export will be added next (jsPDF / backend PDF)");
  };

  const handleExport = () => {
    if (exportFormat === "csv") exportCSV();
    if (exportFormat === "pdf") exportPDF();
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative z-50">
      
      {/* Trigger Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="group flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200"
      >
        <Download className="w-4 h-4" />
        <span>Export Report</span>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[-1]" 
            onClick={() => setIsDropdownOpen(false)}
          ></div>
          
          {/* Menu Card */}
          <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl shadow-slate-200/40 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Format</p>
            </div>

            {/* Options */}
            <div className="p-2 space-y-1">
              {/* CSV Option */}
              <label 
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 border
                  ${exportFormat === "csv" 
                    ? "bg-blue-50 border-blue-200" 
                    : "bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="exportFormat"
                    checked={exportFormat === "csv"}
                    onChange={() => setExportFormat("csv")}
                    className="accent-blue-600 w-4 h-4"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800">CSV Spreadsheet</span>
                    <span className="text-[10px] text-slate-500">Best for Excel / Sheets</span>
                  </div>
                </div>
                {exportFormat === "csv" && (
                  <div className="bg-blue-600 text-white rounded-full p-1">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </label>

              {/* PDF Option */}
              <label 
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 border
                  ${exportFormat === "pdf" 
                    ? "bg-blue-50 border-blue-200" 
                    : "bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="exportFormat"
                    checked={exportFormat === "pdf"}
                    onChange={() => setExportFormat("pdf")}
                    className="accent-blue-600 w-4 h-4"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800">PDF Document</span>
                    <span className="text-[10px] text-slate-500">Best for printing</span>
                  </div>
                </div>
                {exportFormat === "pdf" && (
                  <div className="bg-blue-600 text-white rounded-full p-1">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </label>
            </div>

            {/* Action Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <button
                onClick={handleExport}
                className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-800 font-bold text-sm py-2.5 rounded-xl hover:border-blue-500 hover:text-blue-600 hover:shadow-md transition-all duration-200 group"
              >
                {exportFormat === "csv" ? <FileSpreadsheet className="w-4 h-4 text-slate-500 group-hover:text-blue-600" /> : <FileText className="w-4 h-4 text-slate-500 group-hover:text-blue-600" />}
                <span>Download File</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportExport;