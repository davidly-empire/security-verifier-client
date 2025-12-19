'use client';

// app/page.tsx
import { KpiCards } from './components/home-ui/KpiCards';
import { ActiveAlerts } from './components/home-ui/ActiveAlerts';
import { TodaySnapshot } from './components/home-ui/TodaySnapshot';
import { RecentActivity } from './components/home-ui/RecentActivity';

// Mock data (unchanged)
const kpiData = {
  guardsOnDuty: 12,
  activePatrols: 8,
  missedScans: 3,
  emergencyAlerts: 1,
};

const alertsData = [
  { id: 1, type: 'Emergency', message: 'Unauthorized access detected at North Gate', time: '5 min ago', severity: 'critical' },
  { id: 2, type: 'Missed Scan', message: 'Guard #102 missed checkpoint B3', time: '15 min ago', severity: 'warning' },
  { id: 3, type: 'Missed Scan', message: 'Guard #104 missed checkpoint D1', time: '25 min ago', severity: 'warning' },
  { id: 4, type: 'System', message: 'Camera offline at South Entrance', time: '1 hour ago', severity: 'warning' },
  { id: 5, type: 'Emergency', message: 'Fire alarm triggered in Building A', time: '2 hours ago', severity: 'critical' },
];

const todaySnapshotData = {
  patrolsCompleted: 14,
  patrolsInProgress: 8,
  patrolsMissed: 3,
  avgScanCompliance: 92,
};

const recentActivityData = [
  { id: 1, time: '10:45 AM', type: 'Patrol Completed', guard: 'John Smith', description: 'Completed perimeter check with all scans verified' },
  { id: 2, time: '10:30 AM', type: 'Alert Resolved', guard: 'Admin', description: 'False alarm at Building B resolved' },
  { id: 3, time: '10:15 AM', type: 'Guard Check-in', guard: 'Mike Wilson', description: 'Started Parking Lot Security patrol' },
  { id: 4, time: '09:45 AM', type: 'Emergency Alert', guard: 'System', description: 'Unauthorized access attempt at North Gate' },
  { id: 5, time: '09:30 AM', type: 'Patrol Started', guard: 'Sarah Johnson', description: 'Started Building A Patrol route' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 flex flex-col gap-2 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-800">
            Security Operations Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Real-time overview of patrols, alerts, and system activity
          </p>
        </div>

        {/* KPI Section */}
        <section className="mb-8">
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <KpiCards data={kpiData} />
          </div>
        </section>

        {/* Active Alerts */}
        <section className="mb-8">
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">
                Active Alerts
              </h2>
              <span className="text-xs text-slate-500">Last 24h</span>
            </div>
            <ActiveAlerts alerts={alertsData} />
          </div>
        </section>

        {/* Today's Snapshot */}
        <section className="mb-8">
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">
                Today's Snapshot
              </h2>
              <span className="text-xs text-slate-500">Daily performance</span>
            </div>
            <TodaySnapshot data={todaySnapshotData} />
          </div>
        </section>

        {/* Recent Activity */}
        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">
              Recent Activity
            </h2>
            <span className="text-xs text-slate-500">System log</span>
          </div>
          <RecentActivity activities={recentActivityData} />
        </section>

      </div>
    </div>
  );
}
