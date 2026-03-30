import React, { useState, useRef, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Building2,
    FileText,
    Upload,
    CheckCircle,
    XCircle,
    AlertCircle,
    ChevronRight,
    ChevronLeft,
    Award,
    Calendar,
    Clock,
    DollarSign,
    Shield,
    TrendingUp,
    User,
    Home,
    Image,
    FileCheck,
    Send,
    Loader2,
    Wallet,
    Receipt,
    ClipboardCheck,
    UserCheck,
    CalendarDays,
    Ticket,
    Star,
    Users,
    ShieldCheck,
    Coffee,
    Wifi,
    Car,
    Utensils,
    Accessibility,
    Tv,
    Volume2,
    Sofa,
    Wine,
    Cake,
    Baby,
    Gift,
    Sparkles,
    CreditCard,
    Lock,
    X
} from "lucide-react";

// ============================================
// TYPES & INTERFACES
// ============================================

interface Show {
    id: number;
    title: string;
    genre: string;
    duration: string;
    frequency: string;
    days: string[];
    startDate: string;
    endDate: string;
    ticketPrice: string;
    expectedAudience: string;
}

interface FormData {
    // Business Information
    businessName: string;
    tradeName: string;
    businessType: string;
    businessLicense: string;
    taxId: string;
    yearsInOperation: string;
    businessDescription: string;

    // Contact Information
    ownerName: string;
    ownerPosition: string;
    ownerEmail: string;
    ownerPhone: string;
    secondaryName: string;
    secondaryPosition: string;
    secondaryEmail: string;
    secondaryPhone: string;
    emergencyName: string;
    emergencyPhone: string;
    emergencyRelation: string;

    // Theater Details
    theaterName: string;
    city: string;
    region: string;
    address: string;
    totalScreens: string;
    seatingCapacity: string;
    screenTypes: string[];
    facilities: string[];
    hours: Record<string, string>;

    // Show Information
    shows: Show[];

    // Documents
    documents: Record<string, File | null>;

    // Pricing Plan
    pricingModel: string;
    payoutFrequency: string;
    expeditedEnabled: boolean;
    rentPlan: string;

    // Agreements
    acceptMarketing: boolean;
    paymentCompleted: boolean;
    paymentIntentId: string;
}

interface Errors {
    [key: string]: string;
}

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    amount: number;
    formData: FormData;
}

// ============================================
// PAYMENT MODAL COMPONENT
// ============================================

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess, amount, formData }) => {
    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");

    const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 16) value = value.slice(0, 16);
        const formatted = value.replace(/(\d{4})/g, "$1 ").trim();
        setCardNumber(formatted);
    };

    const handleExpiryChange = (e: ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 4) value = value.slice(0, 4);
        if (value.length >= 2) {
            value = value.slice(0, 2) + "/" + value.slice(2);
        }
        setExpiryDate(value);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!cardNumber || cardNumber.replace(/\s/g, "").length !== 16) {
            setError("Please enter a valid 16-digit card number");
            return;
        }
        if (!cardName.trim()) {
            setError("Please enter the name on card");
            return;
        }
        if (!expiryDate || expiryDate.length !== 5) {
            setError("Please enter a valid expiry date (MM/YY)");
            return;
        }
        if (!cvv || cvv.length < 3) {
            setError("Please enter a valid CVV");
            return;
        }

        setIsProcessing(true);
        setError("");

        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log("Payment processed for:", formData.businessName);
        console.log("Amount:", amount);

        setIsProcessing(false);
        onSuccess();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
                <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-white" />
                        <h3 className="text-lg font-bold text-white">Registration Fee</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/20 rounded-lg transition"
                    >
                        <X className="h-5 w-5 text-white" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Amount to Pay</p>
                        <p className="text-3xl font-bold text-teal-600">${amount.toLocaleString()}</p>
                        <p className="text-xs text-gray-400 mt-1">
                            One-time registration fee <span className="text-red-500 font-semibold">(NON-REFUNDABLE)</span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                Card Number
                            </label>
                            <input
                                type="text"
                                value={cardNumber}
                                onChange={handleCardNumberChange}
                                placeholder="1234 5678 9012 3456"
                                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                maxLength={19}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                Name on Card
                            </label>
                            <input
                                type="text"
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                    Expiry Date
                                </label>
                                <input
                                    type="text"
                                    value={expiryDate}
                                    onChange={handleExpiryChange}
                                    placeholder="MM/YY"
                                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    maxLength={5}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                    CVV
                                </label>
                                <input
                                    type="text"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                    placeholder="123"
                                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    maxLength={4}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4" />
                                    {error}
                                </p>
                            </div>
                        )}

                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                            <p className="text-xs text-red-800 dark:text-red-300 flex items-center gap-2">
                                <Lock className="h-3 w-3" />
                                <span className="font-semibold">IMPORTANT:</span> This payment is <span className="font-bold underline">NON-REFUNDABLE</span>. No refunds will be issued under any circumstances.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="w-full py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-semibold transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Lock className="h-4 w-4" />
                                    Pay ${amount.toLocaleString()} (Non-Refundable)
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

// ============================================
// STEP 1: BUSINESS INFORMATION
// ============================================

interface StepProps {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    errors: Errors;
    handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const BusinessInfoStep: React.FC<StepProps> = ({ formData, errors, handleInputChange }) => {
    const businessTypes = [
        "Sole Proprietorship", "Partnership", "Limited Liability Company (LLC)",
        "Corporation", "Non-Profit Organization", "Government Entity"
    ];

    const yearsOptions = ["Less than 1 year", "1-2 years", "3-5 years", "5-10 years", "10+ years"];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg">
                    <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Business Information</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tell us about your theater business</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Legal Business Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${errors.businessName ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'
                            } dark:text-white`}
                        placeholder="Grand Theater LLC"
                    />
                    <p className="text-xs text-gray-500 mt-1.5 ml-1">As it appears on your business license</p>
                    {errors.businessName && <p className="text-xs text-red-500 mt-1 ml-1">{errors.businessName}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Trade Name / DBA <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                        type="text"
                        name="tradeName"
                        value={formData.tradeName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all hover:border-teal-300 dark:bg-gray-800/50 dark:text-white"
                        placeholder="Grand Theater"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Business Type <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-800/50 dark:text-white"
                    >
                        <option value="">Select business type</option>
                        {businessTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    {errors.businessType && <p className="text-xs text-red-500 mt-1 ml-1">{errors.businessType}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Business License Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="businessLicense"
                        value={formData.businessLicense}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${errors.businessLicense ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'
                            } dark:text-white`}
                        placeholder="BL-2024-12345"
                    />
                    {errors.businessLicense && <p className="text-xs text-red-500 mt-1 ml-1">{errors.businessLicense}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Tax ID / TIN <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="taxId"
                        value={formData.taxId}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${errors.taxId ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'
                            } dark:text-white`}
                        placeholder="123456789"
                    />
                    {errors.taxId && <p className="text-xs text-red-500 mt-1 ml-1">{errors.taxId}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Years in Operation <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="yearsInOperation"
                        value={formData.yearsInOperation}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-800/50 dark:text-white"
                    >
                        <option value="">Select years</option>
                        {yearsOptions.map(years => (
                            <option key={years} value={years}>{years}</option>
                        ))}
                    </select>
                    {errors.yearsInOperation && <p className="text-xs text-red-500 mt-1 ml-1">{errors.yearsInOperation}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Business Description <span className="text-red-500">*</span>
                </label>
                <textarea
                    name="businessDescription"
                    rows={4}
                    value={formData.businessDescription}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none ${errors.businessDescription ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'
                        } dark:text-white`}
                    placeholder="Describe your theater business, history, mission, and what makes you unique..."
                />
                {errors.businessDescription && <p className="text-xs text-red-500 mt-1 ml-1">{errors.businessDescription}</p>}
            </div>
        </div>
    );
};

// ============================================
// STEP 2: CONTACT & OWNER INFORMATION
// ============================================

const ContactInfoStep: React.FC<StepProps> = ({ formData, errors, handleInputChange }) => {
    const positions = ["Owner", "Co-Owner", "General Manager", "Operations Manager", "Director", "Partner", "Other"];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg">
                    <User className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Owner & Contact Information</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Who should we contact?</p>
                </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/30 dark:to-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-5">
                    <div className="p-1.5 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                        <UserCheck className="h-4 w-4 text-teal-600" />
                    </div>
                    <h3 className="text-md font-semibold text-gray-900 dark:text-white">Primary Contact / Owner</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="ownerName"
                            value={formData.ownerName}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${errors.ownerName ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'
                                } dark:text-white`}
                            placeholder="John Doe"
                        />
                        {errors.ownerName && <p className="text-xs text-red-500 mt-1 ml-1">{errors.ownerName}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                            Position/Title <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="ownerPosition"
                            value={formData.ownerPosition}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-800/50 dark:text-white"
                        >
                            <option value="">Select position</option>
                            {positions.map(pos => (
                                <option key={pos} value={pos}>{pos}</option>
                            ))}
                        </select>
                        {errors.ownerPosition && <p className="text-xs text-red-500 mt-1 ml-1">{errors.ownerPosition}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="ownerEmail"
                            value={formData.ownerEmail}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${errors.ownerEmail ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'
                                } dark:text-white`}
                            placeholder="john@example.com"
                        />
                        {errors.ownerEmail && <p className="text-xs text-red-500 mt-1 ml-1">{errors.ownerEmail}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            name="ownerPhone"
                            value={formData.ownerPhone}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${errors.ownerPhone ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'
                                } dark:text-white`}
                            placeholder="+1 (555) 000-0000"
                        />
                        {errors.ownerPhone && <p className="text-xs text-red-500 mt-1 ml-1">{errors.ownerPhone}</p>}
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/30 dark:to-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-5">
                    <div className="p-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg">
                        <Users className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <h3 className="text-md font-semibold text-gray-900 dark:text-white">Secondary Contact <span className="text-xs text-gray-400 font-normal">(Optional)</span></h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Name
                        </label>
                        <input
                            type="text"
                            name="secondaryName"
                            value={formData.secondaryName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all hover:border-teal-300 dark:bg-gray-800/50 dark:text-white"
                            placeholder="Jane Smith"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Position
                        </label>
                        <input
                            type="text"
                            name="secondaryPosition"
                            value={formData.secondaryPosition}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all hover:border-teal-300 dark:bg-gray-800/50 dark:text-white"
                            placeholder="Operations Manager"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Email
                        </label>
                        <input
                            type="email"
                            name="secondaryEmail"
                            value={formData.secondaryEmail}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all hover:border-teal-300 dark:bg-gray-800/50 dark:text-white"
                            placeholder="jane@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Phone
                        </label>
                        <input
                            type="tel"
                            name="secondaryPhone"
                            value={formData.secondaryPhone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all hover:border-teal-300 dark:bg-gray-800/50 dark:text-white"
                            placeholder="+1 (555) 000-0001"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 rounded-2xl p-6 border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 mb-5">
                    <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </div>
                    <h3 className="text-md font-semibold text-gray-900 dark:text-white">Emergency Contact</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                            Contact Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="emergencyName"
                            value={formData.emergencyName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all hover:border-teal-300 dark:bg-gray-800/50 dark:text-white"
                            placeholder="Emergency Contact Name"
                        />
                        {errors.emergencyName && <p className="text-xs text-red-500 mt-1 ml-1">{errors.emergencyName}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            name="emergencyPhone"
                            value={formData.emergencyPhone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all hover:border-teal-300 dark:bg-gray-800/50 dark:text-white"
                            placeholder="+1 (555) 000-0002"
                        />
                        {errors.emergencyPhone && <p className="text-xs text-red-500 mt-1 ml-1">{errors.emergencyPhone}</p>}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Relationship
                        </label>
                        <input
                            type="text"
                            name="emergencyRelation"
                            value={formData.emergencyRelation}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all hover:border-teal-300 dark:bg-gray-800/50 dark:text-white"
                            placeholder="Business Partner / Family Member"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================
// STEP 3: THEATER DETAILS & FACILITIES
// ============================================

interface TheaterDetailsStepProps extends StepProps {
    handleCheckboxChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const TheaterDetailsStep: React.FC<TheaterDetailsStepProps> = ({ formData, setFormData, errors, handleInputChange, handleCheckboxChange }) => {
    const cities = [
        "Addis Ababa", "Bahir Dar", "Dire Dawa", "Hawassa", "Mekelle",
        "Gondar", "Jimma", "Harar", "Adama", "Dessie", "Arba Minch", "Jijiga"
    ];

    const regions = [
        "Addis Ababa", "Oromia", "Amhara", "Tigray", "Southern Nations",
        "Somali", "Benishangul-Gumuz", "Afar", "Harari", "Gambela", "Sidama"
    ];

    const facilitiesList = [
        { icon: Car, name: "Free Parking", category: "Parking" },
        { icon: Accessibility, name: "Wheelchair Accessible", category: "Accessibility" },
        { icon: Coffee, name: "Concession Stand", category: "Food & Drink" },
        { icon: Wine, name: "Bar/Lounge", category: "Food & Drink" },
        { icon: Utensils, name: "Restaurant", category: "Food & Drink" },
        { icon: Wifi, name: "Free WiFi", category: "Technology" },
        { icon: Tv, name: "Digital Screens", category: "Technology" },
        { icon: Volume2, name: "Dolby Atmos Sound", category: "Audio/Visual" },
        { icon: Sofa, name: "VIP Lounge", category: "Seating" },
        { icon: Star, name: "Premium Seating", category: "Seating" },
        { icon: Baby, name: "Family Friendly", category: "Family" },
        { icon: Cake, name: "Birthday Packages", category: "Events" },
        { icon: Gift, name: "Gift Cards", category: "Services" },
        { icon: Sparkles, name: "Private Events", category: "Services" }
    ];

    const screenTypes = [
        "Standard", "IMAX", "4DX", "Dolby Cinema", "VIP Screen", "3D", "2D", "Drive-in"
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg">
                    <Home className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Theater Details</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tell us about your venue</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Theater Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="theaterName"
                        value={formData.theaterName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${errors.theaterName ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'
                            } dark:text-white`}
                        placeholder="Grand Theater"
                    />
                    {errors.theaterName && <p className="text-xs text-red-500 mt-1 ml-1">{errors.theaterName}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        City <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-800/50 dark:text-white"
                    >
                        <option value="">Select city</option>
                        {cities.map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                    {errors.city && <p className="text-xs text-red-500 mt-1 ml-1">{errors.city}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Region <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="region"
                        value={formData.region}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-800/50 dark:text-white"
                    >
                        <option value="">Select region</option>
                        {regions.map(region => (
                            <option key={region} value={region}>{region}</option>
                        ))}
                    </select>
                    {errors.region && <p className="text-xs text-red-500 mt-1 ml-1">{errors.region}</p>}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Full Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${errors.address ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'
                            } dark:text-white`}
                        placeholder="123 Bole Road, Addis Ababa"
                    />
                    {errors.address && <p className="text-xs text-red-500 mt-1 ml-1">{errors.address}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Number of Screens <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="totalScreens"
                        value={formData.totalScreens}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${errors.totalScreens ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'
                            } dark:text-white`}
                        placeholder="3"
                        min="1"
                    />
                    {errors.totalScreens && <p className="text-xs text-red-500 mt-1 ml-1">{errors.totalScreens}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Total Seating Capacity <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="seatingCapacity"
                        value={formData.seatingCapacity}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${errors.seatingCapacity ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'
                            } dark:text-white`}
                        placeholder="500"
                        min="1"
                    />
                    {errors.seatingCapacity && <p className="text-xs text-red-500 mt-1 ml-1">{errors.seatingCapacity}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Screen Types Available
                    </label>
                    <select
                        multiple
                        value={formData.screenTypes || []}
                        onChange={(e) => {
                            const options = Array.from(e.target.selectedOptions, option => option.value);
                            setFormData(prev => ({ ...prev, screenTypes: options }));
                        }}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-800/50 dark:text-white"
                        size={3}
                    >
                        {screenTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1.5 ml-1">Hold Ctrl/Cmd to select multiple</p>
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Facilities & Amenities
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {facilitiesList.map((facility, idx) => {
                        const Icon = facility.icon;
                        const isChecked = formData.facilities?.includes(facility.name);
                        return (
                            <label
                                key={idx}
                                className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${isChecked
                                    ? 'border-teal-500 bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-900/10'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    value={facility.name}
                                    checked={isChecked}
                                    onChange={handleCheckboxChange}
                                    className="hidden"
                                />
                                <Icon className={`h-4 w-4 ${isChecked ? 'text-teal-600' : 'text-gray-400'}`} />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{facility.name}</span>
                            </label>
                        );
                    })}
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Operating Hours
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                        <div key={day} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800/30 rounded-xl">
                            <span className="w-24 text-sm font-medium text-gray-600 dark:text-gray-400">{day}</span>
                            <input
                                type="time"
                                name={`hours_${day}_open`}
                                value={formData.hours?.[`${day}_open`] || ""}
                                onChange={handleInputChange}
                                className="px-3 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-800/50 dark:text-white"
                            />
                            <span className="text-gray-500">to</span>
                            <input
                                type="time"
                                name={`hours_${day}_close`}
                                value={formData.hours?.[`${day}_close`] || ""}
                                onChange={handleInputChange}
                                className="px-3 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-800/50 dark:text-white"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ============================================
// STEP 4: SHOW & PERFORMANCE INFORMATION
// ============================================

const ShowInfoStep: React.FC<StepProps> = ({ formData, setFormData }) => {
    const addShow = () => {
        const newShow: Show = {
            id: Date.now(),
            title: "",
            genre: "",
            duration: "",
            frequency: "Weekly",
            days: [],
            startDate: "",
            endDate: "",
            ticketPrice: "",
            expectedAudience: ""
        };
        setFormData(prev => ({
            ...prev,
            shows: [...(prev.shows || []), newShow]
        }));
    };

    const removeShow = (id: number) => {
        const updatedShows = formData.shows.filter(show => show.id !== id);
        setFormData(prev => ({ ...prev, shows: updatedShows }));
    };

    const updateShow = (id: number, field: keyof Show, value: string | string[]) => {
        const updatedShows = formData.shows.map(show =>
            show.id === id ? { ...show, [field]: value } : show
        );
        setFormData(prev => ({ ...prev, shows: updatedShows }));
    };

    const performanceGenres = [
        "Musical", "Play", "Drama", "Comedy", "Tragedy", "Ballet", "Opera",
        "Concert", "Stand-up Comedy", "Improv", "Children's Theatre", "Experimental"
    ];

    const frequencies = ["Daily", "Weekly", "Bi-Weekly", "Monthly", "Seasonal", "Special Event"];
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg">
                        <Ticket className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Show & Performance Information</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Tell us about your upcoming shows</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={addShow}
                    className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl text-sm font-medium hover:from-teal-700 hover:to-teal-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                    + Add Show
                </button>
            </div>

            {(!formData.shows || formData.shows.length === 0) && (
                <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/30 dark:to-gray-800/50 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                    <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No shows added yet</p>
                    <p className="text-sm text-gray-400 mt-1">Click "Add Show" to list your upcoming performances</p>
                </div>
            )}

            {formData.shows?.map((show, index) => (
                <div key={show.id} className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-6 relative bg-white dark:bg-gray-800/30 hover:shadow-lg transition-all">
                    <button
                        type="button"
                        onClick={() => removeShow(show.id)}
                        className="absolute top-4 right-4 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                    >
                        <XCircle className="h-5 w-5 text-red-500" />
                    </button>

                    <div className="flex items-center gap-2 mb-5">
                        <div className="h-8 w-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                            <span className="text-teal-600 font-bold text-sm">{index + 1}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Show #{index + 1}</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                Show Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={show.title}
                                onChange={(e) => updateShow(show.id, "title", e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all hover:border-teal-300 dark:bg-gray-800/50 dark:text-white"
                                placeholder="Hamilton, The Lion King, etc."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Genre / Type
                            </label>
                            <select
                                value={show.genre}
                                onChange={(e) => updateShow(show.id, "genre", e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-800/50 dark:text-white"
                            >
                                <option value="">Select genre</option>
                                {performanceGenres.map(genre => (
                                    <option key={genre} value={genre}>{genre}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Duration (minutes)
                            </label>
                            <input
                                type="number"
                                value={show.duration}
                                onChange={(e) => updateShow(show.id, "duration", e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all hover:border-teal-300 dark:bg-gray-800/50 dark:text-white"
                                placeholder="120"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Performance Frequency
                            </label>
                            <select
                                value={show.frequency}
                                onChange={(e) => updateShow(show.id, "frequency", e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-800/50 dark:text-white"
                            >
                                {frequencies.map(freq => (
                                    <option key={freq} value={freq}>{freq}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Performance Days
                            </label>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {daysOfWeek.map(day => (
                                    <label key={day} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-teal-300 cursor-pointer transition-all">
                                        <input
                                            type="checkbox"
                                            checked={show.days?.includes(day)}
                                            onChange={(e) => {
                                                const currentDays = show.days || [];
                                                const newDays = e.target.checked
                                                    ? [...currentDays, day]
                                                    : currentDays.filter(d => d !== day);
                                                updateShow(show.id, "days", newDays);
                                            }}
                                            className="h-4 w-4 text-teal-600 rounded"
                                        />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{day.slice(0, 3)}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={show.startDate}
                                onChange={(e) => updateShow(show.id, "startDate", e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all hover:border-teal-300 dark:bg-gray-800/50 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                End Date
                            </label>
                            <input
                                type="date"
                                value={show.endDate}
                                onChange={(e) => updateShow(show.id, "endDate", e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all hover:border-teal-300 dark:bg-gray-800/50 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Ticket Price Range
                            </label>
                            <input
                                type="text"
                                value={show.ticketPrice}
                                onChange={(e) => updateShow(show.id, "ticketPrice", e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all hover:border-teal-300 dark:bg-gray-800/50 dark:text-white"
                                placeholder="$25 - $75"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Expected Audience Size
                            </label>
                            <input
                                type="text"
                                value={show.expectedAudience}
                                onChange={(e) => updateShow(show.id, "expectedAudience", e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all hover:border-teal-300 dark:bg-gray-800/50 dark:text-white"
                                placeholder="200-300 per show"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// ============================================
// STEP 5: DOCUMENT UPLOAD
// ============================================

interface DocumentUploadStepProps {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    errors: Errors;
    handleFileUpload: (e: ChangeEvent<HTMLInputElement>, docType: string) => void;
    fileInputRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
}

const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({ formData, setFormData, errors, handleFileUpload, fileInputRefs }) => {
    const documents = [
        { id: "license", name: "Business License", icon: FileText, required: true, desc: "Valid business license or registration certificate" },
        { id: "taxCertificate", name: "Tax Registration Certificate", icon: Receipt, required: true, desc: "Tax Identification Number (TIN) certificate" },
        { id: "ownerId", name: "Owner ID / Passport", icon: User, required: true, desc: "Clear photo of owner's ID or passport" },
        { id: "theaterPhotos", name: "Theater Photos", icon: Image, required: false, desc: "Interior and exterior photos of your theater" },
        { id: "fireSafety", name: "Fire Safety Certificate", icon: Shield, required: false, desc: "Fire safety inspection certificate" },
        { id: "healthPermit", name: "Health Permit", icon: ShieldCheck, required: false, desc: "If you serve food/drinks" }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg">
                    <FileCheck className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Required Documents</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Upload your business documents</p>
                </div>
            </div>

            <div className="space-y-4">
                {documents.map((doc) => {
                    const Icon = doc.icon;
                    const isUploaded = formData.documents?.[doc.id];
                    const hasError = errors[doc.id];

                    return (
                        <div key={doc.id} className={`border-2 rounded-2xl p-5 transition-all ${hasError ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300'}`}>
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className={`p-2.5 rounded-xl ${isUploaded ? 'bg-green-100 dark:bg-green-900/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
                                        <Icon className={`h-5 w-5 ${isUploaded ? 'text-green-600' : 'text-gray-500'}`} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {doc.name} {doc.required && <span className="text-red-500">*</span>}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">{doc.desc}</p>
                                        {isUploaded && (
                                            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                                                <CheckCircle className="h-3 w-3" />
                                                Uploaded: {formData.documents[doc.id]?.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <input
                                        ref={el => {
                                            if (el) fileInputRefs.current[doc.id] = el;
                                        }}
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => handleFileUpload(e, doc.id)}
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRefs.current[doc.id]?.click()}
                                        className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${isUploaded
                                            ? 'border-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/10'
                                            : 'bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800 shadow-md hover:shadow-lg'
                                            }`}
                                    >
                                        <Upload className="h-4 w-4" />
                                        {isUploaded ? 'Replace File' : 'Upload Document'}
                                    </button>
                                </div>
                            </div>
                            {hasError && <p className="text-xs text-red-500 mt-3">{errors[doc.id]}</p>}
                        </div>
                    );
                })}
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-2xl p-5 border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                            Document Requirements
                        </p>
                        <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                            Please ensure all documents are clear and legible. Maximum file size: 10MB per file.
                            Accepted formats: PDF, JPG, PNG.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================
// STEP 6: PRICING PLAN SELECTION
// ============================================

const PricingPlanStep: React.FC<StepProps> = ({ formData, setFormData, errors }) => {
    const [selectedModel, setSelectedModel] = useState(formData.pricingModel || null);
    const [selectedFrequency, setSelectedFrequency] = useState(formData.payoutFrequency || null);

    const pricingModels = [
        {
            id: "commission",
            name: "Commission Only",
            description: "Pay only when you sell tickets",
            icon: DollarSign,
            rate: "5-10% per ticket",
            bestFor: "New / Low Volume Theaters",
            gradient: "from-emerald-500 to-teal-500"
        },
        {
            id: "rent",
            name: "Fixed Rent",
            description: "Fixed monthly fee, zero commission",
            icon: Building2,
            rate: "$500 - $2,000/month",
            bestFor: "High Volume / Established Theaters",
            gradient: "from-blue-500 to-indigo-500"
        },
        {
            id: "hybrid",
            name: "Hybrid Model",
            description: "Lower rent + reduced commission",
            icon: TrendingUp,
            rate: "$200-$1,000/month + 2-5% commission",
            bestFor: "Medium Volume / Growing Theaters",
            gradient: "from-purple-500 to-pink-500"
        }
    ];

    const payoutFrequencies = [
        { id: "weekly", name: "Weekly", icon: Calendar, payout: "Every Monday", commission: "8%", holdback: "5% / 30 days" },
        { id: "biweekly", name: "Bi-Weekly", icon: CalendarDays, payout: "1st & 15th", commission: "7.5%", holdback: "6% / 35 days" },
        { id: "monthly", name: "Monthly", icon: Clock, payout: "5th of month", commission: "7%", holdback: "7% / 40 days" },
        { id: "quarterly", name: "Quarterly", icon: Award, payout: "Jan/Apr/Jul/Oct", commission: "6%", holdback: "8% / 45 days" },
        { id: "yearly", name: "Yearly", icon: Star, payout: "January 15th", commission: "5%", holdback: "10% / 60 days" }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg">
                    <Wallet className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pricing & Payout Plan</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Choose the plan that fits your business</p>
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Select Pricing Model <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {pricingModels.map((model) => {
                        const Icon = model.icon;
                        const isSelected = selectedModel === model.id;
                        return (
                            <motion.div
                                key={model.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`cursor-pointer rounded-2xl border-2 p-5 transition-all ${isSelected
                                    ? `border-teal-500 bg-gradient-to-br ${model.gradient} bg-opacity-10 shadow-lg`
                                    : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 hover:shadow-md'
                                    }`}
                                onClick={() => {
                                    setSelectedModel(model.id);
                                    setFormData(prev => ({ ...prev, pricingModel: model.id }));
                                }}
                            >
                                <div className={`p-2 rounded-xl inline-block ${isSelected ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-800'} mb-3`}>
                                    <Icon className={`h-6 w-6 ${isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                                </div>
                                <h3 className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                                    {model.name}
                                </h3>
                                <p className={`text-sm mt-1 ${isSelected ? 'text-white/90' : 'text-gray-500'}`}>
                                    {model.description}
                                </p>
                                <p className={`text-sm font-bold mt-3 ${isSelected ? 'text-white' : 'text-teal-600'}`}>
                                    {model.rate}
                                </p>
                                <p className={`text-xs mt-1 ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                                    Best for: {model.bestFor}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
                {errors.pricingModel && <p className="text-xs text-red-500 mt-2">{errors.pricingModel}</p>}
            </div>

            {selectedModel && (
                <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Select Payout Frequency <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {payoutFrequencies.map((freq) => {
                            const Icon = freq.icon;
                            const isSelected = selectedFrequency === freq.id;
                            return (
                                <div
                                    key={freq.id}
                                    className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${isSelected
                                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 shadow-md'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                        }`}
                                    onClick={() => {
                                        setSelectedFrequency(freq.id);
                                        setFormData(prev => ({ ...prev, payoutFrequency: freq.id }));
                                    }}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <Icon className={`h-4 w-4 ${isSelected ? 'text-teal-600' : 'text-gray-400'}`} />
                                        <span className={`font-semibold ${isSelected ? 'text-teal-600' : 'text-gray-900 dark:text-white'}`}>
                                            {freq.name}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500">Payout: {freq.payout}</p>
                                    <p className="text-xs text-gray-500">Commission: {freq.commission}</p>
                                    <p className="text-xs text-gray-400">Holdback: {freq.holdback}</p>
                                </div>
                            );
                        })}
                    </div>
                    {errors.payoutFrequency && <p className="text-xs text-red-500 mt-2">{errors.payoutFrequency}</p>}
                </div>
            )}

            {selectedModel === "rent" && (
                <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Select Rent Plan <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { name: "Monthly", fee: "$800/month", savings: "0%", bestFor: "Standard", gradient: "from-gray-500 to-gray-600" },
                            { name: "Quarterly", fee: "$2,100/quarter", savings: "12.5%", bestFor: "Better value", gradient: "from-teal-500 to-emerald-500" },
                            { name: "Yearly", fee: "$7,200/year", savings: "25% (2 months free)", bestFor: "Best value", gradient: "from-purple-500 to-pink-500" }
                        ].map((plan, idx) => (
                            <div
                                key={idx}
                                className={`cursor-pointer rounded-2xl border-2 p-5 transition-all ${formData.rentPlan === plan.name
                                    ? `border-teal-500 bg-gradient-to-br ${plan.gradient} bg-opacity-10 shadow-lg`
                                    : 'border-gray-200 dark:border-gray-700 hover:border-teal-300'
                                    }`}
                                onClick={() => setFormData(prev => ({ ...prev, rentPlan: plan.name }))}
                            >
                                <h4 className={`font-bold text-lg ${formData.rentPlan === plan.name ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                                    {plan.name}
                                </h4>
                                <p className={`text-2xl font-bold mt-2 ${formData.rentPlan === plan.name ? 'text-white' : 'text-teal-600'}`}>
                                    {plan.fee}
                                </p>
                                <p className={`text-sm mt-1 ${formData.rentPlan === plan.name ? 'text-white/90' : 'text-green-600'}`}>
                                    Save {plan.savings}
                                </p>
                                <p className={`text-xs mt-2 ${formData.rentPlan === plan.name ? 'text-white/80' : 'text-gray-500'}`}>
                                    Best for: {plan.bestFor}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// ============================================
// STEP 7: TERMS & AGREEMENT
// ============================================

interface TermsStepProps {
    agreedToTerms: boolean;
    setAgreedToTerms: (value: boolean) => void;
    agreedToMarketing: boolean;
    setAgreedToMarketing: (value: boolean) => void;
    agreedToNoRefund: boolean;
    setAgreedToNoRefund: (value: boolean) => void;
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    errors: Errors;
}

const TermsStep: React.FC<TermsStepProps> = ({
    agreedToTerms,
    setAgreedToTerms,
    agreedToMarketing,
    setAgreedToMarketing,
    agreedToNoRefund,
    setAgreedToNoRefund,
    formData,
    setFormData,
    errors
}) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg">
                    <ClipboardCheck className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Terms & Agreement</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Please review and accept our terms</p>
                </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/30 dark:to-gray-800/50 rounded-2xl p-6 space-y-4 border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Theater Owner Agreement</h3>

                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-semibold text-gray-700 dark:text-gray-300">By submitting this registration, you agree to the following terms:</p>

                    <ul className="list-disc pl-5 space-y-2">
                        <li>All information provided is accurate and complete</li>
                        <li>You will comply with all local laws and regulations</li>
                        <li>Commission rates will apply as per selected pricing plan</li>
                        <li>Holdback policy applies for refunds and chargebacks</li>
                        <li>TheaterHUB reserves the right to verify submitted documents</li>
                        <li>You are authorized to represent the business</li>
                        <li>You agree to the payout terms selected</li>
                        <li>You will maintain accurate show schedules and pricing</li>
                        <li>You will honor all ticket sales processed through TheaterHUB</li>
                    </ul>

                    <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
                        <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                            <div>
                                <p className="text-amber-800 dark:text-amber-300 text-sm">
                                    <strong>Important:</strong> Your registration will be reviewed by our team within 2-3 business days.
                                    You will receive email confirmation once approved. Until approval, you will not be able to list shows or sell tickets.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800">
                        <div className="flex items-start gap-2">
                            <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                            <p className="text-red-800 dark:text-red-300 text-sm">
                                <strong>NO REFUND POLICY:</strong> The registration fee of $299 is <span className="font-bold underline">NON-REFUNDABLE</span> under any circumstances, including but not limited to application rejection, withdrawal, or any other reason.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {/* Terms and Accuracy Agreement */}
                <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-1 h-5 w-5 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                    />
                    <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-teal-600 transition">
                            I confirm that all information provided is accurate and complete
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                            I understand that providing false information may result in rejection or termination
                        </p>
                    </div>
                </label>

                {/* Marketing Agreement */}
                <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={agreedToMarketing}
                        onChange={(e) => {
                            setAgreedToMarketing(e.target.checked);
                            setFormData(prev => ({ ...prev, acceptMarketing: e.target.checked }));
                        }}
                        className="mt-1 h-5 w-5 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                    />
                    <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-teal-600 transition">
                            I agree to receive marketing communications from TheaterHUB
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                            You can unsubscribe at any time
                        </p>
                    </div>
                </label>

                {/* No Refund Agreement */}
                <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={agreedToNoRefund}
                        onChange={(e) => setAgreedToNoRefund(e.target.checked)}
                        className="mt-1 h-5 w-5 text-red-600 rounded border-red-300 focus:ring-red-500"
                    />
                    <div>
                        <p className="text-sm font-semibold text-red-600 dark:text-red-400 group-hover:text-red-700 transition">
                            I understand that the registration fee of $299 is <span className="underline">NON-REFUNDABLE</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Payment must be completed before registration submission. No refunds will be issued for any reason.
                        </p>
                    </div>
                </label>
            </div>

            {errors.terms && <p className="text-xs text-red-500 mt-2">{errors.terms}</p>}
        </div>
    );
};

// ============================================
// MAIN REGISTRATION COMPONENT
// ============================================

const TheaterRegistration: React.FC = () => {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [agreedToMarketing, setAgreedToMarketing] = useState(false);
    const [agreedToNoRefund, setAgreedToNoRefund] = useState(false);
    const [errors, setErrors] = useState<Errors>({});
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    const [formData, setFormData] = useState<FormData>({
        businessName: "",
        tradeName: "",
        businessType: "",
        businessLicense: "",
        taxId: "",
        yearsInOperation: "",
        businessDescription: "",
        ownerName: "",
        ownerPosition: "",
        ownerEmail: "",
        ownerPhone: "",
        secondaryName: "",
        secondaryPosition: "",
        secondaryEmail: "",
        secondaryPhone: "",
        emergencyName: "",
        emergencyPhone: "",
        emergencyRelation: "",
        theaterName: "",
        city: "",
        region: "",
        address: "",
        totalScreens: "",
        seatingCapacity: "",
        screenTypes: [],
        facilities: [],
        hours: {},
        shows: [],
        documents: {},
        pricingModel: "",
        payoutFrequency: "",
        expeditedEnabled: false,
        rentPlan: "",
        acceptMarketing: false,
        paymentCompleted: false,
        paymentIntentId: ""
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name.startsWith("hours_")) {
            const [, day, period] = name.split("_");
            setFormData(prev => ({
                ...prev,
                hours: {
                    ...prev.hours,
                    [`${day}_${period}`]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        if (checked) {
            setFormData(prev => ({
                ...prev,
                facilities: [...(prev.facilities || []), value]
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                facilities: (prev.facilities || []).filter(f => f !== value)
            }));
        }
    };

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>, docType: string) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, [docType]: "File size must be less than 10MB" }));
                return;
            }
            const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
            if (!validTypes.includes(file.type)) {
                setErrors(prev => ({ ...prev, [docType]: "Only JPEG, PNG, or PDF files are allowed" }));
                return;
            }
            setFormData(prev => ({
                ...prev,
                documents: { ...prev.documents, [docType]: file }
            }));
            setErrors(prev => ({ ...prev, [docType]: "" }));
        }
    };

    const handlePaymentSuccess = () => {
        setFormData(prev => ({ ...prev, paymentCompleted: true, paymentIntentId: `pi_${Date.now()}_${Math.random().toString(36).substring(7)}` }));
        setShowPaymentModal(false);
    };

    const validateStep = (): boolean => {
        const newErrors: Errors = {};

        if (step === 1) {
            if (!formData.businessName.trim()) newErrors.businessName = "Business name is required";
            if (!formData.businessType) newErrors.businessType = "Business type is required";
            if (!formData.businessLicense.trim()) newErrors.businessLicense = "Business license is required";
            if (!formData.taxId.trim()) newErrors.taxId = "Tax ID is required";
            if (!formData.yearsInOperation) newErrors.yearsInOperation = "Years in operation is required";
            if (!formData.businessDescription.trim()) newErrors.businessDescription = "Business description is required";
        } else if (step === 2) {
            if (!formData.ownerName.trim()) newErrors.ownerName = "Owner name is required";
            if (!formData.ownerPosition) newErrors.ownerPosition = "Position is required";
            if (!formData.ownerEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.ownerEmail = "Valid email is required";
            if (!formData.ownerPhone.trim()) newErrors.ownerPhone = "Phone number is required";
            if (!formData.emergencyName.trim()) newErrors.emergencyName = "Emergency contact name is required";
            if (!formData.emergencyPhone.trim()) newErrors.emergencyPhone = "Emergency phone is required";
        } else if (step === 3) {
            if (!formData.theaterName.trim()) newErrors.theaterName = "Theater name is required";
            if (!formData.city) newErrors.city = "City is required";
            if (!formData.region) newErrors.region = "Region is required";
            if (!formData.address.trim()) newErrors.address = "Address is required";
            if (!formData.totalScreens || parseInt(formData.totalScreens) < 1) newErrors.totalScreens = "Valid number of screens is required";
            if (!formData.seatingCapacity || parseInt(formData.seatingCapacity) < 1) newErrors.seatingCapacity = "Valid seating capacity is required";
        } else if (step === 4) {
            if (!formData.shows || formData.shows.length === 0) {
                newErrors.shows = "At least one show is required";
            }
        } else if (step === 5) {
            if (!formData.documents.license) newErrors.license = "Business license is required";
            if (!formData.documents.taxCertificate) newErrors.taxCertificate = "Tax certificate is required";
            if (!formData.documents.ownerId) newErrors.ownerId = "Owner ID is required";
        } else if (step === 6) {
            if (!formData.pricingModel) newErrors.pricingModel = "Please select a pricing model";
            if (!formData.payoutFrequency) newErrors.payoutFrequency = "Please select payout frequency";
        } else if (step === 7) {
            if (!agreedToTerms) newErrors.terms = "You must agree to the accuracy of information";
            if (!agreedToNoRefund) newErrors.noRefund = "You must acknowledge the no-refund policy";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep()) {
            setStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
    };

    const handleSubmit = async () => {
        if (!validateStep()) return;

        if (!formData.paymentCompleted) {
            setShowPaymentModal(true);
            return;
        }

        setIsSubmitting(true);

        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log("Registration Data:", formData);
        console.log("Payment Intent ID:", formData.paymentIntentId);
        console.log("Agreements:", { agreedToTerms, agreedToMarketing, agreedToNoRefund });

        setIsSubmitting(false);
        setSubmitSuccess(true);
    };

    const steps = [
        { number: 1, title: "Business Info", component: BusinessInfoStep },
        { number: 2, title: "Contact Info", component: ContactInfoStep },
        { number: 3, title: "Theater Details", component: TheaterDetailsStep },
        { number: 4, title: "Show Info", component: ShowInfoStep },
        { number: 5, title: "Documents", component: DocumentUploadStep },
        { number: 6, title: "Pricing Plan", component: PricingPlanStep },
        { number: 7, title: "Terms", component: TermsStep }
    ];

    const CurrentStepComponent = steps[step - 1].component;

    if (submitSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="h-20 w-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                    >
                        <CheckCircle className="h-10 w-10 text-white" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Registration & Payment Submitted!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Thank you for registering with TheaterHUB. Your payment has been processed and your application is being reviewed by our team. You'll receive an email within 2-3 business days.
                    </p>
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Application ID</p>
                        <p className="text-xl font-mono font-bold text-teal-600">TH-{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
                        <p className="text-xs text-gray-400 mt-2">Payment ID: {formData.paymentIntentId}</p>
                    </div>
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border-2 border-red-200 dark:border-red-800">
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-2">
                            <XCircle className="h-4 w-4" />
                            <span className="font-bold">IMPORTANT:</span> Registration fees are <span className="underline">NON-REFUNDABLE</span>
                        </p>
                    </div>
                    <button
                        onClick={() => window.location.href = "/"}
                        className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white py-3 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
                    >
                        Go to Homepage
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onSuccess={handlePaymentSuccess}
                amount={299}
                formData={formData}
            />

            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="inline-flex items-center justify-center h-20 w-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl mb-4 shadow-lg"
                    >
                        <Building2 className="h-10 w-10 text-white" />
                    </motion.div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 dark:from-teal-400 dark:to-teal-600 bg-clip-text text-transparent">
                        Theater Owner Registration
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Join TheaterHUB and reach thousands of theater lovers
                    </p>
                    <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-red-50 dark:bg-red-900/20 rounded-full border-2 border-red-200 dark:border-red-800">
                        <Lock className="h-3 w-3 text-red-600" />
                        <span className="text-xs text-red-600 dark:text-red-400 font-bold">NON-REFUNDABLE registration fee: $299</span>
                    </div>
                </div>

                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {steps.map((s, idx) => (
                            <div key={s.number} className="flex-1 relative">
                                <div className={`flex items-center ${idx !== steps.length - 1 ? 'flex-1' : ''}`}>
                                    <motion.div
                                        initial={false}
                                        animate={{
                                            scale: s.number === step ? 1.1 : 1,
                                            backgroundColor: s.number < step ? '#14b8a6' : (s.number === step ? '#fff' : '#e5e7eb'),
                                            borderColor: s.number <= step ? '#14b8a6' : '#d1d5db'
                                        }}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all z-10 ${s.number < step ? 'bg-teal-600 text-white border-teal-600' :
                                            s.number === step ? 'bg-white text-teal-600 border-teal-600 dark:bg-gray-800' :
                                                'bg-gray-100 text-gray-400 border-gray-300 dark:bg-gray-700 dark:border-gray-600'
                                            }`}
                                    >
                                        {s.number < step ? <CheckCircle className="h-5 w-5" /> : s.number}
                                    </motion.div>
                                    {idx !== steps.length - 1 && (
                                        <motion.div
                                            initial={false}
                                            animate={{
                                                backgroundColor: s.number < step ? '#14b8a6' : '#e5e7eb'
                                            }}
                                            className={`flex-1 h-0.5 mx-2 ${s.number < step ? 'bg-teal-600' : 'bg-gray-300 dark:bg-gray-600'
                                                }`}
                                        />
                                    )}
                                </div>
                                <p className={`text-xs mt-2 text-center font-medium ${s.number === step ? 'text-teal-600' : 'text-gray-500'}`}>
                                    {s.title}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200 dark:border-gray-700"
                    >
                        {step === 7 ? (
                            <CurrentStepComponent
                                agreedToTerms={agreedToTerms}
                                setAgreedToTerms={setAgreedToTerms}
                                agreedToMarketing={agreedToMarketing}
                                setAgreedToMarketing={setAgreedToMarketing}
                                agreedToNoRefund={agreedToNoRefund}
                                setAgreedToNoRefund={setAgreedToNoRefund}
                                formData={formData}
                                setFormData={setFormData}
                                errors={errors}
                            />
                        ) : step === 5 ? (
                            <CurrentStepComponent
                                formData={formData}
                                setFormData={setFormData}
                                errors={errors}
                                handleFileUpload={handleFileUpload}
                                fileInputRefs={fileInputRefs}
                            />
                        ) : step === 3 ? (
                            <CurrentStepComponent
                                formData={formData}
                                setFormData={setFormData}
                                errors={errors}
                                handleInputChange={handleInputChange}
                                handleCheckboxChange={handleCheckboxChange}
                            />
                        ) : (
                            <CurrentStepComponent
                                formData={formData}
                                setFormData={setFormData}
                                errors={errors}
                                handleInputChange={handleInputChange}
                            />
                        )}

                        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                            {step > 1 && (
                                <motion.button
                                    whileHover={{ x: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleBack}
                                    className="px-6 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2 font-medium"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Back
                                </motion.button>
                            )}

                            {step < 7 ? (
                                <motion.button
                                    whileHover={{ x: 2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleNext}
                                    className="ml-auto px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-medium transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                                >
                                    Continue
                                    <ChevronRight className="h-4 w-4" />
                                </motion.button>
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || !agreedToTerms || !agreedToNoRefund}
                                    className={`ml-auto px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 shadow-md ${isSubmitting || !agreedToTerms || !agreedToNoRefund
                                        ? 'bg-gray-400 cursor-not-allowed shadow-none'
                                        : !formData.paymentCompleted
                                            ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white hover:shadow-lg'
                                            : 'bg-gradient-to-r from-teal-600 to-purple-600 hover:from-teal-700 hover:to-purple-700 text-white hover:shadow-lg'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            {!formData.paymentCompleted ? (
                                                <>
                                                    <CreditCard className="h-4 w-4" />
                                                    Pay $299 (Non-Refundable) & Submit
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="h-4 w-4" />
                                                    Submit Registration
                                                </>
                                            )}
                                        </>
                                    )}
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>

                <p className="text-center text-xs text-gray-500 mt-6">
                    By submitting this application, you agree to our <a href="#" className="text-teal-600 hover:underline font-medium">Terms of Service</a> and <a href="#" className="text-teal-600 hover:underline font-medium">Privacy Policy</a>
                </p>
            </div>
        </div>
    );
};

export default TheaterRegistration;