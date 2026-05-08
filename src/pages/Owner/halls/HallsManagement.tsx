// src/pages/Manager/halls/HallsManagement.tsx
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Building,
  Plus,
  Search,
  LayoutGrid,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Ban,
  RefreshCw,
  Trash2,
  Users,
  AlertCircle,
} from "lucide-react";
import ReusableTable from "../../../components/Reusable/ReusableTable";
import SuccessPopup from "../../../components/Reusable/SuccessPopup";
import AddHallModal from "../../../components/ManageHallForm/AddHallModal";
import UpdateHallModal from "../../../components/ManageHallForm/UpdateHallModal";
import ViewHallModal from "../../../components/ManageHallForm/ViewHallModal";
import supabase from "@/config/supabaseClient";

// Hall Type based on database schema - UPDATED with published_by
export interface Hall {
  id: string;
  theater_id: string;
  hall_number: number;
  name: string | null;
  capacity: number;
  created_at: string;
  rows: string | null;
  columns_per_row: any | null;
  seat_layout: any | null;
  description: string | null;
  is_active: boolean;
  seating_layout: string;
  price_multiplier: number;
  has_dynamic_seating: boolean;
  seat_configuration: any;
  theater_name?: string;
  published_by: string | null; // Added
  publisher_name?: string; // Added
  publisher_role?: string; // Added
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 12 },
  },
};

// Stat Card Component
const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  delay: number;
}> = ({ title, value, icon: Icon, color, delay }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md transition-all duration-300 ${isHovered ? "scale-105" : ""}`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-xs text-gray-500">{title}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Delete Confirm Modal for Hall
const HallDeleteConfirmModal: React.FC<{
  hall: Hall | null;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ hall, onConfirm, onCancel }) => {
  if (!hall) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-md w-full p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Delete Hall</h3>
        </div>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete{" "}
          <strong>{hall.name || `Hall ${hall.hall_number}`}</strong>? This
          action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Main Component
const HallsManagement: React.FC = () => {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [filteredHalls, setFilteredHalls] = useState<Hall[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [theaterId, setTheaterId] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string>("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  const [selectedHallForView, setSelectedHallForView] = useState<Hall | null>(
    null,
  );
  const [selectedHallForEdit, setSelectedHallForEdit] = useState<Hall | null>(
    null,
  );
  const [selectedHallForDelete, setSelectedHallForDelete] =
    useState<Hall | null>(null);
  const [selectedHallForDeactivate, setSelectedHallForDeactivate] =
    useState<Hall | null>(null);

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [deactivateReason, setDeactivateReason] = useState("");
  const [showReasonModal, setShowReasonModal] = useState(false);

  // Get current user's theater ID
  useEffect(() => {
    const getCurrentUserInfo = async () => {
      try {
        console.log("Getting user info...");
        const userStr =
          localStorage.getItem("user") || sessionStorage.getItem("user");

        if (!userStr) {
          console.error("No user found in storage");
          setLoading(false);
          return;
        }

        const user = JSON.parse(userStr);
        console.log("User found:", user);
        setCurrentUserRole(user.role || "");

        // Try to get theater ID from user session first
        let foundTheaterId = user.theater_id || null;

        if (!foundTheaterId) {
          console.log(
            "No theater_id in user session, fetching from employees table...",
          );
          const { data: employeeData, error: employeeError } = await supabase
            .from("employees")
            .select("theater_id")
            .eq("user_id", user.id)
            .maybeSingle();

          if (employeeError) {
            console.error("Error fetching employee:", employeeError);
          }

          if (employeeData?.theater_id) {
            foundTheaterId = employeeData.theater_id;
            console.log(
              "Found theater_id from employees table:",
              foundTheaterId,
            );
          }
        }

        // If still no theater, try theaters table as owner
        if (!foundTheaterId) {
          console.log(
            "No theater in employees, checking theaters table as owner...",
          );
          const { data: theaterData, error: theaterError } = await supabase
            .from("theaters")
            .select("id")
            .eq("owner_user_id", user.id)
            .maybeSingle();

          if (theaterError) {
            console.error("Error fetching theater:", theaterError);
          }

          if (theaterData?.id) {
            foundTheaterId = theaterData.id;
            console.log(
              "Found theater_id from theaters table:",
              foundTheaterId,
            );
          }
        }

        setTheaterId(foundTheaterId);
        console.log("Final theaterId:", foundTheaterId);

        if (!foundTheaterId) {
          console.warn("No theater ID found for user");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error getting user info:", error);
        setLoading(false);
      }
    };

    getCurrentUserInfo();
  }, []);

  // Load halls from database
  const loadHalls = useCallback(async () => {
    if (!theaterId) {
      console.log("No theaterId available, skipping load");
      setLoading(false);
      return;
    }

    console.log("Loading halls for theaterId:", theaterId);
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("halls")
        .select("*")
        .eq("theater_id", theaterId)
        .order("hall_number", { ascending: true });

      if (error) throw error;

      console.log("Halls loaded:", data?.length || 0);

      const formattedHalls: Hall[] = data.map((hall: any) => ({
        id: hall.id,
        theater_id: hall.theater_id,
        hall_number: hall.hall_number,
        name: hall.name,
        capacity: hall.capacity,
        created_at: hall.created_at,
        rows: hall.rows,
        columns_per_row: hall.columns_per_row,
        seat_layout: hall.seat_layout,
        description: hall.description,
        is_active: hall.is_active,
        seating_layout: hall.seating_layout || "Standard",
        price_multiplier: hall.price_multiplier || 1.0,
        has_dynamic_seating: hall.has_dynamic_seating || true,
        seat_configuration: hall.seat_configuration,
        published_by: hall.published_by, // Added this line
      }));

      setHalls(formattedHalls);
      setFilteredHalls(formattedHalls);
    } catch (error) {
      console.error("Error loading halls:", error);
    } finally {
      setLoading(false);
    }
  }, [theaterId]);

  useEffect(() => {
    if (theaterId) {
      loadHalls();
    }
  }, [theaterId, loadHalls]);

  // Filter halls
  useEffect(() => {
    let filtered = halls;
    if (searchTerm) {
      filtered = filtered.filter(
        (hall) =>
          (hall.name &&
            hall.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          hall.hall_number.toString().includes(searchTerm),
      );
    }
    if (filterStatus !== "all") {
      const isActive = filterStatus === "Active";
      filtered = filtered.filter((hall) => hall.is_active === isActive);
    }
    setFilteredHalls(filtered);
  }, [searchTerm, halls, filterStatus]);

  const stats = {
    total: halls.length,
    active: halls.filter((h) => h.is_active === true).length,
    inactive: halls.filter((h) => h.is_active === false).length,
    totalCapacity: halls.reduce((sum, h) => sum + (h.capacity || 0), 0),
  };

  const closeAllModals = () => {
    setShowAddModal(false);
    setShowUpdateModal(false);
    setShowViewModal(false);
    setShowDeleteModal(false);
    setShowDeactivateModal(false);
    setShowReasonModal(false);
    setSelectedHallForView(null);
    setSelectedHallForEdit(null);
    setSelectedHallForDelete(null);
    setSelectedHallForDeactivate(null);
    setDeactivateReason("");
  };

  const handleAddHall = async (hallData: any) => {
    if (!theaterId) {
      alert("No theater found. Please contact support.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("halls")
        .insert({
          theater_id: theaterId,
          hall_number: hallData.hall_number,
          name: hallData.name,
          capacity: hallData.capacity,
          rows: hallData.rows,
          seating_layout: hallData.seating_layout || "Standard",
          price_multiplier: hallData.price_multiplier || 1.0,
          has_dynamic_seating: hallData.has_dynamic_seating ?? true,
          description: hallData.description,
          seat_configuration: hallData.seat_configuration || {
            levels: ["standard", "vip", "vvip"],
            default_pricing: { vip: 120, vvip: 250, standard: 50 },
          },
          published_by: hallData.published_by,
          is_active: true,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      await loadHalls();
      closeAllModals();
      setSuccessMessage(`✨ Hall "${hallData.name}" added successfully!`);
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    } catch (error: any) {
      console.error("Error adding hall:", error);
      alert(`Failed to add hall: ${error.message}`);
    }
  };

  const handleUpdateHall = async (updatedData: any) => {
    if (!selectedHallForEdit) return;

    try {
      const { error } = await supabase
        .from("halls")
        .update({
          hall_number: updatedData.hall_number,
          name: updatedData.name,
          capacity: updatedData.capacity,
          rows: updatedData.rows,
          seating_layout: updatedData.seating_layout,
          price_multiplier: updatedData.price_multiplier,
          has_dynamic_seating: updatedData.has_dynamic_seating,
          description: updatedData.description,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedHallForEdit.id);

      if (error) throw error;

      await loadHalls();
      closeAllModals();
      setSuccessMessage(`✏️ Hall "${updatedData.name}" updated successfully!`);
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    } catch (error: any) {
      console.error("Error updating hall:", error);
      alert(`Failed to update hall: ${error.message}`);
    }
  };

  const handleDeleteHall = async () => {
    if (!selectedHallForDelete) return;

    try {
      const { error } = await supabase
        .from("halls")
        .delete()
        .eq("id", selectedHallForDelete.id);

      if (error) throw error;

      await loadHalls();
      closeAllModals();
      setSuccessMessage(
        `🗑️ Hall "${selectedHallForDelete.name}" deleted successfully!`,
      );
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    } catch (error: any) {
      console.error("Error deleting hall:", error);
      alert(`Failed to delete hall: ${error.message}`);
    }
  };

  const handleDeactivateHall = async () => {
    if (!selectedHallForDeactivate) return;

    try {
      const { error } = await supabase
        .from("halls")
        .update({
          is_active: false,
          description: selectedHallForDeactivate.description
            ? `${selectedHallForDeactivate.description}\nDeactivated: ${deactivateReason}`
            : `Deactivated: ${deactivateReason}`,
        })
        .eq("id", selectedHallForDeactivate.id);

      if (error) throw error;

      await loadHalls();
      closeAllModals();
      setSuccessMessage(
        `⚠️ Hall "${selectedHallForDeactivate.name}" has been deactivated. Reason: ${deactivateReason}`,
      );
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    } catch (error: any) {
      console.error("Error deactivating hall:", error);
      alert(`Failed to deactivate hall: ${error.message}`);
    }
  };

  const handleActivateHall = async () => {
    if (!selectedHallForDeactivate) return;

    try {
      const { error } = await supabase
        .from("halls")
        .update({
          is_active: true,
        })
        .eq("id", selectedHallForDeactivate.id);

      if (error) throw error;

      await loadHalls();
      closeAllModals();
      setSuccessMessage(
        `✅ Hall "${selectedHallForDeactivate.name}" has been reactivated!`,
      );
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    } catch (error: any) {
      console.error("Error reactivating hall:", error);
      alert(`Failed to reactivate hall: ${error.message}`);
    }
  };

  const openViewModal = (hall: Hall) => {
    setSelectedHallForView(hall);
    setShowViewModal(true);
  };

  const openEditModal = (hall: Hall) => {
    setSelectedHallForEdit(hall);
    setShowUpdateModal(true);
  };

  const openDeactivateModal = (hall: Hall) => {
    setSelectedHallForDeactivate(hall);
    setDeactivateReason("");
    setShowReasonModal(true);
  };

  const openActivateModal = (hall: Hall) => {
    setSelectedHallForDeactivate(hall);
    setShowDeactivateModal(true);
  };

  const openDeleteModal = (hall: Hall) => {
    setSelectedHallForDelete(hall);
    setShowDeleteModal(true);
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? (
      <CheckCircle className="h-3 w-3" />
    ) : (
      <XCircle className="h-3 w-3" />
    );
  };

  const getStatusLabel = (isActive: boolean) => {
    return isActive ? "Active" : "Inactive";
  };

  // Include Actions as a column
  const columns = [
    {
      Header: "Hall",
      accessor: "name",
      sortable: true,
      Cell: (row: Hall) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
            <Building className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {row.name || `Hall ${row.hall_number}`}
            </p>
            <p className="text-xs text-gray-500">
              #{row.hall_number} • {row.seating_layout} Layout
            </p>
          </div>
        </div>
      ),
    },
    {
      Header: "Capacity",
      accessor: "capacity",
      sortable: true,
      Cell: (row: Hall) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="font-semibold text-gray-900">
            {row.capacity?.toLocaleString() || 0} seats
          </span>
        </div>
      ),
    },
    {
      Header: "Price Multiplier",
      accessor: "price_multiplier",
      sortable: true,
      Cell: (row: Hall) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-amber-600">
            {row.price_multiplier || 1.0}x
          </span>
        </div>
      ),
    },
    {
      Header: "Status",
      accessor: "is_active",
      sortable: true,
      Cell: (row: Hall) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.is_active)}`}
        >
          {getStatusIcon(row.is_active)} {getStatusLabel(row.is_active)}
        </span>
      ),
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: (row: Hall) => (
        <div className="flex gap-2">
          <button
            onClick={() => openViewModal(row)}
            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition"
            title="View Details"
          >
            <Eye className="h-4 w-4 text-blue-600" />
          </button>
          <button
            onClick={() => openEditModal(row)}
            className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 transition"
            title="Edit Hall"
          >
            <Edit className="h-4 w-4 text-teal-600" />
          </button>
          {row.is_active ? (
            <button
              onClick={() => openDeactivateModal(row)}
              className="p-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 transition"
              title="Deactivate Hall"
            >
              <Ban className="h-4 w-4 text-orange-600" />
            </button>
          ) : (
            <button
              onClick={() => openActivateModal(row)}
              className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition"
              title="Activate Hall"
            >
              <RefreshCw className="h-4 w-4 text-green-600" />
            </button>
          )}
          <button
            onClick={() => openDeleteModal(row)}
            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition"
            title="Delete Hall"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
      ),
    },
  ];

  // Show loading only while fetching data
  if (loading && halls.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading halls...</p>
        </div>
      </div>
    );
  }

  // Show no theater message
  if (!theaterId && !loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            No Theater Found
          </h2>
          <p className="text-gray-600 mb-4">
            You are not associated with any theater. Please contact your
            administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 shadow-lg">
              <Building className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Halls Management
              </h1>
              <p className="text-sm text-gray-500">
                Manage theater halls, seating capacity, and pricing
                configurations
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Halls"
            value={stats.total}
            icon={Building}
            color="from-teal-500 to-teal-600"
            delay={0.1}
          />
          <StatCard
            title="Active Halls"
            value={stats.active}
            icon={CheckCircle}
            color="from-green-500 to-emerald-600"
            delay={0.15}
          />
          <StatCard
            title="Inactive Halls"
            value={stats.inactive}
            icon={XCircle}
            color="from-red-500 to-rose-600"
            delay={0.2}
          />
          <StatCard
            title="Total Capacity"
            value={stats.totalCapacity.toLocaleString()}
            icon={Users}
            color="from-purple-500 to-pink-600"
            delay={0.25}
          />
        </div>

        {/* Search, Filter, and Add Hall */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[250px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by hall name or number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white min-w-[140px]"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 text-sm whitespace-nowrap bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all rounded-xl font-medium flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Hall
          </button>
        </div>

        {/* Halls Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <ReusableTable
            columns={columns}
            data={filteredHalls}
            icon={LayoutGrid}
            showSearch={false}
            showExport={false}
            showPrint={false}
          />
        </div>

        {/* Modals */}
        {showAddModal && (
          <AddHallModal
            onSubmit={handleAddHall}
            onCancel={() => closeAllModals()}
          />
        )}

        {showUpdateModal && selectedHallForEdit && (
          <UpdateHallModal
            hall={selectedHallForEdit}
            onSubmit={handleUpdateHall}
            onCancel={() => closeAllModals()}
          />
        )}

        {showViewModal && selectedHallForView && (
          <ViewHallModal
            hall={selectedHallForView}
            isOpen={showViewModal}
            onClose={() => closeAllModals()}
            onEdit={openEditModal}
          />
        )}

        {/* Delete Modal */}
        <HallDeleteConfirmModal
          hall={selectedHallForDelete}
          onConfirm={handleDeleteHall}
          onCancel={() => closeAllModals()}
        />

        {/* Deactivate with Reason Modal */}
        {showReasonModal && selectedHallForDeactivate && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Ban className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Deactivate Hall
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Are you sure you want to deactivate{" "}
                <strong>
                  {selectedHallForDeactivate.name ||
                    `Hall ${selectedHallForDeactivate.hall_number}`}
                </strong>
                ?
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for deactivation *
                </label>
                <textarea
                  rows={3}
                  value={deactivateReason}
                  onChange={(e) => setDeactivateReason(e.target.value)}
                  placeholder="Please provide a reason for deactivating this hall..."
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => closeAllModals()}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeactivateHall}
                  disabled={!deactivateReason.trim()}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition"
                >
                  Deactivate Hall
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Activate Modal */}
        {showDeactivateModal && selectedHallForDeactivate && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <RefreshCw className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Activate Hall
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to activate{" "}
                <strong>
                  {selectedHallForDeactivate.name ||
                    `Hall ${selectedHallForDeactivate.hall_number}`}
                </strong>
                ?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => closeAllModals()}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleActivateHall}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Activate Hall
                </button>
              </div>
            </div>
          </div>
        )}

        <SuccessPopup
          isOpen={showSuccessPopup}
          onClose={() => setShowSuccessPopup(false)}
          type="success"
          title="Success"
          message={successMessage}
          duration={3000}
        />
      </div>
    </motion.div>
  );
};

export default HallsManagement;