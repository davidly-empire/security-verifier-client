"use client";

import { useState, useEffect } from "react";
import { QRCode } from "@/app/dashboard/qr-crud/page";
import QRCodeLib from "qrcode";

interface QrFormProps {
  qr: QRCode | null;
  isEditMode: boolean;
  onSave: (qrData: Partial<QRCode>) => void;
  onClose: () => void;
  buildings: string[];
  floors: string[];
  routes: string[];
}

export default function QrForm({
  qr,
  isEditMode,
  onSave,
  onClose,
  buildings,
  floors,
}: QrFormProps) {
  const [formData, setFormData] = useState({
    qrid: "",
    name: "",
    location: {
      building: "",
      floor: "",
      area: "",
    },
    status: "Active" as "Active" | "Inactive",
    required: "Yes" as "Yes" | "No",
    sequenceOrder: 1,
    scanLogic: {
      expectedScanTimeWindow: {
        from: "09:00",
        to: "17:00",
      },
      graceTime: 15,
    },
    adminControls: {
      importance: "Medium" as "Low" | "Medium" | "High" | "Critical",
    },
  });

  const [qrImage, setQrImage] = useState<string | null>(null);

  useEffect(() => {
    if (qr && isEditMode) {
      setFormData({
        qrid: qr.qrid,
        name: qr.name,
        location: { ...qr.location },
        status: qr.status,
        required: qr.required,
        sequenceOrder: qr.sequenceOrder,
        scanLogic: { ...qr.scanLogic },
        adminControls: {
          importance: qr.adminControls?.importance ?? "Medium",
        },
      });
    }
  }, [qr, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const parts = name.split(".");
      if (parts.length === 3) {
        const [grandParent, parent, child] = parts;
        setFormData((prev) => ({
          ...prev,
          [grandParent]: {
            ...(prev as any)[grandParent],
            [parent]: {
              ...(prev as any)[grandParent][parent],
              [child]: value,
            },
          },
        }));
      } else {
        const [parent, child] = parts;
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...(prev as any)[parent],
            [child]: value,
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const generateQr = async () => {
    const qrPayload = {
      qrid: formData.qrid,
      name: formData.name,
      location: formData.location,
      importance: formData.adminControls.importance,
    };

    const url = await QRCodeLib.toDataURL(JSON.stringify(qrPayload), {
      width: 280,
      margin: 2,
    });

    setQrImage(url);
  };

  const downloadQr = () => {
    if (!qrImage) return;
    const link = document.createElement("a");
    link.href = qrImage;
    link.download = `${formData.qrid || "qr-code"}.png`;
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
        <form
          onSubmit={handleSubmit}
          className="w-2/3 grid grid-cols-2 gap-4 content-start"
        >
          <h3 className="col-span-2 text-xl font-semibold">
            {isEditMode ? "Edit QR Code" : "Add New QR Code"}
          </h3>

          <input
            name="qrid"
            placeholder="QR ID"
            value={formData.qrid}
            onChange={handleChange}
            disabled={isEditMode}
            className="border p-2 rounded"
          />

          <input
            name="name"
            placeholder="QR Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <select
            name="location.building"
            value={formData.location.building}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Building</option>
            {buildings.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>

          <select
            name="location.floor"
            value={formData.location.floor}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Floor</option>
            {floors.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>

          <input
            name="location.area"
            placeholder="Area"
            value={formData.location.area}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />

          <select
            name="adminControls.importance"
            value={formData.adminControls.importance}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          >
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
            <option value="Critical">Critical Priority</option>
          </select>

          <div className="col-span-2 flex gap-3 mt-4">
            <button
              type="button"
              onClick={generateQr}
              className="flex-1 bg-green-600 text-white py-2 rounded"
            >
              Generate QR
            </button>

            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded"
            >
              {isEditMode ? "Update" : "Save"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 border py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* RIGHT: QR PREVIEW */}
        <div className="w-1/3 border rounded-lg flex flex-col items-center justify-center gap-4">
          {qrImage ? (
            <>
              <img src={qrImage} className="w-64 border p-2" />
              <button
                onClick={downloadQr}
                className="w-2/3 bg-blue-600 text-white py-2 rounded"
              >
                Download QR
              </button>
            </>
          ) : (
            <p className="text-gray-500 text-center">
              Generate QR to preview
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
