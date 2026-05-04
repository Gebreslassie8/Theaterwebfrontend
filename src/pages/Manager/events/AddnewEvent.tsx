// src/pages/Manager/events/AddnewEvent.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, Clock, Users, DollarSign, Image, X,
  Upload, AlertCircle, CheckCircle, FileText, Phone,
  Mail, Globe, Star, Award, Ticket, Music, Film,
  Trash2, Eye, Loader, ChevronRight, ChevronLeft, Edit,
  Search, Ban, RefreshCw, Activity, XCircle, Shield, MapPin, Download, Filter,
  Plus, FileSignature, Layers, Percent
} from 'lucide-react';
import ReusableButton from '../../../components/Reusable/ReusableButton';

// ---------- SHARED CONSTANTS (exported for use in CreateEvent) ----------
export const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export const halls = [
  { 
    id: 'hall-a', 
    name: 'Grand Hall', 
    capacity: 1500,
    seatTypes: [
      { name: 'VIP', capacity: 200 },
      { name: 'Regular', capacity: 1000 },
      { name: 'Balcony', capacity: 300 }
    ]
  },
  { 
    id: 'hall-b', 
    name: 'Blue Hall', 
    capacity: 800,
    seatTypes: [
      { name: 'VIP', capacity: 100 },
      { name: 'Regular', capacity: 600 },
      { name: 'Balcony', capacity: 100 }
    ]
  },
  { 
    id: 'hall-c', 
    name: 'Red Hall', 
    capacity: 500,
    seatTypes: [
      { name: 'VIP', capacity: 50 },
      { name: 'Regular', capacity: 400 },
      { name: 'Balcony', capacity: 50 }
    ]
  },
  { 
    id: 'vip-hall', 
    name: 'Royal Hall', 
    capacity: 300,
    seatTypes: [
      { name: 'Royal VIP', capacity: 50 },
      { name: 'Premium', capacity: 150 },
      { name: 'Standard', capacity: 100 }
    ]
  },
];

export const categories = [
  { value: 'concert', label: 'Concert', icon: Music, color: 'from-purple-500 to-pink-500' },
  { value: 'theater', label: 'Theater', icon: Film, color: 'from-blue-500 to-cyan-500' },
  { value: 'movie', label: 'Movie', icon: Film, color: 'from-red-500 to-orange-500' },
  { value: 'comedy', label: 'Comedy', icon: Star, color: 'from-yellow-500 to-orange-500' },
  { value: 'sports', label: 'Sports', icon: Award, color: 'from-green-500 to-emerald-500' },
  { value: 'family', label: 'Family', icon: Users, color: 'from-indigo-500 to-purple-500' },
];

// ---------- TYPES ----------
interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface SeatCategory {
  id: string;
  name: string;
  price: number;
  capacity: number;
  booked?: number;
  commissionPercent: number;
}

export interface EventData {
  id: string;
  name: string;
  description: string;
  timeSlots: TimeSlot[];
  hall: string;
  seatCategories: SeatCategory[];
  category: string;
  ageRestriction: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  organizer: string;
  imageUrl?: string;
  createdAt: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  totalBookedSeats: number;
  totalRevenue: number;
  totalManagerEarnings: number;
  contractDate?: string;
  contractReference?: string;
}

interface AddnewEventProps {
  onEventCreated: (event: EventData) => void;
  onCancel: () => void;
}

// ---------- COMPONENT ----------
const AddnewEvent: React.FC<AddnewEventProps> = ({ onEventCreated, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    timeSlots: [{ id: generateId(), date: '', startTime: '', endTime: '' }],
    hall: '',
    seatCategories: [] as SeatCategory[],
    category: '',
    ageRestriction: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    organizer: '',
    contractDate: new Date().toISOString().split('T')[0],
    contractReference: '',
  });

  const getSeatTypesForHall = (hallId: string): SeatCategory[] => {
    const hall = halls.find(h => h.id === hallId);
    if (!hall) return [];
    return hall.seatTypes.map(st => ({
      id: generateId(),
      name: st.name,
      price: 0,
      capacity: st.capacity,
      commissionPercent: 10,
      booked: 0,
    }));
  };

  const handleHallChange = (hallId: string) => {
    const newSeatCategories = getSeatTypesForHall(hallId);
    setFormData(prev => ({
      ...prev,
      hall: hallId,
      seatCategories: newSeatCategories,
    }));
  };

  const updateSeatCategoryField = (id: string, field: 'price' | 'commissionPercent', value: number) => {
    setFormData(prev => ({
      ...prev,
      seatCategories: prev.seatCategories.map(cat =>
        cat.id === id ? { ...cat, [field]: value } : cat
      ),
    }));
  };

  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      timeSlots: [
        ...prev.timeSlots,
        { id: generateId(), date: '', startTime: '', endTime: '' },
      ],
    }));
  };

  const updateTimeSlot = (id: string, field: keyof TimeSlot, value: string) => {
    setFormData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.map(slot =>
        slot.id === id ? { ...slot, [field]: value } : slot
      ),
    }));
  };

  const removeTimeSlot = (id: string) => {
    if (formData.timeSlots.length === 1) {
      alert('You need at least one time slot for the event.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.filter(slot => slot.id !== id),
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => setUploadedImage(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.name) newErrors.name = 'Event name is required';
      else if (formData.name.length < 3) newErrors.name = 'Event name must be at least 3 characters';
      if (!formData.organizer) newErrors.organizer = 'Organizer is required';
      if (!formData.hall) newErrors.hall = 'Please select a venue';
      if (formData.seatCategories.length === 0) {
        newErrors.seatCategories = 'No seat types defined for this hall.';
      } else {
        for (const cat of formData.seatCategories) {
          if (cat.price <= 0) newErrors[`seat_${cat.id}_price`] = 'Price must be > 0';
          if (cat.commissionPercent < 0 || cat.commissionPercent > 100)
            newErrors[`seat_${cat.id}_commission`] = 'Commission must be 0-100';
        }
      }
    } else if (currentStep === 2) {
      if (formData.timeSlots.length === 0) {
        newErrors.timeSlots = 'At least one time slot is required';
      } else {
        for (const slot of formData.timeSlots) {
          if (!slot.date) newErrors[`slot_${slot.id}_date`] = 'Date required';
          if (!slot.startTime) newErrors[`slot_${slot.id}_startTime`] = 'Start time required';
          if (!slot.endTime) newErrors[`slot_${slot.id}_endTime`] = 'End time required';
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => setCurrentStep(currentStep - 1);

  const handleSubmit = () => {
    if (validateStep()) {
      const selectedHall = halls.find(h => h.id === formData.hall);
      const newEvent: EventData = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        timeSlots: formData.timeSlots,
        hall: selectedHall?.name || formData.hall,
        seatCategories: formData.seatCategories.map(cat => ({ ...cat, booked: 0 })),
        category: formData.category,
        ageRestriction: formData.ageRestriction,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        website: formData.website,
        organizer: formData.organizer,
        imageUrl: uploadedImage || undefined,
        createdAt: new Date().toISOString(),
        status: 'upcoming',
        totalBookedSeats: 0,
        totalRevenue: 0,
        totalManagerEarnings: 0,
        contractDate: formData.contractDate,
        contractReference: formData.contractReference,
      };
      onEventCreated(newEvent);
    }
  };

  const steps = [
    { step: 1, title: 'Event Info', icon: FileSignature },
    { step: 2, title: 'Schedule', icon: Calendar },
    { step: 3, title: 'Media & Description', icon: Image },
    { step: 4, title: 'Review', icon: CheckCircle },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Top Bar with Back button (icon only, no background color) */}
      <div className="px-8 pt-6 flex items-center justify-between border-b pb-4">
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h2 className="text-xl font-semibold text-gray-800">Create New Event</h2>
        <div className="w-10" /> {/* Spacer for balance */}
      </div>

      {/* Step progress bar */}
      <div className="px-8 pt-6">
        <div className="flex items-center justify-between">
          {steps.map((item) => {
            const status =
              item.step < currentStep
                ? 'completed'
                : item.step === currentStep
                ? 'current'
                : 'pending';
            const Icon = item.icon;
            return (
              <div key={item.step} className="flex-1 relative">
                <div
                  className={`h-1 ${
                    status === 'completed'
                      ? 'bg-green-500'
                      : status === 'current'
                      ? 'bg-blue-500'
                      : 'bg-gray-200'
                  }`}
                />
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                      status === 'completed'
                        ? 'bg-green-500 text-white'
                        : status === 'current'
                        ? 'bg-blue-500 text-white ring-4 ring-blue-200'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {status === 'completed' ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                </div>
                <p
                  className={`text-center mt-6 text-sm font-medium ${
                    status === 'current' ? 'text-blue-600' : 'text-gray-500'
                  }`}
                >
                  {item.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {/* Step 1: Event Info */}
        {currentStep === 1 && (
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-2">Event Name *</label>
                <input
                  type="text"
                  name="name"
                  className={`w-full p-3 border-2 rounded-xl ${
                    errors.name ? 'border-red-500' : 'border-gray-200'
                  }`}
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block font-semibold mb-2">Organizer *</label>
                <input
                  type="text"
                  name="organizer"
                  className={`w-full p-3 border-2 rounded-xl ${
                    errors.organizer ? 'border-red-500' : 'border-gray-200'
                  }`}
                  value={formData.organizer}
                  onChange={handleChange}
                />
                {errors.organizer && <p className="text-red-500 text-sm mt-1">{errors.organizer}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-2">Contract Date</label>
                <input
                  type="date"
                  name="contractDate"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl"
                  value={formData.contractDate}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Contract Reference</label>
                <input
                  type="text"
                  name="contractReference"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl"
                  placeholder="e.g., CTR-2025-001"
                  value={formData.contractReference}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-2">Select Venue *</label>
              <select
                className={`w-full p-3 border-2 rounded-xl ${
                  errors.hall ? 'border-red-500' : 'border-gray-200'
                }`}
                value={formData.hall}
                onChange={(e) => handleHallChange(e.target.value)}
              >
                <option value="">-- Select a hall --</option>
                {halls.map(hall => (
                  <option key={hall.id} value={hall.id}>
                    {hall.name} (Capacity: {hall.capacity})
                  </option>
                ))}
              </select>
              {errors.hall && <p className="text-red-500 text-sm mt-1">{errors.hall}</p>}
            </div>
            {formData.hall && (
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <Layers className="h-5 w-5" /> Seat Types & Prices
                </h3>
                {errors.seatCategories && <p className="text-red-500 text-sm mb-2">{errors.seatCategories}</p>}
                <div className="space-y-4">
                  {formData.seatCategories.map(cat => (
                    <div key={cat.id} className="p-4 border rounded-xl bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                          <label className="block text-sm font-medium mb-1">Seat Type</label>
                          <div className="p-2 bg-gray-200 rounded-lg font-semibold">{cat.name}</div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Capacity (fixed)</label>
                          <div className="p-2 bg-gray-200 rounded-lg">{cat.capacity}</div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Price ($) *</label>
                          <input
                            type="number"
                            step="0.01"
                            value={cat.price}
                            onChange={e => updateSeatCategoryField(cat.id, 'price', parseFloat(e.target.value))}
                            className="w-full p-2 border rounded-lg"
                          />
                          {errors[`seat_${cat.id}_price`] && (
                            <p className="text-red-500 text-xs">{errors[`seat_${cat.id}_price`]}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Commission (%) *</label>
                          <input
                            type="number"
                            step="0.5"
                            value={cat.commissionPercent}
                            onChange={e => updateSeatCategoryField(cat.id, 'commissionPercent', parseFloat(e.target.value))}
                            className="w-full p-2 border rounded-lg"
                          />
                          {errors[`seat_${cat.id}_commission`] && (
                            <p className="text-red-500 text-xs">{errors[`seat_${cat.id}_commission`]}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2">Age Restriction</label>
                <select
                  name="ageRestriction"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl"
                  value={formData.ageRestriction}
                  onChange={handleChange}
                >
                  <option value="">All Ages</option>
                  <option value="12+">12+</option>
                  <option value="16+">16+</option>
                  <option value="18+">18+</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-2">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map(cat => (
                    <button
                      type="button"
                      key={cat.value}
                      onClick={() => setFormData({ ...formData, category: cat.value })}
                      className={`p-2 border rounded-lg text-sm ${
                        formData.category === cat.value
                          ? `bg-gradient-to-r ${cat.color} text-white`
                          : 'bg-white'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Time Slots */}
        {currentStep === 2 && (
          <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5" /> Event Dates & Times
              </h3>
              <ReusableButton onClick={addTimeSlot} variant="primary" size="sm" icon={Plus}>
                Add Another Time
              </ReusableButton>
            </div>
            {errors.timeSlots && <p className="text-red-500 text-sm">{errors.timeSlots}</p>}
            <div className="space-y-4">
              {formData.timeSlots.map((slot, idx) => (
                <div key={slot.id} className="p-4 border rounded-xl bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium">Time Slot #{idx + 1}</h4>
                    {formData.timeSlots.length > 1 && (
                      <ReusableButton onClick={() => removeTimeSlot(slot.id)} variant="danger" size="sm" icon={Trash2}>
                        Remove
                      </ReusableButton>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Date *</label>
                      <input
                        type="date"
                        value={slot.date}
                        onChange={e => updateTimeSlot(slot.id, 'date', e.target.value)}
                        className="w-full p-2 border rounded-lg"
                      />
                      {errors[`slot_${slot.id}_date`] && (
                        <p className="text-red-500 text-xs">{errors[`slot_${slot.id}_date`]}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Start Time *</label>
                      <input
                        type="time"
                        value={slot.startTime}
                        onChange={e => updateTimeSlot(slot.id, 'startTime', e.target.value)}
                        className="w-full p-2 border rounded-lg"
                      />
                      {errors[`slot_${slot.id}_startTime`] && (
                        <p className="text-red-500 text-xs">{errors[`slot_${slot.id}_startTime`]}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">End Time *</label>
                      <input
                        type="time"
                        value={slot.endTime}
                        onChange={e => updateTimeSlot(slot.id, 'endTime', e.target.value)}
                        className="w-full p-2 border rounded-lg"
                      />
                      {errors[`slot_${slot.id}_endTime`] && (
                        <p className="text-red-500 text-xs">{errors[`slot_${slot.id}_endTime`]}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Media & Description */}
        {currentStep === 3 && (
          <div className="p-8 space-y-6">
            <div>
              {!uploadedImage ? (
                <div className="border-2 border-dashed rounded-2xl p-8 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="upload"
                  />
                  <label htmlFor="upload" className="cursor-pointer">
                    <Upload className="h-10 w-10 mx-auto text-gray-400" />
                    <p>Click to upload poster</p>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img src={uploadedImage} alt="Preview" className="w-full max-h-64 object-cover rounded-xl" />
                  <ReusableButton onClick={handleRemoveImage} variant="danger" size="sm">
                    Remove
                  </ReusableButton>
                </div>
              )}
            </div>
            <div>
              <label className="block font-semibold mb-2">Event Description</label>
              <textarea
                name="description"
                rows={6}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="Provide a detailed description of the event, including highlights, performers, schedule, special notes, etc."
                value={formData.description}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                Describe what attendees can expect, any special instructions, etc.
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <div className="p-8 space-y-6">
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="font-bold text-lg mb-2">Event Information</h3>
              <div className="grid grid-cols-2 gap-2">
                <div><span className="font-semibold">Name:</span> {formData.name}</div>
                <div><span className="font-semibold">Organizer:</span> {formData.organizer}</div>
                <div><span className="font-semibold">Contract Date:</span> {formData.contractDate}</div>
                <div><span className="font-semibold">Reference:</span> {formData.contractReference || '—'}</div>
                <div><span className="font-semibold">Venue:</span> {halls.find(h => h.id === formData.hall)?.name || '—'}</div>
                <div><span className="font-semibold">Category:</span> {categories.find(c => c.value === formData.category)?.label || '—'}</div>
                <div><span className="font-semibold">Age Restriction:</span> {formData.ageRestriction || 'All ages'}</div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="font-bold text-lg mb-2">Seat Types & Pricing</h3>
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Type</th>
                    <th className="p-2 text-left">Price</th>
                    <th className="p-2 text-left">Capacity</th>
                    <th className="p-2 text-left">Commission</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.seatCategories.map(cat => (
                    <tr key={cat.id}>
                      <td className="p-2">{cat.name}</td>
                      <td className="p-2">${cat.price}</td>
                      <td className="p-2">{cat.capacity}</td>
                      <td className="p-2">{cat.commissionPercent}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="font-bold text-lg mb-2">Schedule</h3>
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">#</th>
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">Start</th>
                    <th className="p-2 text-left">End</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.timeSlots.map((slot, idx) => (
                    <tr key={slot.id}>
                      <td className="p-2">{idx + 1}</td>
                      <td className="p-2">{slot.date}</td>
                      <td className="p-2">{slot.startTime}</td>
                      <td className="p-2">{slot.endTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {formData.description && (
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="font-bold text-lg mb-2">Description</h3>
                <p className="whitespace-pre-wrap">{formData.description}</p>
              </div>
            )}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <AlertCircle className="inline mr-2" /> Please verify all information before submitting.
            </div>
          </div>
        )}

        <div className="px-8 py-6 bg-gray-50 border-t flex justify-between">
          {currentStep > 1 && (
            <ReusableButton onClick={prevStep} variant="secondary" icon={ChevronLeft}>
              Previous
            </ReusableButton>
          )}
          <div className="ml-auto">
            {currentStep < 4 ? (
              <ReusableButton onClick={nextStep} variant="primary" icon={ChevronRight}>
                Next Step
              </ReusableButton>
            ) : (
              <ReusableButton
                type="submit"
                variant="success"
                disabled={isUploading}
                icon={isUploading ? Loader : CheckCircle}
              >
                {isUploading ? 'Processing...' : 'Create Event'}
              </ReusableButton>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddnewEvent;