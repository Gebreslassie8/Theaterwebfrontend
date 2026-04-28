// src/pages/Admin/wallet/DepositFunds.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Banknote,
    ArrowLeft,
    CreditCard,
    Shield,
    Lock,
    CheckCircle,
    AlertCircle,
    FileText,
    DollarSign,
    Copy,
    Check,
    Smartphone,
    Building,
    Landmark,
    ChevronRight,
    ChevronLeft,
    Loader2,
    TrendingUp,
    Wallet,
    Sparkles
} from 'lucide-react';
import * as Yup from 'yup';
import ReusableForm from '../Reusable/ReusableForm';
import ReusableButton from '../Reusable/ReusableButton';
import SuccessPopup from '../Reusable/SuccessPopup';

// Types
interface DepositMethod {
    id: string;
    name: string;
    icon: React.ElementType;
    description: string;
    minAmount: number;
    maxAmount: number;
    fee: number;
    processingTime: string;
}

// Amount preset options with display formatting
const amountPresets = [
    { value: 500, label: 'ETB 500', icon: Wallet, recommended: false },
    { value: 1000, label: 'ETB 1,000', icon: Wallet, recommended: false },
    { value: 2000, label: 'ETB 2,000', icon: Wallet, recommended: false },
    { value: 5000, label: 'ETB 5,000', icon: Wallet, recommended: true },
    { value: 10000, label: 'ETB 10,000', icon: TrendingUp, recommended: false },
    { value: 20000, label: 'ETB 20,000', icon: TrendingUp, recommended: false },
    { value: 50000, label: 'ETB 50,000', icon: Sparkles, recommended: false }
];

// Validation Schema
const depositSchema = Yup.object({
    customerName: Yup.string()
        .required('Full name is required')
        .min(3, 'Name must be at least 3 characters')
        .max(50, 'Name must be at most 50 characters'),
    customerEmail: Yup.string()
        .required('Email is required')
        .email('Please enter a valid email address'),
    customerPhone: Yup.string()
        .required('Phone number is required')
        .matches(/^[0-9+\-\s()]{10,15}$/, 'Please enter a valid phone number'),
    reference: Yup.string(),
    notes: Yup.string().max(500, 'Notes cannot exceed 500 characters')
});

// Chapa Payment Method Only
const chapaMethod: DepositMethod = {
    id: 'chapa',
    name: 'Chapa',
    icon: CreditCard,
    description: 'Card / Bank Transfer / Mobile Money',
    minAmount: 100,
    maxAmount: 100000,
    fee: 0,
    processingTime: 'Instant'
};

const DepositFunds: React.FC = () => {
    const [step, setStep] = useState(1);
    const [selectedMethod] = useState<DepositMethod>(chapaMethod);
    const [amount, setAmount] = useState<number>(0);
    const [customAmount, setCustomAmount] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [depositComplete, setDepositComplete] = useState(false);
    const [depositReference, setDepositReference] = useState('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });
    const [copied, setCopied] = useState(false);
    const [chapaCheckoutUrl, setChapaCheckoutUrl] = useState('');

    // Form fields for ReusableForm
    const formFields = [
        {
            name: 'customerName',
            type: 'text' as const,
            label: 'Full Name',
            placeholder: 'Enter your full name'
        },
        {
            name: 'customerEmail',
            type: 'email' as const,
            label: 'Email Address',
            placeholder: 'Enter your email address'
        },
        {
            name: 'customerPhone',
            type: 'text' as const,
            label: 'Phone Number',
            placeholder: 'Enter your phone number'
        },
        {
            name: 'reference',
            type: 'text' as const,
            label: 'Reference Number',
            placeholder: 'Transaction reference (if any)'
        },
        {
            name: 'notes',
            type: 'text' as const,
            label: 'Notes (Optional)',
            placeholder: 'Any additional information'
        }
    ];

    const handleAmountSelect = (selectedAmount: number) => {
        setAmount(selectedAmount);
        setCustomAmount('');
        setStep(3);
    };

    const handleCustomAmount = () => {
        const custom = parseFloat(customAmount);
        if (custom && selectedMethod && custom >= selectedMethod.minAmount && custom <= selectedMethod.maxAmount) {
            setAmount(custom);
            setStep(3);
        } else {
            alert(`Please enter an amount between ${selectedMethod?.minAmount} and ${selectedMethod?.maxAmount}`);
        }
    };

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        setIsProcessing(true);

        // Simulate Chapa API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        const reference = `CHAPA-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

        // Simulate Chapa checkout URL
        const checkoutUrl = `https://checkout.chapa.co/checkout/${reference}`;
        setChapaCheckoutUrl(checkoutUrl);
        setDepositReference(reference);
        setDepositComplete(true);

        setPopupMessage({
            title: 'Redirecting to Chapa!',
            message: `You will be redirected to Chapa to complete your payment of ${formatCurrency(amount)}.`,
            type: 'success'
        });
        setShowSuccessPopup(true);

        setIsProcessing(false);
        setSubmitting(false);
    };

    const handleNewDeposit = () => {
        setStep(1);
        setAmount(0);
        setCustomAmount('');
        setDepositComplete(false);
        setChapaCheckoutUrl('');
        setCopied(false);
    };

    const handleChapaPayment = () => {
        if (chapaCheckoutUrl) {
            window.open(chapaCheckoutUrl, '_blank');
        }
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

    // Initial values for the form
    const initialValues = {
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        reference: '',
        notes: ''
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
                                ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
                                : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                            }`}
                        onClick={() => s < step && setStep(s)}
                    >
                        {step > s ? <Check className="h-5 w-5" /> : s}
                    </div>
                    {s < 3 && (
                        <div
                            className={`flex-1 h-1 mx-2 rounded-full transition-all duration-300 ${step > s ? 'bg-green-600' : 'bg-gray-200'
                                }`}
                        />
                    )}
                </div>
            ))}
        </div>
    );

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
                                <div className="p-2 bg-green-100 rounded-xl">
                                    <Banknote className="h-6 w-6 text-green-600" />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">Deposit Funds</h1>
                            </div>
                            <p className="text-gray-600">Add money to your system wallet via Chapa</p>
                        </div>
                        {step > 1 && !depositComplete && (
                            <ReusableButton
                                onClick={goToPrevStep}
                                label="Back"
                                variant="secondary"
                                icon={ChevronLeft}
                                className="w-full sm:w-auto"
                            />
                        )}
                    </div>
                </motion.div>

                {/* Step Indicators */}
                {!depositComplete && <StepIndicator />}

                {/* Step 1: Payment Method (Chapa only) */}
                {step === 1 && !depositComplete && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <h2 className="text-lg font-semibold text-gray-900">Select Payment Method</h2>
                        <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                            <div className="group p-6 bg-white rounded-2xl border-2 border-green-500 shadow-lg transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-green-100 rounded-xl">
                                        <CreditCard className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-lg">Chapa</h3>
                                        <p className="text-sm text-gray-500">Card / Bank Transfer / Mobile Money</p>
                                    </div>
                                    <div className="ml-auto">
                                        <div className="px-2 py-1 bg-green-100 rounded-full">
                                            <span className="text-xs font-medium text-green-600">Recommended</span>
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
                                        <span className="text-green-600">{formatCurrency(chapaMethod.fee)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Processing Time</span>
                                        <span className="text-gray-700">{chapaMethod.processingTime}</span>
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
                {step === 2 && selectedMethod && !depositComplete && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <DollarSign className="h-5 w-5 text-green-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Enter Deposit Amount</h2>
                            </div>

                            {/* Flexible Amount Buttons - 7 buttons in responsive grid */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Select Amount
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                                    {amountPresets.map((preset) => {
                                        const Icon = preset.icon;
                                        const isSelected = amount === preset.value;
                                        return (
                                            <motion.button
                                                key={preset.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleAmountSelect(preset.value)}
                                                className={`relative px-3 py-3 rounded-xl font-medium transition-all duration-300 flex flex-col items-center gap-1 ${isSelected
                                                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-600/30'
                                                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-green-500 hover:bg-green-50'
                                                    }`}
                                            >
                                                <Icon className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-green-600'}`} />
                                                <span className="text-sm">{preset.label}</span>
                                                {preset.recommended && (
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
                                            className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                    <ReusableButton
                                        onClick={handleCustomAmount}
                                        label="Continue"
                                        className="w-full sm:w-auto"
                                    />
                                </div>
                            </div>

                            {/* Deposit Summary */}
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">Deposit Amount</span>
                                    <span className="text-lg font-bold text-gray-900">
                                        {amount > 0 ? formatCurrency(amount) : 'Not selected'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">Processing Fee</span>
                                    <span className="text-green-600">{formatCurrency(selectedMethod.fee)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                    <span className="font-semibold text-gray-900">Total to Pay</span>
                                    <span className="text-xl font-bold text-green-600">
                                        {amount > 0 ? formatCurrency(amount + selectedMethod.fee) : 'ETB 0'}
                                    </span>
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
                                    label="Continue to Payment"
                                    icon={ChevronRight}
                                    className="flex-1"
                                    disabled={amount === 0}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Step 3: Payment Details & Confirmation */}
                {step === 3 && selectedMethod && !depositComplete && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        {/* Chapa Info */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                            <div className="flex items-center gap-3 mb-4">
                                <CreditCard className="h-6 w-6 text-green-600" />
                                <h3 className="text-lg font-semibold text-gray-900">Chapa Secure Payment</h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                                You will be redirected to Chapa's secure payment page to complete your transaction.
                                Chapa accepts:
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg">
                                    <CreditCard className="h-4 w-4 text-green-600" />
                                    <span className="text-sm">Cards</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg">
                                    <Smartphone className="h-4 w-4 text-green-600" />
                                    <span className="text-sm">TeleBirr</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg">
                                    <Landmark className="h-4 w-4 text-green-600" />
                                    <span className="text-sm">CBE Birr</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg">
                                    <Building className="h-4 w-4 text-green-600" />
                                    <span className="text-sm">Bank Transfer</span>
                                </div>
                            </div>
                        </div>

                        {/* Deposit Form */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <FileText className="h-5 w-5 text-green-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Deposit Information</h2>
                            </div>

                            <ReusableForm
                                id="deposit-form"
                                fields={formFields}
                                onSubmit={handleSubmit}
                                initialValues={initialValues}
                                validationSchema={depositSchema}
                                render={(formik) => (
                                    <>
                                        {/* Summary */}
                                        <div className="mt-2 p-4 bg-gray-50 rounded-xl">
                                            <h3 className="font-semibold text-gray-900 mb-3">Deposit Summary</h3>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Payment Method</span>
                                                    <span className="font-medium text-gray-900">Chapa</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Deposit Amount</span>
                                                    <span className="font-medium text-gray-900">{formatCurrency(amount)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Fee</span>
                                                    <span className="text-green-600">{formatCurrency(selectedMethod.fee)}</span>
                                                </div>
                                                <div className="flex justify-between pt-2 border-t border-gray-200">
                                                    <span className="font-semibold text-gray-900">Total</span>
                                                    <span className="text-xl font-bold text-green-600">{formatCurrency(amount + selectedMethod.fee)}</span>
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
                                                label={isProcessing ? "Processing..." : "Proceed to Chapa Payment"}
                                                disabled={isProcessing || !formik.isValid || !formik.dirty}
                                                className="flex-1"
                                                icon={isProcessing ? Loader2 : undefined}
                                                isLoading={isProcessing}
                                            />
                                        </div>

                                        <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center gap-2 text-xs text-gray-500">
                                            <Shield className="h-4 w-4 text-green-600" />
                                            Your transaction is secured by Chapa's enterprise-grade security
                                        </div>
                                    </>
                                )}
                            />
                        </div>
                    </motion.div>
                )}

                {/* Success Screen */}
                {depositComplete && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl p-8 text-center shadow-xl"
                    >
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="h-10 w-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Redirecting to Chapa</h2>
                        <p className="text-gray-600 mb-6">
                            You will be redirected to Chapa's secure payment page to complete your payment.
                        </p>
                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                            <p className="text-sm text-gray-500">Reference Number</p>
                            <p className="text-lg font-mono font-bold text-green-600">{depositReference}</p>
                            <button
                                onClick={() => copyToClipboard(depositReference)}
                                className="mt-2 text-sm text-green-600 hover:underline flex items-center justify-center gap-1"
                            >
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                {copied ? 'Copied!' : 'Copy Reference'}
                            </button>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <ReusableButton
                                onClick={handleChapaPayment}
                                label="Pay with Chapa"
                                className="flex-1"
                                icon={CreditCard}
                            />
                            <ReusableButton
                                onClick={handleNewDeposit}
                                label="Make Another Deposit"
                                variant="secondary"
                                className="flex-1"
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-4">
                            After completing payment, funds will be credited to your wallet automatically
                        </p>
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

export default DepositFunds;