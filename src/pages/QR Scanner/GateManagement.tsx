// src/pages/scanner/GateManagement.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    DoorOpen,
    Settings,
    Activity,
    Wifi,
    Battery,
    Zap,
    Shield,
    CheckCircle,
    XCircle,
    Clock,
    AlertTriangle,
    Users,
    Scan,
    Calendar,
    TrendingUp,
    TrendingDown,
    Download,
    Printer,
    RefreshCw,
    Eye,
    Edit,
    Plus,
    Trash2,
    Search,
    Filter,
    Info,
    MapPin,
    UserCheck,
    UserX,
    AlertCircle,
    Power,
    PowerOff,
    Thermometer,
    Droplet,
    Wind,
    Signal,
    HardDrive,
    Cpu,
    Memory,
    Server,
    Database,
    Cloud,
    Lock,
    Unlock,
    Key,
    Fingerprint,
    Smartphone,
    CreditCard,
    DollarSign,
    BarChart3,
    PieChart,
    LineChart,
    Award,
    Crown,
    Star,
    Target,
    Percent
} from 'lucide-react';
import ReusableButton from '../../components/Reusable/ReusableButton';
import ReusableTable from '../../components/Reusable/ReusableTable';
import SuccessPopup from '../../components/Reusable/SuccessPopup';

// Types
interface Gate {
    id: string;
    name: string;
    scannerId: string;
    status: 'active' | 'standby' | 'offline' | 'maintenance';
    battery: number;
    signal: number;
    temperature: number;
    uptime: string;
    lastScan: string;
    scansToday: number;
    totalScans: number;
    location: string;
    assignedScanner: string;
    assignedScannerName: string;
    assignedAt: string;
    firmware: string;
    ipAddress: string;
    macAddress: string;
}

interface GateLog {
    id: string;
    gateId: string;
    gateName: string;
    action: 'assigned' | 'unassigned' | 'activated' | 'deactivated' | 'maintenance' | 'error' | 'scan';
    description: string;
    timestamp: string;
    performedBy: string;
    details?: string;
}

// Mock Data
const mockGates: Gate[] = [
    {
        id: '1',
        name: 'Gate A',
        scannerId: 'SCN-001',
        status: 'active',
        battery: 87,
        signal: 92,
        temperature: 42,
        uptime: '5d 8h 23m',
        lastScan: '2024-04-28T19:45:00',
        scansToday: 145,
        totalScans: 4580,
        location: 'Main Entrance - North',
        assignedScanner: 'SCN-001',
        assignedScannerName: 'John Smith',
        assignedAt: '2024-04-28T09:00:00',
        firmware: 'v2.1.0',
        ipAddress: '192.168.1.101',
        macAddress: '00:1A:2B:3C:4D:5E'
    },
    {
        id: '2',
        name: 'Gate B',
        scannerId: 'SCN-002',
        status: 'active',
        battery: 92,
        signal: 88,
        temperature: 41,
        uptime: '3d 2h 15m',
        lastScan: '2024-04-28T19:30:00',
        scansToday: 98,
        totalScans: 3240,
        location: 'East Entrance',
        assignedScanner: 'SCN-002',
        assignedScannerName: 'Sarah Johnson',
        assignedAt: '2024-04-28T09:00:00',
        firmware: 'v2.1.0',
        ipAddress: '192.168.1.102',
        macAddress: '00:1A:2B:3C:4D:5F'
    },
    {
        id: '3',
        name: 'Gate C',
        scannerId: 'SCN-003',
        status: 'standby',
        battery: 76,
        signal: 45,
        temperature: 38,
        uptime: '1d 14h 30m',
        lastScan: '2024-04-28T18:15:00',
        scansToday: 112,
        totalScans: 2890,
        location: 'West Entrance',
        assignedScanner: 'SCN-003',
        assignedScannerName: 'Michael Chen',
        assignedAt: '2024-04-28T09:00:00',
        firmware: 'v2.0.9',
        ipAddress: '192.168.1.103',
        macAddress: '00:1A:2B:3C:4D:60'
    },
    {
        id: '4',
        name: 'Gate D',
        scannerId: 'SCN-004',
        status: 'offline',
        battery: 23,
        signal: 0,
        temperature: 35,
        uptime: '0h',
        lastScan: '2024-04-28T14:00:00',
        scansToday: 45,
        totalScans: 1250,
        location: 'South Entrance',
        assignedScanner: 'SCN-004',
        assignedScannerName: 'Emily Davis',
        assignedAt: '2024-04-28T09:00:00',
        firmware: 'v2.0.8',
        ipAddress: '192.168.1.104',
        macAddress: '00:1A:2B:3C:4D:61'
    }
];

const mockGateLogs: GateLog[] = [
    { id: '1', gateId: '1', gateName: 'Gate A', action: 'assigned', description: 'Gate assigned to John Smith', timestamp: '2024-04-28T09:00:00', performedBy: 'Admin', details: 'Morning shift assignment' },
    { id: '2', gateId: '1', gateName: 'Gate A', action: 'scan', description: '145 scans recorded today', timestamp: '2024-04-28T19:45:00', performedBy: 'System', details: 'Peak hour activity' },
    { id: '3', gateId: '2', gateName: 'Gate B', action: 'scan', description: '98 scans recorded today', timestamp: '2024-04-28T19:30:00', performedBy: 'System', details: 'Normal operation' },
    { id: '4', gateId: '3', gateName: 'Gate C', action: 'deactivated', description: 'Gate set to standby mode', timestamp: '2024-04-28T18:15:00', performedBy: 'Michael Chen', details: 'Low traffic period' },
    { id: '5', gateId: '4', gateName: 'Gate D', action: 'error', description: 'Connection lost - offline', timestamp: '2024-04-28T14:00:00', performedBy: 'System', details: 'Network issue detected' },
    { id: '6', gateId: '4', gateName: 'Gate D', action: 'maintenance', description: 'Maintenance required', timestamp: '2024-04-28T15:30:00', performedBy: 'Tech Support', details: 'Battery replacement needed' }
];

// Stat Card Component - Admin Style
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    suffix?: string;
    trend?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, suffix, trend }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {value}{suffix && <span className="text-sm ml-1">{suffix}</span>}
                    </p>
                    {trend && (
                        <div className={`flex items-center gap-1 text-xs mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {trend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            <span>{Math.abs(trend)}% from yesterday</span>
                        </div>
                    )}
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
            </div>
        </motion.div>
    );
};

const GateManagement: React.FC = () => {
    const navigate = useNavigate();
    const [gates, setGates] = useState<Gate[]>(mockGates);
    const [gateLogs, setGateLogs] = useState<GateLog[]>(mockGateLogs);
    const [selectedGate, setSelectedGate] = useState<Gate | null>(null);
    const [showLogsModal, setShowLogsModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });
    const [activeTab, setActiveTab] = useState<'status' | 'logs'>('status');

    // Real-time stats simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setGates(prev => prev.map(gate => ({
                ...gate,
                battery: Math.max(0, Math.min(100, gate.battery + (Math.random() - 0.5) * 2)),
                signal: Math.max(0, Math.min(100, gate.signal + (Math.random() - 0.5) * 3)),
                scansToday: gate.status === 'active' ? gate.scansToday + Math.floor(Math.random() * 3) : gate.scansToday
            })));
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const handleRefresh = () => {
        setPopupMessage({
            title: 'Refreshed',
            message: 'Gate status has been updated',
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    const handleExportLogs = () => {
        setPopupMessage({
            title: 'Export Started',
            message: 'Gate logs exported successfully',
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'standby':
                return <Clock className="h-4 w-4 text-yellow-500" />;
            case 'offline':
                return <XCircle className="h-4 w-4 text-red-500" />;
            case 'maintenance':
                return <AlertTriangle className="h-4 w-4 text-orange-500" />;
            default:
                return null;
        }
    };

    const getStatusBadge = (status: string) => {
        const config = {
            active: 'bg-green-100 text-green-700 border-green-200',
            standby: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            offline: 'bg-red-100 text-red-700 border-red-200',
            maintenance: 'bg-orange-100 text-orange-700 border-orange-200'
        };
        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config[status as keyof typeof config] || config.offline}`}>
                {getStatusIcon(status)}
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const getBatteryColor = (battery: number) => {
        if (battery >= 70) return 'text-green-600';
        if (battery >= 30) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getBatteryBgColor = (battery: number) => {
        if (battery >= 70) return 'bg-green-500';
        if (battery >= 30) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getSignalStrength = (signal: number) => {
        if (signal >= 70) return 'Excellent';
        if (signal >= 40) return 'Good';
        if (signal >= 20) return 'Fair';
        return 'Poor';
    };

    // Filter gates
    const filteredGates = gates.filter(gate => {
        const matchesSearch = gate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            gate.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            gate.assignedScannerName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || gate.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Filter logs
    const filteredLogs = gateLogs.filter(log => {
        return log.gateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.description.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Logs Columns
    const logsColumns = [
        { Header: 'Gate', accessor: 'gateName' },
        { Header: 'Action', accessor: 'action', Cell: (row: GateLog) => <span className="capitalize">{row.action}</span> },
        { Header: 'Description', accessor: 'description' },
        { Header: 'Performed By', accessor: 'performedBy' },
        { Header: 'Timestamp', accessor: 'timestamp', Cell: (row: GateLog) => new Date(row.timestamp).toLocaleString() }
    ];

    // Stats calculations
    const stats = {
        totalGates: gates.length,
        activeGates: gates.filter(g => g.status === 'active').length,
        standbyGates: gates.filter(g => g.status === 'standby').length,
        offlineGates: gates.filter(g => g.status === 'offline').length,
        totalScans: gates.reduce((sum, g) => sum + g.scansToday, 0),
        averageBattery: Math.round(gates.reduce((sum, g) => sum + g.battery, 0) / gates.length),
        averageSignal: Math.round(gates.reduce((sum, g) => sum + g.signal, 0) / gates.length)
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate('/scanner/dashboard')}
                                className="p-2 rounded-lg hover:bg-gray-100 transition"
                            >
                                <ArrowLeft className="h-5 w-5 text-gray-600" />
                            </button>
                            <div className="p-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 shadow-lg">
                                <DoorOpen className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Gate Management</h1>
                                <p className="text-sm text-gray-500">View gate status, monitor performance, and track activity logs</p>
                            </div>
                        </div>
                        <ReusableButton
                            onClick={handleRefresh}
                            icon={RefreshCw}
                            label="Refresh"
                            variant="secondary"
                            className="min-w-[120px]"
                        />
                    </div>
                </div>

                {/* Stats Cards - Admin Style with 70% Avg Battery */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    <StatCard
                        title="Total Gates"
                        value={stats.totalGates}
                        icon={DoorOpen}
                        color="from-teal-500 to-emerald-600"
                        trend={5}
                    />
                    <StatCard
                        title="Active Gates"
                        value={stats.activeGates}
                        icon={CheckCircle}
                        color="from-green-500 to-emerald-600"
                        trend={8}
                    />
                    <StatCard
                        title="Today's Scans"
                        value={stats.totalScans}
                        icon={Scan}
                        color="from-blue-500 to-cyan-600"
                        trend={12}
                    />
                    <StatCard
                        title="Avg Battery"
                        value={stats.averageBattery}
                        icon={Battery}
                        color="from-purple-500 to-indigo-600"
                        suffix="%"
                        trend={stats.averageBattery >= 70 ? 5 : -3}
                    />
                </div>

                {/* Secondary Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                        <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-2">
                            <Clock className="h-5 w-5 text-yellow-600" />
                        </div>
                        <p className="text-xl font-bold text-gray-900">{stats.standbyGates}</p>
                        <p className="text-xs text-gray-500">Standby Gates</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-2">
                            <XCircle className="h-5 w-5 text-red-600" />
                        </div>
                        <p className="text-xl font-bold text-gray-900">{stats.offlineGates}</p>
                        <p className="text-xs text-gray-500">Offline Gates</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                            <Signal className="h-5 w-5 text-blue-600" />
                        </div>
                        <p className="text-xl font-bold text-gray-900">{stats.averageSignal}%</p>
                        <p className="text-xs text-gray-500">Avg Signal</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
                            <Activity className="h-5 w-5 text-purple-600" />
                        </div>
                        <p className="text-xl font-bold text-gray-900">{stats.totalGates * 24}</p>
                        <p className="text-xs text-gray-500">Total Hours</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="flex gap-1">
                        <button
                            onClick={() => setActiveTab('status')}
                            className={`px-6 py-3 text-sm font-medium transition-all rounded-t-lg ${activeTab === 'status' ? 'border-b-2 border-teal-500 text-teal-600 bg-teal-50' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Activity className="h-4 w-4 inline mr-2" />
                            Gate Status
                        </button>
                        <button
                            onClick={() => setActiveTab('logs')}
                            className={`px-6 py-3 text-sm font-medium transition-all rounded-t-lg ${activeTab === 'logs' ? 'border-b-2 border-teal-500 text-teal-600 bg-teal-50' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Activity className="h-4 w-4 inline mr-2" />
                            Gate Logs
                        </button>
                    </nav>
                </div>

                {/* Gate Status Tab */}
                {activeTab === 'status' && (
                    <>
                        {/* Search and Filter - Proper Placement */}
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by gate name, location, or assigned scanner..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                    />
                                </div>
                                <div className="relative sm:w-48">
                                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none appearance-none bg-white"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="standby">Standby</option>
                                        <option value="offline">Offline</option>
                                        <option value="maintenance">Maintenance</option>
                                    </select>
                                </div>
                                {(searchTerm || statusFilter !== 'all') && (
                                    <ReusableButton
                                        onClick={() => {
                                            setSearchTerm('');
                                            setStatusFilter('all');
                                        }}
                                        icon={XCircle}
                                        label="Clear"
                                        variant="secondary"
                                        className="sm:w-auto"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Gates Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredGates.map((gate) => (
                                <motion.div
                                    key={gate.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
                                >
                                    {/* Gate Header */}
                                    <div className={`px-6 py-4 border-b ${gate.status === 'active' ? 'bg-gradient-to-r from-teal-50 to-emerald-50' : gate.status === 'standby' ? 'bg-yellow-50' : gate.status === 'offline' ? 'bg-red-50' : 'bg-orange-50'}`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <DoorOpen className="h-6 w-6 text-gray-700" />
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900">{gate.name}</h3>
                                                    <p className="text-xs text-gray-500">{gate.location}</p>
                                                </div>
                                            </div>
                                            {getStatusBadge(gate.status)}
                                        </div>
                                    </div>

                                    {/* Gate Body */}
                                    <div className="p-6">
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            {/* Battery with progress bar */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Battery className={`h-4 w-4 ${getBatteryColor(gate.battery)}`} />
                                                    <p className="text-xs text-gray-500">Battery</p>
                                                </div>
                                                <p className={`font-semibold ${getBatteryColor(gate.battery)}`}>{gate.battery}%</p>
                                                <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                                                    <div
                                                        className={`h-full ${getBatteryBgColor(gate.battery)} rounded-full transition-all duration-500`}
                                                        style={{ width: `${gate.battery}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Signal className="h-4 w-4 text-blue-600" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Signal</p>
                                                    <p className="font-semibold">{getSignalStrength(gate.signal)} ({gate.signal}%)</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Thermometer className="h-4 w-4 text-orange-600" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Temperature</p>
                                                    <p className="font-semibold">{gate.temperature}°C</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-purple-600" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Uptime</p>
                                                    <p className="font-semibold text-sm">{gate.uptime}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-500">Scans Today</span>
                                                <span className="font-semibold text-teal-600">{gate.scansToday}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Assigned To</span>
                                                <span className="font-semibold">{gate.assignedScannerName}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <ReusableButton
                                                onClick={() => {
                                                    setSelectedGate(gate);
                                                    setShowLogsModal(true);
                                                }}
                                                icon={Activity}
                                                label="View Logs"
                                                variant="secondary"
                                                className="flex-1"
                                            />
                                        </div>
                                    </div>

                                    {/* Gate Footer */}
                                    <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                                        <p className="text-xs text-gray-500">
                                            Last Scan: {new Date(gate.lastScan).toLocaleTimeString()}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Scanner ID: {gate.scannerId} | Firmware: {gate.firmware}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {filteredGates.length === 0 && (
                            <div className="text-center py-12">
                                <DoorOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No gates found matching your criteria</p>
                            </div>
                        )}
                    </>
                )}

                {/* Gate Logs Tab */}
                {activeTab === 'logs' && (
                    <>
                        {/* Search for Logs */}
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search logs by gate, action, or description..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                    />
                                </div>
                                <ReusableButton
                                    onClick={handleExportLogs}
                                    icon={Download}
                                    label="Export Logs"
                                    variant="secondary"
                                    className="sm:w-auto"
                                />
                                {searchTerm && (
                                    <ReusableButton
                                        onClick={() => setSearchTerm('')}
                                        icon={XCircle}
                                        label="Clear"
                                        variant="secondary"
                                        className="sm:w-auto"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                <div className="flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-teal-600" />
                                    <h2 className="text-lg font-semibold text-gray-900">Gate Activity Logs</h2>
                                    <span className="ml-auto text-xs text-gray-500">Total: {filteredLogs.length} entries</span>
                                </div>
                            </div>
                            <ReusableTable
                                columns={logsColumns}
                                data={filteredLogs}
                                title=""
                                icon={Activity}
                                showSearch={false}
                                showExport={false}
                                showPrint={false}
                                itemsPerPage={10}
                            />
                        </div>
                    </>
                )}

                {/* Gate Logs Modal */}
                <AnimatePresence>
                    {showLogsModal && selectedGate && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowLogsModal(false)}>
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4 flex justify-between items-center">
                                    <div>
                                        <h2 className="text-xl font-bold text-white">{selectedGate.name} - Gate Logs</h2>
                                        <p className="text-white/80 text-sm">Activity history for this gate</p>
                                    </div>
                                    <button onClick={() => setShowLogsModal(false)} className="text-white hover:bg-white/20 rounded-lg p-1 transition">
                                        <XCircle className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="p-6 overflow-y-auto max-h-[60vh]">
                                    <div className="space-y-3">
                                        {gateLogs.filter(log => log.gateId === selectedGate.id).map(log => (
                                            <div key={log.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                <div className="mt-0.5">
                                                    {log.action === 'assigned' && <UserCheck className="h-4 w-4 text-green-600" />}
                                                    {log.action === 'activated' && <Power className="h-4 w-4 text-green-600" />}
                                                    {log.action === 'deactivated' && <PowerOff className="h-4 w-4 text-yellow-600" />}
                                                    {log.action === 'maintenance' && <Settings className="h-4 w-4 text-orange-600" />}
                                                    {log.action === 'error' && <AlertCircle className="h-4 w-4 text-red-600" />}
                                                    {log.action === 'scan' && <Scan className="h-4 w-4 text-blue-600" />}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900 capitalize">{log.action}</p>
                                                    <p className="text-xs text-gray-600">{log.description}</p>
                                                    {log.details && <p className="text-xs text-gray-500 mt-1">{log.details}</p>}
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {new Date(log.timestamp).toLocaleString()} by {log.performedBy}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Tips Card */}
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-blue-800">Gate Monitoring Tips</p>
                            <p className="text-xs text-blue-700 mt-1">
                                • Monitor battery levels - recharge when below 30%<br />
                                • Check signal strength - poor signal affects scanning speed<br />
                                • Review gate logs daily for any issues or errors<br />
                                • Contact IT support immediately for offline gates<br />
                                • Average battery across all gates is {stats.averageBattery}%
                            </p>
                        </div>
                    </div>
                </div>

                {/* Success Popup */}
                <SuccessPopup
                    isOpen={showSuccessPopup}
                    onClose={() => setShowSuccessPopup(false)}
                    type={popupMessage.type}
                    title={popupMessage.title}
                    message={popupMessage.message}
                    duration={3000}
                    position="top-right"
                />
            </div>
        </div>
    );
};

export default GateManagement;