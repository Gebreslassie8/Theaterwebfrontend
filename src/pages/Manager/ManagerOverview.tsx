// src/pages/Manager/components/ManagerOverview.tsx
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
    Filter,
    TrendingUp,
    TrendingDown,
    Coffee,
    Wifi,
    Car,
    Music,
    Film,
    Heart,
    ThumbsUp,
    MessageCircle,
    Share2,
    Phone,
    Mail,
    Instagram,
    Facebook,
    Twitter,
    LayoutDashboard
} from 'lucide-react';
import {
    AreaChart, Area, PieChart as RePieChart, Pie,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, LineChart, Line, BarChart, Bar
} from 'recharts';

// Types
interface User {
    name: string;
    email: string;
    role: string;
    theaterId?: number;
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
    tickets: number;
    occupancy: number;
}

interface SeatDistributionDataPoint {
    name: string;
    value: number;
    color: string;
    revenue: number;
}

interface BookingTrendDataPoint {
    date: string;
    bookings: number;
    revenue: number;
}

interface ShowDataPoint {
    name: string;
    tickets: number;
    revenue: number;
    rating: number;
}

interface Activity {
    id: number;
    action: string;
    user: string;
    time: string;
    icon: React.ElementType;
    status: 'success' | 'warning' | 'info';
}

interface UpcomingShow {
    id: number;
    name: string;
    date: string;
    time: string;
    hall: string;
    bookedSeats: number;
    totalSeats: number;
    status: 'selling' | 'sold_out' | 'cancelled';
}

interface LowStockItem {
    id: number;
    name: string;
    current: number;
    min: number;
    status: 'Critical' | 'Low' | 'Good';
}

interface Stats {
    totalHalls: number;
    activeHalls: number;
    totalShows: number;
    upcomingShows: number;
    totalTicketsSold: number;
    totalRevenue: number;
    monthlyRevenue: number;
    averageOccupancy: number;
    customerSatisfaction: number;
    activePromotions: number;
    totalCustomers: number;
    newCustomersThisMonth: number;
    staffOnDuty: number;
}

// Mock Data for Manager
const stats: Stats = {
    totalHalls: 6,
    activeHalls: 5,
    totalShows: 48,
    upcomingShows: 12,
    totalTicketsSold: 15420,
    totalRevenue: 328500,
    monthlyRevenue: 78500,
    averageOccupancy: 72,
    customerSatisfaction: 4.6,
    activePromotions: 3,
    totalCustomers: 8450,
    newCustomersThisMonth: 342,
    staffOnDuty: 23
};

const revenueData: RevenueDataPoint[] = [
    { month: 'Jan', revenue: 45000, tickets: 1850, occupancy: 65 },
    { month: 'Feb', revenue: 52000, tickets: 2100, occupancy: 68 },
    { month: 'Mar', revenue: 48000, tickets: 1950, occupancy: 62 },
    { month: 'Apr', revenue: 61000, tickets: 2450, occupancy: 75 },
    { month: 'May', revenue: 55000, tickets: 2250, occupancy: 70 },
    { month: 'Jun', revenue: 78500, tickets: 3100, occupancy: 78 },
];

const seatDistribution: SeatDistributionDataPoint[] = [
    { name: 'Standard', value: 850, color: '#0D9488', revenue: 42500 },
    { name: 'Premium', value: 450, color: '#3B82F6', revenue: 45000 },
    { name: 'VIP', value: 200, color: '#8B5CF6', revenue: 30000 },
    { name: 'Wheelchair', value: 50, color: '#10B981', revenue: 3000 },
];

const bookingTrends: BookingTrendDataPoint[] = [
    { date: 'Mon', bookings: 245, revenue: 12250 },
    { date: 'Tue', bookings: 230, revenue: 11500 },
    { date: 'Wed', bookings: 260, revenue: 13000 },
    { date: 'Thu', bookings: 290, revenue: 14500 },
    { date: 'Fri', bookings: 420, revenue: 21000 },
    { date: 'Sat', bookings: 580, revenue: 29000 },
    { date: 'Sun', bookings: 510, revenue: 25500 },
];

const topShows: ShowDataPoint[] = [
    { name: 'Movie Premiere', tickets: 1250, revenue: 31250, rating: 4.8 },
    { name: 'Concert Night', tickets: 980, revenue: 39200, rating: 4.7 },
    { name: 'Comedy Show', tickets: 870, revenue: 21750, rating: 4.6 },
    { name: 'Drama Play', tickets: 650, revenue: 16250, rating: 4.5 },
];

const recentActivities: Activity[] = [
    { id: 1, action: 'New show scheduled', user: 'Movie Premiere', time: '10 min ago', icon: Film, status: 'success' },
    { id: 2, action: 'Ticket booking completed', user: 'John Doe', time: '25 min ago', icon: Ticket, status: 'success' },
    { id: 3, action: 'Hall maintenance scheduled', user: 'Hall C', time: '1 hour ago', icon: Building, status: 'warning' },
    { id: 4, action: 'New customer registered', user: 'Sarah Smith', time: '2 hours ago', icon: Users, status: 'success' },
    { id: 5, action: 'Promotion campaign started', user: 'Summer Sale', time: '3 hours ago', icon: TrendingUp, status: 'info' },
];

const upcomingShows: UpcomingShow[] = [
    { id: 1, name: 'Summer Music Festival', date: '2024-07-20', time: '7:00 PM', hall: 'Hall A', bookedSeats: 450, totalSeats: 500, status: 'selling' },
    { id: 2, name: 'Comedy Night', date: '2024-07-21', time: '8:00 PM', hall: 'Hall B', bookedSeats: 280, totalSeats: 300, status: 'selling' },
    { id: 3, name: 'Movie Marathon', date: '2024-07-22', time: '2:00 PM', hall: 'Hall A', bookedSeats: 500, totalSeats: 500, status: 'sold_out' },
    { id: 4, name: 'Jazz Evening', date: '2024-07-23', time: '7:30 PM', hall: 'Hall C', bookedSeats: 120, totalSeats: 200, status: 'selling' },
];

const lowStockItems: LowStockItem[] = [
    { id: 1, name: 'Popcorn (Large)', current: 45, min: 100, status: 'Critical' },
    { id: 2, name: 'Hot Dogs', current: 15, min: 50, status: 'Critical' },
    { id: 3, name: 'Nachos', current: 25, min: 50, status: 'Low' },
    { id: 4, name: 'Soda (Regular)', current: 180, min: 100, status: 'Good' },
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

const ManagerOverview: React.FC = () => {
    const { user } = useOutletContext<{ user: User }>();
    const [activeTab, setActiveTab] = useState<string>('overview');
    const [dateRange, setDateRange] = useState<string>('month');

    const theaterName = user?.theaterId === 1 ? 'Grand Theater' : 'Your Theater';

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8 p-6"
        >
            {/* Welcome Header */}
            

            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Today's Tickets Sold"
                    value="1,234"
                    icon={Ticket}
                    change="+12%"
                    trend="up"
                    color="from-blue-500 to-cyan-500"
                    delay={0.1}
                    dateRange={dateRange}
                />
                <StatCard
                    title="Total Revenue"
                    value={`$${(stats.totalRevenue / 1000).toFixed(1)}K`}
                    icon={DollarSign}
                    change="+8%"
                    trend="up"
                    color="from-green-500 to-emerald-500"
                    delay={0.2}
                    dateRange={dateRange}
                />
                <StatCard
                    title="Hall Occupancy"
                    value={`${stats.averageOccupancy}%`}
                    icon={LayoutDashboard}
                    change="+5%"
                    trend="up"
                    color="from-orange-500 to-red-500"
                    delay={0.3}
                    dateRange={dateRange}
                />
                <StatCard
                    title="Customer Satisfaction"
                    value={`${stats.customerSatisfaction}/5`}
                    icon={Star}
                    change="+0.2"
                    trend="up"
                    color="from-purple-500 to-pink-500"
                    delay={0.4}
                    dateRange={dateRange}
                />
            </motion.div>

            {/* Secondary Stats Row */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-dark-800 rounded-xl p-4 shadow border border-gray-200 dark:border-dark-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Active Halls</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeHalls}/{stats.totalHalls}</p>
                </div>
                <div className="bg-white dark:bg-dark-800 rounded-xl p-4 shadow border border-gray-200 dark:border-dark-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Upcoming Shows</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.upcomingShows}</p>
                </div>
                <div className="bg-white dark:bg-dark-800 rounded-xl p-4 shadow border border-gray-200 dark:border-dark-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Customers</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCustomers.toLocaleString()}</p>
                </div>
                <div className="bg-white dark:bg-dark-800 rounded-xl p-4 shadow border border-gray-200 dark:border-dark-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Active Promotions</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.activePromotions}</p>
                </div>
            </motion.div>

            {/* Charts Section */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue & Tickets Chart */}
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-2 bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-dark-700"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue & Tickets Overview</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Monthly performance metrics</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-lg text-sm">+18.5%</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="ticketsGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                            <XAxis dataKey="month" stroke="#6B7280" />
                            <YAxis yAxisId="left" stroke="#6B7280" />
                            <YAxis yAxisId="right" orientation="right" stroke="#6B7280" />
                            <Tooltip />
                            <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#0D9488" strokeWidth={2} fill="url(#revenueGradient)" name="Revenue ($)" />
                            <Area yAxisId="right" type="monotone" dataKey="tickets" stroke="#3B82F6" strokeWidth={2} fill="url(#ticketsGradient)" name="Tickets Sold" />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Seat Distribution */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-dark-700"
                >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Seat Distribution</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <RePieChart>
                            <Pie
                                data={seatDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                label
                            >
                                {seatDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </RePieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                        {seatDistribution.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                                </div>
                                <div className="flex gap-4">
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.value} seats</span>
                                    <span className="text-sm text-green-600">${(item.revenue / 1000).toFixed(1)}K</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>

            {/* Weekly Booking Trends */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-dark-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Booking Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={bookingTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                        <XAxis dataKey="date" stroke="#6B7280" />
                        <YAxis yAxisId="left" stroke="#6B7280" />
                        <YAxis yAxisId="right" orientation="right" stroke="#6B7280" />
                        <Tooltip />
                        <Bar yAxisId="left" dataKey="bookings" fill="#0D9488" name="Bookings" />
                        <Bar yAxisId="right" dataKey="revenue" fill="#F59E0B" name="Revenue ($)" />
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>

            {/* Top Shows and Upcoming Shows */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Performing Shows */}
                <div className="lg:col-span-2 bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-dark-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Performing Shows</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-dark-700">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Show Name</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Tickets Sold</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Rating</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topShows.map((show, index) => (
                                    <tr key={index} className="border-b border-gray-100 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                                        <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{show.name}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{show.tickets.toLocaleString()}</td>
                                        <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">${(show.revenue / 1000).toFixed(1)}K</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-1">
                                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                                <span className="text-sm text-gray-900 dark:text-white">{show.rating}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <button className="p-1 hover:bg-gray-100 dark:hover:bg-dark-600 rounded transition-colors">
                                                    <Eye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                                </button>
                                                <button className="p-1 hover:bg-gray-100 dark:hover:bg-dark-600 rounded transition-colors">
                                                    <Edit className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Upcoming Shows */}
                <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-dark-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Shows</h3>
                    <div className="space-y-3">
                        {upcomingShows.map((show) => (
                            <div key={show.id} className="p-3 bg-gray-50 dark:bg-dark-700 rounded-xl">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">{show.name}</h4>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                        show.status === 'selling'
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : show.status === 'sold_out'
                                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            : 'bg-gray-100 text-gray-700'
                                    }`}>
                                        {show.status === 'selling' ? 'Selling' : show.status === 'sold_out' ? 'Sold Out' : 'Cancelled'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">{show.date} at {show.time}</span>
                                    <span className="text-gray-600">{show.hall}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Booked: {show.bookedSeats}/{show.totalSeats}</span>
                                    <span className="text-teal-600 font-semibold">{Math.round((show.bookedSeats / show.totalSeats) * 100)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div
                                        className="bg-teal-600 h-2 rounded-full"
                                        style={{ width: `${(show.bookedSeats / show.totalSeats) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Low Stock Alerts and Recent Activity */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Low Stock Alerts */}
                <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-dark-700">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Low Stock Alerts</h3>
                        <button className="text-sm text-teal-600 hover:underline">Manage Inventory →</button>
                    </div>
                    <div className="space-y-3">
                        {lowStockItems.map((item) => (
                            <div key={item.id} className={`p-3 rounded-lg ${
                                item.status === 'Critical' ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' : 
                                item.status === 'Low' ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' : 
                                'bg-gray-50 dark:bg-dark-700'
                            }`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Current: {item.current} units</p>
                                    </div>
                                    {item.status !== 'Good' && (
                                        <button className={`px-3 py-1 rounded text-sm ${
                                            item.status === 'Critical' 
                                                ? 'bg-red-600 hover:bg-red-700' 
                                                : 'bg-yellow-600 hover:bg-yellow-700'
                                        } text-white transition`}>
                                            Restock
                                        </button>
                                    )}
                                    {item.status === 'Good' && (
                                        <span className="text-sm text-green-600">✓ Stock OK</span>
                                    )}
                                </div>
                                {item.status !== 'Good' && (
                                    <div className="mt-2">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className={`h-2 rounded-full ${
                                                    item.status === 'Critical' ? 'bg-red-500' : 'bg-yellow-500'
                                                }`}
                                                style={{ width: `${(item.current / item.min) * 100}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Minimum required: {item.min} units
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-dark-700">
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
                                    <div className={`p-2 rounded-lg ${
                                        activity.status === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
                                        activity.status === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                                        'bg-blue-100 dark:bg-blue-900/30'
                                    }`}>
                                        <activity.icon className={`h-5 w-5 ${
                                            activity.status === 'success' ? 'text-green-600' :
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
                </div>
            </motion.div>

            {/* Quick Actions Footer */}
            <motion.div variants={itemVariants} className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                        <h3 className="text-xl font-bold mb-2">Quick Actions</h3>
                        <p className="text-white/80">Manage your theater operations efficiently</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Create Event
                        </button>
                        <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Manage Staff
                        </button>
                        <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Update Inventory
                        </button>
                        <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            View Reports
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ManagerOverview;