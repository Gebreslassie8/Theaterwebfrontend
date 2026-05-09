// src/pages/Owner/events/UpdateEventForm.tsx
import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Layers,
  AlertCircle,
  Calendar,
  Clock,
  FileText,
  Copy,
  File,
  User,
  Mail,
  Phone,
  Tag,
} from "lucide-react";
import { EventData, FormData, halls, categories } from "./types";

interface UpdateEventFormProps {
  event: EventData;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

const UpdateEventForm: React.FC<UpdateEventFormProps> = ({
  event,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    genre: "",
    category: "",
    duration_minutes: 0,
    director: "",
    cast: [],
    poster_url: "",
    price_min: 0,
    price_max: 0,
    status: "coming-soon",
    is_featured: false,
    timeSlots: [],
    hall: "",
    seatCategories: [],
    ageRestriction: "",
    contactEmail: "",
    contactPhone: "",
    website: "",
    organizer: "",
    contractDate: "",
    contractReference: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const hallObj = halls.find((h) => h.name === event.hall);
    setFormData({
      title: event.title,
      description: event.description || "",
      genre: event.genre || "",
      category: event.category || "",
      duration_minutes: event.duration_minutes || 0,
      director: event.director || "",
      cast: event.cast || [],
      poster_url: event.poster_url || "",
      price_min: event.price_min || 0,
      price_max: event.price_max || 0,
      status: event.status || "coming-soon",
      /**Type '"coming-soon" | "now-showing" | "ended" | "cancelled"' is not assignable to type '"coming-soon" | "now-showing" | "ended"'.
  Type '"cancelled"' is not assignable to type '"coming-soon" | "now-showing" | "ended"'.*/
      is_featured: event.is_featured || false,
      timeSlots:
        event.timeSlots?.map((slot) => ({
          ...slot,
          id: slot.id || `slot-${Date.now()}-${Math.random()}`,
        })) || [],
      hall: hallObj?.id || "",
      seatCategories: event.seatCategories?.map((cat) => ({ ...cat })) || [],
      ageRestriction: event.ageRestriction || "",
      contactEmail: event.contactEmail || "",
      contactPhone: event.contactPhone || "",
      website: event.website || "",
      organizer: event.organizer || "",
      contractDate: event.contractDate || "",
      contractReference: event.contractReference || "",
    });
  }, [event]);

  const updateSeatField = (
    id: string,
    field: "price" | "commissionPercent",
    value: number,
  ) => {
    if (isNaN(value)) value = 0;
    if (value < 0) value = 0;
    if (field === "commissionPercent" && value > 100) value = 100;
    setFormData((prev) => ({
      ...prev,
      seatCategories:
        prev.seatCategories?.map((cat) =>
          cat.id === id ? { ...cat, [field]: value } : cat,
        ) || [],
    }));
    if (field === "price" && value > 0) {
      setErrors((prev) => ({ ...prev, [`seat_${id}_price`]: "" }));
    }
  };

  const updateTimeSlot = (id: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      timeSlots:
        prev.timeSlots?.map((slot) =>
          slot.id === id ? { ...slot, [field]: value } : slot,
        ) || [],
    }));
    if (value && errors[`slot_${id}_${field}`]) {
      setErrors((prev) => ({ ...prev, [`slot_${id}_${field}`]: "" }));
    }
  };

  const handleBlur = (field: string, slotId?: string, subField?: string) => {
    if (slotId && subField) {
      setTouched((prev) => ({ ...prev, [`slot_${slotId}_${subField}`]: true }));
      if (
        subField === "date" &&
        !formData.timeSlots?.find((s) => s.id === slotId)?.date
      ) {
        setErrors((prev) => ({
          ...prev,
          [`slot_${slotId}_date`]: "Date is required",
        }));
      }
      if (
        subField === "startTime" &&
        !formData.timeSlots?.find((s) => s.id === slotId)?.startTime
      ) {
        setErrors((prev) => ({
          ...prev,
          [`slot_${slotId}_startTime`]: "Start time is required",
        }));
      }
      if (
        subField === "endTime" &&
        !formData.timeSlots?.find((s) => s.id === slotId)?.endTime
      ) {
        setErrors((prev) => ({
          ...prev,
          [`slot_${slotId}_endTime`]: "End time is required",
        }));
      }
    } else {
      setTouched((prev) => ({ ...prev, [field]: true }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) newErrors.title = "Event title is required";
    if (!formData.organizer?.trim())
      newErrors.organizer = "Organizer is required";
    if (!formData.hall) newErrors.hall = "Venue is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.contactEmail) {
      newErrors.contactEmail = "Contact email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Invalid email format";
    }
    if (!formData.contactPhone?.trim())
      newErrors.contactPhone = "Contact phone is required";
    if (!formData.description?.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }

    formData.seatCategories?.forEach((cat) => {
      if (cat.price <= 0)
        newErrors[`seat_${cat.id}_price`] = "Price must be greater than 0";
    });

    formData.timeSlots?.forEach((slot) => {
      if (!slot.date) newErrors[`slot_${slot.id}_date`] = "Date is required";
      if (!slot.startTime)
        newErrors[`slot_${slot.id}_startTime`] = "Start time is required";
      if (!slot.endTime)
        newErrors[`slot_${slot.id}_endTime`] = "End time is required";
    });

    setErrors(newErrors);

    // Mark all fields as touched to show errors
    setTouched((prev) => ({
      ...prev,
      title: true,
      organizer: true,
      hall: true,
      category: true,
      contactEmail: true,
      contactPhone: true,
      description: true,
    }));
    formData.timeSlots?.forEach((slot) => {
      setTouched((prev) => ({
        ...prev,
        [`slot_${slot.id}_date`]: true,
        [`slot_${slot.id}_startTime`]: true,
        [`slot_${slot.id}_endTime`]: true,
      }));
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-5 shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Update Event</h2>
                <p className="text-white/80 text-sm">Edit event information</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Title *
              </label>
              <input
                type="text"
                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition ${
                  errors.title && touched.title
                    ? "border-red-500"
                    : "border-gray-200"
                }`}
                value={formData.title}
                onBlur={() => handleBlur("title")}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (errors.title)
                    setErrors((prev) => ({ ...prev, title: "" }));
                }}
                placeholder="Enter event title"
              />
              {errors.title && touched.title && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.title}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organizer *
              </label>
              <input
                type="text"
                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition ${
                  errors.organizer && touched.organizer
                    ? "border-red-500"
                    : "border-gray-200"
                }`}
                value={formData.organizer}
                onBlur={() => handleBlur("organizer")}
                onChange={(e) => {
                  setFormData({ ...formData, organizer: e.target.value });
                  if (errors.organizer)
                    setErrors((prev) => ({ ...prev, organizer: "" }));
                }}
                placeholder="Enter organizer name"
              />
              {errors.organizer && touched.organizer && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.organizer}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Genre *
              </label>
              <input
                type="text"
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                value={formData.genre}
                onChange={(e) =>
                  setFormData({ ...formData, genre: e.target.value })
                }
                placeholder="e.g., Drama, Comedy, Musical"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition ${
                  errors.category && touched.category
                    ? "border-red-500"
                    : "border-gray-200"
                }`}
                value={formData.category}
                onBlur={() => handleBlur("category")}
                onChange={(e) => {
                  setFormData({ ...formData, category: e.target.value });
                  if (errors.category)
                    setErrors((prev) => ({ ...prev, category: "" }));
                }}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              {errors.category && touched.category && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.category}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Director
              </label>
              <input
                type="text"
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                value={formData.director}
                onChange={(e) =>
                  setFormData({ ...formData, director: e.target.value })
                }
                placeholder="Director name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                min="0"
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                value={formData.duration_minutes || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration_minutes: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="e.g., 120"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cast (comma-separated)
            </label>
            <input
              type="text"
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              value={formData.cast?.join(", ") || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  cast: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter((s) => s),
                })
              }
              placeholder="e.g., John Doe, Jane Smith, Michael Brown"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Range (ETB)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                min="0"
                placeholder="Min Price"
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                value={formData.price_min || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price_min: parseInt(e.target.value) || 0,
                  })
                }
              />
              <input
                type="number"
                min="0"
                placeholder="Max Price"
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                value={formData.price_max || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price_max: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Venue *
            </label>
            <select
              className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition ${
                errors.hall && touched.hall
                  ? "border-red-500"
                  : "border-gray-200"
              }`}
              value={formData.hall}
              onBlur={() => handleBlur("hall")}
              onChange={(e) => {
                setFormData({ ...formData, hall: e.target.value });
                if (errors.hall) setErrors((prev) => ({ ...prev, hall: "" }));
              }}
            >
              <option value="">Select Hall</option>
              {halls.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} (Capacity: {h.capacity.toLocaleString()})
                </option>
              ))}
            </select>
            {errors.hall && touched.hall && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.hall}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age Restriction
            </label>
            <select
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              value={formData.ageRestriction}
              onChange={(e) =>
                setFormData({ ...formData, ageRestriction: e.target.value })
              }
            >
              <option value="">All Ages</option>
              <option value="12+">12+</option>
              <option value="16+">16+</option>
              <option value="18+">18+</option>
            </select>
          </div>

          {/* Seat Types & Pricing */}
          {formData.seatCategories && formData.seatCategories.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-800">
                <Layers className="h-4 w-4 text-teal-600" /> Seat Types &
                Pricing
              </h3>
              {formData.seatCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-3 bg-gray-50 rounded-lg mb-3"
                >
                  <div>
                    <label className="text-xs text-gray-500">Seat Type</label>
                    <div className="p-2 bg-gray-200 rounded font-medium text-sm">
                      {cat.name}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Capacity</label>
                    <div className="p-2 bg-gray-200 rounded text-sm">
                      {cat.capacity.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">
                      Price (ETB) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="w-full p-2 border rounded"
                      value={cat.price || ""}
                      onChange={(e) =>
                        updateSeatField(
                          cat.id,
                          "price",
                          parseInt(e.target.value) || 0,
                        )
                      }
                    />
                    {errors[`seat_${cat.id}_price`] && (
                      <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />{" "}
                        {errors[`seat_${cat.id}_price`]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">
                      Commission (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="w-full p-2 border rounded"
                      value={cat.commissionPercent}
                      onChange={(e) =>
                        updateSeatField(
                          cat.id,
                          "commissionPercent",
                          parseInt(e.target.value) || 0,
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email *
              </label>
              <input
                type="email"
                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition ${
                  errors.contactEmail && touched.contactEmail
                    ? "border-red-500"
                    : "border-gray-200"
                }`}
                value={formData.contactEmail}
                onBlur={() => handleBlur("contactEmail")}
                onChange={(e) => {
                  setFormData({ ...formData, contactEmail: e.target.value });
                  if (errors.contactEmail)
                    setErrors((prev) => ({ ...prev, contactEmail: "" }));
                }}
                placeholder="contact@example.com"
              />
              {errors.contactEmail && touched.contactEmail && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.contactEmail}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Phone *
              </label>
              <input
                type="tel"
                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition ${
                  errors.contactPhone && touched.contactPhone
                    ? "border-red-500"
                    : "border-gray-200"
                }`}
                value={formData.contactPhone}
                onBlur={() => handleBlur("contactPhone")}
                onChange={(e) => {
                  setFormData({ ...formData, contactPhone: e.target.value });
                  if (errors.contactPhone)
                    setErrors((prev) => ({ ...prev, contactPhone: "" }));
                }}
                placeholder="+251-XX-XXX-XXXX"
              />
              {errors.contactPhone && touched.contactPhone && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.contactPhone}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              type="url"
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              placeholder="https://example.com"
            />
          </div>

          {/* Contract Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <File className="h-4 w-4 text-teal-600" /> Contract Date
              </label>
              <input
                type="date"
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                value={formData.contractDate}
                onChange={(e) =>
                  setFormData({ ...formData, contractDate: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Copy className="h-4 w-4 text-teal-600" /> Contract Reference
              </label>
              <input
                type="text"
                placeholder="e.g., CTR-2025-001"
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                value={formData.contractReference}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contractReference: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* Time Slots */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-800">
              <Clock className="h-4 w-4 text-teal-600" /> Time Slots
            </h3>
            {formData.timeSlots && formData.timeSlots.length > 0 ? (
              formData.timeSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg mb-3"
                >
                  <div>
                    <label className="text-sm text-gray-600">Date *</label>
                    <input
                      type="date"
                      className={`w-full p-2 border rounded focus:ring-2 focus:ring-teal-500 outline-none transition ${
                        errors[`slot_${slot.id}_date`] &&
                        touched[`slot_${slot.id}_date`]
                          ? "border-red-500"
                          : "border-gray-200"
                      }`}
                      value={slot.date}
                      onBlur={() => handleBlur("", slot.id, "date")}
                      onChange={(e) =>
                        updateTimeSlot(slot.id, "date", e.target.value)
                      }
                    />
                    {errors[`slot_${slot.id}_date`] &&
                      touched[`slot_${slot.id}_date`] && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />{" "}
                          {errors[`slot_${slot.id}_date`]}
                        </p>
                      )}
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">
                      Start Time *
                    </label>
                    <input
                      type="time"
                      className={`w-full p-2 border rounded focus:ring-2 focus:ring-teal-500 outline-none transition ${
                        errors[`slot_${slot.id}_startTime`] &&
                        touched[`slot_${slot.id}_startTime`]
                          ? "border-red-500"
                          : "border-gray-200"
                      }`}
                      value={slot.startTime}
                      onBlur={() => handleBlur("", slot.id, "startTime")}
                      onChange={(e) =>
                        updateTimeSlot(slot.id, "startTime", e.target.value)
                      }
                    />
                    {errors[`slot_${slot.id}_startTime`] &&
                      touched[`slot_${slot.id}_startTime`] && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />{" "}
                          {errors[`slot_${slot.id}_startTime`]}
                        </p>
                      )}
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">End Time *</label>
                    <input
                      type="time"
                      className={`w-full p-2 border rounded focus:ring-2 focus:ring-teal-500 outline-none transition ${
                        errors[`slot_${slot.id}_endTime`] &&
                        touched[`slot_${slot.id}_endTime`]
                          ? "border-red-500"
                          : "border-gray-200"
                      }`}
                      value={slot.endTime}
                      onBlur={() => handleBlur("", slot.id, "endTime")}
                      onChange={(e) =>
                        updateTimeSlot(slot.id, "endTime", e.target.value)
                      }
                    />
                    {errors[`slot_${slot.id}_endTime`] &&
                      touched[`slot_${slot.id}_endTime`] && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />{" "}
                          {errors[`slot_${slot.id}_endTime`]}
                        </p>
                      )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No time slots available</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Status
            </label>
            <select
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as
                    | "coming-soon"
                    | "now-showing"
                    | "ended",
                })
              }
            >
              <option value="coming-soon">Coming Soon</option>
              <option value="now-showing">Now Showing</option>
              <option value="ended">Ended</option>
            </select>
          </div>

          {/* Featured */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_featured"
              checked={formData.is_featured}
              onChange={(e) =>
                setFormData({ ...formData, is_featured: e.target.checked })
              }
              className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
            />
            <label
              htmlFor="is_featured"
              className="text-sm font-medium text-gray-700"
            >
              Feature this event (highlight on homepage)
            </label>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Description *
            </label>
            <textarea
              rows={5}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition ${
                errors.description && touched.description
                  ? "border-red-500"
                  : "border-gray-200"
              }`}
              value={formData.description}
              onBlur={() => handleBlur("description")}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description)
                  setErrors((prev) => ({ ...prev, description: "" }));
              }}
              placeholder="Provide a detailed description of the event..."
            />
            {errors.description && touched.description && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.description}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              Minimum 20 characters. Current: {formData.description.length}
            </p>
          </div>

          {/* Info Alert */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <AlertCircle className="inline mr-2 h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              Please verify all information before updating.
            </span>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="border-t p-5 bg-gray-50 flex justify-end gap-3 shrink-0">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg hover:from-teal-600 hover:to-emerald-700 transition-all flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Update Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateEventForm;