// Frontend/src/components/theater/TheaterRegistration.tsx
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
    X,
    MapPin,
    Mail,
    Phone,
    Theater,
    Map,
    Compass
} from "lucide-react";

// ============================================
// TYPES & INTERFACES
// ============================================

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
    theaterLogo: File | null;
    theaterDescription: string;
    theaterEmail: string;
    theaterPhone: string;
    totalHalls: string;
    totalSeats: string;
    services: string[];
    latitude: string;
    longitude: string;
    city: string;
    region: string;
    address: string;
    screenTypes: string[];

    // Documents
    documents: Record<string, File | null>;

    // Pricing Plan
    pricingModel: string; // 'per_ticket' or 'contract'
    contractType: string; // 'monthly', 'quarterly', 'yearly'
    payoutFrequency: string;
    expeditedEnabled: boolean;

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
    const [isProcessing, setIsProcessing] = useState(false);

    const initializePayment = async () => {
        setIsProcessing(true);
        // Simulate Chapa initialization callback
        await new Promise(resolve => setTimeout(resolve, 2000));
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
                            One-time registration fee <span className="text-gray-500 font-semibold">(NON-REFUNDABLE)</span>
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 border-2 border-teal-600 bg-teal-50 dark:bg-teal-900/20 rounded-xl shadow-md cursor-pointer">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                <CreditCard className="w-6 h-6 text-teal-600" />
                            </div>
                            <div>
                                <span className="font-bold text-teal-700 dark:text-teal-300 block">Pay with Chapa</span>
                                <span className="text-xs text-teal-600 dark:text-teal-400">Ethiopian Payment Gateway</span>
                            </div>
                        </div>

                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                <Lock className="h-3 w-3" />
                                <span className="font-semibold">IMPORTANT:</span> This payment is <span className="font-bold underline">NON-REFUNDABLE</span>. No refunds will be issued under any circumstances.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={initializePayment}
                            disabled={isProcessing}
                            className="w-full py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-semibold transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Processing with Chapa...
                                </>
                            ) : (
                                <>
                                    <Lock className="h-4 w-4" />
                                    Pay ${amount.toLocaleString()} via Chapa
                                </>
                            )}
                        </button>

                        <p className="text-xs text-center text-gray-500 mt-3">
                            🔒 Secure payment powered by Chapa. Your payment information is encrypted and secure.
                        </p>
                    </div>
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
// STEP 3: THEATER DETAILS & SERVICES
// ============================================

interface TheaterDetailsStepProps extends StepProps {
    handleCheckboxChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleLogoUpload: (e: ChangeEvent<HTMLInputElement>) => void;
    logoInputRef: React.RefObject<HTMLInputElement>;
}

const TheaterDetailsStep: React.FC<TheaterDetailsStepProps> = ({
    formData,
    setFormData,
    errors,
    handleInputChange,
    handleCheckboxChange,
    handleLogoUpload,
    logoInputRef
}) => {
    const cities = [
        "Addis Ababa", "Bahir Dar", "Dire Dawa", "Hawassa", "Mekelle",
        "Gondar", "Jimma", "Harar", "Adama", "Dessie", "Arba Minch", "Jijiga"
    ];

    const regions = [
        "Addis Ababa", "Oromia", "Amhara", "Tigray", "Southern Nations",
        "Somali", "Benishangul-Gumuz", "Afar", "Harari", "Gambela", "Sidama"
    ];

    const servicesList = [
        { icon: Ticket, name: "Ticket Booking", description: "Online ticket reservation" },
        { icon: Coffee, name: "Refreshments", description: "Snacks and beverages" },
        { icon: Wine, name: "Premium Bar", description: "Full bar service" },
        { icon: Utensils, name: "Dining", description: "Pre-show dining" },
        { icon: Wifi, name: "Free WiFi", description: "Complimentary internet" },
        { icon: Car, name: "Valet Parking", description: "Professional parking service" },
        { icon: Accessibility, name: "Wheelchair Access", description: "ADA compliant" },
        { icon: Gift, name: "Gift Cards", description: "Digital gift certificates" },
        { icon: Users, name: "Group Bookings", description: "Special group rates" },
        { icon: Sparkles, name: "Private Events", description: "Venue rental" }
    ];

    const screenTypes = [
        "Standard", "IMAX", "4DX", "Dolby Cinema", "VIP Screen", "3D", "2D", "Drive-in"
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg">
                    <Theater className="h-5 w-5 text-white" />
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
                        Theater Logo
                    </label>
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                            {formData.theaterLogo ? (
                                <img
                                    src={URL.createObjectURL(formData.theaterLogo)}
                                    alt="Theater Logo"
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            ) : (
                                <Image className="h-8 w-8 text-gray-400" />
                            )}
                        </div>
                        <div>
                            <input
                                ref={logoInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => logoInputRef.current?.click()}
                                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition"
                            >
                                {formData.theaterLogo ? 'Change Logo' : 'Upload Logo'}
                            </button>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Theater Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="theaterDescription"
                        rows={3}
                        value={formData.theaterDescription}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none ${errors.theaterDescription ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'
                            } dark:text-white`}
                        placeholder="Describe your theater, its history, unique features, and what makes it special..."
                    />
                    {errors.theaterDescription && <p className="text-xs text-red-500 mt-1 ml-1">{errors.theaterDescription}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Theater Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="email"
                            name="theaterEmail"
                            value={formData.theaterEmail}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${errors.theaterEmail ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'
                                } dark:text-white`}
                            placeholder="info@grandtheater.com"
                        />
                    </div>
                    {errors.theaterEmail && <p className="text-xs text-red-500 mt-1 ml-1">{errors.theaterEmail}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Theater Phone <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="tel"
                            name="theaterPhone"
                            value={formData.theaterPhone}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${errors.theaterPhone ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'
                                } dark:text-white`}
                            placeholder="+251 911 234 567"
                        />
                    </div>
                    {errors.theaterPhone && <p className="text-xs text-red-500 mt-1 ml-1">{errors.theaterPhone}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Number of Halls <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="totalHalls"
                        value={formData.totalHalls}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${errors.totalHalls ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'
                            } dark:text-white`}
                        placeholder="3"
                        min="1"
                    />
                    {errors.totalHalls && <p className="text-xs text-red-500 mt-1 ml-1">{errors.totalHalls}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Total Seats <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="totalSeats"
                        value={formData.totalSeats}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${errors.totalSeats ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'
                            } dark:text-white`}
                        placeholder="500"
                        min="1"
                    />
                    {errors.totalSeats && <p className="text-xs text-red-500 mt-1 ml-1">{errors.totalSeats}</p>}
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
                    Services Offered
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {servicesList.map((service, idx) => {
                        const Icon = service.icon;
                        const isChecked = formData.services?.includes(service.name);
                        return (
                            <label
                                key={idx}
                                className={`flex items-start gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${isChecked
                                    ? 'border-teal-500 bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-900/10'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    value={service.name}
                                    checked={isChecked}
                                    onChange={handleCheckboxChange}
                                    className="hidden"
                                />
                                <Icon className={`h-5 w-5 flex-shrink-0 ${isChecked ? 'text-teal-600' : 'text-gray-400'}`} />
                                <div>
                                    <p className={`text-sm font-medium ${isChecked ? 'text-teal-600' : 'text-gray-700 dark:text-gray-300'}`}>
                                        {service.name}
                                    </p>
                                    <p className="text-xs text-gray-500">{service.description}</p>
                                </div>
                            </label>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Latitude <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            name="latitude"
                            value={formData.latitude}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${errors.latitude ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'
                                } dark:text-white`}
                            placeholder="9.0192"
                        />
                    </div>
                    {errors.latitude && <p className="text-xs text-red-500 mt-1 ml-1">{errors.latitude}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Longitude <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <Compass className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            name="longitude"
                            value={formData.longitude}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${errors.longitude ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'
                                } dark:text-white`}
                            placeholder="38.7535"
                        />
                    </div>
                    {errors.longitude && <p className="text-xs text-red-500 mt-1 ml-1">{errors.longitude}</p>}
                </div>
            </div>
        </div>
    );
};

// ============================================
// STEP 4: DOCUMENT UPLOAD (Removed Show Info)
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
// STEP 5: PRICING PLAN SELECTION (Moved from Step 6 to Step 5)
// ============================================

const PricingPlanStep: React.FC<StepProps> = ({ formData, setFormData, errors }) => {
    const [selectedModel, setSelectedModel] = useState(formData.pricingModel || null);

    const pricingModels = [
        {
            id: "per_ticket",
            name: "Per Ticket Selling",
            description: "Pay commission on each ticket sold",
            icon: Ticket,
            rate: "5-10% per ticket",
            bestFor: "New / Low Volume Theaters",
            gradient: "from-emerald-500 to-teal-500",
            details: "No monthly fees, pay only when you sell"
        },
        {
            id: "contract",
            name: "Contract Plan",
            description: "Fixed contract with flexible terms",
            icon: Calendar,
            rate: "Varies by contract length",
            bestFor: "Established Theaters with consistent sales",
            gradient: "from-blue-500 to-indigo-500",
            details: "Choose monthly, quarterly, or yearly contract"
        }
    ];

    const contractTypes = [
        { id: "monthly", name: "Monthly Contract", icon: Calendar, price: "$299/month", discount: "0%", features: ["Month-to-month", "Cancel anytime", "Standard support"] },
        { id: "quarterly", name: "Quarterly Contract", icon: Award, price: "$249/month", discount: "Save 15%", features: ["3-month term", "Priority support", "Featured listing"] },
        { id: "yearly", name: "Yearly Contract", icon: Star, price: "$199/month", discount: "Save 33% (2 months free)", features: ["12-month term", "Premium support", "Top featured listing", "Marketing boost"] }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg">
                    <Wallet className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pricing Plan</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Choose your preferred payment model</p>
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Select Pricing Model <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    {model.details}
                                </p>
                                <p className={`text-xs mt-2 ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                                    Best for: {model.bestFor}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
                {errors.pricingModel && <p className="text-xs text-red-500 mt-2">{errors.pricingModel}</p>}
            </div>

            {selectedModel === "contract" && (
                <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Select Contract Type <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {contractTypes.map((contract) => {
                            const Icon = contract.icon;
                            const isSelected = formData.contractType === contract.id;
                            return (
                                <div
                                    key={contract.id}
                                    className={`cursor-pointer rounded-2xl border-2 p-5 transition-all ${isSelected
                                        ? 'border-teal-500 bg-gradient-to-br from-teal-500/10 to-teal-600/10 shadow-lg'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 hover:shadow-md'
                                        }`}
                                    onClick={() => setFormData(prev => ({ ...prev, contractType: contract.id }))}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className={`p-2 rounded-xl ${isSelected ? 'bg-teal-100 dark:bg-teal-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                                            <Icon className={`h-5 w-5 ${isSelected ? 'text-teal-600' : 'text-gray-500'}`} />
                                        </div>
                                        {contract.discount !== "0%" && (
                                            <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                                                {contract.discount}
                                            </span>
                                        )}
                                    </div>
                                    <h4 className={`font-bold ${isSelected ? 'text-teal-600' : 'text-gray-900 dark:text-white'}`}>
                                        {contract.name}
                                    </h4>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                                        {contract.price}
                                    </p>
                                    <div className="mt-3 space-y-1">
                                        {contract.features.map((feature, idx) => (
                                            <p key={idx} className="text-xs text-gray-500 flex items-center gap-1">
                                                <CheckCircle className="h-3 w-3 text-green-500" />
                                                {feature}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {errors.contractType && <p className="text-xs text-red-500 mt-2">{errors.contractType}</p>}
                </div>
            )}
        </div>
    );
};

// ============================================
// STEP 6: TERMS & AGREEMENT (Moved from Step 7 to Step 6)
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
                        <li>For per-ticket model: 5-10% commission on each ticket sold</li>
                        <li>For contract model: Fixed monthly/quarterly/yearly fee applies</li>
                        <li>Holdback policy applies for refunds and chargebacks</li>
                        <li>TheaterHUB reserves the right to verify submitted documents</li>
                        <li>You are authorized to represent the business</li>
                        <li>You will maintain accurate show schedules and pricing</li>
                        <li>You will honor all ticket sales processed through TheaterHUB</li>
                    </ul>

                    <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
                        <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                            <div>
                                <p className="text-amber-800 dark:text-amber-300 text-sm">
                                    <strong>Important:</strong> Your registration will be reviewed by our admin team within 2-3 business days.
                                    After verification, you will receive an OTP to complete the registration process.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-gray-600 mt-0.5" />
                            <p className="text-gray-800 dark:text-gray-300 text-sm">
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
                        className="mt-1 h-5 w-5 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                    />
                    <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-teal-600 transition">
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
    const logoInputRef = useRef<HTMLInputElement>(null);

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
        theaterLogo: null,
        theaterDescription: "",
        theaterEmail: "",
        theaterPhone: "",
        totalHalls: "",
        totalSeats: "",
        services: [],
        latitude: "",
        longitude: "",
        city: "",
        region: "",
        address: "",
        screenTypes: [],
        documents: {},
        pricingModel: "",
        contractType: "",
        payoutFrequency: "",
        expeditedEnabled: false,
        acceptMarketing: false,
        paymentCompleted: false,
        paymentIntentId: ""
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        if (checked) {
            setFormData(prev => ({
                ...prev,
                services: [...(prev.services || []), value]
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                services: (prev.services || []).filter(f => f !== value)
            }));
        }
    };

    const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, theaterLogo: "Logo must be less than 2MB" }));
                return;
            }
            const validTypes = ['image/jpeg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                setErrors(prev => ({ ...prev, theaterLogo: "Only JPEG or PNG files are allowed" }));
                return;
            }
            setFormData(prev => ({ ...prev, theaterLogo: file }));
            setErrors(prev => ({ ...prev, theaterLogo: "" }));
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
            if (!formData.theaterDescription.trim()) newErrors.theaterDescription = "Theater description is required";
            if (!formData.theaterEmail.trim() || !formData.theaterEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.theaterEmail = "Valid theater email is required";
            if (!formData.theaterPhone.trim()) newErrors.theaterPhone = "Theater phone is required";
            if (!formData.totalHalls || parseInt(formData.totalHalls) < 1) newErrors.totalHalls = "Valid number of halls is required";
            if (!formData.totalSeats || parseInt(formData.totalSeats) < 1) newErrors.totalSeats = "Valid seating capacity is required";
            if (!formData.city) newErrors.city = "City is required";
            if (!formData.region) newErrors.region = "Region is required";
            if (!formData.address.trim()) newErrors.address = "Address is required";
            if (!formData.latitude.trim()) newErrors.latitude = "Latitude is required";
            if (!formData.longitude.trim()) newErrors.longitude = "Longitude is required";
        } else if (step === 4) {
            if (!formData.documents.license) newErrors.license = "Business license is required";
            if (!formData.documents.taxCertificate) newErrors.taxCertificate = "Tax certificate is required";
            if (!formData.documents.ownerId) newErrors.ownerId = "Owner ID is required";
        } else if (step === 5) {
            if (!formData.pricingModel) newErrors.pricingModel = "Please select a pricing model";
            if (formData.pricingModel === "contract" && !formData.contractType) {
                newErrors.contractType = "Please select a contract type";
            }
        } else if (step === 6) {
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
        { number: 4, title: "Documents", component: DocumentUploadStep },
        { number: 5, title: "Pricing Plan", component: PricingPlanStep },
        { number: 6, title: "Terms", component: TermsStep }
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
                        Registration Submitted for Review!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Thank you for registering with TheaterHUB. Your payment has been processed and your application has been sent to our admin team for review. You'll receive an OTP via email within 2-3 business days after verification.
                    </p>
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Application ID</p>
                        <p className="text-xl font-mono font-bold text-teal-600">TH-{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
                        <p className="text-xs text-gray-400 mt-2">Payment ID: {formData.paymentIntentId}</p>
                    </div>
                    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-600 dark:text-blue-400 flex items-center justify-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span className="font-bold">Next Steps:</span> Admin will verify your information and send OTP for contract signing
                        </p>
                    </div>
                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
                            <AlertCircle className="h-4 w-4" />
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
                        <Theater className="h-10 w-10 text-white" />
                    </motion.div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 dark:from-teal-400 dark:to-teal-600 bg-clip-text text-transparent">
                        Theater Owner Registration
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Join TheaterHUB and reach thousands of theater lovers
                    </p>
                    <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full border-2 border-gray-200 dark:border-gray-700">
                        <Lock className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                        <span className="text-xs text-gray-600 dark:text-gray-400 font-bold">NON-REFUNDABLE registration fee: $299</span>
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
                        {step === 6 ? (
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
                        ) : step === 4 ? (
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
                                handleLogoUpload={handleLogoUpload}
                                logoInputRef={logoInputRef}
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

                            {step < 6 ? (
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
                                            ? 'bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white hover:shadow-lg'
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
                                                    Submit for Admin Review
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