// src/pages/Admin/theaters/TheaterManagement.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Building, Eye, Edit, RefreshCw, Ban, Phone, Calendar, DollarSign,
    Ticket, CheckCircle, XCircle, Clock, AlertCircle, Search, TrendingUp,
    Activity, MapPin, Mail, Star, LayoutGrid, UserPlus
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
    // Additional fields for update
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
}

// Complete mock data with all fields for UpdateTheater
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
        expeditedEnabled: true, acceptMarketing: true, paymentCompleted: true
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
        expeditedEnabled: false, acceptMarketing: false, paymentCompleted: true
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
        expeditedEnabled: false, acceptMarketing: true, paymentCompleted: true
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
        expeditedEnabled: true, acceptMarketing: true, paymentCompleted: false
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
        expeditedEnabled: true, acceptMarketing: true, paymentCompleted: true
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
        expeditedEnabled: false, acceptMarketing: false, paymentCompleted: false
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
        expeditedEnabled: true, acceptMarketing: true, paymentCompleted: true
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
        expeditedEnabled: false, acceptMarketing: false, paymentCompleted: true
    }
];

const TheaterManagement: React.FC = () => {
    const [theaters, setTheaters] = useState<any[]>(fullMockTheaters);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedTheater, setSelectedTheater] = useState<any | null>(null);
    const [viewingTheater, setViewingTheater] = useState<any | null>(null);
    const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
    const [showReactivateConfirm, setShowReactivateConfirm] = useState(false);
    const [theaterToDeactivate, setTheaterToDeactivate] = useState<any | null>(null);
    const [theaterToReactivate, setTheaterToReactivate] = useState<any | null>(null);
    const [deactivationReason, setDeactivationReason] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });

    const stats = {
        totalTheaters: theaters.length,
        activeTheaters: theaters.filter(t => t.status === 'Active').length,
        pendingTheaters: theaters.filter(t => t.status === 'Pending').length,
        inactiveTheaters: theaters.filter(t => t.status === 'Inactive').length,
        totalRevenue: theaters.reduce((sum, t) => sum + (t.totalRevenue || 0), 0),
        totalBookings: theaters.reduce((sum, t) => sum + (t.totalBookings || 0), 0),
    };

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
        };
        setTheaters([...theaters, newTheater]);
        setShowAddModal(false);
        setPopupMessage({ title: 'Success!', message: `${data.theaterName || data.name} has been added`, type: 'success' });
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
        // Pass the full theater data to the update modal
        setSelectedTheater(row);
        setShowUpdateModal(true);
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
            Cell: (row: any) => {
                const configs: Record<string, { icon: any; color: string }> = {
                    Active: { icon: CheckCircle, color: 'bg-green-100 text-green-700' },
                    Inactive: { icon: XCircle, color: 'bg-red-100 text-red-700' },
                    Pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-700' }
                };
                const config = configs[row.status];
                const Icon = config.icon;
                return (
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                        <Icon className="h-3 w-3" />
                        {row.status}
                    </span>
                );
            }
        },
        {
            Header: 'Revenue',
            accessor: 'totalRevenue',
            sortable: true,
            Cell: (row: any) => (
                <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-green-500" />
                    <span className="text-sm font-medium text-green-600">ETB {(row.totalRevenue || 0).toLocaleString()}</span>
                </div>
            )
        },
        {
            Header: 'Bookings',
            accessor: 'totalBookings',
            sortable: true,
            Cell: (row: any) => (
                <div className="flex items-center gap-1">
                    <Ticket className="h-3 w-3 text-gray-400" />
                    <span className="text-sm text-gray-600">{(row.totalBookings || 0).toLocaleString()}</span>
                </div>
            )
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
                        onClick={() => { setViewingTheater(row); setShowViewModal(true); }}
                        className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                        title="View Details"
                    >
                        <Eye className="h-4 w-4 text-blue-600" />
                    </button>
                    <button
                        onClick={() => handleEditClick(row)}
                        className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 transition-colors"
                        title="Edit Theater"
                    >
                        <Edit className="h-4 w-4 text-teal-600" />
                    </button>
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Building className="h-8 w-8 text-indigo-600" />
                        Theater Management
                    </h1>
                    <p className="text-gray-500 mt-1">Manage all registered theaters, view analytics, and control theater status</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Total Theaters</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.totalTheaters}</p>
                            </div>
                            <div className="p-3 bg-indigo-100 rounded-xl">
                                <Building className="h-6 w-6 text-indigo-600" />
                            </div>
                        </div>
                        <div className="text-sm text-gray-500">
                            {stats.activeTheaters} Active · {stats.pendingTheaters} Pending · {stats.inactiveTheaters} Inactive
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Total Revenue</p>
                                <p className="text-3xl font-bold text-gray-900">ETB {stats.totalRevenue.toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-emerald-100 rounded-xl">
                                <DollarSign className="h-6 w-6 text-emerald-600" />
                            </div>
                        </div>
                        <div className="text-sm text-emerald-600 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            +12% from last month
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Total Bookings</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.totalBookings.toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <Ticket className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                        <div className="text-sm text-gray-500">Lifetime ticket sales</div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Active Rate</p>
                                <p className="text-3xl font-bold text-gray-900">{Math.round((stats.activeTheaters / stats.totalTheaters) * 100)}%</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-xl">
                                <Activity className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                        <div className="text-sm text-gray-500">Theaters currently operating</div>
                    </div>
                </div>

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
                {showViewModal && viewingTheater && (
                    <ViewTheater
                        theater={viewingTheater}
                        isOpen={showViewModal}
                        onClose={() => { setShowViewModal(false); setViewingTheater(null); }}
                    />
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
                    duration={3000}
                    position="top-right"
                />
            </div>
        </div>
    );
};

export default TheaterManagement;