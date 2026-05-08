// src/pages/QR Scanner/ScannerDailyReport.tsx
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Scan,
    CheckCircle,
    XCircle,
    Clock,
    Activity,
    Calendar,
    TrendingUp,
    Users,
    BarChart3,
    Download,
    Filter,
    X,
    Search,
    ArrowLeft,
    RefreshCw,
    UserCheck,
    UserX
} from 'lucide-react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';

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
    scannedBy: string;
    status: 'valid' | 'invalid' | 'duplicate';
    scannerId: string;
    customerName: string;
    seatInfo: string;
}

// Mock Data - Recent Scan Records
const recentScans: ScanRecord[] = [
    { id: 1, ticketNumber: 'TKT-2024-001', eventName: 'The Lion King', scanTime: new Date(2024, 3, 28, 19, 23), scannedBy: 'John Scanner', status: 'valid', scannerId: 'SCN-001', customerName: 'John Smith', seatInfo: 'A12' },
    { id: 2, ticketNumber: 'TKT-2024-002', eventName: 'Hamilton', scanTime: new Date(2024, 3, 28, 19, 15), scannedBy: 'Sarah Operator', status: 'valid', scannerId: 'SCN-001', customerName: 'Sarah Johnson', seatInfo: 'B5' },
    { id: 3, ticketNumber: 'TKT-2024-003', eventName: 'Wicked', scanTime: new Date(2024, 3, 28, 18, 55), scannedBy: 'Michael Scanner', status: 'invalid', scannerId: 'SCN-002', customerName: 'Michael Brown', seatInfo: 'C8' },
    { id: 4, ticketNumber: 'TKT-2024-004', eventName: 'Phantom', scanTime: new Date(2024, 3, 28, 19, 45), scannedBy: 'John Scanner', status: 'valid', scannerId: 'SCN-001', customerName: 'Emily Davis', seatInfo: 'D3' },
    { id: 5, ticketNumber: 'TKT-2024-005', eventName: 'Chicago', scanTime: new Date(2024, 3, 28, 18, 30), scannedBy: 'David Operator', status: 'valid', scannerId: 'SCN-003', customerName: 'David Wilson', seatInfo: 'E7' },
    { id: 6, ticketNumber: 'TKT-2024-006', eventName: 'Lion King', scanTime: new Date(2024, 3, 28, 19, 10), scannedBy: 'Sarah Operator', status: 'duplicate', scannerId: 'SCN-001', customerName: 'Lisa Anderson', seatInfo: 'F2' },
    { id: 7, ticketNumber: 'TKT-2024-007', eventName: 'Les Misérables', scanTime: new Date(2024, 3, 28, 18, 45), scannedBy: 'Michael Scanner', status: 'valid', scannerId: 'SCN-002', customerName: 'Robert Taylor', seatInfo: 'G9' },
    { id: 8, ticketNumber: 'TKT-2024-008', eventName: 'Hamilton', scanTime: new Date(2024, 3, 28, 19, 30), scannedBy: 'David Operator', status: 'invalid', scannerId: 'SCN-003', customerName: 'Maria Garcia', seatInfo: 'H4' },
    { id: 9, ticketNumber: 'TKT-2024-009', eventName: 'The Lion King', scanTime: new Date(2024, 3, 28, 20, 15), scannedBy: 'John Scanner', status: 'valid', scannerId: 'SCN-001', customerName: 'James Wilson', seatInfo: 'B12' },
    { id: 10, ticketNumber: 'TKT-2024-010', eventName: 'Wicked', scanTime: new Date(2024, 3, 28, 20, 30), scannedBy: 'Sarah Operator', status: 'valid', scannerId: 'SCN-001', customerName: 'Patricia Brown', seatInfo: 'D8' },
];

// Get today's scans (for demo, using current date)
const getTodaysScans = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return recentScans.filter(scan => {
        const scanDate = new Date(scan.scanTime);
        scanDate.setHours(0, 0, 0, 0);
        return scanDate.getTime() === today.getTime();
    }).length;
};

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
                            <TrendingUp className="h-3 w-3" />
                            <span>{change}</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

// Colors for pie chart
const COLORS = ['#10B981', '#EF4444', '#F59E0B'];

const ScannerDailyReport: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterScannedBy, setFilterScannedBy] = useState<string>('all');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });

    // Calculate Summary Statistics
    const totalScans = recentScans.length;
    const totalValid = recentScans.filter(scan => scan.status === 'valid').length;
    const totalInvalid = recentScans.filter(scan => scan.status === 'invalid').length;
    const totalDuplicate = recentScans.filter(scan => scan.status === 'duplicate').length;
    const todayScanned = getTodaysScans();
    const validityRate = ((totalValid / totalScans) * 100).toFixed(1);

    // Get unique scanners
    const uniqueScanners = useMemo(() => 
        Array.from(new Set(recentScans.map(scan => scan.scannedBy))), []
    );

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

        if (filterScannedBy !== 'all') {
            filtered = filtered.filter(scan => scan.scannedBy === filterScannedBy);
        }

        return filtered;
    }, [recentScans, searchTerm, filterStatus, filterScannedBy]);

    const clearFilters = () => {
        setSearchTerm('');
        setFilterStatus('all');
        setFilterScannedBy('all');
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
                todayScanned,
                validityRate: `${validityRate}%`
            },
            recentScans: recentScans
        };

        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `scan-report-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);

        setPopupMessage({
            title: 'Report Exported',
            message: 'Report has been exported successfully',
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    // Scan History Columns - Using "Scanned By" instead of "Gate"
    const historyColumns = [
        { Header: 'Ticket Number', accessor: 'ticketNumber', Cell: (row: ScanRecord) => <span className="font-mono text-sm">{row.ticketNumber}</span> },
        { Header: 'Customer', accessor: 'customerName' },
        { Header: 'Event', accessor: 'eventName' },
        { Header: 'Seat', accessor: 'seatInfo' },
        { Header: 'Scanned By', accessor: 'scannedBy' },
        { Header: 'Time', accessor: 'scanTime', Cell: (row: ScanRecord) => row.scanTime.toLocaleTimeString() },
        {
            Header: 'Status', accessor: 'status', Cell: (row: ScanRecord) => {
                switch (row.status) {
                    case 'valid': return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /> Valid</span>;
                    case 'invalid': return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"><XCircle className="h-3 w-3" /> Invalid</span>;
                    case 'duplicate': return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3" /> Duplicate</span>;
                    default: return null;
                }
            }
        }
    ];

    // Summary Cards - Total, Valid, Invalid, Today's Scanned
    const summaryCards = [
        { title: "Total Scans", value: totalScans.toLocaleString(), icon: Scan, color: "from-teal-500 to-emerald-600", delay: 0.1, change: `All time scans`, trend: 'up' as const },
        { title: "Valid Scans", value: totalValid.toLocaleString(), icon: CheckCircle, color: "from-green-500 to-emerald-600", delay: 0.15, change: `${validityRate}% rate`, trend: 'up' as const },
        { title: "Invalid Scans", value: (totalInvalid + totalDuplicate).toLocaleString(), icon: XCircle, color: "from-red-500 to-pink-600", delay: 0.2, change: `${totalInvalid} invalid, ${totalDuplicate} dup`, trend: 'down' as const },
        { title: "Today's Scanned", value: todayScanned.toLocaleString(), icon: Calendar, color: "from-blue-500 to-cyan-600", delay: 0.25, change: `Today's entries`, trend: 'up' as const },
    ];

    // Pie chart data
    const pieData = [
        { name: 'Valid', value: totalValid, color: '#10B981' },
        { name: 'Invalid', value: totalInvalid, color: '#EF4444' },
        { name: 'Duplicate', value: totalDuplicate, color: '#F59E0B' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
             {/* Header */}
<div className="mb-8">
    <div className="flex items-center gap-3">
        <button
            onClick={() => navigate('/scanner/validate/scan')}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div className="p-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 shadow-lg">
            <BarChart3 className="h-6 w-6 text-white" />
        </div>
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Scan Report</h1>
            <p className="text-sm text-gray-500">Overview of ticket scans and validations</p>
        </div>
    </div>
</div>

                {/* Summary Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
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

                {/* Validity Rate Pie Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-teal-100 rounded-lg">
                            <PieChart className="h-5 w-5 text-teal-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Validity Rate Distribution</h3>
                            <p className="text-sm text-gray-500">Overall scan validity breakdown</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                    labelLine={true}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <span className="font-medium text-gray-900">Valid Scans</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-green-600">{totalValid}</p>
                                    <p className="text-xs text-gray-500">{validityRate}% of total</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <XCircle className="h-5 w-5 text-red-600" />
                                    <span className="font-medium text-gray-900">Invalid Scans</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-red-600">{totalInvalid}</p>
                                    <p className="text-xs text-gray-500">{((totalInvalid / totalScans) * 100).toFixed(1)}% of total</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-yellow-600" />
                                    <span className="font-medium text-gray-900">Duplicate Scans</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-yellow-600">{totalDuplicate}</p>
                                    <p className="text-xs text-gray-500">{((totalDuplicate / totalScans) * 100).toFixed(1)}% of total</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Scans Table */}
                <div className="mt-8">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-teal-600" />
                                    <h2 className="text-lg font-semibold text-gray-900">Recent Scan Activity</h2>
                                </div>
                                {/* Export button moved to right side above table */}
                                <div className="flex items-center gap-3">
                                    <ReusableButton
                                        onClick={exportReport}
                                        icon={Download}
                                        label="Export Report"
                                        variant="secondary"
                                        size="sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="px-6 py-4 border-b border-gray-100 bg-white">
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="relative flex-1 min-w-[200px]">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by ticket, event, or customer..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
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
                                    value={filterScannedBy}
                                    onChange={(e) => setFilterScannedBy(e.target.value)}
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                                >
                                    <option value="all">All Scanners</option>
                                    {uniqueScanners.map(scanner => (
                                        <option key={scanner} value={scanner}>{scanner}</option>
                                    ))}
                                </select>
                                {(searchTerm || filterStatus !== 'all' || filterScannedBy !== 'all') && (
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

                        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 text-sm text-gray-600 flex justify-between items-center">
                            <span>Showing {filteredScans.length} of {recentScans.length} scan records</span>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <UserCheck className="h-3 w-3 text-green-600" />
                                    <span className="text-xs">Valid: {totalValid}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <UserX className="h-3 w-3 text-red-600" />
                                    <span className="text-xs">Invalid: {totalInvalid}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3 text-yellow-600" />
                                    <span className="text-xs">Duplicate: {totalDuplicate}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3 text-blue-600" />
                                    <span className="text-xs">Today: {todayScanned}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Report Footer */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200 print:block hidden">
                    <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Report Generated: {new Date().toLocaleString()}</span>
                        <span>Theatre Hub Ethiopia - Scan Report</span>
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