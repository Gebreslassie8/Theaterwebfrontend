import React, { useState } from 'react';
import { Filter, ChevronDown } from 'lucide-react';

export interface FilterValues {
  useDateRange: boolean;
  startDate: string;
  endDate: string;
  selectedYear: string;
  selectedMonth: string;
  selectedDay: string;
  selectedSalesperson: string;
  selectedStatus: string;
}

interface ReusableFilterProps {
  // Filter values (controlled from parent)
  filterValues: FilterValues;
  // Change handlers
  onUseDateRangeChange: (value: boolean) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onSelectedYearChange: (year: string) => void;
  onSelectedMonthChange: (month: string) => void;
  onSelectedDayChange: (day: string) => void;
  onSelectedSalespersonChange: (person: string) => void;
  onSelectedStatusChange: (status: string) => void;

  // Options for dropdowns
  salespersonOptions: string[];      // e.g. ['all', 'Alice', 'Bob']
  statusOptions?: string[];          // e.g. ['all', 'completed', 'pending', 'refunded']
  availableYears: string[];          // e.g. ['all', '2026', '2025']
  monthsList: string[];              // e.g. ['January', 'February', ...]
  daysRange?: number;                // default 31

  // Visibility toggles (which filters to show)
  showSalesperson?: boolean;
  showStatus?: boolean;
  showDateRangeToggle?: boolean;     // show the radio buttons to switch filter mode
  showYearMonthDay?: boolean;        // show year/month/day section (if false, only date range)
  className?: string;
}

const ReusableshowFilterforall: React.FC<ReusableFilterProps> = ({
  filterValues,
  onUseDateRangeChange,
  onStartDateChange,
  onEndDateChange,
  onSelectedYearChange,
  onSelectedMonthChange,
  onSelectedDayChange,
  onSelectedSalespersonChange,
  onSelectedStatusChange,
  salespersonOptions,
  statusOptions = [],
  availableYears,
  monthsList,
  daysRange = 31,
  showSalesperson = true,
  showStatus = false,
  showDateRangeToggle = true,
  showYearMonthDay = true,
  className = '',
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const {
    useDateRange,
    startDate,
    endDate,
    selectedYear,
    selectedMonth,
    selectedDay,
    selectedSalesperson,
    selectedStatus,
  } = filterValues;

  return (
    <div className={`bg-white rounded-xl shadow-md p-4 mb-6 ${className}`}>
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 text-gray-700 font-medium mb-3"
      >
        <Filter className="h-4 w-4" />
        Filters
        <ChevronDown
          className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
        />
      </button>

      {showFilters && (
        <div className="space-y-4">
          {/* Toggle between date range and year/month/day */}
          {showDateRangeToggle && (
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={!useDateRange}
                  onChange={() => onUseDateRangeChange(false)}
                />
                <span className="text-sm">Filter by Year/Month/Day</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={useDateRange}
                  onChange={() => onUseDateRangeChange(true)}
                />
                <span className="text-sm">Filter by Date Range</span>
              </label>
            </div>
          )}

          {/* Year/Month/Day Filter */}
          {!useDateRange && showYearMonthDay && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => onSelectedYearChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year === 'all' ? 'All Years' : year}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => onSelectedMonthChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="all">All Months</option>
                  {monthsList.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Day (optional)
                </label>
                <select
                  value={selectedDay}
                  onChange={(e) => onSelectedDayChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="all">Any Day</option>
                  {Array.from({ length: daysRange }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day.toString()}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Date Range Filter */}
          {useDateRange && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => onStartDateChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => onEndDateChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          )}

          {/* Common Filters - Salesperson & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {showSalesperson && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salesperson
                </label>
                <select
                  value={selectedSalesperson}
                  onChange={(e) => onSelectedSalespersonChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  {salespersonOptions.map((person) => (
                    <option key={person} value={person}>
                      {person === 'all' ? 'All Salespersons' : person}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {showStatus && statusOptions.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => onSelectedStatusChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status === 'all' ? 'All Statuses' : status}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReusableshowFilterforall;