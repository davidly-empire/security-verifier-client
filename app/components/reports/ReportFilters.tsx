// D:\Security_verifier\client-app\security-verifier-client\app\components\reports\ReportFilters.tsx
'use client';

import React, { useState, useEffect } from 'react';

interface ReportFiltersProps {
  filters: {
    dateRange: { start: string; end: string };
    site: string;       // Used for Factory ID
    route: string;      // Kept in interface for parent compatibility, but not used in UI
    guard: string;
  };
  setFilters: (filters: any) => void;
}

interface FactoryOption {
  id: string;       // e.g., "F001"
  name: string;     // e.g., "Factory 1"
}

const ReportFilters: React.FC<ReportFiltersProps> = ({ filters, setFilters }) => {
  const [factories, setFactories] = useState<FactoryOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFactories = async () => {
      try {
        // Fetch Factories from Backend
        const factoryRes = await fetch('http://127.0.0.1:8000/factories/minimal');
        
        if (factoryRes.ok) {
          const factoryData = await factoryRes.json();
          if (Array.isArray(factoryData)) {
            setFactories(factoryData);
          }
        } else {
          console.error("Failed to fetch factories");
        }
      } catch (error) {
        console.error("Error fetching filter data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFactories();
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    if (key === 'start' || key === 'end') {
      setFilters({
        ...filters,
        dateRange: {
          ...filters.dateRange,
          [key]: value
        }
      });
    } else {
      setFilters({
        ...filters,
        [key]: value
      });
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Start Date */}
        <div>
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            id="start-date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={filters.dateRange.start}
            onChange={(e) => handleFilterChange('start', e.target.value)}
          />
        </div>
        
        {/* End Date */}
        <div>
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            id="end-date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={filters.dateRange.end}
            onChange={(e) => handleFilterChange('end', e.target.value)}
          />
        </div>
        
        {/* Factory Dropdown */}
        <div>
          <label htmlFor="factory" className="block text-sm font-medium text-gray-700 mb-1">
            Factory
          </label>
          <select
            id="factory"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={filters.site}
            onChange={(e) => handleFilterChange('site', e.target.value)}
            disabled={loading}
          >
            <option value="">
              {loading ? 'Loading...' : 'Select Factory'}
            </option>
            {factories.map((factory) => (
              <option key={factory.id} value={factory.id}>
                {factory.name || factory.id}
              </option>
            ))}
          </select>
        </div>
        
      </div>
      
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => console.log('Apply clicked', filters)}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default ReportFilters;