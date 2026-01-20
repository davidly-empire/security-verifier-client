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
  fetchFactories,
  QRData,
} from "@/app/api/qr.api";

// ----------------- TYPES -----------------

// We use QRData from the API to ensure 100% compatibility.
export type QRCode = QRData;

export interface Factory {
  factory_code: string;
  factory_name: string;
}

// ----------------- MAIN COMPONENT -----------------
export default function QrCrudPage() {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [filteredQrCodes, setFilteredQrCodes] = useState<QRCode[]>([]);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentQr, setCurrentQr] = useState<QRCode | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [factories, setFactories] = useState<Factory[]>([]);
  const [selectedFactory, setSelectedFactory] = useState<string>("");

  // ----------------- DATA MAPPING -----------------
  const normalizeQR = (data: any): QRCode => ({
    qr_id: Number(data.qr_id),
    qr_name: data.qr_name || "Unnamed QR",
    lat: typeof data.lat === 'number' ? data.lat : 0,
    lon: typeof data.lon === 'number' ? data.lon : 0,
    status: data.status || "inactive", 
    created_at: data.created_at,
    factory_code: data.factory_code || "",
  });

  // ----------------- LOAD DATA -----------------
  const loadQRCodes = async (factoryCode: string) => {
    try {
      const rawData: any[] = await fetchQRByFactory(factoryCode);
      const mappedData = rawData.map(normalizeQR);
      setQrCodes(mappedData); 
    } catch (err) {
      console.error("Failed to load QR codes:", err);
      setQrCodes([]);
    }
  };

  const loadFactories = async () => {
    try {
      const data: Factory[] = await fetchFactories();
      setFactories(data);

      if (data.length > 0) {
        const firstFactory = data[0].factory_code;
        setSelectedFactory(firstFactory);
        loadQRCodes(firstFactory);
      }
    } catch (err) {
      console.error("Failed to load factories:", err);
    }
  };

  useEffect(() => {
    loadFactories();
  }, []);

  // ----------------- FILTERING -----------------
  useEffect(() => {
    setFilteredQrCodes(qrCodes);
  }, [qrCodes]);

  // ----------------- HANDLERS -----------------
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

  const handleSaveQr = async (qrData: QRCode) => {
    try {
      // Prepare API payload
      const apiData: any = {
        qr_name: qrData.qr_name,
        lat: Number(qrData.lat),
        lon: Number(qrData.lon),
        factory_code: qrData.factory_code,
        status: qrData.status || "inactive",
      };

      // ----------------------------------------------------
      // CRITICAL FIX: Remove qr_id if creating NEW record
      // This prevents "duplicate key value violates unique constraint" error
      // ----------------------------------------------------
      if (!isEditMode) {
        delete apiData.qr_id; 
      }

      if (isEditMode && currentQr) {
        await updateQR(currentQr.qr_id, apiData);
        const updatedList = qrCodes.map((qr) => 
          qr.qr_id === currentQr.qr_id ? qrData : qr
        );
        setQrCodes(updatedList);
      } else {
        await createQR(apiData);
        if(selectedFactory) loadQRCodes(selectedFactory);
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
    
    const newStatus = qr.status === "active" ? "inactive" : "active";
    
    handleSaveQr({ 
      ...qr, 
      status: newStatus
    });
  };

  const handleDeleteQr = (id: number) => {
    if (!confirm("Are you sure you want to delete this QR?")) return;
    deleteQR(id)
      .then(() => {
        setQrCodes(qrCodes.filter((q) => q.qr_id !== id));
      })
      .catch((err) => {
        console.error("Delete QR failed:", err);
        alert("Failed to delete QR");
      });
  };

  // ----------------- RENDER -----------------
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
        <div className="mb-4">
           <QrFilters 
              value={selectedFactory} 
              onChange={(code) => {
                  setSelectedFactory(code);
                  loadQRCodes(code);
              }} 
              factories={factories} 
           />
        </div>

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
            factories={factories}
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