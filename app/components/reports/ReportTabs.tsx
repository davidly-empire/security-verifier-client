'use client';

import React from 'react';

interface ReportTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ReportTabs: React.FC<ReportTabsProps> = ({ activeTab, setActiveTab }) => {
  // ONLY showing Scan Compliance as requested
  const tabs = [
    { id: 'scanCompliance', label: 'Scan Compliance' },
  ];

  return (
    <div className="border-b border-slate-200">
      <nav className="-mb-px flex space-x-8 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
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