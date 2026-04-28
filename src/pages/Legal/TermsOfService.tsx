// src/pages/TermsAndConditions.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    CheckCircle,
    Shield,
    Ticket,
    CreditCard,
    Users,
    Scale,
    Edit,
    Mail,
    Menu,
    X,
    ChevronRight,
    BookOpen,
    Star,
    Clock,
    Globe,
    HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Section {
    id: string;
    title: string;
    icon: React.ElementType;
    content: string[];
}

const TermsAndConditions: React.FC = () => {
    const [activeSection, setActiveSection] = useState('acceptance');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const sections: Section[] = [
        {
            id: 'acceptance',
            title: 'Acceptance of Terms',
            icon: CheckCircle,
            content: [
                'By accessing or using Theatre Hub Ethiopia\'s website, mobile application, or any of our services, you agree to be bound by these Terms and Conditions.',
                'If you do not agree to these terms, please do not use our services. We reserve the right to update or modify these terms at any time without prior notice.',
                'Your continued use of our services after any changes constitutes acceptance of the new terms. It is your responsibility to review these terms periodically.'
            ]
        },
        {
            id: 'services',
            title: 'Description of Services',
            icon: Ticket,
            content: [
                'Theatre Hub Ethiopia provides an online platform that connects theatergoers with live performances, shows, and events across Ethiopia.',
                'Our services include: ticket booking and purchase, event discovery, venue information, user reviews, personalized recommendations, and exclusive member benefits.',
                'We strive to provide accurate information about shows, venues, and pricing, but we cannot guarantee the availability or accuracy of all information.',
                'Theatre Hub Ethiopia is not responsible for cancellations, postponements, or changes made by event organizers or venues.'
            ]
        },
        {
            id: 'accounts',
            title: 'User Accounts',
            icon: Users,
            content: [
                'To access certain features of our platform, you must create a user account. You are responsible for maintaining the confidentiality of your account credentials.',
                'You agree to provide accurate, current, and complete information during registration and to update it as necessary.',
                'You are solely responsible for all activities that occur under your account. Notify us immediately of any unauthorized use.',
                'We reserve the right to suspend or terminate accounts that violate these terms or are inactive for extended periods.'
            ]
        },
        {
            id: 'bookings',
            title: 'Ticket Bookings and Payments',
            icon: CreditCard,
            content: [
                'All ticket prices are displayed in Ethiopian Birr (ETB) and include applicable taxes unless otherwise stated.',
                'Payment can be made through our secure payment partners: Chapa, TeleBirr, CBE Birr, and HelloCash.',
                'Tickets are confirmed only after successful payment processing. You will receive an e-ticket via email and in your account dashboard.',
                'It is your responsibility to verify booking details before completing payment.',
                'We use industry-standard encryption to protect your payment information.'
            ]
        },
        {
            id: 'membership',
            title: 'VIP Membership and Loyalty Program',
            icon: Star,
            content: [
                'Theatre Hub Ethiopia offers VIP membership tiers: Silver, Gold, and Platinum, each with exclusive benefits.',
                'Benefits include: priority booking, discounted tickets, exclusive presales, complimentary upgrades, and special event access.',
                'Members earn loyalty points on every ticket purchase, which can be redeemed for discounts on future bookings.',
                'VIP membership fees are non-refundable and billed on a monthly or annual basis as selected.',
                'We reserve the right to modify membership benefits with reasonable notice to members.'
            ]
        },
        {
            id: 'content',
            title: 'User Content',
            icon: FileText,
            content: [
                'Users may post reviews, ratings, comments, and other content on our platform. You retain ownership of your content.',
                'By posting content, you grant Theatre Hub Ethiopia a non-exclusive, royalty-free license to use, display, and distribute it.',
                'You agree not to post content that is defamatory, offensive, illegal, or infringes on others\' rights.',
                'We reserve the right to remove any content that violates these terms or is otherwise inappropriate.',
                'Fake reviews, paid reviews, or manipulated ratings are strictly prohibited.'
            ]
        },
        {
            id: 'prohibited',
            title: 'Prohibited Activities',
            icon: Shield,
            content: [
                'You may not use our services for any illegal purpose or in violation of any applicable laws.',
                'Prohibited activities include: ticket scalping, automated scraping, distributing malicious code, and attempting to bypass security measures.',
                'You may not impersonate others, provide false information, or engage in fraudulent activities.',
                'Reselling tickets for profit above face value without authorization is strictly forbidden.',
                'Violation of these prohibitions may result in immediate account termination and legal action.'
            ]
        },
        {
            id: 'liability',
            title: 'Limitation of Liability',
            icon: Scale,
            content: [
                'Theatre Hub Ethiopia provides its services "as is" without warranties of any kind, either express or implied.',
                'We are not liable for indirect, incidental, special, consequential, or punitive damages arising from your use of our services.',
                'Our total liability to you shall not exceed the amount you paid for tickets through our platform in the past 12 months.',
                'We are not responsible for events beyond our reasonable control, including natural disasters, strikes, or technical failures.',
                'Some jurisdictions do not allow certain liability limitations, so these may not apply to you.'
            ]
        },
        {
            id: 'changes',
            title: 'Changes to Terms',
            icon: Edit,
            content: [
                'We may revise these Terms and Conditions at any time by updating this page. Changes are effective immediately upon posting.',
                'For material changes, we will provide notice through our website, email, or app notification at least 30 days in advance.',
                'Your continued use of our services after changes constitute acceptance of the modified terms.',
                'It is your responsibility to review these terms periodically. The "Last Updated" date indicates when changes were made.',
                'If you do not agree with any changes, you should discontinue using our services.'
            ]
        },
        {
            id: 'contact',
            title: 'Contact Information',
            icon: Mail,
            content: [
                'If you have any questions about these Terms and Conditions, please contact us:',
                '📧 Email: legal@theatrehub.com',
                '📞 Phone: +251 911 234 567',
                '📍 Address: Bole Road, Addis Ababa, Ethiopia',
                '🕒 Business Hours: Monday to Friday, 9:00 AM - 6:00 PM (EAT)',
                'For urgent matters, please call our customer support hotline available 24/7.'
            ]
        }
    ];

    // Smooth scroll to section
    const scrollToSection = (sectionId: string) => {
        setActiveSection(sectionId);
        setIsMobileMenuOpen(false);
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Update active section based on scroll position
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 100;
            const currentSection = sections.find(section => {
                const element = document.getElementById(section.id);
                if (element) {
                    const offsetTop = element.offsetTop;
                    const offsetBottom = offsetTop + element.offsetHeight;
                    return scrollPosition >= offsetTop && scrollPosition < offsetBottom;
                }
                return false;
            });
            if (currentSection) {
                setActiveSection(currentSection.id);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [sections]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100, damping: 12 }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section - EXACTLY LIKE HELP PAGE */}
            <div className="bg-gradient-to-br from-deepTeal via-deepBlue to-deepTeal text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 relative">
                    <div className="text-center max-w-3xl mx-auto">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-xl rounded-full mb-6"
                        >
                            <Scale className="h-5 w-5" />
                            <span className="text-sm font-medium">Legal Agreement</span>
                        </motion.div>

                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
                        >
                            Terms and Conditions
                        </motion.h1>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-white/90 mb-8"
                        >
                            Please read these terms carefully before using our services
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center justify-center gap-4 text-white/70 text-sm"
                        >
                            <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                Last Updated: April 15, 2024
                            </span>
                            <span className="w-1 h-1 bg-white/30 rounded-full"></span>
                            <span className="flex items-center gap-1">
                                <Globe className="h-4 w-4" />
                                Effective Immediately
                            </span>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="sticky top-0 z-40 bg-white border-b border-gray-200 md:hidden">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="w-full px-4 py-3 flex items-center justify-between text-gray-700"
                >
                    <span className="font-medium">Quick Navigation</span>
                    {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Navigation - LEFT SIDE (Sticky, not fixed) */}
                    <div className="md:w-80 flex-shrink-0">
                        <div className="sticky top-24">
                            {/* Desktop Sidebar */}
                            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="h-5 w-5 text-deepTeal" />
                                        <h3 className="font-semibold text-gray-900">Quick Navigation</h3>
                                    </div>
                                </div>
                                <nav className="p-2 max-h-[calc(100vh-120px)] overflow-y-auto">
                                    {sections.map((section) => {
                                        const Icon = section.icon;
                                        const isActive = activeSection === section.id;
                                        return (
                                            <button
                                                key={section.id}
                                                onClick={() => scrollToSection(section.id)}
                                                className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-3 mb-1 ${isActive
                                                        ? 'bg-deepTeal/10 text-deepTeal border-l-4 border-deepTeal'
                                                        : 'text-gray-600 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <Icon className="h-4 w-4 flex-shrink-0" />
                                                <span className="text-sm font-medium">{section.title}</span>
                                                {isActive && <ChevronRight className="h-4 w-4 ml-auto flex-shrink-0" />}
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>

                            {/* Mobile Sidebar Drawer */}
                            <AnimatePresence>
                                {isMobileMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="md:hidden bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-4"
                                    >
                                        <nav className="p-2 max-h-[60vh] overflow-y-auto">
                                            {sections.map((section) => {
                                                const Icon = section.icon;
                                                const isActive = activeSection === section.id;
                                                return (
                                                    <button
                                                        key={section.id}
                                                        onClick={() => scrollToSection(section.id)}
                                                        className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-3 ${isActive
                                                                ? 'bg-deepTeal/10 text-deepTeal'
                                                                : 'text-gray-600 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        <Icon className="h-4 w-4 flex-shrink-0" />
                                                        <span className="text-sm font-medium">{section.title}</span>
                                                    </button>
                                                );
                                            })}
                                        </nav>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Info Card */}
                            <div className="hidden md:block mt-6 bg-gradient-to-br from-deepTeal/5 to-teal-500/5 rounded-xl p-4 border border-deepTeal/20">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-deepTeal/10 rounded-lg">
                                        <Shield className="h-5 w-5 text-deepTeal" />
                                    </div>
                                    <h4 className="font-semibold text-gray-900">Need Help?</h4>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">
                                    If you have questions about these terms, please contact our legal team.
                                </p>
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center gap-2 text-sm text-deepTeal hover:text-deepTeal/80 font-medium transition-colors"
                                >
                                    Contact Support
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area - RIGHT SIDE */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex-1"
                    >
                        {sections.map((section) => {
                            const Icon = section.icon;
                            return (
                                <motion.div
                                    key={section.id}
                                    id={section.id}
                                    variants={itemVariants}
                                    className="mb-8 scroll-mt-24"
                                >
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-deepTeal/10 rounded-lg">
                                                    <Icon className="h-5 w-5 text-deepTeal" />
                                                </div>
                                                <h2 className="text-xl font-bold text-gray-900">
                                                    {section.title}
                                                </h2>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="space-y-4">
                                                {section.content.map((paragraph, idx) => (
                                                    <p key={idx} className="text-gray-600 leading-relaxed">
                                                        {paragraph}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}

                        {/* Footer Note */}
                        <motion.div
                            variants={itemVariants}
                            className="mt-8 p-6 bg-gray-100 rounded-2xl text-center border border-gray-200"
                        >
                            <div className="flex items-center justify-center gap-2 mb-3">
                                <Globe className="h-5 w-5 text-deepTeal" />
                                <span className="text-sm font-medium text-gray-700">Governing Law</span>
                            </div>
                            <p className="text-sm text-gray-500">
                                These terms are governed by the laws of Ethiopia. Any disputes shall be resolved in the courts of Addis Ababa.
                            </p>
                            <p className="text-xs text-gray-400 mt-3">
                                © {new Date().getFullYear()} Theatre Hub Ethiopia. All rights reserved.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;