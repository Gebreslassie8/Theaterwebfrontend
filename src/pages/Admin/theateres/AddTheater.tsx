// src/pages/Admin/theaters/AddTheater.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, Building, Mail, AlertCircle, CheckCircle, User, Phone, MapPin, Hash, Users, Shield, CreditCard, FileText, Calendar, Briefcase, Home, Globe, Clock, Truck, Heart, FileCheck, Image, Info, Layers, Map, Navigation, Star, Wifi, Coffee, Car, Utensils, Film, Tv, Speaker, Volume2 } from 'lucide-react';
import * as Yup from 'yup';
import ReusableForm from '../../../components/Reusable/ReusableForm';
import ButtonStyle from '../../../components/Reusable/ButtonStyle';
import Colors from '../../../components/Reusable/Colors';

interface AddTheaterProps {
    onSubmit: (values: any) => void;
    onClose: () => void;
    initialValues?: any;
    formTitle?: string;
}

// Validation Schema
const ValidationSchema = Yup.object({
    // Business Information
    businessName: Yup.string().required('Business name is required').min(2, 'Must be at least 2 characters'),
    tradeName: Yup.string().required('Trade name is required'),
    businessType: Yup.string().required('Business type is required'),
    businessLicense: Yup.string().required('Business license is required'),
    taxId: Yup.string().required('Tax ID is required'),
    yearsInOperation: Yup.string().required('Years in operation is required'),
    businessDescription: Yup.string().max(500, 'Description cannot exceed 500 characters'),

    // Contact Information
    ownerName: Yup.string().required('Owner name is required').min(2, 'Must be at least 2 characters'),
    ownerPosition: Yup.string().required('Owner position is required'),
    ownerEmail: Yup.string().required('Email is required').email('Invalid email format'),
    ownerPhone: Yup.string().required('Phone is required').matches(/^[0-9+\-\s()]{10,15}$/, 'Invalid phone number'),
    secondaryName: Yup.string(),
    secondaryPosition: Yup.string(),
    secondaryEmail: Yup.string().email('Invalid email format'),
    secondaryPhone: Yup.string().matches(/^[0-9+\-\s()]{10,15}$/, 'Invalid phone number'),
    emergencyName: Yup.string().required('Emergency contact name is required'),
    emergencyPhone: Yup.string().required('Emergency phone is required').matches(/^[0-9+\-\s()]{10,15}$/, 'Invalid phone number'),
    emergencyRelation: Yup.string().required('Emergency contact relation is required'),

    // Theater Details
    theaterName: Yup.string().required('Theater name is required').min(2, 'Must be at least 2 characters'),
    theaterDescription: Yup.string().max(1000, 'Description cannot exceed 1000 characters'),
    theaterEmail: Yup.string().required('Theater email is required').email('Invalid email format'),
    theaterPhone: Yup.string().required('Theater phone is required').matches(/^[0-9+\-\s()]{10,15}$/, 'Invalid phone number'),
    totalHalls: Yup.number().required('Number of halls is required').min(1, 'At least 1 hall').max(50, 'Maximum 50 halls'),
    totalSeats: Yup.number().required('Total seats is required').min(10, 'At least 10 seats').max(10000, 'Maximum 10000 seats'),
    city: Yup.string().required('City is required'),
    region: Yup.string().required('Region is required'),
    address: Yup.string().required('Address is required'),
    latitude: Yup.string(),
    longitude: Yup.string(),

    // Pricing Plan
    pricingModel: Yup.string().required('Pricing model is required'),
    contractType: Yup.string().when('pricingModel', {
        is: 'contract',
        then: () => Yup.string().required('Contract type is required'),
        otherwise: () => Yup.string()
    }),
    payoutFrequency: Yup.string().required('Payout frequency is required'),

    // Agreements
    acceptMarketing: Yup.boolean(),
    paymentCompleted: Yup.boolean().oneOf([true], 'You must confirm payment completion to proceed')
});

const ReusableButton: React.FC<any> = ({
    onClick,
    type = 'button',
    children,
    variant = 'primary',
    className = '',
    disabled = false,
    loading = false
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const getButtonStyle = () => {
        if (variant === 'secondary') {
            return {
                backgroundColor: isHovered ? Colors.lightGray : Colors.white,
                color: Colors.error,
                transition: 'all 0.3s ease',
                border: `2px solid ${Colors.error}`,
                transform: isPressed ? 'scale(0.98)' : 'scale(1)',
            };
        }
        if (variant === 'danger') {
            return {
                backgroundColor: isHovered ? Colors.error : Colors.red,
                color: Colors.white,
                transition: 'all 0.3s ease',
                border: 'none',
                transform: isPressed ? 'scale(0.98)' : 'scale(1)',
            };
        }
        return {
            backgroundColor: isHovered ? ButtonStyle.hoverBackgroundColor : ButtonStyle.backgroundColor,
            color: ButtonStyle.color,
            transition: 'all 0.3s ease',
            border: 'none',
            transform: isPressed ? 'scale(0.98)' : 'scale(1)',
        };
    };

    const buttonStyle = getButtonStyle();

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${ButtonStyle.base} ${className} relative overflow-hidden`}
            style={buttonStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setIsPressed(false);
            }}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
        >
            {loading ? (
                <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                </div>
            ) : (
                children
            )}
            {isHovered && variant === 'primary' && (
                <div className="absolute inset-0 bg-white/10 animate-pulse" />
            )}
        </button>
    );
};

// Section Header Component
const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; description?: string }> = ({ icon, title, description }) => (
    <div className="mb-4 pb-2 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg">
                {icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        {description && <p className="text-xs text-gray-500 ml-10">{description}</p>}
    </div>
);

// Services and Screen Types Checkbox Group
const CheckboxGroup: React.FC<{
    label: string;
    name: string;
    options: { value: string; label: string; icon?: string }[];
    value: string[];
    onChange: (value: string[]) => void;
    columns?: number;
}> = ({ label, name, options, value, onChange, columns = 3 }) => {
    const toggleOption = (optionValue: string) => {
        if (value.includes(optionValue)) {
            onChange(value.filter(v => v !== optionValue));
        } else {
            onChange([...value, optionValue]);
        }
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <div className={`grid grid-cols-2 md:grid-cols-${columns} gap-2`}>
                {options.map(option => (
                    <label
                        key={option.value}
                        className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                        <input
                            type="checkbox"
                            checked={value.includes(option.value)}
                            onChange={() => toggleOption(option.value)}
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                        />
                        {option.icon && <span className="text-sm">{option.icon}</span>}
                        <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

// Form Input Component
const FormInput: React.FC<{
    label: string;
    name: string;
    type: string;
    value: any;
    onChange: (e: React.ChangeEvent<any>) => void;
    onBlur: (e: React.FocusEvent<any>) => void;
    error?: string;
    touched?: boolean;
    placeholder?: string;
    icon?: React.ReactNode;
    required?: boolean;
    rows?: number;
}> = ({ label, name, type, value, onChange, onBlur, error, touched, placeholder, icon, required, rows }) => {
    if (type === 'textarea') {
        return (
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <div className="relative group">
                    {icon && (
                        <div className="absolute left-3 top-3 text-gray-400 group-focus-within:text-purple-500 transition-colors">
                            {icon}
                        </div>
                    )}
                    <textarea
                        name={name}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        placeholder={placeholder}
                        rows={rows || 3}
                        className={`w-full ${icon ? 'pl-10' : 'px-4'} py-2.5 border ${error && touched ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none`}
                    />
                </div>
                {error && touched && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-xs mt-1 flex items-center gap-1"
                    >
                        <AlertCircle className="h-3 w-3" />
                        {error}
                    </motion.p>
                )}
            </div>
        );
    }

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative group">
                {icon && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    className={`w-full ${icon ? 'pl-10' : 'px-4'} pr-4 py-2.5 border ${error && touched ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white`}
                />
            </div>
            {error && touched && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1 flex items-center gap-1"
                >
                    <AlertCircle className="h-3 w-3" />
                    {error}
                </motion.p>
            )}
        </div>
    );
};

// Select Input Component
const FormSelect: React.FC<{
    label: string;
    name: string;
    value: any;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void;
    error?: string;
    touched?: boolean;
    options: { value: string; label: string }[];
    required?: boolean;
    icon?: React.ReactNode;
}> = ({ label, name, value, onChange, onBlur, error, touched, options, required, icon }) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative group">
                {icon && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors z-10">
                        {icon}
                    </div>
                )}
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    className={`w-full ${icon ? 'pl-10' : 'px-4'} pr-4 py-2.5 border ${error && touched ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none`}
                >
                    <option value="">Select {label}</option>
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            {error && touched && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1 flex items-center gap-1"
                >
                    <AlertCircle className="h-3 w-3" />
                    {error}
                </motion.p>
            )}
        </div>
    );
};

const AddTheater: React.FC<AddTheaterProps> = ({
    onSubmit,
    onClose,
    initialValues = {
        // Business Information
        businessName: '',
        tradeName: '',
        businessType: '',
        businessLicense: '',
        taxId: '',
        yearsInOperation: '',
        businessDescription: '',
        // Contact Information
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
        // Theater Details
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
        // Documents
        documents: {},
        // Pricing Plan
        pricingModel: '',
        contractType: '',
        payoutFrequency: '',
        expeditedEnabled: false,
        // Agreements
        acceptMarketing: false,
        paymentCompleted: false,
        paymentIntentId: '',
    },
    formTitle = 'Add New Theater'
}) => {
    const [currentSection, setCurrentSection] = useState(0);
    const [services, setServices] = useState<string[]>([]);
    const [screenTypes, setScreenTypes] = useState<string[]>([]);
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const sections = [
        { title: 'Business Information', icon: <Briefcase className="h-4 w-4" /> },
        { title: 'Contact Information', icon: <User className="h-4 w-4" /> },
        { title: 'Theater Details', icon: <Building className="h-4 w-4" /> },
        { title: 'Pricing & Agreements', icon: <CreditCard className="h-4 w-4" /> }
    ];

    const serviceOptions = [
        { value: 'food_court', label: 'Food Court', icon: '🍔' },
        { value: 'vip_lounge', label: 'VIP Lounge', icon: '✨' },
        { value: 'parking', label: 'Parking', icon: '🅿️' },
        { value: 'wheelchair_access', label: 'Wheelchair Access', icon: '♿' },
        { value: 'concessions', label: 'Concessions', icon: '🍿' },
        { value: 'party_rooms', label: 'Party Rooms', icon: '🎉' },
        { value: 'arcade', label: 'Arcade', icon: '🎮' },
        { value: 'cafe', label: 'Cafe', icon: '☕' },
        { value: 'wine_bar', label: 'Wine Bar', icon: '🍷' },
        { value: 'art_gallery', label: 'Art Gallery', icon: '🎨' },
        { value: 'fine_dining', label: 'Fine Dining', icon: '🍽️' },
        { value: 'valet_parking', label: 'Valet Parking', icon: '🚗' }
    ];

    const screenTypeOptions = [
        { value: 'standard', label: 'Standard', icon: '📽️' },
        { value: 'imax', label: 'IMAX', icon: '🎬' },
        { value: '4dx', label: '4DX', icon: '💺' },
        { value: 'dolby_atmos', label: 'Dolby Atmos', icon: '🔊' },
        { value: '3d', label: '3D', icon: '👓' },
        { value: 'xd', label: 'XD', icon: '⭐' },
        { value: 'screenx', label: 'ScreenX', icon: '🖥️' }
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        
        setFormValues(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Clear error when field is touched
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        
        // Validate field on blur
        try {
            ValidationSchema.validateSyncAt(name, formValues);
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        } catch (error: any) {
            setFormErrors(prev => ({ ...prev, [name]: error.message }));
        }
    };

    const validateSection = (section: number): boolean => {
        let isValid = true;
        const fieldsToValidate: string[] = [];
        
        if (section === 0) {
            fieldsToValidate.push('businessName', 'tradeName', 'businessType', 'businessLicense', 'taxId', 'yearsInOperation');
        } else if (section === 1) {
            fieldsToValidate.push('ownerName', 'ownerPosition', 'ownerEmail', 'ownerPhone', 'emergencyName', 'emergencyPhone', 'emergencyRelation');
        } else if (section === 2) {
            fieldsToValidate.push('theaterName', 'theaterEmail', 'theaterPhone', 'totalHalls', 'totalSeats', 'city', 'region', 'address');
        } else if (section === 3) {
            fieldsToValidate.push('pricingModel', 'payoutFrequency');
            if (formValues.pricingModel === 'contract') {
                fieldsToValidate.push('contractType');
            }
        }
        
        fieldsToValidate.forEach(field => {
            try {
                ValidationSchema.validateSyncAt(field, formValues);
            } catch (error: any) {
                setFormErrors(prev => ({ ...prev, [field]: error.message }));
                setTouched(prev => ({ ...prev, [field]: true }));
                isValid = false;
            }
        });
        
        return isValid;
    };

    const nextSection = () => {
        if (validateSection(currentSection)) {
            if (currentSection < sections.length - 1) {
                setCurrentSection(currentSection + 1);
            }
        }
    };

    const prevSection = () => {
        if (currentSection > 0) {
            setCurrentSection(currentSection - 1);
        }
    };

    const handleFinalSubmit = async () => {
        // Validate all sections
        let allValid = true;
        for (let i = 0; i <= 3; i++) {
            if (!validateSection(i)) {
                allValid = false;
                setCurrentSection(i);
                break;
            }
        }
        
        if (!allValid) {
            return;
        }
        
        if (!formValues.paymentCompleted) {
            setFormErrors(prev => ({ ...prev, paymentCompleted: 'You must confirm payment completion' }));
            return;
        }
        
        setIsSubmitting(true);
        
        const submitData = {
            ...formValues,
            services,
            screenTypes,
            expeditedEnabled: formValues.expeditedEnabled || false,
            acceptMarketing: formValues.acceptMarketing || false,
            paymentCompleted: formValues.paymentCompleted || false,
        };
        
        try {
            await onSubmit(submitData);
            // Don't close immediately - let parent handle success
        } catch (error) {
            console.error('Submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Modal Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg">
                                <Building className="h-5 w-5 text-purple-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">{formTitle}</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Progress Steps */}
                    <div className="px-6 pt-4">
                        <div className="flex items-center justify-between">
                            {sections.map((section, index) => (
                                <div key={index} className="flex-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (index <= currentSection) {
                                                setCurrentSection(index);
                                            }
                                        }}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                                            currentSection === index
                                                ? 'bg-purple-100 text-purple-700'
                                                : currentSection > index
                                                ? 'text-green-600'
                                                : 'text-gray-400'
                                        } ${index > currentSection ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                    >
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                            currentSection === index
                                                ? 'bg-purple-600 text-white'
                                                : currentSection > index
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-200 text-gray-500'
                                        }`}>
                                            {currentSection > index ? <CheckCircle className="w-3 h-3" /> : index + 1}
                                        </div>
                                        <span className="text-sm font-medium hidden sm:inline">{section.title}</span>
                                    </button>
                                    {index < sections.length - 1 && (
                                        <div className="flex-1 h-0.5 bg-gray-200 mt-4">
                                            <div className={`h-full transition-all duration-300 ${
                                                currentSection > index ? 'bg-green-500 w-full' : 'w-0'
                                            }`} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6">
                        {/* Section 0: Business Information */}
                        {currentSection === 0 && (
                            <div>
                                <SectionHeader
                                    icon={<Briefcase className="h-4 w-4 text-purple-600" />}
                                    title="Business Information"
                                    description="Enter your business legal details"
                                />
                                
                                <FormInput
                                    label="Business Name"
                                    name="businessName"
                                    type="text"
                                    value={formValues.businessName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={formErrors.businessName}
                                    touched={touched.businessName}
                                    placeholder="Enter legal business name"
                                    icon={<Building className="h-4 w-4" />}
                                    required
                                />
                                
                                <FormInput
                                    label="Trade Name (DBA)"
                                    name="tradeName"
                                    type="text"
                                    value={formValues.tradeName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={formErrors.tradeName}
                                    touched={touched.tradeName}
                                    placeholder="Enter trading name"
                                    icon={<Home className="h-4 w-4" />}
                                    required
                                />
                                
                                <FormSelect
                                    label="Business Type"
                                    name="businessType"
                                    value={formValues.businessType}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={formErrors.businessType}
                                    touched={touched.businessType}
                                    options={[
                                        { value: 'LLC', label: 'LLC' },
                                        { value: 'Corporation', label: 'Corporation' },
                                        { value: 'Partnership', label: 'Partnership' },
                                        { value: 'Sole Proprietorship', label: 'Sole Proprietorship' },
                                        { value: 'Non-Profit', label: 'Non-Profit' }
                                    ]}
                                    required
                                    icon={<Briefcase className="h-4 w-4" />}
                                />
                                
                                <FormInput
                                    label="Business License Number"
                                    name="businessLicense"
                                    type="text"
                                    value={formValues.businessLicense}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={formErrors.businessLicense}
                                    touched={touched.businessLicense}
                                    placeholder="Enter business license number"
                                    icon={<FileCheck className="h-4 w-4" />}
                                    required
                                />
                                
                                <FormInput
                                    label="Tax ID / EIN"
                                    name="taxId"
                                    type="text"
                                    value={formValues.taxId}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={formErrors.taxId}
                                    touched={touched.taxId}
                                    placeholder="Enter Tax ID or EIN"
                                    icon={<Hash className="h-4 w-4" />}
                                    required
                                />
                                
                                <FormSelect
                                    label="Years in Operation"
                                    name="yearsInOperation"
                                    value={formValues.yearsInOperation}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={formErrors.yearsInOperation}
                                    touched={touched.yearsInOperation}
                                    options={[
                                        { value: '0-1', label: 'Less than 1 year' },
                                        { value: '1-3', label: '1-3 years' },
                                        { value: '3-5', label: '3-5 years' },
                                        { value: '5-10', label: '5-10 years' },
                                        { value: '10+', label: '10+ years' }
                                    ]}
                                    required
                                    icon={<Calendar className="h-4 w-4" />}
                                />
                                
                                <FormInput
                                    label="Business Description"
                                    name="businessDescription"
                                    type="textarea"
                                    value={formValues.businessDescription}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={formErrors.businessDescription}
                                    touched={touched.businessDescription}
                                    placeholder="Describe your business..."
                                    icon={<Info className="h-4 w-4" />}
                                    rows={3}
                                />
                            </div>
                        )}

                        {/* Section 1: Contact Information */}
                        {currentSection === 1 && (
                            <div>
                                <SectionHeader
                                    icon={<User className="h-4 w-4 text-purple-600" />}
                                    title="Primary Contact Information"
                                    description="Main contact person for this theater"
                                />
                                
                                <FormInput
                                    label="Owner Full Name"
                                    name="ownerName"
                                    type="text"
                                    value={formValues.ownerName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={formErrors.ownerName}
                                    touched={touched.ownerName}
                                    placeholder="Enter owner name"
                                    icon={<User className="h-4 w-4" />}
                                    required
                                />
                                
                                <FormInput
                                    label="Owner Position"
                                    name="ownerPosition"
                                    type="text"
                                    value={formValues.ownerPosition}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={formErrors.ownerPosition}
                                    touched={touched.ownerPosition}
                                    placeholder="e.g., CEO, Owner, Director"
                                    icon={<Briefcase className="h-4 w-4" />}
                                    required
                                />
                                
                                <FormInput
                                    label="Owner Email"
                                    name="ownerEmail"
                                    type="email"
                                    value={formValues.ownerEmail}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={formErrors.ownerEmail}
                                    touched={touched.ownerEmail}
                                    placeholder="owner@example.com"
                                    icon={<Mail className="h-4 w-4" />}
                                    required
                                />
                                
                                <FormInput
                                    label="Owner Phone"
                                    name="ownerPhone"
                                    type="tel"
                                    value={formValues.ownerPhone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={formErrors.ownerPhone}
                                    touched={touched.ownerPhone}
                                    placeholder="+1 (555) 000-0000"
                                    icon={<Phone className="h-4 w-4" />}
                                    required
                                />

                                <SectionHeader
                                    icon={<User className="h-4 w-4 text-purple-600" />}
                                    title="Secondary Contact (Optional)"
                                    description="Additional contact person"
                                />
                                
                                <FormInput
                                    label="Secondary Contact Name"
                                    name="secondaryName"
                                    type="text"
                                    value={formValues.secondaryName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={formErrors.secondaryName}
                                    touched={touched.secondaryName}
                                    placeholder="Optional"
                                    icon={<User className="h-4 w-4" />}
                                />
                                
                                <FormInput
                                    label="Secondary Position"
                                    name="secondaryPosition"
                                    type="text"
                                    value={formValues.secondaryPosition}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={formErrors.secondaryPosition}
                                    touched={touched.secondaryPosition}
                                    placeholder="e.g., Manager"
                                    icon={<Briefcase className="h-4 w-4" />}
                                />
                                
                                <FormInput
                                    label="Secondary Email"
                                    name="secondaryEmail"
                                    type="email"
                                    value={formValues.secondaryEmail}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={formErrors.secondaryEmail}
                                    touched={touched.secondaryEmail}
                                    placeholder="secondary@example.com"
                                    icon={<Mail className="h-4 w-4" />}
                                />
                                
                                <FormInput
                                    label="Secondary Phone"
                                    name="secondaryPhone"
                                    type="tel"
                                    value={formValues.secondaryPhone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={formErrors.secondaryPhone}
                                    touched={touched.secondaryPhone}
                                    placeholder="+1 (555) 000-0000"
                                    icon={<Phone className="h-4 w-4" />}
                                />

                                <SectionHeader
                                    icon={<AlertCircle className="h-4 w-4 text-purple-600" />}
                                    title="Emergency Contact"
                                    description="For urgent matters"
                                />
                                
                                <FormInput
                                    label="Emergency Contact Name"
                                    name="emergencyName"
                                    type="text"
                                    value={formValues.emergencyName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={formErrors.emergencyName}
                                    touched={touched.emergencyName}
                                    placeholder="Emergency contact person"
                                    icon={<AlertCircle className="h-4 w-4" />}
                                    required
                                />
                                
                                <FormInput
                                    label="Emergency Phone"
                                    name="emergencyPhone"
                                    type="tel"
                                    value={formValues.emergencyPhone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={formErrors.emergencyPhone}
                                    touched={touched.emergencyPhone}
                                    placeholder="+1 (555) 000-0000"
                                    icon={<Phone className="h-4 w-4" />}
                                    required
                                />
                                
                                <FormInput
                                    label="Emergency Contact Relation"
                                    name="emergencyRelation"
                                    type="text"
                                    value={formValues.emergencyRelation}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={formErrors.emergencyRelation}
                                    touched={touched.emergencyRelation}
                                    placeholder="e.g., Spouse, Parent, Sibling"
                                    icon={<Heart className="h-4 w-4" />}
                                    required
                                />
                            </div>
                        )}

                        {/* Section 2: Theater Details */}
                        {currentSection === 2 && (
                            <div>
                                <SectionHeader
                                    icon={<Building className="h-4 w-4 text-purple-600" />}
                                    title="Theater Information"
                                    description="Details about your theater facility"
                                />
                                
                                <FormInput
                                    label="Theater Name"
                                    name="theaterName"
                                    type="text"
                                    value={formValues.theaterName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={formErrors.theaterName}
                                    touched={touched.theaterName}
                                    placeholder="Enter theater name"
                                    icon={<Building className="h-4 w-4" />}
                                    required
                                />
                                
                                <FormInput
                                    label="Theater Email"
                                    name="theaterEmail"
                                    type="email"
                                    value={formValues.theaterEmail}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={formErrors.theaterEmail}
                                    touched={touched.theaterEmail}
                                    placeholder="theater@example.com"
                                    icon={<Mail className="h-4 w-4" />}
                                    required
                                />
                                
                                <FormInput
                                    label="Theater Phone"
                                    name="theaterPhone"
                                    type="tel"
                                    value={formValues.theaterPhone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={formErrors.theaterPhone}
                                    touched={touched.theaterPhone}
                                    placeholder="+1 (555) 000-0000"
                                    icon={<Phone className="h-4 w-4" />}
                                    required
                                />
                                
                                <FormInput
                                    label="Theater Description"
                                    name="theaterDescription"
                                    type="textarea"
                                    value={formValues.theaterDescription}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={formErrors.theaterDescription}
                                    touched={touched.theaterDescription}
                                    placeholder="Describe your theater..."
                                    icon={<Info className="h-4 w-4" />}
                                    rows={3}
                                />
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <FormInput
                                        label="Total Halls/Screens"
                                        name="totalHalls"
                                        type="number"
                                        value={formValues.totalHalls}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={formErrors.totalHalls}
                                        touched={touched.totalHalls}
                                        placeholder="Number of halls"
                                        icon={<Layers className="h-4 w-4" />}
                                        required
                                    />
                                    
                                    <FormInput
                                        label="Total Seats"
                                        name="totalSeats"
                                        type="number"
                                        value={formValues.totalSeats}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={formErrors.totalSeats}
                                        touched={touched.totalSeats}
                                        placeholder="Total seating capacity"
                                        icon={<Users className="h-4 w-4" />}
                                        required
                                    />
                                </div>

                                <SectionHeader
                                    icon={<MapPin className="h-4 w-4 text-purple-600" />}
                                    title="Location"
                                    description="Physical address of your theater"
                                />
                                
                                <FormInput
                                    label="Street Address"
                                    name="address"
                                    type="text"
                                    value={formValues.address}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={formErrors.address}
                                    touched={touched.address}
                                    placeholder="Street address"
                                    icon={<MapPin className="h-4 w-4" />}
                                    required
                                />
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <FormInput
                                        label="City"
                                        name="city"
                                        type="text"
                                        value={formValues.city}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={formErrors.city}
                                        touched={touched.city}
                                        placeholder="City"
                                        icon={<Home className="h-4 w-4" />}
                                        required
                                    />
                                    
                                    <FormInput
                                        label="State/Region"
                                        name="region"
                                        type="text"
                                        value={formValues.region}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={formErrors.region}
                                        touched={touched.region}
                                        placeholder="State or region"
                                        icon={<Globe className="h-4 w-4" />}
                                        required
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <FormInput
                                        label="Latitude"
                                        name="latitude"
                                        type="text"
                                        value={formValues.latitude}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={formErrors.latitude}
                                        touched={touched.latitude}
                                        placeholder="e.g., 40.7128"
                                        icon={<Navigation className="h-4 w-4" />}
                                    />
                                    
                                    <FormInput
                                        label="Longitude"
                                        name="longitude"
                                        type="text"
                                        value={formValues.longitude}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={formErrors.longitude}
                                        touched={touched.longitude}
                                        placeholder="e.g., -74.0060"
                                        icon={<Navigation className="h-4 w-4" />}
                                    />
                                </div>

                                <SectionHeader
                                    icon={<Star className="h-4 w-4 text-purple-600" />}
                                    title="Services & Amenities"
                                    description="Select all services your theater offers"
                                />
                                
                                <CheckboxGroup
                                    label="Theater Services"
                                    name="services"
                                    options={serviceOptions}
                                    value={services}
                                    onChange={setServices}
                                    columns={3}
                                />

                                <SectionHeader
                                    icon={<Film className="h-4 w-4 text-purple-600" />}
                                    title="Screen Types"
                                    description="Select the types of screens available"
                                />
                                
                                <CheckboxGroup
                                    label="Screen Types"
                                    name="screenTypes"
                                    options={screenTypeOptions}
                                    value={screenTypes}
                                    onChange={setScreenTypes}
                                    columns={3}
                                />
                            </div>
                        )}

                        {/* Section 3: Pricing & Agreements */}
                        {currentSection === 3 && (
                            <div>
                                <SectionHeader
                                    icon={<CreditCard className="h-4 w-4 text-purple-600" />}
                                    title="Pricing Plan"
                                    description="Select your preferred pricing model"
                                />
                                
                                <FormSelect
                                    label="Pricing Model"
                                    name="pricingModel"
                                    value={formValues.pricingModel}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={formErrors.pricingModel}
                                    touched={touched.pricingModel}
                                    options={[
                                        { value: 'per_ticket', label: 'Per Ticket Commission' },
                                        { value: 'contract', label: 'Contract Based' }
                                    ]}
                                    required
                                    icon={<CreditCard className="h-4 w-4" />}
                                />
                                
                                {formValues.pricingModel === 'contract' && (
                                    <FormSelect
                                        label="Contract Type"
                                        name="contractType"
                                        value={formValues.contractType}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={formErrors.contractType}
                                        touched={touched.contractType}
                                        options={[
                                            { value: 'monthly', label: 'Monthly' },
                                            { value: 'quarterly', label: 'Quarterly' },
                                            { value: 'yearly', label: 'Yearly' }
                                        ]}
                                        required
                                        icon={<FileText className="h-4 w-4" />}
                                    />
                                )}
                                
                                <FormSelect
                                    label="Payout Frequency"
                                    name="payoutFrequency"
                                    value={formValues.payoutFrequency}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={formErrors.payoutFrequency}
                                    touched={touched.payoutFrequency}
                                    options={[
                                        { value: 'weekly', label: 'Weekly' },
                                        { value: 'biweekly', label: 'Bi-Weekly' },
                                        { value: 'monthly', label: 'Monthly' }
                                    ]}
                                    required
                                    icon={<Clock className="h-4 w-4" />}
                                />

                                <SectionHeader
                                    icon={<Truck className="h-4 w-4 text-purple-600" />}
                                    title="Expedited Processing"
                                />
                                
                                <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="expeditedEnabled"
                                            checked={formValues.expeditedEnabled}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                                        />
                                        <div>
                                            <span className="font-medium text-gray-800">Enable Expedited Processing</span>
                                            <p className="text-xs text-gray-500">Priority review and faster onboarding (additional fees apply)</p>
                                        </div>
                                    </label>
                                </div>

                                <SectionHeader
                                    icon={<Heart className="h-4 w-4 text-purple-600" />}
                                    title="Agreements"
                                />
                                
                                <div className="space-y-3 mb-4">
                                    <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="acceptMarketing"
                                            checked={formValues.acceptMarketing}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                                        />
                                        <div>
                                            <span className="font-medium text-gray-800">Accept Marketing Communications</span>
                                            <p className="text-xs text-gray-500">Receive updates, promotions, and newsletters</p>
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg cursor-pointer border border-green-200">
                                        <input
                                            type="checkbox"
                                            name="paymentCompleted"
                                            checked={formValues.paymentCompleted}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                            required
                                        />
                                        <div>
                                            <span className="font-medium text-green-800">✓ Payment Completed</span>
                                            <p className="text-xs text-green-700">Confirm that payment has been processed</p>
                                        </div>
                                    </label>
                                </div>

                                {formErrors.paymentCompleted && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {formErrors.paymentCompleted}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Info Alert */}
                        <div className="mt-6 flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-blue-700">
                                Fields marked with <span className="text-red-500">*</span> are required.
                                Theater owner will receive login credentials via email after approval.
                            </p>
                        </div>

                        {/* Form Actions */}
                        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200 mt-4">
                            <ReusableButton
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                    if (currentSection === 0) {
                                        onClose();
                                    } else {
                                        prevSection();
                                    }
                                }}
                                className="flex-1 py-2.5"
                            >
                                {currentSection === 0 ? 'Cancel' : 'Previous'}
                            </ReusableButton>
                            
                            {currentSection < sections.length - 1 ? (
                                <ReusableButton
                                    type="button"
                                    variant="primary"
                                    onClick={nextSection}
                                    className="flex-1 py-2.5"
                                >
                                    Continue
                                </ReusableButton>
                            ) : (
                                <ReusableButton
                                    type="button"
                                    variant="primary"
                                    onClick={handleFinalSubmit}
                                    disabled={isSubmitting || !formValues.paymentCompleted}
                                    loading={isSubmitting}
                                    className="flex-1 py-2.5"
                                >
                                    <Building className="h-4 w-4 mr-2" />
                                    Submit Registration
                                </ReusableButton>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AddTheater;