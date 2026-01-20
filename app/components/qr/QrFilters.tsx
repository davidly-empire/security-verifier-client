"use client";

interface QrFiltersProps {
  filters: {
    factory: string;
    search: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{ factory: string; search: string }>>;
  factories?: string[]; // list of factories from backend
}

export default function QrFilters({ filters, setFilters, factories = [] }: QrFiltersProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:gap-4">
      {/* Factory Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Factory</label>
        <select
          name="factory"
          value={filters.factory}
          onChange={handleChange}
          className="border p-2 rounded w-full sm:w-48"
        >
          <option value="All">All</option>
          {factories.map((factory) => (
            <option key={factory} value={factory}>
              {factory}
            </option>
          ))}
        </select>
      </div>

      {/* Search Filter */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search by QR name or ID"
          className="border p-2 rounded w-full"
        />
      </div>
    </div>
  );
}
