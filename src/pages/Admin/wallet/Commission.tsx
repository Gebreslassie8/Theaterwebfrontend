// src/components/wallet/CommissionAnalytics.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    Download,
    Filter,
    RefreshCw,
    Search,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    Wallet,
    Building,
    Percent,
    CreditCard,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Users,
    Receipt,
    Award,
    Smartphone,
    Banknote,
    Send
} from 'lucide-react';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    PieChart as RePieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import ReusableshowFilterforall from '../../../components/Reusable/ReusableshowFilterforall';

// Types
interface CommissionTransaction {
    id: string;
    theaterId: string;
    theaterName: string;
    theaterLocation: string;
    commissionRate: number;
    totalRevenue: number;
    commissionAmount: number;
    status: 'paid' | 'pending' | 'overdue';
    dueDate: string;
    paidDate?: string;
    paymentMethod: 'cash' | 'chapa' | 'telebirr' | 'bank_transfer';
    period: { start: string; end: string };
    ticketsSold: number;
    eventsCount: number;
}

// Mock Data
const generateMockCommissions = (): CommissionTransaction[] => {
    const theaters = [
        { id: 'th-1', name: 'Grand Cinema', location: 'Addis Ababa, Bole', rate: 0.05 },
        { id: 'th-2', name: 'Star Multiplex', location: 'Addis Ababa, Kazanchis', rate: 0.08 },
        { id: 'th-3', name: 'City Cinema', location: 'Addis Ababa, Piassa', rate: 0.05 },
        { id: 'th-4', name: 'Oasis Cinema', location: 'Addis Ababa, CMC', rate: 0.05 },
        { id: 'th-5', name: 'Plaza Cinema', location: 'Addis Ababa, Mexico', rate: 0.08 },
    ];

    const commissions: CommissionTransaction[] = [];
    const now = new Date();
    
    for (let i = 0; i < 50; i++) {
        const theater = theaters[Math.floor(Math.random() * theaters.length)];
        const monthOffset = Math.floor(Math.random() * 6);
        const dueDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, 15);
        const revenue = 30000 + Math.random() * 150000;
        const commissionAmount = revenue * theater.rate;
        
        const statuses: ('paid' | 'pending' | 'overdue')[] = ['paid', 'pending', 'overdue'];
        const weights = [0.6, 0.25, 0.15];
        let random = Math.random();
        let cumulative = 0;
        let status: 'paid' | 'pending' | 'overdue' = 'pending';
        
        for (let j = 0; j < weights.length; j++) {
            cumulative += weights[j];
            if (random < cumulative) {
                status = statuses[j];
                break;
            }
        }
        
        const paymentMethods: ('cash' | 'chapa' | 'telebirr' | 'bank_transfer')[] = ['cash', 'chapa', 'telebirr', 'bank_transfer'];
        
        commissions.push({
            id: `comm-${i + 1}`,
            theaterId: theater.id,
            theaterName: theater.name,
            theaterLocation: theater.location,
            commissionRate: theater.rate * 100,
            totalRevenue: Math.floor(revenue),
            commissionAmount: Math.floor(commissionAmount),
            status,
            dueDate: dueDate.toISOString(),
            paidDate: status === 'paid' ? new Date(dueDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
            paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
            period: {
                start: new Date(dueDate.getFullYear(), dueDate.getMonth(), 1).toISOString(),
                end: new Date(dueDate.getFullYear(), dueDate.getMonth() + 1, 0).toISOString()
            },
            ticketsSold: Math.floor(300 + Math.random() * 2000),
            eventsCount: Math.floor(3 + Math.random() * 30),
        });
    }
    
    return commissions.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
};

const CommissionAnalytics: React.FC = () => {
    const [commissions, setCommissions] = useState<CommissionTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterPaymentMethod, setFilterPaymentMethod] = useState<string>('all');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 800));
            setCommissions(generateMockCommissions());
            setIsLoading(false);
        };
        loadData();
    }, []);

    // Filtered data
    const filteredCommissions = useMemo(() => {
        let filtered = [...commissions];
        
        if (searchTerm) {
            filtered = filtered.filter(c =>
                c.theaterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.theaterLocation.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        if (filterStatus !== 'all') {
            filtered = filtered.filter(c => c.status === filterStatus);
        }
        
        if (filterPaymentMethod !== 'all') {
            filtered = filtered.filter(c => c.paymentMethod === filterPaymentMethod);
        }
        
        return filtered;
    }, [commissions, searchTerm, filterStatus, filterPaymentMethod]);

    // Calculate totals
    const totals = useMemo(() => {
        const totalCommission = filteredCommissions.reduce((sum, c) => sum + c.commissionAmount, 0);
        const cashTotal = filteredCommissions.filter(c => c.status === 'paid' && c.paymentMethod === 'cash').reduce((sum, c) => sum + c.commissionAmount, 0);
        const chapaTotal = filteredCommissions.filter(c => c.status === 'paid' && c.paymentMethod === 'chapa').reduce((sum, c) => sum + c.commissionAmount, 0);
        const pendingTotal = filteredCommissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.commissionAmount, 0);
        const overdueTotal = filteredCommissions.filter(c => c.status === 'overdue').reduce((sum, c) => sum + c.commissionAmount, 0);
        
        return { totalCommission, cashTotal, chapaTotal, pendingTotal, overdueTotal };
    }, [filteredCommissions]);

    // Monthly trend data
    const monthlyData = useMemo(() => {
        const monthlyMap = new Map<string, { commission: number; cash: number; chapa: number }>();
        filteredCommissions.forEach(comm => {
            const month = new Date(comm.dueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            const current = monthlyMap.get(month) || { commission: 0, cash: 0, chapa: 0 };
            current.commission += comm.commissionAmount;
            if (comm.status === 'paid') {
                if (comm.paymentMethod === 'cash') current.cash += comm.commissionAmount;
                if (comm.paymentMethod === 'chapa') current.chapa += comm.commissionAmount;
            }
            monthlyMap.set(month, current);
        });
        return Array.from(monthlyMap.entries()).map(([month, data]) => ({ month, ...data })).slice(-6);
    }, [filteredCommissions]);

    // Payment method data
    const paymentMethodData = useMemo(() => {
        const cashTotal = filteredCommissions.filter(c => c.status === 'paid' && c.paymentMethod === 'cash').reduce((sum, c) => sum + c.commissionAmount, 0);
        const chapaTotal = filteredCommissions.filter(c => c.status === 'paid' && c.paymentMethod === 'chapa').reduce((sum, c) => sum + c.commissionAmount, 0);
        const otherTotal = filteredCommissions.filter(c => c.status === 'paid' && (c.paymentMethod === 'telebirr' || c.paymentMethod === 'bank_transfer')).reduce((sum, c) => sum + c.commissionAmount, 0);
        
        return [
            { name: 'Cash', value: cashTotal, color: '#10B981' },
            { name: 'Chapa', value: chapaTotal, color: '#3B82F6' },
            { name: 'Other', value: otherTotal, color: '#F59E0B' }
        ].filter(item => item.value > 0);
    }, [filteredCommissions]);

    const formatETB = (amount: number) => `ETB ${amount.toLocaleString()}`;
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const getStatusBadge = (status: string) => {
        const config = {
            paid: { bg: 'bg-green-100', text: 'text-green-700', label: 'Paid', icon: '✅' },
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending', icon: '⏳' },
            overdue: { bg: 'bg-red-100', text: 'text-red-700', label: 'Overdue', icon: '⚠️' }
        };
        const c = config[status as keyof typeof config];
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>{c.icon} {c.label}</span>;
    };

    const getPaymentMethodBadge = (method: string) => {
        const config: Record<string, { bg: string; text: string; label: string }> = {
            cash: { bg: 'bg-green-100', text: 'text-green-700', label: '💰 Cash' },
            chapa: { bg: 'bg-blue-100', text: 'text-blue-700', label: '📱 Chapa' },
            telebirr: { bg: 'bg-purple-100', text: 'text-purple-700', label: '📱 Telebirr' },
            bank_transfer: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '🏦 Bank Transfer' }
        };
        const c = config[method];
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>{c.label}</span>;
    };

    const handleExport = () => {
        const headers = ['Theater', 'Location', 'Period', 'Revenue', 'Commission', 'Status', 'Payment', 'Due Date'];
        const rows = filteredCommissions.map(c => [
            c.theaterName, c.theaterLocation,
            `${formatDate(c.period.start)} - ${formatDate(c.period.end)}`,
            formatETB(c.totalRevenue), formatETB(c.commissionAmount),
            c.status, c.paymentMethod, formatDate(c.dueDate)
        ]);
        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `commission_report_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        setPopupMessage({ title: 'Success!', message: 'Report exported', type: 'success' });
        setShowSuccessPopup(true);
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setFilterStatus('all');
        setFilterPaymentMethod('all');
        setPopupMessage({ title: 'Filters Reset', message: 'All filters have been cleared', type: 'success' });
        setShowSuccessPopup(true);
    };

    // Table columns for ReusableTable
    const transactionColumns = [
        {
            Header: 'Theater',
            accessor: 'theaterName',
            sortable: true,
            Cell: (row: CommissionTransaction) => (
                <div>
                    <p className="font-medium text-gray-900">{row.theaterName}</p>
                    <p className="text-xs text-gray-500">{row.theaterLocation}</p>
                </div>
            )
        },
        {
            Header: 'Period',
            accessor: 'period',
            sortable: true,
            Cell: (row: CommissionTransaction) => (
                <p className="text-sm text-gray-600">
                    {formatDate(row.period.start)} - {formatDate(row.period.end)}
                </p>
            )
        },
        {
            Header: 'Revenue',
            accessor: 'totalRevenue',
            sortable: true,
            Cell: (row: CommissionTransaction) => (
                <p className="text-sm font-medium text-gray-900">{formatETB(row.totalRevenue)}</p>
            )
        },
        {
            Header: 'Commission',
            accessor: 'commissionAmount',
            sortable: true,
            Cell: (row: CommissionTransaction) => (
                <p className="text-sm font-bold text-teal-600">{formatETB(row.commissionAmount)}</p>
            )
        },
        {
            Header: 'Status',
            accessor: 'status',
            sortable: true,
            Cell: (row: CommissionTransaction) => getStatusBadge(row.status)
        },
        {
            Header: 'Payment Method',
            accessor: 'paymentMethod',
            sortable: true,
            Cell: (row: CommissionTransaction) => getPaymentMethodBadge(row.paymentMethod)
        },
        {
            Header: 'Due Date',
            accessor: 'dueDate',
            sortable: true,
            Cell: (row: CommissionTransaction) => (
                <p className="text-sm text-gray-600">{formatDate(row.dueDate)}</p>
            )
        }
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <RefreshCw className="h-12 w-12 animate-spin text-teal-600 mx-auto mb-4" />
                    <p className="text-gray-500">Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Commission Analytics</h1>
                    <p className="text-sm text-gray-500">Track and analyze theater commissions</p>
                </div>
                <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                    <Download className="h-4 w-4" /> Export CSV
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white rounded-xl p-5 shadow-lg border">
                    <div className="flex justify-between items-start mb-3">
                        <div className="p-3 bg-emerald-500 rounded-xl text-white"><Wallet className="h-5 w-5" /></div>
                        <span className="text-green-600 text-sm">+12.5%</span>
                    </div>
                    <p className="text-2xl font-bold">{formatETB(totals.totalCommission)}</p>
                    <p className="text-sm text-gray-500">Total Commission</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-lg border">
                    <div className="flex justify-between items-start mb-3">
                        <div className="p-3 bg-green-500 rounded-xl text-white"><Banknote className="h-5 w-5" /></div>
                        <span className="text-green-600 text-sm">+8.2%</span>
                    </div>
                    <p className="text-2xl font-bold">{formatETB(totals.cashTotal)}</p>
                    <p className="text-sm text-gray-500">Cash Payments</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-lg border">
                    <div className="flex justify-between items-start mb-3">
                        <div className="p-3 bg-blue-500 rounded-xl text-white"><Smartphone className="h-5 w-5" /></div>
                        <span className="text-green-600 text-sm">+15.3%</span>
                    </div>
                    <p className="text-2xl font-bold">{formatETB(totals.chapaTotal)}</p>
                    <p className="text-sm text-gray-500">Chapa Payments</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-lg border">
                    <div className="flex justify-between items-start mb-3">
                        <div className="p-3 bg-orange-500 rounded-xl text-white"><Clock className="h-5 w-5" /></div>
                        <span className="text-red-600 text-sm">-3.5%</span>
                    </div>
                    <p className="text-2xl font-bold">{formatETB(totals.pendingTotal + totals.overdueTotal)}</p>
                    <p className="text-sm text-gray-500">Pending + Overdue</p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by theater name or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                </div>
                <div className="w-[180px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                    >
                        <option value="all">All Status</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="overdue">Overdue</option>
                    </select>
                </div>
                <div className="w-[180px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                    <select
                        value={filterPaymentMethod}
                        onChange={(e) => setFilterPaymentMethod(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                    >
                        <option value="all">All Methods</option>
                        <option value="cash">Cash</option>
                        <option value="chapa">Chapa</option>
                        <option value="telebirr">Telebirr</option>
                        <option value="bank_transfer">Bank Transfer</option>
                    </select>
                </div>
                <div>
                    <button
                        onClick={handleResetFilters}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors mt-6"
                    >
                        <RefreshCw className="h-4 w-4 inline mr-2" />
                        Reset Filters
                    </button>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Area Chart - Commission Trend */}
                <div className="bg-white rounded-xl p-5 shadow-lg">
                    <h3 className="text-lg font-semibold mb-4">Commission Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={monthlyData}>
                            <defs>
                                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                            <XAxis dataKey="month" stroke="#6B7280" tick={{ fontSize: 12 }} />
                            <YAxis stroke="#6B7280" tickFormatter={(v) => `ETB ${v/1000}k`} tick={{ fontSize: 12 }} />
                            <Tooltip formatter={(value: any) => formatETB(value)} />
                            <Area type="monotone" dataKey="commission" stroke="#14b8a6" strokeWidth={2} fill="url(#areaGradient)" name="Commission" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart - Payment Methods */}
                <div className="bg-white rounded-xl p-5 shadow-lg">
                    <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <RePieChart>
                            <Pie
                                data={paymentMethodData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                            >
                                {paymentMethodData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: any) => formatETB(value)} />
                        </RePieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 grid grid-cols-3 gap-3">
                        {paymentMethodData.map((item, idx) => (
                            <div key={idx} className="text-center p-2 bg-gray-50 rounded-lg">
                                <p className="text-lg font-bold" style={{ color: item.color }}>{formatETB(item.value)}</p>
                                <p className="text-xs text-gray-500">{item.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bar Chart - Cash vs Chapa */}
            <div className="bg-white rounded-xl p-5 shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Cash vs Chapa Collection</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                        <XAxis dataKey="month" stroke="#6B7280" tick={{ fontSize: 12 }} />
                        <YAxis stroke="#6B7280" tickFormatter={(v) => `ETB ${v/1000}k`} tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(value: any) => formatETB(value)} />
                        <Legend />
                        <Bar dataKey="cash" name="Cash" fill="#10B981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="chapa" name="Chapa" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Top Theaters */}
            <div className="bg-white rounded-xl p-5 shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Top Performing Theaters</h3>
                <div className="space-y-3">
                    {filteredCommissions
                        .reduce((acc, curr) => {
                            const existing = acc.find(t => t.theaterName === curr.theaterName);
                            if (existing) {
                                existing.commissionAmount += curr.commissionAmount;
                            } else {
                                acc.push({ theaterName: curr.theaterName, commissionAmount: curr.commissionAmount });
                            }
                            return acc;
                        }, [] as { theaterName: string; commissionAmount: number }[])
                        .sort((a, b) => b.commissionAmount - a.commissionAmount)
                        .slice(0, 5)
                        .map((theater, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center font-bold text-teal-600">
                                        {idx + 1}
                                    </div>
                                    <span className="font-medium">{theater.theaterName}</span>
                                </div>
                                <span className="font-bold text-teal-600">{formatETB(theater.commissionAmount)}</span>
                            </div>
                        ))}
                </div>
            </div>

            {/* Commission Transactions Table using ReusableTable */}
            <ReusableTable
                columns={transactionColumns}
                data={filteredCommissions}
                title="Commission Transactions"
                icon={Receipt}
                showSearch={false}
                showExport={false}
                showPrint={false}
                itemsPerPage={10}
            />

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
    );
};

export default CommissionAnalytics;