// frontend/src/components/EventForm/CreateEventForm.tsx
import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Upload,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Clock,
  Image,
  User,
  Users,
  Film,
  FileText,
  Building,
  Theater,
  Mail,
  Phone,
  DollarSign,
  Info, // Add this line
  AlertTriangle,
} from "lucide-react";
import { categories, genres } from "./types";
import supabase from "@/config/supabaseClient";

interface Theater {
  id: string;
  legal_business_name: string;
  trade_name: string;
  city: string;
}

interface Hall {
  id: string;
  name: string;
  capacity: number;
  num_of_row: number;
  num_of_col: number;
}

interface SeatLevel {
  id: string;
  name: string;
  display_name: string;
  price: number;
  color: string;
}

interface Schedule {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  hallId: string;
  customPrices: Record<string, number>;
}

interface CreateEventFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  theaters?: Theater[];
  selectedTheaterId?: string | null;
}

const CreateEventForm: React.FC<CreateEventFormProps> = ({
  onSubmit,
  onCancel,
  theaters = [],
  selectedTheaterId = null,
}) => {
  const [selectedTheater, setSelectedTheater] = useState<string>(
    selectedTheaterId || (theaters.length > 0 ? theaters[0].id : ""),
  );
  const [availableHalls, setAvailableHalls] = useState<Hall[]>([]);
  const [availableSeatLevels, setAvailableSeatLevels] = useState<
    Record<string, SeatLevel[]>
  >({});
  const [loadingHalls, setLoadingHalls] = useState(false);
  const [loadingSeatLevels, setLoadingSeatLevels] = useState(false);

  // Schedule state
  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: Date.now().toString(),
      date: "",
      startTime: "",
      endTime: "",
      hallId: "",
      customPrices: {},
    },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    category: "",
    duration_minutes: 0,
    director: "",
    cast: [] as string[],
    poster_url: "",
    status: "coming-soon" as "coming-soon" | "now-showing" | "ended",
    is_featured: false,
    theater_id:
      selectedTheaterId || (theaters.length > 0 ? theaters[0].id : ""),
    event_provider: "",
    event_provider_email: "",
    event_provider_phone: "",
  });

  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [castInput, setCastInput] = useState("");
  const [priceConfigs, setPriceConfigs] = useState<
    Record<string, Record<string, number>>
  >({});

  // Load halls when theater changes
  useEffect(() => {
    if (selectedTheater) {
      loadHalls();
    }
  }, [selectedTheater]);

  // Load seat levels when hall is selected in a schedule
  useEffect(() => {
    const hallIds = [
      ...new Set(schedules.map((s) => s.hallId).filter(Boolean)),
    ];
    hallIds.forEach((hallId) => {
      if (!availableSeatLevels[hallId]) {
        loadSeatLevelsForHall(hallId);
      }
    });
  }, [schedules]);

  const loadHalls = async () => {
    setLoadingHalls(true);
    try {
      const { data, error } = await supabase
        .from("halls")
        .select("id, name, capacity, num_of_row, num_of_col")
        .eq("theater_id", selectedTheater)
        .eq("is_active", true);

      if (error) throw error;
      setAvailableHalls(data || []);
    } catch (error) {
      console.error("Error loading halls:", error);
    } finally {
      setLoadingHalls(false);
    }
  };

  const loadSeatLevelsForHall = async (hallId: string) => {
    if (availableSeatLevels[hallId]) return;

    setLoadingSeatLevels(true);
    try {
      const { data, error } = await supabase
        .from("seat_levels")
        .select("*")
        .eq("hall_id", hallId)
        .eq("is_active", true);

      if (error) throw error;
      setAvailableSeatLevels((prev) => ({ ...prev, [hallId]: data || [] }));

      // Initialize price configs for this hall if not exists
      if (!priceConfigs[hallId] && data) {
        const initialPrices: Record<string, number> = {};
        data.forEach((level) => {
          initialPrices[level.id] = level.price;
        });
        setPriceConfigs((prev) => ({ ...prev, [hallId]: initialPrices }));
      }
    } catch (error) {
      console.error("Error loading seat levels:", error);
    } finally {
      setLoadingSeatLevels(false);
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

  const validateScheduleTimes = () => {
    for (const schedule of schedules) {
      if (schedule.startTime && formData.duration_minutes) {
        const calculatedEnd = calculateEndTime(
          schedule.startTime,
          formData.duration_minutes,
        );
        if (schedule.endTime && schedule.endTime !== calculatedEnd) {
          return false;
        }
      }
    }
    return true;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!selectedTheater) newErrors.theater = "Please select a theater";
    if (!formData.title) newErrors.title = "Event title is required";
    if (!formData.genre) newErrors.genre = "Genre is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.duration_minutes || formData.duration_minutes <= 0)
      newErrors.duration_minutes = "Valid duration is required";
    if (!formData.director) newErrors.director = "Director name is required";
    if (formData.cast.length === 0)
      newErrors.cast = "At least one cast member is required";
    if (!formData.event_provider)
      newErrors.event_provider = "Event provider name is required";
    if (!formData.event_provider_email) {
      newErrors.event_provider_email = "Provider email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.event_provider_email)) {
      newErrors.event_provider_email = "Invalid email format";
    }
    if (!formData.event_provider_phone)
      newErrors.event_provider_phone = "Provider phone is required";

    // Validate schedules
    for (let i = 0; i < schedules.length; i++) {
      const schedule = schedules[i];
      if (!schedule.date) newErrors[`schedule_${i}_date`] = "Date is required";
      if (!schedule.startTime)
        newErrors[`schedule_${i}_start`] = "Start time required";

      // Auto-calculate end time based on duration
      if (schedule.startTime && formData.duration_minutes) {
        const calculatedEnd = calculateEndTime(
          schedule.startTime,
          formData.duration_minutes,
        );
        if (schedule.endTime && schedule.endTime !== calculatedEnd) {
          newErrors[`schedule_${i}_end`] =
            `End time should be ${calculatedEnd} (based on ${formData.duration_minutes} min duration)`;
        }
      }

      if (
        !schedule.endTime &&
        schedule.startTime &&
        formData.duration_minutes
      ) {
        // Auto-set end time
        const calculatedEnd = calculateEndTime(
          schedule.startTime,
          formData.duration_minutes,
        );
        updateSchedule(schedule.id, "endTime", calculatedEnd);
      }

      if (!schedule.hallId)
        newErrors[`schedule_${i}_hall`] = "Hall is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.description) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 50) {
      newErrors.description = "Description must be at least 50 characters";
    }
    if (!posterFile && !formData.poster_url) {
      newErrors.poster = "Event poster is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;
    if (currentStep === 1) isValid = validateStep1();
    else if (currentStep === 2) isValid = validateStep2();

    if (isValid) {
      setCurrentStep((prev) => prev + 1);
      setErrors({});
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const uploadPoster = async (): Promise<string | null> => {
    if (!posterFile) return formData.poster_url || null;

    setUploading(true);
    const fileExt = posterFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `event-posters/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("event-images")
      .upload(filePath, posterFile);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      setUploading(false);
      return null;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("event-images").getPublicUrl(filePath);

    setUploading(false);
    return publicUrl;
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
        customPrices: {},
      },
    ]);
  };

  const removeSchedule = (id: string) => {
    if (schedules.length > 1) {
      setSchedules(schedules.filter((s) => s.id !== id));
    }
  };

  const updateSchedule = (id: string, field: string, value: string) => {
    setSchedules(
      schedules.map((s) => {
        if (s.id === id) {
          const updated = { ...s, [field]: value };
          // Auto-calculate end time when start time changes
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

  const updateSchedulePrice = (
    scheduleId: string,
    levelId: string,
    price: number,
  ) => {
    setSchedules(
      schedules.map((s) =>
        s.id === scheduleId
          ? {
              ...s,
              customPrices: { ...s.customPrices, [levelId]: price },
            }
          : s,
      ),
    );
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    if (!selectedTheater) {
      setErrors((prev) => ({ ...prev, theater: "Please select a theater" }));
      return;
    }

    const posterUrl = await uploadPoster();
    if (!posterUrl && !formData.poster_url) {
      setErrors((prev) => ({ ...prev, poster: "Failed to upload poster" }));
      return;
    }

    // Prepare submission data
    const submitData = {
      title: formData.title,
      description: formData.description,
      genre: formData.genre,
      category: formData.category,
      duration_minutes: formData.duration_minutes,
      director: formData.director,
      cast: formData.cast,
      poster_url: posterUrl || formData.poster_url,
      status: formData.status,
      is_featured: formData.is_featured,
      theater_id: selectedTheater,
      event_provider: formData.event_provider,
      event_provider_email: formData.event_provider_email,
      event_provider_phone: formData.event_provider_phone,
      schedules: schedules.map((s) => ({
        date: s.date,
        startTime: s.startTime,
        endTime: s.endTime,
        hallId: s.hallId,
        customPrices: s.customPrices,
      })),
    };

    onSubmit(submitData);
  };

  const addCastMember = () => {
    if (castInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        cast: [...prev.cast, castInput.trim()],
      }));
      setCastInput("");
      if (errors.cast) setErrors((prev) => ({ ...prev, cast: "" }));
    }
  };

  const removeCastMember = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      cast: prev.cast.filter((_, i) => i !== index),
    }));
  };

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPosterFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPosterPreview(reader.result as string);
      reader.readAsDataURL(file);
      if (errors.poster) setErrors((prev) => ({ ...prev, poster: "" }));
    }
  };

  const handleTheaterChange = (theaterId: string) => {
    setSelectedTheater(theaterId);
    setFormData((prev) => ({ ...prev, theater_id: theaterId }));
    if (errors.theater) setErrors((prev) => ({ ...prev, theater: "" }));
  };

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;
  const selectedTheaterInfo = theaters?.find((t) => t.id === selectedTheater);
  const hasMultipleTheaters = theaters && theaters.length > 1;
  const hasSingleTheater = theaters && theaters.length === 1;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-5 shrink-0">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Film className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Create New Event
                </h2>
                <p className="text-white/80 text-sm">
                  Fill in the event information below
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-white/70 mb-2">
              <span>Basic Info & Schedule</span>
              <span>Media & Details</span>
              <span>Review</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="px-6 pt-4 pb-2 bg-gray-50 flex justify-between border-b">
          {[
            { step: 1, title: "Basic Info & Schedule", icon: Calendar },
            { step: 2, title: "Media & Details", icon: Image },
            { step: 3, title: "Review", icon: CheckCircle },
          ].map((item) => (
            <div
              key={item.step}
              className={`flex-1 text-center py-2 rounded-lg transition-all ${currentStep === item.step ? "bg-teal-100 text-teal-700 font-medium shadow-sm" : currentStep > item.step ? "text-green-600" : "text-gray-500"}`}
            >
              <div className="flex items-center justify-center gap-2">
                {currentStep > item.step ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <item.icon className="h-4 w-4" />
                )}
                <span className="text-sm">{item.title}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {(!theaters || theaters.length === 0) && (
            <div className="text-center py-8">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <AlertCircle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-yellow-800 font-medium">
                  No Theaters Available
                </p>
                <p className="text-yellow-600 text-sm mt-1">
                  Please contact your administrator to assign a theater to your
                  account.
                </p>
              </div>
              <button
                onClick={onCancel}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Close
              </button>
            </div>
          )}

          {/* Step 1: Basic Information & Schedule */}
          {currentStep === 1 && theaters && theaters.length > 0 && (
            <div className="space-y-5">
              {/* Theater Selection */}
              {hasMultipleTheaters && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Theater *
                  </label>
                  <select
                    value={selectedTheater}
                    onChange={(e) => handleTheaterChange(e.target.value)}
                    className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none ${errors.theater && touched.theater ? "border-red-500" : "border-gray-200"}`}
                    onBlur={() => handleBlur("theater")}
                  >
                    {theaters.map((theater) => (
                      <option key={theater.id} value={theater.id}>
                        {theater.legal_business_name} - {theater.city}
                      </option>
                    ))}
                  </select>
                  {errors.theater && touched.theater && (
                    <p className="text-red-500 text-xs mt-1">
                      <AlertCircle className="h-3 w-3 inline" />{" "}
                      {errors.theater}
                    </p>
                  )}
                </div>
              )}

              {hasSingleTheater && selectedTheaterInfo && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2">
                    <Theater className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedTheaterInfo.legal_business_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedTheaterInfo.city}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Event Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter event title"
                    className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none ${errors.title && touched.title ? "border-red-500" : "border-gray-200"}`}
                    value={formData.title}
                    onBlur={() => handleBlur("title")}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      if (errors.title)
                        setErrors((prev) => ({ ...prev, title: "" }));
                    }}
                  />
                  {errors.title && touched.title && (
                    <p className="text-red-500 text-xs mt-1">
                      <AlertCircle className="h-3 w-3" /> {errors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 120"
                    className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none ${errors.duration_minutes && touched.duration_minutes ? "border-red-500" : "border-gray-200"}`}
                    value={formData.duration_minutes || ""}
                    onBlur={() => handleBlur("duration_minutes")}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setFormData({ ...formData, duration_minutes: val });
                      if (errors.duration_minutes)
                        setErrors((prev) => ({
                          ...prev,
                          duration_minutes: "",
                        }));

                      // Update all schedules end times based on new duration
                      setSchedules((prev) =>
                        prev.map((s) => {
                          if (s.startTime && val) {
                            return {
                              ...s,
                              endTime: calculateEndTime(s.startTime, val),
                            };
                          }
                          return s;
                        }),
                      );
                    }}
                  />
                  {errors.duration_minutes && touched.duration_minutes && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.duration_minutes}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Genre *
                  </label>
                  <select
                    className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none ${errors.genre && touched.genre ? "border-red-500" : "border-gray-200"}`}
                    value={formData.genre}
                    onBlur={() => handleBlur("genre")}
                    onChange={(e) => {
                      setFormData({ ...formData, genre: e.target.value });
                      if (errors.genre)
                        setErrors((prev) => ({ ...prev, genre: "" }));
                    }}
                  >
                    <option value="">Select Genre</option>
                    {genres.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                  {errors.genre && touched.genre && (
                    <p className="text-red-500 text-xs mt-1">{errors.genre}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none ${errors.category && touched.category ? "border-red-500" : "border-gray-200"}`}
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
                    <p className="text-red-500 text-xs mt-1">
                      {errors.category}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Director *
                  </label>
                  <input
                    type="text"
                    placeholder="Director name"
                    className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none ${errors.director && touched.director ? "border-red-500" : "border-gray-200"}`}
                    value={formData.director}
                    onBlur={() => handleBlur("director")}
                    onChange={(e) => {
                      setFormData({ ...formData, director: e.target.value });
                      if (errors.director)
                        setErrors((prev) => ({ ...prev, director: "" }));
                    }}
                  />
                  {errors.director && touched.director && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.director}
                    </p>
                  )}
                </div>
              </div>

              {/* Cast */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cast *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter cast member name"
                    className="flex-1 p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    value={castInput}
                    onChange={(e) => setCastInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addCastMember()}
                  />
                  <button
                    type="button"
                    onClick={addCastMember}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {formData.cast.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.cast.map((member, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        <User className="h-3 w-3" /> {member}
                        <button
                          onClick={() => removeCastMember(idx)}
                          className="hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {errors.cast && (
                  <p className="text-red-500 text-xs mt-1">
                    <AlertCircle className="h-3 w-3 inline" /> {errors.cast}
                  </p>
                )}
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
                      Provider Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., ABC Productions"
                      className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none ${errors.event_provider && touched.event_provider ? "border-red-500" : "border-gray-200"}`}
                      value={formData.event_provider}
                      onBlur={() => handleBlur("event_provider")}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          event_provider: e.target.value,
                        });
                        if (errors.event_provider)
                          setErrors((prev) => ({
                            ...prev,
                            event_provider: "",
                          }));
                      }}
                    />
                    {errors.event_provider && touched.event_provider && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.event_provider}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Provider Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        placeholder="provider@example.com"
                        className={`w-full pl-10 pr-4 p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none ${errors.event_provider_email && touched.event_provider_email ? "border-red-500" : "border-gray-200"}`}
                        value={formData.event_provider_email}
                        onBlur={() => handleBlur("event_provider_email")}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            event_provider_email: e.target.value,
                          });
                          if (errors.event_provider_email)
                            setErrors((prev) => ({
                              ...prev,
                              event_provider_email: "",
                            }));
                        }}
                      />
                    </div>
                    {errors.event_provider_email &&
                      touched.event_provider_email && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.event_provider_email}
                        </p>
                      )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Provider Phone *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="+251-XXX-XXXXXX"
                        className={`w-full pl-10 pr-4 p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none ${errors.event_provider_phone && touched.event_provider_phone ? "border-red-500" : "border-gray-200"}`}
                        value={formData.event_provider_phone}
                        onBlur={() => handleBlur("event_provider_phone")}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            event_provider_phone: e.target.value,
                          });
                          if (errors.event_provider_phone)
                            setErrors((prev) => ({
                              ...prev,
                              event_provider_phone: "",
                            }));
                        }}
                      />
                    </div>
                    {errors.event_provider_phone &&
                      touched.event_provider_phone && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.event_provider_phone}
                        </p>
                      )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_featured: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-700">
                    Feature this event (highlight on homepage)
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.status === "now-showing"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.checked
                          ? "now-showing"
                          : "coming-soon",
                      })
                    }
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-700">
                    Mark as "Now Showing"
                  </span>
                </label>
              </div>

              {/* Show Schedules Section */}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-teal-600" />
                    Show Schedules *
                  </h3>
                  <button
                    onClick={addSchedule}
                    className="px-3 py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" /> Add Schedule
                  </button>
                </div>
                <p className="text-sm text-gray-500 mb-3">
                  Schedule when and where this event will be shown
                </p>

                {schedules.map((schedule, idx) => {
                  const hallSeatLevels =
                    availableSeatLevels[schedule.hallId] || [];
                  return (
                    <div
                      key={schedule.id}
                      className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200"
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
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Date *
                          </label>
                          <input
                            type="date"
                            value={schedule.date}
                            onChange={(e) =>
                              updateSchedule(
                                schedule.id,
                                "date",
                                e.target.value,
                              )
                            }
                            className={`w-full p-2 border rounded-lg text-sm ${errors[`schedule_${idx}_date`] ? "border-red-500" : "border-gray-200"}`}
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
                              updateSchedule(
                                schedule.id,
                                "startTime",
                                e.target.value,
                              )
                            }
                            className={`w-full p-2 border rounded-lg text-sm ${errors[`schedule_${idx}_start`] ? "border-red-500" : "border-gray-200"}`}
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
                          <p className="text-xs text-gray-400 mt-1">
                            Auto-calculated from duration
                          </p>
                          {errors[`schedule_${idx}_end`] && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors[`schedule_${idx}_end`]}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Hall *
                        </label>
                        <select
                          value={schedule.hallId}
                          onChange={(e) => {
                            updateSchedule(
                              schedule.id,
                              "hallId",
                              e.target.value,
                            );
                            if (e.target.value)
                              loadSeatLevelsForHall(e.target.value);
                          }}
                          className={`w-full p-2 border rounded-lg text-sm ${errors[`schedule_${idx}_hall`] ? "border-red-500" : "border-gray-200"}`}
                          disabled={loadingHalls}
                        >
                          <option value="">Select Hall</option>
                          {availableHalls.map((hall) => (
                            <option key={hall.id} value={hall.id}>
                              {hall.name} (Capacity: {hall.capacity} |{" "}
                              {hall.num_of_row} rows × {hall.num_of_col} cols)
                            </option>
                          ))}
                        </select>
                        {errors[`schedule_${idx}_hall`] && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors[`schedule_${idx}_hall`]}
                          </p>
                        )}
                      </div>

                      {/* Custom Pricing per Seat Level */}
                      {schedule.hallId && hallSeatLevels.length > 0 && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-2">
                            Custom Pricing (Optional)
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {hallSeatLevels.map((level) => (
                              <div
                                key={level.id}
                                className="flex items-center gap-2 p-2 bg-white rounded-lg border"
                              >
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: level.color }}
                                />
                                <span className="text-sm flex-1">
                                  {level.display_name}
                                </span>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3 text-gray-400" />
                                  <input
                                    type="number"
                                    value={
                                      schedule.customPrices[level.id] ||
                                      level.price
                                    }
                                    onChange={(e) =>
                                      updateSchedulePrice(
                                        schedule.id,
                                        level.id,
                                        parseFloat(e.target.value) || 0,
                                      )
                                    }
                                    className="w-20 p-1 border rounded text-sm text-right"
                                    step="5"
                                    min="0"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            Leave as default price or override for this show
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}

                {formData.duration_minutes > 0 && (
                  <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                    <Info className="h-4 w-4 inline mr-1" />
                    {/* Cannot find name 'Info'. */}
                    End times are automatically calculated based on{" "}
                    {formData.duration_minutes} minutes duration.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Media & Details */}
          {currentStep === 2 && theaters && theaters.length > 0 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Poster *
                </label>
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${errors.poster ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-teal-500"}`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePosterChange}
                    className="hidden"
                    id="poster-upload"
                  />
                  <label
                    htmlFor="poster-upload"
                    className="cursor-pointer block"
                  >
                    {posterPreview ? (
                      <img
                        src={posterPreview}
                        alt="Preview"
                        className="max-h-48 mx-auto rounded-lg shadow-md"
                      />
                    ) : (
                      <>
                        <Upload className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500">
                          Click to upload event poster
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          PNG, JPG up to 5MB
                        </p>
                      </>
                    )}
                  </label>
                </div>
                {errors.poster && (
                  <p className="text-red-500 text-xs mt-1">
                    <AlertCircle className="h-3 w-3 inline" /> {errors.poster}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  rows={6}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none ${errors.description && touched.description ? "border-red-500" : "border-gray-200"}`}
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
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Minimum 50 characters. Current: {formData.description.length}
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 &&
            theaters &&
            theaters.length > 0 &&
            selectedTheaterInfo && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-5 rounded-xl border border-teal-200">
                  <h3 className="font-bold text-lg text-teal-800 mb-3">
                    <CheckCircle className="inline mr-2 text-green-600" /> Event
                    Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-gray-500">Theater:</span>{" "}
                      {selectedTheaterInfo.legal_business_name} (
                      {selectedTheaterInfo.city})
                    </div>
                    <div>
                      <span className="text-gray-500">Title:</span>{" "}
                      {formData.title}
                    </div>
                    <div>
                      <span className="text-gray-500">Genre:</span>{" "}
                      {formData.genre}
                    </div>
                    <div>
                      <span className="text-gray-500">Category:</span>{" "}
                      {formData.category}
                    </div>
                    <div>
                      <span className="text-gray-500">Duration:</span>{" "}
                      {formData.duration_minutes} min
                    </div>
                    <div>
                      <span className="text-gray-500">Director:</span>{" "}
                      {formData.director}
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Cast:</span>{" "}
                      {formData.cast.join(", ")}
                    </div>
                    <div>
                      <span className="text-gray-500">Provider:</span>{" "}
                      {formData.event_provider}
                    </div>
                    <div>
                      <span className="text-gray-500">Provider Email:</span>{" "}
                      {formData.event_provider_email}
                    </div>
                    <div>
                      <span className="text-gray-500">Provider Phone:</span>{" "}
                      {formData.event_provider_phone}
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>{" "}
                      {formData.status === "now-showing"
                        ? "Now Showing"
                        : "Coming Soon"}
                    </div>
                    <div>
                      <span className="text-gray-500">Featured:</span>{" "}
                      {formData.is_featured ? "Yes" : "No"}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="font-bold text-gray-800 mb-3">
                    <Clock className="inline mr-2 text-teal-600" /> Show
                    Schedules
                  </h3>
                  <div className="space-y-2">
                    {schedules.map((schedule, idx) => {
                      const hall = availableHalls.find(
                        (h) => h.id === schedule.hallId,
                      );
                      return (
                        <div
                          key={schedule.id}
                          className="p-3 bg-white rounded-lg border"
                        >
                          <p className="font-medium">Schedule #{idx + 1}</p>
                          <p className="text-sm">
                            📅 {new Date(schedule.date).toLocaleDateString()} |
                            🕐 {schedule.startTime} - {schedule.endTime}
                          </p>
                          <p className="text-sm">
                            🏠 {hall?.name || "Unknown Hall"} (Capacity:{" "}
                            {hall?.capacity || "N/A"})
                          </p>
                          {Object.keys(schedule.customPrices).length > 0 && (
                            <div className="mt-2 text-sm">
                              <span className="text-gray-500">
                                Custom Prices:
                              </span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {Object.entries(schedule.customPrices).map(
                                  ([levelId, price]) => {
                                    const level = availableSeatLevels[
                                      schedule.hallId
                                    ]?.find((l) => l.id === levelId);
                                    return (
                                      level && (
                                        <span
                                          key={levelId}
                                          className="text-xs bg-gray-100 px-2 py-1 rounded"
                                        >
                                          {level.display_name}: ETB {price}
                                        </span>
                                      )
                                    );
                                  },
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {formData.description && (
                  <div className="bg-gray-50 p-5 rounded-xl">
                    <h3 className="font-bold text-gray-800 mb-2">
                      <FileText className="inline mr-2 text-teal-600" />{" "}
                      Description
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {formData.description}
                    </p>
                  </div>
                )}

                {posterPreview && (
                  <div className="bg-gray-50 p-5 rounded-xl">
                    <h3 className="font-bold text-gray-800 mb-2">
                      <Image className="inline mr-2 text-teal-600" /> Poster
                    </h3>
                    <img
                      src={posterPreview}
                      alt="Event poster"
                      className="max-h-48 rounded-lg shadow"
                    />
                  </div>
                )}

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <AlertCircle className="inline mr-2 h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">
                    Please verify all information before submitting.
                  </span>
                </div>
              </div>
            )}
        </div>

        {/* Footer */}
        {theaters && theaters.length > 0 && (
          <div className="border-t p-5 bg-gray-50 flex justify-between shrink-0">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
            )}
            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className={`px-6 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg hover:from-teal-600 hover:to-emerald-700 transition-all flex items-center gap-2 ${currentStep === 1 ? "w-full" : "ml-auto"}`}
              >
                Continue <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={uploading}
                className="px-6 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg hover:from-teal-600 hover:to-emerald-700 transition-all flex items-center gap-2 ml-auto disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>{" "}
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" /> Create Event
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateEventForm;

// i it closed when  trying to give duration ...  