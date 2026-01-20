"use client";

import { useState, useEffect } from "react";
import QrTable from "@/app/components/qr/QrTable";
import QrForm from "@/app/components/qr/QrForm";
import QrPreview from "@/app/components/qr/QrPreview";
import QrFilters from "@/app/components/qr/QrFilters";
import {
  fetchQRByFactory,
  createQR,
  updateQR,
  deleteQR,
  fetchFactories, // ✅ new API function
  QRData,
} from "@/app/api/qr.api";

// ----------------- Frontend QR type aligned with DB -----------------
export interface QRCode {
  qr_id: number;
  qr_name: string;
  lat?: number;
  lon?: number;
  status?: "active" | "inactive";
  created_at?: string;
  factory_code?: string;
}

// ----------------- Factory type -----------------
export interface Factory {
  factory_code: string;
  factory_name: string;
}

// ----------------- Constants -----------------
const token = "<PASTE_YOUR_ADMIN_JWT_HERE>"; // admin token

// ----------------- Main Component -----------------
export default function QrCrudPage() {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [filteredQrCodes, setFilteredQrCodes] = useState<QRCode[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentQr, setCurrentQr] = useState<QRCode | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [filters, setFilters] = useState({ status: "All", search: "" });
  const [factories, setFactories] = useState<Factory[]>([]);

  // ----------------- Mapping -----------------
  const mapQRDataToQRCode = (data: QRData): QRCode => ({
    qr_id: Number(data.qr_id),
    qr_name: data.qr_name,
    lat: data.lat ?? 0,
    lon: data.lon ?? 0,
    status: (data.status as "active" | "inactive") || "inactive",
    created_at: data.created_at,
    factory_code: data.factory_code,
  });

  const mapQRCodeToQRData = (qr: Partial<QRCode>): QRData => ({
    qr_id: qr.qr_id!,
    qr_name: qr.qr_name!,
    lat: qr.lat ?? 0,
    lon: qr.lon ?? 0,
    status: qr.status ?? "active",
    factory_code: qr.factory_code ?? factories[0]?.factory_code ?? "",
  });

  // ----------------- Load QR Codes -----------------
  const loadQRCodes = async (factoryCode: string) => {
    try {
      const data: QRData[] = await fetchQRByFactory(factoryCode, token);
      setQrCodes(data.map(mapQRDataToQRCode));
    } catch (err) {
      console.error("Failed to load QR codes:", err);
    }
  };

  // ----------------- Load Factories -----------------
  const loadFactories = async () => {
    try {
      const data: Factory[] = await fetchFactories(token);
      setFactories(data);

      // Load QR codes for the first factory by default
      if (data.length > 0) loadQRCodes(data[0].factory_code);
    } catch (err) {
      console.error("Failed to load factories:", err);
    }
  };

  useEffect(() => {
    loadFactories();
  }, []);

  // ----------------- Filters -----------------
  useEffect(() => {
    let filtered = [...qrCodes];

    if (filters.status !== "All") filtered = filtered.filter((qr) => qr.status === filters.status);
    if (filters.search) {
      const term = filters.search.toLowerCase();
      filtered = filtered.filter(
        (qr) =>
          qr.qr_name.toLowerCase().includes(term) ||
          qr.qr_id.toString().includes(term)
      );
    }

    setFilteredQrCodes(filtered);
  }, [qrCodes, filters]);

  // ----------------- Handlers -----------------
  const handleAddQr = () => {
    setCurrentQr(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const handleEditQr = (qr: QRCode) => {
    setCurrentQr(qr);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleViewQr = (qr: QRCode) => {
    setCurrentQr(qr);
    setIsPreviewOpen(true);
  };

  const handleSaveQr = async (qrData: Partial<QRCode>) => {
    try {
      if (isEditMode && currentQr) {
        const updated = await updateQR(currentQr.qr_id, mapQRCodeToQRData(qrData), token);
        setQrCodes(qrCodes.map((qr) => (qr.qr_id === currentQr.qr_id ? mapQRDataToQRCode(updated) : qr)));
      } else {
        const created = await createQR(mapQRCodeToQRData(qrData), token);
        setQrCodes([...qrCodes, mapQRDataToQRCode(created)]);
      }
      setIsFormOpen(false);
    } catch (err: any) {
      console.error("Save QR failed:", err);
      alert(err.message || "Failed to save QR");
    }
  };

  const handleToggleStatus = (id: number) => {
    const qr = qrCodes.find((q) => q.qr_id === id);
    if (!qr) return;
    handleSaveQr({ qr_id: id, status: qr.status === "active" ? "inactive" : "active" });
  };

  const handleDeleteQr = (id: number) => {
    if (!confirm("Are you sure you want to delete this QR?")) return;
    deleteQR(id, token)
      .then(() => setQrCodes(qrCodes.filter((q) => q.qr_id !== id)))
      .catch((err) => {
        console.error("Delete QR failed:", err);
        alert("Failed to delete QR");
      });
  };

  // ----------------- Render -----------------
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">QR Codes</h1>
          <button
            onClick={handleAddQr}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add QR
          </button>
        </div>

        {/* Filters */}
        <QrFilters filters={filters} setFilters={setFilters} />

        {/* Table */}
        <QrTable
          qrCodes={filteredQrCodes}
          onEdit={handleEditQr}
          onView={handleViewQr}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDeleteQr}
        />

        {/* Form Modal */}
        {isFormOpen && (
          <QrForm
            qr={currentQr}
            factories={factories} // ✅ pass factories
            isEditMode={isEditMode}
            onSave={handleSaveQr}
            onClose={() => setIsFormOpen(false)}
          />
        )}

        {/* Preview Modal */}
        {isPreviewOpen && currentQr && <QrPreview qr={currentQr} onClose={() => setIsPreviewOpen(false)} />}
      </div>
    </div>
  );
}
