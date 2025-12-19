// D:\Security_verifier\client-app\security-verifier-client\app\components\reports\ReportTabs.tsx
import React from 'react';

interface ReportTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ReportTabs: React.FC<ReportTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'scanCompliance', label: 'Scan Compliance Report' },
    { id: 'guardPerformance', label: 'Guard Performance Report' },
    { id: 'siteSecurity', label: 'Site Security Report' },
    { id: 'issuesIncidents', label: 'Issues & Incidents Report' }
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default ReportTabs;
