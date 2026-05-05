// src/components/EventForm/Schedule/UpdateSchedule.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Calendar, Clock, MapPin, X, Save, AlertCircle, CheckCircle,
    ChevronRight, ChevronLeft, Plus, Trash2, Layers, Coins,
    Mail, Phone, Upload, Loader, FileText, Image
} from 'lucide-react';
import ReusableButton from '../../Reusable/ReusableButton';
import SuccessPopup from '../../Reusable/SuccessPopup';

// Halls data
const halls = [
    { id: 'grand-hall', name: 'Grand Hall', capacity: 300, seatTypes: ['VIP', 'Premium', 'Regular'] },
    { id: 'main-hall', name: 'Main Hall', capacity: 240, seatTypes: ['VIP', 'Premium', 'Regular'] },
    { id: 'west-hall', name: 'West Hall', capacity: 200, seatTypes: ['VIP', 'Premium', 'Regular'] },
];

// Categories
const categories = [
    { value: 'concert', label: 'Concert' },
    { value: 'theater', label: 'Theater' },
    { value: 'movie', label: 'Movie' },
];

// Age restrictions
const ageRestrictions = [
    { value: '', label: 'All Ages' },
    { value: '12+', label: '12+' },
    { value: '16+', label: '16+' },
    { value: '18+', label: '18+' },
];

const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

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

interface Show {
    id: string;
    name: string;
    description?: string;
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
    sales: number;
    capacity: number;
    revenue: number;
    status: string;
}

interface UpdateScheduleProps {
    eventId: string;
    onUpdate?: (updatedEvent: Show) => void;
    onCancel?: () => void;
}

const UpdateSchedule: React.FC<UpdateScheduleProps> = ({ eventId, onUpdate, onCancel }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
        organizer: '',
        hall: '',
        category: '',
        ageRestriction: '',
        contactEmail: '',
        contactPhone: '',
        website: '',
        timeSlots: [] as TimeSlot[],
        seatCategories: [] as SeatCategory[]
    });

    // Mock function to fetch event by ID
    useEffect(() => {
        // Simulate API call to fetch event data
        const fetchEvent = () => {
            setLoading(true);
            setTimeout(() => {
                // Mock event data - in real app, fetch from API
                const mockEvent = {
                    id: eventId,
                    name: 'The Lion King',
                    description: 'Experience the magic of Disney\'s The Lion King on stage.',
                    organizer: 'Disney Theatrical',
                    hall: 'grand-hall',
                    category: 'theater',
                    ageRestriction: '',
                    contactEmail: 'events@theaterhub.com',
                    contactPhone: '+251 911 234 567',
                    website: 'https://theaterhub.com',
                    timeSlots: [{ id: 'ts1', date: '2024-05-15', startTime: '19:00', endTime: '21:30' }],
                    seatCategories: [
                        { id: 'sc1', name: 'VIP', price: 1250, capacity: 50, commissionPercent: 10 },
                        { id: 'sc2', name: 'Premium', price: 900, capacity: 100, commissionPercent: 10 },
                        { id: 'sc3', name: 'Regular', price: 500, capacity: 150, commissionPercent: 10 }
                    ]
                };
                setFormData(mockEvent);
                setLoading(false);
            }, 500);
        };
        fetchEvent();
    }, [eventId]);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const updateSeatField = (id: string, field: 'price' | 'commissionPercent', value: number) => {
        if (value < 0) value = 0;
        if (field === 'commissionPercent' && value > 100) value = 100;
        setFormData(prev => ({
            ...prev,
            seatCategories: prev.seatCategories.map(cat =>
                cat.id === id ? { ...cat, [field]: value } : cat
            )
        }));
    };

    const addTimeSlot = () => {
        setFormData(prev => ({
            ...prev,
            timeSlots: [...prev.timeSlots, { id: generateId(), date: '', startTime: '', endTime: '' }]
        }));
    };

    const updateTimeSlot = (id: string, field: keyof TimeSlot, value: string) => {
        setFormData(prev => ({
            ...prev,
            timeSlots: prev.timeSlots.map(slot =>
                slot.id === id ? { ...slot, [field]: value } : slot
            )
        }));
    };

    const removeTimeSlot = (id: string) => {
        if (formData.timeSlots.length > 1) {
            setFormData(prev => ({
                ...prev,
                timeSlots: prev.timeSlots.filter(slot => slot.id !== id)
            }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name) newErrors.name = 'Event name required';
        if (!formData.organizer) newErrors.organizer = 'Organizer required';
        if (!formData.hall) newErrors.hall = 'Venue required';
        if (!formData.category) newErrors.category = 'Category required';
        if (!formData.contactEmail) newErrors.contactEmail = 'Email required';
        else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) newErrors.contactEmail = 'Invalid email';
        if (!formData.contactPhone) newErrors.contactPhone = 'Phone required';
        formData.seatCategories.forEach(cat => {
            if (cat.price <= 0) newErrors[`seat_${cat.id}_price`] = 'Price > 0';
        });
        formData.timeSlots.forEach((slot) => {
            if (!slot.date) newErrors[`slot_${slot.id}_date`] = 'Date required';
            if (!slot.startTime) newErrors[`slot_${slot.id}_startTime`] = 'Start time required';
            if (!slot.endTime) newErrors[`slot_${slot.id}_endTime`] = 'End time required';
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            setSaving(true);
            setTimeout(() => {
                const totalCapacity = formData.seatCategories.reduce((sum, cat) => sum + cat.capacity, 0);
                const updatedEvent: Show = {
                    id: formData.id,
                    name: formData.name,
                    description: formData.description,
                    organizer: formData.organizer,
                    hall: halls.find(h => h.id === formData.hall)?.name || formData.hall,
                    category: formData.category,
                    ageRestriction: formData.ageRestriction,
                    contactEmail: formData.contactEmail,
                    contactPhone: formData.contactPhone,
                    website: formData.website,
                    timeSlots: formData.timeSlots,
                    seatCategories: formData.seatCategories,
                    imageUrl: uploadedImage || undefined,
                    sales: 0,
                    capacity: totalCapacity,
                    revenue: 0,
                    status: 'upcoming'
                };
                
                setSuccessMessage(`✏️ Event "${updatedEvent.name}" updated!`);
                setShowSuccessPopup(true);
                
                if (onUpdate) onUpdate(updatedEvent);
                
                setSaving(false);
                setTimeout(() => {
                    setShowSuccessPopup(false);
                    if (onCancel) onCancel();
                    else navigate('/owner/events');
                }, 2000);
            }, 500);
        }
    };

    const handleCancel = () => {
        if (onCancel) onCancel();
        else navigate('/owner/events');
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.size <= 5 * 1024 * 1024) {
            const reader = new FileReader();
            reader.onloadend = () => setUploadedImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-8 flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600"></div>
                    <span>Loading event data...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4 shrink-0">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-white" />
                            <h2 className="text-xl font-bold text-white">Update Event</h2>
                        </div>
                        <button onClick={handleCancel} className="p-2 hover:bg-white/20 rounded-lg">
                            <X className="h-5 w-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Event Name *</label>
                            <input type="text" className={`w-full p-2 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-200'}`} value={formData.name} onChange={e => handleChange('name', e.target.value)} />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Organizer *</label>
                            <input type="text" className={`w-full p-2 border rounded-lg ${errors.organizer ? 'border-red-500' : 'border-gray-200'}`} value={formData.organizer} onChange={e => handleChange('organizer', e.target.value)} />
                            {errors.organizer && <p className="text-red-500 text-xs mt-1">{errors.organizer}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Category *</label>
                            <select className={`w-full p-2 border rounded-lg ${errors.category ? 'border-red-500' : 'border-gray-200'}`} value={formData.category} onChange={e => handleChange('category', e.target.value)}>
                                <option value="">Select</option>
                                {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                            </select>
                            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Age Restriction</label>
                            <select className="w-full p-2 border rounded-lg" value={formData.ageRestriction} onChange={e => handleChange('ageRestriction', e.target.value)}>
                                {ageRestrictions.map(ar => <option key={ar.value} value={ar.value}>{ar.label}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Venue *</label>
                        <select className={`w-full p-2 border rounded-lg ${errors.hall ? 'border-red-500' : 'border-gray-200'}`} value={formData.hall} onChange={e => handleChange('hall', e.target.value)}>
                            <option value="">Select Hall</option>
                            {halls.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                        </select>
                        {errors.hall && <p className="text-red-500 text-xs mt-1">{errors.hall}</p>}
                    </div>

                    {/* Seat Categories */}
                    {formData.seatCategories.map(cat => (
                        <div key={cat.id} className="grid grid-cols-4 gap-3 p-3 bg-gray-50 rounded-lg">
                            <div><div className="p-2 bg-gray-200 rounded text-sm">{cat.name}</div></div>
                            <div><div className="p-2 bg-gray-200 rounded text-sm">{Math.round(cat.capacity)}</div></div>
                            <div><input type="number" placeholder="Price" className="w-full p-2 border rounded" value={cat.price} onChange={e => updateSeatField(cat.id, 'price', parseFloat(e.target.value) || 0)} /></div>
                            <div><input type="number" placeholder="Commission %" className="w-full p-2 border rounded" value={cat.commissionPercent} onChange={e => updateSeatField(cat.id, 'commissionPercent', parseFloat(e.target.value) || 0)} /></div>
                        </div>
                    ))}

                    {/* Time Slots */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium">Time Slots *</label>
                            <ReusableButton onClick={addTimeSlot} size="sm" icon={Plus}>Add Time Slot</ReusableButton>
                        </div>
                        {formData.timeSlots.map((slot, idx) => (
                            <div key={slot.id} className="p-3 border rounded-lg bg-gray-50">
                                <div className="flex justify-between mb-2">
                                    <span className="font-medium">Slot {idx + 1}</span>
                                    {formData.timeSlots.length > 1 && <button onClick={() => removeTimeSlot(slot.id)} className="text-red-500"><Trash2 size={16} /></button>}
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <input type="date" className="p-2 border rounded" value={slot.date} onChange={e => updateTimeSlot(slot.id, 'date', e.target.value)} />
                                    <input type="time" className="p-2 border rounded" value={slot.startTime} onChange={e => updateTimeSlot(slot.id, 'startTime', e.target.value)} />
                                    <input type="time" className="p-2 border rounded" value={slot.endTime} onChange={e => updateTimeSlot(slot.id, 'endTime', e.target.value)} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Email *</label>
                            <input type="email" className={`w-full p-2 border rounded-lg ${errors.contactEmail ? 'border-red-500' : 'border-gray-200'}`} value={formData.contactEmail} onChange={e => handleChange('contactEmail', e.target.value)} />
                            {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Phone *</label>
                            <input type="tel" className={`w-full p-2 border rounded-lg ${errors.contactPhone ? 'border-red-500' : 'border-gray-200'}`} value={formData.contactPhone} onChange={e => handleChange('contactPhone', e.target.value)} />
                            {errors.contactPhone && <p className="text-red-500 text-xs mt-1">{errors.contactPhone}</p>}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea rows={4} className="w-full p-2 border rounded-lg" value={formData.description} onChange={e => handleChange('description', e.target.value)} />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Event Poster</label>
                        <div className="border-2 border-dashed rounded-xl p-4 text-center">
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="upload-update" />
                            <label htmlFor="upload-update" className="cursor-pointer block">
                                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">Upload Image</p>
                            </label>
                        </div>
                        {uploadedImage && <img src={uploadedImage} alt="Preview" className="mt-2 max-h-32 rounded" />}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t p-4 bg-gray-50 flex justify-end gap-3 shrink-0">
                    <ReusableButton onClick={handleCancel} variant="secondary">Cancel</ReusableButton>
                    <ReusableButton onClick={handleSubmit} variant="success" disabled={saving} loading={saving} icon={Save}>Update Event</ReusableButton>
                </div>
            </motion.div>

            <SuccessPopup isOpen={showSuccessPopup} onClose={() => setShowSuccessPopup(false)} type="success" title="Success" message={successMessage} duration={3000} position="top-right" />
        </div>
    );
};

export default UpdateSchedule;