// src/components/ManageHallForm/ViewHallModal.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Building,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  Layers,
  Edit,
  MapPin,
  Ruler,
  Calendar,
  Award,
  Sparkles,
  Hash,
  Tag,
  Info,
  Layout,
  Grid,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  User,
} from "lucide-react";
import { Hall, getStatusFromIsActive, SeatLevel, Seat } from "./types";
import supabase from "@/config/supabaseClient";

interface ViewHallModalProps {
  hall: Hall | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (hall: Hall) => void;
}

const ViewHallModal: React.FC<ViewHallModalProps> = ({
  hall,
  isOpen,
  onClose,
  onEdit,
}) => {
  const [seatLevels, setSeatLevels] = useState<SeatLevel[]>([]);
  const [seatLayout, setSeatLayout] = useState<Seat[]>([]);
  const [loadingLayout, setLoadingLayout] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [zoom, setZoom] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const seatsPerPage = 100;

  useEffect(() => {
    if (isOpen && hall?.id) {
      loadSeatLevels();
      loadSeatLayout();
    }
  }, [isOpen, hall?.id]);

  const loadSeatLevels = async () => {
    if (!hall?.id) return;

    try {
      const { data, error } = await supabase
        .from("seat_levels")
        .select("*")
        .eq("hall_id", hall.id)
        .order("display_order", { ascending: true });

      if (error) throw error;
      setSeatLevels(data || []);
    } catch (error) {
      console.error("Error loading seat levels:", error);
    }
  };

  const loadSeatLayout = async () => {
    if (!hall?.id) return;

    setLoadingLayout(true);
    try {
      const { data, error } = await supabase
        .from("seats")
        .select("*")
        .eq("hall_id", hall.id)
        .order("seat_row", { ascending: true })
        .order("seat_number", { ascending: true });

      if (error) throw error;
      setSeatLayout(data || []);
    } catch (error) {
      console.error("Error loading seat layout:", error);
    } finally {
      setLoadingLayout(false);
    }
  };

  if (!isOpen || !hall) return null;

  const getStatusConfig = (isActive: boolean) => {
    if (isActive) {
      return {
        icon: CheckCircle,
        color: "bg-green-100 text-green-700",
        bgGradient: "from-green-50 to-emerald-50",
        borderColor: "border-green-200",
        iconColor: "text-green-600",
        label: "Active",
      };
    }
    return {
      icon: XCircle,
      color: "bg-red-100 text-red-700",
      bgGradient: "from-red-50 to-rose-50",
      borderColor: "border-red-200",
      iconColor: "text-red-600",
      label: "Inactive",
    };
  };

  const statusConfig = getStatusConfig(hall.is_active);
  const StatusIcon = statusConfig.icon;

  // Filter seats by selected level
  const filteredSeats =
    selectedLevel === "all"
      ? seatLayout
      : seatLayout.filter((seat) => {
          const level = seatLevels.find((l) => l.id === seat.seat_level_id);
          return level?.name === selectedLevel;
        });

  // Paginate seats
  const paginatedSeats = filteredSeats.slice(
    currentPage * seatsPerPage,
    (currentPage + 1) * seatsPerPage,
  );

  const totalPages = Math.ceil(filteredSeats.length / seatsPerPage);

  // Group seats by row for better visualization
  const seatsByRow = paginatedSeats.reduce(
    (acc, seat) => {
      if (!acc[seat.seat_row]) {
        acc[seat.seat_row] = [];
      }
      acc[seat.seat_row].push(seat);
      return acc;
    },
    {} as Record<string, Seat[]>,
  );

  // Sort rows alphabetically
  const sortedRows = Object.keys(seatsByRow).sort();

  // Get color for seat level
  const getSeatLevelColor = (levelId: string | null): string => {
    const level = seatLevels.find((l) => l.id === levelId);
    return level?.color || "#6B7280";
  };

  // Get seat status color (using is_reserved)
  const getSeatStatusColor = (isReserved: boolean): string => {
    return isReserved ? "bg-red-500" : "bg-green-500 hover:bg-green-600";
  };

  // Get seat status label
  const getSeatStatusLabel = (isReserved: boolean): string => {
    return isReserved ? "Reserved" : "Available";
  };

  const totalCapacity = hall.capacity;
  const totalSeatsInLayout = seatLayout.length;
  const availableSeats = seatLayout.filter((s) => !s.is_reserved).length;
  const reservedSeats = seatLayout.filter((s) => s.is_reserved).length;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header with Gradient */}
        <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-5 text-white z-10">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Building className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {hall.name || "Unnamed Hall"}
                </h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-white/80 text-sm">
                    ID: {hall.id.slice(0, 8)}...
                  </span>
                  <span className="text-white/40">•</span>
                  <span className="flex items-center gap-1 text-white/80 text-sm">
                    <Grid className="h-3 w-3" />
                    {hall.num_of_row || 0} rows × {hall.num_of_col || 0} cols
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Status Card */}
            <div
              className={`bg-gradient-to-br ${statusConfig.bgGradient} rounded-xl p-4 border ${statusConfig.borderColor}`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-500">
                  Current Status
                </p>
                <StatusIcon className={`h-4 w-4 ${statusConfig.iconColor}`} />
              </div>
              <p className={`text-xl font-bold ${statusConfig.color}`}>
                {statusConfig.label}
              </p>
            </div>

            {/* Capacity Card */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-500">
                  Total Capacity
                </p>
                <Users className="h-4 w-4 text-purple-500" />
              </div>
              <p className="text-xl font-bold text-purple-700">
                {totalCapacity.toLocaleString()}{" "}
                <span className="text-sm font-normal">seats</span>
              </p>
            </div>

            {/* Dimensions Card */}
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-4 border border-teal-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-500">Dimensions</p>
                <Grid className="h-4 w-4 text-teal-500" />
              </div>
              <p className="text-xl font-bold text-teal-700">
                {hall.num_of_row || 0} × {hall.num_of_col || 0}
              </p>
              <p className="text-xs text-teal-600 mt-1">rows × columns</p>
            </div>
          </div>

          {/* Seat Statistics */}
          {seatLayout.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
                <p className="text-xs text-green-600">Available</p>
                <p className="text-xl font-bold text-green-700">
                  {availableSeats}
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-3 text-center border border-red-200">
                <p className="text-xs text-red-600">Reserved</p>
                <p className="text-xl font-bold text-red-700">
                  {reservedSeats}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                <p className="text-xs text-gray-600">Total</p>
                <p className="text-xl font-bold text-gray-700">
                  {totalSeatsInLayout}
                </p>
              </div>
            </div>
          )}

          {/* Seat Levels Section */}
          {seatLevels.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Award className="h-5 w-5 text-teal-600" />
                Seat Levels
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {seatLevels.map((level) => (
                  <div
                    key={level.id}
                    className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-3 border border-gray-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: level.color }}
                      />
                      <span className="font-semibold text-gray-800">
                        {level.display_name}
                      </span>
                    </div>
                    <p className="text-green-600 font-bold">
                      ETB {level.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      ID: {level.id.slice(0, 8)}...
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Seat Layout Visualization */}
          {seatLayout.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Layout className="h-5 w-5 text-teal-600" />
                  Seat Layout
                </h3>
                <div className="flex items-center gap-2">
                  {/* Level Filter */}
                  <select
                    value={selectedLevel}
                    onChange={(e) => {
                      setSelectedLevel(e.target.value);
                      setCurrentPage(0);
                    }}
                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="all">All Levels</option>
                    {seatLevels.map((level) => (
                      <option key={level.id} value={level.name}>
                        {level.display_name}
                      </option>
                    ))}
                  </select>

                  {/* Zoom Controls */}
                  <div className="flex gap-1">
                    <button
                      onClick={() =>
                        setZoom((prev) => Math.max(0.5, prev - 0.1))
                      }
                      className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </button>
                    <span className="px-2 py-1.5 text-sm font-medium">
                      {Math.round(zoom * 100)}%
                    </span>
                    <button
                      onClick={() =>
                        setZoom((prev) => Math.min(1.5, prev + 0.1))
                      }
                      className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {loadingLayout ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
                </div>
              ) : (
                <>
                  {/* Screen indicator */}
                  <div className="text-center mb-6">
                    <div className="inline-block w-48 h-1 bg-gray-300 rounded-full" />
                    <p className="text-xs text-gray-400 mt-1">SCREEN</p>
                  </div>

                  {/* Seat Grid */}
                  <div
                    className="overflow-x-auto"
                    style={{
                      transform: `scale(${zoom})`,
                      transformOrigin: "top left",
                    }}
                  >
                    <div className="inline-block min-w-full">
                      {sortedRows.map((row) => (
                        <div key={row} className="flex justify-center mb-1">
                          <div className="flex items-center gap-1">
                            <span className="w-8 text-xs font-medium text-gray-500">
                              {row}
                            </span>
                            {seatsByRow[row]
                              .sort((a, b) => a.seat_number - b.seat_number)
                              .map((seat) => (
                                <div
                                  key={seat.id}
                                  className={`w-8 h-8 rounded-lg text-xs flex items-center justify-center transition-all cursor-help ${getSeatStatusColor(
                                    seat.is_reserved,
                                  )}`}
                                  title={`${seat.seat_label} - ${getSeatStatusLabel(
                                    seat.is_reserved,
                                  )}`}
                                  style={{
                                    backgroundColor: !seat.is_reserved
                                      ? getSeatLevelColor(seat.seat_level_id)
                                      : undefined,
                                  }}
                                >
                                  {seat.seat_number}
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-4">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(0, prev - 1))
                        }
                        disabled={currentPage === 0}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <span className="text-sm text-gray-600">
                        Page {currentPage + 1} of {totalPages}
                      </span>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages - 1, prev + 1),
                          )
                        }
                        disabled={currentPage === totalPages - 1}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {/* Legend */}
                  <div className="flex flex-wrap justify-center gap-4 mt-6 pt-4 border-t">
                    {seatLevels.map((level) => (
                      <div key={level.id} className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: level.color }}
                        />
                        <span className="text-xs text-gray-600">
                          {level.display_name}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-red-500" />
                      <span className="text-xs text-gray-600">Reserved</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Description Section */}
          {hall.description && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Info className="h-5 w-5 text-teal-600" />
                Description
              </h3>
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                <p className="text-gray-700 leading-relaxed">
                  {hall.description}
                </p>
              </div>
            </div>
          )}

          {/* Metadata Section */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-xs font-medium text-gray-500">Created</span>
            </div>
            <p className="text-sm text-gray-700">
              {hall.created_at
                ? new Date(hall.created_at).toLocaleDateString()
                : "Not available"}
            </p>
            {hall.created_by && (
              <>
                <div className="flex items-center gap-2 mt-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-xs font-medium text-gray-500">
                    Created by User ID
                  </span>
                </div>
                <p className="text-sm text-gray-700 font-mono text-xs">
                  {hall.created_by}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-5 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
          >
            Close
          </button>
          {onEdit && (
            <button
              onClick={() => {
                onClose();
                onEdit(hall);
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg hover:from-teal-600 hover:to-emerald-700 transition-all font-medium flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Hall
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ViewHallModal;