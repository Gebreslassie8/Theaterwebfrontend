// src/pages/Admin/theaters/ViewTheater.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Building,
  Mail,
  User,
  Phone,
  MapPin,
  Hash,
  Users,
  Calendar,
  Briefcase,
  Home,
  Globe,
  Clock,
  CreditCard,
  FileText,
  Shield,
  AlertCircle,
  CheckCircle,
  Info,
  Loader2,
  FileCheck,
  Receipt,
  Award,
  TrendingUp,
  Percent,
  Edit,
} from "lucide-react";
import ReusableButton from "../../../components/Reusable/ReusableButton";
import supabase from "@/config/supabaseClient";

interface TheaterData {
  id: string;
  legal_business_name: string;
  business_type: string;
  business_license_number: string | null;
  license_expiry_date: string | null;
  license_status: string;
  license_document_url: string | null;
  tax_id: string | null;
  tax_registration_certificate_path: string | null;
  country: string;
  city: string;
  address: string;
  email: string;
  phone: string;
  description: string | null;
  status: string;
  is_approved: boolean;
  subscription_status: string;
  created_at: string;
  updated_at: string;
  owner_user_id: string | null;
  approved_by: string | null;
}

interface OwnerData {
  id: string;
  user_id: string;
  national_id: string | null;
  tin_number: string | null;
  business_name: string | null;
  business_type: string | null;
  years_of_experience: number | null;
  physical_address: string | null;
  city: string | null;
  verification_status: string;
  profile_image_url: string | null;
}

interface UserData {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: string;
}

interface ContractData {
  id: string;
  contract_number: string;
  contract_type: string;
  subscription_plan: string | null;
  base_price: number;
  discounted_price: number | null;
  commission_rate: number;
  contract_start_date: string;
  contract_end_date: string | null;
  payment_frequency: string | null;
  payment_status: string;
  status: string;
}

interface ViewTheaterProps {
  theater: TheaterData;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (theater: TheaterData) => void;
}

const ViewTheater: React.FC<ViewTheaterProps> = ({
  theater,
  isOpen,
  onClose,
  onEdit,
}) => {
  const [loading, setLoading] = useState(false);
  const [ownerData, setOwnerData] = useState<OwnerData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [contractLoading, setContractLoading] = useState(true);

  useEffect(() => {
    if (isOpen && theater) {
      fetchRelatedData();
    }
  }, [isOpen, theater]);

  const fetchRelatedData = async () => {
    setLoading(true);
    setContractLoading(true);

    try {
      // Fetch owner data if owner_user_id exists
      if (theater.owner_user_id) {
        const { data: user, error: userError } = await supabase
          .from("users")
          .select("id, full_name, email, phone, role")
          .eq("id", theater.owner_user_id)
          .single();

        if (user && !userError) {
          setUserData(user);

          // Fetch owner details from owners table
          const { data: owner, error: ownerError } = await supabase
            .from("owners")
            .select("*")
            .eq("user_id", theater.owner_user_id)
            .maybeSingle();

          if (owner && !ownerError) {
            setOwnerData(owner);
          }
        }
      }

      // Fetch contract data
      const { data: contract, error: contractError } = await supabase
        .from("owners_contracts")
        .select("*")
        .eq("theater_id", theater.id)
        .maybeSingle();

      if (contract && !contractError) {
        setContractData(contract);
      }
    } catch (error) {
      console.error("Error fetching related data:", error);
    } finally {
      setLoading(false);
      setContractLoading(false);
    }
  };

  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "approved":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "inactive":
        return "bg-red-100 text-red-700 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "rejected":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <CheckCircle className="h-4 w-4" />;
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "inactive":
        return <AlertCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "rejected":
        return <X className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getLicenseStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      expired: "bg-red-100 text-red-800",
      revoked: "bg-gray-100 text-gray-800",
    };
    return colors[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const InfoSection: React.FC<{
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
  }> = ({ title, icon, children }) => (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
        <div className="p-1.5 bg-gradient-to-r from-teal-100 to-teal-200 rounded-lg">
          {icon}
        </div>
        <h3 className="text-md font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );

  const InfoRow: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string | number | React.ReactNode;
    colSpan?: boolean;
  }> = ({ icon, label, value, colSpan = false }) => (
    <div
      className={`flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors ${colSpan ? "col-span-2" : ""}`}
    >
      <div className="text-gray-400 mt-0.5">{icon}</div>
      <div className="flex-1">
        <span className="text-xs text-gray-500 uppercase tracking-wide">
          {label}
        </span>
        <p className="text-gray-900 font-medium mt-0.5">{value || "N/A"}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading theater details...</p>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-5 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Theater Details
                </h2>
                <p className="text-white/80 text-sm mt-0.5">
                  Complete theater information
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {/* Theater Header */}
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg">
                <Building className="h-10 w-10 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900">
                  {theater.legal_business_name}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  ID: {theater.id.slice(0, 8)}...
                </p>
                <p className="text-gray-500 text-xs">{theater.business_type}</p>
              </div>
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(theater.status)}`}
              >
                {getStatusIcon(theater.status)}
                {theater.status?.toUpperCase()}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Business Information */}
                <InfoSection
                  title="Business Information"
                  icon={<Briefcase className="h-4 w-4 text-teal-600" />}
                >
                  <div className="grid grid-cols-1 gap-3">
                    <InfoRow
                      icon={<Building className="h-4 w-4" />}
                      label="Legal Business Name"
                      value={theater.legal_business_name}
                    />
                    <InfoRow
                      icon={<Briefcase className="h-4 w-4" />}
                      label="Business Type"
                      value={theater.business_type}
                    />
                    <InfoRow
                      icon={<FileText className="h-4 w-4" />}
                      label="Business License Number"
                      value={theater.business_license_number || "N/A"}
                    />
                    <InfoRow
                      icon={<Hash className="h-4 w-4" />}
                      label="Tax ID / TIN"
                      value={theater.tax_id || "N/A"}
                    />
                    {ownerData?.years_of_experience && (
                      <InfoRow
                        icon={<TrendingUp className="h-4 w-4" />}
                        label="Years of Experience"
                        value={`${ownerData.years_of_experience} years`}
                      />
                    )}
                    {theater.description && (
                      <InfoRow
                        icon={<Info className="h-4 w-4" />}
                        label="Business Description"
                        value={theater.description}
                        colSpan
                      />
                    )}
                  </div>
                </InfoSection>

                {/* License Information */}
                <InfoSection
                  title="License Information"
                  icon={<FileCheck className="h-4 w-4 text-teal-600" />}
                >
                  <div className="grid grid-cols-1 gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <InfoRow
                        icon={<Award className="h-4 w-4" />}
                        label="License Status"
                        value={
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs ${getLicenseStatusBadge(theater.license_status)}`}
                          >
                            {theater.license_status?.toUpperCase()}
                          </span>
                        }
                      />
                      <InfoRow
                        icon={<Calendar className="h-4 w-4" />}
                        label="Expiry Date"
                        value={formatDate(theater.license_expiry_date)}
                      />
                    </div>
                    {theater.license_document_url && (
                      <InfoRow
                        icon={<FileText className="h-4 w-4" />}
                        label="License Document"
                        value={
                          <a
                            href={theater.license_document_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-600 hover:underline text-sm"
                          >
                            View Document
                          </a>
                        }
                        colSpan
                      />
                    )}
                    {theater.tax_registration_certificate_path && (
                      <InfoRow
                        icon={<Receipt className="h-4 w-4" />}
                        label="Tax Certificate"
                        value={
                          <a
                            href={theater.tax_registration_certificate_path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-600 hover:underline text-sm"
                          >
                            View Certificate
                          </a>
                        }
                        colSpan
                      />
                    )}
                  </div>
                </InfoSection>

                {/* Subscription Information */}
                <InfoSection
                  title="Subscription Information"
                  icon={<CreditCard className="h-4 w-4 text-teal-600" />}
                >
                  <div className="grid grid-cols-1 gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <InfoRow
                        icon={<Award className="h-4 w-4" />}
                        label="Subscription Status"
                        value={
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs ${
                              theater.subscription_status === "active"
                                ? "bg-green-100 text-green-800"
                                : theater.subscription_status === "trial"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {theater.subscription_status?.toUpperCase()}
                          </span>
                        }
                      />
                      <InfoRow
                        icon={<Shield className="h-4 w-4" />}
                        label="Approved Status"
                        value={theater.is_approved ? "Yes" : "No"}
                      />
                    </div>
                    {theater.approved_by && (
                      <InfoRow
                        icon={<User className="h-4 w-4" />}
                        label="Approved By"
                        value={theater.approved_by}
                      />
                    )}
                  </div>
                </InfoSection>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Location Information */}
                <InfoSection
                  title="Location"
                  icon={<MapPin className="h-4 w-4 text-teal-600" />}
                >
                  <div className="grid grid-cols-1 gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <InfoRow
                        icon={<Globe className="h-4 w-4" />}
                        label="Country"
                        value={theater.country}
                      />
                      <InfoRow
                        icon={<Home className="h-4 w-4" />}
                        label="City"
                        value={theater.city}
                      />
                    </div>
                    <InfoRow
                      icon={<MapPin className="h-4 w-4" />}
                      label="Address"
                      value={theater.address}
                      colSpan
                    />
                  </div>
                </InfoSection>

                {/* Contact Information */}
                <InfoSection
                  title="Contact Information"
                  icon={<User className="h-4 w-4 text-teal-600" />}
                >
                  <div className="grid grid-cols-1 gap-3">
                    <InfoRow
                      icon={<Mail className="h-4 w-4" />}
                      label="Email"
                      value={theater.email}
                    />
                    <InfoRow
                      icon={<Phone className="h-4 w-4" />}
                      label="Phone"
                      value={theater.phone}
                    />
                  </div>
                </InfoSection>

                {/* Owner Information */}
                {userData && (
                  <InfoSection
                    title="Owner Information"
                    icon={<Users className="h-4 w-4 text-teal-600" />}
                  >
                    <div className="grid grid-cols-1 gap-3">
                      <InfoRow
                        icon={<User className="h-4 w-4" />}
                        label="Full Name"
                        value={userData.full_name}
                      />
                      <InfoRow
                        icon={<Mail className="h-4 w-4" />}
                        label="Email"
                        value={userData.email}
                      />
                      {userData.phone && (
                        <InfoRow
                          icon={<Phone className="h-4 w-4" />}
                          label="Phone"
                          value={userData.phone}
                        />
                      )}
                      <InfoRow
                        icon={<Shield className="h-4 w-4" />}
                        label="Role"
                        value={userData.role?.replace("_", " ").toUpperCase()}
                      />
                      {ownerData?.national_id && (
                        <InfoRow
                          icon={<FileText className="h-4 w-4" />}
                          label="National ID"
                          value={ownerData.national_id}
                        />
                      )}
                      {ownerData?.tin_number && (
                        <InfoRow
                          icon={<Hash className="h-4 w-4" />}
                          label="TIN Number"
                          value={ownerData.tin_number}
                        />
                      )}
                      {ownerData?.business_name && (
                        <InfoRow
                          icon={<Building className="h-4 w-4" />}
                          label="Owner Business Name"
                          value={ownerData.business_name}
                        />
                      )}
                      {ownerData?.verification_status && (
                        <InfoRow
                          icon={<CheckCircle className="h-4 w-4" />}
                          label="Verification Status"
                          value={
                            <span
                              className={`inline-flex px-2 py-1 rounded-full text-xs ${
                                ownerData.verification_status === "verified"
                                  ? "bg-green-100 text-green-800"
                                  : ownerData.verification_status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {ownerData.verification_status?.toUpperCase()}
                            </span>
                          }
                        />
                      )}
                    </div>
                  </InfoSection>
                )}

                {/* Contract Information */}
                {!contractLoading && contractData && (
                  <InfoSection
                    title="Contract Information"
                    icon={<FileText className="h-4 w-4 text-teal-600" />}
                  >
                    <div className="grid grid-cols-1 gap-3">
                      <InfoRow
                        icon={<Hash className="h-4 w-4" />}
                        label="Contract Number"
                        value={contractData.contract_number}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <InfoRow
                          icon={<FileText className="h-4 w-4" />}
                          label="Contract Type"
                          value={
                            contractData.contract_type === "per_ticket"
                              ? "Per Ticket"
                              : "Subscription"
                          }
                        />
                        <InfoRow
                          icon={<Percent className="h-4 w-4" />}
                          label="Commission Rate"
                          value={
                            contractData.commission_rate
                              ? `${contractData.commission_rate}%`
                              : "N/A"
                          }
                        />
                      </div>
                      {contractData.contract_type === "subscription" &&
                        contractData.base_price > 0 && (
                          <InfoRow
                            icon={<CreditCard className="h-4 w-4" />}
                            label="Base Price"
                            value={`ETB ${contractData.base_price.toLocaleString()}`}
                          />
                        )}
                      <div className="grid grid-cols-2 gap-3">
                        <InfoRow
                          icon={<Calendar className="h-4 w-4" />}
                          label="Start Date"
                          value={formatDate(contractData.contract_start_date)}
                        />
                        {contractData.contract_end_date && (
                          <InfoRow
                            icon={<Calendar className="h-4 w-4" />}
                            label="End Date"
                            value={formatDate(contractData.contract_end_date)}
                          />
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <InfoRow
                          icon={<Shield className="h-4 w-4" />}
                          label="Contract Status"
                          value={
                            <span
                              className={`inline-flex px-2 py-1 rounded-full text-xs ${
                                contractData.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : contractData.status === "expired"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {contractData.status?.toUpperCase()}
                            </span>
                          }
                        />
                        <InfoRow
                          icon={<CreditCard className="h-4 w-4" />}
                          label="Payment Status"
                          value={
                            <span
                              className={`inline-flex px-2 py-1 rounded-full text-xs ${
                                contractData.payment_status === "paid"
                                  ? "bg-green-100 text-green-800"
                                  : contractData.payment_status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {contractData.payment_status?.toUpperCase()}
                            </span>
                          }
                        />
                      </div>
                      {contractData.payment_frequency && (
                        <InfoRow
                          icon={<Clock className="h-4 w-4" />}
                          label="Payment Frequency"
                          value={contractData.payment_frequency?.toUpperCase()}
                        />
                      )}
                    </div>
                  </InfoSection>
                )}

                {/* Dates */}
                <InfoSection
                  title="Important Dates"
                  icon={<Calendar className="h-4 w-4 text-teal-600" />}
                >
                  <div className="grid grid-cols-1 gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <InfoRow
                        icon={<Calendar className="h-4 w-4" />}
                        label="Created Date"
                        value={formatDateTime(theater.created_at)}
                      />
                      <InfoRow
                        icon={<Calendar className="h-4 w-4" />}
                        label="Last Updated"
                        value={formatDateTime(theater.updated_at)}
                      />
                    </div>
                  </div>
                </InfoSection>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-4 border-t border-gray-200 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Close
              </button>
              {onEdit && (
                <button
                  onClick={() => onEdit(theater)}
                  className="flex-1 px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <Edit className="h-4 w-4" />
                  {/* Cannot find name 'Edit'. */}
                  Edit Theater
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ViewTheater;