// src/pages/QRScanner/ScannerDailyReport.tsx
import React, { useState, useEffect, useMemo } from 'react';
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
    BarChart3,
    Download,
    Filter,
    X,
    Search,
    ArrowLeft,
    RefreshCw,
    UserCheck,
    UserX,
    Loader2
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
import supabase from '@/config/supabaseClient';

// Types
interface ScanLog {
    id: string;
    ticket_number: string;
    event_name: string;
    scan_time: string;
    scanned_by_name: string;
    status: 'valid' | 'invalid' | 'duplicate';
    scanner_id: string;
    customer_name: string;
    seat_info: string;
}

interface DailyReport {
    scan_date: string;
    total_scans: number;
    valid_scans: number;
    invalid_scans: number;
    duplicate_scans: number;
    active_scanners: number;
    active_operators: number;
    unique_tickets_scanned: number;
}

interface EventSummary {
    event_id: string;
    event_name: string;
    event_date: string;
    total_scans: number;
    valid_scans: number;
    invalid_scans: number;
    checked_in_count: number;
    total_tickets_sold: number;
    checkin_percentage: number;
}

const ScannerDailyReport: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [dailyReports, setDailyReports] = useState<DailyReport[]>([]);
    const [eventSummaries, setEventSummaries] = useState<EventSummary[]>([]);
    const [recentScans, setRecentScans] = useState<ScanLog[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterEvent, setFilterEvent] = useState<string>('all');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });

    // Load all data
    const loadData = async () => {
        setLoading(true);
        try {
            // Load daily reports from view
            const { data: reportsData, error: reportsError } = await supabase
                .from('daily_scan_report')
                .select('*')
                .order('scan_date', { ascending: false });
            
            if (reportsError) throw reportsError;
            setDailyReports(reportsData || []);
            
            // Load event summaries from view
            const { data: eventsData, error: eventsError } = await supabase
                .from('event_scan_summary')
                .select('*')
                .order('event_date', { ascending: false });
            
            if (eventsError) throw eventsError;
            setEventSummaries(eventsData || []);
            
            // Load recent scan logs
            const { data: scansData, error: scansError } = await supabase
                .from('scan_logs')
                .select('*')
                .order('scan_time', { ascending: false })
                .limit(100);
            
            if (scansError) throw scansError;
            setRecentScans(scansData || []);
            
        } catch (error) {
            console.error('Error loading data:', error);
            setPopupMessage({
                title: 'Error',
                message: 'Failed to load report data',
                type: 'error'
            });
            setShowSuccessPopup(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Calculate summary statistics from daily reports
    const totalScans = dailyReports.reduce((sum, r) => sum + r.total_scans, 0);
    const totalValid = dailyReports.reduce((sum, r) => sum + r.valid_scans, 0);
    const totalInvalid = dailyReports.reduce((sum, r) => sum + r.invalid_scans, 0);
    const totalDuplicate = dailyReports.reduce((sum, r) => sum + r.duplicate_scans, 0);
    const todayScanned = dailyReports[0]?.total_scans || 0;
    const validityRate = totalScans > 0 ? ((totalValid / totalScans) * 100).toFixed(1) : '0';

    // Get unique events for filter
    const uniqueEvents = useMemo(() => 
        Array.from(new Set(recentScans.map(scan => scan.event_name).filter(Boolean))), 
        [recentScans]
    );

    // Filter recent scans
    const filteredScans = useMemo(() => {
        let filtered = [...recentScans];

        if (searchTerm) {
            const query = searchTerm.toLowerCase();
            filtered = filtered.filter(scan =>
                scan.ticket_number?.toLowerCase().includes(query) ||
                scan.event_name?.toLowerCase().includes(query) ||
                scan.customer_name?.toLowerCase().includes(query)
            );
        }

        if (filterStatus !== 'all') {
            filtered = filtered.filter(scan => scan.status === filterStatus);
        }

        if (filterEvent !== 'all') {
            filtered = filtered.filter(scan => scan.event_name === filterEvent);
        }

        return filtered;
    }, [recentScans, searchTerm, filterStatus, filterEvent]);

    const clearFilters = () => {
        setSearchTerm('');
        setFilterStatus('all');
        setFilterEvent('all');
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
            dailyReports,
            eventSummaries,
            recentScans
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Scan History Columns
    const historyColumns = [
        { Header: 'Ticket Number', accessor: 'ticket_number', Cell: (row: ScanLog) => <span className="font-mono text-sm">{row.ticket_number}</span> },
        { Header: 'Customer', accessor: 'customer_name', Cell: (row: ScanLog) => row.customer_name || 'N/A' },
        { Header: 'Event', accessor: 'event_name', Cell: (row: ScanLog) => row.event_name || 'N/A' },
        { Header: 'Seat', accessor: 'seat_info', Cell: (row: ScanLog) => row.seat_info || 'N/A' },
        { Header: 'Scanned By', accessor: 'scanned_by_name', Cell: (row: ScanLog) => row.scanned_by_name || 'System' },
        { Header: 'Time', accessor: 'scan_time', Cell: (row: ScanLog) => formatDate(row.scan_time) },
        {
            Header: 'Status', accessor: 'status', Cell: (row: ScanLog) => {
                switch (row.status) {
                    case 'valid': return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /> Valid</span>;
                    case 'invalid': return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"><XCircle className="h-3 w-3" /> Invalid</span>;
                    case 'duplicate': return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3" /> Duplicate</span>;
                    default: return null;
                }
            }
        }
    ];

    // Summary Cards
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading report data...</p>
                </div>
            </div>
        );
    }

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
                        <div key={index} className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-md`}>
                                    <card.icon className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500">{card.title}</p>
                                    <p className="text-xl font-bold text-gray-900">{card.value}</p>
                                    {card.change && (
                                        <div className={`flex items-center gap-1 text-xs mt-0.5 ${card.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                            <TrendingUp className="h-3 w-3" />
                                            <span>{card.change}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
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
                                    <p className="text-xs text-gray-500">{totalScans > 0 ? ((totalInvalid / totalScans) * 100).toFixed(1) : '0'}% of total</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-yellow-600" />
                                    <span className="font-medium text-gray-900">Duplicate Scans</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-yellow-600">{totalDuplicate}</p>
                                    <p className="text-xs text-gray-500">{totalScans > 0 ? ((totalDuplicate / totalScans) * 100).toFixed(1) : '0'}% of total</p>
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
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={loadData}
                                        className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-1"
                                    >
                                        <RefreshCw className="h-3 w-3" />
                                        Refresh
                                    </button>
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
                                    value={filterEvent}
                                    onChange={(e) => setFilterEvent(e.target.value)}
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                                >
                                    <option value="all">All Events</option>
                                    {uniqueEvents.map(event => (
                                        <option key={event} value={event}>{event}</option>
                                    ))}
                                </select>
                                {(searchTerm || filterStatus !== 'all' || filterEvent !== 'all') && (
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