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
    ArrowRight
} from 'lucide-react';
import {
    AreaChart, Area, PieChart as RePieChart, Pie,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, LineChart, Line
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

const recentActivities: Activity[] = [
    { id: 1, action: 'New theater registered', user: 'Grand Theater', time: '5 min ago', icon: Building, status: 'success' },
    { id: 2, action: 'Payment processed', user: 'City Cinema', time: '15 min ago', icon: DollarSign, status: 'success' },
    { id: 3, action: 'New user joined', user: 'John Doe', time: '2 hours ago', icon: Users, status: 'success' },
    { id: 4, action: 'Theater approval pending', user: 'Sunset Theater', time: '3 hours ago', icon: Building, status: 'warning' },
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

// Stat Card Component
const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, delay, link, notification, notificationCount }) => {
    const [isHovered, setIsHovered] = useState(false);

    const getNotificationColor = () => {
        if (title === 'Total Theaters') return '';
        if (title === 'Pending Theaters') return 'bg-yellow-500';
        return 'bg-teal-500';
    };

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

const AdminDashboard: React.FC = () => {
    const [user] = useState({ name: 'Administrator' });

    // Dashboard Cards Data - Removed notifications from New Users Today and New Theater Registrations
    const dashboardCards = [
        { title: 'Total Theaters', value: stats.totalTheaters, icon: Building, color: 'from-teal-500 to-teal-600', delay: 0.1, link: '/admin/theaters/theaters', notification: false },
        { title: 'Pending Theaters', value: stats.pendingTheaters, icon: Clock, color: 'from-yellow-500 to-orange-600', delay: 0.15, link: '/admin/theaters/theaters', notification: true, notificationCount: 3 },
        { title: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'from-blue-500 to-cyan-600', delay: 0.2, link: '/admin/users', notification: false },
        { title: 'New Users Today', value: stats.newUsersToday, icon: UserCheck, color: 'from-indigo-500 to-purple-600', delay: 0.25, link: '/admin/users?filter=new', notification: false, notificationCount: 0 },
        { title: 'New Theater Registrations', value: stats.newTheaterRegistrations, icon: CalendarIcon, color: 'from-green-500 to-emerald-600', delay: 0.3, link: '/admin/theaters/theaters', notification: false, notificationCount: 0 }
    ];

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8 p-6"
        >
            {/* Stats Grid - Only cards, no header */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
                {dashboardCards.map((card, index) => (
                    <StatCard
                        key={index}
                        title={card.title}
                        value={card.value}
                        icon={card.icon}
                        color={card.color}
                        delay={card.delay}
                        link={card.link}
                        notification={card.notification}
                        notificationCount={card.notificationCount}
                    />
                ))}
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
                            <p className="text-sm text-gray-500">Monthly revenue trend</p>
                        </div>
                        <Link to="/admin/financial/revenue" className="text-sm text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1">
                            View Details <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                            <XAxis dataKey="month" stroke="#6B7280" />
                            <YAxis stroke="#6B7280" />
                            <Tooltip formatter={(value: any) => `ETB ${value.toLocaleString()}`} />
                            <Area type="monotone" dataKey="revenue" stroke="#0D9488" strokeWidth={2} fill="url(#revenueGradient)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Theater Distribution */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Theater Distribution</h3>
                        <Link to="/admin/theaters" className="text-sm text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1">
                            View All <ArrowRight className="h-4 w-4" />
                        </Link>
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

            {/* User Growth Chart */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
                        <p className="text-sm text-gray-500">Monthly user growth trend</p>
                    </div>
                    <Link to="/admin/users" className="text-sm text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1">
                        View All Users <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={userGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                        <XAxis dataKey="month" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip />
                        <Line type="monotone" dataKey="users" stroke="#0D9488" strokeWidth={2} name="Total Users" />
                        <Line type="monotone" dataKey="newUsers" stroke="#F59E0B" strokeWidth={2} name="New Users" />
                    </LineChart>
                </ResponsiveContainer>
            </motion.div>

            {/* Recent Activity */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                    <Link to="/admin/activity-logs" className="text-sm text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1">
                        View All <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
                <div className="space-y-3">
                    {recentActivities.map((activity, index) => (
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
            </motion.div>
        </motion.div>
    );
};

export default AdminDashboard;