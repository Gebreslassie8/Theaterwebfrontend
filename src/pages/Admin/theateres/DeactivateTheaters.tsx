import React, { useState, useEffect } from 'react';
import { Ban, Eye, XCircle, Filter, Download, Printer, Search, Building2, User, MapPin, Calendar, AlertTriangle, RefreshCw, Power, PowerOff } from 'lucide-react';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';
import axios from 'axios';

interface Theater {
    id: string;
    theaterName: string;
    businessName: string;
    ownerName: string;
    ownerEmail: string;
    ownerPhone: string;
    city: string;
    region: string;
    address: string;
    totalHalls: string;
    totalSeats: string;
    status: 'active' | 'inactive' | 'suspended';
    deactivatedDate?: string;
    deactivationReason?: string;
    deactivatedBy?: string;
    reactivationDate?: string;
    reactivatedBy?: string;
    subscriptionPlan: string;
    joinDate: string;
    lastActiveDate: string;
}

// MOCK DATA FOR DEACTIVATED THEATERS
const MOCK_DEACTIVATED_THEATERS: Theater[] = [
    {
        id: 'TH001',
        theaterName: 'MegaPlex Stadium 20',
        businessName: 'MegaPlex Cinemas',
        ownerName: 'Thomas Anderson',
        ownerEmail: 'thomas@megaplex.com',
        ownerPhone: '+1 (555) 456-7890',
        city: 'Houston',
        region: 'TX',
        address: '1010 Main Street',
        totalHalls: '20',
        totalSeats: '4000',
        status: 'inactive',
        deactivatedDate: '2024-01-20T10:30:00Z',
        deactivationReason: 'Payment overdue for 3 months',
        deactivatedBy: 'System Admin',
        subscriptionPlan: 'Premium',
        joinDate: '2023-06-15T00:00:00Z',
        lastActiveDate: '2024-01-15T20:30:00Z'
    },
    {
        id: 'TH002',
        theaterName: 'Cinema World',
        businessName: 'Cinema World Entertainment',
        ownerName: 'Sarah Johnson',
        ownerEmail: 'sarah@cinemaworld.com',
        ownerPhone: '+1 (555) 789-0123',
        city: 'Miami',
        region: 'FL',
        address: '555 Beach Boulevard',
        totalHalls: '10',
        totalSeats: '1800',
        status: 'suspended',
        deactivatedDate: '2024-01-18T14:15:00Z',
        deactivationReason: 'Violation of terms of service - Unauthorized screening',
        deactivatedBy: 'Compliance Officer',
        subscriptionPlan: 'Standard',
        joinDate: '2023-08-20T00:00:00Z',
        lastActiveDate: '2024-01-10T22:15:00Z'
    },
    {
        id: 'TH003',
        theaterName: 'Luxury Gold Cinema',
        businessName: 'Gold Class Theaters',
        ownerName: 'Robert Chen',
        ownerEmail: 'robert@goldclass.com',
        ownerPhone: '+1 (555) 234-5678',
        city: 'Las Vegas',
        region: 'NV',
        address: '777 Strip Avenue',
        totalHalls: '8',
        totalSeats: '1200',
        status: 'inactive',
        deactivatedDate: '2024-01-15T09:00:00Z',
        deactivationReason: 'Business closure - Owner request',
        deactivatedBy: 'Admin User',
        subscriptionPlan: 'Premium',
        joinDate: '2022-12-10T00:00:00Z',
        lastActiveDate: '2024-01-10T23:45:00Z'
    },
    {
        id: 'TH004',
        theaterName: 'Family Fun Cinema',
        businessName: 'Family Entertainment Group',
        ownerName: 'Emily Davis',
        ownerEmail: 'emily@familyfun.com',
        ownerPhone: '+1 (555) 345-6789',
        city: 'Orlando',
        region: 'FL',
        address: '123 Magic Way',
        totalHalls: '6',
        totalSeats: '900',
        status: 'suspended',
        deactivatedDate: '2024-01-12T11:30:00Z',
        deactivationReason: 'License expired - Pending renewal',
        deactivatedBy: 'System Admin',
        subscriptionPlan: 'Basic',
        joinDate: '2023-03-05T00:00:00Z',
        lastActiveDate: '2024-01-05T19:00:00Z'
    },
    {
        id: 'TH005',
        theaterName: 'Downtown Arts Cinema',
        businessName: 'Arts Cinema Collective',
        ownerName: 'Michael Wong',
        ownerEmail: 'michael@artscinema.com',
        ownerPhone: '+1 (555) 456-7890',
        city: 'Portland',
        region: 'OR',
        address: '888 Cultural District',
        totalHalls: '4',
        totalSeats: '500',
        status: 'inactive',
        deactivatedDate: '2024-01-10T16:45:00Z',
        deactivationReason: 'Voluntary deactivation - Renovations',
        deactivatedBy: 'Theater Owner',
        subscriptionPlan: 'Standard',
        joinDate: '2023-10-01T00:00:00Z',
        lastActiveDate: '2024-01-08T21:30:00Z'
    }
];

// MOCK DATA FOR ACTIVE THEATERS (for deactivation)
const MOCK_ACTIVE_THEATERS: Theater[] = [
    {
        id: 'TH006',
        theaterName: 'Grand Cinema Plus',
        businessName: 'Cinema Plus Entertainment',
        ownerName: 'John Smith',
        ownerEmail: 'john@cinemaplus.com',
        ownerPhone: '+1 (555) 123-4567',
        city: 'New York',
        region: 'NY',
        address: '123 Broadway Street',
        totalHalls: '12',
        totalSeats: '2500',
        status: 'active',
        subscriptionPlan: 'Premium',
        joinDate: '2023-01-15T00:00:00Z',
        lastActiveDate: new Date().toISOString()
    },
    {
        id: 'TH007',
        theaterName: 'Silver Screen Hollywood',
        businessName: 'Silver Screen Theaters',
        ownerName: 'Emily Davis',
        ownerEmail: 'emily@silverscreen.com',
        ownerPhone: '+1 (555) 234-5678',
        city: 'Los Angeles',
        region: 'CA',
        address: '456 Sunset Boulevard',
        totalHalls: '15',
        totalSeats: '3000',
        status: 'active',
        subscriptionPlan: 'Premium',
        joinDate: '2023-03-20T00:00:00Z',
        lastActiveDate: new Date().toISOString()
    },
    {
        id: 'TH008',
        theaterName: 'Star Cinema Arts',
        businessName: 'Star Cinema Group',
        ownerName: 'Michael Wong',
        ownerEmail: 'michael@starcinema.com',
        ownerPhone: '+1 (555) 345-6789',
        city: 'Chicago',
        region: 'IL',
        address: '789 Michigan Avenue',
        totalHalls: '8',
        totalSeats: '1500',
        status: 'active',
        subscriptionPlan: 'Standard',
        joinDate: '2023-06-10T00:00:00Z',
        lastActiveDate: new Date().toISOString()
    }
];

const DeactivateTheaters = () => {
    const [deactivatedTheaters, setDeactivatedTheaters] = useState<Theater[]>([]);
    const [activeTheaters, setActiveTheaters] = useState<Theater[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
    const [showDeactivateForm, setShowDeactivateForm] = useState(false);
    const [showReactivateModal, setShowReactivateModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'deactivated' | 'active'>('deactivated');
    const [useMockData, setUseMockData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Deactivate form state
    const [deactivateReason, setDeactivateReason] = useState('');
    const [deactivateNotes, setDeactivateNotes] = useState('');
    
    // Reactivate confirm state
    const [reactivateConfirm, setReactivateConfirm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            if (useMockData) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                setDeactivatedTheaters(MOCK_DEACTIVATED_THEATERS);
                setActiveTheaters(MOCK_ACTIVE_THEATERS);
            } else {
                const [deactivatedRes, activeRes] = await Promise.all([
                    axios.get('/api/admin/theaters/deactivated'),
                    axios.get('/api/admin/theaters/active')
                ]);
                setDeactivatedTheaters(Array.isArray(deactivatedRes.data) ? deactivatedRes.data : []);
                setActiveTheaters(Array.isArray(activeRes.data) ? activeRes.data : []);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setDeactivatedTheaters(MOCK_DEACTIVATED_THEATERS);
            setActiveTheaters(MOCK_ACTIVE_THEATERS);
            setSuccessMessage('Using mock data - API connection failed');
            setShowSuccess(true);
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivate = async () => {
        if (!selectedTheater) return;
        if (!deactivateReason) {
            setSuccessMessage('❌ Please select a deactivation reason.');
            setShowSuccess(true);
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            if (!useMockData) {
                await axios.post(`/api/admin/theaters/${selectedTheater.id}/deactivate`, {
                    reason: deactivateReason,
                    notes: deactivateNotes,
                    deactivatedBy: 'Admin',
                    deactivatedDate: new Date().toISOString()
                });
            } else {
                await new Promise(resolve => setTimeout(resolve, 500));
                const updatedTheater = {
                    ...selectedTheater,
                    status: 'inactive' as const,
                    deactivatedDate: new Date().toISOString(),
                    deactivationReason: deactivateReason,
                    deactivatedBy: 'Admin'
                };
                setActiveTheaters(prev => prev.filter(t => t.id !== selectedTheater.id));
                setDeactivatedTheaters(prev => [updatedTheater, ...prev]);
            }
            setSuccessMessage(`❌ Theater "${selectedTheater.theaterName}" has been deactivated successfully.`);
            setShowSuccess(true);
            setShowDeactivateForm(false);
            setSelectedTheater(null);
            setDeactivateReason('');
            setDeactivateNotes('');
            if (!useMockData) fetchData();
        } catch (error) {
            console.error('Error deactivating theater:', error);
            setSuccessMessage('❌ Error deactivating theater. Please try again.');
            setShowSuccess(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReactivate = async () => {
        if (!selectedTheater) return;
        if (reactivateConfirm !== 'REACTIVATE') {
            setSuccessMessage('❌ Please type "REACTIVATE" to confirm reactivation.');
            setShowSuccess(true);
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            if (!useMockData) {
                await axios.post(`/api/admin/theaters/${selectedTheater.id}/reactivate`, {
                    reactivatedBy: 'Admin',
                    reactivationDate: new Date().toISOString()
                });
            } else {
                await new Promise(resolve => setTimeout(resolve, 500));
                const updatedTheater = {
                    ...selectedTheater,
                    status: 'active' as const,
                    reactivationDate: new Date().toISOString(),
                    reactivatedBy: 'Admin'
                };
                setDeactivatedTheaters(prev => prev.filter(t => t.id !== selectedTheater.id));
                setActiveTheaters(prev => [updatedTheater, ...prev]);
            }
            setSuccessMessage(`✅ Theater "${selectedTheater.theaterName}" has been reactivated successfully.`);
            setShowSuccess(true);
            setShowReactivateModal(false);
            setSelectedTheater(null);
            setReactivateConfirm('');
            if (!useMockData) fetchData();
        } catch (error) {
            console.error('Error reactivating theater:', error);
            setSuccessMessage('❌ Error reactivating theater. Please try again.');
            setShowSuccess(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleView = (theater: Theater) => {
        setSelectedTheater(theater);
        setShowViewModal(true);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleExport = () => {
        const currentData = activeTab === 'deactivated' ? deactivatedTheaters : activeTheaters;
        const exportData = currentData.map(theater => ({
            'Theater Name': theater.theaterName,
            'Business Name': theater.businessName,
            'Owner': theater.ownerName,
            'Email': theater.ownerEmail,
            'Phone': theater.ownerPhone,
            'Location': `${theater.city}, ${theater.region}`,
            'Halls': theater.totalHalls,
            'Seats': theater.totalSeats,
            'Status': theater.status,
            'Subscription': theater.subscriptionPlan,
            'Join Date': new Date(theater.joinDate).toLocaleDateString(),
            'Last Active': new Date(theater.lastActiveDate).toLocaleDateString(),
            ...(theater.deactivatedDate && { 'Deactivated Date': new Date(theater.deactivatedDate).toLocaleDateString() }),
            ...(theater.deactivationReason && { 'Deactivation Reason': theater.deactivationReason })
        }));
        
        const csv = convertToCSV(exportData);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${activeTab}-theaters-${new Date().toISOString()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        setSuccessMessage('✅ Export completed successfully!');
        setShowSuccess(true);
    };

    const convertToCSV = (data: any[]) => {
        if (data.length === 0) return '';
        const headers = Object.keys(data[0]);
        const csvRows = [
            headers.join(','),
            ...data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
        ];
        return csvRows.join('\n');
    };

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'active':
                return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">✅ Active</span>;
            case 'inactive':
                return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">🔴 Inactive</span>;
            case 'suspended':
                return <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">⚠️ Suspended</span>;
            default:
                return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    // Columns for Deactivated Theaters
    const deactivatedColumns = [
        { 
            Header: 'Theater Name',
            accessor: 'theaterName',
            sortable: true,
            Cell: (row: Theater) => (
                <div>
                    <div className="font-medium text-gray-900">{row.theaterName || '-'}</div>
                    <div className="text-xs text-gray-500">ID: {row.id || '-'}</div>
                </div>
            )
        },
        { 
            Header: 'Owner',
            accessor: 'ownerName',
            sortable: true,
            Cell: (row: Theater) => (
                <div>
                    <div className="text-sm font-medium">{row.ownerName || '-'}</div>
                    <div className="text-xs text-gray-500">{row.ownerEmail || '-'}</div>
                </div>
            )
        },
        { 
            Header: 'Location',
            accessor: 'city',
            sortable: true,
            Cell: (row: Theater) => (
                <div className="text-sm">
                    {row.city || '-'}, {row.region || '-'}
                </div>
            )
        },
        { 
            Header: 'Halls/Seats',
            accessor: 'totalHalls',
            sortable: true,
            Cell: (row: Theater) => (
                <div className="text-sm">
                    {row.totalHalls || '0'} Halls | {row.totalSeats || '0'} Seats
                </div>
            )
        },
        { 
            Header: 'Deactivated Date',
            accessor: 'deactivatedDate',
            sortable: true,
            Cell: (row: Theater) => (
                <div className="text-sm">
                    {row.deactivatedDate ? new Date(row.deactivatedDate).toLocaleDateString() : '-'}
                </div>
            )
        },
        { 
            Header: 'Status',
            accessor: 'status',
            sortable: true,
            Cell: (row: Theater) => getStatusBadge(row.status)
        },
        { 
            Header: 'Actions',
            accessor: 'actions',
            sortable: false,
            Cell: (row: Theater) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleView(row)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => {
                            setSelectedTheater(row);
                            setShowReactivateModal(true);
                        }}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Reactivate"
                    >
                        <Power className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    // Columns for Active Theaters
    const activeColumns = [
        { 
            Header: 'Theater Name',
            accessor: 'theaterName',
            sortable: true,
            Cell: (row: Theater) => (
                <div>
                    <div className="font-medium text-gray-900">{row.theaterName || '-'}</div>
                    <div className="text-xs text-gray-500">ID: {row.id || '-'}</div>
                </div>
            )
        },
        { 
            Header: 'Owner',
            accessor: 'ownerName',
            sortable: true,
            Cell: (row: Theater) => (
                <div>
                    <div className="text-sm font-medium">{row.ownerName || '-'}</div>
                    <div className="text-xs text-gray-500">{row.ownerEmail || '-'}</div>
                </div>
            )
        },
        { 
            Header: 'Location',
            accessor: 'city',
            sortable: true,
            Cell: (row: Theater) => (
                <div className="text-sm">
                    {row.city || '-'}, {row.region || '-'}
                </div>
            )
        },
        { 
            Header: 'Halls/Seats',
            accessor: 'totalHalls',
            sortable: true,
            Cell: (row: Theater) => (
                <div className="text-sm">
                    {row.totalHalls || '0'} Halls | {row.totalSeats || '0'} Seats
                </div>
            )
        },
        { 
            Header: 'Join Date',
            accessor: 'joinDate',
            sortable: true,
            Cell: (row: Theater) => (
                <div className="text-sm">
                    {row.joinDate ? new Date(row.joinDate).toLocaleDateString() : '-'}
                </div>
            )
        },
        { 
            Header: 'Status',
            accessor: 'status',
            sortable: true,
            Cell: (row: Theater) => getStatusBadge(row.status)
        },
        { 
            Header: 'Actions',
            accessor: 'actions',
            sortable: false,
            Cell: (row: Theater) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleView(row)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => {
                            setSelectedTheater(row);
                            setShowDeactivateForm(true);
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Deactivate"
                    >
                        <PowerOff className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    // Filter data based on search
    const filterData = (data: Theater[]) => {
        return data.filter(item => {
            const matchesSearch = searchTerm === '' || 
                item.theaterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.ownerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.city?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSearch;
        });
    };

    const filteredDeactivated = filterData(deactivatedTheaters);
    const filteredActive = filterData(activeTheaters);

    const stats = {
        totalDeactivated: deactivatedTheaters.length,
        totalActive: activeTheaters.length,
        suspended: deactivatedTheaters.filter(t => t.status === 'suspended').length,
        inactive: deactivatedTheaters.filter(t => t.status === 'inactive').length
    };

    const currentData = activeTab === 'deactivated' ? filteredDeactivated : filteredActive;
    const currentColumns = activeTab === 'deactivated' ? deactivatedColumns : activeColumns;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                            <Ban className="w-6 h-6 text-red-600" />
                            Theater Management
                        </h1>
                        <p className="text-gray-600 mt-1">Manage active and deactivated theaters</p>
                    </div>
                    <div className="flex gap-2">
                        {useMockData && (
                            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                📊 Mock Data Mode
                            </div>
                        )}
                        <button
                            onClick={() => {
                                setUseMockData(!useMockData);
                                fetchData();
                            }}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Refresh Data"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
                    <div className="text-sm text-gray-600">Active Theaters</div>
                    <div className="text-2xl font-bold text-green-600">{stats.totalActive}</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-red-500">
                    <div className="text-sm text-gray-600">Deactivated Theaters</div>
                    <div className="text-2xl font-bold text-red-600">{stats.totalDeactivated}</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-orange-500">
                    <div className="text-sm text-gray-600">Suspended</div>
                    <div className="text-2xl font-bold text-orange-600">{stats.suspended}</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-gray-500">
                    <div className="text-sm text-gray-600">Inactive</div>
                    <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
                <div className="flex border-b">
                    <button
                        onClick={() => setActiveTab('deactivated')}
                        className={`px-6 py-3 text-sm font-medium transition-colors ${
                            activeTab === 'deactivated'
                                ? 'text-red-600 border-b-2 border-red-600'
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <Ban className="w-4 h-4" />
                            Deactivated Theaters ({stats.totalDeactivated})
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`px-6 py-3 text-sm font-medium transition-colors ${
                            activeTab === 'active'
                                ? 'text-green-600 border-b-2 border-green-600'
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <Power className="w-4 h-4" />
                            Active Theaters ({stats.totalActive})
                        </div>
                    </button>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by theater, owner, email, or city..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                    </div>

                    <ReusableButton 
                        size="sm" 
                        variant="secondary" 
                        icon={Download}
                        onClick={handleExport}
                    >
                        Export
                    </ReusableButton>
                    
                    <ReusableButton 
                        size="sm" 
                        variant="secondary" 
                        icon={Printer}
                        onClick={handlePrint}
                    >
                        Print
                    </ReusableButton>
                </div>
            </div>

            {/* ReusableTable */}
            <ReusableTable
                columns={currentColumns}
                data={currentData}
                title={activeTab === 'deactivated' ? 'Deactivated Theaters' : 'Active Theaters'}
                icon={activeTab === 'deactivated' ? Ban : Power}
                showSearch={false}
                showExport={false}
                showPrint={false}
                itemsPerPage={10}
                itemsPerPageOptions={[10, 25, 50, 100]}
            />

            {/* View Details Modal */}
            {showViewModal && selectedTheater && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold">Theater Details</h2>
                                <p className="text-sm text-gray-500">Complete theater information</p>
                            </div>
                            <button onClick={() => setShowViewModal(false)} className="text-gray-500 hover:text-gray-700">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            {/* Basic Information */}
                            <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg">
                                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-blue-800">
                                    <Building2 className="w-5 h-5" />
                                    Theater Information
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><span className="text-sm text-gray-600">Theater Name:</span><br/><span className="font-medium">{selectedTheater.theaterName || '-'}</span></div>
                                    <div><span className="text-sm text-gray-600">Business Name:</span><br/>{selectedTheater.businessName || '-'}</div>
                                    <div><span className="text-sm text-gray-600">Total Halls:</span><br/>{selectedTheater.totalHalls || '0'}</div>
                                    <div><span className="text-sm text-gray-600">Total Seats:</span><br/>{selectedTheater.totalSeats || '0'}</div>
                                    <div><span className="text-sm text-gray-600">Subscription Plan:</span><br/>{selectedTheater.subscriptionPlan || '-'}</div>
                                    <div><span className="text-sm text-gray-600">Status:</span><br/>{getStatusBadge(selectedTheater.status)}</div>
                                </div>
                            </div>

                            {/* Owner Information */}
                            <div className="bg-gradient-to-r from-green-50 to-white p-4 rounded-lg">
                                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-green-800">
                                    <User className="w-5 h-5" />
                                    Owner Information
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><span className="text-sm text-gray-600">Owner Name:</span><br/><span className="font-medium">{selectedTheater.ownerName || '-'}</span></div>
                                    <div><span className="text-sm text-gray-600">Email:</span><br/>{selectedTheater.ownerEmail || '-'}</div>
                                    <div><span className="text-sm text-gray-600">Phone:</span><br/>{selectedTheater.ownerPhone || '-'}</div>
                                </div>
                            </div>

                            {/* Location Information */}
                            <div className="bg-gradient-to-r from-purple-50 to-white p-4 rounded-lg">
                                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-purple-800">
                                    <MapPin className="w-5 h-5" />
                                    Location
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><span className="text-sm text-gray-600">Address:</span><br/>{selectedTheater.address || '-'}</div>
                                    <div><span className="text-sm text-gray-600">City:</span><br/>{selectedTheater.city || '-'}</div>
                                    <div><span className="text-sm text-gray-600">Region:</span><br/>{selectedTheater.region || '-'}</div>
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="bg-gradient-to-r from-orange-50 to-white p-4 rounded-lg">
                                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-orange-800">
                                    <Calendar className="w-5 h-5" />
                                    Important Dates
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><span className="text-sm text-gray-600">Join Date:</span><br/>{new Date(selectedTheater.joinDate).toLocaleDateString()}</div>
                                    <div><span className="text-sm text-gray-600">Last Active:</span><br/>{new Date(selectedTheater.lastActiveDate).toLocaleDateString()}</div>
                                    {selectedTheater.deactivatedDate && (
                                        <div><span className="text-sm text-gray-600">Deactivated Date:</span><br/>{new Date(selectedTheater.deactivatedDate).toLocaleDateString()}</div>
                                    )}
                                    {selectedTheater.reactivationDate && (
                                        <div><span className="text-sm text-gray-600">Reactivated Date:</span><br/>{new Date(selectedTheater.reactivationDate).toLocaleDateString()}</div>
                                    )}
                                </div>
                            </div>

                            {/* Deactivation Info */}
                            {selectedTheater.deactivationReason && (
                                <div className="bg-gradient-to-r from-red-50 to-white p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-red-800">
                                        <AlertTriangle className="w-5 h-5" />
                                        Deactivation Information
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div><span className="text-sm text-gray-600">Reason:</span><br/>{selectedTheater.deactivationReason}</div>
                                        {selectedTheater.deactivatedBy && (
                                            <div><span className="text-sm text-gray-600">Deactivated By:</span><br/>{selectedTheater.deactivatedBy}</div>
                                        )}
                                        {selectedTheater.reactivatedBy && (
                                            <div><span className="text-sm text-gray-600">Reactivated By:</span><br/>{selectedTheater.reactivatedBy}</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
                            <ReusableButton variant="secondary" onClick={() => setShowViewModal(false)}>
                                Close
                            </ReusableButton>
                        </div>
                    </div>
                </div>
            )}

            {/* Deactivate Form Modal - Fully Functional with Cancel and Deactivate Buttons */}
            {showDeactivateForm && selectedTheater && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
                        {/* Header */}
                        <div className="border-b px-6 py-4 bg-red-50 rounded-t-lg">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 rounded-full">
                                    <PowerOff className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Deactivate Theater</h2>
                                    <p className="text-sm text-gray-600 mt-1">Theater: {selectedTheater.theaterName}</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Body */}
                        <div className="p-6">
                            <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                                <p className="text-sm text-red-800 flex items-start gap-2">
                                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span>⚠️ Warning: This action will deactivate the theater immediately. All shows, bookings, and operations will be suspended.</span>
                                </p>
                            </div>
                            
                            {/* Deactivation Reason Dropdown */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Deactivation Reason <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={deactivateReason}
                                    onChange={(e) => setDeactivateReason(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                                    required
                                >
                                    <option value="">Select Deactivation Reason</option>
                                    <option value="payment_overdue">💳 Payment Overdue</option>
                                    <option value="terms_violation">🚫 Terms of Service Violation</option>
                                    <option value="business_closure">🏢 Business Closure</option>
                                    <option value="license_expired">📄 License Expired</option>
                                    <option value="inactive_account">⏰ Inactive Account</option>
                                    <option value="owner_request">📝 Owner Request</option>
                                    <option value="other">📌 Other</option>
                                </select>
                            </div>
                            
                            {/* Additional Notes Textarea */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Additional Notes
                                </label>
                                <textarea
                                    value={deactivateNotes}
                                    onChange={(e) => setDeactivateNotes(e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
                                    placeholder="Provide more details about the deactivation..."
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {deactivateNotes.length} / 500 characters
                                </p>
                            </div>
                        </div>
                        
                        {/* Footer with Cancel and Deactivate Buttons */}
                        <div className="border-t px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowDeactivateForm(false);
                                    setSelectedTheater(null);
                                    setDeactivateReason('');
                                    setDeactivateNotes('');
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeactivate}
                                disabled={isSubmitting || !deactivateReason}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <PowerOff className="w-4 h-4" />
                                        Confirm Deactivation
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reactivate Confirmation Modal - Fully Functional with Cancel and Reactivate Buttons */}
            {showReactivateModal && selectedTheater && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
                        {/* Header */}
                        <div className="border-b px-6 py-4 bg-green-50 rounded-t-lg">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-full">
                                    <Power className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Reactivate Theater</h2>
                                    <p className="text-sm text-gray-600 mt-1">Theater: {selectedTheater.theaterName}</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Body */}
                        <div className="p-6">
                            <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                <p className="text-sm text-yellow-800 flex items-start gap-2">
                                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span>⚠️ This action will restore full access to the theater. All operations will be resumed.</span>
                                </p>
                            </div>
                            
                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700">
                                    <span className="font-medium">Previous Deactivation Reason:</span><br/>
                                    {selectedTheater.deactivationReason || 'Not specified'}
                                </p>
                                {selectedTheater.deactivatedBy && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Deactivated by: {selectedTheater.deactivatedBy} on {selectedTheater.deactivatedDate && new Date(selectedTheater.deactivatedDate).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                            
                            {/* Confirmation Input */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Type <span className="font-bold text-green-600">"REACTIVATE"</span> to confirm
                                </label>
                                <input
                                    type="text"
                                    value={reactivateConfirm}
                                    onChange={(e) => setReactivateConfirm(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none font-mono"
                                    placeholder="REACTIVATE"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Please type exactly: REACTIVATE (all uppercase)
                                </p>
                            </div>
                        </div>
                        
                        {/* Footer with Cancel and Reactivate Buttons */}
                        <div className="border-t px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowReactivateModal(false);
                                    setSelectedTheater(null);
                                    setReactivateConfirm('');
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReactivate}
                                disabled={isSubmitting || reactivateConfirm !== 'REACTIVATE'}
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Power className="w-4 h-4" />
                                        Confirm Reactivation
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Popup */}
            {showSuccess && (
                <SuccessPopup
                    message={successMessage}
                    onClose={() => setShowSuccess(false)}
                    duration={4000}
                />
            )}
        </div>
    );
};

export default DeactivateTheaters;