// src/pages/Admin/wallet/TransactionHistory.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ReceiptText,
    Search,
    Filter,
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
    Eye,
    CheckCircle,
    XCircle,
    Clock as ClockIcon,
    RefreshCw,
    TrendingUp,
    TrendingDown,
    Wallet,
    User,
    Building,
    Ticket,
    Info,
    FileText,
    Copy,
    Check
} from 'lucide-react';
import ReusableTable from '../Reusable/ReusableTable';
import ReusableButton from '../Reusable/ReusableButton';
import SuccessPopup from '../Reusable/SuccessPopup';

// Types
interface Transaction {
    id: string;
    transactionId: string;
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    category: 'deposit' | 'withdrawal' | 'refund' | 'payout' | 'fee' | 'bonus' | 'ticket_sale';
    status: 'completed' | 'pending' | 'failed' | 'cancelled';
    date: string;
    reference: string;
    paymentMethod: 'chapa' | 'telebirr' | 'cbebirr' | 'hellocash' | 'bank' | 'wallet';
    user?: {
        id: number;
        name: string;
        email: string;
        role: string;
    };
    theater?: {
        id: number;
        name: string;
    };
    show?: {
        id: number;
        title: string;
    };
    note?: string;
    receipt?: string;
}

interface TransactionStats {
    totalTransactions: number;
    totalCredits: number;
    totalDebits: number;
    netBalance: number;
    successRate: number;
    averageTransaction: number;
    thisMonthTransactions: number;
    pendingTransactions: number;
}

// Mock Data
const mockTransactions: Transaction[] = [
    {
        id: '1',
        transactionId: 'TXN-20240405-001',
        type: 'credit',
        amount: 5000,
        description: 'Deposit via Chapa',
        category: 'deposit',
        status: 'completed',
        date: '2024-04-05T10:30:00',
        reference: 'CH-20240405-001',
        paymentMethod: 'chapa',
        user: { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
        receipt: 'https://example.com/receipt/001'
    },
    {
        id: '2',
        transactionId: 'TXN-20240404-002',
        type: 'debit',
        amount: 1250,
        description: 'Theater Payout - Grand Theater',
        category: 'payout',
        status: 'completed',
        date: '2024-04-04T15:20:00',
        reference: 'PO-20240404-001',
        paymentMethod: 'bank',
        theater: { id: 1, name: 'Grand Theater' }
    },
    {
        id: '3',
        transactionId: 'TXN-20240403-003',
        type: 'credit',
        amount: 2500,
        description: 'Ticket Sales - The Lion King',
        category: 'ticket_sale',
        status: 'completed',
        date: '2024-04-03T18:45:00',
        reference: 'SL-20240403-001',
        paymentMethod: 'telebirr',
        show: { id: 1, title: 'The Lion King' },
        user: { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Customer' }
    },
    {
        id: '4',
        transactionId: 'TXN-20240402-004',
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
        id: '5',
        transactionId: 'TXN-20240401-005',
        type: 'credit',
        amount: 1200,
        description: 'Refund - Customer Request',
        category: 'refund',
        status: 'pending',
        date: '2024-04-01T14:30:00',
        reference: 'REF-20240401-001',
        paymentMethod: 'cbebirr',
        user: { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Customer' }
    },
    {
        id: '6',
        transactionId: 'TXN-20240330-006',
        type: 'credit',
        amount: 8000,
        description: 'Deposit via CBE Birr',
        category: 'deposit',
        status: 'completed',
        date: '2024-03-30T11:00:00',
        reference: 'CB-20240330-001',
        paymentMethod: 'cbebirr',
        user: { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' }
    },
    {
        id: '7',
        transactionId: 'TXN-20240329-007',
        type: 'debit',
        amount: 2100,
        description: 'Theater Payout - City Cinema',
        category: 'payout',
        status: 'pending',
        date: '2024-03-29T16:20:00',
        reference: 'PO-20240329-002',
        paymentMethod: 'bank',
        theater: { id: 2, name: 'City Cinema' }
    },
    {
        id: '8',
        transactionId: 'TXN-20240328-008',
        type: 'credit',
        amount: 1500,
        description: 'Bonus - Referral Program',
        category: 'bonus',
        status: 'completed',
        date: '2024-03-28T12:00:00',
        reference: 'BON-20240328-001',
        paymentMethod: 'wallet',
        user: { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'Customer' }
    }
];

const TransactionHistory: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });
    const [copied, setCopied] = useState(false);

    // Calculate Statistics
    const stats: TransactionStats = {
        totalTransactions: transactions.length,
        totalCredits: transactions.filter(t => t.type === 'credit' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
        totalDebits: transactions.filter(t => t.type === 'debit' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
        netBalance: transactions.filter(t => t.status === 'completed').reduce((sum, t) => t.type === 'credit' ? sum + t.amount : sum - t.amount, 0),
        successRate: (transactions.filter(t => t.status === 'completed').length / transactions.length) * 100,
        averageTransaction: transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length,
        thisMonthTransactions: transactions.filter(t => {
            const transactionDate = new Date(t.date);
            const now = new Date();
            return transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear();
        }).length,
        pendingTransactions: transactions.filter(t => t.status === 'pending').length
    };

    // Filter transactions
    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (transaction.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
        const matchesType = filterType === 'all' || transaction.type === filterType;
        const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
        const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
        return matchesSearch && matchesType && matchesCategory && matchesStatus;
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
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
            case 'ticket_sale':
                return <Ticket className="h-4 w-4 text-purple-500" />;
            case 'bonus':
                return <TrendingUp className="h-4 w-4 text-emerald-500" />;
            default:
                return <ReceiptText className="h-4 w-4 text-gray-500" />;
        }
    };

    const getCategoryName = (category: string) => {
        switch (category) {
            case 'deposit': return 'Deposit';
            case 'withdrawal': return 'Withdrawal';
            case 'payout': return 'Theater Payout';
            case 'refund': return 'Refund';
            case 'fee': return 'Platform Fee';
            case 'ticket_sale': return 'Ticket Sale';
            case 'bonus': return 'Bonus';
            default: return category;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /> Completed</span>;
            case 'pending':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700"><ClockIcon className="h-3 w-3" /> Pending</span>;
            case 'failed':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"><XCircle className="h-3 w-3" /> Failed</span>;
            case 'cancelled':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"><XCircle className="h-3 w-3" /> Cancelled</span>;
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

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setPopupMessage({
            title: 'Copied!',
            message: `${label} copied to clipboard`,
            type: 'success'
        });
        setShowSuccessPopup(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleExport = () => {
        const csvContent = [
            ['Transaction ID', 'Type', 'Amount', 'Description', 'Category', 'Status', 'Date', 'Reference', 'Payment Method', 'User', 'Theater', 'Show'],
            ...filteredTransactions.map(t => [
                t.transactionId,
                t.type,
                t.amount,
                t.description,
                t.category,
                t.status,
                t.date,
                t.reference,
                t.paymentMethod,
                t.user?.name || '',
                t.theater?.name || '',
                t.show?.title || ''
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transaction_history_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);

        setPopupMessage({
            title: 'Export Successful',
            message: 'Transactions exported to CSV',
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        printWindow?.document.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Transaction History</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                        .header { text-align: center; margin-bottom: 30px; }
                        @media print {
                            body { margin: 0; padding: 10px; }
                            .no-print { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Transaction History</h1>
                        <p>Generated on ${new Date().toLocaleString()}</p>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Transaction ID</th><th>Type</th><th>Amount</th><th>Description</th><th>Status</th><th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredTransactions.map(t => `
                                <tr>
                                    <td>${t.transactionId}</td>
                                    <td>${t.type}</td>
                                    <td>${formatCurrency(t.amount)}</td>
                                    <td>${t.description}</td>
                                    <td>${t.status}</td>
                                    <td>${formatDate(t.date)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `);
        printWindow?.document.close();
        printWindow?.print();
    };

    // Column definitions for transactions table
    const transactionColumns = [
        {
            Header: 'Transaction ID',
            accessor: 'transactionId',
            sortable: true,
            Cell: (row: Transaction) => (
                <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-mono text-gray-900">{row.transactionId}</span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(row.transactionId, 'Transaction ID');
                        }}
                        className="p-0.5 hover:bg-gray-100 rounded transition"
                    >
                        <Copy className="h-3 w-3 text-gray-400" />
                    </button>
                </div>
            )
        },
        {
            Header: 'Description',
            accessor: 'description',
            sortable: true,
            Cell: (row: Transaction) => (
                <div>
                    <div className="flex items-center gap-1.5">
                        {getCategoryIcon(row.category)}
                        <p className="text-sm font-medium text-gray-900">{row.description}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{getCategoryName(row.category)}</p>
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
            Header: 'Date',
            accessor: 'date',
            sortable: true,
            Cell: (row: Transaction) => (
                <div>
                    <p className="text-sm text-gray-900">{formatDate(row.date)}</p>
                    <p className="text-xs text-gray-500">Ref: {row.reference}</p>
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

    // Action buttons for table
    const transactionActions = [
        {
            label: 'View Details',
            icon: Eye,
            onClick: (row: Transaction) => {
                setSelectedTransaction(row);
                setShowDetailsModal(true);
            },
            color: 'info' as const
        }
    ];

    const categories = [
        { value: 'all', label: 'All Categories' },
        { value: 'deposit', label: 'Deposits' },
        { value: 'withdrawal', label: 'Withdrawals' },
        { value: 'payout', label: 'Theater Payouts' },
        { value: 'ticket_sale', label: 'Ticket Sales' },
        { value: 'refund', label: 'Refunds' },
        { value: 'fee', label: 'Fees' },
        { value: 'bonus', label: 'Bonuses' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-100 rounded-xl">
                                    <ReceiptText className="h-6 w-6 text-blue-600" />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
                            </div>
                            <p className="text-gray-600">View and manage all financial transactions</p>
                        </div>
                        <div className="flex gap-2">
                            <ReusableButton
                                onClick={handleExport}
                                icon="Download"
                                label="Export"
                                className="px-4 py-2 text-sm"
                            />
                            <ReusableButton
                                onClick={handlePrint}
                                icon="Printer"
                                label="Print"
                                className="px-4 py-2 text-sm"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <ReceiptText className="h-5 w-5 text-blue-600" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</span>
                        </div>
                        <p className="text-sm text-gray-600">Total Transactions</p>
                        <p className="text-xs text-gray-400 mt-1">{stats.thisMonthTransactions} this month</p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-green-600" />
                            </div>
                            <span className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalCredits)}</span>
                        </div>
                        <p className="text-sm text-gray-600">Total Credits (Inflow)</p>
                        <p className="text-xs text-gray-400 mt-1">Money received</p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <TrendingDown className="h-5 w-5 text-red-600" />
                            </div>
                            <span className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalDebits)}</span>
                        </div>
                        <p className="text-sm text-gray-600">Total Debits (Outflow)</p>
                        <p className="text-xs text-gray-400 mt-1">Money paid out</p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Wallet className="h-5 w-5 text-purple-600" />
                            </div>
                            <span className="text-2xl font-bold text-purple-600">{formatCurrency(stats.netBalance)}</span>
                        </div>
                        <p className="text-sm text-gray-600">Net Balance</p>
                        <p className="text-xs text-gray-400 mt-1">{stats.pendingTransactions} pending</p>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative min-w-[280px]">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by transaction ID, description, reference, or user..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            />
                        </div>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white min-w-[130px]"
                        >
                            <option value="all">All Types</option>
                            <option value="credit">Credits (+)</option>
                            <option value="debit">Debits (-)</option>
                        </select>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white min-w-[150px]"
                        >
                            {categories.map(cat => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white min-w-[130px]"
                        >
                            <option value="all">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* Transactions Table */}
                <ReusableTable
                    columns={transactionColumns}
                    data={filteredTransactions}
                    actions={transactionActions}
                    title="All Transactions"
                    icon={ReceiptText}
                    showSearch={false}
                    showExport={false}
                    showPrint={false}
                    itemsPerPage={15}
                />

                {/* Transaction Details Modal */}
                {showDetailsModal && selectedTransaction && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDetailsModal(false)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <ReceiptText className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">Transaction Details</h2>
                                </div>
                                <button onClick={() => setShowDetailsModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                                    <XCircleIcon className="h-5 w-5 text-gray-500" />
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <p className="text-xs text-gray-500">Transaction ID</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-sm font-mono font-medium text-gray-900">{selectedTransaction.transactionId}</p>
                                            <button
                                                onClick={() => copyToClipboard(selectedTransaction.transactionId, 'Transaction ID')}
                                                className="p-1 hover:bg-gray-100 rounded transition"
                                            >
                                                <Copy className="h-3 w-3 text-gray-400" />
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Reference</p>
                                        <p className="text-sm font-medium text-gray-900">{selectedTransaction.reference}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Amount</p>
                                        <p className={`text-lg font-bold ${selectedTransaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                            {selectedTransaction.type === 'credit' ? '+' : '-'} {formatCurrency(selectedTransaction.amount)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Status</p>
                                        <div className="mt-1">{getStatusBadge(selectedTransaction.status)}</div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Date & Time</p>
                                        <p className="text-sm font-medium text-gray-900">{formatDate(selectedTransaction.date)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Payment Method</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            {getPaymentMethodIcon(selectedTransaction.paymentMethod)}
                                            <span className="text-sm font-medium text-gray-900 capitalize">{selectedTransaction.paymentMethod}</span>
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-500">Description</p>
                                        <p className="text-sm font-medium text-gray-900">{selectedTransaction.description}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-500">Category</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            {getCategoryIcon(selectedTransaction.category)}
                                            <span className="text-sm font-medium text-gray-900 capitalize">{getCategoryName(selectedTransaction.category)}</span>
                                        </div>
                                    </div>
                                </div>

                                {selectedTransaction.user && (
                                    <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <User className="h-4 w-4 text-gray-500" />
                                            User Information
                                        </h4>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <p className="text-xs text-gray-500">Name</p>
                                                <p className="font-medium text-gray-900">{selectedTransaction.user.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Email</p>
                                                <p className="font-medium text-gray-900">{selectedTransaction.user.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Role</p>
                                                <p className="font-medium text-gray-900 capitalize">{selectedTransaction.user.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedTransaction.theater && (
                                    <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <Building className="h-4 w-4 text-gray-500" />
                                            Theater Information
                                        </h4>
                                        <div>
                                            <p className="text-xs text-gray-500">Theater Name</p>
                                            <p className="font-medium text-gray-900">{selectedTransaction.theater.name}</p>
                                        </div>
                                    </div>
                                )}

                                {selectedTransaction.show && (
                                    <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <Ticket className="h-4 w-4 text-gray-500" />
                                            Show Information
                                        </h4>
                                        <div>
                                            <p className="text-xs text-gray-500">Show Title</p>
                                            <p className="font-medium text-gray-900">{selectedTransaction.show.title}</p>
                                        </div>
                                    </div>
                                )}

                                {selectedTransaction.note && (
                                    <div className="mb-4 p-4 bg-yellow-50 rounded-xl">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                            <Info className="h-4 w-4 text-yellow-600" />
                                            Note
                                        </h4>
                                        <p className="text-sm text-gray-700">{selectedTransaction.note}</p>
                                    </div>
                                )}

                                {selectedTransaction.receipt && (
                                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                                        <a
                                            href={selectedTransaction.receipt}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 px-4 py-2 bg-deepTeal text-white rounded-lg text-center hover:bg-deepTeal/80 transition flex items-center justify-center gap-2"
                                        >
                                            <FileText className="h-4 w-4" />
                                            View Receipt
                                        </a>
                                    </div>
                                )}
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

// Add missing XCircleIcon
const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export default TransactionHistory;