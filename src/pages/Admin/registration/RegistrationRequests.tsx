// src/pages/Admin/registration/RegistrationRequests.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    FileCheck,
    Clock,
    CheckCircle,
    XCircle,
    FileText,
    Eye,
    Download,
    UserPlus,
    Mail,
    Phone,
    MapPin,
    Building,
    Calendar,
    AlertCircle,
    Search,
    Filter,
    ChevronDown,
    ChevronRight,
    Star,
    Shield,
    Award,
    Briefcase,
    Users,
    DollarSign,
    Upload,
    Trash2,
    RefreshCw,
    Printer,
    Check,
    X,
    MessageCircle,
    Send,
    MoreVertical,
    CreditCard,
    Landmark,
    Smartphone,
    TrendingUp,
    Wallet,
    Banknote,
    UserCheck,
    UserX
} from 'lucide-react';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';
import ReusableTable from '../../../components/Reusable/ReusableTable';

// Types
interface RegistrationRequest {
    id: string;
    businessName: string;
    ownerName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    registrationDate: string;
    status: 'pending' | 'approved' | 'rejected';
    documents: {
        businessLicense: string;
        taxCertificate: string;
        bankStatement: string;
        idCard: string;
    };
    businessType: 'cinema' | 'theater' | 'multiplex';
    capacity: number;
    screens: number;
    estimatedRevenue: number;
    notes?: string;
    approvedBy?: string;
    approvedDate?: string;
    rejectedBy?: string;
    rejectedDate?: string;
    rejectionReason?: string;
}

// Mock Data
const mockRequests: RegistrationRequest[] = [
    {
        id: 'REG-001',
        businessName: 'Grand Cinema',
        ownerName: 'John Smith',
        email: 'john@grandcinema.com',
        phone: '+251 911 234 567',
        address: 'Bole Road',
        city: 'Addis Ababa',
        registrationDate: '2024-04-01',
        status: 'pending',
        documents: {
            businessLicense: 'license_grand.pdf',
            taxCertificate: 'tax_grand.pdf',
            bankStatement: 'bank_grand.pdf',
            idCard: 'id_john.pdf'
        },
        businessType: 'cinema',
        capacity: 500,
        screens: 5,
        estimatedRevenue: 250000
    },
    {
        id: 'REG-002',
        businessName: 'Sunset Theater',
        ownerName: 'Sarah Johnson',
        email: 'sarah@sunsets.com',
        phone: '+251 912 345 678',
        address: 'Piassa',
        city: 'Addis Ababa',
        registrationDate: '2024-04-02',
        status: 'pending',
        documents: {
            businessLicense: 'license_sunset.pdf',
            taxCertificate: 'tax_sunset.pdf',
            bankStatement: 'bank_sunset.pdf',
            idCard: 'id_sarah.pdf'
        },
        businessType: 'theater',
        capacity: 350,
        screens: 3,
        estimatedRevenue: 180000
    },
    {
        id: 'REG-003',
        businessName: 'City Mall Cinema',
        ownerName: 'Michael Chen',
        email: 'michael@citymall.com',
        phone: '+251 913 456 789',
        address: 'Megenagna',
        city: 'Addis Ababa',
        registrationDate: '2024-04-03',
        status: 'pending',
        documents: {
            businessLicense: 'license_city.pdf',
            taxCertificate: 'tax_city.pdf',
            bankStatement: 'bank_city.pdf',
            idCard: 'id_michael.pdf'
        },
        businessType: 'multiplex',
        capacity: 800,
        screens: 8,
        estimatedRevenue: 450000
    },
    {
        id: 'REG-004',
        businessName: 'Mega Theater',
        ownerName: 'Emily Davis',
        email: 'emily@megatheater.com',
        phone: '+251 914 567 890',
        address: 'Mexico',
        city: 'Addis Ababa',
        registrationDate: '2024-03-28',
        status: 'approved',
        documents: {
            businessLicense: 'license_mega.pdf',
            taxCertificate: 'tax_mega.pdf',
            bankStatement: 'bank_mega.pdf',
            idCard: 'id_emily.pdf'
        },
        businessType: 'multiplex',
        capacity: 1200,
        screens: 10,
        estimatedRevenue: 680000,
        approvedBy: 'Admin User',
        approvedDate: '2024-03-30'
    },
    {
        id: 'REG-005',
        businessName: 'Premier Cinemas',
        ownerName: 'Robert Wilson',
        email: 'robert@premier.com',
        phone: '+251 915 678 901',
        address: 'CMC',
        city: 'Addis Ababa',
        registrationDate: '2024-03-25',
        status: 'rejected',
        documents: {
            businessLicense: 'license_premier.pdf',
            taxCertificate: 'tax_premier.pdf',
            bankStatement: 'bank_premier.pdf',
            idCard: 'id_robert.pdf'
        },
        businessType: 'cinema',
        capacity: 450,
        screens: 4,
        estimatedRevenue: 220000,
        rejectionReason: 'Incomplete documentation. Business license expired.',
        rejectedBy: 'Admin User',
        rejectedDate: '2024-03-27'
    }
];

const RegistrationRequests: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [requests, setRequests] = useState<RegistrationRequest[]>(mockRequests);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState<RegistrationRequest | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showDocumentsModal, setShowDocumentsModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });

    // Determine active tab based on route
    const getActiveTab = () => {
        const path = location.pathname;
        if (path.includes('/pending')) return 'pending';
        if (path.includes('/approve')) return 'approve';
        if (path.includes('/reject')) return 'reject';
        if (path.includes('/documents')) return 'documents';
        return 'all';
    };

    const [activeTab, setActiveTab] = useState(getActiveTab());

    // Update active tab when route changes
    React.useEffect(() => {
        setActiveTab(getActiveTab());
    }, [location.pathname]);

    // Filter requests based on active tab
    const getFilteredRequests = () => {
        let filtered = requests;

        // Filter by status based on tab
        if (activeTab === 'pending') {
            filtered = filtered.filter(r => r.status === 'pending');
        } else if (activeTab === 'approve') {
            filtered = filtered.filter(r => r.status === 'approved');
        } else if (activeTab === 'reject') {
            filtered = filtered.filter(r => r.status === 'rejected');
        }

        // Apply search
        if (searchTerm) {
            filtered = filtered.filter(r =>
                r.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.id.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    };

    const filteredRequests = getFilteredRequests();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'ETB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3" /> Pending</span>;
            case 'approved':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /> Approved</span>;
            case 'rejected':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"><XCircle className="h-3 w-3" /> Rejected</span>;
            default:
                return null;
        }
    };

    const handleApprove = () => {
        if (selectedRequest) {
            setRequests(requests.map(req =>
                req.id === selectedRequest.id
                    ? {
                        ...req,
                        status: 'approved',
                        approvedBy: 'Admin User',
                        approvedDate: new Date().toISOString().split('T')[0]
                    }
                    : req
            ));
            setShowApproveModal(false);
            setPopupMessage({
                title: 'Registration Approved!',
                message: `${selectedRequest.businessName} has been approved. An email notification has been sent.`,
                type: 'success'
            });
            setShowSuccessPopup(true);
            setSelectedRequest(null);
        }
    };

    const handleReject = () => {
        if (selectedRequest && rejectionReason) {
            setRequests(requests.map(req =>
                req.id === selectedRequest.id
                    ? {
                        ...req,
                        status: 'rejected',
                        rejectionReason: rejectionReason,
                        rejectedBy: 'Admin User',
                        rejectedDate: new Date().toISOString().split('T')[0]
                    }
                    : req
            ));
            setShowRejectModal(false);
            setRejectionReason('');
            setPopupMessage({
                title: 'Registration Rejected',
                message: `${selectedRequest.businessName} has been rejected. Reason: ${rejectionReason}`,
                type: 'warning'
            });
            setShowSuccessPopup(true);
            setSelectedRequest(null);
        }
    };

    // Tab configuration
    const tabs = [
        { id: 'all', label: 'All Requests', icon: FileCheck, route: '/admin/registration', color: 'emerald' },
        { id: 'pending', label: 'Pending Approval', icon: Clock, route: '/admin/theater-accounts/pending', color: 'yellow' },
        { id: 'approve', label: 'Approved', icon: CheckCircle, route: '/admin/registration/approve', color: 'green' },
        { id: 'reject', label: 'Rejected', icon: XCircle, route: '/admin/registration/reject', color: 'red' },
        { id: 'documents', label: 'Documents', icon: FileText, route: '/admin/registration/documents', color: 'blue' }
    ];

    // Stats for each tab
    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'pending').length,
        approved: requests.filter(r => r.status === 'approved').length,
        rejected: requests.filter(r => r.status === 'rejected').length
    };

    // Table Columns
    const columns = [
        {
            Header: 'Business',
            accessor: 'businessName',
            sortable: true,
            Cell: (row: RegistrationRequest) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">
                        {row.businessName.charAt(0)}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{row.businessName}</p>
                        <p className="text-xs text-gray-500">{row.ownerName}</p>
                    </div>
                </div>
            )
        },
        {
            Header: 'Contact',
            accessor: 'email',
            sortable: true,
            Cell: (row: RegistrationRequest) => (
                <div>
                    <p className="text-sm text-gray-900">{row.email}</p>
                    <p className="text-xs text-gray-500">{row.phone}</p>
                </div>
            )
        },
        {
            Header: 'Location',
            accessor: 'city',
            sortable: true,
            Cell: (row: RegistrationRequest) => (
                <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-sm text-gray-600">{row.city}</span>
                </div>
            )
        },
        {
            Header: 'Registration Date',
            accessor: 'registrationDate',
            sortable: true,
            Cell: (row: RegistrationRequest) => (
                <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-sm text-gray-600">{formatDate(row.registrationDate)}</span>
                </div>
            )
        },
        {
            Header: 'Status',
            accessor: 'status',
            sortable: true,
            Cell: (row: RegistrationRequest) => getStatusBadge(row.status)
        }
    ];

    // Action Buttons based on tab
    const getActions = () => {
        const baseActions = [
            {
                label: 'View Details',
                icon: Eye,
                onClick: (row: RegistrationRequest) => {
                    setSelectedRequest(row);
                    setShowDetailsModal(true);
                },
                color: 'info' as const
            },
            {
                label: 'View Documents',
                icon: FileText,
                onClick: (row: RegistrationRequest) => {
                    setSelectedRequest(row);
                    setShowDocumentsModal(true);
                },
                color: 'secondary' as const
            }
        ];

        if (activeTab === 'pending') {
            baseActions.push(
                {
                    label: 'Approve',
                    icon: CheckCircle,
                    onClick: (row: RegistrationRequest) => {
                        setSelectedRequest(row);
                        setShowApproveModal(true);
                    },
                    color: 'success' as const
                },
                {
                    label: 'Reject',
                    icon: XCircle,
                    onClick: (row: RegistrationRequest) => {
                        setSelectedRequest(row);
                        setShowRejectModal(true);
                    },
                    color: 'danger' as const
                }
            );
        }

        return baseActions;
    };

    const handleTabChange = (tab: typeof tabs[0]) => {
        navigate(tab.route);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                                    <FileCheck className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Registration Requests</h1>
                                    <p className="text-gray-500 text-sm">Manage theater registration requests and approvals</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <ReusableButton
                                onClick={() => {
                                    setSearchTerm('');
                                }}
                                icon="RefreshCw"
                                label="Refresh"
                                variant="secondary"
                                className="px-4 py-2 text-sm"
                            />
                            <ReusableButton
                                onClick={() => {
                                    const csvContent = [
                                        ['ID', 'Business Name', 'Owner', 'Email', 'Phone', 'City', 'Registration Date', 'Status'],
                                        ...filteredRequests.map(r => [r.id, r.businessName, r.ownerName, r.email, r.phone, r.city, r.registrationDate, r.status])
                                    ].map(row => row.join(',')).join('\n');
                                    const blob = new Blob([csvContent], { type: 'text/csv' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `registration_requests_${new Date().toISOString().split('T')[0]}.csv`;
                                    a.click();
                                    URL.revokeObjectURL(url);
                                }}
                                icon="Download"
                                label="Export"
                                variant="secondary"
                                className="px-4 py-2 text-sm"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                        onClick={() => handleTabChange(tabs[0])}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                                <FileCheck className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-emerald-600">{stats.total}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-600">Total Requests</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                        onClick={() => handleTabChange(tabs[1])}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                                <Clock className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-yellow-600">{stats.pending}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                        {stats.pending > 0 && (
                            <p className="text-xs text-yellow-600 mt-1">Awaiting action</p>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                        onClick={() => handleTabChange(tabs[2])}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                                <CheckCircle className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-green-600">{stats.approved}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-600">Approved</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                        onClick={() => handleTabChange(tabs[3])}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                                <XCircle className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-red-600">{stats.rejected}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-600">Rejected</p>
                    </motion.div>
                </div>

                {/* Tabs Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-6"
                >
                    <div className="border-b border-gray-200">
                        <nav className="flex flex-wrap gap-1 -mb-px">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleTabChange(tab)}
                                        className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all rounded-t-lg ${isActive
                                                ? `border-b-2 border-${tab.color}-500 text-${tab.color}-600 bg-${tab.color}-50`
                                                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {tab.label}
                                        {tab.id === 'pending' && stats.pending > 0 && (
                                            <span className={`ml-1 px-2 py-0.5 text-xs rounded-full bg-${tab.color}-100 text-${tab.color}-700`}>
                                                {stats.pending}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </motion.div>

                {/* Info Banner for Pending Tab */}
                {activeTab === 'pending' && stats.pending > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200"
                    >
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-yellow-800">Pending Registrations</p>
                                <p className="text-xs text-yellow-700 mt-1">
                                    You have {stats.pending} registration request{stats.pending !== 1 ? 's' : ''} pending approval.
                                    Please review each request carefully before making a decision.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap items-center justify-between gap-4 mb-6"
                >
                    <div className="relative flex-1 min-w-[280px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by business, owner, email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                        />
                    </div>
                    <div className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
                        {filteredRequests.length} requests found
                    </div>
                </motion.div>

                {/* Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                >
                    <ReusableTable
                        columns={columns}
                        data={filteredRequests}
                        actions={getActions()}
                        title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Registration Requests`}
                        icon={tabs.find(t => t.id === activeTab)?.icon || FileCheck}
                        showSearch={false}
                        showExport={false}
                        showPrint={false}
                        itemsPerPage={10}
                    />
                </motion.div>

                {/* Details Modal */}
                <AnimatePresence>
                    {showDetailsModal && selectedRequest && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDetailsModal(false)}>
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg shadow-md">
                                            <FileCheck className="h-5 w-5 text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Registration Details</h2>
                                    </div>
                                    <button onClick={() => setShowDetailsModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                                        <XCircle className="h-5 w-5 text-gray-500" />
                                    </button>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
                                                        {selectedRequest.businessName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900">{selectedRequest.businessName}</h3>
                                                        <p className="text-sm text-gray-500">ID: {selectedRequest.id}</p>
                                                    </div>
                                                </div>
                                                {getStatusBadge(selectedRequest.status)}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Owner Name</p>
                                            <p className="font-medium text-gray-900 mt-1">{selectedRequest.ownerName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Business Type</p>
                                            <p className="font-medium text-gray-900 mt-1 capitalize">{selectedRequest.businessType}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                                            <p className="text-sm text-gray-900 mt-1">{selectedRequest.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                                            <p className="text-sm text-gray-900 mt-1">{selectedRequest.phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Address</p>
                                            <p className="text-sm text-gray-900 mt-1">{selectedRequest.address}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">City</p>
                                            <p className="text-sm text-gray-900 mt-1">{selectedRequest.city}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Capacity</p>
                                            <p className="text-sm text-gray-900 mt-1">{selectedRequest.capacity.toLocaleString()} seats</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Screens</p>
                                            <p className="text-sm text-gray-900 mt-1">{selectedRequest.screens}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Registration Date</p>
                                            <p className="text-sm text-gray-900 mt-1">{formatDate(selectedRequest.registrationDate)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Est. Monthly Revenue</p>
                                            <p className="text-sm font-semibold text-emerald-600 mt-1">{formatCurrency(selectedRequest.estimatedRevenue)}</p>
                                        </div>
                                        {selectedRequest.approvedBy && (
                                            <>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Approved By</p>
                                                    <p className="text-sm text-gray-900 mt-1">{selectedRequest.approvedBy}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Approved Date</p>
                                                    <p className="text-sm text-gray-900 mt-1">{formatDate(selectedRequest.approvedDate!)}</p>
                                                </div>
                                            </>
                                        )}
                                        {selectedRequest.rejectionReason && (
                                            <div className="col-span-2">
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Rejection Reason</p>
                                                <div className="mt-1 p-3 bg-red-50 rounded-lg">
                                                    <p className="text-sm text-red-700">{selectedRequest.rejectionReason}</p>
                                                </div>
                                                {selectedRequest.rejectedBy && (
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        Rejected by {selectedRequest.rejectedBy} on {formatDate(selectedRequest.rejectedDate!)}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Documents Modal */}
                <AnimatePresence>
                    {showDocumentsModal && selectedRequest && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDocumentsModal(false)}>
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <FileText className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Supporting Documents</h2>
                                    </div>
                                    <button onClick={() => setShowDocumentsModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                                        <XCircle className="h-5 w-5 text-gray-500" />
                                    </button>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="space-y-3">
                                        {Object.entries(selectedRequest.documents).map(([key, value]) => (
                                            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                                <div className="flex items-center gap-3">
                                                    <FileText className="h-5 w-5 text-emerald-600" />
                                                    <div>
                                                        <p className="font-medium text-gray-900 capitalize">
                                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                                        </p>
                                                        <p className="text-xs text-gray-500">{value}</p>
                                                    </div>
                                                </div>
                                                <button className="p-1.5 hover:bg-white rounded-lg transition">
                                                    <Download className="h-4 w-4 text-gray-500" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Approve Modal */}
                <AnimatePresence>
                    {showApproveModal && selectedRequest && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowApproveModal(false)}>
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <CheckCircle className="h-6 w-6 text-green-600" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">Approve Registration</h3>
                                    </div>
                                    <p className="text-gray-600 mb-4">
                                        Are you sure you want to approve <strong>{selectedRequest.businessName}</strong>'s registration?
                                    </p>
                                    <div className="p-3 bg-green-50 rounded-lg mb-6">
                                        <p className="text-sm text-green-800 font-medium mb-2">This will:</p>
                                        <ul className="text-sm text-green-700 space-y-1">
                                            <li className="flex items-center gap-2">✓ Activate the theater account</li>
                                            <li className="flex items-center gap-2">✓ Send approval email to the owner</li>
                                            <li className="flex items-center gap-2">✓ Add theater to the system</li>
                                        </ul>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowApproveModal(false)}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleApprove}
                                            className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition font-medium shadow-md"
                                        >
                                            Approve Registration
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Reject Modal */}
                <AnimatePresence>
                    {showRejectModal && selectedRequest && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowRejectModal(false)}>
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-red-100 rounded-lg">
                                            <XCircle className="h-6 w-6 text-red-600" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">Reject Registration</h3>
                                    </div>
                                    <p className="text-gray-600 mb-4">
                                        Are you sure you want to reject <strong>{selectedRequest.businessName}</strong>'s registration?
                                    </p>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Reason for rejection <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            rows={3}
                                            placeholder="Please provide a reason for rejection..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowRejectModal(false)}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleReject}
                                            disabled={!rejectionReason}
                                            className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Reject Registration
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

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
        </div>
    );
};

export default RegistrationRequests;