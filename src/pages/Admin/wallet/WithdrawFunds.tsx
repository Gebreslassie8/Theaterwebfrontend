// src/pages/Admin/wallet/WithdrawFunds.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingDown,
    ArrowLeft,
    Building,
    Smartphone,
    Landmark,
    CreditCard,
    Shield,
    Lock,
    CheckCircle,
    AlertCircle,
    FileText,
    DollarSign,
    Copy,
    Check,
    Wallet,
    Clock,
    Receipt,
    User,
    Phone,
    Mail
} from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';

// Types
interface WithdrawalMethod {
    id: string;
    name: string;
    icon: React.ElementType;
    description: string;
    minAmount: number;
    maxAmount: number;
    fee: number;
    processingTime: string;
    color: string;
    bgColor: string;
    hoverColor: string;
    textColor: string;
    buttonColor: string;
}

// Available Banks for Bank Transfer
const availableBanks = [
    { value: 'cbe', label: 'Commercial Bank of Ethiopia (CBE)' },
    { value: 'dashen', label: 'Dashen Bank' },
    { value: 'awash', label: 'Awash Bank' },
    { value: 'united', label: 'United Bank' },
    { value: 'zemen', label: 'Zemen Bank' },
    { value: 'oromia', label: 'Oromia Bank' },
    { value: 'abyssinia', label: 'Abyssinia Bank' },
    { value: 'wegagen', label: 'Wegagen Bank' },
    { value: 'berhan', label: 'Berhan Bank' },
    { value: 'nib', label: 'Nib International Bank' },
    { value: 'cooperative', label: 'Cooperative Bank of Oromia' },
    { value: 'debub', label: 'Debub Global Bank' }
];

// Withdrawal Methods
const withdrawalMethods: WithdrawalMethod[] = [
    {
        id: 'chapa',
        name: 'Chapa',
        icon: CreditCard,
        description: 'Withdraw to your Chapa account',
        minAmount: 100,
        maxAmount: 500000,
        fee: 15,
        processingTime: 'Instant - 2 Hours',
        color: 'from-teal-500 to-emerald-500',
        bgColor: 'bg-teal-50',
        hoverColor: 'hover:border-teal-500',
        textColor: 'text-teal-600',
        buttonColor: 'from-teal-600 to-emerald-600'
    },
    {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        icon: Building,
        description: 'Direct transfer to your bank account',
        minAmount: 500,
        maxAmount: 500000,
        fee: 25,
        processingTime: '2-3 Business Days',
        color: 'from-blue-500 to-indigo-500',
        bgColor: 'bg-blue-50',
        hoverColor: 'hover:border-blue-500',
        textColor: 'text-blue-600',
        buttonColor: 'from-blue-600 to-indigo-600'
    },
    {
        id: 'telebirr',
        name: 'TeleBirr',
        icon: Smartphone,
        description: 'Mobile Money Transfer',
        minAmount: 100,
        maxAmount: 30000,
        fee: 10,
        processingTime: 'Instant - 1 Hour',
        color: 'from-green-500 to-emerald-500',
        bgColor: 'bg-green-50',
        hoverColor: 'hover:border-green-500',
        textColor: 'text-green-600',
        buttonColor: 'from-green-600 to-emerald-600'
    },
    {
        id: 'cbebirr',
        name: 'CBE Birr',
        icon: Landmark,
        description: 'CBE Mobile Banking',
        minAmount: 100,
        maxAmount: 50000,
        fee: 10,
        processingTime: 'Instant - 1 Hour',
        color: 'from-blue-500 to-cyan-500',
        bgColor: 'bg-blue-50',
        hoverColor: 'hover:border-blue-500',
        textColor: 'text-blue-600',
        buttonColor: 'from-blue-600 to-cyan-600'
    },
    {
        id: 'hellocash',
        name: 'HelloCash',
        icon: Smartphone,
        description: 'HelloCash Mobile Money',
        minAmount: 100,
        maxAmount: 25000,
        fee: 10,
        processingTime: 'Instant - 1 Hour',
        color: 'from-orange-500 to-red-500',
        bgColor: 'bg-orange-50',
        hoverColor: 'hover:border-orange-500',
        textColor: 'text-orange-600',
        buttonColor: 'from-orange-600 to-red-600'
    }
];

// Get validation schema based on method
const getValidationSchema = (methodId: string, amount: number) => {
    const baseValidations = {
        notes: Yup.string().max(500, 'Notes cannot exceed 500 characters')
    };

    switch (methodId) {
        case 'chapa':
            return Yup.object({
                ...baseValidations,
                chapaEmail: Yup.string().required('Chapa email is required').email('Please enter a valid email address'),
                accountName: Yup.string().required('Account holder name is required').min(3, 'Name must be at least 3 characters'),
                phoneNumber: Yup.string().required('Phone number is required').matches(/^[0-9+\-\s()]{10,15}$/, 'Please enter a valid phone number')
            });
        case 'bank_transfer':
            return Yup.object({
                ...baseValidations,
                accountName: Yup.string().required('Account holder name is required').min(3, 'Name must be at least 3 characters'),
                accountNumber: Yup.string().required('Account number is required').min(5, 'Please enter a valid account number'),
                bankName: Yup.string().required('Please select your bank'),
                branchName: Yup.string()
            });
        case 'telebirr':
            return Yup.object({
                ...baseValidations,
                accountName: Yup.string().required('Account holder name is required').min(3, 'Name must be at least 3 characters'),
                phoneNumber: Yup.string().required('TeleBirr phone number is required').matches(/^[0-9+\-\s()]{10,15}$/, 'Please enter a valid phone number'),
                email: Yup.string().email('Please enter a valid email address')
            });
        case 'cbebirr':
            return Yup.object({
                ...baseValidations,
                accountName: Yup.string().required('Account holder name is required').min(3, 'Name must be at least 3 characters'),
                phoneNumber: Yup.string().required('CBE Birr phone number is required').matches(/^[0-9+\-\s()]{10,15}$/, 'Please enter a valid phone number'),
                accountNumber: Yup.string()
            });
        case 'hellocash':
            return Yup.object({
                ...baseValidations,
                accountName: Yup.string().required('Account holder name is required').min(3, 'Name must be at least 3 characters'),
                phoneNumber: Yup.string().required('HelloCash phone number is required').matches(/^[0-9+\-\s()]{10,15}$/, 'Please enter a valid phone number')
            });
        default:
            return Yup.object(baseValidations);
    }
};

// Get initial values based on method
const getInitialValues = (methodId: string) => {
    const base = { notes: '' };

    switch (methodId) {
        case 'chapa':
            return { ...base, chapaEmail: '', accountName: '', phoneNumber: '' };
        case 'bank_transfer':
            return { ...base, accountName: '', accountNumber: '', bankName: '', branchName: '' };
        case 'telebirr':
            return { ...base, accountName: '', phoneNumber: '', email: '' };
        case 'cbebirr':
            return { ...base, accountName: '', phoneNumber: '', accountNumber: '' };
        case 'hellocash':
            return { ...base, accountName: '', phoneNumber: '' };
        default:
            return base;
    }
};

// Render form fields based on method
const renderFormFields = (methodId: string, values: any, handleChange: any, handleBlur: any, errors: any, touched: any) => {
    switch (methodId) {
        case 'chapa':
            return (
                <>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Chapa Account Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="chapaEmail"
                            value={values.chapaEmail}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Enter your Chapa registered email"
                            className={`w-full px-4 py-2.5 border ${errors.chapaEmail && touched.chapaEmail ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                        />
                        <ErrorMessage name="chapaEmail" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Account Holder Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="accountName"
                            value={values.accountName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Enter your full name"
                            className={`w-full px-4 py-2.5 border ${errors.accountName && touched.accountName ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                        />
                        <ErrorMessage name="accountName" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={values.phoneNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Enter your phone number"
                            className={`w-full px-4 py-2.5 border ${errors.phoneNumber && touched.phoneNumber ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                        />
                        <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                </>
            );

        case 'bank_transfer':
            return (
                <>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Account Holder Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="accountName"
                            value={values.accountName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Enter account holder name"
                            className={`w-full px-4 py-2.5 border ${errors.accountName && touched.accountName ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        />
                        <ErrorMessage name="accountName" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Account Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="accountNumber"
                            value={values.accountNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Enter account number"
                            className={`w-full px-4 py-2.5 border ${errors.accountNumber && touched.accountNumber ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        />
                        <ErrorMessage name="accountNumber" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bank Name <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="bankName"
                            value={values.bankName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-2.5 border ${errors.bankName && touched.bankName ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        >
                            <option value="">Select your bank</option>
                            {availableBanks.map(bank => (
                                <option key={bank.value} value={bank.value}>{bank.label}</option>
                            ))}
                        </select>
                        <ErrorMessage name="bankName" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Branch Name <span className="text-gray-400 text-xs">(Optional)</span>
                        </label>
                        <input
                            type="text"
                            name="branchName"
                            value={values.branchName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Enter branch name"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </>
            );

        case 'telebirr':
            return (
                <>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Account Holder Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="accountName"
                            value={values.accountName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Enter your full name"
                            className={`w-full px-4 py-2.5 border ${errors.accountName && touched.accountName ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                        />
                        <ErrorMessage name="accountName" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            TeleBirr Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={values.phoneNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Enter TeleBirr registered number"
                            className={`w-full px-4 py-2.5 border ${errors.phoneNumber && touched.phoneNumber ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                        />
                        <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address <span className="text-gray-400 text-xs">(Optional)</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Enter email for receipt"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                </>
            );

        case 'cbebirr':
            return (
                <>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Account Holder Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="accountName"
                            value={values.accountName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Enter your full name"
                            className={`w-full px-4 py-2.5 border ${errors.accountName && touched.accountName ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        />
                        <ErrorMessage name="accountName" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            CBE Birr Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={values.phoneNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Enter CBE Birr registered number"
                            className={`w-full px-4 py-2.5 border ${errors.phoneNumber && touched.phoneNumber ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        />
                        <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            CBE Account Number <span className="text-gray-400 text-xs">(Optional)</span>
                        </label>
                        <input
                            type="text"
                            name="accountNumber"
                            value={values.accountNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Enter your CBE account number"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </>
            );

        case 'hellocash':
            return (
                <>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Account Holder Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="accountName"
                            value={values.accountName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Enter your full name"
                            className={`w-full px-4 py-2.5 border ${errors.accountName && touched.accountName ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                        />
                        <ErrorMessage name="accountName" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            HelloCash Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={values.phoneNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Enter HelloCash registered number"
                            className={`w-full px-4 py-2.5 border ${errors.phoneNumber && touched.phoneNumber ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                        />
                        <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                </>
            );

        default:
            return null;
    }
};

const WithdrawFunds: React.FC = () => {
    const [step, setStep] = useState(1);
    const [selectedMethod, setSelectedMethod] = useState<WithdrawalMethod | null>(null);
    const [amount, setAmount] = useState<number>(0);
    const [customAmount, setCustomAmount] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [withdrawalComplete, setWithdrawalComplete] = useState(false);
    const [withdrawalReference, setWithdrawalReference] = useState('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });
    const [copied, setCopied] = useState(false);

    // Available balance (mock data - would come from API)
    const availableBalance = 15850;

    const amountOptions = [500, 1000, 2000, 5000, 10000, 20000, 50000];

    const handleMethodSelect = (method: WithdrawalMethod) => {
        setSelectedMethod(method);
        setStep(2);
    };

    const handleAmountSelect = (selectedAmount: number) => {
        if (selectedAmount > availableBalance) {
            alert(`Insufficient balance. Your available balance is ${formatCurrency(availableBalance)}`);
            return;
        }
        if (selectedMethod && selectedAmount < selectedMethod.minAmount) {
            alert(`Minimum withdrawal amount is ${formatCurrency(selectedMethod.minAmount)}`);
            return;
        }
        if (selectedMethod && selectedAmount > selectedMethod.maxAmount) {
            alert(`Maximum withdrawal amount is ${formatCurrency(selectedMethod.maxAmount)}`);
            return;
        }
        setAmount(selectedAmount);
        setCustomAmount('');
        setStep(3);
    };

    const handleCustomAmount = () => {
        const custom = parseFloat(customAmount);
        if (custom && selectedMethod) {
            if (isNaN(custom)) {
                alert('Please enter a valid amount');
                return;
            }
            if (custom < selectedMethod.minAmount) {
                alert(`Minimum withdrawal amount is ${formatCurrency(selectedMethod.minAmount)}`);
                return;
            }
            if (custom > selectedMethod.maxAmount) {
                alert(`Maximum withdrawal amount is ${formatCurrency(selectedMethod.maxAmount)}`);
                return;
            }
            if (custom > availableBalance) {
                alert(`Insufficient balance. Your available balance is ${formatCurrency(availableBalance)}`);
                return;
            }
            setAmount(custom);
            setStep(3);
        } else {
            alert(`Please enter an amount between ${formatCurrency(selectedMethod?.minAmount || 0)} and ${formatCurrency(selectedMethod?.maxAmount || 0)}`);
        }
    };

    const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
        setIsProcessing(true);

        console.log('Withdrawal submission:', {
            method: selectedMethod?.name,
            amount: amount,
            fee: selectedMethod?.fee,
            totalDeduction: amount + (selectedMethod?.fee || 0),
            accountDetails: values
        });

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        const reference = `WTD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        setWithdrawalReference(reference);
        setWithdrawalComplete(true);

        setPopupMessage({
            title: 'Withdrawal Request Submitted!',
            message: `Your withdrawal request of ${formatCurrency(amount)} via ${selectedMethod?.name} has been submitted. Reference: ${reference}`,
            type: 'success'
        });
        setShowSuccessPopup(true);

        setIsProcessing(false);
        setSubmitting(false);
        resetForm();
    };

    const handleNewWithdrawal = () => {
        setStep(1);
        setSelectedMethod(null);
        setAmount(0);
        setCustomAmount('');
        setWithdrawalComplete(false);
        setCopied(false);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'ETB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl shadow-lg">
                                    <TrendingDown className="h-6 w-6 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">Withdraw Funds</h1>
                            </div>
                            <p className="text-gray-600">Withdraw money from your system wallet to your preferred payment method</p>
                        </div>
                        {step > 1 && !withdrawalComplete && (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition bg-white rounded-xl shadow-sm border border-gray-200"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* Available Balance Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 shadow-sm"
                >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-md">
                                <Wallet className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Available Balance</p>
                                <p className="text-3xl font-bold text-gray-900">{formatCurrency(availableBalance)}</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="text-right">
                                <p className="text-xs text-gray-500">Ready for withdrawal</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <p className="text-xs text-green-600">No pending withdrawals</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Step 1: Select Withdrawal Method */}
                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-red-500" />
                            Select Withdrawal Method
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {withdrawalMethods.map((method) => {
                                const Icon = method.icon;
                                return (
                                    <motion.button
                                        key={method.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleMethodSelect(method)}
                                        className={`group p-5 bg-white rounded-2xl border-2 border-gray-200 ${method.hoverColor} hover:shadow-xl transition-all duration-300 text-left relative overflow-hidden`}
                                    >
                                        <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${method.color} opacity-10 rounded-full transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-500`}></div>
                                        <div className="relative z-10">
                                            <div className={`flex items-center gap-4 mb-4`}>
                                                <div className={`p-3 ${method.bgColor} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                                                    <Icon className={`h-6 w-6 ${method.textColor}`} />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{method.name}</h3>
                                                    <p className="text-xs text-gray-500">{method.description}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-500">Min/Max</span>
                                                    <span className="text-gray-700 font-medium">{formatCurrency(method.minAmount)} - {formatCurrency(method.maxAmount)}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-500">Fee</span>
                                                    <span className={`font-medium ${method.textColor}`}>{formatCurrency(method.fee)}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-500">Processing Time</span>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3 text-gray-400" />
                                                        <span className="text-gray-700 text-xs">{method.processingTime}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* Step 2: Enter Amount */}
                {step === 2 && selectedMethod && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                <div className={`p-2 ${selectedMethod.bgColor} rounded-lg`}>
                                    <DollarSign className={`h-5 w-5 ${selectedMethod.textColor}`} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Enter Withdrawal Amount</h2>
                                    <p className="text-sm text-gray-500">Minimum: {formatCurrency(selectedMethod.minAmount)} | Maximum: {formatCurrency(selectedMethod.maxAmount)}</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Quick Select Amount</label>
                                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                                    {amountOptions.map((amt) => {
                                        const isDisabled = amt > availableBalance || amt < selectedMethod.minAmount || amt > selectedMethod.maxAmount;
                                        return (
                                            <button
                                                key={amt}
                                                onClick={() => handleAmountSelect(amt)}
                                                disabled={isDisabled}
                                                className={`px-4 py-2.5 border-2 rounded-xl transition-all font-medium ${isDisabled
                                                        ? 'border-gray-200 opacity-50 cursor-not-allowed bg-gray-50 text-gray-400'
                                                        : `border-gray-200 hover:border-${selectedMethod.id === 'chapa' ? 'teal-500' : selectedMethod.id === 'bank_transfer' ? 'blue-500' : selectedMethod.id === 'telebirr' ? 'green-500' : selectedMethod.id === 'cbebirr' ? 'cyan-500' : 'orange-500'} hover:bg-${selectedMethod.id === 'chapa' ? 'teal-50' : selectedMethod.id === 'bank_transfer' ? 'blue-50' : selectedMethod.id === 'telebirr' ? 'green-50' : selectedMethod.id === 'cbebirr' ? 'cyan-50' : 'orange-50'} text-gray-700`
                                                    }`}
                                            >
                                                {formatCurrency(amt)}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Or Enter Custom Amount</label>
                                <div className="flex gap-3">
                                    <div className="relative flex-1">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">ETB</span>
                                        <input
                                            type="number"
                                            value={customAmount}
                                            onChange={(e) => setCustomAmount(e.target.value)}
                                            placeholder="Enter amount"
                                            className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleCustomAmount();
                                                }
                                            }}
                                        />
                                    </div>
                                    <ReusableButton
                                        onClick={handleCustomAmount}
                                        label="Continue"
                                        className="px-6 py-2.5"
                                    />
                                </div>
                            </div>

                            {/* Withdrawal Summary */}
                            <div className={`p-5 ${selectedMethod.bgColor} rounded-xl`}>
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Receipt className="h-4 w-4" />
                                    Withdrawal Summary
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center pb-2 border-b border-white/30">
                                        <span className="text-gray-600">Withdrawal Method</span>
                                        <div className="flex items-center gap-2">
                                            <selectedMethod.icon className={`h-4 w-4 ${selectedMethod.textColor}`} />
                                            <span className="font-medium text-gray-900">{selectedMethod.name}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Withdrawal Amount</span>
                                        <span className="font-medium text-gray-900">{formatCurrency(amount)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Processing Fee</span>
                                        <span className={`font-medium ${selectedMethod.textColor}`}>{formatCurrency(selectedMethod.fee)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-white/30">
                                        <span className="font-semibold text-gray-900">Total Deduction</span>
                                        <span className="text-xl font-bold text-red-600">{formatCurrency(amount + selectedMethod.fee)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">You'll Receive</span>
                                        <span className="text-lg font-bold text-green-600">{formatCurrency(amount)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-white/30">
                                        <span className="text-gray-600">Balance After Withdrawal</span>
                                        <span className="text-gray-700">{formatCurrency(availableBalance - amount - selectedMethod.fee)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Step 3: Account Details & Confirmation */}
                {step === 3 && selectedMethod && !withdrawalComplete && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                <div className={`p-2 ${selectedMethod.bgColor} rounded-lg`}>
                                    <FileText className={`h-5 w-5 ${selectedMethod.textColor}`} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Withdrawal Information</h2>
                                    <p className="text-sm text-gray-500">Please provide your account details for {selectedMethod.name}</p>
                                </div>
                            </div>

                            <Formik
                                key={selectedMethod.id}
                                initialValues={getInitialValues(selectedMethod.id)}
                                validationSchema={getValidationSchema(selectedMethod.id, amount)}
                                onSubmit={handleSubmit}
                                validateOnChange={true}
                                validateOnBlur={true}
                            >
                                {({ handleChange, handleBlur, values, errors, touched, isValid, isSubmitting }) => (
                                    <Form>
                                        {/* Dynamic Form Fields */}
                                        {renderFormFields(selectedMethod.id, values, handleChange, handleBlur, errors, touched)}

                                        {/* Notes Field */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Notes <span className="text-gray-400 text-xs">(Optional)</span>
                                            </label>
                                            <textarea
                                                name="notes"
                                                value={values.notes}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                rows={3}
                                                placeholder="Any additional notes for this withdrawal (optional)"
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            />
                                            <ErrorMessage name="notes" component="div" className="text-red-500 text-xs mt-1" />
                                        </div>

                                        {/* Warning Message */}
                                        <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                                            <div className="flex items-start gap-3">
                                                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-yellow-800">Important Information</p>
                                                    <p className="text-xs text-yellow-700 mt-1">
                                                        Please ensure all account details are correct. Incorrect information may result in delayed or failed withdrawals.
                                                        Withdrawal requests cannot be cancelled once processed.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <div className="mt-6">
                                            <ReusableButton
                                                type="submit"
                                                label={isProcessing ? "Processing..." : "Confirm Withdrawal"}
                                                disabled={isProcessing || !isValid}
                                                className={`w-full py-3 bg-gradient-to-r ${selectedMethod.buttonColor} text-white hover:opacity-90 shadow-md`}
                                                icon={isProcessing ? undefined : Lock}
                                            />
                                        </div>

                                        <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center gap-2 text-xs text-gray-500">
                                            <Shield className="h-4 w-4 text-green-600" />
                                            Your withdrawal is secure and encrypted. We use 256-bit SSL encryption.
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </motion.div>
                )}

                {/* Success Screen */}
                {withdrawalComplete && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl p-8 text-center shadow-xl border border-gray-200"
                    >
                        <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <CheckCircle className="h-10 w-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Withdrawal Request Submitted!</h2>
                        <p className="text-gray-600 mb-6">
                            Your withdrawal request has been received and is being processed.
                        </p>
                        <div className="bg-gray-50 rounded-xl p-5 mb-6">
                            <p className="text-sm text-gray-500 mb-1">Reference Number</p>
                            <p className="text-lg font-mono font-bold text-red-600">{withdrawalReference}</p>
                            <button
                                onClick={() => copyToClipboard(withdrawalReference)}
                                className="mt-2 text-sm text-red-600 hover:underline flex items-center justify-center gap-1"
                            >
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                {copied ? 'Copied!' : 'Copy Reference'}
                            </button>
                        </div>
                        <div className="flex gap-3">
                            <ReusableButton
                                onClick={handleNewWithdrawal}
                                label="Make Another Withdrawal"
                                className="flex-1 py-3"
                            />
                            <ReusableButton
                                onClick={() => window.location.href = '/admin/wallet/balance'}
                                label="View Wallet"
                                variant="secondary"
                                className="flex-1 py-3"
                            />
                        </div>
                    </motion.div>
                )}

                {/* Success Popup */}
                <SuccessPopup
                    isOpen={showSuccessPopup}
                    onClose={() => setShowSuccessPopup(false)}
                    type={popupMessage.type}
                    title={popupMessage.title}
                    message={popupMessage.message}
                    duration={5000}
                    position="top-right"
                />
            </div>
        </div>
    );
};

export default WithdrawFunds;