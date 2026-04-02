// src/components/Booking/BookingInstructions.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Smartphone,
    Mail,
    Printer,
    Download,
    CheckCircle,
    Clock,
    Ticket,
    QrCode,
    Info,
    ChevronDown,
    ChevronUp,
    AlertCircle,
    Shield,
    Users,
    Star,
    CreditCard,
    Headphones,
    Lock,
    HelpCircle,
    Phone,
    Mail as MailIcon
} from 'lucide-react';

interface BookingInstructionsProps {
    bookingId?: string;
    showTitle?: string;
    theater?: string;
    date?: string;
    time?: string;
    seats?: string[];
    onClose?: () => void;
}

const BookingInstructions: React.FC<BookingInstructionsProps> = ({
    bookingId = 'BK-DEMO-001',
    showTitle = 'The Lion King',
    theater = 'Minskoff Theatre',
    date = '2024-12-25',
    time = '19:30',
    seats = ['A12', 'A13'],
    onClose
}) => {
    const [activeStep, setActiveStep] = useState<number | null>(0);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const steps = [
        {
            icon: Mail,
            title: 'Check Your Email',
            description: 'Your tickets are waiting in your inbox',
            instructions: [
                'Open your email inbox',
                'Look for email from TheaterHUB',
                'Check spam folder if not found within 5 minutes',
                'Save the email for quick access'
            ],
            tip: 'Tickets are sent instantly after booking confirmation'
        },
        {
            icon: QrCode,
            title: 'Show QR Code at Entrance',
            description: 'No printing needed - just show your phone!',
            instructions: [
                'Open the QR code from email or this page',
                'Increase screen brightness for easy scanning',
                'Present code to the scanner at entrance',
                'Wait for confirmation beep before entering'
            ],
            tip: 'Screenshots of QR codes also work perfectly'
        },
        {
            icon: Printer,
            title: 'Print Your Tickets (Optional)',
            description: 'Prefer a physical copy? We\'ve got you covered',
            instructions: [
                'Click the print button in your email',
                'Use standard A4 paper',
                'Ensure QR code is clearly visible',
                'Bring printed ticket to the entrance'
            ],
            tip: 'Printed tickets are accepted as backup'
        },
        {
            icon: Download,
            title: 'Save to Your Device',
            description: 'Access tickets without internet',
            instructions: [
                'Click download PDF button',
                'Save to your device storage',
                'Access tickets offline anytime',
                'Add to Apple Wallet or Google Pay'
            ],
            tip: 'Perfect for areas with poor connectivity'
        }
    ];

    const faqs = [
        {
            question: 'What time should I arrive at the theater?',
            answer: 'We recommend arriving 30-45 minutes before showtime. This allows time for parking, security checks, and finding your seats. Doors typically open 30 minutes before the performance.'
        },
        {
            question: 'What is the maximum number of tickets per booking?',
            answer: 'You can reserve up to 10 tickets per booking. For larger groups, please contact our group sales team at groups@theaterhub.com for special arrangements.'
        },
        {
            question: 'Are discounts available?',
            answer: 'Standard ticket prices apply. No discounts are offered at this time. All ticket sales are final with no refunds or exchanges.'
        },
        {
            question: 'What payment methods are accepted?',
            answer: 'We accept Chapa (Card/Bank Transfer), TeleBirr, CBE Birr, and HelloCash. All payments are processed securely through our payment partners.'
        },
        {
            question: 'Can I get a refund or exchange my tickets?',
            answer: 'All ticket sales are final. No refunds or exchanges are permitted. Please verify all details before confirming your purchase. In case of show cancellation, you will be contacted with alternative options.'
        },
        {
            question: 'How do I contact support?',
            answer: 'Our customer support team is available 24/7. Contact us at support@theaterhub.com or call +251 11 123 4567. We typically respond within 2 hours.'
        },
        {
            question: 'Can I gift tickets to someone?',
            answer: 'Yes! You can purchase tickets as gifts. The recipient will receive an email with QR codes. No name verification is required at entry.'
        },
        {
            question: 'How do I earn loyalty points?',
            answer: 'Every ticket purchase earns loyalty points automatically. Points can be redeemed for future discounts and exclusive benefits.'
        }
    ];

    const importantRules = [
        {
            icon: Users,
            title: 'Maximum 10 Tickets',
            description: 'Per booking, you can reserve up to 10 tickets only'
        },
        {
            icon: CreditCard,
            title: 'No Discounts',
            description: 'All tickets are sold at standard prices with no discounts'
        },
        {
            icon: Shield,
            title: 'No Refunds',
            description: 'All ticket sales are final. No refunds or exchanges'
        },
        {
            icon: Clock,
            title: 'Arrive Early',
            description: 'Recommended arrival: 30-45 minutes before showtime'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                        Ticket Instructions
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        How to access and use your tickets
                    </p>
                </motion.div>

                {/* Important Rules Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
                >
                    {importantRules.map((rule, index) => {
                        const Icon = rule.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 * index }}
                                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-deepTeal/10 rounded-lg">
                                        <Icon className="h-5 w-5 text-deepTeal" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{rule.title}</h3>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 pl-11">{rule.description}</p>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Booking Reference */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-5 mb-10"
                >
                    <div className="flex flex-wrap justify-between items-center gap-4">
                        <div className="flex items-center gap-4 flex-wrap">
                            <div>
                                <p className="text-xs text-gray-500">Booking ID</p>
                                <p className="font-mono font-semibold text-sm text-gray-900 dark:text-white">{bookingId}</p>
                            </div>
                            <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 hidden sm:block" />
                            <div>
                                <p className="text-xs text-gray-500">Show</p>
                                <p className="font-medium text-sm text-gray-900 dark:text-white">{showTitle}</p>
                            </div>
                            <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 hidden sm:block" />
                            <div>
                                <p className="text-xs text-gray-500">Date & Time</p>
                                <p className="font-medium text-sm text-gray-900 dark:text-white">{formatDate(date)} at {time}</p>
                            </div>
                            <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 hidden sm:block" />
                            <div>
                                <p className="text-xs text-gray-500">Seats</p>
                                <p className="font-medium text-sm text-gray-900 dark:text-white">{seats.join(', ')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                            <Clock className="h-4 w-4" />
                            <span>Arrive 30-45 min early</span>
                        </div>
                    </div>
                </motion.div>

                {/* How to Access Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-10"
                >
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                        <Smartphone className="h-5 w-5 text-deepTeal" />
                        How to Access Your Tickets
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isExpanded = activeStep === index;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 * index }}
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
                                >
                                    <button
                                        onClick={() => setActiveStep(isExpanded ? null : index)}
                                        className="w-full p-4 text-left"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-deepTeal/10 rounded-lg">
                                                <Icon className="h-4 w-4 text-deepTeal" />
                                            </div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                                                {step.title}
                                            </h3>
                                        </div>
                                        <p className="text-xs text-gray-500">{step.description}</p>
                                        <div className="flex justify-end mt-2">
                                            {isExpanded ? (
                                                <ChevronUp className="h-3 w-3 text-gray-400" />
                                            ) : (
                                                <ChevronDown className="h-3 w-3 text-gray-400" />
                                            )}
                                        </div>
                                    </button>
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: 'auto' }}
                                                exit={{ height: 0 }}
                                                className="border-t border-gray-200 dark:border-gray-700"
                                            >
                                                <div className="p-4 space-y-2 bg-gray-50 dark:bg-gray-700/30">
                                                    <ul className="space-y-1.5">
                                                        {step.instructions.map((instruction, idx) => (
                                                            <li key={idx} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                                                                <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0 mt-0.5" />
                                                                <span>{instruction}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                                        <p className="text-xs text-amber-700 dark:text-amber-300 flex items-center gap-1">
                                                            <Info className="h-3 w-3" />
                                                            <span className="font-medium">Tip:</span> {step.tip}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* FAQ Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <HelpCircle className="h-5 w-5 text-deepTeal" />
                            Frequently Asked Questions
                        </h2>
                    </div>
                    <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {faqs.map((faq, index) => (
                                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                                        className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                                    >
                                        <span className="font-medium text-gray-800 dark:text-gray-200 text-sm">{faq.question}</span>
                                        {activeFaq === index ? (
                                            <ChevronUp className="h-3 w-3 text-gray-500 flex-shrink-0" />
                                        ) : (
                                            <ChevronDown className="h-3 w-3 text-gray-500 flex-shrink-0" />
                                        )}
                                    </button>
                                    <AnimatePresence>
                                        {activeFaq === index && (
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: 'auto' }}
                                                exit={{ height: 0 }}
                                                className="border-t border-gray-200 dark:border-gray-700"
                                            >
                                                <div className="p-3 bg-gray-50 dark:bg-gray-700/30 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                                    {faq.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Support Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800"
                >
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <Headphones className="h-5 w-5 text-amber-600" />
                            <p className="text-sm text-amber-800 dark:text-amber-300">Need help? We're here 24/7</p>
                        </div>
                        <div className="flex gap-2">
                            <a href="mailto:support@theaterhub.com" className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition">
                                <MailIcon className="h-3 w-3" />
                                <span>Email</span>
                            </a>
                            <a href="tel:+251111234567" className="flex items-center gap-1 px-3 py-1.5 bg-deepTeal text-white rounded-lg text-xs hover:bg-deepTeal/80 transition">
                                <Phone className="h-3 w-3" />
                                <span>Call Support</span>
                            </a>
                        </div>
                    </div>
                </motion.div>

                {/* Close Button */}
                {onClose && (
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-deepTeal text-white rounded-lg font-medium hover:bg-deepTeal/80 transition"
                        >
                            Got it, thanks!
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingInstructions;