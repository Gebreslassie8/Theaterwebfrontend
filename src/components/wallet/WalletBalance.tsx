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
    History
} from 'lucide-react';
import ReusableTable from '../Reusable/ReusableTable';
import ReusableButton from '../Reusable/ReusableButton';
import SuccessPopup from '../Reusable/SuccessPopup';

// Types
interface Transaction {
    id: string;
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    status: 'completed' | 'pending' | 'failed';
    date: string;
    reference: string;
}

interface WalletStats {
    balance: number;
    pendingBalance: number;
    lastTransaction: string;
}

// Mock Data
const mockTransactions: Transaction[] = [
    {
        id: 'TRX-001',
        type: 'credit',
        amount: 5000,
        description: 'Deposit via Chapa',
        status: 'completed',
        date: '2024-04-05T10:30:00',
        reference: 'CH-20240405-001'
    },
    {
        id: 'TRX-002',
        type: 'debit',
        amount: 1250,
        description: 'Theater Payout - Grand Theater',
        status: 'completed',
        date: '2024-04-04T15:20:00',
        reference: 'PO-20240404-001'
    },
    {
        id: 'TRX-003',
        type: 'credit',
        amount: 2500,
        description: 'Ticket Sales - The Lion King',
        status: 'completed',
        date: '2024-04-03T18:45:00',
        reference: 'SL-20240403-001'
    },
    {
        id: 'TRX-004',
        type: 'debit',
        amount: 350,
        description: 'Platform Fee',
        status: 'completed',
        date: '2024-04-02T09:15:00',
        reference: 'FEE-20240402-001'
    },
    {
        id: 'TRX-005',
        type: 'credit',
        amount: 1200,
        description: 'Refund - Customer Request',
        status: 'pending',
        date: '2024-04-01T14:30:00',
        reference: 'REF-20240401-001'
    },
    {
        id: 'TRX-006',
        type: 'credit',
        amount: 8000,
        description: 'Deposit via Chapa',
        status: 'completed',
        date: '2024-03-30T11:00:00',
        reference: 'CB-20240330-001'
    },
    {
        id: 'TRX-007',
        type: 'debit',
        amount: 2100,
        description: 'Theater Payout - City Cinema',
        status: 'pending',
        date: '2024-03-29T16:20:00',
        reference: 'PO-20240329-002'
    }
];

const WalletBalance: React.FC = () => {
    const [transactions] = useState<Transaction[]>(mockTransactions);
    const [showBalance, setShowBalance] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });

    // Wallet Statistics
    const [walletStats] = useState<WalletStats>({
        balance: 15850,
        pendingBalance: 2100,
        lastTransaction: '2024-04-05T10:30:00'
    });

    // Filter transactions
    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

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
        const csvContent = [
            ['ID', 'Type', 'Amount', 'Description', 'Status', 'Date', 'Reference'],
            ...transactions.map(t => [t.id, t.type, t.amount, t.description, t.status, t.date, t.reference])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wallet_transactions_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);

        setPopupMessage({
            title: 'Export Successful',
            message: 'Transactions exported to CSV',
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    // Custom export button for table header
    const tableActions = (
        <ReusableButton
            onClick={handleExport}
            icon="Download"
            label="Export Transactions"
            className="px-4 py-2 text-sm"
        />
    );

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
                            <h1 className="text-2xl font-bold text-gray-900">Wallet Balance</h1>
                            <p className="text-gray-600">Manage your system wallet and transactions</p>
                        </div>
                    </div>
                </motion.div>

                {/* Wallet Balance Card - Centered and Larger */}
                <div className="flex justify-center mb-10">
                    <div className="bg-gradient-to-br from-deepTeal to-deepBlue rounded-2xl p-8 text-white shadow-xl w-full max-w-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-white/20 rounded-xl">
                                    <Wallet className="h-8 w-8 text-white" />
                                </div>
                                <span className="text-white/80 text-lg font-medium">Total Balance</span>
                            </div>
                            <button
                                onClick={() => setShowBalance(!showBalance)}
                                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                            >
                                {showBalance ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        <div className="mb-6 text-center">
                            <p className="text-6xl font-bold">
                                {showBalance ? formatCurrency(walletStats.balance) : '••••••'}
                            </p>
                            <p className="text-white/70 text-base mt-2">
                                Available for withdrawal
                            </p>
                        </div>
                        <div className="flex justify-center gap-8 pt-6 border-t border-white/20">
                            <div className="text-center">
                                <p className="text-white/70 text-sm">Pending</p>
                                <p className="font-semibold text-xl">{formatCurrency(walletStats.pendingBalance)}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-white/70 text-sm">Last Transaction</p>
                                <p className="font-semibold text-base">{formatDate(walletStats.lastTransaction)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative min-w-[250px]">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                            />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 bg-white min-w-[140px]"
                        >
                            <option value="all">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                </div>

                {/* Transactions Table with Export Button in Header */}
                <ReusableTable
                    columns={transactionColumns}
                    data={filteredTransactions}
                    title="Transaction History"
                    icon={History}
                    actions={tableActions}
                    showSearch={false}
                    showExport={false}
                    showPrint={false}
                    itemsPerPage={10}
                />

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