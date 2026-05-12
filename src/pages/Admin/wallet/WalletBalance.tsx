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
    History,
    Building,
    TrendingUp,
    Users,
    CreditCard,
    AlertCircle,
    Check,
    X,
    DollarSign,
    FileText,
    Send,
    MessageSquare,
    User,
    Mail,
    Phone,
    Calendar,
    Banknote,
    Landmark,
    Info,
    MapPin,
    Loader2
} from 'lucide-react';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import ReusableTable from '../../../components/Reusable/ReusableTable';
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
    source?: 'system' | 'theater';
    theaterName?: string;
    theaterId?: string;
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

interface WithdrawalRequest {
    id: string;
    theaterId: string;
    theaterName: string;
    amount: number;
    bankAccount: string;
    accountName: string;
    bankName: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    requestDate: string;
    processedDate?: string;
    rejectionReason?: string;
    notes?: string;
    processedBy?: string;
    contactEmail?: string;
    contactPhone?: string;
    theaterAddress?: string;
}

// Helper function to format relative time
const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return `${Math.floor(diffMins / 1440)} days ago`;
};

// Professional View Details Modal Component
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

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'ETB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDateTime = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 rounded-t-2xl z-10">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <CreditCard className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Withdrawal Request Details</h2>
                                <p className="text-xs text-white/80">Request ID: {request.id}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition">
                            <X className="h-5 w-5 text-white" />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {/* Status Badge */}
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor()} mb-6`}>
                        {getStatusIcon()}
                        <span className="capitalize">{request.status}</span>
                        {request.status === 'pending' && ' - Awaiting Review'}
                    </div>

                    {/* Request Information Section */}
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
                                <label className="text-xs text-gray-500">Theater ID</label>
                                <p className="text-sm font-mono text-gray-900">{request.theaterId}</p>
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

                    {/* Bank Details Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                            <Landmark className="h-5 w-5 text-indigo-600" />
                            Bank Account Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-lg p-3">
                                <label className="text-xs text-gray-500">Bank Name</label>
                                <p className="text-sm font-medium text-gray-900">{request.bankName}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <label className="text-xs text-gray-500">Account Number</label>
                                <p className="text-sm font-mono text-gray-900">{request.bankAccount}</p>
                            </div>
                            <div className="col-span-2 bg-gray-50 rounded-lg p-3">
                                <label className="text-xs text-gray-500">Account Holder Name</label>
                                <p className="text-sm text-gray-900">{request.accountName}</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                            <User className="h-5 w-5 text-indigo-600" />
                            Contact Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-lg p-3">
                                <label className="text-xs text-gray-500">Email Address</label>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-3 w-3 text-gray-400" />
                                    <p className="text-sm text-gray-900">{request.contactEmail || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <label className="text-xs text-gray-500">Phone Number</label>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-3 w-3 text-gray-400" />
                                    <p className="text-sm text-gray-900">{request.contactPhone || 'N/A'}</p>
                                </div>
                            </div>
                            {request.theaterAddress && (
                                <div className="col-span-2 bg-gray-50 rounded-lg p-3">
                                    <label className="text-xs text-gray-500">Theater Address</label>
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-3 w-3 text-gray-400 mt-0.5" />
                                        <p className="text-sm text-gray-900">{request.theaterAddress}</p>
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
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <label className="text-xs text-gray-500">Processed By</label>
                                    <p className="text-sm text-gray-900">{request.processedBy || 'System Administrator'}</p>
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
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">Review Actions</h3>
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
                            <div className="mb-4 p-3 bg-green-100/50 rounded-lg">
                                <p className="text-sm text-green-700">
                                    You are about to approve <strong>{formatCurrency(request.amount)}</strong> for <strong>{request.theaterName}</strong>
                                </p>
                            </div>
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
                                    {isSubmitting ? (
                                        <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                                    ) : (
                                        <><Check className="h-4 w-4" /> Confirm Approval</>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Reject Form */}
                    {showRejectForm && (
                        <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200">
                            <h3 className="text-sm font-semibold text-red-800 mb-3">Reject Withdrawal Request</h3>
                            <div className="mb-4 p-3 bg-red-100/50 rounded-lg">
                                <p className="text-sm text-red-700">
                                    You are about to reject <strong>{formatCurrency(request.amount)}</strong> for <strong>{request.theaterName}</strong>
                                </p>
                            </div>
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
                                    {isSubmitting ? (
                                        <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                                    ) : (
                                        <><X className="h-4 w-4" /> Confirm Rejection</>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Close Button */}
                    {request.status !== 'pending' && (
                        <div className="flex justify-end pt-4 border-t border-gray-200">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                            >
                                <X className="h-4 w-4" />
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

const WalletBalance: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [systemTransactions, setSystemTransactions] = useState<Transaction[]>([]);
    const [theaterBalances, setTheaterBalances] = useState<TheaterBalance[]>([]);
    const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
    const [activeTab, setActiveTab] = useState<'system' | 'theaters' | 'withdrawals'>('system');
    const [showBalance, setShowBalance] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });
    const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showActionModal, setShowActionModal] = useState<'approve' | 'reject' | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [approvalNotes, setApprovalNotes] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [walletStats, setWalletStats] = useState<WalletStats>({
        systemBalance: 0,
        theatersTotalBalance: 0,
        lastTransaction: new Date().toISOString()
    });

    // ============================================
    // INLINE BACKEND - SUPABASE QUERIES
    // ============================================

    // Fetch all wallet data
    useEffect(() => {
        fetchAllWalletData();
    }, []);

    const fetchAllWalletData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchSystemBalance(),
                fetchTheaterBalances(),
                fetchWithdrawalRequests(),
                fetchSystemTransactions()
            ]);
        } catch (error) {
            console.error('Error fetching wallet data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSystemBalance = async () => {
        try {
            // Get total commission from earnings (platform revenue)
            const { data: earnings } = await supabase
                .from('earnings')
                .select('commission_amount, created_at');
            
            const totalCommission = earnings?.reduce((sum, e) => sum + (e.commission_amount || 0), 0) || 0;
            
            // Get total paid out to theaters
            const { data: withdrawals } = await supabase
                .from('payments')
                .select('amount')
                .eq('payment_type', 'withdrawal')
                .eq('payment_status', 'completed');
            
            const totalWithdrawn = withdrawals?.reduce((sum, w) => sum + (w.amount || 0), 0) || 0;
            
            const systemBalance = totalCommission - totalWithdrawn;
            
            // Get last transaction date
            const lastTransaction = earnings?.[0]?.created_at || new Date().toISOString();
            
            setWalletStats(prev => ({
                ...prev,
                systemBalance,
                lastTransaction
            }));
        } catch (error) {
            console.error('Error fetching system balance:', error);
        }
    };

    const fetchTheaterBalances = async () => {
        try {
            // Get all theaters
            const { data: theaters } = await supabase
                .from('theaters')
                .select('id, legal_business_name');
            
            if (!theaters) return;
            
            const balances: TheaterBalance[] = [];
            
            for (const theater of theaters) {
                // Get total earnings for this theater
                const { data: earnings } = await supabase
                    .from('earnings')
                    .select('net_amount')
                    .eq('theater_id', theater.id);
                
                const totalEarned = earnings?.reduce((sum, e) => sum + (e.net_amount || 0), 0) || 0;
                
                // Get total withdrawn for this theater
                const { data: withdrawals } = await supabase
                    .from('payments')
                    .select('amount')
                    .eq('theater_id', theater.id)
                    .eq('payment_type', 'withdrawal')
                    .eq('payment_status', 'completed');
                
                const totalWithdrawn = withdrawals?.reduce((sum, w) => sum + (w.amount || 0), 0) || 0;
                
                const currentBalance = totalEarned - totalWithdrawn;
                
                // Get last payout date
                const { data: lastWithdrawal } = await supabase
                    .from('payments')
                    .select('created_at')
                    .eq('theater_id', theater.id)
                    .eq('payment_type', 'withdrawal')
                    .eq('payment_status', 'completed')
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();
                
                balances.push({
                    id: theater.id,
                    name: theater.legal_business_name,
                    balance: currentBalance,
                    totalEarned: totalEarned,
                    lastPayout: lastWithdrawal?.created_at || new Date().toISOString()
                });
            }
            
            // Update total theaters balance
            const theatersTotalBalance = balances.reduce((sum, t) => sum + t.balance, 0);
            setWalletStats(prev => ({ ...prev, theatersTotalBalance }));
            setTheaterBalances(balances);
        } catch (error) {
            console.error('Error fetching theater balances:', error);
        }
    };

    const fetchSystemTransactions = async () => {
        try {
            // Get all completed payments (commission earnings)
            const { data: earnings } = await supabase
                .from('earnings')
                .select('id, commission_amount, created_at, theater_id')
                .order('created_at', { ascending: false })
                .limit(50);
            
            const transactions: Transaction[] = [];
            
            // Add credit transactions (commission earned)
            earnings?.forEach(earning => {
                transactions.push({
                    id: `earn_${earning.id}`,
                    type: 'credit',
                    amount: earning.commission_amount || 0,
                    description: 'Commission earned from ticket sales',
                    status: 'completed',
                    date: earning.created_at,
                    reference: `COM-${earning.id.slice(-8)}`,
                    source: 'system'
                });
            });
            
            setSystemTransactions(transactions);
        } catch (error) {
            console.error('Error fetching system transactions:', error);
        }
    };

    const fetchWithdrawalRequests = async () => {
        try {
            // Get withdrawal requests from payments table
            const { data: withdrawals } = await supabase
                .from('payments')
                .select(`
                    id,
                    amount,
                    payment_status,
                    created_at,
                    updated_at,
                    transaction_id,
                    theater_id,
                    theaters (
                        legal_business_name,
                        email,
                        phone,
                        address
                    )
                `)
                .eq('payment_type', 'withdrawal')
                .order('created_at', { ascending: false });
            
            // Get bank details from owners table
            const { data: owners } = await supabase
                .from('owners')
                .select('user_id, bank_name, bank_account_number, business_name');
            
            const requests: WithdrawalRequest[] = withdrawals?.map(w => ({
                id: w.id,
                theaterId: w.theater_id,
                theaterName: w.theaters?.legal_business_name || 'Unknown',
                amount: w.amount || 0,
                bankAccount: owners?.find(o => o.user_id === w.theater_id)?.bank_account_number || 'N/A',
                accountName: owners?.find(o => o.user_id === w.theater_id)?.business_name || 'N/A',
                bankName: owners?.find(o => o.user_id === w.theater_id)?.bank_name || 'N/A',
                reason: w.transaction_id || 'Monthly withdrawal request',
                status: mapPaymentStatus(w.payment_status),
                requestDate: w.created_at,
                processedDate: w.updated_at,
                rejectionReason: w.payment_status === 'failed' ? 'Payment processing failed' : undefined,
                contactEmail: w.theaters?.email,
                contactPhone: w.theaters?.phone,
                theaterAddress: w.theaters?.address
            })) || [];
            
            setWithdrawalRequests(requests);
        } catch (error) {
            console.error('Error fetching withdrawal requests:', error);
        }
    };

    const mapPaymentStatus = (status: string): 'pending' | 'approved' | 'rejected' => {
        switch (status) {
            case 'completed': return 'approved';
            case 'failed': return 'rejected';
            default: return 'pending';
        }
    };

    const mapStatusToPaymentStatus = (status: string): string => {
        switch (status) {
            case 'approved': return 'completed';
            case 'rejected': return 'failed';
            default: return 'pending';
        }
    };

    const updateWithdrawalStatus = async (requestId: string, status: 'approved' | 'rejected', notes?: string) => {
        try {
            const { error } = await supabase
                .from('payments')
                .update({
                    payment_status: mapStatusToPaymentStatus(status),
                    updated_at: new Date().toISOString(),
                    transaction_id: notes
                })
                .eq('id', requestId);
            
            if (error) throw error;
            
            // Refresh data
            await fetchWithdrawalRequests();
            await fetchSystemBalance();
            await fetchTheaterBalances();
        } catch (error) {
            console.error('Error updating withdrawal status:', error);
            throw error;
        }
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

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
            case 'approved':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /> Approved</span>;
            case 'rejected':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"><XCircle className="h-3 w-3" /> Rejected</span>;
            default:
                return null;
        }
    };

    const handleExport = () => {
        const csvContent = [
            ['ID', 'Type', 'Amount', 'Description', 'Status', 'Date', 'Reference'],
            ...systemTransactions.map(t => [t.id, t.type, t.amount, t.description, t.status, t.date, t.reference])
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

    const handleApproveRequest = async () => {
        if (!selectedRequest) return;
        
        setIsProcessing(true);
        
        try {
            await updateWithdrawalStatus(selectedRequest.id, 'approved', approvalNotes);
            
            setPopupMessage({
                title: 'Withdrawal Approved',
                message: `${formatCurrency(selectedRequest.amount)} has been approved for ${selectedRequest.theaterName}`,
                type: 'success'
            });
        } catch (error) {
            setPopupMessage({
                title: 'Error',
                message: 'Failed to approve withdrawal. Please try again.',
                type: 'error'
            });
        } finally {
            setShowSuccessPopup(true);
            setShowActionModal(null);
            setSelectedRequest(null);
            setApprovalNotes('');
            setIsProcessing(false);
            setShowDetailsModal(false);
        }
    };

    const handleRejectRequest = async () => {
        if (!selectedRequest || !rejectionReason) return;
        
        setIsProcessing(true);
        
        try {
            await updateWithdrawalStatus(selectedRequest.id, 'rejected', rejectionReason);
            
            setPopupMessage({
                title: 'Withdrawal Rejected',
                message: `${formatCurrency(selectedRequest.amount)} withdrawal for ${selectedRequest.theaterName} has been rejected`,
                type: 'warning'
            });
        } catch (error) {
            setPopupMessage({
                title: 'Error',
                message: 'Failed to reject withdrawal. Please try again.',
                type: 'error'
            });
        } finally {
            setShowSuccessPopup(true);
            setShowActionModal(null);
            setSelectedRequest(null);
            setRejectionReason('');
            setIsProcessing(false);
            setShowDetailsModal(false);
        }
    };

    const handleViewDetails = (request: WithdrawalRequest) => {
        setSelectedRequest(request);
        setShowDetailsModal(true);
    };

    // Filter functions
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

    const getFilteredWithdrawals = () => {
        let filtered = withdrawalRequests;
        
        if (searchTerm) {
            filtered = filtered.filter(w => 
                w.theaterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                w.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                w.bankAccount.includes(searchTerm)
            );
        }
        
        if (filterStatus !== 'all') {
            filtered = filtered.filter(w => w.status === filterStatus);
        }
        
        return filtered;
    };

    // Column definitions
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
            Header: 'Bank Details',
            accessor: 'bankName',
            sortable: true,
            Cell: (row: WithdrawalRequest) => (
                <div>
                    <p className="text-sm text-gray-900">{row.bankName}</p>
                    <p className="text-xs text-gray-500">Account: ****{row.bankAccount.slice(-4)}</p>
                </div>
            )
        },
        {
            Header: 'Request Date',
            accessor: 'requestDate',
            sortable: true,
            Cell: (row: WithdrawalRequest) => (
                <div>
                    <p className="text-sm text-gray-900">{formatDateTime(row.requestDate)}</p>
                </div>
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
                    {row.status === 'pending' && (
                        <>
                            <button
                                onClick={() => {
                                    setSelectedRequest(row);
                                    setShowActionModal('approve');
                                }}
                                className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                                title="Approve"
                            >
                                <Check className="h-4 w-4 text-green-600" />
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedRequest(row);
                                    setShowActionModal('reject');
                                }}
                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                                title="Reject"
                            >
                                <X className="h-4 w-4 text-red-600" />
                            </button>
                        </>
                    )}
                </div>
            )
        }
    ];

    const pendingCount = withdrawalRequests.filter(w => w.status === 'pending').length;

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
                            <p className="text-gray-600">Manage system balance, theater balances, and withdrawal requests</p>
                        </div>
                    </div>
                </motion.div>

                {/* Two Balance Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                    {/* System Balance Card */}
                    <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 text-white shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-white/20 rounded-xl">
                                    <Wallet className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-white/80 text-base font-medium">System Balance</span>
                            </div>
                            <button
                                onClick={() => setShowBalance(!showBalance)}
                                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                            >
                                {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        <div>
                            <p className="text-3xl font-bold">
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
                            <span className="text-white/80 text-base font-medium">All Theaters Balance</span>
                        </div>
                        <div>
                            <p className="text-3xl font-bold">
                                {showBalance ? formatCurrency(walletStats.theatersTotalBalance) : '••••••'}
                            </p>
                            <p className="text-white/70 text-sm mt-3">
                                Total across {theaterBalances.length} theaters
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex flex-wrap gap-2 bg-gray-100 rounded-lg p-1 mb-6 w-fit">
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
                    <button
                        onClick={() => setActiveTab('withdrawals')}
                        className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 relative ${
                            activeTab === 'withdrawals' 
                                ? 'bg-teal-600 text-white shadow-sm' 
                                : 'text-gray-600 hover:bg-gray-200'
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
                {(activeTab === 'system' || activeTab === 'withdrawals') && (
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative min-w-[250px]">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={activeTab === 'system' ? "Search transactions..." : "Search withdrawal requests..."}
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
                                {activeTab === 'system' ? (
                                    <>
                                        <option value="completed">Completed</option>
                                        <option value="pending">Pending</option>
                                        <option value="failed">Failed</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                    </>
                                )}
                            </select>
                        </div>
                        {activeTab === 'system' && (
                            <ReusableButton
                                onClick={handleExport}
                                label="Export Transactions"
                                className="px-4 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white"
                            />
                        )}
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
                ) : activeTab === 'theaters' ? (
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
                        onApprove={(req, notes) => {
                            setSelectedRequest(req);
                            setApprovalNotes(notes);
                            handleApproveRequest();
                        }}
                        onReject={(req, reason) => {
                            setSelectedRequest(req);
                            setRejectionReason(reason);
                            handleRejectRequest();
                        }}
                    />
                )}

                {/* Approve Modal */}
                {showActionModal === 'approve' && selectedRequest && !showDetailsModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-2xl max-w-md w-full shadow-xl"
                        >
                            <div className="border-b px-6 py-4 bg-green-50 rounded-t-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-full">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">Approve Withdrawal</h2>
                                        <p className="text-sm text-gray-600">{selectedRequest.theaterName}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600">Amount:</span>
                                        <span className="font-bold text-green-600">{formatCurrency(selectedRequest.amount)}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600">Bank:</span>
                                        <span className="text-gray-900">{selectedRequest.bankName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Account:</span>
                                        <span className="text-gray-900">****{selectedRequest.bankAccount.slice(-4)}</span>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Approval Notes (Optional)</label>
                                    <textarea
                                        value={approvalNotes}
                                        onChange={(e) => setApprovalNotes(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none"
                                        placeholder="Add any notes about this approval..."
                                    />
                                </div>
                            </div>
                            <div className="border-t px-6 py-4 flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setShowActionModal(null);
                                        setSelectedRequest(null);
                                        setApprovalNotes('');
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleApproveRequest}
                                    disabled={isProcessing}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition flex items-center gap-2"
                                >
                                    {isProcessing ? (
                                        <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                                    ) : (
                                        <><Check className="h-4 w-4" /> Confirm Approval</>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Reject Modal */}
                {showActionModal === 'reject' && selectedRequest && !showDetailsModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-2xl max-w-md w-full shadow-xl"
                        >
                            <div className="border-b px-6 py-4 bg-red-50 rounded-t-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 rounded-full">
                                        <XCircle className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">Reject Withdrawal</h2>
                                        <p className="text-sm text-gray-600">{selectedRequest.theaterName}</p>
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
                                        <span className="text-gray-600">Requested:</span>
                                        <span className="text-gray-900">{formatDateTime(selectedRequest.requestDate)}</span>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Rejection Reason <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none resize-none"
                                        placeholder="Provide reason for rejection..."
                                        required
                                    />
                                </div>
                            </div>
                            <div className="border-t px-6 py-4 flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setShowActionModal(null);
                                        setSelectedRequest(null);
                                        setRejectionReason('');
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRejectRequest}
                                    disabled={isProcessing || !rejectionReason}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition flex items-center gap-2"
                                >
                                    {isProcessing ? (
                                        <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                                    ) : (
                                        <><X className="h-4 w-4" /> Confirm Rejection</>
                                    )}
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

export default WalletBalance;