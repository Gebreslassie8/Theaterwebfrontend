// Frontend/src/pages/scanner/ScannerDashboard.tsx
import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Users,
    Calendar,
    Ticket,
    CheckCircle,
    XCircle,
    Download,
    BarChart3,
    Settings,
    Scan,
    QrCode,
    DoorOpen,
    Battery,
    Clock,
    AlertTriangle,
    Wifi,
    Cpu,
    HardDrive,
    HelpCircle,
    Pause,
    RotateCcw,
    Activity
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
    status?: 'online' | 'warning' | 'offline';
}

interface StatusIndicatorProps {
    icon: React.ElementType;
    label: string;
    value: string | number;
    color: 'green' | 'yellow' | 'red' | 'blue' | 'gray';
}

interface RecentScan {
    id: number;
    ticket: string;
    show: string;
    time: string;
    status: 'valid' | 'invalid' | 'duplicate';
    gate: string;
    method: string;
    reason?: string;
}

interface GateStatus {
    id: number;
    name: string;
    status: 'active' | 'standby' | 'offline';
    scannerId: string;
    battery: number;
    scans: number;
    connection: 'online' | 'offline';
}

interface UpcomingShow {
    id: number;
    name: string;
    time: string;
    hall: string;
    capacity: number;
    sold: number;
    remaining: number;
    gate: string;
}

interface InvalidTicket {
    id: number;
    ticket: string;
    show: string;
    time: string;
    reason: string;
    action: string;
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
    expiredTickets: number;
    fraudAttempts: number;
    gateNumber: number;
    scannerBattery: number;
    scannerSignal: string;
    avgScanTime: string;
    peakHour: string;
    todayEvents: number;
    remainingTickets: number;
}

const ScannerDashboard: React.FC = () => {
    const { user } = useOutletContext<OutletContext>();
    const [scanMode, setScanMode] = useState<string>('continuous');
    const [scanStatus, setScanStatus] = useState<string>('ready');

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

    // Scanner Statistics
    const stats: ScannerStats = {
        scannedToday: 342,
        scannedThisHour: 45,
        totalScanned: 12580,
        validEntries: 338,
        invalidTickets: 4,
        duplicateAttempts: 2,
        expiredTickets: 1,
        fraudAttempts: 1,
        gateNumber: 3,
        scannerBattery: 87,
        scannerSignal: 'strong',
        avgScanTime: '1.2s',
        peakHour: '7:00 PM',
        todayEvents: 8,
        remainingTickets: 234
    };

    // Recent Scans Data
    const recentScans: RecentScan[] = [
        { id: 1, ticket: 'TKT-2024-001', show: 'The Lion King', time: '2 min ago', status: 'valid', gate: 'Gate A', method: 'QR' },
        { id: 2, ticket: 'TKT-2024-002', show: 'Hamilton', time: '3 min ago', status: 'valid', gate: 'Gate A', method: 'QR' },
        { id: 3, ticket: 'TKT-2024-003', show: 'Wicked', time: '5 min ago', status: 'invalid', gate: 'Gate B', method: 'QR', reason: 'Expired' },
        { id: 4, ticket: 'TKT-2024-004', show: 'Phantom', time: '7 min ago', status: 'valid', gate: 'Gate A', method: 'Manual' },
        { id: 5, ticket: 'TKT-2024-005', show: 'Chicago', time: '8 min ago', status: 'valid', gate: 'Gate C', method: 'QR' },
        { id: 6, ticket: 'TKT-2024-006', show: 'Lion King', time: '10 min ago', status: 'duplicate', gate: 'Gate A', method: 'QR', reason: 'Already used' },
        { id: 7, ticket: 'TKT-2024-007', show: 'Hamilton', time: '12 min ago', status: 'valid', gate: 'Gate B', method: 'QR' },
        { id: 8, ticket: 'TKT-2024-008', show: 'Wicked', time: '15 min ago', status: 'valid', gate: 'Gate C', method: 'QR' },
    ];

    // Upcoming Shows Today
    const upcomingShows: UpcomingShow[] = [
        { id: 1, name: 'The Lion King', time: '7:00 PM', hall: 'Hall A', capacity: 120, sold: 112, remaining: 8, gate: 'A' },
        { id: 2, name: 'Hamilton', time: '8:30 PM', hall: 'Hall B', capacity: 120, sold: 98, remaining: 22, gate: 'B' },
        { id: 3, name: 'Wicked', time: '6:00 PM', hall: 'Hall A', capacity: 120, sold: 110, remaining: 10, gate: 'A' },
        { id: 4, name: 'Phantom', time: '9:00 PM', hall: 'Hall C', capacity: 100, sold: 67, remaining: 33, gate: 'C' },
    ];

    // Invalid Tickets Details
    const invalidTickets: InvalidTicket[] = [
        { id: 1, ticket: 'TKT-2024-003', show: 'Wicked', time: '5 min ago', reason: 'Expired', action: 'Rejected' },
        { id: 2, ticket: 'TKT-2024-006', show: 'Lion King', time: '10 min ago', reason: 'Already used', action: 'Flagged' },
        { id: 3, ticket: 'TKT-2024-009', show: 'Hamilton', time: '25 min ago', reason: 'Fraudulent', action: 'Reported' },
        { id: 4, ticket: 'TKT-2024-012', show: 'Chicago', time: '35 min ago', reason: 'Wrong show', action: 'Redirected' },
    ];

    // Gate Status
    const gateStatus: GateStatus[] = [
        { id: 1, name: 'Gate A', status: 'active', scannerId: 'SCN-001', battery: 87, scans: 145, connection: 'online' },
        { id: 2, name: 'Gate B', status: 'active', scannerId: 'SCN-002', battery: 92, scans: 98, connection: 'online' },
        { id: 3, name: 'Gate C', status: 'active', scannerId: 'SCN-003', battery: 76, scans: 112, connection: 'online' },
        { id: 4, name: 'Gate D', status: 'standby', scannerId: 'SCN-004', battery: 100, scans: 0, connection: 'offline' },
    ];

    // Hourly Scan Data
    const hourlyScanData: HourlyScanData[] = [
        { hour: '4PM', scans: 45, valid: 44, invalid: 1 },
        { hour: '5PM', scans: 52, valid: 51, invalid: 1 },
        { hour: '6PM', scans: 68, valid: 67, invalid: 1 },
        { hour: '7PM', scans: 89, valid: 88, invalid: 1 },
        { hour: '8PM', scans: 76, valid: 75, invalid: 1 },
        { hour: '9PM', scans: 12, valid: 12, invalid: 0 },
    ];

    return (
        <div className="lg:ml-2 space-y-8">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8"
            >
                {/* Welcome Header */}
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-2 bg-gradient-to-br from-deepTeal to-deepBlue rounded-2xl p-6 text-white shadow-xl"
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
                            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-xl rounded-full mb-3 sm:mb-4"
                        >
                            <QrCode className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="text-xs sm:text-sm font-medium">📱 QR Scanner Operator</span>
                        </motion.div>

                        <motion.h1
                            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            Welcome back, {user?.name || 'Scanner Operator'}!
                        </motion.h1>

                        <motion.p
                            className="text-white/80 text-base sm:text-lg max-w-2xl"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            Validate tickets and manage entry at the gates
                        </motion.p>

                        <motion.div
                            className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 sm:mt-6"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <QuickStatBadge icon={Calendar} label="Date" value={new Date().toLocaleDateString()} />
                            <QuickStatBadge icon={Clock} label="Current Time" value={new Date().toLocaleTimeString()} />
                            <QuickStatBadge icon={DoorOpen} label="Assigned Gate" value={`Gate ${stats.gateNumber}`} />
                            <QuickStatBadge icon={Battery} label="Scanner Battery" value={`${stats.scannerBattery}%`} status={stats.scannerBattery > 20 ? 'online' : 'warning'} />
                        </motion.div>
                    </div>
                </motion.div>

                {/* Scanner Controls */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Live Scanner Preview */}
                    <div className="lg:col-span-2 bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Live Scanner</h3>
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${scanStatus === 'ready' ? 'bg-green-100 text-green-600' :
                                    scanStatus === 'scanning' ? 'bg-blue-100 text-blue-600 animate-pulse' :
                                        'bg-yellow-100 text-yellow-600'
                                    }`}>
                                    {scanStatus === 'ready' ? 'Ready' : scanStatus === 'scanning' ? 'Scanning...' : 'Paused'}
                                </span>
                            </div>
                        </div>
                        <div className="relative bg-gray-900 rounded-2xl p-8 aspect-video flex items-center justify-center overflow-hidden">
                            {/* Scanner Animation */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20"
                            />

                            {/* Scanner Line */}
                            <motion.div
                                animate={{
                                    y: [-100, 100],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                className="absolute w-full h-1 bg-green-500 shadow-lg shadow-green-500/50"
                            />

                            {/* Center Icon */}
                            <div className="relative z-10 text-center">
                                <Scan className="h-16 w-16 sm:h-24 sm:w-24 text-white/50 mx-auto mb-4" />
                                <p className="text-white text-sm sm:text-lg font-medium">Position QR Code in frame</p>
                                <p className="text-white/60 text-xs sm:text-sm mt-2">Waiting for scan...</p>
                            </div>
                        </div>

                        {/* Scanner Controls */}
                        <div className="grid grid-cols-3 gap-3 mt-4">
                            <button
                                onClick={() => setScanStatus('scanning')}
                                className="p-2 sm:p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm"
                            >
                                <Scan className="h-4 w-4 sm:h-5 sm:w-5" />
                                <span>Start</span>
                            </button>
                            <button
                                onClick={() => setScanStatus('paused')}
                                className="p-2 sm:p-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm"
                            >
                                <Pause className="h-4 w-4 sm:h-5 sm:w-5" />
                                <span>Pause</span>
                            </button>
                            <button
                                onClick={() => setScanStatus('ready')}
                                className="p-2 sm:p-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm"
                            >
                                <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
                                <span>Reset</span>
                            </button>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="lg:col-span-2 grid grid-cols-2 gap-4 sm:gap-6">
                        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-xs sm:text-sm text-gray-500">Scanned Today</p>
                                <Scan className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                            </div>
                            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{stats.scannedToday}</p>
                            <p className="text-xs sm:text-sm text-green-500 mt-2">+{stats.scannedThisHour} this hour</p>
                        </div>

                        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-xs sm:text-sm text-gray-500">Valid Entries</p>
                                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                            </div>
                            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-500">{stats.validEntries}</p>
                            <p className="text-xs sm:text-sm text-gray-500 mt-2">{((stats.validEntries / stats.scannedToday) * 100).toFixed(1)}% success rate</p>
                        </div>

                        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-xs sm:text-sm text-gray-500">Invalid Tickets</p>
                                <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                            </div>
                            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-500">{stats.invalidTickets}</p>
                            <div className="text-[10px] sm:text-xs text-gray-500 mt-2">
                                <span className="text-yellow-600">{stats.duplicateAttempts} duplicate</span> ·
                                <span className="text-orange-600"> {stats.expiredTickets} expired</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-xs sm:text-sm text-gray-500">Avg. Scan Time</p>
                                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                            </div>
                            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{stats.avgScanTime}</p>
                            <p className="text-xs sm:text-sm text-gray-500 mt-2">Peak: {stats.peakHour}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Recent Scans & Gate Status */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Scans */}
                    <div className="lg:col-span-2 bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Scans</h3>
                            <button className="text-xs sm:text-sm text-gray-500 hover:underline">View All</button>
                        </div>
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                            {recentScans.map((scan, index) => (
                                <motion.div
                                    key={scan.id}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`flex flex-wrap items-center justify-between p-3 rounded-xl gap-2 ${scan.status === 'valid' ? 'bg-green-50' :
                                        scan.status === 'invalid' ? 'bg-red-50' :
                                            'bg-yellow-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1.5 sm:p-2 rounded-lg ${scan.status === 'valid' ? 'bg-green-100' :
                                            scan.status === 'invalid' ? 'bg-red-100' :
                                                'bg-yellow-100'
                                            }`}>
                                            {scan.status === 'valid' ? (
                                                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                                            ) : scan.status === 'invalid' ? (
                                                <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                                            ) : (
                                                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs sm:text-sm font-medium text-gray-900">{scan.ticket}</p>
                                                <span className="text-[10px] sm:text-xs text-gray-500">{scan.gate}</span>
                                            </div>
                                            <p className="text-[10px] sm:text-xs text-gray-500">{scan.show} • {scan.method}</p>
                                            {scan.reason && (
                                                <p className="text-[10px] sm:text-xs text-red-500 mt-1">{scan.reason}</p>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-[10px] sm:text-xs text-gray-500">{scan.time}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Gate Status */}
                    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-200">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Gate Status</h3>
                        <div className="space-y-4">
                            {gateStatus.map((gate, index) => (
                                <motion.div
                                    key={gate.id}
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-3 sm:p-4 bg-gray-50 rounded-xl"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${gate.status === 'active' ? 'bg-green-500 animate-pulse' :
                                                gate.status === 'standby' ? 'bg-yellow-500' :
                                                    'bg-red-500'
                                                }`} />
                                            <h4 className="text-sm sm:text-base font-semibold text-gray-900">{gate.name}</h4>
                                        </div>
                                        <span className="text-[10px] sm:text-xs text-gray-500">{gate.scannerId}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-[10px] sm:text-xs">
                                        <div>
                                            <p className="text-gray-500">Battery</p>
                                            <p className="font-medium text-gray-900">{gate.battery}%</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Scans</p>
                                            <p className="font-medium text-gray-900">{gate.scans}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Connection</p>
                                            <p className={`font-medium ${gate.connection === 'online' ? 'text-green-500' : 'text-red-500'
                                                }`}>
                                                {gate.connection}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Upcoming Shows & Invalid Tickets */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Upcoming Shows */}
                    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Upcoming Shows - Today</h3>
                            <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full">{stats.todayEvents} shows</span>
                        </div>
                        <div className="space-y-3">
                            {upcomingShows.map((show, index) => (
                                <motion.div
                                    key={show.id}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-3 sm:p-4 bg-gray-50 rounded-xl"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <h4 className="text-sm sm:text-base font-semibold text-gray-900">{show.name}</h4>
                                            <p className="text-[10px] sm:text-xs text-gray-500">{show.time} • {show.hall}</p>
                                        </div>
                                        <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-blue-500/10 text-blue-600 rounded-full">
                                            Gate {show.gate}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs sm:text-sm">
                                        <span className="text-gray-600">Sold: {show.sold}/{show.capacity}</span>
                                        <span className="text-green-600 font-medium">{show.remaining} remaining</span>
                                    </div>
                                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                                        <div
                                            className="bg-green-500 h-1.5 rounded-full"
                                            style={{ width: `${(show.sold / show.capacity) * 100}%` }}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Invalid Tickets */}
                    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Invalid Tickets</h3>
                            <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-red-100 text-red-600 rounded-full">{stats.invalidTickets} issues</span>
                        </div>
                        <div className="space-y-3">
                            {invalidTickets.map((ticket, index) => (
                                <motion.div
                                    key={ticket.id}
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-3 sm:p-4 bg-red-50 rounded-xl border border-red-200"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                                                <span className="text-xs sm:text-sm font-medium text-gray-900">{ticket.ticket}</span>
                                            </div>
                                            <p className="text-[10px] sm:text-xs text-gray-600 mt-1">{ticket.show} • {ticket.time}</p>
                                            <p className="text-[10px] sm:text-xs text-red-600 mt-2">Reason: {ticket.reason}</p>
                                        </div>
                                        <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-red-200 text-red-700 rounded-full">
                                            {ticket.action}
                                        </span>
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                        <button className="flex-1 px-2 sm:px-3 py-1 bg-yellow-500 text-white text-[10px] sm:text-xs rounded-lg hover:bg-yellow-600">
                                            Report
                                        </button>
                                        <button className="flex-1 px-2 sm:px-3 py-1 bg-gray-500 text-white text-[10px] sm:text-xs rounded-lg hover:bg-gray-600">
                                            Ignore
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Hourly Scan Chart & Quick Actions */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Hourly Scan Chart */}
                    <div className="lg:col-span-2 bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-200">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Hourly Scan Activity</h3>
                        <div className="h-[200px] sm:h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={hourlyScanData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis dataKey="hour" stroke="#6B7280" tick={{ fontSize: 10 }} />
                                    <YAxis stroke="#6B7280" tick={{ fontSize: 10 }} />
                                    <Tooltip />
                                    <Bar dataKey="valid" stackId="a" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="invalid" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-200">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                            <QuickActionButton icon={Scan} text="Manual Entry" color="blue" />
                            <QuickActionButton icon={DoorOpen} text="Switch Gate" color="purple" />
                            <QuickActionButton icon={Settings} text="Scanner Settings" color="gray" />
                            <QuickActionButton icon={BarChart3} text="View Reports" color="green" />
                            <QuickActionButton icon={Download} text="Export Logs" color="amber" />
                            <QuickActionButton icon={HelpCircle} text="Help" color="red" />
                        </div>
                    </div>
                </motion.div>

                {/* Footer Status */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <StatusIndicator icon={Wifi} label="Connection" value="Strong" color="green" />
                    <StatusIndicator icon={Battery} label="Battery" value={`${stats.scannerBattery}%`} color={stats.scannerBattery > 50 ? 'green' : stats.scannerBattery > 20 ? 'yellow' : 'red'} />
                    <StatusIndicator icon={Activity} label="Scanner Model" value="QR-3000X" color="blue" />
                    <StatusIndicator icon={HardDrive} label="Storage" value="45% used" color="gray" />
                </motion.div>
            </motion.div>
        </div>
    );
};

// Quick Action Button
const QuickActionButton: React.FC<QuickActionButtonProps> = ({ icon: Icon, text, color }) => {
    const colors = {
        blue: 'from-blue-500 to-cyan-600 hover:from-cyan-600 hover:to-blue-500',
        green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-500',
        purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-500',
        red: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-500',
        gray: 'from-gray-500 to-slate-500 hover:from-gray-600 hover:to-slate-600',
        amber: 'from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-500'
    };

    return (
        <button
            className={`p-2 sm:p-3 bg-gradient-to-r ${colors[color]} text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-xs sm:text-sm`}
        >
            <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{text}</span>
        </button>
    );
};

// Status Indicator
const StatusIndicator: React.FC<StatusIndicatorProps> = ({ icon: Icon, label, value, color }) => {
    const colors = {
        green: 'text-green-500',
        yellow: 'text-yellow-500',
        red: 'text-red-500',
        blue: 'text-blue-500',
        gray: 'text-gray-600'
    };

    return (
        <div className="bg-white rounded-xl p-2 sm:p-3 shadow border border-gray-200 flex items-center gap-2 sm:gap-3">
            <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${colors[color]}`} />
            <div>
                <p className="text-[10px] sm:text-xs text-gray-500">{label}</p>
                <p className={`text-xs sm:text-sm font-semibold ${colors[color]}`}>{value}</p>
            </div>
        </div>
    );
};

// Quick Stat Badge Component
const QuickStatBadge: React.FC<QuickStatBadgeProps> = ({ icon: Icon, label, value, status }) => (
    <div className="flex items-center gap-1 sm:gap-2 text-white/90 bg-white/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg backdrop-blur-sm">
        <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="text-xs sm:text-sm">{label}:</span>
        <span className="text-xs sm:text-sm font-semibold flex items-center gap-1">
            {value}
            {status === 'online' && (
                <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-500"></span>
                </span>
            )}
            {status === 'warning' && (
                <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-yellow-500"></span>
                </span>
            )}
        </span>
    </div>
);

export default ScannerDashboard;