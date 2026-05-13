// src/pages/Admin/theaters/TheaterManagement.tsx
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Building,
  Eye,
  Edit,
  RefreshCw,
  Ban,
  Phone,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  MapPin,
  Mail,
  LayoutGrid,
  UserPlus,
  Users,
  ArrowRight,
  Theater as TheaterIcon,
  Check,
  X,
  FileCheck,
  Trash2,
  PlayCircle,
  Loader2,
  Info,
  AlertTriangle,
} from "lucide-react";
import ReusableTable from "../../../components/Reusable/ReusableTable";
import SuccessPopup from "../../../components/Reusable/SuccessPopup";
import AddTheater from "./AddTheater";
import UpdateTheater from "./UpdateTheater";
import { adminService, Theater } from "./services/adminService";
import supabase from "@/config/supabaseClient";

// Extended Theater interface with additional data
interface TheaterWithDetails extends Theater {
  owner_details?: {
    full_name: string;
    email: string;
    phone: string;
    business_name?: string;
    business_type?: string;
    verification_status?: string;
  };
  contract_details?: {
    contract_number: string;
    contract_type: string;
    base_price: number;
    commission_rate: number;
    status: string;
  };
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
    },
  },
};

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  delay: number;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  delay,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md transition-all duration-300 ${isHovered ? "scale-105" : ""}`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500">{title}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
        {isHovered && <ArrowRight className="h-4 w-4 text-gray-400" />}
      </div>
    </motion.div>
  );
};

// Confirmation Modal Component
const ConfirmationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
  isSubmitting?: boolean;
}> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  isSubmitting = false,
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          icon: "bg-red-100 text-red-600",
          button: "bg-red-600 hover:bg-red-700",
        };
      case "warning":
        return {
          icon: "bg-yellow-100 text-yellow-600",
          button: "bg-yellow-600 hover:bg-yellow-700",
        };
      default:
        return {
          icon: "bg-blue-100 text-blue-600",
          button: "bg-blue-600 hover:bg-blue-700",
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-md w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-full ${styles.icon}`}>
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          </div>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isSubmitting}
              className={`flex-1 px-4 py-2 ${styles.button} text-white rounded-lg transition font-medium disabled:opacity-50 flex items-center justify-center gap-2`}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// View Modal for Theater Details
const ViewTheaterModal: React.FC<{
  theater: TheaterWithDetails | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ theater, isOpen, onClose }) => {
  const [contract, setContract] = useState<any>(null);

  useEffect(() => {
    if (theater && isOpen && theater.id) {
      fetchContractDetails();
    }
  }, [theater, isOpen]);

  const fetchContractDetails = async () => {
    if (!theater?.id) return;
    try {
      const { data } = await supabase
        .from("owners_contracts")
        .select("*")
        .eq("theater_id", theater.id)
        .maybeSingle();
      setContract(data);
    } catch (error) {
      console.error("Error fetching contract:", error);
    }
  };

  if (!isOpen || !theater) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-blue-100 text-blue-800",
      active: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      inactive: "bg-gray-100 text-gray-800",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 rounded-t-2xl z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Building className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Theater Details
                </h2>
                <p className="text-xs text-white/80">
                  {theater.legal_business_name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Theater Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
              <Info className="h-5 w-5 text-teal-600" />
              Theater Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">
                  Legal Business Name
                </label>
                <p className="text-sm font-medium text-gray-900">
                  {theater.legal_business_name}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Business Type</label>
                <p className="text-sm text-gray-900">{theater.business_type}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Status</label>
                <div className="mt-1">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(theater.status)}`}
                  >
                    {theater.status}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500">
                  Subscription Status
                </label>
                <p className="text-sm text-gray-900 capitalize">
                  {theater.subscription_status}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Location</label>
                <p className="text-sm text-gray-900">
                  {theater.city}, {theater.country}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Address</label>
                <p className="text-sm text-gray-900">{theater.address}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Created Date</label>
                <p className="text-sm text-gray-900">
                  {formatDate(theater.created_at)}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Last Updated</label>
                <p className="text-sm text-gray-900">
                  {formatDate(theater.updated_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
              <Mail className="h-5 w-5 text-teal-600" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Email</label>
                <p className="text-sm text-gray-900">{theater.email}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Phone</label>
                <p className="text-sm text-gray-900">{theater.phone}</p>
              </div>
            </div>
          </div>

          {/* Owner Information */}
          {theater.owner_details && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                <Users className="h-5 w-5 text-teal-600" />
                Owner Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Owner Name</label>
                  <p className="text-sm font-medium text-gray-900">
                    {theater.owner_details.full_name}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Email</label>
                  <p className="text-sm text-gray-900">
                    {theater.owner_details.email}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Phone</label>
                  <p className="text-sm text-gray-900">
                    {theater.owner_details.phone}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Business Name</label>
                  <p className="text-sm text-gray-900">
                    {theater.owner_details.business_name || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Contract Information */}
          {contract && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                <FileCheck className="h-5 w-5 text-teal-600" />
                Contract Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">
                    Contract Number
                  </label>
                  <p className="text-sm font-medium text-gray-900">
                    {contract.contract_number}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Contract Type</label>
                  <p className="text-sm text-gray-900 capitalize">
                    {contract.contract_type}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Base Price</label>
                  <p className="text-sm text-gray-900">
                    ETB {contract.base_price?.toLocaleString() || 0}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">
                    Commission Rate
                  </label>
                  <p className="text-sm text-gray-900">
                    {contract.commission_rate}%
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Start Date</label>
                  <p className="text-sm text-gray-900">
                    {formatDate(contract.contract_start_date)}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">
                    Contract Status
                  </label>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${contract.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                  >
                    {contract.status}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Pending Approval Modal
const PendingApprovalModal: React.FC<{
  theater: TheaterWithDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (theater: TheaterWithDetails, notes: string) => Promise<void>;
  onReject: (
    theater: TheaterWithDetails,
    reason: string,
    notes: string,
  ) => Promise<void>;
}> = ({ theater, isOpen, onClose, onApprove, onReject }) => {
  const [showApproveForm, setShowApproveForm] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [rejectNotes, setRejectNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !theater) return null;

  const handleApprove = async () => {
    setIsSubmitting(true);
    await onApprove(theater, approvalNotes);
    setIsSubmitting(false);
    onClose();
  };

  const handleReject = async () => {
    if (!rejectReason) return;
    setIsSubmitting(true);
    await onReject(theater, rejectReason, rejectNotes);
    setIsSubmitting(false);
    onClose();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-yellow-500 to-orange-600 px-6 py-4 rounded-t-2xl z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Pending Registration
                </h2>
                <p className="text-xs text-white/80">
                  {theater.legal_business_name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Theater Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
              <Info className="h-5 w-5 text-yellow-600" />
              Theater Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">
                  Legal Business Name
                </label>
                <p className="text-sm font-medium text-gray-900">
                  {theater.legal_business_name}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Business Type</label>
                <p className="text-sm text-gray-900">{theater.business_type}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Status</label>
                <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                  {theater.status}
                </span>
              </div>
              <div>
                <label className="text-xs text-gray-500">Location</label>
                <p className="text-sm text-gray-900">
                  {theater.city}, {theater.country}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Address</label>
                <p className="text-sm text-gray-900">{theater.address}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Created Date</label>
                <p className="text-sm text-gray-900">
                  {formatDate(theater.created_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Owner Information */}
          {theater.owner_details && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                <Users className="h-5 w-5 text-yellow-600" />
                Owner Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Owner Name</label>
                  <p className="text-sm font-medium text-gray-900">
                    {theater.owner_details.full_name}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Email</label>
                  <p className="text-sm text-gray-900">
                    {theater.owner_details.email}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Phone</label>
                  <p className="text-sm text-gray-900">
                    {theater.owner_details.phone}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {!showApproveForm && !showRejectForm && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Registration Approval
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowApproveForm(true)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  <Check className="h-4 w-4" /> Approve Registration
                </button>
                <button
                  onClick={() => setShowRejectForm(true)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
                >
                  <X className="h-4 w-4" /> Reject Registration
                </button>
              </div>
            </div>
          )}

          {/* Approve Form */}
          {showApproveForm && (
            <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
              <h3 className="text-sm font-semibold text-green-800 mb-3">
                Approve Theater Registration
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Approval Notes (Optional)
                </label>
                <textarea
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none"
                  placeholder="Add any notes for the theater owner..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowApproveForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  Confirm Approval
                </button>
              </div>
            </div>
          )}

          {/* Reject Form */}
          {showRejectForm && (
            <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200">
              <h3 className="text-sm font-semibold text-red-800 mb-3">
                Reject Theater Registration
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                >
                  <option value="">Select Reason</option>
                  <option value="incomplete_documents">
                    Incomplete Documents
                  </option>
                  <option value="invalid_information">
                    Invalid Information
                  </option>
                  <option value="duplicate_registration">
                    Duplicate Registration
                  </option>
                  <option value="policy_violation">Policy Violation</option>
                  <option value="business_verification_failed">
                    Business Verification Failed
                  </option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none resize-none"
                  placeholder="Provide more details..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRejectForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={isSubmitting || !rejectReason}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                  Confirm Rejection
                </button>
              </div>
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-end pt-4 mt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <X className="h-4 w-4" /> Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const TheaterManagement: React.FC = () => {
  const [theaters, setTheaters] = useState<TheaterWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [selectedTheater, setSelectedTheater] =
    useState<TheaterWithDetails | null>(null);
  const [viewingTheater, setViewingTheater] =
    useState<TheaterWithDetails | null>(null);
  const [pendingTheater, setPendingTheater] =
    useState<TheaterWithDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({
    title: "",
    message: "",
    type: "success" as "success" | "error" | "warning" | "info",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Confirmation modal states
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    type: "delete" | "deactivate" | "activate";
    theater: TheaterWithDetails | null;
  }>({
    isOpen: false,
    type: "delete",
    theater: null,
  });

  // Fetch theaters from database
  const fetchTheaters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getTheaters();

      // Enhance theater data with owner details
      const enhancedTheaters = await Promise.all(
        data.map(async (theater) => {
          let ownerDetails = null;
          if (theater.owner_user_id) {
            const { data: userData } = await supabase
              .from("users")
              .select("full_name, email, phone")
              .eq("id", theater.owner_user_id)
              .single();

            const { data: ownerData } = await supabase
              .from("owners")
              .select("business_name, business_type, verification_status")
              .eq("user_id", theater.owner_user_id)
              .maybeSingle();

            ownerDetails = {
              full_name: userData?.full_name || "",
              email: userData?.email || "",
              phone: userData?.phone || "",
              business_name: ownerData?.business_name,
              business_type: ownerData?.business_type,
              verification_status: ownerData?.verification_status,
            };
          }

          return {
            ...theater,
            owner_details: ownerDetails,
          } as TheaterWithDetails;
        }),
      );

      setTheaters(enhancedTheaters);
    } catch (err: any) {
      console.error("Error fetching theaters:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTheaters();
  }, [fetchTheaters]);

  // Filter and sort theaters
  const filteredTheaters = React.useMemo(() => {
    let filtered = [...theaters];

    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.legal_business_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          t.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.owner_details?.full_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((t) => t.status === filterStatus);
    }

    const statusOrder: Record<string, number> = {
      pending: 0,
      active: 1,
      approved: 2,
      rejected: 3,
      inactive: 4,
    };
    filtered.sort(
      (a, b) => (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99),
    );

    return filtered;
  }, [theaters, searchTerm, filterStatus]);

  // Statistics
  const stats = {
    totalTheaters: theaters.length,
    activeTheaters: theaters.filter((t) => t.status === "active").length,
    pendingTheaters: theaters.filter((t) => t.status === "pending").length,
    rejectedTheaters: theaters.filter((t) => t.status === "rejected").length,
  };

  const dashboardCards = [
    {
      title: "Total Theaters",
      value: stats.totalTheaters,
      icon: Building,
      color: "from-teal-500 to-teal-600",
      delay: 0.1,
    },
    {
      title: "Pending Theaters",
      value: stats.pendingTheaters,
      icon: Clock,
      color: "from-yellow-500 to-orange-600",
      delay: 0.15,
    },
    {
      title: "Active Theaters",
      value: stats.activeTheaters,
      icon: TheaterIcon,
      color: "from-green-500 to-emerald-600",
      delay: 0.2,
    },
    {
      title: "Rejected Theaters",
      value: stats.rejectedTheaters,
      icon: Ban,
      color: "from-red-500 to-rose-600",
      delay: 0.25,
    },
  ];

  // Handlers with confirmation modals
  const handleAddTheater = async () => {
    await fetchTheaters();
    setShowAddModal(false);
    setPopupMessage({
      title: "Success!",
      message: "New theater has been added and is pending approval",
      type: "success",
    });
    setShowSuccessPopup(true);
  };

  const handleUpdateTheater = async (data: any) => {
    await fetchTheaters();
    setShowUpdateModal(false);
    setSelectedTheater(null);
    setPopupMessage({
      title: "Success!",
      message: `${data.legal_business_name} has been updated`,
      type: "success",
    });
    setShowSuccessPopup(true);
  };

  const handleApproveTheater = async (
    theater: TheaterWithDetails,
    notes: string,
  ) => {
    setIsSubmitting(true);
    try {
      await adminService.approveTheater(theater.id, "admin");
      await fetchTheaters();
      setPopupMessage({
        title: "Approved!",
        message: `${theater.legal_business_name} has been approved successfully!`,
        type: "success",
      });
      setShowSuccessPopup(true);
    } catch (err: any) {
      setPopupMessage({ title: "Error!", message: err.message, type: "error" });
      setShowSuccessPopup(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectTheater = async (
    theater: TheaterWithDetails,
    reason: string,
    notes: string,
  ) => {
    setIsSubmitting(true);
    try {
      await adminService.rejectTheater(theater.id);
      await fetchTheaters();
      setPopupMessage({
        title: "Rejected!",
        message: `${theater.legal_business_name} has been rejected. Reason: ${reason}`,
        type: "warning",
      });
      setShowSuccessPopup(true);
    } catch (err: any) {
      setPopupMessage({ title: "Error!", message: err.message, type: "error" });
      setShowSuccessPopup(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActivateTheater = async () => {
    if (!confirmationModal.theater) return;
    setIsSubmitting(true);
    try {
      await adminService.updateTheater(confirmationModal.theater.id, {
        status: "active",
        is_approved: true,
      });
      await fetchTheaters();
      setPopupMessage({
        title: "Activated!",
        message: `${confirmationModal.theater.legal_business_name} has been activated`,
        type: "success",
      });
      setShowSuccessPopup(true);
    } catch (err: any) {
      setPopupMessage({ title: "Error!", message: err.message, type: "error" });
      setShowSuccessPopup(true);
    } finally {
      setIsSubmitting(false);
      setConfirmationModal({ isOpen: false, type: "activate", theater: null });
    }
  };

  const handleDeactivateTheater = async () => {
    if (!confirmationModal.theater) return;
    setIsSubmitting(true);
    try {
      await adminService.updateTheater(confirmationModal.theater.id, {
        status: "inactive",
        is_approved: false,
      });
      await fetchTheaters();
      setPopupMessage({
        title: "Deactivated!",
        message: `${confirmationModal.theater.legal_business_name} has been deactivated`,
        type: "warning",
      });
      setShowSuccessPopup(true);
    } catch (err: any) {
      setPopupMessage({ title: "Error!", message: err.message, type: "error" });
      setShowSuccessPopup(true);
    } finally {
      setIsSubmitting(false);
      setConfirmationModal({
        isOpen: false,
        type: "deactivate",
        theater: null,
      });
    }
  };

  const handleDeleteTheater = async () => {
    if (!confirmationModal.theater) return;
    setIsSubmitting(true);
    try {
      await adminService.deleteTheater(confirmationModal.theater.id);
      await fetchTheaters();
      setPopupMessage({
        title: "Deleted!",
        message: `${confirmationModal.theater.legal_business_name} has been deleted`,
        type: "warning",
      });
      setShowSuccessPopup(true);
    } catch (err: any) {
      setPopupMessage({ title: "Error!", message: err.message, type: "error" });
      setShowSuccessPopup(true);
    } finally {
      setIsSubmitting(false);
      setConfirmationModal({ isOpen: false, type: "delete", theater: null });
    }
  };

  const handleEditClick = (row: TheaterWithDetails) => {
    setSelectedTheater(row);
    setShowUpdateModal(true);
  };

  const handleViewClick = (row: TheaterWithDetails) => {
    if (row.status === "pending") {
      setPendingTheater(row);
      setShowPendingModal(true);
    } else {
      setViewingTheater(row);
      setShowViewModal(true);
    }
  };

  const openConfirmationModal = (
    type: "delete" | "deactivate" | "activate",
    theater: TheaterWithDetails,
  ) => {
    setConfirmationModal({
      isOpen: true,
      type,
      theater,
    });
  };

  const getConfirmationModalProps = () => {
    if (!confirmationModal.theater) return null;

    const theaterName = confirmationModal.theater.legal_business_name;

    switch (confirmationModal.type) {
      case "delete":
        return {
          title: "Delete Theater",
          message: `Are you sure you want to delete "${theaterName}"? This action cannot be undone and will permanently remove all associated data.`,
          confirmText: "Delete",
          type: "danger" as const,
          onConfirm: handleDeleteTheater,
        };
      case "deactivate":
        return {
          title: "Deactivate Theater",
          message: `Are you sure you want to deactivate "${theaterName}"? The theater will not be accessible until reactivated.`,
          confirmText: "Deactivate",
          type: "warning" as const,
          onConfirm: handleDeactivateTheater,
        };
      case "activate":
        return {
          title: "Activate Theater",
          message: `Are you sure you want to activate "${theaterName}"? The theater will become fully accessible.`,
          confirmText: "Activate",
          type: "info" as const,
          onConfirm: handleActivateTheater,
        };
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
            ✅ Active
          </span>
        );
      case "inactive":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
            ❌ Inactive
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 animate-pulse">
            ⏳ Pending
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
            ❌ Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const columns = [
    {
      Header: "Theater",
      accessor: "legal_business_name",
      sortable: true,
      Cell: (row: TheaterWithDetails) => (
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold ${row.status === "pending" ? "animate-pulse" : ""}`}
          >
            {row.legal_business_name?.charAt(0) || "T"}
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {row.legal_business_name}
            </p>
            <p className="text-xs text-gray-500">
              ID: {row.id?.slice(0, 8)}...
            </p>
          </div>
        </div>
      ),
    },
    {
      Header: "Owner",
      accessor: "owner_details",
      sortable: true,
      Cell: (row: TheaterWithDetails) => (
        <div>
          <p className="text-sm font-medium text-gray-900">
            {row.owner_details?.full_name || "N/A"}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <Mail className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-500">{row.email}</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-500">{row.phone}</span>
          </div>
        </div>
      ),
    },
    {
      Header: "Location",
      accessor: "city",
      sortable: true,
      Cell: (row: TheaterWithDetails) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-3 w-3 text-gray-400" />
          <span className="text-sm text-gray-600">
            {row.city}, {row.country}
          </span>
        </div>
      ),
    },
    {
      Header: "Business Type",
      accessor: "business_type",
      sortable: true,
      Cell: (row: TheaterWithDetails) => (
        <span className="text-sm text-gray-600">{row.business_type}</span>
      ),
    },
    {
      Header: "Status",
      accessor: "status",
      sortable: true,
      Cell: (row: TheaterWithDetails) => getStatusBadge(row.status),
    },
    {
      Header: "Subscription",
      accessor: "subscription_status",
      sortable: true,
      Cell: (row: TheaterWithDetails) => (
        <span
          className={`px-2 py-1 text-xs rounded-full capitalize ${
            row.subscription_status === "active"
              ? "bg-green-100 text-green-800"
              : row.subscription_status === "trial"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.subscription_status}
        </span>
      ),
    },
    {
      Header: "Created",
      accessor: "created_at",
      sortable: true,
      Cell: (row: TheaterWithDetails) => (
        <span className="text-sm text-gray-600">
          {new Date(row.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      Header: "Actions",
      accessor: "id",
      sortable: false,
      Cell: (row: TheaterWithDetails) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewClick(row)}
            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4 text-blue-600" />
          </button>

          {row.status !== "pending" && row.status !== "rejected" && (
            <button
              onClick={() => handleEditClick(row)}
              className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 transition-colors"
              title="Edit Theater"
            >
              <Edit className="h-4 w-4 text-teal-600" />
            </button>
          )}

          {row.status === "active" && (
            <button
              onClick={() => openConfirmationModal("deactivate", row)}
              className="p-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors"
              title="Deactivate"
            >
              <Ban className="h-4 w-4 text-orange-600" />
            </button>
          )}

          {row.status === "inactive" && (
            <button
              onClick={() => openConfirmationModal("activate", row)}
              className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
              title="Activate"
            >
              <PlayCircle className="h-4 w-4 text-green-600" />
            </button>
          )}

          {row.status !== "pending" && (
            <button
              onClick={() => openConfirmationModal("delete", row)}
              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
              title="Delete"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </button>
          )}
        </div>
      ),
    },
  ];

  const modalProps = getConfirmationModalProps();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading theaters...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-3" />
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchTheaters}
            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
          >
            {dashboardCards.map((card, index) => (
              <StatCard
                key={index}
                title={card.title}
                value={card.value}
                icon={card.icon}
                color={card.color}
                delay={card.delay}
                onClick={() => {
                  if (card.title === "Pending Theaters")
                    setFilterStatus("pending");
                  else if (card.title === "Active Theaters")
                    setFilterStatus("active");
                  else if (card.title === "Rejected Theaters")
                    setFilterStatus("rejected");
                  else setFilterStatus("all");
                }}
              />
            ))}
          </motion.div>

          {/* Search and Add Button */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[250px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search theaters by name, email, city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
              <button
                onClick={fetchTheaters}
                className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4 text-gray-500" />
                Refresh
              </button>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-medium flex items-center gap-2 shadow-md transition-all"
            >
              <UserPlus className="h-4 w-4" />
              Add New Theater
            </button>
          </div>

          {/* Table */}
          <ReusableTable
            columns={columns}
            data={filteredTheaters}
            title="All Theaters"
            icon={LayoutGrid}
            showSearch={false}
            showExport={true}
            showPrint={true}
            itemsPerPage={10}
          />

          {/* Modals */}
          {showAddModal && (
            <AddTheater
              onClose={() => setShowAddModal(false)}
              onTheaterAdded={handleAddTheater}
              formTitle="Register New Theater"
            />
          )}

          {showUpdateModal && selectedTheater && (
            <UpdateTheater
              theater={selectedTheater}
              isOpen={showUpdateModal}
              onClose={() => {
                setShowUpdateModal(false);
                setSelectedTheater(null);
              }}
              onUpdate={handleUpdateTheater}
            />
          )}

          {/* View Modal */}
          <ViewTheaterModal
            theater={viewingTheater}
            isOpen={showViewModal}
            onClose={() => {
              setShowViewModal(false);
              setViewingTheater(null);
            }}
          />

          {/* Pending Approval Modal */}
          <PendingApprovalModal
            theater={pendingTheater}
            isOpen={showPendingModal}
            onClose={() => {
              setShowPendingModal(false);
              setPendingTheater(null);
            }}
            onApprove={handleApproveTheater}
            onReject={handleRejectTheater}
          />

          {/* Success Popup */}
          <SuccessPopup
            isOpen={showSuccessPopup}
            onClose={() => setShowSuccessPopup(false)}
            type={popupMessage.type}
            title={popupMessage.title}
            message={popupMessage.message}
            duration={4000}
          />
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      {modalProps && (
        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={() =>
            setConfirmationModal({
              isOpen: false,
              type: "delete",
              theater: null,
            })
          }
          onConfirm={modalProps.onConfirm}
          title={modalProps.title}
          message={modalProps.message}
          confirmText={modalProps.confirmText}
          type={modalProps.type}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
};

export default TheaterManagement;
