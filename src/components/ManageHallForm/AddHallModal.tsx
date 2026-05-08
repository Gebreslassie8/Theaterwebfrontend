// src/components/ManageHallForm/AddHallModal.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  Save,
  AlertCircle,
  Building,
  Layout,
  Hash,
  Tag,
  DollarSign,
  Info,
  Users,
  Layers,
} from "lucide-react";
import * as Yup from "yup";

interface AddHallModalProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

// Yup Validation Schema based on database schema
const hallValidationSchema = Yup.object({
  hall_number: Yup.number()
    .required("Hall number is required")
    .min(1, "Hall number must be at least 1")
    .max(999, "Hall number cannot exceed 999"),
  name: Yup.string().max(100, "Hall name cannot exceed 100 characters"),
  capacity: Yup.number()
    .required("Capacity is required")
    .min(1, "Capacity must be at least 1")
    .max(5000, "Capacity cannot exceed 5000"),
  rows: Yup.string().max(50, "Rows description too long"),
  seating_layout: Yup.string()
    .required("Seating layout is required")
    .oneOf(
      ["Standard", "Compact", "Premium", "VIP", "Balcony"],
      "Invalid seating layout",
    ),
  price_multiplier: Yup.number()
    .required("Price multiplier is required")
    .min(0.5, "Price multiplier must be at least 0.5")
    .max(5, "Price multiplier cannot exceed 5"),
  has_dynamic_seating: Yup.boolean(),
  description: Yup.string().max(
    500,
    "Description cannot exceed 500 characters",
  ),
});

const AddHallModal: React.FC<AddHallModalProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    hall_number: 1,
    name: "",
    capacity: 0,
    rows: "",
    seating_layout: "Standard",
    price_multiplier: 1.0,
    has_dynamic_seating: true,
    description: "",
    seat_configuration: {
      levels: ["standard", "vip", "vvip"],
      default_pricing: {
        standard: 50,
        vip: 120,
        vvip: 250,
      },
    },
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Get current user from session (synchronous - no async needed)
  useEffect(() => {
    try {
      const userStr =
        localStorage.getItem("user") || sessionStorage.getItem("user");

      if (userStr) {
        const user = JSON.parse(userStr);
        console.log("User found:", user); // Debug log
        setCurrentUserId(user.id);
        setCurrentUserRole(user.role);

        // Verify user has permission (Manager or Owner)
        if (
          user.role !== "theater_manager" &&
          user.role !== "theater_owner" &&
          user.role !== "super_admin"
        ) {
          alert(
            "You don't have permission to create halls. Only Managers and Owners can create halls.",
          );
          onCancel();
        }
      } else {
        console.error("No user found in storage");
        alert("User not authenticated. Please log in again.");
        onCancel();
      }
    } catch (error) {
      console.error("Error getting user:", error);
      alert("Error loading user information. Please refresh the page.");
      onCancel();
    } finally {
      setLoading(false);
    }
  }, [onCancel]);

  const handleBlur = async (field: string, value: any) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    try {
      await hallValidationSchema.validateAt(field, { [field]: value });
      setErrors((prev) => ({ ...prev, [field]: "" }));
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, [field]: err.message }));
    }
  };

  const validateForm = async () => {
    try {
      await hallValidationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err: any) {
      const newErrors: Record<string, string> = {};
      err.inner.forEach((error: any) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async () => {
    const isValid = await validateForm();
    if (isValid && currentUserId) {
      onSubmit({
        ...formData,
        published_by: currentUserId,
      });
    }
  };

  const seatingLayoutOptions = [
    { value: "Standard", label: "Standard" },
    { value: "Compact", label: "Compact" },
    { value: "Premium", label: "Premium" },
    { value: "VIP", label: "VIP" },
    { value: "Balcony", label: "Balcony" },
  ];

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-5 flex justify-between items-center text-white rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Add New Hall</h2>
              <p className="text-white/80 text-sm">
                Fill in the hall details below
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Creator Info */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-blue-700">
                Creating as:{" "}
                <strong>
                  {currentUserRole?.replace("_", " ").toUpperCase() || "USER"}
                </strong>
              </p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="border-b pb-3">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Building className="h-5 w-5 text-teal-600" />
              Basic Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hall Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  value={formData.hall_number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hall_number: parseInt(e.target.value) || 0,
                    })
                  }
                  onBlur={() => handleBlur("hall_number", formData.hall_number)}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition ${
                    errors.hall_number && touched.hall_number
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-teal-300"
                  }`}
                  placeholder="e.g., 1, 2, 3"
                />
              </div>
              {errors.hall_number && touched.hall_number && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.hall_number}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hall Name
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  onBlur={() => handleBlur("name", formData.name)}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition ${
                    errors.name && touched.name
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-teal-300"
                  }`}
                  placeholder="e.g., Grand Hall, Premier Hall"
                />
              </div>
              {errors.name && touched.name && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.name}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Capacity <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      capacity: parseInt(e.target.value) || 0,
                    })
                  }
                  onBlur={() => handleBlur("capacity", formData.capacity)}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition ${
                    errors.capacity && touched.capacity
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-teal-300"
                  }`}
                  placeholder="Total number of seats"
                />
              </div>
              {errors.capacity && touched.capacity && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.capacity}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seating Layout <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Layout className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={formData.seating_layout}
                  onChange={(e) =>
                    setFormData({ ...formData, seating_layout: e.target.value })
                  }
                  onBlur={() =>
                    handleBlur("seating_layout", formData.seating_layout)
                  }
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition ${
                    errors.seating_layout && touched.seating_layout
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-teal-300"
                  }`}
                >
                  {seatingLayoutOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              {errors.seating_layout && touched.seating_layout && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.seating_layout}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Multiplier <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  step="0.1"
                  value={formData.price_multiplier}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price_multiplier: parseFloat(e.target.value),
                    })
                  }
                  onBlur={() =>
                    handleBlur("price_multiplier", formData.price_multiplier)
                  }
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition ${
                    errors.price_multiplier && touched.price_multiplier
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-teal-300"
                  }`}
                  placeholder="1.0"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Base price × multiplier = final ticket price
              </p>
              {errors.price_multiplier && touched.price_multiplier && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.price_multiplier}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rows Configuration
              </label>
              <div className="relative">
                <Info className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.rows}
                  onChange={(e) =>
                    setFormData({ ...formData, rows: e.target.value })
                  }
                  onBlur={() => handleBlur("rows", formData.rows)}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition ${
                    errors.rows && touched.rows
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-teal-300"
                  }`}
                  placeholder="e.g., A-Z (20 rows)"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Describe the row arrangement (e.g., A-Z for 26 rows)
              </p>
              {errors.rows && touched.rows && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.rows}
                </p>
              )}
            </div>
          </div>

          {/* Dynamic Seating */}
          <div className="border-b pb-3 mt-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Layers className="h-5 w-5 text-teal-600" />
              Seating Configuration
            </h3>
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.has_dynamic_seating}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    has_dynamic_seating: e.target.checked,
                  })
                }
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700">
                Enable Dynamic Seating
              </span>
            </label>
            <p className="text-xs text-gray-400 mt-1 ml-7">
              Dynamic pricing adjusts ticket prices based on demand
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              onBlur={() => handleBlur("description", formData.description)}
              rows={3}
              className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition ${
                errors.description && touched.description
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 hover:border-teal-300"
              }`}
              placeholder="Additional information about this hall (e.g., location, amenities, special features...)"
            />
            {errors.description && touched.description && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.description}
              </p>
            )}
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-700">
                <p className="font-medium mb-1">What is Price Multiplier?</p>
                <p>
                  The price multiplier affects ticket pricing for this hall. For
                  example:
                </p>
                <ul className="list-disc list-inside mt-1 space-y-0.5">
                  <li>Base price for standard seat: 50 ETB</li>
                  <li>With multiplier 1.5 → Price becomes 75 ETB</li>
                  <li>With multiplier 0.8 → Price becomes 40 ETB</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          {formData.capacity > 0 && (
            <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
              <h4 className="text-sm font-semibold text-teal-800 mb-2">
                Hall Summary Preview
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Hall:</span>{" "}
                  {formData.name || `Hall ${formData.hall_number}`}
                </div>
                <div>
                  <span className="text-gray-600">Layout:</span>{" "}
                  {formData.seating_layout}
                </div>
                <div>
                  <span className="text-gray-600">Capacity:</span>{" "}
                  {formData.capacity.toLocaleString()} seats
                </div>
                <div>
                  <span className="text-gray-600">Multiplier:</span>{" "}
                  {formData.price_multiplier}x
                </div>
                <div>
                  <span className="text-gray-600">Dynamic Seating:</span>{" "}
                  {formData.has_dynamic_seating ? "Enabled" : "Disabled"}
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600">Created by:</span>{" "}
                  <span className="font-medium">
                    {currentUserRole?.replace("_", " ").toUpperCase() || "USER"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t mt-4">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg hover:from-teal-600 hover:to-emerald-700 transition-all font-medium flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              Create Hall
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddHallModal;
