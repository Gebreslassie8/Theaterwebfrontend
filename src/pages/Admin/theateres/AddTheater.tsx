// src/pages/Admin/theaters/AddTheater.tsx
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Yup from 'yup';
import { 
    X, Building, Mail, User, Phone, MapPin, Hash, Users, Shield, 
    CreditCard, FileText, Calendar, Briefcase, Home, Globe, Clock, 
    Heart, FileCheck, Image, Info, Layers, Navigation, Star, 
    Send, Loader2, CheckCircle, AlertCircle, ChevronRight, ChevronLeft, 
    Theater, Compass, Wallet, Ticket, Award, UserCheck, Wifi, Coffee, 
    Car, Utensils, Film, Sparkles
} from 'lucide-react';
import { FaWineGlassAlt, FaAccessibleIcon, FaGift } from 'react-icons/fa';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';

interface AddTheaterProps {
    onSubmit: (values: any) => void;
    onClose: () => void;
    initialValues?: any;
    formTitle?: string;
}

interface FormData {
    id?: number;
    businessName: string;
    tradeName: string;
    businessType: string;
    businessLicense: string;
    taxId: string;
    yearsInOperation: string;
    businessDescription: string;
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
    pricingModel: string;
    contractType: string;
    payoutFrequency: string;
    expeditedEnabled: boolean;
    acceptMarketing: boolean;
    paymentCompleted: boolean;
    status?: string;
}

// Yup Validation Schemas for each step
const step1ValidationSchema = Yup.object({
    businessName: Yup.string()
        .required('Business name is required')
        .min(2, 'Business name must be at least 2 characters')
        .max(100, 'Business name cannot exceed 100 characters'),
    businessType: Yup.string().required('Business type is required'),
    businessLicense: Yup.string()
        .required('Business license is required')
        .min(3, 'License number must be at least 3 characters'),
    taxId: Yup.string()
        .required('Tax ID is required')
        .matches(/^[0-9]{9,12}$/, 'Tax ID must be 9-12 digits'),
    yearsInOperation: Yup.string().required('Years in operation is required'),
    businessDescription: Yup.string()
        .required('Business description is required')
        .min(20, 'Description must be at least 20 characters')
        .max(1000, 'Description cannot exceed 1000 characters'),
});

const step2ValidationSchema = Yup.object({
    ownerName: Yup.string()
        .required('Owner name is required')
        .min(2, 'Name must be at least 2 characters'),
    ownerPosition: Yup.string().required('Position is required'),
    ownerEmail: Yup.string()
        .required('Email is required')
        .email('Valid email is required'),
    ownerPhone: Yup.string()
        .required('Phone number is required')
        .matches(/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,5}[-\s\.]?[0-9]{1,5}$/, 'Valid phone number is required'),
    emergencyName: Yup.string()
        .required('Emergency contact name is required')
        .min(2, 'Name must be at least 2 characters'),
    emergencyPhone: Yup.string()
        .required('Emergency phone is required')
        .matches(/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,5}[-\s\.]?[0-9]{1,5}$/, 'Valid phone number is required'),
});

const step3ValidationSchema = Yup.object({
    theaterName: Yup.string()
        .required('Theater name is required')
        .min(2, 'Theater name must be at least 2 characters'),
    theaterDescription: Yup.string()
        .required('Theater description is required')
        .min(20, 'Description must be at least 20 characters'),
    theaterEmail: Yup.string()
        .required('Theater email is required')
        .email('Valid email is required'),
    theaterPhone: Yup.string()
        .required('Theater phone is required')
        .matches(/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,5}[-\s\.]?[0-9]{1,5}$/, 'Valid phone number is required'),
    totalHalls: Yup.number()
        .required('Number of halls is required')
        .min(1, 'Must be at least 1 hall')
        .max(50, 'Maximum 50 halls'),
    totalSeats: Yup.number()
        .required('Total seats is required')
        .min(10, 'Must be at least 10 seats')
        .max(10000, 'Maximum 10000 seats'),
    city: Yup.string().required('City is required'),
    region: Yup.string().required('Region is required'),
    address: Yup.string()
        .required('Address is required')
        .min(5, 'Address must be at least 5 characters'),
});

const step4ValidationSchema = Yup.object({
    pricingModel: Yup.string().required('Please select a pricing model'),
    contractType: Yup.string().when('pricingModel', {
        is: 'contract',
        then: () => Yup.string().required('Please select a contract type'),
        otherwise: () => Yup.string().notRequired(),
    }),
    payoutFrequency: Yup.string().required('Please select payout frequency'),
});

const AddTheater: React.FC<AddTheaterProps> = ({
    onSubmit,
    onClose,
    initialValues = {},
    formTitle = 'Add New Theater'
}) => {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [services, setServices] = useState<string[]>([]);
    const [screenTypes, setScreenTypes] = useState<string[]>([]);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });
    const logoInputRef = useRef<HTMLInputElement>(null);
    const [logoPreview, setLogoPreview] = useState<string>('');
    const contentRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState<FormData>({
        businessName: '',
        tradeName: '',
        businessType: '',
        businessLicense: '',
        taxId: '',
        yearsInOperation: '',
        businessDescription: '',
        ownerName: '',
        ownerPosition: '',
        ownerEmail: '',
        ownerPhone: '',
        secondaryName: '',
        secondaryPosition: '',
        secondaryEmail: '',
        secondaryPhone: '',
        emergencyName: '',
        emergencyPhone: '',
        emergencyRelation: '',
        theaterName: '',
        theaterLogo: null,
        theaterDescription: '',
        theaterEmail: '',
        theaterPhone: '',
        totalHalls: '',
        totalSeats: '',
        services: [],
        latitude: '',
        longitude: '',
        city: '',
        region: '',
        address: '',
        screenTypes: [],
        pricingModel: '',
        contractType: '',
        payoutFrequency: '',
        expeditedEnabled: false,
        acceptMarketing: false,
        paymentCompleted: false,
        status: 'Pending'
    });

    // Validate current step using Yup
    const validateStep = async (): Promise<boolean> => {
        let schema;
        let dataToValidate;

        switch (step) {
            case 1:
                schema = step1ValidationSchema;
                dataToValidate = {
                    businessName: formData.businessName,
                    businessType: formData.businessType,
                    businessLicense: formData.businessLicense,
                    taxId: formData.taxId,
                    yearsInOperation: formData.yearsInOperation,
                    businessDescription: formData.businessDescription,
                };
                break;
            case 2:
                schema = step2ValidationSchema;
                dataToValidate = {
                    ownerName: formData.ownerName,
                    ownerPosition: formData.ownerPosition,
                    ownerEmail: formData.ownerEmail,
                    ownerPhone: formData.ownerPhone,
                    emergencyName: formData.emergencyName,
                    emergencyPhone: formData.emergencyPhone,
                };
                break;
            case 3:
                schema = step3ValidationSchema;
                dataToValidate = {
                    theaterName: formData.theaterName,
                    theaterDescription: formData.theaterDescription,
                    theaterEmail: formData.theaterEmail,
                    theaterPhone: formData.theaterPhone,
                    totalHalls: formData.totalHalls ? parseInt(formData.totalHalls) : undefined,
                    totalSeats: formData.totalSeats ? parseInt(formData.totalSeats) : undefined,
                    city: formData.city,
                    region: formData.region,
                    address: formData.address,
                };
                break;
            case 4:
                schema = step4ValidationSchema;
                dataToValidate = {
                    pricingModel: formData.pricingModel,
                    contractType: formData.contractType,
                    payoutFrequency: formData.payoutFrequency,
                };
                break;
            default:
                return true;
        }

        try {
            await schema.validate(dataToValidate, { abortEarly: false });
            setErrors({});
            return true;
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                const newErrors: Record<string, string> = {};
                err.inner.forEach(error => {
                    if (error.path) {
                        newErrors[error.path] = error.message;
                    }
                });
                setErrors(newErrors);
                
                // Mark all fields as touched
                const newTouched: Record<string, boolean> = {};
                Object.keys(newErrors).forEach(key => {
                    newTouched[key] = true;
                });
                setTouched(prev => ({ ...prev, ...newTouched }));
            }
            return false;
        }
    };

    const cities = [
        "Addis Ababa", "Bahir Dar", "Dire Dawa", "Hawassa", "Mekelle",
        "Gondar", "Jimma", "Harar", "Adama", "Dessie", "Arba Minch", "Jijiga"
    ];

    const regions = [
        "Addis Ababa", "Oromia", "Amhara", "Tigray", "Southern Nations",
        "Somali", "Benishangul-Gumuz", "Afar", "Harari", "Gambela", "Sidama"
    ];

    const businessTypes = [
        "Sole Proprietorship", "Partnership", "Limited Liability Company (LLC)",
        "Corporation", "Non-Profit Organization", "Government Entity"
    ];

    const yearsOptions = ["Less than 1 year", "1-2 years", "3-5 years", "5-10 years", "10+ years"];
    const positions = ["Owner", "Co-Owner", "General Manager", "Operations Manager", "Director", "Partner", "Other"];
    const payoutFrequencies = ["weekly", "biweekly", "monthly"];

    const servicesList = [
        { icon: Ticket, name: "Ticket Booking", description: "Online ticket reservation" },
        { icon: Coffee, name: "Refreshments", description: "Snacks and beverages" },
        { icon: FaWineGlassAlt, name: "Premium Bar", description: "Full bar service" },
        { icon: Utensils, name: "Dining", description: "Pre-show dining" },
        { icon: Wifi, name: "Free WiFi", description: "Complimentary internet" },
        { icon: Car, name: "Valet Parking", description: "Professional parking service" },
        { icon: FaAccessibleIcon, name: "Wheelchair Access", description: "ADA compliant" },
        { icon: FaGift, name: "Gift Cards", description: "Digital gift certificates" },
        { icon: Users, name: "Group Bookings", description: "Special group rates" },
        { icon: Sparkles, name: "Private Events", description: "Venue rental" }
    ];

    const screenTypeOptions = [
        "Standard", "IMAX", "4DX", "Dolby Cinema", "VIP Screen", "3D", "2D", "Drive-in"
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        if (checked) {
            setServices([...services, value]);
            setFormData(prev => ({ ...prev, services: [...services, value] }));
        } else {
            setServices(services.filter(s => s !== value));
            setFormData(prev => ({ ...prev, services: services.filter(s => s !== value) }));
        }
    };

    const handleScreenTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        if (checked) {
            setScreenTypes([...screenTypes, value]);
            setFormData(prev => ({ ...prev, screenTypes: [...screenTypes, value] }));
        } else {
            setScreenTypes(screenTypes.filter(s => s !== value));
            setFormData(prev => ({ ...prev, screenTypes: screenTypes.filter(s => s !== value) }));
        }
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, theaterLogo: "Logo must be less than 2MB" }));
                return;
            }
            const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                setErrors(prev => ({ ...prev, theaterLogo: "Only JPEG, PNG, or WEBP files are allowed" }));
                return;
            }
            setFormData(prev => ({ ...prev, theaterLogo: file }));
            setLogoPreview(URL.createObjectURL(file));
            setErrors(prev => ({ ...prev, theaterLogo: "" }));
        }
    };

    const handleNext = async () => {
        const isValid = await validateStep();
        if (isValid) {
            setStep(prev => prev + 1);
            if (contentRef.current) {
                contentRef.current.scrollTop = 0;
            }
        }
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
        if (contentRef.current) {
            contentRef.current.scrollTop = 0;
        }
    };

    const handleSubmit = async () => {
        const isValid = await validateStep();
        if (!isValid) return;

        setIsSubmitting(true);

        await new Promise(resolve => setTimeout(resolve, 1500));

        const submitData = {
            ...formData,
            services,
            screenTypes,
            status: 'Pending',
            joinDate: new Date().toISOString().split('T')[0],
            lastActive: new Date().toISOString().split('T')[0],
            totalRevenue: 0,
            totalBookings: 0,
            rating: 0,
        };

        onSubmit(submitData);
        setIsSubmitting(false);
        
        setPopupMessage({
            title: 'Success!',
            message: `${formData.theaterName} has been added successfully and is pending approval`,
            type: 'success'
        });
        setShowSuccessPopup(true);
        
        setTimeout(() => {
            onClose();
        }, 1500);
    };

    const steps = [
        { number: 1, title: "Business Info", description: "Company details" },
        { number: 2, title: "Contact Info", description: "Owner & emergency" },
        { number: 3, title: "Theater Details", description: "Venue information" },
        { number: 4, title: "Pricing Plan", description: "Select payment model" }
    ];

    return (
        <>
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header - Non-sticky */}
                        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-5 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                        <Theater className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">{formTitle}</h2>
                                        <p className="text-white/80 text-sm mt-0.5">Fill in all required information</p>
                                    </div>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                                    <X className="h-5 w-5 text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div ref={contentRef} className="flex-1 overflow-y-auto p-6">
                            {/* Progress Steps */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between">
                                    {steps.map((s, idx) => (
                                        <div key={s.number} className="flex-1">
                                            <div className="flex items-center">
                                                <motion.div
                                                    animate={{
                                                        scale: s.number === step ? 1.1 : 1,
                                                        backgroundColor: s.number < step ? '#14b8a6' : (s.number === step ? '#fff' : '#e5e7eb'),
                                                        borderColor: s.number <= step ? '#14b8a6' : '#d1d5db'
                                                    }}
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all z-10 ${
                                                        s.number < step ? 'bg-teal-600 text-white border-teal-600' :
                                                        s.number === step ? 'bg-white text-teal-600 border-teal-600' :
                                                        'bg-gray-100 text-gray-400 border-gray-300'
                                                    }`}
                                                >
                                                    {s.number < step ? <CheckCircle className="h-5 w-5" /> : s.number}
                                                </motion.div>
                                                {idx !== steps.length - 1 && (
                                                    <motion.div
                                                        animate={{
                                                            backgroundColor: s.number < step ? '#14b8a6' : '#e5e7eb'
                                                        }}
                                                        className={`flex-1 h-0.5 mx-2 ${s.number < step ? 'bg-teal-600' : 'bg-gray-300'}`}
                                                    />
                                                )}
                                            </div>
                                            <div className="mt-2">
                                                <p className={`text-xs font-medium ${s.number === step ? 'text-teal-600' : 'text-gray-500'}`}>
                                                    {s.title}
                                                </p>
                                                <p className="text-xs text-gray-400 hidden sm:block">{s.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Rest of the form remains the same as before... */}
                            {/* Step 1: Business Information */}
                            {step === 1 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2.5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg">
                                            <Briefcase className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">Business Information</h3>
                                            <p className="text-sm text-gray-500">Tell us about your theater business</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                Legal Business Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="businessName"
                                                value={formData.businessName}
                                                onChange={handleInputChange}
                                                onBlur={handleBlur}
                                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                                                    errors.businessName && touched.businessName ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-teal-300'
                                                }`}
                                                placeholder="Grand Theater LLC"
                                            />
                                            {errors.businessName && touched.businessName && (
                                                <p className="text-xs text-red-500 mt-1">{errors.businessName}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                Trade Name / DBA
                                            </label>
                                            <input
                                                type="text"
                                                name="tradeName"
                                                value={formData.tradeName}
                                                onChange={handleInputChange}
                                                onBlur={handleBlur}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all hover:border-teal-300"
                                                placeholder="Grand Theater"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                Business Type <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                name="businessType"
                                                value={formData.businessType}
                                                onChange={handleInputChange}
                                                onBlur={handleBlur}
                                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                                                    errors.businessType && touched.businessType ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-teal-300'
                                                }`}
                                            >
                                                <option value="">Select business type</option>
                                                {businessTypes.map(type => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                            {errors.businessType && touched.businessType && (
                                                <p className="text-xs text-red-500 mt-1">{errors.businessType}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                Business License Number <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="businessLicense"
                                                value={formData.businessLicense}
                                                onChange={handleInputChange}
                                                onBlur={handleBlur}
                                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                                                    errors.businessLicense && touched.businessLicense ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-teal-300'
                                                }`}
                                                placeholder="BL-2024-12345"
                                            />
                                            {errors.businessLicense && touched.businessLicense && (
                                                <p className="text-xs text-red-500 mt-1">{errors.businessLicense}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                Tax ID / TIN <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="taxId"
                                                value={formData.taxId}
                                                onChange={handleInputChange}
                                                onBlur={handleBlur}
                                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                                                    errors.taxId && touched.taxId ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-teal-300'
                                                }`}
                                                placeholder="123456789"
                                            />
                                            {errors.taxId && touched.taxId && (
                                                <p className="text-xs text-red-500 mt-1">{errors.taxId}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                Years in Operation <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                name="yearsInOperation"
                                                value={formData.yearsInOperation}
                                                onChange={handleInputChange}
                                                onBlur={handleBlur}
                                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                                                    errors.yearsInOperation && touched.yearsInOperation ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-teal-300'
                                                }`}
                                            >
                                                <option value="">Select years</option>
                                                {yearsOptions.map(years => (
                                                    <option key={years} value={years}>{years}</option>
                                                ))}
                                            </select>
                                            {errors.yearsInOperation && touched.yearsInOperation && (
                                                <p className="text-xs text-red-500 mt-1">{errors.yearsInOperation}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Business Description <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            name="businessDescription"
                                            rows={3}
                                            value={formData.businessDescription}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none ${
                                                errors.businessDescription && touched.businessDescription ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-teal-300'
                                            }`}
                                            placeholder="Describe your theater business, history, mission, and what makes you unique..."
                                        />
                                        {errors.businessDescription && touched.businessDescription && (
                                            <p className="text-xs text-red-500 mt-1">{errors.businessDescription}</p>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Contact Information */}
                            {step === 2 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2.5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg">
                                            <User className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">Contact Information</h3>
                                            <p className="text-sm text-gray-500">Who should we contact?</p>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="p-1.5 bg-teal-100 rounded-lg">
                                                <UserCheck className="h-4 w-4 text-teal-600" />
                                            </div>
                                            <h4 className="font-semibold text-gray-900">Primary Contact / Owner</h4>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                    Full Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="ownerName"
                                                    value={formData.ownerName}
                                                    onChange={handleInputChange}
                                                    onBlur={handleBlur}
                                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                                                        errors.ownerName && touched.ownerName ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-teal-300'
                                                    }`}
                                                    placeholder="John Doe"
                                                />
                                                {errors.ownerName && touched.ownerName && (
                                                    <p className="text-xs text-red-500 mt-1">{errors.ownerName}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                    Position/Title <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    name="ownerPosition"
                                                    value={formData.ownerPosition}
                                                    onChange={handleInputChange}
                                                    onBlur={handleBlur}
                                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                                                        errors.ownerPosition && touched.ownerPosition ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-teal-300'
                                                    }`}
                                                >
                                                    <option value="">Select position</option>
                                                    {positions.map(pos => (
                                                        <option key={pos} value={pos}>{pos}</option>
                                                    ))}
                                                </select>
                                                {errors.ownerPosition && touched.ownerPosition && (
                                                    <p className="text-xs text-red-500 mt-1">{errors.ownerPosition}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                    Email Address <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    name="ownerEmail"
                                                    value={formData.ownerEmail}
                                                    onChange={handleInputChange}
                                                    onBlur={handleBlur}
                                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                                                        errors.ownerEmail && touched.ownerEmail ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-teal-300'
                                                    }`}
                                                    placeholder="john@example.com"
                                                />
                                                {errors.ownerEmail && touched.ownerEmail && (
                                                    <p className="text-xs text-red-500 mt-1">{errors.ownerEmail}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                    Phone Number <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="ownerPhone"
                                                    value={formData.ownerPhone}
                                                    onChange={handleInputChange}
                                                    onBlur={handleBlur}
                                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                                                        errors.ownerPhone && touched.ownerPhone ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-teal-300'
                                                    }`}
                                                    placeholder="+251 911 234 567"
                                                />
                                                {errors.ownerPhone && touched.ownerPhone && (
                                                    <p className="text-xs text-red-500 mt-1">{errors.ownerPhone}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-5 border border-red-200">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="p-1.5 bg-red-100 rounded-lg">
                                                <AlertCircle className="h-4 w-4 text-red-500" />
                                            </div>
                                            <h4 className="font-semibold text-gray-900">Emergency Contact</h4>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                    Contact Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="emergencyName"
                                                    value={formData.emergencyName}
                                                    onChange={handleInputChange}
                                                    onBlur={handleBlur}
                                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                                                        errors.emergencyName && touched.emergencyName ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-teal-300'
                                                    }`}
                                                    placeholder="Emergency Contact Name"
                                                />
                                                {errors.emergencyName && touched.emergencyName && (
                                                    <p className="text-xs text-red-500 mt-1">{errors.emergencyName}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                    Phone Number <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="emergencyPhone"
                                                    value={formData.emergencyPhone}
                                                    onChange={handleInputChange}
                                                    onBlur={handleBlur}
                                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                                                        errors.emergencyPhone && touched.emergencyPhone ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-teal-300'
                                                    }`}
                                                    placeholder="+251 911 234 568"
                                                />
                                                {errors.emergencyPhone && touched.emergencyPhone && (
                                                    <p className="text-xs text-red-500 mt-1">{errors.emergencyPhone}</p>
                                                )}
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    Relationship
                                                </label>
                                                <input
                                                    type="text"
                                                    name="emergencyRelation"
                                                    value={formData.emergencyRelation}
                                                    onChange={handleInputChange}
                                                    onBlur={handleBlur}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-teal-300"
                                                    placeholder="Business Partner / Family Member"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Theater Details */}
                            {step === 3 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2.5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg">
                                            <Theater className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">Theater Details</h3>
                                            <p className="text-sm text-gray-500">Tell us about your venue</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                Theater Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="theaterName"
                                                value={formData.theaterName}
                                                onChange={handleInputChange}
                                                onBlur={handleBlur}
                                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                                                    errors.theaterName && touched.theaterName ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-teal-300'
                                                }`}
                                                placeholder="Grand Theater"
                                            />
                                            {errors.theaterName && touched.theaterName && (
                                                <p className="text-xs text-red-500 mt-1">{errors.theaterName}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                Theater Logo
                                            </label>
                                            <div className="flex items-center gap-4">
                                                <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden">
                                                    {logoPreview ? (
                                                        <img src={logoPreview} alt="Theater Logo" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Image className="h-8 w-8 text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                                                    <button type="button" onClick={() => logoInputRef.current?.click()} className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium hover:bg-gray-200 transition">
                                                        {logoPreview ? 'Change Logo' : 'Upload Logo'}
                                                    </button>
                                                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP up to 2MB</p>
                                                </div>
                                            </div>
                                            {errors.theaterLogo && <p className="text-xs text-red-500 mt-1">{errors.theaterLogo}</p>}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                Theater Description <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                name="theaterDescription"
                                                rows={3}
                                                value={formData.theaterDescription}
                                                onChange={handleInputChange}
                                                onBlur={handleBlur}
                                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none ${
                                                    errors.theaterDescription && touched.theaterDescription ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-teal-300'
                                                }`}
                                                placeholder="Describe your theater, its history, unique features, and what makes it special..."
                                            />
                                            {errors.theaterDescription && touched.theaterDescription && (
                                                <p className="text-xs text-red-500 mt-1">{errors.theaterDescription}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                Theater Email <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="email"
                                                    name="theaterEmail"
                                                    value={formData.theaterEmail}
                                                    onChange={handleInputChange}
                                                    onBlur={handleBlur}
                                                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                                                        errors.theaterEmail && touched.theaterEmail ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-teal-300'
                                                    }`}
                                                    placeholder="info@grandtheater.com"
                                                />
                                            </div>
                                            {errors.theaterEmail && touched.theaterEmail && (
                                                <p className="text-xs text-red-500 mt-1">{errors.theaterEmail}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                Theater Phone <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="tel"
                                                    name="theaterPhone"
                                                    value={formData.theaterPhone}
                                                    onChange={handleInputChange}
                                                    onBlur={handleBlur}
                                                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                                                        errors.theaterPhone && touched.theaterPhone ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-teal-300'
                                                    }`}
                                                    placeholder="+251 911 234 567"
                                                />
                                            </div>
                                            {errors.theaterPhone && touched.theaterPhone && (
                                                <p className="text-xs text-red-500 mt-1">{errors.theaterPhone}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                Number of Halls <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="totalHalls"
                                                value={formData.totalHalls}
                                                onChange={handleInputChange}
                                                onBlur={handleBlur}
                                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                                                    errors.totalHalls && touched.totalHalls ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-teal-300'
                                                }`}
                                                placeholder="5"
                                                min="1"
                                                max="50"
                                            />
                                            {errors.totalHalls && touched.totalHalls && (
                                                <p className="text-xs text-red-500 mt-1">{errors.totalHalls}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                Total Seats <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="totalSeats"
                                                value={formData.totalSeats}
                                                onChange={handleInputChange}
                                                onBlur={handleBlur}
                                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                                                    errors.totalSeats && touched.totalSeats ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-teal-300'
                                                }`}
                                                placeholder="1200"
                                                min="10"
                                            />
                                            {errors.totalSeats && touched.totalSeats && (
                                                <p className="text-xs text-red-500 mt-1">{errors.totalSeats}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">Services Offered</label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {servicesList.map((service, idx) => {
                                                const Icon = service.icon;
                                                const isChecked = services.includes(service.name);
                                                return (
                                                    <label key={idx} className={`flex items-start gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                                                        isChecked ? 'border-teal-500 bg-gradient-to-r from-teal-50 to-teal-100' : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                                                    }`}>
                                                        <input type="checkbox" value={service.name} checked={isChecked} onChange={handleCheckboxChange} className="hidden" />
                                                        <Icon className={`h-5 w-5 flex-shrink-0 ${isChecked ? 'text-teal-600' : 'text-gray-400'}`} />
                                                        <div>
                                                            <p className={`text-sm font-medium ${isChecked ? 'text-teal-600' : 'text-gray-700'}`}>{service.name}</p>
                                                            <p className="text-xs text-gray-500">{service.description}</p>
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">Screen Types Available</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {screenTypeOptions.map((type, idx) => {
                                                const isChecked = screenTypes.includes(type);
                                                return (
                                                    <label key={idx} className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                                                        isChecked ? 'border-teal-500 bg-gradient-to-r from-teal-50 to-teal-100' : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                                                    }`}>
                                                        <input type="checkbox" value={type} checked={isChecked} onChange={handleScreenTypeChange} className="hidden" />
                                                        <span className={`text-sm font-medium ${isChecked ? 'text-teal-600' : 'text-gray-700'}`}>{type}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">City <span className="text-red-500">*</span></label>
                                            <select name="city" value={formData.city} onChange={handleInputChange} onBlur={handleBlur} className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                                                errors.city && touched.city ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-teal-300'
                                            }`}>
                                                <option value="">Select city</option>
                                                {cities.map(city => (<option key={city} value={city}>{city}</option>))}
                                            </select>
                                            {errors.city && touched.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Region <span className="text-red-500">*</span></label>
                                            <select name="region" value={formData.region} onChange={handleInputChange} onBlur={handleBlur} className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                                                errors.region && touched.region ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-teal-300'
                                            }`}>
                                                <option value="">Select region</option>
                                                {regions.map(region => (<option key={region} value={region}>{region}</option>))}
                                            </select>
                                            {errors.region && touched.region && <p className="text-xs text-red-500 mt-1">{errors.region}</p>}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Address <span className="text-red-500">*</span></label>
                                            <input type="text" name="address" value={formData.address} onChange={handleInputChange} onBlur={handleBlur} className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                                                errors.address && touched.address ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-teal-300'
                                            }`} placeholder="123 Bole Road, Addis Ababa" />
                                            {errors.address && touched.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Latitude</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input type="text" name="latitude" value={formData.latitude} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-teal-300" placeholder="9.0192" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Longitude</label>
                                            <div className="relative">
                                                <Compass className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input type="text" name="longitude" value={formData.longitude} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-teal-300" placeholder="38.7535" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 4: Pricing Plan */}
                            {step === 4 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2.5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg">
                                            <Wallet className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">Pricing Plan</h3>
                                            <p className="text-sm text-gray-500">Choose your preferred payment model</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">Select Pricing Model <span className="text-red-500">*</span></label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className={`cursor-pointer rounded-2xl border-2 p-5 transition-all ${formData.pricingModel === 'per_ticket' ? 'border-teal-500 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 shadow-lg' : 'border-gray-200 hover:border-teal-300 hover:shadow-md'}`} onClick={() => setFormData(prev => ({ ...prev, pricingModel: 'per_ticket' }))}>
                                                <div className="p-2 rounded-xl inline-block bg-gray-100 mb-3"><Ticket className="h-6 w-6 text-gray-600" /></div>
                                                <h3 className="font-bold text-lg">Per Ticket Selling</h3>
                                                <p className="text-sm text-gray-500 mt-1">Pay commission on each ticket sold</p>
                                                <p className="text-sm font-bold mt-3 text-teal-600">5-10% per ticket</p>
                                                <p className="text-xs text-gray-400 mt-1">No monthly fees, pay only when you sell</p>
                                            </div>
                                            <div className={`cursor-pointer rounded-2xl border-2 p-5 transition-all ${formData.pricingModel === 'contract' ? 'border-teal-500 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 shadow-lg' : 'border-gray-200 hover:border-teal-300 hover:shadow-md'}`} onClick={() => setFormData(prev => ({ ...prev, pricingModel: 'contract' }))}>
                                                <div className="p-2 rounded-xl inline-block bg-gray-100 mb-3"><Calendar className="h-6 w-6 text-gray-600" /></div>
                                                <h3 className="font-bold text-lg">Contract Plan</h3>
                                                <p className="text-sm text-gray-500 mt-1">Fixed contract with flexible terms</p>
                                                <p className="text-sm font-bold mt-3 text-teal-600">Varies by contract length</p>
                                                <p className="text-xs text-gray-400 mt-1">Choose monthly, quarterly, or yearly contract</p>
                                            </div>
                                        </div>
                                        {errors.pricingModel && <p className="text-xs text-red-500 mt-2">{errors.pricingModel}</p>}
                                    </div>

                                    {formData.pricingModel === 'contract' && (
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">Select Contract Type <span className="text-red-500">*</span></label>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {[
                                                    { id: "monthly", name: "Monthly Contract", price: "$299/month", discount: "0%" },
                                                    { id: "quarterly", name: "Quarterly Contract", price: "$249/month", discount: "Save 15%" },
                                                    { id: "yearly", name: "Yearly Contract", price: "$199/month", discount: "Save 33%" }
                                                ].map((contract) => (
                                                    <div key={contract.id} className={`cursor-pointer rounded-2xl border-2 p-4 transition-all ${formData.contractType === contract.id ? 'border-teal-500 bg-gradient-to-br from-teal-500/10 to-teal-600/10 shadow-lg' : 'border-gray-200 hover:border-teal-300 hover:shadow-md'}`} onClick={() => setFormData(prev => ({ ...prev, contractType: contract.id }))}>
                                                        {contract.discount !== "0%" && <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">{contract.discount}</span>}
                                                        <h4 className={`font-bold mt-2 ${formData.contractType === contract.id ? 'text-teal-600' : 'text-gray-900'}`}>{contract.name}</h4>
                                                        <p className="text-2xl font-bold text-gray-900 mt-2">{contract.price}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            {errors.contractType && <p className="text-xs text-red-500 mt-2">{errors.contractType}</p>}
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Payout Frequency <span className="text-red-500">*</span></label>
                                        <select name="payoutFrequency" value={formData.payoutFrequency} onChange={handleInputChange} className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent ${errors.payoutFrequency ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-teal-300'}`}>
                                            <option value="">Select frequency</option>
                                            {payoutFrequencies.map(freq => (<option key={freq} value={freq}>{freq.charAt(0).toUpperCase() + freq.slice(1)}</option>))}
                                        </select>
                                        {errors.payoutFrequency && <p className="text-xs text-red-500 mt-1">{errors.payoutFrequency}</p>}
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <input type="checkbox" name="expeditedEnabled" checked={formData.expeditedEnabled} onChange={handleInputChange} className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
                                        <div><span className="font-medium text-gray-800">Enable Expedited Processing</span><p className="text-xs text-gray-500">Priority review and faster onboarding (additional fees apply)</p></div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <input type="checkbox" name="acceptMarketing" checked={formData.acceptMarketing} onChange={handleInputChange} className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
                                        <div><span className="font-medium text-gray-800">Accept Marketing Communications</span><p className="text-xs text-gray-500">Receive updates, promotions, and newsletters</p></div>
                                    </div>

                                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200">
                                        <div className="flex items-start gap-3">
                                            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-amber-800">Important Information</p>
                                                <p className="text-xs text-amber-700 mt-1">By submitting this registration, you agree to our terms and conditions. The theater will be pending approval until verified by an admin.</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Navigation Buttons - Fixed at bottom */}
                        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-2xl">
                            <div className="flex justify-between">
                                {step > 1 && (
                                    <button onClick={handleBack} className="px-6 py-2.5 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2 font-medium">
                                        <ChevronLeft className="h-4 w-4" /> Back
                                    </button>
                                )}
                                {step < 4 ? (
                                    <button onClick={handleNext} className={`px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-medium transition-all flex items-center gap-2 shadow-md hover:shadow-lg ${step === 1 ? 'ml-auto' : ''}`}>
                                        Continue <ChevronRight className="h-4 w-4" />
                                    </button>
                                ) : (
                                    <button onClick={handleSubmit} disabled={isSubmitting} className="ml-auto px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-medium transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                                        {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : <><Send className="h-4 w-4" /> Submit Registration</>}
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            <SuccessPopup isOpen={showSuccessPopup} onClose={() => setShowSuccessPopup(false)} type={popupMessage.type} title={popupMessage.title} message={popupMessage.message} duration={3000} position="top-right" />
        </>
    );
};

export default AddTheater;