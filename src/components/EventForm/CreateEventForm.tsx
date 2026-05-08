// frontend/src/components/EventForm/CreateEventForm.tsx
import React, { useState } from "react";
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
  DollarSign,
  Film,
  FileText,
  Building,
} from "lucide-react";
import { FormData, categories, genres, generateId } from "./types";
import supabase from "@/config/supabaseClient";

interface Theater {
  id: string;
  legal_business_name: string;
  trade_name: string;
  city: string;
}

interface CreateEventFormProps {
  onSubmit: (data: FormData) => void;
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
    theater_id:
      selectedTheaterId || (theaters.length > 0 ? theaters[0].id : ""),
  });

  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [castInput, setCastInput] = useState("");

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
    if (!formData.price_min || formData.price_min <= 0)
      newErrors.price_min = "Minimum price is required";
    if (!formData.price_max || formData.price_max <= 0)
      newErrors.price_max = "Maximum price is required";
    if (formData.price_max < formData.price_min)
      newErrors.price_max = "Max price must be greater than min price";

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

    onSubmit({
      ...formData,
      poster_url: posterUrl || formData.poster_url,
      theater_id: selectedTheater,
    });
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

  // Check if user has multiple theaters
  const hasMultipleTheaters = theaters && theaters.length > 1;
  const hasSingleTheater = theaters && theaters.length === 1;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
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
              <span>Basic Info</span>
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
            { step: 1, title: "Basic Information", icon: Calendar },
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
          {/* Loading State - No theaters available */}
          {(!theaters || theaters.length === 0) && (
            <div className="text-center py-8">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <AlertCircle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-yellow-800 font-medium">No Theaters Available</p>
                <p className="text-yellow-600 text-sm mt-1">
                  Please contact your administrator to assign a theater to your account.
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

          {/* Step 1: Basic Information */}
          {currentStep === 1 && theaters && theaters.length > 0 && (
            <div className="space-y-5">
              {/* Theater Selection - Show if user has multiple theaters */}
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
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.theater}
                    </p>
                  )}
                </div>
              )}

              {/* Theater Info Display - Single theater */}
              {hasSingleTheater && selectedTheaterInfo && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-blue-600" />
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
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.title}
                  </p>
                )}
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
                    <p className="text-red-500 text-xs mt-1">
                      <AlertCircle className="h-3 w-3 inline mr-1" />{" "}
                      {errors.genre}
                    </p>
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
                      <AlertCircle className="h-3 w-3 inline mr-1" />{" "}
                      {errors.category}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                      setFormData({
                        ...formData,
                        duration_minutes: parseInt(e.target.value) || 0,
                      });
                      if (errors.duration_minutes)
                        setErrors((prev) => ({
                          ...prev,
                          duration_minutes: "",
                        }));
                    }}
                  />
                  {errors.duration_minutes && touched.duration_minutes && (
                    <p className="text-red-500 text-xs mt-1">
                      <AlertCircle className="h-3 w-3 inline mr-1" />{" "}
                      {errors.duration_minutes}
                    </p>
                  )}
                </div>
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
                      <AlertCircle className="h-3 w-3 inline mr-1" />{" "}
                      {errors.director}
                    </p>
                  )}
                </div>
              </div>

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
                        <User className="h-3 w-3" />
                        {member}
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
                    <AlertCircle className="h-3 w-3 inline mr-1" />{" "}
                    {errors.cast}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Price (ETB) *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 100"
                    className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none ${errors.price_min && touched.price_min ? "border-red-500" : "border-gray-200"}`}
                    value={formData.price_min || ""}
                    onBlur={() => handleBlur("price_min")}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        price_min: parseInt(e.target.value) || 0,
                      });
                      if (errors.price_min)
                        setErrors((prev) => ({ ...prev, price_min: "" }));
                    }}
                  />
                  {errors.price_min && touched.price_min && (
                    <p className="text-red-500 text-xs mt-1">
                      <AlertCircle className="h-3 w-3 inline mr-1" />{" "}
                      {errors.price_min}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Price (ETB) *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 500"
                    className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none ${errors.price_max && touched.price_max ? "border-red-500" : "border-gray-200"}`}
                    value={formData.price_max || ""}
                    onBlur={() => handleBlur("price_max")}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        price_max: parseInt(e.target.value) || 0,
                      });
                      if (errors.price_max)
                        setErrors((prev) => ({ ...prev, price_max: "" }));
                    }}
                  />
                  {errors.price_max && touched.price_max && (
                    <p className="text-red-500 text-xs mt-1">
                      <AlertCircle className="h-3 w-3 inline mr-1" />{" "}
                      {errors.price_max}
                    </p>
                  )}
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
                    <AlertCircle className="h-3 w-3 inline mr-1" />{" "}
                    {errors.poster}
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
                    <AlertCircle className="h-3 w-3 inline mr-1" />{" "}
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
          {currentStep === 3 && theaters && theaters.length > 0 && selectedTheaterInfo && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-5 rounded-xl border border-teal-200">
                <h3 className="font-bold text-lg text-teal-800 mb-3">
                  <CheckCircle className="inline mr-2 text-green-600" /> Event
                  Summary
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {hasMultipleTheaters && (
                    <div className="col-span-2">
                      <span className="text-gray-500">Theater:</span>{" "}
                      {selectedTheaterInfo.legal_business_name} (
                      {selectedTheaterInfo.city})
                    </div>
                  )}
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
                    <span className="text-gray-500">Price Range:</span> Br{" "}
                    {formData.price_min} - Br {formData.price_max}
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

              {formData.description && (
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="font-bold text-gray-800 mb-2">
                    <FileText className="inline mr-2 text-teal-600" />{" "}
                    Description
                  </h3>
                  <p className="text-gray-700">{formData.description}</p>
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
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
            )}
            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className={`px-6 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg hover:from-teal-600 hover:to-emerald-700 transition-all flex items-center gap-2 ${currentStep === 1 ? "w-full" : "ml-auto"}`}
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={uploading}
                className="px-6 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg hover:from-teal-600 hover:to-emerald-700 transition-all flex items-center gap-2 ml-auto disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Create Event
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