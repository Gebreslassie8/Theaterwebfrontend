// src/pages/Legal/PrivacyPolicy.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Shield, Lock, Eye, Database, Mail, Cookie, UserCheck,
    AlertCircle, CheckCircle, Globe, Server, Phone, MapPin,
    Building2, CreditCard, Clock, FileText, Users, Share2,
    Settings, Trash2, Bell, MessageCircle, Camera, Menu, X,
    ChevronRight, BookOpen, Scale
} from 'lucide-react';

interface Section {
    id: string;
    title: string;
    icon: React.ElementType;
    content: React.ReactNode;
}

const PrivacyPolicy: React.FC = () => {
    const [activeSection, setActiveSection] = useState('information');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const lastUpdated = "April 15, 2024";

    const sections: Section[] = [
        {
            id: 'information',
            title: 'Information We Collect',
            icon: Database,
            content: (
                <div className="space-y-4">
                    <p>We collect information to provide better services to our users. This includes:</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <UserCheck className="h-4 w-4 text-deepTeal" />
                                Account Information
                            </h4>
                            <ul className="text-sm space-y-1 text-gray-600">
                                <li>• Name, email address, phone number</li>
                                <li>• Profile information and preferences</li>
                                <li>• Account credentials (encrypted)</li>
                                <li>• Loyalty program data</li>
                            </ul>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-deepTeal" />
                                Transaction Information
                            </h4>
                            <ul className="text-sm space-y-1 text-gray-600">
                                <li>• Ticket purchase history</li>
                                <li>• Payment method details (encrypted)</li>
                                <li>• Booking confirmations</li>
                                <li>• Refund transactions (if applicable)</li>
                            </ul>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <Eye className="h-4 w-4 text-deepTeal" />
                                Usage Information
                            </h4>
                            <ul className="text-sm space-y-1 text-gray-600">
                                <li>• IP address and device information</li>
                                <li>• Browser type and version</li>
                                <li>• Pages visited and time spent</li>
                                <li>• Search queries and preferences</li>
                            </ul>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-deepTeal" />
                                Location Data
                            </h4>
                            <ul className="text-sm space-y-1 text-gray-600">
                                <li>• City and region</li>
                                <li>• Theater preferences</li>
                                <li>• Proximity to venues</li>
                                <li>• Language preferences</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'use',
            title: 'How We Use Your Information',
            icon: Settings,
            content: (
                <div className="space-y-3">
                    <p>We use the information we collect for the following purposes:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Process and confirm ticket bookings</li>
                        <li>Personalize your experience with recommendations</li>
                        <li>Communicate important updates about shows and bookings</li>
                        <li>Improve our Services and develop new features</li>
                        <li>Prevent fraud and ensure security</li>
                        <li>Provide customer support and respond to inquiries</li>
                        <li>Administer loyalty programs and rewards</li>
                    </ul>
                </div>
            )
        },
        {
            id: 'sharing',
            title: 'Information Sharing',
            icon: Share2,
            content: (
                <div className="space-y-3">
                    <p>We do not sell your personal information. We may share information in the following circumstances:</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-2">With Theater Owners</h4>
                            <p className="text-sm text-gray-600">Name, contact information, and booking details to fulfill ticket purchases</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-2">Payment Processors</h4>
                            <p className="text-sm text-gray-600">Payment information to process transactions securely</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-2">Service Providers</h4>
                            <p className="text-sm text-gray-600">Companies that help us operate our platform (hosting, analytics, etc.)</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-2">Legal Requirements</h4>
                            <p className="text-sm text-gray-600">When required by law or to protect our rights</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'security',
            title: 'Data Security',
            icon: Shield,
            content: (
                <div className="space-y-3">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200 mb-4">
                        <h4 className="font-semibold text-green-800 flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Our Security Measures
                        </h4>
                        <ul className="list-disc pl-6 mt-2 text-sm text-green-700 space-y-1">
                            <li>256-bit SSL encryption for all data transmission</li>
                            <li>Regular security audits and penetration testing</li>
                            <li>Secure data centers with 24/7 monitoring</li>
                            <li>Multi-factor authentication for account access</li>
                            <li>Regular backups and disaster recovery procedures</li>
                        </ul>
                    </div>
                    <p>While we implement robust security measures, no method of transmission over the Internet is 100% secure. We encourage you to use strong passwords and keep your account credentials confidential.</p>
                </div>
            )
        },
        {
            id: 'cookies',
            title: 'Cookies and Tracking',
            icon: Cookie,
            content: (
                <div className="space-y-3">
                    <p>We use cookies and similar technologies to enhance your experience. Types of cookies we use:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
                        <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our site</li>
                        <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                        <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                    </ul>
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                            You can manage your cookie preferences in your browser settings. However, disabling certain cookies may affect site functionality.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 'rights',
            title: 'Your Rights',
            icon: UserCheck,
            content: (
                <div className="space-y-3">
                    <p>Depending on your location, you may have the following rights:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Access:</strong> Request a copy of your personal data</li>
                        <li><strong>Correction:</strong> Update inaccurate or incomplete information</li>
                        <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                        <li><strong>Portability:</strong> Receive your data in a structured format</li>
                        <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                    </ul>
                    <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <p className="text-sm text-amber-800">
                            <strong>Note:</strong> We retain certain information as required by law or for legitimate business purposes, such as fraud prevention and record-keeping.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 'children',
            title: 'Children\'s Privacy',
            icon: Users,
            content: (
                <div className="space-y-3">
                    <p>Our Services are not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us immediately.</p>
                    <p>Users under 18 must have parental/guardian consent to use our Services and make purchases.</p>
                </div>
            )
        },
        {
            id: 'international',
            title: 'International Data Transfers',
            icon: Globe,
            content: (
                <div className="space-y-3">
                    <p>We operate primarily in Ethiopia but may transfer data to other countries for processing and storage. We ensure appropriate safeguards are in place for international data transfers in compliance with applicable laws.</p>
                    <p>By using our Services, you consent to the transfer of your information to countries that may have different data protection laws than your country of residence.</p>
                </div>
            )
        },
        {
            id: 'changes',
            title: 'Changes to This Policy',
            icon: Clock,
            content: (
                <div className="space-y-3">
                    <p>We may update this Privacy Policy periodically. We will notify you of material changes through:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Email notification to registered users</li>
                        <li>Prominent notice on our website</li>
                        <li>In-app notifications</li>
                    </ul>
                    <p>The "Last Updated" date indicates when it was last revised. Your continued use of our Services after changes constitutes acceptance of the updated policy.</p>
                </div>
            )
        },
        {
            id: 'contact',
            title: 'Contact Us',
            icon: Mail,
            content: (
                <div className="space-y-3">
                    <p>If you have questions about this Privacy Policy or our data practices, please contact us:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="font-semibold text-gray-900">Email</p>
                            <p className="text-sm text-gray-600">privacy@theaterhub.com</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="font-semibold text-gray-900">Phone</p>
                            <p className="text-sm text-gray-600">+251 11 123 4567</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="font-semibold text-gray-900">Address</p>
                            <p className="text-sm text-gray-600">Addis Ababa, Ethiopia</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="font-semibold text-gray-900">Data Protection Officer</p>
                            <p className="text-sm text-gray-600">dpo@theaterhub.com</p>
                        </div>
                    </div>
                </div>
            )
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
    }, []);

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
            {/* Hero Section - Same as Terms page */}
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
                            <Shield className="h-5 w-5" />
                            <span className="text-sm font-medium">Privacy & Security</span>
                        </motion.div>

                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
                        >
                            Privacy Policy
                        </motion.h1>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-white/90 mb-8"
                        >
                            Your privacy matters. Learn how we protect your information.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center justify-center gap-4 text-white/70 text-sm"
                        >
                            <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                Last Updated: {lastUpdated}
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
                    {/* Sidebar Navigation - LEFT SIDE (Sticky) */}
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
                                    <h4 className="font-semibold text-gray-900">Have Questions?</h4>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">
                                    If you have questions about our privacy practices, please contact our Data Protection Officer.
                                </p>
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center gap-2 text-sm text-deepTeal hover:text-deepTeal/80 font-medium transition-colors"
                                >
                                    Contact Us
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
                        {sections.map((section, index) => {
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
                                            {section.content}
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
                                <Shield className="h-5 w-5 text-deepTeal" />
                                <span className="text-sm font-medium text-gray-700">Your Privacy Matters</span>
                            </div>
                            <p className="text-sm text-gray-500">
                                By using Theatre Hub Ethiopia, you consent to the collection and use of your information as described in this Privacy Policy.
                            </p>
                            <div className="flex justify-center gap-4 mt-4">
                                <Link to="/terms" className="text-sm text-deepTeal hover:text-deepTeal/80 font-medium transition-colors">
                                    Terms of Service
                                </Link>
                                <Link to="/cookies" className="text-sm text-deepTeal hover:text-deepTeal/80 font-medium transition-colors">
                                    Cookie Policy
                                </Link>
                            </div>
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

export default PrivacyPolicy;