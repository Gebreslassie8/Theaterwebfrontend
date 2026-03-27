// Frontend/src/pages/owner/OwnerDashboard.tsx
import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Users, Building, DollarSign, Activity, Crown,
    Calendar, Ticket, Star, TrendingUp, Package, Clock, MapPin,
    UserPlus, CheckCircle, Eye, Edit, Download,
    Filter, CreditCard, Printer, Film,
    RotateCcw, UserCheck, Map
} from 'lucide-react';
import {
    BarChart, Bar, PieChart as RePieChart, Pie,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell
} from 'recharts';

// Types
interface User {
    id?: string | number;
    name?: string;
    email?: string;
    role: string;
    [key: string]: any;
}

interface OutletContext {
    user: User;
    onUserUpdate?: (user: User) => void;
}

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    change?: string;
    trend?: 'up' | 'down';
    color: string;
    delay?: number;
    dateRange: string;
}

interface QuickActionButtonProps {
    icon: React.ElementType;
    text: string;
    color: 'amber' | 'blue' | 'green' | 'purple';
}

interface QuickStatBadgeProps {
    icon: React.ElementType;
    label: string;
    value: string | number;
    status?: 'online' | 'offline';
}

interface RevenueData {
    day: string;
    revenue: number;
    tickets: number;
    occupancy: number;
}

interface MonthlyData {
    month: string;
    revenue: number;
    tickets: number;
    occupancy: number;
}

interface Show {
    name: string;
    sales: number;
    capacity: number;
    revenue: number;
    status: 'selling' | 'almost full' | 'sold out';
    time: string;
}

interface Employee {
    id: number;
    name: string;
    role: string;
    status: 'active' | 'off';
    shift: string;
    performance: number;
}

interface Transaction {
    id: string;
    customer: string;
    amount: number;
    tickets: number;
    time: string;
    status: 'completed' | 'refunded';
}

interface HallData {
    name: string;
    occupancy: number;
    capacity: number;
    color: string;
}

interface Stats {
    totalRevenue: number;
    monthlyRevenue: number;
    weeklyRevenue: number;
    todayRevenue: number;
    ticketsSold: number;
    ticketsToday: number;
    occupancyRate: number;
    activeShows: number;
    upcomingShows: number;
    totalEmployees: number;
    activeEmployees: number;
    totalHalls: number;
    totalScanners: number;
    avgTicketPrice: number;
    customerSatisfaction: number;
}

const OwnerDashboard: React.FC = () => {
    const { user } = useOutletContext<OutletContext>();
    const [dateRange, setDateRange] = useState<string>('week');

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
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

    // Owner Statistics
    const stats: Stats = {
        totalRevenue: 158750,
        monthlyRevenue: 45200,
        weeklyRevenue: 11250,
        todayRevenue: 3245,
        ticketsSold: 12580,
        ticketsToday: 156,
        occupancyRate: 78,
        activeShows: 8,
        upcomingShows: 12,
        totalEmployees: 15,
        activeEmployees: 12,
        totalHalls: 5,
        totalScanners: 8,
        avgTicketPrice: 45,
        customerSatisfaction: 4.6
    };

    // Revenue Data
    const revenueData: RevenueData[] = [
        { day: 'Mon', revenue: 3245, tickets: 156, occupancy: 72 },
        { day: 'Tue', revenue: 2890, tickets: 142, occupancy: 68 },
        { day: 'Wed', revenue: 3560, tickets: 178, occupancy: 75 },
        { day: 'Thu', revenue: 4120, tickets: 195, occupancy: 80 },
        { day: 'Fri', revenue: 5230, tickets: 245, occupancy: 85 },
        { day: 'Sat', revenue: 6780, tickets: 312, occupancy: 92 },
        { day: 'Sun', revenue: 5890, tickets: 278, occupancy: 88 },
    ];

    const monthlyData: MonthlyData[] = [
        { month: 'Jan', revenue: 38500, tickets: 1850, occupancy: 72 },
        { month: 'Feb', revenue: 41200, tickets: 1980, occupancy: 74 },
        { month: 'Mar', revenue: 39800, tickets: 1910, occupancy: 73 },
        { month: 'Apr', revenue: 45200, tickets: 2150, occupancy: 78 },
        { month: 'May', revenue: 48500, tickets: 2320, occupancy: 80 },
        { month: 'Jun', revenue: 52300, tickets: 2510, occupancy: 82 },
        { month: 'Jan', revenue: 38500, tickets: 1850, occupancy: 72 },
        { month: 'August', revenue: 41200, tickets: 1980, occupancy: 74 },
        { month: 'Sept', revenue: 39800, tickets: 1910, occupancy: 73 },
        { month: 'Oct', revenue: 45200, tickets: 2150, occupancy: 78 },
        { month: 'Nov', revenue: 48500, tickets: 2320, occupancy: 80 },
        { month: 'Dec', revenue: 52300, tickets: 2510, occupancy: 82 },
    ];

    // Shows Data
    const showsData: Show[] = [
        { name: 'The Lion King', sales: 89, capacity: 120, revenue: 4005, status: 'selling', time: '7:00 PM' },
        { name: 'Hamilton', sales: 95, capacity: 120, revenue: 6175, status: 'almost full', time: '8:30 PM' },
        { name: 'Wicked', sales: 110, capacity: 120, revenue: 6050, status: 'sold out', time: '6:00 PM' },
        { name: 'Phantom of Opera', sales: 67, capacity: 120, revenue: 4020, status: 'selling', time: '9:00 PM' },
        { name: 'Chicago', sales: 78, capacity: 120, revenue: 3900, status: 'selling', time: '7:30 PM' },
    ];

    // Employee Data
    const employees: Employee[] = [
        { id: 1, name: 'John Smith', role: 'Manager', status: 'active', shift: 'Morning', performance: 95 },
        { id: 2, name: 'Sarah Johnson', role: 'Salesperson', status: 'active', shift: 'Evening', performance: 88 },
        { id: 3, name: 'Mike Wilson', role: 'Scanner', status: 'active', shift: 'Morning', performance: 92 },
        { id: 4, name: 'Emily Brown', role: 'Cleaner', status: 'active', shift: 'Night', performance: 85 },
        { id: 5, name: 'David Lee', role: 'Security', status: 'off', shift: 'Evening', performance: 90 },
    ];

    // Recent Transactions
    const transactions: Transaction[] = [
        { id: '#TR-2024-001', customer: 'John Doe', amount: 90, tickets: 2, time: '5 min ago', status: 'completed' },
        { id: '#TR-2024-002', customer: 'Jane Smith', amount: 135, tickets: 3, time: '15 min ago', status: 'completed' },
        { id: '#TR-2024-003', customer: 'Bob Johnson', amount: 45, tickets: 1, time: '25 min ago', status: 'completed' },
        { id: '#TR-2024-004', customer: 'Alice Brown', amount: 180, tickets: 4, time: '35 min ago', status: 'completed' },
        { id: '#TR-2024-005', customer: 'Charlie Wilson', amount: 90, tickets: 2, time: '45 min ago', status: 'refunded' },
    ];

    // Hall Occupancy Data
    const hallData: HallData[] = [
        { name: 'Hall A', occupancy: 85, capacity: 200, color: '#0D9488' },
        { name: 'Hall B', occupancy: 92, capacity: 150, color: '#F59E0B' },
        { name: 'Hall C', occupancy: 68, capacity: 180, color: '#3B82F6' },
        { name: 'Hall D', occupancy: 45, capacity: 120, color: '#EF4444' },
        { name: 'Hall E', occupancy: 78, capacity: 160, color: '#8B5CF6' },
    ];

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8 lg:ml-4"
        >
            {/* Welcome Header */}
            <motion.div
                variants={itemVariants}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 p-8 text-white"
            >
                <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute bg-white/10 rounded-full"
                            style={{
                                width: Math.random() * 100 + 50,
                                height: Math.random() * 100 + 50,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                x: [0, Math.random() * 100 - 50],
                                y: [0, Math.random() * 100 - 50],
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: Math.random() * 10 + 10,
                                repeat: Infinity,
                                repeatType: "reverse" as const,
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-xl rounded-full mb-4"
                    >
                        <Crown className="h-4 w-4" />
                        <span className="text-sm font-medium">👑 Theater Owner</span>
                    </motion.div>

                    <motion.h1
                        className="text-4xl font-bold mb-2"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        Welcome back, {user?.name || 'Theater Owner'}!
                    </motion.h1>

                    <motion.p
                        className="text-white/80 text-lg max-w-2xl"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Track your theater's performance and manage operations
                    </motion.p>

                    <motion.div
                        className="flex items-center gap-6 mt-6 flex-wrap"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <QuickStatBadge icon={Building} label="Theater" value="Grand Cinema" />
                        <QuickStatBadge icon={MapPin} label="Location" value="Addis Ababa" />
                        <QuickStatBadge icon={Activity} label="Status" value="Open" status="online" />
                        <QuickStatBadge icon={Users} label="Staff on Duty" value={stats.activeEmployees} />
                    </motion.div>
                </div>
            </motion.div>

            {/* Date Range Selector */}
            <motion.div variants={itemVariants} className="flex justify-between items-center">
                <div className="flex gap-2">
                    {['day', 'week', 'month', 'year'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setDateRange(range)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${dateRange === range
                                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {range.charAt(0).toUpperCase() + range.slice(1)}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2">
                    <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                        <Download className="h-5 w-5 text-gray-600" />
                    </button>
                    <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                        <Filter className="h-5 w-5 text-gray-600" />
                    </button>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Today's Revenue"
                    value={`$${stats.todayRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    change="+15.3%"
                    trend="up"
                    color="from-amber-500 to-yellow-500"
                    delay={0.1}
                    dateRange={dateRange}
                />
                <StatCard
                    title="Tickets Sold Today"
                    value={stats.ticketsToday}
                    icon={Ticket}
                    change="+23"
                    trend="up"
                    color="from-blue-500 to-cyan-500"
                    delay={0.2}
                    dateRange={dateRange}
                />
                <StatCard
                    title="Occupancy Rate"
                    value={`${stats.occupancyRate}%`}
                    icon={Activity}
                    change="+5.2%"
                    trend="up"
                    color="from-green-500 to-emerald-500"
                    delay={0.3}
                    dateRange={dateRange}
                />
                <StatCard
                    title="Active Shows"
                    value={stats.activeShows}
                    icon={Film}
                    change="+2"
                    trend="up"
                    color="from-purple-500 to-pink-500"
                    delay={0.4}
                    dateRange={dateRange}
                />
            </motion.div>

            {/* Secondary Stats Row */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Total Tickets</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.ticketsSold.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Avg. Ticket Price</p>
                    <p className="text-2xl font-bold text-gray-900">${stats.avgTicketPrice}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Satisfaction</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.customerSatisfaction}/5</p>
                </div>
            </motion.div>

            {/* Charts Section */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-xl border border-gray-200"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
                            <p className="text-sm text-gray-500">
                                {dateRange === 'week' ? 'Weekly revenue trend' : 'Monthly revenue trend'}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm">+12.5%</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dateRange === 'week' ? revenueData : monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey={dateRange === 'week' ? 'day' : 'month'} stroke="#6B7280" />
                            <YAxis stroke="#6B7280" />
                            <Tooltip />
                            <Bar dataKey="revenue" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Hall Occupancy */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Hall Occupancy</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <RePieChart>
                            <Pie
                                data={hallData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="occupancy"
                                label
                            >
                                {hallData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </RePieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                        {hallData.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-sm text-gray-600">{item.name}</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900">{item.occupancy}%</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>

            {/* Shows Performance */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Current Shows Performance</h3>
                    <button className="text-sm text-amber-500 hover:underline">View All Shows</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Show Name</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Time</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Sales</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Revenue</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {showsData.map((show, index) => (
                                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{show.name}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{show.time}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-900">{show.sales}/{show.capacity}</span>
                                            <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                                <div
                                                    className="bg-amber-500 h-1.5 rounded-full"
                                                    style={{ width: `${(show.sales / show.capacity) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-900">${show.revenue}</td>
                                    <td className="py-3 px-4">
                                        <span className={`text-xs px-2 py-1 rounded-full ${show.status === 'sold out' ? 'bg-red-100 text-red-700' :
                                            show.status === 'almost full' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-green-100 text-green-700'
                                            }`}>
                                            {show.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <button className="p-1 hover:bg-gray-100 rounded">
                                                <Eye className="h-4 w-4 text-gray-600" />
                                            </button>
                                            <button className="p-1 hover:bg-gray-100 rounded">
                                                <Edit className="h-4 w-4 text-gray-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Recent Transactions & Staff on Duty */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Transactions */}
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                        <button className="text-sm text-amber-500 hover:underline">View All</button>
                    </div>
                    <div className="space-y-3">
                        {transactions.map((transaction, index) => (
                            <motion.div
                                key={transaction.id}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${transaction.status === 'completed'
                                        ? 'bg-green-100'
                                        : 'bg-red-100'
                                        }`}>
                                        {transaction.status === 'completed'
                                            ? <CheckCircle className="h-4 w-4 text-green-600" />
                                            : <RotateCcw className="h-4 w-4 text-red-600" />
                                        }
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{transaction.customer}</p>
                                        <p className="text-xs text-gray-500">{transaction.id}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900">${transaction.amount}</p>
                                    <p className="text-xs text-gray-500">{transaction.tickets} tickets • {transaction.time}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Staff on Duty */}
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Staff on Duty</h3>
                        <button className="text-sm text-amber-500 hover:underline">Manage Staff</button>
                    </div>
                    <div className="space-y-3">
                        {employees.filter(e => e.status === 'active').map((employee, index) => (
                            <motion.div
                                key={employee.id}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-white font-bold">
                                        {employee.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                                        <p className="text-xs text-gray-500">{employee.role} • {employee.shift} Shift</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-right">
                                        <div className="flex items-center gap-1">
                                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                            <span className="text-xs text-gray-600">{employee.performance}%</span>
                                        </div>
                                    </div>
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Total Staff</span>
                            <span className="font-semibold text-gray-900">{stats.totalEmployees}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-1">
                            <span className="text-gray-500">On Duty</span>
                            <span className="font-semibold text-green-600">{stats.activeEmployees}</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickActionButton icon={Calendar} text="Create Event" color="amber" />
                <QuickActionButton icon={Users} text="Hire Staff" color="blue" />
                <QuickActionButton icon={DollarSign} text="View Reports" color="green" />
                <QuickActionButton icon={Printer} text="Print Reports" color="purple" />
            </motion.div>
        </motion.div>
    );
};

// Stat Card Component
const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, change, trend, color, delay, dateRange }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, type: "spring", stiffness: 100 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200 relative overflow-hidden group"
        >
            <div className="relative z-10">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">{title}</p>
                        <p className="text-3xl font-bold text-gray-900">{value}</p>
                        {change && (
                            <div className="flex items-center gap-1 mt-2">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${trend === 'up'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                    }`}>
                                    {change}
                                </span>
                                <span className="text-xs text-gray-500">vs last {dateRange}</span>
                            </div>
                        )}
                    </div>
                    <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                        <Icon className="h-7 w-7 text-white" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Quick Action Button
const QuickActionButton: React.FC<QuickActionButtonProps> = ({ icon: Icon, text, color }) => {
    const colors = {
        amber: 'from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600',
        blue: 'from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600',
        green: 'from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600',
        purple: 'from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-4 bg-gradient-to-r ${colors[color]} text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2`}
        >
            <Icon className="h-5 w-5" />
            <span className="text-sm">{text}</span>
        </motion.button>
    );
};

// Quick Stat Badge Component
const QuickStatBadge: React.FC<QuickStatBadgeProps> = ({ icon: Icon, label, value, status }) => (
    <div className="flex items-center gap-2 text-white/90 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
        <Icon className="h-4 w-4" />
        <span className="text-sm">{label}:</span>
        <span className="text-sm font-semibold flex items-center gap-1">
            {value}
            {status === 'online' && (
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
            )}
        </span>
    </div>
);

export default OwnerDashboard;