// FIXED IMPORT: Ensuring we import the default export from the correct file
import axiosClient from "./axiosClient.js";

/* =====================================================
   TYPES
===================================================== */

export interface AnalyticsOverview {
  total_scans: number;
  active_guards: number;
  inactive_guards: number;
  missed_scans: number;
}

export interface GuardScan {
  guard_name: string;
  scan_count: number;
}

export interface MissedScansResponse {
  factory_code: string;
  missed_scan_count: number;
  missed_scan_points: string[];
}

/* =====================================================
   NEW: Guard Performance Types
===================================================== */

export interface MissedRoundDetail {
  expected_time: string;
  status: "MISSED";
}

export interface GuardPerformance {
  guard_name: string;
  total_expected: number;
  missed_count: number;
  on_time_count: number;
  efficiency: number;
  missed_details: MissedRoundDetail[];
}

export interface GuardPerformanceResponse {
  date: string;
  total_guards_analyzed: number;
  report: GuardPerformance[];
}

/* =====================================================
   API CALLS
===================================================== */

/**
 * 🔹 Dashboard overview KPIs
 */
export const getAnalyticsOverview = async (): Promise<AnalyticsOverview> => {
  const response = await axiosClient.get("/analytics/overview");
  return response.data;
};

/**
 * 🔹 Scans grouped by guard
 */
export const getScansByGuard = async (): Promise<GuardScan[]> => {
  const response = await axiosClient.get("/analytics/scans-by-guard");
  return response.data;
};

/**
 * 🔹 Missed scan points by factory
 */
export const getMissedScans = async (
  factoryCode: string
): Promise<MissedScansResponse> => {
  const response = await axiosClient.get("/analytics/missed-scans", {
    params: { factory_code: factoryCode },
  });
  return response.data;
};

/**
 * 🔹 Guard Performance Report (Missed vs On-Time)
 * 
 * Calculates compliance based on time windows:
 * - Day (6AM - 9PM): Every 1 Hour
 * - Night (9PM - 5:30AM): Every 30 Mins
 * 
 * Pass date in format YYYY-MM-DD
 */
export const getGuardPerformance = async (
  date: string
): Promise<GuardPerformanceResponse> => {
  const response = await axiosClient.get("/analytics/guard-performance", {
    params: { target_date: date },
  });
  return response.data;
};