import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

/**
 * Scan Log (DB aligned)
 */
export interface ScanLog {
  id: number;
  guard_name?: string;
  qr_id?: string;
  qr_name?: string;
  lat?: number;
  log?: number;
  status?: string;
  factory_code?: string;
  scan_time: string;
}

/**
 * Get all scan logs
 */
export const getAllScanLogs = async (): Promise<ScanLog[]> => {
  const res = await axios.get(`${API_BASE}/scans`);
  return res.data;
};

/**
 * Get scan logs by factory
 */
export const getScanLogsByFactory = async (
  factoryCode: string
): Promise<ScanLog[]> => {
  const res = await axios.get(
    `${API_BASE}/scans/factory/${factoryCode}`
  );
  return res.data;
};
