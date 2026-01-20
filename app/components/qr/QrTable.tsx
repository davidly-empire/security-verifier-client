"use client";

import { QRData } from "@/app/api/qr.api";

// Use type from API to ensure consistency
export type QRCode = QRData;

interface QrTableProps {
  qrCodes: QRCode[]; 
  onEdit: (qr: QRCode) => void;
  onView: (qr: QRCode) => void;
  onToggleStatus: (id: number) => void;
  onDelete: (id: number) => void;
}

// Helper to safely normalize data
const normalizeQR = (data: QRData): QRCode => ({
  qr_id: Number(data.qr_id),
  qr_name: data.qr_name || "Unnamed QR",
  lat: typeof data.lat === 'number' ? data.lat : 0,
  lon: typeof data.lon === 'number' ? data.lon : 0,
  status: (data.status === "active" || data.status === "inactive") ? data.status : "inactive",
  created_at: data.created_at,
  factory_code: data.factory_code || "",
});

export default function QrTable({
  qrCodes,
  onEdit,
  onView,
  onToggleStatus,
  onDelete,
}: QrTableProps) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Factory
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lat / Lon
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {qrCodes.map((qrData) => {
              const qr = normalizeQR(qrData);
              
              return (
                <tr key={qr.qr_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {qr.qr_name}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {qr.qr_id}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {qr.factory_code}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {qr.lat}, {qr.lon}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        qr.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {qr.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {/* 
                       INTEGRATED ACTIONS:
                       We put the buttons here directly to avoid 'QrActions' prop errors.
                    */}
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onView(qr)}
                        className="text-blue-600 hover:text-blue-900 text-xs font-medium px-2 py-1 border border-blue-200 rounded hover:bg-blue-50 transition"
                      >
                        View
                      </button>
                      
                      <button
                        onClick={() => onEdit(qr)}
                        className="text-indigo-600 hover:text-indigo-900 text-xs font-medium px-2 py-1 border border-indigo-200 rounded hover:bg-indigo-50 transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => onToggleStatus(qr.qr_id)}
                        className={`text-xs font-medium px-2 py-1 border rounded transition ${
                          qr.status === 'active' 
                            ? 'text-yellow-600 border-yellow-200 hover:bg-yellow-50' 
                            : 'text-green-600 border-green-200 hover:bg-green-50'
                        }`}
                      >
                        {qr.status === 'active' ? 'Disable' : 'Enable'}
                      </button>

                      <button
                        onClick={() => onDelete(qr.qr_id)}
                        className="text-red-600 hover:text-red-900 text-xs font-medium px-2 py-1 border border-red-200 rounded hover:bg-red-50 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {qrCodes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No QR codes found.
        </div>
      )}
    </div>
  );
}