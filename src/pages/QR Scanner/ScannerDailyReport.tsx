// src/pages/QR Scanner/ScannerDailyReport.tsx
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    QrCode,
    Scan,
    CheckCircle,
    XCircle,
    Clock,
    AlertTriangle,
    Activity,
    Calendar,
    TrendingUp,
    ArrowRight,
    Users,
    Ticket,
    BarChart3,
    Download,
    Filter,
    X,
    Search,
    Info,
    ArrowLeft,
    PieChart as PieChartIcon,
    TrendingDown,
    Award,
    Star,
    Crown,
    Eye,
    Printer,
    FileText,
    RefreshCw,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import {
    AreaChart,
    Area,
    PieChart,
    Pie,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LineChart,
    Line,
    BarChart,
    Bar,
    Legend,
    ComposedChart
} from 'recharts';
import { Link as RouterLink } from 'react-router-dom';
import ReusableButton from '../../components/Reusable/ReusableButton';
import ReusableTable from '../../components/Reusable/ReusableTable';
import SuccessPopup from '../../components/Reusable/SuccessPopup';

// Types
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    delay: number;
    change?: string;
    trend?: 'up' | 'down';
}

interface ScanRecord {
    id: number;
    ticketNumber: string;
    eventName: string;
    scanTime: Date;
    gate: string;
    status: 'valid' | 'invalid' | 'duplicate';
    scannerId: string;
    customerName: string;
    seatInfo: string;
}

interface DailyStats {
    date: string;
    total: number;
    valid: number;
    invalid: number;
    duplicate: number;
    uniqueVisitors: number;
}

interface HourlyStats {
    hour: string;
    scans: number;
    valid: number;
    invalid: number;
}

interface GatePerformance {
    gate: string;
    scans: number;
    valid: number;
    invalid: number;
    avgTimePerScan: number;
}

// Mock Data - Daily Statistics (Last 7 days)
const dailyStatsData: DailyStats[] = [
    { date: '2024-04-22', total: 145, valid: 142, invalid: 2, duplicate: 1, uniqueVisitors: 138 },
    { date: '2024-04-23', total: 168, valid: 165, invalid: 2, duplicate: 1, uniqueVisitors: 160 },
    { date: '2024-04-24', total: 189, valid: 186, invalid: 2, duplicate: 1, uniqueVisitors: 182 },
    { date: '2024-04-25', total: 201, valid: 198, invalid: 2, duplicate: 1, uniqueVisitors: 195 },
    { date: '2024-04-26', total: 234, valid: 230, invalid: 3, duplicate: 1, uniqueVisitors: 225 },
    { date: '2024-04-27', total: 256, valid: 252, invalid: 3, duplicate: 1, uniqueVisitors: 248 },
    { date: '2024-04-28', total: 289, valid: 285, invalid: 3, duplicate: 1, uniqueVisitors: 278 },
];

// Hourly Statistics (For selected date)
const hourlyStatsData: HourlyStats[] = [
    { hour: '10:00', scans: 12, valid: 12, invalid: 0 },
    { hour: '11:00', scans: 18, valid: 18, invalid: 0 },
    { hour: '12:00', scans: 25, valid: 24, invalid: 1 },
    { hour: '13:00', scans: 32, valid: 31, invalid: 1 },
    { hour: '14:00', scans: 28, valid: 28, invalid: 0 },
    { hour: '15:00', scans: 35, valid: 34, invalid: 1 },
    { hour: '16:00', scans: 42, valid: 41, invalid: 1 },
    { hour: '17:00', scans: 38, valid: 38, invalid: 0 },
    { hour: '18:00', scans: 45, valid: 44, invalid: 1 },
    { hour: '19:00', scans: 52, valid: 51, invalid: 1 },
    { hour: '20:00', scans: 48, valid: 47, invalid: 1 },
    { hour: '21:00', scans: 35, valid: 35, invalid: 0 },
];

// Gate Performance Data
const gatePerformanceData: GatePerformance[] = [
    { gate: 'Gate A', scans: 456, valid: 448, invalid: 5, avgTimePerScan: 3.2 },
    { gate: 'Gate B', scans: 389, valid: 382, invalid: 4, avgTimePerScan: 3.5 },
    { gate: 'Gate C', scans: 412, valid: 405, invalid: 4, avgTimePerScan: 3.0 },
    { gate: 'Gate D', scans: 234, valid: 230, invalid: 2, avgTimePerScan: 3.8 },
];

// Recent Scan Records
const recentScans: ScanRecord[] = [
    { id: 1, ticketNumber: 'TKT-2024-001', eventName: 'The Lion King', scanTime: new Date(2024, 3, 28, 19, 23), gate: 'Gate A', status: 'valid', scannerId: 'SCN-001', customerName: 'John Smith', seatInfo: 'A12' },
    { id: 2, ticketNumber: 'TKT-2024-002', eventName: 'Hamilton', scanTime: new Date(2024, 3, 28, 19, 15), gate: 'Gate A', status: 'valid', scannerId: 'SCN-001', customerName: 'Sarah Johnson', seatInfo: 'B5' },
    { id: 3, ticketNumber: 'TKT-2024-003', eventName: 'Wicked', scanTime: new Date(2024, 3, 28, 18, 55), gate: 'Gate B', status: 'invalid', scannerId: 'SCN-002', customerName: 'Michael Brown', seatInfo: 'C8' },
    { id: 4, ticketNumber: 'TKT-2024-004', eventName: 'Phantom', scanTime: new Date(2024, 3, 28, 19, 45), gate: 'Gate A', status: 'valid', scannerId: 'SCN-001', customerName: 'Emily Davis', seatInfo: 'D3' },
    { id: 5, ticketNumber: 'TKT-2024-005', eventName: 'Chicago', scanTime: new Date(2024, 3, 28, 18, 30), gate: 'Gate C', status: 'valid', scannerId: 'SCN-003', customerName: 'David Wilson', seatInfo: 'E7' },
    { id: 6, ticketNumber: 'TKT-2024-006', eventName: 'Lion King', scanTime: new Date(2024, 3, 28, 19, 10), gate: 'Gate A', status: 'duplicate', scannerId: 'SCN-001', customerName: 'Lisa Anderson', seatInfo: 'F2' },
    { id: 7, ticketNumber: 'TKT-2024-007', eventName: 'Les Misérables', scanTime: new Date(2024, 3, 28, 18, 45), gate: 'Gate B', status: 'valid', scannerId: 'SCN-002', customerName: 'Robert Taylor', seatInfo: 'G9' },
    { id: 8, ticketNumber: 'TKT-2024-008', eventName: 'Hamilton', scanTime: new Date(2024, 3, 28, 19, 30), gate: 'Gate C', status: 'invalid', scannerId: 'SCN-003', customerName: 'Maria Garcia', seatInfo: 'H4' },
];

// Stat Card Component
const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, delay, change, trend }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, type: "spring", stiffness: 100 }}
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                    <p className="text-xs text-gray-500">{title}</p>
                    <p className="text-xl font-bold text-gray-900">{value}</p>
                    {change && (
                        <div className={`flex items-center gap-1 text-xs mt-0.5 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            <span>{change}</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

// Custom Tooltip for Charts
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-200">
                <p className="text-xs font-semibold text-gray-900 mb-1">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-xs" style={{ color: entry.color }}>
                        {entry.name}: {entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// Colors for charts
const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#8B5CF6', '#3B82F6'];

const ScannerDailyReport: React.FC = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState<string>('2024-04-28');
    const [selectedView, setSelectedView] = useState<'daily' | 'hourly' | 'gates'>('daily');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterGate, setFilterGate] = useState<string>('all');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });

    // Calculate Summary Statistics
    const totalScans = dailyStatsData.reduce((sum, day) => sum + day.total, 0);
    const totalValid = dailyStatsData.reduce((sum, day) => sum + day.valid, 0);
    const totalInvalid = dailyStatsData.reduce((sum, day) => sum + day.invalid, 0);
    const totalDuplicate = dailyStatsData.reduce((sum, day) => sum + day.duplicate, 0);
    const totalUniqueVisitors = dailyStatsData.reduce((sum, day) => sum + day.uniqueVisitors, 0);
    const avgDailyScans = Math.round(totalScans / dailyStatsData.length);
    const validityRate = ((totalValid / totalScans) * 100).toFixed(1);

    // Get selected date data
    const selectedDateData = dailyStatsData.find(d => d.date === selectedDate);

    // Filter recent scans
    const filteredScans = useMemo(() => {
        let filtered = [...recentScans];

        if (searchTerm) {
            const query = searchTerm.toLowerCase();
            filtered = filtered.filter(scan =>
                scan.ticketNumber.toLowerCase().includes(query) ||
                scan.eventName.toLowerCase().includes(query) ||
                scan.customerName.toLowerCase().includes(query)
            );
        }

        if (filterStatus !== 'all') {
            filtered = filtered.filter(scan => scan.status === filterStatus);
        }

        if (filterGate !== 'all') {
            filtered = filtered.filter(scan => scan.gate === filterGate);
        }

        return filtered;
    }, [recentScans, searchTerm, filterStatus, filterGate]);

    const clearFilters = () => {
        setSearchTerm('');
        setFilterStatus('all');
        setFilterGate('all');
        setPopupMessage({
            title: 'Filters Cleared',
            message: 'All filters have been reset',
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    const exportReport = () => {
        const reportData = {
            generatedAt: new Date().toISOString(),
            summary: {
                totalScans,
                totalValid,
                totalInvalid,
                totalDuplicate,
                totalUniqueVisitors,
                avgDailyScans,
                validityRate: `${validityRate}%`
            },
            dailyStats: dailyStatsData,
            gatePerformance: gatePerformanceData,
            recentScans: recentScans
        };

        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `daily-report-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);

        setPopupMessage({
            title: 'Report Exported',
            message: 'Daily report has been exported successfully',
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    const printReport = () => {
        window.print();
    };

    // Scan History Columns
    const historyColumns = [
        { Header: 'Ticket Number', accessor: 'ticketNumber', Cell: (row: ScanRecord) => <span className="font-mono text-sm">{row.ticketNumber}</span> },
        { Header: 'Customer', accessor: 'customerName' },
        { Header: 'Event', accessor: 'eventName' },
        { Header: 'Seat', accessor: 'seatInfo' },
        { Header: 'Gate', accessor: 'gate' },
        { Header: 'Time', accessor: 'scanTime', Cell: (row: ScanRecord) => row.scanTime.toLocaleTimeString() },
        {
            Header: 'Status', accessor: 'status', Cell: (row: ScanRecord) => {
                switch (row.status) {
                    case 'valid': return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /> Valid</span>;
                    case 'invalid': return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"><XCircle className="h-3 w-3" /> Invalid</span>;
                    case 'duplicate': return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700"><AlertTriangle className="h-3 w-3" /> Duplicate</span>;
                    default: return null;
                }
            }
        }
    ];

    // Summary Cards
    const summaryCards = [
        { title: "Total Scans", value: totalScans.toLocaleString(), icon: Scan, color: "from-teal-500 to-emerald-600", delay: 0.1, change: `+${avgDailyScans} avg/day`, trend: 'up' as const },
        { title: "Valid Entries", value: totalValid.toLocaleString(), icon: CheckCircle, color: "from-green-500 to-emerald-600", delay: 0.15, change: `${validityRate}% rate`, trend: 'up' as const },
        { title: "Invalid/Rejected", value: (totalInvalid + totalDuplicate).toLocaleString(), icon: XCircle, color: "from-red-500 to-pink-600", delay: 0.2, change: `${totalInvalid} invalid, ${totalDuplicate} dup`, trend: 'down' as const },
        { title: "Unique Visitors", value: totalUniqueVisitors.toLocaleString(), icon: Users, color: "from-purple-500 to-indigo-600", delay: 0.25, change: `${((totalUniqueVisitors / totalScans) * 100).toFixed(1)}% rate`, trend: 'up' as const },
    ];

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
                                <BarChart3 className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Daily Scan Report</h1>
                                <p className="text-sm text-gray-500">Comprehensive analytics of ticket scans and entries</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <ReusableButton
                                onClick={exportReport}
                                icon={Download}
                                label="Export Report"
                                variant="secondary"
                                className="print:hidden"
                            />
                            <ReusableButton
                                onClick={printReport}
                                icon={Printer}
                                label="Print"
                                variant="secondary"
                                className="print:hidden"
                            />
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
                >
                    {summaryCards.map((card, index) => (
                        <StatCard
                            key={index}
                            title={card.title}
                            value={card.value}
                            icon={card.icon}
                            color={card.color}
                            delay={card.delay}
                            change={card.change}
                            trend={card.trend}
                        />
                    ))}
                </motion.div>

                {/* View Selector */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
                        <button
                            onClick={() => setSelectedView('daily')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedView === 'daily'
                                    ? 'bg-white text-teal-600 shadow-md'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Daily Statistics
                        </button>
                        <button
                            onClick={() => setSelectedView('hourly')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedView === 'hourly'
                                    ? 'bg-white text-teal-600 shadow-md'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Hourly Analysis
                        </button>
                        <button
                            onClick={() => setSelectedView('gates')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedView === 'gates'
                                    ? 'bg-white text-teal-600 shadow-md'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Gate Performance
                        </button>
                    </div>

                    {selectedView === 'daily' && (
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                                {dailyStatsData.length} Days Report ({dailyStatsData[0]?.date} - {dailyStatsData[dailyStatsData.length - 1]?.date})
                            </span>
                        </div>
                    )}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Daily Statistics Chart */}
                    {selectedView === 'daily' && (
                        <>
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Daily Scan Trends</h3>
                                        <p className="text-sm text-gray-500">Last 7 days performance</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-teal-500 rounded"></div> Total</span>
                                        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded"></div> Valid</span>
                                        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded"></div> Invalid</span>
                                    </div>
                                </div>
                                <ResponsiveContainer width="100%" height={300}>
                                    <ComposedChart data={dailyStatsData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                        <YAxis tick={{ fontSize: 11 }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="total" fill="#14B8A6" radius={[4, 4, 0, 0]} name="Total Scans" />
                                        <Bar dataKey="valid" fill="#10B981" radius={[4, 4, 0, 0]} name="Valid" />
                                        <Bar dataKey="invalid" fill="#EF4444" radius={[4, 4, 0, 0]} name="Invalid" />
                                        <Line type="monotone" dataKey="uniqueVisitors" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 4 }} name="Unique Visitors" />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Validity Rate Pie Chart */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Validity Rate Distribution</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Valid', value: totalValid, color: '#10B981' },
                                                { name: 'Invalid', value: totalInvalid, color: '#EF4444' },
                                                { name: 'Duplicate', value: totalDuplicate, color: '#F59E0B' }
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                            labelLine={true}
                                        >
                                            {dailyStatsData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="text-center mt-4">
                                    <p className="text-sm text-gray-600">
                                        Overall validity rate: <span className="font-bold text-green-600">{validityRate}%</span>
                                    </p>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Hourly Analysis Chart */}
                    {selectedView === 'hourly' && (
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 lg:col-span-2">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Hourly Scan Distribution</h3>
                                    <p className="text-sm text-gray-500">Peak hours analysis for selected date</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        <input
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={hourlyStatsData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Bar dataKey="scans" fill="#14B8A6" name="Total Scans" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="valid" fill="#10B981" name="Valid" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="invalid" fill="#EF4444" name="Invalid" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                            {selectedDateData && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">Selected Date Summary:</span>
                                        <span className="font-semibold text-teal-600">{selectedDateData.total} Total Scans</span>
                                        <span className="font-semibold text-green-600">{selectedDateData.valid} Valid</span>
                                        <span className="font-semibold text-red-600">{selectedDateData.invalid} Invalid</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Gate Performance Chart */}
                    {selectedView === 'gates' && (
                        <>
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Gate Performance Comparison</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={gatePerformanceData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="gate" tick={{ fontSize: 12, fontWeight: 600 }} />
                                        <YAxis tick={{ fontSize: 11 }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Bar dataKey="scans" fill="#14B8A6" name="Total Scans" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="valid" fill="#10B981" name="Valid" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="invalid" fill="#EF4444" name="Invalid" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Gate Details</h3>
                                <div className="space-y-4">
                                    {gatePerformanceData.map((gate, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                            <div>
                                                <p className="font-semibold text-gray-900">{gate.gate}</p>
                                                <p className="text-xs text-gray-500">Avg {gate.avgTimePerScan}s per scan</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-gray-900">{gate.scans} scans</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-green-600">{gate.valid} valid</span>
                                                    <span className="text-xs text-red-600">{gate.invalid} invalid</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Recent Scans Table */}
                <div className="mt-8">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-teal-600" />
                                    <h2 className="text-lg font-semibold text-gray-900">Recent Scan Activity</h2>
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search by ticket, event, or customer..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none w-64"
                                        />
                                    </div>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="valid">Valid</option>
                                        <option value="invalid">Invalid</option>
                                        <option value="duplicate">Duplicate</option>
                                    </select>
                                    <select
                                        value={filterGate}
                                        onChange={(e) => setFilterGate(e.target.value)}
                                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                                    >
                                        <option value="all">All Gates</option>
                                        <option value="Gate A">Gate A</option>
                                        <option value="Gate B">Gate B</option>
                                        <option value="Gate C">Gate C</option>
                                        <option value="Gate D">Gate D</option>
                                    </select>
                                    {(searchTerm || filterStatus !== 'all' || filterGate !== 'all') && (
                                        <button
                                            onClick={clearFilters}
                                            className="px-3 py-2 text-sm text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors flex items-center gap-1"
                                        >
                                            <X className="h-4 w-4" />
                                            Clear
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <ReusableTable
                            columns={historyColumns}
                            data={filteredScans}
                            title=""
                            icon={Scan}
                            showSearch={false}
                            showExport={false}
                            showPrint={false}
                            itemsPerPage={10}
                        />

                        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 text-sm text-gray-600">
                            Showing {filteredScans.length} of {recentScans.length} scan records
                        </div>
                    </div>
                </div>

                {/* Report Footer */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200 print:block hidden">
                    <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Report Generated: {new Date().toLocaleString()}</span>
                        <span>Theatre Hub Ethiopia - Daily Scan Report</span>
                        <span>Page 1 of 1</span>
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

export default ScannerDailyReport;