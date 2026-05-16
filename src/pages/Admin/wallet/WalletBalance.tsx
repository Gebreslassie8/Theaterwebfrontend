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
    Calendar
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

// Helper functions
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'ETB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount || 0);
};

const WalletBalance: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [systemWallet, setSystemWallet] = useState<SystemWallet | null>(null);
    const [theaterBalances, setTheaterBalances] = useState<TheaterBalance[]>([]);
    const [showBalance, setShowBalance] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });
    const [selectedTheater, setSelectedTheater] = useState<TheaterBalance | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    // Fetch all data from Supabase
    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchSystemWallet(),
                fetchTheaterBalances()
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
                // Create default system wallet if not exists
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

            // Get wallet balances from theaters_wallet table
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
            const { data: owners, error: ownersError } = await supabase
                .from('owners')
                .select('user_id, bank_name, bank_account_number, business_name');

            if (ownersError) throw ownersError;

            // Get total earnings for each theater
            const { data: earnings, error: earningsError } = await supabase
                .from('earnings')
                .select('theater_id, net_amount')
                .eq('is_subscription_payment', false);

            if (earningsError) throw earningsError;

            // Calculate total earnings per theater
            const earningsByTheater: Record<string, number> = {};
            earnings?.forEach(e => {
                earningsByTheater[e.theater_id] = (earningsByTheater[e.theater_id] || 0) + (e.net_amount || 0);
            });

            // Build theater balances
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

    const getContractBadge = (type: string) => {
        if (type === 'subscription') {
            return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">📅 Subscription</span>;
        }
        if (type === 'per_ticket') {
            return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">🎫 Per Ticket</span>;
        }
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{type}</span>;
    };

    // Filter functions
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

    const handleViewDetails = (theater: TheaterBalance) => {
        setSelectedTheater(theater);
        setShowDetailsModal(true);
    };

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
                                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-teal-100 text-sm mt-2 ml-14">{selectedTheater.name}</p>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Financial Information */}
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

                        {/* Contact Information */}
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

                        {/* Banking Information */}
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
                            <p className="text-gray-600">Manage system wallet and theater balances</p>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Cards - 3 Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {/* System Wallet Card */}
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

                    {/* Active Theaters */}
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
                </div>

                {/* Search */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="relative min-w-[300px] flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search theaters by name, ID, email, or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                        />
                    </div>
                </div>

                {/* Theater Wallets Table with View Details Button */}
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