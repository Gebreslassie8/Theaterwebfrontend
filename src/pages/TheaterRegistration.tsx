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
import { useTranslation } from "react-i18next";

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
// PAYMENT MODAL COMPONENT (translated)
// ============================================

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess, amount, formData }) => {
    const { t } = useTranslation();
    const [isProcessing, setIsProcessing] = useState(false);

    const initializePayment = async () => {
        setIsProcessing(true);
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
                        <h3 className="text-lg font-bold text-white">{t("theaterRegistration.payment.modalTitle")}</h3>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition"><X className="h-5 w-5 text-white" /></button>
                </div>
                <div className="p-6">
                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t("theaterRegistration.payment.amountLabel")}</p>
                        <p className="text-3xl font-bold text-teal-600">${amount.toLocaleString()}</p>
                        <p className="text-xs text-gray-400 mt-1">
                            {t("theaterRegistration.payment.nonRefundable")}
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 border-2 border-teal-600 bg-teal-50 dark:bg-teal-900/20 rounded-xl shadow-md cursor-pointer">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm"><CreditCard className="w-6 h-6 text-teal-600" /></div>
                            <div>
                                <span className="font-bold text-teal-700 dark:text-teal-300 block">{t("theaterRegistration.payment.payWithChapa")}</span>
                                <span className="text-xs text-teal-600 dark:text-teal-400">{t("theaterRegistration.payment.chapaDesc")}</span>
                            </div>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                <Lock className="h-3 w-3" />
                                <span className="font-semibold">{t("theaterRegistration.payment.importantNotice").split(":")[0]}:</span> {t("theaterRegistration.payment.importantNotice").split(":")[1]}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={initializePayment}
                            disabled={isProcessing}
                            className="w-full py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-semibold transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <><Loader2 className="h-5 w-5 animate-spin" /> {t("theaterRegistration.payment.processing")}</>
                            ) : (
                                <><Lock className="h-4 w-4" /> {t("theaterRegistration.payment.payButton", { amount: amount.toLocaleString() })}</>
                            )}
                        </button>
                        <p className="text-xs text-center text-gray-500 mt-3">
                            {t("theaterRegistration.payment.secureNotice")}
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
    const { t } = useTranslation();
    const businessTypes = [
        t("theaterRegistration.businessInfo.businessTypeOptions.soleProprietorship"),
        t("theaterRegistration.businessInfo.businessTypeOptions.partnership"),
        t("theaterRegistration.businessInfo.businessTypeOptions.llc"),
        t("theaterRegistration.businessInfo.businessTypeOptions.corporation"),
        t("theaterRegistration.businessInfo.businessTypeOptions.nonProfit"),
        t("theaterRegistration.businessInfo.businessTypeOptions.government")
    ];
    const yearsOptions = [
        t("theaterRegistration.businessInfo.yearsOptions.lessThan1"),
        t("theaterRegistration.businessInfo.yearsOptions.1to2"),
        t("theaterRegistration.businessInfo.yearsOptions.3to5"),
        t("theaterRegistration.businessInfo.yearsOptions.5to10"),
        t("theaterRegistration.businessInfo.yearsOptions.10plus")
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg"><Building2 className="h-5 w-5 text-white" /></div>
                <div><h2 className="text-xl font-bold text-gray-900 dark:text-white">{t("theaterRegistration.businessInfo.title")}</h2><p className="text-sm text-gray-500 dark:text-gray-400">{t("theaterRegistration.businessInfo.subtitle")}</p></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t("theaterRegistration.businessInfo.legalBusinessName")} <span className="text-red-500">*</span></label>
                    <input type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${errors.businessName ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'} dark:text-white`} placeholder={t("theaterRegistration.businessInfo.legalBusinessNamePlaceholder")} />
                    <p className="text-xs text-gray-500 mt-1.5 ml-1">{t("theaterRegistration.businessInfo.legalBusinessNameHint")}</p>
                    {errors.businessName && <p className="text-xs text-red-500 mt-1 ml-1">{errors.businessName}</p>}
                </div>
                <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t("theaterRegistration.businessInfo.tradeName")} <span className="text-gray-400 font-normal">(Optional)</span></label><input type="text" name="tradeName" value={formData.tradeName} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all hover:border-teal-300 dark:bg-gray-800/50 dark:text-white" placeholder={t("theaterRegistration.businessInfo.tradeNamePlaceholder")} /></div>
                <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t("theaterRegistration.businessInfo.businessType")} <span className="text-red-500">*</span></label>
                    <select name="businessType" value={formData.businessType} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-800/50 dark:text-white">
                        <option value="">{t("theaterRegistration.businessInfo.selectBusinessType")}</option>
                        {businessTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                    {errors.businessType && <p className="text-xs text-red-500 mt-1 ml-1">{errors.businessType}</p>}
                </div>
                <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t("theaterRegistration.businessInfo.businessLicense")} <span className="text-red-500">*</span></label><input type="text" name="businessLicense" value={formData.businessLicense} onChange={handleInputChange} className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${errors.businessLicense ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'} dark:text-white`} placeholder={t("theaterRegistration.businessInfo.businessLicensePlaceholder")} />{errors.businessLicense && <p className="text-xs text-red-500 mt-1 ml-1">{errors.businessLicense}</p>}</div>
                <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t("theaterRegistration.businessInfo.taxId")} <span className="text-red-500">*</span></label><input type="text" name="taxId" value={formData.taxId} onChange={handleInputChange} className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${errors.taxId ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'} dark:text-white`} placeholder={t("theaterRegistration.businessInfo.taxIdPlaceholder")} />{errors.taxId && <p className="text-xs text-red-500 mt-1 ml-1">{errors.taxId}</p>}</div>
                <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t("theaterRegistration.businessInfo.yearsInOperation")} <span className="text-red-500">*</span></label>
                    <select name="yearsInOperation" value={formData.yearsInOperation} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-800/50 dark:text-white">
                        <option value="">{t("theaterRegistration.businessInfo.selectYears")}</option>
                        {yearsOptions.map(years => <option key={years} value={years}>{years}</option>)}
                    </select>
                    {errors.yearsInOperation && <p className="text-xs text-red-500 mt-1 ml-1">{errors.yearsInOperation}</p>}
                </div>
            </div>
            <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t("theaterRegistration.businessInfo.businessDescription")} <span className="text-red-500">*</span></label><textarea name="businessDescription" rows={4} value={formData.businessDescription} onChange={handleInputChange} className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none ${errors.businessDescription ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'} dark:text-white`} placeholder={t("theaterRegistration.businessInfo.businessDescriptionPlaceholder")} />{errors.businessDescription && <p className="text-xs text-red-500 mt-1 ml-1">{errors.businessDescription}</p>}</div>
        </div>
    );
};

// ============================================
// STEP 2: CONTACT & OWNER INFORMATION
// ============================================

const ContactInfoStep: React.FC<StepProps> = ({ formData, errors, handleInputChange }) => {
    const { t } = useTranslation();
    const positions = [
        t("theaterRegistration.contactInfo.positions.owner"),
        t("theaterRegistration.contactInfo.positions.coOwner"),
        t("theaterRegistration.contactInfo.positions.generalManager"),
        t("theaterRegistration.contactInfo.positions.operationsManager"),
        t("theaterRegistration.contactInfo.positions.director"),
        t("theaterRegistration.contactInfo.positions.partner"),
        t("theaterRegistration.contactInfo.positions.other")
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg"><User className="h-5 w-5 text-white" /></div>
                <div><h2 className="text-xl font-bold text-gray-900 dark:text-white">{t("theaterRegistration.contactInfo.title")}</h2><p className="text-sm text-gray-500 dark:text-gray-400">{t("theaterRegistration.contactInfo.subtitle")}</p></div>
            </div>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/30 dark:to-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-5"><div className="p-1.5 bg-teal-100 dark:bg-teal-900/30 rounded-lg"><UserCheck className="h-4 w-4 text-teal-600" /></div><h3 className="text-md font-semibold text-gray-900 dark:text-white">{t("theaterRegistration.contactInfo.primaryContact")}</h3></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t("theaterRegistration.contactInfo.fullName")} <span className="text-red-500">*</span></label><input type="text" name="ownerName" value={formData.ownerName} onChange={handleInputChange} className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${errors.ownerName ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'} dark:text-white`} placeholder={t("theaterRegistration.contactInfo.fullNamePlaceholder")} />{errors.ownerName && <p className="text-xs text-red-500 mt-1 ml-1">{errors.ownerName}</p>}</div>
                    <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t("theaterRegistration.contactInfo.position")} <span className="text-red-500">*</span></label><select name="ownerPosition" value={formData.ownerPosition} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-800/50 dark:text-white"><option value="">{t("theaterRegistration.contactInfo.selectPosition")}</option>{positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}</select>{errors.ownerPosition && <p className="text-xs text-red-500 mt-1 ml-1">{errors.ownerPosition}</p>}</div>
                    <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t("theaterRegistration.contactInfo.email")} <span className="text-red-500">*</span></label><input type="email" name="ownerEmail" value={formData.ownerEmail} onChange={handleInputChange} className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${errors.ownerEmail ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'} dark:text-white`} placeholder={t("theaterRegistration.contactInfo.emailPlaceholder")} />{errors.ownerEmail && <p className="text-xs text-red-500 mt-1 ml-1">{errors.ownerEmail}</p>}</div>
                    <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t("theaterRegistration.contactInfo.phone")} <span className="text-red-500">*</span></label><input type="tel" name="ownerPhone" value={formData.ownerPhone} onChange={handleInputChange} className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${errors.ownerPhone ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'} dark:text-white`} placeholder={t("theaterRegistration.contactInfo.phonePlaceholder")} />{errors.ownerPhone && <p className="text-xs text-red-500 mt-1 ml-1">{errors.ownerPhone}</p>}</div>
                </div>
            </div>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/30 dark:to-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-5"><div className="p-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg"><Users className="h-4 w-4 text-gray-600 dark:text-gray-400" /></div><h3 className="text-md font-semibold text-gray-900 dark:text-white">{t("theaterRegistration.contactInfo.secondaryContact")}<span className="text-xs text-gray-400 font-normal">{t("theaterRegistration.contactInfo.secondaryContactOptional")}</span></h3></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("theaterRegistration.contactInfo.secondaryName")}</label><input type="text" name="secondaryName" value={formData.secondaryName} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all hover:border-teal-300 dark:bg-gray-800/50 dark:text-white" placeholder={t("theaterRegistration.contactInfo.secondaryNamePlaceholder")} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("theaterRegistration.contactInfo.secondaryPosition")}</label><input type="text" name="secondaryPosition" value={formData.secondaryPosition} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all hover:border-teal-300 dark:bg-gray-800/50 dark:text-white" placeholder={t("theaterRegistration.contactInfo.secondaryPositionPlaceholder")} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("theaterRegistration.contactInfo.secondaryEmail")}</label><input type="email" name="secondaryEmail" value={formData.secondaryEmail} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all hover:border-teal-300 dark:bg-gray-800/50 dark:text-white" placeholder={t("theaterRegistration.contactInfo.secondaryEmailPlaceholder")} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("theaterRegistration.contactInfo.secondaryPhone")}</label><input type="tel" name="secondaryPhone" value={formData.secondaryPhone} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all hover:border-teal-300 dark:bg-gray-800/50 dark:text-white" placeholder={t("theaterRegistration.contactInfo.secondaryPhonePlaceholder")} /></div>
                </div>
            </div>
            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 rounded-2xl p-6 border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 mb-5"><div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg"><AlertCircle className="h-4 w-4 text-red-500" /></div><h3 className="text-md font-semibold text-gray-900 dark:text-white">{t("theaterRegistration.contactInfo.emergencyContact")}</h3></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t("theaterRegistration.contactInfo.emergencyName")} <span className="text-red-500">*</span></label><input type="text" name="emergencyName" value={formData.emergencyName} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all hover:border-teal-300 dark:bg-gray-800/50 dark:text-white" placeholder={t("theaterRegistration.contactInfo.emergencyNamePlaceholder")} />{errors.emergencyName && <p className="text-xs text-red-500 mt-1 ml-1">{errors.emergencyName}</p>}</div>
                    <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t("theaterRegistration.contactInfo.emergencyPhone")} <span className="text-red-500">*</span></label><input type="tel" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all hover:border-teal-300 dark:bg-gray-800/50 dark:text-white" placeholder={t("theaterRegistration.contactInfo.emergencyPhonePlaceholder")} />{errors.emergencyPhone && <p className="text-xs text-red-500 mt-1 ml-1">{errors.emergencyPhone}</p>}</div>
                    <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("theaterRegistration.contactInfo.emergencyRelation")}</label><input type="text" name="emergencyRelation" value={formData.emergencyRelation} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all hover:border-teal-300 dark:bg-gray-800/50 dark:text-white" placeholder={t("theaterRegistration.contactInfo.emergencyRelationPlaceholder")} /></div>
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
    formData, setFormData, errors, handleInputChange, handleCheckboxChange, handleLogoUpload, logoInputRef
}) => {
    const { t } = useTranslation();
    const cities = [
        t("theaterRegistration.theaterDetails.cities.addisAbaba"),
        t("theaterRegistration.theaterDetails.cities.bahirDar"),
        t("theaterRegistration.theaterDetails.cities.direDawa"),
        t("theaterRegistration.theaterDetails.cities.hawassa"),
        t("theaterRegistration.theaterDetails.cities.mekelle"),
        t("theaterRegistration.theaterDetails.cities.gondar"),
        t("theaterRegistration.theaterDetails.cities.jimma"),
        t("theaterRegistration.theaterDetails.cities.harar"),
        t("theaterRegistration.theaterDetails.cities.adama"),
        t("theaterRegistration.theaterDetails.cities.dessie"),
        t("theaterRegistration.theaterDetails.cities.arbaMinch"),
        t("theaterRegistration.theaterDetails.cities.jijiga")
    ];
    const regions = [
        t("theaterRegistration.theaterDetails.regions.addisAbaba"),
        t("theaterRegistration.theaterDetails.regions.oromia"),
        t("theaterRegistration.theaterDetails.regions.amhara"),
        t("theaterRegistration.theaterDetails.regions.tigray"),
        t("theaterRegistration.theaterDetails.regions.snnpr"),
        t("theaterRegistration.theaterDetails.regions.somali"),
        t("theaterRegistration.theaterDetails.regions.benishangulGumuz"),
        t("theaterRegistration.theaterDetails.regions.afar"),
        t("theaterRegistration.theaterDetails.regions.harari"),
        t("theaterRegistration.theaterDetails.regions.gambela"),
        t("theaterRegistration.theaterDetails.regions.sidama")
    ];
    const servicesList = [
        { icon: Ticket, nameKey: "ticketBooking", descKey: "ticketBookingDesc" },
        { icon: Coffee, nameKey: "refreshments", descKey: "refreshmentsDesc" },
        { icon: Wine, nameKey: "premiumBar", descKey: "premiumBarDesc" },
        { icon: Utensils, nameKey: "dining", descKey: "diningDesc" },
        { icon: Wifi, nameKey: "freeWifi", descKey: "freeWifiDesc" },
        { icon: Car, nameKey: "valetParking", descKey: "valetParkingDesc" },
        { icon: Accessibility, nameKey: "wheelchairAccess", descKey: "wheelchairAccessDesc" },
        { icon: Gift, nameKey: "giftCards", descKey: "giftCardsDesc" },
        { icon: Users, nameKey: "groupBookings", descKey: "groupBookingsDesc" },
        { icon: Sparkles, nameKey: "privateEvents", descKey: "privateEventsDesc" }
    ];
    const screenTypes = [
        t("theaterRegistration.theaterDetails.screenTypes.standard"),
        t("theaterRegistration.theaterDetails.screenTypes.imax"),
        t("theaterRegistration.theaterDetails.screenTypes.dx"),
        t("theaterRegistration.theaterDetails.screenTypes.dolby"),
        t("theaterRegistration.theaterDetails.screenTypes.vip"),
        t("theaterRegistration.theaterDetails.screenTypes.d"),
        t("theaterRegistration.theaterDetails.screenTypes.d2d"),
        t("theaterRegistration.theaterDetails.screenTypes.driveIn")
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg"><Theater className="h-5 w-5 text-white" /></div>
                <div><h2 className="text-xl font-bold text-gray-900 dark:text-white">{t("theaterRegistration.theaterDetails.title")}</h2><p className="text-sm text-gray-500 dark:text-gray-400">{t("theaterRegistration.theaterDetails.subtitle")}</p></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2"><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t("theaterRegistration.theaterDetails.theaterName")} <span className="text-red-500">*</span></label><input type="text" name="theaterName" value={formData.theaterName} onChange={handleInputChange} className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${errors.theaterName ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'} dark:text-white`} placeholder={t("theaterRegistration.theaterDetails.theaterNamePlaceholder")} />{errors.theaterName && <p className="text-xs text-red-500 mt-1 ml-1">{errors.theaterName}</p>}</div>
                <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t("theaterRegistration.theaterDetails.theaterLogo")}</label><div className="flex items-center gap-4"><div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">{formData.theaterLogo ? <img src={URL.createObjectURL(formData.theaterLogo)} alt="Logo" className="w-full h-full object-cover rounded-xl" /> : <Image className="h-8 w-8 text-gray-400" />}</div><div><input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" /><button type="button" onClick={() => logoInputRef.current?.click()} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition">{formData.theaterLogo ? t("theaterRegistration.theaterDetails.changeLogo") : t("theaterRegistration.theaterDetails.uploadLogo")}</button><p className="text-xs text-gray-500 mt-1">{t("theaterRegistration.theaterDetails.logoHint")}</p></div></div></div>
                <div className="md:col-span-2"><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t("theaterRegistration.theaterDetails.theaterDescription")} <span className="text-red-500">*</span></label><textarea name="theaterDescription" rows={3} value={formData.theaterDescription} onChange={handleInputChange} className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none ${errors.theaterDescription ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'} dark:text-white`} placeholder={t("theaterRegistration.theaterDetails.theaterDescriptionPlaceholder")} />{errors.theaterDescription && <p className="text-xs text-red-500 mt-1 ml-1">{errors.theaterDescription}</p>}</div>
                <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t("theaterRegistration.theaterDetails.theaterEmail")} <span className="text-red-500">*</span></label><div className="relative"><Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="email" name="theaterEmail" value={formData.theaterEmail} onChange={handleInputChange} className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${errors.theaterEmail ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'} dark:text-white`} placeholder={t("theaterRegistration.theaterDetails.theaterEmailPlaceholder")} /></div>{errors.theaterEmail && <p className="text-xs text-red-500 mt-1 ml-1">{errors.theaterEmail}</p>}</div>
                <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t("theaterRegistration.theaterDetails.theaterPhone")} <span className="text-red-500">*</span></label><div className="relative"><Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="tel" name="theaterPhone" value={formData.theaterPhone} onChange={handleInputChange} className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${errors.theaterPhone ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'} dark:text-white`} placeholder={t("theaterRegistration.theaterDetails.theaterPhonePlaceholder")} /></div>{errors.theaterPhone && <p className="text-xs text-red-500 mt-1 ml-1">{errors.theaterPhone}</p>}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t("theaterRegistration.theaterDetails.numberOfHalls")} <span className="text-red-500">*</span></label><input type="number" name="totalHalls" value={formData.totalHalls} onChange={handleInputChange} className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${errors.totalHalls ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'} dark:text-white`} placeholder={t("theaterRegistration.theaterDetails.numberOfHallsPlaceholder")} min="1" />{errors.totalHalls && <p className="text-xs text-red-500 mt-1 ml-1">{errors.totalHalls}</p>}</div>
                <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t("theaterRegistration.theaterDetails.totalSeats")} <span className="text-red-500">*</span></label><input type="number" name="totalSeats" value={formData.totalSeats} onChange={handleInputChange} className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${errors.totalSeats ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'} dark:text-white`} placeholder={t("theaterRegistration.theaterDetails.totalSeatsPlaceholder")} min="1" />{errors.totalSeats && <p className="text-xs text-red-500 mt-1 ml-1">{errors.totalSeats}</p>}</div>
                <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t("theaterRegistration.theaterDetails.screenTypes")}</label><select multiple value={formData.screenTypes || []} onChange={(e) => { const options = Array.from(e.target.selectedOptions, option => option.value); setFormData(prev => ({ ...prev, screenTypes: options })); }} className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-800/50 dark:text-white" size={3}>{screenTypes.map(type => <option key={type} value={type}>{type}</option>)}</select><p className="text-xs text-gray-500 mt-1.5 ml-1">{t("theaterRegistration.theaterDetails.screenTypesHelp")}</p></div>
            </div>
            <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{t("theaterRegistration.theaterDetails.servicesOffered")}</label><div className="grid grid-cols-2 md:grid-cols-3 gap-3">{servicesList.map((service, idx) => { const Icon = service.icon; const name = t(`theaterRegistration.theaterDetails.services.${service.nameKey}`); const isChecked = formData.services?.includes(name); return (<label key={idx} className={`flex items-start gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${isChecked ? 'border-teal-500 bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}><input type="checkbox" value={name} checked={isChecked} onChange={handleCheckboxChange} className="hidden" /><Icon className={`h-5 w-5 flex-shrink-0 ${isChecked ? 'text-teal-600' : 'text-gray-400'}`} /><div><p className={`text-sm font-medium ${isChecked ? 'text-teal-600' : 'text-gray-700 dark:text-gray-300'}`}>{name}</p><p className="text-xs text-gray-500">{t(`theaterRegistration.theaterDetails.services.${service.descKey}`)}</p></div></label>); })}</div></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t("theaterRegistration.theaterDetails.city")} <span className="text-red-500">*</span></label><select name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-800/50 dark:text-white"><option value="">{t("theaterRegistration.theaterDetails.selectCity")}</option>{cities.map(city => <option key={city} value={city}>{city}</option>)}</select>{errors.city && <p className="text-xs text-red-500 mt-1 ml-1">{errors.city}</p>}</div>
                <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t("theaterRegistration.theaterDetails.region")} <span className="text-red-500">*</span></label><select name="region" value={formData.region} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-800/50 dark:text-white"><option value="">{t("theaterRegistration.theaterDetails.selectRegion")}</option>{regions.map(region => <option key={region} value={region}>{region}</option>)}</select>{errors.region && <p className="text-xs text-red-500 mt-1 ml-1">{errors.region}</p>}</div>
                <div className="md:col-span-2"><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t("theaterRegistration.theaterDetails.fullAddress")} <span className="text-red-500">*</span></label><input type="text" name="address" value={formData.address} onChange={handleInputChange} className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${errors.address ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'} dark:text-white`} placeholder={t("theaterRegistration.theaterDetails.fullAddressPlaceholder")} />{errors.address && <p className="text-xs text-red-500 mt-1 ml-1">{errors.address}</p>}</div>
                <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t("theaterRegistration.theaterDetails.latitude")} <span className="text-red-500">*</span></label><div className="relative"><MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="text" name="latitude" value={formData.latitude} onChange={handleInputChange} className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${errors.latitude ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'} dark:text-white`} placeholder={t("theaterRegistration.theaterDetails.latitudePlaceholder")} /></div>{errors.latitude && <p className="text-xs text-red-500 mt-1 ml-1">{errors.latitude}</p>}</div>
                <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t("theaterRegistration.theaterDetails.longitude")} <span className="text-red-500">*</span></label><div className="relative"><Compass className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="text" name="longitude" value={formData.longitude} onChange={handleInputChange} className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${errors.longitude ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'} dark:text-white`} placeholder={t("theaterRegistration.theaterDetails.longitudePlaceholder")} /></div>{errors.longitude && <p className="text-xs text-red-500 mt-1 ml-1">{errors.longitude}</p>}</div>
            </div>
        </div>
    );
};

// ============================================
// STEP 4: DOCUMENT UPLOAD
// ============================================

interface DocumentUploadStepProps {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    errors: Errors;
    handleFileUpload: (e: ChangeEvent<HTMLInputElement>, docType: string) => void;
    fileInputRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
}

const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({ formData, errors, handleFileUpload, fileInputRefs }) => {
    const { t } = useTranslation();
    const documents = [
        { id: "license", nameKey: "license", icon: FileText, required: true, descKey: "license.desc" },
        { id: "taxCertificate", nameKey: "taxCertificate", icon: Receipt, required: true, descKey: "taxCertificate.desc" },
        { id: "ownerId", nameKey: "ownerId", icon: User, required: true, descKey: "ownerId.desc" },
        { id: "theaterPhotos", nameKey: "theaterPhotos", icon: Image, required: false, descKey: "theaterPhotos.desc" },
        { id: "fireSafety", nameKey: "fireSafety", icon: Shield, required: false, descKey: "fireSafety.desc" },
        { id: "healthPermit", nameKey: "healthPermit", icon: ShieldCheck, required: false, descKey: "healthPermit.desc" }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg"><FileCheck className="h-5 w-5 text-white" /></div>
                <div><h2 className="text-xl font-bold text-gray-900 dark:text-white">{t("theaterRegistration.documents.title")}</h2><p className="text-sm text-gray-500 dark:text-gray-400">{t("theaterRegistration.documents.subtitle")}</p></div>
            </div>
            <div className="space-y-4">
                {documents.map((doc) => {
                    const Icon = doc.icon;
                    const isUploaded = formData.documents?.[doc.id];
                    const hasError = errors[doc.id];
                    return (
                        <div key={doc.id} className={`border-2 rounded-2xl p-5 transition-all ${hasError ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300'}`}>
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4"><div className={`p-2.5 rounded-xl ${isUploaded ? 'bg-green-100 dark:bg-green-900/20' : 'bg-gray-100 dark:bg-gray-800'}`}><Icon className={`h-5 w-5 ${isUploaded ? 'text-green-600' : 'text-gray-500'}`} /></div><div><h3 className="font-semibold text-gray-900 dark:text-white">{t(`theaterRegistration.documents.${doc.nameKey}.name`)} {doc.required && <span className="text-red-500">*</span>}</h3><p className="text-sm text-gray-500 mt-1">{t(`theaterRegistration.documents.${doc.descKey}`)}</p>{isUploaded && <p className="text-xs text-green-600 mt-2 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Uploaded: {formData.documents[doc.id]?.name}</p>}</div></div>
                                <div><input ref={el => { if (el) fileInputRefs.current[doc.id] = el; }} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileUpload(e, doc.id)} className="hidden" /><button type="button" onClick={() => fileInputRefs.current[doc.id]?.click()} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${isUploaded ? 'border-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/10' : 'bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800 shadow-md hover:shadow-lg'}`}><Upload className="h-4 w-4" />{isUploaded ? t("theaterRegistration.documents.replaceButton") : t("theaterRegistration.documents.uploadButton")}</button></div>
                            </div>
                            {hasError && <p className="text-xs text-red-500 mt-3">{errors[doc.id]}</p>}
                        </div>
                    );
                })}
            </div>
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-2xl p-5 border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-3"><AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" /><div><p className="text-sm font-medium text-amber-800 dark:text-amber-300">{t("theaterRegistration.documents.requirements")}</p><p className="text-xs text-amber-700 dark:text-amber-400 mt-1">{t("theaterRegistration.documents.requirementsText")}</p></div></div>
            </div>
        </div>
    );
};

// ============================================
// STEP 5: PRICING PLAN SELECTION
// ============================================

const PricingPlanStep: React.FC<StepProps> = ({ formData, setFormData, errors }) => {
    const { t } = useTranslation();
    const [selectedModel, setSelectedModel] = useState(formData.pricingModel || null);
    const pricingModels = [
        { id: "per_ticket", nameKey: "perTicket.name", descriptionKey: "perTicket.description", icon: Ticket, rateKey: "perTicket.rate", bestForKey: "perTicket.bestFor", gradient: "from-emerald-500 to-teal-500", detailsKey: "perTicket.details" },
        { id: "contract", nameKey: "contract.name", descriptionKey: "contract.description", icon: Calendar, rateKey: "contract.rate", bestForKey: "contract.bestFor", gradient: "from-blue-500 to-indigo-500", detailsKey: "contract.details" }
    ];
    const contractTypes = [
        { id: "monthly", nameKey: "monthly.name", icon: Calendar, priceKey: "monthly.price", discountKey: "monthly.discount", featuresKeys: ["monthly.features.0","monthly.features.1","monthly.features.2"] },
        { id: "quarterly", nameKey: "quarterly.name", icon: Award, priceKey: "quarterly.price", discountKey: "quarterly.discount", featuresKeys: ["quarterly.features.0","quarterly.features.1","quarterly.features.2"] },
        { id: "yearly", nameKey: "yearly.name", icon: Star, priceKey: "yearly.price", discountKey: "yearly.discount", featuresKeys: ["yearly.features.0","yearly.features.1","yearly.features.2","yearly.features.3"] }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg"><Wallet className="h-5 w-5 text-white" /></div>
                <div><h2 className="text-xl font-bold text-gray-900 dark:text-white">{t("theaterRegistration.pricingPlan.title")}</h2><p className="text-sm text-gray-500 dark:text-gray-400">{t("theaterRegistration.pricingPlan.subtitle")}</p></div>
            </div>
            <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{t("theaterRegistration.pricingPlan.selectModel")} <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{pricingModels.map((model) => { const Icon = model.icon; const isSelected = selectedModel === model.id; return (<motion.div key={model.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`cursor-pointer rounded-2xl border-2 p-5 transition-all ${isSelected ? `border-teal-500 bg-gradient-to-br ${model.gradient} bg-opacity-10 shadow-lg` : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 hover:shadow-md'}`} onClick={() => { setSelectedModel(model.id); setFormData(prev => ({ ...prev, pricingModel: model.id })); }}><div className={`p-2 rounded-xl inline-block ${isSelected ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-800'} mb-3`}><Icon className={`h-6 w-6 ${isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} /></div><h3 className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{t(`theaterRegistration.pricingPlan.${model.nameKey}`)}</h3><p className={`text-sm mt-1 ${isSelected ? 'text-white/90' : 'text-gray-500'}`}>{t(`theaterRegistration.pricingPlan.${model.descriptionKey}`)}</p><p className={`text-sm font-bold mt-3 ${isSelected ? 'text-white' : 'text-teal-600'}`}>{t(`theaterRegistration.pricingPlan.${model.rateKey}`)}</p><p className={`text-xs mt-1 ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>{t(`theaterRegistration.pricingPlan.${model.detailsKey}`)}</p><p className={`text-xs mt-2 ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>{t("theaterRegistration.pricingPlan.perTicket.bestFor")}: {t(`theaterRegistration.pricingPlan.${model.bestForKey}`)}</p></motion.div>);})}</div>
                {errors.pricingModel && <p className="text-xs text-red-500 mt-2">{errors.pricingModel}</p>}
            </div>
            {selectedModel === "contract" && (<div className="mt-6"><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{t("theaterRegistration.pricingPlan.selectContract")} <span className="text-red-500">*</span></label><div className="grid grid-cols-1 md:grid-cols-3 gap-4">{contractTypes.map((contract) => { const Icon = contract.icon; const isSelected = formData.contractType === contract.id; return (<div key={contract.id} className={`cursor-pointer rounded-2xl border-2 p-5 transition-all ${isSelected ? 'border-teal-500 bg-gradient-to-br from-teal-500/10 to-teal-600/10 shadow-lg' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 hover:shadow-md'}`} onClick={() => setFormData(prev => ({ ...prev, contractType: contract.id }))}><div className="flex items-center justify-between mb-3"><div className={`p-2 rounded-xl ${isSelected ? 'bg-teal-100 dark:bg-teal-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}><Icon className={`h-5 w-5 ${isSelected ? 'text-teal-600' : 'text-gray-500'}`} /></div>{contract.discountKey !== "0%" && <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">{t(`theaterRegistration.pricingPlan.contractTypes.${contract.discountKey}`)}</span>}</div><h4 className={`font-bold ${isSelected ? 'text-teal-600' : 'text-gray-900 dark:text-white'}`}>{t(`theaterRegistration.pricingPlan.contractTypes.${contract.nameKey}`)}</h4><p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{t(`theaterRegistration.pricingPlan.contractTypes.${contract.priceKey}`)}</p><div className="mt-3 space-y-1">{contract.featuresKeys.map((fk, idx) => (<p key={idx} className="text-xs text-gray-500 flex items-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" />{t(`theaterRegistration.pricingPlan.contractTypes.${fk}`)}</p>))}</div></div>);})}</div>{errors.contractType && <p className="text-xs text-red-500 mt-2">{errors.contractType}</p>}</div>)}
        </div>
    );
};

// ============================================
// STEP 6: TERMS & AGREEMENT
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
    agreedToTerms, setAgreedToTerms, agreedToMarketing, setAgreedToMarketing,
    agreedToNoRefund, setAgreedToNoRefund, formData, setFormData, errors
}) => {
    const { t } = useTranslation();
    const clauses = [
        "clauses.0", "clauses.1", "clauses.2", "clauses.3", "clauses.4",
        "clauses.5", "clauses.6", "clauses.7", "clauses.8", "clauses.9"
    ];
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg"><ClipboardCheck className="h-5 w-5 text-white" /></div>
                <div><h2 className="text-xl font-bold text-gray-900 dark:text-white">{t("theaterRegistration.terms.title")}</h2><p className="text-sm text-gray-500 dark:text-gray-400">{t("theaterRegistration.terms.subtitle")}</p></div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/30 dark:to-gray-800/50 rounded-2xl p-6 space-y-4 border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{t("theaterRegistration.terms.agreementTitle")}</h3>
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-semibold text-gray-700 dark:text-gray-300">{t("theaterRegistration.terms.intro")}</p>
                    <ul className="list-disc pl-5 space-y-2">{clauses.map((key, idx) => <li key={idx}>{t(`theaterRegistration.terms.${key}`)}</li>)}</ul>
                    <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-200 dark:border-amber-800"><div className="flex items-start gap-2"><AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" /><div><p className="text-amber-800 dark:text-amber-300 text-sm"><strong>{t("theaterRegistration.terms.adminReview").split(":")[0]}:</strong> {t("theaterRegistration.terms.adminReview").split(":")[1]}</p></div></div></div>
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"><div className="flex items-start gap-2"><AlertCircle className="h-4 w-4 text-gray-600 mt-0.5" /><p className="text-gray-800 dark:text-gray-300 text-sm"><strong>{t("theaterRegistration.terms.noRefundNotice").split(":")[0]}:</strong> {t("theaterRegistration.terms.noRefundNotice").split(":")[1]}</p></div></div>
                </div>
            </div>
            <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer group"><input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="mt-1 h-5 w-5 text-teal-600 rounded border-gray-300 focus:ring-teal-500" /><div><p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-teal-600 transition">{t("theaterRegistration.terms.accuracyCheckbox")}</p><p className="text-xs text-gray-500 mt-0.5">{t("theaterRegistration.terms.accuracyHint")}</p></div></label>
                <label className="flex items-start gap-3 cursor-pointer group"><input type="checkbox" checked={agreedToMarketing} onChange={(e) => { setAgreedToMarketing(e.target.checked); setFormData(prev => ({ ...prev, acceptMarketing: e.target.checked })); }} className="mt-1 h-5 w-5 text-teal-600 rounded border-gray-300 focus:ring-teal-500" /><div><p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-teal-600 transition">{t("theaterRegistration.terms.marketingCheckbox")}</p><p className="text-xs text-gray-500 mt-0.5">{t("theaterRegistration.terms.marketingHint")}</p></div></label>
                <label className="flex items-start gap-3 cursor-pointer group"><input type="checkbox" checked={agreedToNoRefund} onChange={(e) => setAgreedToNoRefund(e.target.checked)} className="mt-1 h-5 w-5 text-teal-600 rounded border-gray-300 focus:ring-teal-500" /><div><p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-teal-600 transition">{t("theaterRegistration.terms.noRefundCheckbox")}</p><p className="text-xs text-gray-500 mt-0.5">{t("theaterRegistration.terms.noRefundHint")}</p></div></label>
            </div>
            {errors.terms && <p className="text-xs text-red-500 mt-2">{errors.terms}</p>}
        </div>
    );
};

// ============================================
// MAIN REGISTRATION COMPONENT
// ============================================

const TheaterRegistration: React.FC = () => {
    const { t } = useTranslation();
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
        businessName: "", tradeName: "", businessType: "", businessLicense: "", taxId: "", yearsInOperation: "", businessDescription: "",
        ownerName: "", ownerPosition: "", ownerEmail: "", ownerPhone: "", secondaryName: "", secondaryPosition: "", secondaryEmail: "", secondaryPhone: "",
        emergencyName: "", emergencyPhone: "", emergencyRelation: "", theaterName: "", theaterLogo: null, theaterDescription: "", theaterEmail: "", theaterPhone: "",
        totalHalls: "", totalSeats: "", services: [], latitude: "", longitude: "", city: "", region: "", address: "", screenTypes: [], documents: {},
        pricingModel: "", contractType: "", payoutFrequency: "", expeditedEnabled: false, acceptMarketing: false, paymentCompleted: false, paymentIntentId: ""
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };
    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        if (checked) setFormData(prev => ({ ...prev, services: [...(prev.services || []), value] }));
        else setFormData(prev => ({ ...prev, services: (prev.services || []).filter(f => f !== value) }));
    };
    const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { setErrors(prev => ({ ...prev, theaterLogo: t("theaterRegistration.errors.logoSize") })); return; }
            const validTypes = ['image/jpeg', 'image/png'];
            if (!validTypes.includes(file.type)) { setErrors(prev => ({ ...prev, theaterLogo: t("theaterRegistration.errors.logoType") })); return; }
            setFormData(prev => ({ ...prev, theaterLogo: file })); setErrors(prev => ({ ...prev, theaterLogo: "" }));
        }
    };
    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>, docType: string) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) { setErrors(prev => ({ ...prev, [docType]: t("theaterRegistration.errors.fileSize", { size: 10 }) })); return; }
            const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
            if (!validTypes.includes(file.type)) { setErrors(prev => ({ ...prev, [docType]: t("theaterRegistration.errors.fileType") })); return; }
            setFormData(prev => ({ ...prev, documents: { ...prev.documents, [docType]: file } }));
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
            if (!formData.businessName.trim()) newErrors.businessName = t("theaterRegistration.errors.required", { field: t("theaterRegistration.businessInfo.legalBusinessName") });
            if (!formData.businessType) newErrors.businessType = t("theaterRegistration.errors.required", { field: t("theaterRegistration.businessInfo.businessType") });
            if (!formData.businessLicense.trim()) newErrors.businessLicense = t("theaterRegistration.errors.required", { field: t("theaterRegistration.businessInfo.businessLicense") });
            if (!formData.taxId.trim()) newErrors.taxId = t("theaterRegistration.errors.required", { field: t("theaterRegistration.businessInfo.taxId") });
            if (!formData.yearsInOperation) newErrors.yearsInOperation = t("theaterRegistration.errors.required", { field: t("theaterRegistration.businessInfo.yearsInOperation") });
            if (!formData.businessDescription.trim()) newErrors.businessDescription = t("theaterRegistration.errors.required", { field: t("theaterRegistration.businessInfo.businessDescription") });
        } else if (step === 2) {
            if (!formData.ownerName.trim()) newErrors.ownerName = t("theaterRegistration.errors.required", { field: t("theaterRegistration.contactInfo.fullName") });
            if (!formData.ownerPosition) newErrors.ownerPosition = t("theaterRegistration.errors.required", { field: t("theaterRegistration.contactInfo.position") });
            if (!formData.ownerEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.ownerEmail = t("theaterRegistration.errors.validEmail");
            if (!formData.ownerPhone.trim()) newErrors.ownerPhone = t("theaterRegistration.errors.validPhone");
            if (!formData.emergencyName.trim()) newErrors.emergencyName = t("theaterRegistration.errors.required", { field: t("theaterRegistration.contactInfo.emergencyName") });
            if (!formData.emergencyPhone.trim()) newErrors.emergencyPhone = t("theaterRegistration.errors.validPhone");
        } else if (step === 3) {
            if (!formData.theaterName.trim()) newErrors.theaterName = t("theaterRegistration.errors.required", { field: t("theaterRegistration.theaterDetails.theaterName") });
            if (!formData.theaterDescription.trim()) newErrors.theaterDescription = t("theaterRegistration.errors.required", { field: t("theaterRegistration.theaterDetails.theaterDescription") });
            if (!formData.theaterEmail.trim() || !formData.theaterEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.theaterEmail = t("theaterRegistration.errors.validEmail");
            if (!formData.theaterPhone.trim()) newErrors.theaterPhone = t("theaterRegistration.errors.validPhone");
            if (!formData.totalHalls || parseInt(formData.totalHalls) < 1) newErrors.totalHalls = t("theaterRegistration.errors.validNumber");
            if (!formData.totalSeats || parseInt(formData.totalSeats) < 1) newErrors.totalSeats = t("theaterRegistration.errors.validNumber");
            if (!formData.city) newErrors.city = t("theaterRegistration.errors.required", { field: t("theaterRegistration.theaterDetails.city") });
            if (!formData.region) newErrors.region = t("theaterRegistration.errors.required", { field: t("theaterRegistration.theaterDetails.region") });
            if (!formData.address.trim()) newErrors.address = t("theaterRegistration.errors.required", { field: t("theaterRegistration.theaterDetails.fullAddress") });
            if (!formData.latitude.trim()) newErrors.latitude = t("theaterRegistration.errors.validLatitude");
            if (!formData.longitude.trim()) newErrors.longitude = t("theaterRegistration.errors.validLongitude");
        } else if (step === 4) {
            if (!formData.documents.license) newErrors.license = t("theaterRegistration.errors.required", { field: t("theaterRegistration.documents.license.name") });
            if (!formData.documents.taxCertificate) newErrors.taxCertificate = t("theaterRegistration.errors.required", { field: t("theaterRegistration.documents.taxCertificate.name") });
            if (!formData.documents.ownerId) newErrors.ownerId = t("theaterRegistration.errors.required", { field: t("theaterRegistration.documents.ownerId.name") });
        } else if (step === 5) {
            if (!formData.pricingModel) newErrors.pricingModel = t("theaterRegistration.errors.selectPricingModel");
            if (formData.pricingModel === "contract" && !formData.contractType) newErrors.contractType = t("theaterRegistration.errors.selectContractType");
        } else if (step === 6) {
            if (!agreedToTerms) newErrors.terms = t("theaterRegistration.errors.agreeTerms");
            if (!agreedToNoRefund) newErrors.noRefund = t("theaterRegistration.errors.agreeNoRefund");
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleNext = () => { if (validateStep()) setStep(prev => prev + 1); };
    const handleBack = () => setStep(prev => prev - 1);
    const handleSubmit = async () => {
        if (!validateStep()) return;
        if (!formData.paymentCompleted) { setShowPaymentModal(true); return; }
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("Registration Data:", formData);
        setIsSubmitting(false);
        setSubmitSuccess(true);
    };
    const steps = [
        { number: 1, title: t("theaterRegistration.steps.businessInfo"), component: BusinessInfoStep },
        { number: 2, title: t("theaterRegistration.steps.contactInfo"), component: ContactInfoStep },
        { number: 3, title: t("theaterRegistration.steps.theaterDetails"), component: TheaterDetailsStep },
        { number: 4, title: t("theaterRegistration.steps.documents"), component: DocumentUploadStep },
        { number: 5, title: t("theaterRegistration.steps.pricingPlan"), component: PricingPlanStep },
        { number: 6, title: t("theaterRegistration.steps.terms"), component: TermsStep }
    ];
    const CurrentStepComponent = steps[step - 1].component;

    if (submitSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }} className="h-20 w-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"><CheckCircle className="h-10 w-10 text-white" /></motion.div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t("theaterRegistration.success.title")}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{t("theaterRegistration.success.message")}</p>
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700"><p className="text-sm text-gray-500 dark:text-gray-400">{t("theaterRegistration.success.applicationId")}</p><p className="text-xl font-mono font-bold text-teal-600">TH-{Math.random().toString(36).substring(2, 10).toUpperCase()}</p><p className="text-xs text-gray-400 mt-2">{t("theaterRegistration.success.paymentId")}: {formData.paymentIntentId}</p></div>
                    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800"><p className="text-sm text-blue-600 dark:text-blue-400 flex items-center justify-center gap-2"><Mail className="h-4 w-4" /><span className="font-bold">{t("theaterRegistration.success.nextSteps").split(":")[0]}:</span> {t("theaterRegistration.success.nextSteps").split(":")[1]}</p></div>
                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700"><p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2"><AlertCircle className="h-4 w-4" /><span className="font-bold">{t("theaterRegistration.success.noRefundReminder").split(":")[0]}:</span> {t("theaterRegistration.success.noRefundReminder").split(":")[1]}</p></div>
                    <button onClick={() => window.location.href = "/"} className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white py-3 rounded-xl font-medium transition-all shadow-md hover:shadow-lg">{t("theaterRegistration.buttons.goHome")}</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
            <PaymentModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} onSuccess={handlePaymentSuccess} amount={299} formData={formData} />
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="inline-flex items-center justify-center h-20 w-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl mb-4 shadow-lg"><Theater className="h-10 w-10 text-white" /></motion.div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 dark:from-teal-400 dark:to-teal-600 bg-clip-text text-transparent">{t("theaterRegistration.title")}</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">{t("theaterRegistration.subtitle")}</p>
                    <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full border-2 border-gray-200 dark:border-gray-700"><Lock className="h-3 w-3 text-gray-600 dark:text-gray-400" /><span className="text-xs text-gray-600 dark:text-gray-400 font-bold">{t("theaterRegistration.feeNotice")}</span></div>
                </div>
                <div className="mb-8"><div className="flex items-center justify-between">{steps.map((s, idx) => (<div key={s.number} className="flex-1 relative"><div className={`flex items-center ${idx !== steps.length - 1 ? 'flex-1' : ''}`}><motion.div initial={false} animate={{ scale: s.number === step ? 1.1 : 1, backgroundColor: s.number < step ? '#14b8a6' : (s.number === step ? '#fff' : '#e5e7eb'), borderColor: s.number <= step ? '#14b8a6' : '#d1d5db' }} className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all z-10 ${s.number < step ? 'bg-teal-600 text-white border-teal-600' : s.number === step ? 'bg-white text-teal-600 border-teal-600 dark:bg-gray-800' : 'bg-gray-100 text-gray-400 border-gray-300 dark:bg-gray-700 dark:border-gray-600'}`}>{s.number < step ? <CheckCircle className="h-5 w-5" /> : s.number}</motion.div>{idx !== steps.length - 1 && (<motion.div initial={false} animate={{ backgroundColor: s.number < step ? '#14b8a6' : '#e5e7eb' }} className={`flex-1 h-0.5 mx-2 ${s.number < step ? 'bg-teal-600' : 'bg-gray-300 dark:bg-gray-600'}`} />)}</div><p className={`text-xs mt-2 text-center font-medium ${s.number === step ? 'text-teal-600' : 'text-gray-500'}`}>{s.title}</p></div>))}</div></div>
                <AnimatePresence mode="wait"><motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200 dark:border-gray-700">
                    {step === 6 ? <CurrentStepComponent agreedToTerms={agreedToTerms} setAgreedToTerms={setAgreedToTerms} agreedToMarketing={agreedToMarketing} setAgreedToMarketing={setAgreedToMarketing} agreedToNoRefund={agreedToNoRefund} setAgreedToNoRefund={setAgreedToNoRefund} formData={formData} setFormData={setFormData} errors={errors} />
                        : step === 4 ? <CurrentStepComponent formData={formData} setFormData={setFormData} errors={errors} handleFileUpload={handleFileUpload} fileInputRefs={fileInputRefs} />
                        : step === 3 ? <CurrentStepComponent formData={formData} setFormData={setFormData} errors={errors} handleInputChange={handleInputChange} handleCheckboxChange={handleCheckboxChange} handleLogoUpload={handleLogoUpload} logoInputRef={logoInputRef} />
                        : <CurrentStepComponent formData={formData} setFormData={setFormData} errors={errors} handleInputChange={handleInputChange} />
                    }
                    <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        {step > 1 && <motion.button whileHover={{ x: -2 }} whileTap={{ scale: 0.98 }} onClick={handleBack} className="px-6 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2 font-medium"><ChevronLeft className="h-4 w-4" /> {t("theaterRegistration.buttons.back")}</motion.button>}
                        {step < 6 ? <motion.button whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }} onClick={handleNext} className="ml-auto px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-medium transition-all flex items-center gap-2 shadow-md hover:shadow-lg">{t("theaterRegistration.buttons.continue")} <ChevronRight className="h-4 w-4" /></motion.button>
                            : <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSubmit} disabled={isSubmitting || !agreedToTerms || !agreedToNoRefund} className={`ml-auto px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 shadow-md ${isSubmitting || !agreedToTerms || !agreedToNoRefund ? 'bg-gray-400 cursor-not-allowed shadow-none' : !formData.paymentCompleted ? 'bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white hover:shadow-lg' : 'bg-gradient-to-r from-teal-600 to-purple-600 hover:from-teal-700 hover:to-purple-700 text-white hover:shadow-lg'}`}>
                                {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</> : <>{!formData.paymentCompleted ? <><CreditCard className="h-4 w-4" /> {t("theaterRegistration.buttons.payAndSubmit", { amount: 299 })}</> : <><Send className="h-4 w-4" /> {t("theaterRegistration.buttons.submitForReview")}</>}</>}
                            </motion.button>
                        }
                    </div>
                </motion.div></AnimatePresence>
                <p className="text-center text-xs text-gray-500 mt-6">{t("theaterRegistration.footerText")} <a href="#" className="text-teal-600 hover:underline font-medium">{t("theaterRegistration.footerTerms")}</a> {t("theaterRegistration.footerAnd")} <a href="#" className="text-teal-600 hover:underline font-medium">{t("theaterRegistration.footerPrivacy")}</a></p>
            </div>
        </div>
    );
};

export default TheaterRegistration;