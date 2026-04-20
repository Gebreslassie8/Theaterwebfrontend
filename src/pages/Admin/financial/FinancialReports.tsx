// src/pages/Admin/financial/FinancialReports.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    DollarSign,
    Calendar,
    Download,
    PieChart,
    BarChart3,
    LineChart,
    Ticket,
    Building,
    CreditCard,
    Wallet,
    Banknote,
    ChevronDown,
    ChevronRight,
    Star,
    Percent,
    Receipt,
    CheckCircle,
    Clock,
    Info
} from 'lucide-react';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';
import {
    LineChart as ReLineChart,
    Line,
    BarChart as ReBarChart,
    Bar,
    PieChart as RePieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    AreaChart,
    ComposedChart
} from 'recharts';

// Types
interface RevenueData {
    totalRevenue: number;
    totalCommission: number;
    totalPayouts: number;
    netProfit: number;
    growth: number;
    previousPeriodRevenue: number;
    previousPeriodGrowth: number;
}

interface DailyReport {
    date: string;
    revenue: number;
    bookings: number;
    ticketsSold: number;
    averageTicketPrice: number;
    commission: number;
    refunds: number;
    netRevenue: number;
}

interface MonthlyReport {
    month: string;
    revenue: number;
    bookings: number;
    ticketsSold: number;
    averageTicketPrice: number;
    commission: number;
    refunds: number;
    netRevenue: number;
    growth: number;
}

interface TaxReport {
    period: string;
    grossRevenue: number;
    vatAmount: number;
    withholdingTax: number;
    incomeTax: number;
    netRevenue: number;
    taxRate: number;
    taxDue: number;
    paid: boolean;
    paymentDate?: string;
}

interface TopTheater {
    id: number;
    name: string;
    revenue: number;
    bookings: number;
    growth: number;
}

interface TopMovie {
    id: number;
    title: string;
    revenue: number;
    tickets: number;
    rating: number;
}

// Mock Data
const currentRevenue: RevenueData = {
    totalRevenue: 15850000,
    totalCommission: 2377500,
    totalPayouts: 12680000,
    netProfit: 792500,
    growth: 15.8,
    previousPeriodRevenue: 13680000,
    previousPeriodGrowth: 12.3
};

// Daily Reports Data
const dailyReports: DailyReport[] = [
    { date: '2024-04-09', revenue: 425000, bookings: 1450, ticketsSold: 2850, averageTicketPrice: 149, commission: 63750, refunds: 12500, netRevenue: 361250 },
    { date: '2024-04-08', revenue: 389000, bookings: 1320, ticketsSold: 2580, averageTicketPrice: 151, commission: 58350, refunds: 8900, netRevenue: 330650 },
    { date: '2024-04-07', revenue: 412000, bookings: 1410, ticketsSold: 2760, averageTicketPrice: 149, commission: 61800, refunds: 0, netRevenue: 350200 },
    { date: '2024-04-06', revenue: 478000, bookings: 1630, ticketsSold: 3210, averageTicketPrice: 149, commission: 71700, refunds: 2500, netRevenue: 406300 },
    { date: '2024-04-05', revenue: 445000, bookings: 1520, ticketsSold: 2980, averageTicketPrice: 149, commission: 66750, refunds: 4500, netRevenue: 378250 },
    { date: '2024-04-04', revenue: 398000, bookings: 1360, ticketsSold: 2670, averageTicketPrice: 149, commission: 59700, refunds: 1200, netRevenue: 338300 },
    { date: '2024-04-03', revenue: 367000, bookings: 1250, ticketsSold: 2460, averageTicketPrice: 149, commission: 55050, refunds: 0, netRevenue: 311950 }
];

// Monthly Reports Data
const monthlyReports: MonthlyReport[] = [
    { month: 'Jan 2024', revenue: 1250000, bookings: 4250, ticketsSold: 8450, averageTicketPrice: 148, commission: 187500, refunds: 12500, netRevenue: 1062500, growth: 5.2 },
    { month: 'Feb 2024', revenue: 1380000, bookings: 4680, ticketsSold: 9320, averageTicketPrice: 148, commission: 207000, refunds: 15000, netRevenue: 1173000, growth: 10.4 },
    { month: 'Mar 2024', revenue: 1520000, bookings: 5150, ticketsSold: 10250, averageTicketPrice: 148, commission: 228000, refunds: 18000, netRevenue: 1292000, growth: 10.1 },
    { month: 'Apr 2024', revenue: 1670000, bookings: 5670, ticketsSold: 11280, averageTicketPrice: 148, commission: 250500, refunds: 22000, netRevenue: 1419500, growth: 9.9 },
    { month: 'May 2024', revenue: 1750000, bookings: 5950, ticketsSold: 11820, averageTicketPrice: 148, commission: 262500, refunds: 25000, netRevenue: 1487500, growth: 4.8 },
    { month: 'Jun 2024', revenue: 1890000, bookings: 6420, ticketsSold: 12760, averageTicketPrice: 148, commission: 283500, refunds: 28000, netRevenue: 1606500, growth: 8.0 },
    { month: 'Jul 2024', revenue: 2100000, bookings: 7150, ticketsSold: 14180, averageTicketPrice: 148, commission: 315000, refunds: 32000, netRevenue: 1785000, growth: 11.1 },
    { month: 'Aug 2024', revenue: 2250000, bookings: 7650, ticketsSold: 15190, averageTicketPrice: 148, commission: 337500, refunds: 35000, netRevenue: 1912500, growth: 7.1 },
    { month: 'Sep 2024', revenue: 1980000, bookings: 6730, ticketsSold: 13370, averageTicketPrice: 148, commission: 297000, refunds: 30000, netRevenue: 1683000, growth: -12.0 },
    { month: 'Oct 2024', revenue: 2120000, bookings: 7210, ticketsSold: 14320, averageTicketPrice: 148, commission: 318000, refunds: 33000, netRevenue: 1802000, growth: 7.1 },
    { month: 'Nov 2024', revenue: 2350000, bookings: 7990, ticketsSold: 15870, averageTicketPrice: 148, commission: 352500, refunds: 37000, netRevenue: 1997500, growth: 10.8 },
    { month: 'Dec 2024', revenue: 2580000, bookings: 8770, ticketsSold: 17430, averageTicketPrice: 148, commission: 387000, refunds: 40000, netRevenue: 2193000, growth: 9.8 }
];

// Tax Reports Data
const taxReports: TaxReport[] = [
    { period: 'Q1 2024', grossRevenue: 4150000, vatAmount: 498000, withholdingTax: 83000, incomeTax: 207500, netRevenue: 3320000, taxRate: 15, taxDue: 788500, paid: true, paymentDate: '2024-04-15' },
    { period: 'Q2 2024', grossRevenue: 5310000, vatAmount: 637200, withholdingTax: 106200, incomeTax: 265500, netRevenue: 4248000, taxRate: 15, taxDue: 1008900, paid: true, paymentDate: '2024-07-15' },
    { period: 'Q3 2024', grossRevenue: 6330000, vatAmount: 759600, withholdingTax: 126600, incomeTax: 316500, netRevenue: 5064000, taxRate: 15, taxDue: 1202700, paid: false },
    { period: 'Q4 2024', grossRevenue: 7050000, vatAmount: 846000, withholdingTax: 141000, incomeTax: 352500, netRevenue: 5640000, taxRate: 15, taxDue: 1339500, paid: false }
];

// Chart Colors
const COLORS = ['#14b8a6', '#8b5cf6', '#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#ec4899', '#6366f1'];

// Weekly Revenue Data
const weeklyRevenueData = [
    { name: 'Week 1', revenue: 2850000, bookings: 9680 },
    { name: 'Week 2', revenue: 3120000, bookings: 10600 },
    { name: 'Week 3', revenue: 2980000, bookings: 10120 },
    { name: 'Week 4', revenue: 3350000, bookings: 11380 }
];

// Payment Method Distribution
const paymentDistribution = [
    { name: 'Chapa', value: 35, color: '#14b8a6' },
    { name: 'Telebirr', value: 28, color: '#22c55e' },
    { name: 'CBE Birr', value: 18, color: '#3b82f6' },
    { name: 'HelloCash', value: 12, color: '#f97316' },
    { name: 'Bank Transfer', value: 7, color: '#a855f7' }
];

// Chart Data
const weeklyData = [
    { name: 'Mon', revenue: 125000, bookings: 450 },
    { name: 'Tue', revenue: 148000, bookings: 520 },
    { name: 'Wed', revenue: 167000, bookings: 580 },
    { name: 'Thu', revenue: 189000, bookings: 650 },
    { name: 'Fri', revenue: 245000, bookings: 850 },
    { name: 'Sat', revenue: 389000, bookings: 1350 },
    { name: 'Sun', revenue: 412000, bookings: 1420 }
];

const monthlyData = [
    { name: 'Jan', revenue: 850000, bookings: 3200 },
    { name: 'Feb', revenue: 920000, bookings: 3450 },
    { name: 'Mar', revenue: 980000, bookings: 3680 },
    { name: 'Apr', revenue: 1050000, bookings: 3920 },
    { name: 'May', revenue: 1120000, bookings: 4150 },
    { name: 'Jun', revenue: 1180000, bookings: 4380 },
    { name: 'Jul', revenue: 1250000, bookings: 4620 },
    { name: 'Aug', revenue: 1320000, bookings: 4850 },
    { name: 'Sep', revenue: 1380000, bookings: 5080 },
    { name: 'Oct', revenue: 1450000, bookings: 5320 },
    { name: 'Nov', revenue: 1520000, bookings: 5550 },
    { name: 'Dec', revenue: 1580000, bookings: 5780 }
];

const yearlyData = [
    { name: '2020', revenue: 5200000, bookings: 18500 },
    { name: '2021', revenue: 6800000, bookings: 24200 },
    { name: '2022', revenue: 8900000, bookings: 31800 },
    { name: '2023', revenue: 11200000, bookings: 40200 },
    { name: '2024', revenue: 14500000, bookings: 51800 }
];

const paymentData = [
    { name: 'Chapa', value: 35, color: '#14b8a6' },
    { name: 'Telebirr', value: 28, color: '#22c55e' },
    { name: 'CBE Birr', value: 18, color: '#3b82f6' },
    { name: 'HelloCash', value: 12, color: '#f97316' },
    { name: 'Bank Transfer', value: 7, color: '#a855f7' }
];

// Monthly Revenue Trend
const monthlyRevenueTrend = monthlyReports.map(r => ({
    month: r.month,
    revenue: r.revenue,
    commission: r.commission,
    netRevenue: r.netRevenue
}));

const topTheaters: TopTheater[] = [
    { id: 1, name: 'Grand Cinema', revenue: 245000, bookings: 1850, growth: 12.5 },
    { id: 2, name: 'Sunset Theater', revenue: 189000, bookings: 1420, growth: 8.3 },
    { id: 3, name: 'City Mall Cinema', revenue: 167000, bookings: 1280, growth: 15.2 },
    { id: 4, name: 'Megaplex Theater', revenue: 156000, bookings: 1190, growth: 6.8 },
    { id: 5, name: 'Premier Cinemas', revenue: 134000, bookings: 1020, growth: 10.1 }
];

const topMovies: TopMovie[] = [
    { id: 1, title: 'The Lion King', revenue: 456000, tickets: 3250, rating: 4.8 },
    { id: 2, title: 'Barbie', revenue: 389000, tickets: 2780, rating: 4.7 },
    { id: 3, title: 'Oppenheimer', revenue: 342000, tickets: 2440, rating: 4.9 },
    { id: 4, title: 'Spider-Man', revenue: 298000, tickets: 2130, rating: 4.6 },
    { id: 5, title: 'John Wick 4', revenue: 267000, tickets: 1910, rating: 4.5 }
];

const FinancialReports: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'daily' | 'monthly' | 'tax'>('overview');
    const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
    const [showExportPopup, setShowExportPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });
    const [expandedSections, setExpandedSections] = useState({
        theaters: true,
        movies: true
    });

    const getPeriodData = () => {
        switch (period) {
            case 'week': return weeklyData;
            case 'month': return monthlyData;
            case 'year': return yearlyData;
            default: return monthlyData;
        }
    };

    const currentData = getPeriodData();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'ETB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCompactNumber = (value: number) => {
        if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
        if (value >= 1000) return (value / 1000).toFixed(0) + 'k';
        return value.toString();
    };

    const handleExport = () => {
        setPopupMessage({
            title: 'Export Started',
            message: `Financial report is being exported. You will be notified when ready.`,
            type: 'success'
        });
        setShowExportPopup(true);
    };

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Calculate totals
    const totalDailyRevenue = dailyReports.reduce((sum, r) => sum + r.revenue, 0);
    const totalDailyBookings = dailyReports.reduce((sum, r) => sum + r.bookings, 0);
    const totalDailyTickets = dailyReports.reduce((sum, r) => sum + r.ticketsSold, 0);
    const totalDailyCommission = dailyReports.reduce((sum, r) => sum + r.commission, 0);

    const totalMonthlyRevenue = monthlyReports.reduce((sum, r) => sum + r.revenue, 0);
    const totalMonthlyBookings = monthlyReports.reduce((sum, r) => sum + r.bookings, 0);
    const totalMonthlyTickets = monthlyReports.reduce((sum, r) => sum + r.ticketsSold, 0);

    const totalTaxDue = taxReports.reduce((sum, r) => sum + r.taxDue, 0);
    const totalTaxPaid = taxReports.filter(r => r.paid).reduce((sum, r) => sum + r.taxDue, 0);
    const totalTaxPending = taxReports.filter(r => !r.paid).reduce((sum, r) => sum + r.taxDue, 0);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 mb-1">{label}</p>
                    {payload.map((p: any, index: number) => (
                        <p key={index} className="text-sm" style={{ color: p.color }}>
                            {p.name}: {p.name === 'revenue' || p.name === 'Revenue' ? formatCurrency(p.value) : p.value.toLocaleString()}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    // Daily Reports Columns
    const dailyColumns = [
        { Header: 'Date', accessor: 'date', Cell: (row: DailyReport) => formatDate(row.date) },
        { Header: 'Revenue', accessor: 'revenue', Cell: (row: DailyReport) => formatCurrency(row.revenue) },
        { Header: 'Bookings', accessor: 'bookings', Cell: (row: DailyReport) => formatNumber(row.bookings) },
        { Header: 'Tickets', accessor: 'ticketsSold', Cell: (row: DailyReport) => formatNumber(row.ticketsSold) },
        { Header: 'Avg Ticket', accessor: 'averageTicketPrice', Cell: (row: DailyReport) => formatCurrency(row.averageTicketPrice) },
        { Header: 'Commission', accessor: 'commission', Cell: (row: DailyReport) => formatCurrency(row.commission) },
        { Header: 'Net Revenue', accessor: 'netRevenue', Cell: (row: DailyReport) => formatCurrency(row.netRevenue) }
    ];

    // Monthly Reports Columns
    const monthlyColumns = [
        { Header: 'Month', accessor: 'month' },
        { Header: 'Revenue', accessor: 'revenue', Cell: (row: MonthlyReport) => formatCurrency(row.revenue) },
        { Header: 'Bookings', accessor: 'bookings', Cell: (row: MonthlyReport) => formatNumber(row.bookings) },
        { Header: 'Tickets', accessor: 'ticketsSold', Cell: (row: MonthlyReport) => formatNumber(row.ticketsSold) },
        { Header: 'Commission', accessor: 'commission', Cell: (row: MonthlyReport) => formatCurrency(row.commission) },
        { Header: 'Net Revenue', accessor: 'netRevenue', Cell: (row: MonthlyReport) => formatCurrency(row.netRevenue) },
        { Header: 'Growth', accessor: 'growth', Cell: (row: MonthlyReport) => <span className={row.growth >= 0 ? 'text-green-600' : 'text-red-600'}>{row.growth >= 0 ? '+' : ''}{row.growth}%</span> }
    ];

    // Tax Reports Columns
    const taxColumns = [
        { Header: 'Period', accessor: 'period' },
        { Header: 'Gross Revenue', accessor: 'grossRevenue', Cell: (row: TaxReport) => formatCurrency(row.grossRevenue) },
        { Header: 'VAT (12%)', accessor: 'vatAmount', Cell: (row: TaxReport) => formatCurrency(row.vatAmount) },
        { Header: 'Withholding Tax', accessor: 'withholdingTax', Cell: (row: TaxReport) => formatCurrency(row.withholdingTax) },
        { Header: 'Income Tax', accessor: 'incomeTax', Cell: (row: TaxReport) => formatCurrency(row.incomeTax) },
        { Header: 'Total Tax Due', accessor: 'taxDue', Cell: (row: TaxReport) => formatCurrency(row.taxDue) },
        {
            Header: 'Status', accessor: 'paid', Cell: (row: TaxReport) => row.paid ?
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /> Paid</span> :
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-100 text-red-700"><Clock className="h-3 w-3" /> Pending</span>
        }
    ];

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
                                    <TrendingUp className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
                                    <p className="text-gray-500 text-sm">Comprehensive financial analytics and reports</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <ReusableButton
                                onClick={handleExport}
                                icon="Download"
                                label="Export Report"
                                className="px-4 py-2 text-sm"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Period Selector */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <div className="bg-white rounded-xl p-2 shadow-md border border-gray-100 inline-flex gap-1">
                        <button
                            onClick={() => setPeriod('week')}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${period === 'week' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            Weekly
                        </button>
                        <button
                            onClick={() => setPeriod('month')}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${period === 'month' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setPeriod('year')}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${period === 'year' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            Yearly
                        </button>
                    </div>
                </motion.div>

                {/* Revenue Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                                <DollarSign className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                +{currentRevenue.growth}%
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentRevenue.totalRevenue)}</p>
                        <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                                <Wallet className="h-5 w-5 text-white" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-1">Platform Commission</p>
                        <p className="text-2xl font-bold text-purple-600">{formatCurrency(currentRevenue.totalCommission)}</p>
                        <p className="text-xs text-gray-400 mt-1">{((currentRevenue.totalCommission / currentRevenue.totalRevenue) * 100).toFixed(1)}% of revenue</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                                <Banknote className="h-5 w-5 text-white" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-1">Theater Payouts</p>
                        <p className="text-2xl font-bold text-blue-600">{formatCurrency(currentRevenue.totalPayouts)}</p>
                        <p className="text-xs text-gray-400 mt-1">{((currentRevenue.totalPayouts / currentRevenue.totalRevenue) * 100).toFixed(1)}% of revenue</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                                <TrendingUp className="h-5 w-5 text-white" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-1">Net Profit</p>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(currentRevenue.netProfit)}</p>
                        <p className="text-xs text-gray-400 mt-1">+{currentRevenue.growth}% vs last period</p>
                    </motion.div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="flex flex-wrap gap-1">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-6 py-3 text-sm font-medium transition-all rounded-t-lg flex items-center gap-2 ${activeTab === 'overview' ? 'border-b-2 border-emerald-500 text-emerald-600 bg-emerald-50' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <PieChart className="h-4 w-4" />
                            Revenue Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('daily')}
                            className={`px-6 py-3 text-sm font-medium transition-all rounded-t-lg flex items-center gap-2 ${activeTab === 'daily' ? 'border-b-2 border-emerald-500 text-emerald-600 bg-emerald-50' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Calendar className="h-4 w-4" />
                            Daily Reports
                        </button>
                        <button
                            onClick={() => setActiveTab('monthly')}
                            className={`px-6 py-3 text-sm font-medium transition-all rounded-t-lg flex items-center gap-2 ${activeTab === 'monthly' ? 'border-b-2 border-emerald-500 text-emerald-600 bg-emerald-50' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <BarChart3 className="h-4 w-4" />
                            Monthly Reports
                        </button>
                        <button
                            onClick={() => setActiveTab('tax')}
                            className={`px-6 py-3 text-sm font-medium transition-all rounded-t-lg flex items-center gap-2 ${activeTab === 'tax' ? 'border-b-2 border-emerald-500 text-emerald-600 bg-emerald-50' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Receipt className="h-4 w-4" />
                            Tax Reports
                        </button>
                    </nav>
                </div>

                {/* Revenue Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Revenue Chart */}
                        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <LineChart className="h-5 w-5 text-emerald-600" />
                                    <h2 className="text-lg font-semibold text-gray-900">Monthly Revenue Trend</h2>
                                </div>
                            </div>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={monthlyRevenueTrend}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="month" stroke="#9ca3af" />
                                        <YAxis yAxisId="left" tickFormatter={(v) => formatCurrency(v)} stroke="#9ca3af" />
                                        <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => formatCurrency(v)} stroke="#9ca3af" />
                                        <Tooltip formatter={(value: any) => formatCurrency(value)} />
                                        <Legend />
                                        <Bar yAxisId="left" dataKey="revenue" name="Total Revenue" fill="#14b8a6" radius={[8, 8, 0, 0]} />
                                        <Bar yAxisId="left" dataKey="commission" name="Commission" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                                        <Line yAxisId="right" type="monotone" dataKey="netRevenue" name="Net Revenue" stroke="#f59e0b" strokeWidth={2} />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Weekly Revenue */}
                            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                                <div className="flex items-center gap-2 mb-6">
                                    <BarChart3 className="h-5 w-5 text-emerald-600" />
                                    <h2 className="text-lg font-semibold text-gray-900">Weekly Revenue</h2>
                                </div>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ReBarChart data={weeklyRevenueData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis dataKey="name" stroke="#9ca3af" />
                                            <YAxis tickFormatter={(v) => formatCurrency(v)} stroke="#9ca3af" />
                                            <Tooltip formatter={(value: any) => formatCurrency(value)} />
                                            <Bar dataKey="revenue" name="Revenue" fill="#14b8a6" radius={[8, 8, 0, 0]} />
                                        </ReBarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Payment Methods Distribution */}
                            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                                <div className="flex items-center gap-2 mb-6">
                                    <PieChart className="h-5 w-5 text-emerald-600" />
                                    <h2 className="text-lg font-semibold text-gray-900">Payment Methods</h2>
                                </div>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RePieChart>
                                            <Pie
                                                data={paymentDistribution}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                labelLine={false}
                                            >
                                                {paymentDistribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => `${value}%`} />
                                            <Legend />
                                        </RePieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Daily Reports Tab */}
                {activeTab === 'daily' && (
                    <div className="space-y-6">
                        {/* Daily Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
                                <p className="text-sm text-gray-500 mb-1">Total Revenue (7 days)</p>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalDailyRevenue)}</p>
                                <p className="text-xs text-gray-400 mt-1">Last 7 days</p>
                            </div>
                            <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
                                <p className="text-sm text-gray-500 mb-1">Total Bookings</p>
                                <p className="text-2xl font-bold text-gray-900">{formatNumber(totalDailyBookings)}</p>
                                <p className="text-xs text-gray-400 mt-1">Last 7 days</p>
                            </div>
                            <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
                                <p className="text-sm text-gray-500 mb-1">Tickets Sold</p>
                                <p className="text-2xl font-bold text-gray-900">{formatNumber(totalDailyTickets)}</p>
                                <p className="text-xs text-gray-400 mt-1">Last 7 days</p>
                            </div>
                            <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
                                <p className="text-sm text-gray-500 mb-1">Commission Earned</p>
                                <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalDailyCommission)}</p>
                                <p className="text-xs text-gray-400 mt-1">Last 7 days</p>
                            </div>
                        </div>

                        {/* Daily Reports Table */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-emerald-600" />
                                    <h2 className="text-lg font-semibold text-gray-900">Daily Reports</h2>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {dailyColumns.map(col => (
                                                <th key={col.Header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{col.Header}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {dailyReports.map((report, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 text-sm text-gray-900">{formatDate(report.date)}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(report.revenue)}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{formatNumber(report.bookings)}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{formatNumber(report.ticketsSold)}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{formatCurrency(report.averageTicketPrice)}</td>
                                                <td className="px-6 py-4 text-sm text-purple-600 font-medium">{formatCurrency(report.commission)}</td>
                                                <td className="px-6 py-4 text-sm text-green-600 font-medium">{formatCurrency(report.netRevenue)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Monthly Reports Tab */}
                {activeTab === 'monthly' && (
                    <div className="space-y-6">
                        {/* Monthly Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
                                <p className="text-sm text-gray-500 mb-1">Year-to-Date Revenue</p>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalMonthlyRevenue)}</p>
                                <p className="text-xs text-green-600 mt-1">+15.8% vs last year</p>
                            </div>
                            <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
                                <p className="text-sm text-gray-500 mb-1">Total Bookings</p>
                                <p className="text-2xl font-bold text-gray-900">{formatNumber(totalMonthlyBookings)}</p>
                                <p className="text-xs text-green-600 mt-1">+12.3% vs last year</p>
                            </div>
                            <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
                                <p className="text-sm text-gray-500 mb-1">Tickets Sold</p>
                                <p className="text-2xl font-bold text-gray-900">{formatNumber(totalMonthlyTickets)}</p>
                                <p className="text-xs text-green-600 mt-1">+14.2% vs last year</p>
                            </div>
                            <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
                                <p className="text-sm text-gray-500 mb-1">Average Monthly Revenue</p>
                                <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalMonthlyRevenue / 12)}</p>
                                <p className="text-xs text-gray-400 mt-1">Per month</p>
                            </div>
                        </div>

                        {/* Monthly Reports Table */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                                <div className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-emerald-600" />
                                    <h2 className="text-lg font-semibold text-gray-900">Monthly Reports</h2>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {monthlyColumns.map(col => (
                                                <th key={col.Header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{col.Header}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {monthlyReports.map((report, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{report.month}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(report.revenue)}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{formatNumber(report.bookings)}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{formatNumber(report.ticketsSold)}</td>
                                                <td className="px-6 py-4 text-sm text-purple-600 font-medium">{formatCurrency(report.commission)}</td>
                                                <td className="px-6 py-4 text-sm text-green-600 font-medium">{formatCurrency(report.netRevenue)}</td>
                                                <td className="px-6 py-4 text-sm"><span className={report.growth >= 0 ? 'text-green-600' : 'text-red-600'}>{report.growth >= 0 ? '+' : ''}{report.growth}%</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tax Reports Tab */}
                {activeTab === 'tax' && (
                    <div className="space-y-6">
                        {/* Tax Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
                                <p className="text-sm text-gray-500 mb-1">Total Tax Due</p>
                                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalTaxDue)}</p>
                                <p className="text-xs text-gray-400 mt-1">Year-to-date</p>
                            </div>
                            <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
                                <p className="text-sm text-gray-500 mb-1">Tax Paid</p>
                                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalTaxPaid)}</p>
                                <p className="text-xs text-gray-400 mt-1">{((totalTaxPaid / totalTaxDue) * 100).toFixed(1)}% of total</p>
                            </div>
                            <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
                                <p className="text-sm text-gray-500 mb-1">Tax Pending</p>
                                <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalTaxPending)}</p>
                                <p className="text-xs text-gray-400 mt-1">Awaiting payment</p>
                            </div>
                            <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
                                <p className="text-sm text-gray-500 mb-1">Effective Tax Rate</p>
                                <p className="text-2xl font-bold text-purple-600">15%</p>
                                <p className="text-xs text-gray-400 mt-1">Standard rate</p>
                            </div>
                        </div>

                        {/* Tax Reports Table */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                                <div className="flex items-center gap-2">
                                    <Receipt className="h-5 w-5 text-emerald-600" />
                                    <h2 className="text-lg font-semibold text-gray-900">Tax Reports by Quarter</h2>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {taxColumns.map(col => (
                                                <th key={col.Header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{col.Header}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {taxReports.map((report, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{report.period}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(report.grossRevenue)}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{formatCurrency(report.vatAmount)}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{formatCurrency(report.withholdingTax)}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{formatCurrency(report.incomeTax)}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-red-600">{formatCurrency(report.taxDue)}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    {report.paid ?
                                                        <div className="flex flex-col">
                                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /> Paid</span>
                                                            <span className="text-xs text-gray-400 mt-1">on {formatDate(report.paymentDate!)}</span>
                                                        </div> :
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-100 text-red-700"><Clock className="h-3 w-3" /> Pending</span>
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Tax Calculation Note */}
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                            <div className="flex items-start gap-3">
                                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-blue-800">Tax Calculation Notes</p>
                                    <p className="text-xs text-blue-700 mt-1">
                                        • VAT is calculated at 12% on all ticket sales<br />
                                        • Withholding tax is 2% on theater payouts<br />
                                        • Income tax is 5% on platform commission<br />
                                        • Tax payments are due quarterly within 15 days after quarter end
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Top Theaters Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-xl shadow-md border border-gray-100 mb-8 overflow-hidden"
                >
                    <div
                        className="px-6 py-4 border-b border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition"
                        onClick={() => toggleSection('theaters')}
                    >
                        <div className="flex items-center gap-2">
                            <Building className="h-5 w-5 text-teal-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Top Performing Theaters</h2>
                        </div>
                        {expandedSections.theaters ? <ChevronDown className="h-5 w-5 text-gray-400" /> : <ChevronRight className="h-5 w-5 text-gray-400" />}
                    </div>
                    {expandedSections.theaters && (
                        <div className="p-6">
                            <div className="space-y-4">
                                {topTheaters.map((theater, index) => (
                                    <div key={theater.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center text-white font-bold">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{theater.name}</p>
                                                <p className="text-xs text-gray-500">{theater.bookings.toLocaleString()} bookings</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">{formatCurrency(theater.revenue)}</p>
                                            <p className="text-xs text-green-600">+{theater.growth}% growth</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Top Movies Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                    className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
                >
                    <div
                        className="px-6 py-4 border-b border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition"
                        onClick={() => toggleSection('movies')}
                    >
                        <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-500" />
                            <h2 className="text-lg font-semibold text-gray-900">Top Grossing Movies</h2>
                        </div>
                        {expandedSections.movies ? <ChevronDown className="h-5 w-5 text-gray-400" /> : <ChevronRight className="h-5 w-5 text-gray-400" />}
                    </div>
                    {expandedSections.movies && (
                        <div className="p-6">
                            <div className="space-y-4">
                                {topMovies.map((movie, index) => (
                                    <div key={movie.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 flex items-center justify-center text-white font-bold">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{movie.title}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <p className="text-xs text-gray-500">{movie.tickets.toLocaleString()} tickets</p>
                                                    <div className="flex items-center gap-0.5">
                                                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                                        <span className="text-xs text-gray-600">{movie.rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">{formatCurrency(movie.revenue)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Success Popup */}
                <SuccessPopup
                    isOpen={showExportPopup}
                    onClose={() => setShowExportPopup(false)}
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

export default FinancialReports;