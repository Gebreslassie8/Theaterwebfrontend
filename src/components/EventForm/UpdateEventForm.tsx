// src/pages/Owner/events/UpdateEventForm.tsx
import React, { useState, useEffect } from 'react';
import { X, Save, Layers, AlertCircle, Calendar, Clock, FileText, Image, Copy, File, User, Mail, Phone, Tag } from 'lucide-react';
import ReusableButton from '../Reusable/ReusableButton';
import { EventData, FormData, halls, categories } from './types';

interface UpdateEventFormProps {
  event: EventData;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

const UpdateEventForm: React.FC<UpdateEventFormProps> = ({ event, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '', description: '', timeSlots: [], hall: '', seatCategories: [],
    category: '', ageRestriction: '', contactEmail: '', contactPhone: '', website: '',
    organizer: '', contractDate: '', contractReference: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const hallObj = halls.find(h => h.name === event.hall);
    setFormData({
      name: event.name, description: event.description || '',
      timeSlots: event.timeSlots.map(slot => ({ ...slot, id: slot.id || `slot-${Date.now()}-${Math.random()}` })),
      hall: hallObj?.id || '',
      seatCategories: event.seatCategories.map(cat => ({ ...cat })),
      category: event.category, ageRestriction: event.ageRestriction,
      contactEmail: event.contactEmail, contactPhone: event.contactPhone, website: event.website || '',
      organizer: event.organizer,
      contractDate: event.contractDate || '',
      contractReference: event.contractReference || ''
    });
  }, [event]);

  const updateSeatField = (id: string, field: 'price' | 'commissionPercent', value: number) => {
    if (value < 0) value = 0;
    if (field === 'commissionPercent' && value > 100) value = 100;
    setFormData(prev => ({ ...prev, seatCategories: prev.seatCategories.map(cat => cat.id === id ? { ...cat, [field]: value } : cat) }));
    if (field === 'price' && value > 0) {
      setErrors(prev => ({ ...prev, [`seat_${id}_price`]: '' }));
    }
  };

  const updateTimeSlot = (id: string, field: string, value: string) => {
    setFormData(prev => ({ ...prev, timeSlots: prev.timeSlots.map(slot => slot.id === id ? { ...slot, [field]: value } : slot) }));
    if (value && errors[`slot_${id}_${field}`]) {
      setErrors(prev => ({ ...prev, [`slot_${id}_${field}`]: '' }));
    }
  };

  const handleBlur = (field: string, slotId?: string, subField?: string) => {
    if (slotId && subField) {
      setTouched(prev => ({ ...prev, [`slot_${slotId}_${subField}`]: true }));
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

  const validateForm = () => {
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
    if (!formData.description) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }
    
    formData.seatCategories.forEach(cat => {
      if (cat.price <= 0) newErrors[`seat_${cat.id}_price`] = 'Price must be greater than 0';
    });
    
    formData.timeSlots.forEach((slot) => {
      if (!slot.date) newErrors[`slot_${slot.id}_date`] = 'Date is required';
      if (!slot.startTime) newErrors[`slot_${slot.id}_startTime`] = 'Start time is required';
      if (!slot.endTime) newErrors[`slot_${slot.id}_endTime`] = 'End time is required';
    });
    
    setErrors(newErrors);
    
    // Mark all fields as touched to show errors
    setTouched(prev => ({ ...prev, name: true, organizer: true, hall: true, category: true, contactEmail: true, contactPhone: true, description: true }));
    formData.timeSlots.forEach(slot => {
      setTouched(prev => ({ ...prev, [`slot_${slot.id}_date`]: true, [`slot_${slot.id}_startTime`]: true, [`slot_${slot.id}_endTime`]: true }));
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
        {/* Header - Deep Teal (matching CreateEventForm) */}
         <div className="bg-deepTeal px-6 py-5 shrink-0">         
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
            <button onClick={onCancel} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Name *</label>
              <input 
                type="text" 
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
              onChange={e => { setFormData({...formData, hall: e.target.value}); if (errors.hall) setErrors(prev => ({...prev, hall: ''})); }}
            >
              <option value="">Select Hall</option>
              {halls.map(h => <option key={h.id} value={h.id}>{h.name} (Capacity: {h.capacity})</option>)}
            </select>
            {errors.hall && touched.hall && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.hall}</p>}
          </div>

          {/* Seat Types & Pricing */}
          {formData.seatCategories.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-800"><Layers className="h-4 w-4 text-teal-600" /> Seat Types & Pricing</h3>
              {formData.seatCategories.map(cat => (
                <div key={cat.id} className="grid grid-cols-4 gap-3 p-3 bg-gray-50 rounded-lg mb-3">
                  <div><label className="text-xs text-gray-500">Seat Type</label><div className="p-2 bg-gray-200 rounded font-medium text-sm">{cat.name}</div></div>
                  <div><label className="text-xs text-gray-500">Capacity</label><div className="p-2 bg-gray-200 rounded text-sm">{cat.capacity}</div></div>
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

          {/* Contact Information */}
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

          {/* Time Slots */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-800"><Clock className="h-4 w-4 text-teal-600" /> Time Slots</h3>
            {formData.timeSlots.map((slot) => (
              <div key={slot.id} className="grid grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg mb-3">
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
            ))}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Description *</label>
            <textarea 
              rows={5} 
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none ${errors.description && touched.description ? 'border-red-500' : 'border-gray-200'}`} 
              value={formData.description} 
              onBlur={() => handleBlur('description')}
              onChange={e => { setFormData({...formData, description: e.target.value}); if (errors.description) setErrors(prev => ({...prev, description: ''})); }} 
            />
            {errors.description && touched.description && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.description}</p>}
          </div>

          {/* Info Alert */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <AlertCircle className="inline mr-2 h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">Please verify all information before updating.</span>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="border-t p-5 bg-gray-50 flex justify-end gap-3 shrink-0">
          <ReusableButton onClick={onCancel} variant="secondary">Cancel</ReusableButton>
          <ReusableButton onClick={handleSubmit} variant="success" icon={Save}>Update Event</ReusableButton>
        </div>
      </div>
    </div>
  );
};

export default UpdateEventForm;