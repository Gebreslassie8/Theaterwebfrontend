// Frontend/src/pages/Contact.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Mail, Phone, MapPin, Clock, Send, MessageCircle,
    ArrowRight, UserCog, Theater, ChevronDown,
    Info, ExternalLink, Globe, Navigation, Star, Loader
} from 'lucide-react';
import {
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaLinkedin,
    FaYoutube,
    FaTelegram,
    FaTiktok
} from 'react-icons/fa';
import SuccessPopup from '../components/Reusable/SuccessPopup';
import { useTranslation } from 'react-i18next';
import supabase from "@/config/supabaseClient";

// Types
interface ContactFormData {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    category: string;
    recipientType: 'admin' | 'theater';
    theaterId?: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
    subject?: string;
    message?: string;
    category?: string;
    theaterId?: string;
}

interface SocialLinks {
    facebook: string | null;
    twitter: string | null;
    instagram: string | null;
    linkedin: string | null;
    youtube: string | null;
    telegram: string | null;
    tiktok: string | null;
}

interface Theater {
    id: string;
    legal_business_name: string;
    city: string;
    email: string;
    phone: string;
    address: string;
    description?: string;
    logo_url?: string;
    latitude?: number;
    longitude?: number;
    status?: string;
    is_approved?: boolean;
    social_links?: SocialLinks;
}

// Dynamic Theater Social Links Component - Shows only social links that the theater has added
const TheaterSocialLinks: React.FC<{ theater: Theater }> = ({ theater }) => {
    const { t } = useTranslation();
    
    // Define available social platforms with their icons and colors
    const socialPlatforms = [
        { 
            key: 'facebook', 
            icon: FaFacebook, 
            label: 'Facebook', 
            bgClass: 'bg-[#1877F2]',
            brandColor: '#1877F2'
        },
        { 
            key: 'twitter', 
            icon: FaTwitter, 
            label: 'Twitter', 
            bgClass: 'bg-[#1DA1F2]',
            brandColor: '#1DA1F2'
        },
        { 
            key: 'instagram', 
            icon: FaInstagram, 
            label: 'Instagram', 
            bgClass: 'bg-[#E4405F]',
            brandColor: '#E4405F'
        },
        { 
            key: 'linkedin', 
            icon: FaLinkedin, 
            label: 'LinkedIn', 
            bgClass: 'bg-[#0A66C2]',
            brandColor: '#0A66C2'
        },
        { 
            key: 'youtube', 
            icon: FaYoutube, 
            label: 'YouTube', 
            bgClass: 'bg-[#FF0000]',
            brandColor: '#FF0000'
        },
        { 
            key: 'telegram', 
            icon: FaTelegram, 
            label: 'Telegram', 
            bgClass: 'bg-[#0088cc]',
            brandColor: '#0088cc'
        },
        { 
            key: 'tiktok', 
            icon: FaTiktok, 
            label: 'TikTok', 
            bgClass: 'bg-[#000000]',
            brandColor: '#000000'
        }
    ];

    // Filter only social links that the theater has provided
    const activeSocialLinks = socialPlatforms.filter(platform => {
        const socialLinks = theater.social_links as SocialLinks;
        return socialLinks && socialLinks[platform.key as keyof SocialLinks];
    });

    // If no social links, don't show the section
    if (activeSocialLinks.length === 0) {
        return null;
    }

    return (
        <div className="mt-auto pt-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-1.5 rounded-lg bg-teal-100">
                    <Globe className="h-4 w-4 text-teal-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">
                    {t('contact.theaterSocial.title', { name: theater.legal_business_name })}
                </h3>
            </div>
            <div className="flex flex-wrap gap-3">
                {activeSocialLinks.map((social, index) => {
                    const Icon = social.icon;
                    const socialLinks = theater.social_links as SocialLinks;
                    const href = socialLinks[social.key as keyof SocialLinks];
                    if (!href) return null;
                    
                    return (
                        <a
                            key={index}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`w-10 h-10 flex items-center justify-center rounded-xl text-white transition-all duration-300 transform ${social.bgClass} hover:scale-110 hover:-translate-y-1 shadow-md hover:shadow-lg`}
                            aria-label={social.label}
                            title={social.label}
                        >
                            <Icon className="h-5 w-5" />
                        </a>
                    );
                })}
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center">
                {t('contact.theaterSocial.followText', { name: theater.legal_business_name })}
            </p>
        </div>
    );
};

// Dynamic Global Social Links Component - Fetches from database
const GlobalSocialLinks: React.FC = () => {
    const { t } = useTranslation();
    const [socialLinks, setSocialLinks] = useState<SocialLinks | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch admin social links from database
    useEffect(() => {
        const fetchAdminSocialLinks = async () => {
            try {
                const { data, error } = await supabase
                    .from('system_settings')
                    .select('setting_value')
                    .eq('setting_key', 'admin_social_links')
                    .single();

                if (error) throw error;
                
                if (data && data.setting_value) {
                    setSocialLinks(data.setting_value);
                }
            } catch (error) {
                console.error('Error fetching admin social links:', error);
                // Set default fallback links if database fetch fails
                setSocialLinks({
                    facebook: 'https://facebook.com',
                    twitter: 'https://twitter.com',
                    instagram: 'https://instagram.com',
                    linkedin: 'https://linkedin.com',
                    youtube: 'https://youtube.com',
                    telegram: 'https://t.me',
                    tiktok: 'https://tiktok.com'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAdminSocialLinks();
    }, []);

    // Define social platforms configuration
    const socialPlatforms = [
        { key: 'facebook', icon: FaFacebook, label: 'Facebook', bgClass: 'bg-[#1877F2]' },
        { key: 'twitter', icon: FaTwitter, label: 'Twitter', bgClass: 'bg-[#1DA1F2]' },
        { key: 'instagram', icon: FaInstagram, label: 'Instagram', bgClass: 'bg-[#E4405F]' },
        { key: 'linkedin', icon: FaLinkedin, label: 'LinkedIn', bgClass: 'bg-[#0A66C2]' },
        { key: 'youtube', icon: FaYoutube, label: 'YouTube', bgClass: 'bg-[#FF0000]' },
        { key: 'telegram', icon: FaTelegram, label: 'Telegram', bgClass: 'bg-[#0088cc]' },
        { key: 'tiktok', icon: FaTiktok, label: 'TikTok', bgClass: 'bg-[#000000]' }
    ];

    // Filter only social links that exist in database
    const activeSocialLinks = socialPlatforms.filter(platform => {
        return socialLinks && socialLinks[platform.key as keyof SocialLinks];
    });

    if (loading) {
        return (
            <div className="mt-auto pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-1.5 rounded-lg bg-teal-100">
                        <Globe className="h-4 w-4 text-teal-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">{t('contact.globalSocial.title')}</h3>
                </div>
                <div className="flex justify-center py-4">
                    <Loader className="h-5 w-5 text-teal-600 animate-spin" />
                </div>
            </div>
        );
    }

    // Don't show section if no social links are configured
    if (!socialLinks || activeSocialLinks.length === 0) {
        return null;
    }

    return (
        <div className="mt-auto pt-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-1.5 rounded-lg bg-teal-100">
                    <Globe className="h-4 w-4 text-teal-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">{t('contact.globalSocial.title')}</h3>
            </div>
            <div className="flex flex-wrap gap-3">
                {activeSocialLinks.map((social, index) => {
                    const Icon = social.icon;
                    const href = socialLinks[social.key as keyof SocialLinks];
                    if (!href) return null;
                    
                    return (
                        <a
                            key={index}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`w-10 h-10 flex items-center justify-center rounded-xl text-white transition-all duration-300 transform ${social.bgClass} hover:scale-110 hover:-translate-y-1 shadow-md hover:shadow-lg`}
                            aria-label={social.label}
                            title={social.label}
                        >
                            <Icon className="h-5 w-5" />
                        </a>
                    );
                })}
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center">
                {t('contact.globalSocial.followText')}
            </p>
        </div>
    );
};

const Contact: React.FC = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        category: 'general',
        recipientType: 'admin',
        theaterId: ''
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);
    const [theaters, setTheaters] = useState<Theater[]>([]);
    const [loadingTheaters, setLoadingTheaters] = useState<boolean>(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    // Fetch registered theaters from database with social links
    useEffect(() => {
        const fetchTheaters = async () => {
            console.log("Fetching theaters with social links...");
            setLoadingTheaters(true);
            setFetchError(null);
            
            try {
                // Fetch approved theaters with all fields including social_links
                const { data, error } = await supabase
                    .from('theaters')
                    .select('id, legal_business_name, city, email, phone, address, description, logo_url, status, is_approved, social_links')
                    .eq('status', 'approved')
                    .eq('is_approved', true)
                    .order('legal_business_name', { ascending: true });

                if (error) {
                    console.error('Supabase error:', error);
                    setFetchError(error.message);
                    throw error;
                }
                
                console.log("Fetched theaters with social links:", data);
                
                if (data && data.length > 0) {
                    const mappedTheaters: Theater[] = data.map(theater => ({
                        id: theater.id,
                        legal_business_name: theater.legal_business_name,
                        city: theater.city || 'Address not provided',
                        email: theater.email,
                        phone: theater.phone,
                        address: theater.address || 'Address not provided',
                        description: theater.description,
                        logo_url: theater.logo_url,
                        status: theater.status,
                        is_approved: theater.is_approved,
                        social_links: theater.social_links || {
                            facebook: null,
                            twitter: null,
                            instagram: null,
                            linkedin: null,
                            youtube: null,
                            telegram: null,
                            tiktok: null
                        }
                    }));
                    
                    setTheaters(mappedTheaters);
                    
                    // Log which theaters have social links
                    mappedTheaters.forEach(theater => {
                        const hasSocialLinks = Object.values(theater.social_links || {}).some(link => link);
                        if (hasSocialLinks) {
                            console.log(`📱 ${theater.legal_business_name} has social media links:`, theater.social_links);
                        }
                    });
                    
                } else {
                    console.log("No approved theaters found");
                    setTheaters([]);
                }
                
            } catch (error: any) {
                console.error('Error fetching theaters:', error);
                setFetchError(error.message);
            } finally {
                setLoadingTheaters(false);
            }
        };
        
        fetchTheaters();
    }, []);

    // Contact Information
    const contactInfo = [
        {
            icon: Phone,
            titleKey: 'contact.info.phone.title',
            detailsKeys: ['contact.info.phone.detail1', 'contact.info.phone.detail2'],
            descriptionKey: 'contact.info.phone.description',
            color: 'from-teal-500 to-teal-600',
            action: 'tel:+251911234567'
        },
        {
            icon: Mail,
            titleKey: 'contact.info.email.title',
            detailsKeys: ['contact.info.email.detail1', 'contact.info.email.detail2'],
            descriptionKey: 'contact.info.email.description',
            color: 'from-blue-500 to-blue-600',
            action: 'mailto:support@theaterhub.com'
        },
        {
            icon: MapPin,
            titleKey: 'contact.info.visit.title',
            detailsKeys: ['contact.info.visit.detail1', 'contact.info.visit.detail2'],
            descriptionKey: 'contact.info.visit.description',
            color: 'from-emerald-500 to-green-600',
            action: 'https://maps.google.com'
        },
        {
            icon: Clock,
            titleKey: 'contact.info.hours.title',
            detailsKeys: ['contact.info.hours.detail1', 'contact.info.hours.detail2', 'contact.info.hours.detail3'],
            descriptionKey: 'contact.info.hours.description',
            color: 'from-purple-500 to-pink-600',
            action: null
        }
    ];

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = t('contact.errors.nameRequired');
        } else if (formData.name.length < 2) {
            newErrors.name = t('contact.errors.nameMinLength');
        }

        if (!formData.email.trim()) {
            newErrors.email = t('contact.errors.emailRequired');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t('contact.errors.emailInvalid');
        }

        if (!formData.subject.trim()) {
            newErrors.subject = t('contact.errors.subjectRequired');
        }

        if (!formData.message.trim()) {
            newErrors.message = t('contact.errors.messageRequired');
        } else if (formData.message.length < 10) {
            newErrors.message = t('contact.errors.messageMinLength');
        }

        if (formData.recipientType === 'theater' && !formData.theaterId) {
            newErrors.theaterId = t('contact.errors.theaterRequired');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Submit to database
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setIsSubmitting(true);

        try {
            // Get IP address
            let ipAddress = '';
            try {
                const ipResponse = await fetch('https://api.ipify.org?format=json');
                const ipData = await ipResponse.json();
                ipAddress = ipData.ip;
            } catch (error) {
                console.error('Error fetching IP:', error);
            }

            // Get selected theater details
            const selectedTheater = theaters.find(t => t.id === formData.theaterId);
            const recipientName = formData.recipientType === 'admin' 
                ? 'Admin Support' 
                : selectedTheater?.legal_business_name || 'Theater';

            // Insert into contact_messages table
            const { data, error } = await supabase
                .from('contact_messages')
                .insert({
                    sender_name: formData.name,
                    sender_email: formData.email,
                    sender_phone: formData.phone || null,
                    subject: `[${recipientName}] ${formData.subject}`,
                    message: formData.message,
                    message_category: formData.category,
                    recipient_type: formData.recipientType,
                    theater_id: formData.recipientType === 'theater' ? formData.theaterId : null,
                    status: 'pending',
                    ip_address: ipAddress,
                    user_agent: navigator.userAgent,
                    referrer_url: window.location.href,
                })
                .select();

            if (error) {
                console.error('Insert error:', error);
                throw error;
            }

            console.log('Message sent successfully:', data);
            
            // Show success popup
            setShowSuccessPopup(true);
            
            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
                category: 'general',
                recipientType: 'admin',
                theaterId: ''
            });

            // Auto close popup after 5 seconds
            setTimeout(() => {
                setShowSuccessPopup(false);
            }, 5000);

        } catch (error: any) {
            console.error('Error submitting form:', error);
            alert(error.message || t('contact.errors.submitFailed') || 'Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleRecipientChange = (type: 'admin' | 'theater') => {
        setFormData(prev => ({ 
            ...prev, 
            recipientType: type,
            theaterId: type === 'admin' ? '' : prev.theaterId
        }));
    };

    const handlePopupClose = () => setShowSuccessPopup(false);
    const selectedTheater = theaters.find(t => t.id === formData.theaterId);

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
            <div className="bg-gradient-to-br from-deepTeal via-deepBlue to-deepTeal text-white relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                        <div className="text-center max-w-3xl mx-auto">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-xl rounded-full mb-6"
                            >
                                <MessageCircle className="h-5 w-5" />
                                <span className="text-sm font-medium">{t('contact.hero.badge')}</span>
                            </motion.div>
                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
                            >
                                {t('contact.hero.title')}
                            </motion.h1>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="text-xl text-white/90 mb-8"
                            >
                                {t('contact.hero.subtitle')}
                            </motion.p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Contact Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {contactInfo.map((info, index) => (
                            <motion.div
                                key={info.titleKey}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group"
                            >
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${info.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                                    <info.icon className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t(info.titleKey)}</h3>
                                {info.detailsKeys.map((key, i) => (
                                    <p key={i} className="text-gray-600 text-sm mb-1">{t(key)}</p>
                                ))}
                                <p className="text-xs text-gray-500 mt-2">{t(info.descriptionKey)}</p>
                                {info.action && (
                                    <a
                                        href={info.action}
                                        className="inline-flex items-center gap-1 text-teal-600 text-sm font-medium mt-3 hover:gap-2 transition-all"
                                    >
                                        {t('contact.contactLink')} <ArrowRight className="h-4 w-4" />
                                    </a>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Contact Form & Find Us */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200"
                        >
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('contact.form.title')}</h2>
                                <p className="text-gray-600">{t('contact.form.subtitle')}</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Recipient Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('contact.form.sendTo')} <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleRecipientChange('admin')}
                                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                                                formData.recipientType === 'admin'
                                                    ? 'border-teal-500 bg-teal-50 shadow-md'
                                                    : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className={`p-2 rounded-lg ${formData.recipientType === 'admin' ? 'bg-teal-600' : 'bg-gray-100'}`}>
                                                    <UserCog className={`h-5 w-5 ${formData.recipientType === 'admin' ? 'text-white' : 'text-gray-600'}`} />
                                                </div>
                                                <span className={`font-semibold ${formData.recipientType === 'admin' ? 'text-teal-700' : 'text-gray-700'}`}>
                                                    {t('contact.form.adminOption')}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500">{t('contact.form.adminDesc')}</p>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleRecipientChange('theater')}
                                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                                                formData.recipientType === 'theater'
                                                    ? 'border-teal-500 bg-teal-50 shadow-md'
                                                    : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className={`p-2 rounded-lg ${formData.recipientType === 'theater' ? 'bg-teal-600' : 'bg-gray-100'}`}>
                                                    <Theater className={`h-5 w-5 ${formData.recipientType === 'theater' ? 'text-white' : 'text-gray-600'}`} />
                                                </div>
                                                <span className={`font-semibold ${formData.recipientType === 'theater' ? 'text-teal-700' : 'text-gray-700'}`}>
                                                    {t('contact.form.theaterOption')}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500">{t('contact.form.theaterDesc')}</p>
                                        </button>
                                    </div>
                                </div>

                                {/* Theater Selection */}
                                {formData.recipientType === 'theater' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('contact.form.selectTheater')} <span className="text-red-500">*</span>
                                        </label>
                                        
                                        {loadingTheaters ? (
                                            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-xl">
                                                <Loader className="h-5 w-5 text-teal-600 animate-spin" />
                                                <span className="text-sm text-gray-600">{t('contact.form.loadingTheaters')}</span>
                                            </div>
                                        ) : fetchError ? (
                                            <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                                                <p className="text-sm text-red-600">Error loading theaters: {fetchError}</p>
                                                <button 
                                                    onClick={() => window.location.reload()}
                                                    className="mt-2 text-sm text-teal-600 hover:underline"
                                                >
                                                    Try again
                                                </button>
                                            </div>
                                        ) : theaters.length === 0 ? (
                                            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                                                <p className="text-sm text-yellow-700">
                                                    No registered theaters found. Please contact admin to register theaters.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                <Theater className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                                                <select
                                                    name="theaterId"
                                                    value={formData.theaterId}
                                                    onChange={handleChange}
                                                    className={`w-full pl-10 pr-4 py-3 border ${errors.theaterId ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none appearance-none bg-white`}
                                                >
                                                    <option value="">{t('contact.form.selectTheaterPlaceholder')}</option>
                                                    {theaters.map(theater => (
                                                        <option key={theater.id} value={theater.id}>
                                                            {theater.legal_business_name} - {theater.city}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                            </div>
                                        )}
                                        
                                        {errors.theaterId && <p className="text-red-500 text-xs mt-1">{errors.theaterId}</p>}
                                        
                                        {!loadingTheaters && theaters.length > 0 && (
                                            <p className="text-xs text-gray-500 mt-2">
                                                {theaters.length} theater{theaters.length !== 1 ? 's' : ''} available
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('contact.form.yourName')} <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all`}
                                            placeholder={t('contact.form.namePlaceholder')}
                                        />
                                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('contact.form.email')} <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all`}
                                            placeholder={t('contact.form.emailPlaceholder')}
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('contact.form.phoneOptional')}
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                                            placeholder={t('contact.form.phonePlaceholder')}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('contact.form.category')}
                                        </label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                                        >
                                            <option value="general">{t('contact.categories.general')}</option>
                                            <option value="booking">{t('contact.categories.booking')}</option>
                                            <option value="payment">{t('contact.categories.payment')}</option>
                                            <option value="technical">{t('contact.categories.technical')}</option>
                                            <option value="feedback">{t('contact.categories.feedback')}</option>
                                            <option value="partnership">{t('contact.categories.partnership')}</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('contact.form.subject')} <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border ${errors.subject ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all`}
                                        placeholder={t('contact.form.subjectPlaceholder')}
                                    />
                                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('contact.form.message')} <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="message"
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border ${errors.message ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none`}
                                        placeholder={t('contact.form.messagePlaceholder')}
                                    />
                                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-4 rounded-xl font-medium hover:from-teal-700 hover:to-teal-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                            <span>{t('contact.form.sending')}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-5 w-5" />
                                            <span>{t('contact.form.sendButton')}</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>

                        {/* Theater Info Section - Shows selected theater details with dynamic social links */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 flex flex-col"
                        >
                            {formData.recipientType === 'theater' && selectedTheater ? (
                                <>
                                    <div className="flex items-center gap-3 mb-6">
                                        {selectedTheater.logo_url ? (
                                            <img src={selectedTheater.logo_url} alt={selectedTheater.legal_business_name} className="w-12 h-12 rounded-lg object-cover" />
                                        ) : (
                                            <div className="p-2 rounded-lg bg-teal-100">
                                                <Theater className="h-6 w-6 text-teal-600" />
                                            </div>
                                        )}
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">{selectedTheater.legal_business_name}</h2>
                                            <p className="text-sm text-gray-500">{selectedTheater.city}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex items-start gap-3 p-3 bg-teal-50 rounded-xl border border-teal-200">
                                            <Phone className="h-5 w-5 text-teal-600 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-teal-600 font-medium">{t('contact.theaterDetail.phoneSupport')}</p>
                                                <p className="font-semibold text-gray-900">{selectedTheater.phone}</p>
                                                <a href={`tel:${selectedTheater.phone.replace(/\s/g, '')}`} className="text-teal-600 text-sm mt-2 inline-flex items-center gap-1 hover:gap-2 transition-all">
                                                    {t('contact.theaterDetail.callNow')} <ArrowRight className="h-3 w-3" />
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                                            <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-blue-600 font-medium">{t('contact.theaterDetail.emailUs')}</p>
                                                <p className="font-semibold text-gray-900">{selectedTheater.email}</p>
                                                <a href={`mailto:${selectedTheater.email}`} className="text-blue-600 text-sm mt-2 inline-flex items-center gap-1 hover:gap-2 transition-all">
                                                    {t('contact.theaterDetail.sendEmail')} <ArrowRight className="h-3 w-3" />
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                                            <MapPin className="h-5 w-5 text-emerald-600 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-emerald-600 font-medium">{t('contact.theaterDetail.visitUs')}</p>
                                                <p className="font-semibold text-gray-900">{selectedTheater.address}</p>
                                                <p className="text-xs text-gray-500 mt-1">{selectedTheater.city}</p>
                                            </div>
                                        </div>

                                        {selectedTheater.description && (
                                            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
                                                <Info className="h-5 w-5 text-purple-600 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-purple-600 font-medium">{t('contact.theaterDetail.about')}</p>
                                                    <p className="text-sm text-gray-700">{selectedTheater.description}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Dynamic Social Links - Only shows if theater has added them in dashboard */}
                                    <TheaterSocialLinks theater={selectedTheater} />
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 rounded-lg bg-teal-100">
                                            <MapPin className="h-6 w-6 text-teal-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">{t('contact.findUs.title')}</h2>
                                    </div>

                                    <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden mb-6">
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.0!2d38.7636!3d9.0320!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85b5b6b5b5b5%3A0x0!2zOcKwMDEnNTUuMiJOIDM4wrA0NSc0OS4wIkU!5e0!3m2!1sen!2set!4v1!5m2!1sen!2set"
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            title="TheaterHUB Location"
                                        ></iframe>
                                    </div>

                                    <div className="text-center mb-6">
                                        <p className="text-gray-800 font-medium">{t('contact.findUs.addressLine')}</p>
                                        <p className="text-sm text-gray-500 mt-1">{t('contact.findUs.landmark')}</p>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-3 p-2 text-sm text-gray-600">
                                            <Phone className="h-4 w-4 text-teal-500" />
                                            <span>{t('contact.findUs.phoneNumbers')}</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-2 text-sm text-gray-600">
                                            <Mail className="h-4 w-4 text-teal-500" />
                                            <span>{t('contact.findUs.emails')}</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-2 text-sm text-gray-600">
                                            <Clock className="h-4 w-4 text-teal-500" />
                                            <span>{t('contact.findUs.hours')}</span>
                                        </div>
                                    </div>

                                    {/* Dynamic Global Social Links - Fetched from database */}
                                    <GlobalSocialLinks />
                                </>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Success Popup */}
            <SuccessPopup
                isOpen={showSuccessPopup}
                onClose={handlePopupClose}
                type="contact"
                title={t('contact.success.title')}
                message={t('contact.success.message', { theaterName: selectedTheater ? selectedTheater.legal_business_name : '' })}
                details={{
                    [t('contact.success.details.name')]: formData.name || t('contact.success.details.notProvided'),
                    [t('contact.success.details.email')]: formData.email || t('contact.success.details.notProvided'),
                    [t('contact.success.details.recipient')]: formData.recipientType === 'admin' ? t('contact.success.details.adminRecipient') : (selectedTheater?.legal_business_name || t('contact.success.details.theaterOwner')),
                    [t('contact.success.details.category')]: t(`contact.categories.${formData.category}`) || formData.category,
                    [t('contact.success.details.responseTime')]: t('contact.success.details.responseTimeValue')
                }}
                actionButtons={[
                    {
                        label: t('contact.success.buttons.home'),
                        onClick: () => { window.location.href = '/'; },
                        variant: 'primary'
                    },
                    {
                        label: t('contact.success.buttons.close'),
                        onClick: handlePopupClose,
                        variant: 'secondary'
                    }
                ]}
            />
        </>
    );
};

export default Contact;