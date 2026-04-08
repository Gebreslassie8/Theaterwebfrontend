// src/pages/Admin/wallet/Commission.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Percent,
    TrendingUp,
    TrendingDown,
    Edit2,
    Save,
    X,
    AlertCircle,
    Shield,
    DollarSign,
    Clock,
    Calendar,
    Users,
    Ticket,
    Building,
    Smartphone,
    Landmark,
    CreditCard,
    Wallet,
    CheckCircle,
    Plus,
    Trash2,
    Settings,
    BarChart3,
    PiggyBank,
    AlertTriangle
} from 'lucide-react';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';
import * as Yup from 'yup';

// Types
interface CommissionRule {
    id: string;
    name: string;
    type: 'percentage' | 'fixed';
    value: number;
    appliesTo: 'booking' | 'ticket' | 'subscription' | 'all';
    userType: 'all' | 'theater' | 'customer' | 'admin';
    minAmount?: number;
    maxAmount?: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface FeeStructure {
    id: string;
    name: string;
    description: string;
    type: 'withdrawal' | 'deposit' | 'transfer' | 'refund';
    feeType: 'percentage' | 'fixed';
    feeValue: number;
    minFee?: number;
    maxFee?: number;
    appliesTo: string[];
    isActive: boolean;
    createdAt: string;
}

// Mock Data
const commissionRules: CommissionRule[] = [
    {
        id: '1',
        name: 'Standard Booking Commission',
        type: 'percentage',
        value: 5,
        appliesTo: 'booking',
        userType: 'theater',
        minAmount: 100,
        maxAmount: 10000,
        isActive: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-03-15'
    },
    {
        id: '2',
        name: 'Premium Ticket Fee',
        type: 'fixed',
        value: 25,
        appliesTo: 'ticket',
        userType: 'customer',
        minAmount: 500,
        isActive: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-03-10'
    },
    {
        id: '3',
        name: 'Subscription Commission',
        type: 'percentage',
        value: 10,
        appliesTo: 'subscription',
        userType: 'all',
        isActive: true,
        createdAt: '2024-02-01',
        updatedAt: '2024-02-01'
    }
];

const feeStructures: FeeStructure[] = [
    {
        id: '1',
        name: 'Bank Transfer Fee',
        description: 'Fee for bank transfer withdrawals',
        type: 'withdrawal',
        feeType: 'fixed',
        feeValue: 25,
        minFee: 25,
        maxFee: 500,
        appliesTo: ['bank_transfer'],
        isActive: true,
        createdAt: '2024-01-01'
    },
    {
        id: '2',
        name: 'Telebirr Fee',
        description: 'Fee for Telebirr withdrawals',
        type: 'withdrawal',
        feeType: 'fixed',
        feeValue: 10,
        minFee: 10,
        maxFee: 200,
        appliesTo: ['telebirr'],
        isActive: true,
        createdAt: '2024-01-01'
    },
    {
        id: '3',
        name: 'CBE Birr Fee',
        description: 'Fee for CBE Birr withdrawals',
        type: 'withdrawal',
        feeType: 'fixed',
        feeValue: 10,
        minFee: 10,
        maxFee: 200,
        appliesTo: ['cbebirr'],
        isActive: true,
        createdAt: '2024-01-01'
    },
    {
        id: '4',
        name: 'HelloCash Fee',
        description: 'Fee for HelloCash withdrawals',
        type: 'withdrawal',
        feeType: 'fixed',
        feeValue: 10,
        minFee: 10,
        maxFee: 200,
        appliesTo: ['hellocash'],
        isActive: true,
        createdAt: '2024-01-01'
    },
    {
        id: '5',
        name: 'Chapa Fee',
        description: 'Fee for Chapa withdrawals',
        type: 'withdrawal',
        feeType: 'fixed',
        feeValue: 15,
        minFee: 15,
        maxFee: 300,
        appliesTo: ['chapa'],
        isActive: true,
        createdAt: '2024-01-01'
    }
];

const Commission: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'commissions' | 'fees'>('commissions');
    const [commissions, setCommissions] = useState<CommissionRule[]>(commissionRules);
    const [fees, setFees] = useState<FeeStructure[]>(feeStructures);
    const [editingCommission, setEditingCommission] = useState<CommissionRule | null>(null);
    const [editingFee, setEditingFee] = useState<FeeStructure | null>(null);
    const [showAddCommission, setShowAddCommission] = useState(false);
    const [showAddFee, setShowAddFee] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });

    // Form State for Commission
    const [commissionForm, setCommissionForm] = useState({
        name: '',
        type: 'percentage' as 'percentage' | 'fixed',
        value: 0,
        appliesTo: 'all' as 'booking' | 'ticket' | 'subscription' | 'all',
        userType: 'all' as 'all' | 'theater' | 'customer' | 'admin',
        minAmount: '',
        maxAmount: '',
        isActive: true
    });

    // Form State for Fee
    const [feeForm, setFeeForm] = useState({
        name: '',
        description: '',
        type: 'withdrawal' as 'withdrawal' | 'deposit' | 'transfer' | 'refund',
        feeType: 'fixed' as 'percentage' | 'fixed',
        feeValue: 0,
        minFee: '',
        maxFee: '',
        appliesTo: [] as string[],
        isActive: true
    });

    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'ETB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    const handleToggleCommission = (id: string) => {
        setCommissions(commissions.map(comm =>
            comm.id === id ? { ...comm, isActive: !comm.isActive } : comm
        ));
        setPopupMessage({
            title: 'Commission Updated',
            message: 'Commission rule status has been updated.',
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    const handleToggleFee = (id: string) => {
        setFees(fees.map(fee =>
            fee.id === id ? { ...fee, isActive: !fee.isActive } : fee
        ));
        setPopupMessage({
            title: 'Fee Updated',
            message: 'Fee structure status has been updated.',
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    const handleSaveCommission = () => {
        if (!commissionForm.name || commissionForm.value <= 0) {
            setFormErrors({ name: 'Name and value are required', value: 'Value must be greater than 0' });
            return;
        }

        if (editingCommission) {
            setCommissions(commissions.map(comm =>
                comm.id === editingCommission.id
                    ? {
                        ...comm,
                        ...commissionForm,
                        minAmount: commissionForm.minAmount ? Number(commissionForm.minAmount) : undefined,
                        maxAmount: commissionForm.maxAmount ? Number(commissionForm.maxAmount) : undefined,
                        updatedAt: new Date().toISOString().split('T')[0]
                    }
                    : comm
            ));
            setPopupMessage({
                title: 'Commission Updated',
                message: 'Commission rule has been updated successfully.',
                type: 'success'
            });
        } else {
            const newCommission: CommissionRule = {
                id: Date.now().toString(),
                ...commissionForm,
                minAmount: commissionForm.minAmount ? Number(commissionForm.minAmount) : undefined,
                maxAmount: commissionForm.maxAmount ? Number(commissionForm.maxAmount) : undefined,
                createdAt: new Date().toISOString().split('T')[0],
                updatedAt: new Date().toISOString().split('T')[0]
            };
            setCommissions([...commissions, newCommission]);
            setPopupMessage({
                title: 'Commission Added',
                message: 'New commission rule has been added successfully.',
                type: 'success'
            });
        }

        setShowAddCommission(false);
        setEditingCommission(null);
        resetCommissionForm();
        setShowSuccessPopup(true);
    };

    const handleSaveFee = () => {
        if (!feeForm.name || feeForm.feeValue <= 0 || feeForm.appliesTo.length === 0) {
            setFormErrors({ name: 'Name, value, and applies to are required' });
            return;
        }

        if (editingFee) {
            setFees(fees.map(fee =>
                fee.id === editingFee.id
                    ? {
                        ...fee,
                        ...feeForm,
                        minFee: feeForm.minFee ? Number(feeForm.minFee) : undefined,
                        maxFee: feeForm.maxFee ? Number(feeForm.maxFee) : undefined,
                    }
                    : fee
            ));
            setPopupMessage({
                title: 'Fee Updated',
                message: 'Fee structure has been updated successfully.',
                type: 'success'
            });
        } else {
            const newFee: FeeStructure = {
                id: Date.now().toString(),
                ...feeForm,
                minFee: feeForm.minFee ? Number(feeForm.minFee) : undefined,
                maxFee: feeForm.maxFee ? Number(feeForm.maxFee) : undefined,
                createdAt: new Date().toISOString().split('T')[0]
            };
            setFees([...fees, newFee]);
            setPopupMessage({
                title: 'Fee Added',
                message: 'New fee structure has been added successfully.',
                type: 'success'
            });
        }

        setShowAddFee(false);
        setEditingFee(null);
        resetFeeForm();
        setShowSuccessPopup(true);
    };

    const handleDeleteCommission = (id: string) => {
        setCommissions(commissions.filter(comm => comm.id !== id));
        setPopupMessage({
            title: 'Commission Deleted',
            message: 'Commission rule has been deleted.',
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    const handleDeleteFee = (id: string) => {
        setFees(fees.filter(fee => fee.id !== id));
        setPopupMessage({
            title: 'Fee Deleted',
            message: 'Fee structure has been deleted.',
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    const resetCommissionForm = () => {
        setCommissionForm({
            name: '',
            type: 'percentage',
            value: 0,
            appliesTo: 'all',
            userType: 'all',
            minAmount: '',
            maxAmount: '',
            isActive: true
        });
        setFormErrors({});
    };

    const resetFeeForm = () => {
        setFeeForm({
            name: '',
            description: '',
            type: 'withdrawal',
            feeType: 'fixed',
            feeValue: 0,
            minFee: '',
            maxFee: '',
            appliesTo: [],
            isActive: true
        });
        setFormErrors({});
    };

    const editCommission = (commission: CommissionRule) => {
        setEditingCommission(commission);
        setCommissionForm({
            name: commission.name,
            type: commission.type,
            value: commission.value,
            appliesTo: commission.appliesTo,
            userType: commission.userType,
            minAmount: commission.minAmount?.toString() || '',
            maxAmount: commission.maxAmount?.toString() || '',
            isActive: commission.isActive
        });
        setShowAddCommission(true);
    };

    const editFee = (fee: FeeStructure) => {
        setEditingFee(fee);
        setFeeForm({
            name: fee.name,
            description: fee.description,
            type: fee.type,
            feeType: fee.feeType,
            feeValue: fee.feeValue,
            minFee: fee.minFee?.toString() || '',
            maxFee: fee.maxFee?.toString() || '',
            appliesTo: fee.appliesTo,
            isActive: fee.isActive
        });
        setShowAddFee(true);
    };

    const stats = {
        totalCommissionRate: commissions.filter(c => c.isActive).reduce((sum, c) => sum + c.value, 0),
        activeCommissions: commissions.filter(c => c.isActive).length,
        totalFees: fees.filter(f => f.isActive).reduce((sum, f) => sum + f.feeValue, 0),
        activeFees: fees.filter(f => f.isActive).length
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                                    <Percent className="h-6 w-6 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">Commission & Fees System</h1>
                            </div>
                            <p className="text-gray-600">Manage platform commissions and transaction fees</p>
                        </div>
                        <div className="flex gap-3">
                            <div className="bg-green-50 px-4 py-2 rounded-xl border border-green-200">
                                <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-green-600" />
                                    <span className="text-sm text-green-700">Automated Calculations</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8"
                >
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Commission Rate</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalCommissionRate}%</p>
                            </div>
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Percent className="h-5 w-5 text-purple-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Active Commissions</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.activeCommissions}</p>
                            </div>
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Fees</p>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalFees)}</p>
                            </div>
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <DollarSign className="h-5 w-5 text-orange-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Active Fees</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.activeFees}</p>
                            </div>
                            <div className="p-2 bg-green-100 rounded-lg">
                                <PiggyBank className="h-5 w-5 text-green-600" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                >
                    <div className="flex gap-2 border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('commissions')}
                            className={`px-6 py-3 text-sm font-medium transition-all rounded-t-lg ${activeTab === 'commissions'
                                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Percent className="h-4 w-4" />
                                Commission Rules
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('fees')}
                            className={`px-6 py-3 text-sm font-medium transition-all rounded-t-lg ${activeTab === 'fees'
                                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                Fee Structures
                            </div>
                        </button>
                    </div>
                </motion.div>

                {/* Commissions Tab */}
                {activeTab === 'commissions' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Commission Rules</h2>
                            <ReusableButton
                                onClick={() => {
                                    resetCommissionForm();
                                    setEditingCommission(null);
                                    setShowAddCommission(true);
                                }}
                                label="Add Commission Rule"
                                icon={Plus}
                                className="px-4 py-2"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {commissions.map((commission) => (
                                <div
                                    key={commission.id}
                                    className={`bg-white rounded-2xl border-2 p-5 transition-all ${commission.isActive ? 'border-gray-200' : 'border-gray-100 opacity-60'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-xl ${commission.type === 'percentage' ? 'bg-purple-100' : 'bg-blue-100'}`}>
                                                {commission.type === 'percentage' ? (
                                                    <Percent className="h-5 w-5 text-purple-600" />
                                                ) : (
                                                    <DollarSign className="h-5 w-5 text-blue-600" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{commission.name}</h3>
                                                <p className="text-xs text-gray-500">
                                                    Applies to: {commission.appliesTo} | User: {commission.userType}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleToggleCommission(commission.id)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${commission.isActive ? 'bg-green-500' : 'bg-gray-300'
                                                    }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${commission.isActive ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                            <button
                                                onClick={() => editCommission(commission)}
                                                className="p-1 hover:bg-gray-100 rounded-lg transition"
                                            >
                                                <Edit2 className="h-4 w-4 text-gray-400" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCommission(commission.id)}
                                                className="p-1 hover:bg-red-100 rounded-lg transition"
                                            >
                                                <Trash2 className="h-4 w-4 text-red-400" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500">Rate/Value</p>
                                            <p className="text-lg font-bold text-gray-900">
                                                {commission.type === 'percentage' ? `${commission.value}%` : formatCurrency(commission.value)}
                                            </p>
                                        </div>
                                        {commission.minAmount && (
                                            <div>
                                                <p className="text-xs text-gray-500">Min Amount</p>
                                                <p className="text-sm font-medium text-gray-700">{formatCurrency(commission.minAmount)}</p>
                                            </div>
                                        )}
                                        {commission.maxAmount && (
                                            <div>
                                                <p className="text-xs text-gray-500">Max Amount</p>
                                                <p className="text-sm font-medium text-gray-700">{formatCurrency(commission.maxAmount)}</p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-xs text-gray-500">Last Updated</p>
                                            <p className="text-sm font-medium text-gray-700">{commission.updatedAt}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Fees Tab */}
                {activeTab === 'fees' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Fee Structures</h2>
                            <ReusableButton
                                onClick={() => {
                                    resetFeeForm();
                                    setEditingFee(null);
                                    setShowAddFee(true);
                                }}
                                label="Add Fee Structure"
                                icon={Plus}
                                className="px-4 py-2"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {fees.map((fee) => (
                                <div
                                    key={fee.id}
                                    className={`bg-white rounded-2xl border-2 p-5 transition-all ${fee.isActive ? 'border-gray-200' : 'border-gray-100 opacity-60'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-orange-100 rounded-xl">
                                                <DollarSign className="h-5 w-5 text-orange-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{fee.name}</h3>
                                                <p className="text-xs text-gray-500">{fee.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleToggleFee(fee.id)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${fee.isActive ? 'bg-green-500' : 'bg-gray-300'
                                                    }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${fee.isActive ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                            <button
                                                onClick={() => editFee(fee)}
                                                className="p-1 hover:bg-gray-100 rounded-lg transition"
                                            >
                                                <Edit2 className="h-4 w-4 text-gray-400" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteFee(fee.id)}
                                                className="p-1 hover:bg-red-100 rounded-lg transition"
                                            >
                                                <Trash2 className="h-4 w-4 text-red-400" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Fee Type</span>
                                            <span className="text-sm font-medium capitalize text-gray-900">{fee.type}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Fee Value</span>
                                            <span className="text-lg font-bold text-orange-600">
                                                {fee.feeType === 'percentage' ? `${fee.feeValue}%` : formatCurrency(fee.feeValue)}
                                            </span>
                                        </div>
                                        {fee.minFee && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-500">Min Fee</span>
                                                <span className="text-sm font-medium text-gray-700">{formatCurrency(fee.minFee)}</span>
                                            </div>
                                        )}
                                        {fee.maxFee && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-500">Max Fee</span>
                                                <span className="text-sm font-medium text-gray-700">{formatCurrency(fee.maxFee)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Applies To</span>
                                            <div className="flex flex-wrap gap-1">
                                                {fee.appliesTo.map(app => (
                                                    <span key={app} className="px-2 py-1 bg-gray-100 text-xs rounded-lg text-gray-600">
                                                        {app}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Add/Edit Commission Modal */}
                <AnimatePresence>
                    {showAddCommission && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                            onClick={() => {
                                setShowAddCommission(false);
                                setEditingCommission(null);
                                resetCommissionForm();
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-100 rounded-xl">
                                                <Percent className="h-5 w-5 text-purple-600" />
                                            </div>
                                            <h2 className="text-xl font-bold text-gray-900">
                                                {editingCommission ? 'Edit Commission Rule' : 'Add Commission Rule'}
                                            </h2>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setShowAddCommission(false);
                                                setEditingCommission(null);
                                                resetCommissionForm();
                                            }}
                                            className="p-1 hover:bg-gray-100 rounded-lg transition"
                                        >
                                            <X className="h-5 w-5 text-gray-500" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Rule Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={commissionForm.name}
                                                onChange={(e) => setCommissionForm({ ...commissionForm, name: e.target.value })}
                                                placeholder="e.g., Standard Booking Commission"
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Commission Type</label>
                                                <select
                                                    value={commissionForm.type}
                                                    onChange={(e) => setCommissionForm({ ...commissionForm, type: e.target.value as any })}
                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                                                >
                                                    <option value="percentage">Percentage (%)</option>
                                                    <option value="fixed">Fixed Amount (ETB)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Value *</label>
                                                <input
                                                    type="number"
                                                    value={commissionForm.value}
                                                    onChange={(e) => setCommissionForm({ ...commissionForm, value: Number(e.target.value) })}
                                                    placeholder={commissionForm.type === 'percentage' ? '5' : '100'}
                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Applies To</label>
                                                <select
                                                    value={commissionForm.appliesTo}
                                                    onChange={(e) => setCommissionForm({ ...commissionForm, appliesTo: e.target.value as any })}
                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                                                >
                                                    <option value="all">All</option>
                                                    <option value="booking">Bookings</option>
                                                    <option value="ticket">Tickets</option>
                                                    <option value="subscription">Subscriptions</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
                                                <select
                                                    value={commissionForm.userType}
                                                    onChange={(e) => setCommissionForm({ ...commissionForm, userType: e.target.value as any })}
                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                                                >
                                                    <option value="all">All Users</option>
                                                    <option value="theater">Theaters Only</option>
                                                    <option value="customer">Customers Only</option>
                                                    <option value="admin">Admin Only</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Min Amount (Optional)</label>
                                                <input
                                                    type="number"
                                                    value={commissionForm.minAmount}
                                                    onChange={(e) => setCommissionForm({ ...commissionForm, minAmount: e.target.value })}
                                                    placeholder="Min amount"
                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Max Amount (Optional)</label>
                                                <input
                                                    type="number"
                                                    value={commissionForm.maxAmount}
                                                    onChange={(e) => setCommissionForm({ ...commissionForm, maxAmount: e.target.value })}
                                                    placeholder="Max amount"
                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="isActive"
                                                checked={commissionForm.isActive}
                                                onChange={(e) => setCommissionForm({ ...commissionForm, isActive: e.target.checked })}
                                                className="w-4 h-4 text-purple-600 rounded"
                                            />
                                            <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-6">
                                        <ReusableButton
                                            onClick={() => {
                                                setShowAddCommission(false);
                                                setEditingCommission(null);
                                                resetCommissionForm();
                                            }}
                                            label="Cancel"
                                            variant="secondary"
                                            className="flex-1"
                                        />
                                        <ReusableButton
                                            onClick={handleSaveCommission}
                                            label={editingCommission ? "Update Rule" : "Add Rule"}
                                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Add/Edit Fee Modal */}
                <AnimatePresence>
                    {showAddFee && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                            onClick={() => {
                                setShowAddFee(false);
                                setEditingFee(null);
                                resetFeeForm();
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-orange-100 rounded-xl">
                                                <DollarSign className="h-5 w-5 text-orange-600" />
                                            </div>
                                            <h2 className="text-xl font-bold text-gray-900">
                                                {editingFee ? 'Edit Fee Structure' : 'Add Fee Structure'}
                                            </h2>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setShowAddFee(false);
                                                setEditingFee(null);
                                                resetFeeForm();
                                            }}
                                            className="p-1 hover:bg-gray-100 rounded-lg transition"
                                        >
                                            <X className="h-5 w-5 text-gray-500" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Fee Name *</label>
                                            <input
                                                type="text"
                                                value={feeForm.name}
                                                onChange={(e) => setFeeForm({ ...feeForm, name: e.target.value })}
                                                placeholder="e.g., Bank Transfer Fee"
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                            <textarea
                                                value={feeForm.description}
                                                onChange={(e) => setFeeForm({ ...feeForm, description: e.target.value })}
                                                rows={2}
                                                placeholder="Describe this fee structure"
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Fee Type</label>
                                                <select
                                                    value={feeForm.type}
                                                    onChange={(e) => setFeeForm({ ...feeForm, type: e.target.value as any })}
                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                                                >
                                                    <option value="withdrawal">Withdrawal</option>
                                                    <option value="deposit">Deposit</option>
                                                    <option value="transfer">Transfer</option>
                                                    <option value="refund">Refund</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Fee Calculation</label>
                                                <select
                                                    value={feeForm.feeType}
                                                    onChange={(e) => setFeeForm({ ...feeForm, feeType: e.target.value as any })}
                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                                                >
                                                    <option value="fixed">Fixed Amount</option>
                                                    <option value="percentage">Percentage</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Fee Value *</label>
                                                <input
                                                    type="number"
                                                    value={feeForm.feeValue}
                                                    onChange={(e) => setFeeForm({ ...feeForm, feeValue: Number(e.target.value) })}
                                                    placeholder={feeForm.feeType === 'percentage' ? '5' : '25'}
                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Min Fee (Optional)</label>
                                                <input
                                                    type="number"
                                                    value={feeForm.minFee}
                                                    onChange={(e) => setFeeForm({ ...feeForm, minFee: e.target.value })}
                                                    placeholder="Minimum fee"
                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Max Fee (Optional)</label>
                                                <input
                                                    type="number"
                                                    value={feeForm.maxFee}
                                                    onChange={(e) => setFeeForm({ ...feeForm, maxFee: e.target.value })}
                                                    placeholder="Maximum fee"
                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Applies To *</label>
                                            <div className="space-y-2">
                                                {['chapa', 'telebirr', 'cbebirr', 'hellocash', 'bank_transfer'].map(method => (
                                                    <label key={method} className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            value={method}
                                                            checked={feeForm.appliesTo.includes(method)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setFeeForm({ ...feeForm, appliesTo: [...feeForm.appliesTo, method] });
                                                                } else {
                                                                    setFeeForm({ ...feeForm, appliesTo: feeForm.appliesTo.filter(m => m !== method) });
                                                                }
                                                            }}
                                                            className="w-4 h-4 text-orange-600 rounded"
                                                        />
                                                        <span className="text-sm text-gray-700 capitalize">{method.replace('_', ' ')}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="feeActive"
                                                checked={feeForm.isActive}
                                                onChange={(e) => setFeeForm({ ...feeForm, isActive: e.target.checked })}
                                                className="w-4 h-4 text-orange-600 rounded"
                                            />
                                            <label htmlFor="feeActive" className="text-sm text-gray-700">Active</label>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-6">
                                        <ReusableButton
                                            onClick={() => {
                                                setShowAddFee(false);
                                                setEditingFee(null);
                                                resetFeeForm();
                                            }}
                                            label="Cancel"
                                            variant="secondary"
                                            className="flex-1"
                                        />
                                        <ReusableButton
                                            onClick={handleSaveFee}
                                            label={editingFee ? "Update Fee" : "Add Fee"}
                                            className="flex-1 bg-gradient-to-r from-orange-600 to-red-600"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

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

export default Commission;