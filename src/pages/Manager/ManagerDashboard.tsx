// Frontend/src/pages/manager/ManagerDashboard.tsx
import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Users,
    Building,
    DollarSign,
    Activity,
    Calendar,
    Ticket,
    Star,
    AlertCircle,
    TrendingUp,
    Package,
    Clock,
    MapPin,
    BarChart3,
    Settings,
    Bell,
    Award,
    CheckCircle,
    Eye,
    Edit,
    Download,
    Filter,
    ClipboardCheck,
    QrCode,
    Coffee
} from 'lucide-react';
import {
    BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer
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
    color: 'blue' | 'green' | 'purple' | 'red' | 'gray' | 'amber';
}

interface QuickStatBadgeProps {
    icon: React.ElementType;
    label: string;
    value: string | number;
    status?: 'online' | 'offline';
}

interface ScheduleItem {
    time: string;
    event: string;
    hall: string;
    status: 'completed' | 'in-progress' | 'upcoming';
    attendance: number;
    capacity: number;
}

interface InventoryItem {
    name: string;
    stock: number;
    threshold: number;
    unit: string;
    status: 'good' | 'warning' | 'low';
    icon: React.ElementType;
}

interface StaffMember {
    id: number;
    name: string;
    role: string;
    shift: string;
    status: 'active' | 'break' | 'off';
    performance: number;
}

interface HallStatus {
    name: string;
    currentShow: string;
    occupancy: number;
    capacity: number;
    status: 'in-use' | 'available' | 'cleaning' | 'maintenance';
    nextShow: string;
}

interface Issue {
    id: number;
    issue: string;
    hall: string;
    priority: 'high' | 'medium' | 'low';
    status: 'in-progress' | 'pending' | 'scheduled';
    time: string;
}

interface Stats {
    todayEvents: number;
    upcomingEvents: number;
    totalEvents: number;
    staffOnDuty: number;
    totalStaff: number;
    inventoryLevel: number;
    lowStockItems: number;
    activeIssues: number;
    resolvedIssues: number;
    occupancyRate: number;
    todayRevenue: number;
    weeklyRevenue: number;
    monthlyRevenue: number;
    ticketsSold: number;
    avgTicketPrice: number;
    customerSatisfaction: number;
    hallUtilization: number;
}

const ManagerDashboard: React.FC = () => {
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

    // Manager Statistics
    const stats: Stats = {
        todayEvents: 8,
        upcomingEvents: 12,
        totalEvents: 156,
        staffOnDuty: 15,
        totalStaff: 25,
        inventoryLevel: 85,
        lowStockItems: 3,
        activeIssues: 2,
        resolvedIssues: 45,
        occupancyRate: 78,
        todayRevenue: 3245,
        weeklyRevenue: 18750,
        monthlyRevenue: 75200,
        ticketsSold: 2345,
        avgTicketPrice: 42,
        customerSatisfaction: 4.6,
        hallUtilization: 82
    };

    // Today's Schedule Data
    const scheduleData: ScheduleItem[] = [
        { time: '10:00', event: 'Morning Show - Lion King', hall: 'Hall A', status: 'completed', attendance: 98, capacity: 120 },
        { time: '13:00', event: 'Matinee - Hamilton', hall: 'Hall B', status: 'completed', attendance: 95, capacity: 120 },
        { time: '16:00', event: 'Afternoon - Wicked', hall: 'Hall A', status: 'in-progress', attendance: 87, capacity: 120 },
        { time: '19:00', event: 'Evening - Phantom', hall: 'Hall C', status: 'upcoming', attendance: 0, capacity: 100 },
        { time: '21:30', event: 'Late Night - Chicago', hall: 'Hall B', status: 'upcoming', attendance: 0, capacity: 120 },
    ];

    // Inventory Data
    const inventoryData: InventoryItem[] = [
        { name: 'Popcorn', stock: 85, threshold: 50, unit: 'bags', status: 'good', icon: Coffee },
        { name: 'Soda', stock: 120, threshold: 60, unit: 'cups', status: 'good', icon: Coffee },
        { name: 'Nachos', stock: 45, threshold: 40, unit: 'boxes', status: 'warning', icon: Package },
        { name: 'Candy', stock: 200, threshold: 80, unit: 'packs', status: 'good', icon: Package },
        { name: 'Water', stock: 35, threshold: 50, unit: 'bottles', status: 'low', icon: Coffee },
        { name: 'Coffee', stock: 28, threshold: 30, unit: 'cups', status: 'low', icon: Coffee },
    ];

    // Staff on Duty
    const staffData: StaffMember[] = [
        { id: 1, name: 'John Smith', role: 'Ticket Seller', shift: 'Morning', status: 'active', performance: 95 },
        { id: 2, name: 'Sarah Johnson', role: 'Ticket Checker', shift: 'Morning', status: 'active', performance: 92 },
        { id: 3, name: 'Mike Wilson', role: 'Cleaner', shift: 'Morning', status: 'active', performance: 88 },
        { id: 4, name: 'Emily Brown', role: 'Concessions', shift: 'Afternoon', status: 'active', performance: 94 },
        { id: 5, name: 'David Lee', role: 'Security', shift: 'Afternoon', status: 'active', performance: 90 },
        { id: 6, name: 'Lisa Anderson', role: 'Ticket Seller', shift: 'Afternoon', status: 'break', performance: 91 },
    ];

    // Hall Status Data
    const hallData: HallStatus[] = [
        { name: 'Hall A', currentShow: 'Wicked', occupancy: 87, capacity: 120, status: 'in-use', nextShow: '19:00 - Phantom' },
        { name: 'Hall B', currentShow: 'None', occupancy: 0, capacity: 150, status: 'available', nextShow: '21:30 - Chicago' },
        { name: 'Hall C', currentShow: 'None', occupancy: 0, capacity: 100, status: 'cleaning', nextShow: '19:00 - Phantom' },
        { name: 'Hall D', currentShow: 'None', occupancy: 0, capacity: 80, status: 'maintenance', nextShow: 'Tomorrow' },
    ];

    // Issues Data
    const issuesData: Issue[] = [
        { id: 1, issue: 'Projector bulb replacement', hall: 'Hall A', priority: 'high', status: 'in-progress', time: '30 min' },
        { id: 2, issue: 'Seat repair - Row C', hall: 'Hall B', priority: 'medium', status: 'pending', time: '2 hours' },
        { id: 3, issue: 'AC not cooling', hall: 'Hall C', priority: 'high', status: 'in-progress', time: '1 hour' },
        { id: 4, issue: 'Cleaning required', hall: 'Hall D', priority: 'low', status: 'scheduled', time: '3 hours' },
    ];

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8"
        >
            {/* Welcome Header */}
            <motion.div
                variants={itemVariants}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 p-8 text-white"
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
                        <Users className="h-4 w-4" />
                        <span className="text-sm font-medium">👔 Theater Manager</span>
                    </motion.div>

                    <motion.h1
                        className="text-4xl font-bold mb-2"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        Welcome back, {user?.name || 'Manager'}!
                    </motion.h1>

                    <motion.p
                        className="text-white/80 text-lg max-w-2xl"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Keep operations running smoothly today
                    </motion.p>

                    <motion.div
                        className="flex items-center gap-6 mt-6 flex-wrap"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <QuickStatBadge icon={Calendar} label="Date" value={new Date().toLocaleDateString()} />
                        <QuickStatBadge icon={Clock} label="Current Time" value={new Date().toLocaleTimeString()} />
                        <QuickStatBadge icon={Activity} label="Theater Status" value="Operating" status="online" />
                        <QuickStatBadge icon={Users} label="Staff on Duty" value={`${stats.staffOnDuty}/${stats.totalStaff}`} />
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
                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
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
                    title="Today's Events"
                    value={stats.todayEvents}
                    icon={Calendar}
                    change="+3"
                    trend="up"
                    color="from-blue-500 to-cyan-500"
                    delay={0.1}
                    dateRange={dateRange}
                />
                <StatCard
                    title="Staff on Duty"
                    value={stats.staffOnDuty}
                    icon={Users}
                    change="+2"
                    trend="up"
                    color="from-green-500 to-emerald-500"
                    delay={0.2}
                    dateRange={dateRange}
                />
                <StatCard
                    title="Inventory Level"
                    value={`${stats.inventoryLevel}%`}
                    icon={Package}
                    change="-5%"
                    trend="down"
                    color="from-amber-500 to-orange-500"
                    delay={0.3}
                    dateRange={dateRange}
                />
                <StatCard
                    title="Active Issues"
                    value={stats.activeIssues}
                    icon={AlertCircle}
                    change="-2"
                    trend="down"
                    color="from-red-500 to-pink-500"
                    delay={0.4}
                    dateRange={dateRange}
                />
            </motion.div>

            {/* Today's Schedule */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
                    <button className="text-sm text-blue-500 hover:underline">View Full Schedule</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Time</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Event</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Hall</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Attendance</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scheduleData.map((item, index) => (
                                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{item.time}</td>
                                    <td className="py-3 px-4 text-sm text-gray-900">{item.event}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{item.hall}</td>
                                    <td className="py-3 px-4">
                                        {item.attendance > 0 ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-900">{item.attendance}/{item.capacity}</span>
                                                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                                    <div
                                                        className="bg-blue-500 h-1.5 rounded-full"
                                                        style={{ width: `${(item.attendance / item.capacity) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-400">Not started</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            item.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                            {item.status}
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

            {/* Hall Status & Quick Actions */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Hall Status */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Hall Status</h3>
                    <div className="space-y-4">
                        {hallData.map((hall, index) => (
                            <motion.div
                                key={index}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-4 bg-gray-50 rounded-xl"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${hall.status === 'in-use' ? 'bg-green-500 animate-pulse' :
                                            hall.status === 'available' ? 'bg-blue-500' :
                                                hall.status === 'cleaning' ? 'bg-yellow-500' :
                                                    'bg-red-500'
                                            }`} />
                                        <h4 className="font-semibold text-gray-900">{hall.name}</h4>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${hall.status === 'in-use' ? 'bg-green-100 text-green-700' :
                                        hall.status === 'available' ? 'bg-blue-100 text-blue-700' :
                                            hall.status === 'cleaning' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                        }`}>
                                        {hall.status}
                                    </span>
                                </div>
                                {hall.currentShow !== 'None' && (
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">Current: {hall.currentShow}</span>
                                        <span className="text-gray-600">Occupancy: {hall.occupancy}/{hall.capacity}</span>
                                    </div>
                                )}
                                <div className="text-sm text-gray-500">
                                    Next: {hall.nextShow}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                        <QuickActionButton icon={Calendar} text="Create Event" color="blue" />
                        <QuickActionButton icon={ClipboardCheck} text="Check Inventory" color="green" />
                        <QuickActionButton icon={Users} text="Manage Staff" color="purple" />
                        <QuickActionButton icon={AlertCircle} text="Report Issue" color="red" />
                        <QuickActionButton icon={QrCode} text="Scanner Setup" color="gray" />
                        <QuickActionButton icon={Download} text="Generate Report" color="amber" />
                    </div>
                </div>
            </motion.div>

            {/* Inventory & Issues */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Inventory Status */}
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Inventory Status</h3>
                        <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">{stats.lowStockItems} low stock</span>
                    </div>
                    <div className="space-y-4">
                        {inventoryData.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <item.icon className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600">{item.stock} {item.unit}</span>
                                        {item.stock <= item.threshold && (
                                            <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">Reorder</span>
                                        )}
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(item.stock / 200) * 100}%` }}
                                            transition={{ duration: 1, delay: index * 0.1 }}
                                            className={`h-2 rounded-full ${item.status === 'good' ? 'bg-green-500' :
                                                item.status === 'warning' ? 'bg-yellow-500' :
                                                    'bg-red-500'
                                                }`}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <button className="w-full mt-4 p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
                        Order Supplies
                    </button>
                </div>

                {/* Active Issues */}
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Active Issues</h3>
                        <button className="text-sm text-blue-500 hover:underline">View All</button>
                    </div>
                    <div className="space-y-3">
                        {issuesData.map((issue, index) => (
                            <motion.div
                                key={issue.id}
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-4 bg-gray-50 rounded-xl"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{issue.issue}</h4>
                                        <p className="text-xs text-gray-500 mt-1">{issue.hall}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${issue.priority === 'high' ? 'bg-red-100 text-red-700' :
                                        issue.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                        {issue.priority}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${issue.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                                            issue.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                            {issue.status}
                                        </span>
                                        <span className="text-xs text-gray-500">{issue.time} ago</span>
                                    </div>
                                    <button className="text-xs text-blue-500 hover:underline">Update</button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Staff on Duty */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Staff on Duty</h3>
                    <button className="text-sm text-blue-500 hover:underline">Manage Schedule</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {staffData.map((staff, index) => (
                        <motion.div
                            key={staff.id}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 bg-gray-50 rounded-xl flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                                    {staff.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{staff.name}</p>
                                    <p className="text-xs text-gray-500">{staff.role}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-gray-400">{staff.shift}</span>
                                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${staff.status === 'active' ? 'bg-green-100 text-green-700' :
                                            'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {staff.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                    <span className="text-xs font-medium">{staff.performance}%</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
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
        blue: 'from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600',
        green: 'from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600',
        purple: 'from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
        red: 'from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600',
        gray: 'from-gray-500 to-slate-500 hover:from-gray-600 hover:to-slate-600',
        amber: 'from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600'
    };

    return (
        <button
            className={`w-full p-3 bg-gradient-to-r ${colors[color]} text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2`}
        >
            <Icon className="h-5 w-5" />
            <span className="text-sm">{text}</span>
        </button>
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

export default ManagerDashboard;