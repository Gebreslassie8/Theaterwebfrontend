// src/pages/Owner/events/CreateEventForm.tsx
import React, { useState, useRef } from 'react';
import { X, Plus, Trash2, Upload, AlertCircle, CheckCircle, ChevronRight, ChevronLeft, Loader, FileSignature, Calendar, Image, Clock, Layers, FileText, File, Copy } from 'lucide-react';
import * as Yup from 'yup';
import ReusableButton from '../Reusable/ReusableButton';
import { FormData, halls, categories, generateId } from './types';

interface CreateEventFormProps {
  onSubmit: (data: FormData, image: string | null) => void;
  onCancel: () => void;
}

const CreateEventForm: React.FC<CreateEventFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '', description: '', timeSlots: [{ id: generateId(), date: '', startTime: '', endTime: '' }],
    hall: '', seatCategories: [], category: '', ageRestriction: '', contactEmail: '', contactPhone: '', website: '',
    organizer: '', contractDate: '', contractReference: ''
  });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isUploading, setIsUploading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const getSeatTypes = (hallId: string) => {
    const hall = halls.find(h => h.id === hallId);
    return hall ? hall.seatTypes.map(st => ({ id: generateId(), name: st.name, price: 0, capacity: st.capacity, commissionPercent: 10, booked: 0 })) : [];
  };

  const updateSeatField = (id: string, field: 'price' | 'commissionPercent', value: number) => {
    if (value < 0) value = 0;
    if (field === 'commissionPercent' && value > 100) value = 100;
    setFormData(prev => ({ ...prev, seatCategories: prev.seatCategories.map(cat => cat.id === id ? { ...cat, [field]: value } : cat) }));
  };

  const addTimeSlot = () => {
    setFormData(prev => ({ ...prev, timeSlots: [...prev.timeSlots, { id: generateId(), date: '', startTime: '', endTime: '' }] }));
  };
  
  const updateTimeSlot = (id: string, field: string, value: string) => {
    setFormData(prev => ({ ...prev, timeSlots: prev.timeSlots.map(slot => slot.id === id ? { ...slot, [field]: value } : slot) }));
    // Clear error when field is filled
    if (value && errors[`slot_${id}_${field}`]) {
      setErrors(prev => ({ ...prev, [`slot_${id}_${field}`]: '' }));
    }
  };

  const removeTimeSlot = (id: string) => { 
    if (formData.timeSlots.length > 1) {
      setFormData(prev => ({ ...prev, timeSlots: prev.timeSlots.filter(slot => slot.id !== id) }));
    }
  };

  const handleBlur = (field: string, slotId?: string, subField?: string) => {
    if (slotId && subField) {
      setTouched(prev => ({ ...prev, [`slot_${slotId}_${subField}`]: true }));
      // Validate on blur
      if (subField === 'date' && !formData.timeSlots.find(s => s.id === slotId)?.date) {
        setErrors(prev => ({ ...prev, [`slot_${slotId}_date`]: 'Date is required' }));
      }
      if (subField === 'startTime' && !formData.timeSlots.find(s => s.id === slotId)?.startTime) {
        setErrors(prev => ({ ...prev, [`slot_${slotId}_startTime`]: 'Start time is required' }));
      }
      if (subField === 'endTime' && !formData.timeSlots.find(s => s.id === slotId)?.endTime) {
        setErrors(prev => ({ ...prev, [`slot_${slotId}_endTime`]: 'End time is required' }));
      }
    } else {
      setTouched(prev => ({ ...prev, [field]: true }));
    }
  };

  // Validation functions
  const isStep1Valid = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Event name is required';
    if (!formData.organizer) newErrors.organizer = 'Organizer is required';
    if (!formData.hall) newErrors.hall = 'Venue is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.contactEmail) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Invalid email format';
    }
    if (!formData.contactPhone) newErrors.contactPhone = 'Contact phone is required';
    
    formData.seatCategories.forEach(cat => {
      if (cat.price <= 0) newErrors[`seat_${cat.id}_price`] = 'Price must be greater than 0';
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isStep2Valid = () => {
    const newErrors: Record<string, string> = {};
    formData.timeSlots.forEach((slot) => {
      if (!slot.date) newErrors[`slot_${slot.id}_date`] = 'Date is required';
      if (!slot.startTime) newErrors[`slot_${slot.id}_startTime`] = 'Start time is required';
      if (!slot.endTime) newErrors[`slot_${slot.id}_endTime`] = 'End time is required';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isStep3Valid = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.description) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;
    
    if (currentStep === 1) {
      isValid = isStep1Valid();
      setTouched(prev => ({ ...prev, name: true, organizer: true, hall: true, category: true, contactEmail: true, contactPhone: true }));
    } else if (currentStep === 2) {
      isValid = isStep2Valid();
      formData.timeSlots.forEach(slot => {
        setTouched(prev => ({ ...prev, [`slot_${slot.id}_date`]: true, [`slot_${slot.id}_startTime`]: true, [`slot_${slot.id}_endTime`]: true }));
      });
    } else if (currentStep === 3) {
      isValid = isStep3Valid();
      setTouched(prev => ({ ...prev, description: true }));
    }
    
    if (isValid) {
      setCurrentStep(prev => prev + 1);
      setErrors({});
      // Only scroll to top on step change, not on every input change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = () => {
    if (isStep3Valid()) {
      onSubmit(formData, uploadedImage);
    }
  };

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header - Deep Teal */}
         <div className="bg-deepTeal px-6 py-5 shrink-0">         
            <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Create New Event</h2>
                <p className="text-white/80 text-sm">Fill in the event information below</p>
              </div>
            </div>
            <button onClick={onCancel} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-white/70 mb-2">
              <span>Event Info</span>
              <span>Schedule</span>
              <span>Media</span>
              <span>Review</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="px-6 pt-4 pb-2 bg-gray-50 flex justify-between border-b">
          {[
            { step: 1, title: 'Event Information', icon: FileSignature },
            { step: 2, title: 'Schedule', icon: Clock },
            { step: 3, title: 'Media & Description', icon: Image },
            { step: 4, title: 'Review', icon: CheckCircle }
          ].map(item => (
            <div 
              key={item.step} 
              className={`flex-1 text-center py-2 rounded-lg transition-all ${currentStep === item.step ? 'bg-teal-100 text-teal-700 font-medium shadow-sm' : currentStep > item.step ? 'text-green-600' : 'text-gray-500'}`}
            >
              <div className="flex items-center justify-center gap-2">
                {currentStep > item.step ? <CheckCircle className="h-4 w-4" /> : <item.icon className="h-4 w-4" />}
                <span className="text-sm">{item.title}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Event Information */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Name *</label>
                  <input 
                    type="text" 
                    placeholder="Enter event name" 
                    className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none ${errors.name && touched.name ? 'border-red-500' : 'border-gray-200'}`} 
                    value={formData.name} 
                    onBlur={() => handleBlur('name')}
                    onChange={e => { setFormData({...formData, name: e.target.value}); if (errors.name) setErrors(prev => ({...prev, name: ''})); }} 
                  />
                  {errors.name && touched.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organizer *</label>
                  <input 
                    type="text" 
                    placeholder="Enter organizer name" 
                    className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none ${errors.organizer && touched.organizer ? 'border-red-500' : 'border-gray-200'}`} 
                    value={formData.organizer} 
                    onBlur={() => handleBlur('organizer')}
                    onChange={e => { setFormData({...formData, organizer: e.target.value}); if (errors.organizer) setErrors(prev => ({...prev, organizer: ''})); }} 
                  />
                  {errors.organizer && touched.organizer && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.organizer}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select 
                    className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none ${errors.category && touched.category ? 'border-red-500' : 'border-gray-200'}`} 
                    value={formData.category} 
                    onBlur={() => handleBlur('category')}
                    onChange={e => { setFormData({...formData, category: e.target.value}); if (errors.category) setErrors(prev => ({...prev, category: ''})); }}
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                  {errors.category && touched.category && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.category}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age Restriction</label>
                  <select 
                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                    value={formData.ageRestriction} 
                    onChange={e => setFormData({...formData, ageRestriction: e.target.value})}
                  >
                    <option value="">All Ages</option>
                    <option value="12+">12+</option>
                    <option value="16+">16+</option>
                    <option value="18+">18+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Venue *</label>
                <select 
                  className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none ${errors.hall && touched.hall ? 'border-red-500' : 'border-gray-200'}`} 
                  value={formData.hall} 
                  onBlur={() => handleBlur('hall')}
                  onChange={e => { setFormData({...formData, hall: e.target.value, seatCategories: getSeatTypes(e.target.value)}); if (errors.hall) setErrors(prev => ({...prev, hall: ''})); }}
                >
                  <option value="">Select Hall</option>
                  {halls.map(h => <option key={h.id} value={h.id}>{h.name} (Capacity: {h.capacity})</option>)}
                </select>
                {errors.hall && touched.hall && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.hall}</p>}
              </div>

              {formData.seatCategories.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-800"><Layers className="h-4 w-4 text-teal-600" /> Seat Types & Pricing</h3>
                  {formData.seatCategories.map(cat => (
                    <div key={cat.id} className="grid grid-cols-4 gap-3 p-3 bg-gray-50 rounded-lg mb-3">
                      <div><label className="text-xs text-gray-500">Seat Type</label><div className="p-2 bg-gray-200 rounded">{cat.name}</div></div>
                      <div><label className="text-xs text-gray-500">Capacity</label><div className="p-2 bg-gray-200 rounded">{cat.capacity}</div></div>
                      <div>
                        <label className="text-xs text-gray-500">Price (ETB) *</label>
                        <input type="number" min="1" className="w-full p-2 border rounded" value={cat.price || ''} onChange={e => updateSeatField(cat.id, 'price', parseInt(e.target.value) || 0)} />
                        {errors[`seat_${cat.id}_price`] && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors[`seat_${cat.id}_price`]}</p>}
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Commission (%)</label>
                        <input type="number" min="0" max="100" className="w-full p-2 border rounded" value={cat.commissionPercent} onChange={e => updateSeatField(cat.id, 'commissionPercent', parseInt(e.target.value) || 0)} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email *</label>
                  <input type="email" className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none ${errors.contactEmail && touched.contactEmail ? 'border-red-500' : 'border-gray-200'}`} value={formData.contactEmail} onBlur={() => handleBlur('contactEmail')} onChange={e => { setFormData({...formData, contactEmail: e.target.value}); if (errors.contactEmail) setErrors(prev => ({...prev, contactEmail: ''})); }} />
                  {errors.contactEmail && touched.contactEmail && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.contactEmail}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone *</label>
                  <input type="tel" className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none ${errors.contactPhone && touched.contactPhone ? 'border-red-500' : 'border-gray-200'}`} value={formData.contactPhone} onBlur={() => handleBlur('contactPhone')} onChange={e => { setFormData({...formData, contactPhone: e.target.value}); if (errors.contactPhone) setErrors(prev => ({...prev, contactPhone: ''})); }} />
                  {errors.contactPhone && touched.contactPhone && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.contactPhone}</p>}
                </div>
              </div>

              {/* Contract Fields */}
              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <File className="h-4 w-4 text-teal-600" /> Contract Date
                  </label>
                  <input 
                    type="date" 
                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                    value={formData.contractDate} 
                    onChange={e => setFormData({...formData, contractDate: e.target.value})} 
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
                    onChange={e => setFormData({...formData, contractReference: e.target.value})} 
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Schedule - Fixed with no scroll on time change */}
          {currentStep === 2 && (
            <div className="space-y-4">
              {formData.timeSlots.map((slot, idx) => (
                <div key={slot.id} className="p-4 border rounded-xl bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-800">Time Slot #{idx + 1}</h4>
                    {formData.timeSlots.length > 1 && <button onClick={() => removeTimeSlot(slot.id)} className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100"><Trash2 className="h-4 w-4 text-red-600" /></button>}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-sm text-gray-600">Date *</label>
                      <input 
                        type="date" 
                        className={`w-full p-2 border rounded focus:ring-2 focus:ring-teal-500 outline-none ${errors[`slot_${slot.id}_date`] && touched[`slot_${slot.id}_date`] ? 'border-red-500' : 'border-gray-200'}`} 
                        value={slot.date} 
                        onBlur={() => handleBlur('', slot.id, 'date')}
                        onChange={e => updateTimeSlot(slot.id, 'date', e.target.value)} 
                      />
                      {errors[`slot_${slot.id}_date`] && touched[`slot_${slot.id}_date`] && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors[`slot_${slot.id}_date`]}</p>}
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Start Time *</label>
                      <input 
                        type="time" 
                        className={`w-full p-2 border rounded focus:ring-2 focus:ring-teal-500 outline-none ${errors[`slot_${slot.id}_startTime`] && touched[`slot_${slot.id}_startTime`] ? 'border-red-500' : 'border-gray-200'}`} 
                        value={slot.startTime} 
                        onBlur={() => handleBlur('', slot.id, 'startTime')}
                        onChange={e => updateTimeSlot(slot.id, 'startTime', e.target.value)} 
                      />
                      {errors[`slot_${slot.id}_startTime`] && touched[`slot_${slot.id}_startTime`] && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors[`slot_${slot.id}_startTime`]}</p>}
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">End Time *</label>
                      <input 
                        type="time" 
                        className={`w-full p-2 border rounded focus:ring-2 focus:ring-teal-500 outline-none ${errors[`slot_${slot.id}_endTime`] && touched[`slot_${slot.id}_endTime`] ? 'border-red-500' : 'border-gray-200'}`} 
                        value={slot.endTime} 
                        onBlur={() => handleBlur('', slot.id, 'endTime')}
                        onChange={e => updateTimeSlot(slot.id, 'endTime', e.target.value)} 
                      />
                      {errors[`slot_${slot.id}_endTime`] && touched[`slot_${slot.id}_endTime`] && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors[`slot_${slot.id}_endTime`]}</p>}
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addTimeSlot} className="w-full py-2 border-2 border-dashed border-teal-300 rounded-lg text-teal-600 hover:bg-teal-50 transition flex items-center justify-center gap-2"><Plus className="h-4 w-4" /> Add Another Time Slot</button>
            </div>
          )}

          {/* Step 3: Media & Description */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Poster</label>
                <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-teal-500 transition-colors">
                  <input type="file" accept="image/*" onChange={e => { const file = e.target.files?.[0]; if (file) { setIsUploading(true); const reader = new FileReader(); reader.onloadend = () => { setUploadedImage(reader.result as string); setIsUploading(false); }; reader.readAsDataURL(file); } }} className="hidden" id="upload" />
                  <label htmlFor="upload" className="cursor-pointer block"><Upload className="h-12 w-12 mx-auto text-gray-400 mb-2" /><p className="text-gray-500">Click to upload event poster</p><p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p></label>
                </div>
                {uploadedImage && <img src={uploadedImage} alt="Preview" className="mt-4 max-h-48 object-cover rounded-lg shadow-md" />}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Description *</label>
                <textarea rows={5} className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none ${errors.description && touched.description ? 'border-red-500' : 'border-gray-200'}`} value={formData.description} onBlur={() => handleBlur('description')} onChange={e => { setFormData({...formData, description: e.target.value}); if (errors.description) setErrors(prev => ({...prev, description: ''})); }} />
                {errors.description && touched.description && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.description}</p>}
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-5 rounded-xl border border-teal-200">
                <h3 className="font-bold text-lg text-teal-800 mb-3"><CheckCircle className="inline mr-2 text-green-600" /> Event Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div><span className="text-gray-500">Name:</span> {formData.name}</div>
                  <div><span className="text-gray-500">Organizer:</span> {formData.organizer}</div>
                  <div><span className="text-gray-500">Venue:</span> {halls.find(h => h.id === formData.hall)?.name}</div>
                  <div><span className="text-gray-500">Category:</span> {categories.find(c => c.value === formData.category)?.label}</div>
                  <div><span className="text-gray-500">Age Restriction:</span> {formData.ageRestriction || 'All Ages'}</div>
                  <div><span className="text-gray-500">Contact:</span> {formData.contactEmail} | {formData.contactPhone}</div>
                  <div><span className="text-gray-500">Contract Date:</span> {formData.contractDate || '—'}</div>
                  <div><span className="text-gray-500">Contract Ref:</span> {formData.contractReference || '—'}</div>
                </div>
              </div>
              <div className="bg-gray-50 p-5 rounded-xl"><h3 className="font-bold text-gray-800 mb-3"><Layers className="inline mr-2 text-teal-600" /> Seat Types</h3><table className="w-full text-sm"><thead className="bg-gray-100"><tr><th className="p-2">Type</th><th className="p-2">Price</th><th className="p-2">Capacity</th><th className="p-2">Commission</th></tr></thead><tbody>{formData.seatCategories.map(cat => (<tr key={cat.id} className="border-t"><td className="p-2">{cat.name}</td><td className="p-2">ETB {cat.price}</td><td className="p-2">{cat.capacity}</td><td className="p-2">{cat.commissionPercent}%</td></tr>))}</tbody></table></div>
              <div className="bg-gray-50 p-5 rounded-xl"><h3 className="font-bold text-gray-800 mb-3"><Clock className="inline mr-2 text-teal-600" /> Schedule</h3>{formData.timeSlots.map((slot, idx) => <div key={slot.id}>Slot {idx + 1}: {slot.date ? new Date(slot.date).toLocaleDateString() : '—'} | {slot.startTime || '—'} - {slot.endTime || '—'}</div>)}</div>
              {formData.description && <div className="bg-gray-50 p-5 rounded-xl"><h3 className="font-bold text-gray-800 mb-2"><FileText className="inline mr-2 text-teal-600" /> Description</h3><p>{formData.description}</p></div>}
              {uploadedImage && <div className="bg-gray-50 p-5 rounded-xl"><h3 className="font-bold text-gray-800 mb-2"><Image className="inline mr-2 text-teal-600" /> Event Poster</h3><img src={uploadedImage} alt="Event" className="max-h-48 rounded-lg shadow" /></div>}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4"><AlertCircle className="inline mr-2 h-4 w-4 text-yellow-600" /> Please verify all information before submitting.</div>
            </div>
          )}
        </div>

        {/* Footer with Navigation Buttons */}
        <div className="border-t p-5 bg-gray-50 flex justify-between shrink-0">
          {currentStep > 1 && (
            <ReusableButton onClick={handleBack} variant="secondary" icon={ChevronLeft}>Back</ReusableButton>
          )}
          {currentStep < 4 ? (
            <ReusableButton onClick={handleNext} variant="primary" icon={ChevronRight} className={currentStep === 1 ? "w-full" : "ml-auto"}>Continue</ReusableButton>
          ) : (
            <ReusableButton onClick={handleSubmit} variant="success" disabled={isUploading} icon={isUploading ? Loader : CheckCircle} className="ml-auto">
              {isUploading ? 'Creating...' : 'Create Event'}
            </ReusableButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateEventForm;