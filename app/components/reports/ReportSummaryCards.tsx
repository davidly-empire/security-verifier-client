// D:\Security_verifier\client-app\security-verifier-client\app\components\reports\ReportSummaryCards.tsx
import React from 'react';

interface ReportSummaryCardsProps {
  summaryData: {
    totalRecords: number;
    compliancePercentage: number;
    missedScans: number;
    criticalIssues: number;
  };
  reportType: string;
}

const ReportSummaryCards: React.FC<ReportSummaryCardsProps> = ({ summaryData, reportType }) => {
  const getCardTitle = (key: string) => {
    switch (key) {
      case 'totalRecords':
        return reportType === 'issuesIncidents' ? 'Total Incidents' : 'Total Records';
      case 'compliancePercentage':
        return reportType === 'issuesIncidents' ? 'Resolution Rate' : 'Compliance %';
      case 'missedScans':
        return 'Missed Scans';
      case 'criticalIssues':
        return 'Critical Issues';
      default:
        return '';
    }
  };

  const getCardColor = (key: string, value: number) => {
    if (key === 'compliancePercentage') {
      return value >= 90 ? 'bg-green-100 text-green-800' : value >= 70 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';
    }
    if (key === 'missedScans' || key === 'criticalIssues') {
      return value === 0 ? 'bg-green-100 text-green-800' : value <= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';
    }
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Object.entries(summaryData).map(([key, value]) => (
        <div key={key} className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${getCardColor(key, value)}`}>
              <span className="text-2xl font-bold">{value}</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{getCardTitle(key)}</p>
              {key === 'compliancePercentage' && (
                <div className="mt-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        value >= 90 ? 'bg-green-500' : value >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${value}%` }}
                    ></div>
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