"use client";

import { useState, useEffect, useRef, useMemo } from "react";

import { getPatrolReport, PatrolReportItem } from "../api/report";
import { getFactories } from "../api/factories.api";

import PatrolReportPDF from "../components/reports/PatrolReportPDF";
import ReportTable from "../components/reports/ReportTable";


// ================= TYPES =================
type Factory = {
  factory_code: string;
  factory_name: string;
  factory_address: string | null; // IMPORTANT
};



// ================= COMPONENT =================
export default function ReportDownloadPage() {

  // ---------------- STATE ----------------
  const [factories, setFactories] = useState<Factory[]>([]);
  const [factoryCode, setFactoryCode] = useState("");

  const [reportDate, setReportDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [report, setReport] = useState<PatrolReportItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [pdfTrigger, setPdfTrigger] = useState<number | null>(null);

  const printRef = useRef<HTMLDivElement>(null);


// ================= LOAD FACTORIES =================
useEffect(() => {

  const loadFactories = async () => {
    try {

      const res = await getFactories();

      if (res?.data?.length) {

        console.log("🏭 FACTORIES FROM API:", res.data); // DEBUG

        setFactories(res.data);
        setFactoryCode(res.data[0].factory_code);
      }

    } catch (err) {
      console.error("Factory load error:", err);
    }
  };

  loadFactories();

}, []);


// ================= DEBUG FACTORIES =================
useEffect(() => {
  console.log("📍 FACTORIES STATE:", factories);
}, [factories]);



  // ================= FETCH REPORT =================
  const fetchReport = async () => {

    if (!factoryCode) return;

    setPdfTrigger(null);
    setPdfLoading(false);

    setLoading(true);
    setError(null);

    try {

      const data = await getPatrolReport(factoryCode, reportDate);

      console.log("✅ REPORT DATA:", data);

      setReport(data);

    } catch (err: any) {

      console.error(err);

      setError(err?.message || "Failed to fetch report");

    } finally {

      setLoading(false);

    }
  };


  // ================= PRINT =================
  const printReport = () => {

    if (!printRef.current) return;

    const content = printRef.current.innerHTML;

    const win = window.open("", "_blank", "width=900,height=600");

    if (!win) return;


    const factoryName =
      factories.find((f) => f.factory_code === factoryCode)?.factory_name ||
      factoryCode;


    win.document.write(`
      <html>
        <head>
          <title>Patrol Report</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            table { width:100%; border-collapse: collapse; }
            th,td { border:1px solid #ccc; padding:8px; }
            th { background:#eee; }
          </style>
        </head>
        <body>
          <h2>${factoryName} - ${reportDate}</h2>
          ${content}
        </body>
      </html>
    `);

    win.document.close();
    win.print();
  };


  // ================= PDF =================
  const handleDownloadPdf = () => {

    if (!report.length) {
      alert("Please fetch report first");
      return;
    }

    console.log("📍 FACTORY ADDRESS:", factoryAddress); // DEBUG

    setPdfLoading(true);
    setPdfTrigger(Date.now());

    setTimeout(() => {
      setPdfLoading(false);
    }, 800);
  };


  // ================= FACTORY INFO =================
  const currentFactory = factories.find(
  (f) => f.factory_code === factoryCode
);

const factoryName =
  currentFactory?.factory_name || factoryCode;

const factoryAddress =
  currentFactory?.factory_address?.trim()
    ? currentFactory.factory_address
    : "N/A";




  // ================= CLEAN DATA =================
  const cleanLogs = useMemo(() => {

    return report.map((item) => ({

      ...item,

      lat: item.lat ?? undefined,
      lon: item.lon ?? undefined,
      guard_name: item.guard_name ?? undefined,

    }));

  }, [report]);


  // ================= UI =================
  return (
    <div className="min-h-screen bg-slate-50 p-6">

      <div className="max-w-7xl mx-auto space-y-6">


        {/* Title */}
        <h1 className="text-3xl font-bold text-slate-900">
          Patrol Report
        </h1>


        {/* Controls */}
        <div className="bg-white p-6 rounded shadow border">

          <div className="flex flex-wrap gap-4 items-end">


            {/* Factory */}
            <div className="flex-1 min-w-[200px]">

              <label className="block text-sm mb-1">
                Factory
              </label>

              <select
                className="w-full border p-2 rounded"
                value={factoryCode}
                onChange={(e) => setFactoryCode(e.target.value)}
              >
                {factories.map((f) => (
                  <option
                    key={f.factory_code}
                    value={f.factory_code}
                  >
                    {f.factory_name}
                  </option>
                ))}
              </select>

            </div>


            {/* Date */}
            <div className="flex-1 min-w-[200px]">

              <label className="block text-sm mb-1">
                Date
              </label>

              <input
                type="date"
                className="w-full border p-2 rounded"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
              />

            </div>


            {/* Buttons */}
            <div className="flex gap-2">


              {/* Fetch */}
              <button
                onClick={fetchReport}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded"
              >
                {loading ? "Fetching..." : "Fetch"}
              </button>


              {/* Print */}
              <button
                onClick={printReport}
                disabled={!report.length}
                className="border px-4 py-2 rounded"
              >
                Print
              </button>


              {/* PDF */}
              <button
                onClick={handleDownloadPdf}
                disabled={!report.length || pdfLoading}
                className="bg-purple-600 text-white px-4 py-2 rounded"
              >
                {pdfLoading ? "Generating..." : "Download PDF"}
              </button>

            </div>

          </div>

        </div>


        {/* Error */}
        {error && (

          <div className="text-red-600 bg-red-50 p-3 rounded">
            {error}
          </div>

        )}


        {/* Table */}
        <div className="bg-white p-6 rounded shadow border">

          {loading && <p>Loading...</p>}

          {!loading && cleanLogs.length > 0 && (

            <div ref={printRef}>
              <ReportTable logs={cleanLogs} />
            </div>

          )}

          {!loading && cleanLogs.length === 0 && (

            <p className="text-gray-500 text-center">
              No records found
            </p>

          )}

        </div>

      </div>


      {/* Hidden PDF */}
      {pdfTrigger && cleanLogs.length > 0 && (

        <div style={{ display: "none" }}>

          <PatrolReportPDF
            key={pdfTrigger}
            logs={cleanLogs}
            factoryCode={factoryCode}
            factoryName={factoryName}
            factoryAddress={factoryAddress}
            reportDate={reportDate}
            generatedBy="System"
          />

        </div>

      )}

    </div>
  );
}
