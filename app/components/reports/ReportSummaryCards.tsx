import React from "react";

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

interface ReportSummaryCardsProps {
  logs: ScanLog[];
}

const ReportSummaryCards: React.FC<ReportSummaryCardsProps> = ({ logs }) => {
  const totalRecords = logs.length;

  const successfulScans = logs.filter(
    (log) => log.status?.toLowerCase() === "success"
  ).length;

  const missedScans = logs.filter(
    (log) => log.status?.toLowerCase() === "missed"
  ).length;

  const criticalIssues = logs.filter(
    (log) => log.status?.toLowerCase() === "critical"
  ).length;

  const compliancePercentage =
    totalRecords === 0
      ? 0
      : Math.round((successfulScans / totalRecords) * 100);

  const summaryData = [
    {
      key: "totalRecords",
      title: "Total Records",
      value: totalRecords,
      color: "bg-blue-100 text-blue-800",
    },
    {
      key: "compliance",
      title: "Compliance %",
      value: compliancePercentage,
      color:
        compliancePercentage >= 90
          ? "bg-green-100 text-green-800"
          : compliancePercentage >= 70
          ? "bg-yellow-100 text-yellow-800"
          : "bg-red-100 text-red-800",
    },
    {
      key: "missedScans",
      title: "Missed Scans",
      value: missedScans,
      color:
        missedScans === 0
          ? "bg-green-100 text-green-800"
          : missedScans <= 3
          ? "bg-yellow-100 text-yellow-800"
          : "bg-red-100 text-red-800",
    },
    {
      key: "criticalIssues",
      title: "Critical Issues",
      value: criticalIssues,
      color:
        criticalIssues === 0
          ? "bg-green-100 text-green-800"
          : criticalIssues <= 3
          ? "bg-yellow-100 text-yellow-800"
          : "bg-red-100 text-red-800",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryData.map((item) => (
        <div
          key={item.key}
          className="bg-white p-4 rounded-lg shadow-sm"
        >
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${item.color}`}>
              <span className="text-2xl font-bold">{item.value}</span>
            </div>

            <div className="ml-4 w-full">
              <p className="text-sm font-medium text-gray-500">
                {item.title}
              </p>

              {item.key === "compliance" && (
                <div className="mt-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        compliancePercentage >= 90
                          ? "bg-green-500"
                          : compliancePercentage >= 70
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${compliancePercentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReportSummaryCards;
