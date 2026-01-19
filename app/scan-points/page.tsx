"use client";

import { useEffect, useState } from "react";
import { ScanPointsTable } from "@/app/components/scan/ScanPointsTable";
import { ScanPointForm } from "@/app/components/scan/ScanPointForm";
import {
  getScanPointsByFactory,
  createScanPoint,
  updateScanPoint,
} from "@/api";

interface ScanPoint {
  id: string;
  name: string;
  code: string;
  location: {
    building: string;
    area: string;
    floor: string;
  };
  status: "Active" | "Inactive";
  sequenceOrder: number;
  required: boolean;
  patrolLogic: {
    expectedScanTimeWindow: {
      from: string;
      to: string;
    };
    minimumTimeGap: number;
  };
  validationControls: {
    gpsValidation: boolean;
    allowedRadius: number;
    scanCooldown: number;
    offlineScanAllowed: boolean;
  };
  issueReporting: {
    allowIssueReporting: boolean;
    issueTypes: string[];
    photoRequired: "Yes" | "Optional" | "No";
  };
  tracking: {
    lastScannedAt: string;
    lastScannedBy: string;
    totalScans: number;
    missedScans: number;
  };
  adminControls: {
    assignedRoute: string;
    priorityLevel: "Low" | "Medium" | "High";
  };
}

export default function ScanPointsPage() {
  const [scanPoints, setScanPoints] = useState<ScanPoint[]>([]);
  const [filteredScanPoints, setFilteredScanPoints] = useState<ScanPoint[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingScanPoint, setEditingScanPoint] =
    useState<ScanPoint | null>(null);

  const [statusFilter, setStatusFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  /* =========================
     FETCH FROM BACKEND
  ========================== */
  useEffect(() => {
    const factoryId = 1; // TODO: replace with selected factory later

    getScanPointsByFactory(factoryId)
      .then((res) => {
        setScanPoints(res.data);
        setFilteredScanPoints(res.data);
      })
      .catch((err) => {
        console.error("Failed to load scan points", err);
      });
  }, []);

  /* =========================
     FILTER LOGIC (UNCHANGED)
  ========================== */
  useEffect(() => {
    let data = [...scanPoints];

    if (statusFilter !== "All") {
      data = data.filter((sp) => sp.status === statusFilter);
    }

    if (locationFilter !== "All") {
      data = data.filter(
        (sp) =>
          `${sp.location.building} - ${sp.location.area}` === locationFilter
      );
    }

    if (priorityFilter !== "All") {
      data = data.filter(
        (sp) => sp.adminControls.priorityLevel === priorityFilter
      );
    }

    setFilteredScanPoints(data);
  }, [scanPoints, statusFilter, locationFilter, priorityFilter]);

  const uniqueLocations = Array.from(
    new Set(
      scanPoints.map(
        (sp) => `${sp.location.building} - ${sp.location.area}`
      )
    )
  );

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Scan Points</h1>
        <button
          onClick={() => {
            setEditingScanPoint(null);
            setIsFormOpen(true);
          }}
          className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Scan Point
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="All">All Locations</option>
          {uniqueLocations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="All">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <ScanPointsTable
        scanPoints={filteredScanPoints}
        onEdit={setEditingScanPoint}
        onDisable={async (id) => {
          try {
            await updateScanPoint(id, { status: "Inactive" });

            setScanPoints((prev) =>
              prev.map((sp) =>
                sp.id === id ? { ...sp, status: "Inactive" } : sp
              )
            );
          } catch (err) {
            console.error("Failed to disable scan point", err);
          }
        }}
      />

      {isFormOpen && (
        <ScanPointForm
          scanPoint={editingScanPoint}
          onClose={() => setIsFormOpen(false)}
          onSubmit={async (data) => {
            try {
              if (editingScanPoint) {
                const res = await updateScanPoint(
                  editingScanPoint.id,
                  data
                );

                setScanPoints((prev) =>
                  prev.map((sp) =>
                    sp.id === editingScanPoint.id ? res.data : sp
                  )
                );
              } else {
                const res = await createScanPoint(data);
                setScanPoints((prev) => [...prev, res.data]);
              }

              setIsFormOpen(false);
              setEditingScanPoint(null);
            } catch (err) {
              console.error("Failed to save scan point", err);
            }
          }}
        />
      )}
    </div>
  );
}
