// src/pages/Owner/wallet/OwnerWalletBalance.tsx
import React, { useState, useEffect } from 'react';
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
    Send,
    AlertCircle,
    User,
    Users,
    Loader2,
    DollarSign,
    TrendingUp,
    CreditCard,
    Info,
    Check,
    X
} from 'lucide-react';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';
import supabase from '@/config/supabaseClient';

// Types
interface Transaction {
    id: string;
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    status: 'completed' | 'pending' | 'failed';
    date: string;
    reference: string;
    eventName?: string;
    producerName?: string;
    admin_notes?: string;
}

interface ProducerBalance {
    id: string;
    name: string;
    balance: number;
    totalEarned: number;
    pendingPayout: number;
    contactEmail: string;
    contactPhone: string;
}

interface OwnerWalletStats {
    ownerBalance: number;
    ownerTotalEarned: number;
    ownerPendingWithdrawal: number;
    totalProducersBalance: number;
    totalProducersEarned: number;
    lastTransaction: string;
}

interface WithdrawalRequest {
    id: string;
    amount: number;
    status: 'pending' | 'approved' | 'rejected';
    requestDate: string;
    processedDate?: string;
    rejectionReason?: string;
    admin_notes?: string;
    bankName: string;
    bankAccount: string;
    accountName: string;
    reason: string;
}

const OwnerWalletBalance: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
    const [producers, setProducers] = useState<ProducerBalance[]>([]);
    const [showBalance, setShowBalance] = useState(true);
    const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'transactions' | 'withdrawals' | 'producers'>('transactions');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [theaterId, setTheaterId] = useState<string | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);
    const [showRequestDetails, setShowRequestDetails] = useState(false);
    const [formData, setFormData] = useState({
        amount: '',
        bankName: '',
        bankAccount: '',
        accountName: '',
        reason: ''
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    
    const [walletStats, setWalletStats] = useState<OwnerWalletStats>({
        ownerBalance: 0,
        ownerTotalEarned: 0,
        ownerPendingWithdrawal: 0,
        totalProducersBalance: 0,
        totalProducersEarned: 0,
        lastTransaction: new Date().toISOString()
    });

    // Helper Functions
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
        const diffDays = Math.ceil((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatDateTime = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getCurrentUser = () => {
        const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch {
                return null;
            }
        }
        return null;
    };

    // Fetch Data Functions
    const fetchTheaterId = async (userId: string) => {
        const { data, error } = await supabase
            .from('theaters')
            .select('id')
            .eq('owner_user_id', userId)
            .maybeSingle();
        if (error) return null;
        return data?.id || null;
    };

    const fetchWalletBalance = async (theaterId: string) => {
        const { data, error } = await supabase
            .from('theaters_wallet')
            .select('balance')
            .eq('theater_id', theaterId)
            .maybeSingle();
        if (error) return 0;
        return data?.balance || 0;
    };

    const fetchTotalEarnings = async (theaterId: string) => {
        const { data, error } = await supabase
            .from('earnings')
            .select('net_amount')
            .eq('theater_id', theaterId)
            .eq('is_subscription_payment', false);
        if (error) return 0;
        return data?.reduce((sum, e) => sum + (e.net_amount || 0), 0) || 0;
    };

    const fetchPendingWithdrawals = async (theaterId: string) => {
        const { data, error } = await supabase
            .from('withdrawal_requests')
            .select('amount')
            .eq('theater_id', theaterId)
            .eq('status', 'pending');
        if (error) return 0;
        return data?.reduce((sum, w) => sum + w.amount, 0) || 0;
    };

    const fetchProducers = async (theaterId: string) => {
        const { data: events, error } = await supabase
            .from('events')
            .select('event_provider, event_provider_email, event_provider_phone')
            .eq('theater_id', theaterId)
            .not('event_provider', 'is', null);
        
        if (error) return [];

        const producerMap = new Map<string, ProducerBalance>();
        events?.forEach(event => {
            const name = event.event_provider;
            if (name && !producerMap.has(name)) {
                producerMap.set(name, {
                    id: name,
                    name: name,
                    balance: 0,
                    totalEarned: 0,
                    pendingPayout: 0,
                    contactEmail: event.event_provider_email || 'N/A',
                    contactPhone: event.event_provider_phone || 'N/A'
                });
            }
        });
        return Array.from(producerMap.values());
    };

    const calculateProducerBalances = async (theaterId: string, producers: ProducerBalance[]) => {
        const { data: events } = await supabase
            .from('events')
            .select('id, event_provider')
            .eq('theater_id', theaterId);
        
        const eventProviderMap = new Map<string, string>();
        events?.forEach(event => {
            if (event.event_provider) {
                eventProviderMap.set(event.id, event.event_provider);
            }
        });

        const { data: earnings } = await supabase
            .from('earnings')
            .select('net_amount, reservation_id')
            .eq('theater_id', theaterId)
            .eq('is_subscription_payment', false);

        const reservationIds = earnings?.map(e => e.reservation_id).filter(Boolean) || [];
        const { data: reservations } = await supabase
            .from('reservations')
            .select('id, event_id')
            .in('id', reservationIds);

        const producerEarnings = new Map<string, number>();
        earnings?.forEach(earning => {
            const reservation = reservations?.find(r => r.id === earning.reservation_id);
            if (reservation) {
                const provider = eventProviderMap.get(reservation.event_id);
                if (provider) {
                    const current = producerEarnings.get(provider) || 0;
                    producerEarnings.set(provider, current + (earning.net_amount || 0));
                }
            }
        });

        const { data: pendingPayouts } = await supabase
            .from('withdrawal_requests')
            .select('amount, producer_name')
            .eq('theater_id', theaterId)
            .eq('status', 'pending');

        const pendingMap = new Map<string, number>();
        pendingPayouts?.forEach(p => {
            if (p.producer_name) {
                const current = pendingMap.get(p.producer_name) || 0;
                pendingMap.set(p.producer_name, current + p.amount);
            }
        });

        return producers.map(producer => ({
            ...producer,
            totalEarned: producerEarnings.get(producer.name) || 0,
            balance: (producerEarnings.get(producer.name) || 0) - (pendingMap.get(producer.name) || 0),
            pendingPayout: pendingMap.get(producer.name) || 0
        }));
    };

    const fetchTransactions = async (theaterId: string) => {
        const transactionsList: Transaction[] = [];

        // Get earnings (credit transactions)
        const { data: earnings } = await supabase
            .from('earnings')
            .select('id, net_amount, created_at')
            .eq('theater_id', theaterId)
            .eq('is_subscription_payment', false)
            .order('created_at', { ascending: false });

        const { data: events } = await supabase
            .from('events')
            .select('id, title, event_provider')
            .eq('theater_id', theaterId);

        const eventMap = new Map(events?.map(e => [e.id, e]));

        const reservationIds = earnings?.map(e => e.reservation_id).filter(Boolean) || [];
        const { data: reservations } = await supabase
            .from('reservations')
            .select('id, event_id')
            .in('id', reservationIds);

        const reservationEventMap = new Map<string, string>();
        reservations?.forEach(r => reservationEventMap.set(r.id, r.event_id));

        earnings?.forEach(earning => {
            const eventId = reservationEventMap.get(earning.reservation_id || '');
            const event = eventId ? eventMap.get(eventId) : null;
            
            transactionsList.push({
                id: earning.id,
                type: 'credit',
                amount: earning.net_amount || 0,
                description: `Ticket sales revenue${event?.title ? ` - ${event.title}` : ''}`,
                status: 'completed',
                date: earning.created_at,
                reference: `EARN-${earning.id.slice(-8)}`,
                eventName: event?.title,
                producerName: event?.event_provider
            });
        });

        // Get withdrawal requests (debit transactions)
        const { data: withdrawals } = await supabase
            .from('withdrawal_requests')
            .select('*')
            .eq('theater_id', theaterId)
            .order('created_at', { ascending: false });

        withdrawals?.forEach(withdrawal => {
            let statusText = withdrawal.status === 'approved' ? 'completed' : withdrawal.status;
            let description = 'Owner Withdrawal';
            
            if (withdrawal.status === 'rejected') {
                description = `Withdrawal Rejected${withdrawal.rejection_reason ? `: ${withdrawal.rejection_reason}` : ''}`;
            } else if (withdrawal.status === 'approved') {
                description = `Withdrawal Approved${withdrawal.admin_notes ? `: ${withdrawal.admin_notes}` : ''}`;
            }
            
            transactionsList.push({
                id: withdrawal.id,
                type: 'debit',
                amount: withdrawal.amount,
                description: description,
                status: statusText,
                date: withdrawal.processed_at || withdrawal.created_at,
                reference: `WDR-${withdrawal.id.slice(-8)}`,
                admin_notes: withdrawal.admin_notes || withdrawal.rejection_reason
            });
        });

        transactionsList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setTransactions(transactionsList);
    };

    const fetchWithdrawalRequests = async (theaterId: string) => {
        const { data, error } = await supabase
            .from('withdrawal_requests')
            .select('*')
            .eq('theater_id', theaterId)
            .order('created_at', { ascending: false });

        if (!error && data) {
            const formatted: WithdrawalRequest[] = data.map(w => ({
                id: w.id,
                amount: w.amount,
                status: w.status,
                requestDate: w.created_at,
                processedDate: w.processed_at,
                rejectionReason: w.rejection_reason,
                admin_notes: w.admin_notes,
                bankName: w.bank_name || 'N/A',
                bankAccount: w.bank_account || '****',
                accountName: w.account_name || 'N/A',
                reason: w.reason || 'Monthly withdrawal'
            }));
            setWithdrawalRequests(formatted);
        }
    };

    const loadAllData = async () => {
        setLoading(true);
        try {
            const currentUser = getCurrentUser();
            if (!currentUser) {
                setLoading(false);
                return;
            }

            const theaterId = await fetchTheaterId(currentUser.id);
            if (!theaterId) {
                setLoading(false);
                return;
            }

            setTheaterId(theaterId);

            const [balance, totalEarned, pendingWithdrawal] = await Promise.all([
                fetchWalletBalance(theaterId),
                fetchTotalEarnings(theaterId),
                fetchPendingWithdrawals(theaterId)
            ]);

            let producersList = await fetchProducers(theaterId);
            producersList = await calculateProducerBalances(theaterId, producersList);

            const totalProducersBalance = producersList.reduce((sum, p) => sum + p.balance, 0);
            const totalProducersEarned = producersList.reduce((sum, p) => sum + p.totalEarned, 0);

            setWalletStats({
                ownerBalance: balance,
                ownerTotalEarned: totalEarned,
                ownerPendingWithdrawal: pendingWithdrawal,
                totalProducersBalance,
                totalProducersEarned,
                lastTransaction: new Date().toISOString()
            });

            setProducers(producersList);

            await Promise.all([
                fetchTransactions(theaterId),
                fetchWithdrawalRequests(theaterId)
            ]);

        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAllData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};
        
        if (!formData.amount) {
            errors.amount = 'Amount is required';
        } else {
            const amount = parseFloat(formData.amount);
            if (amount < 500) {
                errors.amount = 'Minimum withdrawal amount is ETB 500';
            }
            if (amount > walletStats.ownerBalance) {
                errors.amount = `Insufficient balance. Available: ${formatCurrency(walletStats.ownerBalance)}`;
            }
        }
        
        if (!formData.bankName) errors.bankName = 'Bank name is required';
        if (!formData.bankAccount) errors.bankAccount = 'Bank account number is required';
        if (!formData.accountName) errors.accountName = 'Account holder name is required';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleWithdrawalRequest = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from('withdrawal_requests')
                .insert({
                    theater_id: theaterId,
                    amount: parseFloat(formData.amount),
                    reason: formData.reason || 'Owner withdrawal request',
                    status: 'pending',
                    withdrawal_type: 'owner',
                    bank_name: formData.bankName,
                    bank_account: formData.bankAccount,
                    account_name: formData.accountName,
                    created_at: new Date().toISOString()
                });

            if (error) throw error;

            setPopupMessage({
                title: 'Request Submitted',
                message: `Your withdrawal request of ${formatCurrency(parseFloat(formData.amount))} has been submitted for approval`,
                type: 'success'
            });
            setShowSuccessPopup(true);
            setShowWithdrawalModal(false);
            setFormData({ amount: '', bankName: '', bankAccount: '', accountName: '', reason: '' });

            await loadAllData();

        } catch (error) {
            console.error('Error submitting withdrawal:', error);
            setPopupMessage({
                title: 'Error',
                message: 'Failed to submit request. Please try again.',
                type: 'error'
            });
            setShowSuccessPopup(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleViewRequestDetails = (request: WithdrawalRequest) => {
        setSelectedRequest(request);
        setShowRequestDetails(true);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /> Completed</span>;
            case 'pending':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3" /> Pending</span>;
            case 'approved':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /> Approved</span>;
            case 'rejected':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"><XCircle className="h-3 w-3" /> Rejected</span>;
            default:
                return null;
        }
    };

    const handleExport = () => {
        let dataToExport: any[];
        let headers: string[];

        switch (activeTab) {
            case 'transactions':
                dataToExport = transactions;
                headers = ['ID', 'Type', 'Amount', 'Description', 'Status', 'Date', 'Reference', 'Admin Notes'];
                break;
            case 'withdrawals':
                dataToExport = withdrawalRequests;
                headers = ['ID', 'Amount', 'Status', 'Request Date', 'Processed Date', 'Admin Response', 'Bank Name', 'Account Name'];
                break;
            case 'producers':
                dataToExport = producers;
                headers = ['Producer Name', 'Balance', 'Total Earned', 'Pending Payout', 'Contact Email', 'Contact Phone'];
                break;
            default:
                return;
        }

        const csvContent = [
            headers,
            ...dataToExport.map(item => {
                if (activeTab === 'producers') {
                    return [
                        item.name,
                        item.balance,
                        item.totalEarned,
                        item.pendingPayout,
                        item.contactEmail,
                        item.contactPhone
                    ];
                }
                if (activeTab === 'withdrawals') {
                    return [
                        item.id.slice(-8),
                        item.amount,
                        item.status,
                        formatDateTime(item.requestDate),
                        item.processedDate ? formatDateTime(item.processedDate) : 'N/A',
                        item.rejectionReason || item.admin_notes || 'N/A',
                        item.bankName,
                        item.accountName
                    ];
                }
                return [
                    item.id.slice(-8),
                    item.type,
                    item.amount,
                    item.description,
                    item.status,
                    formatDateTime(item.date),
                    item.reference,
                    item.admin_notes || 'N/A'
                ];
            })
        ];

        const csv = csvContent.map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${activeTab}_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);

        setPopupMessage({
            title: 'Export Successful',
            message: 'Data exported to CSV',
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    const filteredTransactions = transactions.filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.reference.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const filteredWithdrawals = withdrawalRequests.filter(w => {
        const matchesSearch = w.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            w.bankName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || w.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const filteredProducers = producers.filter(p => {
        return p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const transactionColumns = [
        {
            Header: 'Transaction',
            accessor: 'description',
            sortable: true,
            Cell: (row: Transaction) => (
                <div>
                    <p className="font-medium text-gray-900">{row.description}</p>
                    <p className="text-xs text-gray-500">{row.reference}</p>
                    {row.producerName && <p className="text-xs text-teal-600">Producer: {row.producerName}</p>}
                    {row.admin_notes && <p className="text-xs text-orange-500 mt-1">Note: {row.admin_notes}</p>}
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
            Cell: (row: Transaction) => <p className="text-sm text-gray-900">{formatDate(row.date)}</p>
        },
        {
            Header: 'Status',
            accessor: 'status',
            sortable: true,
            Cell: (row: Transaction) => getStatusBadge(row.status)
        }
    ];

    const withdrawalColumns = [
        {
            Header: 'ID',
            accessor: 'id',
            sortable: true,
            Cell: (row: WithdrawalRequest) => <p className="font-medium text-gray-900">{row.id.slice(-8)}</p>
        },
        {
            Header: 'Amount',
            accessor: 'amount',
            sortable: true,
            Cell: (row: WithdrawalRequest) => <p className="font-semibold text-gray-900">{formatCurrency(row.amount)}</p>
        },
        {
            Header: 'Status',
            accessor: 'status',
            sortable: true,
            Cell: (row: WithdrawalRequest) => getStatusBadge(row.status)
        },
        {
            Header: 'Request Date',
            accessor: 'requestDate',
            sortable: true,
            Cell: (row: WithdrawalRequest) => <p className="text-sm text-gray-900">{formatDateTime(row.requestDate)}</p>
        },
        {
            Header: 'Admin Response',
            accessor: 'admin_notes',
            sortable: true,
            Cell: (row: WithdrawalRequest) => (
                <div>
                    {row.status === 'approved' ? (
                        <span className="text-green-600 text-xs">✓ Approved</span>
                    ) : row.status === 'rejected' ? (
                        <span className="text-red-600 text-xs" title={row.rejectionReason}>
                            ✗ Rejected{row.rejectionReason ? `: ${row.rejectionReason.substring(0, 30)}${row.rejectionReason.length > 30 ? '...' : ''}` : ''}
                        </span>
                    ) : (
                        <span className="text-yellow-600 text-xs">⏳ Pending Review</span>
                    )}
                </div>
            )
        },
        {
            Header: 'Actions',
            accessor: 'id',
            sortable: false,
            Cell: (row: WithdrawalRequest) => (
                <button
                    onClick={() => handleViewRequestDetails(row)}
                    className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                    title="View Details"
                >
                    <Info className="h-4 w-4 text-blue-600" />
                </button>
            )
        }
    ];

    const producerColumns = [
        {
            Header: 'Producer',
            accessor: 'name',
            sortable: true,
            Cell: (row: ProducerBalance) => (
                <div>
                    <p className="font-medium text-gray-900">{row.name}</p>
                    <p className="text-xs text-gray-500">{row.contactEmail}</p>
                </div>
            )
        },
        {
            Header: 'Balance',
            accessor: 'balance',
            sortable: true,
            Cell: (row: ProducerBalance) => <p className="font-bold text-teal-600">{formatCurrency(row.balance)}</p>
        },
        {
            Header: 'Total Earned',
            accessor: 'totalEarned',
            sortable: true,
            Cell: (row: ProducerBalance) => <p className="font-semibold text-green-600">{formatCurrency(row.totalEarned)}</p>
        },
        {
            Header: 'Pending Payout',
            accessor: 'pendingPayout',
            sortable: true,
            Cell: (row: ProducerBalance) => <p className="text-orange-600">{formatCurrency(row.pendingPayout)}</p>
        },
        {
            Header: 'Contact',
            accessor: 'contactPhone',
            sortable: true,
            Cell: (row: ProducerBalance) => <p className="text-sm text-gray-900">{row.contactPhone}</p>
        }
    ];

    // Request Details Modal
    const RequestDetailsModal = () => {
        if (!selectedRequest) return null;

        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowRequestDetails(false)}>
                <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className={`sticky top-0 px-6 py-4 rounded-t-2xl ${
                        selectedRequest.status === 'approved' ? 'bg-gradient-to-r from-green-600 to-emerald-600' :
                        selectedRequest.status === 'rejected' ? 'bg-gradient-to-r from-red-600 to-rose-600' :
                        'bg-gradient-to-r from-yellow-600 to-orange-600'
                    }`}>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    {selectedRequest.status === 'approved' ? <CheckCircle className="h-5 w-5 text-white" /> :
                                     selectedRequest.status === 'rejected' ? <XCircle className="h-5 w-5 text-white" /> :
                                     <Clock className="h-5 w-5 text-white" />}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">
                                        {selectedRequest.status === 'approved' ? 'Withdrawal Approved' :
                                         selectedRequest.status === 'rejected' ? 'Withdrawal Rejected' :
                                         'Withdrawal Request'}
                                    </h2>
                                    <p className="text-white/80 text-sm">ID: {selectedRequest.id.slice(-8)}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowRequestDetails(false)} className="p-1 hover:bg-white/20 rounded-lg transition">
                                <X className="h-5 w-5 text-white" />
                            </button>
                        </div>
                    </div>

                    <div className="p-6 space-y-4">
                        {/* Amount */}
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <p className="text-sm text-gray-500">Amount Requested</p>
                            <p className="text-3xl font-bold text-gray-900">{formatCurrency(selectedRequest.amount)}</p>
                        </div>

                        {/* Status & Date */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-500">Request Date</p>
                                <p className="text-sm font-medium text-gray-900">{formatDateTime(selectedRequest.requestDate)}</p>
                            </div>
                            {selectedRequest.processedDate && (
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs text-gray-500">Processed Date</p>
                                    <p className="text-sm font-medium text-gray-900">{formatDateTime(selectedRequest.processedDate)}</p>
                                </div>
                            )}
                        </div>

                        {/* Bank Details */}
                        <div className="border-t pt-4">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-teal-600" />
                                Bank Details
                            </h3>
                            <div className="space-y-2">
                                <div>
                                    <p className="text-xs text-gray-500">Bank Name</p>
                                    <p className="text-sm text-gray-900">{selectedRequest.bankName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Account Number</p>
                                    <p className="text-sm text-gray-900">{selectedRequest.bankAccount}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Account Name</p>
                                    <p className="text-sm text-gray-900">{selectedRequest.accountName}</p>
                                </div>
                            </div>
                        </div>

                        {/* Admin Response */}
                        {(selectedRequest.status === 'approved' || selectedRequest.status === 'rejected') && (
                            <div className={`rounded-lg p-4 ${selectedRequest.status === 'approved' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                                <p className="text-sm font-semibold flex items-center gap-2 mb-2">
                                    {selectedRequest.status === 'approved' ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />}
                                    {selectedRequest.status === 'approved' ? 'Admin Response' : 'Rejection Reason'}
                                </p>
                                <p className={`text-sm ${selectedRequest.status === 'approved' ? 'text-green-700' : 'text-red-700'}`}>
                                    {selectedRequest.rejectionReason || selectedRequest.admin_notes || (selectedRequest.status === 'approved' ? 'Withdrawal request has been approved.' : 'No reason provided.')}
                                </p>
                            </div>
                        )}

                        {/* Original Reason */}
                        {selectedRequest.reason && (
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm font-semibold text-gray-700 mb-2">Your Reason</p>
                                <p className="text-sm text-gray-600">{selectedRequest.reason}</p>
                            </div>
                        )}
                    </div>

                    <div className="border-t px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end">
                        <button
                            onClick={() => setShowRequestDetails(false)}
                            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center gap-2"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const pendingRequestsCount = withdrawalRequests.filter(w => w.status === 'pending').length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-teal-600 mx-auto mb-4" />
                    <p className="text-gray-500">Loading wallet data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl shadow-lg">
                            <Wallet className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Wallet Management</h1>
                            <p className="text-gray-600">Manage your balance and track withdrawal requests</p>
                        </div>
                    </div>
                </motion.div>

                {/* Two Wallet Cards - Admin Style */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                    {/* Owner Balance Card */}
                    <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 text-white shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-white/20 rounded-xl">
                                    <User className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-white/80 text-base font-medium">Your Balance</span>
                            </div>
                            <button onClick={() => setShowBalance(!showBalance)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
                                {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        <div className="mb-4">
                            <p className="text-3xl font-bold">{showBalance ? formatCurrency(walletStats.ownerBalance) : '••••••'}</p>
                            <p className="text-white/70 text-sm mt-2">Total earned: {formatCurrency(walletStats.ownerTotalEarned)}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                            <div>
                                <p className="text-white/70 text-xs">Pending Withdrawal</p>
                                <p className="font-semibold text-lg">{formatCurrency(walletStats.ownerPendingWithdrawal)}</p>
                            </div>
                            <div>
                                <p className="text-white/70 text-xs">Last Activity</p>
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

                    {/* Producers Balance Card */}
                    <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 bg-white/20 rounded-xl">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-white/80 text-base font-medium">Producers Balance</span>
                        </div>
                        <div className="mb-4">
                            <p className="text-3xl font-bold">{showBalance ? formatCurrency(walletStats.totalProducersBalance) : '••••••'}</p>
                            <p className="text-white/70 text-sm mt-2">Across {producers.length} producers</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                            <div>
                                <p className="text-white/70 text-xs">Total Earned</p>
                                <p className="font-semibold text-lg">{formatCurrency(walletStats.totalProducersEarned)}</p>
                            </div>
                            <div>
                                <p className="text-white/70 text-xs">Pending Payouts</p>
                                <p className="font-semibold text-lg">{formatCurrency(producers.reduce((sum, p) => sum + p.pendingPayout, 0))}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Withdrawal Requests Status Card */}
                {pendingRequestsCount > 0 && (
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-4 mb-6 border border-yellow-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <Clock className="h-5 w-5 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-yellow-800">Withdrawal Request Status</p>
                                    <p className="text-xs text-yellow-700">You have {pendingRequestsCount} pending withdrawal request{pendingRequestsCount !== 1 ? 's' : ''} awaiting admin approval</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setActiveTab('withdrawals')}
                                className="px-3 py-1.5 text-xs bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition"
                            >
                                View Requests
                            </button>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 bg-gray-100 rounded-lg p-1 mb-6 w-fit">
                    <button onClick={() => { setActiveTab('transactions'); setSearchTerm(''); setFilterStatus('all'); }} className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${activeTab === 'transactions' ? 'bg-teal-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}>
                        <History className="h-4 w-4" /> Transactions
                    </button>
                    <button onClick={() => { setActiveTab('withdrawals'); setSearchTerm(''); setFilterStatus('all'); }} className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 relative ${activeTab === 'withdrawals' ? 'bg-teal-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}>
                        <Clock className="h-4 w-4" /> Withdrawal History
                        {pendingRequestsCount > 0 && activeTab !== 'withdrawals' && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                {pendingRequestsCount}
                            </span>
                        )}
                    </button>
                    <button onClick={() => { setActiveTab('producers'); setSearchTerm(''); setFilterStatus('all'); }} className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${activeTab === 'producers' ? 'bg-teal-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}>
                        <Users className="h-4 w-4" /> Producers
                    </button>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative min-w-[250px]">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input type="text" placeholder={activeTab === 'transactions' ? "Search transactions..." : activeTab === 'withdrawals' ? "Search withdrawal requests..." : "Search producers..."} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white" />
                        </div>
                        {(activeTab === 'transactions' || activeTab === 'withdrawals') && (
                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white min-w-[140px]">
                                <option value="all">All Status</option>
                                {activeTab === 'transactions' ? (
                                    <>
                                        <option value="completed">Completed</option>
                                        <option value="pending">Pending</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                    </>
                                )}
                            </select>
                        )}
                    </div>
                    <ReusableButton onClick={handleExport} icon="Download" label="Export Data" className="px-4 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white" />
                </div>

                {/* Content Tables */}
                {activeTab === 'transactions' && <ReusableTable columns={transactionColumns} data={filteredTransactions} title="Transaction History" icon={History} showSearch={false} showExport={false} showPrint={false} itemsPerPage={10} />}
                {activeTab === 'withdrawals' && <ReusableTable columns={withdrawalColumns} data={filteredWithdrawals} title="Withdrawal History" icon={Clock} showSearch={false} showExport={false} showPrint={false} itemsPerPage={10} />}
                {activeTab === 'producers' && <ReusableTable columns={producerColumns} data={filteredProducers} title="Producers Balance" icon={Users} showSearch={false} showExport={false} showPrint={false} itemsPerPage={10} />}

                {/* Withdrawal Modal */}
                {showWithdrawalModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="border-b px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-700 rounded-t-2xl sticky top-0">
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
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${formErrors.amount ? 'border-red-500' : 'border-gray-200'}`}
                                        placeholder="Enter amount (min. ETB 500)"
                                        min="500"
                                        step="100"
                                    />
                                    {formErrors.amount && <p className="text-xs text-red-500 mt-1">{formErrors.amount}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="bankName"
                                        value={formData.bankName}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${formErrors.bankName ? 'border-red-500' : 'border-gray-200'}`}
                                        placeholder="e.g., Commercial Bank of Ethiopia"
                                    />
                                    {formErrors.bankName && <p className="text-xs text-red-500 mt-1">{formErrors.bankName}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account Number <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="bankAccount"
                                        value={formData.bankAccount}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${formErrors.bankAccount ? 'border-red-500' : 'border-gray-200'}`}
                                        placeholder="Enter bank account number"
                                    />
                                    {formErrors.bankAccount && <p className="text-xs text-red-500 mt-1">{formErrors.bankAccount}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="accountName"
                                        value={formData.accountName}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${formErrors.accountName ? 'border-red-500' : 'border-gray-200'}`}
                                        placeholder="Enter account holder name"
                                    />
                                    {formErrors.accountName && <p className="text-xs text-red-500 mt-1">{formErrors.accountName}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Withdrawal</label>
                                    <textarea
                                        name="reason"
                                        value={formData.reason}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
                                        placeholder="Optional: Tell us why you are withdrawing"
                                    />
                                </div>

                                <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                                        <p className="text-xs text-yellow-800">
                                            Withdrawal requests are processed within 2-3 business days. Minimum amount is ETB 500.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end gap-3 sticky bottom-0">
                                <button
                                    onClick={() => {
                                        setShowWithdrawalModal(false);
                                        setFormData({ amount: '', bankName: '', bankAccount: '', accountName: '', reason: '' });
                                        setFormErrors({});
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleWithdrawalRequest}
                                    disabled={isSubmitting}
                                    className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                                        isSubmitting 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-teal-600 hover:bg-teal-700 text-white'
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
                                    ) : (
                                        <><Send className="h-4 w-4" /> Submit Request</>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Request Details Modal */}
                {showRequestDetails && <RequestDetailsModal />}

                <SuccessPopup isOpen={showSuccessPopup} onClose={() => setShowSuccessPopup(false)} type={popupMessage.type} title={popupMessage.title} message={popupMessage.message} duration={3000} position="top-right" />
            </div>
        </div>
    );
};

export default OwnerWalletBalance;