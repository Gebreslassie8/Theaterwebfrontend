// Frontend/src/pages/sales/SalesDashboard.tsx
import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Users, Building, DollarSign, Activity, Calendar,
    Ticket, Star, AlertCircle, TrendingUp, Package,
    Clock, MapPin, BarChart3, PieChart, Settings,
    Bell, Zap, Award, Gift, Mail, Map,
    UserPlus, CheckCircle, XCircle, Eye, Edit,
    Download, Upload, Filter, Search, Coffee,
    ShoppingBag, Film, Music, Percent, RotateCcw,
    History, UserCheck, CreditCard, Printer,
    QrCode, Scan, Smartphone, Wallet, Receipt,
    ShoppingCart, Tag, Headphones, MessageSquare,
    ThumbsUp, ThumbsDown, Phone, MailIcon
} from 'lucide-react';
import {
    AreaChart, Area, BarChart, Bar, PieChart as RePieChart, Pie,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, LineChart, Line
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
    color: 'green' | 'blue' | 'purple' | 'red' | 'amber';
}

interface FooterActionButtonProps {
    icon: React.ElementType;
    text: string;
}

interface QuickStatBadgeProps {
    icon: React.ElementType;
    label: string;
    value: string | number;
    status?: 'online' | 'offline';
}

interface SalesData {
    hour: string;
    tickets: number;
    revenue: number;
    customers: number;
}

interface Show {
    id: number;
    name: string;
    time: string;
    hall: string;
    price: number;
    available: number;
    total: number;
    status: 'selling' | 'almost full' | 'sold out';
}

interface Transaction {
    id: string;
    customer: string;
    tickets: number;
    amount: number;
    payment: string;
    time: string;
    status: 'completed' | 'refunded';
}

interface PaymentMethod {
    name: string;
    value: number;
    color: string;
    icon: React.ElementType;
}

interface PopularShow {
    name: string;
    tickets: number;
    revenue: number;
    growth: string;
}

interface CustomerQueue {
    id: number;
    name: string;
    tickets: number;
    show: string;
    time: string;
    priority: 'normal' | 'high';
}

interface Stats {
    todaySales: number;
    weeklySales: number;
    monthlySales: number;
    todayTickets: number;
    weeklyTickets: number;
    monthlyTickets: number;
    todayCustomers: number;
    weeklyCustomers: number;
    monthlyCustomers: number;
    avgTicketPrice: number;
    pendingBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    refundedAmount: number;
    customerSatisfaction: number;
    topSellingShow: string;
    busiestHour: string;
    peakDay: string;
}

const SalesDashboard: React.FC = () => {
    const { user } = useOutletContext<OutletContext>();
    const [activeTab, setActiveTab] = useState<string>('overview');
    const [dateRange, setDateRange] = useState<string>('day');

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

    // Sales Statistics
    const stats: Stats = {
        todaySales: 3245,
        weeklySales: 18750,
        monthlySales: 75200,
        todayTickets: 156,
        weeklyTickets: 890,
        monthlyTickets: 3560,
        todayCustomers: 98,
        weeklyCustomers: 542,
        monthlyCustomers: 2150,
        avgTicketPrice: 45,
        pendingBookings: 8,
        completedBookings: 2345,
        cancelledBookings: 23,
        refundedAmount: 450,
        customerSatisfaction: 4.6,
        topSellingShow: "The Lion King",
        busiestHour: "7:00 PM",
        peakDay: "Saturday"
    };

    // Today's Sales Data
    const salesData: SalesData[] = [
        { hour: '10AM', tickets: 25, revenue: 1125, customers: 22 },
        { hour: '11AM', tickets: 19, revenue: 855, customers: 18 },
        { hour: '12PM', tickets: 28, revenue: 1260, customers: 26 },
        { hour: '1PM', tickets: 34, revenue: 1530, customers: 32 },
        { hour: '2PM', tickets: 31, revenue: 1395, customers: 29 },
        { hour: '3PM', tickets: 38, revenue: 1710, customers: 35 },
        { hour: '4PM', tickets: 45, revenue: 2025, customers: 42 },
        { hour: '5PM', tickets: 23, revenue: 1035, customers: 21 },
        { hour: '6PM', tickets: 48, revenue: 2160, customers: 45 },
        { hour: '7PM', tickets: 52, revenue: 2340, customers: 48 },
        { hour: '8PM', tickets: 41, revenue: 1845, customers: 38 },
    ];

    // Today's Shows/Events
    const showsData: Show[] = [
        { id: 1, name: 'The Lion King', time: '7:00 PM', hall: 'Hall A', price: 45, available: 32, total: 120, status: 'selling' },
        { id: 2, name: 'Hamilton', time: '8:30 PM', hall: 'Hall B', price: 65, available: 25, total: 120, status: 'selling' },
        { id: 3, name: 'Wicked', time: '6:00 PM', hall: 'Hall A', price: 55, available: 10, total: 120, status: 'almost full' },
        { id: 4, name: 'Phantom of Opera', time: '9:00 PM', hall: 'Hall C', price: 60, available: 45, total: 100, status: 'selling' },
        { id: 5, name: 'Chicago', time: '7:30 PM', hall: 'Hall B', price: 50, available: 0, total: 120, status: 'sold out' },
    ];

    // Recent Transactions
    const transactions: Transaction[] = [
        { id: '#TR-2024-001', customer: 'John Doe', tickets: 2, amount: 90, payment: 'Cash', time: '2 min ago', status: 'completed' },
        { id: '#TR-2024-002', customer: 'Jane Smith', tickets: 3, amount: 135, payment: 'Card', time: '5 min ago', status: 'completed' },
        { id: '#TR-2024-003', customer: 'Bob Johnson', tickets: 1, amount: 45, payment: 'Mobile', time: '8 min ago', status: 'completed' },
        { id: '#TR-2024-004', customer: 'Alice Brown', tickets: 4, amount: 180, payment: 'Cash', time: '12 min ago', status: 'completed' },
        { id: '#TR-2024-005', customer: 'Charlie Wilson', tickets: 2, amount: 90, payment: 'Card', time: '15 min ago', status: 'refunded' },
        { id: '#TR-2024-006', customer: 'Diana Prince', tickets: 3, amount: 135, payment: 'Mobile', time: '18 min ago', status: 'completed' },
    ];

    // Payment Methods Data
    const paymentMethods: PaymentMethod[] = [
        { name: 'Cash', value: 45, color: '#10B981', icon: DollarSign },
        { name: 'Credit Card', value: 35, color: '#3B82F6', icon: CreditCard },
        { name: 'Mobile Money', value: 20, color: '#8B5CF6', icon: Smartphone },
    ];

    // Popular Shows Data
    const popularShows: PopularShow[] = [
        { name: 'The Lion King', tickets: 245, revenue: 11025, growth: '+15%' },
        { name: 'Hamilton', tickets: 198, revenue: 12870, growth: '+12%' },
        { name: 'Wicked', tickets: 187, revenue: 10285, growth: '+8%' },
        { name: 'Phantom', tickets: 156, revenue: 9360, growth: '+5%' },
    ];

    // Customer Queue/Walk-ins
    const customerQueue: CustomerQueue[] = [
        { id: 1, name: 'Waiting Customer', tickets: 2, show: 'Hamilton', time: '5 min', priority: 'normal' },
        { id: 2, name: 'Waiting Customer', tickets: 4, show: 'Lion King', time: '8 min', priority: 'normal' },
        { id: 3, name: 'VIP Customer', tickets: 2, show: 'Wicked', time: '2 min', priority: 'high' },
        { id: 4, name: 'Waiting Customer', tickets: 1, show: 'Chicago', time: '10 min', priority: 'normal' },
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
                        <Ticket className="h-4 w-4" />
                        <span className="text-sm font-medium">🎫 Salesperson</span>
                    </motion.div>

                    <motion.h1
                        className="text-4xl font-bold mb-2"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        Welcome back, {user?.name || 'Salesperson'}!
                    </motion.h1>

                    <motion.p
                        className="text-white/80 text-lg max-w-2xl"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Process tickets and serve customers at the box office
                    </motion.p>

                    <motion.div
                        className="flex items-center gap-6 mt-6 flex-wrap"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <QuickStatBadge icon={Calendar} label="Date" value={new Date().toLocaleDateString()} />
                        <QuickStatBadge icon={Clock} label="Current Time" value={new Date().toLocaleTimeString()} />
                        <QuickStatBadge icon={Activity} label="Box Office" value="Open" status="online" />
                        <QuickStatBadge icon={Users} label="Today's Customers" value={stats.todayCustomers} />
                    </motion.div>
                </div>
            </motion.div>

            {/* Date Range Selector */}
            <motion.div variants={itemVariants} className="flex justify-between items-center">
                <div className="flex gap-2">
                    {['day', 'week', 'month'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setDateRange(range)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${dateRange === range
                                ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
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
                    title="Today's Sales"
                    value={`$${stats.todaySales}`}
                    icon={DollarSign}
                    change="+15.3%"
                    trend="up"
                    color="from-green-500 to-emerald-500"
                    delay={0.1}
                    dateRange={dateRange}
                />
                <StatCard
                    title="Tickets Sold"
                    value={stats.todayTickets}
                    icon={Ticket}
                    change="+23"
                    trend="up"
                    color="from-blue-500 to-cyan-500"
                    delay={0.2}
                    dateRange={dateRange}
                />
                <StatCard
                    title="Customers Served"
                    value={stats.todayCustomers}
                    icon={Users}
                    change="+12"
                    trend="up"
                    color="from-purple-500 to-pink-500"
                    delay={0.3}
                    dateRange={dateRange}
                />
                <StatCard
                    title="Avg. Ticket Price"
                    value={`$${stats.avgTicketPrice}`}
                    icon={Tag}
                    change="+$2"
                    trend="up"
                    color="from-amber-500 to-orange-500"
                    delay={0.4}
                    dateRange={dateRange}
                />
            </motion.div>

            {/* Secondary Stats Row */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Pending Bookings</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pendingBookings}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{stats.completedBookings}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Refunded</p>
                    <p className="text-2xl font-bold text-red-600">${stats.refundedAmount}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Satisfaction</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.customerSatisfaction}/5</p>
                </div>
            </motion.div>

            {/* Quick Actions Row */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickActionButton icon={Ticket} text="New Booking" color="green" />
                <QuickActionButton icon={Printer} text="Print Tickets" color="blue" />
                <QuickActionButton icon={CreditCard} text="Process Payment" color="purple" />
                <QuickActionButton icon={RotateCcw} text="Refund" color="red" />
            </motion.div>

            {/* Today's Shows & Sales Chart */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Today's Shows */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Today's Shows</h3>
                        <button className="text-sm text-green-500 hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Show</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Time/Hall</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Price</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Available</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {showsData.map((show) => (
                                    <tr key={show.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{show.name}</td>
                                        <td className="py-3 px-4">
                                            <div className="text-sm text-gray-600">{show.time}</div>
                                            <div className="text-xs text-gray-500">{show.hall}</div>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-900">${show.price}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-900">{show.available}</span>
                                                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                                    <div
                                                        className="bg-green-500 h-1.5 rounded-full"
                                                        style={{ width: `${((show.total - show.available) / show.total) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`text-xs px-2 py-1 rounded-full ${show.status === 'sold out' ? 'bg-red-100 text-red-700' :
                                                show.status === 'almost full' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-green-100 text-green-700'
                                                }`}>
                                                {show.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <button className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors">
                                                Sell
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sales Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Hourly Sales</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={salesData}>
                            <defs>
                                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="hour" stroke="#6B7280" />
                            <YAxis stroke="#6B7280" />
                            <Tooltip />
                            <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} fill="url(#salesGradient)" />
                        </AreaChart>
                    </ResponsiveContainer>
                    <div className="mt-4 text-center text-sm text-gray-500">
                        Peak hour: <span className="font-semibold text-green-600">{stats.busiestHour}</span>
                    </div>
                </div>
            </motion.div>

            {/* Recent Transactions & Payment Methods */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Transactions */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                        <button className="text-sm text-green-500 hover:underline">View All</button>
                    </div>
                    <div className="space-y-3">
                        {transactions.slice(0, 5).map((transaction, index) => (
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
                                            : <XCircle className="h-4 w-4 text-red-600" />
                                        }
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{transaction.customer}</p>
                                        <p className="text-xs text-gray-500">{transaction.id} • {transaction.tickets} tickets</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900">${transaction.amount}</p>
                                    <div className="flex items-center gap-2 justify-end">
                                        <span className="text-xs text-gray-500">{transaction.payment}</span>
                                        <span className="text-xs text-gray-400">{transaction.time}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <RePieChart>
                            <Pie
                                data={paymentMethods}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                label
                            >
                                {paymentMethods.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </RePieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                        {paymentMethods.map((method, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: method.color }} />
                                    <span className="text-sm text-gray-600">{method.name}</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900">{method.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Customer Queue & Popular Shows */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Queue */}
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Customer Queue</h3>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">{customerQueue.length} waiting</span>
                    </div>
                    <div className="space-y-3">
                        {customerQueue.map((customer, index) => (
                            <motion.div
                                key={customer.id}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className={`p-3 rounded-xl flex items-center justify-between ${customer.priority === 'high'
                                    ? 'bg-purple-50 border border-purple-200'
                                    : 'bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {customer.priority === 'high' && (
                                        <Award className="h-5 w-5 text-purple-500" />
                                    )}
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {customer.name}
                                            {customer.priority === 'high' && (
                                                <span className="ml-2 text-xs text-purple-500">VIP</span>
                                            )}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {customer.tickets} tickets for {customer.show}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-500">{customer.time}</span>
                                    <button className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600">
                                        Serve
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Popular Shows */}
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Shows</h3>
                    <div className="space-y-4">
                        {popularShows.map((show, index) => (
                            <motion.div
                                key={index}
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-4 bg-gray-50 rounded-xl"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold text-gray-900">{show.name}</h4>
                                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">{show.growth}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">{show.tickets} tickets</span>
                                    <span className="text-gray-900 font-medium">${show.revenue}</span>
                                </div>
                                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                        className="bg-green-500 h-1.5 rounded-full"
                                        style={{ width: `${(show.tickets / 250) * 100}%` }}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Quick Actions Footer */}
            <motion.div variants={itemVariants} className="grid grid-cols-4 md:grid-cols-8 gap-2">
                <FooterActionButton icon={Printer} text="Print" />
                <FooterActionButton icon={Receipt} text="Receipt" />
                <FooterActionButton icon={RotateCcw} text="Refund" />
                <FooterActionButton icon={Search} text="Find" />
                <FooterActionButton icon={UserCheck} text="Check In" />
                <FooterActionButton icon={Headphones} text="Support" />
                <FooterActionButton icon={BarChart3} text="Report" />
                <FooterActionButton icon={Settings} text="Settings" />
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
        green: 'from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600',
        blue: 'from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600',
        purple: 'from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
        red: 'from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600',
        amber: 'from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600'
    };

    return (
        <button
            className={`p-3 bg-gradient-to-r ${colors[color]} text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2`}
        >
            <Icon className="h-5 w-5" />
            <span className="text-sm hidden md:inline">{text}</span>
        </button>
    );
};

// Footer Action Button
const FooterActionButton: React.FC<FooterActionButtonProps> = ({ icon: Icon, text }) => (
    <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex flex-col items-center gap-1">
        <Icon className="h-4 w-4 text-gray-600" />
        <span className="text-xs text-gray-600">{text}</span>
    </button>
);

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

export default SalesDashboard;