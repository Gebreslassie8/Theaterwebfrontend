// src/pages/Legal/PrivacyPolicy.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Shield, Lock, Eye, Database, Mail, Cookie, UserCheck,
    AlertCircle, CheckCircle, Globe, Server, Phone, MapPin,
    Building2, CreditCard, Clock, FileText, Users, Share2,
    Settings, Trash2, Bell, MessageCircle, Camera
} from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
    const lastUpdated = "March 30, 2024";

    const sections = [
        {
            id: 'information',
            title: '1. Information We Collect',
            icon: Database,
            content: (
                <div className="space-y-4">
                    <p>We collect information to provide better services to our users. This includes:</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <UserCheck className="h-4 w-4 text-teal-600" />
                                Account Information
                            </h4>
                            <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                                <li>• Name, email address, phone number</li>
                                <li>• Profile information and preferences</li>
                                <li>• Account credentials (encrypted)</li>
                                <li>• Loyalty program data</li>
                            </ul>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-teal-600" />
                                Transaction Information
                            </h4>
                            <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                                <li>• Ticket purchase history</li>
                                <li>• Payment method details (encrypted)</li>
                                <li>• Booking confirmations</li>
                                <li>• Refund transactions (if applicable)</li>
                            </ul>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <Eye className="h-4 w-4 text-teal-600" />
                                Usage Information
                            </h4>
                            <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                                <li>• IP address and device information</li>
                                <li>• Browser type and version</li>
                                <li>• Pages visited and time spent</li>
                                <li>• Search queries and preferences</li>
                            </ul>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-teal-600" />
                                Location Data
                            </h4>
                            <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
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
            title: '2. How We Use Your Information',
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
            title: '3. Information Sharing',
            icon: Share2,
            content: (
                <div className="space-y-3">
                    <p>We do not sell your personal information. We may share information in the following circumstances:</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">With Theater Owners</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Name, contact information, and booking details to fulfill ticket purchases</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Payment Processors</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Payment information to process transactions securely</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Service Providers</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Companies that help us operate our platform (hosting, analytics, etc.)</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Legal Requirements</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">When required by law or to protect our rights</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'security',
            title: '4. Data Security',
            icon: Shield,
            content: (
                <div className="space-y-3">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 mb-4">
                        <h4 className="font-semibold text-green-800 dark:text-green-300 flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Our Security Measures
                        </h4>
                        <ul className="list-disc pl-6 mt-2 text-sm text-green-700 dark:text-green-400 space-y-1">
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
            title: '5. Cookies and Tracking',
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
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            You can manage your cookie preferences in your browser settings. However, disabling certain cookies may affect site functionality.
                        </p>
                        <Link to="/cookies" className="text-sm text-teal-600 hover:underline mt-2 inline-block">
                            Learn more about our Cookie Policy →
                        </Link>
                    </div>
                </div>
            )
        },
        {
            id: 'rights',
            title: '6. Your Rights',
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
                    <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                        <p className="text-sm text-amber-800 dark:text-amber-300">
                            <strong>Note:</strong> We retain certain information as required by law or for legitimate business purposes, such as fraud prevention and record-keeping.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 'children',
            title: '7. Children\'s Privacy',
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
            title: '8. International Data Transfers',
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
            title: '9. Changes to This Policy',
            icon: Clock,
            content: (
                <div className="space-y-3">
                    <p>We may update this Privacy Policy periodically. We will notify you of material changes through:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Email notification to registered users</li>
                        <li>Prominent notice on our website</li>
                        <li>In-app notifications</li>
                    </ul>
                    <p>The "Last Updated" date at the top of this policy indicates when it was last revised. Your continued use of our Services after changes constitutes acceptance of the updated policy.</p>
                </div>
            )
        },
        {
            id: 'contact',
            title: '10. Contact Us',
            icon: Mail,
            content: (
                <div className="space-y-3">
                    <p>If you have questions about this Privacy Policy or our data practices, please contact us:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <p className="font-semibold text-gray-900 dark:text-white">Email</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">privacy@theaterhub.com</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <p className="font-semibold text-gray-900 dark:text-white">Phone</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">+251 11 123 4567</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <p className="font-semibold text-gray-900 dark:text-white">Address</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Addis Ababa, Ethiopia</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <p className="font-semibold text-gray-900 dark:text-white">Data Protection Officer</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">dpo@theaterhub.com</p>
                        </div>
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
                        <Shield className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Your privacy matters. Learn how we protect your information.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Last Updated: {lastUpdated}
                    </p>
                </motion.div>

                {/* Quick Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
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
                        By using TheaterHUB, you consent to the collection and use of your information as described in this Privacy Policy.
                    </p>
                    <div className="flex justify-center gap-4 mt-4">
                        <Link to="/terms" className="text-sm text-teal-600 hover:underline">
                            Terms of Service
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

export default PrivacyPolicy;