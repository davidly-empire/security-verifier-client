"use client";

import { useState, useEffect } from "react";
import QRCodeLib from "qrcode";
import { QRData } from "@/app/api/qr.api";

interface Factory {
  factory_code: string;
  factory_name: string;
}

interface QrFormProps {
  qr: QRData | null;
  isEditMode: boolean;
  factories: Factory[]; // ✅ added factories prop
  onSave: (qrData: QRData) => void;
  onClose: () => void;
}

export default function QrForm({ qr, isEditMode, factories, onSave, onClose }: QrFormProps) {
  const [formData, setFormData] = useState<QRData>({
    qr_id: 0,
    qr_name: "",
    lat: 0,
    lon: 0,
    status: "active",
    created_at: "",
    factory_code: "",
  });

  const [qrImage, setQrImage] = useState<string | null>(null);

  // Load QR data if editing
  useEffect(() => {
    if (qr && isEditMode) {
      setFormData({
        qr_id: qr.qr_id,
        qr_name: qr.qr_name,
        lat: qr.lat ?? 0,
        lon: qr.lon ?? 0,
        status: qr.status || "active",
        created_at: qr.created_at || "",
        factory_code: qr.factory_code || "",
      });
    }
  }, [qr, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "lat" || name === "lon" || name === "qr_id" ? Number(value) : value,
    }));
  };

  const generateQr = async () => {
    const url = await QRCodeLib.toDataURL(JSON.stringify(formData), {
      width: 280,
      margin: 2,
    });
    setQrImage(url);
  };

  const downloadQr = () => {
    if (!qrImage) return;
    const link = document.createElement("a");
    link.href = qrImage;
    link.download = `${formData.qr_id || "qr-code"}.png`;
    link.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white w-[95vw] h-[90vh] rounded-lg p-6 flex gap-6">

        {/* LEFT: FORM */}
        <form onSubmit={handleSubmit} className="w-2/3 grid grid-cols-2 gap-4 content-start">
          <h3 className="col-span-2 text-xl font-semibold">
            {isEditMode ? "Edit QR Code" : "Add New QR Code"}
          </h3>

          {/* QR ID */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">QR ID</label>
            <input
              type="number"
              name="qr_id"
              placeholder="Auto-generated"
              value={formData.qr_id}
              onChange={handleChange}
              disabled={isEditMode}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* QR Name */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">QR Name</label>
            <input
              type="text"
              name="qr_name"
              placeholder="Enter QR name"
              value={formData.qr_name}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          {/* Latitude */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
            <input
              type="number"
              name="lat"
              step="any"
              placeholder="Enter latitude"
              value={formData.lat}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Longitude */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
            <input
              type="number"
              name="lon"
              step="any"
              placeholder="Enter longitude"
              value={formData.lon}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Status */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Factory Dropdown */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Factory</label>
            <select
              name="factory_code"
              value={formData.factory_code}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            >
              <option value="">Select Factory</option>
              {factories.map((f) => (
                <option key={f.factory_code} value={f.factory_code}>
                  {f.factory_name} ({f.factory_code})
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex gap-3 mt-4">
            <button
              type="button"
              onClick={generateQr}
              className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Generate QR
            </button>

            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              {isEditMode ? "Update" : "Save"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 border py-2 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* RIGHT: QR PREVIEW */}
        <div className="w-1/3 border rounded-lg flex flex-col items-center justify-center gap-4 p-4">
          {qrImage ? (
            <>
              <img src={qrImage} className="w-64 border p-2" />
              <button
                onClick={downloadQr}
                className="w-full bg-blue-600 text-white py-2 rounded mt-2 hover:bg-blue-700"
              >
                Download QR
              </button>
            </>
          ) : (
            <p className="text-gray-500 text-center">Generate QR to preview</p>
          )}
        </div>

      </div>
    </div>
  );
}
