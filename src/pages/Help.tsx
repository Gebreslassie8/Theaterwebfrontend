import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, HelpCircle, MessageCircle, Phone, Mail,
    ChevronRight, ChevronDown, ChevronUp, BookOpen,
    Ticket, CreditCard, Smartphone, User, Shield,
    Calendar, MapPin, Clock, Star, Award, Gift,
    Headphones, FileText, Video, Download, Printer,
    QrCode, Wallet, Users, Building, Globe,
    ThumbsUp, ThumbsDown, AlertCircle, CheckCircle,
    ExternalLink, ArrowRight, Play, Pause, XCircle,
    AlertTriangle, X
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Types
interface FAQItem {
    id: number;
    question: string;
    answer: string;
    category: string;
    icon: React.ElementType;
    isWarning?: boolean;
}

interface SupportTopic {
    id: number;
    title: string;
    description: string;
    icon: React.ElementType;
    link: string;
    color: string;
}

interface Article {
    id: number;
    title: string;
    description: string;
    category: string;
    readTime: string;
    icon: React.ElementType;
}

const Help: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<'faq' | 'articles' | 'contact'>('faq');
    const [searchResults, setSearchResults] = useState<FAQItem[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);

    // FAQ Data - Removed refund and loyalty questions
    const faqs: FAQItem[] = [
        {
            id: 1,
            category: 'tickets',
            question: 'How do I book tickets online?',
            answer: 'Booking tickets is easy! Simply browse our shows, select your preferred date and time, choose your seats, and proceed to checkout. You can pay using Chapa, TeleBirr, CBE Birr, or HelloCash.',
            icon: Ticket
        },
        {
            id: 2,
            category: 'tickets',
            question: 'How do I get my tickets after booking?',
            answer: 'After successful payment, you\'ll receive an email with your e-tickets. You can also access them in your account under "My Tickets". Simply show the QR code at the venue entrance.',
            icon: QrCode
        },
        {
            id: 3,
            category: 'tickets',
            question: 'What is the maximum number of tickets per booking?',
            answer: 'You can reserve up to 10 tickets per booking. For larger groups (10+ people), please contact our group sales team at groups@theaterhub.com for special arrangements.',
            icon: Users,
            isWarning: true
        },
        {
            id: 4,
            category: 'payments',
            question: 'What payment methods do you accept?',
            answer: 'We accept multiple payment methods including: Chapa (Card/Bank Transfer), TeleBirr, CBE Birr, and HelloCash. All payments are processed securely.',
            icon: CreditCard
        },
        {
            id: 5,
            category: 'tickets',
            question: 'Are there any discounts available?',
            answer: 'No discounts are offered at this time. All tickets are sold at standard prices. Ticket prices are final and non-negotiable.',
            icon: AlertTriangle,
            isWarning: true
        },
        {
            id: 6,
            category: 'tickets',
            question: 'What is your refund policy?',
            answer: '⚠️ IMPORTANT: All ticket sales are FINAL. No refunds or exchanges are permitted under any circumstances. Please verify all details before confirming your purchase. In case of show cancellation, you will be contacted with alternative options.',
            icon: AlertCircle,
            isWarning: true
        },
        {
            id: 7,
            category: 'account',
            question: 'How do I create an account?',
            answer: 'Click "Sign Up" on the homepage, fill in your details, verify your email, and you\'re ready to start booking! You can also sign up using Google or Facebook.',
            icon: User
        },
        {
            id: 8,
            category: 'wallet',
            question: 'What is TheaterHUB Wallet?',
            answer: 'TheaterHUB Wallet is our digital wallet that allows you to store funds for quick and easy ticket purchases. You can add funds using various payment methods.',
            icon: Wallet
        },
        {
            id: 9,
            category: 'technical',
            question: 'Having trouble with the website?',
            answer: 'Clear your browser cache, try a different browser, or contact our support team at support@theaterhub.com. We\'re here to help!',
            icon: HelpCircle
        }
    ];

    // Support Topics - Removed loyalty program
    const supportTopics: SupportTopic[] = [
        {
            id: 1,
            title: 'Booking Help',
            description: 'Learn how to book tickets, select seats, and manage reservations',
            icon: Ticket,
            link: '/help/booking',
            color: 'from-deepTeal to-teal-600'
        },
        {
            id: 2,
            title: 'Payments',
            description: 'Payment methods, billing inquiries',
            icon: CreditCard,
            link: '/help/payments',
            color: 'from-deepBlue to-blue-600'
        },
        {
            id: 3,
            title: 'Account Management',
            description: 'Create account, reset password, update profile',
            icon: User,
            link: '/help/account',
            color: 'from-deepTeal to-cyan-600'
        },
        {
            id: 4,
            title: 'TheaterHUB Wallet',
            description: 'Manage your wallet, add funds, view transactions',
            icon: Wallet,
            link: '/help/wallet',
            color: 'from-deepBlue to-indigo-600'
        },
        {
            id: 5,
            title: 'Technical Support',
            description: 'Website issues, app problems, error messages',
            icon: Headphones,
            link: '/help/technical',
            color: 'from-deepBlue to-slate-600'
        }
    ];

    // Help Articles - Removed loyalty article
    const articles: Article[] = [
        {
            id: 1,
            title: 'How to Book Your First Ticket',
            description: 'A step-by-step guide to booking tickets on TheaterHUB',
            category: 'Booking',
            readTime: '3 min read',
            icon: BookOpen
        },
        {
            id: 2,
            title: 'Understanding Seat Selection',
            description: 'Learn about our interactive seat map and seat categories',
            category: 'Booking',
            readTime: '2 min read',
            icon: MapPin
        },
        {
            id: 3,
            title: 'Mobile Ticket Guide',
            description: 'How to use your mobile tickets at the venue',
            category: 'Tickets',
            readTime: '2 min read',
            icon: Smartphone
        },
        {
            id: 4,
            title: 'Venue Information',
            description: 'Find parking, accessibility, and venue policies',
            category: 'Venue',
            readTime: '3 min read',
            icon: Building
        },
        {
            id: 5,
            title: 'Gift Cards Guide',
            description: 'Purchase, send, and redeem gift cards',
            category: 'Gifts',
            readTime: '2 min read',
            icon: Gift
        }
    ];

    // Search function
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setIsSearching(query.length > 0);

        if (query.length === 0) {
            setSearchResults([]);
            return;
        }

        const results = faqs.filter(faq =>
            faq.question.toLowerCase().includes(query.toLowerCase()) ||
            faq.answer.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(results);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setIsSearching(false);
    };

    const filteredFAQs = searchQuery.length > 0
        ? searchResults
        : faqs.filter(faq => activeCategory === 'all' || faq.category === activeCategory);

    const categories = ['all', 'tickets', 'payments', 'account', 'wallet', 'technical'];

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
                            <HelpCircle className="h-5 w-5" />
                            <span className="text-sm font-medium">Help Center</span>
                        </motion.div>

                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
                        >
                            How can we help you?
                        </motion.h1>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-white/90 mb-8"
                        >
                            Find answers, get support, and learn more about TheaterHUB
                        </motion.p>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="relative max-w-2xl mx-auto"
                        >
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search for answers, articles, and guides..."
                                className="w-full pl-12 pr-12 py-4 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 bg-white shadow-lg"
                            />
                            {searchQuery && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                >
                                    <XCircle className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                </button>
                            )}
                        </motion.div>

                        {/* Search Results Count */}
                        {isSearching && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 text-sm text-white/80"
                            >
                                Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Important Notice Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800"
                >
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-red-800 dark:text-red-300">⚠️ Important Policy</p>
                            <p className="text-sm text-red-700 dark:text-red-400">All ticket sales are final. No refunds, exchanges, or discounts are available. Maximum 10 tickets per booking.</p>
                        </div>
                    </div>
                </motion.div>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {[
                        { id: 'faq', label: 'FAQs', icon: HelpCircle },
                        { id: 'articles', label: 'Articles', icon: BookOpen },
                        { id: 'contact', label: 'Contact Us', icon: MessageCircle }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-deepTeal to-deepBlue text-white shadow-lg shadow-deepTeal/30'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            <tab.icon className="h-5 w-5" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* FAQs Tab */}
                {activeTab === 'faq' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* Category Filters */}
                        <div className="flex flex-wrap gap-2 justify-center">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category
                                        ? 'bg-gradient-to-r from-deepTeal to-deepBlue text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                >
                                    {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* FAQ Items */}
                        <div className="space-y-4">
                            {filteredFAQs.map((faq, index) => (
                                <motion.div
                                    key={faq.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow ${faq.isWarning
                                            ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                                            : 'bg-white border-gray-200'
                                        }`}
                                >
                                    <button
                                        onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                                        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-opacity-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg ${faq.isWarning ? 'bg-red-100 dark:bg-red-900/30' : 'bg-deepTeal/10'}`}>
                                                <faq.icon className={`h-5 w-5 ${faq.isWarning ? 'text-red-600' : 'text-deepTeal'}`} />
                                            </div>
                                            <span className={`font-semibold ${faq.isWarning ? 'text-red-800 dark:text-red-300' : 'text-gray-900'}`}>
                                                {faq.question}
                                            </span>
                                        </div>
                                        {openFAQ === faq.id ? (
                                            <ChevronUp className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <ChevronDown className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                    <AnimatePresence>
                                        {openFAQ === faq.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="px-6 pb-5"
                                            >
                                                <div className={`pl-12 border-l-2 ${faq.isWarning ? 'border-red-300 dark:border-red-700' : 'border-deepTeal/30'}`}>
                                                    <p className={`leading-relaxed ${faq.isWarning ? 'text-red-700 dark:text-red-400' : 'text-gray-600'}`}>
                                                        {faq.answer}
                                                    </p>
                                                    {faq.isWarning && (
                                                        <button className="mt-3 text-sm text-red-600 hover:underline flex items-center gap-1">
                                                            Learn more <ArrowRight className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>

                        {filteredFAQs.length === 0 && (
                            <div className="text-center py-12">
                                <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                                <p className="text-gray-500">Try different keywords or browse our articles</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Articles Tab */}
                {activeTab === 'articles' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {articles.map((article, index) => (
                                <motion.div
                                    key={article.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                                >
                                    <div className="p-3 rounded-xl bg-deepTeal/10 w-fit mb-4 group-hover:scale-110 transition-transform">
                                        <article.icon className="h-6 w-6 text-deepTeal" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-deepTeal transition-colors">
                                        {article.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4">{article.description}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <BookOpen className="h-3 w-3" />
                                            <span>{article.readTime}</span>
                                        </div>
                                        <button className="text-deepTeal text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                            Read Article <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Popular Topics */}
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Topics</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {supportTopics.map((topic) => (
                                    <Link
                                        key={topic.id}
                                        to={topic.link}
                                        className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all group"
                                    >
                                        <div className={`p-2 rounded-lg bg-gradient-to-r ${topic.color}`}>
                                            <topic.icon className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 group-hover:text-deepTeal transition-colors">
                                                {topic.title}
                                            </h3>
                                            <p className="text-xs text-gray-500">{topic.description}</p>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Contact Tab */}
                {activeTab === 'contact' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
                            <div className="text-center mb-8">
                                <div className="p-4 rounded-full bg-gradient-to-r from-deepTeal to-deepBlue w-fit mx-auto mb-4">
                                    <Headphones className="h-12 w-12 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">We're here to help!</h2>
                                <p className="text-gray-600">Choose your preferred way to contact us</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="p-6 bg-gray-50 rounded-2xl text-center hover:bg-deepTeal/5 transition-colors group">
                                    <div className="p-3 rounded-xl bg-deepTeal/10 w-fit mx-auto mb-4">
                                        <Mail className="h-6 w-6 text-deepTeal" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
                                    <p className="text-sm text-gray-600 mb-4">Get a response within 24 hours</p>
                                    <a href="mailto:support@theaterhub.com" className="text-deepTeal font-medium hover:underline">
                                        support@theaterhub.com
                                    </a>
                                </div>

                                <div className="p-6 bg-gray-50 rounded-2xl text-center hover:bg-deepTeal/5 transition-colors group">
                                    <div className="p-3 rounded-xl bg-deepTeal/10 w-fit mx-auto mb-4">
                                        <Phone className="h-6 w-6 text-deepTeal" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
                                    <p className="text-sm text-gray-600 mb-4">Mon-Fri, 9 AM - 6 PM</p>
                                    <a href="tel:+251911234567" className="text-deepTeal font-medium hover:underline">
                                        +251 911 234 567
                                    </a>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div className="border-t border-gray-200 pt-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Send us a message</h3>
                                <form className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Your Name"
                                            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deepTeal focus:border-transparent outline-none"
                                        />
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deepTeal focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deepTeal focus:border-transparent outline-none">
                                        <option>Select Category</option>
                                        <option>Booking Issues</option>
                                        <option>Payment Problems</option>
                                        <option>Account Questions</option>
                                        <option>Technical Support</option>
                                        <option>Other</option>
                                    </select>
                                    <textarea
                                        rows={5}
                                        placeholder="Describe your issue..."
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deepTeal focus:border-transparent outline-none resize-none"
                                    />
                                    <button className="w-full bg-gradient-to-r from-deepTeal to-deepBlue text-white py-3 rounded-xl font-medium hover:from-teal-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                                        Send Message
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* FAQ Callout */}
                        <div className="mt-8 text-center">
                            <p className="text-gray-600">
                                Can't find what you're looking for?
                                <button
                                    onClick={() => setActiveTab('faq')}
                                    className="text-deepTeal hover:underline ml-1 font-medium"
                                >
                                    Browse our FAQs
                                </button>
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Help;