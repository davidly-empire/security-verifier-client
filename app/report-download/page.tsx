// D:\Security_verifier\client-app\security-verifier-client\app\report download\page.tsx
'use client';

import React, { useState } from 'react';
import ReportTabs from '@/app/components/reports/ReportTabs';
import ReportFilters from '@/app/components/reports/ReportFilters';
import ReportSummaryCards from '@/app/components/reports/ReportSummaryCards';
import ReportTable from '@/app/components/reports/ReportTable';
import ReportExport from '@/app/components/reports/ReportExport';

// Mock data for different report types
const mockScanComplianceData = [
  { id: 1, siteName: 'North Campus', routeName: 'Building A Patrol', guardName: 'John Smith', totalScanPoints: 15, completedScans: 14, missedScans: 1, lateScans: 0, compliancePercentage: 93 },
  { id: 2, siteName: 'South Campus', routeName: 'Parking Lot Check', guardName: 'Sarah Johnson', totalScanPoints: 10, completedScans: 8, missedScans: 2, lateScans: 1, compliancePercentage: 80 },
  { id: 3, siteName: 'East Campus', routeName: 'Perimeter Check', guardName: 'Michael Brown', totalScanPoints: 20, completedScans: 19, missedScans: 1, lateScans: 2, compliancePercentage: 95 },
  { id: 4, siteName: 'West Campus', routeName: 'Interior Patrol', guardName: 'Emily Davis', totalScanPoints: 12, completedScans: 12, missedScans: 0, lateScans: 0, compliancePercentage: 100 },
  { id: 5, siteName: 'North Campus', routeName: 'Building B Patrol', guardName: 'Robert Wilson', totalScanPoints: 18, completedScans: 16, missedScans: 2, lateScans: 1, compliancePercentage: 89 },
];

const mockGuardPerformanceData = [
  { id: 1, guardName: 'John Smith', assignedRoutes: 3, totalScans: 45, missedScans: 3, issuesReported: 2, onTimeScanPercentage: 93 },
  { id: 2, guardName: 'Sarah Johnson', assignedRoutes: 2, totalScans: 30, missedScans: 5, issuesReported: 1, onTimeScanPercentage: 83 },
  { id: 3, guardName: 'Michael Brown', assignedRoutes: 4, totalScans: 60, missedScans: 2, issuesReported: 3, onTimeScanPercentage: 97 },
  { id: 4, guardName: 'Emily Davis', assignedRoutes: 2, totalScans: 24, missedScans: 0, issuesReported: 0, onTimeScanPercentage: 100 },
  { id: 5, guardName: 'Robert Wilson', assignedRoutes: 3, totalScans: 42, missedScans: 4, issuesReported: 2, onTimeScanPercentage: 90 },
];

const mockSiteSecurityData = [
  { id: 1, siteName: 'North Campus', guardsAssigned: 5, patrolsCompleted: 28, issuesReported: 3, emergencyAlerts: 1, missedScans: 7 },
  { id: 2, siteName: 'South Campus', guardsAssigned: 3, patrolsCompleted: 15, issuesReported: 2, emergencyAlerts: 0, missedScans: 5 },
  { id: 3, siteName: 'East Campus', guardsAssigned: 4, patrolsCompleted: 22, issuesReported: 4, emergencyAlerts: 2, missedScans: 3 },
  { id: 4, siteName: 'West Campus', guardsAssigned: 2, patrolsCompleted: 12, issuesReported: 1, emergencyAlerts: 0, missedScans: 2 },
];

const mockIssuesIncidentsData = [
  { id: 1, issueType: 'Unauthorized Access', severity: 'High', site: 'North Campus', location: 'Building A, Floor 3', reportedBy: 'John Smith', status: 'Open' },
  { id: 2, issueType: 'Equipment Malfunction', severity: 'Medium', site: 'South Campus', location: 'Parking Lot A', reportedBy: 'Sarah Johnson', status: 'Resolved' },
  { id: 3, issueType: 'Suspicious Activity', severity: 'High', site: 'East Campus', location: 'Perimeter Gate B', reportedBy: 'Michael Brown', status: 'Open' },
  { id: 4, issueType: 'Fire Alarm', severity: 'Critical', site: 'West Campus', location: 'Building C, Floor 1', reportedBy: 'Emily Davis', status: 'Resolved' },
  { id: 5, issueType: 'Medical Emergency', severity: 'Critical', site: 'North Campus', location: 'Building B, Cafeteria', reportedBy: 'Robert Wilson', status: 'Resolved' },
  { id: 6, issueType: 'Theft', severity: 'High', site: 'South Campus', location: 'Storage Room', reportedBy: 'Sarah Johnson', status: 'Open' },
];

const ReportDownloadPage = () => {
  const [activeTab, setActiveTab] = useState('scanCompliance');
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    site: '',
    route: '',
    guard: ''
  });

  // Get the appropriate data based on the active tab
  const getReportData = () => {
    switch (activeTab) {
      case 'scanCompliance':
        return mockScanComplianceData;
      case 'guardPerformance':
        return mockGuardPerformanceData;
      case 'siteSecurity':
        return mockSiteSecurityData;
      case 'issuesIncidents':
        return mockIssuesIncidentsData;
      default:
        return [];
    }
  };

  // Calculate summary data based on the active report
  const getSummaryData = () => {
    const data = getReportData();
    
    switch (activeTab) {
      case 'scanCompliance':
        return {
          totalRecords: data.length,
          compliancePercentage: Math.round(data.reduce((sum, item) => sum + item.compliancePercentage, 0) / data.length),
          missedScans: data.reduce((sum, item) => sum + item.missedScans, 0),
          criticalIssues: 0 // Not applicable for this report type
        };
      case 'guardPerformance':
        return {
          totalRecords: data.length,
          compliancePercentage: Math.round(data.reduce((sum, item) => sum + item.onTimeScanPercentage, 0) / data.length),
          missedScans: data.reduce((sum, item) => sum + item.missedScans, 0),
          criticalIssues: 0 // Not applicable for this report type
        };
      case 'siteSecurity':
        return {
          totalRecords: data.length,
          compliancePercentage: Math.round((data.reduce((sum, item) => sum + item.patrolsCompleted, 0) / 
            (data.reduce((sum, item) => sum + item.patrolsCompleted, 0) + data.reduce((sum, item) => sum + item.missedScans, 0))) * 100),
          missedScans: data.reduce((sum, item) => sum + item.missedScans, 0),
          criticalIssues: data.reduce((sum, item) => sum + item.emergencyAlerts, 0)
        };
      case 'issuesIncidents':
        return {
          totalRecords: data.length,
          compliancePercentage: Math.round((data.filter(item => item.status === 'Resolved').length / data.length) * 100),
          missedScans: 0, // Not applicable for this report type
          criticalIssues: data.filter(item => item.severity === 'Critical').length
        };
      default:
        return {
          totalRecords: 0,
          compliancePercentage: 0,
          missedScans: 0,
          criticalIssues: 0
        };
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Reports</h1>
        
        <ReportTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="mt-6">
          <ReportFilters filters={filters} setFilters={setFilters} />
        </div>
      </div>
      
      <div className="mb-6">
        <ReportSummaryCards summaryData={getSummaryData()} reportType={activeTab} />
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <ReportTable data={getReportData()} reportType={activeTab} />
      </div>
      
      <div className="flex justify-end">
        <ReportExport reportType={activeTab} />
      </div>
    </div>
  );
};

export default ReportDownloadPage;