// src/pages/Admin/theaters/AddTheater.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Mail, User, Phone, Lock, FileText, Upload, CheckCircle, AlertCircle,
    ChevronRight, ChevronLeft, Theater, Calendar, Ticket, Award, Star,
    Loader2, FileCheck, Receipt, AlertTriangle, Check, Eye, EyeOff,
    TrendingUp, Percent, FileSignature, UserPlus, Send, Building2, MapPin,
    CreditCard, Wallet, ClipboardCheck
} from 'lucide-react';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';
import supabase from '@/config/supabaseClient';

interface AddTheaterProps {
    onSubmit?: (values: any) => void;
    onClose: () => void;
    onTheaterAdded?: () => void;
    initialValues?: any;
    formTitle?: string;
}

interface FormData {
    // Step 1: Owner Account
    ownerFullName: string;
    ownerEmail: string;
    ownerPhone: string;
    ownerPassword: string;
    ownerConfirmPassword: string;
    ownerNationalId: string;      // Added for owners table
    ownerTinNumber: string;        // Added for owners table

    // Step 2: Theater Information
    theaterName: string;
    businessType: string;
    businessLicenseNumber: string;
    taxId: string;
    yearsInOperation: string;
    city: string;
    region: string;
    fullAddress: string;
    theaterDescription: string;
    totalHalls: string;

    // Step 3: Documents
    documents: {
        businessLicense: File | null;
        taxCertificate: File | null;
        ownerIdCard: File | null;
    };

    // Step 4: Pricing & Terms
    pricingModel: string;
    contractType: string;
    licenseExpiryDate: string;
    agreedToTerms: boolean;
    agreedToNoRefund: boolean;
}

interface Errors {
    [key: string]: string;
}

interface PeriodicRental {
    id: string;
    name: string;
    duration_months: number;
    rental_fee: number;
    description: string;
    is_active: boolean;
    popular: boolean;
}

// City-Region mapping
const CITY_REGION_MAP: Record<string, string[]> = {
    Oromia: ["Adama", "Jimma", "Bishoftu", "Ambo", "Shashamane", "Nekemte"],
    Amhara: ["Gondar", "Bahir Dar", "Dessie", "Debre Markos", "Lalibela"],
    Tigray: ["Mekelle", "Adwa", "Axum", "Shire"],
    Sidama: ["Hawassa", "Yirgalem", "Wendo"],
    Somali: ["Jijiga", "Gode", "Kebri Dahar"],
    Harari: ["Harar"],
    "Addis Ababa": ["Addis Ababa"],
    "Dire Dawa": ["Dire Dawa"],
    Afar: ["Semera", "Asayita"],
    "Benishangul-Gumuz": ["Assosa", "Metekel"],
    Gambela: ["Gambela"],
    "South West Ethiopia": ["Bonga", "Mizan Teferi"],
    "Southern Nations": ["Arba Minch", "Sodo", "Wolaita Sodo"],
};

const getCitiesForRegion = (region: string): string[] => {
    return CITY_REGION_MAP[region] || [];
};

const REGIONS = Object.keys(CITY_REGION_MAP);

const BUSINESS_TYPES = [
    "Sole Proprietorship",
    "Partnership",
    "LLC",
    "Corporation",
    "Non-Profit",
    "Government",
];

const YEARS_OPTIONS = [
    "Less than 1 year",
    "1-3 years",
    "3-5 years",
    "5-10 years",
    "10+ years",
];

const BUSINESS_TYPE_MAP: Record<string, string> = {
    "Sole Proprietorship": "sole_proprietorship",
    Partnership: "partnership",
    LLC: "llc",
    Corporation: "corporation",
    "Non-Profit": "non_profit",
    Government: "government",
};

const AddTheater: React.FC<AddTheaterProps> = ({
    onSubmit,
    onClose,
    onTheaterAdded,
    initialValues = {},
    formTitle = 'Register New Theater'
}) => {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Errors>({});
    const [duplicateError, setDuplicateError] = useState<string | null>(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
    
    // State for dynamic pricing data from database
    const [commissionRate, setCommissionRate] = useState<number>(8);
    const [periodicRentals, setPeriodicRentals] = useState<PeriodicRental[]>([]);
    const [isLoadingPricing, setIsLoadingPricing] = useState(true);

    const [formData, setFormData] = useState<FormData>({
        ownerFullName: "",
        ownerEmail: "",
        ownerPhone: "",
        ownerPassword: "",
        ownerConfirmPassword: "",
        ownerNationalId: "",
        ownerTinNumber: "",
        theaterName: "",
        businessType: "",
        businessLicenseNumber: "",
        taxId: "",
        yearsInOperation: "",
        city: "",
        region: "",
        fullAddress: "",
        theaterDescription: "",
        totalHalls: "",
        documents: {
            businessLicense: null,
            taxCertificate: null,
            ownerIdCard: null,
        },
        pricingModel: "",
        contractType: "",
        licenseExpiryDate: "",
        agreedToTerms: false,
        agreedToNoRefund: false,
    });

    // Fetch commission rate and periodic rentals from database
    useEffect(() => {
        const fetchPricingData = async () => {
            setIsLoadingPricing(true);
            try {
                // Fetch active commission agreement
                const { data: commissionData, error: commissionError } = await supabase
                    .from("commission_agreements")
                    .select("commission_rate")
                    .eq("is_active", true)
                    .maybeSingle();

                if (commissionError) {
                    console.error("Error fetching commission rate:", commissionError);
                } else if (commissionData) {
                    setCommissionRate(commissionData.commission_rate);
                }

                // Fetch active periodic rentals
                const { data: rentalsData, error: rentalsError } = await supabase
                    .from("periodic_rentals")
                    .select("*")
                    .eq("is_active", true)
                    .order("duration_months", { ascending: true });

                if (rentalsError) {
                    console.error("Error fetching periodic rentals:", rentalsError);
                } else if (rentalsData) {
                    setPeriodicRentals(rentalsData);
                }
            } catch (error) {
                console.error("Error fetching pricing data:", error);
            } finally {
                setIsLoadingPricing(false);
            }
        };

        fetchPricingData();
    }, []);

    const steps = [
        { number: 1, title: "Owner Account", icon: UserPlus },
        { number: 2, title: "Theater Info", icon: Theater },
        { number: 3, title: "Documents", icon: FileCheck },
        { number: 4, title: "Pricing & Terms", icon: FileSignature },
    ];

    const availableCities = formData.region ? getCitiesForRegion(formData.region) : [];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        if (name === "region") {
            setFormData(prev => ({ ...prev, city: "" }));
        }

        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
        if (duplicateError) setDuplicateError(null);
    };

    const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, [docType]: "File size must be less than 10MB" }));
                return;
            }
            setFormData(prev => ({
                ...prev,
                documents: { ...prev.documents, [docType]: file }
            }));
            setErrors(prev => ({ ...prev, [docType]: "" }));
        }
    };

    const validateEthiopianPhone = (phone: string): boolean => {
        const ethiopianPhoneRegex = /^(09|07|\+2519|2519)[0-9]{8}$/;
        return ethiopianPhoneRegex.test(phone);
    };

    const validateStep = (): boolean => {
        const newErrors: Errors = {};
        
        if (step === 1) {
            if (!formData.ownerFullName.trim()) newErrors.ownerFullName = "Full name is required";
            if (!formData.ownerEmail.trim()) newErrors.ownerEmail = "Email is required";
            else if (!formData.ownerEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.ownerEmail = "Please enter a valid email address";
            if (!formData.ownerPhone.trim()) newErrors.ownerPhone = "Phone number is required";
            else if (!validateEthiopianPhone(formData.ownerPhone)) newErrors.ownerPhone = "Valid Ethiopian phone number is required (e.g., 0912345678)";
            if (!formData.ownerPassword.trim()) newErrors.ownerPassword = "Password is required";
            else if (formData.ownerPassword.length < 6) newErrors.ownerPassword = "Password must be at least 6 characters";
            if (!formData.ownerConfirmPassword.trim()) newErrors.ownerConfirmPassword = "Please confirm your password";
            else if (formData.ownerPassword !== formData.ownerConfirmPassword) newErrors.ownerConfirmPassword = "Passwords do not match";
            if (!formData.ownerNationalId.trim()) newErrors.ownerNationalId = "National ID is required";
        } 
        else if (step === 2) {
            if (!formData.theaterName.trim()) newErrors.theaterName = "Theater name is required";
            if (!formData.businessType) newErrors.businessType = "Business type is required";
            if (!formData.businessLicenseNumber.trim()) newErrors.businessLicenseNumber = "Business license number is required";
            if (!formData.taxId.trim()) newErrors.taxId = "Tax ID is required";
            if (!formData.yearsInOperation) newErrors.yearsInOperation = "Years in operation is required";
            if (!formData.region) newErrors.region = "Region is required";
            if (!formData.city) newErrors.city = "City is required";
            if (!formData.fullAddress.trim()) newErrors.fullAddress = "Full address is required";
            if (!formData.theaterDescription.trim()) newErrors.theaterDescription = "Theater description is required";
            if (!formData.totalHalls || parseInt(formData.totalHalls) < 1) newErrors.totalHalls = "Number of halls must be at least 1";
        } 
        else if (step === 3) {
            if (!formData.documents.businessLicense) newErrors.businessLicense = "Business license document is required";
            if (!formData.documents.taxCertificate) newErrors.taxCertificate = "Tax certificate is required";
            if (!formData.documents.ownerIdCard) newErrors.ownerIdCard = "Owner ID card is required";
        }
        else if (step === 4) {
            if (!formData.pricingModel) newErrors.pricingModel = "Please select a pricing model";
            if (formData.pricingModel === "subscription" && !formData.contractType) newErrors.contractType = "Please select a subscription plan";
            if (formData.pricingModel === "subscription" && !formData.licenseExpiryDate) {
                newErrors.licenseExpiryDate = "License expiry date is required for subscription plan";
            }
            if (!formData.agreedToTerms) newErrors.terms = "You must confirm that the information provided is accurate";
            if (!formData.agreedToNoRefund) newErrors.noRefund = "You must acknowledge the no-refund policy";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep()) setStep(prev => prev + 1);
    };

    const handleBack = () => setStep(prev => prev - 1);

    // Check for duplicates before submission
    const checkDuplicates = async () => {
        const { data: existingUser } = await supabase
            .from("users")
            .select("email")
            .eq("email", formData.ownerEmail)
            .maybeSingle();

        if (existingUser) {
            throw new Error(`Email "${formData.ownerEmail}" is already registered.`);
        }

        const { data: existingPhone } = await supabase
            .from("users")
            .select("phone")
            .eq("phone", formData.ownerPhone)
            .maybeSingle();

        if (existingPhone) {
            throw new Error(`Phone number "${formData.ownerPhone}" is already registered.`);
        }

        const { data: existingLicense } = await supabase
            .from("theaters")
            .select("business_license_number")
            .eq("business_license_number", formData.businessLicenseNumber)
            .maybeSingle();

        if (existingLicense) {
            throw new Error(`Business license number "${formData.businessLicenseNumber}" is already registered.`);
        }

        const { data: existingTaxId } = await supabase
            .from("theaters")
            .select("tax_id")
            .eq("tax_id", formData.taxId)
            .maybeSingle();

        if (existingTaxId) {
            throw new Error(`Tax ID "${formData.taxId}" is already registered.`);
        }

        const { data: existingTheaterName } = await supabase
            .from("theaters")
            .select("legal_business_name")
            .eq("legal_business_name", formData.theaterName)
            .maybeSingle();

        if (existingTheaterName) {
            throw new Error(`Theater name "${formData.theaterName}" is already taken.`);
        }

        const { data: existingNationalId } = await supabase
            .from("owners")
            .select("national_id")
            .eq("national_id", formData.ownerNationalId)
            .maybeSingle();

        if (existingNationalId) {
            throw new Error(`National ID "${formData.ownerNationalId}" is already registered.`);
        }

        return true;
    };

    const uploadFile = async (file: File | null, filePath: string, bucket: string): Promise<string | null> => {
        if (!file) return null;
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${filePath}_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(fileName, file);
        
        if (uploadError) {
            console.error(`Error uploading to ${bucket}:`, uploadError);
            return null;
        }
        
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);
        
        return publicUrl;
    };

    // Create owner, theater, and contract
    const createRegistration = async () => {
        await checkDuplicates();

        // Create user account
        const userId = crypto.randomUUID();
        const { error: userError } = await supabase.from("users").insert({
            id: userId,
            email: formData.ownerEmail,
            phone: formData.ownerPhone,
            full_name: formData.ownerFullName,
            role: "theater_owner",
            status: "active",
            password: formData.ownerPassword,
        });

        if (userError) {
            if (userError.code === "23505") {
                if (userError.message.includes("email")) {
                    throw new Error(`Email "${formData.ownerEmail}" is already registered.`);
                }
                if (userError.message.includes("phone")) {
                    throw new Error(`Phone number "${formData.ownerPhone}" is already registered.`);
                }
            }
            throw new Error(`Failed to create owner account: ${userError.message}`);
        }

        // Upload documents
        const theaterId = crypto.randomUUID();
        const ownerId = crypto.randomUUID();
        
        const licenseDocUrl = await uploadFile(
            formData.documents.businessLicense, 
            `theaters/${theaterId}/license`, 
            "documents"
        );
        
        const taxDocUrl = await uploadFile(
            formData.documents.taxCertificate, 
            `theaters/${theaterId}/tax`, 
            "documents"
        );
        
        // Upload owner ID card to storage (optional - store URL in business_license_url or keep separate)
        const ownerIdCardUrl = await uploadFile(
            formData.documents.ownerIdCard, 
            `owners/${ownerId}/id_card`, 
            "owners_id_cards"
        );

        // Create owner record - matching your actual schema
        const mappedBusinessType = BUSINESS_TYPE_MAP[formData.businessType] || "sole_proprietorship";
        const yearsValue = parseInt(formData.yearsInOperation) || 1;

        const { error: ownerError } = await supabase.from("owners").insert({
            id: ownerId,
            user_id: userId,
            national_id: formData.ownerNationalId,
            tin_number: formData.ownerTinNumber || null,
            business_name: formData.theaterName,
            business_type: mappedBusinessType,
            years_of_experience: yearsValue,
            physical_address: formData.fullAddress,
            city: formData.city,
            verification_status: "verified",
            verified_at: new Date().toISOString(),
            // business_license_url can store the ID card URL or license URL
            business_license_url: ownerIdCardUrl,
        });

        if (ownerError) {
            console.error("Owner insert error:", ownerError);
            throw new Error(`Failed to create owner record: ${ownerError.message}`);
        }

        // Create theater - APPROVED IMMEDIATELY
        const { error: theaterError } = await supabase.from("theaters").insert({
            id: theaterId,
            legal_business_name: formData.theaterName,
            email: formData.ownerEmail,
            phone: formData.ownerPhone,
            business_type: formData.businessType,
            business_license_number: formData.businessLicenseNumber,
            license_expiry_date: formData.licenseExpiryDate || null,
            license_status: "active",
            license_document_url: licenseDocUrl,
            tax_id: formData.taxId,
            tax_registration_certificate_path: taxDocUrl,
            city: formData.city,
            address: formData.fullAddress,
            description: formData.theaterDescription,
            total_halls: parseInt(formData.totalHalls) || 0,
            status: "approved",
            is_approved: true,
            owner_user_id: userId,
            country: "Ethiopia",
            subscription_status: "active",
        });

        if (theaterError) {
            if (theaterError.code === "23505") {
                if (theaterError.message.includes("business_license_number")) {
                    throw new Error(`Business license number "${formData.businessLicenseNumber}" is already registered.`);
                }
                if (theaterError.message.includes("tax_id")) {
                    throw new Error(`Tax ID "${formData.taxId}" is already registered.`);
                }
                if (theaterError.message.includes("legal_business_name")) {
                    throw new Error(`Theater name "${formData.theaterName}" is already taken.`);
                }
            }
            throw new Error(`Failed to create theater: ${theaterError.message}`);
        }

        // Create contract
        const contractNumber = `CTR-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        let basePrice = 0;
        let paymentFrequency = null;
        let commissionRateValue = 0;

        if (formData.pricingModel === "per_ticket") {
            basePrice = 0;
            paymentFrequency = "per_ticket";
            commissionRateValue = commissionRate;
        } else if (formData.pricingModel === "subscription") {
            const selectedRental = periodicRentals.find(rental => rental.id === formData.contractType);
            basePrice = selectedRental?.rental_fee || 0;
            paymentFrequency = selectedRental?.duration_months === 1 ? "monthly" 
                : selectedRental?.duration_months === 3 ? "quarterly" 
                : "yearly";
            commissionRateValue = 0;
        }

        const { error: contractError } = await supabase.from("owners_contracts").insert({
            owner_id: ownerId,
            theater_id: theaterId,
            contract_number: contractNumber,
            contract_type: formData.pricingModel === "per_ticket" ? "per_ticket" : "subscription",
            subscription_plan: formData.pricingModel === "subscription" ? formData.contractType : null,
            base_price: basePrice,
            discounted_price: null,
            discount_percent: 0,
            commission_rate: commissionRateValue,
            contract_start_date: new Date().toISOString().split("T")[0],
            payment_frequency: paymentFrequency,
            payment_status: "pending",
            status: "active",
            terms_accepted_at: new Date().toISOString(),
        });

        if (contractError) {
            console.error("Contract insert error:", contractError);
        }

        // Create wallet for theater
        const { error: walletError } = await supabase.from("wallet").insert({
            theater_id: theaterId,
            balance: 0
        });
        if (walletError) console.error("Wallet creation warning:", walletError);

        // Log activity
        await supabase.from("activity_logs").insert({
            action: "Theater registered by admin",
            action_type: "create",
            target_type: "theater",
            target_id: theaterId,
            target_name: formData.theaterName,
            status: "success",
            new_data: { 
                theater_id: theaterId, 
                owner_id: ownerId, 
                contract_number: contractNumber,
                pricing_model: formData.pricingModel,
                license_status: "active"
            }
        });

        return { userId, ownerId, theaterId, contractNumber };
    };

    const handleSubmit = async () => {
        if (!validateStep()) return;

        setIsSubmitting(true);
        setDuplicateError(null);

        try {
            const result = await createRegistration();
            if (onSubmit) onSubmit({ ...formData, ...result });
            if (onTheaterAdded) onTheaterAdded();
            
            setPopupMessage({
                title: 'Theater Registered Successfully! 🎉',
                message: `${formData.theaterName} has been registered successfully. The owner can now log in with their credentials.`,
                type: 'success'
            });
            setShowSuccessPopup(true);
            
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            console.error("Registration error:", error);
            const errorMessage = error instanceof Error ? error.message : "Registration failed. Please try again.";
            if (errorMessage.includes("already registered") || errorMessage.includes("duplicate")) {
                setDuplicateError(errorMessage);
            } else {
                setErrors(prev => ({ ...prev, submit: errorMessage }));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Step 1: Owner Account
    const renderStep1 = () => (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-200">
                <div className="p-2 bg-teal-100 rounded-xl">
                    <UserPlus className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Create Owner Account</h2>
                    <p className="text-sm text-gray-500">Enter the theater owner's account details</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type="text" name="ownerFullName" value={formData.ownerFullName} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 border-2 rounded-xl border-gray-200 focus:ring-2 focus:ring-teal-500" placeholder="Enter full name" />
                    </div>
                    {errors.ownerFullName && <p className="text-xs text-red-500 mt-1">{errors.ownerFullName}</p>}
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type="email" name="ownerEmail" value={formData.ownerEmail} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 border-2 rounded-xl border-gray-200 focus:ring-2 focus:ring-teal-500" placeholder="owner@example.com" />
                    </div>
                    {errors.ownerEmail && <p className="text-xs text-red-500 mt-1">{errors.ownerEmail}</p>}
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type="tel" name="ownerPhone" value={formData.ownerPhone} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 border-2 rounded-xl border-gray-200 focus:ring-2 focus:ring-teal-500" placeholder="0912345678" />
                    </div>
                    {errors.ownerPhone && <p className="text-xs text-red-500 mt-1">{errors.ownerPhone}</p>}
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">National ID <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type="text" name="ownerNationalId" value={formData.ownerNationalId} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 border-2 rounded-xl border-gray-200 focus:ring-2 focus:ring-teal-500" placeholder="Enter National ID number" />
                    </div>
                    {errors.ownerNationalId && <p className="text-xs text-red-500 mt-1">{errors.ownerNationalId}</p>}
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">TIN Number</label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type="text" name="ownerTinNumber" value={formData.ownerTinNumber} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 border-2 rounded-xl border-gray-200 focus:ring-2 focus:ring-teal-500" placeholder="Enter TIN number (optional)" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type={showPassword ? "text" : "password"} name="ownerPassword" value={formData.ownerPassword} onChange={handleInputChange} className="w-full pl-10 pr-10 py-3 border-2 rounded-xl border-gray-200 focus:ring-2 focus:ring-teal-500" placeholder="Min 6 characters" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {errors.ownerPassword && <p className="text-xs text-red-500 mt-1">{errors.ownerPassword}</p>}
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type={showConfirmPassword ? "text" : "password"} name="ownerConfirmPassword" value={formData.ownerConfirmPassword} onChange={handleInputChange} className="w-full pl-10 pr-10 py-3 border-2 rounded-xl border-gray-200 focus:ring-2 focus:ring-teal-500" placeholder="Confirm password" />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {errors.ownerConfirmPassword && <p className="text-xs text-red-500 mt-1">{errors.ownerConfirmPassword}</p>}
                </div>
            </div>
        </div>
    );

    // Step 2: Theater Information
    const renderStep2 = () => (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-200">
                <div className="p-2 bg-teal-100 rounded-xl">
                    <Theater className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Theater Information</h2>
                    <p className="text-sm text-gray-500">Enter the theater business details</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Theater Name <span className="text-red-500">*</span></label>
                    <input type="text" name="theaterName" value={formData.theaterName} onChange={handleInputChange} className="w-full px-4 py-3 border-2 rounded-xl border-gray-200 focus:ring-2 focus:ring-teal-500" placeholder="Enter theater name" />
                    {errors.theaterName && <p className="text-xs text-red-500 mt-1">{errors.theaterName}</p>}
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business Type <span className="text-red-500">*</span></label>
                    <select name="businessType" value={formData.businessType} onChange={handleInputChange} className="w-full px-4 py-3 border-2 rounded-xl border-gray-200 focus:ring-2 focus:ring-teal-500">
                        <option value="">Select Business Type</option>
                        {BUSINESS_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                    {errors.businessType && <p className="text-xs text-red-500 mt-1">{errors.businessType}</p>}
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business License Number <span className="text-red-500">*</span></label>
                    <input type="text" name="businessLicenseNumber" value={formData.businessLicenseNumber} onChange={handleInputChange} className="w-full px-4 py-3 border-2 rounded-xl border-gray-200 focus:ring-2 focus:ring-teal-500" placeholder="Enter unique license number" />
                    {errors.businessLicenseNumber && <p className="text-xs text-red-500 mt-1">{errors.businessLicenseNumber}</p>}
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tax ID / TIN <span className="text-red-500">*</span></label>
                    <input type="text" name="taxId" value={formData.taxId} onChange={handleInputChange} className="w-full px-4 py-3 border-2 rounded-xl border-gray-200 focus:ring-2 focus:ring-teal-500" placeholder="Enter Tax ID" />
                    {errors.taxId && <p className="text-xs text-red-500 mt-1">{errors.taxId}</p>}
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Years in Operation <span className="text-red-500">*</span></label>
                    <select name="yearsInOperation" value={formData.yearsInOperation} onChange={handleInputChange} className="w-full px-4 py-3 border-2 rounded-xl border-gray-200 focus:ring-2 focus:ring-teal-500">
                        <option value="">Select Years</option>
                        {YEARS_OPTIONS.map(years => <option key={years} value={years}>{years}</option>)}
                    </select>
                    {errors.yearsInOperation && <p className="text-xs text-red-500 mt-1">{errors.yearsInOperation}</p>}
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Total Number of Halls <span className="text-red-500">*</span></label>
                    <input type="number" name="totalHalls" value={formData.totalHalls} onChange={handleInputChange} className="w-full px-4 py-3 border-2 rounded-xl border-gray-200 focus:ring-2 focus:ring-teal-500" min="1" placeholder="Number of halls" />
                    {errors.totalHalls && <p className="text-xs text-red-500 mt-1">{errors.totalHalls}</p>}
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Region <span className="text-red-500">*</span></label>
                    <select name="region" value={formData.region} onChange={handleInputChange} className="w-full px-4 py-3 border-2 rounded-xl border-gray-200 focus:ring-2 focus:ring-teal-500">
                        <option value="">Select Region</option>
                        {REGIONS.map(region => <option key={region} value={region}>{region}</option>)}
                    </select>
                    {errors.region && <p className="text-xs text-red-500 mt-1">{errors.region}</p>}
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">City <span className="text-red-500">*</span></label>
                    <select name="city" value={formData.city} onChange={handleInputChange} disabled={!formData.region} className="w-full px-4 py-3 border-2 rounded-xl border-gray-200 focus:ring-2 focus:ring-teal-500 disabled:opacity-50">
                        <option value="">{formData.region ? "Select City" : "Select Region First"}</option>
                        {availableCities.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                    {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Address <span className="text-red-500">*</span></label>
                    <input type="text" name="fullAddress" value={formData.fullAddress} onChange={handleInputChange} className="w-full px-4 py-3 border-2 rounded-xl border-gray-200 focus:ring-2 focus:ring-teal-500" placeholder="Street, building, floor, etc." />
                    {errors.fullAddress && <p className="text-xs text-red-500 mt-1">{errors.fullAddress}</p>}
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Theater Description <span className="text-red-500">*</span></label>
                    <textarea name="theaterDescription" rows={4} value={formData.theaterDescription} onChange={handleInputChange} className="w-full px-4 py-3 border-2 rounded-xl border-gray-200 focus:ring-2 focus:ring-teal-500 resize-none" placeholder="Describe your theater, facilities, seating capacity, etc." />
                    {errors.theaterDescription && <p className="text-xs text-red-500 mt-1">{errors.theaterDescription}</p>}
                </div>
            </div>
        </div>
    );

    // Step 3: Document Upload
    const renderStep3 = () => (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-200">
                <div className="p-2 bg-teal-100 rounded-xl">
                    <FileCheck className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Required Documents</h2>
                    <p className="text-sm text-gray-500">Upload the required documents for verification</p>
                </div>
            </div>

            <div className="space-y-4">
                {/* Business License Document */}
                <div className={`border-2 rounded-2xl p-5 transition-all ${errors.businessLicense ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-teal-300"}`}>
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div className="flex items-start gap-4 flex-1">
                            <div className={`p-2.5 rounded-xl ${formData.documents.businessLicense ? "bg-green-100" : "bg-gray-100"}`}>
                                <FileText className={`h-5 w-5 ${formData.documents.businessLicense ? "text-green-600" : "text-gray-500"}`} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Business License Document <span className="text-red-500">*</span></h3>
                                <p className="text-sm text-gray-500 mt-1">Upload a copy of the business license</p>
                                {formData.documents.businessLicense && (
                                    <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                                        <CheckCircle className="h-3 w-3" /> {formData.documents.businessLicense.name}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div>
                            <input ref={el => { if (el) fileInputRefs.current.businessLicense = el; }} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleDocumentUpload(e, 'businessLicense')} className="hidden" />
                            <button type="button" onClick={() => fileInputRefs.current.businessLicense?.click()} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${formData.documents.businessLicense ? "border-2 border-green-500 text-green-600 hover:bg-green-50" : "bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800 shadow-md"}`}>
                                <Upload className="h-4 w-4" /> {formData.documents.businessLicense ? "Replace" : "Upload"}
                            </button>
                        </div>
                    </div>
                    {errors.businessLicense && <p className="text-xs text-red-500 mt-3">{errors.businessLicense}</p>}
                </div>

                {/* Tax Certificate */}
                <div className={`border-2 rounded-2xl p-5 transition-all ${errors.taxCertificate ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-teal-300"}`}>
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div className="flex items-start gap-4 flex-1">
                            <div className={`p-2.5 rounded-xl ${formData.documents.taxCertificate ? "bg-green-100" : "bg-gray-100"}`}>
                                <Receipt className={`h-5 w-5 ${formData.documents.taxCertificate ? "text-green-600" : "text-gray-500"}`} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Tax Registration Certificate <span className="text-red-500">*</span></h3>
                                <p className="text-sm text-gray-500 mt-1">Tax Identification Number (TIN) certificate</p>
                                {formData.documents.taxCertificate && (
                                    <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                                        <CheckCircle className="h-3 w-3" /> {formData.documents.taxCertificate.name}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div>
                            <input ref={el => { if (el) fileInputRefs.current.taxCertificate = el; }} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleDocumentUpload(e, 'taxCertificate')} className="hidden" />
                            <button type="button" onClick={() => fileInputRefs.current.taxCertificate?.click()} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${formData.documents.taxCertificate ? "border-2 border-green-500 text-green-600 hover:bg-green-50" : "bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800 shadow-md"}`}>
                                <Upload className="h-4 w-4" /> {formData.documents.taxCertificate ? "Replace" : "Upload"}
                            </button>
                        </div>
                    </div>
                    {errors.taxCertificate && <p className="text-xs text-red-500 mt-3">{errors.taxCertificate}</p>}
                </div>

                {/* Owner ID Card */}
                <div className={`border-2 rounded-2xl p-5 transition-all ${errors.ownerIdCard ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-teal-300"}`}>
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div className="flex items-start gap-4 flex-1">
                            <div className={`p-2.5 rounded-xl ${formData.documents.ownerIdCard ? "bg-green-100" : "bg-gray-100"}`}>
                                <User className={`h-5 w-5 ${formData.documents.ownerIdCard ? "text-green-600" : "text-gray-500"}`} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Owner ID Card <span className="text-red-500">*</span></h3>
                                <p className="text-sm text-gray-500 mt-1">Valid government-issued ID (Passport, National ID, or Driver's License)</p>
                                {formData.documents.ownerIdCard && (
                                    <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                                        <CheckCircle className="h-3 w-3" /> {formData.documents.ownerIdCard.name}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div>
                            <input ref={el => { if (el) fileInputRefs.current.ownerIdCard = el; }} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleDocumentUpload(e, 'ownerIdCard')} className="hidden" />
                            <button type="button" onClick={() => fileInputRefs.current.ownerIdCard?.click()} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${formData.documents.ownerIdCard ? "border-2 border-green-500 text-green-600 hover:bg-green-50" : "bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800 shadow-md"}`}>
                                <Upload className="h-4 w-4" /> {formData.documents.ownerIdCard ? "Replace" : "Upload"}
                            </button>
                        </div>
                    </div>
                    {errors.ownerIdCard && <p className="text-xs text-red-500 mt-3">{errors.ownerIdCard}</p>}
                </div>
            </div>

            <div className="bg-amber-50 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-amber-800">Document Requirements</p>
                        <p className="text-xs text-amber-700 mt-1">
                            • PDF, JPG, or PNG format only (max 10MB per file)<br />
                            • Documents must be clear and legible<br />
                            • Business license must be currently valid<br />
                            • ID card must match the owner's name
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    // Step 4: Pricing & Terms with License Expiry Date inside Subscription Plan
    const renderStep4 = () => {
        if (isLoadingPricing) {
            return (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                    <span className="ml-2 text-gray-600">Loading pricing options...</span>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-200">
                    <div className="p-2 bg-teal-100 rounded-xl">
                        <FileSignature className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Pricing Plan & Terms</h2>
                        <p className="text-sm text-gray-500">Choose your preferred payment model</p>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Select Payment Model <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Per Ticket Option */}
                        <div onClick={() => setFormData(prev => ({ ...prev, pricingModel: "per_ticket", contractType: "" }))} className={`cursor-pointer rounded-2xl border-2 p-5 transition-all ${formData.pricingModel === "per_ticket" ? "border-teal-500 bg-teal-500/10 shadow-lg" : "border-gray-200 hover:border-teal-300"}`}>
                            <div className={`p-2 rounded-xl inline-block ${formData.pricingModel === "per_ticket" ? "bg-teal-100" : "bg-gray-100"} mb-3`}>
                                <Ticket className={`h-6 w-6 ${formData.pricingModel === "per_ticket" ? "text-teal-600" : "text-gray-600"}`} />
                            </div>
                            <h3 className={`font-bold text-lg ${formData.pricingModel === "per_ticket" ? "text-teal-600" : "text-gray-900"}`}>Per Ticket Selling</h3>
                            <p className="text-sm mt-1 text-gray-500">Pay commission per ticket sold</p>
                            <div className="mt-3 flex items-center gap-2">
                                <Percent className="h-4 w-4 text-teal-600" />
                                <p className="text-lg font-bold text-teal-600">{commissionRate}% commission</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">No monthly fees • Pay only when you sell</p>
                        </div>

                        {/* Subscription Option */}
                        <div onClick={() => setFormData(prev => ({ ...prev, pricingModel: "subscription", contractType: "" }))} className={`cursor-pointer rounded-2xl border-2 p-5 transition-all ${formData.pricingModel === "subscription" ? "border-teal-500 bg-teal-500/10 shadow-lg" : "border-gray-200 hover:border-teal-300"}`}>
                            <div className={`p-2 rounded-xl inline-block ${formData.pricingModel === "subscription" ? "bg-teal-100" : "bg-gray-100"} mb-3`}>
                                <Calendar className={`h-6 w-6 ${formData.pricingModel === "subscription" ? "text-teal-600" : "text-gray-600"}`} />
                            </div>
                            <h3 className={`font-bold text-lg ${formData.pricingModel === "subscription" ? "text-teal-600" : "text-gray-900"}`}>Subscription Plan</h3>
                            <p className="text-sm mt-1 text-gray-500">Fixed periodic rental fee</p>
                            <p className="text-sm font-bold mt-3 text-teal-600">Starting from {periodicRentals[0]?.rental_fee?.toLocaleString() || "0"} ETB</p>
                            <p className="text-xs text-gray-500 mt-2">Predictable costs • No per-ticket commission</p>
                        </div>
                    </div>
                    {errors.pricingModel && <p className="text-xs text-red-500 mt-2">{errors.pricingModel}</p>}
                </div>

                {/* Subscription Plans */}
                {formData.pricingModel === "subscription" && periodicRentals.length > 0 && (
                    <div className="mt-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Select Subscription Plan <span className="text-red-500">*</span></label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {periodicRentals.map(rental => {
                                const isSelected = formData.contractType === rental.id;
                                const getFrequencyLabel = (months: number) => {
                                    if (months === 1) return "month";
                                    if (months === 3) return "quarter";
                                    if (months === 12) return "year";
                                    return `${months} months`;
                                };
                                return (
                                    <div key={rental.id} onClick={() => setFormData(prev => ({ ...prev, contractType: rental.id }))} className={`cursor-pointer rounded-2xl border-2 p-5 transition-all relative ${isSelected ? "border-teal-500 bg-teal-500/10 shadow-lg" : "border-gray-200 hover:border-teal-300"}`}>
                                        {rental.popular && (
                                            <div className="absolute top-3 right-3">
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Star className="h-3 w-3" /> Popular</span>
                                            </div>
                                        )}
                                        <div className={`p-2 rounded-xl inline-block ${isSelected ? "bg-teal-100" : "bg-gray-100"} mb-3`}>
                                            {rental.duration_months === 1 && <Calendar className={`h-6 w-6 ${isSelected ? "text-teal-600" : "text-gray-600"}`} />}
                                            {rental.duration_months === 3 && <TrendingUp className={`h-6 w-6 ${isSelected ? "text-teal-600" : "text-gray-600"}`} />}
                                            {rental.duration_months === 12 && <Award className={`h-6 w-6 ${isSelected ? "text-teal-600" : "text-gray-600"}`} />}
                                        </div>
                                        <h4 className={`font-bold text-lg ${isSelected ? "text-teal-600" : "text-gray-900"}`}>{rental.name}</h4>
                                        <p className="text-2xl font-bold text-teal-600 mt-2">ETB {rental.rental_fee.toLocaleString()}</p>
                                        <p className="text-xs text-gray-500 mt-1">per {getFrequencyLabel(rental.duration_months)}</p>
                                        <p className="text-xs text-gray-500 mt-2">{rental.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                        {errors.contractType && <p className="text-xs text-red-500 mt-2">{errors.contractType}</p>}
                        
                        {/* License Expiry Date - Only shows when subscription is selected */}
                        <div className="mt-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">License Expiry Date <span className="text-red-500">*</span></label>
                            <input type="date" name="licenseExpiryDate" value={formData.licenseExpiryDate} onChange={handleInputChange} className="w-full px-4 py-3 border-2 rounded-xl border-gray-200 focus:ring-2 focus:ring-teal-500" />
                            <p className="text-xs text-gray-500 mt-1">The date when the business license expires</p>
                            {errors.licenseExpiryDate && <p className="text-xs text-red-500 mt-1">{errors.licenseExpiryDate}</p>}
                        </div>
                    </div>
                )}

                {/* Terms & Agreement */}
                <div className="border-t border-gray-200 my-6"></div>

                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                    <h3 className="font-bold text-lg">Terms & Agreement</h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                        <li>All information provided is accurate and complete</li>
                        <li>The theater owner agrees to the selected pricing plan</li>
                        <li>You agree to our {formData.pricingModel === "per_ticket" ? `${commissionRate}% commission structure` : "subscription pricing plan"}</li>
                        <li>This agreement is governed by the laws of Ethiopia</li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" name="agreedToTerms" checked={formData.agreedToTerms} onChange={handleInputChange} className="mt-1 h-5 w-5 text-teal-600 rounded" />
                        <div>
                            <p className="text-sm font-semibold text-gray-900">I confirm that all information provided is accurate</p>
                            <p className="text-xs text-gray-500">I understand that providing false information may lead to account suspension</p>
                        </div>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" name="agreedToNoRefund" checked={formData.agreedToNoRefund} onChange={handleInputChange} className="mt-1 h-5 w-5 text-teal-600 rounded" />
                        <div>
                            <p className="text-sm font-semibold text-gray-900">I acknowledge the no-refund policy</p>
                            <p className="text-xs text-gray-500">All payments made are non-refundable</p>
                        </div>
                    </label>
                </div>
                {(errors.terms || errors.noRefund) && <p className="text-xs text-red-500 mt-2">{errors.terms || errors.noRefund}</p>}
            </div>
        );
    };

    if (isSubmitting) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-teal-600 mx-auto mb-4" />
                    <p className="text-gray-600">Registering theater...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
                <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                    
                    {/* Header */}
                    <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-5 rounded-t-2xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-xl"><Theater className="h-6 w-6 text-white" /></div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">{formTitle}</h2>
                                    <p className="text-white/80 text-sm">Register a new theater</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl"><X className="h-5 w-5 text-white" /></button>
                        </div>
                    </div>

                    {/* Progress Steps */}
                    <div className="px-6 pt-6 pb-2">
                        <div className="flex items-center justify-between">
                            {steps.map((s, idx) => (
                                <div key={s.number} className="flex-1">
                                    <div className="flex items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all z-10 ${step > s.number ? 'bg-teal-600 text-white border-teal-600' : step === s.number ? 'bg-white text-teal-600 border-teal-600 shadow-md' : 'bg-gray-100 text-gray-400 border-gray-300'}`}>
                                            {step > s.number ? <Check className="h-5 w-5" /> : s.number}
                                        </div>
                                        {idx !== steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${step > s.number ? 'bg-teal-600' : 'bg-gray-300'}`} />}
                                    </div>
                                    <div className="mt-2"><p className={`text-xs font-medium ${step === s.number ? 'text-teal-600' : 'text-gray-500'}`}>{s.title}</p></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {duplicateError && (
                            <div className="mb-4 p-4 bg-red-50 rounded-xl border border-red-200">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="h-5 w-5 text-red-600" />
                                    <div>
                                        <p className="text-sm font-semibold text-red-800">Duplicate Information Detected</p>
                                        <p className="text-sm text-red-700">{duplicateError}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {errors.submit && <div className="mb-4 p-3 bg-red-50 rounded-xl"><p className="text-sm text-red-600 text-center">{errors.submit}</p></div>}
                        
                        {step === 1 && renderStep1()}
                        {step === 2 && renderStep2()}
                        {step === 3 && renderStep3()}
                        {step === 4 && renderStep4()}
                    </div>

                    {/* Buttons */}
                    <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-2xl">
                        <div className="flex justify-between">
                            {step > 1 && (
                                <button onClick={handleBack} className="px-6 py-2.5 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium">
                                    <ChevronLeft className="h-4 w-4" /> Back
                                </button>
                            )}
                            {step < 4 ? (
                                <button onClick={handleNext} className={`px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-medium flex items-center gap-2 shadow-md ${step === 1 ? 'ml-auto' : ''}`}>
                                    Continue <ChevronRight className="h-4 w-4" />
                                </button>
                            ) : (
                                <button onClick={handleSubmit} disabled={!formData.agreedToTerms || !formData.agreedToNoRefund || (formData.pricingModel === "subscription" && (!formData.contractType || !formData.licenseExpiryDate))} className={`ml-auto px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-md ${(!formData.agreedToTerms || !formData.agreedToNoRefund || (formData.pricingModel === "subscription" && (!formData.contractType || !formData.licenseExpiryDate))) ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white'}`}>
                                    <Send className="h-4 w-4" /> Register Theater
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>

            <SuccessPopup isOpen={showSuccessPopup} onClose={() => setShowSuccessPopup(false)} type={popupMessage.type} title={popupMessage.title} message={popupMessage.message} duration={3000} position="top-right" />
        </>
    );
};

export default AddTheater;