// src/pages/Admin/theaters/TheaterManagement.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Building, Eye, Edit, RefreshCw, Ban, Phone, Calendar,
    CheckCircle, XCircle, Clock, AlertCircle, Search, TrendingUp,
    Activity, MapPin, Mail, Star, LayoutGrid, UserPlus,
    Users, ArrowRight, Theater, Crown, Shield, UserCheck,
    Check, X, ThumbsUp, ThumbsDown, AlertTriangle, FileText, CreditCard
} from 'lucide-react';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';
import AddTheater from './AddTheater';
import UpdateTheater from './UpdateTheater';
import ViewTheater from './ViewTheater';

interface Theater {
    id: number;
    name: string;
    ownerName: string;
    email: string;
    phone: string;
    location: string;
    status: 'Active' | 'Inactive' | 'Pending';
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
}

// Complete mock data with all fields
const fullMockTheaters: any[] = [
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
    },
    { 
        id: 8, name: 'Mega Movies', ownerName: 'Patricia Brown', email: 'patricia@megamovies.com', phone: '+251 988 901 234',
        location: 'Hawassa', status: 'Inactive', totalRevenue: 23000, totalBookings: 680, rating: 3.9,
        joinDate: '2023-12-10', lastActive: '2024-02-20', screens: 2, capacity: 450,
        businessName: 'Mega Movies Enterprise', tradeName: 'Mega Movies', businessType: 'Sole Proprietorship',
        businessLicense: 'BL-2024-008', taxId: 'TAX-159357486', yearsInOperation: '1-3',
        businessDescription: 'Small cinema in Hawassa',
        theaterName: 'Mega Movies', theaterEmail: 'mega@megamovies.com', theaterPhone: '+251 988 901 234',
        totalHalls: 2, totalSeats: 450, city: 'Hawassa', region: 'Sidama', address: 'Main Road',
        pricingModel: 'per_ticket', contractType: '', payoutFrequency: 'weekly',
        expeditedEnabled: false, acceptMarketing: false, paymentCompleted: true,
        submittedDate: '2023-12-10T10:00:00Z'
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
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, delay, link, notification, notificationCount }) => {
    const [isHovered, setIsHovered] = useState(false);

    const getNotificationColor = () => {
        if (title === 'Pending Theaters') return 'bg-yellow-500';
        return 'bg-teal-500';
    };

    const CardContent = () => (
        <div
            className="relative overflow-hidden cursor-pointer transition-all duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-500">{title}</p>
                        {notification && notificationCount && notificationCount > 0 && (
                            <span className={`px-1.5 py-0.5 text-[9px] font-bold ${getNotificationColor()} text-white rounded-full animate-pulse`}>
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

const TheaterManagement: React.FC = () => {
    const [theaters, setTheaters] = useState<any[]>(fullMockTheaters);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showApproveRejectModal, setShowApproveRejectModal] = useState(false);
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [selectedTheater, setSelectedTheater] = useState<any | null>(null);
    const [viewingTheater, setViewingTheater] = useState<any | null>(null);
    const [pendingTheaterAction, setPendingTheaterAction] = useState<any | null>(null);
    const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
    const [showReactivateConfirm, setShowReactivateConfirm] = useState(false);
    const [theaterToDeactivate, setTheaterToDeactivate] = useState<any | null>(null);
    const [theaterToReactivate, setTheaterToReactivate] = useState<any | null>(null);
    const [deactivationReason, setDeactivationReason] = useState('');
    const [rejectReason, setRejectReason] = useState('');
    const [rejectNotes, setRejectNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });

    const stats = {
        totalTheaters: theaters.length,
        activeTheaters: theaters.filter(t => t.status === 'Active').length,
        pendingTheaters: theaters.filter(t => t.status === 'Pending').length,
        inactiveTheaters: theaters.filter(t => t.status === 'Inactive').length,
    };

    const dashboardCards = [
        { title: 'Total Theaters', value: stats.totalTheaters, icon: Building, color: 'from-teal-500 to-teal-600', delay: 0.1,  notification: false },
        { title: 'Pending Theaters', value: stats.pendingTheaters, icon: Clock, color: 'from-yellow-500 to-orange-600', delay: 0.15,  notification: true, notificationCount: stats.pendingTheaters },
        { title: 'Active Theaters', value: stats.activeTheaters, icon: Theater, color: 'from-green-500 to-emerald-600', delay: 0.2,  notification: true, notificationCount: stats.activeTheaters },
        { title: 'Inactive Theaters', value: stats.inactiveTheaters, icon: Ban, color: 'from-red-500 to-rose-600', delay: 0.25,  notification: true, notificationCount: stats.inactiveTheaters }
    ];

    const filteredTheaters = theaters.filter(theater => {
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

    const handleApproveTheater = async () => {
        if (pendingTheaterAction) {
            setIsSubmitting(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            setTheaters(theaters.map(theater =>
                theater.id === pendingTheaterAction.id ? { ...theater, status: 'Active' } : theater
            ));
            setShowApproveRejectModal(false);
            setPendingTheaterAction(null);
            setPopupMessage({ 
                title: 'Approved!', 
                message: `✅ Theater "${pendingTheaterAction.name}" has been approved successfully! An email notification has been sent.`, 
                type: 'success' 
            });
            setShowSuccessPopup(true);
            setIsSubmitting(false);
        }
    };

    const handleRejectTheater = async () => {
        if (pendingTheaterAction && rejectReason) {
            setIsSubmitting(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            setTheaters(theaters.filter(theater => theater.id !== pendingTheaterAction.id));
            setShowRejectForm(false);
            setShowApproveRejectModal(false);
            setPendingTheaterAction(null);
            setRejectReason('');
            setRejectNotes('');
            setPopupMessage({ 
                title: 'Rejected!', 
                message: `❌ Theater "${pendingTheaterAction.name}" has been rejected. Reason: ${rejectReason}`, 
                type: 'warning' 
            });
            setShowSuccessPopup(true);
            setIsSubmitting(false);
        } else if (!rejectReason) {
            setPopupMessage({ title: 'Error!', message: 'Please select a rejection reason.', type: 'error' });
            setShowSuccessPopup(true);
        }
    };

    const handleDeactivateTheater = () => {
        if (theaterToDeactivate) {
            setTheaters(theaters.map(theater =>
                theater.id === theaterToDeactivate.id ? { ...theater, status: 'Inactive' } : theater
            ));
            setShowDeactivateConfirm(false);
            setTheaterToDeactivate(null);
            setDeactivationReason('');
            setPopupMessage({ title: 'Deactivated!', message: `${theaterToDeactivate.name} has been deactivated`, type: 'warning' });
            setShowSuccessPopup(true);
        }
    };

    const handleReactivateTheater = () => {
        if (theaterToReactivate) {
            setTheaters(theaters.map(theater =>
                theater.id === theaterToReactivate.id ? { ...theater, status: 'Active', lastActive: new Date().toISOString().split('T')[0] } : theater
            ));
            setShowReactivateConfirm(false);
            setTheaterToReactivate(null);
            setPopupMessage({ title: 'Reactivated!', message: `${theaterToReactivate.name} has been reactivated`, type: 'success' });
            setShowSuccessPopup(true);
        }
    };

    const handleEditClick = (row: any) => {
        setSelectedTheater(row);
        setShowUpdateModal(true);
    };

    const handleViewClick = (row: any) => {
        setViewingTheater(row);
        setShowViewModal(true);
    };

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'Active':
                return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">✅ Active</span>;
            case 'Inactive':
                return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">❌ Inactive</span>;
            case 'Pending':
                return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">⏳ Pending</span>;
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
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
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
                    <button
                        onClick={() => handleViewClick(row)}
                        className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                        title="View Details"
                    >
                        <Eye className="h-4 w-4 text-blue-600" />
                    </button>

                    {row.status !== 'Pending' && (
                        <button
                            onClick={() => handleEditClick(row)}
                            className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 transition-colors"
                            title="Edit Theater"
                        >
                            <Edit className="h-4 w-4 text-teal-600" />
                        </button>
                    )}

                    {row.status === 'Pending' && (
                        <button
                            onClick={() => {
                                setPendingTheaterAction(row);
                                setShowApproveRejectModal(true);
                            }}
                            className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                            title="Approve/Reject"
                        >
                            <ThumbsUp className="h-4 w-4 text-green-600" />
                        </button>
                    )}

                    {row.status === 'Active' && (
                        <button
                            onClick={() => { setTheaterToDeactivate(row); setShowDeactivateConfirm(true); }}
                            className="p-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors"
                            title="Deactivate"
                        >
                            <Ban className="h-4 w-4 text-orange-600" />
                        </button>
                    )}

                    {row.status === 'Inactive' && (
                        <button
                            onClick={() => { setTheaterToReactivate(row); setShowReactivateConfirm(true); }}
                            className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                            title="Reactivate"
                        >
                            <RefreshCw className="h-4 w-4 text-green-600" />
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
                    <ReusableButton
                        onClick={() => setShowAddModal(true)}
                        variant="primary"
                        icon={UserPlus}
                    >
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
                    <AddTheater
                        onSubmit={handleAddTheater}
                        onClose={() => setShowAddModal(false)}
                        formTitle="Add New Theater"
                    />
                )}
                {showUpdateModal && selectedTheater && (
                    <UpdateTheater
                        theater={selectedTheater}
                        isOpen={showUpdateModal}
                        onClose={() => { setShowUpdateModal(false); setSelectedTheater(null); }}
                        onUpdate={handleUpdateTheater}
                    />
                )}
               // In TheaterManagement.tsx, update the ViewTheater component usage:

{showViewModal && viewingTheater && (
    <ViewTheater
        theater={viewingTheater}
        isOpen={showViewModal}
        onClose={() => { 
            setShowViewModal(false); 
            setViewingTheater(null); 
        }}
        onEdit={(theater) => {
            setShowViewModal(false);
            setSelectedTheater(theater);
            setShowUpdateModal(true);
        }}
    />
)}

                {/* Approve/Reject Modal */}
                {showApproveRejectModal && pendingTheaterAction && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-2xl max-w-md w-full shadow-xl"
                        >
                            <div className="border-b px-6 py-4 bg-yellow-50 rounded-t-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-yellow-100 rounded-full">
                                        <Clock className="w-5 h-5 text-yellow-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">Registration Request</h2>
                                        <p className="text-sm text-gray-600 mt-1">Theater: {pendingTheaterAction.name}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <p className="text-sm text-blue-800">
                                        📋 Please review the theater details before making a decision.
                                    </p>
                                </div>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Owner:</span>
                                        <span className="font-medium">{pendingTheaterAction.ownerName}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Email:</span>
                                        <span className="font-medium">{pendingTheaterAction.email}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Location:</span>
                                        <span className="font-medium">{pendingTheaterAction.location}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Submitted:</span>
                                        <span className="font-medium">{pendingTheaterAction.submittedDate ? new Date(pendingTheaterAction.submittedDate).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="border-t px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setShowApproveRejectModal(false);
                                        setPendingTheaterAction(null);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        setShowApproveRejectModal(false);
                                        setShowRejectForm(true);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    Reject
                                </button>
                                <button
                                    onClick={handleApproveTheater}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Approve
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Reject Form Modal */}
                {showRejectForm && pendingTheaterAction && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-2xl max-w-md w-full shadow-xl"
                        >
                            <div className="border-b px-6 py-4 bg-red-50 rounded-t-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 rounded-full">
                                        <AlertTriangle className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">Reject Registration</h2>
                                        <p className="text-sm text-gray-600 mt-1">Theater: {pendingTheaterAction.name}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                    <p className="text-sm text-yellow-800">
                                        ⚠️ Warning: This action will permanently reject this registration request.
                                    </p>
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Rejection Reason <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                                        required
                                    >
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Additional Notes
                                    </label>
                                    <textarea
                                        value={rejectNotes}
                                        onChange={(e) => setRejectNotes(e.target.value)}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
                                        placeholder="Provide more details about the rejection..."
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {rejectNotes.length} / 500 characters
                                    </p>
                                </div>
                            </div>
                            
                            <div className="border-t px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setShowRejectForm(false);
                                        setRejectReason('');
                                        setRejectNotes('');
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRejectTheater}
                                    disabled={isSubmitting || !rejectReason}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <X className="w-4 h-4" />
                                            Confirm Rejection
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Deactivate Confirm Modal */}
                {showDeactivateConfirm && theaterToDeactivate && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-2xl max-w-md w-full p-6"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <AlertCircle className="h-6 w-6 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-bold">Deactivate Theater</h3>
                            </div>
                            <p className="text-gray-600 mb-4">
                                Are you sure you want to deactivate <strong>{theaterToDeactivate.theaterName || theaterToDeactivate.name}</strong>?
                                This will suspend all theater operations.
                            </p>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Reason for deactivation</label>
                                <select
                                    value={deactivationReason}
                                    onChange={(e) => setDeactivationReason(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                >
                                    <option value="">Select reason</option>
                                    <option value="Violation">Violation of terms</option>
                                    <option value="Inactive">Inactive account</option>
                                    <option value="Requested">Requested by owner</option>
                                    <option value="Payment">Payment issues</option>
                                </select>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeactivateConfirm(false);
                                        setTheaterToDeactivate(null);
                                        setDeactivationReason('');
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeactivateTheater}
                                    disabled={!deactivationReason}
                                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Deactivate
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Reactivate Confirm Modal */}
                {showReactivateConfirm && theaterToReactivate && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-2xl max-w-md w-full p-6"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <RefreshCw className="h-6 w-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold">Reactivate Theater</h3>
                            </div>
                            <p className="text-gray-600 mb-2">
                                Are you sure you want to reactivate <strong>{theaterToReactivate.theaterName || theaterToReactivate.name}</strong>?
                            </p>
                            <p className="text-sm text-gray-500 mb-6">
                                Reactivation reason: {theaterToReactivate.status === 'Inactive' ? 'Theater was previously deactivated' : 'Reactivating operations'}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowReactivateConfirm(false);
                                        setTheaterToReactivate(null);
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReactivateTheater}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Reactivate
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Success Popup */}
                <SuccessPopup
                    isOpen={showSuccessPopup}
                    onClose={() => setShowSuccessPopup(false)}
                    type={popupMessage.type}
                    title={popupMessage.title}
                    message={popupMessage.message}
                    duration={4000}
                    position="top-right"
                />
            </div>
        </motion.div>
    );
};

export default TheaterManagement;