"use client";

import { useEffect, useState } from "react";
import { ScanPointsTable, ScanPoint } from "@/app/components/scan/ScanPointsTable";
import { ScanPointForm } from "@/app/components/scan/ScanPointForm";

import {
  getScanPointsByFactory,
  createScanPoint,
  updateScanPoint,
} from "@/api";

interface Factory {
  id: string;
  name: string;
}

export default function ScanPointsPage() {
  const [scanPoints, setScanPoints] = useState<ScanPoint[]>([]);
  const [factories, setFactories] = useState<Factory[]>([]);
  const [selectedFactory, setSelectedFactory] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingScanPoint, setEditingScanPoint] = useState<ScanPoint | null>(null);

  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [priorityFilter, setPriorityFilter] = useState<"All" | "Low" | "Medium" | "High">("All");

  /* ================= LOAD FACTORIES ================= */
  useEffect(() => {
    fetch("http://127.0.0.1:8000/factories/minimal")
      .then((res) => res.json())
      .then((data) => {
        setFactories(data);
        if (data.length > 0) setSelectedFactory(data[0].id);
      })
      .catch((err) => console.error("Failed to load factories:", err));
  }, []);

  /* ================= LOAD SCAN POINTS ================= */
  useEffect(() => {
    if (!selectedFactory) return;

    getScanPointsByFactory(selectedFactory)
      .then((data) => {
        setScanPoints(data || []);
      })
      .catch((err) => {
        console.error("Failed to load scan points:", err);
        setScanPoints([]);
      });
  }, [selectedFactory]);

  /* ================= FILTER ================= */
  const visibleScanPoints = scanPoints.filter((sp) => {
    if (statusFilter === "Active" && !sp.is_active) return false;
    if (statusFilter === "Inactive" && sp.is_active) return false;
    if (priorityFilter !== "All" && sp.risk_level !== priorityFilter) return false;
    return true;
  });

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Scan Points</h1>
        <button
          onClick={() => {
            setEditingScanPoint(null);
            setIsFormOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Scan Point
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex gap-4 mb-6">
        <select
          value={selectedFactory}
          onChange={(e) => setSelectedFactory(e.target.value)}
          className="border p-2 rounded"
        >
          {factories.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="border p-2 rounded"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as any)}
          className="border p-2 rounded"
        >
          <option value="All">All Risk Levels</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {/* TABLE */}
      <ScanPointsTable
        scanPoints={visibleScanPoints}
        onEdit={(sp) => {
          setEditingScanPoint(sp);
          setIsFormOpen(true);
        }}
        onDisable={async (id) => {
          try {
            const updated = await updateScanPoint(id, { is_active: false });
            setScanPoints((prev) =>
              prev.map((sp) => (sp.id === id ? { ...sp, ...updated } : sp))
            );
          } catch (err) {
            console.error("Failed to disable scan point:", err);
          }
        }}
      />

      {/* FORM */}
      {isFormOpen && (
        <ScanPointForm
          scanPoint={editingScanPoint}
          onClose={() => setIsFormOpen(false)}
          onSubmit={async (data) => {
            try {
              if (editingScanPoint) {
                const updated = await updateScanPoint(editingScanPoint.id, data);
                setScanPoints((prev) =>
                  prev.map((sp) => (sp.id === editingScanPoint.id ? { ...sp, ...updated } : sp))
                );
              } else {
                const created = await createScanPoint({ ...data, factory_id: selectedFactory });
                setScanPoints((prev) => [...prev, created]);
              }
            } catch (err) {
              console.error("Failed to save scan point:", err);
            } finally {
              setIsFormOpen(false);
              setEditingScanPoint(null);
            }
          }}
        />
      )}
    </div>
  );
}
