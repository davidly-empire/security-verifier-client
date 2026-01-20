"use client";

// Importing the library
import { QRCodeSVG } from "qrcode.react"; 
import { QRCode as QRDataType } from "@/app/dashboard/qr-crud/page";

interface QrPreviewProps {
  qr: QRDataType;
  onClose: () => void;
}

export default function QrPreview({ qr, onClose }: QrPreviewProps) {
  // -------------------------------------------------------
  // STRATEGY 1: PUBLIC URL STRATEGY (Most Robust)
  // -------------------------------------------------------
  // Instead of raw text, we encode a URL.
  // You can change this base URL to your actual deployed domain later.
  // For now, it uses the ID to create a unique link.
  const safeId = qr.qr_id || 1;
  const qrData = `https://security-verifier.com/qr/${safeId}`;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Scan Me
          </h3>
          
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="border-4 border-white shadow-lg p-2 bg-white rounded-lg">
              {/* REAL QR GENERATION USING THE LIBRARY */}
              <QRCodeSVG
                value={qrData}
                size={256}
                bgColor="#FFFFFF"
                fgColor="#000000"
                level={"H"}
                includeMargin={true}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Scannable with any phone camera
            </p>
          </div>
          
          <div className="text-left w-full mb-4 bg-gray-50 p-4 rounded border border-gray-200">
            <div className="mb-2">
              <span className="font-semibold text-gray-700">QR Name:</span> 
              <span className="ml-2 font-normal">{qr.qr_name}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">ID:</span> 
              <span className="ml-2 font-normal">{qr.qr_id}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Factory:</span> 
              <span className="ml-2 font-normal">{qr.factory_code}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Location:</span> 
              <span className="ml-2 font-normal">{qr.lat}, {qr.lon}</span>
            </div>
            
            {/* Update this display to match what is actually encoded */}
            <div className="mt-3 pt-3 border-t border-gray-300">
              <p className="text-xs text-gray-500 mb-1">Encoded URL:</p>
              <div className="p-2 bg-white border border-gray-300 rounded text-sm font-mono text-blue-600 break-all">
                {qrData}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                window.print();
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Print Page
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}