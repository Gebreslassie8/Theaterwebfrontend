// src/pages/Owner/OwnerDashboard.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Building,
    Ticket,
    Activity,
    TrendingUp,
    Users,
    Star,
    Eye,
    Edit,
    CheckCircle,
    RotateCcw,
    Film
} from 'lucide-react';

// Direct imports from Overview components
import { AreaChart } from '../../components/Overview/AreaChart';
import { Card, MetricCard, StatCard } from '../../components/Overview/Card';
import { DonutChart } from '../../components/Overview/PieChart';

// Types
interface HallDataPoint {
    name: string;
    occupancy: number;
    capacity: number;
    color: string;
}

interface Show {
    id: string;
    name: string;
    sales: number;
    capacity: number;
    revenue: number;
    status: 'selling' | 'almost full' | 'sold out';
    time: string;
    date: string;
}

interface Transaction {
    id: string;
    customer: string;
    amount: number;
    tickets: number;
    time: string;
    status: 'completed' | 'refunded';
}

interface Stats {
    totalRevenue: number;
    ticketsSold: number;
    ticketsToday: number;
    occupancyRate: number;
    activeShows: number;
    totalEmployees: number;
    activeEmployees: number;
    totalHalls: number;
    customerSatisfaction: number;
}

interface RevenueData {
    period: string;
    revenue: number;
    tickets: number;
}

// Mock Data
const stats: Stats = {
    totalRevenue: 158750,
    ticketsSold: 12580,
    ticketsToday: 156,
    occupancyRate: 78,
    activeShows: 8,
    totalEmployees: 15,
    activeEmployees: 12,
    totalHalls: 5,
    customerSatisfaction: 4.6
};

const hallData: HallDataPoint[] = [
    { name: 'Hall A', occupancy: 85, capacity: 200, color: '#14b8a6' },
    { name: 'Hall B', occupancy: 92, capacity: 150, color: '#f59e0b' },
    { name: 'Hall C', occupancy: 68, capacity: 180, color: '#3b82f6' },
    { name: 'Hall D', occupancy: 45, capacity: 120, color: '#ef4444' },
    { name: 'Hall E', occupancy: 78, capacity: 160, color: '#8b5cf6' },
];

const showsData: Show[] = [
    { id: '1', name: 'The Lion King', sales: 89, capacity: 120, revenue: 4005, status: 'selling', time: '7:00 PM', date: '2024-04-20' },
    { id: '2', name: 'Hamilton', sales: 95, capacity: 120, revenue: 6175, status: 'almost full', time: '8:30 PM', date: '2024-04-21' },
    { id: '3', name: 'Wicked', sales: 110, capacity: 120, revenue: 6050, status: 'sold out', time: '6:00 PM', date: '2024-04-19' },
    { id: '4', name: 'Phantom of Opera', sales: 67, capacity: 120, revenue: 4020, status: 'selling', time: '9:00 PM', date: '2024-04-22' },
    { id: '5', name: 'Chicago', sales: 78, capacity: 120, revenue: 3900, status: 'selling', time: '7:30 PM', date: '2024-04-23' },
];

const transactions: Transaction[] = [
    { id: '#TR-2024-001', customer: 'John Doe', amount: 90, tickets: 2, time: '5 min ago', status: 'completed' },
    { id: '#TR-2024-002', customer: 'Jane Smith', amount: 135, tickets: 3, time: '15 min ago', status: 'completed' },
    { id: '#TR-2024-003', customer: 'Bob Johnson', amount: 45, tickets: 1, time: '25 min ago', status: 'completed' },
    { id: '#TR-2024-004', customer: 'Alice Brown', amount: 180, tickets: 4, time: '35 min ago', status: 'completed' },
    { id: '#TR-2024-005', customer: 'Charlie Wilson', amount: 90, tickets: 2, time: '45 min ago', status: 'refunded' },
];

// Daily Revenue Data (7 days)
const dailyRevenueData: RevenueData[] = [
    { period: 'Mon', revenue: 32450, tickets: 156 },
    { period: 'Tue', revenue: 28900, tickets: 142 },
    { period: 'Wed', revenue: 35600, tickets: 178 },
    { period: 'Thu', revenue: 41200, tickets: 195 },
    { period: 'Fri', revenue: 52300, tickets: 245 },
    { period: 'Sat', revenue: 67800, tickets: 312 },
    { period: 'Sun', revenue: 58900, tickets: 278 },
];

// Monthly Revenue Data (12 months)
const monthlyRevenueData: RevenueData[] = [
    { period: 'Jan', revenue: 125000, tickets: 5850 },
    { period: 'Feb', revenue: 118000, tickets: 5420 },
    { period: 'Mar', revenue: 142000, tickets: 6780 },
    { period: 'Apr', revenue: 158000, tickets: 7450 },
    { period: 'May', revenue: 172000, tickets: 8150 },
    { period: 'Jun', revenue: 189000, tickets: 8920 },
    { period: 'Jul', revenue: 195000, tickets: 9250 },
    { period: 'Aug', revenue: 182000, tickets: 8680 },
    { period: 'Sep', revenue: 201000, tickets: 9560 },
    { period: 'Oct', revenue: 215000, tickets: 10200 },
    { period: 'Nov', revenue: 235000, tickets: 11150 },
    { period: 'Dec', revenue: 268000, tickets: 12800 },
];

// Yearly Revenue Data (5 years)
const yearlyRevenueData: RevenueData[] = [
    { period: '2020', revenue: 1850000, tickets: 88500 },
    { period: '2021', revenue: 2120000, tickets: 99800 },
    { period: '2022', revenue: 1980000, tickets: 94100 },
    { period: '2023', revenue: 2350000, tickets: 111500 },
    { period: '2024', revenue: 2680000, tickets: 128200 },
];

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

const OwnerDashboard: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'monthly' | 'yearly'>('monthly');

    // In OwnerDashboard.tsx, replace the formatCurrency function with:

const formatCurrency = (amount: number) => {
    // For large numbers (millions), show with M suffix
    if (amount >= 1000000) {
        return `ETB ${(amount / 1000000).toFixed(1)}M`;
    }
    // For thousands, show with K suffix
    if (amount >= 1000) {
        return `ETB ${(amount / 1000).toFixed(0)}K`;
    }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'ETB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'selling':
                return { bg: 'bg-green-100', text: 'text-green-700', label: 'Selling' };
            case 'almost full':
                return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Almost Full' };
            case 'sold out':
                return { bg: 'bg-red-100', text: 'text-red-700', label: 'Sold Out' };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
        }
    };

    const getRevenueData = (): RevenueData[] => {
        switch (selectedPeriod) {
            case 'daily':
                return dailyRevenueData;
            case 'monthly':
                return monthlyRevenueData;
            case 'yearly':
                return yearlyRevenueData;
            default:
                return monthlyRevenueData;
        }
    };

    const getXAxisKey = (): string => {
        return 'period';
    };

    // Prepare donut chart data for halls with original colors
    const hallDonutData = hallData.map(hall => ({
        name: hall.name,
        value: hall.occupancy,
        color: hall.color
    }));

    // Calculate total revenue for selected period
    const currentData = getRevenueData();
    const totalRevenue = currentData.reduce((sum, item) => sum + item.revenue, 0);
    const totalTickets = currentData.reduce((sum, item) => sum + item.tickets, 0);

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-6 p-4 md:p-6"
        >
            {/* Page Header */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening with your business today.</p>
                </div>
            </motion.div>

            {/* Stats Grid - Using StatCard from Card component */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                    title="Tickets Today"
                    value={stats.ticketsToday}
                    icon={Ticket}
                    color="from-blue-500 to-cyan-600"
                    link="/owner/bookings"
                />
                <StatCard
                    title="Occupancy Rate"
                    value={`${stats.occupancyRate}%`}
                    icon={Activity}
                    color="from-purple-500 to-pink-600"
                    link="/owner/halls"
                />
                <StatCard
                    title="Active Shows"
                    value={stats.activeShows}
                    icon={Film}
                    color="from-orange-500 to-red-600"
                    link="/owner/events"
                />
                <StatCard
                    title="Total Revenue"
                    value={formatCurrency(stats.totalRevenue)}
                    icon={TrendingUp}
                    color="from-green-500 to-emerald-600"
                    link="/owner/financial"
                />
            </motion.div>

            {/* Secondary Stats - Using MetricCard */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Total Tickets Sold"
                    value={stats.ticketsSold.toLocaleString()}
                    icon={<Ticket className="h-5 w-5 text-white" />}
                />
                <MetricCard
                    title="Total Halls"
                    value={stats.totalHalls}
                    icon={<Building className="h-5 w-5 text-white" />}
                />
                <MetricCard
                    title="Customer Satisfaction"
                    value={`${stats.customerSatisfaction}/5 ⭐`}
                    icon={<Star className="h-5 w-5 text-white" />}
                />
                <MetricCard
                    title="Active Employees"
                    value={`${stats.activeEmployees}/${stats.totalEmployees}`}
                    icon={<Users className="h-5 w-5 text-white" />}
                />
            </motion.div>

            {/* Hall Occupancy - Using Card and DonutChart */}
            <motion.div variants={itemVariants}>
                <Card
                    title="Hall Occupancy"
                    subtitle="Current occupancy rates across all halls"
                    showMoreLink="/owner/halls"
                    showMoreText="Manage Halls"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <DonutChart
                            data={hallDonutData}
                            height={280}
                            showLabels={true}
                        />
                        <div className="space-y-3">
                            {hallData.map((hall, index) => (
                                <div key={index}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-700">{hall.name}</span>
                                        <span className="text-gray-500">{hall.occupancy}% occupancy</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${hall.occupancy}%`, backgroundColor: hall.color }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Capacity: {hall.capacity} seats
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Revenue Chart - Using AreaChart with Daily, Monthly, Yearly selector */}
            <motion.div variants={itemVariants}>
                <Card
                    title="Revenue Trends"
                    subtitle={`${selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} revenue performance - Total: ${formatCurrency(totalRevenue)}`}
                    headerAction={
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            {['Daily', 'Monthly', 'Yearly'].map((period) => (
                                <button
                                    key={period}
                                    onClick={() => setSelectedPeriod(period.toLowerCase() as any)}
                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                                        selectedPeriod === period.toLowerCase() 
                                            ? 'bg-teal-600 text-white shadow-sm' 
                                            : 'text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {period}
                                </button>
                            ))}
                        </div>
                    }
                >
                    <AreaChart
                        data={getRevenueData()}
                        areas={[
                            { dataKey: 'revenue', name: 'Revenue', color: '#14b8a6', gradient: true },
                        ]}
                        xAxisKey={getXAxisKey()}
                        yAxisLabel="Revenue (ETB)"
                        height={350}
                        showGrid={true}
                        showLegend={true}
                    />
                </Card>
            </motion.div>

            {/* Shows Performance Table */}
            <motion.div variants={itemVariants}>
                <Card
                    title="Current Shows Performance"
                    subtitle="Real-time performance metrics for active shows"
                    showMoreLink="/owner/events"
                    showMoreText="View All Shows"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead className="border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Show Name</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date & Time</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Sales</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Revenue</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {showsData.map((show) => {
                                    const statusBadge = getStatusBadgeClass(show.status);
                                    return (
                                        <tr key={show.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-3 px-4 text-sm font-medium text-gray-900">{show.name}</td>
                                            <td className="py-3 px-4 text-sm text-gray-500">{show.date} at {show.time}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-700">{show.sales}/{show.capacity}</span>
                                                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                                        <div 
                                                            className="h-1.5 rounded-full bg-teal-500" 
                                                            style={{ width: `${(show.sales / show.capacity) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-sm font-semibold text-emerald-600">{formatCurrency(show.revenue)}</td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusBadge.bg} ${statusBadge.text}`}>
                                                    {statusBadge.label}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <button className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition">
                                                        <Eye className="h-4 w-4 text-blue-600" />
                                                    </button>
                                                    <button className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 transition">
                                                        <Edit className="h-4 w-4 text-teal-600" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </motion.div>

            {/* Recent Bookings & Transactions */}
            <motion.div variants={itemVariants}>
                <Card
                    title="Recent Bookings & Transactions"
                    subtitle="Latest customer activities and ticket purchases"
                    showMoreLink="/owner/bookings"
                    showMoreText="View All Bookings"
                >
                    <div className="space-y-3">
                        {transactions.map((transaction, index) => (
                            <motion.div
                                key={transaction.id}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${transaction.status === 'completed' ? 'bg-green-100' : 'bg-red-100'}`}>
                                        {transaction.status === 'completed' 
                                            ? <CheckCircle className="h-5 w-5 text-green-600" />
                                            : <RotateCcw className="h-5 w-5 text-red-600" />
                                        }
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{transaction.customer}</p>
                                        <p className="text-xs text-gray-500">{transaction.id} • {transaction.tickets} tickets</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(transaction.amount)}</p>
                                    <p className="text-xs text-gray-400">{transaction.time}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Card>
            </motion.div>

        </motion.div>
    );
};

export default OwnerDashboard;