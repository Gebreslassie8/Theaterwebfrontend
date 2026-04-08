// src/pages/Admin/users/ActivityLogs.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    History,
    User,
    Shield,
    Settings,
    DollarSign,
    Ticket,
    Building,
    Calendar,
    Clock,
    Search,
    Filter,
    Download,
    Printer,
    Eye,
    CheckCircle,
    XCircle,
    AlertCircle,
    LogIn,
    LogOut,
    UserPlus,
    UserMinus,
    Edit,
    Trash2,
    ShieldAlert,
    FileText,
    X,
    TrendingUp,
    Users,
    Zap,
    Server,
    Database,
    Globe,
    Lock,
    Unlock,
    Bell,
    MessageCircle,
    HelpCircle,
    Star,
    Award
} from 'lucide-react';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';

// Types
interface ActivityLog {
    id: string;
    action: string;
    actionType: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'permission_change' | 'role_change' | 'settings_change';
    performedBy: string;
    performedByRole: string;
    target: string;
    targetType: 'user' | 'role' | 'theater' | 'show' | 'payment' | 'settings';
    details: string;
    ipAddress: string;
    userAgent: string;
    timestamp: string;
    status: 'success' | 'failed' | 'pending';
    location?: string;
    device?: string;
}

// Mock Activity Logs Data
const mockActivityLogs: ActivityLog[] = [
    {
        id: '1',
        action: 'User Created',
        actionType: 'create',
        performedBy: 'Admin User',
        performedByRole: 'Admin',
        target: 'John Doe',
        targetType: 'user',
        details: 'New user account created with role: Manager. Email verification sent.',
        ipAddress: '192.168.1.1',
        userAgent: 'Chrome/120.0',
        timestamp: '2024-04-05T10:30:00',
        status: 'success',
        location: 'Addis Ababa, Ethiopia',
        device: 'Desktop'
    },
    {
        id: '2',
        action: 'Role Permissions Updated',
        actionType: 'permission_change',
        performedBy: 'Admin User',
        performedByRole: 'Admin',
        target: 'Manager Role',
        targetType: 'role',
        details: 'Added view_reports, view_analytics. Removed delete_users, manage_settings.',
        ipAddress: '192.168.1.1',
        userAgent: 'Chrome/120.0',
        timestamp: '2024-04-05T09:15:00',
        status: 'success',
        location: 'Addis Ababa, Ethiopia',
        device: 'Desktop'
    },
    {
        id: '3',
        action: 'User Deactivated',
        actionType: 'delete',
        performedBy: 'Admin User',
        performedByRole: 'Admin',
        target: 'David Brown',
        targetType: 'user',
        details: 'User deactivated due to multiple policy violations. Account suspended indefinitely.',
        ipAddress: '192.168.1.1',
        userAgent: 'Chrome/120.0',
        timestamp: '2024-04-04T14:20:00',
        status: 'success',
        location: 'Addis Ababa, Ethiopia',
        device: 'Desktop'
    },
    {
        id: '4',
        action: 'Login Attempt',
        actionType: 'login',
        performedBy: 'John Doe',
        performedByRole: 'Manager',
        target: 'John Doe',
        targetType: 'user',
        details: 'Successful login from new device. Two-factor authentication completed.',
        ipAddress: '192.168.1.50',
        userAgent: 'Firefox/121.0',
        timestamp: '2024-04-04T08:45:00',
        status: 'success',
        location: 'Addis Ababa, Ethiopia',
        device: 'Mobile'
    },
    {
        id: '5',
        action: 'Payment Processed',
        actionType: 'create',
        performedBy: 'System',
        performedByRole: 'System',
        target: 'The Lion King Booking',
        targetType: 'payment',
        details: 'Payment of ETB 450 processed via Chapa. Transaction ID: CH-20240403-001',
        ipAddress: 'System',
        userAgent: 'System',
        timestamp: '2024-04-03T19:30:00',
        status: 'success',
        location: 'System',
        device: 'System'
    },
    {
        id: '6',
        action: 'Theater Created',
        actionType: 'create',
        performedBy: 'Sarah Williams',
        performedByRole: 'Theater Owner',
        target: 'Sunset Theater',
        targetType: 'theater',
        details: 'New theater registration submitted. Awaiting admin approval.',
        ipAddress: '192.168.1.100',
        userAgent: 'Safari/17.0',
        timestamp: '2024-04-03T11:00:00',
        status: 'pending',
        location: 'Addis Ababa, Ethiopia',
        device: 'Desktop'
    },
    {
        id: '7',
        action: 'Show Deleted',
        actionType: 'delete',
        performedBy: 'Manager User',
        performedByRole: 'Manager',
        target: 'Chicago Show',
        targetType: 'show',
        details: 'Show cancelled due to low ticket sales. Refunds processed for 45 tickets.',
        ipAddress: '192.168.1.75',
        userAgent: 'Chrome/120.0',
        timestamp: '2024-04-02T16:20:00',
        status: 'success',
        location: 'Addis Ababa, Ethiopia',
        device: 'Desktop'
    },
    {
        id: '8',
        action: 'Failed Login Attempt',
        actionType: 'login',
        performedBy: 'Unknown',
        performedByRole: 'Unknown',
        target: 'admin@theaterhub.com',
        targetType: 'user',
        details: 'Multiple failed login attempts detected from unknown IP. Account temporarily locked.',
        ipAddress: '203.0.113.45',
        userAgent: 'Unknown',
        timestamp: '2024-04-02T03:15:00',
        status: 'failed',
        location: 'Unknown',
        device: 'Unknown'
    },
    {
        id: '9',
        action: 'System Settings Updated',
        actionType: 'settings_change',
        performedBy: 'Admin User',
        performedByRole: 'Admin',
        target: 'System Configuration',
        targetType: 'settings',
        details: 'Updated email notification settings. Changed maintenance mode status.',
        ipAddress: '192.168.1.1',
        userAgent: 'Chrome/120.0',
        timestamp: '2024-04-01T10:00:00',
        status: 'success',
        location: 'Addis Ababa, Ethiopia',
        device: 'Desktop'
    },
    {
        id: '10',
        action: 'User Role Changed',
        actionType: 'role_change',
        performedBy: 'Admin User',
        performedByRole: 'Admin',
        target: 'Emily Wilson',
        targetType: 'user',
        details: 'Role changed from User to Theater Owner. Permissions updated accordingly.',
        ipAddress: '192.168.1.1',
        userAgent: 'Chrome/120.0',
        timestamp: '2024-03-31T15:45:00',
        status: 'success',
        location: 'Addis Ababa, Ethiopia',
        device: 'Desktop'
    }
];

const ActivityLogs: React.FC = () => {
    const [logs, setLogs] = useState<ActivityLog[]>(mockActivityLogs);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterActionType, setFilterActionType] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('all');

    // Filter logs
    const filteredLogs = logs.filter(log => {
        const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.details.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesActionType = filterActionType === 'all' || log.actionType === filterActionType;
        const matchesStatus = filterStatus === 'all' || log.status === filterStatus;

        // Date range filtering
        const logDate = new Date(log.timestamp);
        const now = new Date();
        let matchesDateRange = true;

        if (dateRange === 'today') {
            matchesDateRange = logDate.toDateString() === now.toDateString();
        } else if (dateRange === 'week') {
            const weekAgo = new Date(now.setDate(now.getDate() - 7));
            matchesDateRange = logDate >= weekAgo;
        } else if (dateRange === 'month') {
            const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
            matchesDateRange = logDate >= monthAgo;
        }

        return matchesSearch && matchesActionType && matchesStatus && matchesDateRange;
    });

    const getActionIcon = (actionType: string) => {
        switch (actionType) {
            case 'create': return <UserPlus className="h-4 w-4 text-emerald-500" />;
            case 'update': return <Edit className="h-4 w-4 text-teal-500" />;
            case 'delete': return <Trash2 className="h-4 w-4 text-red-500" />;
            case 'login': return <LogIn className="h-4 w-4 text-emerald-500" />;
            case 'logout': return <LogOut className="h-4 w-4 text-gray-500" />;
            case 'permission_change': return <ShieldAlert className="h-4 w-4 text-purple-500" />;
            case 'role_change': return <Shield className="h-4 w-4 text-amber-500" />;
            case 'settings_change': return <Settings className="h-4 w-4 text-gray-500" />;
            default: return <Activity className="h-4 w-4 text-deepTeal" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'success':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700"><CheckCircle className="h-3 w-3" /> Success</span>;
            case 'failed':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"><XCircle className="h-3 w-3" /> Failed</span>;
            default:
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3" /> Pending</span>;
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let relativeTime = '';
        if (diffDays === 1) relativeTime = 'Yesterday';
        else if (diffDays < 7) relativeTime = `${diffDays} days ago`;
        else if (diffDays < 30) relativeTime = `${Math.floor(diffDays / 7)} weeks ago`;
        else relativeTime = `${Math.floor(diffDays / 30)} months ago`;

        return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            relative: relativeTime
        };
    };

    const columns = [
        {
            Header: 'Action',
            accessor: 'action',
            sortable: true,
            Cell: (row: ActivityLog) => (
                <div className="flex items-center gap-2">
                    {getActionIcon(row.actionType)}
                    <div>
                        <span className="text-sm font-medium text-gray-900">{row.action}</span>
                        <p className="text-xs text-gray-400">{row.details.substring(0, 50)}...</p>
                    </div>
                </div>
            )
        },
        {
            Header: 'Performed By',
            accessor: 'performedBy',
            sortable: true,
            Cell: (row: ActivityLog) => (
                <div>
                    <p className="text-sm font-medium text-gray-900">{row.performedBy}</p>
                    <p className="text-xs text-deepTeal">{row.performedByRole}</p>
                </div>
            )
        },
        {
            Header: 'Target',
            accessor: 'target',
            sortable: true,
            Cell: (row: ActivityLog) => (
                <div>
                    <p className="text-sm text-gray-900">{row.target}</p>
                    <p className="text-xs text-gray-500 capitalize">{row.targetType}</p>
                </div>
            )
        },
        {
            Header: 'Timestamp',
            accessor: 'timestamp',
            sortable: true,
            Cell: (row: ActivityLog) => {
                const { date, time, relative } = formatTimestamp(row.timestamp);
                return (
                    <div>
                        <p className="text-sm text-gray-900">{date}</p>
                        <p className="text-xs text-gray-500">{time} ({relative})</p>
                    </div>
                );
            }
        },
        {
            Header: 'Status',
            accessor: 'status',
            sortable: true,
            Cell: (row: ActivityLog) => getStatusBadge(row.status)
        }
    ];

    const actionTypes = [
        { value: 'all', label: 'All Actions', icon: Activity },
        { value: 'create', label: 'Create', icon: UserPlus },
        { value: 'update', label: 'Update', icon: Edit },
        { value: 'delete', label: 'Delete', icon: Trash2 },
        { value: 'login', label: 'Login', icon: LogIn },
        { value: 'logout', label: 'Logout', icon: LogOut },
        { value: 'permission_change', label: 'Permission Change', icon: ShieldAlert },
        { value: 'role_change', label: 'Role Change', icon: Shield },
        { value: 'settings_change', label: 'Settings Change', icon: Settings }
    ];

    const statusTypes = [
        { value: 'all', label: 'All Status', color: 'gray' },
        { value: 'success', label: 'Success', color: 'emerald' },
        { value: 'failed', label: 'Failed', color: 'red' },
        { value: 'pending', label: 'Pending', color: 'yellow' }
    ];

    const dateRangeOptions = [
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'Last 7 Days' },
        { value: 'month', label: 'Last 30 Days' },
        { value: 'all', label: 'All Time' }
    ];

    const stats = {
        totalLogs: logs.length,
        todayLogs: logs.filter(log => {
            const logDate = new Date(log.timestamp).toDateString();
            const today = new Date().toDateString();
            return logDate === today;
        }).length,
        successLogs: logs.filter(log => log.status === 'success').length,
        failedLogs: logs.filter(log => log.status === 'failed').length,
        pendingLogs: logs.filter(log => log.status === 'pending').length
    };

    const handleExport = () => {
        const csvContent = [
            ['ID', 'Action', 'Action Type', 'Performed By', 'Role', 'Target', 'Target Type', 'Details', 'IP Address', 'Status', 'Timestamp'],
            ...filteredLogs.map(log => [
                log.id, log.action, log.actionType, log.performedBy, log.performedByRole,
                log.target, log.targetType, log.details, log.ipAddress, log.status, log.timestamp
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `activity_logs_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);

        setShowSuccessPopup(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2.5 bg-gradient-to-r from-deepTeal to-teal-600 rounded-xl shadow-lg">
                                    <History className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
                                    <p className="text-gray-500 text-sm">Track all user activities and system events</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <ReusableButton
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterActionType('all');
                                    setFilterStatus('all');
                                    setDateRange('all');
                                }}
                                icon="RefreshCw"
                                label="Reset"
                                variant="secondary"
                                className="px-4 py-2 text-sm"
                            />
                            <ReusableButton
                                onClick={handleExport}
                                icon="Download"
                                label="Export"
                                variant="secondary"
                                className="px-4 py-2 text-sm"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Events</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalLogs}</p>
                            </div>
                            <div className="p-2 bg-gradient-to-r from-deepTeal to-teal-600 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                                <Activity className="h-5 w-5 text-white" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Today</p>
                                <p className="text-2xl font-bold text-teal-600">{stats.todayLogs}</p>
                            </div>
                            <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                                <Calendar className="h-5 w-5 text-white" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Successful</p>
                                <p className="text-2xl font-bold text-emerald-600">{stats.successLogs}</p>
                            </div>
                            <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                                <CheckCircle className="h-5 w-5 text-white" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Failed</p>
                                <p className="text-2xl font-bold text-red-600">{stats.failedLogs}</p>
                            </div>
                            <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                                <AlertCircle className="h-5 w-5 text-white" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Pending</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats.pendingLogs}</p>
                            </div>
                            <div className="p-2 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                                <Clock className="h-5 w-5 text-white" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative min-w-[280px]">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search activities..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deepTeal focus:border-transparent bg-white"
                            />
                        </div>
                        <select
                            value={filterActionType}
                            onChange={(e) => setFilterActionType(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deepTeal bg-white min-w-[150px]"
                        >
                            {actionTypes.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deepTeal bg-white min-w-[140px]"
                        >
                            {statusTypes.map(status => (
                                <option key={status.value} value={status.value}>{status.label}</option>
                            ))}
                        </select>
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value as any)}
                            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deepTeal bg-white min-w-[140px]"
                        >
                            {dateRangeOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
                        {filteredLogs.length} activities found
                    </div>
                </div>

                {/* Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <ReusableTable
                        columns={columns}
                        data={filteredLogs}
                        title="Activity Timeline"
                        icon={History}
                        showSearch={false}
                        showExport={false}
                        showPrint={false}
                        itemsPerPage={10}
                        onRowClick={(row) => {
                            setSelectedLog(row);
                            setShowDetailsModal(true);
                        }}
                    />
                </motion.div>

                {/* Activity Details Modal */}
                <AnimatePresence>
                    {showDetailsModal && selectedLog && (
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
                                        <div className="p-2 bg-gradient-to-r from-deepTeal to-teal-600 rounded-lg shadow-md">
                                            <Eye className="h-5 w-5 text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Activity Details</h2>
                                    </div>
                                    <button onClick={() => setShowDetailsModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                                        <X className="h-5 w-5 text-gray-500" />
                                    </button>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <div className="flex items-center gap-2 mb-2">
                                                {getActionIcon(selectedLog.actionType)}
                                                <p className="text-lg font-semibold text-gray-900">{selectedLog.action}</p>
                                                {getStatusBadge(selectedLog.status)}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Performed By</p>
                                            <p className="font-medium text-gray-900 mt-1">{selectedLog.performedBy}</p>
                                            <p className="text-xs text-deepTeal">{selectedLog.performedByRole}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Target</p>
                                            <p className="font-medium text-gray-900 mt-1">{selectedLog.target}</p>
                                            <p className="text-xs text-gray-500 capitalize">{selectedLog.targetType}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Details</p>
                                            <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                <p className="text-sm text-gray-700">{selectedLog.details}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">IP Address</p>
                                            <p className="text-sm font-mono text-gray-600 mt-1">{selectedLog.ipAddress}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
                                            <p className="text-sm text-gray-600 mt-1">{selectedLog.location || 'Unknown'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Device</p>
                                            <p className="text-sm text-gray-600 mt-1">{selectedLog.device || 'Unknown'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">User Agent</p>
                                            <p className="text-xs text-gray-500 mt-1 font-mono break-all">{selectedLog.userAgent}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Timestamp</p>
                                            <p className="text-sm text-gray-900 mt-1">
                                                {formatTimestamp(selectedLog.timestamp).date} at {formatTimestamp(selectedLog.timestamp).time}
                                            </p>
                                            <p className="text-xs text-gray-400">{formatTimestamp(selectedLog.timestamp).relative}</p>
                                        </div>
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
                    type="success"
                    title="Export Successful!"
                    message="Activity logs have been exported to CSV"
                    duration={3000}
                    position="top-right"
                />
            </div>
        </div>
    );
};

export default ActivityLogs;