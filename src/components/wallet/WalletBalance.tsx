// src/pages/Admin/wallet/WalletBalance.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wallet,
    Coins,
    TrendingUp,
    TrendingDown,
    RefreshCw,
    Eye,
    EyeOff,
    Download,
    Printer,
    Calendar,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    CreditCard,
    Banknote,
    Landmark,
    Smartphone,
    History,
    Lock,
    ShieldCheck,
    AlertCircle,
    CheckCircle,
    XCircle,
    Plus,
    Minus,
    Search,
    Filter,
    X
} from 'lucide-react';
import ReusableTable from '../Reusable/ReusableTable';
import ReusableButton from '../Reusable/ReusableButton';
import SuccessPopup from '../Reusable/SuccessPopup';
import DepositFunds from './DepositFunds';
import WithdrawFunds from './WithdrawFunds';
import TransactionHistory from './TransactionHistory';
import * as Yup from 'yup';

// Types
interface Transaction {
    id: string;
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    category: 'deposit' | 'withdrawal' | 'refund' | 'payout' | 'fee' | 'bonus';
    status: 'completed' | 'pending' | 'failed';
    date: string;
    reference: string;
    paymentMethod: 'chapa' | 'telebirr' | 'cbebirr' | 'hellocash' | 'bank';
    user?: string;
    note?: string;
}

interface WalletStats {
    balance: number;
    pendingBalance: number;
    totalDeposits: number;
    totalWithdrawals: number;
    totalRefunds: number;
    totalFees: number;
    thisMonthDeposits: number;
    thisMonthWithdrawals: number;
    lastTransaction: string;
}

// Mock Data
const mockTransactions: Transaction[] = [
    {
        id: 'TRX-001',
        type: 'credit',
        amount: 5000,
        description: 'Deposit via Chapa',
        category: 'deposit',
        status: 'completed',
        date: '2024-04-05T10:30:00',
        reference: 'CH-20240405-001',
        paymentMethod: 'chapa'
    },
    {
        id: 'TRX-002',
        type: 'debit',
        amount: 1250,
        description: 'Theater Payout - Grand Theater',
        category: 'payout',
        status: 'completed',
        date: '2024-04-04T15:20:00',
        reference: 'PO-20240404-001',
        paymentMethod: 'bank'
    },
    {
        id: 'TRX-003',
        type: 'credit',
        amount: 2500,
        description: 'Ticket Sales - The Lion King',
        category: 'deposit',
        status: 'completed',
        date: '2024-04-03T18:45:00',
        reference: 'SL-20240403-001',
        paymentMethod: 'telebirr'
    },
    {
        id: 'TRX-004',
        type: 'debit',
        amount: 350,
        description: 'Platform Fee',
        category: 'fee',
        status: 'completed',
        date: '2024-04-02T09:15:00',
        reference: 'FEE-20240402-001',
        paymentMethod: 'chapa'
    },
    {
        id: 'TRX-005',
        type: 'credit',
        amount: 1200,
        description: 'Refund - Customer Request',
        category: 'refund',
        status: 'pending',
        date: '2024-04-01T14:30:00',
        reference: 'REF-20240401-001',
        paymentMethod: 'cbebirr'
    },
    {
        id: 'TRX-006',
        type: 'credit',
        amount: 8000,
        description: 'Deposit via CBE Birr',
        category: 'deposit',
        status: 'completed',
        date: '2024-03-30T11:00:00',
        reference: 'CB-20240330-001',
        paymentMethod: 'cbebirr'
    },
    {
        id: 'TRX-007',
        type: 'debit',
        amount: 2100,
        description: 'Theater Payout - City Cinema',
        category: 'payout',
        status: 'pending',
        date: '2024-03-29T16:20:00',
        reference: 'PO-20240329-002',
        paymentMethod: 'bank'
    }
];

const WalletBalance: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
    const [showBalance, setShowBalance] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });
    const [isLoading, setIsLoading] = useState(false);

    // Modal states
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [showTransactionHistoryModal, setShowTransactionHistoryModal] = useState(false);

    // Wallet Statistics
    const [walletStats, setWalletStats] = useState<WalletStats>({
        balance: 15850,
        pendingBalance: 2100,
        totalDeposits: 42500,
        totalWithdrawals: 18750,
        totalRefunds: 1200,
        totalFees: 2450,
        thisMonthDeposits: 8750,
        thisMonthWithdrawals: 1250,
        lastTransaction: '2024-04-05T10:30:00'
    });

    // Filter transactions
    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || transaction.type === filterType;
        const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
        return matchesSearch && matchesType && matchesStatus;
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

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'deposit':
                return <ArrowUpRight className="h-4 w-4 text-green-500" />;
            case 'withdrawal':
            case 'payout':
                return <ArrowDownRight className="h-4 w-4 text-red-500" />;
            case 'refund':
                return <RefreshCw className="h-4 w-4 text-blue-500" />;
            case 'fee':
                return <DollarSign className="h-4 w-4 text-orange-500" />;
            default:
                return <Coins className="h-4 w-4 text-gray-500" />;
        }
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

    const getPaymentMethodIcon = (method: string) => {
        switch (method) {
            case 'chapa':
                return <CreditCard className="h-4 w-4 text-teal-500" />;
            case 'telebirr':
                return <Smartphone className="h-4 w-4 text-green-500" />;
            case 'cbebirr':
                return <Landmark className="h-4 w-4 text-blue-500" />;
            case 'hellocash':
                return <Smartphone className="h-4 w-4 text-orange-500" />;
            default:
                return <Banknote className="h-4 w-4 text-gray-500" />;
        }
    };

    const handleRefresh = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setPopupMessage({
                title: 'Wallet Updated',
                message: 'Your wallet balance has been refreshed',
                type: 'success'
            });
            setShowSuccessPopup(true);
        }, 1000);
    };

    const handleExport = () => {
        const csvContent = [
            ['ID', 'Type', 'Amount', 'Description', 'Category', 'Status', 'Date', 'Reference', 'Payment Method'],
            ...transactions.map(t => [t.id, t.type, t.amount, t.description, t.category, t.status, t.date, t.reference, t.paymentMethod])
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

    // Handle successful deposit
    const handleDepositSuccess = (amount: number, reference: string) => {
        const newTransaction: Transaction = {
            id: `TRX-${Date.now()}`,
            type: 'credit',
            amount: amount,
            description: 'Deposit via Chapa',
            category: 'deposit',
            status: 'completed',
            date: new Date().toISOString(),
            reference: reference,
            paymentMethod: 'chapa'
        };

        setTransactions([newTransaction, ...transactions]);
        setWalletStats({
            ...walletStats,
            balance: walletStats.balance + amount,
            totalDeposits: walletStats.totalDeposits + amount,
            thisMonthDeposits: walletStats.thisMonthDeposits + amount,
            lastTransaction: new Date().toISOString()
        });

        setShowDepositModal(false);
        setPopupMessage({
            title: 'Deposit Successful!',
            message: `${formatCurrency(amount)} has been added to your wallet. Reference: ${reference}`,
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    // Handle successful withdrawal
    const handleWithdrawSuccess = (amount: number, reference: string) => {
        const newTransaction: Transaction = {
            id: `TRX-${Date.now()}`,
            type: 'debit',
            amount: amount,
            description: 'Withdrawal request',
            category: 'withdrawal',
            status: 'pending',
            date: new Date().toISOString(),
            reference: reference,
            paymentMethod: 'bank'
        };

        setTransactions([newTransaction, ...transactions]);
        setWalletStats({
            ...walletStats,
            balance: walletStats.balance - amount,
            totalWithdrawals: walletStats.totalWithdrawals + amount,
            thisMonthWithdrawals: walletStats.thisMonthWithdrawals + amount,
            pendingBalance: walletStats.pendingBalance + amount,
            lastTransaction: new Date().toISOString()
        });

        setShowWithdrawModal(false);
        setPopupMessage({
            title: 'Withdrawal Request Submitted!',
            message: `Your withdrawal request of ${formatCurrency(amount)} has been submitted. Reference: ${reference}`,
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
            Header: 'Payment Method',
            accessor: 'paymentMethod',
            sortable: true,
            Cell: (row: Transaction) => (
                <div className="flex items-center gap-1.5">
                    {getPaymentMethodIcon(row.paymentMethod)}
                    <span className="text-sm text-gray-600 capitalize">{row.paymentMethod}</span>
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
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                                    <Wallet className="h-6 w-6 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">Wallet Balance</h1>
                            </div>
                            <p className="text-gray-600">Manage your system wallet and transactions</p>
                        </div>
                        <div className="flex gap-2">
                            <ReusableButton
                                onClick={handleRefresh}
                                icon="RefreshCw"
                                label="Refresh"
                                className="px-4 py-2 text-sm"
                            />
                            <ReusableButton
                                onClick={handleExport}
                                icon="Download"
                                label="Export"
                                className="px-4 py-2 text-sm"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Wallet Balance Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Main Balance Card */}
                    <div className="lg:col-span-2 bg-gradient-to-br from-deepTeal to-deepBlue rounded-2xl p-6 text-white shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Wallet className="h-6 w-6 text-white/80" />
                                <span className="text-white/80 text-sm">Total Balance</span>
                            </div>
                            <button
                                onClick={() => setShowBalance(!showBalance)}
                                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition"
                            >
                                {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        <div className="mb-4">
                            <p className="text-4xl font-bold">
                                {showBalance ? formatCurrency(walletStats.balance) : '••••••'}
                            </p>
                            <p className="text-white/70 text-sm mt-1">
                                Available for withdrawal
                            </p>
                        </div>
                        <div className="flex gap-4 pt-4 border-t border-white/20">
                            <div>
                                <p className="text-white/70 text-xs">Pending</p>
                                <p className="font-semibold">{formatCurrency(walletStats.pendingBalance)}</p>
                            </div>
                            <div>
                                <p className="text-white/70 text-xs">Last Transaction</p>
                                <p className="font-semibold text-sm">{formatDate(walletStats.lastTransaction)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <TrendingUp className="h-4 w-4 text-green-600" />
                                    </div>
                                    <span className="text-sm text-gray-500">Total Deposits</span>
                                </div>
                                <span className="text-lg font-bold text-green-600">{formatCurrency(walletStats.totalDeposits)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <TrendingDown className="h-4 w-4 text-red-600" />
                                    </div>
                                    <span className="text-sm text-gray-500">Total Withdrawals</span>
                                </div>
                                <span className="text-lg font-bold text-red-600">{formatCurrency(walletStats.totalWithdrawals)}</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Calendar className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <span className="text-sm text-gray-500">This Month</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-green-600">+{formatCurrency(walletStats.thisMonthDeposits)}</p>
                                    <p className="text-sm font-medium text-red-600">-{formatCurrency(walletStats.thisMonthWithdrawals)}</p>
                                </div>
                            </div>
                            <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-green-500 rounded-full"
                                    style={{ width: `${(walletStats.thisMonthDeposits / (walletStats.thisMonthDeposits + walletStats.thisMonthWithdrawals)) * 100}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">Net: {formatCurrency(walletStats.thisMonthDeposits - walletStats.thisMonthWithdrawals)}</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <ReusableButton
                        onClick={() => setShowDepositModal(true)}
                        icon="Plus"
                        label="Deposit Funds"
                        className="px-5 py-2.5 text-sm whitespace-nowrap"
                    />
                    <ReusableButton
                        onClick={() => setShowWithdrawModal(true)}
                        icon="Minus"
                        label="Withdraw Funds"
                        className="px-5 py-2.5 text-sm whitespace-nowrap"
                    />
                    <ReusableButton
                        onClick={() => setShowTransactionHistoryModal(true)}
                        icon="History"
                        label="Transaction History"
                        className="px-5 py-2.5 text-sm whitespace-nowrap"
                    />
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
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 bg-white min-w-[140px]"
                        >
                            <option value="all">All Types</option>
                            <option value="credit">Credits</option>
                            <option value="debit">Debits</option>
                        </select>
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

                {/* Transactions Table */}
                <ReusableTable
                    columns={transactionColumns}
                    data={filteredTransactions}
                    title="Recent Transactions"
                    icon={History}
                    showSearch={false}
                    showExport={false}
                    showPrint={false}
                    itemsPerPage={10}
                />

                {/* Deposit Modal */}
                <AnimatePresence>
                    {showDepositModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                            onClick={() => setShowDepositModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <Plus className="h-5 w-5 text-green-600" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Deposit Funds</h2>
                                    </div>
                                    <button
                                        onClick={() => setShowDepositModal(false)}
                                        className="p-1 hover:bg-gray-100 rounded-lg transition"
                                    >
                                        <X className="h-5 w-5 text-gray-500" />
                                    </button>
                                </div>
                                <div className="p-6">
                                    <DepositFunds onSuccess={handleDepositSuccess} />
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Withdraw Modal */}
                <AnimatePresence>
                    {showWithdrawModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                            onClick={() => setShowWithdrawModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-red-100 rounded-lg">
                                            <Minus className="h-5 w-5 text-red-600" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Withdraw Funds</h2>
                                    </div>
                                    <button
                                        onClick={() => setShowWithdrawModal(false)}
                                        className="p-1 hover:bg-gray-100 rounded-lg transition"
                                    >
                                        <X className="h-5 w-5 text-gray-500" />
                                    </button>
                                </div>
                                <div className="p-6">
                                    <WithdrawFunds onSuccess={handleWithdrawSuccess} />
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Transaction History Modal */}
                <AnimatePresence>
                    {showTransactionHistoryModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                            onClick={() => setShowTransactionHistoryModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <History className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Transaction History</h2>
                                    </div>
                                    <button
                                        onClick={() => setShowTransactionHistoryModal(false)}
                                        className="p-1 hover:bg-gray-100 rounded-lg transition"
                                    >
                                        <X className="h-5 w-5 text-gray-500" />
                                    </button>
                                </div>
                                <div className="p-6">
                                    <TransactionHistory />
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Loading Overlay */}
                {isLoading && (
                    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
                        <div className="bg-white rounded-2xl p-6 flex items-center gap-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                            <span className="text-gray-600">Refreshing wallet...</span>
                        </div>
                    </div>
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