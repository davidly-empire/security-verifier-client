"use client";

import { QRCodeSVG } from "qrcode.react"; 
import { QRCode as QRDataType } from "@/app/dashboard/qr-crud/page";
import { Printer, X, Link as LinkIcon, MapPin } from "lucide-react";

interface QrPreviewProps {
  qr: QRDataType;
  onClose: () => void;
}

export default function QrPreview({ qr, onClose }: QrPreviewProps) {
  // -------------------------------------------------------
  // STRATEGY 1: PUBLIC URL STRATEGY
  // -------------------------------------------------------
  const safeId = qr.qr_id || 1;
  const qrData = `https://security-verifier.com/qr/${safeId}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl shadow-blue-900/10 z-10 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Side: Visuals (Blue Gradient) */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-8 flex flex-col items-center justify-center text-white relative">
          {/* Decorative Circle */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl"></div>
          
          <div className="bg-white p-3 rounded-xl shadow-2xl relative z-10 transition-transform hover:scale-105 duration-300">
            <QRCodeSVG
              value={qrData}
              size={256}
              bgColor="#FFFFFF"
              fgColor="#0f172a" // Slate 900 for high contrast
              level={"H"}
              includeMargin={false}
            />
          </div>
          <p className="mt-6 text-blue-100 text-sm font-medium flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Scan to verify location
          </p>
        </div>

        {/* Right Side: Details (White) */}
        <div className="w-full md:w-1/2 p-8 flex flex-col bg-white">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-800">QR Code Details</h3>
              <p className="text-sm text-slate-500 mt-1">Scannable checkpoint</p>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Data List */}
          <div className="space-y-5 flex-1">
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-blue-50 p-1.5 rounded text-blue-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">QR Name</p>
                <p className="text-sm font-semibold text-slate-800">{qr.qr_name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 bg-blue-50 p-1.5 rounded text-blue-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unique ID</p>
                <p className="text-sm font-semibold text-slate-800 font-mono">#{qr.qr_id}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 bg-blue-50 p-1.5 rounded text-blue-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Factory Code</p>
                <p className="text-sm font-semibold text-slate-800">{qr.factory_code}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 bg-blue-50 p-1.5 rounded text-blue-600">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Coordinates</p>
                <p className="text-sm font-semibold text-slate-800 font-mono">
                  {qr.lat}, {qr.lon}
                </p>
              </div>
            </div>
            
            {/* URL Display */}
            <div className="mt-4 pt-4 border-t border-slate-100">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                 <LinkIcon className="w-3 h-3" />
                 Encoded Data
               </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="text-xs font-mono text-slate-600 break-all leading-relaxed">
                  {qrData}
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => window.print()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 hover:shadow-md hover:border-slate-400 transition-all duration-200"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}