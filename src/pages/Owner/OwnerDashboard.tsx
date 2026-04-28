// src/pages/Owner/OwnerDashboard.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Building,
    DollarSign,
    Clock,
    Ticket,
    Calendar,
    MapPin,
    Activity,
    ArrowRight,
    TrendingUp,
    Users,
    Star,
    Eye,
    Edit,
    Crown,
    CheckCircle,
    RotateCcw,
    Film,
    Printer,
    Download,
    RefreshCw,
    Filter,
    UserCheck,
    Percent,
    Wallet,
    Banknote
} from 'lucide-react';
import {
    AreaChart, Area, PieChart as RePieChart, Pie,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, BarChart, Bar, LineChart, Line
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
}

interface DailyDataPoint {
    day: string;
    revenue: number;
    tickets: number;
}

interface WeeklyDataPoint {
    week: string;
    revenue: number;
    tickets: number;
}

interface YearlyDataPoint {
    year: string;
    revenue: number;
    tickets: number;
}

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

interface Stats {
    totalRevenue: number;
    todayRevenue: number;
    ticketsSold: number;
    ticketsToday: number;
    occupancyRate: number;
    activeShows: number;
    totalEmployees: number;
    activeEmployees: number;
    totalHalls: number;
    customerSatisfaction: number;
}

// Mock Data
const stats: Stats = {
    totalRevenue: 158750,
    todayRevenue: 3245,
    ticketsSold: 12580,
    ticketsToday: 156,
    occupancyRate: 78,
    activeShows: 8,
    totalEmployees: 15,
    activeEmployees: 12,
    totalHalls: 5,
    customerSatisfaction: 4.6
};

// Daily Revenue Data
const dailyData: DailyDataPoint[] = [
    { day: 'Mon', revenue: 3245, tickets: 156 },
    { day: 'Tue', revenue: 2890, tickets: 142 },
    { day: 'Wed', revenue: 3560, tickets: 178 },
    { day: 'Thu', revenue: 4120, tickets: 195 },
    { day: 'Fri', revenue: 5230, tickets: 245 },
    { day: 'Sat', revenue: 6780, tickets: 312 },
    { day: 'Sun', revenue: 5890, tickets: 278 },
];

// Weekly Revenue Data
const weeklyData: WeeklyDataPoint[] = [
    { week: 'Week 1', revenue: 24500, tickets: 1120 },
    { week: 'Week 2', revenue: 28700, tickets: 1340 },
    { week: 'Week 3', revenue: 31200, tickets: 1480 },
    { week: 'Week 4', revenue: 29800, tickets: 1410 },
];

// Yearly Revenue Data
const yearlyData: YearlyDataPoint[] = [
    { year: '2020', revenue: 385000, tickets: 18500 },
    { year: '2021', revenue: 412000, tickets: 19800 },
    { year: '2022', revenue: 398000, tickets: 19100 },
    { year: '2023', revenue: 452000, tickets: 21500 },
    { year: '2024', revenue: 485000, tickets: 23200 },
];

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

const employees: Employee[] = [
    { id: 1, name: 'John Smith', role: 'Manager', status: 'active', shift: 'Morning', performance: 95 },
    { id: 2, name: 'Sarah Johnson', role: 'Salesperson', status: 'active', shift: 'Evening', performance: 88 },
    { id: 3, name: 'Mike Wilson', role: 'Scanner', status: 'active', shift: 'Morning', performance: 92 },
    { id: 4, name: 'Emily Brown', role: 'Cleaner', status: 'active', shift: 'Night', performance: 85 },
    { id: 5, name: 'David Lee', role: 'Security', status: 'off', shift: 'Evening', performance: 90 },
];

const transactions: Transaction[] = [
    { id: '#TR-2024-001', customer: 'John Doe', amount: 90, tickets: 2, time: '5 min ago', status: 'completed' },
    { id: '#TR-2024-002', customer: 'Jane Smith', amount: 135, tickets: 3, time: '15 min ago', status: 'completed' },
    { id: '#TR-2024-003', customer: 'Bob Johnson', amount: 45, tickets: 1, time: '25 min ago', status: 'completed' },
    { id: '#TR-2024-004', customer: 'Alice Brown', amount: 180, tickets: 4, time: '35 min ago', status: 'completed' },
    { id: '#TR-2024-005', customer: 'Charlie Wilson', amount: 90, tickets: 2, time: '45 min ago', status: 'refunded' },
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
        if (title === "Today's Revenue") return '';
        if (title === 'Active Shows') return 'bg-yellow-500';
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

const OwnerDashboard: React.FC = () => {
    const [revenueView, setRevenueView] = useState<'daily' | 'weekly' | 'yearly'>('daily');

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'ETB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getCurrentRevenueData = () => {
        switch (revenueView) {
            case 'daily': return dailyData;
            case 'weekly': return weeklyData;
            case 'yearly': return yearlyData;
            default: return dailyData;
        }
    };

    const getXAxisKey = () => {
        switch (revenueView) {
            case 'daily': return 'day';
            case 'weekly': return 'week';
            case 'yearly': return 'year';
            default: return 'day';
        }
    };

    const getRevenueTitle = () => {
        switch (revenueView) {
            case 'daily': return 'Daily Revenue Trend';
            case 'weekly': return 'Weekly Revenue Trend';
            case 'yearly': return 'Yearly Revenue Trend';
            default: return 'Revenue Trend';
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'selling':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /> Selling</span>;
            case 'almost full':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3" /> Almost Full</span>;
            case 'sold out':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-100 text-red-700"><RotateCcw className="h-3 w-3" /> Sold Out</span>;
            default:
                return null;
        }
    };

    const getTransactionStatusBadge = (status: string) => {
        if (status === 'completed') {
            return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /> Completed</span>;
        }
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-100 text-red-700"><RotateCcw className="h-3 w-3" /> Refunded</span>;
    };

    // Dashboard Cards
    const dashboardCards = [
        { title: "Today's Revenue", value: formatCurrency(stats.todayRevenue), icon: DollarSign, color: "from-emerald-500 to-teal-600", delay: 0.1, link: "/owner/financial", notification: false },
        { title: "Tickets Today", value: stats.ticketsToday, icon: Ticket, color: "from-blue-500 to-cyan-600", delay: 0.15, link: "/owner/bookings", notification: true, notificationCount: stats.ticketsToday },
        { title: "Occupancy Rate", value: `${stats.occupancyRate}%`, icon: Activity, color: "from-purple-500 to-pink-600", delay: 0.2, link: "/owner/halls", notification: false },
        { title: "Active Shows", value: stats.activeShows, icon: Film, color: "from-orange-500 to-red-600", delay: 0.25, link: "/owner/events", notification: true, notificationCount: stats.activeShows },
        { title: "Total Revenue", value: formatCurrency(stats.totalRevenue), icon: TrendingUp, color: "from-green-500 to-emerald-600", delay: 0.3, link: "/owner/financial", notification: false }
    ];

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8 p-6"
        >
            {/* Stats Grid */}
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

            {/* Secondary Stats Row - Removed Avg Ticket Price */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Total Tickets Sold</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.ticketsSold.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Total Halls</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalHalls}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Satisfaction</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.customerSatisfaction}/5 ⭐</p>
                </div>
            </motion.div>

            {/* Revenue Overview Section with Daily, Weekly, Yearly Tabs */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
                        <p className="text-sm text-gray-500">{getRevenueTitle()}</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setRevenueView('daily')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${revenueView === 'daily' ? 'bg-teal-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            Daily
                        </button>
                        <button
                            onClick={() => setRevenueView('weekly')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${revenueView === 'weekly' ? 'bg-teal-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            Weekly
                        </button>
                        <button
                            onClick={() => setRevenueView('yearly')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${revenueView === 'yearly' ? 'bg-teal-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            Yearly
                        </button>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={getCurrentRevenueData()}>
                        <defs>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                        <XAxis dataKey={getXAxisKey()} stroke="#6B7280" />
                        <YAxis stroke="#6B7280" tickFormatter={(v) => formatCurrency(v)} />
                        <Tooltip formatter={(value: any) => formatCurrency(value)} />
                        <Area type="monotone" dataKey="revenue" stroke="#0D9488" strokeWidth={2} fill="url(#revenueGradient)" />
                    </AreaChart>
                </ResponsiveContainer>
            </motion.div>

            {/* Hall Occupancy */}
            <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Hall Occupancy</h3>
                    <Link to="/owner/halls" className="text-sm text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1">
                        Manage Halls <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
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
                            label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                        >
                            {hallData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => `${value}% occupancy`} />
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

            {/* Shows Performance Table */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Current Shows Performance</h3>
                    <Link to="/owner/events" className="text-sm text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1">
                        View All Shows <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
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
                            {showsData.map((show) => (
                                <tr key={show.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{show.name}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{show.date} at {show.time}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-900">{show.sales}/{show.capacity}</span>
                                            <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                                <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${(show.sales / show.capacity) * 100}%` }} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-sm font-semibold text-emerald-600">{formatCurrency(show.revenue)}</td>
                                    <td className="py-3 px-4">{getStatusBadge(show.status)}</td>
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Recent Activity & Staff on Duty */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                        <Link to="/owner/bookings" className="text-sm text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1">
                            View All <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {transactions.map((transaction) => (
                            <motion.div
                                key={transaction.id}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${transaction.status === 'completed' ? 'bg-green-100' : 'bg-red-100'}`}>
                                        {transaction.status === 'completed' ? <CheckCircle className="h-5 w-5 text-green-600" /> : <RotateCcw className="h-5 w-5 text-red-600" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{transaction.customer}</p>
                                        <p className="text-xs text-gray-500">{transaction.id} • {transaction.tickets} tickets</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(transaction.amount)}</p>
                                    <p className="text-xs text-gray-500">{transaction.time}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Staff on Duty */}
                <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Staff on Duty</h3>
                        <Link to="/owner/staff" className="text-sm text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1">
                            Manage Staff <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {employees.filter(e => e.status === 'active').map((employee) => (
                            <motion.div
                                key={employee.id}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center text-white font-bold">
                                        {employee.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                                        <p className="text-xs text-gray-500">{employee.role} • {employee.shift} Shift</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                        <span className="text-xs text-gray-600">{employee.performance}%</span>
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
                </motion.div>
            </div>
        </motion.div>
    );
};

export default OwnerDashboard;