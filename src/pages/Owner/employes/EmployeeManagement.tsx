// frontend/src/pages/Owner/employes/EmployeeManagement.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  UsersRound,
  UserCheck,
  UserX,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import SuccessPopup from "../../../components/Reusable/SuccessPopup";
import AddNewEmployee from "../../../components/EmployeeForm/AddNewEmployee";
import UpdateEmployee from "../../../components/EmployeeForm/UpdateEmployee";
import ViewEmployee from "../../../components/EmployeeForm/ViewEmployee";
import { DeleteConfirmModal } from "../../../components/EmployeeForm/DeleteConfirmModal";
import { StatCard } from "../../../components/EmployeeForm/StatCard";
import { EmployeeFilters } from "../../../components/EmployeeForm/EmployeeFilters";
import { EmployeeTable } from "../../../components/EmployeeForm/EmployeeTable";
import { containerVariants, itemVariants } from "./animations";
import {
  roleOptions,
  deactivationReasons,
} from "./employeeConstants";
import { useEmployeeData } from "./useEmployeeData";
import { employeeService } from "./employeeService";
import { filterEmployees, calculateStats } from "./employeeUtils";
import { Employee, PopupMessage } from "./employee.types";

const EmployeeManagement: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [showReactivateConfirm, setShowReactivateConfirm] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null,
  );
  const [employeeToDeactivate, setEmployeeToDeactivate] =
    useState<Employee | null>(null);
  const [employeeToReactivate, setEmployeeToReactivate] =
    useState<Employee | null>(null);
  const [deactivationReason, setDeactivationReason] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState<PopupMessage>({
    title: "",
    message: "",
    type: "success",
  });
  const [theaterId, setTheaterId] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string>("");
  const [currentUserName, setCurrentUserName] = useState<string>("");

  useEffect(() => {
    const getUserInfo = async () => {
      const userInfo = await employeeService.getCurrentUserInfo();
      if (userInfo) {
        setCurrentUserRole(userInfo.userData?.role || "");
        setCurrentUserName(userInfo.userData?.full_name || "");
        setTheaterId(userInfo.theaterId);
      }
    };
    getUserInfo();
  }, []);

  // Load employees data
  const { employees, loading, loadEmployees } = useEmployeeData(
    theaterId,
    currentUserRole,
  );

  // Filter employees
  const filteredEmployees = filterEmployees(
    employees,
    searchTerm,
    filterRole,
    filterStatus,
  );
  const stats = calculateStats(employees);

  // Handlers
  const handleClearFilters = () => {
    setFilterRole("all");
    setFilterStatus("all");
    setSearchTerm("");
  };

  const handleDeleteEmployee = async () => {
    if (!employeeToDelete) return;
    try {
      await employeeService.deleteEmployee(employeeToDelete.id);
      await loadEmployees();
      setShowDeleteConfirm(false);
      setEmployeeToDelete(null);
      setPopupMessage({
        title: t("employeeManagement.popup.deleteSuccess.title"),
        message: t("employeeManagement.popup.deleteSuccess.message", { name: employeeToDelete.name }),
        type: "success",
      });
      setShowSuccessPopup(true);
    } catch (error: any) {
      setPopupMessage({
        title: t("employeeManagement.popup.deleteError.title"),
        message: error.message,
        type: "error",
      });
      setShowSuccessPopup(true);
    }
  };

  const handleDeactivateEmployee = async () => {
    if (!employeeToDeactivate) return;
    try {
      await employeeService.deactivateEmployee(
        employeeToDeactivate.id,
        deactivationReason,
      );
      await loadEmployees();
      setShowDeactivateConfirm(false);
      setEmployeeToDeactivate(null);
      setDeactivationReason("");
      setPopupMessage({
        title: t("employeeManagement.popup.deactivateSuccess.title"),
        message: t("employeeManagement.popup.deactivateSuccess.message", { name: employeeToDeactivate.name }),
        type: "warning",
      });
      setShowSuccessPopup(true);
    } catch (error: any) {
      setPopupMessage({
        title: t("employeeManagement.popup.deactivateError.title"),
        message: error.message,
        type: "error",
      });
      setShowSuccessPopup(true);
    }
  };

  const handleReactivateEmployee = async () => {
    if (!employeeToReactivate) return;
    try {
      await employeeService.reactivateEmployee(employeeToReactivate.id);
      await loadEmployees();
      setShowReactivateConfirm(false);
      setEmployeeToReactivate(null);
      setPopupMessage({
        title: t("employeeManagement.popup.reactivateSuccess.title"),
        message: t("employeeManagement.popup.reactivateSuccess.message", { name: employeeToReactivate.name }),
        type: "success",
      });
      setShowSuccessPopup(true);
    } catch (error: any) {
      setPopupMessage({
        title: t("employeeManagement.popup.reactivateError.title"),
        message: error.message,
        type: "error",
      });
      setShowSuccessPopup(true);
    }
  };

  const handleAddEmployee = async () => {
    await loadEmployees();
    setShowAddModal(false);
    setPopupMessage({
      title: t("employeeManagement.popup.addSuccess.title"),
      message: t("employeeManagement.popup.addSuccess.message"),
      type: "success",
    });
    setShowSuccessPopup(true);
  };

  const handleUpdateEmployee = async () => {
    await loadEmployees();
    setShowUpdateModal(false);
    setSelectedEmployee(null);
    setPopupMessage({
      title: t("employeeManagement.popup.updateSuccess.title"),
      message: t("employeeManagement.popup.updateSuccess.message"),
      type: "success",
    });
    setShowSuccessPopup(true);
  };

  // Dashboard cards
  const dashboardCards = [
    {
      title: t("employeeManagement.cards.totalEmployees"),
      value: stats.totalEmployees,
      icon: UsersRound,
      color: "from-teal-500 to-teal-600",
      delay: 0.1,
    },
    {
      title: t("employeeManagement.cards.activeEmployees"),
      value: stats.activeEmployees,
      icon: UserCheck,
      color: "from-green-500 to-emerald-600",
      delay: 0.15,
    },
    {
      title: t("employeeManagement.cards.inactiveEmployees"),
      value: stats.inactiveEmployees,
      icon: UserX,
      color: "from-red-500 to-rose-600",
      delay: 0.2,
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t("employeeManagement.title")}
            </h1>
            <p className="text-gray-500 mt-1">
              {t("employeeManagement.welcomeMessage", { name: currentUserName })}
            </p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {dashboardCards.map((card, index) => (
            <StatCard key={index} {...card} />
          ))}
        </motion.div>

        {/* Filters */}
        <EmployeeFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterRole={filterRole}
          onRoleChange={setFilterRole}
          filterStatus={filterStatus}
          onStatusChange={setFilterStatus}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onClearFilters={handleClearFilters}
          onAddEmployee={() => setShowAddModal(true)}
        />

        {/* Results Count */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {t("employeeManagement.showingResults", {
              filtered: filteredEmployees.length,
              total: employees.length,
            })}
          </p>
          {filteredEmployees.length !== employees.length && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-teal-600 hover:text-teal-700"
            >
              {t("employeeManagement.clearFilters")}
            </button>
          )}
        </div>

        {/* Employee Table */}
        <EmployeeTable
          employees={filteredEmployees}
          loading={loading}
          currentUserRole={currentUserRole}
          onView={(emp) => {
            setViewingEmployee(emp);
            setShowViewModal(true);
          }}
          onEdit={(emp) => {
            setSelectedEmployee(emp);
            setShowUpdateModal(true);
          }}
          onDeactivate={(emp) => {
            setEmployeeToDeactivate(emp);
            setShowDeactivateConfirm(true);
          }}
          onReactivate={(emp) => {
            setEmployeeToReactivate(emp);
            setShowReactivateConfirm(true);
          }}
          onDelete={(emp) => {
            setEmployeeToDelete(emp);
            setShowDeleteConfirm(true);
          }}
        />

        {/* Add Employee Modal */}
        {showAddModal && (
          <AddNewEmployee
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddEmployee}
            roles={roleOptions}
            isEdit={false}
            theaterId={theaterId || undefined}
            currentUserRole={currentUserRole}
          />
        )}

        {/* Update Employee Modal */}
        {showUpdateModal && selectedEmployee && (
          <UpdateEmployee
            isOpen={showUpdateModal}
            employee={selectedEmployee}
            roles={roleOptions}
            onClose={() => {
              setShowUpdateModal(false);
              setSelectedEmployee(null);
            }}
            onUpdate={handleUpdateEmployee}
            theaterId={theaterId || undefined}
            currentUserRole={currentUserRole}
          />
        )}

        {/* View Employee Modal */}
        {showViewModal && viewingEmployee && (
          <ViewEmployee
            isOpen={showViewModal}
            employee={viewingEmployee}
            roles={roleOptions}
            onClose={() => {
              setShowViewModal(false);
              setViewingEmployee(null);
            }}
            onEdit={() => {
              setShowViewModal(false);
              setSelectedEmployee(viewingEmployee);
              setShowUpdateModal(true);
            }}
          />
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          employee={employeeToDelete}
          onConfirm={handleDeleteEmployee}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setEmployeeToDelete(null);
          }}
        />

        {/* Deactivate Confirmation Modal */}
        {showDeactivateConfirm && employeeToDeactivate && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {t("employeeManagement.deactivateModal.title")}
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                {t("employeeManagement.deactivateModal.message", { name: employeeToDeactivate.name })}
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("employeeManagement.deactivateModal.reasonLabel")}
                </label>
                <select
                  value={deactivationReason}
                  onChange={(e) => setDeactivationReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">{t("employeeManagement.deactivateModal.selectReason")}</option>
                  {deactivationReasons.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeactivateConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  {t("common.cancel")}
                </button>
                <button
                  onClick={handleDeactivateEmployee}
                  disabled={!deactivationReason}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition"
                >
                  {t("employeeManagement.deactivateModal.confirmButton")}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Reactivate Confirmation Modal */}
        {showReactivateConfirm && employeeToReactivate && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <RefreshCw className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {t("employeeManagement.reactivateModal.title")}
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                {t("employeeManagement.reactivateModal.message", { name: employeeToReactivate.name })}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowReactivateConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  {t("common.cancel")}
                </button>
                <button
                  onClick={handleReactivateEmployee}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  {t("employeeManagement.reactivateModal.confirmButton")}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Success Popup */}
        <SuccessPopup
          isOpen={showSuccessPopup}
          onClose={() => setShowSuccessPopup(false)}
          type={popupMessage.type}
          title={popupMessage.title}
          message={popupMessage.message}
          duration={3000}
        />
      </div>
    </motion.div>
  );
};

export default EmployeeManagement;