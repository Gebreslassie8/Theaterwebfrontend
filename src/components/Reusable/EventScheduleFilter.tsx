// src/components/Reusable/ReusableEventScheduleFilter.tsx
import React, { useState } from 'react';
import { Filter, ChevronDown, Calendar, CalendarDays, CalendarRange } from 'lucide-react';

export interface FilterValues {
  useDateRange: boolean;
  useWeekView: boolean;
  startDate: string;
  endDate: string;
  selectedYear: string;
  selectedMonth: string;
  selectedDay: string;
  selectedWeekDay: string;
  selectedSalesperson: string;
  selectedStatus: string;
}

interface ReusableFilterProps {
  filterValues: FilterValues;
  onUseDateRangeChange: (value: boolean) => void;
  onUseWeekViewChange: (value: boolean) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onSelectedYearChange: (year: string) => void;
  onSelectedMonthChange: (month: string) => void;
  onSelectedDayChange: (day: string) => void;
  onSelectedWeekDayChange: (weekDay: string) => void;
  onSelectedSalespersonChange: (person: string) => void;
  onSelectedStatusChange: (status: string) => void;
  salespersonOptions: string[];
  statusOptions?: string[];
  availableYears: string[];
  monthsList: string[];
  weekDaysList?: string[];
  daysRange?: number;
  showSalesperson?: boolean;
  showStatus?: boolean;
  showDateRangeToggle?: boolean;
  showYearMonthDay?: boolean;
  showWeekView?: boolean;
  className?: string;
}

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const EventScheduleFilter: React.FC<ReusableFilterProps> = ({
  filterValues,
  onUseDateRangeChange,
  onUseWeekViewChange,
  onStartDateChange,
  onEndDateChange,
  onSelectedYearChange,
  onSelectedMonthChange,
  onSelectedDayChange,
  onSelectedWeekDayChange,
  onSelectedSalespersonChange,
  onSelectedStatusChange,
  salespersonOptions,
  statusOptions = [],
  availableYears,
  monthsList,
  weekDaysList = weekDays,
  daysRange = 31,
  showSalesperson = true,
  showStatus = false,
  showDateRangeToggle = true,
  showYearMonthDay = true,
  showWeekView = true,
  className = '',
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const {
    useDateRange,
    useWeekView,
    startDate,
    endDate,
    selectedYear,
    selectedMonth,
    selectedDay,
    selectedWeekDay,
    selectedSalesperson,
    selectedStatus,
  } = filterValues;

  const getFilterModeLabel = () => {
    if (useDateRange) return 'Date Range';
    if (useWeekView) return 'Week Day';
    return 'Year/Month/Day';
  };

  return (
    <div className={`bg-white rounded-xl shadow-md p-4 mb-6 ${className}`}>
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center justify-between w-full text-gray-700 font-medium mb-3"
      >
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          <span className="text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
            {getFilterModeLabel()}
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
        />
      </button>

      {showFilters && (
        <div className="space-y-4">
          {/* Filter Mode Selection */}
          {showDateRangeToggle && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter By</label>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    onUseDateRangeChange(false);
                    onUseWeekViewChange(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                    !useDateRange && !useWeekView
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  Year/Month/Day
                </button>
                <button
                  onClick={() => {
                    onUseDateRangeChange(true);
                    onUseWeekViewChange(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                    useDateRange && !useWeekView
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <CalendarRange className="h-4 w-4" />
                  Date Range
                </button>
                {showWeekView && (
                  <button
                    onClick={() => {
                      onUseDateRangeChange(false);
                      onUseWeekViewChange(true);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                      useWeekView
                        ? 'bg-teal-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <CalendarDays className="h-4 w-4" />
                    Week Day
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Year/Month/Day Filter */}
          {!useDateRange && !useWeekView && showYearMonthDay && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => onSelectedYearChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                <select
                  value={selectedDay}
                  onChange={(e) => onSelectedDayChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
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

          {/* Week Day Filter */}
          {useWeekView && showWeekView && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => onSelectedYearChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
                >
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year === 'all' ? 'All Years' : year}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Week Day</label>
                <select
                  value={selectedWeekDay}
                  onChange={(e) => onSelectedWeekDayChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
                >
                  <option value="all">All Week Days</option>
                  {weekDaysList.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Date Range Filter */}
          {useDateRange && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => onStartDateChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          )}

          {/* Salesperson Filter */}
          {showSalesperson && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organizer / Salesperson
              </label>
              <select
                value={selectedSalesperson}
                onChange={(e) => onSelectedSalespersonChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
              >
                {salespersonOptions.map((person) => (
                  <option key={person} value={person}>
                    {person === 'all' ? 'All Organizers' : person}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Status Filter */}
          {showStatus && statusOptions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => onSelectedStatusChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
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
      )}
    </div>
  );
};

export default EventScheduleFilter;