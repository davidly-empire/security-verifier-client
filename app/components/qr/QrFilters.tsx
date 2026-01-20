"use client";

import { Factory } from "@/app/dashboard/qr-crud/page"; // Import shared types

// Simplified Interface: Only Factory is needed now
interface QrFiltersProps {
  value: string; // This is the selected factory_code
  onChange: (factoryCode: string) => void;
  factories: Factory[];
}

export default function QrFilters({ value, onChange, factories }: QrFiltersProps) {
  return (
    <div className="bg-white p-4 rounded shadow-sm flex items-center gap-4">
      
      {/* Factory Select Label */}
      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
        Select Factory:
      </label>

      {/* Factory Dropdown */}
      <div className="flex-1">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {factories.map((f) => (
            <option key={f.factory_code} value={f.factory_code}>
              {f.factory_name}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
}