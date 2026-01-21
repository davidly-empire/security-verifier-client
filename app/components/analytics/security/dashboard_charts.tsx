"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// 1️⃣ ACTIVITY DATA
const scanActivityData = [
  { time: "06:00", scans: 12 },
  { time: "07:00", scans: 18 },
  { time: "08:00", scans: 15 },
  { time: "09:00", scans: 22 },
  { time: "10:00", scans: 20 },
  { time: "11:00", scans: 25 },
  { time: "12:00", scans: 5 }, 
  { time: "13:00", scans: 18 },
  { time: "14:00", scans: 20 },
  { time: "15:00", scans: 22 },
  { time: "16:00", scans: 19 },
  { time: "17:00", scans: 24 },
  { time: "18:00", scans: 16 },
  { time: "19:00", scans: 14 },
  { time: "20:00", scans: 18 },
  { time: "21:00", scans: 12 }, 
  { time: "22:00", scans: 8 },   
  { time: "23:00", scans: 4 },
  { time: "00:00", scans: 2 },
  { time: "01:00", scans: 3 },
  { time: "02:00", scans: 5 },
  { time: "03:00", scans: 2 },
  { time: "04:00", scans: 1 },
  { time: "05:00", scans: 2 },
];

// 2️⃣ GUARD DATA
const guardPerformanceData = [
  { name: "James", scans: 45 },
  { name: "Stephen", scans: 38 },
  { name: "Robert", scans: 52 },
  { name: "Sarah", scans: 41 },
  { name: "Emily", scans: 28 }, 
  { name: "Mike", scans: 35 },
  { name: "David", scans: 48 },
];

export default function DashboardCharts({ type }: { type: "activity" | "guard" }) {
  return (
    <div className="h-full w-full">
      {type === "activity" ? (
        // 🥇 LINE CHART
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={scanActivityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              stroke="#9ca3af"
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              stroke="#9ca3af"
            />
            <Tooltip 
              contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  color: '#fff', 
                  borderRadius: '8px',
                  border: 'none' 
                }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="scans" 
              stroke="#2563eb" 
              strokeWidth={3} 
              dot={{ fill: '#2563eb', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        // 🥈 BAR CHART
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={guardPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              stroke="#9ca3af"
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              stroke="#9ca3af"
            />
            <Tooltip 
              contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  color: '#fff', 
                  borderRadius: '8px',
                  border: 'none' 
                }}
            />
            <Legend />
            <Bar dataKey="scans" fill="#4f46e5" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}