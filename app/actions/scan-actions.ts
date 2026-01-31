'use server'; // <--- THIS IS CRITICAL. It tells Next.js to run this ONLY on the server.

import { Pool } from 'pg';

// 1. Setup Database Connection
// Ensure your .env file has DATABASE_URL defined
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
});

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
 * Get all scan logs (Server Action)
 */
export const getAllScanLogs = async (): Promise<ScanLog[]> => {
  try {
    const res = await pool.query('SELECT * FROM public.scanning_details ORDER BY scan_time DESC');
    return res.rows;
  } catch (error) {
    console.error("Error fetching scan logs:", error);
    return [];
  }
};

/**
 * Get scan logs by factory (Server Action)
 */
export const getScanLogsByFactory = async (
  factoryCode: string
): Promise<ScanLog[]> => {
  try {
    const query = 'SELECT * FROM public.scanning_details WHERE factory_code = $1 ORDER BY scan_time DESC';
    const res = await pool.query(query, [factoryCode]);
    return res.rows;
  } catch (error) {
    console.error(`Error fetching logs for factory ${factoryCode}:`, error);
    return [];
  }
};