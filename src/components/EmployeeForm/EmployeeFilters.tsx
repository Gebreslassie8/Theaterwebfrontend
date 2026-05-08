// frontend/src/components/EmployeeForm/EmployeeFilters.tsx
import React from "react";
import { motion } from "framer-motion";
import { Search, Filter, ChevronDown, Plus } from "lucide-react";
import { roleOptions } from "../../pages/Owner/employes/employeeConstants";

interface EmployeeFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterRole: string;
  onRoleChange: (value: string) => void;
  filterStatus: string;
  onStatusChange: (value: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  onClearFilters: () => void;
  onAddEmployee: () => void;
}

export const EmployeeFilters: React.FC<EmployeeFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filterRole,
  onRoleChange,
  filterStatus,
  onStatusChange,
  showFilters,
  onToggleFilters,
  onClearFilters,
  onAddEmployee,
}) => {
  // Status options
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md p-4 mb-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone, employee ID or username..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
            />
          </div>
          <button
            onClick={onToggleFilters}
            className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
        <button
          onClick={onAddEmployee}
          className="px-5 py-2.5 text-sm whitespace-nowrap bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all rounded-xl font-medium flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New Employee
        </button>
      </div>

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-3"
        >
          <select
            value={filterRole}
            onChange={(e) => onRoleChange(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white min-w-[140px]"
          >
            <option value="all">All Roles</option>
            {roleOptions && roleOptions.length > 0 ? (
              roleOptions.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.label}
                </option>
              ))
            ) : (
              <>
                <option value="theater_manager">Theater Manager</option>
                <option value="sales_person">Sales Person</option>
                <option value="qr_scanner">QR Scanner</option>
              </>
            )}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white min-w-[140px]"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="flex-1"></div>
          <button
            onClick={onClearFilters}
            className="px-4 py-2 text-sm text-gray-600 hover:text-teal-600 transition-colors"
          >
            Clear All Filters
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};