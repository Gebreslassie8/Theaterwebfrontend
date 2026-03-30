// Frontend/src/Admin/AdminDashboard.tsx
import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Users,
    Building,
    DollarSign,
    Activity,
    Shield,
    Calendar,
    Ticket,
    Star,
    AlertCircle,
    Package,
    Clock,
    MapPin,
    Settings,
    Globe,
    Award,
    CheckCircle,
    Eye,
    Edit,
    Download,
    Filter
} from 'lucide-react';
import {
    AreaChart, Area, PieChart as RePieChart, Pie,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, LineChart, Line
} from 'recharts';

// Types
interface User {
    name: string;
    email: string;
    role: string;
    [key: string]: any;
}

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    change?: string;
    trend?: 'up' | 'down';
    color: string;
    delay: number;
    dateRange: string;
}

interface QuickStatBadgeProps {
    icon: React.ElementType;
    label: string;
    value: string | number;
    status?: 'online' | 'offline';
}

interface RevenueDataPoint {
    month: string;
    revenue: number;
    bookings: number;
    theaters: number;
}

interface TheaterDistributionDataPoint {
    name: string;
    value: number;
    color: string;
}

interface UserGrowthDataPoint {
    month: string;
    users: number;
    newUsers: number;
}

interface Activity {
    id: number;
    action: string;
    user: string;
    time: string;
    icon: React.ElementType;
    status: 'success' | 'warning' | 'info';
}

interface Theater {
    id: number;
    name: string;
    location: string;
    status: 'active' | 'pending' | 'inactive';
    revenue: number;
    bookings: number;
    rating: number;
}

interface TopTheater {
    name: string;
    revenue: number;
    bookings: number;
    growth: string;
}

interface Stats {
    totalTheaters: number;
    activeTheaters: number;
    pendingTheaters: number;
    totalUsers: number;
    newUsersToday: number;
    totalRevenue: number;
    monthlyRevenue: number;
    activeSessions: number;
    systemHealth: number;
    pendingApprovals: number;
    totalShows: number;
    totalBookings: number;
}

// Mock Data
const stats: Stats = {
    totalTheaters: 27,
    activeTheaters: 24,
    pendingTheaters: 3,
    totalUsers: 1842,
    newUsersToday: 45,
    totalRevenue: 327000,
    monthlyRevenue: 67000,
    activeSessions: 1245,
    systemHealth: 98,
    pendingApprovals: 8,
    totalShows: 156,
    totalBookings: 2345
};

const revenueData: RevenueDataPoint[] = [
    { month: 'Jan', revenue: 45000, bookings: 320, theaters: 24 },
    { month: 'Feb', revenue: 52000, bookings: 380, theaters: 25 },
    { month: 'Mar', revenue: 48000, bookings: 350, theaters: 25 },
    { month: 'Apr', revenue: 61000, bookings: 420, theaters: 26 },
    { month: 'May', revenue: 55000, bookings: 400, theaters: 26 },
    { month: 'Jun', revenue: 67000, bookings: 480, theaters: 27 },
];

const theaterData: TheaterDistributionDataPoint[] = [
    { name: 'Active Theaters', value: 24, color: '#0D9488' },
    { name: 'Pending Approval', value: 3, color: '#F59E0B' },
    { name: 'Inactive', value: 2, color: '#EF4444' },
];

const userGrowthData: UserGrowthDataPoint[] = [
    { month: 'Jan', users: 1200, newUsers: 85 },
    { month: 'Feb', users: 1350, newUsers: 150 },
    { month: 'Mar', users: 1420, newUsers: 70 },
    { month: 'Apr', users: 1580, newUsers: 160 },
    { month: 'May', users: 1650, newUsers: 70 },
    { month: 'Jun', users: 1800, newUsers: 150 },
];

const recentActivities: Activity[] = [
    { id: 1, action: 'New theater registered', user: 'Grand Theater', time: '5 min ago', icon: Building, status: 'success' },
    { id: 2, action: 'Payment processed', user: 'City Cinema', time: '15 min ago', icon: DollarSign, status: 'success' },
    { id: 3, action: 'System update', user: 'Admin', time: '1 hour ago', icon: Settings, status: 'info' },
    { id: 4, action: 'New user joined', user: 'John Doe', time: '2 hours ago', icon: Users, status: 'success' },
    { id: 5, action: 'Theater approval pending', user: 'Sunset Theater', time: '3 hours ago', icon: Building, status: 'warning' },
];

const theaters: Theater[] = [
    { id: 1, name: 'Grand Theater', location: 'Addis Ababa', status: 'active', revenue: 45000, bookings: 1200, rating: 4.8 },
    { id: 2, name: 'City Cinema', location: 'Addis Ababa', status: 'active', revenue: 38000, bookings: 980, rating: 4.6 },
    { id: 3, name: 'Sunset Theater', location: 'Bahir Dar', status: 'pending', revenue: 0, bookings: 0, rating: 0 },
    { id: 4, name: 'Star Cinema', location: 'Hawassa', status: 'active', revenue: 25000, bookings: 650, rating: 4.5 },
    { id: 5, name: 'Moonlight Theater', location: 'Dire Dawa', status: 'active', revenue: 22000, bookings: 580, rating: 4.4 },
];

const topTheaters: TopTheater[] = [
    { name: 'Grand Theater', revenue: 45000, bookings: 1200, growth: '+15%' },
    { name: 'City Cinema', revenue: 38000, bookings: 980, growth: '+12%' },
    { name: 'Star Cinema', revenue: 25000, bookings: 650, growth: '+8%' },
];

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

// Stat Card Component
const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, change, trend, color, delay, dateRange }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, type: "spring", stiffness: 100 }}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-dark-700 relative overflow-hidden group"
        >
            <div className="relative z-10">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                        {change && (
                            <div className="flex items-center gap-1 mt-2">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${trend === 'up'
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                    }`}>
                                    {change}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">vs last {dateRange}</span>
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

const AdminDashboard: React.FC = () => {
    const { user } = useOutletContext<{ user: User }>();
    const [activeTab, setActiveTab] = useState<string>('overview');
    const [dateRange, setDateRange] = useState<string>('month');

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
                                repeatType: "reverse",
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
                        <Shield className="h-4 w-4" />
                        <span className="text-sm font-medium">🔰 System Administrator</span>
                    </motion.div>

                    <motion.h1
                        className="text-4xl font-bold mb-2 text-center"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        Welcome back, {user?.name || 'Administrator'}!
                    </motion.h1>

                    <motion.p
                        className="text-white/80 text-lg max-w-2xl"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Here's what's happening with your platform today
                    </motion.p>

                    <motion.div
                        className="flex items-center gap-6 mt-6 flex-wrap"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <QuickStatBadge icon={Calendar} label="Date" value={new Date().toLocaleDateString()} />
                        <QuickStatBadge icon={MapPin} label="Location" value="Addis Ababa" />
                        <QuickStatBadge icon={Activity} label="System Status" value="Healthy" status="online" />
                        <QuickStatBadge icon={Users} label="Online Users" value="1,245" />
                    </motion.div>
                </div>
            </motion.div>

            {/* Date Range Selector */}
            <motion.div variants={itemVariants} className="flex justify-between items-center">
                <div className="flex gap-2">
                    {(['day', 'week', 'month', 'year'] as const).map((range) => (
                        <button
                            key={range}
                            onClick={() => setDateRange(range)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${dateRange === range
                                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                                : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-600'
                                }`}
                        >
                            {range.charAt(0).toUpperCase() + range.slice(1)}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2">
                    <button className="p-2 bg-gray-100 dark:bg-dark-700 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors">
                        <Download className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button className="p-2 bg-gray-100 dark:bg-dark-700 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors">
                        <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Theaters"
                    value={stats.totalTheaters}
                    icon={Building}
                    change="+3"
                    trend="up"
                    color="from-teal-500 to-teal-600"
                    delay={0.1}
                    dateRange={dateRange}
                />
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers.toLocaleString()}
                    icon={Users}
                    change="+180"
                    trend="up"
                    color="from-blue-500 to-cyan-500"
                    delay={0.2}
                    dateRange={dateRange}
                />
                <StatCard
                    title="Total Revenue"
                    value={`$${(stats.totalRevenue / 1000).toFixed(1)}K`}
                    icon={DollarSign}
                    change="+$45K"
                    trend="up"
                    color="from-green-500 to-emerald-500"
                    delay={0.3}
                    dateRange={dateRange}
                />
                <StatCard
                    title="System Health"
                    value={`${stats.systemHealth}%`}
                    icon={Activity}
                    change="+2%"
                    trend="up"
                    color="from-purple-500 to-pink-500"
                    delay={0.4}
                    dateRange={dateRange}
                />
            </motion.div>

            {/* Secondary Stats Row */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-dark-800 rounded-xl p-4 shadow border border-gray-200 dark:border-dark-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Active Theaters</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeTheaters}</p>
                </div>
                <div className="bg-white dark:bg-dark-800 rounded-xl p-4 shadow border border-gray-200 dark:border-dark-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pending Approvals</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pendingApprovals}</p>
                </div>
                <div className="bg-white dark:bg-dark-800 rounded-xl p-4 shadow border border-gray-200 dark:border-dark-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Shows</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalShows}</p>
                </div>
                <div className="bg-white dark:bg-dark-800 rounded-xl p-4 shadow border border-gray-200 dark:border-dark-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalBookings}</p>
                </div>
            </motion.div>

            {/* Charts Section */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-2 bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-dark-700"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Overview</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Monthly revenue trend</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-lg text-sm">+23.5%</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                            <XAxis dataKey="month" stroke="#6B7280" />
                            <YAxis stroke="#6B7280" />
                            <Tooltip />
                            <Area type="monotone" dataKey="revenue" stroke="#0D9488" strokeWidth={2} fill="url(#revenueGradient)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Theater Distribution */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-dark-700"
                >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Theater Distribution</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <RePieChart>
                            <Pie
                                data={theaterData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                label
                            >
                                {theaterData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </RePieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                        {theaterData.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>

            {/* User Growth Chart */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-dark-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Growth</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={userGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                        <XAxis dataKey="month" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip />
                        <Line type="monotone" dataKey="users" stroke="#0D9488" strokeWidth={2} />
                        <Line type="monotone" dataKey="newUsers" stroke="#F59E0B" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </motion.div>

            {/* Top Performing Theaters */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-dark-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Theater Management</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-dark-700">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Theater Name</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Location</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Rating</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {theaters.map((theater) => (
                                    <tr key={theater.id} className="border-b border-gray-100 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                                        <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{theater.name}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{theater.location}</td>
                                        <td className="py-3 px-4">
                                            <span className={`text-xs px-2 py-1 rounded-full ${theater.status === 'active'
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : theater.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                {theater.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">${theater.revenue.toLocaleString()}</td>
                                        <td className="py-3 px-4">
                                            {theater.rating > 0 ? (
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                                    <span className="text-sm text-gray-900 dark:text-white">{theater.rating}</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400">N/A</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <button className="p-1 hover:bg-gray-100 dark:hover:bg-dark-600 rounded transition-colors">
                                                    <Eye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                                </button>
                                                <button className="p-1 hover:bg-gray-100 dark:hover:bg-dark-600 rounded transition-colors">
                                                    <Edit className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                                </button>
                                                {theater.status === 'pending' && (
                                                    <button className="p-1 hover:bg-green-100 dark:hover:bg-green-900/30 rounded transition-colors">
                                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Performers */}
                <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-dark-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Performing Theaters</h3>
                    <div className="space-y-4">
                        {topTheaters.map((theater, index) => (
                            <div key={index} className="p-4 bg-gray-50 dark:bg-dark-700 rounded-xl">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">{theater.name}</h4>
                                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">{theater.growth}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Revenue: ${theater.revenue.toLocaleString()}</span>
                                    <span className="text-gray-600 dark:text-gray-400">Bookings: {theater.bookings}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-dark-700">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
                    <button className="text-sm text-teal-600 hover:underline">View All</button>
                </div>
                <div className="space-y-3">
                    {recentActivities.map((activity, index) => (
                        <motion.div
                            key={activity.id}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${activity.status === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
                                    activity.status === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                                        'bg-blue-100 dark:bg-blue-900/30'
                                    }`}>
                                    <activity.icon className={`h-5 w-5 ${activity.status === 'success' ? 'text-green-600' :
                                        activity.status === 'warning' ? 'text-yellow-600' :
                                            'text-blue-600'
                                        }`} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.user}</p>
                                </div>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AdminDashboard;