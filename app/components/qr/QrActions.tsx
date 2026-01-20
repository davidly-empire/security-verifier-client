"use client";

import { useState } from "react";
import { QRCode } from "@/app/dashboard/qr-crud/page"; // Frontend type

interface QrActionsProps {
  qr: QRCode; // <-- use QRCode for frontend
  onEdit: (qr: QRCode) => void;
  onView: (qr: QRCode) => void;
  onToggleStatus: (id: string | number) => void;
  onDelete: (id: string | number) => void;
}

export default function QrActions({
  qr,
  onEdit,
  onView,
  onToggleStatus,
  onDelete,
}: QrActionsProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="relative">
      {/* Actions toggle button */}
      <button
        onClick={() => setShowActions(!showActions)}
        className="text-gray-400 hover:text-gray-500 focus:outline-none"
      >
        <svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {showActions && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1">
            {/* View */}
            <button
              onClick={() => {
                onView(qr);
                setShowActions(false);
              }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              View
            </button>

            {/* Edit */}
            <button
              onClick={() => {
                onEdit(qr);
                setShowActions(false);
              }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              Edit
            </button>

            {/* Toggle Status */}
            <button
              onClick={() => {
                onToggleStatus(qr.qr_id);
                setShowActions(false);
              }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              {qr.status === "active" ? "Disable" : "Enable"}
            </button>

            {/* Delete */}
            <button
              onClick={() => {
                onDelete(qr.qr_id);
                setShowActions(false);
              }}
              className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
