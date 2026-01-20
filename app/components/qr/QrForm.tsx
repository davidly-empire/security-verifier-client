"use client";

import { useState, useEffect } from "react";
import { QRCode, Factory } from "@/app/dashboard/qr-crud/page";

// CORRECTED INTERFACE: Includes 'qr', 'isEditMode', 'onSave', 'onClose'
interface QrFormProps {
  qr: QRCode | null;
  factories: Factory[];
  isEditMode: boolean;
  onSave: (qrData: QRCode) => Promise<void>;
  onClose: () => void;
}

export default function QrForm({ qr, factories, isEditMode, onSave, onClose }: QrFormProps) {
  // Initialize form state
  const [formData, setFormData] = useState<QRCode>({
    qr_id: 0,
    qr_name: "",
    lat: 0,
    lon: 0,
    status: "inactive",
    factory_code: "",
  });

  // Populate form when editing or when factories load
  useEffect(() => {
    if (qr) {
      setFormData(qr);
    } else if (factories.length > 0) {
      // Defaults for new QR
      setFormData({
        qr_id: 0,
        qr_name: "",
        lat: 0,
        lon: 0,
        status: "inactive",
        factory_code: factories[0].factory_code,
      });
    }
  }, [qr, factories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!formData.qr_name || !formData.factory_code) {
      alert("Please fill in Name and Factory.");
      return;
    }
    await onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            {isEditMode ? "Edit QR Code" : "Add QR Code"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Factory Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Factory</label>
            <select
              value={formData.factory_code}
              onChange={(e) => setFormData({ ...formData, factory_code: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            >
              {factories.map((f) => (
                <option key={f.factory_code} value={f.factory_code}>
                  {f.factory_name}
                </option>
              ))}
            </select>
          </div>

          {/* QR Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">QR Name</label>
            <input
              type="text"
              value={formData.qr_name}
              onChange={(e) => setFormData({ ...formData, qr_name: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Latitude</label>
              <input
                type="number"
                step="any"
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Longitude</label>
              <input
                type="number"
                step="any"
                value={formData.lon}
                onChange={(e) => setFormData({ ...formData, lon: parseFloat(e.target.value) || 0 })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}