// src/components/ManageHallForm/UpdateHallModal.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  Save,
  AlertCircle,
  Building,
  Layout,
  Tag,
  Info,
  Users,
  Grid,
} from "lucide-react";
import { Hall } from "./types";

interface UpdateHallModalProps {
  hall: Hall;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const UpdateHallModal: React.FC<UpdateHallModalProps> = ({
  hall,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    capacity: 0,
    num_of_rows: 0,
    num_of_cols: 0,
    description: "",
    is_active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Initialize form with hall data
  useEffect(() => {
    if (hall) {
      setFormData({
        name: hall.name || "",
        capacity: hall.capacity || 0,
        num_of_rows: hall.num_of_row || 0,
        num_of_cols: hall.num_of_col || 0,
        description: hall.description || "",
        is_active: hall.is_active ?? true,
      });
    }
  }, [hall]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Hall name is required";
    }
    if (formData.num_of_rows < 1) {
      newErrors.num_of_rows = "Number of rows must be at least 1";
    }
    if (formData.num_of_cols < 1) {
      newErrors.num_of_cols = "Number of columns must be at least 1";
    }
    if (formData.capacity < 1) {
      newErrors.capacity = "Capacity must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateForm();
  };

  const handleSubmit = async () => {
    const isValid = validateForm();
    if (isValid) {
      onSubmit({
        id: hall.id,
        name: formData.name,
        capacity: formData.capacity,
        num_of_rows: formData.num_of_rows,
        num_of_cols: formData.num_of_cols,
        description: formData.description,
        is_active: formData.is_active,
      });
    }
  };

  const totalCapacity = formData.num_of_rows * formData.num_of_cols;

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
              <h2 className="text-xl font-bold">Update Hall</h2>
              <p className="text-white/80 text-sm">
                Edit hall information below
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
          {/* Basic Information */}
          <div className="border-b pb-3">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Building className="h-5 w-5 text-teal-600" />
              Basic Information
            </h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hall Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                onBlur={() => handleBlur("name")}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition ${
                  errors.name && touched.name
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-teal-300"
                }`}
                placeholder="e.g., Grand Hall"
              />
            </div>
            {errors.name && touched.name && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Rows <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Grid className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  value={formData.num_of_rows}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      num_of_rows: Math.max(1, parseInt(e.target.value) || 0),
                    })
                  }
                  onBlur={() => handleBlur("num_of_rows")}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition ${
                    errors.num_of_rows && touched.num_of_rows
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-teal-300"
                  }`}
                  placeholder="e.g., 10"
                  min="1"
                  step="1"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Rows will be labeled A, B, C, ... (unlimited)
              </p>
              {errors.num_of_rows && touched.num_of_rows && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.num_of_rows}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Columns <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Grid className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  value={formData.num_of_cols}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      num_of_cols: Math.max(1, parseInt(e.target.value) || 0),
                    })
                  }
                  onBlur={() => handleBlur("num_of_cols")}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition ${
                    errors.num_of_cols && touched.num_of_cols
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-teal-300"
                  }`}
                  placeholder="e.g., 15"
                  min="1"
                  step="1"
                />
              </div>
              {errors.num_of_cols && touched.num_of_cols && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.num_of_cols}
                </p>
              )}
            </div>
          </div>

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
                onBlur={() => handleBlur("capacity")}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition ${
                  errors.capacity && touched.capacity
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-teal-300"
                }`}
                placeholder="Total number of seats"
                min="1"
                step="1"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {formData.num_of_rows > 0 && formData.num_of_cols > 0
                ? `Calculated: ${formData.num_of_rows} rows × ${formData.num_of_cols} columns = ${totalCapacity.toLocaleString()} seats`
                : "Enter rows and columns to calculate capacity"}
            </p>
            {errors.capacity && touched.capacity && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.capacity}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              onBlur={() => handleBlur("description")}
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

          {/* Status */}
          <div className="border-b pb-3">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Layout className="h-5 w-5 text-teal-600" />
              Status
            </h3>
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    is_active: e.target.checked,
                  })
                }
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700">Active Hall</span>
            </label>
            <p className="text-xs text-gray-400 mt-1 ml-7">
              Inactive halls won't be available for scheduling events
            </p>
          </div>

          {/* Preview Section */}
          {(formData.capacity > 0 || formData.name) && (
            <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
              <h4 className="text-sm font-semibold text-teal-800 mb-2">
                Hall Summary Preview
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Hall Name:</span>{" "}
                  <span className="font-medium">{formData.name || "—"}</span>
                </div>
                <div>
                  <span className="text-gray-600">Dimensions:</span>{" "}
                  <span className="font-medium">
                    {formData.num_of_rows} rows × {formData.num_of_cols} columns
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Capacity:</span>{" "}
                  <span className="font-medium">
                    {formData.capacity.toLocaleString()} seats
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>{" "}
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      formData.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {formData.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-700">
                <p className="font-medium mb-1">Note:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>
                    Rows are labeled A, B, C, ... (supports unlimited rows)
                  </li>
                  <li>
                    Changing dimensions won't affect existing seat reservations
                  </li>
                  <li>
                    Use the "Manage Seats" option to update individual seat
                    levels
                  </li>
                </ul>
              </div>
            </div>
          </div>

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
              Update Hall
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UpdateHallModal;
