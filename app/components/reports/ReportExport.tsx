import React, { useState } from "react";

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
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
        Export
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10">
          <div className="px-4 py-2 text-sm text-gray-700 border-b">
            Export Scan Report
          </div>

          <div className="px-4 py-3 space-y-3">
            <label className="flex items-center text-sm">
              <input
                type="radio"
                checked={exportFormat === "csv"}
                onChange={() => setExportFormat("csv")}
                className="mr-2"
              />
              CSV
            </label>

            <label className="flex items-center text-sm">
              <input
                type="radio"
                checked={exportFormat === "pdf"}
                onChange={() => setExportFormat("pdf")}
                className="mr-2"
              />
              PDF
            </label>
          </div>

          <div className="px-4 py-3 border-t">
            <button
              onClick={handleExport}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Export Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportExport;