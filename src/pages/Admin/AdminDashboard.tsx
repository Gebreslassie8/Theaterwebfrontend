// src/pages/Admin/AdminDashboard.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Building,
    DollarSign,
    Clock,
    UserCheck,
    Activity,
    Eye as EyeIcon,
    MapPin as MapPinIcon,
    FolderX as FolderXIcon,
    Calendar as CalendarIcon,
    ArrowRight,
    TrendingUp,
    Theater,
    Calendar,
    ChevronDown,
    RefreshCw
} from 'lucide-react';
import {
    AreaChart, Area, PieChart as RePieChart, Pie,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, LineChart, Line,
    BarChart, Bar, Legend
} from 'recharts';
import { Link } from 'react-router-dom';

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
    dateRange?: string;
    onClick?: () => void;
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

interface TheaterGrowthDataPoint {
    month: string;
    theaters: number;
    newTheaters: number;
    pendingTheaters: number;
}

interface Activity {
    id: number;
    action: string;
    user: string;
    time: string;
    icon: React.ElementType;
    status: 'success' | 'warning' | 'info';
}

interface Stats {
    totalTheaters: number;
    activeTheaters: number;
    pendingTheaters: number;
    totalUsers: number;
    newUsersToday: number;
    totalRevenue: number;
    pendingApprovals: number;
    systemHealth: number;
    totalShows: number;
    totalBookings: number;
    newTheaterRegistrations: number;
}

// Mock Data
const stats: Stats = {
    totalTheaters: 27,
    activeTheaters: 24,
    pendingTheaters: 3,
    totalUsers: 1842,
    newUsersToday: 45,
    totalRevenue: 327000,
    pendingApprovals: 8,
    systemHealth: 99.9,
    totalShows: 156,
    totalBookings: 12450,
    newTheaterRegistrations: 2
};

const revenueData: RevenueDataPoint[] = [
    { month: 'Jan', revenue: 45000, bookings: 320, theaters: 24 },
    { month: 'Feb', revenue: 52000, bookings: 380, theaters: 25 },
    { month: 'Mar', revenue: 48000, bookings: 350, theaters: 25 },
    { month: 'Apr', revenue: 61000, bookings: 420, theaters: 26 },
    { month: 'May', revenue: 55000, bookings: 400, theaters: 26 },
    { month: 'Jun', revenue: 67000, bookings: 480, theaters: 27 },
];

const dailyRevenueData = [
    { day: 'Mon', revenue: 12500 },
    { day: 'Tue', revenue: 13800 },
    { day: 'Wed', revenue: 14200 },
    { day: 'Thu', revenue: 15600 },
    { day: 'Fri', revenue: 18900 },
    { day: 'Sat', revenue: 21500 },
    { day: 'Sun', revenue: 19800 },
];

const monthlyRevenueData = [
    { month: 'Jan', revenue: 125000 },
    { month: 'Feb', revenue: 138000 },
    { month: 'Mar', revenue: 142000 },
    { month: 'Apr', revenue: 156000 },
    { month: 'May', revenue: 189000 },
    { month: 'Jun', revenue: 215000 },
    { month: 'Jul', revenue: 228000 },
    { month: 'Aug', revenue: 242000 },
    { month: 'Sep', revenue: 235000 },
    { month: 'Oct', revenue: 258000 },
    { month: 'Nov', revenue: 275000 },
    { month: 'Dec', revenue: 327000 },
];

const yearlyRevenueData = [
    { year: '2020', revenue: 1250000 },
    { year: '2021', revenue: 1580000 },
    { year: '2022', revenue: 1950000 },
    { year: '2023', revenue: 2420000 },
    { year: '2024', revenue: 3270000 },
];

const theaterData: TheaterDistributionDataPoint[] = [
    { name: 'Active Theaters', value: 24, color: '#10B981' },
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

const theaterGrowthData: TheaterGrowthDataPoint[] = [
    { month: 'Jan', theaters: 22, newTheaters: 1, pendingTheaters: 2 },
    { month: 'Feb', theaters: 23, newTheaters: 1, pendingTheaters: 2 },
    { month: 'Mar', theaters: 23, newTheaters: 0, pendingTheaters: 3 },
    { month: 'Apr', theaters: 24, newTheaters: 2, pendingTheaters: 2 },
    { month: 'May', theaters: 25, newTheaters: 1, pendingTheaters: 3 },
    { month: 'Jun', theaters: 27, newTheaters: 2, pendingTheaters: 3 },
];

// Limit recent activities to prevent bulky display
const recentActivities: Activity[] = [
    { id: 1, action: 'New theater registered', user: 'Grand Theater', time: '5 min ago', icon: Building, status: 'success' },
    { id: 2, action: 'Payment processed', user: 'City Cinema', time: '15 min ago', icon: DollarSign, status: 'success' },
    { id: 3, action: 'New user joined', user: 'John Doe', time: '2 hours ago', icon: Users, status: 'success' },
    { id: 4, action: 'Theater approval pending', user: 'Sunset Theater', time: '3 hours ago', icon: Building, status: 'warning' },
    { id: 5, action: 'Bulk ticket purchase', user: 'Sarah Johnson', time: '5 hours ago', icon: Activity, status: 'info' },
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

// Stat Card Component - Removed view button
const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, delay, notification, notificationCount }) => {
    const [isHovered, setIsHovered] = useState(false);

    const getNotificationColor = () => {
        if (title === 'Total Theaters') return '';
        if (title === 'Pending Theaters') return 'bg-yellow-500';
        return 'bg-teal-500';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, type: "spring", stiffness: 100 }}
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
        >
            <div className="relative overflow-hidden transition-all duration-300">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
                        <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <p className="text-xs text-gray-500">{title}</p>
                            {notification && notificationCount && notificationCount > 0 && (
                                <span className={`px-1.5 py-0.5 text-[9px] font-bold ${getNotificationColor()} text-white rounded-full animate-pulse`}>
                                    {notificationCount}
                                </span>
                            )}
                        </div>
                        <p className="text-xl font-bold text-gray-900">{value}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Revenue Card with Daily/Monthly/Yearly tabs
const RevenueCard: React.FC = () => {
    const [revenuePeriod, setRevenuePeriod] = useState<'daily' | 'monthly' | 'yearly'>('monthly');

    const getRevenueData = () => {
        switch (revenuePeriod) {
            case 'daily':
                return { data: dailyRevenueData, xKey: 'day', valueKey: 'revenue', label: 'Daily Revenue' };
            case 'monthly':
                return { data: monthlyRevenueData, xKey: 'month', valueKey: 'revenue', label: 'Monthly Revenue' };
            case 'yearly':
                return { data: yearlyRevenueData, xKey: 'year', valueKey: 'revenue', label: 'Yearly Revenue' };
        }
    };

    const revenueInfo = getRevenueData();
    const totalRevenue = revenueInfo.data.reduce((sum, item) => sum + (item as any)[revenueInfo.valueKey], 0);

    return (
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
                    <p className="text-sm text-gray-500">Track revenue trends</p>
                </div>
                <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setRevenuePeriod('daily')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${revenuePeriod === 'daily'
                                ? 'bg-white text-teal-600 shadow-md'
                                : 'text-gray-600 hover:text-teal-600'
                            }`}
                    >
                        Daily
                    </button>
                    <button
                        onClick={() => setRevenuePeriod('monthly')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${revenuePeriod === 'monthly'
                                ? 'bg-white text-teal-600 shadow-md'
                                : 'text-gray-600 hover:text-teal-600'
                            }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setRevenuePeriod('yearly')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${revenuePeriod === 'yearly'
                                ? 'bg-white text-teal-600 shadow-md'
                                : 'text-gray-600 hover:text-teal-600'
                            }`}
                    >
                        Yearly
                    </button>
                </div>
            </div>
            <div className="mb-4">
                <p className="text-3xl font-bold text-gray-900">
                    ETB {totalRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-4 w-4" />
                    +15.3% from previous period
                </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueInfo.data}>
                    <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                    <XAxis dataKey={revenueInfo.xKey} stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip formatter={(value: any) => `ETB ${value.toLocaleString()}`} />
                    <Area type="monotone" dataKey={revenueInfo.valueKey} stroke="#0D9488" strokeWidth={2} fill="url(#revenueGradient)" />
                </AreaChart>
            </ResponsiveContainer>
        </motion.div>
    );
};

const AdminDashboard: React.FC = () => {
    const [showAllActivities, setShowAllActivities] = useState(false);
    const displayedActivities = showAllActivities ? recentActivities : recentActivities.slice(0, 3);

    // Dashboard Cards Data - Removed view buttons
    const dashboardCards = [
        { title: 'Total Theaters', value: stats.totalTheaters, icon: Building, color: 'from-teal-500 to-teal-600', delay: 0.1, notification: false },
        { title: 'Pending Theaters', value: stats.pendingTheaters, icon: Clock, color: 'from-yellow-500 to-orange-600', delay: 0.15, notification: true, notificationCount: 3 },
        { title: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'from-blue-500 to-cyan-600', delay: 0.2, notification: false },
        { title: 'New Users Today', value: stats.newUsersToday, icon: UserCheck, color: 'from-indigo-500 to-purple-600', delay: 0.25, notification: false },
        { title: 'New Theater Registrations', value: stats.newTheaterRegistrations, icon: CalendarIcon, color: 'from-green-500 to-emerald-600', delay: 0.3, notification: false }
    ];

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8 p-6"
        >
            {/* Stats Grid - No view buttons on cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
                {dashboardCards.map((card, index) => (
                    <StatCard
                        key={index}
                        title={card.title}
                        value={card.value}
                        icon={card.icon}
                        color={card.color}
                        delay={card.delay}
                        notification={card.notification}
                        notificationCount={card.notificationCount}
                    />
                ))}
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart with Daily/Monthly/Yearly tabs */}
                <RevenueCard />

                {/* Theater Distribution */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Theater Distribution</h3>
                    </div>
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
                                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
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
                                    <span className="text-sm text-gray-600">{item.name}</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* User Growth & Theater Growth Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth Chart */}
                <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
                            <p className="text-sm text-gray-500">Monthly user growth trend</p>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={userGrowthData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                            <XAxis dataKey="month" stroke="#6B7280" />
                            <YAxis stroke="#6B7280" />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="users" stroke="#0D9488" strokeWidth={2} name="Total Users" />
                            <Line type="monotone" dataKey="newUsers" stroke="#F59E0B" strokeWidth={2} name="New Users" />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Theater Growth Chart */}
                <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Theater Growth</h3>
                            <p className="text-sm text-gray-500">Monthly theater growth trend</p>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={theaterGrowthData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                            <XAxis dataKey="month" stroke="#6B7280" />
                            <YAxis stroke="#6B7280" />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="theaters" stroke="#0D9488" strokeWidth={2} name="Total Theaters" />
                            <Line type="monotone" dataKey="newTheaters" stroke="#10B981" strokeWidth={2} name="New Theaters" />
                            <Line type="monotone" dataKey="pendingTheaters" stroke="#F59E0B" strokeWidth={2} name="Pending Theaters" />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Recent Activity - Limited to prevent bulky display */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                    {recentActivities.length > 3 && (
                        <button
                            onClick={() => setShowAllActivities(!showAllActivities)}
                            className="text-sm text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1"
                        >
                            {showAllActivities ? 'Show Less' : `View All (${recentActivities.length})`}
                            <ChevronDown className={`h-4 w-4 transition-transform ${showAllActivities ? 'rotate-180' : ''}`} />
                        </button>
                    )}
                </div>
                <div className="space-y-3">
                    {displayedActivities.map((activity, index) => (
                        <motion.div
                            key={activity.id}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${activity.status === 'success' ? 'bg-green-100' :
                                        activity.status === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                                    }`}>
                                    <activity.icon className={`h-5 w-5 ${activity.status === 'success' ? 'text-green-600' :
                                            activity.status === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                                        }`} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                                    <p className="text-xs text-gray-500">{activity.user}</p>
                                </div>
                            </div>
                            <span className="text-xs text-gray-500">{activity.time}</span>
                        </motion.div>
                    ))}
                </div>
                {!showAllActivities && recentActivities.length > 3 && (
                    <div className="mt-3 text-center">
                        <p className="text-xs text-gray-400">+{recentActivities.length - 3} more activities</p>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default AdminDashboard;