// src/pages/Admin/wallet/DepositFunds.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Banknote,
    ArrowLeft,
    CreditCard,
    Smartphone,
    Landmark,
    Building,
    Shield,
    Lock,
    CheckCircle,
    AlertCircle,
    Upload,
    FileText,
    DollarSign,
    Copy,
    Check
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
    supportedBanks?: string[];
}

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

// Payment Methods
const depositMethods: DepositMethod[] = [
    {
        id: 'chapa',
        name: 'Chapa',
        icon: CreditCard,
        description: 'Card / Bank Transfer',
        minAmount: 100,
        maxAmount: 100000,
        fee: 0,
        processingTime: 'Instant'
    },
    {
        id: 'telebirr',
        name: 'TeleBirr',
        icon: Smartphone,
        description: 'Mobile Money',
        minAmount: 50,
        maxAmount: 50000,
        fee: 0,
        processingTime: 'Instant'
    },
    {
        id: 'cbebirr',
        name: 'CBE Birr',
        icon: Landmark,
        description: 'CBE Mobile Banking',
        minAmount: 100,
        maxAmount: 75000,
        fee: 0,
        processingTime: 'Instant'
    },
    {
        id: 'hellocash',
        name: 'HelloCash',
        icon: Smartphone,
        description: 'HelloCash Mobile',
        minAmount: 50,
        maxAmount: 30000,
        fee: 0,
        processingTime: 'Instant'
    },
    {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        icon: Building,
        description: 'Direct Bank Transfer',
        minAmount: 1000,
        maxAmount: 500000,
        fee: 0,
        processingTime: '1-2 Business Days',
        supportedBanks: ['Commercial Bank of Ethiopia', 'Dashen Bank', 'Awash Bank', 'United Bank', 'Zemen Bank']
    }
];

const DepositFunds: React.FC = () => {
    const [step, setStep] = useState(1);
    const [selectedMethod, setSelectedMethod] = useState<DepositMethod | null>(null);
    const [amount, setAmount] = useState<number>(0);
    const [customAmount, setCustomAmount] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [depositComplete, setDepositComplete] = useState(false);
    const [depositReference, setDepositReference] = useState('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });
    const [copied, setCopied] = useState(false);
    const [receiptFile, setReceiptFile] = useState<File | null>(null);

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

    const amountOptions = [500, 1000, 2000, 5000, 10000, 20000, 50000];

    const handleMethodSelect = (method: DepositMethod) => {
        setSelectedMethod(method);
        setStep(2);
    };

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

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }
            setReceiptFile(file);
        }
    };

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        setIsProcessing(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        const reference = `DEP-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        setDepositReference(reference);
        setDepositComplete(true);

        setPopupMessage({
            title: 'Deposit Initiated!',
            message: `Your deposit of ${formatCurrency(amount)} via ${selectedMethod?.name} has been initiated. Reference: ${reference}`,
            type: 'success'
        });
        setShowSuccessPopup(true);

        setIsProcessing(false);
        setSubmitting(false);
    };

    const handleNewDeposit = () => {
        setStep(1);
        setSelectedMethod(null);
        setAmount(0);
        setCustomAmount('');
        setDepositComplete(false);
        setReceiptFile(null);
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

    const getBankAccountDetails = () => {
        return {
            bankName: 'Commercial Bank of Ethiopia',
            accountName: 'TheaterHUB PLC',
            accountNumber: '1000134567890',
            branch: 'Bole Branch',
            swiftCode: 'CBETETAA'
        };
    };

    // Initial values for the form
    const initialValues = {
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        reference: '',
        notes: ''
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-green-100 rounded-xl">
                                    <Banknote className="h-6 w-6 text-green-600" />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">Deposit Funds</h1>
                            </div>
                            <p className="text-gray-600">Add money to your system wallet</p>
                        </div>
                        {step > 1 && !depositComplete && (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* Step 1: Select Payment Method */}
                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <h2 className="text-lg font-semibold text-gray-900">Select Payment Method</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {depositMethods.map((method) => {
                                const Icon = method.icon;
                                return (
                                    <button
                                        key={method.id}
                                        onClick={() => handleMethodSelect(method)}
                                        className="group p-5 bg-white rounded-2xl border-2 border-gray-200 hover:border-green-500 hover:shadow-lg transition-all duration-300 text-left"
                                    >
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="p-3 bg-gray-100 rounded-xl group-hover:bg-green-100 transition-colors">
                                                <Icon className="h-6 w-6 text-gray-600 group-hover:text-green-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{method.name}</h3>
                                                <p className="text-xs text-gray-500">{method.description}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-1 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Min/Max</span>
                                                <span className="text-gray-700">{formatCurrency(method.minAmount)} - {formatCurrency(method.maxAmount)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Fee</span>
                                                <span className="text-green-600">{formatCurrency(method.fee)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Processing Time</span>
                                                <span className="text-gray-700">{method.processingTime}</span>
                                            </div>
                                        </div>
                                    </button>
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
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <DollarSign className="h-5 w-5 text-green-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Enter Deposit Amount</h2>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Amount</label>
                                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-4">
                                    {amountOptions.map((amt) => (
                                        <button
                                            key={amt}
                                            onClick={() => handleAmountSelect(amt)}
                                            className="px-4 py-2 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-gray-700 font-medium"
                                        >
                                            {formatCurrency(amt)}
                                        </button>
                                    ))}
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
                                            className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                    <ReusableButton
                                        onClick={handleCustomAmount}
                                        label="Continue"
                                        className="px-6 py-2.5"
                                    />
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-xl">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">Deposit Amount</span>
                                    <span className="text-lg font-bold text-gray-900">{formatCurrency(amount)}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">Processing Fee</span>
                                    <span className="text-green-600">{formatCurrency(selectedMethod.fee)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                    <span className="font-semibold text-gray-900">Total to Pay</span>
                                    <span className="text-xl font-bold text-green-600">{formatCurrency(amount + selectedMethod.fee)}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Step 3: Payment Details & Confirmation */}
                {step === 3 && selectedMethod && !depositComplete && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Bank Transfer Details (if applicable) */}
                        {selectedMethod.id === 'bank_transfer' && (
                            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <Building className="h-6 w-6 text-blue-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Bank Transfer Details</h3>
                                </div>
                                <div className="space-y-3">
                                    {Object.entries(getBankAccountDetails()).map(([key, value]) => (
                                        <div key={key} className="flex justify-between items-center p-3 bg-white rounded-lg">
                                            <span className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-gray-900">{value}</span>
                                                <button
                                                    onClick={() => copyToClipboard(value)}
                                                    className="p-1 hover:bg-gray-100 rounded transition"
                                                >
                                                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-gray-400" />}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                                    <p className="text-sm text-yellow-800 flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4" />
                                        Please use your reference number when making the transfer
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Deposit Form using ReusableForm */}
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
                                        {/* File Upload for Bank Transfer */}
                                        {selectedMethod.id === 'bank_transfer' && (
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Payment Receipt</label>
                                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-500 transition cursor-pointer">
                                                    <input
                                                        type="file"
                                                        accept="image/*,.pdf"
                                                        onChange={handleFileUpload}
                                                        className="hidden"
                                                        id="receipt-upload"
                                                    />
                                                    <label htmlFor="receipt-upload" className="cursor-pointer">
                                                        <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                                                        <p className="text-sm text-gray-600">Click to upload receipt</p>
                                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, PDF up to 5MB</p>
                                                    </label>
                                                </div>
                                                {receiptFile && (
                                                    <p className="text-sm text-green-600 mt-2">✓ {receiptFile.name} uploaded</p>
                                                )}
                                            </div>
                                        )}

                                        {/* Summary */}
                                        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                                            <h3 className="font-semibold text-gray-900 mb-3">Deposit Summary</h3>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Payment Method</span>
                                                    <span className="font-medium text-gray-900">{selectedMethod.name}</span>
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

                                        {/* Submit Button */}
                                        <div className="mt-6">
                                            <ReusableButton
                                                type="submit"
                                                label={isProcessing ? "Processing..." : "Confirm Deposit"}
                                                disabled={isProcessing || !formik.isValid || !formik.dirty}
                                                className="w-full py-3"
                                                icon={isProcessing ? undefined : "Lock"}
                                            />
                                        </div>

                                        <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center gap-2 text-xs text-gray-500">
                                            <Shield className="h-4 w-4 text-green-600" />
                                            Your transaction is secure and encrypted
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
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Deposit Request Submitted!</h2>
                        <p className="text-gray-600 mb-6">
                            Your deposit request has been received and is being processed.
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
                        <div className="flex gap-3">
                            <ReusableButton
                                onClick={handleNewDeposit}
                                label="Make Another Deposit"
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

export default DepositFunds;