// src/pages/Admin/wallet/PaymentMethods.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CreditCard,
    Building,
    Smartphone,
    Landmark,
    Plus,
    Trash2,
    Edit2,
    Check,
    X,
    AlertCircle,
    Shield,
    Banknote,
    Wallet,
    Star,
    MoreVertical,
    Phone,
    Mail,
    User,
    MapPin,
    Copy,
    Eye,
    EyeOff,
    ArrowLeft,
    TrendingUp,
    Clock,
    Receipt,
    DollarSign,
    AlertTriangle
} from 'lucide-react';
import ReusableButton from '../Reusable/ReusableButton';
import SuccessPopup from '../Reusable/SuccessPopup';
import * as Yup from 'yup';

// Types
interface BankAccount {
    id: string;
    accountName: string;
    accountNumber: string;
    bankName: string;
    branchName: string;
    isDefault: boolean;
    createdAt: string;
    lastUsed?: string;
    status: 'active' | 'inactive';
}

interface PaymentMethod {
    id: string;
    name: string;
    type: 'bank' | 'mobile_money' | 'wallet' | 'card';
    icon: React.ElementType;
    description: string;
    isEnabled: boolean;
    isDefault?: boolean;
    minAmount: number;
    maxAmount: number;
    processingTime: string;
    fee: number;
    feeType: 'fixed' | 'percentage';
    color: string;
    bgColor: string;
    textColor: string;
    supportedBanks?: BankAccount[];
}

// Available Banks List
const availableBanksList = [
    { code: 'cbe', name: 'Commercial Bank of Ethiopia (CBE)', icon: '🏦' },
    { code: 'dashen', name: 'Dashen Bank', icon: '🏛️' },
    { code: 'awash', name: 'Awash Bank', icon: '🏦' },
    { code: 'united', name: 'United Bank', icon: '🏛️' },
    { code: 'zemen', name: 'Zemen Bank', icon: '🏦' },
    { code: 'oromia', name: 'Oromia Bank', icon: '🏛️' },
    { code: 'abyssinia', name: 'Abyssinia Bank', icon: '🏦' },
    { code: 'wegagen', name: 'Wegagen Bank', icon: '🏛️' },
    { code: 'berhan', name: 'Berhan Bank', icon: '🏦' },
    { code: 'nib', name: 'Nib International Bank', icon: '🏛️' },
    { code: 'cooperative', name: 'Cooperative Bank of Oromia', icon: '🏦' },
    { code: 'debub', name: 'Debub Global Bank', icon: '🏛️' }
];

// Mock user's saved bank accounts
const mockBankAccounts: BankAccount[] = [
    {
        id: '1',
        accountName: 'John Doe',
        accountNumber: '1000123456789',
        bankName: 'cbe',
        branchName: 'Bole Branch',
        isDefault: true,
        createdAt: '2024-01-15',
        lastUsed: '2024-03-20',
        status: 'active'
    },
    {
        id: '2',
        accountName: 'John Doe',
        accountNumber: '2000876543210',
        bankName: 'dashen',
        branchName: 'Piassa Branch',
        isDefault: false,
        createdAt: '2024-02-10',
        lastUsed: '2024-03-15',
        status: 'active'
    }
];

// Payment Methods Configuration
const paymentMethodsConfig: PaymentMethod[] = [
    {
        id: 'chapa',
        name: 'Chapa Wallet',
        type: 'wallet',
        icon: CreditCard,
        description: 'Pay with your Chapa wallet balance',
        isEnabled: true,
        isDefault: true,
        minAmount: 10,
        maxAmount: 500000,
        processingTime: 'Instant',
        fee: 0,
        feeType: 'fixed',
        color: 'from-teal-500 to-emerald-500',
        bgColor: 'bg-teal-50',
        textColor: 'text-teal-600'
    },
    {
        id: 'telebirr',
        name: 'TeleBirr',
        type: 'mobile_money',
        icon: Smartphone,
        description: 'Pay using TeleBirr mobile money',
        isEnabled: true,
        minAmount: 10,
        maxAmount: 30000,
        processingTime: 'Instant - 1 Hour',
        fee: 5,
        feeType: 'fixed',
        color: 'from-green-500 to-emerald-500',
        bgColor: 'bg-green-50',
        textColor: 'text-green-600'
    },
    {
        id: 'cbebirr',
        name: 'CBE Birr',
        type: 'mobile_money',
        icon: Landmark,
        description: 'Pay using CBE Birr mobile banking',
        isEnabled: true,
        minAmount: 10,
        maxAmount: 50000,
        processingTime: 'Instant - 1 Hour',
        fee: 5,
        feeType: 'fixed',
        color: 'from-blue-500 to-cyan-500',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600'
    },
    {
        id: 'hellocash',
        name: 'HelloCash',
        type: 'mobile_money',
        icon: Smartphone,
        description: 'Pay using HelloCash mobile money',
        isEnabled: true,
        minAmount: 10,
        maxAmount: 25000,
        processingTime: 'Instant - 1 Hour',
        fee: 5,
        feeType: 'fixed',
        color: 'from-orange-500 to-red-500',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-600'
    },
    {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        type: 'bank',
        icon: Building,
        description: 'Direct bank transfer from your account',
        isEnabled: true,
        minAmount: 100,
        maxAmount: 500000,
        processingTime: '2-3 Business Days',
        fee: 15,
        feeType: 'fixed',
        color: 'from-blue-500 to-indigo-500',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600',
        supportedBanks: mockBankAccounts
    }
];

// Validation Schema for Bank Account
const bankAccountSchema = Yup.object({
    accountName: Yup.string().required('Account holder name is required').min(3, 'Name must be at least 3 characters'),
    accountNumber: Yup.string()
        .required('Account number is required')
        .min(8, 'Account number must be at least 8 characters')
        .max(20, 'Account number must not exceed 20 characters'),
    bankName: Yup.string().required('Please select your bank'),
    branchName: Yup.string().required('Branch name is required'),
    confirmAccountNumber: Yup.string()
        .required('Please confirm your account number')
        .oneOf([Yup.ref('accountNumber')], 'Account numbers must match')
});

const PaymentMethods: React.FC = () => {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(paymentMethodsConfig);
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
    const [showAddBankModal, setShowAddBankModal] = useState(false);
    const [showEditBankModal, setShowEditBankModal] = useState(false);
    const [selectedBank, setSelectedBank] = useState<BankAccount | null>(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [bankToDelete, setBankToDelete] = useState<BankAccount | null>(null);
    const [showAccountNumbers, setShowAccountNumbers] = useState<{ [key: string]: boolean }>({});

    // Add Bank Account Form State
    const [newBankAccount, setNewBankAccount] = useState({
        accountName: '',
        accountNumber: '',
        confirmAccountNumber: '',
        bankName: '',
        branchName: '',
        setAsDefault: false
    });

    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    const toggleAccountNumberVisibility = (accountId: string) => {
        setShowAccountNumbers(prev => ({
            ...prev,
            [accountId]: !prev[accountId]
        }));
    };

    const formatAccountNumber = (number: string, show: boolean) => {
        if (show) return number;
        return '•'.repeat(Math.min(number.length, 8)) + number.slice(-4);
    };

    const getBankName = (bankCode: string) => {
        const bank = availableBanksList.find(b => b.code === bankCode);
        return bank ? bank.name : bankCode;
    };

    const handleAddBankAccount = async () => {
        try {
            await bankAccountSchema.validate(newBankAccount, { abortEarly: false });

            // Create new bank account
            const newAccount: BankAccount = {
                id: Date.now().toString(),
                accountName: newBankAccount.accountName,
                accountNumber: newBankAccount.accountNumber,
                bankName: newBankAccount.bankName,
                branchName: newBankAccount.branchName,
                isDefault: newBankAccount.setAsDefault,
                createdAt: new Date().toISOString().split('T')[0],
                status: 'active'
            };

            // Update payment methods with new bank account
            const updatedMethods = paymentMethods.map(method => {
                if (method.id === 'bank_transfer') {
                    let updatedBanks = [...(method.supportedBanks || [])];

                    if (newBankAccount.setAsDefault) {
                        updatedBanks = updatedBanks.map(bank => ({ ...bank, isDefault: false }));
                    }

                    updatedBanks.push(newAccount);
                    return { ...method, supportedBanks: updatedBanks };
                }
                return method;
            });

            setPaymentMethods(updatedMethods);
            setShowAddBankModal(false);
            resetBankForm();

            setPopupMessage({
                title: 'Bank Account Added!',
                message: 'Your bank account has been successfully added.',
                type: 'success'
            });
            setShowSuccessPopup(true);
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const errors: { [key: string]: string } = {};
                error.inner.forEach(err => {
                    if (err.path) errors[err.path] = err.message;
                });
                setFormErrors(errors);
            }
        }
    };

    const handleEditBankAccount = async () => {
        if (!selectedBank) return;

        try {
            await bankAccountSchema.validate(newBankAccount, { abortEarly: false });

            // Update bank account
            const updatedMethods = paymentMethods.map(method => {
                if (method.id === 'bank_transfer' && method.supportedBanks) {
                    const updatedBanks = method.supportedBanks.map(bank => {
                        if (bank.id === selectedBank.id) {
                            return {
                                ...bank,
                                accountName: newBankAccount.accountName,
                                accountNumber: newBankAccount.accountNumber,
                                bankName: newBankAccount.bankName,
                                branchName: newBankAccount.branchName,
                                isDefault: newBankAccount.setAsDefault
                            };
                        }
                        if (newBankAccount.setAsDefault) {
                            return { ...bank, isDefault: false };
                        }
                        return bank;
                    });
                    return { ...method, supportedBanks: updatedBanks };
                }
                return method;
            });

            setPaymentMethods(updatedMethods);
            setShowEditBankModal(false);
            resetBankForm();

            setPopupMessage({
                title: 'Bank Account Updated!',
                message: 'Your bank account has been successfully updated.',
                type: 'success'
            });
            setShowSuccessPopup(true);
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const errors: { [key: string]: string } = {};
                error.inner.forEach(err => {
                    if (err.path) errors[err.path] = err.message;
                });
                setFormErrors(errors);
            }
        }
    };

    const handleDeleteBankAccount = () => {
        if (!bankToDelete) return;

        const updatedMethods = paymentMethods.map(method => {
            if (method.id === 'bank_transfer' && method.supportedBanks) {
                const updatedBanks = method.supportedBanks.filter(bank => bank.id !== bankToDelete.id);
                return { ...method, supportedBanks: updatedBanks };
            }
            return method;
        });

        setPaymentMethods(updatedMethods);
        setShowDeleteConfirm(false);
        setBankToDelete(null);

        setPopupMessage({
            title: 'Bank Account Deleted!',
            message: 'Your bank account has been successfully removed.',
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    const handleSetDefaultBank = (bankId: string) => {
        const updatedMethods = paymentMethods.map(method => {
            if (method.id === 'bank_transfer' && method.supportedBanks) {
                const updatedBanks = method.supportedBanks.map(bank => ({
                    ...bank,
                    isDefault: bank.id === bankId
                }));
                return { ...method, supportedBanks: updatedBanks };
            }
            return method;
        });

        setPaymentMethods(updatedMethods);

        setPopupMessage({
            title: 'Default Bank Updated!',
            message: 'Your default bank account has been updated.',
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    const resetBankForm = () => {
        setNewBankAccount({
            accountName: '',
            accountNumber: '',
            confirmAccountNumber: '',
            bankName: '',
            branchName: '',
            setAsDefault: false
        });
        setFormErrors({});
        setSelectedBank(null);
    };

    const openEditModal = (bank: BankAccount) => {
        setSelectedBank(bank);
        setNewBankAccount({
            accountName: bank.accountName,
            accountNumber: bank.accountNumber,
            confirmAccountNumber: bank.accountNumber,
            bankName: bank.bankName,
            branchName: bank.branchName,
            setAsDefault: bank.isDefault
        });
        setShowEditBankModal(true);
    };

    const togglePaymentMethod = (methodId: string) => {
        setPaymentMethods(methods =>
            methods.map(method =>
                method.id === methodId
                    ? { ...method, isEnabled: !method.isEnabled }
                    : method
            )
        );

        const method = paymentMethods.find(m => m.id === methodId);
        setPopupMessage({
            title: 'Payment Method Updated',
            message: `${method?.name} has been ${!method?.isEnabled ? 'enabled' : 'disabled'}.`,
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    const setDefaultMethod = (methodId: string) => {
        setPaymentMethods(methods =>
            methods.map(method => ({
                ...method,
                isDefault: method.id === methodId
            }))
        );

        const method = paymentMethods.find(m => m.id === methodId);
        setPopupMessage({
            title: 'Default Method Updated',
            message: `${method?.name} is now your default payment method.`,
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'ETB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
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
                                    <CreditCard className="h-6 w-6 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
                            </div>
                            <p className="text-gray-600">Manage your payment methods and bank accounts</p>
                        </div>
                        <div className="flex gap-3">
                            <div className="bg-green-50 px-4 py-2 rounded-xl border border-green-200">
                                <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-green-600" />
                                    <span className="text-sm text-green-700">Secure & Encrypted</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8"
                >
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Active Methods</p>
                                <p className="text-2xl font-bold text-gray-900">{paymentMethods.filter(m => m.isEnabled).length}</p>
                            </div>
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CreditCard className="h-5 w-5 text-green-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Bank Accounts</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {paymentMethods.find(m => m.id === 'bank_transfer')?.supportedBanks?.length || 0}
                                </p>
                            </div>
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Building className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Mobile Money</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {paymentMethods.filter(m => m.type === 'mobile_money' && m.isEnabled).length}
                                </p>
                            </div>
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <Smartphone className="h-5 w-5 text-orange-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Default Method</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {paymentMethods.find(m => m.isDefault)?.name || 'None'}
                                </p>
                            </div>
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Star className="h-5 w-5 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Payment Methods Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-10"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-purple-500" />
                            Available Payment Methods
                        </h2>
                        <p className="text-sm text-gray-500">Toggle to enable/disable</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {paymentMethods.map((method) => {
                            const Icon = method.icon;
                            return (
                                <div
                                    key={method.id}
                                    className={`bg-white rounded-2xl border-2 transition-all duration-300 ${method.isEnabled ? 'border-gray-200 shadow-sm' : 'border-gray-100 opacity-60'
                                        }`}
                                >
                                    <div className="p-5">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 ${method.bgColor} rounded-xl`}>
                                                    <Icon className={`h-5 w-5 ${method.textColor}`} />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{method.name}</h3>
                                                    <p className="text-xs text-gray-500">{method.description}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {method.isDefault && (
                                                    <span className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded-lg flex items-center gap-1">
                                                        <Star className="h-3 w-3" />
                                                        Default
                                                    </span>
                                                )}
                                                <button
                                                    onClick={() => togglePaymentMethod(method.id)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${method.isEnabled ? 'bg-green-500' : 'bg-gray-300'
                                                        }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${method.isEnabled ? 'translate-x-6' : 'translate-x-1'
                                                            }`}
                                                    />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                                            <div>
                                                <p className="text-gray-500">Min/Max</p>
                                                <p className="font-medium text-gray-900">
                                                    {formatCurrency(method.minAmount)} - {formatCurrency(method.maxAmount)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Processing Time</p>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3 text-gray-400" />
                                                    <p className="font-medium text-gray-900">{method.processingTime}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Fee</p>
                                                <p className={`font-medium ${method.fee > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                                                    {method.fee > 0 ? formatCurrency(method.fee) : 'Free'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Type</p>
                                                <p className="font-medium text-gray-900 capitalize">{method.type.replace('_', ' ')}</p>
                                            </div>
                                        </div>

                                        {!method.isDefault && method.isEnabled && (
                                            <button
                                                onClick={() => setDefaultMethod(method.id)}
                                                className="w-full mt-2 py-2 text-sm text-purple-600 hover:text-purple-700 font-medium transition border-t border-gray-100 pt-3"
                                            >
                                                Set as Default
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Bank Accounts Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <Building className="h-5 w-5 text-blue-500" />
                                Linked Bank Accounts
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">Manage your bank accounts for withdrawals</p>
                        </div>
                        <ReusableButton
                            onClick={() => {
                                resetBankForm();
                                setShowAddBankModal(true);
                            }}
                            label="Add Bank Account"
                            icon={Plus}
                            className="px-4 py-2"
                        />
                    </div>

                    {paymentMethods.find(m => m.id === 'bank_transfer')?.supportedBanks?.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Building className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Bank Accounts Linked</h3>
                            <p className="text-gray-500 mb-4">Add a bank account to withdraw funds directly to your bank.</p>
                            <ReusableButton
                                onClick={() => {
                                    resetBankForm();
                                    setShowAddBankModal(true);
                                }}
                                label="Add Your First Bank Account"
                                icon={Plus}
                            />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {paymentMethods.find(m => m.id === 'bank_transfer')?.supportedBanks?.map((bank) => (
                                <div
                                    key={bank.id}
                                    className={`bg-white rounded-2xl border-2 transition-all duration-300 ${bank.isDefault ? 'border-blue-300 shadow-md' : 'border-gray-200'
                                        }`}
                                >
                                    <div className="p-5">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-50 rounded-xl">
                                                    <Building className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{getBankName(bank.bankName)}</h3>
                                                    <p className="text-xs text-gray-500">Added on {bank.createdAt}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {bank.isDefault && (
                                                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg flex items-center gap-1">
                                                        <Star className="h-3 w-3" />
                                                        Default
                                                    </span>
                                                )}
                                                <div className="relative group">
                                                    <button className="p-1 hover:bg-gray-100 rounded-lg transition">
                                                        <MoreVertical className="h-4 w-4 text-gray-400" />
                                                    </button>
                                                    <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                                        <button
                                                            onClick={() => openEditModal(bank)}
                                                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                        >
                                                            <Edit2 className="h-3 w-3" />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setBankToDelete(bank);
                                                                setShowDeleteConfirm(true);
                                                            }}
                                                            className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                            Delete
                                                        </button>
                                                        {!bank.isDefault && (
                                                            <button
                                                                onClick={() => handleSetDefaultBank(bank.id)}
                                                                className="w-full px-3 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2 border-t border-gray-100"
                                                            >
                                                                <Star className="h-3 w-3" />
                                                                Set as Default
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-500">Account Holder</span>
                                                <span className="text-sm font-medium text-gray-900">{bank.accountName}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-500">Account Number</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-mono font-medium text-gray-900">
                                                        {formatAccountNumber(bank.accountNumber, showAccountNumbers[bank.id] || false)}
                                                    </span>
                                                    <button
                                                        onClick={() => toggleAccountNumberVisibility(bank.id)}
                                                        className="text-gray-400 hover:text-gray-600"
                                                    >
                                                        {showAccountNumbers[bank.id] ? (
                                                            <EyeOff className="h-3 w-3" />
                                                        ) : (
                                                            <Eye className="h-3 w-3" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-500">Branch</span>
                                                <span className="text-sm text-gray-900">{bank.branchName}</span>
                                            </div>
                                            {bank.lastUsed && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-500">Last Used</span>
                                                    <span className="text-xs text-gray-500">{bank.lastUsed}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Add/Edit Bank Account Modal */}
                <AnimatePresence>
                    {(showAddBankModal || showEditBankModal) && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                            onClick={() => {
                                setShowAddBankModal(false);
                                setShowEditBankModal(false);
                                resetBankForm();
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
                                            <div className="p-2 bg-blue-100 rounded-xl">
                                                <Building className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <h2 className="text-xl font-bold text-gray-900">
                                                {showEditBankModal ? 'Edit Bank Account' : 'Add Bank Account'}
                                            </h2>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setShowAddBankModal(false);
                                                setShowEditBankModal(false);
                                                resetBankForm();
                                            }}
                                            className="p-1 hover:bg-gray-100 rounded-lg transition"
                                        >
                                            <X className="h-5 w-5 text-gray-500" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Account Holder Name <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={newBankAccount.accountName}
                                                    onChange={(e) => {
                                                        setNewBankAccount({ ...newBankAccount, accountName: e.target.value });
                                                        setFormErrors({ ...formErrors, accountName: '' });
                                                    }}
                                                    placeholder="Enter account holder name"
                                                    className={`w-full pl-10 pr-4 py-2.5 border ${formErrors.accountName ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                                />
                                            </div>
                                            {formErrors.accountName && (
                                                <p className="text-red-500 text-xs mt-1">{formErrors.accountName}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Bank Name <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={newBankAccount.bankName}
                                                onChange={(e) => {
                                                    setNewBankAccount({ ...newBankAccount, bankName: e.target.value });
                                                    setFormErrors({ ...formErrors, bankName: '' });
                                                }}
                                                className={`w-full px-4 py-2.5 border ${formErrors.bankName ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                            >
                                                <option value="">Select your bank</option>
                                                {availableBanksList.map(bank => (
                                                    <option key={bank.code} value={bank.code}>
                                                        {bank.icon} {bank.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {formErrors.bankName && (
                                                <p className="text-red-500 text-xs mt-1">{formErrors.bankName}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Account Number <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={newBankAccount.accountNumber}
                                                    onChange={(e) => {
                                                        setNewBankAccount({ ...newBankAccount, accountNumber: e.target.value });
                                                        setFormErrors({ ...formErrors, accountNumber: '' });
                                                    }}
                                                    placeholder="Enter account number"
                                                    className={`w-full pl-10 pr-4 py-2.5 border ${formErrors.accountNumber ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                                />
                                            </div>
                                            {formErrors.accountNumber && (
                                                <p className="text-red-500 text-xs mt-1">{formErrors.accountNumber}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Confirm Account Number <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={newBankAccount.confirmAccountNumber}
                                                    onChange={(e) => {
                                                        setNewBankAccount({ ...newBankAccount, confirmAccountNumber: e.target.value });
                                                        setFormErrors({ ...formErrors, confirmAccountNumber: '' });
                                                    }}
                                                    placeholder="Confirm account number"
                                                    className={`w-full pl-10 pr-4 py-2.5 border ${formErrors.confirmAccountNumber ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                                />
                                            </div>
                                            {formErrors.confirmAccountNumber && (
                                                <p className="text-red-500 text-xs mt-1">{formErrors.confirmAccountNumber}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Branch Name <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={newBankAccount.branchName}
                                                    onChange={(e) => {
                                                        setNewBankAccount({ ...newBankAccount, branchName: e.target.value });
                                                        setFormErrors({ ...formErrors, branchName: '' });
                                                    }}
                                                    placeholder="Enter branch name"
                                                    className={`w-full pl-10 pr-4 py-2.5 border ${formErrors.branchName ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                                />
                                            </div>
                                            {formErrors.branchName && (
                                                <p className="text-red-500 text-xs mt-1">{formErrors.branchName}</p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="setAsDefault"
                                                checked={newBankAccount.setAsDefault}
                                                onChange={(e) => setNewBankAccount({ ...newBankAccount, setAsDefault: e.target.checked })}
                                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                            />
                                            <label htmlFor="setAsDefault" className="text-sm text-gray-700">
                                                Set as default bank account
                                            </label>
                                        </div>

                                        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                            <div className="flex items-start gap-2">
                                                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                                                <p className="text-xs text-yellow-700">
                                                    Please ensure all account details are correct. Incorrect information may result in failed transactions.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-6">
                                        <ReusableButton
                                            onClick={() => {
                                                setShowAddBankModal(false);
                                                setShowEditBankModal(false);
                                                resetBankForm();
                                            }}
                                            label="Cancel"
                                            variant="secondary"
                                            className="flex-1"
                                        />
                                        <ReusableButton
                                            onClick={showEditBankModal ? handleEditBankAccount : handleAddBankAccount}
                                            label={showEditBankModal ? "Update Account" : "Add Account"}
                                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Delete Confirmation Modal */}
                <AnimatePresence>
                    {showDeleteConfirm && bankToDelete && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                            onClick={() => {
                                setShowDeleteConfirm(false);
                                setBankToDelete(null);
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-2xl max-w-md w-full p-6"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <AlertTriangle className="h-8 w-8 text-red-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Bank Account?</h3>
                                    <p className="text-gray-600 mb-4">
                                        Are you sure you want to delete {getBankName(bankToDelete.bankName)} account ending in {bankToDelete.accountNumber.slice(-4)}?
                                        This action cannot be undone.
                                    </p>
                                    <div className="flex gap-3">
                                        <ReusableButton
                                            onClick={() => {
                                                setShowDeleteConfirm(false);
                                                setBankToDelete(null);
                                            }}
                                            label="Cancel"
                                            variant="secondary"
                                            className="flex-1"
                                        />
                                        <ReusableButton
                                            onClick={handleDeleteBankAccount}
                                            label="Delete Account"
                                            className="flex-1 bg-gradient-to-r from-red-600 to-pink-600"
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

export default PaymentMethods;