'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts';

/* ---------- Types ---------- */

interface AttendanceTrend {
  date: string;
  present: number;
}

interface CompletionTrend {
  date: string;
  completionPercentage: number;
}

interface HeatmapPoint {
  day: string;
  hour: string;
  value: number;
}

interface SeverityData {
  severity: string;
  count: number;
}

interface DashboardPerformanceChartsProps {
  attendanceData: AttendanceTrend[];
  completionData: CompletionTrend[];
}

/* ---------- Mock Analytics Data (TEMP) ---------- */

const heatmapData: HeatmapPoint[] = [
  { day: 'Mon', hour: '6-8', value: 6 },
  { day: 'Mon', hour: '8-10', value: 3 },
  { day: 'Tue', hour: '6-8', value: 4 },
  { day: 'Wed', hour: '6-8', value: 2 },
  { day: 'Thu', hour: '8-10', value: 5 },
  { day: 'Fri', hour: '6-8', value: 7 },
];

const severityData: SeverityData[] = [
  { severity: 'Low', count: 6 },
  { severity: 'Medium', count: 4 },
  { severity: 'High', count: 3 },
  { severity: 'Critical', count: 2 },
];

/* ---------- Component ---------- */

export default function DashboardPerformanceCharts({
  attendanceData,
  completionData,
}: DashboardPerformanceChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* ===== Attendance Trend ===== */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          Attendance Trend
        </h3>
        <div className="w-full h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="present" strokeWidth={2} dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===== Rounds Completion % ===== */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          Rounds Completion %
        </h3>
        <div className="w-full h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={completionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="completionPercentage" strokeWidth={2} fillOpacity={0.25} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===== Late Check-in Heatmap ===== */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          Late Check-ins Heatmap
        </h3>
        <div className="w-full h-40">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <XAxis dataKey="hour" type="category" tick={{ fontSize: 11 }} />
              <YAxis dataKey="day" type="category" tick={{ fontSize: 11 }} />
              <ZAxis dataKey="value" range={[50, 300]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={heatmapData} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===== Issues by Severity ===== */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          Issues by Severity
        </h3>
        <div className="w-full h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={severityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="severity" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
