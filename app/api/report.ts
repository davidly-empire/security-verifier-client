import axios from "axios";

// -----------------------------
// Types
// -----------------------------
export interface PatrolReportItem {
  qr_name: string;
  round: number;
  scan_time: string | null;
  lat: string | null;
  log: string | null;
  guard_name: string | null;
  status: "SUCCESS" | "FAILED";
}

// In case backend sends wrapped response
interface WrappedResponse {
  success?: boolean;
  data?: PatrolReportItem[];
  message?: string;
}

// -----------------------------
// API Config
// -----------------------------
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// -----------------------------
// API Function
// -----------------------------
export async function getPatrolReport(
  factoryCode: string,
  reportDate: string
): Promise<PatrolReportItem[]> {
  try {
    const response = await axios.get<PatrolReportItem[] | WrappedResponse>(
      `${BASE_URL}/report/download`,
      {
        params: {
          factory_code: factoryCode,
          report_date: reportDate,
        },
      }
    );

    const result = response.data;

    // ✅ Case 1: backend returns ARRAY directly
    if (Array.isArray(result)) {
      return result;
    }

    // ✅ Case 2: backend returns { success, data }
    if (result && Array.isArray(result.data)) {
      return result.data;
    }

    console.error("❌ Unexpected patrol report response:", result);
    return [];
  } catch (error: any) {
    console.error(
      "❌ Error fetching patrol report:",
      error?.response?.data || error.message
    );
    throw error;
  }
}
