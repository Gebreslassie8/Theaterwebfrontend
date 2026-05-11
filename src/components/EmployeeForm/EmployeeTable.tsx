// frontend/src/components/EmployeeForm/EmployeeTable.tsx
import React from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Edit,
  Ban,
  RefreshCw,
  Trash2,
  User,
  Mail,
  Phone,
  Briefcase,
} from "lucide-react";
import { Employee } from "../../pages/Owner/employes/employee.types";
import {
  roleConfig,
  statusConfig,
} from "../../pages/Owner/employes/employeeConstants";

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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

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
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 bg-white rounded-xl shadow-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No employees found</p>
      </div>
    );
  }

  const canEdit =
    currentUserRole === "super_admin" || currentUserRole === "theater_owner";

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => {
              const roleConf =
                roleConfig[employee.assignedRole] || roleConfig.sales_person;
              const RoleIcon = roleConf.icon;
              const statusConf =
                statusConfig[employee.status] || statusConfig.Active;
              const StatusIcon = statusConf.icon;

              return (
                <motion.tr
                  key={employee.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Employee Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-md">
                        <span className="text-white font-semibold text-sm">
                          {employee.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {employee.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {employee.employee_id || "No ID"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Contact Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Mail className="h-3 w-3" />
                        <span>{employee.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Phone className="h-3 w-3" />
                        <span>{employee.phone || "No phone"}</span>
                      </div>
                    </div>
                  </td>

                  {/* Role Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${roleConf.bgColor} ${roleConf.color}`}
                    >
                      <RoleIcon className="h-3 w-3" />
                      {roleConf.label}
                    </span>
                  </td>

                  {/* Status Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConf.bgColor} ${statusConf.color}`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {employee.status}
                    </span>
                  </td>

                  {/* Actions Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onView(employee)}
                        className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                        title="View Details"
                        type="button"
                      >
                        <Eye className="h-4 w-4 text-blue-600" />
                      </button>

                      {canEdit && (
                        <button
                          onClick={() => onEdit(employee)}
                          className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 transition-colors"
                          title="Edit Employee"
                          type="button"
                        >
                          <Edit className="h-4 w-4 text-teal-600" />
                        </button>
                      )}

                      {employee.status === "Active" ? (
                        <button
                          onClick={() => onDeactivate(employee)}
                          className="p-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors"
                          title="Deactivate"
                          type="button"
                        >
                          <Ban className="h-4 w-4 text-orange-600" />
                        </button>
                      ) : (
                        <button
                          onClick={() => onReactivate(employee)}
                          className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                          title="Reactivate"
                          type="button"
                        >
                          <RefreshCw className="h-4 w-4 text-green-600" />
                        </button>
                      )}

                      {canEdit && (
                        <button
                          onClick={() => onDelete(employee)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                          title="Delete Employee"
                          type="button"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};