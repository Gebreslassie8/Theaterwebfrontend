// src/pages/Legal/TermsOfService.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Shield, FileText, Scale, Clock, CreditCard, UserCheck,
    AlertCircle, CheckCircle, XCircle, Lock, Globe, Mail,
    Phone, MapPin, Building2, Award, Heart, Star, Ticket,
    Calendar, Users, DollarSign, TrendingUp, Zap, Coffee
} from 'lucide-react';

const TermsOfService: React.FC = () => {
    const lastUpdated = "March 30, 2024";

    const sections = [
        {
            id: 'acceptance',
            title: '1. Acceptance of Terms',
            icon: CheckCircle,
            content: (
                <div className="space-y-3">
                    <p>By accessing or using TheaterHUB's website, mobile application, or services (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Services.</p>
                    <p>These Terms apply to all users of the Services, including theater owners, ticket buyers, and any other contributors of content. By using our Services, you represent that you are at least 18 years of age or have parental/guardian consent.</p>
                </div>
            )
        },
        {
            id: 'services',
            title: '2. Description of Services',
            icon: Ticket,
            content: (
                <div className="space-y-3">
                    <p>TheaterHUB provides a platform that connects theater owners with theater enthusiasts, allowing users to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Discover and browse theater shows and events</li>
                        <li>Purchase tickets for live performances</li>
                        <li>Manage bookings and view ticket history</li>
                        <li>For theater owners: List shows, manage inventory, and track sales</li>
                        <li>Earn loyalty points and redeem rewards</li>
                        <li>Receive personalized recommendations based on preferences</li>
                    </ul>
                </div>
            )
        },
        {
            id: 'accounts',
            title: '3. User Accounts',
            icon: UserCheck,
            content: (
                <div className="space-y-3">
                    <p>To access certain features of our Services, you may be required to create an account. You agree to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Provide accurate, current, and complete information during registration</li>
                        <li>Maintain and promptly update your account information</li>
                        <li>Maintain the security of your password and accept all risks of unauthorized access</li>
                        <li>Notify us immediately of any unauthorized use of your account</li>
                        <li>Be responsible for all activities that occur under your account</li>
                    </ul>
                    <p className="mt-3">TheaterHUB reserves the right to suspend or terminate accounts that violate these Terms or are inactive for an extended period.</p>
                </div>
            )
        },
        {
            id: 'bookings',
            title: '4. Ticket Bookings and Payments',
            icon: CreditCard,
            content: (
                <div className="space-y-3">
                    <p>When you make a booking through TheaterHUB, you agree to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Pay all fees associated with your booking, including ticket prices and any applicable taxes</li>
                        <li>Provide accurate payment information</li>
                        <li>Authorize TheaterHUB to charge your selected payment method</li>
                        <li>Review and confirm all booking details before finalizing your purchase</li>
                    </ul>
                    <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                        <h4 className="font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Important Payment Information
                        </h4>
                        <p className="text-sm text-amber-700 dark:text-amber-400 mt-2">
                            All payments are processed securely through our payment partners. By completing a booking, you agree to our payment terms and conditions.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 'refunds',
            title: '5. Refund and Cancellation Policy',
            icon: Clock,
            content: (
                <div className="space-y-3">
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 mb-4">
                        <h4 className="font-semibold text-red-800 dark:text-red-300 flex items-center gap-2">
                            <XCircle className="h-4 w-4" />
                            No Refund Policy
                        </h4>
                        <p className="text-sm text-red-700 dark:text-red-400 mt-2">
                            All ticket sales are final. TheaterHUB does not offer refunds for ticket purchases under any circumstances. This includes but is not limited to:
                        </p>
                        <ul className="list-disc pl-6 mt-2 text-sm text-red-700 dark:text-red-400 space-y-1">
                            <li>Change of plans or personal circumstances</li>
                            <li>Medical emergencies or travel issues</li>
                            <li>Technical difficulties during booking process</li>
                            <li>Dissatisfaction with the show or venue</li>
                            <li>Incorrect ticket selection (please verify before purchase)</li>
                        </ul>
                    </div>
                    <p>In the event of show cancellation or rescheduling by the theater owner:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>We will notify you via email and SMS</li>
                        <li>You may be offered a credit for future shows or a rescheduled date</li>
                        <li>Refunds are only issued at the theater owner's discretion</li>
                        <li>TheaterHUB will facilitate communication but is not responsible for the theater's refund decision</li>
                    </ul>
                </div>
            )
        },
        {
            id: 'vip',
            title: '6. VIP Membership and Loyalty Program',
            icon: Award,
            content: (
                <div className="space-y-3">
                    <p>TheaterHUB offers VIP membership tiers with various benefits. By participating in our loyalty program, you agree to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Points are earned based on actual ticket purchases and may take up to 24 hours to reflect</li>
                        <li>VIP benefits are subject to availability and may change without notice</li>
                        <li>Membership tier is calculated based on a rolling 12-month period</li>
                        <li>Points expire 12 months from the date earned</li>
                        <li>TheaterHUB reserves the right to modify or terminate the loyalty program at any time</li>
                    </ul>
                </div>
            )
        },
        {
            id: 'content',
            title: '7. User Content',
            icon: FileText,
            content: (
                <div className="space-y-3">
                    <p>Users may submit reviews, ratings, comments, and other content ("User Content"). By submitting User Content, you grant TheaterHUB a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display such content.</p>
                    <p>You agree that you will not:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Post false, misleading, or defamatory content</li>
                        <li>Infringe on any third-party rights</li>
                        <li>Post content that is offensive, harassing, or discriminatory</li>
                        <li>Use automated systems to post content</li>
                    </ul>
                    <p>TheaterHUB reserves the right to remove any User Content that violates these Terms.</p>
                </div>
            )
        },
        {
            id: 'prohibited',
            title: '8. Prohibited Activities',
            icon: Shield,
            content: (
                <div className="space-y-3">
                    <p>You agree not to engage in any of the following prohibited activities:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Reselling tickets for commercial purposes without authorization</li>
                        <li>Using bots or automated systems to purchase tickets</li>
                        <li>Attempting to circumvent our security or access controls</li>
                        <li>Interfering with or disrupting our Services</li>
                        <li>Using our Services for any illegal purpose</li>
                        <li>Impersonating any person or entity</li>
                    </ul>
                </div>
            )
        },
        {
            id: 'limitations',
            title: '9. Limitation of Liability',
            icon: Scale,
            content: (
                <div className="space-y-3">
                    <p>To the maximum extent permitted by law, TheaterHUB shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Loss of profits, data, or business opportunities</li>
                        <li>Personal injury or property damage resulting from theater attendance</li>
                        <li>Interruption or cessation of Services</li>
                        <li>Unauthorized access to or alteration of your data</li>
                    </ul>
                    <p>Our total liability to you shall not exceed the amount paid by you for tickets in the 12 months preceding the claim.</p>
                </div>
            )
        },
        {
            id: 'changes',
            title: '10. Changes to Terms',
            icon: Calendar,
            content: (
                <div className="space-y-3">
                    <p>TheaterHUB reserves the right to modify these Terms at any time. We will notify users of material changes via:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Email notification to registered users</li>
                        <li>Prominent notice on our website</li>
                        <li>In-app notifications</li>
                    </ul>
                    <p>Your continued use of our Services after such changes constitutes acceptance of the updated Terms.</p>
                </div>
            )
        },
        {
            id: 'contact',
            title: '11. Contact Information',
            icon: Mail,
            content: (
                <div className="space-y-3">
                    <p>If you have any questions about these Terms, please contact us at:</p>
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-teal-600" />
                            <span>legal@theaterhub.com</span>
                        </p>
                        <p className="flex items-center gap-2 mt-2">
                            <Phone className="h-4 w-4 text-teal-600" />
                            <span>+251 11 123 4567</span>
                        </p>
                        <p className="flex items-center gap-2 mt-2">
                            <MapPin className="h-4 w-4 text-teal-600" />
                            <span>Addis Ababa, Ethiopia</span>
                        </p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-24 pb-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl mb-6 shadow-lg">
                        <FileText className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Terms of Service
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Last Updated: {lastUpdated}
                    </p>
                </motion.div>

                {/* Quick Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 sticky top-24 z-10"
                >
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Navigation</p>
                    <div className="flex flex-wrap gap-2">
                        {sections.map((section) => (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-teal-100 dark:hover:bg-teal-900/30 hover:text-teal-600 transition-colors"
                            >
                                {section.title.split('.')[1] || section.title}
                            </a>
                        ))}
                    </div>
                </motion.div>

                {/* Content */}
                <div className="space-y-6">
                    {sections.map((section, index) => {
                        const Icon = section.icon;
                        return (
                            <motion.div
                                key={section.id}
                                id={section.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                            >
                                <div className="border-b border-gray-200 dark:border-gray-700 p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-800">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                                            <Icon className="h-5 w-5 text-teal-600" />
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            {section.title}
                                        </h2>
                                    </div>
                                </div>
                                <div className="p-6 text-gray-600 dark:text-gray-400">
                                    {section.content}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Footer Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 p-6 bg-gradient-to-r from-teal-50 to-teal-100/50 dark:from-teal-900/20 dark:to-teal-800/10 rounded-xl border border-teal-200 dark:border-teal-800 text-center"
                >
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        By using TheaterHUB, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                        If you do not agree to these terms, please do not use our services.
                    </p>
                    <div className="flex justify-center gap-4 mt-4">
                        <Link to="/privacy" className="text-sm text-teal-600 hover:underline">
                            Privacy Policy
                        </Link>
                        <Link to="/cookies" className="text-sm text-teal-600 hover:underline">
                            Cookie Policy
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TermsOfService;