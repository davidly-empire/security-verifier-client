"use client";

import { QRData } from "@/app/api/qr.api";
import QrActions from "./QrActions";

// Frontend DB-only QR type
export interface QRCode {
  qr_id: number;
  qr_name: string;
  lat?: number;
  lon?: number;
  status: "active" | "inactive";
  created_at?: string;
  factory_code?: string;
}

interface QrTableProps {
  qrCodes: QRData[]; // raw backend type
  onEdit: (qr: QRCode) => void;
  onView: (qr: QRCode) => void;
  onToggleStatus: (id: number) => void;
  onDelete: (id: number) => void;
}

// Map backend QRData → frontend QRCode
const mapQRDataToQRCode = (data: QRData): QRCode => ({
  qr_id: Number(data.qr_id),
  qr_name: data.qr_name,
  lat: data.lat ?? 0,
  lon: data.lon ?? 0,
  status: data.status === "active" ? "active" : "inactive", // force correct type
  created_at: data.created_at,
  factory_code: data.factory_code,
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
                QR Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                QR ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Latitude
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Longitude
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {qrCodes.map((qrData) => {
              const qr = mapQRDataToQRCode(qrData); // map each row
              return (
                <tr key={qr.qr_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {qr.qr_name}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {qr.qr_id}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {qr.lat ?? "-"}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {qr.lon ?? "-"}
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

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {qr.created_at ? new Date(qr.created_at).toLocaleString() : "-"}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <QrActions
                      qr={qr}
                      onEdit={() => onEdit(qr)}
                      onView={() => onView(qr)}
                      onToggleStatus={() => onToggleStatus(qr.qr_id)}
                      onDelete={() => onDelete(qr.qr_id)}
                    />
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
