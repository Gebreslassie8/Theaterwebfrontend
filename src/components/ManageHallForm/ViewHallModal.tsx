// src/components/ManageHallForm/ViewHallModal.tsx
import React from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { Hall, getStatusFromIsActive } from "./types";

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

  // Helper to format rows display
  const formatRowsDisplay = (rows: string | null): string => {
    if (!rows) return "Not configured";
    return rows;
  };

  // Helper to get seating layout display name
  const getSeatingLayoutDisplay = (layout: string): string => {
    const layoutMap: Record<string, string> = {
      Standard: "Standard",
      Compact: "Compact",
      Premium: "Premium",
      VIP: "VIP",
      Balcony: "Balcony",
    };
    return layoutMap[layout] || layout;
  };

  // Helper to get seat levels from configuration
  const getSeatLevels = () => {
    if (hall.seat_configuration?.levels) {
      const pricing = hall.seat_configuration.default_pricing;
      return hall.seat_configuration.levels.map((level) => ({
        name: level.charAt(0).toUpperCase() + level.slice(1),
        count: Math.floor(
          hall.capacity / hall.seat_configuration!.levels.length,
        ),
        price: pricing[level] || 50,
      }));
    }
    // Fallback default seat types
    return [
      { name: "Standard", count: Math.floor(hall.capacity * 0.6), price: 50 },
      { name: "VIP", count: Math.floor(hall.capacity * 0.25), price: 120 },
      { name: "VVIP", count: Math.floor(hall.capacity * 0.15), price: 250 },
    ];
  };

  const seatLevels = getSeatLevels();
  const totalCapacity = hall.capacity;

  // Calculate total positions from rows configuration
  const getTotalPositions = (): number => {
    if (hall.rows) {
      const rowMatch = hall.rows.match(/([A-Z])-([A-Z])/);
      if (rowMatch) {
        const startRow = rowMatch[1].charCodeAt(0);
        const endRow = rowMatch[2].charCodeAt(0);
        const numberOfRows = endRow - startRow + 1;
        return numberOfRows * 20; // Approximate columns
      }
    }
    return hall.capacity;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header with Gradient */}
        <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-5 text-white">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Building className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {hall.name || `Hall ${hall.hall_number}`}
                </h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-white/80 text-sm">
                    #{hall.hall_number}
                  </span>
                  <span className="text-white/40">•</span>
                  <span className="text-white/80 text-sm">
                    {getSeatingLayoutDisplay(hall.seating_layout)} Layout
                  </span>
                  <span className="text-white/40">•</span>
                  <span className="flex items-center gap-1 text-white/80 text-sm">
                    <MapPin className="h-3 w-3" />
                    {formatRowsDisplay(hall.rows)}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

            {/* Hall Number Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-500">Hall Number</p>
                <Hash className="h-4 w-4 text-indigo-500" />
              </div>
              <p className="text-xl font-bold text-indigo-700">
                #{hall.hall_number}
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

            {/* Price Multiplier Card */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-500">
                  Price Multiplier
                </p>
                <DollarSign className="h-4 w-4 text-amber-500" />
              </div>
              <p className="text-xl font-bold text-amber-700">
                {hall.price_multiplier}x
              </p>
              <p className="text-xs text-amber-600 mt-1">
                Base price × {hall.price_multiplier}
              </p>
            </div>
          </div>

          {/* Configuration Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Seating Layout Detail */}
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-4 border border-teal-200">
              <div className="flex items-center gap-2 mb-2">
                <Layout className="h-4 w-4 text-teal-600" />
                <p className="text-xs font-medium text-gray-600">
                  Seating Layout
                </p>
              </div>
              <p className="text-lg font-semibold text-teal-800">
                {getSeatingLayoutDisplay(hall.seating_layout)}
              </p>
            </div>

            {/* Dynamic Seating Detail */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <p className="text-xs font-medium text-gray-600">
                  Dynamic Seating
                </p>
              </div>
              <p className="text-lg font-semibold text-blue-800">
                {hall.has_dynamic_seating ? "Enabled" : "Disabled"}
              </p>
              {hall.has_dynamic_seating && (
                <p className="text-xs text-blue-600 mt-1">
                  Dynamic pricing adjusts based on demand
                </p>
              )}
            </div>
          </div>

          {/* Description Section */}
          {hall.description && (
            <div className="mb-6">
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

          {/* Seat Types Breakdown */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Layers className="h-5 w-5 text-teal-600" />
              Seat Configuration
            </h3>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 border-b border-gray-200">
                <div className="text-sm font-semibold text-gray-600">
                  Seat Level
                </div>
                <div className="text-sm font-semibold text-gray-600 text-right">
                  Count
                </div>
                <div className="text-sm font-semibold text-gray-600 text-right">
                  Base Price (ETB)
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {seatLevels.map((level, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-3 gap-4 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          level.name === "Standard"
                            ? "bg-green-500"
                            : level.name === "VIP"
                              ? "bg-yellow-500"
                              : "bg-purple-500"
                        }`}
                      ></div>
                      <span className="font-medium text-gray-800">
                        {level.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-700 font-semibold">
                        {level.count.toLocaleString()}
                      </span>
                      <span className="text-gray-400 text-sm ml-1">seats</span>
                    </div>
                    <div className="text-right">
                      <span className="text-green-600 font-semibold">
                        ETB {level.price}
                      </span>
                      <span className="text-gray-400 text-sm ml-1">/seat</span>
                    </div>
                  </div>
                ))}
              </div>
              {/* Total Row */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-teal-50 border-t border-teal-200">
                <div className="font-semibold text-teal-800">
                  Total Capacity
                </div>
                <div className="text-right font-bold text-teal-800">
                  {totalCapacity.toLocaleString()} seats
                </div>
                <div className="text-right text-teal-600">
                  {hall.has_dynamic_seating
                    ? "Dynamic Pricing Available"
                    : "Fixed Pricing"}
                </div>
              </div>
            </div>
          </div>

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
