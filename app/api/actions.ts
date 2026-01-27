"use server";

// Import the type from your patrolApi file
import { PatrolReportResponse } from "./patrolApi";

export async function fetchPatrolReport(factoryCode: string, date: string) {
  const baseUrl = "http://127.0.0.1:8000";
  
  try {
    const res = await fetch(
      `${baseUrl}/api/report/patrol?factory_code=${factoryCode}&date=${date}`,
      {
        cache: "no-store", // Ensures fresh data every time
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      return { error: "Failed to fetch data from server" };
    }

    const data: PatrolReportResponse = await res.json();
    return { success: true, data };

  } catch (error) {
    console.error("Error fetching patrol report:", error);
    return { error: "An unexpected error occurred" };
  }
}