// src/pages/scanner/ScannerDashboard.tsx
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    QrCode,
    Scan,
    CheckCircle,
    XCircle,
    Clock,
    AlertTriangle,
    DoorOpen,
    Battery,
    Wifi,
    Activity,
    Calendar,
    TrendingUp,
    ArrowRight,
    Users,
    Ticket,
    BarChart3,
    Download,
    Settings,
    HelpCircle,
    Eye,
    RefreshCw,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    X,
    Search,
    Info,
    ArrowLeft
} from 'lucide-react';
import {
    AreaChart, Area, PieChart as RePieChart, Pie,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, LineChart, Line, BarChart, Bar
} from 'recharts';
import { Link as RouterLink } from 'react-router-dom';
import ReusableButton from '../../components/Reusable/ReusableButton';
import ReusableTable from '../../components/Reusable/ReusableTable';
import SuccessPopup from '../../components/Reusable/SuccessPopup';

// Types
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    delay: number;
    link?: string;
    notification?: boolean;
    notificationCount?: number;
    change?: string;
    trend?: 'up' | 'down';
}

interface RecentScan {
    id: number;
    ticket: string;
    show: string;
    time: string;
    status: 'valid' | 'invalid' | 'duplicate';
    gate: string;
    timestamp?: Date;
}

interface GateStatus {
    id: number;
    name: string;
    status: 'active' | 'standby' | 'offline';
    scannerId: string;
    battery: number;
    scans: number;
}

interface HourlyScanData {
    hour: string;
    scans: number;
    valid: number;
    invalid: number;
}

// Mock Data with timestamps
const hourlyScanData: HourlyScanData[] = [
    { hour: '4PM', scans: 45, valid: 44, invalid: 1 },
    { hour: '5PM', scans: 52, valid: 51, invalid: 1 },
    { hour: '6PM', scans: 68, valid: 67, invalid: 1 },
    { hour: '7PM', scans: 89, valid: 88, invalid: 1 },
    { hour: '8PM', scans: 76, valid: 75, invalid: 1 },
    { hour: '9PM', scans: 12, valid: 12, invalid: 0 },
];

const gateStatus: GateStatus[] = [
    { id: 1, name: 'Gate A', status: 'active', scannerId: 'SCN-001', battery: 87, scans: 145 },
    { id: 2, name: 'Gate B', status: 'active', scannerId: 'SCN-002', battery: 92, scans: 98 },
    { id: 3, name: 'Gate C', status: 'active', scannerId: 'SCN-003', battery: 76, scans: 112 },
    { id: 4, name: 'Gate D', status: 'standby', scannerId: 'SCN-004', battery: 100, scans: 0 },
];

// Enhanced recent scans with timestamps for date filtering
const recentScans: RecentScan[] = [
    { id: 1, ticket: 'TKT-2024-001', show: 'The Lion King', time: '2 min ago', status: 'valid', gate: 'Gate A', timestamp: new Date() },
    { id: 2, ticket: 'TKT-2024-002', show: 'Hamilton', time: '3 min ago', status: 'valid', gate: 'Gate A', timestamp: new Date() },
    { id: 3, ticket: 'TKT-2024-003', show: 'Wicked', time: '5 min ago', status: 'invalid', gate: 'Gate B', timestamp: new Date(Date.now() - 5 * 60000) },
    { id: 4, ticket: 'TKT-2024-004', show: 'Phantom', time: '7 min ago', status: 'valid', gate: 'Gate A', timestamp: new Date(Date.now() - 7 * 60000) },
    { id: 5, ticket: 'TKT-2024-005', show: 'Chicago', time: '8 min ago', status: 'valid', gate: 'Gate C', timestamp: new Date(Date.now() - 8 * 60000) },
    { id: 6, ticket: 'TKT-2024-006', show: 'Lion King', time: '10 min ago', status: 'duplicate', gate: 'Gate A', timestamp: new Date(Date.now() - 10 * 60000) },
    { id: 7, ticket: 'TKT-2024-007', show: 'Les Misérables', time: '1 hour ago', status: 'valid', gate: 'Gate B', timestamp: new Date(Date.now() - 60 * 60000) },
    { id: 8, ticket: 'TKT-2024-008', show: 'Hamilton', time: '2 hours ago', status: 'invalid', gate: 'Gate C', timestamp: new Date(Date.now() - 120 * 60000) },
    { id: 9, ticket: 'TKT-2024-009', show: 'The Lion King', time: '1 day ago', status: 'valid', gate: 'Gate A', timestamp: new Date(Date.now() - 24 * 60 * 60000) },
    { id: 10, ticket: 'TKT-2024-010', show: 'Wicked', time: '2 days ago', status: 'valid', gate: 'Gate B', timestamp: new Date(Date.now() - 48 * 60 * 60000) },
    { id: 9, ticket: 'TKT-2024-009', show: 'The Lion King', time: '1 day ago', status: 'valid', gate: 'Gate A', timestamp: new Date(Date.now() - 24 * 60 * 60000) },
    { id: 10, ticket: 'TKT-2024-010', show: 'Wicked', time: '2 days ago', status: 'valid', gate: 'Gate B', timestamp: new Date(Date.now() - 48 * 60 * 60000) },
];

// Stat Card Component
const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, delay, link, notification, notificationCount, change, trend }) => {
    const [isHovered, setIsHovered] = useState(false);

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
                            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-teal-500 text-white rounded-full animate-pulse">
                                {notificationCount}
                            </span>
                        )}
                    </div>
                    <p className="text-xl font-bold text-gray-900">{value}</p>
                    {change && (
                        <div className={`flex items-center gap-1 text-xs mt-0.5 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                            <span>{change}</span>
                        </div>
                    )}
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
                <RouterLink to={link} className="block">
                    <CardContent />
                </RouterLink>
            ) : (
                <CardContent />
            )}
        </motion.div>
    );
};

// Filter Modal Component
interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: any) => void;
    currentFilters: any;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApply, currentFilters }) => {
    const [selectedStatus, setSelectedStatus] = useState<string>(currentFilters.status || 'all');
    const [selectedGate, setSelectedGate] = useState<string>(currentFilters.gate || 'all');
    const [dateRange, setDateRange] = useState<string>(currentFilters.dateRange || 'today');
    const [customStartDate, setCustomStartDate] = useState<string>('');
    const [customEndDate, setCustomEndDate] = useState<string>('');

    if (!isOpen) return null;

    const handleApply = () => {
        const filters: any = {
            status: selectedStatus,
            gate: selectedGate,
            dateRange: dateRange
        };

        if (dateRange === 'custom') {
            filters.startDate = customStartDate;
            filters.endDate = customEndDate;
        }

        onApply(filters);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-teal-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Filter Scans</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                            <option value="all">All Status</option>
                            <option value="valid">Valid</option>
                            <option value="invalid">Invalid</option>
                            <option value="duplicate">Duplicate</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gate</label>
                        <select
                            value={selectedGate}
                            onChange={(e) => setSelectedGate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                            <option value="all">All Gates</option>
                            <option value="Gate A">Gate A</option>
                            <option value="Gate B">Gate B</option>
                            <option value="Gate C">Gate C</option>
                            <option value="Gate D">Gate D</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                            <option value="today">Today</option>
                            <option value="yesterday">Yesterday</option>
                            <option value="last7days">Last 7 Days</option>
                            <option value="last30days">Last 30 Days</option>
                            <option value="custom">Custom Range</option>
                        </select>
                    </div>
                    {dateRange === 'custom' && (
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    value={customStartDate}
                                    onChange={(e) => setCustomStartDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <input
                                    type="date"
                                    value={customEndDate}
                                    onChange={(e) => setCustomEndDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex gap-3 p-6 border-t border-gray-200">
                    <button
                        onClick={handleApply}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                    >
                        Apply Filters
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const ScannerDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterGate, setFilterGate] = useState<string>('all');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });

    const getGateStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /> Active</span>;
            case 'standby':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3" /> Standby</span>;
            default:
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-100 text-red-700"><XCircle className="h-3 w-3" /> Offline</span>;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'valid':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /> Valid</span>;
            case 'invalid':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"><XCircle className="h-3 w-3" /> Invalid</span>;
            case 'duplicate':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700"><AlertTriangle className="h-3 w-3" /> Duplicate</span>;
            default:
                return null;
        }
    };

    // Filter the data based on search, status, and gate
    const filteredScans = useMemo(() => {
        let filtered = [...recentScans];

        // Apply search filter
        if (searchTerm) {
            const query = searchTerm.toLowerCase();
            filtered = filtered.filter(scan =>
                scan.ticket.toLowerCase().includes(query) ||
                scan.show.toLowerCase().includes(query) ||
                scan.gate.toLowerCase().includes(query)
            );
        }

        // Apply status filter
        if (filterStatus !== 'all') {
            filtered = filtered.filter(scan => scan.status === filterStatus);
        }

        // Apply gate filter
        if (filterGate !== 'all') {
            filtered = filtered.filter(scan => scan.gate === filterGate);
        }

        return filtered;
    }, [recentScans, searchTerm, filterStatus, filterGate]);

    // Clear all filters
    const clearAllFilters = () => {
        setSearchTerm('');
        setFilterStatus('all');
        setFilterGate('all');
        setPopupMessage({
            title: 'Filters Cleared',
            message: 'All filters have been reset',
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    // Stats calculations
    const stats = {
        scannedToday: recentScans.filter(s => s.timestamp && new Date(s.timestamp).toDateString() === new Date().toDateString()).length,
        scannedThisHour: recentScans.filter(s => s.timestamp && (Date.now() - s.timestamp.getTime()) < 60 * 60 * 1000).length,
        totalScanned: recentScans.length,
        validEntries: recentScans.filter(s => s.status === 'valid').length,
        invalidTickets: recentScans.filter(s => s.status === 'invalid').length,
        duplicateAttempts: recentScans.filter(s => s.status === 'duplicate').length,
        avgScanTime: '1.2s',
        peakHour: '7:00 PM'
    };

    // Scan History Columns for ReusableTable
    const historyColumns = [
        { Header: 'Ticket Number', accessor: 'ticket', Cell: (row: RecentScan) => <span className="font-mono text-sm">{row.ticket}</span> },
        { Header: 'Show', accessor: 'show' },
        { Header: 'Gate', accessor: 'gate' },
        { Header: 'Time', accessor: 'time' },
        { Header: 'Status', accessor: 'status', Cell: (row: RecentScan) => getStatusBadge(row.status) }
    ];

    // Dashboard Cards
    const dashboardCards = [
        { title: "Scanned Today", value: stats.scannedToday, icon: Scan, color: "from-emerald-500 to-teal-600", delay: 0.1, change: `+${stats.scannedThisHour} this hour`, trend: 'up' as const },
        { title: "Valid Entries", value: stats.validEntries, icon: CheckCircle, color: "from-green-500 to-emerald-600", delay: 0.15, change: `${((stats.validEntries / stats.totalScanned) * 100).toFixed(1)}% rate`, trend: 'up' as const },
        { title: "Invalid Tickets", value: stats.invalidTickets, icon: XCircle, color: "from-red-500 to-pink-600", delay: 0.2, change: `${stats.duplicateAttempts} duplicates`, trend: 'down' as const },
        { title: "Avg. Scan Time", value: stats.avgScanTime, icon: Clock, color: "from-blue-500 to-cyan-600", delay: 0.25, change: `Peak: ${stats.peakHour}`, trend: 'up' as const },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <button
                            onClick={() => navigate('/scanner')}
                            className="p-2 rounded-lg hover:bg-gray-100 transition"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </button>
                        <div className="p-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 shadow-lg">
                            <QrCode className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Scanner Dashboard</h1>
                            <p className="text-sm text-gray-500">Monitor scan activity and manage ticket validations</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
                >
                    {dashboardCards.map((card, index) => (
                        <StatCard
                            key={index}
                            title={card.title}
                            value={card.value}
                            icon={card.icon}
                            color={card.color}
                            delay={card.delay}
                            change={card.change}
                            trend={card.trend}
                        />
                    ))}
                </motion.div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Hourly Scan Activity Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Hourly Scan Activity</h3>
                                <p className="text-sm text-gray-500">Scan volume by hour</p>
                            </div>
                            <RouterLink to="/scanner/reports" className="text-sm text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1">
                                View Details <ArrowRight className="h-4 w-4" />
                            </RouterLink>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={hourlyScanData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                                    <XAxis dataKey="hour" stroke="#6B7280" />
                                    <YAxis stroke="#6B7280" />
                                    <Tooltip />
                                    <Bar dataKey="valid" name="Valid Scans" fill="#22c55e" radius={[8, 8, 0, 0]} />
                                    <Bar dataKey="invalid" name="Invalid Scans" fill="#ef4444" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Gate Status Distribution */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Gate Status</h3>
                            <RouterLink to="/scanner/gates" className="text-sm text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1">
                                Manage Gates <ArrowRight className="h-4 w-4" />
                            </RouterLink>
                        </div>
                        <div className="space-y-3">
                            {gateStatus.map((gate, index) => (
                                <div key={gate.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center text-white font-bold">
                                            {gate.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{gate.name}</p>
                                            <p className="text-xs text-gray-500">{gate.scannerId}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {getGateStatusBadge(gate.status)}
                                        <div className="flex items-center gap-2 mt-1">
                                            <Battery className="h-3 w-3 text-gray-400" />
                                            <span className="text-xs text-gray-600">{gate.battery}%</span>
                                            <Scan className="h-3 w-3 text-gray-400 ml-1" />
                                            <span className="text-xs text-gray-600">{gate.scans}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Recent Scans Table */}
                <div className="mt-8">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-teal-600" />
                                    <h2 className="text-lg font-semibold text-gray-900">Recent Scans</h2>
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                    {/* Search */}
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search by ticket, show, or gate..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent w-64"
                                        />
                                    </div>

                                    {/* Status Filter */}
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="valid">Valid</option>
                                        <option value="invalid">Invalid</option>
                                        <option value="duplicate">Duplicate</option>
                                    </select>

                                    {/* Gate Filter */}
                                    <select
                                        value={filterGate}
                                        onChange={(e) => setFilterGate(e.target.value)}
                                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                                    >
                                        <option value="all">All Gates</option>
                                        <option value="Gate A">Gate A</option>
                                        <option value="Gate B">Gate B</option>
                                        <option value="Gate C">Gate C</option>
                                        <option value="Gate D">Gate D</option>
                                    </select>

                                    {/* Clear Filters Button */}
                                    {(searchTerm || filterStatus !== 'all' || filterGate !== 'all') && (
                                        <button
                                            onClick={clearAllFilters}
                                            className="px-3 py-2 text-sm text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors flex items-center gap-1"
                                        >
                                            <X className="h-4 w-4" />
                                            Clear All
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Active Filters Display */}
                            {(filterStatus !== 'all' || filterGate !== 'all') && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {filterStatus !== 'all' && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-teal-100 text-teal-700 rounded-full">
                                            Status: {filterStatus}
                                            <button onClick={() => setFilterStatus('all')} className="hover:text-teal-900">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    )}
                                    {filterGate !== 'all' && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-teal-100 text-teal-700 rounded-full">
                                            Gate: {filterGate}
                                            <button onClick={() => setFilterGate('all')} className="hover:text-teal-900">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        <ReusableTable
                            columns={historyColumns}
                            data={filteredScans}
                            title=""
                            icon={Scan}
                            showSearch={false}
                            showExport={false}
                            showPrint={false}
                            itemsPerPage={10}
                        />

                        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 text-sm text-gray-600">
                            Showing {filteredScans.length} of {recentScans.length} scans
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    <RouterLink to="/scanner/manual-entry">
                        <button className="w-full py-3 px-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 group">
                            <Ticket className="h-4 w-4 group-hover:scale-110 transition-transform" />
                            Manual Entry
                        </button>
                    </RouterLink>
                    <RouterLink to="/scanner/settings">
                        <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 group">
                            <Settings className="h-4 w-4 group-hover:rotate-90 transition-transform" />
                            Scanner Settings
                        </button>
                    </RouterLink>
                    <RouterLink to="/scanner/reports">
                        <button className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 group">
                            <BarChart3 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                            View Reports
                        </button>
                    </RouterLink>
                    <RouterLink to="/scanner/help">
                        <button className="w-full py-3 px-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 group">
                            <HelpCircle className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                            Help Guide
                        </button>
                    </RouterLink>
                </div>

                {/* Tips Card */}
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-blue-800">Scanner Tips</p>
                            <p className="text-xs text-blue-700 mt-1">
                                • Ensure good lighting when scanning QR codes<br />
                                • Use filters to find specific tickets quickly<br />
                                • Search by ticket number for quick lookup<br />
                                • Monitor gate status for optimal performance
                            </p>
                        </div>
                    </div>
                </div>

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

export default ScannerDashboard;