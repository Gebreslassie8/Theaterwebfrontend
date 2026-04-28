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
    Mail,
    ChevronRight,
    ChevronLeft,
    Loader2,
    TrendingUp,
    Sparkles
} from 'lucide-react';
import * as Yup from 'yup';
import ReusableForm from '../Reusable/ReusableForm';
import ReusableButton from '..//Reusable/ReusableButton';
import SuccessPopup from '../Reusable/SuccessPopup';


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
}

// Amount preset options
const amountPresets = [
    { value: 500, label: 'ETB 500', icon: Wallet, recommended: false },
    { value: 1000, label: 'ETB 1,000', icon: Wallet, recommended: false },
    { value: 2000, label: 'ETB 2,000', icon: Wallet, recommended: false },
    { value: 5000, label: 'ETB 5,000', icon: TrendingUp, recommended: true },
    { value: 10000, label: 'ETB 10,000', icon: TrendingUp, recommended: false },
    { value: 20000, label: 'ETB 20,000', icon: Sparkles, recommended: false },
    { value: 50000, label: 'ETB 50,000', icon: Sparkles, recommended: false }
];

// Chapa Withdrawal Method (Single method - Chapa handles all)
const chapaMethod: WithdrawalMethod = {
    id: 'chapa',
    name: 'Chapa',
    icon: CreditCard,
    description: 'Withdraw to your Chapa account / Bank / Mobile Money',
    minAmount: 100,
    maxAmount: 500000,
    fee: 15,
    processingTime: 'Instant - 2 Hours'
};

// Validation Schema
const withdrawalSchema = Yup.object({
    accountName: Yup.string().required('Account holder name is required').min(3, 'Name must be at least 3 characters'),
    chapaEmail: Yup.string().required('Chapa email is required').email('Please enter a valid email address'),
    phoneNumber: Yup.string().required('Phone number is required').matches(/^[0-9+\-\s()]{10,15}$/, 'Please enter a valid phone number'),
    notes: Yup.string().max(500, 'Notes cannot exceed 500 characters')
});

const WithdrawFunds: React.FC = () => {
    const [step, setStep] = useState(1);
    const [selectedMethod] = useState<WithdrawalMethod>(chapaMethod);
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

    // Form fields for ReusableForm - REMOVED icon property to fix error
    const formFields = [
        {
            name: 'accountName',
            type: 'text' as const,
            label: 'Account Holder Name',
            placeholder: 'Enter your full name',
            required: true
        },
        {
            name: 'chapaEmail',
            type: 'email' as const,
            label: 'Chapa Account Email',
            placeholder: 'Enter your Chapa registered email',
            required: true
        },
        {
            name: 'phoneNumber',
            type: 'text' as const,
            label: 'Phone Number',
            placeholder: 'Enter your phone number',
            required: true
        },
        {
            name: 'notes',
            type: 'textarea' as const,
            label: 'Notes (Optional)',
            placeholder: 'Any additional notes for this withdrawal',
            required: false,
            rows: 3
        }
    ];

    const handleAmountSelect = (selectedAmount: number) => {
        if (selectedAmount > availableBalance) {
            alert(`Insufficient balance. Your available balance is ${formatCurrency(availableBalance)}`);
            return;
        }
        if (selectedAmount < selectedMethod.minAmount) {
            alert(`Minimum withdrawal amount is ${formatCurrency(selectedMethod.minAmount)}`);
            return;
        }
        if (selectedAmount > selectedMethod.maxAmount) {
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

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        setIsProcessing(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        const reference = `WTD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        setWithdrawalReference(reference);
        setWithdrawalComplete(true);

        setPopupMessage({
            title: 'Withdrawal Request Submitted!',
            message: `Your withdrawal request of ${formatCurrency(amount)} has been submitted. Reference: ${reference}`,
            type: 'success'
        });
        setShowSuccessPopup(true);

        setIsProcessing(false);
        setSubmitting(false);
    };

    const handleNewWithdrawal = () => {
        setStep(1);
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

    // Navigation between steps
    const goToNextStep = () => {
        if (step < 3) setStep(step + 1);
    };

    const goToPrevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    // Step indicators
    const StepIndicator = () => (
        <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
                <div
                    key={s}
                    className={`flex items-center ${s < 3 ? 'flex-1 max-w-24' : ''}`}
                >
                    <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 cursor-pointer ${step >= s
                            ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                            : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                            }`}
                        onClick={() => s < step && setStep(s)}
                    >
                        {step > s ? <Check className="h-5 w-5" /> : s}
                    </div>
                    {s < 3 && (
                        <div
                            className={`flex-1 h-1 mx-2 rounded-full transition-all duration-300 ${step > s ? 'bg-teal-600' : 'bg-gray-200'
                                }`}
                        />
                    )}
                </div>
            ))}
        </div>
    );

    // Initial values for the form
    const initialValues = {
        accountName: '',
        chapaEmail: '',
        phoneNumber: '',
        notes: ''
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-lg">
                                    <TrendingDown className="h-6 w-6 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">Withdraw Funds</h1>
                            </div>
                            <p className="text-gray-600">Withdraw money from your system wallet via Chapa</p>
                        </div>
                        {step > 1 && !withdrawalComplete && (
                            <ReusableButton
                                onClick={goToPrevStep}
                                label="Back"
                                variant="secondary"
                                icon={ArrowLeft}
                                className="w-full sm:w-auto"
                            />
                        )}
                    </div>
                </motion.div>

                {/* Available Balance Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-5 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl border border-teal-200 shadow-sm"
                >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-md">
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

                {/* Step Indicators */}
                {!withdrawalComplete && <StepIndicator />}

                {/* Step 1: Select Withdrawal Method (Chapa only) */}
                {step === 1 && !withdrawalComplete && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <h2 className="text-lg font-semibold text-gray-900">Select Withdrawal Method</h2>
                        <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                            <div className="group p-6 bg-white rounded-2xl border-2 border-teal-500 shadow-lg transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-teal-100 rounded-xl">
                                        <CreditCard className="h-6 w-6 text-teal-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-lg">Chapa</h3>
                                        <p className="text-sm text-gray-500">Withdraw to Chapa / Bank / Mobile Money</p>
                                    </div>
                                    <div className="ml-auto">
                                        <div className="px-2 py-1 bg-teal-100 rounded-full">
                                            <span className="text-xs font-medium text-teal-600">Recommended</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Min/Max</span>
                                        <span className="text-gray-700">{formatCurrency(chapaMethod.minAmount)} - {formatCurrency(chapaMethod.maxAmount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Fee</span>
                                        <span className="text-teal-600">{formatCurrency(chapaMethod.fee)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Processing Time</span>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3 text-gray-400" />
                                            <span className="text-gray-700 text-xs">{chapaMethod.processingTime}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 pt-3 border-t border-gray-100">
                                    <div className="flex flex-wrap gap-2">
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <Smartphone className="h-3 w-3" />
                                            <span>TeleBirr</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <Landmark className="h-3 w-3" />
                                            <span>CBE Birr</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <Building className="h-3 w-3" />
                                            <span>Bank Transfer</span>
                                        </div>
                                    </div>
                                </div>
                                <ReusableButton
                                    onClick={goToNextStep}
                                    label="Continue with Chapa"
                                    icon={ChevronRight}
                                    className="mt-4 w-full"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Step 2: Enter Amount - Flexible Buttons */}
                {step === 2 && selectedMethod && !withdrawalComplete && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-teal-100 rounded-lg">
                                    <DollarSign className="h-5 w-5 text-teal-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Enter Withdrawal Amount</h2>
                            </div>

                            {/* Flexible Amount Buttons */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Select Amount
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                                    {amountPresets.map((preset) => {
                                        const Icon = preset.icon;
                                        const isSelected = amount === preset.value;
                                        const isDisabled = preset.value > availableBalance || preset.value < selectedMethod.minAmount || preset.value > selectedMethod.maxAmount;
                                        return (
                                            <motion.button
                                                key={preset.value}
                                                whileHover={!isDisabled ? { scale: 1.02 } : {}}
                                                whileTap={!isDisabled ? { scale: 0.98 } : {}}
                                                onClick={() => !isDisabled && handleAmountSelect(preset.value)}
                                                disabled={isDisabled}
                                                className={`relative px-3 py-3 rounded-xl font-medium transition-all duration-300 flex flex-col items-center gap-1 ${isDisabled
                                                    ? 'bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                                                    : isSelected
                                                        ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-600/30'
                                                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-teal-500 hover:bg-teal-50'
                                                    }`}
                                            >
                                                <Icon className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-teal-600'}`} />
                                                <span className="text-sm">{preset.label}</span>
                                                {preset.recommended && !isDisabled && (
                                                    <span className={`absolute -top-2 -right-2 text-[8px] px-1.5 py-0.5 rounded-full ${isSelected
                                                        ? 'bg-yellow-400 text-gray-900'
                                                        : 'bg-amber-100 text-amber-700'
                                                        }`}>
                                                        Best
                                                    </span>
                                                )}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Custom Amount Input */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Or Enter Custom Amount
                                </label>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative flex-1">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">ETB</span>
                                        <input
                                            type="number"
                                            value={customAmount}
                                            onChange={(e) => setCustomAmount(e.target.value)}
                                            placeholder="Enter amount"
                                            className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                                        className="w-full sm:w-auto"
                                    />
                                </div>
                            </div>

                            {/* Withdrawal Summary */}
                            <div className="p-5 bg-teal-50 rounded-xl">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Receipt className="h-4 w-4" />
                                    Withdrawal Summary
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center pb-2 border-b border-teal-200">
                                        <span className="text-gray-600">Withdrawal Method</span>
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="h-4 w-4 text-teal-600" />
                                            <span className="font-medium text-gray-900">{selectedMethod.name}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Withdrawal Amount</span>
                                        <span className="font-medium text-gray-900">{amount > 0 ? formatCurrency(amount) : 'Not selected'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Processing Fee</span>
                                        <span className="font-medium text-teal-600">{formatCurrency(selectedMethod.fee)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-teal-200">
                                        <span className="font-semibold text-gray-900">Total Deduction</span>
                                        <span className="text-xl font-bold text-teal-600">
                                            {amount > 0 ? formatCurrency(amount + selectedMethod.fee) : 'ETB 0'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">You'll Receive</span>
                                        <span className="text-lg font-bold text-green-600">
                                            {amount > 0 ? formatCurrency(amount) : 'ETB 0'}
                                        </span>
                                    </div>
                                    {amount > 0 && (
                                        <div className="flex justify-between items-center pt-2 border-t border-teal-200">
                                            <span className="text-gray-600">Balance After Withdrawal</span>
                                            <span className="text-gray-700">{formatCurrency(availableBalance - amount - selectedMethod.fee)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                <ReusableButton
                                    onClick={goToPrevStep}
                                    label="Back"
                                    variant="secondary"
                                    className="flex-1"
                                />
                                <ReusableButton
                                    onClick={goToNextStep}
                                    label="Continue to Account Details"
                                    icon={ChevronRight}
                                    className="flex-1"
                                    disabled={amount === 0}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Step 3: Account Details & Confirmation */}
                {step === 3 && selectedMethod && !withdrawalComplete && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        {/* Chapa Info */}
                        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-6 border border-teal-200">
                            <div className="flex items-center gap-3 mb-4">
                                <CreditCard className="h-6 w-6 text-teal-600" />
                                <h3 className="text-lg font-semibold text-gray-900">Chapa Secure Withdrawal</h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                                Your withdrawal will be processed through Chapa's secure platform.
                                Funds will be sent to your linked:
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg">
                                    <CreditCard className="h-4 w-4 text-teal-600" />
                                    <span className="text-sm">Chapa Account</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg">
                                    <Smartphone className="h-4 w-4 text-teal-600" />
                                    <span className="text-sm">TeleBirr</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg">
                                    <Landmark className="h-4 w-4 text-teal-600" />
                                    <span className="text-sm">CBE Birr</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg">
                                    <Building className="h-4 w-4 text-teal-600" />
                                    <span className="text-sm">Bank Transfer</span>
                                </div>
                            </div>
                        </div>

                        {/* Withdrawal Form */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-teal-100 rounded-lg">
                                    <FileText className="h-5 w-5 text-teal-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Account Details</h2>
                            </div>

                            <ReusableForm
                                id="withdrawal-form"
                                fields={formFields}
                                onSubmit={handleSubmit}
                                initialValues={initialValues}
                                validationSchema={withdrawalSchema}
                                render={(formik) => (
                                    <>
                                        {/* Warning Message */}
                                        <div className="mt-2 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
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

                                        {/* Summary */}
                                        <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                                            <h3 className="font-semibold text-gray-900 mb-3">Withdrawal Summary</h3>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Withdrawal Amount</span>
                                                    <span className="font-medium text-gray-900">{formatCurrency(amount)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Processing Fee</span>
                                                    <span className="text-teal-600">{formatCurrency(selectedMethod.fee)}</span>
                                                </div>
                                                <div className="flex justify-between pt-2 border-t border-gray-200">
                                                    <span className="font-semibold text-gray-900">Total to Receive</span>
                                                    <span className="text-xl font-bold text-green-600">{formatCurrency(amount)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Navigation Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                            <ReusableButton
                                                type="button"
                                                onClick={goToPrevStep}
                                                label="Back"
                                                variant="secondary"
                                                className="flex-1"
                                            />
                                            <ReusableButton
                                                type="submit"
                                                label={isProcessing ? "Processing..." : "Confirm Withdrawal"}
                                                disabled={isProcessing || !formik.isValid || !formik.dirty}
                                                className="flex-1"
                                                icon={isProcessing ? Loader2 : Lock}
                                                isLoading={isProcessing}
                                            />
                                        </div>

                                        <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center gap-2 text-xs text-gray-500">
                                            <Shield className="h-4 w-4 text-green-600" />
                                            Your withdrawal is secure and encrypted. We use 256-bit SSL encryption.
                                        </div>
                                    </>
                                )}
                            />
                        </div>
                    </motion.div>
                )}

                {/* Success Screen */}
                {withdrawalComplete && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl p-8 text-center shadow-xl"
                    >
                        <div className="w-20 h-20 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <CheckCircle className="h-10 w-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Withdrawal Request Submitted!</h2>
                        <p className="text-gray-600 mb-6">
                            Your withdrawal request has been received and is being processed.
                        </p>
                        <div className="bg-gray-50 rounded-xl p-5 mb-6">
                            <p className="text-sm text-gray-500 mb-1">Reference Number</p>
                            <p className="text-lg font-mono font-bold text-teal-600">{withdrawalReference}</p>
                            <button
                                onClick={() => copyToClipboard(withdrawalReference)}
                                className="mt-2 text-sm text-teal-600 hover:underline flex items-center justify-center gap-1"
                            >
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                {copied ? 'Copied!' : 'Copy Reference'}
                            </button>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <ReusableButton
                                onClick={handleNewWithdrawal}
                                label="Make Another Withdrawal"
                                className="flex-1"
                            />
                            <ReusableButton
                                onClick={() => window.location.href = '/admin/wallet/balance'}
                                label="View Wallet"
                                variant="secondary"
                                className="flex-1"
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