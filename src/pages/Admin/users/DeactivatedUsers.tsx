// src/pages/Admin/users/DeactivatedUsers.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UserX,
    UserCheck,
    Calendar,
    Clock,
    Mail,
    Phone,
    AlertCircle,
    Search,
    Filter,
    Eye,
    Edit,
    RefreshCw,
    Trash2,
    Download,
    Printer,
    Shield,
    User,
    Ban,
    CheckCircle,
    XCircle,
    TrendingUp,
    Users,
    Activity,
    ArrowLeft,
    MoreVertical,
    Info,
    Zap,
    Star,
    Award,
    Briefcase,
    Building,
    Globe,
    Lock,
    Unlock,
    PlusCircle,
    MinusCircle,
    DollarSign
} from 'lucide-react';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';
import ViewUsers from './ViewUsers';

// Types
interface DeactivatedUser {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    previousRole: string;
    deactivatedDate: string;
    deactivatedBy: string;
    reason: string;
    canBeActivated: boolean;
    lastActive: string;
    totalBookings: number;
    totalSpent: number;
    department?: string;
    location?: string;
}

// Mock Deactivated Users Data
const mockDeactivatedUsers: DeactivatedUser[] = [
    {
        id: 101,
        name: 'David Brown',
        email: 'david.brown@example.com',
        phone: '+251 915 678 901',
        role: 'User',
        previousRole: 'Manager',
        deactivatedDate: '2024-03-15',
        deactivatedBy: 'Admin',
        reason: 'Violation of terms - Multiple policy violations',
        canBeActivated: true,
        lastActive: '2024-03-10',
        totalBookings: 5,
        totalSpent: 1200,
        department: 'Operations',
        location: 'Addis Ababa'
    },
    {
        id: 102,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        phone: '+251 916 789 012',
        role: 'User',
        previousRole: 'Theater Owner',
        deactivatedDate: '2024-03-20',
        deactivatedBy: 'System',
        reason: 'Inactive for 90 days - No login activity',
        canBeActivated: true,
        lastActive: '2024-03-18',
        totalBookings: 28,
        totalSpent: 7600,
        department: 'Theater Management',
        location: 'Addis Ababa'
    },
    {
        id: 103,
        name: 'Michael Chen',
        email: 'michael.chen@example.com',
        phone: '+251 917 890 123',
        role: 'User',
        previousRole: 'Manager',
        deactivatedDate: '2024-03-25',
        deactivatedBy: 'Admin',
        reason: 'Requested deactivation - User initiated',
        canBeActivated: true,
        lastActive: '2024-03-24',
        totalBookings: 12,
        totalSpent: 3400,
        department: 'Sales',
        location: 'Addis Ababa'
    },
    {
        id: 104,
        name: 'Robert Kim',
        email: 'robert.kim@example.com',
        phone: '+251 918 901 234',
        role: 'User',
        previousRole: 'User',
        deactivatedDate: '2024-03-28',
        deactivatedBy: 'System',
        reason: 'Security violation - Suspicious activity detected',
        canBeActivated: false,
        lastActive: '2024-03-27',
        totalBookings: 3,
        totalSpent: 850,
        department: 'Customer',
        location: 'Addis Ababa'
    },
    {
        id: 105,
        name: 'Emily Wilson',
        email: 'emily.wilson@example.com',
        phone: '+251 919 012 345',
        role: 'User',
        previousRole: 'Theater Owner',
        deactivatedDate: '2024-04-01',
        deactivatedBy: 'Admin',
        reason: 'Duplicate account - Multiple accounts detected',
        canBeActivated: false,
        lastActive: '2024-03-30',
        totalBookings: 45,
        totalSpent: 12500,
        department: 'Theater Management',
        location: 'Addis Ababa'
    }
];

const DeactivatedUsers: React.FC = () => {
    const [deactivatedUsers, setDeactivatedUsers] = useState<DeactivatedUser[]>(mockDeactivatedUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<DeactivatedUser | null>(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showActivateConfirm, setShowActivateConfirm] = useState(false);
    const [userToActivate, setUserToActivate] = useState<DeactivatedUser | null>(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });

    // Filter users
    const filteredUsers = deactivatedUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.previousRole.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleActivateUser = () => {
        if (userToActivate) {
            setDeactivatedUsers(deactivatedUsers.filter(u => u.id !== userToActivate.id));
            setShowActivateConfirm(false);
            setUserToActivate(null);
            setPopupMessage({
                title: 'User Activated Successfully!',
                message: `${userToActivate.name} has been reactivated with ${userToActivate.previousRole} role. An email notification has been sent.`,
                type: 'success'
            });
            setShowSuccessPopup(true);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'ETB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Column definitions for table
    const columns = [
        {
            Header: 'User',
            accessor: 'name',
            sortable: true,
            Cell: (row: DeactivatedUser) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center text-white font-bold shadow-md">
                        {row.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">{row.name}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {row.email}
                        </p>
                    </div>
                </div>
            )
        },
        {
            Header: 'Previous Role',
            accessor: 'previousRole',
            sortable: true,
            Cell: (row: DeactivatedUser) => (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 border border-purple-200">
                    <Shield className="h-3 w-3" />
                    {row.previousRole}
                </span>
            )
        },
        {
            Header: 'Deactivated Date',
            accessor: 'deactivatedDate',
            sortable: true,
            Cell: (row: DeactivatedUser) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">{formatDate(row.deactivatedDate)}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                        By: {row.deactivatedBy}
                    </p>
                </div>
            )
        },
        {
            Header: 'Reason',
            accessor: 'reason',
            sortable: true,
            Cell: (row: DeactivatedUser) => (
                <div className="max-w-[200px]">
                    <p className="text-sm text-gray-600 truncate" title={row.reason}>
                        {row.reason}
                    </p>
                </div>
            )
        },
        {
            Header: 'Status',
            accessor: 'canBeActivated',
            sortable: true,
            Cell: (row: DeactivatedUser) => (
                row.canBeActivated ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-100 to-amber-50 text-yellow-700 border border-yellow-200">
                        <RefreshCw className="h-3 w-3" />
                        Eligible for Reactivation
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-red-100 to-red-50 text-red-700 border border-red-200">
                        <Ban className="h-3 w-3" />
                        Permanent Deactivation
                    </span>
                )
            )
        }
    ];

    // Action buttons for table
    const actions = [
        {
            label: 'View Details',
            icon: Eye,
            onClick: (row: DeactivatedUser) => {
                setSelectedUser(row);
                setShowViewModal(true);
            },
            color: 'info' as const
        },
        {
            label: 'Activate User',
            icon: UserCheck,
            onClick: (row: DeactivatedUser) => {
                if (row.canBeActivated) {
                    setUserToActivate(row);
                    setShowActivateConfirm(true);
                }
            },
            color: 'success' as const,
            disabled: (row: DeactivatedUser) => !row.canBeActivated
        }
    ];

    // Stats calculations
    const stats = {
        totalDeactivated: deactivatedUsers.length,
        canBeActivated: deactivatedUsers.filter(u => u.canBeActivated).length,
        permanent: deactivatedUsers.filter(u => !u.canBeActivated).length,
        deactivatedThisMonth: deactivatedUsers.filter(u => {
            const deactDate = new Date(u.deactivatedDate);
            const now = new Date();
            return deactDate.getMonth() === now.getMonth() && deactDate.getFullYear() === now.getFullYear();
        }).length,
        totalSpent: deactivatedUsers.reduce((sum, u) => sum + u.totalSpent, 0),
        totalBookings: deactivatedUsers.reduce((sum, u) => sum + u.totalBookings, 0)
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
                                <div className="p-2.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl shadow-lg">
                                    <UserX className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Deactivated Users</h1>
                                    <p className="text-gray-500 text-sm">View and manage deactivated user accounts</p>
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
                                        ['Name', 'Email', 'Phone', 'Previous Role', 'Deactivated Date', 'Deactivated By', 'Reason', 'Can Be Activated'],
                                        ...deactivatedUsers.map(u => [u.name, u.email, u.phone, u.previousRole, u.deactivatedDate, u.deactivatedBy, u.reason, u.canBeActivated])
                                    ].map(row => row.join(',')).join('\n');
                                    const blob = new Blob([csvContent], { type: 'text/csv' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `deactivated_users_${new Date().toISOString().split('T')[0]}.csv`;
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

                {/* Stats Cards - Medium Size with Professional Icons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
                    {/* Total Deactivated Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                                <UserX className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">{stats.totalDeactivated}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-600">Total Deactivated</p>
                        <p className="text-xs text-gray-400 mt-1">All deactivated accounts</p>
                    </motion.div>

                    {/* Can be Activated Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                                <RefreshCw className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-yellow-600">{stats.canBeActivated}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-600">Eligible for Reactivation</p>
                        <p className="text-xs text-gray-400 mt-1">Can be restored</p>
                    </motion.div>

                    {/* Permanent Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                                <Ban className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-red-600">{stats.permanent}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-600">Permanent Deactivation</p>
                        <p className="text-xs text-gray-400 mt-1">Cannot be restored</p>
                    </motion.div>

                    {/* This Month Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                                <Calendar className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-blue-600">{stats.deactivatedThisMonth}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-600">This Month</p>
                        <p className="text-xs text-gray-400 mt-1">Recent deactivations</p>
                    </motion.div>

                    {/* Total Bookings Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                                <TrendingUp className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-green-600">{stats.totalBookings}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                        <p className="text-xs text-gray-400 mt-1">Before deactivation</p>
                    </motion.div>

                    {/* Total Spent Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                                <DollarSign className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalSpent)}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-600">Total Spent</p>
                        <p className="text-xs text-gray-400 mt-1">Lifetime value</p>
                    </motion.div>
                </div>

                {/* Info Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
                >
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-blue-800">About Deactivated Users</p>
                            <p className="text-xs text-blue-700 mt-1">
                                Deactivated users cannot access the system. Users marked as "Eligible for Reactivation" can be restored with their previous role and permissions.
                                Permanent deactivations cannot be reversed. Contact support for assistance with permanent deactivations.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="flex flex-wrap items-center gap-3 mb-6"
                >
                    <div className="relative flex-1 min-w-[280px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, reason, or previous role..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm"
                        />
                    </div>
                    <div className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
                        {filteredUsers.length} users found
                    </div>
                </motion.div>

                {/* Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <ReusableTable
                        columns={columns}
                        data={filteredUsers}
                        actions={actions}
                        title="Deactivated Users List"
                        icon={UserX}
                        showSearch={false}
                        showExport={false}
                        showPrint={false}
                        itemsPerPage={10}
                    />
                </motion.div>

                {/* Activate Confirmation Modal */}
                <AnimatePresence>
                    {showActivateConfirm && userToActivate && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-md">
                                        <UserCheck className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Activate User</h3>
                                </div>
                                <div className="mb-6">
                                    <p className="text-gray-600">
                                        Are you sure you want to activate <strong className="text-gray-900">{userToActivate.name}</strong>?
                                    </p>
                                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600">User will be restored with:</p>
                                        <ul className="text-sm text-gray-700 mt-2 space-y-1">
                                            <li className="flex items-center gap-2">
                                                <Shield className="h-3.5 w-3.5 text-purple-500" />
                                                Role: <strong>{userToActivate.previousRole}</strong>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Mail className="h-3.5 w-3.5 text-blue-500" />
                                                Email: {userToActivate.email}
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Phone className="h-3.5 w-3.5 text-green-500" />
                                                Phone: {userToActivate.phone}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowActivateConfirm(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleActivateUser}
                                        className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition font-medium shadow-md"
                                    >
                                        Activate User
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* View User Modal */}
                {showViewModal && selectedUser && (
                    <ViewUsers
                        user={{
                            id: selectedUser.id,
                            name: selectedUser.name,
                            email: selectedUser.email,
                            phone: selectedUser.phone,
                            role: selectedUser.previousRole as any,
                            status: 'Inactive',
                            joinDate: selectedUser.deactivatedDate,
                            lastActive: selectedUser.lastActive,
                            bookings: selectedUser.totalBookings,
                            totalSpent: selectedUser.totalSpent
                        }}
                        isOpen={showViewModal}
                        onClose={() => {
                            setShowViewModal(false);
                            setSelectedUser(null);
                        }}
                        onEdit={() => { }}
                    />
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
        </div>
    );
};

export default DeactivatedUsers;