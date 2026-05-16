// src/components/wallet/CommissionAnalytics.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    RefreshCw,
    Search,
    Wallet,
    Building,
    Percent,
    CreditCard,
    Calendar as CalendarIcon,
    Loader2,
    Award,
    Receipt,
    DollarSign,
    CheckCircle,
    Activity,
    PieChart as PieChartIcon,
    Smartphone,
    Banknote,
    Landmark
} from 'lucide-react';
import {
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
    paymentMethod: string;
    period: { start: string; end: string };
    eventsCount: number;
}

interface TopTheater {
    theaterId: string;
    theaterName: string;
    totalCommission: number;
    totalRevenue: number;
    eventsCount: number;
    rank: number;
}

interface PaymentDistribution {
    name: string;
    value: number;
    color: string;
    count: number;
    icon: React.ElementType;
}

interface ActiveCommissionTheater {
    theaterId: string;
    theaterName: string;
    commissionRate: number;
    totalRevenue: number;
    totalCommission: number;
    activeEvents: number;
    monthlyData?: { month: string; commission: number; revenue: number }[];
}

type DateRangeType = 'daily' | 'monthly' | 'yearly';

const CommissionAnalytics: React.FC = () => {
    const [commissions, setCommissions] = useState<CommissionTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRangeType, setDateRangeType] = useState<DateRangeType>('monthly');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });
    const [topTheaters, setTopTheaters] = useState<TopTheater[]>([]);
    const [activeCommissionTheaters, setActiveCommissionTheaters] = useState<ActiveCommissionTheater[]>([]);
    const [paymentDistribution, setPaymentDistribution] = useState<PaymentDistribution[]>([]);
    const [activeTheatersTrendData, setActiveTheatersTrendData] = useState<any[]>([]);
    const [filteredSearchTerm, setFilteredSearchTerm] = useState('');

    // ============================================
    // FETCH REAL DATA FROM SUPABASE
    // ============================================

    const fetchCommissionData = async () => {
        setIsLoading(true);
        try {
            // 1. Fetch earnings with theater and contract info
            const { data: earnings, error: earningsError } = await supabase
                .from('earnings')
                .select(`
                    id,
                    gross_amount,
                    commission_amount,
                    net_amount,
                    created_at,
                    theater_id,
                    reservation_id,
                    contract_id,
                    is_subscription_payment,
                    theaters:theater_id (
                        id,
                        legal_business_name,
                        city,
                        address,
                        email,
                        phone,
                        status
                    ),
                    owners_contracts:contract_id (
                        contract_type,
                        commission_rate
                    )
                `)
                .eq('is_subscription_payment', false)
                .order('created_at', { ascending: false });

            if (earningsError) throw earningsError;

            // 2. Fetch payment information from reservations
            const { data: reservations, error: reservationsError } = await supabase
                .from('reservations')
                .select('id, payment_status, payment_method, created_at, total_amount')
                .in('status', ['confirmed', 'completed']);

            if (reservationsError) throw reservationsError;

            // 3. Fetch contract info for commission rates
            const { data: contracts, error: contractsError } = await supabase
                .from('owners_contracts')
                .select('theater_id, commission_rate, contract_type, status')
                .eq('status', 'active');

            if (contractsError) throw contractsError;

            // Build contract rate map
            const contractRateMap: Record<string, number> = {};
            contracts?.forEach(contract => {
                contractRateMap[contract.theater_id] = contract.commission_rate;
            });

            // Build payment map
            const paymentMethodCount: Record<string, { total: number; count: number }> = {};
            
            reservations?.forEach(res => {
                const method = res.payment_method || 'bank_transfer';
                if (!paymentMethodCount[method]) {
                    paymentMethodCount[method] = { total: 0, count: 0 };
                }
                paymentMethodCount[method].total += res.total_amount || 0;
                paymentMethodCount[method].count += 1;
            });

            // Set payment distribution with deep teal for Cash
            const paymentConfig: Record<string, { name: string; color: string; icon: React.ElementType }> = {
                cash: { name: 'Cash', color: '#0D9488', icon: Banknote }, // Deep Teal
                chapa: { name: 'Chapa', color: '#3B82F6', icon: Smartphone },
                telebirr: { name: 'Telebirr', color: '#8B5CF6', icon: Smartphone },
                bank_transfer: { name: 'Bank Transfer', color: '#F59E0B', icon: Landmark }
            };

            const distribution: PaymentDistribution[] = Object.entries(paymentMethodCount).map(([method, data]) => ({
                name: paymentConfig[method]?.name || method,
                value: data.total,
                color: paymentConfig[method]?.color || '#6B7280',
                count: data.count,
                icon: paymentConfig[method]?.icon || CreditCard
            }));

            setPaymentDistribution(distribution);

            // Transform data for transactions
            const transactions: CommissionTransaction[] = earnings?.map(earning => {
                const theater = earning.theaters;
                const contract = earning.owners_contracts;
                
                let status: 'paid' | 'pending' | 'overdue' = 'pending';
                const createdDate = new Date(earning.created_at);
                const now = new Date();
                const daysDiff = (now.getTime() - createdDate.getTime()) / (1000 * 3600 * 24);
                if (daysDiff <= 30) status = 'paid';
                else if (daysDiff > 30 && daysDiff <= 60) status = 'pending';
                else status = 'overdue';

                return {
                    id: earning.id,
                    theaterId: earning.theater_id,
                    theaterName: theater?.legal_business_name || 'Unknown Theater',
                    theaterLocation: `${theater?.city || 'Unknown'}, ${theater?.address || ''}`,
                    commissionRate: contract?.commission_rate || contractRateMap[earning.theater_id] || 8,
                    totalRevenue: earning.gross_amount || 0,
                    commissionAmount: earning.commission_amount || 0,
                    status,
                    dueDate: earning.created_at,
                    paymentMethod: 'bank_transfer',
                    period: {
                        start: earning.created_at,
                        end: earning.created_at
                    },
                    eventsCount: 1
                };
            }) || [];

            setCommissions(transactions);
            calculateTopTheaters(transactions);
            calculateActiveCommissionTheaters(transactions, contractRateMap);
            calculateActiveTheatersTrend(transactions);
            
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

    const calculateTopTheaters = (data: CommissionTransaction[]) => {
        const theaterMap = new Map<string, TopTheater>();
        
        data.forEach(transaction => {
            const existing = theaterMap.get(transaction.theaterId);
            if (existing) {
                existing.totalCommission += transaction.commissionAmount;
                existing.totalRevenue += transaction.totalRevenue;
                existing.eventsCount += transaction.eventsCount;
            } else {
                theaterMap.set(transaction.theaterId, {
                    theaterId: transaction.theaterId,
                    theaterName: transaction.theaterName,
                    totalCommission: transaction.commissionAmount,
                    totalRevenue: transaction.totalRevenue,
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

    const calculateActiveCommissionTheaters = (data: CommissionTransaction[], contractRateMap: Record<string, number>) => {
        const theaterMap = new Map<string, ActiveCommissionTheater>();
        
        data.forEach(transaction => {
            const existing = theaterMap.get(transaction.theaterId);
            if (existing) {
                existing.totalRevenue += transaction.totalRevenue;
                existing.totalCommission += transaction.commissionAmount;
                existing.activeEvents += transaction.eventsCount;
            } else {
                theaterMap.set(transaction.theaterId, {
                    theaterId: transaction.theaterId,
                    theaterName: transaction.theaterName,
                    commissionRate: contractRateMap[transaction.theaterId] || 8,
                    totalRevenue: transaction.totalRevenue,
                    totalCommission: transaction.commissionAmount,
                    activeEvents: transaction.eventsCount
                });
            }
        });
        
        const sorted = Array.from(theaterMap.values())
            .sort((a, b) => b.totalCommission - a.totalCommission);
        
        setActiveCommissionTheaters(sorted);
    };

    const calculateActiveTheatersTrend = (data: CommissionTransaction[]) => {
        // Get months from May to current month
        const months = [];
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        
        // Start from May (month 4, since Jan = 0)
        for (let month = 4; month <= currentMonth; month++) {
            months.push({
                year: currentYear,
                month: month,
                label: new Date(currentYear, month, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
            });
        }
        
        // Also include previous year's May to December if current month is after May
        if (currentMonth >= 4) {
            for (let month = 4; month <= 11; month++) {
                if (month < currentMonth || currentYear > new Date().getFullYear()) {
                    months.unshift({
                        year: currentYear - 1,
                        month: month,
                        label: new Date(currentYear - 1, month, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                    });
                }
            }
        }
        
        // Sort months chronologically
        months.sort((a, b) => {
            if (a.year !== b.year) return a.year - b.year;
            return a.month - b.month;
        });
        
        const trendData = months.map(monthInfo => {
            const monthStr = `${monthInfo.year}-${String(monthInfo.month + 1).padStart(2, '0')}`;
            const monthData = data.filter(t => t.dueDate.startsWith(monthStr));
            
            return {
                period: monthInfo.label,
                totalCommission: monthData.reduce((sum, t) => sum + t.commissionAmount, 0),
                totalRevenue: monthData.reduce((sum, t) => sum + t.totalRevenue, 0),
                theatersCount: new Set(monthData.map(t => t.theaterId)).size
            };
        });
        
        setActiveTheatersTrendData(trendData);
    };

    useEffect(() => {
        fetchCommissionData();
    }, []);

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
            default:
                return true;
        }
    };

    // Apply search filter to commissions
    const searchFilteredCommissions = useMemo(() => {
        let filtered = [...commissions];
        
        if (filteredSearchTerm) {
            filtered = filtered.filter(c =>
                c.theaterName.toLowerCase().includes(filteredSearchTerm.toLowerCase()) ||
                c.theaterLocation.toLowerCase().includes(filteredSearchTerm.toLowerCase())
            );
        }
        
        return filtered;
    }, [commissions, filteredSearchTerm]);

    const filteredCommissions = useMemo(() => {
        let filtered = searchFilteredCommissions.filter(filterByDateRange);
        return filtered;
    }, [searchFilteredCommissions, dateRangeType]);

    const totals = useMemo(() => {
        const totalCommission = filteredCommissions.reduce((sum, c) => sum + c.commissionAmount, 0);
        const totalRevenue = filteredCommissions.reduce((sum, c) => sum + c.totalRevenue, 0);
        
        return { totalCommission, totalRevenue };
    }, [filteredCommissions]);

    const trendData = useMemo(() => {
        // Get months from May to current month for consistent display
        const months = [];
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        
        // Start from May (month 4)
        for (let month = 4; month <= currentMonth; month++) {
            months.push({
                year: currentYear,
                month: month,
                label: new Date(currentYear, month, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
            });
        }
        
        // Include previous year's May to December if we're past May
        if (currentMonth >= 4 && currentYear > new Date().getFullYear()) {
            for (let month = 4; month <= 11; month++) {
                months.unshift({
                    year: currentYear - 1,
                    month: month,
                    label: new Date(currentYear - 1, month, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                });
            }
        }
        
        months.sort((a, b) => {
            if (a.year !== b.year) return a.year - b.year;
            return a.month - b.month;
        });
        
        if (dateRangeType === 'daily') {
            const last30Days = Array.from({ length: 30 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (29 - i));
                return d.toISOString().split('T')[0];
            });
            
            return last30Days.map(day => {
                const dayCommissions = filteredCommissions.filter(c => 
                    new Date(c.dueDate).toISOString().split('T')[0] === day
                );
                return {
                    period: new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    commission: dayCommissions.reduce((sum, c) => sum + c.commissionAmount, 0),
                    revenue: dayCommissions.reduce((sum, c) => sum + c.totalRevenue, 0)
                };
            });
        } else if (dateRangeType === 'yearly') {
            const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - (4 - i));
            return years.map(year => {
                const yearCommissions = filteredCommissions.filter(c => 
                    new Date(c.dueDate).getFullYear() === year
                );
                return {
                    period: year.toString(),
                    commission: yearCommissions.reduce((sum, c) => sum + c.commissionAmount, 0),
                    revenue: yearCommissions.reduce((sum, c) => sum + c.totalRevenue, 0)
                };
            });
        } else {
            // Monthly - from May to current
            return months.map(monthInfo => {
                const monthStr = `${monthInfo.year}-${String(monthInfo.month + 1).padStart(2, '0')}`;
                const monthCommissions = filteredCommissions.filter(c => 
                    c.dueDate.startsWith(monthStr)
                );
                return {
                    period: monthInfo.label,
                    commission: monthCommissions.reduce((sum, c) => sum + c.commissionAmount, 0),
                    revenue: monthCommissions.reduce((sum, c) => sum + c.totalRevenue, 0)
                };
            });
        }
    }, [filteredCommissions, dateRangeType]);

    const formatETB = (amount: number) => {
        if (amount === 0) return 'ETB 0';
        return `ETB ${amount.toLocaleString()}`;
    };

    const handleSearch = () => {
        setFilteredSearchTerm(searchTerm);
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setFilteredSearchTerm('');
        setDateRangeType('monthly');
        setPopupMessage({ title: 'Filters Reset', message: 'All filters have been cleared', type: 'success' });
        setShowSuccessPopup(true);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

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
            Header: 'Total Commission',
            accessor: 'totalCommission',
            sortable: true,
            Cell: (row: TopTheater) => (
                <p className="font-bold text-teal-600">{formatETB(row.totalCommission)}</p>
            )
        },
        {
            Header: 'Total Revenue',
            accessor: 'totalRevenue',
            sortable: true,
            Cell: (row: TopTheater) => (
                <p className="text-sm text-gray-900">{formatETB(row.totalRevenue)}</p>
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
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Commission Analytics</h1>
                <p className="text-sm text-gray-500">Track and analyze theater commissions</p>
            </div>

            {/* Stats Cards - 2 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white rounded-xl p-5 shadow-lg border hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start mb-3">
                        <div className="p-3 bg-emerald-500 rounded-xl text-white"><Wallet className="h-5 w-5" /></div>
                        <span className="text-green-600 text-sm">{filteredCommissions.length} transactions</span>
                    </div>
                    <p className="text-2xl font-bold">{formatETB(totals.totalCommission)}</p>
                    <p className="text-sm text-gray-500">Total Commission</p>
                    <div className="mt-2 text-xs text-gray-400">Across all theaters</div>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-lg border hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start mb-3">
                        <div className="p-3 bg-teal-600 rounded-xl text-white"><Building className="h-5 w-5" /></div>
                    </div>
                    <p className="text-2xl font-bold">{activeCommissionTheaters.length}</p>
                    <p className="text-sm text-gray-500">Active Theaters</p>
                    <div className="mt-2 text-xs text-gray-400">Currently generating commission</div>
                </div>
            </div>

            {/* Search Theater - Above Payment Distribution */}
            <div className="bg-white rounded-xl p-5 shadow-lg border">
                <div className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[250px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search Theater</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Search by theater name or location..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleSearch}
                        className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                    >
                        Search
                    </button>
                    {(searchTerm || filteredSearchTerm) && (
                        <button
                            onClick={handleResetFilters}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Clear
                        </button>
                    )}
                </div>
                {filteredSearchTerm && (
                    <div className="mt-3 text-sm text-teal-600">
                        Showing results for: <span className="font-medium">"{filteredSearchTerm}"</span>
                        {filteredCommissions.length === 0 && (
                            <span className="text-gray-500 ml-2">(No results found)</span>
                        )}
                    </div>
                )}
            </div>

            {/* Payment Distribution Card */}
            <div className="bg-white rounded-xl p-5 shadow-lg border">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-teal-100 rounded-lg">
                        <PieChartIcon className="h-5 w-5 text-teal-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Payment Distribution</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ResponsiveContainer width="100%" height={280}>
                        <RePieChart>
                            <Pie
                                data={paymentDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                            >
                                {paymentDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: any) => formatETB(value)} />
                            <Legend />
                        </RePieChart>
                    </ResponsiveContainer>
                    <div className="space-y-4">
                        {paymentDistribution.map((item, idx) => {
                            const Icon = item.icon;
                            const percentage = totals.totalRevenue > 0 ? (item.value / totals.totalRevenue * 100).toFixed(1) : '0';
                            return (
                                <div key={idx} className="p-3 rounded-xl bg-gray-50">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${item.color}20` }}>
                                                <Icon className="h-4 w-4" style={{ color: item.color }} />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">{item.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-gray-900">{formatETB(item.value)}</span>
                                            <span className="text-xs text-gray-500">({percentage}%)</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="h-2 rounded-full transition-all duration-500"
                                            style={{ 
                                                width: `${percentage}%`,
                                                backgroundColor: item.color 
                                            }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">{item.count} transactions</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Commission Trend - Area Chart (Starting from May) */}
            <div className="bg-white rounded-xl p-5 shadow-lg border">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div>
                        <h3 className="text-lg font-semibold">Commission Trend</h3>
                        <p className="text-sm text-gray-500">Data from May to present</p>
                    </div>
                    <div className="flex gap-2">
                        {['daily', 'monthly', 'yearly'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setDateRangeType(range as DateRangeType)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                                    dateRangeType === range 
                                        ? 'bg-teal-600 text-white' 
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>

                <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={trendData}>
                        <defs>
                            <linearGradient id="commissionGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                        <XAxis dataKey="period" stroke="#6B7280" tick={{ fontSize: 12 }} />
                        <YAxis stroke="#6B7280" tickFormatter={(v) => `ETB ${v/1000}k`} tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(value: any) => formatETB(value)} />
                        <Legend />
                        <Area 
                            type="monotone" 
                            dataKey="commission" 
                            stroke="#14b8a6" 
                            strokeWidth={2} 
                            fill="url(#commissionGradient)" 
                            name="Commission"
                        />
                        <Area 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#3B82F6" 
                            strokeWidth={2} 
                            fill="url(#revenueGradient)" 
                            name="Revenue"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Active Commission Theaters - Area Chart */}
            <div className="bg-white rounded-xl p-5 shadow-lg border">
                <div>
                    <h3 className="text-lg font-semibold mb-1">Active Commission Theaters Trend</h3>
                    <p className="text-sm text-gray-500 mb-4">Monthly commission and revenue from active theaters (May to present)</p>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={activeTheatersTrendData}>
                        <defs>
                            <linearGradient id="activeCommissionGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="activeRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                        <XAxis dataKey="period" stroke="#6B7280" tick={{ fontSize: 12 }} />
                        <YAxis stroke="#6B7280" tickFormatter={(v) => `ETB ${v/1000}k`} tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(value: any) => formatETB(value)} />
                        <Legend />
                        <Area 
                            type="monotone" 
                            dataKey="totalCommission" 
                            stroke="#14b8a6" 
                            strokeWidth={2} 
                            fill="url(#activeCommissionGradient)" 
                            name="Commission"
                        />
                        <Area 
                            type="monotone" 
                            dataKey="totalRevenue" 
                            stroke="#F59E0B" 
                            strokeWidth={2} 
                            fill="url(#activeRevenueGradient)" 
                            name="Revenue"
                        />
                    </AreaChart>
                </ResponsiveContainer>
                <div className="mt-4 text-center text-xs text-gray-400">
                    <p>Data shows commission and revenue trends for active theaters from May to present</p>
                </div>
            </div>

            {/* Top Performing Theaters Table */}
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

export default CommissionAnalytics;