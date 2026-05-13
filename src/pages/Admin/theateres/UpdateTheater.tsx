// src/pages/Admin/theaters/UpdateTheater.tsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Building,
  Mail,
  User,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  FileCheck,
  Info,
  ChevronRight,
  ChevronLeft,
  Theater,
  UserCheck,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import SuccessPopup from "../../../components/Reusable/SuccessPopup";
import { adminService } from "./services/adminService";
import supabase from "@/config/supabaseClient";

interface UpdateTheaterProps {
  theater: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (values: any) => void;
}

interface FormData {
  id: string;
  // Business Information
  legal_business_name: string;
  business_type: string;
  business_license_number: string;
  tax_id: string;
  business_description: string;
  years_in_operation: string;

  // Contact Information
  email: string;
  phone: string;

  // Theater Information
  theater_name: string;
  theater_description: string;
  total_halls: string;
  total_seats: string;
  city: string;
  region: string;
  address: string;
  country: string;

  // Contract & Pricing
  pricing_model: string;
  contract_type: string;
  commission_rate: number;

  // Status
  status: string;
  subscription_status: string;
  is_approved: boolean;
  license_status: string;
  license_expiry_date: string;

  // Documents
  business_license_url: string;
  tax_registration_certificate_path: string;

  // Owner Info (read-only for update)
  owner_full_name: string;
  owner_email: string;
  owner_phone: string;
  owner_business_name: string;
}

interface Errors {
  [key: string]: string;
}

const UpdateTheater: React.FC<UpdateTheaterProps> = ({
  theater,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({
    title: "",
    message: "",
    type: "success" as "success" | "error" | "warning" | "info",
  });
  const [contractData, setContractData] = useState<any>(null);

  const [formData, setFormData] = useState<FormData>({
    id: "",
    legal_business_name: "",
    business_type: "",
    business_license_number: "",
    tax_id: "",
    business_description: "",
    years_in_operation: "",
    email: "",
    phone: "",
    theater_name: "",
    theater_description: "",
    total_halls: "",
    total_seats: "",
    city: "",
    region: "",
    address: "",
    country: "Ethiopia",
    pricing_model: "",
    contract_type: "",
    commission_rate: 0,
    status: "pending",
    subscription_status: "trial",
    is_approved: false,
    license_status: "pending",
    license_expiry_date: "",
    business_license_url: "",
    tax_registration_certificate_path: "",
    owner_full_name: "",
    owner_email: "",
    owner_phone: "",
    owner_business_name: "",
  });

  // Business types for dropdown
  const businessTypes = [
    "Sole Proprietorship",
    "Partnership",
    "LLC",
    "Corporation",
    "Non-Profit",
    "Government",
  ];

  const statusOptions = [
    { value: "pending", label: "Pending", color: "yellow" },
    { value: "approved", label: "Approved", color: "blue" },
    { value: "active", label: "Active", color: "green" },
    { value: "rejected", label: "Rejected", color: "red" },
    { value: "inactive", label: "Inactive", color: "gray" },
  ];

  const subscriptionOptions = [
    { value: "trial", label: "Trial" },
    { value: "active", label: "Active" },
    { value: "suspended", label: "Suspended" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const licenseStatusOptions = [
    { value: "pending", label: "Pending" },
    { value: "active", label: "Active" },
    { value: "expired", label: "Expired" },
    { value: "revoked", label: "Revoked" },
  ];

  const yearsOptions = [
    "Less than 1 year",
    "1-3 years",
    "3-5 years",
    "5-10 years",
    "10+ years",
  ];

  const cities = [
    "Addis Ababa",
    "Bahir Dar",
    "Dire Dawa",
    "Hawassa",
    "Mekelle",
    "Gondar",
    "Jimma",
    "Harar",
    "Adama",
    "Dessie",
    "Arba Minch",
    "Jijiga",
  ];

  const regions = [
    "Addis Ababa",
    "Oromia",
    "Amhara",
    "Tigray",
    "Southern Nations",
    "Somali",
    "Benishangul-Gumuz",
    "Afar",
    "Harari",
    "Gambela",
    "Sidama",
  ];

  // Fetch theater data with related information
  useEffect(() => {
    if (theater && isOpen) {
      fetchTheaterData();
    }
  }, [theater, isOpen]);

  const fetchTheaterData = async () => {
    setIsLoading(true);
    let userData: any = null;
    let owner: any = null;

    try {
      // Fetch theater details
      const theaterData = await adminService.getTheaterById(theater.id);

      if (theaterData) {
        // Fetch contract details
        const { data: contract } = await supabase
          .from("owners_contracts")
          .select("*")
          .eq("theater_id", theater.id)
          .maybeSingle();
        setContractData(contract);

        // Fetch owner details
        if (theaterData.owner_user_id) {
          const { data: userResult } = await supabase
            .from("users")
            .select("full_name, email, phone")
            .eq("id", theaterData.owner_user_id)
            .single();
          userData = userResult;

          const { data: ownerResult } = await supabase
            .from("owners")
            .select("business_name")
            .eq("user_id", theaterData.owner_user_id)
            .maybeSingle();
          owner = ownerResult;
        }

        // Calculate years in operation from created_at
        const createdDate = new Date(theaterData.created_at);
        const yearsDiff = new Date().getFullYear() - createdDate.getFullYear();
        let yearsInOp = "Less than 1 year";
        if (yearsDiff >= 10) yearsInOp = "10+ years";
        else if (yearsDiff >= 5) yearsInOp = "5-10 years";
        else if (yearsDiff >= 3) yearsInOp = "3-5 years";
        else if (yearsDiff >= 1) yearsInOp = "1-3 years";

        setFormData({
          id: theaterData.id,
          legal_business_name: theaterData.legal_business_name || "",
          business_type: theaterData.business_type || "",
          business_license_number: theaterData.business_license_number || "",
          tax_id: theaterData.tax_id || "",
          business_description: theaterData.description || "",
          years_in_operation: yearsInOp,
          email: theaterData.email || "",
          phone: theaterData.phone || "",
          theater_name: theaterData.legal_business_name || "",
          theater_description: theaterData.description || "",
          total_halls: "0",
          total_seats: "0",
          city: theaterData.city || "",
          region: "",
          address: theaterData.address || "",
          country: theaterData.country || "Ethiopia",
          pricing_model:
            contract?.contract_type === "per_ticket"
              ? "per_ticket"
              : contract?.contract_type === "subscription"
                ? "subscription"
                : "",
          contract_type: contract?.subscription_plan || "",
          commission_rate: contract?.commission_rate || 0,
          status: theaterData.status || "pending",
          subscription_status: theaterData.subscription_status || "trial",
          is_approved: theaterData.is_approved || false,
          license_status: theaterData.license_status || "pending",
          license_expiry_date:
            theaterData.license_expiry_date?.split("T")[0] || "",
          business_license_url: theaterData.license_document_url || "",
          tax_registration_certificate_path:
            theaterData.tax_registration_certificate_path || "",
          owner_full_name: userData?.full_name || "",
          owner_email: userData?.email || "",
          owner_phone: userData?.phone || "",
          owner_business_name: owner?.business_name || "",
        });
      }
    } catch (error) {
      console.error("Error fetching theater data:", error);
      setPopupMessage({
        title: "Error",
        message: "Failed to load theater data",
        type: "error",
      });
      setShowSuccessPopup(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const validateStep = (): boolean => {
    const newErrors: Errors = {};

    if (step === 1) {
      if (!formData.legal_business_name.trim())
        newErrors.legal_business_name = "Business name is required";
      if (!formData.business_type)
        newErrors.business_type = "Business type is required";
      if (!formData.business_license_number)
        newErrors.business_license_number =
          "Business license number is required";
      if (!formData.tax_id) newErrors.tax_id = "Tax ID is required";
      if (!formData.years_in_operation)
        newErrors.years_in_operation = "Years in operation is required";
    } else if (step === 2) {
      if (!formData.email) newErrors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email = "Valid email is required";
      if (!formData.phone) newErrors.phone = "Phone number is required";
      if (!formData.city) newErrors.city = "City is required";
      if (!formData.address) newErrors.address = "Address is required";
    } else if (step === 3) {
      if (!formData.theater_description)
        newErrors.theater_description = "Theater description is required";
    }

    setErrors(newErrors);

    const newTouched: Record<string, boolean> = {};
    Object.keys(newErrors).forEach((key) => {
      newTouched[key] = true;
    });
    setTouched((prev) => ({ ...prev, ...newTouched }));

    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);

    try {
      // Update theater information
      const updateData = {
        legal_business_name: formData.legal_business_name,
        business_type: formData.business_type,
        business_license_number: formData.business_license_number,
        tax_id: formData.tax_id,
        description: formData.theater_description,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        address: formData.address,
        country: formData.country,
        status: formData.status,
        subscription_status: formData.subscription_status,
        is_approved: formData.is_approved,
        license_status: formData.license_status,
        license_expiry_date: formData.license_expiry_date || null,
        updated_at: new Date().toISOString(),
      };

      await adminService.updateTheater(formData.id, updateData);

      // Update contract if needed
      if (contractData && formData.pricing_model) {
        const contractUpdateData: any = {
          contract_type: formData.pricing_model,
          updated_at: new Date().toISOString(),
        };

        if (
          formData.pricing_model === "subscription" &&
          formData.contract_type
        ) {
          contractUpdateData.subscription_plan = formData.contract_type;
        } else if (formData.pricing_model === "per_ticket") {
          contractUpdateData.commission_rate = formData.commission_rate || 10;
        }

        const { error: contractError } = await supabase
          .from("owners_contracts")
          .update(contractUpdateData)
          .eq("theater_id", formData.id);

        if (contractError) {
          console.error("Contract update error:", contractError);
        }
      }

      setPopupMessage({
        title: "Success!",
        message: `${formData.legal_business_name} has been updated successfully`,
        type: "success",
      });
      setShowSuccessPopup(true);

      onUpdate(updateData);

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error: any) {
      console.error("Update error:", error);
      setPopupMessage({
        title: "Error!",
        message: error.message || "Failed to update theater",
        type: "error",
      });
      setShowSuccessPopup(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      approved: "bg-blue-100 text-blue-800 border-blue-200",
      active: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
      inactive: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const steps = [
    { number: 1, title: "Business Info", description: "Company details" },
    { number: 2, title: "Contact Info", description: "Location & contact" },
    { number: 3, title: "Theater Details", description: "Venue information" },
  ];

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading theater data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-5 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Theater className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Update Theater
                    </h2>
                    <p className="text-white/80 text-sm">
                      Edit theater information
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
            </div>

            {/* Progress Steps */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                {steps.map((s, idx) => (
                  <div key={s.number} className="flex-1">
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all z-10 ${
                          step > s.number
                            ? "bg-teal-600 text-white border-teal-600"
                            : step === s.number
                              ? "bg-white text-teal-600 border-teal-600 shadow-md"
                              : "bg-gray-100 text-gray-400 border-gray-300"
                        }`}
                      >
                        {step > s.number ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          s.number
                        )}
                      </div>
                      {idx !== steps.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 mx-2 ${step > s.number ? "bg-teal-600" : "bg-gray-300"}`}
                        />
                      )}
                    </div>
                    <div className="mt-2">
                      <p
                        className={`text-xs font-medium ${step === s.number ? "text-teal-600" : "text-gray-500"}`}
                      >
                        {s.title}
                      </p>
                      <p className="text-xs text-gray-400 hidden sm:block">
                        {s.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Step 1: Business Information */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-5"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg">
                      <Building className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Business Information
                      </h3>
                      <p className="text-sm text-gray-500">
                        Edit your theater business information
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Legal Business Name{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="legal_business_name"
                        value={formData.legal_business_name}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                          errors.legal_business_name &&
                          touched.legal_business_name
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-teal-300"
                        }`}
                      />
                      {errors.legal_business_name &&
                        touched.legal_business_name && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.legal_business_name}
                          </p>
                        )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Business Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="business_type"
                        value={formData.business_type}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                          errors.business_type && touched.business_type
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-teal-300"
                        }`}
                      >
                        <option value="">Select business type</option>
                        {businessTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      {errors.business_type && touched.business_type && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.business_type}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Years in Operation{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="years_in_operation"
                        value={formData.years_in_operation}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                          errors.years_in_operation &&
                          touched.years_in_operation
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-teal-300"
                        }`}
                      >
                        <option value="">Select years</option>
                        {yearsOptions.map((years) => (
                          <option key={years} value={years}>
                            {years}
                          </option>
                        ))}
                      </select>
                      {errors.years_in_operation &&
                        touched.years_in_operation && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.years_in_operation}
                          </p>
                        )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Business License Number{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="business_license_number"
                        value={formData.business_license_number}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                          errors.business_license_number &&
                          touched.business_license_number
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-teal-300"
                        }`}
                      />
                      {errors.business_license_number &&
                        touched.business_license_number && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.business_license_number}
                          </p>
                        )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Tax ID / TIN <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="tax_id"
                        value={formData.tax_id}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                          errors.tax_id && touched.tax_id
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-teal-300"
                        }`}
                      />
                      {errors.tax_id && touched.tax_id && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.tax_id}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Contact & Location */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-5"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Contact & Location
                      </h3>
                      <p className="text-sm text-gray-500">
                        Edit contact information and location
                      </p>
                    </div>
                  </div>

                  {/* Owner Information (Read-only display) */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-teal-600" />
                      Owner Information (Read-only)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-500">
                          Owner Name
                        </label>
                        <p className="text-sm font-medium text-gray-900">
                          {formData.owner_full_name || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Email</label>
                        <p className="text-sm text-gray-600">
                          {formData.owner_email || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Phone</label>
                        <p className="text-sm text-gray-600">
                          {formData.owner_phone || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">
                          Business Name
                        </label>
                        <p className="text-sm text-gray-600">
                          {formData.owner_business_name || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Theater Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                            errors.email && touched.email
                              ? "border-red-500 bg-red-50"
                              : "border-gray-200 hover:border-teal-300"
                          }`}
                        />
                      </div>
                      {errors.email && touched.email && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Theater Phone <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                            errors.phone && touched.phone
                              ? "border-red-500 bg-red-50"
                              : "border-gray-200 hover:border-teal-300"
                          }`}
                        />
                      </div>
                      {errors.phone && touched.phone && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50"
                        disabled
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        City <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                          errors.city && touched.city
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-teal-300"
                        }`}
                      >
                        <option value="">Select city</option>
                        {cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                      {errors.city && touched.city && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Region
                      </label>
                      <select
                        name="region"
                        value={formData.region}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-teal-300"
                      >
                        <option value="">Select region</option>
                        {regions.map((region) => (
                          <option key={region} value={region}>
                            {region}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Full Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="address"
                        rows={2}
                        value={formData.address}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none ${
                          errors.address && touched.address
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-teal-300"
                        }`}
                        placeholder="Street, building, floor, etc."
                      />
                      {errors.address && touched.address && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.address}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Theater Details & Status */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-5"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg">
                      <Theater className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Theater Details & Status
                      </h3>
                      <p className="text-sm text-gray-500">
                        Edit theater information and status settings
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Theater Description{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="theater_description"
                      rows={4}
                      value={formData.theater_description}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none ${
                        errors.theater_description &&
                        touched.theater_description
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 hover:border-teal-300"
                      }`}
                      placeholder="Describe your theater, its history, unique features, and what makes it special..."
                    />
                    {errors.theater_description &&
                      touched.theater_description && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.theater_description}
                        </p>
                      )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent ${getStatusColor(formData.status)}`}
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Subscription Status
                      </label>
                      <select
                        name="subscription_status"
                        value={formData.subscription_status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      >
                        {subscriptionOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        License Status
                      </label>
                      <select
                        name="license_status"
                        value={formData.license_status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      >
                        {licenseStatusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        License Expiry Date
                      </label>
                      <input
                        type="date"
                        name="license_expiry_date"
                        value={formData.license_expiry_date}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg col-span-2">
                      <input
                        type="checkbox"
                        name="is_approved"
                        checked={formData.is_approved}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                      />
                      <div>
                        <span className="font-medium text-gray-800">
                          Approved Status
                        </span>
                        <p className="text-xs text-gray-500">
                          Mark as approved to allow the theater to go live
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">
                          Important Information
                        </p>
                        <p className="text-xs text-amber-700 mt-1">
                          Changes to theater information will be reviewed by an
                          admin. Some changes may require re-verification.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-2xl">
              <div className="flex justify-between">
                {step > 1 && (
                  <button
                    onClick={handleBack}
                    className="px-6 py-2.5 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2 font-medium"
                  >
                    <ChevronLeft className="h-4 w-4" /> Back
                  </button>
                )}
                {step < 3 ? (
                  <button
                    onClick={handleNext}
                    className={`px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-medium transition-all flex items-center gap-2 shadow-md ${step === 1 ? "ml-auto" : ""}`}
                  >
                    Continue <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="ml-auto px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-medium transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Updating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" /> Update Theater
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <SuccessPopup
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        type={popupMessage.type}
        title={popupMessage.title}
        message={popupMessage.message}
        duration={3000}
      />
    </>
  );
};

export default UpdateTheater;