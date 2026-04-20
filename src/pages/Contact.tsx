// Frontend/src/pages/Contact.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Mail, Phone, MapPin, Clock, Send, MessageCircle,
    Facebook, Twitter, Instagram, Linkedin, Youtube,
    Headphones, Award, Globe, Users,
    CheckCircle, AlertCircle, ArrowRight,
    Calendar, Building, Star, Heart, Gift, Ticket,
    HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

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
    const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

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

    // Social Media Links
    const socialLinks = [
        { icon: Facebook, href: 'https://facebook.com', color: 'hover:bg-[#1877F2]', label: 'Facebook' },
        { icon: Twitter, href: 'https://twitter.com', color: 'hover:bg-[#1DA1F2]', label: 'Twitter' },
        { icon: Instagram, href: 'https://instagram.com', color: 'hover:bg-[#E4405F]', label: 'Instagram' },
        { icon: Linkedin, href: 'https://linkedin.com', color: 'hover:bg-[#0A66C2]', label: 'LinkedIn' },
        { icon: Youtube, href: 'https://youtube.com', color: 'hover:bg-[#FF0000]', label: 'YouTube' }
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

        setTimeout(() => {
            console.log('Form submitted:', formData);
            setSubmitStatus('success');
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
                category: 'general'
            });
            setIsSubmitting(false);

            setTimeout(() => setSubmitStatus(null), 5000);
        }, 1500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    return (
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

                {/* Contact Form & Social Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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

                        {submitStatus === 'success' && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
                            >
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <div>
                                    <p className="text-green-800 font-medium">Message sent successfully!</p>
                                    <p className="text-green-700 text-sm">We'll respond within 24 hours.</p>
                                </div>
                            </motion.div>
                        )}

                        {submitStatus === 'error' && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
                            >
                                <AlertCircle className="h-5 w-5 text-red-600" />
                                <p className="text-red-800">Something went wrong. Please try again.</p>
                            </motion.div>
                        )}

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

                    {/* Social & Business Hours */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        {/* Business Hours */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-lg bg-deepTeal/10">
                                    <Calendar className="h-6 w-6 text-deepTeal" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Business Hours</h2>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Monday - Friday</span>
                                    <span className="font-semibold text-gray-900">9:00 AM - 8:00 PM</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Saturday</span>
                                    <span className="font-semibold text-gray-900">10:00 AM - 6:00 PM</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Sunday</span>
                                    <span className="font-semibold text-gray-400">Closed</span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">24/7 Online Support</span>
                                        <span className="text-green-600 font-medium">Available</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Media Links */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-lg bg-deepTeal/10">
                                    <Globe className="h-6 w-6 text-deepTeal" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Connect With Us</h2>
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
                                            className={`p-3 bg-gray-100 rounded-xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 ${social.color}`}
                                            aria-label={social.label}
                                        >
                                            <Icon className="h-6 w-6 text-gray-600 hover:text-white transition-colors" />
                                        </a>
                                    );
                                })}
                            </div>
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">Follow us for updates, offers, and events</p>
                                        <p className="text-xs text-gray-400 mt-1">Join our community of theater lovers</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Map Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-12"
                >
                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-deepTeal/10">
                                <MapPin className="h-6 w-6 text-deepTeal" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Find Us</h2>
                        </div>
                        <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden">
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
                        <div className="mt-4 text-center">
                            <p className="text-gray-600">Bole Road, Addis Ababa, Ethiopia</p>
                            <p className="text-sm text-gray-500 mt-1">Next to Millennium Hall</p>
                        </div>
                    </div>
                </motion.div>

                {/* Trust Badges */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                    <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
                        <Headphones className="h-8 w-8 text-deepTeal mx-auto mb-2" />
                        <p className="text-sm font-semibold text-gray-900">24/7 Support</p>
                        <p className="text-xs text-gray-500">Always here to help</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
                        <Clock className="h-8 w-8 text-deepTeal mx-auto mb-2" />
                        <p className="text-sm font-semibold text-gray-900">Quick Response</p>
                        <p className="text-xs text-gray-500">Within 24 hours</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
                        <Users className="h-8 w-8 text-deepTeal mx-auto mb-2" />
                        <p className="text-sm font-semibold text-gray-900">Expert Team</p>
                        <p className="text-xs text-gray-500">Knowledgeable staff</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
                        <Award className="h-8 w-8 text-deepTeal mx-auto mb-2" />
                        <p className="text-sm font-semibold text-gray-900">Trusted Service</p>
                        <p className="text-xs text-gray-500">Satisfaction guaranteed</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;