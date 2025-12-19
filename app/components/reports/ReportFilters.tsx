// D:\Security_verifier\client-app\security-verifier-client\app\components\reports\ReportFilters.tsx
import React from 'react';

interface ReportFiltersProps {
  filters: {
    dateRange: { start: string; end: string };
    site: string;
    route: string;
    guard: string;
  };
  setFilters: (filters: any) => void;
}

const ReportFilters: React.FC<ReportFiltersProps> = ({ filters, setFilters }) => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
        
        <div>
          <label htmlFor="site" className="block text-sm font-medium text-gray-700 mb-1">
            Site
          </label>
          <select
            id="site"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={filters.site}
            onChange={(e) => handleFilterChange('site', e.target.value)}
          >
            <option value="">All Sites</option>
            <option value="North Campus">North Campus</option>
            <option value="South Campus">South Campus</option>
            <option value="East Campus">East Campus</option>
            <option value="West Campus">West Campus</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="route" className="block text-sm font-medium text-gray-700 mb-1">
            Route
          </label>
          <select
            id="route"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={filters.route}
            onChange={(e) => handleFilterChange('route', e.target.value)}
          >
            <option value="">All Routes</option>
            <option value="Building A Patrol">Building A Patrol</option>
            <option value="Building B Patrol">Building B Patrol</option>
            <option value="Parking Lot Check">Parking Lot Check</option>
            <option value="Perimeter Check">Perimeter Check</option>
            <option value="Interior Patrol">Interior Patrol</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="guard" className="block text-sm font-medium text-gray-700 mb-1">
            Guard
          </label>
          <select
            id="guard"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={filters.guard}
            onChange={(e) => handleFilterChange('guard', e.target.value)}
          >
            <option value="">All Guards</option>
            <option value="John Smith">John Smith</option>
            <option value="Sarah Johnson">Sarah Johnson</option>
            <option value="Michael Brown">Michael Brown</option>
            <option value="Emily Davis">Emily Davis</option>
            <option value="Robert Wilson">Robert Wilson</option>
          </select>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default ReportFilters;