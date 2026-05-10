// Frontend/src/pages/TheaterRegistration.tsx
import { useState, useRef, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Building2,
    FileText,
    Upload,
    CheckCircle,
    AlertCircle,
    ChevronRight,
    ChevronLeft,
    Award,
    Calendar,
    Shield,
    User,
    Image,
    FileCheck,
    Send,
    Loader2,
    Wallet,
    Receipt,
    ClipboardCheck,
    UserCheck,
    Ticket,
    Star,
    Users,
    ShieldCheck,
    CreditCard,
    Lock,
    X,
    Mail,
    Phone,
    Theater,
    Percent
} from "lucide-react";

// ============================================
// TYPES & INTERFACES
// ============================================

interface FormData {
    businessName: string;
    tradeName: string;
    businessType: string;
    businessLicense: string;
    taxId: string;
    yearsInOperation: string;
    businessDescription: string;
    ownerName: string;
    ownerEmail: string;
    ownerPhone: string;
    secondaryName: string;
    secondaryEmail: string;
    secondaryPhone: string;
    emergencyName: string;
    emergencyPhone: string;
    emergencyRelation: string;
    theaterName: string;
    theaterLogo: File | null;
    theaterDescription: string;
    theaterEmail: string;
    theaterPhone: string;
    totalHalls: string;
    city: string;
    region: string;
    address: string;
    documents: Record<string, File | null>;
    pricingModel: string;
    contractType: string;
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
}

// ============================================
// PAYMENT MODAL COMPONENT
// ============================================

const PaymentModal = ({ isOpen, onClose, onSuccess, amount }: PaymentModalProps) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const initializePayment = async () => {
        setIsProcessing(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsProcessing(false);
        onSuccess();
    };

    if (!isOpen) return null;

    const formattedAmount = new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB' }).format(amount);

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
                        <h3 className="text-lg font-bold text-white">Complete Payment</h3>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition"><X className="h-5 w-5 text-white" /></button>
                </div>
                <div className="p-6">
                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Amount to Pay</p>
                        <p className="text-3xl font-bold text-teal-600">{formattedAmount}</p>
                        <p className="text-xs text-gray-400 mt-1">This payment is non-refundable</p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 border-2 border-teal-600 bg-teal-50 dark:bg-teal-900/20 rounded-xl shadow-md cursor-pointer">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm"><CreditCard className="w-6 h-6 text-teal-600" /></div>
                            <div>
                                <span className="font-bold text-teal-700 dark:text-teal-300 block">Pay with Chapa</span>
                                <span className="text-xs text-teal-600 dark:text-teal-400">Secure online payment</span>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={initializePayment}
                            disabled={isProcessing}
                            className="w-full py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-semibold transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</>
                            ) : (
                                <><Lock className="h-4 w-4" /> Pay {formattedAmount}</>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// ============================================
// STEP COMPONENTS
// ============================================

interface StepProps {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    errors: Errors;
    handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const BusinessInfoStep = ({ formData, errors, handleInputChange }: StepProps) => {
    const businessTypes = [
        "Sole Proprietorship", "Partnership", "Limited Liability Company (LLC)",
        "Corporation", "Non-Profit", "Government"
    ];
    const yearsOptions = ["Less than 1 year", "1-2 years", "3-5 years", "5-10 years", "10+ years"];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg"><Building2 className="h-5 w-5 text-white" /></div>
                <div><h2 className="text-xl font-bold text-gray-900 dark:text-white">Business Information</h2><p className="text-sm text-gray-500 dark:text-gray-400">Enter your business details</p></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Legal Business Name <span className="text-red-500">*</span></label>
                    <input type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${errors.businessName ? 'border-red-500 bg-red-50' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'} dark:text-white`} />
                    {errors.businessName && <p className="text-xs text-red-500 mt-1">{errors.businessName}</p>}
                </div>
                <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Trade Name <span className="text-gray-400">(Optional)</span></label><input type="text" name="tradeName" value={formData.tradeName} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-800/50 dark:text-white" /></div>
                <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Business Type <span className="text-red-500">*</span></label>
                    <select name="businessType" value={formData.businessType} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-800/50 dark:text-white">
                        <option value="">Select Business Type</option>
                        {businessTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                    {errors.businessType && <p className="text-xs text-red-500 mt-1">{errors.businessType}</p>}
                </div>
                <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Business License <span className="text-red-500">*</span></label><input type="text" name="businessLicense" value={formData.businessLicense} onChange={handleInputChange} className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent ${errors.businessLicense ? 'border-red-500 bg-red-50' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'} dark:text-white`} />{errors.businessLicense && <p className="text-xs text-red-500 mt-1">{errors.businessLicense}</p>}</div>
                <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Tax ID <span className="text-red-500">*</span></label><input type="text" name="taxId" value={formData.taxId} onChange={handleInputChange} className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent ${errors.taxId ? 'border-red-500 bg-red-50' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'} dark:text-white`} />{errors.taxId && <p className="text-xs text-red-500 mt-1">{errors.taxId}</p>}</div>
                <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Years in Operation <span className="text-red-500">*</span></label>
                    <select name="yearsInOperation" value={formData.yearsInOperation} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-800/50 dark:text-white">
                        <option value="">Select Years</option>
                        {yearsOptions.map(years => <option key={years} value={years}>{years}</option>)}
                    </select>
                    {errors.yearsInOperation && <p className="text-xs text-red-500 mt-1">{errors.yearsInOperation}</p>}
                </div>
            </div>
            <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Business Description <span className="text-red-500">*</span></label><textarea name="businessDescription" rows={4} value={formData.businessDescription} onChange={handleInputChange} className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none ${errors.businessDescription ? 'border-red-500 bg-red-50' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'} dark:text-white`} /></div>
        </div>
    );
};

const ContactInfoStep = ({ formData, errors, handleInputChange }: StepProps) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg"><User className="h-5 w-5 text-white" /></div>
                <div><h2 className="text-xl font-bold text-gray-900 dark:text-white">Contact Information</h2><p className="text-sm text-gray-500 dark:text-gray-400">Primary and emergency contacts</p></div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/30 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-5"><div className="p-1.5 bg-teal-100 dark:bg-teal-900/30 rounded-lg"><UserCheck className="h-4 w-4 text-teal-600" /></div><h3 className="text-md font-semibold text-gray-900 dark:text-white">Primary Contact</h3></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full Name <span className="text-red-500">*</span></label><input type="text" name="ownerName" value={formData.ownerName} onChange={handleInputChange} className={`w-full px-4 py-3 border-2 rounded-xl ${errors.ownerName ? 'border-red-500 bg-red-50' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'} dark:text-white`} />{errors.ownerName && <p className="text-xs text-red-500 mt-1">{errors.ownerName}</p>}</div>
                    <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email <span className="text-red-500">*</span></label><input type="email" name="ownerEmail" value={formData.ownerEmail} onChange={handleInputChange} className={`w-full px-4 py-3 border-2 rounded-xl ${errors.ownerEmail ? 'border-red-500 bg-red-50' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'} dark:text-white`} />{errors.ownerEmail && <p className="text-xs text-red-500 mt-1">{errors.ownerEmail}</p>}</div>
                    <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Phone <span className="text-red-500">*</span></label><input type="tel" name="ownerPhone" value={formData.ownerPhone} onChange={handleInputChange} className={`w-full px-4 py-3 border-2 rounded-xl ${errors.ownerPhone ? 'border-red-500 bg-red-50' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'} dark:text-white`} />{errors.ownerPhone && <p className="text-xs text-red-500 mt-1">{errors.ownerPhone}</p>}</div>
                </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/30 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-5"><div className="p-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg"><Users className="h-4 w-4 text-gray-600" /></div><h3 className="text-md font-semibold text-gray-900 dark:text-white">Secondary Contact <span className="text-xs text-gray-400">(Optional)</span></h3></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name</label><input type="text" name="secondaryName" value={formData.secondaryName} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-teal-300 dark:bg-gray-800/50 dark:text-white" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label><input type="email" name="secondaryEmail" value={formData.secondaryEmail} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-teal-300 dark:bg-gray-800/50 dark:text-white" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone</label><input type="tel" name="secondaryPhone" value={formData.secondaryPhone} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-teal-300 dark:bg-gray-800/50 dark:text-white" /></div>
                </div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-6 border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 mb-5"><div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg"><AlertCircle className="h-4 w-4 text-red-500" /></div><h3 className="text-md font-semibold text-gray-900 dark:text-white">Emergency Contact</h3></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Name <span className="text-red-500">*</span></label><input type="text" name="emergencyName" value={formData.emergencyName} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-teal-300 dark:bg-gray-800/50 dark:text-white" />{errors.emergencyName && <p className="text-xs text-red-500 mt-1">{errors.emergencyName}</p>}</div>
                    <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Phone <span className="text-red-500">*</span></label><input type="tel" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-teal-300 dark:bg-gray-800/50 dark:text-white" />{errors.emergencyPhone && <p className="text-xs text-red-500 mt-1">{errors.emergencyPhone}</p>}</div>
                    <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Relationship</label><input type="text" name="emergencyRelation" value={formData.emergencyRelation} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-teal-300 dark:bg-gray-800/50 dark:text-white" /></div>
                </div>
            </div>
        </div>
    );
};

interface TheaterDetailsStepProps extends StepProps {
    handleLogoUpload: (e: ChangeEvent<HTMLInputElement>) => void;
    logoInputRef: React.RefObject<HTMLInputElement>;
}

const TheaterDetailsStep = ({ formData, setFormData, errors, handleInputChange, handleLogoUpload, logoInputRef }: TheaterDetailsStepProps) => {
    const cities = [
        "Addis Ababa", "Bahir Dar", "Dire Dawa", "Hawassa", "Mekelle", "Gondar",
        "Jimma", "Harar", "Adama", "Dessie", "Arba Minch", "Jijiga"
    ];
    const regions = [
        "Addis Ababa", "Oromia", "Amhara", "Tigray", "SNNPR", "Somali",
        "Benishangul-Gumuz", "Afar", "Harari", "Gambela", "Sidama"
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg"><Theater className="h-5 w-5 text-white" /></div>
                <div><h2 className="text-xl font-bold text-gray-900 dark:text-white">Theater Details</h2><p className="text-sm text-gray-500 dark:text-gray-400">Information about your theater</p></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2"><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Theater Name <span className="text-red-500">*</span></label><input type="text" name="theaterName" value={formData.theaterName} onChange={handleInputChange} className={`w-full px-4 py-3 border-2 rounded-xl ${errors.theaterName ? 'border-red-500 bg-red-50' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'} dark:text-white`} />{errors.theaterName && <p className="text-xs text-red-500 mt-1">{errors.theaterName}</p>}</div>
                <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Theater Logo</label><div className="flex items-center gap-4"><div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">{formData.theaterLogo ? <img src={URL.createObjectURL(formData.theaterLogo)} alt="Logo" className="w-full h-full object-cover rounded-xl" /> : <Image className="h-8 w-8 text-gray-400" />}</div><div><input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" /><button type="button" onClick={() => logoInputRef.current?.click()} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition">{formData.theaterLogo ? 'Change Logo' : 'Upload Logo'}</button></div></div></div>
                <div className="md:col-span-2"><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Theater Description <span className="text-red-500">*</span></label><textarea name="theaterDescription" rows={3} value={formData.theaterDescription} onChange={handleInputChange} className={`w-full px-4 py-3 border-2 rounded-xl resize-none ${errors.theaterDescription ? 'border-red-500 bg-red-50' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'} dark:text-white`} /></div>
                <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Theater Email <span className="text-red-500">*</span></label><div className="relative"><Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="email" name="theaterEmail" value={formData.theaterEmail} onChange={handleInputChange} className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl ${errors.theaterEmail ? 'border-red-500 bg-red-50' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'} dark:text-white`} /></div>{errors.theaterEmail && <p className="text-xs text-red-500 mt-1">{errors.theaterEmail}</p>}</div>
                <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Theater Phone <span className="text-red-500">*</span></label><div className="relative"><Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="tel" name="theaterPhone" value={formData.theaterPhone} onChange={handleInputChange} className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl ${errors.theaterPhone ? 'border-red-500 bg-red-50' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'} dark:text-white`} /></div>{errors.theaterPhone && <p className="text-xs text-red-500 mt-1">{errors.theaterPhone}</p>}</div>
                <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Number of Halls <span className="text-red-500">*</span></label><input type="number" name="totalHalls" value={formData.totalHalls} onChange={handleInputChange} className={`w-full px-4 py-3 border-2 rounded-xl ${errors.totalHalls ? 'border-red-500 bg-red-50' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'} dark:text-white`} min="1" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">City <span className="text-red-500">*</span></label><select name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 dark:bg-gray-800/50 dark:text-white"><option value="">Select City</option>{cities.map(city => <option key={city} value={city}>{city}</option>)}</select>{errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}</div>
                <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Region <span className="text-red-500">*</span></label><select name="region" value={formData.region} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 dark:bg-gray-800/50 dark:text-white"><option value="">Select Region</option>{regions.map(region => <option key={region} value={region}>{region}</option>)}</select>{errors.region && <p className="text-xs text-red-500 mt-1">{errors.region}</p>}</div>
                <div className="md:col-span-2"><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full Address <span className="text-red-500">*</span></label><input type="text" name="address" value={formData.address} onChange={handleInputChange} className={`w-full px-4 py-3 border-2 rounded-xl ${errors.address ? 'border-red-500 bg-red-50' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:bg-gray-800/50'} dark:text-white`} /></div>
            </div>
        </div>
    );
};

interface DocumentUploadStepProps {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    errors: Errors;
    handleFileUpload: (e: ChangeEvent<HTMLInputElement>, docType: string) => void;
    fileInputRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
}

const DocumentUploadStep = ({ formData, errors, handleFileUpload, fileInputRefs }: DocumentUploadStepProps) => {
    const documents = [
        { id: "license", name: "Business License", icon: FileText, required: true },
        { id: "taxCertificate", name: "Tax Certificate", icon: Receipt, required: true },
        { id: "ownerId", name: "Owner ID", icon: User, required: true },
        { id: "theaterPhotos", name: "Theater Photos", icon: Image, required: false },
        { id: "fireSafety", name: "Fire Safety Certificate", icon: Shield, required: false },
        { id: "healthPermit", name: "Health Permit", icon: ShieldCheck, required: false }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg"><FileCheck className="h-5 w-5 text-white" /></div>
                <div><h2 className="text-xl font-bold text-gray-900 dark:text-white">Document Upload</h2><p className="text-sm text-gray-500 dark:text-gray-400">Upload required documents</p></div>
            </div>
            <div className="space-y-4">
                {documents.map((doc) => {
                    const Icon = doc.icon;
                    const isUploaded = formData.documents?.[doc.id];
                    const hasError = errors[doc.id];
                    return (
                        <div key={doc.id} className={`border-2 rounded-2xl p-5 transition-all ${hasError ? 'border-red-500 bg-red-50' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300'}`}>
                            <div className="flex items-start justify-between flex-wrap gap-4">
                                <div className="flex items-start gap-4">
                                    <div className={`p-2.5 rounded-xl ${isUploaded ? 'bg-green-100 dark:bg-green-900/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
                                        <Icon className={`h-5 w-5 ${isUploaded ? 'text-green-600' : 'text-gray-500'}`} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{doc.name} {doc.required && <span className="text-red-500">*</span>}</h3>
                                        {isUploaded && <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Uploaded: {formData.documents[doc.id]?.name}</p>}
                                    </div>
                                </div>
                                <div>
                                    <input ref={el => { if (el) fileInputRefs.current[doc.id] = el; }} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileUpload(e, doc.id)} className="hidden" />
                                    <button type="button" onClick={() => fileInputRefs.current[doc.id]?.click()} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${isUploaded ? 'border-2 border-green-500 text-green-600 hover:bg-green-50' : 'bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800 shadow-md'}`}>
                                        <Upload className="h-4 w-4" />{isUploaded ? 'Replace' : 'Upload'}
                                    </button>
                                </div>
                            </div>
                            {hasError && <p className="text-xs text-red-500 mt-3">{errors[doc.id]}</p>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const PricingPlanStep = ({ formData, setFormData, errors }: StepProps) => {
    const [selectedModel, setSelectedModel] = useState(formData.pricingModel || null);

    const pricingModels = [
        { id: "per_ticket", name: "Per Ticket Selling", description: "Pay commission on each ticket sold", icon: Ticket, rate: "8% commission", note: "No monthly fees — pay only when you sell", gradient: "from-emerald-500 to-teal-500" },
        { id: "contract", name: "Contract Plan", description: "Fixed subscription", icon: Calendar, rate: "From ETB 6,000", note: "Fixed subscription fee", gradient: "from-blue-500 to-indigo-500" }
    ];

    const contractTypes = [
        { id: "monthly", name: "Monthly", icon: Calendar, price: 6000 },
        { id: "quarterly", name: "Quarterly", icon: Award, price: 8000 },
        { id: "yearly", name: "Yearly", icon: Star, price: 6000 }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg"><Wallet className="h-5 w-5 text-white" /></div>
                <div><h2 className="text-xl font-bold text-gray-900 dark:text-white">Pricing Plan</h2><p className="text-sm text-gray-500 dark:text-gray-400">Select your preferred pricing model</p></div>
            </div>

            <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Select Pricing Model <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pricingModels.map((model) => {
                        const Icon = model.icon;
                        const isSelected = selectedModel === model.id;
                        return (
                            <div key={model.id} className={`cursor-pointer rounded-2xl border-2 p-5 transition-all ${isSelected ? `border-teal-500 bg-gradient-to-br ${model.gradient} bg-opacity-10 shadow-lg` : 'border-gray-200 dark:border-gray-700 hover:border-teal-300'}`} onClick={() => { setSelectedModel(model.id); setFormData(prev => ({ ...prev, pricingModel: model.id, contractType: "" })); }}>
                                <div className={`p-2 rounded-xl inline-block ${isSelected ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-800'} mb-3`}><Icon className={`h-6 w-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} /></div>
                                <h3 className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-gray-900'}`}>{model.name}</h3>
                                <p className={`text-sm mt-1 ${isSelected ? 'text-white/90' : 'text-gray-500'}`}>{model.description}</p>
                                <p className={`text-sm font-bold mt-3 ${isSelected ? 'text-white' : 'text-teal-600'}`}>{model.rate}</p>
                                <p className={`text-xs mt-1 font-medium ${isSelected ? 'text-white/80' : 'text-emerald-600'}`}>{model.note}</p>
                            </div>
                        );
                    })}
                </div>
                {errors.pricingModel && <p className="text-xs text-red-500 mt-2">{errors.pricingModel}</p>}
            </div>

            {selectedModel === "per_ticket" && (
                <div className="mt-6">
                    <div className="flex items-center gap-2 mb-4"><Percent className="h-5 w-5 text-teal-600" /><h3 className="text-lg font-bold text-gray-900">Commission Agreement</h3></div>
                    <div className="bg-gray-50 dark:bg-gray-800/30 rounded-2xl p-6 border border-gray-200">
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-2">Pay commission on each ticket sold — no monthly fees, pay only when you sell!</p>
                            <div className="inline-block bg-teal-50 dark:bg-teal-900/30 rounded-xl px-8 py-5">
                                <p className="text-sm text-gray-500">Commission Rate</p>
                                <p className="text-5xl font-bold text-teal-600">8%</p>
                                <p className="text-xs text-gray-400 mt-2">per ticket sold</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {selectedModel === "contract" && (
                <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Select Contract Type <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {contractTypes.map((contract) => {
                            const Icon = contract.icon;
                            const isSelected = formData.contractType === contract.id;
                            return (
                                <div key={contract.id} className={`cursor-pointer rounded-2xl border-2 p-5 transition-all ${isSelected ? 'border-teal-500 bg-teal-500/10 shadow-lg' : 'border-gray-200 dark:border-gray-700 hover:border-teal-300'}`} onClick={() => setFormData(prev => ({ ...prev, contractType: contract.id }))}>
                                    <div className={`p-2 rounded-xl inline-block ${isSelected ? 'bg-teal-100' : 'bg-gray-100 dark:bg-gray-800'} mb-3`}><Icon className={`h-5 w-5 ${isSelected ? 'text-teal-600' : 'text-gray-500'}`} /></div>
                                    <h4 className={`font-bold ${isSelected ? 'text-teal-600' : 'text-gray-900'}`}>{contract.name}</h4>
                                    <div className="mt-2">
                                        <p className="text-2xl font-bold text-gray-900">{new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB' }).format(contract.price)}</p>
                                        <p className="text-xs text-gray-500 mt-1">per {contract.id}</p>
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

const TermsStep = ({ agreedToTerms, setAgreedToTerms, agreedToMarketing, setAgreedToMarketing, agreedToNoRefund, setAgreedToNoRefund, formData, setFormData, errors }: TermsStepProps) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg"><ClipboardCheck className="h-5 w-5 text-white" /></div>
                <div><h2 className="text-xl font-bold text-gray-900 dark:text-white">Terms & Agreement</h2><p className="text-sm text-gray-500 dark:text-gray-400">Review and accept terms</p></div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/30 rounded-2xl p-6 border border-gray-200">
                <h3 className="font-bold text-lg text-gray-900 mb-4">Theater Registration Agreement</h3>
                <div className="space-y-3 text-sm text-gray-600">
                    <p>By registering your theater on our platform, you agree to the following terms:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>All information provided is accurate and complete</li>
                        <li>You authorize us to verify the provided documents</li>
                        <li>Commission payments will be deducted automatically from ticket sales</li>
                        <li>You agree to our refund and cancellation policies</li>
                        <li>You are responsible for maintaining accurate show schedules</li>
                        <li>Ticket prices must be clearly displayed to customers</li>
                        <li>You agree to our customer service standards</li>
                        <li>The platform reserves the right to suspend accounts for policy violations</li>
                        <li>All payments are processed securely through our payment partners</li>
                        <li>This agreement is governed by Ethiopian law</li>
                    </ul>
                    {formData.pricingModel === "per_ticket" && (
                        <div className="mt-4 p-4 bg-teal-50 rounded-xl border border-teal-200">
                            <p className="text-teal-800 text-sm font-medium">Commission Agreement</p>
                            <p className="text-xs text-teal-600 mt-1">By selecting Per Ticket Selling, you agree to pay 8% commission on each ticket sold. Commissions are calculated automatically and deducted from ticket sales. No monthly fees apply.</p>
                        </div>
                    )}
                    {formData.pricingModel === "contract" && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                            <p className="text-blue-800 text-sm font-medium">Contract Agreement</p>
                            <p className="text-xs text-blue-600 mt-1">By selecting Contract Plan, you agree to pay the selected subscription fee. Payments are processed at the start of each billing cycle.</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer"><input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="mt-1 h-5 w-5 text-teal-600 rounded" /><div><p className="text-sm font-semibold text-gray-900">I confirm that all information provided is accurate</p><p className="text-xs text-gray-500">Falsifying information may result in account termination</p></div></label>
                <label className="flex items-start gap-3 cursor-pointer"><input type="checkbox" checked={agreedToMarketing} onChange={(e) => { setAgreedToMarketing(e.target.checked); setFormData(prev => ({ ...prev, acceptMarketing: e.target.checked })); }} className="mt-1 h-5 w-5 text-teal-600 rounded" /><div><p className="text-sm font-semibold text-gray-900">I agree to receive marketing communications</p><p className="text-xs text-gray-500">You can unsubscribe at any time</p></div></label>
                <label className="flex items-start gap-3 cursor-pointer"><input type="checkbox" checked={agreedToNoRefund} onChange={(e) => setAgreedToNoRefund(e.target.checked)} className="mt-1 h-5 w-5 text-teal-600 rounded" /><div><p className="text-sm font-semibold text-gray-900">I acknowledge that registration fees are non-refundable</p><p className="text-xs text-gray-500">All payments made are final</p></div></label>
            </div>
            {(errors.terms || errors.noRefund) && <p className="text-xs text-red-500 mt-2">Please accept all required terms to continue</p>}
        </div>
    );
};

// ============================================
// MAIN REGISTRATION COMPONENT
// ============================================

const TheaterRegistration = () => {
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
        ownerName: "", ownerEmail: "", ownerPhone: "", secondaryName: "", secondaryEmail: "", secondaryPhone: "",
        emergencyName: "", emergencyPhone: "", emergencyRelation: "", theaterName: "", theaterLogo: null, theaterDescription: "", theaterEmail: "", theaterPhone: "",
        totalHalls: "", city: "", region: "", address: "", documents: {},
        pricingModel: "", contractType: "", acceptMarketing: false, paymentCompleted: false, paymentIntentId: ""
    });

    const getPaymentAmount = (): number => {
        if (formData.pricingModel === "contract" && formData.contractType) {
            const prices: Record<string, number> = { monthly: 6000, quarterly: 8000, yearly: 6000 };
            return prices[formData.contractType] || 0;
        }
        return 0;
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { setErrors(prev => ({ ...prev, theaterLogo: "Logo must be less than 2MB" })); return; }
            setFormData(prev => ({ ...prev, theaterLogo: file }));
            setErrors(prev => ({ ...prev, theaterLogo: "" }));
        }
    };

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>, docType: string) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) { setErrors(prev => ({ ...prev, [docType]: "File must be less than 10MB" })); return; }
            setFormData(prev => ({ ...prev, documents: { ...prev.documents, [docType]: file } }));
            setErrors(prev => ({ ...prev, [docType]: "" }));
        }
    };

    const handlePaymentSuccess = () => {
        setFormData(prev => ({ ...prev, paymentCompleted: true, paymentIntentId: `pi_${Date.now()}_${Math.random().toString(36).substring(7)}` }));
        setShowPaymentModal(false);
        handleSubmitFinal();
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
            if (!formData.ownerEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.ownerEmail = "Valid email is required";
            if (!formData.ownerPhone.trim()) newErrors.ownerPhone = "Phone number is required";
            if (!formData.emergencyName.trim()) newErrors.emergencyName = "Emergency contact name is required";
            if (!formData.emergencyPhone.trim()) newErrors.emergencyPhone = "Emergency phone is required";
        } else if (step === 3) {
            if (!formData.theaterName.trim()) newErrors.theaterName = "Theater name is required";
            if (!formData.theaterDescription.trim()) newErrors.theaterDescription = "Theater description is required";
            if (!formData.theaterEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.theaterEmail = "Valid email is required";
            if (!formData.theaterPhone.trim()) newErrors.theaterPhone = "Phone number is required";
            if (!formData.totalHalls || parseInt(formData.totalHalls) < 1) newErrors.totalHalls = "Valid number of halls is required";
            if (!formData.city) newErrors.city = "City is required";
            if (!formData.region) newErrors.region = "Region is required";
            if (!formData.address.trim()) newErrors.address = "Address is required";
        } else if (step === 4) {
            if (!formData.documents.license) newErrors.license = "Business license is required";
            if (!formData.documents.taxCertificate) newErrors.taxCertificate = "Tax certificate is required";
            if (!formData.documents.ownerId) newErrors.ownerId = "Owner ID is required";
        } else if (step === 5) {
            if (!formData.pricingModel) newErrors.pricingModel = "Please select a pricing model";
            if (formData.pricingModel === "contract" && !formData.contractType) newErrors.contractType = "Please select a contract type";
        } else if (step === 6) {
            if (!agreedToTerms) newErrors.terms = "You must agree to the terms";
            if (!agreedToNoRefund) newErrors.noRefund = "You must acknowledge the no-refund policy";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep()) {
            setStep(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmitFinal = async () => {
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("Registration Data:", formData);
        setIsSubmitting(false);
        setSubmitSuccess(true);
    };

    const handleSubmit = () => {
        if (!validateStep()) return;
        
        if (formData.pricingModel === "contract" && !formData.paymentCompleted && getPaymentAmount() > 0) {
            setShowPaymentModal(true);
            return;
        }
        handleSubmitFinal();
    };

    const stepsList = [
        { number: 1, title: "Business Info", component: BusinessInfoStep },
        { number: 2, title: "Contact Info", component: ContactInfoStep },
        { number: 3, title: "Theater Details", component: TheaterDetailsStep },
        { number: 4, title: "Documents", component: DocumentUploadStep },
        { number: 5, title: "Pricing Plan", component: PricingPlanStep },
        { number: 6, title: "Terms", component: TermsStep }
    ];

    const CurrentStepComponent = stepsList[step - 1].component;
    const paymentAmount = getPaymentAmount();

    if (submitSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="h-20 w-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"><CheckCircle className="h-10 w-10 text-white" /></motion.div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Submitted!</h2>
                    <p className="text-gray-600 mb-6">Your theater registration has been received. Our team will review your application and contact you within 2-3 business days.</p>
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <p className="text-sm text-gray-500">Application ID</p>
                        <p className="text-xl font-mono font-bold text-teal-600">TH-{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
                    </div>
                    <button onClick={() => window.location.href = "/"} className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white py-3 rounded-xl font-medium">Go to Homepage</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
            <PaymentModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} onSuccess={handlePaymentSuccess} amount={paymentAmount} />
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center h-20 w-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl mb-4 shadow-lg"><Theater className="h-10 w-10 text-white" /></div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">Theater Registration</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Join our platform and start selling tickets</p>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {stepsList.map((s, idx) => (
                            <div key={s.number} className="flex-1 relative">
                                <div className="flex items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all z-10 ${step > s.number ? 'bg-teal-600 text-white border-teal-600' : step === s.number ? 'bg-white text-teal-600 border-teal-600 dark:bg-gray-800' : 'bg-gray-100 text-gray-400 border-gray-300 dark:bg-gray-700 dark:border-gray-600'}`}>
                                        {step > s.number ? <CheckCircle className="h-5 w-5" /> : s.number}
                                    </div>
                                    {idx !== stepsList.length - 1 && (
                                        <div className={`flex-1 h-0.5 mx-2 ${step > s.number ? 'bg-teal-600' : 'bg-gray-300 dark:bg-gray-600'}`} />
                                    )}
                                </div>
                                <p className={`text-xs mt-2 text-center font-medium ${step === s.number ? 'text-teal-600' : 'text-gray-500'}`}>{s.title}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200 dark:border-gray-700">
                        {step === 6 ? (
                            <TermsStep 
                                agreedToTerms={agreedToTerms} setAgreedToTerms={setAgreedToTerms}
                                agreedToMarketing={agreedToMarketing} setAgreedToMarketing={setAgreedToMarketing}
                                agreedToNoRefund={agreedToNoRefund} setAgreedToNoRefund={setAgreedToNoRefund}
                                formData={formData} setFormData={setFormData} errors={errors}
                            />
                        ) : step === 4 ? (
                            <DocumentUploadStep formData={formData} setFormData={setFormData} errors={errors} handleFileUpload={handleFileUpload} fileInputRefs={fileInputRefs} />
                        ) : step === 3 ? (
                            <TheaterDetailsStep formData={formData} setFormData={setFormData} errors={errors} handleInputChange={handleInputChange} handleLogoUpload={handleLogoUpload} logoInputRef={logoInputRef} />
                        ) : step === 2 ? (
                            <ContactInfoStep formData={formData} setFormData={setFormData} errors={errors} handleInputChange={handleInputChange} />
                        ) : (
                            <BusinessInfoStep formData={formData} setFormData={setFormData} errors={errors} handleInputChange={handleInputChange} />
                        )}
                        
                        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                            {step > 1 && (
                                <motion.button whileHover={{ x: -2 }} whileTap={{ scale: 0.98 }} onClick={handleBack} className="px-6 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2 font-medium">
                                    <ChevronLeft className="h-4 w-4" /> Back
                                </motion.button>
                            )}
                            {step < 6 ? (
                                <motion.button whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }} onClick={handleNext} className="ml-auto px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-medium transition-all flex items-center gap-2 shadow-md">
                                    Continue <ChevronRight className="h-4 w-4" />
                                </motion.button>
                            ) : (
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSubmit} disabled={isSubmitting || !agreedToTerms || !agreedToNoRefund || (formData.pricingModel === "contract" && !formData.contractType)} className={`ml-auto px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 shadow-md ${isSubmitting || !agreedToTerms || !agreedToNoRefund || (formData.pricingModel === "contract" && !formData.contractType) ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white hover:shadow-lg'}`}>
                                    {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</> : formData.pricingModel === "per_ticket" ? <><Send className="h-4 w-4" /> Submit Registration</> : <><CreditCard className="h-4 w-4" /> Pay {new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB' }).format(paymentAmount)} & Submit</>}
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default TheaterRegistration;