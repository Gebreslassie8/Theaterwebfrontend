// src/components/EventForm/UpdateEventForm.tsx
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
  Users,
  Building,
  Info,
  Plus,
} from "lucide-react";
import { EventData, FormData, halls, categories } from "./types";
import supabase from "@/config/supabaseClient";

interface UpdateEventFormProps {
  event: EventData;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

interface Schedule {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  hallId: string;
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
    event_provider: "",
    event_provider_email: "",
    event_provider_phone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [availableHalls, setAvailableHalls] = useState<any[]>([]);
  const [loadingHalls, setLoadingHalls] = useState(false);

  // Load halls when component mounts
  useEffect(() => {
    if (event.theater_id) {
      loadHallsForTheater(event.theater_id);
    }
  }, [event.theater_id]);

  useEffect(() => {
    // Find hall object
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
      status:
        event.status === "cancelled" ? "ended" : event.status || "coming-soon",
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
      event_provider: (event as any).event_provider || "",
      event_provider_email: (event as any).event_provider_email || "",
      event_provider_phone: (event as any).event_provider_phone || "",
    });

    // Load schedules from event if available
    if ((event as any).schedules) {
      setSchedules((event as any).schedules);
    } else if (event.timeSlots) {
      setSchedules(
        event.timeSlots.map((slot) => ({
          id: slot.id,
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          hallId: hallObj?.id || "",
        })),
      );
    }
  }, [event]);

  const loadHallsForTheater = async (theaterId: string) => {
    setLoadingHalls(true);
    try {
      const { data, error } = await supabase
        .from("halls")
        .select("id, name, capacity, num_of_row, num_of_col")
        .eq("theater_id", theaterId)
        .eq("is_active", true);

      if (error) throw error;
      setAvailableHalls(data || []);
    } catch (error) {
      console.error("Error loading halls:", error);
    } finally {
      setLoadingHalls(false);
    }
  };

  const calculateEndTime = (
    startTime: string,
    durationMinutes: number,
  ): string => {
    if (!startTime || !durationMinutes) return "";
    const [hours, minutes] = startTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;
  };

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

  const updateSchedule = (id: string, field: string, value: string) => {
    setSchedules((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const updated = { ...s, [field]: value };
          if (field === "startTime" && formData.duration_minutes && value) {
            updated.endTime = calculateEndTime(
              value,
              formData.duration_minutes,
            );
          }
          return updated;
        }
        return s;
      }),
    );
  };

  const addSchedule = () => {
    setSchedules([
      ...schedules,
      {
        id: Date.now().toString(),
        date: "",
        startTime: "",
        endTime: "",
        hallId: "",
      },
    ]);
  };

  const removeSchedule = (id: string) => {
    if (schedules.length > 1) {
      setSchedules(schedules.filter((s) => s.id !== id));
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
    if (!formData.duration_minutes || formData.duration_minutes <= 0) {
      newErrors.duration_minutes = "Duration must be greater than 0";
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

    schedules.forEach((schedule, idx) => {
      if (!schedule.date)
        newErrors[`schedule_${idx}_date`] = "Date is required";
      if (!schedule.startTime)
        newErrors[`schedule_${idx}_start`] = "Start time is required";
      if (!schedule.hallId)
        newErrors[`schedule_${idx}_hall`] = "Hall is required";
    });

    setErrors(newErrors);

    setTouched((prev) => ({
      ...prev,
      title: true,
      organizer: true,
      hall: true,
      category: true,
      contactEmail: true,
      contactPhone: true,
      description: true,
      duration_minutes: true,
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
      const submitData = {
        ...formData,
        schedules: schedules,
      };
      onSubmit(submitData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
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
                Genre
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
                Duration (minutes) *
              </label>
              <input
                type="number"
                min="1"
                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition ${
                  errors.duration_minutes && touched.duration_minutes
                    ? "border-red-500"
                    : "border-gray-200"
                }`}
                value={formData.duration_minutes || ""}
                onBlur={() => handleBlur("duration_minutes")}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setFormData({ ...formData, duration_minutes: val });
                  if (errors.duration_minutes)
                    setErrors((prev) => ({ ...prev, duration_minutes: "" }));
                }}
                placeholder="e.g., 120"
              />
              {errors.duration_minutes && touched.duration_minutes && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.duration_minutes}
                </p>
              )}
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

          {/* Event Provider Information */}
          <div className="border-t pt-4 mt-2">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3">
              <Users className="h-5 w-5 text-teal-600" />
              Event Provider Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provider Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., ABC Productions"
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  value={formData.event_provider || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, event_provider: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provider Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="provider@example.com"
                    className="w-full pl-10 pr-4 p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    value={formData.event_provider_email || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        event_provider_email: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provider Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="+251-XXX-XXXXXX"
                    className="w-full pl-10 pr-4 p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    value={formData.event_provider_phone || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        event_provider_phone: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
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

          {/* Show Schedules Section */}
          <div className="border-t pt-4 mt-2">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Clock className="h-5 w-5 text-teal-600" />
                Show Schedules
              </h3>
              <button
                onClick={addSchedule}
                className="px-3 py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add Schedule
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-3">
              Manage show dates and times for this event
            </p>

            {schedules.map((schedule, idx) => (
              <div
                key={schedule.id}
                className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-gray-700">
                    Schedule #{idx + 1}
                  </h4>
                  {schedules.length > 1 && (
                    <button
                      onClick={() => removeSchedule(schedule.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={schedule.date}
                      onChange={(e) =>
                        updateSchedule(schedule.id, "date", e.target.value)
                      }
                      className="w-full p-2 border rounded-lg text-sm border-gray-200"
                    />
                    {errors[`schedule_${idx}_date`] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[`schedule_${idx}_date`]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Start Time *
                    </label>
                    <input
                      type="time"
                      value={schedule.startTime}
                      onChange={(e) =>
                        updateSchedule(schedule.id, "startTime", e.target.value)
                      }
                      className="w-full p-2 border rounded-lg text-sm border-gray-200"
                    />
                    {errors[`schedule_${idx}_start`] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[`schedule_${idx}_start`]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={schedule.endTime}
                      disabled
                      className="w-full p-2 border rounded-lg text-sm bg-gray-100 text-gray-500"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Hall *
                  </label>
                  <select
                    value={schedule.hallId}
                    onChange={(e) =>
                      updateSchedule(schedule.id, "hallId", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg text-sm border-gray-200"
                    disabled={loadingHalls}
                  >
                    <option value="">Select Hall</option>
                    {availableHalls.map((hall) => (
                      <option key={hall.id} value={hall.id}>
                        {hall.name} (Capacity: {hall.capacity})
                      </option>
                    ))}
                  </select>
                  {errors[`schedule_${idx}_hall`] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[`schedule_${idx}_hall`]}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {formData.duration_minutes > 0 && schedules.length > 0 && (
              <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                <Info className="h-4 w-4 inline mr-1" />
                End times are automatically calculated based on{" "}
                {formData.duration_minutes} minutes duration.
              </div>
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