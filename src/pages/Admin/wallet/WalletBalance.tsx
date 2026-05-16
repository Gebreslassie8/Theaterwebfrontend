// src/pages/Admin/wallet/WalletBalance.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Wallet,
    Eye,
    EyeOff,
    Search,
    Building,
    Loader2,
    Percent,
    DollarSign,
    Users,
    Phone,
    Mail,
    MapPin,
    Landmark,
    Info,
    CreditCard,
    TrendingUp,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    Check,
    X,
    Send
} from 'lucide-react';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';
import supabase from '@/config/supabaseClient';

// Types
interface SystemWallet {
    id: string;
    balance: number;
    total_commission_earned: number;
    total_paid_out: number;
    updated_at: string;
}

interface TheaterBalance {
    id: string;
    name: string;
    walletBalance: number;
    contractType: string;
    commissionRate: number;
    bankName: string;
    bankAccount: string;
    accountName: string;
    email: string;
    phone: string;
    address: string;
    totalEarned: number;
}

interface WithdrawalRequest {
    id: string;
    theater_id: string;
    theater_name: string;
    amount: number;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    request_date: string;
    processed_date?: string;
    rejection_reason?: string;
    bank_name: string;
    bank_account: string;
    account_name: string;
}

// Helper functions
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'ETB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount || 0);
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

const WalletBalance: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [systemWallet, setSystemWallet] = useState<SystemWallet | null>(null);
    const [theaterBalances, setTheaterBalances] = useState<TheaterBalance[]>([]);
    const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
    const [showBalance, setShowBalance] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [activeTab, setActiveTab] = useState<'theaters' | 'withdrawals'>('theaters');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });
    const [selectedTheater, setSelectedTheater] = useState<TheaterBalance | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Fetch all data from Supabase
    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchSystemWallet(),
                fetchTheaterBalances(),
                fetchWithdrawalRequests()
            ]);
        } catch (error) {
            console.error('Error fetching wallet data:', error);
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // FETCH SYSTEM WALLET FROM DATABASE
    // ============================================
    const fetchSystemWallet = async () => {
        try {
            const { data, error } = await supabase
                .from('system_wallet')
                .select('*')
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            
            if (data) {
                setSystemWallet(data);
            } else {
                const { data: newWallet, error: insertError } = await supabase
                    .from('system_wallet')
                    .insert({ balance: 0, total_commission_earned: 0, total_paid_out: 0 })
                    .select()
                    .single();
                
                if (!insertError && newWallet) {
                    setSystemWallet(newWallet);
                }
            }
        } catch (error) {
            console.error('Error fetching system wallet:', error);
            setSystemWallet(null);
        }
    };

    // ============================================
    // FETCH THEATER BALANCES FROM DATABASE
    // ============================================
    const fetchTheaterBalances = async () => {
        try {
            const { data: theaters, error: theatersError } = await supabase
                .from('theaters')
                .select('id, legal_business_name, email, phone, address, status')
                .eq('status', 'approved');

            if (theatersError) throw theatersError;
            if (!theaters || theaters.length === 0) {
                setTheaterBalances([]);
                return;
            }

            const { data: wallets, error: walletsError } = await supabase
                .from('theaters_wallet')
                .select('theater_id, balance');

            if (walletsError) throw walletsError;

            const { data: contracts, error: contractsError } = await supabase
                .from('owners_contracts')
                .select('theater_id, contract_type, commission_rate')
                .eq('status', 'active');

            if (contractsError) throw contractsError;

            const { data: owners, error: ownersError } = await supabase
                .from('owners')
                .select('user_id, bank_name, bank_account_number, business_name');

            if (ownersError) throw ownersError;

            const { data: earnings, error: earningsError } = await supabase
                .from('earnings')
                .select('theater_id, net_amount')
                .eq('is_subscription_payment', false);

            if (earningsError) throw earningsError;

            const earningsByTheater: Record<string, number> = {};
            earnings?.forEach(e => {
                earningsByTheater[e.theater_id] = (earningsByTheater[e.theater_id] || 0) + (e.net_amount || 0);
            });

            const balances: TheaterBalance[] = theaters.map(theater => {
                const wallet = wallets?.find(w => w.theater_id === theater.id);
                const contract = contracts?.find(c => c.theater_id === theater.id);
                const owner = owners?.find(o => o.user_id === theater.id);
                
                return {
                    id: theater.id,
                    name: theater.legal_business_name,
                    walletBalance: wallet?.balance || 0,
                    totalEarned: earningsByTheater[theater.id] || 0,
                    contractType: contract?.contract_type || 'N/A',
                    commissionRate: contract?.commission_rate || 0,
                    bankName: owner?.bank_name || 'N/A',
                    bankAccount: owner?.bank_account_number || 'N/A',
                    accountName: owner?.business_name || theater.legal_business_name,
                    email: theater.email || 'N/A',
                    phone: theater.phone || 'N/A',
                    address: theater.address || 'N/A'
                };
            });

            setTheaterBalances(balances);
        } catch (error) {
            console.error('Error fetching theater balances:', error);
            setTheaterBalances([]);
        }
    };

    // ============================================
    // FETCH WITHDRAWAL REQUESTS
    // ============================================
    const fetchWithdrawalRequests = async () => {
        try {
            const { data: withdrawals, error } = await supabase
                .from('withdrawal_requests')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching withdrawal requests:', error);
                setWithdrawalRequests([]);
                return;
            }

            // Get theater names
            const { data: theaters } = await supabase
                .from('theaters')
                .select('id, legal_business_name');

            const theaterMap = new Map();
            theaters?.forEach(t => theaterMap.set(t.id, t.legal_business_name));

            const formattedRequests: WithdrawalRequest[] = withdrawals?.map(w => ({
                id: w.id,
                theater_id: w.theater_id,
                theater_name: theaterMap.get(w.theater_id) || 'Unknown Theater',
                amount: w.amount,
                reason: w.reason || 'Withdrawal request',
                status: w.status,
                request_date: w.created_at,
                processed_date: w.processed_at,
                rejection_reason: w.rejection_reason,
                bank_name: w.bank_name || 'N/A',
                bank_account: w.bank_account || 'N/A',
                account_name: w.account_name || 'N/A'
            })) || [];

            setWithdrawalRequests(formattedRequests);
        } catch (error) {
            console.error('Error fetching withdrawal requests:', error);
            setWithdrawalRequests([]);
        }
    };

    // ============================================
    // APPROVE WITHDRAWAL REQUEST
    // ============================================
    const handleApproveWithdrawal = async () => {
        if (!selectedRequest) return;
        
        setIsProcessing(true);
        
        try {
            // Update withdrawal request status
            const { error: updateError } = await supabase
                .from('withdrawal_requests')
                .update({
                    status: 'approved',
                    processed_at: new Date().toISOString()
                })
                .eq('id', selectedRequest.id);

            if (updateError) throw updateError;

            // Deduct from theater wallet
            const { data: wallet } = await supabase
                .from('theaters_wallet')
                .select('balance')
                .eq('theater_id', selectedRequest.theater_id)
                .single();

            if (wallet) {
                const newBalance = (wallet.balance || 0) - selectedRequest.amount;
                
                await supabase
                    .from('theaters_wallet')
                    .update({ 
                        balance: newBalance,
                        updated_at: new Date().toISOString()
                    })
                    .eq('theater_id', selectedRequest.theater_id);
            }

            // Update system wallet paid out total
            if (systemWallet) {
                await supabase
                    .from('system_wallet')
                    .update({
                        total_paid_out: (systemWallet.total_paid_out || 0) + selectedRequest.amount,
                        balance: (systemWallet.balance || 0) - selectedRequest.amount,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', systemWallet.id);
            }

            setPopupMessage({
                title: 'Withdrawal Approved',
                message: `${formatCurrency(selectedRequest.amount)} withdrawal request for ${selectedRequest.theater_name} has been approved.`,
                type: 'success'
            });
            setShowSuccessPopup(true);
            
            // Refresh data
            await fetchAllData();
            
        } catch (error) {
            console.error('Error approving withdrawal:', error);
            setPopupMessage({
                title: 'Error',
                message: 'Failed to approve withdrawal request.',
                type: 'error'
            });
            setShowSuccessPopup(true);
        } finally {
            setIsProcessing(false);
            setShowApproveModal(false);
            setSelectedRequest(null);
        }
    };

    // ============================================
    // REJECT WITHDRAWAL REQUEST
    // ============================================
    const handleRejectWithdrawal = async () => {
        if (!selectedRequest) return;
        
        setIsProcessing(true);
        
        try {
            const { error: updateError } = await supabase
                .from('withdrawal_requests')
                .update({
                    status: 'rejected',
                    processed_at: new Date().toISOString(),
                    rejection_reason: rejectionReason
                })
                .eq('id', selectedRequest.id);

            if (updateError) throw updateError;

            setPopupMessage({
                title: 'Withdrawal Rejected',
                message: `${formatCurrency(selectedRequest.amount)} withdrawal request for ${selectedRequest.theater_name} has been rejected.`,
                type: 'warning'
            });
            setShowSuccessPopup(true);
            
            // Refresh data
            await fetchAllData();
            
        } catch (error) {
            console.error('Error rejecting withdrawal:', error);
            setPopupMessage({
                title: 'Error',
                message: 'Failed to reject withdrawal request.',
                type: 'error'
            });
            setShowSuccessPopup(true);
        } finally {
            setIsProcessing(false);
            setShowRejectModal(false);
            setSelectedRequest(null);
            setRejectionReason('');
        }
    };

    const getContractBadge = (type: string) => {
        if (type === 'subscription') {
            return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">📅 Subscription</span>;
        }
        if (type === 'per_ticket') {
            return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">🎫 Per Ticket</span>;
        }
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{type}</span>;
    };

    const getStatusBadge = (status: string) => {
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

    const getFilteredTheaters = () => {
        let filtered = theaterBalances;
        if (searchTerm) {
            filtered = filtered.filter(t => 
                t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.phone.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return filtered;
    };

    const getFilteredWithdrawals = () => {
        let filtered = withdrawalRequests;
        if (searchTerm) {
            filtered = filtered.filter(w => 
                w.theater_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                w.id.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (filterStatus !== 'all') {
            filtered = filtered.filter(w => w.status === filterStatus);
        }
        return filtered;
    };

    const handleViewDetails = (theater: TheaterBalance) => {
        setSelectedTheater(theater);
        setShowDetailsModal(true);
    };

    const handleApproveClick = (request: WithdrawalRequest) => {
        setSelectedRequest(request);
        setShowApproveModal(true);
    };

    const handleRejectClick = (request: WithdrawalRequest) => {
        setSelectedRequest(request);
        setShowRejectModal(true);
    };

    const pendingCount = withdrawalRequests.filter(w => w.status === 'pending').length;

    // Details Modal Component
    const DetailsModal = () => {
        if (!selectedTheater) return null;

        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDetailsModal(false)}>
                <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4 rounded-t-2xl">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <Building className="h-5 w-5 text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-white">Theater Details</h2>
                            </div>
                            <button onClick={() => setShowDetailsModal(false)} className="p-1 hover:bg-white/20 rounded-lg transition">
                                <X className="h-5 w-5 text-white" />
                            </button>
                        </div>
                        <p className="text-teal-100 text-sm mt-2 ml-14">{selectedTheater.name}</p>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-4">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-teal-600" />
                                Financial Information
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500">Wallet Balance</p>
                                    <p className="text-xl font-bold text-teal-600">{formatCurrency(selectedTheater.walletBalance)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Total Earned</p>
                                    <p className="text-xl font-bold text-green-600">{formatCurrency(selectedTheater.totalEarned)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Contract Type</p>
                                    <p className="text-sm font-medium text-gray-900">{selectedTheater.contractType}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Commission Rate</p>
                                    <p className="text-sm font-medium text-gray-900">{selectedTheater.commissionRate}%</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <Users className="h-4 w-4 text-blue-600" />
                                Contact Information
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500">Email</p>
                                    <p className="text-sm text-gray-900 flex items-center gap-1">
                                        <Mail className="h-3 w-3 text-gray-400" />
                                        {selectedTheater.email}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Phone</p>
                                    <p className="text-sm text-gray-900 flex items-center gap-1">
                                        <Phone className="h-3 w-3 text-gray-400" />
                                        {selectedTheater.phone}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-xs text-gray-500">Address</p>
                                    <p className="text-sm text-gray-900 flex items-center gap-1">
                                        <MapPin className="h-3 w-3 text-gray-400" />
                                        {selectedTheater.address}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <Landmark className="h-4 w-4 text-yellow-600" />
                                Banking Information
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500">Bank Name</p>
                                    <p className="text-sm font-medium text-gray-900">{selectedTheater.bankName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Account Number</p>
                                    <p className="text-sm text-gray-900">{selectedTheater.bankAccount}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-xs text-gray-500">Account Name</p>
                                    <p className="text-sm text-gray-900">{selectedTheater.accountName}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end">
                        <button
                            onClick={() => setShowDetailsModal(false)}
                            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center gap-2"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Theater Columns
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
                        <p className="text-xs text-gray-500">ID: {row.id.slice(-8)}</p>
                    </div>
                </div>
            )
        },
        {
            Header: 'Wallet Balance',
            accessor: 'walletBalance',
            sortable: true,
            Cell: (row: TheaterBalance) => (
                <p className="font-bold text-gray-900">{showBalance ? formatCurrency(row.walletBalance) : '••••••'}</p>
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
            Header: 'Contract',
            accessor: 'contractType',
            sortable: true,
            Cell: (row: TheaterBalance) => getContractBadge(row.contractType)
        },
        {
            Header: 'Commission',
            accessor: 'commissionRate',
            sortable: true,
            Cell: (row: TheaterBalance) => (
                <div className="flex items-center gap-1">
                    <Percent className="h-3 w-3 text-gray-400" />
                    <span>{row.commissionRate}%</span>
                </div>
            )
        },
        {
            Header: 'Contact',
            accessor: 'email',
            sortable: true,
            Cell: (row: TheaterBalance) => (
                <div>
                    <p className="text-sm text-gray-900">{row.email}</p>
                    <p className="text-xs text-gray-500">{row.phone}</p>
                </div>
            )
        },
        {
            Header: 'Actions',
            accessor: 'id',
            sortable: false,
            Cell: (row: TheaterBalance) => (
                <button
                    onClick={() => handleViewDetails(row)}
                    className="px-3 py-1.5 text-sm bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition-colors flex items-center gap-1"
                >
                    <Info className="h-3.5 w-3.5" />
                    View Details
                </button>
            )
        }
    ];

    // Withdrawal Columns
    const withdrawalColumns = [
        {
            Header: 'Theater',
            accessor: 'theater_name',
            sortable: true,
            Cell: (row: WithdrawalRequest) => (
                <div>
                    <p className="font-medium text-gray-900">{row.theater_name}</p>
                    <p className="text-xs text-gray-500">ID: {row.id.slice(-8)}</p>
                </div>
            )
        },
        {
            Header: 'Amount',
            accessor: 'amount',
            sortable: true,
            Cell: (row: WithdrawalRequest) => (
                <p className="font-bold text-orange-600">{formatCurrency(row.amount)}</p>
            )
        },
        {
            Header: 'Bank Details',
            accessor: 'bank_name',
            sortable: true,
            Cell: (row: WithdrawalRequest) => (
                <div>
                    <p className="text-sm text-gray-900">{row.bank_name}</p>
                    <p className="text-xs text-gray-500">{row.account_name}</p>
                </div>
            )
        },
        {
            Header: 'Request Date',
            accessor: 'request_date',
            sortable: true,
            Cell: (row: WithdrawalRequest) => (
                <p className="text-sm text-gray-900">{formatDateTime(row.request_date)}</p>
            )
        },
        {
            Header: 'Status',
            accessor: 'status',
            sortable: true,
            Cell: (row: WithdrawalRequest) => getStatusBadge(row.status)
        },
        {
            Header: 'Actions',
            accessor: 'id',
            sortable: false,
            Cell: (row: WithdrawalRequest) => (
                row.status === 'pending' ? (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleApproveClick(row)}
                            className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                            title="Approve"
                        >
                            <Check className="h-4 w-4 text-green-600" />
                        </button>
                        <button
                            onClick={() => handleRejectClick(row)}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                            title="Reject"
                        >
                            <X className="h-4 w-4 text-red-600" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => {
                            setSelectedRequest(row);
                            setShowDetailsModal(true);
                        }}
                        className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                        title="View Details"
                    >
                        <Info className="h-4 w-4 text-blue-600" />
                    </button>
                )
            )
        }
    ];

    const totalTheaterBalance = theaterBalances.reduce((sum, t) => sum + t.walletBalance, 0);

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
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                            <Wallet className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Wallet Management</h1>
                            <p className="text-gray-600">Manage system wallet, theater balances, and withdrawal requests</p>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 text-white shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-white/20 rounded-xl">
                                    <Wallet className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-white/80 text-base font-medium">System Wallet</span>
                            </div>
                            <button onClick={() => setShowBalance(!showBalance)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
                                {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        <p className="text-3xl font-bold">{showBalance ? formatCurrency(systemWallet?.balance || 0) : '••••••'}</p>
                        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/20">
                            <div>
                                <p className="text-white/60 text-xs">Total Commission</p>
                                <p className="text-white font-semibold">{formatCurrency(systemWallet?.total_commission_earned || 0)}</p>
                            </div>
                            <div>
                                <p className="text-white/60 text-xs">Total Paid Out</p>
                                <p className="text-white font-semibold">{formatCurrency(systemWallet?.total_paid_out || 0)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 bg-white/20 rounded-xl">
                                <Building className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-white/80 text-base font-medium">Theaters Total Balance</span>
                        </div>
                        <p className="text-3xl font-bold">{showBalance ? formatCurrency(totalTheaterBalance) : '••••••'}</p>
                        <p className="text-white/70 text-sm mt-3">Across {theaterBalances.length} theaters</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 bg-white/20 rounded-xl">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-white/80 text-base font-medium">Active Theaters</span>
                        </div>
                        <p className="text-3xl font-bold">{theaterBalances.length}</p>
                        <p className="text-white/70 text-sm mt-3">Approved theaters</p>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 bg-white/20 rounded-xl">
                                <Clock className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-white/80 text-base font-medium">Pending Withdrawals</span>
                        </div>
                        <p className="text-3xl font-bold">{pendingCount}</p>
                        <p className="text-white/70 text-sm mt-3">Awaiting approval</p>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex gap-2 bg-gray-100 rounded-lg p-1 mb-6 w-fit">
                    <button
                        onClick={() => setActiveTab('theaters')}
                        className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                            activeTab === 'theaters' ? 'bg-teal-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <Building className="h-4 w-4" />
                        Theater Wallets
                    </button>
                    <button
                        onClick={() => setActiveTab('withdrawals')}
                        className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 relative ${
                            activeTab === 'withdrawals' ? 'bg-teal-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <CreditCard className="h-4 w-4" />
                        Withdrawal Requests
                        {pendingCount > 0 && (
                            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                {pendingCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Search */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="relative min-w-[300px] flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={activeTab === 'theaters' ? "Search theaters by name, ID, email, or phone..." : "Search withdrawal requests..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                        />
                    </div>
                    {activeTab === 'withdrawals' && (
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white min-w-[140px]"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    )}
                </div>

                {/* Content Tables */}
                {activeTab === 'theaters' ? (
                    <ReusableTable
                        columns={theaterColumns}
                        data={getFilteredTheaters()}
                        title="Theater Wallet Balances"
                        icon={Wallet}
                        showSearch={false}
                        showExport={false}
                        showPrint={false}
                        itemsPerPage={10}
                    />
                ) : (
                    <ReusableTable
                        columns={withdrawalColumns}
                        data={getFilteredWithdrawals()}
                        title="Withdrawal Requests"
                        icon={CreditCard}
                        showSearch={false}
                        showExport={false}
                        showPrint={false}
                        itemsPerPage={10}
                    />
                )}

                {/* Approve Modal */}
                {showApproveModal && selectedRequest && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-2xl max-w-md w-full"
                        >
                            <div className="border-b px-6 py-4 bg-green-600 rounded-t-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-full">
                                        <CheckCircle className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Approve Withdrawal</h2>
                                        <p className="text-sm text-white/80">{selectedRequest.theater_name}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600">Amount:</span>
                                        <span className="font-bold text-green-600">{formatCurrency(selectedRequest.amount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Bank:</span>
                                        <span className="text-gray-900">{selectedRequest.bank_name}</span>
                                    </div>
                                </div>
                                <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                                        <p className="text-xs text-yellow-800">
                                            This will deduct {formatCurrency(selectedRequest.amount)} from the theater's wallet.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setShowApproveModal(false);
                                        setSelectedRequest(null);
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleApproveWithdrawal}
                                    disabled={isProcessing}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition flex items-center gap-2"
                                >
                                    {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                    Confirm Approval
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Reject Modal */}
                {showRejectModal && selectedRequest && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-2xl max-w-md w-full"
                        >
                            <div className="border-b px-6 py-4 bg-red-600 rounded-t-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-full">
                                        <XCircle className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Reject Withdrawal</h2>
                                        <p className="text-sm text-white/80">{selectedRequest.theater_name}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600">Amount:</span>
                                        <span className="font-bold text-orange-600">{formatCurrency(selectedRequest.amount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Bank:</span>
                                        <span className="text-gray-900">{selectedRequest.bank_name}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Rejection Reason <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none resize-none"
                                        placeholder="Provide a reason for rejection..."
                                    />
                                </div>
                            </div>
                            <div className="border-t px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setShowRejectModal(false);
                                        setSelectedRequest(null);
                                        setRejectionReason('');
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRejectWithdrawal}
                                    disabled={isProcessing || !rejectionReason}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition flex items-center gap-2"
                                >
                                    {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                                    Confirm Rejection
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Details Modal */}
                {showDetailsModal && <DetailsModal />}

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