// src/pages/Admin/wallet/WalletBalance.tsx
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
    Building,
    CreditCard,
    Check,
    X,
    FileText,
    User,
    Mail,
    Phone,
    Calendar,
    Landmark,
    MapPin,
    Loader2,
    Percent,
    DollarSign
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
}

interface WithdrawalRequest {
    id: string;
    theaterId: string;
    theaterName: string;
    amount: number;
    bankName: string;
    bankAccount: string;
    accountName: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    requestDate: string;
    processedDate?: string;
    rejectionReason?: string;
    notes?: string;
    email?: string;
    phone?: string;
    address?: string;
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

const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

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

// Withdrawal Details Modal
const WithdrawalDetailsModal: React.FC<{
    request: WithdrawalRequest;
    isOpen: boolean;
    onClose: () => void;
    onApprove?: (request: WithdrawalRequest, notes: string) => void;
    onReject?: (request: WithdrawalRequest, reason: string) => void;
}> = ({ request, isOpen, onClose, onApprove, onReject }) => {
    const [showApproveForm, setShowApproveForm] = useState(false);
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [approvalNotes, setApprovalNotes] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const getStatusColor = () => {
        switch (request.status) {
            case 'approved': return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    const getStatusIcon = () => {
        switch (request.status) {
            case 'approved': return <CheckCircle className="h-5 w-5 text-green-600" />;
            case 'rejected': return <XCircle className="h-5 w-5 text-red-600" />;
            default: return <Clock className="h-5 w-5 text-yellow-600" />;
        }
    };

    const handleApprove = async () => {
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        onApprove?.(request, approvalNotes);
        setShowApproveForm(false);
        setApprovalNotes('');
        setIsSubmitting(false);
        onClose();
    };

    const handleReject = async () => {
        if (!rejectionReason) return;
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        onReject?.(request, rejectionReason);
        setShowRejectForm(false);
        setRejectionReason('');
        setIsSubmitting(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 rounded-t-2xl z-10">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <CreditCard className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Withdrawal Request Details</h2>
                                <p className="text-xs text-white/80">Request ID: {request.id.slice(-8)}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition">
                            <X className="h-5 w-5 text-white" />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor()} mb-6`}>
                        {getStatusIcon()}
                        <span className="capitalize">{request.status}</span>
                        {request.status === 'pending' && ' - Awaiting Review'}
                    </div>

                    {/* Request Information */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                            <FileText className="h-5 w-5 text-indigo-600" />
                            Request Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-lg p-3">
                                <label className="text-xs text-gray-500">Theater Name</label>
                                <p className="text-sm font-medium text-gray-900">{request.theaterName}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <label className="text-xs text-gray-500">Request Amount</label>
                                <p className="text-lg font-bold text-green-600">{formatCurrency(request.amount)}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <label className="text-xs text-gray-500">Request Date</label>
                                <p className="text-sm text-gray-900">{formatDateTime(request.requestDate)}</p>
                            </div>
                            <div className="col-span-2 bg-gray-50 rounded-lg p-3">
                                <label className="text-xs text-gray-500">Reason for Withdrawal</label>
                                <p className="text-sm text-gray-900">{request.reason}</p>
                            </div>
                        </div>
                    </div>

                    {/* Bank Details */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                            <Landmark className="h-5 w-5 text-indigo-600" />
                            Bank Account Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-lg p-3">
                                <label className="text-xs text-gray-500">Bank Name</label>
                                <p className="text-sm font-medium text-gray-900">{request.bankName || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <label className="text-xs text-gray-500">Account Number</label>
                                <p className="text-sm font-mono text-gray-900">****{request.bankAccount?.slice(-4) || 'N/A'}</p>
                            </div>
                            <div className="col-span-2 bg-gray-50 rounded-lg p-3">
                                <label className="text-xs text-gray-500">Account Holder Name</label>
                                <p className="text-sm text-gray-900">{request.accountName || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                            <User className="h-5 w-5 text-indigo-600" />
                            Contact Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-lg p-3">
                                <label className="text-xs text-gray-500">Email</label>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-3 w-3 text-gray-400" />
                                    <p className="text-sm text-gray-900">{request.email || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <label className="text-xs text-gray-500">Phone</label>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-3 w-3 text-gray-400" />
                                    <p className="text-sm text-gray-900">{request.phone || 'N/A'}</p>
                                </div>
                            </div>
                            {request.address && (
                                <div className="col-span-2 bg-gray-50 rounded-lg p-3">
                                    <label className="text-xs text-gray-500">Address</label>
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-3 w-3 text-gray-400 mt-0.5" />
                                        <p className="text-sm text-gray-900">{request.address}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Processing Information */}
                    {(request.status === 'approved' || request.status === 'rejected') && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                                <Clock className="h-5 w-5 text-indigo-600" />
                                Processing Information
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <label className="text-xs text-gray-500">Processed Date</label>
                                    <p className="text-sm text-gray-900">{formatDateTime(request.processedDate || '')}</p>
                                </div>
                                {request.notes && (
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <label className="text-xs text-gray-500">Notes</label>
                                        <p className="text-sm text-gray-900">{request.notes}</p>
                                    </div>
                                )}
                                {request.rejectionReason && (
                                    <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                                        <label className="text-xs text-red-600 font-medium">Rejection Reason</label>
                                        <p className="text-sm text-red-700 mt-1">{request.rejectionReason}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    {request.status === 'pending' && !showApproveForm && !showRejectForm && (
                        <div className="border-t pt-6">
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowApproveForm(true)}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                                >
                                    <Check className="h-4 w-4" />
                                    Approve Withdrawal
                                </button>
                                <button
                                    onClick={() => setShowRejectForm(true)}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
                                >
                                    <X className="h-4 w-4" />
                                    Reject Withdrawal
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Approve Form */}
                    {showApproveForm && (
                        <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                            <h3 className="text-sm font-semibold text-green-800 mb-3">Approve Withdrawal Request</h3>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Approval Notes (Optional)</label>
                                <textarea
                                    value={approvalNotes}
                                    onChange={(e) => setApprovalNotes(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none"
                                    placeholder="Add any internal notes..."
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowApproveForm(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleApprove}
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                    Confirm Approval
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Reject Form */}
                    {showRejectForm && (
                        <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200">
                            <h3 className="text-sm font-semibold text-red-800 mb-3">Reject Withdrawal Request</h3>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rejection Reason <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none resize-none"
                                    placeholder="Provide a clear reason for rejection..."
                                    required
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowRejectForm(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReject}
                                    disabled={isSubmitting || !rejectionReason}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                                    Confirm Rejection
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

const WalletBalance: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [systemWallet, setSystemWallet] = useState<SystemWallet | null>(null);
    const [theaterBalances, setTheaterBalances] = useState<TheaterBalance[]>([]);
    const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
    const [activeTab, setActiveTab] = useState<'theaters' | 'withdrawals'>('theaters');
    const [showBalance, setShowBalance] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });
    const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
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
            }
        } catch (error) {
            console.error('Error fetching system wallet:', error);
            setSystemWallet(null);
        }
    };

    // ============================================
    // FETCH THEATER BALANCES FROM DATABASE
    // Uses: theaters_wallet (renamed from wallet), theaters, owners_contracts, owners tables
    // ============================================
    const fetchTheaterBalances = async () => {
        try {
            // Get all approved theaters
            const { data: theaters, error: theatersError } = await supabase
                .from('theaters')
                .select('id, legal_business_name, email, phone, address, status')
                .eq('status', 'approved');

            if (theatersError) throw theatersError;
            if (!theaters || theaters.length === 0) {
                setTheaterBalances([]);
                return;
            }

            // Get wallet balances from theaters_wallet table (renamed from wallet)
            const { data: wallets, error: walletsError } = await supabase
                .from('theaters_wallet')
                .select('theater_id, balance');

            if (walletsError) throw walletsError;

            // Get contracts from owners_contracts table
            const { data: contracts, error: contractsError } = await supabase
                .from('owners_contracts')
                .select('theater_id, contract_type, commission_rate')
                .eq('status', 'active');

            if (contractsError) throw contractsError;

            // Get owners for bank details
          // Get owners for bank details (linked by user_id)
const { data: owners, error: ownersError } = await supabase
    .from('owners')
    .select('user_id, bank_name, bank_account_number, business_name');

if (ownersError) throw ownersError;

// Build theater balances from real database data
const balances: TheaterBalance[] = theaters.map(theater => {
    const wallet = wallets?.find(w => w.theater_id === theater.id);
    const contract = contracts?.find(c => c.theater_id === theater.id);
    const owner = owners?.find(o => o.user_id === theater.id);
    
    return {
        id: theater.id,
        name: theater.legal_business_name,
        walletBalance: wallet?.balance || 0,
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
// FETCH WITHDRAWAL REQUESTS FROM DATABASE
// Uses: withdrawal_requests table
// ============================================
const fetchWithdrawalRequests = async () => {
    try {
        const { data: withdrawals, error } = await supabase
            .from('withdrawal_requests')
            .select(`
                id,
                theater_id,
                amount,
                reason,
                status,
                created_at,
                processed_at,
                rejection_reason,
                notes,
                theaters:theater_id (
                    legal_business_name,
                    email,
                    phone,
                    address
                ),
                owners:theater_id (
                    bank_name,
                    bank_account_number,
                    business_name
                )
            `)
            .order('created_at', { ascending: false });

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching withdrawal requests:', error);
            setWithdrawalRequests([]);
            return;
        }

        if (withdrawals && withdrawals.length > 0) {
            const formattedRequests: WithdrawalRequest[] = withdrawals.map(w => ({
                id: w.id,
                theaterId: w.theater_id,
                theaterName: w.theaters?.legal_business_name || 'Unknown',
                amount: w.amount,
                bankName: w.owners?.bank_name || 'N/A',
                bankAccount: w.owners?.bank_account_number || 'N/A',
                accountName: w.owners?.business_name || 'N/A',
                reason: w.reason,
                status: w.status,
                requestDate: w.created_at,
                processedDate: w.processed_at,
                rejectionReason: w.rejection_reason,
                notes: w.notes,
                email: w.theaters?.email,
                phone: w.theaters?.phone,
                address: w.theaters?.address
            }));
            setWithdrawalRequests(formattedRequests);
        } else {
            setWithdrawalRequests([]);
        }
    } catch (error) {
        console.error('Error fetching withdrawal requests:', error);
        setWithdrawalRequests([]);
    }
};

// ============================================
// UPDATE WITHDRAWAL STATUS IN DATABASE
// ============================================
const updateWithdrawalStatus = async (requestId: string, status: 'approved' | 'rejected', notes?: string) => {
    const updateData: any = {
        status: status,
        processed_at: new Date().toISOString()
    };
    
    if (status === 'approved') {
        updateData.notes = notes;
    } else if (status === 'rejected') {
        updateData.rejection_reason = notes;
    }

    const { error } = await supabase
        .from('withdrawal_requests')
        .update(updateData)
        .eq('id', requestId);

    if (error) {
        console.error('Error updating withdrawal status:', error);
        throw error;
    }

    // If approved, update theater wallet balance in theaters_wallet table
    if (status === 'approved') {
        const request = withdrawalRequests.find(r => r.id === requestId);
        if (request) {
            // Get current wallet balance from theaters_wallet table
            const { data: wallet } = await supabase
                .from('theaters_wallet')
                .select('balance')
                .eq('theater_id', request.theaterId)
                .single();

            if (wallet) {
                const newBalance = (wallet.balance || 0) - request.amount;
                
                await supabase
                    .from('theaters_wallet')
                    .update({ 
                        balance: newBalance,
                        updated_at: new Date().toISOString()
                    })
                    .eq('theater_id', request.theaterId);
            }
        }
    }
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

const getContractBadge = (type: string) => {
    if (type === 'subscription') {
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">📅 Subscription</span>;
    }
    if (type === 'per_ticket') {
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">🎫 Per Ticket</span>;
    }
    return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{type}</span>;
};

const handleExport = () => {
    const csvContent = [
        ['Theater Name', 'Wallet Balance', 'Contract Type', 'Commission Rate', 'Bank Name', 'Email', 'Phone'],
        ...theaterBalances.map(t => [
            t.name, 
            t.walletBalance, 
            t.contractType, 
            t.commissionRate, 
            t.bankName,
            t.email,
            t.phone
        ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `theater_wallet_balances_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    setPopupMessage({
        title: 'Export Successful',
        message: 'Theater wallet balances exported to CSV',
        type: 'success'
    });
    setShowSuccessPopup(true);
};

const handleApproveRequest = async (request: WithdrawalRequest, notes: string) => {
    setIsProcessing(true);
    try {
        await updateWithdrawalStatus(request.id, 'approved', notes);
        await fetchAllData();
        setPopupMessage({
            title: 'Withdrawal Approved',
            message: `${formatCurrency(request.amount)} has been approved for ${request.theaterName}`,
            type: 'success'
        });
        setShowSuccessPopup(true);
    } catch (error) {
        setPopupMessage({
            title: 'Error',
            message: 'Failed to approve withdrawal',
            type: 'error'
        });
        setShowSuccessPopup(true);
    } finally {
        setIsProcessing(false);
    }
};

const handleRejectRequest = async (request: WithdrawalRequest, reason: string) => {
    setIsProcessing(true);
    try {
        await updateWithdrawalStatus(request.id, 'rejected', reason);
        await fetchAllData();
        setPopupMessage({
            title: 'Withdrawal Rejected',
            message: `${formatCurrency(request.amount)} withdrawal for ${request.theaterName} has been rejected`,
            type: 'warning'
        });
        setShowSuccessPopup(true);
    } catch (error) {
        setPopupMessage({
            title: 'Error',
            message: 'Failed to reject withdrawal',
            type: 'error'
        });
        setShowSuccessPopup(true);
    } finally {
        setIsProcessing(false);
    }
};

const handleViewDetails = (request: WithdrawalRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
};

// Filter functions
const getFilteredTheaters = () => {
    let filtered = theaterBalances;
    if (searchTerm) {
        filtered = filtered.filter(t => 
            t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    return filtered;
};

const getFilteredWithdrawals = () => {
    let filtered = withdrawalRequests;
    if (searchTerm) {
        filtered = filtered.filter(w => 
            w.theaterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            w.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    if (filterStatus !== 'all') {
        filtered = filtered.filter(w => w.status === filterStatus);
    }
    return filtered;
};

// Column definitions for theater wallets
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
        Header: 'Bank',
        accessor: 'bankName',
        sortable: true,
        Cell: (row: TheaterBalance) => (
            <div>
                <p className="text-sm text-gray-900">{row.bankName}</p>
                <p className="text-xs text-gray-500">****{row.bankAccount.slice(-4)}</p>
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
    }
];

// Column definitions for withdrawal requests
const withdrawalColumns = [
    {
        Header: 'Theater',
        accessor: 'theaterName',
        sortable: true,
        Cell: (row: WithdrawalRequest) => (
            <div>
                <p className="font-medium text-gray-900">{row.theaterName}</p>
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
        Header: 'Bank',
        accessor: 'bankName',
        sortable: true,
        Cell: (row: WithdrawalRequest) => (
            <div>
                <p className="text-sm text-gray-900">{row.bankName}</p>
                <p className="text-xs text-gray-500">****{row.bankAccount?.slice(-4) || 'N/A'}</p>
            </div>
        )
    },
    {
        Header: 'Request Date',
        accessor: 'requestDate',
        sortable: true,
        Cell: (row: WithdrawalRequest) => (
            <p className="text-sm text-gray-900">{formatDateTime(row.requestDate)}</p>
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
            <div className="flex items-center gap-2">
                <button
                    onClick={() => handleViewDetails(row)}
                    className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                    title="View Details"
                >
                    <Eye className="h-4 w-4 text-blue-600" />
                </button>
            </div>
        )
    }
];

const pendingCount = withdrawalRequests.filter(w => w.status === 'pending').length;
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
                        <h1 className="text-2xl font-bold text-gray-900">Theater Wallet Management</h1>
                        <p className="text-gray-600">Manage system wallet and theater balances</p>
                    </div>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* System Wallet Card */}
                <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 text-white shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white/20 rounded-xl">
                                <DollarSign className="h-6 w-6 text-white" />
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

                {/* Theater Wallets Total */}
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

                {/* Pending Withdrawals */}
                <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-white/20 rounded-xl">
                            <Clock className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-white/80 text-base font-medium">Pending Withdrawals</span>
                    </div>
                    <p className="text-3xl font-bold">{pendingCount}</p>
                    <p className="text-white/70 text-sm mt-3">Awaiting review</p>
                </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex flex-wrap gap-2 bg-gray-100 rounded-lg p-1 mb-6 w-fit">
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
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            {pendingCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="relative min-w-[250px]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder={activeTab === 'theaters' ? "Search theaters..." : "Search withdrawal requests..."}
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
                {activeTab === 'theaters' && (
                    <ReusableButton
                        onClick={handleExport}
                        label="Export Wallets"
                        className="px-4 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white"
                    />
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

            {/* Withdrawal Details Modal */}
            {showDetailsModal && selectedRequest && (
                <WithdrawalDetailsModal
                    request={selectedRequest}
                    isOpen={showDetailsModal}
                    onClose={() => {
                        setShowDetailsModal(false);
                        setSelectedRequest(null);
                    }}
                    onApprove={handleApproveRequest}
                    onReject={handleRejectRequest}
                />
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