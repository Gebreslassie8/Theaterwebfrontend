// src/pages/Admin/settings/SystemSettings.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    Settings, Building, CreditCard, Ticket, Calendar,
    DollarSign, Percent, Clock, Save, RefreshCw,
    Globe, Mail, Phone, MapPin, Users, Award,
    AlertCircle, CheckCircle, Eye, EyeOff, Plus,
    Trash2, Edit, X, ChevronDown, TrendingUp,
    Star, Gift, Zap, Image, UploadCloud, FileImage, Camera, Loader2
} from 'lucide-react';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';

// Types
interface BusinessProfile {
    businessName: string;
    businessEmail: string;
    businessPhone: string;
    businessAddress: string;
    businessLogo: string;
    businessLogoUrl?: string;
    taxId: string;
    registrationNumber: string;
    website: string;
    description: string;
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
    youtube: string;
    telegram: string;
    tiktok: string;
    primaryColor?: string;
    secondaryColor?: string;
    footerText?: string;
    copyrightText?: string;
}

interface TicketType {
    id: string;
    name: string;
    code: 'vip' | 'standard' | 'balcony';
    commissionRate: number;
    serviceCharge: number;
    description: string;
    isActive: boolean;
    color: string;
}

interface PeriodicRental {
    id: string;
    name: string;
    durationMonths: number;
    discountRate: number;
    serviceCharge: number;
    description: string;
    isActive: boolean;
    popular?: boolean;
    savings?: number;
}

// Default data
const defaultBusinessProfile: BusinessProfile = {
    businessName: 'Theatre Hub Ethiopia',
    businessEmail: 'info@theatrehub.com',
    businessPhone: '+251 911 234 567',
    businessAddress: 'Bole Road, Addis Ababa, Ethiopia',
    businessLogo: '',
    businessLogoUrl: '',
    taxId: 'TAX-123456789',
    registrationNumber: 'REG-987654321',
    website: 'www.theatrehub.com',
    description: 'Premier online ticket booking platform for theaters across Ethiopia',
    facebook: 'https://facebook.com/theatrehub',
    instagram: 'https://instagram.com/theatrehub',
    twitter: 'https://twitter.com/theatrehub',
    linkedin: 'https://linkedin.com/company/theatrehub',
    youtube: 'https://youtube.com/theatrehub',
    telegram: 'https://t.me/theatrehub',
    tiktok: 'https://tiktok.com/@theatrehub',
    primaryColor: '#0D9488',
    secondaryColor: '#14B8A6',
    footerText: 'Experience the magic of live theater',
    copyrightText: '© 2024 Theatre Hub Ethiopia. All rights reserved.'
};

const defaultTicketTypes: TicketType[] = [
    {
        id: '1',
        name: 'VIP',
        code: 'vip',
        commissionRate: 10,
        serviceCharge: 150,
        description: 'Premium seating with exclusive benefits',
        isActive: true,
        color: 'from-yellow-500 to-amber-600'
    },
    {
        id: '2',
        name: 'Standard',
        code: 'standard',
        commissionRate: 8,
        serviceCharge: 100,
        description: 'Regular comfortable seating',
        isActive: true,
        color: 'from-blue-500 to-cyan-600'
    },
    {
        id: '3',
        name: 'Balcony',
        code: 'balcony',
        commissionRate: 6,
        serviceCharge: 80,
        description: 'Upper level seating with great view',
        isActive: true,
        color: 'from-purple-500 to-pink-600'
    }
];

const defaultPeriodicRentals: PeriodicRental[] = [
    {
        id: '1',
        name: 'Monthly',
        durationMonths: 1,
        discountRate: 0,
        serviceCharge: 500,
        description: '1 month rental period',
        isActive: true
    },
    {
        id: '2',
        name: '3 Months',
        durationMonths: 3,
        discountRate: 5,
        serviceCharge: 1425,
        description: 'Save 5% with quarterly rental',
        isActive: true,
        popular: true,
        savings: 75
    },
    {
        id: '3',
        name: '6 Months',
        durationMonths: 6,
        discountRate: 10,
        serviceCharge: 2700,
        description: 'Save 10% with half-year rental',
        isActive: true,
        savings: 300
    },
    {
        id: '4',
        name: 'Yearly',
        durationMonths: 12,
        discountRate: 15,
        serviceCharge: 5100,
        description: 'Save 15% with annual rental',
        isActive: true,
        savings: 900
    }
];

type TabType = 'business' | 'ticket' | 'rental';

const SystemSettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('business');
    const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(defaultBusinessProfile);
    const [ticketTypes, setTicketTypes] = useState<TicketType[]>(defaultTicketTypes);
    const [periodicRentals, setPeriodicRentals] = useState<PeriodicRental[]>(defaultPeriodicRentals);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });
    const [editingTicket, setEditingTicket] = useState<TicketType | null>(null);
    const [editingRental, setEditingRental] = useState<PeriodicRental | null>(null);
    const [showTicketModal, setShowTicketModal] = useState(false);
    const [showRentalModal, setShowRentalModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ type: 'ticket' | 'rental'; id: string } | null>(null);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [previewLogo, setPreviewLogo] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const formatCurrency = (amount: number) => `ETB ${amount.toLocaleString()}`;

    // Handle logo upload
    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setPopupMessage({
                    title: 'Invalid File',
                    message: 'Please upload an image file (PNG, JPG, JPEG, GIF)',
                    type: 'error'
                });
                setShowSuccessPopup(true);
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                setPopupMessage({
                    title: 'File Too Large',
                    message: 'Logo size should be less than 2MB',
                    type: 'error'
                });
                setShowSuccessPopup(true);
                return;
            }

            setUploadingLogo(true);

            setTimeout(() => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result as string;
                    setBusinessProfile({
                        ...businessProfile,
                        businessLogo: base64String,
                        businessLogoUrl: URL.createObjectURL(file)
                    });
                    setPreviewLogo(base64String);
                    setUploadingLogo(false);
                    
                    setPopupMessage({
                        title: 'Logo Uploaded',
                        message: 'Theater logo has been updated successfully',
                        type: 'success'
                    });
                    setShowSuccessPopup(true);
                };
                reader.readAsDataURL(file);
            }, 500);
        }
    };

    const handleRemoveLogo = () => {
        setBusinessProfile({
            ...businessProfile,
            businessLogo: '',
            businessLogoUrl: ''
        });
        setPreviewLogo(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setPopupMessage({
            title: 'Logo Removed',
            message: 'Theater logo has been removed',
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    const handleSaveSettings = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const settingsData = {
            businessProfile,
            ticketTypes,
            periodicRentals,
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem('system_settings', JSON.stringify(settingsData));
        
        setPopupMessage({
            title: 'Settings Saved!',
            message: 'All system settings have been updated successfully.',
            type: 'success'
        });
        setShowSuccessPopup(true);
        setIsLoading(false);
    };

    const handleResetSettings = () => {
        setBusinessProfile(defaultBusinessProfile);
        setTicketTypes(defaultTicketTypes);
        setPeriodicRentals(defaultPeriodicRentals);
        setPreviewLogo(null);
        setPopupMessage({
            title: 'Settings Reset',
            message: 'All settings have been restored to default values.',
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    // Ticket Type CRUD
    const handleAddTicket = (ticket: Omit<TicketType, 'id'>) => {
        const newTicket: TicketType = {
            ...ticket,
            id: Date.now().toString()
        };
        setTicketTypes([...ticketTypes, newTicket]);
        setShowTicketModal(false);
        setPopupMessage({
            title: 'Ticket Type Added',
            message: `${ticket.name} ticket type has been added successfully.`,
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    const handleUpdateTicket = (ticket: TicketType) => {
        setTicketTypes(ticketTypes.map(t => t.id === ticket.id ? ticket : t));
        setEditingTicket(null);
        setShowTicketModal(false);
        setPopupMessage({
            title: 'Ticket Type Updated',
            message: `${ticket.name} ticket type has been updated successfully.`,
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    const handleDeleteTicket = (id: string) => {
        setTicketTypes(ticketTypes.filter(t => t.id !== id));
        setShowDeleteConfirm(null);
        setPopupMessage({
            title: 'Ticket Type Deleted',
            message: 'Ticket type has been removed successfully.',
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    // Periodic Rental CRUD
    const handleAddRental = (rental: Omit<PeriodicRental, 'id' | 'savings'>) => {
        const basePrice = 500 * rental.durationMonths;
        const discountAmount = (basePrice * rental.discountRate) / 100;
        const serviceCharge = basePrice - discountAmount;
        
        const newRental: PeriodicRental = {
            ...rental,
            id: Date.now().toString(),
            serviceCharge: Math.round(serviceCharge),
            savings: Math.round(basePrice - serviceCharge)
        };
        setPeriodicRentals([...periodicRentals, newRental]);
        setShowRentalModal(false);
        setPopupMessage({
            title: 'Rental Plan Added',
            message: `${rental.name} rental plan has been added successfully.`,
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    const handleUpdateRental = (rental: PeriodicRental) => {
        setPeriodicRentals(periodicRentals.map(r => r.id === rental.id ? rental : r));
        setEditingRental(null);
        setShowRentalModal(false);
        setPopupMessage({
            title: 'Rental Plan Updated',
            message: `${rental.name} rental plan has been updated successfully.`,
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    const handleDeleteRental = (id: string) => {
        setPeriodicRentals(periodicRentals.filter(r => r.id !== id));
        setShowDeleteConfirm(null);
        setPopupMessage({
            title: 'Rental Plan Deleted',
            message: 'Rental plan has been removed successfully.',
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    // Ticket Modal Component
    const TicketModal = () => {
        const [formData, setFormData] = useState<TicketType>(
            editingTicket || {
                id: '',
                name: '',
                code: 'standard',
                commissionRate: 8,
                serviceCharge: 100,
                description: '',
                isActive: true,
                color: 'from-blue-500 to-cyan-600'
            }
        );

        const handleSubmit = () => {
            if (editingTicket) {
                handleUpdateTicket(formData);
            } else {
                handleAddTicket(formData);
            }
        };

        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-2xl max-w-md w-full shadow-xl"
                >
                    <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4 rounded-t-2xl">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Ticket className="h-5 w-5 text-white" />
                                <h2 className="text-xl font-bold text-white">
                                    {editingTicket ? 'Edit Ticket Type' : 'Add Ticket Type'}
                                </h2>
                            </div>
                            <button onClick={() => { setShowTicketModal(false); setEditingTicket(null); }} className="p-1 hover:bg-white/20 rounded-lg">
                                <X className="h-5 w-5 text-white" />
                            </button>
                        </div>
                    </div>

                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                                placeholder="e.g., VIP, Standard, Balcony"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Commission Rate (%)</label>
                            <input
                                type="number"
                                value={formData.commissionRate}
                                onChange={(e) => setFormData({ ...formData, commissionRate: parseFloat(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                                step="0.5"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Service Charge (ETB)</label>
                            <input
                                type="number"
                                value={formData.serviceCharge}
                                onChange={(e) => setFormData({ ...formData, serviceCharge: parseFloat(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={2}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
                                placeholder="Brief description of this ticket type"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 text-teal-600 rounded"
                                />
                                <span className="text-sm text-gray-700">Active</span>
                            </label>
                        </div>
                    </div>

                    <div className="border-t px-6 py-4 flex justify-end gap-3">
                        <button onClick={() => { setShowTicketModal(false); setEditingTicket(null); }} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                        <button onClick={handleSubmit} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Save Ticket Type</button>
                    </div>
                </motion.div>
            </div>
        );
    };

    // Rental Modal Component
    const RentalModal = () => {
        const [formData, setFormData] = useState<PeriodicRental>(
            editingRental || {
                id: '',
                name: '',
                durationMonths: 1,
                discountRate: 0,
                serviceCharge: 500,
                description: '',
                isActive: true,
                popular: false
            }
        );

        const calculateServiceCharge = () => {
            const basePrice = 500 * formData.durationMonths;
            const discountAmount = (basePrice * formData.discountRate) / 100;
            return Math.round(basePrice - discountAmount);
        };

        const handleSubmit = () => {
            const rentalToSave = {
                ...formData,
                serviceCharge: calculateServiceCharge()
            };
            if (editingRental) {
                handleUpdateRental(rentalToSave as PeriodicRental);
            } else {
                handleAddRental(rentalToSave);
            }
        };

        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-2xl max-w-md w-full shadow-xl"
                >
                    <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4 rounded-t-2xl">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-white" />
                                <h2 className="text-xl font-bold text-white">
                                    {editingRental ? 'Edit Rental Plan' : 'Add Rental Plan'}
                                </h2>
                            </div>
                            <button onClick={() => { setShowRentalModal(false); setEditingRental(null); }} className="p-1 hover:bg-white/20 rounded-lg">
                                <X className="h-5 w-5 text-white" />
                            </button>
                        </div>
                    </div>

                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                                placeholder="e.g., Monthly, 3 Months, Yearly"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Months)</label>
                            <input
                                type="number"
                                value={formData.durationMonths}
                                onChange={(e) => setFormData({ ...formData, durationMonths: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                                min="1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Rate (%)</label>
                            <input
                                type="number"
                                value={formData.discountRate}
                                onChange={(e) => setFormData({ ...formData, discountRate: parseFloat(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                                step="0.5"
                            />
                            <p className="text-xs text-gray-500 mt-1">Calculated price: {formatCurrency(calculateServiceCharge())}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={2}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
                                placeholder="Describe this rental plan"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 text-teal-600 rounded"
                                />
                                <span className="text-sm text-gray-700">Active</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.popular}
                                    onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                                    className="w-4 h-4 text-yellow-600 rounded"
                                />
                                <span className="text-sm text-gray-700">Mark as Popular</span>
                            </label>
                        </div>
                    </div>

                    <div className="border-t px-6 py-4 flex justify-end gap-3">
                        <button onClick={() => { setShowRentalModal(false); setEditingRental(null); }} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                        <button onClick={handleSubmit} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Save Rental Plan</button>
                    </div>
                </motion.div>
            </div>
        );
    };

    // Delete Confirm Modal
    const DeleteConfirmModal = () => {
        if (!showDeleteConfirm) return null;
        
        const handleConfirm = () => {
            if (showDeleteConfirm.type === 'ticket') {
                handleDeleteTicket(showDeleteConfirm.id);
            } else {
                handleDeleteRental(showDeleteConfirm.id);
            }
        };

        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-md w-full p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <Trash2 className="h-6 w-6 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Confirm Delete</h3>
                    </div>
                    <p className="text-gray-600 mb-6">
                        Are you sure you want to delete this {showDeleteConfirm.type === 'ticket' ? 'ticket type' : 'rental plan'}? This action cannot be undone.
                    </p>
                    <div className="flex gap-3">
                        <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                        <button onClick={handleConfirm} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 shadow-lg">
                            <Settings className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
                            <p className="text-sm text-gray-500 mt-1">Configure business profile, service charges and rental plans</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
                    <button
                        onClick={() => setActiveTab('business')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                            activeTab === 'business' ? 'bg-white text-teal-600 shadow-md' : 'text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <Building className="h-4 w-4" />
                        Business Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('ticket')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                            activeTab === 'ticket' ? 'bg-white text-teal-600 shadow-md' : 'text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <Ticket className="h-4 w-4" />
                        Service Charge (Per Ticket)
                    </button>
                    <button
                        onClick={() => setActiveTab('rental')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                            activeTab === 'rental' ? 'bg-white text-teal-600 shadow-md' : 'text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <Calendar className="h-4 w-4" />
                        Periodic Rental
                    </button>
                </div>

                {/* Business Profile Tab */}
                {activeTab === 'business' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column - Logo Upload */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Theater Logo</h3>
                                    <div className="bg-gray-50 rounded-2xl p-6 text-center border-2 border-dashed border-gray-200">
                                        {previewLogo || businessProfile.businessLogo ? (
                                            <div className="space-y-4">
                                                <div className="w-40 h-40 mx-auto rounded-2xl overflow-hidden bg-white shadow-md">
                                                    <img 
                                                        src={previewLogo || businessProfile.businessLogo} 
                                                        alt="Theater Logo" 
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex gap-3 justify-center">
                                                    <button
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center gap-2 text-sm"
                                                    >
                                                        <UploadCloud className="h-4 w-4" /> Change Logo
                                                    </button>
                                                    <button
                                                        onClick={handleRemoveLogo}
                                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 text-sm"
                                                    >
                                                        <Trash2 className="h-4 w-4" /> Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="w-40 h-40 mx-auto rounded-2xl bg-gray-200 flex items-center justify-center">
                                                    <Building className="h-16 w-16 text-gray-400" />
                                                </div>
                                                <div>
                                                    <button
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center gap-2 mx-auto"
                                                    >
                                                        <UploadCloud className="h-4 w-4" /> Upload Logo
                                                    </button>
                                                    <p className="text-xs text-gray-500 mt-2">PNG, JPG, JPEG, GIF up to 2MB</p>
                                                </div>
                                            </div>
                                        )}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoUpload}
                                            className="hidden"
                                        />
                                        {uploadingLogo && (
                                            <div className="mt-3 flex items-center justify-center gap-2 text-teal-600">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span className="text-sm">Uploading...</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Business Information */}
                            <div className="lg:col-span-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                                                <input 
                                                    type="text" 
                                                    value={businessProfile.businessName} 
                                                    onChange={(e) => setBusinessProfile({ ...businessProfile, businessName: e.target.value })} 
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500" 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                                <input 
                                                    type="email" 
                                                    value={businessProfile.businessEmail} 
                                                    onChange={(e) => setBusinessProfile({ ...businessProfile, businessEmail: e.target.value })} 
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500" 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                                <input 
                                                    type="tel" 
                                                    value={businessProfile.businessPhone} 
                                                    onChange={(e) => setBusinessProfile({ ...businessProfile, businessPhone: e.target.value })} 
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500" 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                                <textarea 
                                                    value={businessProfile.businessAddress} 
                                                    onChange={(e) => setBusinessProfile({ ...businessProfile, businessAddress: e.target.value })} 
                                                    rows={2} 
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500" 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Tax ID</label>
                                                <input 
                                                    type="text" 
                                                    value={businessProfile.taxId} 
                                                    onChange={(e) => setBusinessProfile({ ...businessProfile, taxId: e.target.value })} 
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500" 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                                                <input 
                                                    type="text" 
                                                    value={businessProfile.registrationNumber} 
                                                    onChange={(e) => setBusinessProfile({ ...businessProfile, registrationNumber: e.target.value })} 
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500" 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                                                <input 
                                                    type="url" 
                                                    value={businessProfile.website} 
                                                    onChange={(e) => setBusinessProfile({ ...businessProfile, website: e.target.value })} 
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Branding & Colors</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                                                <div className="flex gap-3 items-center">
                                                    <input 
                                                        type="color" 
                                                        value={businessProfile.primaryColor || '#0D9488'} 
                                                        onChange={(e) => setBusinessProfile({ ...businessProfile, primaryColor: e.target.value })} 
                                                        className="w-12 h-10 rounded border cursor-pointer" 
                                                    />
                                                    <input 
                                                        type="text" 
                                                        value={businessProfile.primaryColor || '#0D9488'} 
                                                        onChange={(e) => setBusinessProfile({ ...businessProfile, primaryColor: e.target.value })} 
                                                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 font-mono"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
                                                <div className="flex gap-3 items-center">
                                                    <input 
                                                        type="color" 
                                                        value={businessProfile.secondaryColor || '#14B8A6'} 
                                                        onChange={(e) => setBusinessProfile({ ...businessProfile, secondaryColor: e.target.value })} 
                                                        className="w-12 h-10 rounded border cursor-pointer" 
                                                    />
                                                    <input 
                                                        type="text" 
                                                        value={businessProfile.secondaryColor || '#14B8A6'} 
                                                        onChange={(e) => setBusinessProfile({ ...businessProfile, secondaryColor: e.target.value })} 
                                                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 font-mono"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Footer Text</label>
                                                <input 
                                                    type="text" 
                                                    value={businessProfile.footerText || ''} 
                                                    onChange={(e) => setBusinessProfile({ ...businessProfile, footerText: e.target.value })} 
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500" 
                                                    placeholder="Footer tagline"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Copyright Text</label>
                                                <input 
                                                    type="text" 
                                                    value={businessProfile.copyrightText || ''} 
                                                    onChange={(e) => setBusinessProfile({ ...businessProfile, copyrightText: e.target.value })} 
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500" 
                                                    placeholder="© 2024 Your Company"
                                                />
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-4">Social Media Links</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                                                <input type="url" value={businessProfile.facebook} onChange={(e) => setBusinessProfile({ ...businessProfile, facebook: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                                                <input type="url" value={businessProfile.instagram} onChange={(e) => setBusinessProfile({ ...businessProfile, instagram: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                                                <input type="url" value={businessProfile.twitter} onChange={(e) => setBusinessProfile({ ...businessProfile, twitter: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                                                <input type="url" value={businessProfile.linkedin} onChange={(e) => setBusinessProfile({ ...businessProfile, linkedin: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">YouTube</label>
                                                <input type="url" value={businessProfile.youtube} onChange={(e) => setBusinessProfile({ ...businessProfile, youtube: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Telegram</label>
                                                <input type="url" value={businessProfile.telegram} onChange={(e) => setBusinessProfile({ ...businessProfile, telegram: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">TikTok</label>
                                                <input type="url" value={businessProfile.tiktok} onChange={(e) => setBusinessProfile({ ...businessProfile, tiktok: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500" />
                                            </div>
                                        </div>
                                        <div className="mt-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Business Description</label>
                                            <textarea 
                                                value={businessProfile.description} 
                                                onChange={(e) => setBusinessProfile({ ...businessProfile, description: e.target.value })} 
                                                rows={3} 
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Service Charge (Per Ticket) Tab */}
                {activeTab === 'ticket' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Ticket Types & Service Charges</h3>
                                <p className="text-sm text-gray-500">Configure commission rates and service charges for different ticket types</p>
                            </div>
                            <button onClick={() => { setEditingTicket(null); setShowTicketModal(true); }} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2">
                                <Plus className="h-4 w-4" /> Add Ticket Type
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {ticketTypes.map(ticket => (
                                <div key={ticket.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                    <div className={`bg-gradient-to-r ${ticket.color} px-4 py-3`}>
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-lg font-bold text-white">{ticket.name}</h4>
                                            <div className="flex gap-1">
                                                <button onClick={() => { setEditingTicket(ticket); setShowTicketModal(true); }} className="p-1 hover:bg-white/20 rounded-lg transition">
                                                    <Edit className="h-4 w-4 text-white" />
                                                </button>
                                                <button onClick={() => setShowDeleteConfirm({ type: 'ticket', id: ticket.id })} className="p-1 hover:bg-white/20 rounded-lg transition">
                                                    <Trash2 className="h-4 w-4 text-white" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 space-y-3">
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm text-gray-600">Commission Rate</span>
                                            <span className="font-semibold text-gray-900">{ticket.commissionRate}%</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm text-gray-600">Service Charge</span>
                                            <span className="font-semibold text-teal-600">{formatCurrency(ticket.serviceCharge)}</span>
                                        </div>
                                        <div className="py-2">
                                            <span className="text-sm text-gray-600">Description</span>
                                            <p className="text-sm text-gray-500 mt-1">{ticket.description}</p>
                                        </div>
                                        <div className="flex items-center gap-2 pt-2">
                                            <div className={`w-2 h-2 rounded-full ${ticket.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                                            <span className="text-xs text-gray-500">{ticket.isActive ? 'Active' : 'Inactive'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Periodic Rental Tab */}
                {activeTab === 'rental' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Periodic Rental Plans</h3>
                                <p className="text-sm text-gray-500">Configure rental plans with expiration and pricing</p>
                            </div>
                            <button onClick={() => { setEditingRental(null); setShowRentalModal(true); }} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2">
                                <Plus className="h-4 w-4" /> Add Rental Plan
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {periodicRentals.map(rental => (
                                <div key={rental.id} className={`bg-white rounded-2xl shadow-lg border overflow-hidden relative ${rental.popular ? 'ring-2 ring-yellow-400' : 'border-gray-100'}`}>
                                    {rental.popular && (
                                        <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
                                            <Star className="h-3 w-3" /> Popular
                                        </div>
                                    )}
                                    <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-3">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-lg font-bold text-white">{rental.name}</h4>
                                            <div className="flex gap-1">
                                                <button onClick={() => { setEditingRental(rental); setShowRentalModal(true); }} className="p-1 hover:bg-white/20 rounded-lg transition">
                                                    <Edit className="h-4 w-4 text-white" />
                                                </button>
                                                <button onClick={() => setShowDeleteConfirm({ type: 'rental', id: rental.id })} className="p-1 hover:bg-white/20 rounded-lg transition">
                                                    <Trash2 className="h-4 w-4 text-white" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 space-y-3">
                                        <div className="text-center py-2">
                                            <p className="text-3xl font-bold text-teal-600">{formatCurrency(rental.serviceCharge)}</p>
                                            <p className="text-xs text-gray-500">for {rental.durationMonths} month{rental.durationMonths > 1 ? 's' : ''}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center py-2 border-b">
                                                <span className="text-sm text-gray-600">Duration</span>
                                                <span className="font-semibold text-gray-900">{rental.durationMonths} Months</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b">
                                                <span className="text-sm text-gray-600">Discount Rate</span>
                                                <span className="font-semibold text-green-600">{rental.discountRate}% OFF</span>
                                            </div>
                                            {rental.savings && rental.savings > 0 && (
                                                <div className="flex justify-between items-center py-2 border-b">
                                                    <span className="text-sm text-gray-600">You Save</span>
                                                    <span className="font-semibold text-green-600">{formatCurrency(rental.savings)}</span>
                                                </div>
                                            )}
                                            <div className="py-2">
                                                <p className="text-sm text-gray-500">{rental.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 pt-2">
                                            <div className={`w-2 h-2 rounded-full ${rental.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                                            <span className="text-xs text-gray-500">{rental.isActive ? 'Available' : 'Unavailable'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
                    <button onClick={handleResetSettings} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center gap-2">
                        <RefreshCw className="h-4 w-4" /> Reset to Default
                    </button>
                    <button onClick={handleSaveSettings} disabled={isLoading} className="px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center gap-2 disabled:opacity-50">
                        {isLoading ? <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div> Saving...</> : <><Save className="h-4 w-4" /> Save All Settings</>}
                    </button>
                </div>
            </div>

            {/* Modals */}
            {showTicketModal && <TicketModal />}
            {showRentalModal && <RentalModal />}
            {showDeleteConfirm && <DeleteConfirmModal />}

            {/* Success Popup */}
            <SuccessPopup isOpen={showSuccessPopup} onClose={() => setShowSuccessPopup(false)} type={popupMessage.type} title={popupMessage.title} message={popupMessage.message} duration={3000} position="top-right" />
        </div>
    );
};

export default SystemSettings;