// D:\Security_verifier\client-app\security-verifier-client\app\components\reports\ReportExport.tsx
import React, { useState } from 'react';

interface ReportExportProps {
  reportType: string;
}

const ReportExport: React.FC<ReportExportProps> = ({ reportType }) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleExport = () => {
    // In a real application, this would trigger the export functionality
    // For this demo, we'll just show an alert
    alert(`Exporting ${reportType} as ${exportFormat.toUpperCase()}`);
    setIsDropdownOpen(false);
  };

  const getReportTypeName = () => {
    switch (reportType) {
      case 'scanCompliance':
        return 'Scan Compliance Report';
      case 'guardPerformance':
        return 'Guard Performance Report';
      case 'siteSecurity':
        return 'Site Security Report';
      case 'issuesIncidents':
        return 'Issues & Incidents Report';
      default:
        return 'Report';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        Export
      </button>
      
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
              Export <span className="font-medium">{getReportTypeName()}</span>
            </div>
            <div className="px-4 py-3">
              <div className="flex items-center mb-3">
                <input
                  id="csv"
                  name="export-format"
                  type="radio"
                  value="csv"
                  checked={exportFormat === 'csv'}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="csv" className="ml-2 block text-sm text-gray-700">
                  CSV (Comma Separated Values)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="pdf"
                  name="export-format"
                  type="radio"
                  value="pdf"
                  checked={exportFormat === 'pdf'}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="pdf" className="ml-2 block text-sm text-gray-700">
                  PDF (Portable Document Format)
                </label>
              </div>
            </div>
            <div className="px-4 py-3 border-t border-gray-100">
              <button
                onClick={handleExport}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Export Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportExport;