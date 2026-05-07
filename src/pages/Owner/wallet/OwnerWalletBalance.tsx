// src/pages/Owner/wallet/OwnerWalletBalance.tsx
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
    TrendingUp,
    ArrowUpRight,
    Send,
    AlertCircle,
    User,
    Users,
    Building,
    Calendar,
    Ticket,
    Star
} from 'lucide-react';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import ReusableButton from '../../../components/Reusable/ReusableButton';
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
    source?: 'owner' | 'producer';
    producerName?: string;
    eventName?: string;
}

interface OwnerWalletStats {
    ownerBalance: number;
    ownerTotalEarned: number;
    ownerPendingWithdrawal: number;
    producerBalance: number;
    producerTotalEarned: number;
    producerPendingPayout: number;
    lastTransaction: string;
}

interface ProducerTransaction {
    id: string;
    producerName: string;
    eventName: string;
    amount: number;
    type: 'commission' | 'payout';
    status: 'completed' | 'pending';
    date: string;
    reference: string;
}

interface WithdrawalRequest {
    id: string;
    amount: number;
    status: 'pending' | 'approved' | 'rejected';
    requestDate: string;
    processedDate?: string;
    bankAccount: string;
    accountName: string;
    type: 'owner' | 'producer';
    producerName?: string;
}

// Mock Data
const mockOwnerTransactions: Transaction[] = [
    {
        id: 'OWN-001',
        type: 'credit',
        amount: 5000,
        description: 'Commission from The Lion King (Hall A)',
        status: 'completed',
        date: '2024-04-05T10:30:00',
        reference: 'COM-20240405-001',
        source: 'owner'
    },
    {
        id: 'OWN-002',
        type: 'credit',
        amount: 3500,
        description: 'Commission from Hamilton (Hall B)',
        status: 'completed',
        date: '2024-04-04T15:20:00',
        reference: 'COM-20240404-002',
        source: 'owner'
    },
    {
        id: 'OWN-003',
        type: 'debit',
        amount: 2500,
        description: 'Withdrawal Request',
        status: 'pending',
        date: '2024-04-03T18:45:00',
        reference: 'WDR-20240403-001',
        source: 'owner'
    },
    {
        id: 'OWN-004',
        type: 'credit',
        amount: 2800,
        description: 'Commission from Wicked (Hall C)',
        status: 'completed',
        date: '2024-04-02T09:15:00',
        reference: 'COM-20240402-003',
        source: 'owner'
    }
];

const mockProducerTransactions: ProducerTransaction[] = [
    {
        id: 'PROD-001',
        producerName: 'Sunset Entertainment',
        eventName: 'The Lion King',
        amount: 15000,
        type: 'commission',
        status: 'completed',
        date: '2024-04-05T10:30:00',
        reference: 'COM-PROD-001'
    },
    {
        id: 'PROD-002',
        producerName: 'Star Productions',
        eventName: 'Hamilton',
        amount: 12000,
        type: 'commission',
        status: 'completed',
        date: '2024-04-04T15:20:00',
        reference: 'COM-PROD-002'
    },
    {
        id: 'PROD-003',
        producerName: 'Sunset Entertainment',
        eventName: 'Wicked',
        amount: 5000,
        type: 'payout',
        status: 'pending',
        date: '2024-04-03T18:45:00',
        reference: 'PAY-PROD-001'
    }
];

const mockWithdrawalRequests: WithdrawalRequest[] = [
    {
        id: 'WDR-001',
        amount: 2500,
        status: 'pending',
        requestDate: '2024-04-03T18:45:00',
        bankAccount: '1000123456789',
        accountName: 'John Doe',
        type: 'owner'
    },
    {
        id: 'WDR-002',
        amount: 3000,
        status: 'approved',
        requestDate: '2024-03-28T10:30:00',
        processedDate: '2024-03-29T14:00:00',
        bankAccount: '1000123456789',
        accountName: 'John Doe',
        type: 'owner'
    },
    {
        id: 'WDR-003',
        amount: 2000,
        status: 'rejected',
        requestDate: '2024-03-20T09:15:00',
        processedDate: '2024-03-21T11:00:00',
        bankAccount: '1000123456789',
        accountName: 'John Doe',
        type: 'owner'
    }
];

const OwnerWalletBalance: React.FC = () => {
    const [transactions] = useState<Transaction[]>(mockOwnerTransactions);
    const [producerTransactions] = useState<ProducerTransaction[]>(mockProducerTransactions);
    const [withdrawalRequests] = useState<WithdrawalRequest[]>(mockWithdrawalRequests);
    const [showBalance, setShowBalance] = useState(true);
    const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
    const [withdrawalAmount, setWithdrawalAmount] = useState('');
    const [bankAccount, setBankAccount] = useState('');
    const [accountName, setAccountName] = useState('');
    const [activeTab, setActiveTab] = useState<'owner' | 'producer'>('owner');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });

    // Wallet Statistics - Separate balances
    const [walletStats] = useState<OwnerWalletStats>({
        ownerBalance: 12450,
        ownerTotalEarned: 45600,
        ownerPendingWithdrawal: 2500,
        producerBalance: 32000,
        producerTotalEarned: 125000,
        producerPendingPayout: 5000,
        lastTransaction: '2024-04-05T10:30:00'
    });

    // Filter owner transactions
    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Filter producer transactions
    const filteredProducerTransactions = producerTransactions.filter(transaction => {
        const matchesSearch = transaction.producerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
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

    const getProducerStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /> Completed</span>;
            case 'pending':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3" /> Pending Payout</span>;
            default:
                return null;
        }
    };

    const getWithdrawalStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /> Approved</span>;
            case 'pending':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3" /> Pending</span>;
            case 'rejected':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"><XCircle className="h-3 w-3" /> Rejected</span>;
            default:
                return null;
        }
    };

    const handleExport = () => {
        const dataToExport = activeTab === 'owner' ? filteredTransactions : filteredProducerTransactions;
        const csvContent = activeTab === 'owner' 
            ? [
                ['ID', 'Type', 'Amount', 'Description', 'Status', 'Date', 'Reference'],
                ...dataToExport.map(t => [t.id, t.type, t.amount, t.description, t.status, t.date, t.reference])
            ]
            : [
                ['ID', 'Producer', 'Event', 'Amount', 'Type', 'Status', 'Date', 'Reference'],
                ...dataToExport.map(t => [t.id, t.producerName, t.eventName, t.amount, t.type, t.status, t.date, t.reference])
            ];
        
        const csv = csvContent.map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${activeTab}_wallet_transactions_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);

        setPopupMessage({
            title: 'Export Successful',
            message: 'Transactions exported to CSV',
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    const handleWithdrawalRequest = () => {
        if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
            setPopupMessage({
                title: 'Error',
                message: 'Please enter a valid amount',
                type: 'error'
            });
            setShowSuccessPopup(true);
            return;
        }

        if (parseFloat(withdrawalAmount) > walletStats.ownerBalance) {
            setPopupMessage({
                title: 'Error',
                message: 'Insufficient balance for withdrawal',
                type: 'error'
            });
            setShowSuccessPopup(true);
            return;
        }

        if (!bankAccount) {
            setPopupMessage({
                title: 'Error',
                message: 'Please enter bank account number',
                type: 'error'
            });
            setShowSuccessPopup(true);
            return;
        }

        if (!accountName) {
            setPopupMessage({
                title: 'Error',
                message: 'Please enter account holder name',
                type: 'error'
            });
            setShowSuccessPopup(true);
            return;
        }

        setPopupMessage({
            title: 'Request Submitted',
            message: `Your withdrawal request of ${formatCurrency(parseFloat(withdrawalAmount))} has been submitted for approval`,
            type: 'success'
        });
        setShowSuccessPopup(true);
        setShowWithdrawalModal(false);
        setWithdrawalAmount('');
        setBankAccount('');
        setAccountName('');
    };

    // Column definitions for owner transactions table
    const ownerTransactionColumns = [
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

    // Column definitions for producer transactions table
    const producerTransactionColumns = [
        {
            Header: 'Producer',
            accessor: 'producerName',
            sortable: true,
            Cell: (row: ProducerTransaction) => (
                <div>
                    <p className="font-medium text-gray-900">{row.producerName}</p>
                    <p className="text-xs text-gray-500">{row.eventName}</p>
                </div>
            )
        },
        {
            Header: 'Amount',
            accessor: 'amount',
            sortable: true,
            Cell: (row: ProducerTransaction) => (
                <div className={`flex items-center gap-1 font-semibold ${row.type === 'commission' ? 'text-green-600' : 'text-orange-600'}`}>
                    {row.type === 'commission' ? '+' : '-'} {formatCurrency(row.amount)}
                </div>
            )
        },
        {
            Header: 'Type',
            accessor: 'type',
            sortable: true,
            Cell: (row: ProducerTransaction) => (
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${row.type === 'commission' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {row.type === 'commission' ? 'Commission' : 'Payout'}
                </span>
            )
        },
        {
            Header: 'Date',
            accessor: 'date',
            sortable: true,
            Cell: (row: ProducerTransaction) => (
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
            Cell: (row: ProducerTransaction) => getProducerStatusBadge(row.status)
        }
    ];

    // Column definitions for withdrawal requests table
    const withdrawalColumns = [
        {
            Header: 'Request ID',
            accessor: 'id',
            sortable: true,
            Cell: (row: WithdrawalRequest) => (
                <p className="font-medium text-gray-900">{row.id}</p>
            )
        },
        {
            Header: 'Amount',
            accessor: 'amount',
            sortable: true,
            Cell: (row: WithdrawalRequest) => (
                <p className="font-semibold text-gray-900">{formatCurrency(row.amount)}</p>
            )
        },
        {
            Header: 'Bank Account',
            accessor: 'bankAccount',
            sortable: true,
            Cell: (row: WithdrawalRequest) => (
                <div>
                    <p className="text-sm text-gray-900">{row.bankAccount}</p>
                    <p className="text-xs text-gray-500">{row.accountName}</p>
                </div>
            )
        },
        {
            Header: 'Request Date',
            accessor: 'requestDate',
            sortable: true,
            Cell: (row: WithdrawalRequest) => (
                <div>
                    <p className="text-sm text-gray-900">{formatDate(row.requestDate)}</p>
                    <p className="text-xs text-gray-500">{formatTime(row.requestDate)}</p>
                </div>
            )
        },
        {
            Header: 'Status',
            accessor: 'status',
            sortable: true,
            Cell: (row: WithdrawalRequest) => getWithdrawalStatusBadge(row.status)
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl shadow-lg">
                            <Wallet className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">My Wallet</h1>
                            <p className="text-gray-600">Manage your earnings and event producer balances</p>
                        </div>
                    </div>
                </motion.div>

                {/* Two Separate Balance Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                    {/* Owner Balance Card - Deep Teal */}
                    <div className="bg-gradient-to-br from-teal-700 to-teal-800 rounded-2xl p-6 text-white shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-white/20 rounded-xl">
                                    <User className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-white/80 font-medium">Owner Balance</span>
                            </div>
                            <button
                                onClick={() => setShowBalance(!showBalance)}
                                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                            >
                                {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        <div className="mb-4">
                            <p className="text-5xl font-bold">
                                {showBalance ? formatCurrency(walletStats.ownerBalance) : '••••••'}
                            </p>
                            <p className="text-white/70 text-sm mt-2">
                                Total earned: {formatCurrency(walletStats.ownerTotalEarned)}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                            <div>
                                <p className="text-white/70 text-xs">Pending Withdrawal</p>
                                <p className="font-semibold text-lg">{formatCurrency(walletStats.ownerPendingWithdrawal)}</p>
                            </div>
                            <div>
                                <p className="text-white/70 text-xs">Last Transaction</p>
                                <p className="font-semibold text-sm">{formatDate(walletStats.lastTransaction)}</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={() => setShowWithdrawalModal(true)}
                                className="w-full py-2.5 bg-white text-teal-700 rounded-xl font-semibold hover:bg-gray-100 transition flex items-center justify-center gap-2"
                            >
                                <Send className="h-4 w-4" />
                                Request Withdrawal
                            </button>
                        </div>
                    </div>

                    {/* Event Producer Balance Card - Deep Blue */}
                    <div className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-2xl p-6 text-white shadow-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 bg-white/20 rounded-xl">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-white/80 font-medium">Event Producer Balance</span>
                        </div>
                        <div className="mb-4">
                            <p className="text-5xl font-bold">
                                {showBalance ? formatCurrency(walletStats.producerBalance) : '••••••'}
                            </p>
                            <p className="text-white/70 text-sm mt-2">
                                Total earned across all producers: {formatCurrency(walletStats.producerTotalEarned)}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                            <div>
                                <p className="text-white/70 text-xs">Pending Payouts</p>
                                <p className="font-semibold text-lg">{formatCurrency(walletStats.producerPendingPayout)}</p>
                            </div>
                            <div>
                                <p className="text-white/70 text-xs">Active Producers</p>
                                <p className="font-semibold text-lg">3</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <button
                                className="w-full py-2.5 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition flex items-center justify-center gap-2 cursor-not-allowed opacity-70"
                                disabled
                            >
                                <Building className="h-4 w-4" />
                                Producer payouts managed by system
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-100 rounded-lg p-1 mb-6 w-fit">
                    <button
                        onClick={() => {
                            setActiveTab('owner');
                            setSearchTerm('');
                            setFilterStatus('all');
                        }}
                        className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                            activeTab === 'owner' 
                                ? 'bg-teal-600 text-white shadow-sm' 
                                : 'text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <User className="h-4 w-4" />
                        Owner Transactions
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('producer');
                            setSearchTerm('');
                            setFilterStatus('all');
                        }}
                        className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                            activeTab === 'producer' 
                                ? 'bg-teal-600 text-white shadow-sm' 
                                : 'text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <Users className="h-4 w-4" />
                        Producer Transactions
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('withdrawals');
                            setSearchTerm('');
                            setFilterStatus('all');
                        }}
                        className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                            activeTab === 'withdrawals' 
                                ? 'bg-teal-600 text-white shadow-sm' 
                                : 'text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <Clock className="h-4 w-4" />
                        Withdrawal History
                    </button>
                </div>

                {/* Search and Filters */}
                {(activeTab === 'owner' || activeTab === 'producer') && (
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative min-w-[250px]">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={activeTab === 'owner' ? "Search transactions..." : "Search by producer or event..."}
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
                                {activeTab === 'owner' && <option value="failed">Failed</option>}
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
                {activeTab === 'owner' && (
                    <ReusableTable
                        columns={ownerTransactionColumns}
                        data={filteredTransactions}
                        title="Owner Transaction History"
                        icon={History}
                        showSearch={false}
                        showExport={false}
                        showPrint={false}
                        itemsPerPage={10}
                    />
                )}

                {activeTab === 'producer' && (
                    <ReusableTable
                        columns={producerTransactionColumns}
                        data={filteredProducerTransactions}
                        title="Event Producer Transactions"
                        icon={Users}
                        showSearch={false}
                        showExport={false}
                        showPrint={false}
                        itemsPerPage={10}
                    />
                )}

                {activeTab === 'withdrawals' && (
                    <ReusableTable
                        columns={withdrawalColumns}
                        data={withdrawalRequests}
                        title="Withdrawal Request History"
                        icon={Clock}
                        showSearch={false}
                        showExport={false}
                        showPrint={false}
                        itemsPerPage={10}
                    />
                )}

                {/* Withdrawal Request Modal - Owner Only */}
                {showWithdrawalModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-2xl max-w-md w-full"
                        >
                            <div className="border-b px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-700 rounded-t-2xl">
                                <h2 className="text-xl font-bold text-white">Request Withdrawal</h2>
                                <p className="text-white/80 text-sm">Enter your withdrawal details</p>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="bg-teal-50 rounded-lg p-3 border border-teal-200">
                                    <p className="text-sm text-teal-800">Available Balance: {formatCurrency(walletStats.ownerBalance)}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        value={withdrawalAmount}
                                        onChange={(e) => setWithdrawalAmount(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                                        placeholder="Enter amount"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account Number <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={bankAccount}
                                        onChange={(e) => setBankAccount(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                                        placeholder="Enter bank account number"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={accountName}
                                        onChange={(e) => setAccountName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                                        placeholder="Enter account holder name"
                                    />
                                </div>
                                <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                                        <p className="text-xs text-yellow-800">
                                            Withdrawal requests are processed within 2-3 business days. Minimum withdrawal amount is ETB 500.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
                                <button
                                    onClick={() => setShowWithdrawalModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleWithdrawalRequest}
                                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center gap-2"
                                >
                                    <Send className="h-4 w-4" />
                                    Submit Request
                                </button>
                            </div>
                        </motion.div>
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

export default OwnerWalletBalance;