// src/components/wallet/CommissionAnalytics.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    Download,
    Filter,
    RefreshCw,
    Search,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    Wallet,
    Building,
    Percent,
    CreditCard,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Users,
    Receipt,
    Award,
    Smartphone,
    Banknote,
    Send,
    Calendar as CalendarIcon,
    Loader2
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
import SuccessPopup from '../../../components/Reusable/SuccessPopup';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import supabase from '@/config/supabaseClient';

// Types
interface CommissionTransaction {
    id: string;
    theaterId: string;
    theaterName: string;
    theaterLocation: string;
    commissionRate: number;
    totalRevenue: number;
    commissionAmount: number;
    status: 'paid' | 'pending' | 'overdue';
    dueDate: string;
    paidDate?: string;
    paymentMethod: 'cash' | 'chapa' | 'telebirr' | 'bank_transfer';
    period: { start: string; end: string };
    ticketsSold: number;
    eventsCount: number;
}

interface TopTheater {
    theaterId: string;
    theaterName: string;
    totalCommission: number;
    totalRevenue: number;
    ticketsSold: number;
    eventsCount: number;
    rank: number;
}

type DateRangeType = 'daily' | 'monthly' | 'yearly' | 'custom';

const CommissionAnalytics: React.FC = () => {
    const [commissions, setCommissions] = useState<CommissionTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterPaymentMethod, setFilterPaymentMethod] = useState<string>('all');
    const [dateRangeType, setDateRangeType] = useState<DateRangeType>('monthly');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });
    const [topTheaters, setTopTheaters] = useState<TopTheater[]>([]);

    // ============================================
    // INLINE BACKEND - SUPABASE QUERIES
    // ============================================

    // Fetch commission data from database
    const fetchCommissionData = async () => {
        setIsLoading(true);
        try {
            // Get earnings data with theater info
            const { data: earnings, error: earningsError } = await supabase
                .from('earnings')
                .select(`
                    id,
                    gross_amount,
                    commission_amount,
                    net_amount,
                    created_at,
                    theater_id,
                    booking_id,
                    theaters (
                        id,
                        legal_business_name,
                        city,
                        address
                    )
                `)
                .order('created_at', { ascending: false });

            if (earningsError) throw earningsError;

            // Get payment data for status
            const { data: payments, error: paymentsError } = await supabase
                .from('payments')
                .select('id, booking_id, payment_status, payment_method, created_at')
                .eq('payment_status', 'completed');

            if (paymentsError) throw paymentsError;

            // Transform data
            const transactions: CommissionTransaction[] = earnings?.map(earning => {
                const relatedPayment = payments?.find(p => p.booking_id === earning.booking_id);
                
                // Determine status based on payment
                let status: 'paid' | 'pending' | 'overdue' = 'pending';
                if (relatedPayment?.payment_status === 'completed') {
                    status = 'paid';
                } else {
                    // Check if overdue (older than 30 days)
                    const createdDate = new Date(earning.created_at);
                    const now = new Date();
                    const daysDiff = (now.getTime() - createdDate.getTime()) / (1000 * 3600 * 24);
                    if (daysDiff > 30) status = 'overdue';
                }

                return {
                    id: earning.id,
                    theaterId: earning.theater_id,
                    theaterName: earning.theaters?.legal_business_name || 'Unknown Theater',
                    theaterLocation: `${earning.theaters?.city || 'Unknown'}, ${earning.theaters?.address || ''}`,
                    commissionRate: earning.commission_amount && earning.gross_amount 
                        ? (earning.commission_amount / earning.gross_amount) * 100 
                        : 8,
                    totalRevenue: earning.gross_amount || 0,
                    commissionAmount: earning.commission_amount || 0,
                    status,
                    dueDate: earning.created_at,
                    paidDate: relatedPayment?.created_at,
                    paymentMethod: (relatedPayment?.payment_method as any) || 'bank_transfer',
                    period: {
                        start: new Date(earning.created_at).toISOString(),
                        end: new Date(earning.created_at).toISOString()
                    },
                    ticketsSold: 1,
                    eventsCount: 1
                };
            }) || [];

            setCommissions(transactions);
            calculateTopTheaters(transactions);
            
        } catch (error) {
            console.error('Error fetching commission data:', error);
            setPopupMessage({
                title: 'Error',
                message: 'Failed to load commission data',
                type: 'error'
            });
            setShowSuccessPopup(true);
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate top performing theaters
    const calculateTopTheaters = (data: CommissionTransaction[]) => {
        const theaterMap = new Map<string, TopTheater>();
        
        data.forEach(transaction => {
            const existing = theaterMap.get(transaction.theaterId);
            if (existing) {
                existing.totalCommission += transaction.commissionAmount;
                existing.totalRevenue += transaction.totalRevenue;
                existing.ticketsSold += transaction.ticketsSold;
                existing.eventsCount += transaction.eventsCount;
            } else {
                theaterMap.set(transaction.theaterId, {
                    theaterId: transaction.theaterId,
                    theaterName: transaction.theaterName,
                    totalCommission: transaction.commissionAmount,
                    totalRevenue: transaction.totalRevenue,
                    ticketsSold: transaction.ticketsSold,
                    eventsCount: transaction.eventsCount,
                    rank: 0
                });
            }
        });
        
        const sorted = Array.from(theaterMap.values())
            .sort((a, b) => b.totalCommission - a.totalCommission)
            .map((theater, index) => ({ ...theater, rank: index + 1 }));
        
        setTopTheaters(sorted);
    };

    // Load data on mount
    useEffect(() => {
        fetchCommissionData();
    }, []);

    // Date filtering logic
    const filterByDateRange = (transaction: CommissionTransaction): boolean => {
        const transactionDate = new Date(transaction.dueDate);
        const now = new Date();
        
        switch (dateRangeType) {
            case 'daily':
                const today = new Date();
                return transactionDate.toDateString() === today.toDateString();
            case 'monthly':
                return transactionDate.getMonth() === now.getMonth() && 
                       transactionDate.getFullYear() === now.getFullYear();
            case 'yearly':
                return transactionDate.getFullYear() === now.getFullYear();
            case 'custom':
                if (customStartDate && customEndDate) {
                    const start = new Date(customStartDate);
                    const end = new Date(customEndDate);
                    end.setHours(23, 59, 59);
                    return transactionDate >= start && transactionDate <= end;
                }
                return true;
            default:
                return true;
        }
    };

    // Filtered data
    const filteredCommissions = useMemo(() => {
        let filtered = [...commissions];
        
        // Apply date range filter
        filtered = filtered.filter(filterByDateRange);
        
        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(c =>
                c.theaterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.theaterLocation.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Apply status filter
        if (filterStatus !== 'all') {
            filtered = filtered.filter(c => c.status === filterStatus);
        }
        
        // Apply payment method filter
        if (filterPaymentMethod !== 'all') {
            filtered = filtered.filter(c => c.paymentMethod === filterPaymentMethod);
        }
        
        return filtered;
    }, [commissions, searchTerm, filterStatus, filterPaymentMethod, dateRangeType, customStartDate, customEndDate]);

    // Calculate totals
    const totals = useMemo(() => {
        const totalCommission = filteredCommissions.reduce((sum, c) => sum + c.commissionAmount, 0);
        const totalRevenue = filteredCommissions.reduce((sum, c) => sum + c.totalRevenue, 0);
        const cashTotal = filteredCommissions.filter(c => c.status === 'paid' && c.paymentMethod === 'cash').reduce((sum, c) => sum + c.commissionAmount, 0);
        const chapaTotal = filteredCommissions.filter(c => c.status === 'paid' && c.paymentMethod === 'chapa').reduce((sum, c) => sum + c.commissionAmount, 0);
        const telebirrTotal = filteredCommissions.filter(c => c.status === 'paid' && c.paymentMethod === 'telebirr').reduce((sum, c) => sum + c.commissionAmount, 0);
        const bankTransferTotal = filteredCommissions.filter(c => c.status === 'paid' && c.paymentMethod === 'bank_transfer').reduce((sum, c) => sum + c.commissionAmount, 0);
        const pendingTotal = filteredCommissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.commissionAmount, 0);
        const overdueTotal = filteredCommissions.filter(c => c.status === 'overdue').reduce((sum, c) => sum + c.commissionAmount, 0);
        const paidTotal = filteredCommissions.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.commissionAmount, 0);
        
        return { 
            totalCommission, totalRevenue, cashTotal, chapaTotal, telebirrTotal, 
            bankTransferTotal, pendingTotal, overdueTotal, paidTotal 
        };
    }, [filteredCommissions]);

    // Trend data based on date range
    const trendData = useMemo(() => {
        if (dateRangeType === 'daily') {
            // Last 7 days
            const last7Days = Array.from({ length: 7 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                return d.toISOString().split('T')[0];
            });
            
            return last7Days.map(day => {
                const dayCommissions = filteredCommissions.filter(c => 
                    new Date(c.dueDate).toISOString().split('T')[0] === day
                );
                return {
                    period: new Date(day).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                    commission: dayCommissions.reduce((sum, c) => sum + c.commissionAmount, 0),
                    revenue: dayCommissions.reduce((sum, c) => sum + c.totalRevenue, 0),
                    cash: dayCommissions.filter(c => c.paymentMethod === 'cash' && c.status === 'paid').reduce((sum, c) => sum + c.commissionAmount, 0),
                    chapa: dayCommissions.filter(c => c.paymentMethod === 'chapa' && c.status === 'paid').reduce((sum, c) => sum + c.commissionAmount, 0)
                };
            });
        } else if (dateRangeType === 'yearly') {
            // Last 12 months aggregated by year
            const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - (4 - i));
            return years.map(year => {
                const yearCommissions = filteredCommissions.filter(c => 
                    new Date(c.dueDate).getFullYear() === year
                );
                return {
                    period: year.toString(),
                    commission: yearCommissions.reduce((sum, c) => sum + c.commissionAmount, 0),
                    revenue: yearCommissions.reduce((sum, c) => sum + c.totalRevenue, 0),
                    cash: yearCommissions.filter(c => c.paymentMethod === 'cash' && c.status === 'paid').reduce((sum, c) => sum + c.commissionAmount, 0),
                    chapa: yearCommissions.filter(c => c.paymentMethod === 'chapa' && c.status === 'paid').reduce((sum, c) => sum + c.commissionAmount, 0)
                };
            });
        } else {
            // Monthly - last 12 months
            const months = Array.from({ length: 12 }, (_, i) => {
                const d = new Date();
                d.setMonth(d.getMonth() - (11 - i));
                return d.toISOString().slice(0, 7);
            });
            
            return months.map(month => {
                const monthCommissions = filteredCommissions.filter(c => 
                    c.dueDate.startsWith(month)
                );
                return {
                    period: new Date(month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                    commission: monthCommissions.reduce((sum, c) => sum + c.commissionAmount, 0),
                    revenue: monthCommissions.reduce((sum, c) => sum + c.totalRevenue, 0),
                    cash: monthCommissions.filter(c => c.paymentMethod === 'cash' && c.status === 'paid').reduce((sum, c) => sum + c.commissionAmount, 0),
                    chapa: monthCommissions.filter(c => c.paymentMethod === 'chapa' && c.status === 'paid').reduce((sum, c) => sum + c.commissionAmount, 0)
                };
            });
        }
    }, [filteredCommissions, dateRangeType]);

    // Payment method distribution
    const paymentMethodData = useMemo(() => {
        return [
            { name: 'Cash', value: totals.cashTotal, color: '#10B981' },
            { name: 'Chapa', value: totals.chapaTotal, color: '#3B82F6' },
            { name: 'Telebirr', value: totals.telebirrTotal, color: '#8B5CF6' },
            { name: 'Bank Transfer', value: totals.bankTransferTotal, color: '#F59E0B' }
        ].filter(item => item.value > 0);
    }, [totals]);

    // Top Theaters for ReusableTable
    const topTheatersColumns = [
        {
            Header: 'Rank',
            accessor: 'rank',
            sortable: true,
            Cell: (row: TopTheater) => (
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-600 font-bold">
                    {row.rank}
                </div>
            )
        },
        {
            Header: 'Theater',
            accessor: 'theaterName',
            sortable: true,
            Cell: (row: TopTheater) => (
                <div>
                    <p className="font-medium text-gray-900">{row.theaterName}</p>
                    <p className="text-xs text-gray-500">ID: {row.theaterId.slice(-8)}</p>
                </div>
            )
        },
        {
            Header: 'Total Revenue',
            accessor: 'totalRevenue',
            sortable: true,
            Cell: (row: TopTheater) => (
                <p className="font-semibold text-gray-900">ETB {row.totalRevenue.toLocaleString()}</p>
            )
        },
        {
            Header: 'Commission',
            accessor: 'totalCommission',
            sortable: true,
            Cell: (row: TopTheater) => (
                <p className="font-bold text-teal-600">ETB {row.totalCommission.toLocaleString()}</p>
            )
        },
        {
            Header: 'Tickets',
            accessor: 'ticketsSold',
            sortable: true,
            Cell: (row: TopTheater) => (
                <p className="text-sm text-gray-900">{row.ticketsSold.toLocaleString()}</p>
            )
        },
        {
            Header: 'Events',
            accessor: 'eventsCount',
            sortable: true,
            Cell: (row: TopTheater) => (
                <p className="text-sm text-gray-900">{row.eventsCount}</p>
            )
        }
    ];

    const transactionColumns = [
        {
            Header: 'Theater',
            accessor: 'theaterName',
            sortable: true,
            Cell: (row: CommissionTransaction) => (
                <div>
                    <p className="font-medium text-gray-900">{row.theaterName}</p>
                    <p className="text-xs text-gray-500">{row.theaterLocation}</p>
                </div>
            )
        },
        {
            Header: 'Date',
            accessor: 'dueDate',
            sortable: true,
            Cell: (row: CommissionTransaction) => (
                <p className="text-sm text-gray-600">
                    {new Date(row.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
            )
        },
        {
            Header: 'Revenue',
            accessor: 'totalRevenue',
            sortable: true,
            Cell: (row: CommissionTransaction) => (
                <p className="text-sm font-medium text-gray-900">ETB {row.totalRevenue.toLocaleString()}</p>
            )
        },
        {
            Header: 'Commission',
            accessor: 'commissionAmount',
            sortable: true,
            Cell: (row: CommissionTransaction) => (
                <p className="text-sm font-bold text-teal-600">ETB {row.commissionAmount.toLocaleString()}</p>
            )
        },
        {
            Header: 'Rate',
            accessor: 'commissionRate',
            sortable: true,
            Cell: (row: CommissionTransaction) => (
                <p className="text-sm text-gray-600">{row.commissionRate.toFixed(1)}%</p>
            )
        },
        {
            Header: 'Status',
            accessor: 'status',
            sortable: true,
            Cell: (row: CommissionTransaction) => {
                const config = {
                    paid: { bg: 'bg-green-100', text: 'text-green-700', label: 'Paid', icon: '✅' },
                    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending', icon: '⏳' },
                    overdue: { bg: 'bg-red-100', text: 'text-red-700', label: 'Overdue', icon: '⚠️' }
                };
                const c = config[row.status];
                return <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>{c.icon} {c.label}</span>;
            }
        },
        {
            Header: 'Payment',
            accessor: 'paymentMethod',
            sortable: true,
            Cell: (row: CommissionTransaction) => {
                const config: Record<string, { bg: string; text: string; label: string }> = {
                    cash: { bg: 'bg-green-100', text: 'text-green-700', label: '💰 Cash' },
                    chapa: { bg: 'bg-blue-100', text: 'text-blue-700', label: '📱 Chapa' },
                    telebirr: { bg: 'bg-purple-100', text: 'text-purple-700', label: '📱 Telebirr' },
                    bank_transfer: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '🏦 Bank Transfer' }
                };
                const c = config[row.paymentMethod];
                return <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>{c.label}</span>;
            }
        }
    ];

    const formatETB = (amount: number) => `ETB ${amount.toLocaleString()}`;

    const handleExport = () => {
        const headers = ['Theater', 'Location', 'Date', 'Revenue', 'Commission', 'Rate', 'Status', 'Payment Method'];
        const rows = filteredCommissions.map(c => [
            c.theaterName, c.theaterLocation,
            new Date(c.dueDate).toLocaleDateString(),
            c.totalRevenue, c.commissionAmount, `${c.commissionRate.toFixed(1)}%`,
            c.status, c.paymentMethod
        ]);
        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `commission_report_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        setPopupMessage({ title: 'Success!', message: 'Report exported successfully', type: 'success' });
        setShowSuccessPopup(true);
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setFilterStatus('all');
        setFilterPaymentMethod('all');
        setDateRangeType('monthly');
        setCustomStartDate('');
        setCustomEndDate('');
        setPopupMessage({ title: 'Filters Reset', message: 'All filters have been cleared', type: 'success' });
        setShowSuccessPopup(true);
    };

    const handleRefresh = async () => {
        await fetchCommissionData();
        setPopupMessage({ title: 'Refreshed', message: 'Data has been updated', type: 'success' });
        setShowSuccessPopup(true);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-teal-600 mx-auto mb-4" />
                    <p className="text-gray-500">Loading commission data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Commission Analytics</h1>
                    <p className="text-sm text-gray-500">Track and analyze theater commissions</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={handleRefresh} 
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                        <RefreshCw className="h-4 w-4" /> Refresh
                    </button>
                    <button 
                        onClick={handleExport} 
                        className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                    >
                        <Download className="h-4 w-4" /> Export CSV
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
                <div className="bg-white rounded-xl p-5 shadow-lg border">
                    <div className="flex justify-between items-start mb-3">
                        <div className="p-3 bg-emerald-500 rounded-xl text-white"><Wallet className="h-5 w-5" /></div>
                        <span className="text-green-600 text-sm">+12.5%</span>
                    </div>
                    <p className="text-2xl font-bold">{formatETB(totals.totalCommission)}</p>
                    <p className="text-sm text-gray-500">Total Commission</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-lg border">
                    <div className="flex justify-between items-start mb-3">
                        <div className="p-3 bg-blue-500 rounded-xl text-white"><TrendingUp className="h-5 w-5" /></div>
                        <span className="text-green-600 text-sm">+8.2%</span>
                    </div>
                    <p className="text-2xl font-bold">{formatETB(totals.totalRevenue)}</p>
                    <p className="text-sm text-gray-500">Total Revenue</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-lg border">
                    <div className="flex justify-between items-start mb-3">
                        <div className="p-3 bg-green-500 rounded-xl text-white"><Banknote className="h-5 w-5" /></div>
                        <span className="text-green-600 text-sm">+15.3%</span>
                    </div>
                    <p className="text-2xl font-bold">{formatETB(totals.paidTotal)}</p>
                    <p className="text-sm text-gray-500">Paid Commission</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-lg border">
                    <div className="flex justify-between items-start mb-3">
                        <div className="p-3 bg-yellow-500 rounded-xl text-white"><Clock className="h-5 w-5" /></div>
                        <span className="text-yellow-600 text-sm">Pending</span>
                    </div>
                    <p className="text-2xl font-bold">{formatETB(totals.pendingTotal)}</p>
                    <p className="text-sm text-gray-500">Pending Payment</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-lg border">
                    <div className="flex justify-between items-start mb-3">
                        <div className="p-3 bg-red-500 rounded-xl text-white"><AlertCircle className="h-5 w-5" /></div>
                        <span className="text-red-600 text-sm">Overdue</span>
                    </div>
                    <p className="text-2xl font-bold">{formatETB(totals.overdueTotal)}</p>
                    <p className="text-sm text-gray-500">Overdue Payment</p>
                </div>
            </div>

            {/* Date Range Selector */}
            <div className="bg-white rounded-xl p-5 shadow-lg border">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Date Range:</span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setDateRangeType('daily')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                dateRangeType === 'daily' 
                                    ? 'bg-teal-600 text-white' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Daily
                        </button>
                        <button
                            onClick={() => setDateRangeType('monthly')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                dateRangeType === 'monthly' 
                                    ? 'bg-teal-600 text-white' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setDateRangeType('yearly')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                dateRangeType === 'yearly' 
                                    ? 'bg-teal-600 text-white' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Yearly
                        </button>
                        <button
                            onClick={() => setDateRangeType('custom')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                dateRangeType === 'custom' 
                                    ? 'bg-teal-600 text-white' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Custom
                        </button>
                    </div>
                    
                    {dateRangeType === 'custom' && (
                        <div className="flex gap-3 ml-4">
                            <input
                                type="date"
                                value={customStartDate}
                                onChange={(e) => setCustomStartDate(e.target.value)}
                                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                            />
                            <span className="text-gray-500 self-center">to</span>
                            <input
                                type="date"
                                value={customEndDate}
                                onChange={(e) => setCustomEndDate(e.target.value)}
                                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-wrap gap-4 items-end bg-white rounded-xl p-5 shadow-lg border">
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by theater name or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                </div>
                <div className="w-[180px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                    >
                        <option value="all">All Status</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="overdue">Overdue</option>
                    </select>
                </div>
                <div className="w-[180px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                    <select
                        value={filterPaymentMethod}
                        onChange={(e) => setFilterPaymentMethod(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                    >
                        <option value="all">All Methods</option>
                        <option value="cash">Cash</option>
                        <option value="chapa">Chapa</option>
                        <option value="telebirr">Telebirr</option>
                        <option value="bank_transfer">Bank Transfer</option>
                    </select>
                </div>
                <div>
                    <button
                        onClick={handleResetFilters}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors mt-6"
                    >
                        <RefreshCw className="h-4 w-4 inline mr-2" />
                        Reset Filters
                    </button>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Area Chart - Commission Trend */}
                <div className="bg-white rounded-xl p-5 shadow-lg">
                    <h3 className="text-lg font-semibold mb-4">
                        Commission Trend ({dateRangeType === 'daily' ? 'Daily' : dateRangeType === 'yearly' ? 'Yearly' : 'Monthly'})
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                            <XAxis dataKey="period" stroke="#6B7280" tick={{ fontSize: 12 }} />
                            <YAxis stroke="#6B7280" tickFormatter={(v) => `ETB ${v/1000}k`} tick={{ fontSize: 12 }} />
                            <Tooltip formatter={(value: any) => formatETB(value)} />
                            <Area type="monotone" dataKey="commission" stroke="#14b8a6" strokeWidth={2} fill="url(#areaGradient)" name="Commission" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart - Payment Methods */}
                <div className="bg-white rounded-xl p-5 shadow-lg">
                    <h3 className="text-lg font-semibold mb-4">Payment Methods Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <RePieChart>
                            <Pie
                                data={paymentMethodData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                            >
                                {paymentMethodData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: any) => formatETB(value)} />
                        </RePieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 grid grid-cols-4 gap-3">
                        {paymentMethodData.map((item, idx) => (
                            <div key={idx} className="text-center p-2 bg-gray-50 rounded-lg">
                                <p className="text-lg font-bold" style={{ color: item.color }}>{formatETB(item.value)}</p>
                                <p className="text-xs text-gray-500">{item.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bar Chart - Cash vs Chapa vs Telebirr */}
            <div className="bg-white rounded-xl p-5 shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Payment Method Collection Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                        <XAxis dataKey="period" stroke="#6B7280" tick={{ fontSize: 12 }} />
                        <YAxis stroke="#6B7280" tickFormatter={(v) => `ETB ${v/1000}k`} tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(value: any) => formatETB(value)} />
                        <Legend />
                        <Bar dataKey="cash" name="Cash" fill="#10B981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="chapa" name="Chapa" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Top Performing Theaters Table using ReusableTable */}
            <ReusableTable
                columns={topTheatersColumns}
                data={topTheaters}
                title="Top Performing Theaters"
                icon={Award}
                showSearch={false}
                showExport={false}
                showPrint={false}
                itemsPerPage={10}
            />

            {/* Commission Transactions Table using ReusableTable */}
            <ReusableTable
                columns={transactionColumns}
                data={filteredCommissions}
                title="Commission Transactions"
                icon={Receipt}
                showSearch={false}
                showExport={false}
                showPrint={false}
                itemsPerPage={10}
            />

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

export default CommissionAnalytics;