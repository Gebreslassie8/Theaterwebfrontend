// src/pages/Admin/wallet/WalletBalance.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Wallet,
    Eye,
    EyeOff,
    Download,
    Clock,
    CheckCircle,
    XCircle,
    Search,
    History,
    Building,
    TrendingUp,
    Users
} from 'lucide-react';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';

// Types
interface Transaction {
    id: string;
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    status: 'completed' | 'pending' | 'failed';
    date: string;
    reference: string;
    source?: 'system' | 'theater';
    theaterName?: string;
}

interface WalletStats {
    systemBalance: number;
    theatersTotalBalance: number;
    lastTransaction: string;
}

interface TheaterBalance {
    id: string;
    name: string;
    balance: number;
    totalEarned: number;
    lastPayout: string;
}

// Mock Data
const mockSystemTransactions: Transaction[] = [
    {
        id: 'SYS-001',
        type: 'credit',
        amount: 5000,
        description: 'Commission from Grand Theater',
        status: 'completed',
        date: '2024-04-05T10:30:00',
        reference: 'COM-20240405-001',
        source: 'system'
    },
    {
        id: 'SYS-002',
        type: 'debit',
        amount: 1250,
        description: 'Withdrawal Request - Admin',
        status: 'completed',
        date: '2024-04-04T15:20:00',
        reference: 'WDR-20240404-001',
        source: 'system'
    },
    {
        id: 'SYS-003',
        type: 'credit',
        amount: 2500,
        description: 'Commission from Star Multiplex',
        status: 'completed',
        date: '2024-04-03T18:45:00',
        reference: 'COM-20240403-002',
        source: 'system'
    },
    {
        id: 'SYS-004',
        type: 'debit',
        amount: 350,
        description: 'Platform Maintenance Fee',
        status: 'completed',
        date: '2024-04-02T09:15:00',
        reference: 'FEE-20240402-001',
        source: 'system'
    }
];

const mockTheaterBalances: TheaterBalance[] = [
    { id: 'th-1', name: 'Grand Theater', balance: 12450, totalEarned: 45600, lastPayout: '2024-03-28' },
    { id: 'th-2', name: 'Star Multiplex', balance: 8750, totalEarned: 32400, lastPayout: '2024-03-25' },
    { id: 'th-3', name: 'City Cinema', balance: 5200, totalEarned: 18900, lastPayout: '2024-03-20' },
    { id: 'th-4', name: 'Oasis Cinema', balance: 3400, totalEarned: 12500, lastPayout: '2024-03-30' },
    { id: 'th-5', name: 'Plaza Cinema', balance: 9200, totalEarned: 28700, lastPayout: '2024-03-27' }
];

const WalletBalance: React.FC = () => {
    const [systemTransactions] = useState<Transaction[]>(mockSystemTransactions);
    const [theaterBalances] = useState<TheaterBalance[]>(mockTheaterBalances);
    const [activeTab, setActiveTab] = useState<'system' | 'theaters'>('system');
    const [showBalance, setShowBalance] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });

    // Wallet Statistics - Simplified
    const [walletStats] = useState<WalletStats>({
        systemBalance: 15850,
        theatersTotalBalance: 38900,
        lastTransaction: '2024-04-05T20:00:00'
    });

    // Filter transactions
    const getFilteredTransactions = () => {
        let filtered = systemTransactions;
        
        filtered = filtered.filter(t => {
            const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
            return matchesSearch && matchesStatus;
        });
        
        return filtered;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'ETB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /> Completed</span>;
            case 'pending':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3" /> Pending</span>;
            case 'failed':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"><XCircle className="h-3 w-3" /> Failed</span>;
            default:
                return null;
        }
    };

    const handleExport = () => {
        const transactions = getFilteredTransactions();
        const csvContent = [
            ['ID', 'Type', 'Amount', 'Description', 'Status', 'Date', 'Reference'],
            ...transactions.map(t => [t.id, t.type, t.amount, t.description, t.status, t.date, t.reference])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `system_transactions_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);

        setPopupMessage({
            title: 'Export Successful',
            message: 'Transactions exported to CSV',
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    // Column definitions for transactions table
    const transactionColumns = [
        {
            Header: 'Transaction',
            accessor: 'description',
            sortable: true,
            Cell: (row: Transaction) => (
                <div>
                    <p className="font-medium text-gray-900">{row.description}</p>
                    <p className="text-xs text-gray-500">{row.reference}</p>
                </div>
            )
        },
        {
            Header: 'Amount',
            accessor: 'amount',
            sortable: true,
            Cell: (row: Transaction) => (
                <div className={`flex items-center gap-1 font-semibold ${row.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                    {row.type === 'credit' ? '+' : '-'} {formatCurrency(row.amount)}
                </div>
            )
        },
        {
            Header: 'Date & Time',
            accessor: 'date',
            sortable: true,
            Cell: (row: Transaction) => (
                <div>
                    <p className="text-sm text-gray-900">{formatDate(row.date)}</p>
                    <p className="text-xs text-gray-500">{formatTime(row.date)}</p>
                </div>
            )
        },
        {
            Header: 'Status',
            accessor: 'status',
            sortable: true,
            Cell: (row: Transaction) => getStatusBadge(row.status)
        }
    ];

    // Column definitions for theater balances table
    const theaterColumns = [
        {
            Header: 'Theater',
            accessor: 'name',
            sortable: true,
            Cell: (row: TheaterBalance) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                        <Building className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{row.name}</p>
                        <p className="text-xs text-gray-500">ID: {row.id}</p>
                    </div>
                </div>
            )
        },
        {
            Header: 'Balance',
            accessor: 'balance',
            sortable: true,
            Cell: (row: TheaterBalance) => (
                <p className="font-bold text-gray-900">{formatCurrency(row.balance)}</p>
            )
        },
        {
            Header: 'Total Earned',
            accessor: 'totalEarned',
            sortable: true,
            Cell: (row: TheaterBalance) => (
                <p className="font-semibold text-green-600">{formatCurrency(row.totalEarned)}</p>
            )
        },
        {
            Header: 'Last Payout',
            accessor: 'lastPayout',
            sortable: true,
            Cell: (row: TheaterBalance) => (
                <p className="text-sm text-gray-900">{formatDate(row.lastPayout)}</p>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                            <Wallet className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Wallet Management</h1>
                            <p className="text-gray-600">Manage system balance and theater balances</p>
                        </div>
                    </div>
                </motion.div>

                {/* Two Balance Cards - Simplified */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                    {/* System Balance Card */}
                    <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 text-white shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-white/20 rounded-xl">
                                    <Wallet className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-white/80 font-medium">System Balance</span>
                            </div>
                            <button
                                onClick={() => setShowBalance(!showBalance)}
                                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                            >
                                {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        <div>
                            <p className="text-5xl font-bold">
                                {showBalance ? formatCurrency(walletStats.systemBalance) : '••••••'}
                            </p>
                            <p className="text-white/70 text-sm mt-3">
                                Last update: {formatDate(walletStats.lastTransaction)}
                            </p>
                        </div>
                    </div>

                    {/* All Theaters Balance Card */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 bg-white/20 rounded-xl">
                                <Building className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-white/80 font-medium">All Theaters Balance</span>
                        </div>
                        <div>
                            <p className="text-5xl font-bold">
                                {showBalance ? formatCurrency(walletStats.theatersTotalBalance) : '••••••'}
                            </p>
                            <p className="text-white/70 text-sm mt-3">
                                Total across {theaterBalances.length} theaters
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex bg-gray-100 rounded-lg p-1 mb-6 w-fit">
                    <button
                        onClick={() => setActiveTab('system')}
                        className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                            activeTab === 'system' 
                                ? 'bg-teal-600 text-white shadow-sm' 
                                : 'text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <History className="h-4 w-4" />
                        System Transactions
                    </button>
                    <button
                        onClick={() => setActiveTab('theaters')}
                        className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                            activeTab === 'theaters' 
                                ? 'bg-teal-600 text-white shadow-sm' 
                                : 'text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <Building className="h-4 w-4" />
                        Theater Balances
                    </button>
                </div>

                {/* Search and Filters */}
                {activeTab === 'system' && (
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative min-w-[250px]">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search transactions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                                />
                            </div>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white min-w-[140px]"
                            >
                                <option value="all">All Status</option>
                                <option value="completed">Completed</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Failed</option>
                            </select>
                        </div>
                        <ReusableButton
                            onClick={handleExport}
                            icon="Download"
                            label="Export Transactions"
                            className="px-4 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white"
                        />
                    </div>
                )}

                {/* Content based on active tab */}
                {activeTab === 'system' ? (
                    <ReusableTable
                        columns={transactionColumns}
                        data={getFilteredTransactions()}
                        title="System Transaction History"
                        icon={History}
                        showSearch={false}
                        showExport={false}
                        showPrint={false}
                        itemsPerPage={10}
                    />
                ) : (
                    <>
                        <ReusableTable
                            columns={theaterColumns}
                            data={theaterBalances}
                            title="Theater Balances"
                            icon={Building}
                            showSearch={false}
                            showExport={false}
                            showPrint={false}
                            itemsPerPage={10}
                        />
                    </>
                )}

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

export default WalletBalance;