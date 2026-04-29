// Frontend/src/pages/Contact.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Mail, Phone, MapPin, Clock, Send, MessageCircle,
    Headphones, Award, Globe, Users,
    CheckCircle, AlertCircle, ArrowRight,
    Calendar, Building, Star, Heart, Gift, Ticket,
    HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
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

// Types
interface ContactFormData {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    category: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
    subject?: string;
    message?: string;
    category?: string;
}

const Contact: React.FC = () => {
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        category: 'general'
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);

    // Contact Information
    const contactInfo = [
        {
            icon: Phone,
            title: 'Phone Support',
            details: ['+251 911 234 567', '+251 912 345 678'],
            description: 'Mon-Fri, 9:00 AM - 6:00 PM',
            color: 'from-deepTeal to-teal-600',
            action: 'tel:+251911234567'
        },
        {
            icon: Mail,
            title: 'Email Us',
            details: ['support@theaterhub.com', 'info@theaterhub.com'],
            description: 'Response within 24 hours',
            color: 'from-deepBlue to-blue-600',
            action: 'mailto:support@theaterhub.com'
        },
        {
            icon: MapPin,
            title: 'Visit Us',
            details: ['Bole Road, Addis Ababa', 'Ethiopia'],
            description: 'Next to Millennium Hall',
            color: 'from-deepTeal to-emerald-600',
            action: 'https://maps.google.com'
        },
        {
            icon: Clock,
            title: 'Office Hours',
            details: ['Monday - Friday: 9AM - 8PM', 'Saturday: 10AM - 6PM', 'Sunday: Closed'],
            description: '24/7 Online Support',
            color: 'from-deepBlue to-cyan-600',
            action: null
        }
    ];

    // Social Media Links with brand colors - Using react-icons
    const socialLinks = [
        {
            icon: FaFacebook,
            href: 'https://facebook.com',
            brandColor: '#1877F2',
            label: 'Facebook',
            bgClass: 'bg-[#1877F2]',
            hoverScale: 'hover:scale-110'
        },
        {
            icon: FaTwitter,
            href: 'https://twitter.com',
            brandColor: '#1DA1F2',
            label: 'Twitter',
            bgClass: 'bg-[#1DA1F2]',
            hoverScale: 'hover:scale-110'
        },
        {
            icon: FaInstagram,
            href: 'https://instagram.com',
            brandColor: '#E4405F',
            label: 'Instagram',
            bgClass: 'bg-[#E4405F]',
            hoverScale: 'hover:scale-110'
        },
        {
            icon: FaLinkedin,
            href: 'https://linkedin.com',
            brandColor: '#0A66C2',
            label: 'LinkedIn',
            bgClass: 'bg-[#0A66C2]',
            hoverScale: 'hover:scale-110'
        },
        {
            icon: FaYoutube,
            href: 'https://youtube.com',
            brandColor: '#FF0000',
            label: 'YouTube',
            bgClass: 'bg-[#FF0000]',
            hoverScale: 'hover:scale-110'
        },
        {
            icon: FaTelegram,
            href: 'https://t.me/theaterhub',
            brandColor: '#0088cc',
            label: 'Telegram',
            bgClass: 'bg-[#0088cc]',
            hoverScale: 'hover:scale-110'
        },
        {
            icon: FaTiktok,
            href: 'https://tiktok.com/@theaterhub',
            brandColor: '#000000',
            label: 'TikTok',
            bgClass: 'bg-[#000000]',
            hoverScale: 'hover:scale-110'
        }
    ];

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.subject.trim()) {
            newErrors.subject = 'Subject is required';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        } else if (formData.message.length < 10) {
            newErrors.message = 'Message must be at least 10 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            console.log('Form submitted:', formData);

            // Show success popup instead of inline message
            setShowSuccessPopup(true);

            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
                category: 'general'
            });

            setIsSubmitting(false);
        }, 1500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handlePopupClose = () => {
        setShowSuccessPopup(false);
    };

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-deepTeal via-deepBlue to-deepTeal text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                        <div className="text-center max-w-3xl mx-auto">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-xl rounded-full mb-6"
                            >
                                <MessageCircle className="h-5 w-5" />
                                <span className="text-sm font-medium">Get in Touch</span>
                            </motion.div>

                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
                            >
                                Contact Us
                            </motion.h1>

                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="text-xl text-white/90 mb-8"
                            >
                                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
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
                                key={info.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group"
                            >
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${info.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                                    <info.icon className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                                {info.details.map((detail, i) => (
                                    <p key={i} className="text-gray-600 text-sm mb-1">{detail}</p>
                                ))}
                                <p className="text-xs text-gray-500 mt-2">{info.description}</p>
                                {info.action && (
                                    <a
                                        href={info.action}
                                        className="inline-flex items-center gap-1 text-deepTeal text-sm font-medium mt-3 hover:gap-2 transition-all"
                                    >
                                        Contact <ArrowRight className="h-4 w-4" />
                                    </a>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Contact Form & Find Us - Equal size grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200"
                        >
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                                <p className="text-gray-600">Fill out the form below and we'll get back to you soon</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Your Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-deepTeal focus:border-transparent outline-none transition-all`}
                                            placeholder="John Doe"
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-deepTeal focus:border-transparent outline-none transition-all`}
                                            placeholder="john@example.com"
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number (Optional)
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deepTeal focus:border-transparent outline-none transition-all"
                                            placeholder="+251 911 234 567"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category
                                        </label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deepTeal focus:border-transparent outline-none"
                                        >
                                            <option value="general">General Inquiry</option>
                                            <option value="booking">Booking Support</option>
                                            <option value="payment">Payment Issues</option>
                                            <option value="technical">Technical Support</option>
                                            <option value="feedback">Feedback</option>
                                            <option value="partnership">Partnership</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border ${errors.subject ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-deepTeal focus:border-transparent outline-none transition-all`}
                                        placeholder="How can we help you?"
                                    />
                                    {errors.subject && (
                                        <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Message <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="message"
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border ${errors.message ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-deepTeal focus:border-transparent outline-none resize-none`}
                                        placeholder="Tell us about your question or concern..."
                                    />
                                    {errors.message && (
                                        <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-deepTeal to-deepBlue text-white py-4 rounded-xl font-medium hover:from-teal-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-5 w-5" />
                                            <span>Send Message</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>

                        {/* Find Us Section - Equal size with the form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 flex flex-col"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-lg bg-deepTeal/10">
                                    <MapPin className="h-6 w-6 text-deepTeal" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Find Us</h2>
                            </div>

                            {/* Map Container */}
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
                                <p className="text-gray-800 font-medium">Bole Road, Addis Ababa, Ethiopia</p>
                                <p className="text-sm text-gray-500 mt-1">Next to Millennium Hall</p>
                            </div>

                            {/* Social Media Links with Brand Colors - Using react-icons */}
                            <div className="mt-auto pt-4 border-t border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-1.5 rounded-lg bg-deepTeal/10">
                                        <Globe className="h-4 w-4 text-deepTeal" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-gray-900">Connect With Us</h3>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {socialLinks.map((social, index) => {
                                        const Icon = social.icon;
                                        return (
                                            <a
                                                key={index}
                                                href={social.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`w-10 h-10 flex items-center justify-center rounded-xl text-white transition-all duration-300 transform ${social.bgClass} ${social.hoverScale} hover:-translate-y-1 shadow-md hover:shadow-lg`}
                                                aria-label={social.label}
                                            >
                                                <Icon className="h-5 w-5" />
                                            </a>
                                        );
                                    })}
                                </div>
                                <p className="text-xs text-gray-400 mt-4 text-center">
                                    Follow us for updates, offers, and events
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Success Popup */}
            <SuccessPopup
                isOpen={showSuccessPopup}
                onClose={handlePopupClose}
                type="contact"
                title="Message Sent Successfully! 🎉"
                message="Thank you for reaching out to us. Our team will get back to you within 24 hours."
                details={{
                    'Name': formData.name || 'Not provided',
                    'Email': formData.email || 'Not provided',
                    'Category': formData.category.charAt(0).toUpperCase() + formData.category.slice(1),
                    'Response Time': 'Within 24 hours'
                }}
                actionButtons={[
                    {
                        label: 'Go to Home',
                        onClick: () => {
                            window.location.href = '/';
                        },
                        variant: 'primary'
                    },
                    {
                        label: 'Close',
                        onClick: handlePopupClose,
                        variant: 'secondary'
                    }
                ]}
            />
        </>
    );
};

export default Contact;