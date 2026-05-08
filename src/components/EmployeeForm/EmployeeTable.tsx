// frontend/src/components/EmployeeForm/EmployeeTable.tsx
import React from "react";
import {
  Eye,
  Edit,
  Ban,
  RefreshCw,
  Trash2,
  Mail,
  Phone,
  LayoutGrid,
  UsersRound,
} from "lucide-react";
import ReusableTable from "../Reusable/ReusableTable";
import { Employee } from "../../pages/Owner/employes/employee.types";
import { roleConfig, statusConfig } from "../../pages/Owner/employes/employeeConstants";

interface EmployeeTableProps {
  employees: Employee[];
  loading: boolean;
  currentUserRole: string;
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDeactivate: (employee: Employee) => void;
  onReactivate: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  loading,
  currentUserRole,
  onView,
  onEdit,
  onDeactivate,
  onReactivate,
  onDelete,
}) => {
  const canDeactivate = (employee: Employee): boolean =>
    employee.status === "Active";

  const canReactivate = (employee: Employee): boolean =>
    employee.status === "Inactive";

  const canPerformActions = (): boolean => {
    return (
      currentUserRole === "super_admin" || currentUserRole === "theater_owner"
    );
  };

  const columns = [
    {
      Header: "Employee",
      accessor: "name",
      sortable: true,
      Cell: (row: Employee) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">
              {row.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{row.name}</p>
            <p className="text-xs text-gray-500">@{row.username}</p>
            {row.employee_id && (
              <p className="text-xs text-gray-400 font-mono">
                ID: {row.employee_id}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      Header: "Contact",
      accessor: "email",
      sortable: true,
      Cell: (row: Employee) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Mail className="h-3 w-3 text-gray-400" />
            <span className="text-sm text-gray-600">{row.email}</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="h-3 w-3 text-gray-400" />
            <span className="text-sm text-gray-600">{row.phone}</span>
          </div>
        </div>
      ),
    },
    {
      Header: "Role",
      accessor: "assignedRole",
      sortable: true,
      Cell: (row: Employee) => {
        const config = roleConfig[row.assignedRole] || roleConfig.sales_person;
        const Icon = config.icon;
        return (
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
          >
            <Icon className="h-3 w-3" />
            {config.label}
          </span>
        );
      },
    },
    {
      Header: "Salary (ETB)",
      accessor: "salary",
      sortable: true,
      Cell: (row: Employee) => (
        <span className="font-semibold text-green-600">
          Br {row.salary.toLocaleString()}
        </span>
      ),
    },
    {
      Header: "Status",
      accessor: "status",
      sortable: true,
      Cell: (row: Employee) => {
        const config = statusConfig[row.status];
        const Icon = config.icon;
        return (
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
          >
            <Icon className="h-3 w-3" />
            {config.label}
          </span>
        );
      },
    },
  ];

  const renderActions = (row: Employee) => (
    <div className="flex items-center justify-start gap-2">
      <button
        onClick={() => onView(row)}
        className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all duration-200 group"
        title="View Details"
        type="button"
      >
        <Eye className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform" />
      </button>

      {canPerformActions() && (
        <button
          onClick={() => onEdit(row)}
          className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 transition-all duration-200 group"
          title="Edit Employee"
          type="button"
        >
          <Edit className="h-4 w-4 text-teal-600 group-hover:scale-110 transition-transform" />
        </button>
      )}

      {canDeactivate(row) && canPerformActions() && (
        <button
          onClick={() => onDeactivate(row)}
          className="p-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 transition-all duration-200 group"
          title="Deactivate Employee"
          type="button"
        >
          <Ban className="h-4 w-4 text-orange-600 group-hover:scale-110 transition-transform" />
        </button>
      )}

      {canReactivate(row) && canPerformActions() && (
        <button
          onClick={() => onReactivate(row)}
          className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition-all duration-200 group"
          title="Reactivate Employee"
          type="button"
        >
          <RefreshCw className="h-4 w-4 text-green-600 group-hover:scale-110 transition-transform" />
        </button>
      )}

      {canPerformActions() && (
        <button
          onClick={() => onDelete(row)}
          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-all duration-200 group"
          title="Delete Employee"
          type="button"
        >
          <Trash2 className="h-4 w-4 text-red-600 group-hover:scale-110 transition-transform" />
        </button>
      )}
    </div>
  );

  const columnsWithActions = [
    ...columns,
    {
      Header: "Actions",
      accessor: "actions",
      Cell: renderActions,
      width: "280px",
      align: "left" as const,
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-12 bg-white rounded-xl shadow-md">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"
          role="status"
        >
          <span className="sr-only">Loading employees...</span>
        </div>
        <p className="mt-4 text-gray-500">Loading employees...</p>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-md">
        <UsersRound className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Employees Found
        </h3>
        <p className="text-gray-500 mb-4">
          No employees match your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <ReusableTable
        columns={columnsWithActions}
        data={employees}
        icon={LayoutGrid}
        showSearch={false}
        showExport={false}
        showPrint={false}
      />
    </div>
  );
};