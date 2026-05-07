// src/components/wallet/Commission.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Calendar,
    Download,
    Filter,
    RefreshCw,
    Search,
    ChevronLeft,
    ChevronRight,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    Wallet,
    Building,
    Percent,
    CreditCard,
    FileText,
    PieChart,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Users,
    Receipt,
    Printer,
    Mail,
    Copy,
    Settings,
    History,
    BarChart3,
    Star,
    Award,
    Zap
} from 'lucide-react';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    PieChart as RePieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';
import * as Yup from 'yup';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';

// Types
interface TheaterCommission {
    id: string;
    theaterId: string;
    theaterName: string;
    theaterLocation: string;
    commissionRate: number;
    totalRevenue: number;
    commissionAmount: number;
    status: 'paid' | 'pending' | 'overdue' | 'cancelled';
    dueDate: string;
    paidDate?: string;
    paymentMethod?: string;
    transactionId?: string;
    period: {
        start: string;
        end: string;
    };
    ticketsSold: number;
    eventsCount: number;
    occupancyRate: number;
}

interface CommissionSummary {
    totalCommissions: number;
    paidCommissions: number;
    pendingCommissions: number;
    overdueCommissions: number;
    averageCommissionRate: number;
    totalTheaters: number;
    activeTheaters: number;
    monthlyTrend: {
        month: string;
        amount: number;
        count: number;
    }[];
    topPerformingTheaters: {
        theaterName: string;
        commissionAmount: number;
        growth: number;
    }[];
    commissionByStatus: {
        status: string;
        amount: number;
        color: string;
    }[];
}

interface FilterOptions {
    dateRange: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
    startDate?: Date;
    endDate?: Date;
    status: 'all' | 'paid' | 'pending' | 'overdue';
    theaterId: string;
    minAmount?: number;
    maxAmount?: number;
}

// Constants
const COMMISSION_RATES = {
    standard: 0.05, // 5%
    premium: 0.08,  // 8%
    enterprise: 0.10 // 10%
};

const STATUS_COLORS = {
    paid: '#10B981',
    pending: '#F59E0B',
    overdue: '#EF4444',
    cancelled: '#6B7280'
};

const STATUS_ICONS = {
    paid: <CheckCircle className="h-4 w-4" />,
    pending: <Clock className="h-4 w-4" />,
    overdue: <AlertCircle className="h-4 w-4" />,
    cancelled: <XCircle className="h-4 w-4" />
};

// Mock Data Generator
const generateMockCommissions = (): TheaterCommission[] => {
    const theaters = [
        { id: 'th-1', name: 'Grand Cinema', location: 'Addis Ababa, Bole', rate: 0.05 },
        { id: 'th-2', name: 'Star Multiplex', location: 'Addis Ababa, Kazanchis', rate: 0.08 },
        { id: 'th-3', name: 'City Cinema', location: 'Addis Ababa, Piassa', rate: 0.05 },
        { id: 'th-4', name: 'Oasis Cinema', location: 'Addis Ababa, CMC', rate: 0.05 },
        { id: 'th-5', name: 'Plaza Cinema', location: 'Addis Ababa, Mexico', rate: 0.08 },
        { id: 'th-6', name: 'Royal Theater', location: 'Gondar', rate: 0.05 },
        { id: 'th-7', name: 'Sunset Theater', location: 'Bahir Dar', rate: 0.05 },
    ];

    const commissions: TheaterCommission[] = [];
    const now = new Date();
    
    for (let i = 0; i < 50; i++) {
        const theater = theaters[Math.floor(Math.random() * theaters.length)];
        const monthOffset = Math.floor(Math.random() * 12);
        const dueDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, 15);
        const revenue = 50000 + Math.random() * 150000;
        const commissionAmount = revenue * theater.rate;
        
        const statuses: ('paid' | 'pending' | 'overdue')[] = ['paid', 'pending', 'overdue'];
        const weights = [0.6, 0.25, 0.15];
        let random = Math.random();
        let cumulative = 0;
        let status: 'paid' | 'pending' | 'overdue' = 'pending';
        
        for (let j = 0; j < weights.length; j++) {
            cumulative += weights[j];
            if (random < cumulative) {
                status = statuses[j];
                break;
            }
        }
        
        const paidDate = status === 'paid' ? new Date(dueDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined;
        
        commissions.push({
            id: `comm-${i + 1}`,
            theaterId: theater.id,
            theaterName: theater.name,
            theaterLocation: theater.location,
            commissionRate: theater.rate * 100,
            totalRevenue: Math.floor(revenue),
            commissionAmount: Math.floor(commissionAmount),
            status,
            dueDate: dueDate.toISOString(),
            paidDate: paidDate?.toISOString(),
            paymentMethod: status === 'paid' ? ['Bank Transfer', 'Mobile Money', 'Credit Card'][Math.floor(Math.random() * 3)] : undefined,
            transactionId: status === 'paid' ? `TXN-${Math.random().toString(36).substr(2, 8).toUpperCase()}` : undefined,
            period: {
                start: new Date(dueDate.getFullYear(), dueDate.getMonth(), 1).toISOString(),
                end: new Date(dueDate.getFullYear(), dueDate.getMonth() + 1, 0).toISOString()
            },
            ticketsSold: Math.floor(500 + Math.random() * 2000),
            eventsCount: Math.floor(5 + Math.random() * 30),
            occupancyRate: 40 + Math.random() * 55
        });
    }
    
    return commissions.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
};

const generateSummaryData = (commissions: TheaterCommission[]): CommissionSummary => {
    const totalCommissions = commissions.reduce((sum, c) => sum + c.commissionAmount, 0);
    const paidCommissions = commissions.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.commissionAmount, 0);
    const pendingCommissions = commissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.commissionAmount, 0);
    const overdueCommissions = commissions.filter(c => c.status === 'overdue').reduce((sum, c) => sum + c.commissionAmount, 0);
    
    const uniqueTheaters = new Set(commissions.map(c => c.theaterId));
    const activeTheaters = new Set(commissions.filter(c => c.status !== 'cancelled').map(c => c.theaterId));
    
    // Monthly trend
    const monthlyMap = new Map<string, { amount: number; count: number }>();
    commissions.forEach(comm => {
        const month = new Date(comm.dueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        const current = monthlyMap.get(month) || { amount: 0, count: 0 };
        monthlyMap.set(month, {
            amount: current.amount + comm.commissionAmount,
            count: current.count + 1
        });
    });
    
    const monthlyTrend = Array.from(monthlyMap.entries())
        .map(([month, data]) => ({ month, amount: data.amount, count: data.count }))
        .slice(-6);
    
    // Top performing theaters
    const theaterMap = new Map<string, { theaterName: string; amount: number; lastAmount?: number }>();
    commissions.forEach(comm => {
        const current = theaterMap.get(comm.theaterId) || { theaterName: comm.theaterName, amount: 0 };
        current.amount += comm.commissionAmount;
        theaterMap.set(comm.theaterId, current);
    });
    
    const topPerformingTheaters = Array.from(theaterMap.entries())
        .map(([id, data]) => ({
            theaterName: data.theaterName,
            commissionAmount: data.amount,
            growth: Math.random() * 40 - 10
        }))
        .sort((a, b) => b.commissionAmount - a.commissionAmount)
        .slice(0, 5);
    
    // Commission by status
    const commissionByStatus = [
        { status: 'Paid', amount: paidCommissions, color: STATUS_COLORS.paid },
        { status: 'Pending', amount: pendingCommissions, color: STATUS_COLORS.pending },
        { status: 'Overdue', amount: overdueCommissions, color: STATUS_COLORS.overdue }
    ];
    
    return {
        totalCommissions,
        paidCommissions,
        pendingCommissions,
        overdueCommissions,
        averageCommissionRate: 6.5,
        totalTheaters: uniqueTheaters.size,
        activeTheaters: activeTheaters.size,
        monthlyTrend,
        topPerformingTheaters,
        commissionByStatus
    };
};

// Stat Card Component
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    trend?: number;
    subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, trend, subtitle }) => (
    <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-md`}>
                <Icon className="h-5 w-5 text-white" />
            </div>
            {trend !== undefined && (
                <div className={`flex items-center gap-1 text-xs font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {Math.abs(trend).toFixed(1)}%
                </div>
            )}
        </div>
        <p className="text-2xl font-bold text-gray-900">{typeof value === 'number' ? value.toLocaleString() : value}</p>
        <p className="text-xs text-gray-500 mt-1">{title}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
);

// Main Component
const Commission: React.FC = () => {
    const [commissions, setCommissions] = useState<TheaterCommission[]>([]);
    const [summary, setSummary] = useState<CommissionSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<FilterOptions>({
        dateRange: 'month',
        status: 'all',
        theaterId: 'all',
    });
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCommission, setSelectedCommission] = useState<TheaterCommission | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });
    
    // Load data
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 800));
            const mockCommissions = generateMockCommissions();
            setCommissions(mockCommissions);
            setSummary(generateSummaryData(mockCommissions));
            setIsLoading(false);
        };
        loadData();
    }, []);
    
    // Filtered commissions
    const filteredCommissions = useMemo(() => {
        let filtered = [...commissions];
        
        if (searchTerm) {
            filtered = filtered.filter(c =>
                c.theaterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.theaterLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        if (filters.status !== 'all') {
            filtered = filtered.filter(c => c.status === filters.status);
        }
        
        if (filters.theaterId !== 'all') {
            filtered = filtered.filter(c => c.theaterId === filters.theaterId);
        }
        
        // Date range filtering
        if (filters.dateRange !== 'all' && filters.dateRange !== 'custom') {
            const now = new Date();
            let startDate: Date;
            
            switch (filters.dateRange) {
                case 'today':
                    startDate = new Date(now.setHours(0, 0, 0, 0));
                    break;
                case 'week':
                    startDate = new Date(now.setDate(now.getDate() - 7));
                    break;
                case 'month':
                    startDate = new Date(now.setMonth(now.getMonth() - 1));
                    break;
                case 'quarter':
                    startDate = new Date(now.setMonth(now.getMonth() - 3));
                    break;
                case 'year':
                    startDate = new Date(now.setFullYear(now.getFullYear() - 1));
                    break;
                default:
                    startDate = new Date(0);
            }
            
            filtered = filtered.filter(c => new Date(c.dueDate) >= startDate);
        }
        
        return filtered;
    }, [commissions, searchTerm, filters]);
    
    // Totals for filtered data
    const totals = useMemo(() => {
        return {
            totalCommissions: filteredCommissions.reduce((sum, c) => sum + c.commissionAmount, 0),
            totalRevenue: filteredCommissions.reduce((sum, c) => sum + c.totalRevenue, 0),
            totalTicketsSold: filteredCommissions.reduce((sum, c) => sum + c.ticketsSold, 0),
            totalEvents: filteredCommissions.reduce((sum, c) => sum + c.eventsCount, 0),
            pendingAmount: filteredCommissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.commissionAmount, 0),
            overdueAmount: filteredCommissions.filter(c => c.status === 'overdue').reduce((sum, c) => sum + c.commissionAmount, 0),
        };
    }, [filteredCommissions]);
    
    // Chart data
    const chartData = useMemo(() => {
        const monthlyMap = new Map<string, { amount: number; revenue: number }>();
        filteredCommissions.forEach(comm => {
            const month = new Date(comm.dueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            const current = monthlyMap.get(month) || { amount: 0, revenue: 0 };
            monthlyMap.set(month, {
                amount: current.amount + comm.commissionAmount,
                revenue: current.revenue + comm.totalRevenue
            });
        });
        
        return Array.from(monthlyMap.entries())
            .map(([month, data]) => ({ month, commission: data.amount, revenue: data.revenue }))
            .slice(-6);
    }, [filteredCommissions]);
    
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
            month: 'short',
            day: 'numeric'
        });
    };
    
    const getStatusBadge = (status: string) => {
        const config = {
            paid: { bg: 'bg-green-100', text: 'text-green-700', label: 'Paid' },
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
            overdue: { bg: 'bg-red-100', text: 'text-red-700', label: 'Overdue' },
            cancelled: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Cancelled' }
        };
        const c = config[status as keyof typeof config];
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
                {STATUS_ICONS[status as keyof typeof STATUS_ICONS]}
                {c.label}
            </span>
        );
    };
    
    const handleExport = async () => {
        setIsExporting(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const headers = ['Theater', 'Location', 'Period', 'Revenue', 'Commission Rate', 'Commission Amount', 'Status', 'Due Date', 'Tickets Sold', 'Events'];
        const rows = filteredCommissions.map(c => [
            c.theaterName,
            c.theaterLocation,
            `${formatDate(c.period.start)} - ${formatDate(c.period.end)}`,
            formatCurrency(c.totalRevenue),
            `${c.commissionRate}%`,
            formatCurrency(c.commissionAmount),
            c.status,
            formatDate(c.dueDate),
            c.ticketsSold,
            c.eventsCount
        ]);
        
        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `commission_report_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        
        setIsExporting(false);
        setPopupMessage({ title: 'Success!', message: 'Report exported successfully', type: 'success' });
        setShowSuccessPopup(true);
    };
    
    const uniqueTheaters = useMemo(() => {
        const theaters = new Map();
        commissions.forEach(c => {
            if (!theaters.has(c.theaterId)) {
                theaters.set(c.theaterId, { id: c.theaterId, name: c.theaterName });
            }
        });
        return Array.from(theaters.values());
    }, [commissions]);
    
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <RefreshCw className="h-12 w-12 animate-spin text-teal-600 mx-auto mb-4" />
                    <p className="text-gray-500">Loading commission data...</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="space-y-6 p-4 md:p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Commission Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Track and manage theater commissions</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <Filter className="h-4 w-4" />
                        Filters
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 transition-colors disabled:opacity-50 shadow-md"
                    >
                        {isExporting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                        Export CSV
                    </button>
                </div>
            </div>
            
            {/* Stats Cards */}
            {summary && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <StatCard
                        title="Total Commission"
                        value={formatCurrency(totals.totalCommissions)}
                        icon={DollarSign}
                        color="from-emerald-500 to-teal-600"
                        trend={12.5}
                    />
                    <StatCard
                        title="Pending Amount"
                        value={formatCurrency(totals.pendingAmount)}
                        icon={Clock}
                        color="from-yellow-500 to-orange-600"
                        trend={-5.2}
                    />
                    <StatCard
                        title="Overdue Amount"
                        value={formatCurrency(totals.overdueAmount)}
                        icon={AlertCircle}
                        color="from-red-500 to-rose-600"
                        trend={8.3}
                    />
                    <StatCard
                        title="Active Theaters"
                        value={summary.activeTheaters}
                        icon={Building}
                        color="from-blue-500 to-cyan-600"
                        subtitle={`${summary.totalTheaters} total theaters`}
                    />
                </div>
            )}
            
            {/* Filters Panel */}
            {showFilters && (
                <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-900">Filter Commissions</h3>
                        <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                            <XCircle className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                            <select
                                value={filters.dateRange}
                                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value as any })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                            >
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <option value="quarter">This Quarter</option>
                                <option value="year">This Year</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                            >
                                <option value="all">All Status</option>
                                <option value="paid">Paid</option>
                                <option value="pending">Pending</option>
                                <option value="overdue">Overdue</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Theater</label>
                            <select
                                value={filters.theaterId}
                                onChange={(e) => setFilters({ ...filters, theaterId: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                            >
                                <option value="all">All Theaters</option>
                                {uniqueTheaters.map(theater => (
                                    <option key={theater.id} value={theater.id}>{theater.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => setFilters({ dateRange: 'month', status: 'all', theaterId: 'all' })}
                                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by theater name, location, or transaction ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                />
            </div>
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Commission Trend Chart */}
                <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Commission Trend</h3>
                            <p className="text-xs text-gray-500 mt-0.5">Monthly commission collection</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-teal-500" />
                            <span className="text-xs text-gray-600">Commission</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="commissionGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                            <XAxis dataKey="month" stroke="#6B7280" tick={{ fontSize: 12 }} />
                            <YAxis stroke="#6B7280" tickFormatter={(v) => formatCurrency(v)} tick={{ fontSize: 12 }} />
                            <Tooltip formatter={(value: any) => formatCurrency(value)} />
                            <Area type="monotone" dataKey="commission" stroke="#14b8a6" strokeWidth={2} fill="url(#commissionGradient)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                
                {/* Commission by Status Pie Chart */}
                {summary && (
                    <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
                        <h3 className="text-base font-semibold text-gray-900 mb-4">Commission by Status</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <RePieChart>
                                <Pie
                                    data={summary.commissionByStatus}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="amount"
                                    label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
                                >
                                    {summary.commissionByStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: any) => formatCurrency(value)} />
                            </RePieChart>
                        </ResponsiveContainer>
                        <div className="mt-4 space-y-2">
                            {summary.commissionByStatus.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-gray-600">{item.status}</span>
                                    </div>
                                    <span className="font-semibold text-gray-900">{formatCurrency(item.amount)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Top Performing Theaters */}
            {summary && summary.topPerformingTheaters.length > 0 && (
                <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Top Performing Theaters</h3>
                            <p className="text-xs text-gray-500 mt-0.5">Highest commission contributors</p>
                        </div>
                        <Award className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="space-y-3">
                        {summary.topPerformingTheaters.map((theater, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{theater.theaterName}</p>
                                        <p className="text-xs text-gray-500">Total Commission</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">{formatCurrency(theater.commissionAmount)}</p>
                                    <div className={`flex items-center gap-1 text-xs ${theater.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {theater.growth >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                        {Math.abs(theater.growth).toFixed(1)}%
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Commissions Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Commission Transactions</h3>
                            <p className="text-xs text-gray-500 mt-0.5">Detailed list of all commission records</p>
                        </div>
                        <div className="text-sm text-gray-500">
                            {filteredCommissions.length} records found
                        </div>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Theater</th>
                                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                                <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                                <th className="px-5 py-3 text-center text-xs font-medium text-gray-500 uppercase">Rate</th>
                                <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase">Commission</th>
                                <th className="px-5 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-5 py-3 text-center text-xs font-medium text-gray-500 uppercase">Due Date</th>
                                <th className="px-5 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredCommissions.slice(0, 20).map((commission) => (
                                <tr key={commission.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-4">
                                        <div>
                                            <p className="font-medium text-gray-900">{commission.theaterName}</p>
                                            <p className="text-xs text-gray-500">{commission.theaterLocation}</p>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-gray-600">
                                        {formatDate(commission.period.start)} - {formatDate(commission.period.end)}
                                    </td>
                                    <td className="px-5 py-4 text-right text-sm font-medium text-gray-900">
                                        {formatCurrency(commission.totalRevenue)}
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                                            <Percent className="h-3 w-3" />
                                            {commission.commissionRate}%
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-right font-bold text-gray-900">
                                        {formatCurrency(commission.commissionAmount)}
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        {getStatusBadge(commission.status)}
                                    </td>
                                    <td className="px-5 py-4 text-center text-sm text-gray-600">
                                        {formatDate(commission.dueDate)}
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <button
                                            onClick={() => {
                                                setSelectedCommission(commission);
                                                setShowDetailsModal(true);
                                            }}
                                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                                            title="View Details"
                                        >
                                            <Eye className="h-4 w-4 text-blue-600" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {filteredCommissions.length === 0 && (
                    <div className="text-center py-12">
                        <Receipt className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No commission records found</p>
                    </div>
                )}
            </div>
            
            {/* Details Modal */}
            {showDetailsModal && selectedCommission && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDetailsModal(false)}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-xl">
                                        <Receipt className="h-5 w-5 text-white" />
                                    </div>
                                    <h2 className="text-lg font-bold text-white">Commission Details</h2>
                                </div>
                                <button onClick={() => setShowDetailsModal(false)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                                    <XCircle className="h-5 w-5 text-white" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">Theater</span>
                                    <span className="font-medium text-gray-900">{selectedCommission.theaterName}</span>
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">Location</span>
                                    <span className="text-sm text-gray-700">{selectedCommission.theaterLocation}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Period</span>
                                    <span className="text-sm text-gray-700">
                                        {formatDate(selectedCommission.period.start)} - {formatDate(selectedCommission.period.end)}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-xl p-3 text-center">
                                    <p className="text-xs text-gray-500 mb-1">Total Revenue</p>
                                    <p className="text-lg font-bold text-gray-900">{formatCurrency(selectedCommission.totalRevenue)}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-3 text-center">
                                    <p className="text-xs text-gray-500 mb-1">Commission Rate</p>
                                    <p className="text-lg font-bold text-gray-900">{selectedCommission.commissionRate}%</p>
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 text-center">
                                <p className="text-xs text-gray-500 mb-1">Commission Amount</p>
                                <p className="text-2xl font-bold text-teal-600">{formatCurrency(selectedCommission.commissionAmount)}</p>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-sm text-gray-600">Status</span>
                                    <span>{getStatusBadge(selectedCommission.status)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-sm text-gray-600">Due Date</span>
                                    <span className="text-sm text-gray-900">{formatDate(selectedCommission.dueDate)}</span>
                                </div>
                                {selectedCommission.paidDate && (
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-sm text-gray-600">Paid Date</span>
                                        <span className="text-sm text-gray-900">{formatDate(selectedCommission.paidDate)}</span>
                                    </div>
                                )}
                                {selectedCommission.paymentMethod && (
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-sm text-gray-600">Payment Method</span>
                                        <span className="text-sm text-gray-900">{selectedCommission.paymentMethod}</span>
                                    </div>
                                )}
                                {selectedCommission.transactionId && (
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-sm text-gray-600">Transaction ID</span>
                                        <span className="text-sm font-mono text-gray-900">{selectedCommission.transactionId}</span>
                                    </div>
                                )}
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-sm text-gray-600">Tickets Sold</span>
                                    <span className="text-sm text-gray-900">{selectedCommission.ticketsSold.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-sm text-gray-600">Events Held</span>
                                    <span className="text-sm text-gray-900">{selectedCommission.eventsCount}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-sm text-gray-600">Occupancy Rate</span>
                                    <span className="text-sm text-gray-900">{selectedCommission.occupancyRate.toFixed(1)}%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="border-t px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(selectedCommission.id);
                                    setPopupMessage({ title: 'Copied!', message: 'Commission ID copied to clipboard', type: 'success' });
                                    setShowSuccessPopup(true);
                                }}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                            >
                                <Copy className="h-4 w-4" />
                                Copy ID
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
    );
};

export default Commission;