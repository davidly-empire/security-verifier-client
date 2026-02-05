"use client";

import { useState, useEffect, useRef } from "react";
import { getPatrolReport, PatrolReportItem } from "../api/report";
import { getFactories } from "../api/factories.api";
import PatrolReportPDF from "../components/reports/PatrolReportPDF"; // Updated PDF generator
import ReportTable from "../components/reports/ReportTable"; // Multi-round table component

export default function ReportDownloadPage() {
  const [factories, setFactories] = useState<{ factory_code: string; factory_name: string }[]>([]);
  const [factoryCode, setFactoryCode] = useState("");
  const [reportDate, setReportDate] = useState(new Date().toISOString().slice(0, 10));
  
  // State for the raw logs
  const [report, setReport] = useState<PatrolReportItem[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPDF, setShowPDF] = useState(false);

  // Ref for table print preview
  const printRef = useRef<HTMLDivElement>(null);

  // Normalize status
  const normalizeStatus = (status?: string) => {
    if (!status) return "MISSED";
    const s = status.toLowerCase();
    if (s === "success") return "SUCCESS";
    if (s === "failed" || s === "missed") return "MISSED";
    return "SUCCESS";
  };

  // Fetch factories on mount
  useEffect(() => {
    const fetchFactories = async () => {
      try {
        const res = await getFactories();
        setFactories(res.data || []);
        if (res.data?.length) setFactoryCode(res.data[0].factory_code);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFactories();
  }, []);

  // Fetch patrol report
  const fetchReport = async () => {
    if (!factoryCode) return;
    setLoading(true);
    setError(null);
    setShowPDF(false); // Reset PDF trigger
    try {
      const data = await getPatrolReport(factoryCode, reportDate);
      const normalized = data.map((item) => ({
        ...item,
        status: normalizeStatus(item.status),
      }));
      setReport(normalized);
    } catch (err: any) {
      setError(err.message || "Failed to fetch report");
    } finally {
      setLoading(false);
    }
  };

  // Print preview (Window Print)
  const printReport = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open("", "_blank", "width=900,height=600");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Patrol Report</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            h2 { text-align: center; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            tr:nth-child(even) { background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <h2>Patrol Report - Factory: ${factories.find(f => f.factory_code === factoryCode)?.factory_name || factoryCode}, Date: ${reportDate}</h2>
          ${printContents}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  // Prepare PDF (Trigger PDF Generation)
  const preparePDF = () => {
    if (!factoryCode || report.length === 0) {
      alert("Please fetch the report first.");
      return;
    }
    // Simply toggle the state to render the PDF component
    // The PDF component handles the grouping and generation internally
    setShowPDF(true);
  };

  // Find current factory details for display
  const currentFactory = factories.find((f) => f.factory_code === factoryCode);
  const factoryName = currentFactory?.factory_name || factoryCode;
  const factoryAddress = currentFactory?.factory_address || "N/A"; // Adjust based on actual API data

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Patrol Report</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
        <select
          className="border p-2 rounded"
          value={factoryCode}
          onChange={(e) => setFactoryCode(e.target.value)}
        >
          {factories.map((f) => (
            <option key={f.factory_code} value={f.factory_code}>
              {f.factory_name}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="border p-2 rounded"
          value={reportDate}
          onChange={(e) => setReportDate(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={fetchReport}
        >
          Fetch Report
        </button>

        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={printReport}
          disabled={report.length === 0}
        >
          Print Preview
        </button>

        <button
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          onClick={preparePDF}
          disabled={report.length === 0}
        >
          Download PDF
        </button>
      </div>

      {/* Loading / Error */}
      {loading && <p className="text-slate-600">Loading report...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Multi-round table */}
      {!loading && !error && report.length > 0 && (
        <div ref={printRef}>
          <ReportTable logs={report} loading={loading} />
        </div>
      )}

      {!loading && !error && report.length === 0 && <p className="text-slate-500">No records found for this date/factory.</p>}

      {/* PDF Component */}
      {/* This component renders null but triggers the download on mount/update */}
      {showPDF && (
        <PatrolReportPDF
          logs={report}
          factoryCode={factoryCode}
          factoryName={factoryName}
          factoryAddress={factoryAddress}
          reportDate={reportDate}
          generatedBy="System"
        />
      )}
    </div>
  );
}

