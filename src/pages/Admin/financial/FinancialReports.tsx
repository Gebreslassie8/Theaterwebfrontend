// src/pages/Admin/financial/FinancialReports.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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
    Info,
    Search,
    ArrowRight,
    Users,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    RefreshCw,
    LayoutGrid
} from 'lucide-react';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';
import {
    BarChart,
    Bar,
    LineChart as ReLineChart,
    Line,
    PieChart as RePieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
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
    id: string;
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
    id: string;
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
    id: string;
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

const dailyReports: DailyReport[] = [
    { id: '1', date: '2024-04-09', revenue: 425000, bookings: 1450, ticketsSold: 2850, averageTicketPrice: 149, commission: 63750, refunds: 12500, netRevenue: 361250 },
    { id: '2', date: '2024-04-08', revenue: 389000, bookings: 1320, ticketsSold: 2580, averageTicketPrice: 151, commission: 58350, refunds: 8900, netRevenue: 330650 },
    { id: '3', date: '2024-04-07', revenue: 412000, bookings: 1410, ticketsSold: 2760, averageTicketPrice: 149, commission: 61800, refunds: 0, netRevenue: 350200 },
    { id: '4', date: '2024-04-06', revenue: 478000, bookings: 1630, ticketsSold: 3210, averageTicketPrice: 149, commission: 71700, refunds: 2500, netRevenue: 406300 },
    { id: '5', date: '2024-04-05', revenue: 445000, bookings: 1520, ticketsSold: 2980, averageTicketPrice: 149, commission: 66750, refunds: 4500, netRevenue: 378250 },
    { id: '6', date: '2024-04-04', revenue: 398000, bookings: 1360, ticketsSold: 2670, averageTicketPrice: 149, commission: 59700, refunds: 1200, netRevenue: 338300 },
    { id: '7', date: '2024-04-03', revenue: 367000, bookings: 1250, ticketsSold: 2460, averageTicketPrice: 149, commission: 55050, refunds: 0, netRevenue: 311950 }
];

const monthlyReports: MonthlyReport[] = [
    { id: '1', month: 'Jan 2024', revenue: 1250000, bookings: 4250, ticketsSold: 8450, averageTicketPrice: 148, commission: 187500, refunds: 12500, netRevenue: 1062500, growth: 5.2 },
    { id: '2', month: 'Feb 2024', revenue: 1380000, bookings: 4680, ticketsSold: 9320, averageTicketPrice: 148, commission: 207000, refunds: 15000, netRevenue: 1173000, growth: 10.4 },
    { id: '3', month: 'Mar 2024', revenue: 1520000, bookings: 5150, ticketsSold: 10250, averageTicketPrice: 148, commission: 228000, refunds: 18000, netRevenue: 1292000, growth: 10.1 },
    { id: '4', month: 'Apr 2024', revenue: 1670000, bookings: 5670, ticketsSold: 11280, averageTicketPrice: 148, commission: 250500, refunds: 22000, netRevenue: 1419500, growth: 9.9 },
    { id: '5', month: 'May 2024', revenue: 1750000, bookings: 5950, ticketsSold: 11820, averageTicketPrice: 148, commission: 262500, refunds: 25000, netRevenue: 1487500, growth: 4.8 },
    { id: '6', month: 'Jun 2024', revenue: 1890000, bookings: 6420, ticketsSold: 12760, averageTicketPrice: 148, commission: 283500, refunds: 28000, netRevenue: 1606500, growth: 8.0 },
    { id: '7', month: 'Jul 2024', revenue: 2100000, bookings: 7150, ticketsSold: 14180, averageTicketPrice: 148, commission: 315000, refunds: 32000, netRevenue: 1785000, growth: 11.1 },
    { id: '8', month: 'Aug 2024', revenue: 2250000, bookings: 7650, ticketsSold: 15190, averageTicketPrice: 148, commission: 337500, refunds: 35000, netRevenue: 1912500, growth: 7.1 },
    { id: '9', month: 'Sep 2024', revenue: 1980000, bookings: 6730, ticketsSold: 13370, averageTicketPrice: 148, commission: 297000, refunds: 30000, netRevenue: 1683000, growth: -12.0 },
    { id: '10', month: 'Oct 2024', revenue: 2120000, bookings: 7210, ticketsSold: 14320, averageTicketPrice: 148, commission: 318000, refunds: 33000, netRevenue: 1802000, growth: 7.1 },
    { id: '11', month: 'Nov 2024', revenue: 2350000, bookings: 7990, ticketsSold: 15870, averageTicketPrice: 148, commission: 352500, refunds: 37000, netRevenue: 1997500, growth: 10.8 },
    { id: '12', month: 'Dec 2024', revenue: 2580000, bookings: 8770, ticketsSold: 17430, averageTicketPrice: 148, commission: 387000, refunds: 40000, netRevenue: 2193000, growth: 9.8 }
];

const taxReports: TaxReport[] = [
    { id: '1', period: 'Q1 2024', grossRevenue: 4150000, vatAmount: 498000, withholdingTax: 83000, incomeTax: 207500, netRevenue: 3320000, taxRate: 15, taxDue: 788500, paid: true, paymentDate: '2024-04-15' },
    { id: '2', period: 'Q2 2024', grossRevenue: 5310000, vatAmount: 637200, withholdingTax: 106200, incomeTax: 265500, netRevenue: 4248000, taxRate: 15, taxDue: 1008900, paid: true, paymentDate: '2024-07-15' },
    { id: '3', period: 'Q3 2024', grossRevenue: 6330000, vatAmount: 759600, withholdingTax: 126600, incomeTax: 316500, netRevenue: 5064000, taxRate: 15, taxDue: 1202700, paid: false },
    { id: '4', period: 'Q4 2024', grossRevenue: 7050000, vatAmount: 846000, withholdingTax: 141000, incomeTax: 352500, netRevenue: 5640000, taxRate: 15, taxDue: 1339500, paid: false }
];

const weeklyRevenueData = [
    { name: 'Week 1', revenue: 2850000, bookings: 9680 },
    { name: 'Week 2', revenue: 3120000, bookings: 10600 },
    { name: 'Week 3', revenue: 2980000, bookings: 10120 },
    { name: 'Week 4', revenue: 3350000, bookings: 11380 }
];

const paymentDistribution = [
    { name: 'Chapa', value: 35, color: '#14b8a6' },
    { name: 'Telebirr', value: 28, color: '#22c55e' },
    { name: 'CBE Birr', value: 18, color: '#3b82f6' },
    { name: 'HelloCash', value: 12, color: '#f97316' },
    { name: 'Bank Transfer', value: 7, color: '#a855f7' }
];

const monthlyRevenueTrend = monthlyReports.map(r => ({
    month: r.month.split(' ')[0],
    revenue: r.revenue,
    commission: r.commission,
    netRevenue: r.netRevenue
}));

// Stat Card Component
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    delay: number;
    link?: string;
    change?: string;
    trend?: 'up' | 'down';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, delay, link, change, trend }) => {
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
                    <p className="text-xs text-gray-500">{title}</p>
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
                <Link to={link} className="block">
                    <CardContent />
                </Link>
            ) : (
                <CardContent />
            )}
        </motion.div>
    );
};

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring" as const,
            stiffness: 100,
            damping: 12
        }
    }
};

const FinancialReports: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'daily' | 'monthly' | 'tax'>('overview');
    const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
    const [searchTerm, setSearchTerm] = useState('');
    const [showExportPopup, setShowExportPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });

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

    const handleExport = () => {
        setPopupMessage({
            title: 'Export Started',
            message: `Financial report is being exported. You will be notified when ready.`,
            type: 'success'
        });
        setShowExportPopup(true);
    };

    // Filter functions
    const getFilteredDailyReports = () => {
        if (!searchTerm) return dailyReports;
        return dailyReports.filter(report =>
            report.date.includes(searchTerm) ||
            formatCurrency(report.revenue).includes(searchTerm) ||
            report.bookings.toString().includes(searchTerm)
        );
    };

    const getFilteredMonthlyReports = () => {
        if (!searchTerm) return monthlyReports;
        return monthlyReports.filter(report =>
            report.month.toLowerCase().includes(searchTerm.toLowerCase()) ||
            formatCurrency(report.revenue).includes(searchTerm)
        );
    };

    const getFilteredTaxReports = () => {
        if (!searchTerm) return taxReports;
        return taxReports.filter(report =>
            report.period.toLowerCase().includes(searchTerm.toLowerCase()) ||
            formatCurrency(report.grossRevenue).includes(searchTerm)
        );
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

    // Dashboard Cards
    const dashboardCards = [
        { title: 'Total Revenue', value: formatCurrency(currentRevenue.totalRevenue), icon: DollarSign, color: 'from-emerald-500 to-teal-600', delay: 0.1, change: `+${currentRevenue.growth}%`, trend: 'up' as const },
        { title: 'Platform Commission', value: formatCurrency(currentRevenue.totalCommission), icon: Percent, color: 'from-purple-500 to-pink-500', delay: 0.15, change: `${((currentRevenue.totalCommission / currentRevenue.totalRevenue) * 100).toFixed(1)}% of revenue`, trend: 'up' as const },
        { title: 'Theater Payouts', value: formatCurrency(currentRevenue.totalPayouts), icon: Banknote, color: 'from-blue-500 to-cyan-500', delay: 0.2, change: `${((currentRevenue.totalPayouts / currentRevenue.totalRevenue) * 100).toFixed(1)}% of revenue`, trend: 'down' as const },
        { title: 'Net Profit', value: formatCurrency(currentRevenue.netProfit), icon: TrendingUp, color: 'from-green-500 to-emerald-500', delay: 0.25, change: `+${currentRevenue.growth}%`, trend: 'up' as const }
    ];

    // Daily Stats Cards
    const dailyStatsCards = [
        { title: 'Total Revenue (7 days)', value: formatCurrency(totalDailyRevenue), icon: DollarSign, color: 'from-emerald-500 to-teal-600', delay: 0.1 },
        { title: 'Total Bookings', value: formatNumber(totalDailyBookings), icon: Ticket, color: 'from-blue-500 to-cyan-500', delay: 0.15 },
        { title: 'Tickets Sold', value: formatNumber(totalDailyTickets), icon: Users, color: 'from-purple-500 to-pink-500', delay: 0.2 },
        { title: 'Commission Earned', value: formatCurrency(totalDailyCommission), icon: Percent, color: 'from-orange-500 to-red-500', delay: 0.25 }
    ];

    // Monthly Stats Cards
    const monthlyStatsCards = [
        { title: 'Year-to-Date Revenue', value: formatCurrency(totalMonthlyRevenue), icon: DollarSign, color: 'from-emerald-500 to-teal-600', delay: 0.1, change: '+15.8% vs last year', trend: 'up' as const },
        { title: 'Total Bookings', value: formatNumber(totalMonthlyBookings), icon: Ticket, color: 'from-blue-500 to-cyan-500', delay: 0.15, change: '+12.3% vs last year', trend: 'up' as const },
        { title: 'Tickets Sold', value: formatNumber(totalMonthlyTickets), icon: Users, color: 'from-purple-500 to-pink-500', delay: 0.2, change: '+14.2% vs last year', trend: 'up' as const },
        { title: 'Avg Monthly Revenue', value: formatCurrency(totalMonthlyRevenue / 12), icon: TrendingUp, color: 'from-green-500 to-emerald-500', delay: 0.25 }
    ];

    // Tax Stats Cards
    const taxStatsCards = [
        { title: 'Total Tax Due', value: formatCurrency(totalTaxDue), icon: Receipt, color: 'from-red-500 to-pink-500', delay: 0.1 },
        { title: 'Tax Paid', value: formatCurrency(totalTaxPaid), icon: CheckCircle, color: 'from-green-500 to-emerald-500', delay: 0.15, change: `${((totalTaxPaid / totalTaxDue) * 100).toFixed(1)}% paid`, trend: 'up' as const },
        { title: 'Tax Pending', value: formatCurrency(totalTaxPending), icon: Clock, color: 'from-yellow-500 to-orange-500', delay: 0.2 },
        { title: 'Effective Tax Rate', value: '15%', icon: Percent, color: 'from-purple-500 to-pink-500', delay: 0.25 }
    ];

    // Daily Reports Columns
    const dailyColumns = [
        { Header: 'Date', accessor: 'date', Cell: (row: DailyReport) => formatDate(row.date) },
        { Header: 'Revenue', accessor: 'revenue', Cell: (row: DailyReport) => <span className="font-semibold text-emerald-600">{formatCurrency(row.revenue)}</span> },
        { Header: 'Bookings', accessor: 'bookings', Cell: (row: DailyReport) => formatNumber(row.bookings) },
        { Header: 'Tickets', accessor: 'ticketsSold', Cell: (row: DailyReport) => formatNumber(row.ticketsSold) },
        { Header: 'Avg Ticket', accessor: 'averageTicketPrice', Cell: (row: DailyReport) => formatCurrency(row.averageTicketPrice) },
        { Header: 'Commission', accessor: 'commission', Cell: (row: DailyReport) => <span className="text-purple-600 font-medium">{formatCurrency(row.commission)}</span> },
        { Header: 'Net Revenue', accessor: 'netRevenue', Cell: (row: DailyReport) => <span className="text-green-600 font-medium">{formatCurrency(row.netRevenue)}</span> }
    ];

    // Monthly Reports Columns
    const monthlyColumns = [
        { Header: 'Month', accessor: 'month' },
        { Header: 'Revenue', accessor: 'revenue', Cell: (row: MonthlyReport) => <span className="font-semibold text-emerald-600">{formatCurrency(row.revenue)}</span> },
        { Header: 'Bookings', accessor: 'bookings', Cell: (row: MonthlyReport) => formatNumber(row.bookings) },
        { Header: 'Tickets', accessor: 'ticketsSold', Cell: (row: MonthlyReport) => formatNumber(row.ticketsSold) },
        { Header: 'Commission', accessor: 'commission', Cell: (row: MonthlyReport) => <span className="text-purple-600 font-medium">{formatCurrency(row.commission)}</span> },
        { Header: 'Net Revenue', accessor: 'netRevenue', Cell: (row: MonthlyReport) => <span className="text-green-600 font-medium">{formatCurrency(row.netRevenue)}</span> },
        { Header: 'Growth', accessor: 'growth', Cell: (row: MonthlyReport) => <span className={`font-semibold ${row.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>{row.growth >= 0 ? '+' : ''}{row.growth}%</span> }
    ];

    // Tax Reports Columns
    const taxColumns = [
        { Header: 'Period', accessor: 'period' },
        { Header: 'Gross Revenue', accessor: 'grossRevenue', Cell: (row: TaxReport) => formatCurrency(row.grossRevenue) },
        { Header: 'VAT (12%)', accessor: 'vatAmount', Cell: (row: TaxReport) => formatCurrency(row.vatAmount) },
        { Header: 'Withholding Tax', accessor: 'withholdingTax', Cell: (row: TaxReport) => formatCurrency(row.withholdingTax) },
        { Header: 'Income Tax', accessor: 'incomeTax', Cell: (row: TaxReport) => formatCurrency(row.incomeTax) },
        { Header: 'Total Tax Due', accessor: 'taxDue', Cell: (row: TaxReport) => <span className="font-semibold text-red-600">{formatCurrency(row.taxDue)}</span> },
        {
            Header: 'Status', accessor: 'paid', Cell: (row: TaxReport) => row.paid ?
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /> Paid</span> :
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3" /> Pending</span>
        }
    ];

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8 p-6 bg-gray-50 min-h-screen"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg">
                            <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
                            <p className="text-sm text-gray-500">Comprehensive financial analytics and reports</p>
                        </div>
                    </div>
                </div>

                {/* Period Selector */}
                <motion.div variants={itemVariants} className="flex justify-between items-center flex-wrap gap-3 mb-8">
                    <div className="flex gap-2">
                        {(['week', 'month', 'year'] as const).map((range) => (
                            <button
                                key={range}
                                onClick={() => setPeriod(range)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 capitalize ${period === range
                                        ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <ReusableButton onClick={handleExport} icon={Download} label="Export" variant="secondary" size="sm" />
                    </div>
                </motion.div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="flex gap-1">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-6 py-3 text-sm font-medium transition-all rounded-t-lg flex items-center gap-2 ${activeTab === 'overview' ? 'border-b-2 border-emerald-500 text-emerald-600 bg-emerald-50' : 'text-gray-500'}`}
                        >
                            <PieChart className="h-4 w-4" /> Revenue Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('daily')}
                            className={`px-6 py-3 text-sm font-medium transition-all rounded-t-lg flex items-center gap-2 ${activeTab === 'daily' ? 'border-b-2 border-emerald-500 text-emerald-600 bg-emerald-50' : 'text-gray-500'}`}
                        >
                            <Calendar className="h-4 w-4" /> Daily Reports
                        </button>
                        <button
                            onClick={() => setActiveTab('monthly')}
                            className={`px-6 py-3 text-sm font-medium transition-all rounded-t-lg flex items-center gap-2 ${activeTab === 'monthly' ? 'border-b-2 border-emerald-500 text-emerald-600 bg-emerald-50' : 'text-gray-500'}`}
                        >
                            <BarChart3 className="h-4 w-4" /> Monthly Reports
                        </button>
                        <button
                            onClick={() => setActiveTab('tax')}
                            className={`px-6 py-3 text-sm font-medium transition-all rounded-t-lg flex items-center gap-2 ${activeTab === 'tax' ? 'border-b-2 border-emerald-500 text-emerald-600 bg-emerald-50' : 'text-gray-500'}`}
                        >
                            <Receipt className="h-4 w-4" /> Tax Reports
                        </button>
                    </nav>
                </div>

                {/* Revenue Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Stats Cards */}
                        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            {dashboardCards.map((card, idx) => (
                                <StatCard
                                    key={idx}
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

                        {/* Revenue Chart */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Monthly Revenue Trend</h2>
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
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Weekly Revenue</h2>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={weeklyRevenueData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis dataKey="name" stroke="#9ca3af" />
                                            <YAxis tickFormatter={(v) => formatCurrency(v)} stroke="#9ca3af" />
                                            <Tooltip formatter={(value: any) => formatCurrency(value)} />
                                            <Bar dataKey="revenue" name="Revenue" fill="#14b8a6" radius={[8, 8, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Payment Methods */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Payment Methods</h2>
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
                                            <Tooltip />
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
                        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            {dailyStatsCards.map((card, idx) => (
                                <StatCard
                                    key={idx}
                                    title={card.title}
                                    value={card.value}
                                    icon={card.icon}
                                    color={card.color}
                                    delay={card.delay}
                                />
                            ))}
                        </motion.div>

                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                            <div className="relative max-w-sm">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search daily reports..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                        </div>

                        <ReusableTable
                            columns={dailyColumns}
                            data={getFilteredDailyReports()}
                            title="Daily Reports"
                            icon={Calendar}
                            showSearch={false}
                            showExport={true}
                            showPrint={true}
                            itemsPerPage={10}
                        />
                    </div>
                )}

                {/* Monthly Reports Tab */}
                {activeTab === 'monthly' && (
                    <div className="space-y-6">
                        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            {monthlyStatsCards.map((card, idx) => (
                                <StatCard
                                    key={idx}
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

                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                            <div className="relative max-w-sm">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search monthly reports..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                        </div>

                        <ReusableTable
                            columns={monthlyColumns}
                            data={getFilteredMonthlyReports()}
                            title="Monthly Reports"
                            icon={BarChart3}
                            showSearch={false}
                            showExport={true}
                            showPrint={true}
                            itemsPerPage={12}
                        />
                    </div>
                )}

                {/* Tax Reports Tab */}
                {activeTab === 'tax' && (
                    <div className="space-y-6">
                        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            {taxStatsCards.map((card, idx) => (
                                <StatCard
                                    key={idx}
                                    title={card.title}
                                    value={card.value}
                                    icon={card.icon}
                                    color={card.color}
                                    delay={card.delay}
                                />
                            ))}
                        </motion.div>

                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                            <div className="relative max-w-sm">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search tax reports..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                        </div>

                        <ReusableTable
                            columns={taxColumns}
                            data={getFilteredTaxReports()}
                            title="Tax Reports"
                            icon={Receipt}
                            showSearch={false}
                            showExport={true}
                            showPrint={true}
                            itemsPerPage={10}
                        />

                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                            <div className="flex items-start gap-3">
                                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
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
        </motion.div>
    );
};

export default FinancialReports;