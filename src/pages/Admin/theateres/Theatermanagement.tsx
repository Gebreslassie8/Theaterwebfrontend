// src/pages/Admin/theaters/TheaterManagement.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Building, Eye, Edit, RefreshCw, Ban, Phone, Calendar,
    CheckCircle, XCircle, Clock, AlertCircle, Search, TrendingUp,
    Activity, MapPin, Mail, Star, LayoutGrid, UserPlus,
    Users, ArrowRight, Theater, Crown, Shield, UserCheck,
    Check, X, ThumbsUp, ThumbsDown, AlertTriangle, FileText, CreditCard,
    FileWarning, Info, Send, MessageSquare, FileCheck, Trash2,
    Power, PowerOff, RotateCw, PlayCircle, StopCircle
} from 'lucide-react';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';
import AddTheater from './AddTheater';
import UpdateTheater from './UpdateTheater';

interface Theater {
    id: number;
    name: string;
    ownerName: string;
    email: string;
    phone: string;
    location: string;
    status: 'Active' | 'Inactive' | 'Pending' | 'Deleted';
    totalRevenue: number;
    totalBookings: number;
    rating: number;
    joinDate: string;
    lastActive: string;
    screens?: number;
    capacity?: number;
    businessName?: string;
    tradeName?: string;
    businessType?: string;
    businessLicense?: string;
    taxId?: string;
    yearsInOperation?: string;
    businessDescription?: string;
    theaterName?: string;
    theaterEmail?: string;
    theaterPhone?: string;
    totalHalls?: number;
    totalSeats?: number;
    city?: string;
    region?: string;
    address?: string;
    pricingModel?: string;
    contractType?: string;
    payoutFrequency?: string;
    expeditedEnabled?: boolean;
    acceptMarketing?: boolean;
    paymentCompleted?: boolean;
    submittedDate?: string;
    rejectionReason?: string;
    rejectionNotes?: string;
    deactivationReason?: string;
    deactivationNotes?: string;
    deactivatedAt?: string;
    deletedAt?: string;
    deletedReason?: string;
}

// Complete mock data with all fields
const fullMockTheaters: any[] = [
    { 
        id: 4, name: 'Sunset Theater', ownerName: 'Emily Wilson', email: 'emily@sunsettheater.com', phone: '+251 944 567 890',
        location: 'Bahir Dar', status: 'Pending', totalRevenue: 0, totalBookings: 0, rating: 0,
        joinDate: '2024-03-25', lastActive: '2024-03-28', screens: 2, capacity: 400,
        businessName: 'Sunset Theater Group', tradeName: 'Sunset Theater', businessType: 'Partnership',
        businessLicense: 'BL-2024-004', taxId: 'TAX-321654987', yearsInOperation: '0-1',
        businessDescription: 'New theater opening in Bahir Dar',
        theaterName: 'Sunset Theater', theaterEmail: 'info@sunsettheater.com', theaterPhone: '+251 944 567 890',
        totalHalls: 2, totalSeats: 400, city: 'Bahir Dar', region: 'Amhara', address: 'Lake Tana Road',
        pricingModel: 'per_ticket', contractType: '', payoutFrequency: 'weekly',
        expeditedEnabled: true, acceptMarketing: true, paymentCompleted: false,
        submittedDate: '2024-03-25T11:00:00Z'
    },
    { 
        id: 6, name: 'Royal Theater', ownerName: 'Lisa Anderson', email: 'lisa@royaltheater.com', phone: '+251 966 789 012',
        location: 'Gondar', status: 'Pending', totalRevenue: 0, totalBookings: 0, rating: 0,
        joinDate: '2024-03-28', lastActive: '2024-03-30', screens: 3, capacity: 600,
        businessName: 'Royal Theater Services', tradeName: 'Royal Theater', businessType: 'Corporation',
        businessLicense: 'BL-2024-006', taxId: 'TAX-963852741', yearsInOperation: '0-1',
        businessDescription: 'Luxury theater opening in Gondar',
        theaterName: 'Royal Theater', theaterEmail: 'royal@royaltheater.com', theaterPhone: '+251 966 789 012',
        totalHalls: 3, totalSeats: 600, city: 'Gondar', region: 'Amhara', address: 'Fasiladas Area',
        pricingModel: 'contract', contractType: 'monthly', payoutFrequency: 'monthly',
        expeditedEnabled: false, acceptMarketing: false, paymentCompleted: false,
        submittedDate: '2024-03-28T09:30:00Z'
    },
    { 
        id: 1, name: 'Grand Cinema', ownerName: 'John Doe', email: 'john@grandcinema.com', phone: '+251 911 234 567', 
        location: 'Addis Ababa, Bole', status: 'Active', totalRevenue: 125000, totalBookings: 3450, rating: 4.8, 
        joinDate: '2024-01-15', lastActive: '2024-04-01', screens: 5, capacity: 1200,
        businessName: 'Grand Cinema Enterprises', tradeName: 'Grand Cinema', businessType: 'LLC',
        businessLicense: 'BL-2024-001', taxId: 'TAX-123456789', yearsInOperation: '5-10',
        businessDescription: 'Premier cinema in Bole area with luxury seating',
        theaterName: 'Grand Cinema', theaterEmail: 'contact@grandcinema.com', theaterPhone: '+251 911 234 567',
        totalHalls: 5, totalSeats: 1200, city: 'Addis Ababa', region: 'Bole', address: 'Bole Road',
        pricingModel: 'per_ticket', contractType: '', payoutFrequency: 'weekly',
        expeditedEnabled: true, acceptMarketing: true, paymentCompleted: true,
        submittedDate: '2024-01-10T10:30:00Z'
    },
    { 
        id: 2, name: 'Star Multiplex', ownerName: 'Sarah Johnson', email: 'sarah@starmultiplex.com', phone: '+251 922 345 678',
        location: 'Addis Ababa, Kazanchis', status: 'Active', totalRevenue: 98000, totalBookings: 2780, rating: 4.6,
        joinDate: '2024-02-20', lastActive: '2024-04-02', screens: 4, capacity: 950,
        businessName: 'Star Multiplex PLC', tradeName: 'Star Multiplex', businessType: 'Corporation',
        businessLicense: 'BL-2024-002', taxId: 'TAX-987654321', yearsInOperation: '3-5',
        businessDescription: 'Modern multiplex with 4 screens in Kazanchis',
        theaterName: 'Star Multiplex', theaterEmail: 'info@starmultiplex.com', theaterPhone: '+251 922 345 678',
        totalHalls: 4, totalSeats: 950, city: 'Addis Ababa', region: 'Kazanchis', address: 'Kazanchis Business District',
        pricingModel: 'contract', contractType: 'yearly', payoutFrequency: 'monthly',
        expeditedEnabled: false, acceptMarketing: false, paymentCompleted: true,
        submittedDate: '2024-01-12T14:45:00Z'
    },
    { 
        id: 5, name: 'Oasis Cinema', ownerName: 'David Miller', email: 'david@oasiscinema.com', phone: '+251 955 678 901',
        location: 'Addis Ababa, CMC', status: 'Active', totalRevenue: 87600, totalBookings: 2340, rating: 4.5,
        joinDate: '2024-02-01', lastActive: '2024-04-03', screens: 4, capacity: 850,
        businessName: 'Oasis Entertainment', tradeName: 'Oasis Cinema', businessType: 'LLC',
        businessLicense: 'BL-2024-005', taxId: 'TAX-147258369', yearsInOperation: '3-5',
        businessDescription: 'Premium cinema in CMC area with VIP lounge',
        theaterName: 'Oasis Cinema', theaterEmail: 'contact@oasiscinema.com', theaterPhone: '+251 955 678 901',
        totalHalls: 4, totalSeats: 850, city: 'Addis Ababa', region: 'CMC', address: 'CMC Road',
        pricingModel: 'per_ticket', contractType: '', payoutFrequency: 'biweekly',
        expeditedEnabled: true, acceptMarketing: true, paymentCompleted: true,
        submittedDate: '2024-01-20T16:20:00Z'
    },
    { 
        id: 3, name: 'City Cinema', ownerName: 'Michael Brown', email: 'michael@citycinema.com', phone: '+251 933 456 789',
        location: 'Addis Ababa, Piassa', status: 'Inactive', totalRevenue: 45000, totalBookings: 1200, rating: 4.2,
        joinDate: '2024-01-10', lastActive: '2024-03-15', screens: 3, capacity: 700,
        businessName: 'City Cinema Services', tradeName: 'City Cinema', businessType: 'Sole Proprietorship',
        businessLicense: 'BL-2024-003', taxId: 'TAX-456789123', yearsInOperation: '1-3',
        businessDescription: 'Classic cinema in Piassa area',
        theaterName: 'City Cinema', theaterEmail: 'city@citycinema.com', theaterPhone: '+251 933 456 789',
        totalHalls: 3, totalSeats: 700, city: 'Addis Ababa', region: 'Piassa', address: 'Piassa Square',
        pricingModel: 'per_ticket', contractType: '', payoutFrequency: 'weekly',
        expeditedEnabled: false, acceptMarketing: true, paymentCompleted: true,
        submittedDate: '2024-01-05T09:15:00Z'
    },
    { 
        id: 7, name: 'Plaza Cinema', ownerName: 'James Wilson', email: 'james@plazacinema.com', phone: '+251 977 890 123',
        location: 'Addis Ababa, Mexico', status: 'Active', totalRevenue: 112000, totalBookings: 2980, rating: 4.7,
        joinDate: '2024-01-05', lastActive: '2024-04-02', screens: 6, capacity: 1400,
        businessName: 'Plaza Cinema Complex', tradeName: 'Plaza Cinema', businessType: 'LLC',
        businessLicense: 'BL-2024-007', taxId: 'TAX-741852963', yearsInOperation: '5-10',
        businessDescription: 'Large cinema complex in Mexico area',
        theaterName: 'Plaza Cinema', theaterEmail: 'plaza@plazacinema.com', theaterPhone: '+251 977 890 123',
        totalHalls: 6, totalSeats: 1400, city: 'Addis Ababa', region: 'Mexico', address: 'Mexico Square',
        pricingModel: 'per_ticket', contractType: '', payoutFrequency: 'weekly',
        expeditedEnabled: true, acceptMarketing: true, paymentCompleted: true,
        submittedDate: '2024-01-08T13:45:00Z'
    }
];

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring" as const,
            stiffness: 100,
            damping: 12
        }
    }
};

// Stat Card Component
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    delay: number;
    link?: string;
    notification?: boolean;
    notificationCount?: number;
    onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, delay, link, notification, notificationCount, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    const getNotificationColor = () => {
        if (title === 'Pending Theaters') return 'bg-yellow-500 animate-pulse';
        return 'bg-teal-500';
    };

    const CardContent = () => (
        <div
            className="relative overflow-hidden cursor-pointer transition-all duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-500">{title}</p>
                        {notification && notificationCount && notificationCount > 0 && (
                            <span className={`px-1.5 py-0.5 text-[9px] font-bold ${getNotificationColor()} text-white rounded-full`}>
                                {notificationCount}
                            </span>
                        )}
                    </div>
                    <p className="text-xl font-bold text-gray-900">{value}</p>
                </div>
                {link && (
                    <div className={`transform transition-all duration-300 ${isHovered ? 'translate-x-0 opacity-100' : 'translate-x-1 opacity-0'}`}>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, type: "spring", stiffness: 100 }}
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
        >
            {link ? (
                <Link to={link} className="block">
                    <CardContent />
                </Link>
            ) : (
                <CardContent />
            )}
        </motion.div>
    );
};

// Simple View Modal (No action buttons - just view details with Cancel button)
const SimpleViewModal: React.FC<{
    theater: any;
    isOpen: boolean;
    onClose: () => void;
}> = ({ theater, isOpen, onClose }) => {
    if (!isOpen) return null;

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 rounded-t-2xl z-10">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Building className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Theater Details</h2>
                                <p className="text-xs text-white/80">{theater.theaterName || theater.name}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition">
                            <X className="h-5 w-5 text-white" />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {/* Theater Information Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                            <Info className="h-5 w-5 text-indigo-600" />
                            Theater Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-500">Theater Name</label>
                                <p className="text-sm font-medium text-gray-900">{theater.theaterName || theater.name}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Status</label>
                                <div className="mt-1">
                                    {theater.status === 'Pending' && <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">⏳ Pending</span>}
                                    {theater.status === 'Active' && <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">✅ Active</span>}
                                    {theater.status === 'Inactive' && <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">❌ Inactive</span>}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Location</label>
                                <p className="text-sm text-gray-900">{theater.city ? `${theater.city}, ${theater.region}` : theater.location}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Address</label>
                                <p className="text-sm text-gray-900">{theater.address || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Total Halls</label>
                                <p className="text-sm text-gray-900">{theater.totalHalls || theater.screens || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Total Seats</label>
                                <p className="text-sm text-gray-900">{theater.totalSeats || theater.capacity || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Join Date</label>
                                <p className="text-sm text-gray-900">{formatDate(theater.joinDate)}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Last Active</label>
                                <p className="text-sm text-gray-900">{formatDate(theater.lastActive)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Owner Information Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                            <Users className="h-5 w-5 text-indigo-600" />
                            Owner Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-500">Owner Name</label>
                                <p className="text-sm font-medium text-gray-900">{theater.ownerName}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Email</label>
                                <p className="text-sm text-gray-900">{theater.email}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Phone</label>
                                <p className="text-sm text-gray-900">{theater.phone}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Business Name</label>
                                <p className="text-sm text-gray-900">{theater.businessName || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Business Type</label>
                                <p className="text-sm text-gray-900">{theater.businessType || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Business License</label>
                                <p className="text-sm text-gray-900">{theater.businessLicense || 'N/A'}</p>
                            </div>
                            <div className="col-span-2">
                                <label className="text-xs text-gray-500">Business Description</label>
                                <p className="text-sm text-gray-900">{theater.businessDescription || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Business Metrics Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                            <Activity className="h-5 w-5 text-indigo-600" />
                            Business Metrics
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 rounded-lg p-3">
                                <label className="text-xs text-gray-500">Total Revenue</label>
                                <p className="text-lg font-bold text-green-600">ETB {theater.totalRevenue?.toLocaleString() || 0}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <label className="text-xs text-gray-500">Total Bookings</label>
                                <p className="text-lg font-bold text-blue-600">{theater.totalBookings?.toLocaleString() || 0}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <label className="text-xs text-gray-500">Rating</label>
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                    <p className="text-lg font-bold text-gray-900">{theater.rating || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cancel/Close Button at Bottom */}
                    <div className="flex justify-end pt-4 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                        >
                            <X className="h-4 w-4" />
                            Close
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// Enhanced View Modal with Approve/Reject for Pending theaters only
const PendingViewModal: React.FC<{
    theater: any;
    isOpen: boolean;
    onClose: () => void;
    onApprove?: (theater: any, notes: string) => void;
    onReject?: (theater: any, reason: string, notes: string) => void;
}> = ({ theater, isOpen, onClose, onApprove, onReject }) => {
    const [showApproveForm, setShowApproveForm] = useState(false);
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [approvalNotes, setApprovalNotes] = useState('');
    const [rejectReason, setRejectReason] = useState('');
    const [rejectNotes, setRejectNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleApprove = async () => {
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        onApprove?.(theater, approvalNotes);
        setShowApproveForm(false);
        setApprovalNotes('');
        setIsSubmitting(false);
        onClose();
    };

    const handleReject = async () => {
        if (!rejectReason) return;
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        onReject?.(theater, rejectReason, rejectNotes);
        setShowRejectForm(false);
        setRejectReason('');
        setRejectNotes('');
        setIsSubmitting(false);
        onClose();
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 rounded-t-2xl z-10">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Building className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Pending Registration Details</h2>
                                <p className="text-xs text-white/80">{theater.theaterName || theater.name}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition">
                            <X className="h-5 w-5 text-white" />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {/* Theater Information Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                            <Info className="h-5 w-5 text-indigo-600" />
                            Theater Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-500">Theater Name</label>
                                <p className="text-sm font-medium text-gray-900">{theater.theaterName || theater.name}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Location</label>
                                <p className="text-sm text-gray-900">{theater.city ? `${theater.city}, ${theater.region}` : theater.location}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Address</label>
                                <p className="text-sm text-gray-900">{theater.address || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Total Halls</label>
                                <p className="text-sm text-gray-900">{theater.totalHalls || theater.screens || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Total Seats</label>
                                <p className="text-sm text-gray-900">{theater.totalSeats || theater.capacity || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Submitted Date</label>
                                <p className="text-sm text-gray-900">{formatDate(theater.submittedDate)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Owner Information Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                            <Users className="h-5 w-5 text-indigo-600" />
                            Owner Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-500">Owner Name</label>
                                <p className="text-sm font-medium text-gray-900">{theater.ownerName}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Email</label>
                                <p className="text-sm text-gray-900">{theater.email}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Phone</label>
                                <p className="text-sm text-gray-900">{theater.phone}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Business Name</label>
                                <p className="text-sm text-gray-900">{theater.businessName || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Business Type</label>
                                <p className="text-sm text-gray-900">{theater.businessType || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Business License</label>
                                <p className="text-sm text-gray-900">{theater.businessLicense || 'N/A'}</p>
                            </div>
                            <div className="col-span-2">
                                <label className="text-xs text-gray-500">Business Description</label>
                                <p className="text-sm text-gray-900">{theater.businessDescription || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons for Pending Theaters */}
                    {!showApproveForm && !showRejectForm && (
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Activity className="h-5 w-5 text-indigo-600" />
                                Registration Approval
                            </h3>
                            <div className="flex gap-3">
                                <button onClick={() => setShowApproveForm(true)} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2">
                                    <Check className="h-4 w-4" /> Approve Registration
                                </button>
                                <button onClick={() => setShowRejectForm(true)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2">
                                    <X className="h-4 w-4" /> Reject Registration
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Approve Form */}
                    {showApproveForm && (
                        <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                            <h3 className="text-sm font-semibold text-green-800 mb-3">Approve Theater Registration</h3>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Approval Notes (Optional)</label>
                                <textarea value={approvalNotes} onChange={(e) => setApprovalNotes(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none" placeholder="Add any notes or comments for the theater owner..." />
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setShowApproveForm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Cancel</button>
                                <button onClick={handleApprove} disabled={isSubmitting} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition flex items-center justify-center gap-2">
                                    {isSubmitting ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Processing...</> : <><Check className="h-4 w-4" /> Confirm Approval</>}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Reject Form */}
                    {showRejectForm && (
                        <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200">
                            <h3 className="text-sm font-semibold text-red-800 mb-3">Reject Theater Registration</h3>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Reason <span className="text-red-500">*</span></label>
                                <select value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none">
                                    <option value="">Select Rejection Reason</option>
                                    <option value="incomplete_documents">📄 Incomplete Documents</option>
                                    <option value="invalid_information">⚠️ Invalid Information</option>
                                    <option value="duplicate_registration">🔄 Duplicate Registration</option>
                                    <option value="policy_violation">🚫 Policy Violation</option>
                                    <option value="payment_issue">💳 Payment Issue</option>
                                    <option value="business_verification_failed">🔍 Business Verification Failed</option>
                                    <option value="other">📝 Other</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes (Optional)</label>
                                <textarea value={rejectNotes} onChange={(e) => setRejectNotes(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none resize-none" placeholder="Provide more details..." />
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setShowRejectForm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Cancel</button>
                                <button onClick={handleReject} disabled={isSubmitting || !rejectReason} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition flex items-center justify-center gap-2">
                                    {isSubmitting ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Processing...</> : <><X className="h-4 w-4" /> Confirm Rejection</>}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Cancel/Close Button at Bottom */}
                    <div className="flex justify-end pt-4 mt-4 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                        >
                            <X className="h-4 w-4" />
                            Close
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const TheaterManagement: React.FC = () => {
    const [theaters, setTheaters] = useState<any[]>(fullMockTheaters);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showPendingModal, setShowPendingModal] = useState(false);
    const [selectedTheater, setSelectedTheater] = useState<any | null>(null);
    const [viewingTheater, setViewingTheater] = useState<any | null>(null);
    const [pendingTheater, setPendingTheater] = useState<any | null>(null);
    const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
    const [showActivateConfirm, setShowActivateConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [theaterToAction, setTheaterToAction] = useState<any | null>(null);
    const [deactivationReason, setDeactivationReason] = useState('');
    const [deactivationNotes, setDeactivationNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });

    // Filter out deleted theaters from display
    const activeTheaters = React.useMemo(() => {
        return theaters.filter(t => t.status !== 'Deleted');
    }, [theaters]);

    // Sort theaters: Pending first, then Active, then Inactive
    const sortedTheaters = React.useMemo(() => {
        const statusOrder: Record<string, number> = { 'Pending': 0, 'Active': 1, 'Inactive': 2 };
        return [...activeTheaters].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
    }, [activeTheaters]);

    const stats = {
        totalTheaters: sortedTheaters.length,
        activeTheaters: sortedTheaters.filter(t => t.status === 'Active').length,
        pendingTheaters: sortedTheaters.filter(t => t.status === 'Pending').length,
        inactiveTheaters: sortedTheaters.filter(t => t.status === 'Inactive').length,
    };

    const dashboardCards = [
        { title: 'Total Theaters', value: stats.totalTheaters, icon: Building, color: 'from-teal-500 to-teal-600', delay: 0.1, notification: false },
        { title: 'Pending Theaters', value: stats.pendingTheaters, icon: Clock, color: 'from-yellow-500 to-orange-600', delay: 0.15, notification: true, notificationCount: stats.pendingTheaters, onClick: () => setFilterStatus('Pending') },
        { title: 'Active Theaters', value: stats.activeTheaters, icon: Theater, color: 'from-green-500 to-emerald-600', delay: 0.2, notification: false, onClick: () => setFilterStatus('Active') },
        { title: 'Inactive Theaters', value: stats.inactiveTheaters, icon: Ban, color: 'from-red-500 to-rose-600', delay: 0.25, notification: false, onClick: () => setFilterStatus('Inactive') }
    ];

    const filteredTheaters = sortedTheaters.filter(theater => {
        const matchesSearch = (theater.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (theater.ownerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (theater.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (theater.location || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || theater.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleAddTheater = (data: any) => {
        const newTheater = {
            id: Math.max(...theaters.map(t => t.id), 0) + 1,
            ...data,
            status: 'Pending',
            totalRevenue: 0,
            totalBookings: 0,
            rating: 0,
            joinDate: new Date().toISOString().split('T')[0],
            lastActive: new Date().toISOString().split('T')[0],
            submittedDate: new Date().toISOString()
        };
        setTheaters([...theaters, newTheater]);
        setShowAddModal(false);
        setPopupMessage({ title: 'Success!', message: `${data.theaterName || data.name} has been added and is pending approval`, type: 'success' });
        setShowSuccessPopup(true);
    };

    const handleUpdateTheater = (data: any) => {
        setTheaters(theaters.map(theater =>
            theater.id === data.id ? { ...theater, ...data } : theater
        ));
        setShowUpdateModal(false);
        setSelectedTheater(null);
        setPopupMessage({ title: 'Success!', message: `${data.theaterName || data.name} has been updated`, type: 'success' });
        setShowSuccessPopup(true);
    };

    const handleApproveTheater = (theater: any, notes: string) => {
        setTheaters(theaters.map(t =>
            t.id === theater.id ? { ...t, status: 'Active' } : t
        ));
        setPopupMessage({ 
            title: 'Approved!', 
            message: `✅ Theater "${theater.name}" has been approved successfully! ${notes ? `Notes: ${notes}` : ''}`, 
            type: 'success' 
        });
        setShowSuccessPopup(true);
    };

    const handleRejectTheater = (theater: any, reason: string, notes: string) => {
        setTheaters(theaters.filter(t => t.id !== theater.id));
        setPopupMessage({ 
            title: 'Rejected!', 
            message: `❌ Theater "${theater.name}" has been rejected. Reason: ${reason}${notes ? `\nNotes: ${notes}` : ''}`, 
            type: 'warning' 
        });
        setShowSuccessPopup(true);
    };

    const handleActivateTheater = () => {
        if (theaterToAction) {
            setTheaters(theaters.map(t =>
                t.id === theaterToAction.id ? { ...t, status: 'Active', lastActive: new Date().toISOString().split('T')[0] } : t
            ));
            setShowActivateConfirm(false);
            setTheaterToAction(null);
            setPopupMessage({ title: 'Activated!', message: `✅ Theater "${theaterToAction.name}" has been activated`, type: 'success' });
            setShowSuccessPopup(true);
        }
    };

    const handleDeactivateTheater = () => {
        if (theaterToAction && deactivationReason) {
            setTheaters(theaters.map(t =>
                t.id === theaterToAction.id ? { ...t, status: 'Inactive', deactivationReason: deactivationReason, deactivationNotes: deactivationNotes, deactivatedAt: new Date().toISOString() } : t
            ));
            setShowDeactivateConfirm(false);
            setTheaterToAction(null);
            setDeactivationReason('');
            setDeactivationNotes('');
            setPopupMessage({ 
                title: 'Deactivated!', 
                message: `⚠️ Theater "${theaterToAction.name}" has been deactivated. Reason: ${deactivationReason}`, 
                type: 'warning' 
            });
            setShowSuccessPopup(true);
        } else if (!deactivationReason) {
            setPopupMessage({ title: 'Error!', message: 'Please select a deactivation reason.', type: 'error' });
            setShowSuccessPopup(true);
        }
    };

    const handleDeleteTheater = () => {
        if (theaterToAction) {
            setTheaters(theaters.filter(t => t.id !== theaterToAction.id));
            setShowDeleteConfirm(false);
            setTheaterToAction(null);
            setPopupMessage({ 
                title: 'Deleted!', 
                message: `🗑️ Theater "${theaterToAction.name}" has been deleted`, 
                type: 'warning' 
            });
            setShowSuccessPopup(true);
        }
    };

    const handleEditClick = (row: any) => {
        setSelectedTheater(row);
        setShowUpdateModal(true);
    };

    const handleViewClick = (row: any) => {
        if (row.status === 'Pending') {
            setPendingTheater(row);
            setShowPendingModal(true);
        } else {
            setViewingTheater(row);
            setShowViewModal(true);
        }
    };

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'Active':
                return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">✅ Active</span>;
            case 'Inactive':
                return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">❌ Inactive</span>;
            case 'Pending':
                return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 animate-pulse">⏳ Pending</span>;
            default:
                return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    const columns = [
        {
            Header: 'Theater',
            accessor: 'name',
            sortable: true,
            Cell: (row: any) => (
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold ${row.status === 'Pending' ? 'animate-pulse' : ''}`}>
                        {(row.theaterName || row.name || 'T').charAt(0)}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{row.theaterName || row.name}</p>
                        <p className="text-xs text-gray-500">ID: TH{String(row.id).padStart(3, '0')}</p>
                    </div>
                </div>
            )
        },
        {
            Header: 'Owner',
            accessor: 'ownerName',
            sortable: true,
            Cell: (row: any) => (
                <div>
                    <p className="text-sm font-medium text-gray-900">{row.ownerName}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{row.ownerEmail || row.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{row.ownerPhone || row.phone}</span>
                    </div>
                </div>
            )
        },
        {
            Header: 'Location',
            accessor: 'location',
            sortable: true,
            Cell: (row: any) => (
                <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span className="text-sm text-gray-600">{row.city ? `${row.city}, ${row.region}` : row.location}</span>
                </div>
            )
        },
        {
            Header: 'Status',
            accessor: 'status',
            sortable: true,
            Cell: (row: any) => getStatusBadge(row.status)
        },
        {
            Header: 'Rating',
            accessor: 'rating',
            sortable: true,
            Cell: (row: any) => (
                <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium text-gray-700">{row.rating || 0}</span>
                </div>
            )
        },
        {
            Header: 'Actions',
            accessor: 'id',
            sortable: false,
            Cell: (row: any) => (
                <div className="flex items-center gap-2">
                    {/* View Button */}
                    <button onClick={() => handleViewClick(row)} className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors" title="View Details">
                        <Eye className="h-4 w-4 text-blue-600" />
                    </button>

                    {/* Edit Button for Active/Inactive (not Pending) */}
                    {row.status !== 'Pending' && (
                        <button onClick={() => handleEditClick(row)} className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 transition-colors" title="Edit Theater">
                            <Edit className="h-4 w-4 text-teal-600" />
                        </button>
                    )}

                    {/* Activate/Deactivate based on status */}
                    {row.status === 'Active' && (
                        <button onClick={() => { setTheaterToAction(row); setShowDeactivateConfirm(true); }} className="p-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors" title="Deactivate">
                            <Ban className="h-4 w-4 text-orange-600" />
                        </button>
                    )}

                    {row.status === 'Inactive' && (
                        <button onClick={() => { setTheaterToAction(row); setShowActivateConfirm(true); }} className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition-colors" title="Activate">
                            <PlayCircle className="h-4 w-4 text-green-600" />
                        </button>
                    )}

                    {/* Delete Button for Active/Inactive - No reason required */}
                    {row.status !== 'Pending' && (
                        <button onClick={() => { setTheaterToAction(row); setShowDeleteConfirm(true); }} className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors" title="Delete">
                            <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                    )}
                </div>
            )
        },
    ];

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {dashboardCards.map((card, index) => (
                        <StatCard
                            key={index}
                            title={card.title}
                            value={card.value}
                            icon={card.icon}
                            color={card.color}
                            delay={card.delay}
                            link={card.link}
                            notification={card.notification}
                            notificationCount={card.notificationCount}
                            onClick={card.onClick}
                        />
                    ))}
                </motion.div>

                {/* Search and Add Button */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative min-w-[250px]">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search theaters..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        >
                            <option value="all">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Pending">Pending</option>
                        </select>
                    </div>
                    <ReusableButton onClick={() => setShowAddModal(true)} variant="primary" icon={UserPlus}>
                        Add New Theater
                    </ReusableButton>
                </div>

                {/* Table */}
                <ReusableTable
                    columns={columns}
                    data={filteredTheaters}
                    title="All Theaters"
                    icon={LayoutGrid}
                    showSearch={false}
                    showExport={true}
                    showPrint={true}
                    itemsPerPage={10}
                />

                {/* Modals */}
                {showAddModal && (
                    <AddTheater onSubmit={handleAddTheater} onClose={() => setShowAddModal(false)} formTitle="Add New Theater" />
                )}
                {showUpdateModal && selectedTheater && (
                    <UpdateTheater theater={selectedTheater} isOpen={showUpdateModal} onClose={() => { setShowUpdateModal(false); setSelectedTheater(null); }} onUpdate={handleUpdateTheater} />
                )}

                {/* Simple View Modal for Active/Inactive (No action buttons) */}
                <SimpleViewModal
                    theater={viewingTheater}
                    isOpen={showViewModal}
                    onClose={() => { setShowViewModal(false); setViewingTheater(null); }}
                />

                {/* Pending View Modal with Approve/Reject */}
                <PendingViewModal
                    theater={pendingTheater}
                    isOpen={showPendingModal}
                    onClose={() => { setShowPendingModal(false); setPendingTheater(null); }}
                    onApprove={handleApproveTheater}
                    onReject={handleRejectTheater}
                />

                {/* Activate Confirm Modal */}
                {showActivateConfirm && theaterToAction && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl max-w-md w-full shadow-xl">
                            <div className="border-b px-6 py-4 bg-green-50 rounded-t-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-full"><PlayCircle className="w-5 h-5 text-green-600" /></div>
                                    <div><h2 className="text-xl font-bold text-gray-800">Activate Theater</h2><p className="text-sm text-gray-600">{theaterToAction.name}</p></div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="mb-4 p-3 bg-blue-50 rounded-lg"><p className="text-sm text-blue-800">Activating this theater will restore full access.</p></div>
                            </div>
                            <div className="border-t px-6 py-4 flex justify-end gap-3">
                                <button onClick={() => { setShowActivateConfirm(false); setTheaterToAction(null); }} className="px-4 py-2 border rounded-lg">Cancel</button>
                                <button onClick={handleActivateTheater} className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2"><PlayCircle className="h-4 w-4" /> Confirm Activation</button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Deactivate Confirm Modal */}
                {showDeactivateConfirm && theaterToAction && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl max-w-md w-full shadow-xl">
                            <div className="border-b px-6 py-4 bg-orange-50 rounded-t-2xl">
                                <div className="flex items-center gap-3"><div className="p-2 bg-orange-100 rounded-full"><Ban className="w-5 h-5 text-orange-600" /></div><div><h2 className="text-xl font-bold text-gray-800">Deactivate Theater</h2><p className="text-sm text-gray-600">{theaterToAction.name}</p></div></div>
                            </div>
                            <div className="p-6">
                                <div className="mb-4"><label className="block text-sm font-medium mb-2">Deactivation Reason <span className="text-red-500">*</span></label>
                                    <select value={deactivationReason} onChange={(e) => setDeactivationReason(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                                        <option value="">Select Reason</option>
                                        <option value="policy_violation">🚫 Policy Violation</option><option value="inactive_account">💤 Inactive Account</option>
                                        <option value="payment_issues">💳 Payment Issues</option><option value="owner_request">📝 Owner Request</option><option value="other">📝 Other</option>
                                    </select>
                                </div>
                                <div><label className="block text-sm font-medium mb-2">Additional Notes</label><textarea value={deactivationNotes} onChange={(e) => setDeactivationNotes(e.target.value)} rows={3} className="w-full px-3 py-2 border rounded-lg" placeholder="Optional notes..." /></div>
                            </div>
                            <div className="border-t px-6 py-4 flex justify-end gap-3">
                                <button onClick={() => { setShowDeactivateConfirm(false); setTheaterToAction(null); setDeactivationReason(''); setDeactivationNotes(''); }} className="px-4 py-2 border rounded-lg">Cancel</button>
                                <button onClick={handleDeactivateTheater} disabled={!deactivationReason} className="px-4 py-2 bg-orange-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"><Ban className="h-4 w-4" /> Confirm Deactivation</button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Delete Confirm Modal - No reason required */}
                {showDeleteConfirm && theaterToAction && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl max-w-md w-full shadow-xl">
                            <div className="border-b px-6 py-4 bg-red-50 rounded-t-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 rounded-full"><Trash2 className="w-5 h-5 text-red-600" /></div>
                                    <div><h2 className="text-xl font-bold text-gray-800">Delete Theater</h2><p className="text-sm text-gray-600">{theaterToAction.name}</p></div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="mb-4 p-3 bg-yellow-50 rounded-lg"><p className="text-sm text-yellow-800">⚠️ Warning: This action cannot be undone.</p></div>
                            </div>
                            <div className="border-t px-6 py-4 flex justify-end gap-3">
                                <button onClick={() => { setShowDeleteConfirm(false); setTheaterToAction(null); }} className="px-4 py-2 border rounded-lg">Cancel</button>
                                <button onClick={handleDeleteTheater} className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2"><Trash2 className="h-4 w-4" /> Confirm Delete</button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Success Popup */}
                <SuccessPopup isOpen={showSuccessPopup} onClose={() => setShowSuccessPopup(false)} type={popupMessage.type} title={popupMessage.title} message={popupMessage.message} duration={4000} position="top-right" />
            </div>
        </motion.div>
    );
};

export default TheaterManagement;