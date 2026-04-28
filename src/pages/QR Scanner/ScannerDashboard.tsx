// src/pages/scanner/ScannerDashboard.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    QrCode,
    Scan,
    CheckCircle,
    XCircle,
    Clock,
    AlertTriangle,
    DoorOpen,
    Battery,
    Wifi,
    Activity,
    Calendar,
    TrendingUp,
    ArrowRight,
    Users,
    Ticket,
    BarChart3,
    Download,
    Settings,
    HelpCircle,
    Eye,
    RefreshCw,
    ArrowUpRight,
    ArrowDownRight,
    Zap,
    Shield,
    Award,
    Star,
    Crown
} from 'lucide-react';
import {
    AreaChart, Area, PieChart as RePieChart, Pie,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, LineChart, Line, BarChart, Bar
} from 'recharts';
import { Link as RouterLink } from 'react-router-dom';

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
}

interface RecentScan {
    id: number;
    ticket: string;
    show: string;
    time: string;
    status: 'valid' | 'invalid' | 'duplicate';
    gate: string;
}

interface GateStatus {
    id: number;
    name: string;
    status: 'active' | 'standby' | 'offline';
    scannerId: string;
    battery: number;
    scans: number;
}

interface HourlyScanData {
    hour: string;
    scans: number;
    valid: number;
    invalid: number;
}

interface ScannerStats {
    scannedToday: number;
    scannedThisHour: number;
    totalScanned: number;
    validEntries: number;
    invalidTickets: number;
    duplicateAttempts: number;
    gateNumber: number;
    scannerBattery: number;
    avgScanTime: string;
    peakHour: string;
}

// Mock Data
const stats: ScannerStats = {
    scannedToday: 342,
    scannedThisHour: 45,
    totalScanned: 12580,
    validEntries: 338,
    invalidTickets: 4,
    duplicateAttempts: 2,
    gateNumber: 3,
    scannerBattery: 87,
    avgScanTime: '1.2s',
    peakHour: '7:00 PM'
};

const hourlyScanData: HourlyScanData[] = [
    { hour: '4PM', scans: 45, valid: 44, invalid: 1 },
    { hour: '5PM', scans: 52, valid: 51, invalid: 1 },
    { hour: '6PM', scans: 68, valid: 67, invalid: 1 },
    { hour: '7PM', scans: 89, valid: 88, invalid: 1 },
    { hour: '8PM', scans: 76, valid: 75, invalid: 1 },
    { hour: '9PM', scans: 12, valid: 12, invalid: 0 },
];

const gateStatus: GateStatus[] = [
    { id: 1, name: 'Gate A', status: 'active', scannerId: 'SCN-001', battery: 87, scans: 145 },
    { id: 2, name: 'Gate B', status: 'active', scannerId: 'SCN-002', battery: 92, scans: 98 },
    { id: 3, name: 'Gate C', status: 'active', scannerId: 'SCN-003', battery: 76, scans: 112 },
    { id: 4, name: 'Gate D', status: 'standby', scannerId: 'SCN-004', battery: 100, scans: 0 },
];

const recentScans: RecentScan[] = [
    { id: 1, ticket: 'TKT-2024-001', show: 'The Lion King', time: '2 min ago', status: 'valid', gate: 'Gate A' },
    { id: 2, ticket: 'TKT-2024-002', show: 'Hamilton', time: '3 min ago', status: 'valid', gate: 'Gate A' },
    { id: 3, ticket: 'TKT-2024-003', show: 'Wicked', time: '5 min ago', status: 'invalid', gate: 'Gate B' },
    { id: 4, ticket: 'TKT-2024-004', show: 'Phantom', time: '7 min ago', status: 'valid', gate: 'Gate A' },
    { id: 5, ticket: 'TKT-2024-005', show: 'Chicago', time: '8 min ago', status: 'valid', gate: 'Gate C' },
    { id: 6, ticket: 'TKT-2024-006', show: 'Lion King', time: '10 min ago', status: 'duplicate', gate: 'Gate A' },
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

// Stat Card Component - Same as Admin Dashboard
const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, delay, link, notification, notificationCount, change, trend }) => {
    const [isHovered, setIsHovered] = useState(false);

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
                            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-teal-500 text-white rounded-full animate-pulse">
                                {notificationCount}
                            </span>
                        )}
                    </div>
                    <p className="text-xl font-bold text-gray-900">{value}</p>
                    {change && (
                        <div className={`flex items-center gap-1 text-xs mt-0.5 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                            <span>{change}</span>
                        </div>
                    )}
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
                <RouterLink to={link} className="block">
                    <CardContent />
                </RouterLink>
            ) : (
                <CardContent />
            )}
        </motion.div>
    );
};

const ScannerDashboard: React.FC = () => {
    const [user] = useState({ name: 'Scanner Operator' });
    const [scanStatus, setScanStatus] = useState<'ready' | 'scanning' | 'paused'>('ready');

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'ETB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'valid':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /> Valid</span>;
            case 'invalid':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-100 text-red-700"><XCircle className="h-3 w-3" /> Invalid</span>;
            case 'duplicate':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700"><AlertTriangle className="h-3 w-3" /> Duplicate</span>;
            default:
                return null;
        }
    };

    const getGateStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /> Active</span>;
            case 'standby':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3" /> Standby</span>;
            default:
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-100 text-red-700"><XCircle className="h-3 w-3" /> Offline</span>;
        }
    };

    // Dashboard Cards
    const dashboardCards = [
        { title: "Scanned Today", value: stats.scannedToday, icon: Scan, color: "from-emerald-500 to-teal-600", delay: 0.1, change: `+${stats.scannedThisHour} this hour`, trend: 'up' as const },
        { title: "Valid Entries", value: stats.validEntries, icon: CheckCircle, color: "from-green-500 to-emerald-600", delay: 0.15, change: `${((stats.validEntries / stats.scannedToday) * 100).toFixed(1)}% rate`, trend: 'up' as const },
        { title: "Invalid Tickets", value: stats.invalidTickets, icon: XCircle, color: "from-red-500 to-pink-600", delay: 0.2, change: `${stats.duplicateAttempts} duplicates`, trend: 'down' as const },
        { title: "Avg. Scan Time", value: stats.avgScanTime, icon: Clock, color: "from-blue-500 to-cyan-600", delay: 0.25, change: `Peak: ${stats.peakHour}`, trend: 'up' as const },
        { title: "Scanner Battery", value: `${stats.scannerBattery}%`, icon: Battery, color: "from-purple-500 to-indigo-600", delay: 0.3, notification: stats.scannerBattery < 30, notificationCount: stats.scannerBattery }
    ];

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8 p-6 bg-gray-50 min-h-screen"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 shadow-lg">
                            <QrCode className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Scanner Dashboard</h1>
                            <p className="text-sm text-gray-500">Validate tickets and manage entry at the gates</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid - Admin Dashboard Style */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
                    {dashboardCards.map((card, index) => (
                        <StatCard
                            key={index}
                            title={card.title}
                            value={card.value}
                            icon={card.icon}
                            color={card.color}
                            delay={card.delay}
                            change={card.change}
                            trend={card.trend}
                            notification={card.notification}
                            notificationCount={card.notificationCount}
                        />
                    ))}
                </motion.div>

                {/* Live Scanner - Admin Dashboard Style Card */}
                <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Live Scanner</h3>
                            <p className="text-sm text-gray-500">Position QR code in frame to validate ticket</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setScanStatus('scanning')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${scanStatus === 'scanning' ? 'bg-teal-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                <Scan className="h-4 w-4 inline mr-1" /> Start
                            </button>
                            <button
                                onClick={() => setScanStatus('paused')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${scanStatus === 'paused' ? 'bg-teal-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                Pause
                            </button>
                        </div>
                    </div>
                    <div className="relative bg-gray-900 rounded-2xl p-8 aspect-video flex items-center justify-center overflow-hidden">
                        <motion.div
                            animate={{
                                scale: [1, 1.05, 1],
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-emerald-500/20"
                        />
                        <motion.div
                            animate={{
                                y: [-100, 100],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            className="absolute w-full h-0.5 bg-teal-500 shadow-lg shadow-teal-500/50"
                        />
                        <div className="relative z-10 text-center">
                            <Scan className="h-16 w-16 sm:h-24 sm:w-24 text-white/50 mx-auto mb-4 animate-pulse" />
                            <p className="text-white text-sm sm:text-lg font-medium">Position QR Code in frame</p>
                            <p className="text-white/60 text-xs sm:text-sm mt-2">
                                {scanStatus === 'ready' ? 'Ready to scan...' : scanStatus === 'scanning' ? 'Scanning...' : 'Paused'}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Charts Section - Admin Dashboard Style */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Hourly Scan Activity Chart */}
                    <motion.div
                        variants={itemVariants}
                        className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Hourly Scan Activity</h3>
                                <p className="text-sm text-gray-500">Scan volume by hour</p>
                            </div>
                            <RouterLink to="/scanner/reports" className="text-sm text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1">
                                View Details <ArrowRight className="h-4 w-4" />
                            </RouterLink>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={hourlyScanData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                                    <XAxis dataKey="hour" stroke="#6B7280" />
                                    <YAxis stroke="#6B7280" />
                                    <Tooltip />
                                    <Bar dataKey="valid" name="Valid Scans" fill="#22c55e" radius={[8, 8, 0, 0]} />
                                    <Bar dataKey="invalid" name="Invalid Scans" fill="#ef4444" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Gate Status Distribution */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Gate Status</h3>
                            <RouterLink to="/scanner/gates" className="text-sm text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1">
                                Manage Gates <ArrowRight className="h-4 w-4" />
                            </RouterLink>
                        </div>
                        <div className="space-y-3">
                            {gateStatus.map((gate, index) => (
                                <div key={gate.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center text-white font-bold">
                                            {gate.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{gate.name}</p>
                                            <p className="text-xs text-gray-500">{gate.scannerId}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {getGateStatusBadge(gate.status)}
                                        <div className="flex items-center gap-2 mt-1">
                                            <Battery className="h-3 w-3 text-gray-400" />
                                            <span className="text-xs text-gray-600">{gate.battery}%</span>
                                            <Scan className="h-3 w-3 text-gray-400 ml-1" />
                                            <span className="text-xs text-gray-600">{gate.scans}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Recent Scans Table - Admin Dashboard Style */}
                <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Scan className="h-5 w-5 text-teal-600" />
                                <h2 className="text-lg font-semibold text-gray-900">Recent Scans</h2>
                            </div>
                            <RouterLink to="/scanner/history" className="text-sm text-teal-600 hover:text-teal-700">View All</RouterLink>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ticket</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Show</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Gate</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentScans.map((scan) => (
                                    <tr key={scan.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{scan.ticket}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{scan.show}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{scan.gate}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{scan.time}</td>
                                        <td className="px-6 py-4">{getStatusBadge(scan.status)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Quick Actions - Admin Dashboard Style */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <RouterLink to="/scanner/manual-entry">
                        <button className="w-full py-3 px-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2">
                            <Scan className="h-4 w-4" />
                            Manual Entry
                        </button>
                    </RouterLink>
                    <RouterLink to="/scanner/settings">
                        <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2">
                            <Settings className="h-4 w-4" />
                            Scanner Settings
                        </button>
                    </RouterLink>
                    <RouterLink to="/scanner/reports">
                        <button className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            View Reports
                        </button>
                    </RouterLink>
                    <RouterLink to="/scanner/help">
                        <button className="w-full py-3 px-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2">
                            <HelpCircle className="h-4 w-4" />
                            Help Guide
                        </button>
                    </RouterLink>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default ScannerDashboard;