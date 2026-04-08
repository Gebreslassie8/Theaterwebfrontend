// src/pages/Admin/financial/FinancialReports.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    DollarSign,
    Download,
    ChevronDown,
    ChevronRight,
    Building,
    CreditCard,
    Wallet,
    Banknote,
    Star,
    Ticket,
    LineChart as LineChartIcon,
    BarChart3,
    PieChart
} from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
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
    AreaChart
} from 'recharts';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';

// Types
interface RevenueData {
    totalRevenue: number;
    totalCommission: number;
    totalPayouts: number;
    netProfit: number;
    growth: number;
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
    totalRevenue: 1250000,
    totalCommission: 62500,
    totalPayouts: 1125000,
    netProfit: 62500,
    growth: 15.8
};

const weeklyData = [
    { name: 'Mon', revenue: 125000, bookings: 450, users: 120 },
    { name: 'Tue', revenue: 148000, bookings: 520, users: 135 },
    { name: 'Wed', revenue: 167000, bookings: 580, users: 148 },
    { name: 'Thu', revenue: 189000, bookings: 650, users: 162 },
    { name: 'Fri', revenue: 245000, bookings: 850, users: 189 },
    { name: 'Sat', revenue: 389000, bookings: 1350, users: 245 },
    { name: 'Sun', revenue: 412000, bookings: 1420, users: 267 }
];

const monthlyData = [
    { name: 'Jan', revenue: 850000, bookings: 3200, users: 850 },
    { name: 'Feb', revenue: 920000, bookings: 3450, users: 920 },
    { name: 'Mar', revenue: 980000, bookings: 3680, users: 980 },
    { name: 'Apr', revenue: 1050000, bookings: 3920, users: 1050 },
    { name: 'May', revenue: 1120000, bookings: 4150, users: 1120 },
    { name: 'Jun', revenue: 1180000, bookings: 4380, users: 1180 },
    { name: 'Jul', revenue: 1250000, bookings: 4620, users: 1250 },
    { name: 'Aug', revenue: 1320000, bookings: 4850, users: 1320 },
    { name: 'Sep', revenue: 1380000, bookings: 5080, users: 1380 },
    { name: 'Oct', revenue: 1450000, bookings: 5320, users: 1450 },
    { name: 'Nov', revenue: 1520000, bookings: 5550, users: 1520 },
    { name: 'Dec', revenue: 1580000, bookings: 5780, users: 1580 }
];

const yearlyData = [
    { name: '2020', revenue: 5200000, bookings: 18500, users: 5200 },
    { name: '2021', revenue: 6800000, bookings: 24200, users: 6800 },
    { name: '2022', revenue: 8900000, bookings: 31800, users: 8900 },
    { name: '2023', revenue: 11200000, bookings: 40200, users: 11200 },
    { name: '2024', revenue: 14500000, bookings: 51800, users: 14500 }
];

const paymentData = [
    { name: 'Chapa', value: 35, color: '#14b8a6' },
    { name: 'Telebirr', value: 28, color: '#22c55e' },
    { name: 'CBE Birr', value: 18, color: '#3b82f6' },
    { name: 'HelloCash', value: 12, color: '#f97316' },
    { name: 'Bank Transfer', value: 7, color: '#a855f7' }
];

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

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 mb-1">{label}</p>
                    {payload.map((p: any, index: number) => (
                        <p key={index} className="text-sm" style={{ color: p.color }}>
                            {p.name}: {p.name === 'revenue' ? formatCurrency(p.value) : p.value.toLocaleString()}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
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

                {/* Revenue Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="bg-white rounded-xl p-6 shadow-md border border-gray-100 mb-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <LineChartIcon className="h-5 w-5 text-emerald-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Revenue Trend</h2>
                        </div>
                        <div className="text-sm text-gray-500">{period === 'week' ? 'Daily' : period === 'month' ? 'Monthly' : 'Yearly'} Revenue</div>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={currentData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="name" stroke="#9ca3af" />
                                <YAxis tickFormatter={formatCompactNumber} stroke="#9ca3af" />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    name="Revenue"
                                    stroke="#14b8a6"
                                    strokeWidth={2}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Bookings Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <Ticket className="h-5 w-5 text-purple-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Booking Trends</h2>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={currentData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="name" stroke="#9ca3af" />
                                    <YAxis tickFormatter={formatCompactNumber} stroke="#9ca3af" />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Bar dataKey="bookings" name="Bookings" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Payment Methods Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                        className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <CreditCard className="h-5 w-5 text-teal-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Payment Methods</h2>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <RePieChart>
                                    <Pie
                                        data={paymentData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        labelLine={false}
                                    >
                                        {paymentData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </RePieChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>

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